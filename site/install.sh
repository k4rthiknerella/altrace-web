#!/bin/sh
# Altrace Agent Install Script
# https://altrace.io
#
# Installs the Altrace agent on Linux (Debian/Ubuntu, RHEL/CentOS) and macOS.
# Designed for one-line installation:
#
#   ALTRACE_TOKEN="sk-..." sh -c "$(curl -fsSL https://altrace.io/install.sh)"
#
# Author: Karthik Nerella
# Version: 1.0.0

set -e

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

INSTALLER_VERSION="1.0.0"
GITHUB_ORG="altrace-dev-role"
GITHUB_REPO="altrace-agent"
BINARY_NAME="altrace"
HOMEBREW_TAP="altrace-dev/tap/altrace-agent"
GPG_KEY_URL="https://pkg.altrace.io/gpg-key.asc"
APT_REPO_URL="https://pkg.altrace.io/apt"
YUM_REPO_URL="https://pkg.altrace.io/yum"
RELEASE_BASE_URL="https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/releases"

# ---------------------------------------------------------------------------
# Color output (disabled when stdout is not a terminal)
# ---------------------------------------------------------------------------

if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    RESET='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    BOLD=''
    RESET=''
fi

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

banner() {
    printf "\n"
    printf "${CYAN}${BOLD}"
    printf "    _    _ _                       \n"
    printf "   / \\  | | |_ _ __ __ _  ___ ___ \n"
    printf "  / _ \\ | | __| '__/ _\` |/ __/ _ \\\\\n"
    printf " / ___ \\| | |_| | | (_| | (_|  __/\n"
    printf "/_/   \\_\\_|\\__|_|  \\__,_|\\___\\___|\n"
    printf "${RESET}\n"
    printf "  ${BOLD}AI Runtime Governance${RESET}  |  v${INSTALLER_VERSION}\n"
    printf "  https://altrace.io\n"
    printf "\n"
}

info() {
    printf "${BLUE}* %s${RESET}\n" "$1"
}

success() {
    printf "${GREEN}* %s${RESET}\n" "$1"
}

warn() {
    printf "${YELLOW}! %s${RESET}\n" "$1"
}

error() {
    printf "${RED}ERROR: %s${RESET}\n" "$1" >&2
}

fatal() {
    error "$1"
    exit 1
}

# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Determine whether we need sudo for a given directory.
need_sudo() {
    if [ "$(id -u)" -eq 0 ]; then
        echo ""
    elif command_exists sudo; then
        echo "sudo"
    else
        fatal "This script requires root privileges. Please run as root or install sudo."
    fi
}

# Fetch the latest release tag from GitHub (e.g., "v0.3.1").
get_latest_version() {
    local url="${RELEASE_BASE_URL}/latest"
    if command_exists curl; then
        curl -fsSL -o /dev/null -w '%{url_effective}' "$url" 2>/dev/null | rev | cut -d'/' -f1 | rev
    elif command_exists wget; then
        wget -qO /dev/null --max-redirect=0 "$url" 2>&1 | grep -i 'Location' | sed 's/.*\///'
    else
        fatal "Neither curl nor wget found. Please install one and retry."
    fi
}

# Download a file to a destination.
download() {
    local url="$1"
    local dest="$2"
    if command_exists curl; then
        curl -fsSL -o "$dest" "$url"
    elif command_exists wget; then
        wget -qO "$dest" "$url"
    else
        fatal "Neither curl nor wget found. Please install one and retry."
    fi
}

# ---------------------------------------------------------------------------
# OS / architecture detection
# ---------------------------------------------------------------------------

detect_os() {
    OS_TYPE="$(uname -s)"
    case "${OS_TYPE}" in
        Linux)  OS="linux" ;;
        Darwin) OS="darwin" ;;
        *)      fatal "Unsupported operating system: ${OS_TYPE}" ;;
    esac
}

detect_arch() {
    ARCH_RAW="$(uname -m)"
    case "${ARCH_RAW}" in
        x86_64|amd64)   ARCH="amd64" ;;
        aarch64|arm64)   ARCH="arm64" ;;
        *)               fatal "Unsupported architecture: ${ARCH_RAW}" ;;
    esac
}

detect_distro() {
    DISTRO=""
    DISTRO_FAMILY=""

    if [ "${OS}" = "darwin" ]; then
        DISTRO="macos"
        DISTRO_FAMILY="macos"
        return
    fi

    # Try /etc/os-release first (systemd standard).
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO="${ID}"
        DISTRO_FAMILY="${ID_LIKE:-${ID}}"
    elif [ -f /etc/redhat-release ]; then
        DISTRO="rhel"
        DISTRO_FAMILY="rhel"
    elif [ -f /etc/debian_version ]; then
        DISTRO="debian"
        DISTRO_FAMILY="debian"
    elif command_exists lsb_release; then
        DISTRO="$(lsb_release -si 2>/dev/null | tr '[:upper:]' '[:lower:]')"
        DISTRO_FAMILY="${DISTRO}"
    fi

    if [ -z "${DISTRO}" ]; then
        warn "Could not detect Linux distribution. Falling back to direct binary install."
        DISTRO="unknown"
        DISTRO_FAMILY="unknown"
    fi
}

# Classify distro into a package-manager family.
# Returns: "apt", "yum", "brew", or "binary"
get_install_method() {
    case "${DISTRO_FAMILY}" in
        macos)
            if command_exists brew; then
                echo "brew"
            else
                echo "binary"
            fi
            ;;
        *debian*|*ubuntu*)
            echo "apt"
            ;;
        *rhel*|*centos*|*fedora*|*amzn*|*amazon*)
            echo "yum"
            ;;
        *)
            echo "binary"
            ;;
    esac
}

# ---------------------------------------------------------------------------
# Validate environment
# ---------------------------------------------------------------------------

validate_env() {
    if [ -z "${ALTRACE_TOKEN}" ]; then
        error "ALTRACE_TOKEN is required."
        printf "\n"
        printf "  Usage:\n"
        printf "    ${BOLD}ALTRACE_TOKEN=\"sk-...\" sh -c \"\$(curl -fsSL https://altrace.io/install.sh)\"${RESET}\n"
        printf "\n"
        printf "  Get your token at: https://altrace.io/console\n"
        printf "\n"
        exit 1
    fi

    # Validate token format (must start with sk-).
    case "${ALTRACE_TOKEN}" in
        sk-*) ;;
        *)
            fatal "ALTRACE_TOKEN must start with 'sk-'. Check your token and try again."
            ;;
    esac

    # Validate mode if provided.
    ALTRACE_MODE="${ALTRACE_MODE:-proxy}"
    case "${ALTRACE_MODE}" in
        proxy|sidecar|local) ;;
        *)
            fatal "ALTRACE_MODE must be one of: proxy, sidecar, local (got: ${ALTRACE_MODE})"
            ;;
    esac

    # Optional vars with defaults.
    ALTRACE_HUB_URL="${ALTRACE_HUB_URL:-}"
    ALTRACE_TEAM="${ALTRACE_TEAM:-}"
}

# ---------------------------------------------------------------------------
# Install methods
# ---------------------------------------------------------------------------

install_brew() {
    info "Installing via Homebrew..."

    # Ensure the tap is added.
    if ! brew tap | grep -q "altrace-dev/tap" 2>/dev/null; then
        brew tap altrace-dev/tap
    fi

    brew install "${HOMEBREW_TAP}"
    success "Installed via Homebrew."
}

install_apt() {
    local sudo_cmd
    sudo_cmd="$(need_sudo)"

    info "Setting up APT repository..."

    # Install prerequisites.
    $sudo_cmd apt-get update -qq
    $sudo_cmd apt-get install -y -qq apt-transport-https ca-certificates curl gnupg >/dev/null

    # Import GPG key.
    info "Importing Altrace GPG key..."
    $sudo_cmd mkdir -p /usr/share/keyrings
    download "${GPG_KEY_URL}" - | $sudo_cmd gpg --dearmor -o /usr/share/keyrings/altrace-archive-keyring.gpg 2>/dev/null

    # Add repository.
    info "Adding Altrace APT repository..."
    echo "deb [signed-by=/usr/share/keyrings/altrace-archive-keyring.gpg] ${APT_REPO_URL} stable main" | \
        $sudo_cmd tee /etc/apt/sources.list.d/altrace.list >/dev/null

    # Install.
    $sudo_cmd apt-get update -qq
    $sudo_cmd apt-get install -y -qq altrace-agent
    success "Installed via APT."
}

install_yum() {
    local sudo_cmd
    sudo_cmd="$(need_sudo)"

    info "Setting up YUM repository..."

    # Import GPG key.
    info "Importing Altrace GPG key..."
    $sudo_cmd rpm --import "${GPG_KEY_URL}" 2>/dev/null

    # Add repository.
    info "Adding Altrace YUM repository..."
    $sudo_cmd tee /etc/yum.repos.d/altrace.repo >/dev/null <<REPO
[altrace]
name=Altrace Repository
baseurl=${YUM_REPO_URL}/\$basearch
enabled=1
gpgcheck=1
gpgkey=${GPG_KEY_URL}
REPO

    # Install.
    if command_exists dnf; then
        $sudo_cmd dnf install -y altrace-agent
    else
        $sudo_cmd yum install -y altrace-agent
    fi
    success "Installed via YUM."
}

install_binary() {
    local sudo_cmd version archive_name archive_url tmp_dir

    info "Installing via direct binary download..."

    version="$(get_latest_version)"
    if [ -z "${version}" ]; then
        fatal "Could not determine latest release version. Check network connectivity and try again."
    fi

    # Strip leading "v" for archive name (GoReleaser convention: altrace_0.3.1_linux_amd64.tar.gz).
    local version_bare
    version_bare="$(echo "${version}" | sed 's/^v//')"
    archive_name="altrace_${version_bare}_${OS}_${ARCH}.tar.gz"
    archive_url="${RELEASE_BASE_URL}/download/${version}/${archive_name}"

    info "Downloading ${BINARY_NAME} ${version} for ${OS}/${ARCH}..."

    tmp_dir="$(mktemp -d)"
    trap 'rm -rf "${tmp_dir}"' EXIT

    download "${archive_url}" "${tmp_dir}/${archive_name}"

    # Verify the download is a valid gzip archive.
    if ! gzip -t "${tmp_dir}/${archive_name}" 2>/dev/null; then
        fatal "Downloaded file is not a valid archive. The release may not exist for ${OS}/${ARCH}."
    fi

    # Extract.
    tar -xzf "${tmp_dir}/${archive_name}" -C "${tmp_dir}"

    if [ ! -f "${tmp_dir}/${BINARY_NAME}" ]; then
        fatal "Binary '${BINARY_NAME}' not found in archive. Extraction may have failed."
    fi

    # Install binary.
    if [ "${OS}" = "darwin" ]; then
        local install_dir="/usr/local/bin"
        mkdir -p "${install_dir}"
        cp "${tmp_dir}/${BINARY_NAME}" "${install_dir}/${BINARY_NAME}"
        chmod +x "${install_dir}/${BINARY_NAME}"
    else
        sudo_cmd="$(need_sudo)"
        $sudo_cmd cp "${tmp_dir}/${BINARY_NAME}" /usr/local/bin/${BINARY_NAME}
        $sudo_cmd chmod +x /usr/local/bin/${BINARY_NAME}
    fi

    rm -rf "${tmp_dir}"
    # Clear the EXIT trap since we already cleaned up.
    trap - EXIT

    success "Installed ${BINARY_NAME} ${version} to /usr/local/bin/${BINARY_NAME}."
}

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

write_config() {
    local config_dir config_file sudo_cmd=""

    if [ "${OS}" = "darwin" ]; then
        config_dir="${HOME}/.altrace"
    else
        config_dir="/etc/altrace"
        sudo_cmd="$(need_sudo)"
    fi

    # Do not overwrite existing config.
    config_file="${config_dir}/altrace.yaml"
    if [ -f "${config_file}" ]; then
        warn "Configuration already exists at ${config_file} -- preserving."
        info "To reconfigure, edit ${config_file} or delete it and rerun this script."
        return
    fi

    info "Writing configuration to ${config_file}..."

    $sudo_cmd mkdir -p "${config_dir}"

    # Build the hub_url line (omit if empty).
    local hub_url_line=""
    if [ -n "${ALTRACE_HUB_URL}" ]; then
        hub_url_line="hub_url: \"${ALTRACE_HUB_URL}\""
    else
        hub_url_line="# hub_url: \"https://hub.altrace.io\"  # Uncomment to connect to Altrace Hub"
    fi

    # Build the team line (omit if empty).
    local team_line=""
    if [ -n "${ALTRACE_TEAM}" ]; then
        team_line="team: \"${ALTRACE_TEAM}\""
    else
        team_line="# team: \"\"  # Uncomment and set your team name"
    fi

    $sudo_cmd tee "${config_file}" >/dev/null <<CONFIG
# Altrace Agent Configuration
# Generated by install.sh v${INSTALLER_VERSION} on $(date -u '+%Y-%m-%dT%H:%M:%SZ')
# Documentation: https://altrace.io/console-docs

# Authentication token (required).
token: "${ALTRACE_TOKEN}"

# Altrace Hub URL for centralized governance.
${hub_url_line}

# Team attribution for cost tracking and policy scoping.
${team_line}

# Agent mode: proxy (transparent HTTP proxy), sidecar (Kubernetes sidecar),
# or local (local dev, no iptables enforcement).
mode: "${ALTRACE_MODE}"

# Proxy listener configuration.
proxy:
  # Address the proxy listens on for HTTP traffic.
  http_addr: "127.0.0.1:9080"
  # Address the proxy listens on for HTTPS traffic (CONNECT tunneling).
  https_addr: "127.0.0.1:9443"

# Budget enforcement defaults.
budget:
  # Enable pre-request cost estimation and budget checks.
  enabled: true
  # Safety margin for cost estimation (10% overhead).
  safety_margin: 0.10

# Logging.
log:
  level: "info"
  format: "json"
CONFIG

    # Restrict permissions on config (contains token).
    $sudo_cmd chmod 600 "${config_file}"

    success "Configuration written to ${config_file}."
}

# ---------------------------------------------------------------------------
# Post-install: systemd service (Linux only)
# ---------------------------------------------------------------------------

setup_service() {
    if [ "${OS}" != "linux" ]; then
        return
    fi

    # Only set up systemd service for package-manager installs.
    # Binary installs leave service management to the user.
    local install_method="$1"
    if [ "${install_method}" = "binary" ]; then
        return
    fi

    local sudo_cmd
    sudo_cmd="$(need_sudo)"

    if command_exists systemctl; then
        info "Enabling altrace-agent systemd service..."
        $sudo_cmd systemctl daemon-reload 2>/dev/null || true
        $sudo_cmd systemctl enable altrace-agent 2>/dev/null || true
        $sudo_cmd systemctl start altrace-agent 2>/dev/null || true
        success "Service started."
    fi
}

# ---------------------------------------------------------------------------
# Post-install summary
# ---------------------------------------------------------------------------

print_next_steps() {
    local install_method="$1"
    local config_file

    if [ "${OS}" = "darwin" ]; then
        config_file="${HOME}/.altrace/altrace.yaml"
    else
        config_file="/etc/altrace/altrace.yaml"
    fi

    printf "\n"
    printf "${GREEN}${BOLD}  Installation complete.${RESET}\n"
    printf "\n"
    printf "  ${BOLD}Configuration:${RESET}  ${config_file}\n"
    printf "  ${BOLD}Agent mode:${RESET}     ${ALTRACE_MODE}\n"

    if [ -n "${ALTRACE_HUB_URL}" ]; then
        printf "  ${BOLD}Hub URL:${RESET}        ${ALTRACE_HUB_URL}\n"
    fi

    if [ -n "${ALTRACE_TEAM}" ]; then
        printf "  ${BOLD}Team:${RESET}           ${ALTRACE_TEAM}\n"
    fi

    printf "\n"
    printf "  ${BOLD}Next steps:${RESET}\n"
    printf "\n"

    if [ "${OS}" = "darwin" ]; then
        if [ "${install_method}" = "brew" ]; then
            printf "    1. Review config:       ${CYAN}cat ${config_file}${RESET}\n"
            printf "    2. Start the agent:     ${CYAN}brew services start altrace-agent${RESET}\n"
            printf "    3. Verify it's running: ${CYAN}altrace status${RESET}\n"
        else
            printf "    1. Review config:       ${CYAN}cat ${config_file}${RESET}\n"
            printf "    2. Start the agent:     ${CYAN}altrace run${RESET}\n"
            printf "    3. Verify it's running: ${CYAN}altrace status${RESET}\n"
        fi
    else
        if [ "${install_method}" = "binary" ]; then
            printf "    1. Review config:       ${CYAN}cat ${config_file}${RESET}\n"
            printf "    2. Start the agent:     ${CYAN}sudo altrace run${RESET}\n"
            printf "    3. Verify it's running: ${CYAN}altrace status${RESET}\n"
        else
            printf "    1. Review config:       ${CYAN}sudo cat ${config_file}${RESET}\n"
            printf "    2. Check service:       ${CYAN}sudo systemctl status altrace-agent${RESET}\n"
            printf "    3. View logs:           ${CYAN}sudo journalctl -u altrace-agent -f${RESET}\n"
        fi
    fi

    printf "\n"
    printf "  ${BOLD}Test your setup:${RESET}\n"
    printf "\n"
    printf "    ${CYAN}curl -x http://127.0.0.1:9080 https://api.openai.com/v1/models${RESET}\n"
    printf "\n"
    printf "  ${BOLD}Documentation:${RESET}   https://altrace.io/console-docs\n"
    printf "  ${BOLD}Dashboard:${RESET}       https://altrace.io/console\n"
    printf "  ${BOLD}Support:${RESET}         support@altrace.io\n"
    printf "\n"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
    banner

    # Pre-flight checks.
    info "Installer version ${INSTALLER_VERSION}"
    info "Detecting environment..."

    detect_os
    detect_arch
    detect_distro

    info "OS: ${OS} | Arch: ${ARCH} | Distro: ${DISTRO}"

    validate_env

    info "Token: ${ALTRACE_TOKEN%"${ALTRACE_TOKEN#sk-????}"}****"
    info "Mode: ${ALTRACE_MODE}"

    # Determine install method.
    local install_method
    install_method="$(get_install_method)"
    info "Install method: ${install_method}"

    printf "\n"

    # Install the agent.
    case "${install_method}" in
        brew)   install_brew   ;;
        apt)    install_apt    ;;
        yum)    install_yum    ;;
        binary) install_binary ;;
        *)      fatal "No supported install method for this system." ;;
    esac

    # Write configuration.
    write_config

    # Start the service (Linux package installs only).
    setup_service "${install_method}"

    # Done.
    print_next_steps "${install_method}"
}

# Wrap everything in main() so that a partially downloaded script doesn't execute
# incomplete code. This is the Datadog/Homebrew safety pattern.
main
