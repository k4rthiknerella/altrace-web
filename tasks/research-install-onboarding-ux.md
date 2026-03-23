# Research: Installation & Onboarding UX -- Datadog and Competitors

**Date**: 2026-03-16
**Purpose**: Strategic research to shape Altrace's install and onboarding experience

---

## 1. Datadog: Exact Install Flow (Sign-Up to First Data)

### The One-Liner

```bash
DD_API_KEY=<your_key> DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"
```

### What the Script Actually Does (Step by Step)

The install script ([source on GitHub](https://github.com/DataDog/agent-linux-install-script)) performs these operations:

1. **OS/Distro Detection**: Detects whether the host is Debian/Ubuntu (APT) or RHEL/CentOS/SUSE (YUM/DNF) based
2. **Dependency Installation**: Installs `apt-transport-https`, `curl`, `gnupg` as prerequisites
3. **Repository Setup**:
   - APT: Adds `apt.datadoghq.com` to sources, imports GPG signing key
   - YUM: Creates `/etc/yum.repos.d/datadog.repo` with `yum.datadoghq.com`, configures `gpgcheck`, `repo_gpgcheck`, and `gpgkey`
4. **Package Installation**: Runs `apt-get install datadog-agent` or `yum install datadog-agent`
5. **Configuration Injection**: Uses `sed` to replace the placeholder `api_key` value in `/etc/datadog-agent/datadog.yaml` with the actual `DD_API_KEY`
6. **Optional Tags**: If `DD_TAGS` is set (comma-separated `key:value`), writes them into the YAML config
7. **Agent Auto-Start**: Starts the agent service and enables it on boot (`systemctl enable datadog-agent`)

### Environment Variables Accepted

| Variable | Required | Purpose |
|----------|----------|---------|
| `DD_API_KEY` | Yes (unless DD_UPGRADE) | Authentication to Datadog intake |
| `DD_SITE` | No (default: datadoghq.com) | Datadog region endpoint |
| `DD_TAGS` | No | Host tags (e.g., `team:infra,env:prod`) |
| `DD_AGENT_MAJOR_VERSION` | No | Pin major version (6 or 7) |
| `DD_UPGRADE` | No | Upgrade existing installation |

### What Gets Auto-Collected (Zero Configuration)

Once the agent starts, it immediately collects these system metrics every 10-15 seconds:

- **CPU**: `system.cpu.user`, `system.cpu.system`, `system.cpu.idle`, core count
- **Memory**: `system.mem.used`, `system.mem.free`, `system.mem.total`
- **Disk**: `system.disk.used`, `system.disk.free`, `system.fs.inodes.*`
- **I/O**: `system.io.r_s`, `system.io.w_s`
- **Network**: `system.net.bytes_sent`, `system.net.bytes_rcvd`
- **Load**: `system.load.1`, `system.load.5`, `system.load.15`
- **Swap**: `system.swap.used`, `system.swap.free`
- **Uptime**: `system.uptime`

All metrics automatically tagged with `host:<hostname>`.

### Cloud Provider Auto-Detection

The agent automatically queries metadata endpoints for:
- **AWS EC2**: Instance ID, region, availability zone, instance type, AMI, account ID (uses IMDSv2 by default since v7.64.0)
- **GCP**: Instance name, project, zone, machine type
- **Azure**: VM name, resource group, subscription, location
- **Also**: Alibaba, Tencent, Oracle Cloud, IBM Cloud

These cloud attributes are attached as tags to every metric without any user configuration.

### Time to First Data: ~10-15 minutes from sign-up

1. Create account (~2 min)
2. Copy one-liner from UI (~30 sec)
3. Run on host (~2-3 min for install)
4. Agent starts collecting immediately
5. Data appears in Infrastructure List within "a few minutes"

### Platform-Specific Install Commands

- **macOS**: DMG installer or via Homebrew cask (`datadog-agent`), installs to `/opt/datadog-agent`
- **Windows**: MSI installer (`datadog-agent-7-latest.amd64.msi`), GUI wizard with API key prompt, or silent: `msiexec /passive /i <MSI_URL> APIKEY=<key>`
- **Docker**: `docker run -d --name dd-agent -e DD_API_KEY=<key> -e DD_SITE="datadoghq.com" -v /var/run/docker.sock:/var/run/docker.sock:ro -v /proc/:/host/proc/:ro -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro gcr.io/datadoghq/agent:7`

---

## 2. Datadog Onboarding Wizard (Web UI)

### Post-Sign-Up Flow

1. **Organization Setup**: Prompted to name organization, add team members
2. **Platform Selection**: UI presents platform choices (Linux, Windows, macOS, Docker, Kubernetes, cloud-managed)
3. **Install Command Generation**: Displays pre-filled one-liner with user's API key embedded -- copy/paste ready
4. **"Waiting for Data"**: Default dashboards are shown but empty. The Infrastructure List and Map views exist but show no hosts until agent reports in
5. **First Data Arrival**: Hosts appear in Infrastructure List within minutes. System metrics auto-populate the default Host Dashboard

### Fleet Automation (Newer Onboarding Path)

Datadog now offers Fleet Automation as an in-app workflow to install, upgrade, configure, and troubleshoot agents:
- Guided, step-by-step setup for installing agents on new hosts
- Copy and run the installation command directly from the UI
- Works for both single hosts and fleet-wide deployment
- No need to access hosts directly for configuration changes

### Agentic Onboarding (Preview, 2025+)

For RUM Browser monitoring, Datadog introduced AI-guided setup that:
- Detects your project's framework automatically
- Adds the RUM SDK with a single prompt
- Zero manual configuration for supported frameworks

### Key UX Pattern: The "Is It Working?" Moment

Datadog handles this by:
- Showing the Infrastructure List that auto-populates when data arrives
- Default dashboards that light up with system metrics
- No explicit "waiting" spinner -- the empty-to-populated transition IS the confirmation
- Agent status command (`datadog-agent status`) for CLI verification

---

## 3. Datadog Configuration UX: Web UI vs YAML vs Env Vars

### Three Configuration Layers

| Method | Use Case | Precedence |
|--------|----------|------------|
| **Environment Variables** | Containers, CI/CD, quick overrides | Highest (overrides YAML) |
| **datadog.yaml** | Host-based deployments, full control | Medium |
| **Web UI (Fleet Automation)** | Remote fleet management, integration setup | Depends on Remote Config |

### What's Configurable via Web UI (Fleet Automation + Remote Configuration)

Since Datadog Agent v7.66+, Remote Configuration enables:
- **Product feature toggles**: Enable/disable Cloud Security, NPM, Live Processes
- **Integration setup**: Redis, Apache, NGINX via guided UI workflows with required parameters and defaults
- **Agent upgrades**: Centralized version management across fleet
- **Configuration standards**: Push consistent config across entire infrastructure
- **Advanced YAML editor**: For code-driven teams, with syntax validation and semantic checks
- **Phased rollouts**: Deploy config changes to a subset first, then expand

### What Requires YAML or Env Vars (Not UI-Configurable)

- Initial API key configuration
- Custom check development
- Advanced proxy settings
- Log processing pipelines (local)
- Fine-grained trace sampling rules
- Process monitoring target configuration

### Environment Variable Mapping

Not all `datadog.yaml` options have env var equivalents. Only options with `config.BindEnv*` in the source code support env vars. Key ones:
- `DD_API_KEY`, `DD_SITE`, `DD_TAGS`
- `DD_LOGS_ENABLED`, `DD_APM_ENABLED`
- `DD_PROCESS_AGENT_ENABLED`
- `DD_ENV`, `DD_SERVICE`, `DD_VERSION` (Unified Service Tagging)

### Key Insight for Altrace

Datadog's evolution: Started YAML-only, added env vars for containers, then built Remote Configuration for web UI control. The trend is toward more web UI control, less YAML editing. But they kept YAML as the escape hatch for power users.

---

## 4. Datadog Kubernetes: Helm Chart and Auto-Discovery

### Minimal Helm Install (3 Commands)

```bash
# 1. Add Helm repo
helm repo add datadog https://helm.datadoghq.com

# 2. Create secret
kubectl create secret generic datadog-secret \
  --from-literal api-key=$DD_API_KEY \
  --from-literal app-key=$DD_APP_KEY

# 3. Install
helm install datadog datadog/datadog \
  --set datadog.apiKeyExistingSecret=datadog-secret \
  --set datadog.appKeyExistingSecret=datadog-secret
```

Or even simpler (single command, inline key):

```bash
helm install datadog --set datadog.apiKey=$DD_API_KEY datadog/datadog
```

### Minimal values.yaml

```yaml
datadog:
  apiKeyExistingSecret: datadog-secret
  appKeyExistingSecret: datadog-secret
  site: datadoghq.com  # optional, default
```

That is it. Two fields required: `apiKey` (or `apiKeyExistingSecret`) and optionally `site`.

### What's Enabled by Default

- **Cluster Agent**: Enabled by default since Helm chart v2.7.0
- **RBAC**: Automatically configures necessary ClusterRole/ClusterRoleBinding
- **Inter-agent auth**: Auto-generates random token in a Secret for Cluster Agent <-> Node Agent communication
- **System metrics**: CPU, memory, disk, network on every node
- **Kubernetes metrics**: Pod, deployment, service, node status

### Datadog Operator Alternative

```yaml
# datadog-agent.yaml (DatadogAgent CRD)
apiVersion: datadoghq.com/v2alpha1
kind: DatadogAgent
metadata:
  name: datadog
spec:
  global:
    credentials:
      apiSecret:
        secretName: datadog-secret
        keyName: api-key
      appSecret:
        secretName: datadog-secret
        keyName: app-key
```

### Auto-Discovery: How It Works

1. **Container Detection**: When a new container starts, the Agent identifies what services are running inside it
2. **Template Matching**: Looks for matching monitoring configuration templates
3. **Auto-Collection**: Starts collecting metrics automatically

### Auto-Configured Integrations (Zero Config Required)

These services are detected and monitored automatically via `auto_conf.yaml` templates when discovered as containers:

| Integration | What's Auto-Detected |
|-------------|---------------------|
| Apache | HTTP server metrics |
| Redis | Cache metrics, connections |
| Consul | Service mesh metrics |
| CoreDNS | DNS query metrics |
| CouchDB | Database metrics |
| Etcd | Cluster metrics |
| Elasticsearch | Index, search, JVM metrics |
| Kubernetes State | Pod, deployment, node state |
| KubeDNS | DNS resolution metrics |
| Memcached | Cache hit/miss, connections |
| Tomcat | JMX-based app server metrics |
| Couchbase | Bucket and cluster metrics |
| Kyoto Tycoon | Key-value store metrics |
| Riak | Distributed database metrics |
| Istio | Service mesh telemetry |

### Custom Service Configuration via Annotations

For services not in the auto-config list:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    ad.datadoghq.com/postgres.check_names: '["postgres"]'
    ad.datadoghq.com/postgres.init_configs: '[{}]'
    ad.datadoghq.com/postgres.instances: |
      [{
        "host": "%%host%%",
        "port": "5432",
        "username": "datadog",
        "password": "%%env_PG_PASSWORD%%"
      }]
```

### Configuration Precedence

Kubernetes annotations > auto-configuration > Operator/Helm values

---

## 5. Datadog Python SDK Integration (ddtrace)

### Zero-Code-Change Setup

```bash
# Install
pip install ddtrace

# Run your app with auto-instrumentation (zero code changes)
DD_SERVICE=myapp DD_ENV=prod DD_VERSION=1.0 ddtrace-run python app.py
```

**Lines of code to change: ZERO.** Just prefix your start command with `ddtrace-run`.

### Alternative: One Import

```python
import ddtrace.auto  # Add this as first import
# ... rest of your app unchanged
```

**Lines of code: ONE.**

### What Auto-Instruments (70+ integrations)

**Auto-enabled (no config needed, just `ddtrace-run`):**

| Category | Libraries |
|----------|-----------|
| Web Frameworks | Django, Flask, FastAPI, Starlette, Falcon |
| HTTP Clients | requests, httpx, aiohttp |
| Databases | psycopg (PostgreSQL), pymysql, pymongo |
| Caching | Redis, Memcached |
| Search | Elasticsearch |
| Task Queues | Celery |
| AWS | botocore, boto, aiobotocore |
| Messaging | Kafka (confluent-kafka) |
| Logging | Python logging module |
| Testing | pytest |
| Async | asyncio |

**Manual-only (requires explicit `patch()`):**
- LLM providers: Anthropic, OpenAI, LangChain, CrewAI
- gRPC, Kombu, MariaDB, PyODBC, some others

### Unified Service Tagging

Three env vars to connect traces, logs, and metrics:
- `DD_SERVICE` -- service name
- `DD_ENV` -- environment (prod, staging, dev)
- `DD_VERSION` -- application version

### Verification

```bash
ddtrace-run --info  # Validates config + agent connectivity
```

### Key Insight for Altrace

The `ddtrace-run` wrapper pattern is brilliant: zero code changes, just modify the start command. Altrace could adopt this for its Python SDK -- wrap the LLM call entry point with a command prefix rather than requiring code changes.

---

## 6. Competitors Who Nail "Zero to Working"

### Sentry: The Gold Standard for Error Monitoring Onboarding

**Setup: 4 lines of code.**

```python
import sentry_sdk
sentry_sdk.init(
    dsn="https://examplePublicKey@o0.ingest.sentry.io/0",
)
```

**What makes it great:**
- **Setup Wizard CLI**: `npx @sentry/wizard@latest -i nextjs` auto-detects framework, injects config, adds source maps
- **Instant Verification**: After init, trigger `1/0` -- error appears in dashboard within seconds
- **50+ auto-enabled integrations** -- Django, Flask, FastAPI, Celery, Redis, SQLAlchemy all traced automatically
- **DSN is the only config** -- one string contains everything needed
- **Framework auto-detection** -- SDK detects Django/Flask/etc. and enables appropriate integration automatically

**Lesson for Altrace**: The wizard CLI that auto-detects your stack and injects configuration is powerful. One string (DSN) to authenticate. Instant verification with a deliberate test error.

### Vercel: Zero-Config Deployment

**Flow: Push code, get URL.**

- `git push` triggers automatic build + deploy
- Framework auto-detection (Next.js, Remix, Nuxt, SvelteKit, etc.)
- Preview URLs on every PR
- Zero configuration files needed for most frameworks
- Dashboard shows deployment status in real-time
- First Meaningful Paint of dashboard optimized (decreased by 1.2s)

**What makes it great:**
- No config file to learn, no CLI to install for basic flow
- Git-based workflow matches how developers already work
- Progressive disclosure: zero-config works, but you CAN add `vercel.json` for advanced needs
- Starter kits and GitHub templates for common use cases

**Lesson for Altrace**: Git-based workflow. No config file for the happy path. Progressive disclosure of complexity.

### PostHog: Developer-First Analytics

**Setup: One snippet, auto-captures everything.**

1. Install package
2. Initialize with project API key (pre-filled in their UI)
3. Paste snippet before `</head>`
4. Automatically captures `$pageview`, button clicks, form submissions

**What makes it great:**
- Snippet is pre-filled with your project's API key in the dashboard -- just copy/paste
- Auto-capture means you get data before deciding what to track
- Cross-product onboarding: session replays, feature flags, A/B tests all from same snippet
- Single source of truth: onboarding docs shared between in-app flow and website

**Lesson for Altrace**: Pre-fill credentials in the copy-paste snippet. Auto-capture by default. Let users see value before they configure anything.

### Stripe: The API Experience Benchmark

**Philosophy: "A feature isn't shipped until its docs are written."**

- Working API response within minutes
- Progressive disclosure: simple APIs for beginners, advanced config for enterprise
- Error messages include embedded links to relevant docs AND request logs
- Parameter spell-checking: `"Did you mean email?"` in error responses
- Stripe CLI for local webhook testing
- VS Code extension for inline development

**Key techniques:**
- Interactive integration builders that teach concepts while showing executable code
- Request logs for inspectability -- see exactly what you sent and what came back
- Integration Insights: AI-powered recommendations analyzing request errors
- Friction logging: Stripe teams dogfood their own APIs and document friction points

**Lesson for Altrace**: Error messages that link to docs. Request/response inspectability. Dogfood your own setup flow.

### LaunchDarkly: CLI-First Feature Flags

**Setup: 5-step flow.**

1. Install SDK via package manager
2. Initialize client
3. Configure credentials
4. Evaluate flags
5. Shutdown gracefully

**What makes it great:**
- **CLI Setup Command**: `ld setup` -- guided, step-by-step, creates a flag, installs SDK, toggles flag -- all without browser
- **20+ SDKs** across languages
- **Offline evaluation**: SDK caches flag state locally, works without network
- **Vercel integration**: Zero-latency client-side flags, auto-syncs API keys

**Lesson for Altrace**: CLI-first onboarding that doesn't require the browser. Offline-capable SDK (graceful degradation).

### Railway: The New Heroku

**Flow: Connect GitHub, deploy in under a minute.**

- No configuration file to learn
- No CLI to install
- No infrastructure decisions
- Framework auto-detection + auto-build
- Template ecosystem for one-click deploys
- Dashboard described as "one of the best in the industry -- clean, fast, genuinely pleasant"

**Lesson for Altrace**: Template ecosystem. One-click getting-started templates for common scenarios (e.g., "Altrace + FastAPI + OpenAI" template).

### Grafana Cloud: Guided Integration Tiles

- Sign up for free account
- Choose integration from a tile grid
- Each tile provides: binary download, pre-built config, connection parameters
- Alloy (their agent) auto-configures for OpenTelemetry + Prometheus

**Lesson for Altrace**: Integration tile grid as a visual onboarding pattern.

---

## 7. Making Install Scripts Trustworthy

### The Core Problem with `curl | bash`

1. **Interrupted downloads**: `rm -rf /$TMP_DIR` cut at `rm -rf /` executes catastrophically
2. **No review opportunity**: Code executes before you can read it
3. **Server-side detection**: Servers can detect curl-piping and serve different (malicious) content
4. **Man-in-the-middle**: Without HTTPS, content can be tampered in transit

### How Companies Handle Trust

#### Datadog's Approach
- **HTTPS only** for script download
- **GPG-signed packages**: The install script adds Datadog's GPG key and configures `gpgcheck` + `repo_gpgcheck` in the repo config
- **Script is open source**: [Full source on GitHub](https://github.com/DataDog/agent-linux-install-script) -- anyone can audit
- **The script itself doesn't run arbitrary code** -- it installs a package from a signed repository

#### HashiCorp's Approach (Gold Standard for Verification)
Three-step verification:
1. **Import PGP public key**: `curl https://www.hashicorp.com/.well-known/pgp-key.txt | gpg --import`
2. **Verify checksum signature**: `gpg --verify terraform_SHA256SUMS.sig terraform_SHA256SUMS`
3. **Verify binary checksum**: `shasum -a 256 -c terraform_SHA256SUMS`

Known fingerprint: `798A EC65 4E5C 1542 8C8E 42EE AA16 FCBC A621 E701`

#### Sigstore/sget Approach (Modern)
- `sget` retrieves artifacts from OCI registries with mandatory verification
- SHA256 content checking, digital signatures, immutable content-addressed digests
- Transparency log (Rekor) provides public, append-only audit trail
- "curl | bash isn't a great idea, but sget | bash is slightly less-bad"

### Best Practices for Altrace Install Scripts

1. **Function wrapping**: Wrap entire script in a function called at the end -- incomplete downloads define functions but never execute them
2. **HTTPS mandatory**: Never serve install scripts over HTTP
3. **Checksum publication**: Publish SHA256 checksums on a separate channel (different account/domain)
4. **Open source the script**: Put it in a public GitHub repo with full git history
5. **GPG sign releases**: Sign binary releases, provide verification instructions
6. **Continuous monitoring**: Automated systems that download and verify scripts against expected checksums
7. **Package manager preference**: Where possible, use OS package managers (apt, yum, brew) which have their own signature verification
8. **Two-step alternative**: Offer `curl -O` then `bash` as an alternative to piping

### Recommended Altrace Install Pattern

```bash
# Option 1: One-liner (convenience)
ALTRACE_TOKEN=xxx bash -c "$(curl -fsSL https://install.altrace.dev/agent.sh)"

# Option 2: Download-then-verify (security-conscious)
curl -fsSL https://install.altrace.dev/agent.sh -o install.sh
curl -fsSL https://install.altrace.dev/agent.sh.sha256 -o install.sh.sha256
sha256sum -c install.sh.sha256
ALTRACE_TOKEN=xxx bash install.sh

# Option 3: Package manager (preferred for production)
# macOS
brew install altrace-dev/tap/altrace-agent

# Debian/Ubuntu
curl -fsSL https://pkg.altrace.dev/gpg | sudo gpg --dearmor -o /usr/share/keyrings/altrace.gpg
echo "deb [signed-by=/usr/share/keyrings/altrace.gpg] https://pkg.altrace.dev/apt stable main" | sudo tee /etc/apt/sources.list.d/altrace.list
sudo apt update && sudo apt install altrace-agent

# RHEL/CentOS
sudo rpm --import https://pkg.altrace.dev/gpg
sudo yum install altrace-agent
```

---

## Strategic Takeaways for Altrace

### The "Datadog Formula" (What to Replicate)

1. **One-liner install** with API key as only required input
2. **Immediate value**: System metrics flow within minutes, no configuration needed
3. **Cloud auto-detection**: Automatically tags with cloud provider metadata
4. **Progressive complexity**: Start with zero-config, add YAML for customization, add web UI for fleet management
5. **Kubernetes auto-discovery**: Detect and monitor services without annotations for common workloads

### The "Anti-Patterns" to Avoid

1. Requiring a config file before first data arrives
2. Making users choose what to collect before seeing anything
3. "Is it working?" ambiguity -- always provide a verification command
4. Requiring browser + terminal simultaneously during setup
5. Multiple authentication steps before first value

### What Altrace Should Build (Priority Order)

1. **One-liner install**: `ALTRACE_TOKEN=xxx bash -c "$(curl -fsSL https://install.altrace.dev)"` that auto-detects OS, installs agent, starts collecting LLM API traffic
2. **Web onboarding wizard**: Platform selection -> pre-filled install command -> "waiting for first request" -> dashboard lights up
3. **`altrace status` command**: Immediate local verification (like `datadog-agent status`)
4. **Python SDK with zero-code option**: `altrace-run python app.py` wraps LLM calls automatically (like `ddtrace-run`)
5. **Kubernetes Helm chart**: `helm install altrace --set token=$ALTRACE_TOKEN altrace/altrace-agent` with auto-discovery for LLM API endpoints
6. **Fleet Automation equivalent**: Web UI for remote agent configuration (Phase 2)

### Time-to-Value Targets

| Metric | Datadog | Altrace Target |
|--------|---------|----------------|
| Sign-up to install command | ~2 min | ~1 min |
| Install to first data | ~5 min | ~3 min |
| First useful dashboard | ~10 min | ~5 min |
| First alert configured | ~30 min | ~15 min |

---

## Sources

- [Datadog Agent Linux Install Script (GitHub)](https://github.com/DataDog/agent-linux-install-script)
- [Datadog Getting Started with Agent](https://docs.datadoghq.com/getting_started/agent/)
- [Datadog Kubernetes Installation](https://docs.datadoghq.com/containers/kubernetes/installation/)
- [Datadog Helm Chart values.yaml](https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml)
- [Datadog Python Auto-Instrumentation](https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/python/)
- [ddtrace Python Integrations](https://ddtrace.readthedocs.io/en/stable/integrations.html)
- [ddtrace Quickstart](https://ddtrace.readthedocs.io/en/stable/installation_quickstart.html)
- [Datadog Fleet Automation](https://docs.datadoghq.com/agent/fleet_automation/)
- [Datadog Remote Configuration](https://docs.datadoghq.com/agent/remote_config/)
- [Datadog Fleet Automation Blog](https://www.datadoghq.com/blog/fleet-automation-agent-management/)
- [Datadog Autodiscovery Auto-Configuration](https://docs.datadoghq.com/containers/guide/auto_conf/)
- [Datadog Agent Environment Variables](https://docs.datadoghq.com/agent/guide/environment-variables/)
- [Datadog Onboarding Guide 2025](https://devopshorizon.com/how-to-onboard-datadog-step-by-step-guide-for-beginners-2025/)
- [Sentry Python SDK](https://docs.sentry.io/platforms/python/)
- [Sentry Setup Wizards](https://develop.sentry.dev/sdk/expected-features/setup-wizards/)
- [Vercel Zero Config](https://vercel.com/blog/zero-config)
- [Vercel Developer Experience Growth](https://www.reo.dev/blog/how-developer-experience-powered-vercels-200m-growth)
- [PostHog Onboarding Flow](https://pageflows.com/post/desktop-web/onboarding/posthog/)
- [PostHog Install Docs](https://posthog.com/docs/getting-started/install)
- [Stripe Developer Experience (Kenneth Auchenberg)](https://kenneth.io/post/insights-from-building-stripes-developer-platform-and-api-developer-experience-part-1)
- [LaunchDarkly CLI](https://launchdarkly.com/blog/introducing-launchdarkly-cli/)
- [LaunchDarkly SDK Setup](https://launchdarkly.com/docs/home/getting-started/setting-up)
- [Railway vs Fly.io Comparison](https://docs.railway.com/platform/compare-to-fly)
- [Trustworthy Curl Pipe Bash (Operous)](https://dev.to/operous/how-to-build-a-trustworthy-curl-pipe-bash-workflow-4bb)
- [Safer curl|bash (Sigstore)](https://blog.sigstore.dev/a-safer-curl-bash-7698c8125063/)
- [HashiCorp Binary Verification](https://developer.hashicorp.com/well-architected-framework/verify-hashicorp-binary)
- [curl|bash Security Discussion](https://www.kicksecure.com/wiki/Dev/curl_bash_pipe)
