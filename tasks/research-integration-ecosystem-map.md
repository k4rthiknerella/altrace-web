# Altrace Integration Ecosystem Map

**Research Date:** 2026-03-16
**Scope:** All potential integrations for an AI governance proxy
**Status:** Research complete, prioritized

---

## Executive Summary

This document maps every integration Altrace should support or evaluate, organized by category. Each integration is assigned a priority (P0-P3), integration type, effort estimate, and business rationale.

**Current state (altrace-agent):** Anthropic, OpenAI, Gemini provider handlers. LangChain, CrewAI, AutoGen adapters in altrace-python. No SSO, no SIEM export, no external observability integration.

**Key finding:** The ecosystem has consolidated significantly since mid-2025. MCP has 6,400+ registered servers. Microsoft merged AutoGen + Semantic Kernel into "Microsoft Agent Framework" (RC, GA Q1 2026). A2A protocol reached v0.3. OpenTelemetry GenAI semantic conventions are becoming the standard for AI observability. OpsGenie is shutting down (April 2027). Cloudflare AI Gateway covers 350+ models across 6 providers.

---

## 1. LLM Providers

### Currently Supported
| Provider | Handler | Status |
|----------|---------|--------|
| Anthropic (Claude) | `comp/proxy/anthropic/` | DONE |
| OpenAI (GPT, o-series) | `comp/proxy/openai/` | DONE (includes Responses API) |
| Google Gemini | `comp/proxy/gemini/` | DONE |

### Priority Integration Map

| Provider | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **Azure OpenAI** | **P0** | Provider handler (OpenAI-compatible, different auth + endpoints) | 1 week | Enterprise customers run OpenAI through Azure for compliance. Different auth (Azure AD tokens, API keys with deployment IDs). Top enterprise deployment path. |
| **Amazon Bedrock** | **P0** | Provider handler (SigV4 auth, different request format) | 2 weeks | AWS is dominant cloud. Bedrock uses SigV4 signing, different API surface. Enterprise requirement. AWS just partnered with Cerebras for inference. |
| **Google Vertex AI** | **P1** | Provider handler (OAuth2/ADC auth, Gemini-compatible body) | 1 week | Enterprise Google Cloud customers use Vertex, not direct Gemini API. Different auth (Application Default Credentials). |
| **Mistral AI** | **P1** | Provider handler (OpenAI-compatible) | 3 days | Growing European market. OpenAI-compatible API simplifies handler. Sovereign AI use case (data stays in EU). |
| **DeepSeek** | **P1** | Provider handler (OpenAI-compatible) | 3 days | Massive cost advantage ($0.028/M tokens with cache hits). Growing adoption for cost-sensitive workloads. OpenAI-compatible. |
| **Cohere** | **P2** | Provider handler (custom API) | 1 week | Enterprise RAG focus (Embed, Rerank APIs). Smaller market share but loyal enterprise base. |
| **xAI (Grok)** | **P2** | Provider handler (OpenAI-compatible) | 3 days | 2M token context window. Real-time X data access. OpenAI-compatible API. |
| **Groq** | **P2** | Provider handler (OpenAI-compatible) | 3 days | Fastest inference (1800+ tokens/sec). OpenAI-compatible. Specialized hardware (LPU). |
| **Together AI** | **P2** | Provider handler (OpenAI-compatible) | 3 days | Popular open-source model hosting. OpenAI-compatible. |
| **Fireworks AI** | **P2** | Provider handler (OpenAI-compatible) | 3 days | Fast open-source inference. OpenAI-compatible. |
| **Perplexity** | **P2** | Provider handler (OpenAI-compatible) | 3 days | Search-augmented generation. Growing agent API with multi-provider routing. |
| **Cerebras** | **P2** | Provider handler | 1 week | Wafer-scale inference. $10B OpenAI deal. Coming to AWS Bedrock in 2026. |
| **Anyscale** | **P3** | Provider handler (OpenAI-compatible) | 3 days | Ray-based serving. Niche. |
| **Reka AI** | **P3** | Provider handler | 1 week | Multimodal specialist. Air-gapped deployment support. Small market. |
| **Aleph Alpha** | **P3** | Provider handler | 1 week | European sovereign AI. On-prem focus. Niche but strategic for EU compliance. |
| **AI21 Labs** | **P3** | Provider handler | 1 week | Jamba models. Small market share. |
| **Inflection AI** | **P3** | Evaluate | - | Pivoted to enterprise (Pi model). Low API adoption. Monitor only. |
| **Writer AI** | **P3** | Provider handler | 1 week | Enterprise content generation. Custom models. Niche. |

### Non-Text Modality Providers (P3 - Monitor Only)
| Provider | Modality | Notes |
|----------|----------|-------|
| ElevenLabs | Voice/TTS | REST API. Governance use case: cost + usage tracking for voice agents |
| AssemblyAI | Speech-to-text | REST API. Governance use case: cost tracking |
| Stability AI | Image generation | REST API. Governance use case: content policy, cost tracking |
| Midjourney | Image generation | No public API yet. Monitor. |

### OpenAI-Compatible Shortcut
Many providers (Mistral, DeepSeek, xAI, Groq, Together, Fireworks, Perplexity, Anyscale) use OpenAI-compatible APIs. A **generic OpenAI-compatible handler** with configurable base URL + auth would cover ~10 providers with a single implementation.

**Recommendation:** Build a configurable OpenAI-compatible provider handler as P1. Estimated effort: 1 week. Covers ~10 providers immediately.

---

## 2. AI Frameworks and SDKs

### Currently Supported
| Framework | Adapter | Status |
|-----------|---------|--------|
| LangChain | `altrace-python/src/altrace/adapters/langchain.py` | DONE |
| CrewAI | `altrace-python/src/altrace/adapters/crewai.py` | DONE |
| AutoGen | `altrace-python/src/altrace/adapters/autogen.py` | DONE |

### Priority Integration Map

| Framework | Priority | Type | Effort | Rationale |
|-----------|----------|------|--------|-----------|
| **TypeScript/Node SDK** | **P0** | New SDK package | 2-3 weeks | No competitor has this. Vercel AI SDK (v6), Node.js agents, and TypeScript-first AI apps are a massive segment. First-mover advantage. |
| **Microsoft Agent Framework** | **P0** | SDK adapter (Python + .NET) | 1 week | Replaces AutoGen + Semantic Kernel. RC now, GA Q1 2026. Must migrate AutoGen adapter. .NET support is unique differentiator. |
| **OpenAI Agents SDK** | **P1** | SDK adapter (Python) | 1 week | Official OpenAI agent framework. Built-in tracing. Growing adoption. |
| **Google ADK** | **P1** | SDK adapter (Python) | 1 week | Official Google agent framework. Multimodal + A2A native. |
| **Pydantic AI** | **P1** | SDK adapter (Python) | 3-5 days | Rising fast. Type-safe agents. Vercel AI integration. Strong developer ergonomics. |
| **Vercel AI SDK** | **P1** | SDK adapter (TypeScript) | 1 week | Requires TypeScript SDK (P0). v6 just launched. Dominant in Next.js/React AI apps. |
| **LangGraph** | **P1** | SDK adapter (Python) | 3-5 days | LangChain team recommends LangGraph for production agents. Graph-based orchestration. May need separate adapter from LangChain. |
| **LlamaIndex** | **P2** | SDK adapter (Python) | 3-5 days | 5M+ monthly PyPI downloads. RAG-focused. Different integration point than LangChain. |
| **Haystack** | **P2** | SDK adapter (Python) | 3-5 days | Production-grade RAG/search. Pipeline-based architecture. deepset backing. |
| **DSPy** | **P2** | SDK adapter (Python) | 3-5 days | Stanford research framework. Eval-driven optimization. Academic + research audience. |
| **Instructor** | **P2** | SDK adapter (Python) | 2-3 days | Structured output extraction. Wraps provider clients. Lightweight integration. |
| **Magentic** | **P3** | SDK adapter (Python) | 2-3 days | Decorator-based LLM functions. Small community. |
| **Mirascope** | **P3** | SDK adapter (Python) | 2-3 days | Provider-agnostic SDK. Small but growing. |
| **Spring AI** | **P3** | SDK adapter (Java) | 2-3 weeks | Java/Spring ecosystem. Enterprise Java shops. Requires Java SDK. |
| **Anthropic Agent SDK** | **P1** | SDK adapter (Python) | 3-5 days | Anthropic's official agent SDK. Tool-use-first approach. |

### Protocol Integrations

| Protocol | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **MCP (Model Context Protocol)** | **P1** | Governance layer (proxy sits between MCP client and server) | 2-3 weeks | 6,400+ registered MCP servers. Anthropic, OpenAI, Microsoft, Google, Amazon all support it. MCP gateway mode is the natural governance insertion point. Enterprise readiness is a 2026 MCP priority. |
| **A2A (Agent-to-Agent)** | **P2** | Governance layer (intercept A2A JSON-RPC calls) | 2-3 weeks | Google-led, v0.3 released. gRPC support added. Enterprise adoption starting (Tyson Foods, Gordon Food Service). Still early but growing fast. |
| **OpenTelemetry GenAI** | **P1** | Telemetry export (OTel spans, metrics, events) | 1-2 weeks | Becoming the standard for AI observability. Datadog natively supports it. Enables integration with every OTel-compatible backend. |

---

## 3. Orchestration Platforms

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **n8n** | **P2** | Webhook + HTTP proxy config | 3-5 days | Most complete low-code AI tool (March 2026). MCP support. Enterprise SSO/RBAC. Configure n8n AI nodes to route through Altrace. |
| **Dify** | **P2** | HTTP proxy config + webhook | 3-5 days | Open-source, self-hostable. Popular for RAG + agent workflows. Backend-as-a-Service model. |
| **Langflow** | **P3** | HTTP proxy config | 2-3 days | LangChain-based visual builder. LangGraph support. |
| **Flowise** | **P3** | HTTP proxy config | 2-3 days | RAG chatbot builder. Quick setup. |
| **Rivet** | **P3** | HTTP proxy config | 2-3 days | Visual AI chain editor. |
| **Promptflow (Azure)** | **P2** | HTTP proxy config | 3-5 days | Microsoft ecosystem. Enterprise Azure customers. |
| **Vellum** | **P3** | HTTP proxy config | 2-3 days | Prompt engineering platform. |
| **Humanloop** | **P3** | HTTP proxy config | 2-3 days | Prompt management + evaluation. |
| **PromptLayer** | **P3** | HTTP proxy config | 2-3 days | Prompt tracking. |

**Note:** Most orchestration platforms route LLM calls via HTTP. Altrace as a transparent proxy can intercept these without specific adapters. Integration is primarily documentation + configuration guides, not code.

---

## 4. Identity and SSO

### Priority Integration Map

| Provider | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **SAML 2.0 (generic)** | **P0** | SSO protocol | 2-3 weeks | Universal enterprise SSO. Covers Okta, Azure AD, Google, OneLogin, PingIdentity. Single implementation covers all SAML IdPs. |
| **OIDC (generic)** | **P0** | SSO protocol | 1-2 weeks | Modern SSO standard. Covers Auth0, Keycloak, Azure AD, Google, Okta. Simpler than SAML. |
| **SCIM 2.0 (generic)** | **P0** | Directory sync protocol | 2-3 weeks | Automated user provisioning/deprovisioning. Required for enterprise. Covers Okta, Azure AD, Google Workspace, JumpCloud, OneLogin. |
| **Okta** | **P0** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Largest enterprise IdP. 7,000+ pre-built integrations. Every enterprise prospect will ask for Okta. |
| **Microsoft Entra ID (Azure AD)** | **P0** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Microsoft shops are 60%+ of enterprise. Entra ID is the top rebuild choice per ETR 2026. |
| **Google Workspace** | **P1** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Google Cloud customers. Startup-heavy adoption. |
| **Auth0** | **P1** | OIDC (via generic protocol) | Covered by generic | Developer-focused. Startup to mid-market. Broad protocol support. |
| **Keycloak** | **P1** | OIDC/SAML (via generic protocols) | Covered by generic | Open-source. Self-hosted enterprises. On-prem requirement. |
| **OneLogin** | **P2** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Simplicity-focused. Mid-market. |
| **JumpCloud** | **P2** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Cloud directory. Zero Trust focus. SMB to mid-market. |
| **Ping Identity** | **P2** | SAML/OIDC + SCIM (via generic protocols) | Covered by generic | Large enterprise. Complex federation. |
| **CyberArk** | **P2** | PAM integration (API) | 1 week | Privileged access management. High-security environments. Combined with Palo Alto now. |
| **SailPoint** | **P3** | IGA integration (API) | 1-2 weeks | Identity governance. Large enterprise only. |
| **WorkOS** | **P1** | SSO/SCIM middleware | 1 week | Simplest path to enterprise SSO for B2B SaaS. Free AuthKit up to 1M MAUs. $125/connection/month for SSO/SCIM. Handles Okta/Azure AD/Google automatically. |

### Recommended Implementation Path
1. **Phase 1 (P0):** Implement generic OIDC + SAML 2.0 + SCIM 2.0 -- covers 90% of enterprise IdPs
2. **Alternative:** Use WorkOS as an intermediary (faster to market, $125/connection/month)
3. **Phase 2 (P1):** Provider-specific testing + certification (Okta catalog listing, Azure AD gallery app, Google Marketplace)

---

## 5. SIEM and Observability

### Log/Event Export

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **Splunk** | **P0** | Log export (HTTP Event Collector / HEC) | 1 week | Enterprise SIEM leader. CISOs require it. HEC is standard ingest. SOC 2 evidence. |
| **Datadog** | **P0** | Log export (Datadog API / HTTP intake) + metrics (DogStatsD) | 1 week | Cloud-native observability leader. Native OTel GenAI support. Developer-friendly. |
| **Elastic/ELK** | **P1** | Log export (Elasticsearch API / Logstash input) | 1 week | Open-source option. Self-hosted enterprises. Large install base. |
| **Sumo Logic** | **P2** | Log export (HTTP source) | 3-5 days | SaaS analytics. Mid-market. |
| **New Relic** | **P2** | Log export (Log API) | 3-5 days | Full-stack observability. Growing AI monitoring. |
| **Grafana Loki** | **P1** | Log export (Loki push API) | 3-5 days | Open-source. Part of LGTM stack. Cost-effective. Popular with DevOps. |
| **Grafana Cloud** | **P1** | Metrics + logs (Prometheus remote write + Loki push) | 1 week | Managed Grafana. Already have Grafana dashboards in altrace-agent. Natural fit. |

### Telemetry Standards

| Standard | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **OpenTelemetry (traces + metrics)** | **P0** | OTel SDK/exporter | 2 weeks | Industry standard. One implementation covers Datadog, New Relic, Grafana, Jaeger, Zipkin, and dozens more. GenAI semantic conventions maturing. |
| **Prometheus** | **P1** | Metrics endpoint (already exists at /metrics) | Done | Already implemented. Prometheus scrape endpoint. |
| **StatsD / DogStatsD** | **P2** | Metrics push | 3 days | UDP-based. Simple. Datadog integration. |
| **Syslog (RFC 5424)** | **P2** | Log export | 3 days | Legacy enterprise requirement. Some SIEMs only accept syslog. |

### AI-Specific Observability

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **Langfuse** | **P1** | Trace export (API) | 1 week | Open-source LLM observability. MIT license. Self-hostable. 50K free events/month cloud. Strong LangChain integration. |
| **LangSmith** | **P2** | Trace export (API) | 1 week | LangChain's official observability. Deep LangChain integration. Paid. |
| **Helicone** | **P2** | Trace export (API or proxy chaining) | 1 week | Proxy-based integration. ClickHouse backend. Caching. $25/month flat. |
| **Braintrust** | **P2** | Trace export (API) | 1 week | Evaluation-focused. Advanced evals. |
| **Arize / Phoenix** | **P2** | Trace export (OTel) | 3-5 days | OTel-native. If we implement OTel, Arize works automatically. |
| **Weights and Biases** | **P3** | Trace export (API) | 1 week | ML experiment tracking. Growing LLM support. Research-heavy orgs. |
| **WhyLabs** | **P3** | Data export (API) | 1 week | Data/model monitoring. Drift detection. Open-source option. |
| **MLflow** | **P3** | Trace export (API) | 1 week | MLflow 3 added GenAI primitives. Open-source. |

### Alerting and Incident Management

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **Slack** | **P0** | Webhook (incoming webhook + Slack API) | 3-5 days | 65% of enterprise clients use custom bots. Kill switch alerts, budget alerts, policy violations. Universal adoption. |
| **Microsoft Teams** | **P1** | Webhook (incoming webhook + Teams API) | 3-5 days | 1,400+ apps. Microsoft enterprise shops. Required for Azure-heavy customers. |
| **PagerDuty** | **P1** | Event API (Events API v2) | 3-5 days | Incident management leader. Kill switch activation -> PagerDuty incident. SOC integration. |
| **Email (SMTP/SES)** | **P1** | SMTP or SES API | 3-5 days | Universal fallback. Budget alerts, weekly reports. |
| **Webhooks (generic)** | **P0** | Configurable HTTP POST | 2-3 days | Generic webhook for any destination. Custom integrations. One implementation, infinite targets. |
| **OpsGenie** | **P3** | Event API | - | SHUTTING DOWN April 2027. Atlassian stopped new sales June 2025. Do NOT invest. |
| **Discord** | **P3** | Webhook | 2 days | Developer communities. Low enterprise demand. |

### Recommended Implementation Path
1. **Phase 1 (P0):** OpenTelemetry exporter (covers dozens of backends) + Slack webhook + generic webhook
2. **Phase 2 (P1):** Splunk HEC + Datadog direct + Langfuse + PagerDuty + Teams + email
3. **Phase 3 (P2):** Elastic, Grafana Loki, Syslog, LangSmith, Helicone

---

## 6. Compliance and GRC

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **Vanta** | **P0** | Evidence API + integration listing | 2-3 weeks | Top compliance automation. 375+ integrations. 1,200 automated tests/hour. CISOs require SOC 2 evidence from Vanta. |
| **Drata** | **P0** | Evidence API + integration listing | 2-3 weeks | AI-native GRC leader. Continuous control monitoring. SOC 2, ISO 27001, HIPAA. |
| **Secureframe** | **P1** | Evidence API | 1-2 weeks | Policy management focus. Audit collaboration. |
| **Thoropass** | **P2** | Evidence API | 1-2 weeks | In-house auditors + automation. Renamed from Laika. |
| **Sprinto** | **P2** | Evidence API | 1-2 weeks | Deep automation. Multi-framework. |
| **Scrut** | **P3** | Evidence API | 1 week | Control mapping + risk management. |
| **Anecdotes** | **P3** | Evidence API | 1 week | Data orchestration for large teams. |
| **OneTrust** | **P1** | API integration | 2 weeks | Privacy + AI governance leader. Just launched real-time AI governance (March 2026). AI guardrail enforcement. Natural partnership. |
| **BigID** | **P2** | API integration | 1-2 weeks | Data intelligence. PII discovery at scale. Complements Altrace content classification. |
| **TrustArc** | **P3** | API integration | 1 week | Privacy management. Smaller market. |

### What GRC Integration Means for Altrace
- Export audit logs in compliance-ready format
- Provide API endpoints that GRC tools can poll for evidence
- Map Altrace controls to SOC 2 / ISO 27001 / HIPAA control frameworks
- Automate evidence collection (budget configs, kill switch history, policy enforcement logs)

---

## 7. Service Mesh and Networking

| Technology | Priority | Type | Effort | Rationale |
|------------|----------|------|--------|-----------|
| **Istio** | **P1** | Service mesh integration (EnvoyFilter, VirtualService) | 2-3 weeks | Market leader for complex enterprise. Ambient mode gaining traction. Traffic routing to Altrace sidecar. mTLS integration. |
| **Cilium** | **P1** | eBPF-based integration | 2-3 weeks | Fastest growing service mesh. eBPF kernel-level enforcement. Natural complement to Altrace iptables. L4 encryption without sidecar. |
| **Linkerd** | **P2** | Service mesh integration | 1-2 weeks | Simplest mesh. Best latency (40-400% less than Istio). Lightweight sidecar model. |
| **Envoy** | **P1** | External authorization filter (ext_authz) | 1-2 weeks | Envoy AI Gateway is emerging for GenAI traffic. ext_authz protocol lets Envoy delegate decisions to Altrace. |
| **Kong** | **P2** | Plugin (custom plugin or ext_authz) | 1-2 weeks | API management platform. AI Gateway extension. Large install base. |
| **Consul Connect** | **P3** | Service mesh integration | 1-2 weeks | HashiCorp ecosystem. Service discovery. |
| **Traefik** | **P2** | Middleware plugin | 1 week | Cloud-native reverse proxy. Kubernetes IngressRoute. |
| **NGINX** | **P2** | Auth subrequest module | 3-5 days | Ubiquitous. auth_request directive for external authorization. |
| **Cloudflare** | **P2** | Workers integration | 1-2 weeks | Cloudflare AI Gateway covers 350+ models. Partnership or complementary positioning. |
| **HAProxy** | **P3** | External check | 3-5 days | Load balancer. Legacy enterprise. |
| **Calico** | **P2** | Network policy integration | 1 week | Kubernetes network policy. eBPF dataplane. Complements Altrace iptables. |

### Recommended Implementation Path
1. **Phase 1 (P1):** Envoy ext_authz filter (covers Istio + standalone Envoy + Envoy AI Gateway)
2. **Phase 2 (P1):** Cilium eBPF integration + Istio-specific guides
3. **Phase 3 (P2):** Kong plugin, Traefik middleware, NGINX auth_request

---

## 8. CI/CD and DevOps

| Tool | Priority | Type | Effort | Rationale |
|------|----------|------|--------|-----------|
| **Helm** | **P0** | Deployment chart | Done | Already implemented. `deploy/helm/altrace/`. |
| **GitHub Actions** | **P1** | CI workflow + Marketplace action | 1 week | Altrace policy check in CI. Validate manifest, run `altrace verify`. Supply chain security concern: AI agents in CI are vulnerable to prompt injection (PromptPwnd). |
| **Terraform** | **P1** | Terraform provider | 2-3 weeks | IaC for Altrace configuration (budgets, kill switches, policies). 32.8% market share. |
| **ArgoCD** | **P1** | GitOps deployment (Helm + Kustomize) | 3-5 days | GitOps standard. Altrace Helm chart already compatible. Documentation + example. |
| **Pulumi** | **P2** | Pulumi provider | 2-3 weeks | Alternative to Terraform. Python/Go/TypeScript IaC. Growing. |
| **GitLab CI** | **P2** | CI template | 3-5 days | GitLab-native orgs. Built-in security scanning. |
| **Flux** | **P2** | GitOps deployment | 2-3 days | CNCF GitOps. Alternative to ArgoCD. |
| **CircleCI** | **P3** | Orb | 3-5 days | Declining market share. |
| **Jenkins** | **P3** | Plugin or pipeline step | 1 week | Legacy CI. Still large install base. |
| **Kustomize** | **P1** | Overlays for Altrace deployment | 2-3 days | Kubernetes-native. Alternative to Helm. |

### Key CI/CD Use Cases for Altrace
- Policy validation in pull requests (manifest lint, budget validation)
- Automated `altrace verify` in deployment pipeline
- Infrastructure as code for governance configuration
- GitOps-driven policy updates (OPA bundles via ArgoCD/Flux)

---

## 9. Cloud Security

| Tool | Priority | Type | Effort | Rationale |
|------|----------|------|--------|-----------|
| **Wiz** | **P1** | API integration (export findings, receive context) | 1-2 weeks | CNAPP leader (20.2% mind share, 8.8 rating). Agentless scanning. Altrace as a security control visible in Wiz inventory. |
| **Prisma Cloud** | **P2** | API integration | 1-2 weeks | Palo Alto Networks. Comprehensive CNAPP. Potential acquirer ($500-900M per strategy doc). |
| **Falco** | **P1** | Alert integration (webhook consumer) | 1 week | CNCF graduated. Runtime threat detection. Falco detects anomalous behavior -> triggers Altrace kill switch. Natural complement. |
| **Sysdig** | **P2** | Alert integration | 1 week | Built on Falco. eBPF runtime. Container security. |
| **Snyk** | **P2** | CI integration (scan Altrace images) | 3-5 days | Developer security. Container image scanning. Supply chain. |
| **Aqua Security** | **P2** | Runtime integration | 1 week | Full-lifecycle container security. Runtime protection profiles. |
| **Trivy** | **P2** | CI integration (scan Altrace images) | 2-3 days | Open-source vulnerability scanner. Already used in many CI pipelines. |
| **Orca Security** | **P3** | API integration | 1 week | Agentless CNAPP. Forrester Strong Performer 2026. |

### Key Security Integration Use Cases
- Falco runtime alert -> Altrace kill switch activation (automated response)
- Wiz/Prisma visibility into Altrace as a security control
- Snyk/Trivy scanning of Altrace container images in CI
- Security posture data exported to CNAPP dashboards

---

## 10. Communication and Alerting

(Covered in Section 5 under Alerting and Incident Management)

Additional integrations:

| Channel | Priority | Type | Effort | Rationale |
|---------|----------|------|--------|-----------|
| **Generic Webhook** | **P0** | HTTP POST with configurable payload | 2-3 days | Universal. Covers any destination. |
| **Slack** | **P0** | Incoming webhook + Block Kit messages | 3-5 days | Kill switch alerts, budget warnings, policy violations. |
| **Microsoft Teams** | **P1** | Incoming webhook + Adaptive Cards | 3-5 days | Enterprise Microsoft shops. |
| **PagerDuty** | **P1** | Events API v2 | 3-5 days | Incident management. On-call escalation. |
| **Email (SMTP/SES)** | **P1** | SMTP or AWS SES | 3-5 days | Budget reports, weekly summaries, alert fallback. |
| **AWS SNS** | **P2** | SNS publish | 2-3 days | AWS-native notification fan-out. |
| **Google Chat** | **P3** | Webhook | 2 days | Google Workspace shops. |

---

## 11. Cloud Provider Managed AI Services

These are distinct from direct provider APIs because they use cloud-specific authentication, endpoints, and request wrapping.

| Service | Priority | Type | Effort | Rationale |
|---------|----------|------|--------|-----------|
| **Amazon Bedrock** | **P0** | Provider handler (SigV4 auth) | 2 weeks | Access to Claude, Llama, Mistral, Cohere, Titan via AWS. SigV4 signing. Enterprise AWS path. Cerebras coming to Bedrock. |
| **Azure OpenAI Service** | **P0** | Provider handler (Azure AD / API key + deployment ID) | 1 week | GPT models via Azure. Different auth and endpoint structure. Enterprise Microsoft path. |
| **Google Vertex AI** | **P1** | Provider handler (ADC/OAuth2) | 1 week | Gemini via Google Cloud. BigQuery integration. Enterprise Google path. |
| **Azure AI Foundry** | **P2** | Provider handler | 1-2 weeks | Broader Azure AI surface. Multiple model families. |
| **AWS SageMaker** | **P3** | Provider handler | 1-2 weeks | Custom model hosting. Less relevant for governance of standard LLM traffic. |

---

## 12. Data and Privacy Platforms

| Platform | Priority | Type | Effort | Rationale |
|----------|----------|------|--------|-----------|
| **OneTrust** | **P1** | API integration (AI governance features) | 2 weeks | Just launched real-time AI governance + agent oversight (March 2026). AI guardrail enforcement. Privacy management leader. Natural partnership for content governance. |
| **BigID** | **P2** | API integration (PII discovery) | 1-2 weeks | Data intelligence. PII discovery at scale. Could feed Altrace content classification patterns. |
| **Privado** | **P3** | API integration | 1 week | Code-level privacy scanning. Engineering-focused. |
| **Osano** | **P3** | API integration | 1 week | Consent management. |

---

## Priority Summary

### P0 (Must Have -- Enterprise Gate Requirements)
| Integration | Category | Effort |
|-------------|----------|--------|
| SAML 2.0 (generic) | Identity/SSO | 2-3 weeks |
| OIDC (generic) | Identity/SSO | 1-2 weeks |
| SCIM 2.0 (generic) | Identity/SSO | 2-3 weeks |
| OpenTelemetry exporter | Observability | 2 weeks |
| Slack webhook | Alerting | 3-5 days |
| Generic webhook | Alerting | 2-3 days |
| Azure OpenAI handler | LLM Provider | 1 week |
| Amazon Bedrock handler | LLM Provider | 2 weeks |
| TypeScript SDK | Framework | 2-3 weeks |
| Microsoft Agent Framework adapter | Framework | 1 week |
| Vanta evidence API | GRC | 2-3 weeks |
| Drata evidence API | GRC | 2-3 weeks |
| Splunk HEC export | SIEM | 1 week |
| Datadog export | SIEM | 1 week |

**Total P0 effort: ~16-22 weeks (4-5.5 months, parallelizable)**

### P1 (Should Have -- Competitive Differentiators)
| Integration | Category | Effort |
|-------------|----------|--------|
| Google Vertex AI handler | LLM Provider | 1 week |
| Mistral handler | LLM Provider | 3 days |
| DeepSeek handler | LLM Provider | 3 days |
| Generic OpenAI-compatible handler | LLM Provider | 1 week |
| OpenAI Agents SDK adapter | Framework | 1 week |
| Google ADK adapter | Framework | 1 week |
| Pydantic AI adapter | Framework | 3-5 days |
| Vercel AI SDK adapter | Framework | 1 week |
| LangGraph adapter | Framework | 3-5 days |
| Anthropic Agent SDK adapter | Framework | 3-5 days |
| MCP gateway mode | Protocol | 2-3 weeks |
| OpenTelemetry GenAI conventions | Observability | 1-2 weeks |
| Langfuse trace export | AI Observability | 1 week |
| Grafana Loki export | Observability | 3-5 days |
| Grafana Cloud export | Observability | 1 week |
| Elastic export | SIEM | 1 week |
| PagerDuty Events API | Alerting | 3-5 days |
| Microsoft Teams webhook | Alerting | 3-5 days |
| Email (SMTP/SES) | Alerting | 3-5 days |
| Envoy ext_authz filter | Networking | 1-2 weeks |
| Istio integration | Service Mesh | 2-3 weeks |
| Cilium eBPF integration | Service Mesh | 2-3 weeks |
| GitHub Actions marketplace action | CI/CD | 1 week |
| Terraform provider | CI/CD | 2-3 weeks |
| ArgoCD guide | CI/CD | 3-5 days |
| Kustomize overlays | CI/CD | 2-3 days |
| Wiz API integration | Cloud Security | 1-2 weeks |
| Falco alert -> kill switch | Cloud Security | 1 week |
| OneTrust AI governance API | Privacy | 2 weeks |
| WorkOS SSO/SCIM middleware | Identity | 1 week |
| Secureframe evidence API | GRC | 1-2 weeks |

**Total P1 effort: ~30-42 weeks (7.5-10.5 months, highly parallelizable)**

### P2 (Nice to Have -- Market Coverage)
| Count | Category |
|-------|----------|
| 10 | LLM Providers (xAI, Groq, Together, Fireworks, Perplexity, Cerebras, Cohere, Azure AI Foundry, Vertex AI enhancements) |
| 5 | Frameworks (LlamaIndex, Haystack, DSPy, Instructor, A2A protocol) |
| 5 | Orchestration (n8n, Dify, Promptflow, Langflow, Flowise) |
| 6 | Observability (LangSmith, Helicone, Braintrust, Sumo Logic, New Relic, StatsD, Syslog) |
| 5 | Networking (Kong, Linkerd, Traefik, NGINX, Calico, Cloudflare) |
| 4 | CI/CD (Pulumi, GitLab CI, Flux) |
| 4 | Cloud Security (Prisma Cloud, Sysdig, Snyk, Aqua, Trivy) |
| 4 | GRC (Thoropass, Sprinto, BigID) |
| 3 | Identity (OneLogin, JumpCloud, Ping Identity, CyberArk) |
| 2 | Alerting (AWS SNS, Discord) |

### P3 (Monitor / On Demand)
| Count | Category |
|-------|----------|
| 6 | LLM Providers (Reka, Aleph Alpha, AI21, Inflection, Writer, non-text modality) |
| 4 | Frameworks (Magentic, Mirascope, Spring AI) |
| 3 | Orchestration (Rivet, Vellum, Humanloop, PromptLayer) |
| 3 | Observability (W&B, WhyLabs, MLflow) |
| 3 | Networking (Consul, HAProxy) |
| 2 | CI/CD (CircleCI, Jenkins) |
| 2 | Cloud Security (Orca) |
| 4 | GRC/Privacy (Scrut, Anecdotes, TrustArc, Privado, Osano) |
| 1 | Identity (SailPoint) |
| 1 | Alerting (OpsGenie -- shutting down, do NOT invest) |

---

## Implementation Strategy

### Phase 1: Enterprise Gates (Months 1-3)
**Goal:** Remove blockers for enterprise sales.

1. Generic OIDC + SAML 2.0 + SCIM 2.0 (OR WorkOS as shortcut)
2. OpenTelemetry exporter with GenAI semantic conventions
3. Slack + generic webhook alerting
4. Splunk HEC + Datadog log/metrics export
5. Azure OpenAI + Amazon Bedrock provider handlers

### Phase 2: Ecosystem Breadth (Months 3-6)
**Goal:** Cover the modern AI development stack.

1. TypeScript SDK + Vercel AI SDK adapter
2. Microsoft Agent Framework adapter (replace AutoGen)
3. OpenAI Agents SDK + Google ADK + Pydantic AI adapters
4. MCP gateway mode
5. Terraform provider
6. Vanta + Drata evidence API
7. Generic OpenAI-compatible handler (covers ~10 providers)

### Phase 3: Depth and Differentiation (Months 6-9)
**Goal:** Best-in-class integration depth.

1. Envoy ext_authz + Istio + Cilium service mesh
2. Falco -> kill switch automated response
3. GitHub Actions marketplace action
4. Langfuse + AI observability export
5. PagerDuty + Teams + email alerting
6. A2A protocol governance
7. OneTrust AI governance partnership

### Phase 4: Long Tail (Months 9-12)
**Goal:** Market coverage and partnership listings.

1. P2 LLM providers (via generic OpenAI-compatible handler)
2. P2 frameworks (LlamaIndex, Haystack, DSPy)
3. P2 orchestration platform guides
4. P2 cloud security integrations
5. P2 SIEM/observability exports

---

## Key Strategic Insights

### 1. The OpenAI-Compatible Shortcut
~10 providers (Mistral, DeepSeek, xAI, Groq, Together, Fireworks, Perplexity, Anyscale, and others) use OpenAI-compatible APIs. A single configurable handler with custom base URL + auth covers all of them. Build this as P1 (1 week effort, 10 providers covered).

### 2. OpenTelemetry Is the Multiplier
One OpenTelemetry exporter implementation enables integration with Datadog, Splunk, New Relic, Grafana, Jaeger, Zipkin, Elastic, and dozens more OTel-compatible backends. This is the highest-leverage observability investment.

### 3. WorkOS as SSO Shortcut
WorkOS provides OIDC/SAML/SCIM that works with Okta, Azure AD, Google Workspace, OneLogin, JumpCloud, and PingIdentity out of the box. Free up to 1M MAUs, $125/connection/month for enterprise SSO. Faster to market than building generic protocol support directly.

### 4. Microsoft Agent Framework Replaces AutoGen
AutoGen is in maintenance mode. Microsoft Agent Framework (RC, GA Q1 2026) combines AutoGen + Semantic Kernel. The existing AutoGen adapter needs migration. This is a P0 because Microsoft enterprise shops are a primary target.

### 5. OpsGenie Is Dead
Atlassian stopped new sales June 2025, complete shutdown April 2027. Do not invest. PagerDuty and incident.io are the alternatives.

### 6. MCP Gateway Mode Is a Natural Fit
With 6,400+ registered MCP servers and enterprise readiness as a 2026 MCP priority, Altrace sitting as a governance layer between MCP clients and servers is a natural insertion point. This aligns with the existing `P1-6: MCP gateway mode` roadmap item.

### 7. Falco + Altrace Is a Powerful Combo
Falco detects anomalous container runtime behavior. Altrace enforces AI governance. Connecting Falco alerts to Altrace kill switches creates automated threat response: anomalous behavior detected -> AI access immediately revoked. This is differentiated and defensible.

### 8. OneTrust Partnership Opportunity
OneTrust just launched real-time AI governance with guardrail enforcement (March 2026). Their approach is complementary to Altrace: OneTrust does policy authoring and compliance management, Altrace does runtime enforcement. A partnership or integration could accelerate enterprise adoption for both.

---

## Sources

- [Top 11 LLM API Providers in 2026](https://futureagi.substack.com/p/top-11-llm-api-providers-in-2026)
- [LLM API Pricing March 2026](https://www.tldl.io/resources/llm-api-pricing-2026)
- [AI Agent Frameworks Compared 2026](https://arsum.com/blog/posts/ai-agent-frameworks/)
- [Top AI Agent Frameworks - Turing](https://www.turing.com/resources/ai-agent-frameworks)
- [LangGraph vs CrewAI vs AutoGen](https://o-mega.ai/articles/langgraph-vs-crewai-vs-autogen-top-10-agent-frameworks-2026)
- [Best Enterprise SSO Platforms 2026](https://ssojet.com/blog/best-enterprise-sso-platforms-for-startups-in-2026-technical-guide-comparison)
- [Best SCIM Providers 2026 - WorkOS](https://workos.com/blog/best-scim-providers-for-automated-user-provisioning-in-2026)
- [Auth0 vs WorkOS 2026](https://ssojet.com/blog/auth0-vs-workos-ciam-2026)
- [Splunk vs Datadog 2026](https://www.stationx.net/splunk-vs-datadog/)
- [AI Observability Platforms Comparison](https://softcery.com/lab/top-8-observability-platforms-for-ai-agents-in-2025)
- [Langfuse Alternatives 2026 - Braintrust](https://www.braintrust.dev/articles/langfuse-alternatives-2026)
- [Best AI Observability Tools 2026 - Braintrust](https://www.braintrust.dev/articles/best-ai-observability-tools-2026)
- [Best SOC 2 Compliance Software 2026](https://www.brightdefense.com/resources/best-soc-2-compliance-software/)
- [Vanta vs Drata 2026](https://cybersierra.co/blog/vanta-drata-review/)
- [MCP 2026 Roadmap](http://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [MCP Production Growing Pains - The New Stack](https://thenewstack.io/model-context-protocol-roadmap-2026/)
- [A2A Protocol - Google](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A2A v0.3 Upgrade - Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)
- [Service Mesh Comparison 2026](https://reintech.io/blog/kubernetes-service-mesh-comparison-2026-istio-linkerd-cilium)
- [CNAPP Vendors 2026](https://accuknox.com/blog/cnapp-vendors)
- [Orca Security Forrester Wave 2026](https://orca.security/resources/blog/forrester-wave-cnapp-2026-strong-performer/)
- [AI Orchestration Platforms Comparison](https://blog.n8n.io/ai-agent-frameworks/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Datadog OTel GenAI Support](https://www.datadoghq.com/blog/llm-otel-semantic-convention/)
- [Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Microsoft Agent Framework RC Migration](https://devblogs.microsoft.com/semantic-kernel/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Google ADK Documentation](https://google.github.io/adk-docs/a2a/)
- [AI Agent Tools Landscape 2026 - StackOne](https://www.stackone.com/blog/ai-agent-tools-landscape-2026/)
- [OneTrust AI Governance Expansion](https://siliconangle.com/2026/03/09/onetrust-expands-platform-real-time-ai-governance-agent-oversight-capabilities/)
- [Cloudflare AI Gateway Alternatives 2026](https://www.getmaxim.ai/articles/top-5-cloudflare-ai-gateway-alternatives-in-2026/)
- [Enterprise LLM Gateways 2026](https://www.getmaxim.ai/articles/best-enterprise-llm-gateways-in-2026-a-comparative-guide/)
- [Container Security Solutions 2026](https://www.ox.security/blog/container-security-solutions-in-2026/)
- [Falco Project](https://falco.org/)
- [OpsGenie vs PagerDuty 2026](https://blog.spike.sh/opsgenie-vs-pagerduty-which-incident-management-tool-should-you-choose-in-2026/)
- [Pydantic AI](https://ai.pydantic.dev/)
- [Vercel AI SDK](https://vercel.com/docs/ai-gateway/ecosystem/framework-integrations/pydantic-ai)
- [GitHub Agentic Workflows CI/CD](https://thenewstack.io/github-agentic-workflows-overview/)
- [AI Agents GitHub Actions Risk](https://www.esecurityplanet.com/threats/ai-agents-create-critical-supply-chain-risk-in-github-actions/)
- [Terraform vs Pulumi 2026](https://dasroot.net/posts/2026/01/infrastructure-as-code-terraform-opentofu-pulumi-comparison-2026/)
- [Best AI Observability Platforms 2026 - TrueFoundry](https://www.truefoundry.com/blog/best-ai-observability-platforms-for-llms-in-2026)
- [Haystack vs LlamaIndex - ZenML](https://www.zenml.io/blog/haystack-vs-llamaindex)
- [Top LLM Frameworks 2026](https://www.secondtalent.com/resources/top-llm-frameworks-for-building-ai-agents/)
- [Compliance Automation Tools Comparison](https://inventivehq.com/blog/compliance-automation-tools-comparison)
- [AWS Cerebras Bedrock Deal](https://winbuzzer.com/2026/03/16/aws-cerebras-wse3-deal-amazon-bedrock-ai-inference-xcxwbn/)
- [xAI Grok Imagine API](https://x.ai/news/grok-imagine-api)
- [DeepSeek Pricing](https://www.tldl.io/resources/llm-api-pricing-2026)
