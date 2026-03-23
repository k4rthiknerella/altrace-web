# Altrace Cloud Platform Deployment Matrix

**Author:** Karthik Nerella
**Date:** 2026-03-16
**Purpose:** Map every major cloud compute platform to determine Altrace deployment feasibility, enforcement level, and recommended deployment model.

**Key Altrace requirement:** iptables NAT REDIRECT via init container with CAP_NET_ADMIN + CAP_NET_RAW for governance-grade (kernel-level) enforcement. Without this, Altrace operates in advisory mode (application-level only, bypassable).

**Industry direction (2025-2026):** Kubernetes is migrating from iptables to nftables for kube-proxy (GA in K8s 1.33). Major distributions (RHEL 9+, Debian 10+, Ubuntu 20.04+) use nftables as the default backend. IPVS is deprecated in K8s v1.35. Cilium/eBPF is becoming the default CNI across GKE, AKS, and increasingly EKS. Altrace must plan for nftables and eBPF-based enforcement paths.

---

## Enforcement Level Definitions

| Level | Meaning | Bypass Possible? |
|-------|---------|------------------|
| **GOVERNANCE-GRADE** | iptables/nftables REDIRECT + DROP rules via init container. All port 443 egress forced through proxy. | No (kernel-enforced) |
| **ADVISORY** | Proxy works at application level. Budget/kill switch functional but applications can bypass by not using proxy env vars. | Yes |
| **GATEWAY** | External gateway model. Network firewall routes traffic to Altrace gateway on EC2/EKS. Workload itself has no sidecar. | Depends on network firewall config |
| **SDK-ONLY** | Only the Altrace Python/TS SDK can be used. No proxy, no sidecar. | Yes (app must opt in) |
| **NOT SUPPORTED** | Platform fundamentally incompatible. | N/A |

---

## Tier 1: AWS, Azure, GCP

### AWS

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **EKS (EC2 nodes)** | YES | YES | YES | AWS VPC CNI | eBPF via VPC CNI (network policy); nftables via kube-proxy 1.33+ | YES (VPC CNI eBPF) | **GOVERNANCE-GRADE** | Sidecar + init container (primary target) |
| **EKS on Fargate** | NO | YES (limited) | YES (unprivileged only) | AWS VPC CNI (awsvpc only) | NO | Limited | **GATEWAY** | Gateway on EC2/EKS + AWS Network Firewall |
| **ECS on EC2** | YES (host access) | YES (task-level) | NO (no K8s init concept) | awsvpc / bridge | Host-level iptables | Security Groups | **ADVISORY** | Sidecar container in task definition; SDK for enforcement |
| **ECS on Fargate** | NO | YES (task-level) | NO | awsvpc only | NO | Security Groups | **GATEWAY** | Gateway on EC2 + Network Firewall |
| **Lambda** | NO | NO | NO | Managed (Hyperplane ENI) | NO | Security Groups | **SDK-ONLY** | Altrace SDK in function code |
| **App Runner** | NO | NO (single container) | NO | Managed | NO | Limited | **SDK-ONLY** | Altrace SDK in application code |
| **Lightsail Containers** | NO | NO | NO | Managed (HTTPS-only endpoint) | NO | NO | **SDK-ONLY** | Altrace SDK in application code |
| **Elastic Beanstalk** | PARTIAL (EC2 host) | YES (multi-container Docker) | NO (ECS-based) | ECS networking | Host-level | Security Groups | **ADVISORY** | Sidecar container in Dockerrun.aws.json |
| **EKS Anywhere** | YES | YES | YES | Cilium or Kindnet | eBPF (Cilium) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Outposts (EKS)** | YES | YES | YES | AWS VPC CNI | Same as EKS | YES | **GOVERNANCE-GRADE** | Sidecar + init container |

**Notes:**
- EKS on EC2 is the primary AWS target. AWS VPC CNI's aws-node DaemonSet itself runs with NET_ADMIN privileges and uses iptables.
- EKS on Fargate is fundamentally restricted: no CAP_NET_ADMIN, no DaemonSets, no custom CNI plugins (Calico/Cilium unavailable). Istio sidecar injection also fails on Fargate for the same reason.
- ECS on EC2 has host-level access but no Kubernetes init container concept. Advisory mode via sidecar container in task definition.
- Lambda/App Runner/Lightsail are fully managed with no kernel access. SDK-only path.

### Azure

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **AKS** | YES | YES | YES | Azure CNI (multiple options) | eBPF via Azure CNI Powered by Cilium; nftables in preview | YES (Cilium, Calico, Azure NPM) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **ACI (Container Instances)** | NO | YES (container groups) | NO | Managed (VNet delegation) | NO | NSG only | **ADVISORY** | Sidecar in container group; SDK for enforcement |
| **Container Apps** | NO | YES (sidecar containers) | NO (Dapr sidecars, not K8s init) | Managed (built on K8s but no API access) | NO | Managed ingress rules | **ADVISORY** | Sidecar container; SDK for enforcement |
| **App Service** | NO | YES (multi-container) | NO | Managed | NO | VNet integration | **SDK-ONLY** | Altrace SDK in application code |
| **Azure Functions** | NO | NO (Container Apps hosting available) | NO | Managed | NO | VNet integration | **SDK-ONLY** | Altrace SDK in function code |
| **ARO (Azure Red Hat OpenShift)** | YES | YES | YES | OVN-Kubernetes | nftables backend (RHEL 8+) | YES (OVN-K8s native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Azure Arc (K8s)** | YES (depends on underlying cluster) | YES | YES | Underlying cluster CNI | Depends on cluster | YES | **GOVERNANCE-GRADE** | Sidecar + init container (on connected cluster) |
| **Azure Stack HCI (AKS-HCI)** | YES | YES | YES | Calico | iptables/nftables | YES | **GOVERNANCE-GRADE** | Sidecar + init container |

**Notes:**
- AKS is the primary Azure target. Azure CNI Powered by Cilium delivers ~30% higher throughput than standalone Cilium. Multiple CNI options available: Azure CNI, Azure CNI Overlay, Azure CNI Powered by Cilium, kubenet (deprecated 2028), BYOCNI.
- Azure NPM (Network Policy Manager) is being deprecated: Windows support ends Sept 2026, Linux support ends Sept 2028. Cilium is the recommended replacement.
- ACI does not allow privileged containers. Container groups share a network namespace (like K8s pods), so a sidecar pattern works for advisory-mode proxy.
- Container Apps is built on Kubernetes but does not expose the K8s API. No init containers, no privileged access.
- ARO uses OVN-Kubernetes as default CNI since v4.11, with nftables as the backend on RHEL 8+.

### GCP

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **GKE Standard** | YES | YES | YES | GKE Dataplane V2 (Cilium) | eBPF (Cilium); nftables support | YES (Cilium native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **GKE Autopilot** | NO (not in default allowlist) | YES | YES (unprivileged) | GKE Dataplane V2 (Cilium) | eBPF (managed) | YES (Cilium native) | **GATEWAY** | Gateway on GKE Standard; or apply for partner allowlist |
| **Cloud Run** | NO | YES (multi-container) | NO | Managed (namespace isolation) | NO | Managed ingress | **ADVISORY** | Sidecar container (advisory); SDK for enforcement |
| **Cloud Functions** | NO | NO | NO | Managed | NO | VPC connectors | **SDK-ONLY** | Altrace SDK in function code |
| **App Engine** | NO | NO | NO | Managed | NO | Firewall rules | **SDK-ONLY** | Altrace SDK in application code |
| **GKE on AWS** | YES | YES | YES | Underlying infrastructure CNI | eBPF available | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **GKE on Azure** | YES | YES | YES | Underlying infrastructure CNI | eBPF available | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Anthos (on-prem)** | YES | YES | YES | Cluster CNI (configurable) | Depends on cluster | YES | **GOVERNANCE-GRADE** | Sidecar + init container |

**Notes:**
- GKE Standard is the primary GCP target. GKE Dataplane V2 (Cilium-based, eBPF) is the default for new clusters and replaces kube-proxy iptables with eBPF-based service routing.
- GKE Autopilot explicitly blocks CAP_NET_ADMIN. Allowed capabilities: SETPCAP, MKNOD, AUDIT_WRITE, CHOWN, NET_RAW, DAC_OVERRIDE, FOWNER, FSETID, KILL, SETGID, SETUID, NET_BIND_SERVICE, SYS_CHROOT, SETFCAP. Partner allowlist available but requires Google approval.
- Cloud Run supports sidecar containers sharing localhost networking. No privileged mode. Advisory proxy possible.
- Cloud Run and Cloud Functions both inherit sandbox restrictions -- no equivalent to Docker --privileged.

---

## Tier 2: Oracle, IBM, Alibaba, Tencent, Huawei

### Oracle Cloud (OCI)

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **OKE (Kubernetes)** | YES | YES | YES | OCI VCN-Native CNI or Flannel | iptables (kube-proxy); Cilium available | YES (with VCN-Native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Container Instances** | UNCLEAR (likely restricted) | YES (multi-container) | NO | Managed (VCN integration) | NO | Security lists | **ADVISORY** | Sidecar container; SDK for enforcement |
| **Functions** | NO | NO | NO | Managed | NO | VCN rules | **SDK-ONLY** | Altrace SDK in function code |

**Notes:**
- OKE supports two CNI plugins: OCI VCN-Native Pod Networking (gives pods VCN IP addresses directly) and Flannel overlay. Service mesh products (OCI Service Mesh, Istio, Linkerd) are supported.
- Cilium is available as a third-party CNI on OKE.
- Container Instances documentation does not explicitly confirm or deny CAP_NET_ADMIN. Classified as advisory pending verification.

### IBM Cloud

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **IKS (Kubernetes)** | YES | YES | YES | Calico | eBPF (Calico); iptables | YES (Calico native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Red Hat OpenShift on IBM Cloud** | YES | YES | YES | OVN-Kubernetes or Calico | nftables (OVN); eBPF (Calico) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Code Engine** | NO | NO | NO | Managed (serverless) | NO | Managed | **SDK-ONLY** | Altrace SDK in application code |
| **Satellite** | YES (depends on infra) | YES | YES | Cluster CNI | Depends on infra | YES | **GOVERNANCE-GRADE** | Sidecar + init container (on connected cluster) |

**Notes:**
- IBM IKS runs tens of thousands of production clusters on Calico CNI. Full Kubernetes feature set including privileged init containers.
- Code Engine is fully managed serverless. No kernel access, no sidecar support for proxy patterns.
- Satellite extends IBM Cloud services to any infrastructure (on-prem, other clouds). Enforcement depends on underlying host capabilities.

### Alibaba Cloud

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **ACK (Kubernetes)** | YES | YES | YES | Terway or Flannel | eBPF (Terway); iptables | YES (Terway native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **ECI (Elastic Container Instance)** | NO (default); YES (via securityContext) | YES | YES (in ACK virtual nodes) | Managed | NO | VPC security groups | **ADVISORY** | Sidecar + SDK; NET_ADMIN grantable via security context |
| **FC (Function Compute)** | NO | NO | NO | Managed | NO | VPC rules | **SDK-ONLY** | Altrace SDK in function code |
| **SAE (Serverless App Engine)** | NO | NO | NO | Managed (VPC/NAT gateway) | NO | VPC rules | **SDK-ONLY** | Altrace SDK in application code |

**Notes:**
- ACK offers two CNI plugins: Terway (Alibaba-developed, ENI-based, eBPF-accelerated) and Flannel (community, VPC route-based). Terway is recommended for production.
- Alibaba Cloud chose Cilium internally to boost networking scalability at massive scale.
- ECI containers do NOT have NET_ADMIN by default, but it CAN be granted via securityContext configuration. This is a unique middle ground -- potentially governance-grade if NET_ADMIN is explicitly granted.

### Tencent Cloud

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **TKE (Kubernetes)** | YES | YES | YES | Global Router CNI (Tencent) | iptables (kube-proxy) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **TKE Serverless** | NO (likely) | YES | Limited | Managed | NO | Managed | **ADVISORY** | Sidecar container; SDK for enforcement |
| **SCF (Function Compute)** | NO | NO | NO | Managed | NO | VPC rules | **SDK-ONLY** | Altrace SDK in function code |

**Notes:**
- TKE uses a Tencent-developed Global Router CNI with iptables-based kube-proxy for service routing.
- TKE Serverless runs pods as independent compute/network instances. Specific capability restrictions not publicly documented but likely follows Fargate-like model.

### Huawei Cloud

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **CCE (Kubernetes)** | YES | YES | YES | Canal, Yangtse, or Tunnel | iptables/IPVS (kube-proxy) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **CCI (Container Instances)** | NO | YES | Limited | Managed (Kata isolation) | NO | VPC rules | **ADVISORY** | Sidecar container; SDK for enforcement |
| **FunctionGraph** | NO | NO | NO | Managed | NO | VPC rules | **SDK-ONLY** | Altrace SDK in function code |

**Notes:**
- CCE supports both iptables and IPVS forwarding modes for kube-proxy.
- CCI explicitly does NOT support privileged mode. Uses Kata hypervisor for container isolation (hardware-level isolation). Fine-grained permissions via securityContext recommended instead.

---

## Tier 3: Specialized / Smaller Providers

### Managed Kubernetes Providers

| Platform | CAP_NET_ADMIN | Default CNI | eBPF/nftables | Enforcement Level | Recommended Model |
|----------|--------------|-------------|---------------|-------------------|-------------------|
| **DigitalOcean DOKS** | YES | Cilium | eBPF (Cilium native) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Linode/Akamai LKE** | YES | Calico (standard) / Cilium (enterprise) | eBPF (Cilium enterprise) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Vultr VKE** | YES | Calico | iptables | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Hetzner (k3s/kubeadm)** | YES | Cilium or Calico (user choice) | eBPF (Cilium) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **OVHcloud Managed K8s** | YES | Canal (Calico + Flannel) | iptables/eBPF (Calico) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Scaleway Kapsule** | YES | Cilium or Calico | eBPF (Cilium) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Civo** | YES | Cilium (k3s-based) | eBPF (Cilium) | **GOVERNANCE-GRADE** | Sidecar + init container |

**Notes:**
- All managed Kubernetes providers with standard worker nodes support CAP_NET_ADMIN via init containers. This is a fundamental Kubernetes capability on real nodes.
- DOKS uses Cilium as default CNI with VPC-native networking (K8s 1.31+, eBPF kube-proxy replacement).
- Civo is k3s-based with Cilium CNI option. Lightweight but full Kubernetes feature set.
- Hetzner does not offer managed Kubernetes -- users self-manage via k3s, kubeadm, or Cluster API (CAPH). Full control over node configuration.

### PaaS / Serverless Platforms

| Platform | CAP_NET_ADMIN | Sidecars | Enforcement Level | Recommended Model |
|----------|--------------|----------|-------------------|-------------------|
| **Fly.io (Machines)** | PARTIAL (Firecracker VM has root, but iptables may not work) | NO (single container per Machine) | **ADVISORY** | SDK in application; HTTP_PROXY env var |
| **Railway** | NO | NO | **SDK-ONLY** | Altrace SDK in application code |
| **Render** | NO | NO | **SDK-ONLY** | Altrace SDK in application code |
| **Vercel** | NO | NO | **SDK-ONLY** | Altrace SDK in function/edge code |
| **Netlify** | NO | NO | **SDK-ONLY** | Altrace SDK in function code |
| **DigitalOcean App Platform** | NO | NO | **SDK-ONLY** | Altrace SDK in application code |
| **DigitalOcean Functions** | NO | NO | **SDK-ONLY** | Altrace SDK in function code |

**Notes:**
- Fly.io runs Firecracker microVMs with full root privileges, but users report iptables-dependent applications encounter capability issues. Classified as advisory pending deeper testing.
- Railway runs long-lived containers (no cold starts) but no kernel access or sidecar support. Good candidate for SDK-only with HTTP_PROXY.
- Vercel/Netlify/Render are frontend-focused PaaS. AI workloads would typically call LLM APIs from edge/serverless functions. SDK-only path.

---

## On-Premises / Hybrid

| Platform | CAP_NET_ADMIN | Sidecars | Init Containers | Default CNI | nftables/eBPF | Network Policy | Enforcement Level | Recommended Model |
|----------|--------------|----------|-----------------|-------------|---------------|----------------|-------------------|-------------------|
| **Bare Metal K8s (kubeadm)** | YES | YES | YES | User choice (Calico, Cilium, Flannel, etc.) | Full control | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **k3s** | YES | YES | YES | Flannel (default); Cilium optional | nftables (preferred backend); eBPF (Cilium) | YES (kube-router or Cilium) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **microk8s** | YES | YES | YES | Calico (default); Cilium optional | eBPF (Cilium) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **kind** | YES | YES | YES | kindnet (default); Calico/Cilium optional | iptables | YES (with CNI swap) | **GOVERNANCE-GRADE** | Sidecar + init container (dev/test) |
| **Red Hat OpenShift** | YES | YES | YES | OVN-Kubernetes | nftables (RHEL 8+ backend) | YES (OVN native) | **GOVERNANCE-GRADE** | Sidecar + init container; operator for enterprise |
| **VMware Tanzu** | YES | YES | YES | Antrea (default); Calico optional | OVS-based (Antrea) | YES (Antrea NetworkPolicy) | **GOVERNANCE-GRADE** | Sidecar + init container |
| **Rancher/SUSE (RKE2)** | YES | YES | YES | Canal (default); Calico/Cilium optional | eBPF (Cilium) | YES | **GOVERNANCE-GRADE** | Sidecar + init container |
| **HashiCorp Nomad** | YES (bridge mode with iptables) | YES (Consul Connect sidecar) | NO (no K8s init concept) | CNI plugins (bridge, portmap, firewall) | iptables (bridge mode) | Consul intentions | **ADVISORY** | Sidecar via Nomad job spec; limited compared to K8s |
| **Docker Swarm** | YES (cap_add: NET_ADMIN since 20.10) | YES (service-level) | NO | Overlay/ingress | iptables | NO (no NetworkPolicy equivalent) | **ADVISORY** | Sidecar service; limited enforcement |

**Notes:**
- All standard Kubernetes distributions (kubeadm, k3s, microk8s, RKE2, OpenShift, Tanzu) support governance-grade enforcement. They run on real Linux nodes with full kernel access.
- k3s uses iptables (nftables backend preferred) and supports both Flannel and Cilium CNI.
- OpenShift uses OVN-Kubernetes since v4.11, with OVS (Open vSwitch) for packet forwarding. RHEL 8+ translates iptables commands to nftables in the backend.
- Nomad supports iptables via bridge networking mode with CNI plugins. Sidecars work via Consul Connect. No init container concept -- limited enforcement model.
- Docker Swarm added CAP_NET_ADMIN support in docker-ce 20.10. Advisory mode because no network policy enforcement equivalent.
- Antrea (VMware Tanzu default CNI) is OVS-based and provides NetworkPolicy enforcement. Supports Calico as alternative.

---

## Summary: Governance-Grade Platform Count

| Category | Governance-Grade | Advisory | Gateway | SDK-Only |
|----------|-----------------|----------|---------|----------|
| **AWS** | 3 (EKS EC2, EKS Anywhere, Outposts) | 2 (ECS EC2, Beanstalk) | 2 (EKS Fargate, ECS Fargate) | 3 (Lambda, App Runner, Lightsail) |
| **Azure** | 4 (AKS, ARO, Arc, Stack HCI) | 2 (ACI, Container Apps) | 0 | 2 (App Service, Functions) |
| **GCP** | 4 (GKE Standard, GKE on AWS, GKE on Azure, Anthos on-prem) | 1 (Cloud Run) | 1 (GKE Autopilot) | 2 (Cloud Functions, App Engine) |
| **Tier 2 K8s** | 5 (OKE, IKS, OpenShift IBM, ACK, TKE, CCE) | 4 (OCI CI, ECI, TKE Serverless, CCI) | 0 | 5 (all FaaS offerings) |
| **Tier 3 K8s** | 7 (DOKS, LKE, VKE, Hetzner, OVH, Scaleway, Civo) | 1 (Fly.io) | 0 | 5 (Railway, Render, Vercel, Netlify, DO App Platform) |
| **On-Prem/Hybrid** | 7 (kubeadm, k3s, microk8s, kind, OpenShift, Tanzu, Rancher) | 2 (Nomad, Docker Swarm) | 0 | 0 |
| **TOTAL** | **~30** | **~12** | **~3** | **~17** |

---

## Strategic Implications for Altrace

### 1. iptables to nftables Migration (CRITICAL)

Kubernetes kube-proxy nftables mode is GA in K8s 1.33. IPVS deprecated in v1.35. RHEL 9 has deprecated iptables entirely, likely removed in RHEL 10. Red Hat OpenShift already uses nftables as the backend.

**Action required:** Altrace init container scripts must support both iptables and nftables backends. The iptables command-line tool on nftables-based systems translates to nftables rules automatically (iptables-nft compatibility layer), so current scripts likely work BUT should be tested on RHEL 9/10 and Ubuntu 22.04+ nodes.

**Risk:** If a future Linux distribution removes the iptables compatibility layer entirely, Altrace init scripts break. Plan for native nftables rule generation.

### 2. eBPF/Cilium as Default CNI

GKE Dataplane V2 (Cilium) is default for new clusters. AKS offers Azure CNI Powered by Cilium. DOKS defaults to Cilium. Alibaba ACK uses Terway with eBPF.

**Action required:** Verify Altrace iptables REDIRECT rules do not conflict with Cilium's eBPF datapath. Cilium replaces kube-proxy's iptables rules but typically preserves custom iptables chains. The ALTRACE_REDIRECT and ALTRACE_FILTER chains should not conflict since they operate in different hook points than Cilium.

**Opportunity:** Consider a future eBPF-based enforcement mode (Altrace CNI plugin or eBPF program) that integrates natively with Cilium. This would eliminate the init container requirement and work on GKE Autopilot.

### 3. Serverless/FaaS is SDK-Only

Lambda, Cloud Functions, Azure Functions, and all FaaS platforms are SDK-only. No kernel access, no sidecar injection. This makes the Altrace Python SDK and planned TypeScript SDK the critical path for serverless governance.

**Action required:** Prioritize TypeScript SDK (P0-3). Most Lambda/Cloud Function AI workloads are Node.js or Python. The SDK must handle budget pre-check, kill switch polling, and cost tracking at the application layer.

### 4. GKE Autopilot and Fargate Require Gateway Model

Both GKE Autopilot and AWS Fargate explicitly block CAP_NET_ADMIN. The gateway model (traffic routed through external Altrace proxy via network firewall) is the only enforcement path.

**Action required:** The altrace-gateway binary (Wave 25, hub-sync worker mode) needs its ingress HTTP listener to serve as a standalone enforcement gateway for these platforms. See audit note in CLAUDE.md section 3.3.

### 5. Helm Chart is Portable Across All Managed K8s

Every managed Kubernetes provider that supports standard worker nodes (EKS, AKS, GKE Standard, OKE, IKS, ACK, TKE, CCE, DOKS, LKE, VKE, OVH, Scaleway, Civo) supports the Altrace Helm chart with init containers. The ~30 governance-grade platforms all share the same deployment model.

**Action required:** Test Helm chart on top 5 providers (EKS, AKS, GKE, DOKS, OKE) to verify CNI compatibility. Document any CNI-specific configuration (e.g., Cilium eBPF host routing mode).

---

## CNI Compatibility Matrix

| CNI | iptables REDIRECT Compatible | Notes |
|-----|------------------------------|-------|
| **AWS VPC CNI** | YES | aws-node uses iptables/NET_ADMIN natively |
| **Azure CNI** | YES | Standard iptables-based |
| **Azure CNI Powered by Cilium** | YES (verify) | eBPF replaces kube-proxy but custom iptables chains preserved |
| **GKE Dataplane V2 (Cilium)** | YES (verify) | eBPF dataplane; iptables available on node |
| **Calico (iptables mode)** | YES | Standard iptables |
| **Calico (eBPF mode)** | YES (verify) | eBPF replaces kube-proxy iptables |
| **Cilium** | YES (verify) | eBPF dataplane; iptables still available on node |
| **Flannel** | YES | Simple overlay, iptables for routing |
| **OVN-Kubernetes** | YES | OVS-based but iptables available on node (nftables backend on RHEL) |
| **Antrea (VMware)** | YES | OVS-based; iptables available on node |
| **Terway (Alibaba)** | YES | ENI-based with eBPF; iptables available |
| **Canal (Calico + Flannel)** | YES | Standard iptables |
| **kindnet** | YES | Minimal CNI; iptables available |
| **OCI VCN-Native** | YES | VCN-integrated; iptables on node |

**Key insight:** All CNI plugins operate at the pod networking layer (L3/L4 routing between pods and services). Altrace's iptables rules operate at the node network namespace level (NAT REDIRECT on port 443 output). These are complementary, not conflicting. The ALTRACE_REDIRECT chain in the NAT table and ALTRACE_FILTER chain in the filter table should coexist with any CNI's rules.

**Verification needed:** Explicit testing on Cilium eBPF host routing mode, which bypasses the host network stack. If eBPF host routing is enabled, it may skip iptables processing entirely for pod-to-external traffic. This is the highest-risk compatibility scenario.

---

## Sources

- [AWS EKS VPC CNI Best Practices](https://docs.aws.amazon.com/eks/latest/best-practices/vpc-cni.html)
- [AWS Fargate Security Considerations](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html)
- [Azure AKS CNI Overview](https://learn.microsoft.com/en-us/azure/aks/concepts-network-cni-overview)
- [Azure CNI Powered by Cilium](https://learn.microsoft.com/en-us/azure/aks/azure-cni-powered-by-cilium)
- [Azure Container Instances Overview](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview)
- [Azure Red Hat OpenShift OVN-Kubernetes](https://learn.microsoft.com/en-us/azure/openshift/concepts-ovn-kubernetes)
- [GKE Dataplane V2 (Cilium)](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/dataplane-v2)
- [GKE Autopilot Security Measures](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/autopilot-security)
- [GKE Network Interface: From kubenet to eBPF/Cilium](https://cloud.google.com/blog/products/networking/gke-network-interface-from-kubenet-to-ebpfcilium-to-dranet)
- [Cloud Run Container Contract](https://docs.cloud.google.com/run/docs/container-contract)
- [Cloud Run Multi-Container Deployments](https://cloud.google.com/blog/products/serverless/cloud-run-now-supports-multi-container-deployments)
- [Oracle OKE Pod Networking](https://docs.oracle.com/en-us/iaas/Content/ContEng/Concepts/contengpodnetworking.htm)
- [IBM Kubernetes with Calico (Tigera Case Study)](https://www.tigera.io/blog/ibms-journey-to-tens-of-thousands-of-production-kubernetes-clusters/)
- [Alibaba Cloud ACK CNI Comparison (Terway vs Flannel)](https://www.alibabacloud.com/help/en/ack/ack-managed-and-ack-dedicated/user-guide/comparison-between-terway-and-flannel)
- [Alibaba Cloud chose Cilium (CNCF Case Study)](https://www.cncf.io/case-studies/alibaba/)
- [Alibaba ECI Security Context](https://www.alibabacloud.com/help/en/eci/user-guide/configure-a-security-context-for-a-pod-or-container)
- [Huawei CCE iptables vs IPVS](https://support.huaweicloud.com/intl/en-us/usermanual-cce/cce_10_0349.html)
- [Huawei CCI Privileged Mode FAQ](https://support.huaweicloud.com/intl/en-us/cci_faq/cci_faq_0044.html)
- [Tencent TKE Security Groups](https://www.tencentcloud.com/document/product/457/9084)
- [Kubernetes nftables kube-proxy (Official Blog)](https://kubernetes.io/blog/2025/02/28/nftables-kube-proxy/)
- [IPVS to nftables Migration Guide (Calico/Tigera)](https://www.tigera.io/blog/from-ipvs-to-nftables-a-migration-guide-for-kubernetes-v1-35/)
- [AKS nftables Preview](https://blog.aks.azure.com/2025/11/19/nftables-in-kube-proxy)
- [AKS nftables with Calico](https://techcommunity.microsoft.com/blog/appsonazureblog/beyond-iptables-scaling-aks-networking-with-nftables-and-project-calico/4494467)
- [DigitalOcean DOKS Cilium Network Policies](https://www.digitalocean.com/community/tutorials/doks-cilium-network-policies-observability)
- [DigitalOcean DOKS Networking Reimagined](https://www.digitalocean.com/blog/digitalocean-doks-managed-kubernetes-networking)
- [EKS Anywhere CNI Options](https://anywhere.eks.amazonaws.com/docs/getting-started/optional/cni/)
- [EKS Fargate Sidecar Support Issue](https://github.com/aws/containers-roadmap/issues/682)
- [Fly.io Privileged Containers Forum](https://community.fly.io/t/does-fly-io-support-privileged-containers/15848)
- [Fly.io Architecture](https://fly.io/docs/reference/architecture/)
- [HashiCorp Nomad CNI](https://developer.hashicorp.com/nomad/docs/networking/cni)
- [HashiCorp Nomad Networking](https://developer.hashicorp.com/nomad/docs/networking)
- [K3s Requirements (iptables/nftables)](https://docs.k3s.io/installation/requirements)
- [OVHcloud Kubernetes Plugins](https://support.us.ovhcloud.com/hc/en-us/articles/13622149428627-Kubernetes-plugins-CNI-CRI-CSI-software-versions-and-reserved-resources)
- [Scaleway Kapsule](https://www.scaleway.com/en/kubernetes-kapsule/)
- [VMware Antrea CNI](https://antrea.io/)
- [Istio CNI Node Agent](https://istio.io/latest/docs/setup/additional-setup/cni/)
- [Cilium Documentation](https://docs.cilium.io/en/stable/)
- [Vultr VKE Reference Guide](https://www.vultr.com/docs/vultr-kubernetes-engine/)
- [AWS Lambda Limits](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- [AWS App Runner FAQs](https://aws.amazon.com/apprunner/faqs/)
- [Azure Container Apps on Arc](https://learn.microsoft.com/en-us/azure/container-apps/azure-arc-overview)
- [Docker Swarm CAP_NET_ADMIN Support](https://github.com/portainer/portainer/issues/4684)
