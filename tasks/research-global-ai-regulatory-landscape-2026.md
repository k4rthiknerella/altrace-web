# Global AI Regulatory Landscape -- March 2026

**Research Date:** 2026-03-16
**Author:** Karthik Nerella
**Purpose:** Map the global regulatory environment to Altrace's capabilities, identify compliance gaps, and inform go-to-market prioritization.
**Sources:** 16 search queries across jurisdictions, standards bodies, and industry-specific frameworks.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Jurisdiction-by-Jurisdiction Analysis](#2-jurisdiction-by-jurisdiction-analysis)
3. [International Standards](#3-international-standards)
4. [Industry-Specific Requirements](#4-industry-specific-requirements)
5. [US State-Level Landscape](#5-us-state-level-landscape)
6. [Altrace Compliance Mapping](#6-altrace-compliance-mapping)
7. [Gap Analysis](#7-gap-analysis)
8. [Timeline of Critical Deadlines](#8-timeline-of-critical-deadlines)
9. [Recommendations](#9-recommendations)
10. [Sources](#10-sources)

---

## 1. Executive Summary

The global AI regulatory landscape has undergone a fundamental shift between 2024 and 2026. What was once a patchwork of voluntary guidelines has consolidated into enforceable legislation across multiple jurisdictions, with the EU AI Act's August 2, 2026 deadline for high-risk AI systems serving as the single most consequential regulatory event.

**Key findings:**

- **4 jurisdictions** now have enacted, enforceable AI-specific laws (EU, South Korea, China, Colorado/US states)
- **3 jurisdictions** have legislation in active parliamentary process (Brazil, UK, India)
- **4 jurisdictions** rely on voluntary frameworks with soft-law character (Japan, Singapore, Australia, Canada)
- **2 international standards** are directly certifiable (ISO 42001, SOC 2 with AI controls)
- **1 framework** serves as the de facto technical companion for compliance (NIST AI RMF)
- **Maximum penalty exposure** across all jurisdictions exceeds EUR 35M or 7% of global turnover (EU AI Act)

**For Altrace specifically:** The regulatory environment is strongly favorable. Every major framework demands the exact capabilities Altrace provides -- audit logging, human oversight, risk management, cost controls, kill switches, and content governance. The primary gaps are certification (SOC 2 Type II, ISO 42001) and documentation (conformity assessment artifacts), not feature gaps.

---

## 2. Jurisdiction-by-Jurisdiction Analysis

### 2.1 European Union -- EU AI Act

| Attribute | Detail |
|-----------|--------|
| **Status** | ENACTED. Entered into force August 1, 2024. Phased enforcement through August 2027. |
| **Authority** | European AI Office + Member State national competent authorities |
| **Critical Deadline** | **August 2, 2026** -- High-risk AI system obligations (Annex III) become enforceable |
| **Scope** | Any AI system placed on the EU market or affecting EU persons, regardless of provider location |

**Penalty Structure:**

| Violation | Maximum Penalty |
|-----------|----------------|
| Prohibited AI practices | EUR 35M or 7% global annual turnover |
| High-risk system non-compliance | EUR 15M or 3% global annual turnover |
| Incorrect/misleading information | EUR 7.5M or 1% global annual turnover |

**Phased Enforcement Timeline:**

| Date | What Becomes Enforceable |
|------|--------------------------|
| February 2, 2025 | Prohibited AI practices (Article 5) |
| August 2, 2025 | General-purpose AI model obligations; Member States designate national authorities |
| February 2, 2026 | Commission publishes Article 6 guidelines + practical examples of high-risk/non-high-risk |
| **August 2, 2026** | **Annex III high-risk AI system obligations (Articles 6-49)** |
| August 2, 2027 | Annex I high-risk AI systems (safety components of regulated products) |

**High-Risk System Obligations (Articles 8-15, enforceable August 2026):**

| Obligation | Article | Description |
|------------|---------|-------------|
| Risk management system | Art. 9 | Continuous, iterative process throughout AI lifecycle. Identify, estimate, evaluate, mitigate risks. |
| Data governance | Art. 10 | Training, validation, and testing datasets must meet quality criteria. |
| Technical documentation | Art. 11 | Detailed documentation demonstrating compliance, accessible to authorities. |
| Record-keeping (logging) | Art. 12 | Automatic recording of events (logs) over the system's lifetime. Tamper-resistant. |
| Transparency | Art. 13 | Clear information to deployers about system capabilities and limitations. |
| Human oversight | Art. 14 | Design must enable human oversight; humans must be able to override/interrupt. |
| Accuracy, robustness, cybersecurity | Art. 15 | Appropriate levels declared and documented. |
| Conformity assessment | Art. 43 | Assessment before market placement; CE marking; EU database registration. |

**Deployer Obligations (Article 26):**

- Use high-risk AI in accordance with instructions
- Assign human oversight to competent persons
- Monitor operations; report to provider/authority when risks identified
- Conduct fundamental rights impact assessment (for public bodies and certain private entities)
- Keep logs automatically generated by the high-risk AI system for at least 6 months

**Altrace Relevance:** VERY HIGH. Altrace directly implements Art. 9 (risk management via decision chain), Art. 12 (tamper-evident audit logging with SHA-256 hash chains), Art. 14 (human oversight via kill switches and approval gates), Art. 15 (fail-closed cybersecurity), and provides deployers with the tooling to meet Art. 26 obligations. The EU AI Act is the single most important regulation for Altrace's value proposition.

---

### 2.2 United States -- Federal Level

| Attribute | Detail |
|-----------|--------|
| **Status** | NO comprehensive federal AI law. Executive Order (Dec 11, 2025) + agency-level guidance + state law preemption attempts. |
| **Authority** | Fragmented: FTC (consumer protection), NIST (standards), agencies (sector-specific), Attorney General (preemption task force) |
| **Critical Deadline** | March 11, 2026 -- FTC policy statement on AI + Commerce Dept evaluation of "onerous" state AI laws |
| **Scope** | Varies by agency and EO scope |

**December 11, 2025 Executive Order -- "Ensuring a National Policy Framework for AI":**

| Action | Deadline | Status |
|--------|----------|--------|
| AG establishes AI litigation task force | January 10, 2026 | Established |
| Commerce Dept evaluates "onerous" state AI laws | March 11, 2026 | Pending |
| FTC issues AI policy statement | March 11, 2026 | Pending |
| Conditioning federal grants on states avoiding conflicting AI laws | Ongoing | Active |

**Critical limitation:** The Executive Order itself lacks preemptive force -- it is not a statute. State laws remain enforceable until Congress acts or courts rule. Companies must continue complying with state AI laws.

**Altrace Relevance:** MODERATE-HIGH. In the absence of federal law, enterprise buyers look for frameworks (NIST AI RMF, SOC 2) as proxy compliance. Altrace's alignment with NIST AI RMF and path to SOC 2 are critical for US sales. The fragmented state landscape (see Section 5) makes governance tooling more valuable, not less.

---

### 2.3 China

| Attribute | Detail |
|-----------|--------|
| **Status** | ENACTED. Multiple overlapping regulations (no single comprehensive law). Cybersecurity Law revision effective January 1, 2026. |
| **Authority** | Cyberspace Administration of China (CAC), State Administration for Market Regulation (SAMR), Standardization Administration |
| **Critical Deadline** | January 1, 2026 -- Revised Cybersecurity Law with AI provisions in force |
| **Scope** | Any AI system operating in China or serving Chinese users |

**Active Regulations:**

| Regulation | Effective | Key Requirement |
|------------|-----------|-----------------|
| Interim Measures for the Management of Generative AI Services | August 15, 2023 | Registration, content moderation, training data governance |
| Deep Synthesis Provisions | January 10, 2023 | Labeling of AI-generated content |
| Algorithm Recommendation Provisions | March 1, 2022 | Algorithm filing, user opt-out rights |
| AI Content Labeling Rules | September 1, 2025 | Mandatory implicit + explicit labels on AI-generated content |
| Revised Cybersecurity Law | January 1, 2026 | AI governance provisions, foundational research support, safety oversight |
| Three national AI security standards | November 1, 2025 | Security requirements for generative AI |

**Enforcement focus:** Content labeling, misinformation prevention, algorithm transparency, security assessments for generative AI services.

**Altrace Relevance:** LOW-MODERATE for direct sales (market access barriers). HIGH for multinational customers deploying AI in China who need governance tooling that logs content classifications and enforces labeling compliance at the proxy layer.

---

### 2.4 United Kingdom

| Attribute | Detail |
|-----------|--------|
| **Status** | NO enacted AI-specific legislation. Pro-innovation framework (5 principles) + voluntary guidelines. AI Bill possible in Spring 2026 King's Speech. |
| **Authority** | Existing sector regulators (FCA, ICO, CMA, Ofcom, etc.) + AI Security Institute (rebranded Feb 2025) |
| **Critical Deadline** | Spring 2026 -- Decision on whether to include AI Bill in King's Speech |
| **Scope** | UK-operating entities |

**Regulatory Framework:**

| Element | Status |
|---------|--------|
| Five cross-sector principles (safety, transparency, fairness, accountability, contestability) | Published (2023 White Paper) |
| AI Safety Institute (now AI Security Institute) | Operational (rebranded Feb 2025, focus on national security + misuse risks) |
| AI Security Institute funding | AUD 29.9M allocated |
| Comprehensive AI Bill | Under consideration for Spring 2026 |
| Sector-specific AI guidance | Published by FCA, ICO, CMA |

**Altrace Relevance:** MODERATE. UK enterprise buyers in regulated sectors (financial services under FCA, healthcare) need governance tooling. The voluntary framework means procurement decisions are driven by buyer risk appetite, not legal mandate. If the AI Bill passes, relevance increases significantly.

---

### 2.5 South Korea

| Attribute | Detail |
|-----------|--------|
| **Status** | ENACTED. AI Basic Act effective January 22, 2026. |
| **Authority** | Ministry of Science and ICT (MSIT) |
| **Critical Deadline** | January 22, 2026 (in force) + ~1 year grace period before administrative fines |
| **Scope** | AI developers AND utilization business operators. Extraterritorial: applies to AI systems outside Korea if they affect Korean users/markets. |

**Key Requirements:**

| Requirement | Detail |
|-------------|--------|
| High-impact AI governance | Specific obligations for AI that "significantly affects human life, safety or fundamental rights" |
| Generative AI transparency | Users must be notified when products/services produce AI-generated outputs |
| Foreign business agent | Required if: revenue > 1 trillion KRW, AI revenue > 10 billion KRW, or > 1M daily Korean users |
| Enforcement decrees | MSIT finalizing technical details |

**Penalty Structure:** Grace period of at least 1 year before administrative fines imposed (through ~January 2027).

**Altrace Relevance:** MODERATE. South Korea is a sophisticated enterprise AI market. The AI Basic Act's high-impact AI requirements and transparency obligations align with Altrace's audit logging, content governance, and attribution capabilities.

---

### 2.6 Canada

| Attribute | Detail |
|-----------|--------|
| **Status** | AIDA (Artificial Intelligence and Data Act) DIED on the order paper January 6, 2025. No comprehensive AI legislation. |
| **Authority** | Innovation, Science and Economic Development Canada (ISED); Privacy Commissioner (DPDPA) |
| **Critical Deadline** | None -- no active AI-specific legislation |
| **Scope** | N/A |

**Current State:** After Prime Minister Trudeau's resignation and prorogation of Parliament, AIDA died. The current federal government relies on privacy legislation (DPDPA), policy mechanisms, and investment rather than AI-specific legislation. A renewed AI strategy expected in late 2025 will likely continue the non-legislative approach.

**Altrace Relevance:** LOW for regulatory compliance. MODERATE for enterprise buyers who want governance tooling as a risk management measure despite the absence of legal mandate.

---

### 2.7 Japan

| Attribute | Detail |
|-----------|--------|
| **Status** | ENACTED (soft law). AI Promotion Act effective June 4, 2025. Non-binding -- no enforceable rights or duties. |
| **Authority** | AI Strategy Headquarters (Cabinet-level, chaired by PM); METI; MIC |
| **Critical Deadline** | Through 2026 -- AI Basic Plan implementation |
| **Scope** | Multi-stakeholder model (government, academia, business, citizens) |

**Key Features:**

| Feature | Detail |
|---------|--------|
| AI Promotion Act | Non-binding. Encourages voluntary compliance through political signalling and administrative coordination. |
| AI Governance Guidelines v1.1 | Issued March 2025 by METI/MIC. Voluntary guidance for business. |
| AI Basic Plan | Three directions: economic integration, public sector AI, domestic capability development |
| Enforcement | None -- soft-law instrument |

**Altrace Relevance:** LOW for regulatory compliance. Japan's soft-law approach means the market is opportunity-driven, not compliance-driven. Enterprise buyers in Japan who serve EU markets still need EU AI Act compliance.

---

### 2.8 Singapore

| Attribute | Detail |
|-----------|--------|
| **Status** | VOLUNTARY. Model AI Governance Framework for Agentic AI launched January 22, 2026 (world's first agentic AI governance framework). |
| **Authority** | Infocomm Media Development Authority (IMDA) |
| **Critical Deadline** | None -- voluntary framework, open for public feedback |
| **Scope** | Organizations deploying agentic AI |

**Framework Structure (4 Dimensions):**

| Dimension | Requirement |
|-----------|-------------|
| Risk assessment | Use-case-specific assessment; bound risks by design through controlling tool access, permissions, operational environments, action scope |
| Human accountability | Clear organizational responsibility; human oversight that can override, intercept, or review agentic AI actions |
| Technical controls | Tool guardrails; pre-deployment testing of task execution and policy compliance; staged roll-outs; real-time monitoring |
| Trust and transparency | Sufficient information to end users; transparency measures; contact points for issue escalation |

**Altrace Relevance:** VERY HIGH despite voluntary status. Singapore's Agentic AI framework reads like an Altrace feature list. Tool access control (MCP registry), human oversight (approval gates, kill switches), real-time monitoring (telemetry), and staged roll-outs (graduated enforcement) are direct mappings. Singapore is a strong reference market for Altrace's agentic AI governance narrative.

---

### 2.9 Brazil

| Attribute | Detail |
|-----------|--------|
| **Status** | IN PROGRESS. Senate approved Bill No. 2338/2023 on December 10, 2024. Awaiting Chamber of Deputies vote. |
| **Authority** | National Data Protection Authority (ANPD) expected to oversee |
| **Critical Deadline** | Chamber of Deputies vote expected 2026 (delayed from Feb due to political disagreements) |
| **Scope** | Risk-based approach. Stricter rules for high-risk AI affecting public safety or fundamental rights. |

**Key Provisions:**

- Risk-based classification (similar to EU AI Act)
- Transparency obligations for high-risk systems
- Penalties for non-compliance with human rights protections
- Contentious issues: copyright for AI training data, definition of high-risk systems

**Altrace Relevance:** MODERATE. If passed, Brazil's risk-based approach will create demand for governance tooling. The ANPD as regulator suggests alignment with GDPR-style enforcement, where Altrace's data-never-leaves-your-infrastructure story is compelling.

---

### 2.10 India

| Attribute | Detail |
|-----------|--------|
| **Status** | NO standalone AI law. Relies on existing frameworks + IT Rules amendments. |
| **Authority** | MeitY (Ministry of Electronics and IT) |
| **Critical Deadline** | February 20, 2026 -- IT Rules Amendment 2026 (AI-generated content obligations) in effect |
| **Scope** | Intermediaries handling AI-generated content |

**Current Regulatory Instruments:**

| Instrument | Status | Key Requirement |
|------------|--------|-----------------|
| IT Rules Amendment 2026 | Effective Feb 20, 2026 | Intermediaries must handle synthetically generated information; 2-3 hour removal window for unlawful content |
| DPDP Act | Enacted 2023 | Personal data protection obligations |
| Digital India Act | Stalled (no draft published since 2023 consultations) | Would be comprehensive overhaul |
| Jan 2026 White Paper (Principal Scientific Adviser) | Advisory | "Techno-legal" framework: compliance embedded into AI system design (watermarking, bias detection) |

**Government position:** Avoid standalone AI law; use existing frameworks (DPDP Act, IP law) unless regulation becomes unavoidable.

**Altrace Relevance:** MODERATE. India's large enterprise market + growing AI adoption creates demand. The "techno-legal" framework concept (compliance embedded into AI system design) aligns with Altrace's proxy-layer enforcement model.

---

### 2.11 Australia

| Attribute | Detail |
|-----------|--------|
| **Status** | ABANDONED mandatory guardrails. Relying on existing legal frameworks. |
| **Authority** | Department of Industry, Science and Resources; planned AI Safety Institute (AUD 29.9M, launching early 2026) |
| **Critical Deadline** | Early 2026 -- AI Safety Institute launch |
| **Scope** | N/A (no AI-specific legislation) |

**Key Development:** The government explicitly decided NOT to proceed with the previously proposed mandatory guardrails for AI in high-risk settings (September 2024 proposals paper). Instead, it will build on existing legal and regulatory frameworks.

**Altrace Relevance:** LOW for regulatory compliance. The absence of mandatory requirements means the market is risk/procurement-driven.

---

## 3. International Standards

### 3.1 ISO/IEC 42001:2023 -- AI Management Systems

| Attribute | Detail |
|-----------|--------|
| **Status** | PUBLISHED (December 2023). Certifiable. First international AI management system standard. |
| **Authority** | ISO/IEC JTC 1/SC 42 |
| **Certification** | Third-party audit by accredited certification bodies (15+ CBs in ANAB pipeline as of 2026) |
| **Validity** | 3 years, with annual surveillance audits in years 2 and 3 |
| **Scope** | Any organization providing or using AI-based products/services, regardless of size or sector |

**Clause Structure:**

| Clause | Requirement |
|--------|-------------|
| 4 -- Context | Organizational context, interested parties, AIMS scope |
| 5 -- Leadership | AI policy, roles, responsibilities |
| 6 -- Planning | AI risk assessment (6.1.2-6.1.4), AI objectives |
| 7 -- Support | Resources, competence, awareness, communication, documentation |
| 8 -- Operation | Operational planning, AI risk treatment, AI system lifecycle |
| 9 -- Performance evaluation | Monitoring, measurement, internal audit, management review |
| 10 -- Improvement | Nonconformity, corrective action, continual improvement |

**Annex A Controls:** Specific AI controls covering fairness, transparency, safety, security, privacy, accountability.

**Annex B:** Implementation guidance for Annex A controls and data management processes.

**Certification Process:**
- Stage 1: Readiness assessment (AIMS design, policies, documentation) -- 1-2 days
- Stage 2: Operational effectiveness audit (implementation, interviews, process observation)
- Annual surveillance audits in years 2 and 3
- Full recertification at 3 years

**Altrace Mapping:**

| ISO 42001 Control Area | Altrace Feature |
|------------------------|-----------------|
| AI risk management | 18-stage decision chain, graduated enforcement |
| Monitoring and measurement | Prometheus metrics, structured logging, Four Golden Signals |
| Logging and traceability | SHA-256 tamper-evident audit chain |
| Human oversight | Kill switches (3-tier), approval gates, human-in-the-loop |
| Incident management | Kill switches, quarantine, budget alerts |
| Data governance | Content classification (ephemeral, no storage), taint tracking |

**Gap for Altrace:** Altrace is a tool that helps customers achieve ISO 42001 compliance, but Altrace itself should pursue ISO 42001 certification to build trust. Cost estimate: $30-80K for initial certification depending on scope.

---

### 3.2 NIST AI Risk Management Framework (AI RMF 1.0)

| Attribute | Detail |
|-----------|--------|
| **Status** | PUBLISHED (January 2023). Voluntary. Increasingly treated as industry standard. |
| **Authority** | National Institute of Standards and Technology (US Department of Commerce) |
| **Certification** | NOT directly certifiable. Used as technical companion for other frameworks. |
| **Updates Expected** | RMF 1.1 guidance addenda, expanded profiles, and granular evaluation methodologies through 2026 |

**Four Core Functions:**

| Function | Purpose | Altrace Mapping |
|----------|---------|-----------------|
| **GOVERN** | Cross-cutting foundation. Risk culture, policies, roles. | Altrace enforces governance policies defined in YAML manifests. RBAC (4 roles). |
| **MAP** | Context, identify risks, categorize AI systems. | Content classification, model identification, MCP registry. |
| **MEASURE** | Assess, analyze, track risks quantitatively. | Budget tracking, cost attribution, behavioral fingerprinting, telemetry. |
| **MANAGE** | Prioritize, respond to, mitigate risks. | Kill switches, graduated enforcement, approval gates, evidence grounding. |

**Seven Trustworthiness Pillars:**

| Pillar | Altrace Coverage |
|--------|-----------------|
| Valid and Reliable | Conformity testing, health endpoints, verification CLI |
| Safe | Kill switches, fail-closed semantics, budget limits |
| Secure and Resilient | CWE-mapped hardening, constant-time auth, AES-256-GCM, circuit breakers |
| Accountable and Transparent | Audit logging, attribution, cost tracking, structured response headers |
| Explainable and Interpretable | Decision reasons in headers, self-repair feedback with provider-native error format |
| Privacy-Enhanced | Content classification is ephemeral (bool only), data never extracted/stored, DSAR/erasure |
| Fair with Harmful Bias Managed | Content governance rules, RE2 pattern matching (tool, not arbiter) |

**Altrace Relevance:** VERY HIGH. NIST AI RMF is the primary framework US enterprise buyers reference. Altrace's feature set maps cleanly to all four functions and most trustworthiness pillars. A NIST AI RMF mapping document is a high-value sales artifact.

---

### 3.3 SOC 2 (with 2026 AI Controls)

| Attribute | Detail |
|-----------|--------|
| **Status** | UPDATED. 2026 Trust Services Criteria include enhanced AI-specific requirements. |
| **Authority** | AICPA (American Institute of Certified Public Accountants) |
| **Certification** | Type I (point-in-time) and Type II (period of observation, typically 6-12 months) |
| **Timeline** | Type II requires 6-12 month observation period |

**2026 Trust Services Criteria Changes:**

| Criteria | AI-Specific Requirement |
|----------|------------------------|
| Security | Access controls for AI models, training data, inference systems. Least-privilege. |
| Availability | Monitoring and validation of AI outputs affecting trust criteria. |
| Processing Integrity | AI tools handle data correctly throughout processing lifecycle (input validation to output verification). |
| Confidentiality | Protection of model artifacts, training datasets, inference results. |
| Privacy | AI data lifecycle documentation, bias testing documentation. |

**New 2026 Requirements:**

- Tamper-evident logging with real-time integrity verification
- Continuous monitoring (not point-in-time checks)
- Documentation of ML model training, bias testing, output validation
- Immutable logging of inputs and outputs
- Anomalous behavior monitoring
- Defined roles and periodic access reviews

**Altrace Mapping:**

| SOC 2 Requirement | Altrace Feature |
|-------------------|-----------------|
| Tamper-evident logging | SHA-256 hash chain causal audit records |
| Access controls | RBAC (admin, operator, viewer, auditor), rate limiting |
| Continuous monitoring | Prometheus metrics, real-time telemetry, behavioral fingerprinting |
| Input/output logging | Request/response logging, cost tracking, attribution |
| Anomalous behavior monitoring | Shadow AI discovery, behavioral fingerprinting, cascade detection |

**Gap for Altrace:** SOC 2 Type II certification is P0. The 6-12 month observation period means starting NOW to be certified by Q4 2026. Cost estimate: $30-50K + 3-6 months.

---

## 4. Industry-Specific Requirements

### 4.1 Healthcare -- HIPAA

| Attribute | Detail |
|-----------|--------|
| **Status** | EXISTING LAW + proposed Security Rule updates (January 2025). State AI healthcare laws effective 2026. |
| **Authority** | HHS (Department of Health and Human Services) |
| **Scope** | Covered entities and business associates handling PHI/ePHI |

**Key AI Requirements:**

| Requirement | Detail |
|-------------|--------|
| Business Associate Agreements | Any AI vendor accessing PHI is a business associate; BAA required |
| Minimum necessary | AI systems must access only the minimum information required for a specific task |
| Encryption and access controls | Required for ePHI in AI systems (Security Rule) |
| Audit logs | Track who accesses data and when |
| Proposed Security Rule update | ePHI used in AI training data, prediction models, and algorithm data protected by HIPAA |

**State-Level (effective 2026):**

| State | Law | Key Requirement |
|-------|-----|-----------------|
| Texas | TRAIGA (Jan 1, 2026) | Written disclosure of AI use in diagnosis/treatment before or at time of interaction |
| Multiple states | Various | Explicit consent for automated processing of sensitive information; restrictions on secondary uses including model training |

**Altrace Relevance:** HIGH for healthcare customers. Altrace's "data never leaves your infrastructure" model, content classification (ephemeral, no storage), audit logging, and RBAC directly support HIPAA compliance. The kill switch provides the "pull the plug" capability healthcare CISOs need.

---

### 4.2 Financial Services -- SOX, PCI DSS, DORA

#### SOX (Sarbanes-Oxley)

| Attribute | Detail |
|-----------|--------|
| **Status** | EXISTING LAW. 2026 shifts from periodic sampling to continuous automated monitoring. |
| **Key Change** | AI governance controls now required: algorithms in financial reporting must be documented, tested, explainable |
| **Requirement** | Internal controls must be "always-on" with continuous data verification |

**Altrace Relevance:** MODERATE. Altrace provides the audit trail and cost tracking that financial services firms need to demonstrate AI system controls for SOX compliance. Budget enforcement prevents unauthorized AI spending that could affect financial reporting.

#### PCI DSS v4.0

| Attribute | Detail |
|-----------|--------|
| **Status** | PCI SSC published AI principles + assessor guidance (2025-2026). No AI-specific PCI DSS requirements yet. |
| **Key Principle** | "Use of AI does not remove or bypass the need to meet the requirements of any applicable PCI SSC standard" |
| **Requirements** | Data protection (Req 3, 4), access controls/least privilege (Req 7), logging and monitoring (Req 10) apply to AI systems in scope |

**PCI SSC AI Principles:**

| Principle | Altrace Mapping |
|-----------|-----------------|
| Data protection at rest and in transit | Content classification (ephemeral), no data storage |
| Least privilege access | RBAC, team-based authorization |
| Accountability and traceability | Audit logging, attribution headers |
| Logging and monitoring | Prometheus metrics, structured logs, tamper-evident audit chain |

**Altrace Relevance:** MODERATE. Payment companies using LLMs through Altrace get PCI-relevant controls (audit logs, access controls, monitoring) "for free."

#### DORA (Digital Operational Resilience Act)

| Attribute | Detail |
|-----------|--------|
| **Status** | ENACTED (EU). Applied from January 17, 2025. Supervisory review by January 2026. |
| **Scope** | 20 types of EU financial entities + their ICT third-party service providers (including non-EU providers) |
| **Five Pillars** | ICT risk management, incident reporting, resilience testing, third-party risk management, information sharing |

**AI and DORA Integration:** The EU AI Act is designed to complement DORA. Risk management and governance controls under the AI Act align closely with DORA's IT-risk frameworks and internal governance mandates.

**Altrace Relevance:** MODERATE-HIGH for EU financial services customers. Altrace's circuit breaker, health endpoints, kill switches, and fail-closed semantics support DORA's operational resilience requirements. Third-party risk management (of LLM providers) is exactly what Altrace provides.

---

### 4.3 Government -- FedRAMP

| Attribute | Detail |
|-----------|--------|
| **Status** | FedRAMP 20x modernization active. AI cloud services prioritized for authorization. |
| **Authority** | GSA (General Services Administration) |
| **Key Initiative** | FedRAMP 20x: prioritizing authorization of AI-based cloud services for federal workers |
| **Timeline** | Consolidated Rules 2026 (CR26) launching May 2026 with 2.5-year roadmap |

**Requirements for AI Services:**

| Requirement | Detail |
|-------------|--------|
| Enterprise-grade features | SSO, SCIM provisioning, RBAC, real-time analytics |
| GSA Multiple Award Schedule | Must be in MAG program |
| FedRAMP 20x pilot authorization | Must be achievable within 2 months of qualification |
| FedRAMP certification classes | Replacing impact levels; available via agency authorization or program certification |

**Altrace Relevance:** HIGH for government market. Altrace's RBAC, SSO readiness (pending SCIM), real-time metrics, and audit logging align with FedRAMP requirements. FedRAMP authorization would open the federal government market. However, this is a significant investment (6-12 months, $200K+).

---

## 5. US State-Level Landscape

The US state landscape is the most complex regulatory terrain for AI governance. Despite the December 2025 Executive Order attempting to preempt state laws, these laws remain enforceable until Congress or courts intervene.

### Active State AI Laws (Effective 2026)

| State | Law | Effective | Key Requirement | Private Right of Action |
|-------|-----|-----------|-----------------|------------------------|
| **Colorado** | Colorado AI Act (SB24-205) | **June 30, 2026** (extended from Feb 1) | Risk management policy, impact assessments, annual review, consumer notification for consequential decisions, 90-day AG disclosure for algorithmic discrimination | No (AG enforcement) |
| **Texas** | TRAIGA | January 1, 2026 | Prohibits discriminatory AI; sandbox program; no private right of action; disparate impact alone insufficient | No |
| **Illinois** | Human Rights Act AI amendments | January 1, 2026 | Prohibits AI-based employment discrimination on protected class | **Yes** |
| **Utah** | AI disclosure law | Effective | Disclosure when consumers interact with generative AI; AI learning laboratory | No |
| **Connecticut** | AI impact assessment law | Effective | Impact assessments for state agencies using AI | No |

**Federal Preemption Uncertainty:** The December 2025 EO created an AI litigation task force, but the EO itself cannot override state law. Organizations must comply with applicable state laws until definitive judicial or legislative resolution.

**Altrace Relevance:** HIGH. The patchwork of state laws creates exactly the compliance complexity that makes governance tooling essential. Altrace's audit logging, attribution, and risk management features help enterprises demonstrate "reasonable care" across multiple state jurisdictions simultaneously.

---

## 6. Altrace Compliance Mapping

### Master Mapping Table

| Regulatory Requirement | EU AI Act | NIST AI RMF | ISO 42001 | SOC 2 (2026) | HIPAA | PCI DSS | DORA | Singapore Agentic | Colorado AI Act | South Korea AI Basic Act |
|------------------------|-----------|-------------|-----------|---------------|-------|---------|------|-------------------|-----------------|--------------------------|
| **Risk management system** | Art. 9 | GOVERN/MAP | Clause 6 | Security | -- | -- | Pillar 1 | Dim. 1 | Required | High-impact AI |
| **Audit logging** | Art. 12 | MEASURE | Clause 9 | Processing Integrity | Required | Req 10 | Pillar 2 | Dim. 3 | Impact assessment | -- |
| **Human oversight** | Art. 14 | MANAGE | Annex A | -- | -- | -- | -- | Dim. 2 | -- | -- |
| **Kill switch / emergency stop** | Art. 14 | MANAGE | Annex A | Availability | -- | -- | Pillar 3 | Dim. 2 | -- | High-impact AI |
| **Cost tracking / budgets** | -- | MEASURE | Clause 8 | -- | -- | -- | -- | -- | -- | -- |
| **Content governance** | Art. 9, 15 | MAP | Annex A | Confidentiality | Minimum necessary | Req 3, 4 | -- | Dim. 3 | -- | Generative AI |
| **Attribution / traceability** | Art. 12, 13 | GOVERN | Clause 7 | Security | Audit logs | Req 10 | Pillar 2 | Dim. 4 | Consumer notification | Transparency |
| **Access control / RBAC** | Art. 15 | GOVERN | Clause 7 | Security | Required | Req 7 | Pillar 1 | Dim. 3 | -- | -- |
| **Fail-closed / resilience** | Art. 15 | MANAGE | Clause 8 | Availability | -- | -- | Pillar 3 | Dim. 3 | -- | -- |
| **Tamper-evident records** | Art. 12 | MEASURE | Clause 9 | Processing Integrity | -- | Req 10 | Pillar 2 | -- | -- | -- |
| **Transparency / explainability** | Art. 13 | GOVERN | Annex A | -- | -- | -- | -- | Dim. 4 | Consumer notification | Required |
| **Tool permission enforcement** | -- | MAP | Annex A | -- | Least privilege | Req 7 | -- | Dim. 1 | -- | -- |
| **Behavioral monitoring** | Art. 9 | MEASURE | Clause 9 | Security | -- | -- | Pillar 1 | Dim. 3 | Annual review | -- |
| **Incident response** | Art. 9 | MANAGE | Clause 10 | Availability | Breach notification | Req 12 | Pillar 2 | -- | 90-day AG disclosure | -- |

### Altrace Feature-to-Regulation Coverage

| Altrace Feature | Regulations Addressed |
|-----------------|----------------------|
| Kill switches (global/team/agent) | EU AI Act Art. 14, NIST MANAGE, ISO 42001 Annex A, Singapore Dim. 2 |
| Budget enforcement + pre-reservation | NIST MEASURE, ISO 42001 Clause 8, SOX (cost controls) |
| SHA-256 tamper-evident audit chain | EU AI Act Art. 12, SOC 2 Processing Integrity, PCI DSS Req 10, DORA Pillar 2 |
| 18-stage decision chain | EU AI Act Art. 9, NIST GOVERN/MAP, ISO 42001 Clause 6, Colorado AI Act |
| Content governance (RE2 classification) | EU AI Act Art. 9/15, HIPAA minimum necessary, PCI DSS Req 3/4 |
| RBAC (4 roles) | EU AI Act Art. 15, SOC 2 Security, HIPAA, PCI DSS Req 7, FedRAMP |
| Approval gates (human-in-the-loop) | EU AI Act Art. 14, NIST MANAGE, Singapore Dim. 2, ISO 42001 Annex A |
| Graduated enforcement (5-level) | NIST MANAGE, ISO 42001 Clause 10, Singapore Dim. 3 |
| Evidence-grounded validation | NIST MAP, ISO 42001 Clause 8, Singapore Dim. 1 |
| Self-repair feedback | NIST MANAGE, Singapore Dim. 4 (transparency) |
| Shadow AI discovery | NIST MAP, ISO 42001 Clause 9, SOC 2 Security |
| Behavioral fingerprinting | NIST MEASURE, ISO 42001 Clause 9, SOC 2 Security |
| MCP server/tool registry | NIST MAP, Singapore Dim. 1 (tool guardrails) |
| Attribution (team/agent/cost-center) | EU AI Act Art. 12/13, NIST GOVERN, SOC 2, HIPAA, PCI DSS Req 10 |
| Fail-closed semantics | EU AI Act Art. 15, NIST MANAGE, DORA Pillar 3 |
| DSAR/erasure capability | GDPR Art. 17, DPDP Act (India), ISO 42001 Annex A |
| Prometheus metrics + structured logging | NIST MEASURE, ISO 42001 Clause 9, SOC 2, DORA Pillar 1 |
| Kernel-level enforcement (iptables) | EU AI Act Art. 15 (cybersecurity), unique to Altrace |

---

## 7. Gap Analysis

### 7.1 Critical Gaps (P0 -- Must Address for Market Entry)

| Gap | Why Critical | Regulatory Driver | Effort | Cost |
|-----|-------------|-------------------|--------|------|
| **SOC 2 Type II certification** | US enterprise buyers require it as procurement gate. 2026 TSC adds AI-specific controls. | SOC 2, FedRAMP, enterprise procurement | 6-12 months observation period | $30-50K |
| **ISO 42001 certification** | EU enterprise buyers increasingly require it. Demonstrates AI governance competence. | EU AI Act (supporting evidence), enterprise procurement | 3-6 months preparation + audit | $30-80K |
| **Conformity assessment documentation** | EU AI Act Art. 43 requires documented conformity assessment for high-risk systems. Altrace must provide artifacts that help deployers demonstrate this. | EU AI Act (Aug 2026 deadline) | 2-4 weeks documentation | Internal |
| **SCIM provisioning** | FedRAMP and enterprise SSO requirements. Called out specifically in FedRAMP 20x AI priorities. | FedRAMP, SOC 2 | 2-3 weeks | Internal |

### 7.2 Important Gaps (P1 -- Address Within 6 Months)

| Gap | Why Important | Regulatory Driver | Effort | Cost |
|-----|--------------|-------------------|--------|------|
| **NIST AI RMF mapping document** | US enterprise sales artifact. Maps Altrace features to NIST functions/subcategories. | NIST AI RMF (voluntary but expected) | 1-2 weeks | Internal |
| **EU AI Act deployer compliance guide** | Customer-facing document showing how Altrace helps deployers meet Art. 26 obligations. | EU AI Act (Aug 2026) | 1-2 weeks | Internal |
| **SIEM export (Splunk/Datadog/Elastic)** | Enterprise SOC teams need log integration. Required for SOC 2 continuous monitoring and DORA Pillar 2. | SOC 2, DORA, enterprise SOC | 1-2 weeks | Internal |
| **Data processing agreement template** | GDPR/DPDP Act require clear data processing agreements. Altrace's "no data storage" model makes this straightforward. | GDPR, DPDP Act, EU AI Act | 1 week legal | Internal + legal review |
| **Singapore Agentic AI framework alignment doc** | Singapore is a strategic reference market for agentic AI governance. | Singapore MGF Agentic AI | 1 week | Internal |

### 7.3 Strategic Gaps (P2 -- Address Within 12 Months)

| Gap | Why Strategic | Regulatory Driver | Effort | Cost |
|-----|--------------|-------------------|--------|------|
| **FedRAMP authorization** | Opens US federal government market. AI services being fast-tracked. | FedRAMP 20x | 6-12 months | $200K+ |
| **HIPAA BAA template** | Healthcare market requires BAA. Altrace's architecture (no PHI storage) simplifies this. | HIPAA | 2-4 weeks legal | Legal review |
| **TypeScript SDK** | EU AI Act Art. 13 transparency + self-repair feedback need SDK integration. First-mover. | EU AI Act (transparency), Singapore (transparency) | 2-3 weeks | Internal |
| **Colorado AI Act compliance toolkit** | Impact assessment templates, annual review documentation. | Colorado AI Act (June 30, 2026) | 2 weeks | Internal |
| **South Korea local agent designation guidance** | Customers operating in Korea need to understand agent requirements. | South Korea AI Basic Act | 1 week | Internal |

### 7.4 Non-Gaps (Already Addressed)

| Capability | Regulatory Requirement | Altrace Status |
|------------|----------------------|----------------|
| Tamper-evident audit logging | EU AI Act Art. 12, SOC 2, PCI DSS | SHA-256 hash chain -- DONE |
| Human oversight / kill switches | EU AI Act Art. 14, NIST MANAGE | 3-tier hierarchy -- DONE |
| Risk management system | EU AI Act Art. 9, NIST GOVERN/MAP | 18-stage decision chain -- DONE |
| Content classification | EU AI Act Art. 9, HIPAA, PCI DSS | RE2 ephemeral classification -- DONE |
| Access control / RBAC | EU AI Act Art. 15, SOC 2, HIPAA | 4-role RBAC -- DONE |
| Fail-closed behavior | EU AI Act Art. 15, DORA | All error paths fail-closed -- DONE |
| Cost tracking / attribution | NIST MEASURE, SOC 2 | Budget enforcement + attribution -- DONE |
| Behavioral monitoring | NIST MEASURE, SOC 2, DORA | Shadow AI discovery + fingerprinting -- DONE |
| Data minimization / privacy | GDPR, HIPAA, DPDP Act | No content storage (I-4) -- DONE |
| CWE-mapped security hardening | SOC 2, PCI DSS, NIST CSF | 369 CWE-tagged comments -- DONE |
| Compliance framework mapping | ISO 42001, NIST AI RMF, EU AI Act, MITRE ATLAS, OWASP LLM Top 10 | Mapped -- DONE |

---

## 8. Timeline of Critical Deadlines

```
2026
 |
 Jan 1  -- Texas TRAIGA effective
 |         Illinois AI employment discrimination effective
 |         China revised Cybersecurity Law effective
 Jan 22 -- South Korea AI Basic Act effective
 |         Singapore Agentic AI Framework launched
 Feb 1  -- [Original Colorado AI Act date, extended to June 30]
 Feb 20 -- India IT Rules Amendment 2026 effective
 Mar 11 -- US: FTC AI policy statement due
 |         US: Commerce Dept "onerous" state AI laws evaluation due
 May    -- FedRAMP CR26 launch
 Jun 30 -- Colorado AI Act effective (extended date)
 |
 >>> AUG 2 -- EU AI ACT: HIGH-RISK AI OBLIGATIONS ENFORCEABLE <<<
 |
 ~Q4    -- Brazil Chamber of Deputies vote expected
 |
2027
 |
 ~Jan   -- South Korea: grace period ends, administrative fines possible
 Aug 2  -- EU AI Act: Annex I (safety component) obligations enforceable
 |
 Spring -- UK AI Bill possible (if included in King's Speech)
```

---

## 9. Recommendations

### Immediate (Before August 2, 2026)

1. **Start SOC 2 Type II observation period NOW.** The 6-12 month period means starting in March 2026 to be certified by Q1 2027 at latest. This is the single most impactful business action.

2. **Produce an EU AI Act Deployer Compliance Guide.** Customer-facing document mapping Altrace features to Articles 8-15 and 26. This is a sales-critical artifact for the August 2026 deadline.

3. **Produce a NIST AI RMF mapping document.** Map every Altrace feature to NIST AI RMF functions and subcategories. This is table stakes for US enterprise sales.

4. **Complete SCIM provisioning (P0-2).** FedRAMP 20x specifically calls out SCIM as a requirement for AI cloud services.

5. **Ship SIEM export.** SOC 2 continuous monitoring and DORA Pillar 2 both require log integration with enterprise SOC tools.

### Medium-Term (Q3-Q4 2026)

6. **Begin ISO 42001 certification preparation.** EU enterprise buyers are increasingly asking for this. 3-6 month preparation timeline.

7. **Produce a Singapore Agentic AI Framework alignment document.** Singapore's framework is the world's first agentic AI governance framework and reads like an Altrace feature list. Strong reference market.

8. **Produce a Colorado AI Act compliance toolkit.** Impact assessment templates and annual review documentation that customers can use with Altrace.

9. **Ship TypeScript SDK.** EU AI Act transparency requirements and self-repair feedback need SDK integration for the JavaScript/TypeScript ecosystem.

### Strategic (2027+)

10. **Evaluate FedRAMP authorization.** If government pipeline justifies the $200K+ investment and 6-12 month timeline.

11. **Monitor Brazil AI bill passage.** If passed, prepare compliance mapping for the Brazilian market.

12. **Monitor UK AI Bill.** If introduced in Spring 2026 King's Speech, prepare compliance mapping immediately.

13. **Track South Korea enforcement decree details.** MSIT is finalizing technical details that will determine specific compliance requirements.

---

## 10. Sources

### EU AI Act
- [Article 6: Classification Rules for High-Risk AI Systems](https://artificialintelligenceact.eu/article/6/)
- [EU AI Act 2026 Updates: Compliance Requirements and Business Risks](https://www.legalnodes.com/article/eu-ai-act-2026-updates-compliance-requirements-and-business-risks)
- [EU AI Act 2026 Compliance Guide: Key Requirements Explained](https://secureprivacy.ai/blog/eu-ai-act-2026-compliance)
- [The EU AI Act: 6 Steps to Take Before 2 August 2026](https://www.orrick.com/en/Insights/2025/11/The-EU-AI-Act-6-Steps-to-Take-Before-2-August-2026)
- [Article 9: Risk Management System](https://artificialintelligenceact.eu/article/9/)
- [Article 12: Record-Keeping](https://artificialintelligenceact.eu/article/12/)
- [Article 26: Obligations of Deployers of High-Risk AI Systems](https://artificialintelligenceact.eu/article/26/)
- [Article 99: Penalties](https://artificialintelligenceact.eu/article/99/)
- [High-level summary of the AI Act](https://artificialintelligenceact.eu/high-level-summary/)
- [AI Act -- Shaping Europe's digital future](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [EU and Luxembourg Update on the European Harmonised Rules on AI](https://www.klgates.com/EU-and-Luxembourg-Update-on-the-European-Harmonised-Rules-on-Artificial-IntelligenceRecent-Developments-1-20-2026)
- [Latest wave of obligations under the EU AI Act take effect](https://www.dlapiper.com/en-us/insights/publications/2025/08/latest-wave-of-obligations-under-the-eu-ai-act-take-effect)

### United States -- Federal
- [New State AI Laws are Effective on January 1, 2026, But a New Executive Order Signals Disruption](https://www.kslaw.com/news-and-insights/new-state-ai-laws-are-effective-on-january-1-2026-but-a-new-executive-order-signals-disruption)
- [Examining the Landscape and Limitations of the Federal Push to Override State AI Regulation](https://www.ropesgray.com/en/insights/alerts/2026/03/examining-the-landscape-and-limitations-of-the-federal-push-to-override-state-ai-regulation)
- [What to Expect in AI Regulation in 2026](https://www.cyberadviserblog.com/2026/01/what-to-expect-in-ai-regulation-in-2026/)
- [Unpacking the December 11, 2025 Executive Order](https://www.sidley.com/en/insights/newsupdates/2025/12/unpacking-the-december-11-2025-executive-order)
- [President Trump Signs Executive Order Challenging State AI Laws](https://www.paulhastings.com/insights/client-alerts/president-trump-signs-executive-order-challenging-state-ai-laws)

### United States -- State
- [Colorado SB24-205 Consumer Protections for Artificial Intelligence](https://leg.colorado.gov/bills/sb24-205)
- [Colorado's Landmark AI Law Coming Online](https://www.bhfs.com/insight/colorados-landmark-ai-law-coming-online-what-developers-and-deployers-should-know/)
- [Several State AI Laws Set to Go into Effect in 2026](https://www.lexology.com/library/detail.aspx?g=f3f1f522-ca61-4ebe-93d2-8d632ec01647)
- [Artificial Intelligence Regulations: State and Federal AI Laws 2026](https://drata.com/blog/artificial-intelligence-regulations-state-and-federal-ai-laws-2026)
- [US State AI Law Tracker](https://ai-law-center.orrick.com/us-ai-law-tracker-see-all-states/)

### China
- [AI Watch: Global regulatory tracker -- China](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-china)
- [Global AI Governance Law and Policy: China](https://iapp.org/resources/article/global-ai-governance-china)
- [China Releases New Labeling Requirements for AI-Generated Content](https://www.insideprivacy.com/international/china/china-releases-new-labeling-requirements-for-ai-generated-content/)
- [Cybersecurity Laws and Regulations Report 2026 -- China](https://iclg.com/practice-areas/cybersecurity-laws-and-regulations/01-generative-ai-and-cyber-risk-in-china)

### United Kingdom
- [AI Watch: Global regulatory tracker -- United Kingdom](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-united-kingdom)
- [UK tech and digital regulatory policy in 2026](https://www.taylorwessing.com/en/interface/2025/predictions-2026/uk-tech-and-digital-regulatory-policy-in-2026)
- [AI Regulation in the UK and EU: Frameworks, Implementation, Enforcement](https://www.francescatabor.com/articles/2026/2/4/ai-regulation-in-the-uk-and-eu-frameworks-implementation-enforcement-and-comparative-outcomes)

### South Korea
- [South Korea's AI Basic Act: Overview and Key Takeaways](https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways)
- [South Korea Artificial Intelligence (AI) Basic Act](https://www.trade.gov/market-intelligence/south-korea-artificial-intelligence-ai-basic-act)
- [South Korea: Comprehensive AI Legal Framework Takes Effect](https://www.loc.gov/item/global-legal-monitor/2026-02-20/south-korea-comprehensive-ai-legal-framework-takes-effect)
- [Understanding South Korea's New AI Law](https://www.littler.com/news-analysis/asap/understanding-south-koreas-new-ai-law-key-considerations-multinational-employers)

### Canada
- [The Death of Canada's Artificial Intelligence and Data Act](https://montrealethics.ai/the-death-of-canadas-artificial-intelligence-and-data-act-what-happened-and-whats-next-for-ai-regulation-in-canada/)
- [Canada's 2026 privacy priorities](https://www.osler.com/en/insights/reports/2025-legal-outlook/canadas-2026-privacy-priorities-data-sovereignty-open-banking-and-ai/)
- [AI Watch: Global regulatory tracker -- Canada](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-canada)

### Japan
- [Understanding Japan's AI Promotion Act](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)
- [Japan AI Regulation 2026: Major Policy Shift](https://ainewsdesk.app/japan-ai-regulation-2026/)
- [Japan's emerging framework for responsible AI](https://www.ibanet.org/japan-emerging-framework-ai-legislation-guidelines)
- [AI Watch: Global regulatory tracker -- Japan](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-japan)

### Singapore
- [Singapore Launches New Model AI Governance Framework for Agentic AI](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/new-model-ai-governance-framework-for-agentic-ai)
- [Singapore: Governance Framework for Agentic AI Launched](https://www.bakermckenzie.com/en/insight/publications/2026/01/singapore-governance-framework-for-agentic-ai-launched)
- [Model AI Governance Framework for Agentic AI (PDF)](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf)
- [Singapore's New Model AI Governance Framework for Agentic AI (2026)](https://www.klgates.com/Singapores-New-Model-AI-Governance-Framework-for-Agentic-AI-2026-Client-Alert-2-9-2026)

### Brazil
- [Brazil AI Act](https://artificialintelligenceact.com/brazil-ai-act/)
- [Brazil: Senate passes AI bill](https://www.dataguidance.com/news/brazil-senate-passes-ai-bill)
- [What to Expect from Brazil on Tech Policy in 2026](https://www.techpolicy.press/what-to-expect-from-brazil-on-tech-policy-in-2026/)
- [AI Watch: Global regulatory tracker -- Brazil](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-brazil)

### India
- [AI Laws and Regulations in India as of 2026](https://www.prashantmali.com/cyber-law-blog-india/ai-laws-and-regulations-in-india-as-of-2026)
- [India's 2026 IT Rules Amendment: Regulating AI-Generated Content](https://www.lexology.com/library/detail.aspx?g=adb2714c-1188-43e3-b62b-eb6649727f6e)
- [Global Firms Face Legal Risks Under India's 2026 AI Regulation](https://www.india-briefing.com/news/india-ai-regulation-2026-foreign-platform-compliance-42745.html/)
- [AI Watch: Global regulatory tracker -- India](https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-india)

### Australia
- [Australia launches new AI guidance](https://www.whitecase.com/insight-alert/australia-launches-new-ai-guidance)
- [Why Australia Abandoned Mandatory AI Guardrails](https://www.softwareseni.com/why-australia-abandoned-mandatory-ai-guardrails-for-technology-neutral-regulation-and-what-it-means/)
- [Introducing mandatory guardrails for AI in high-risk settings (abandoned)](https://consult.industry.gov.au/ai-mandatory-guardrails)

### ISO 42001
- [ISO/IEC 42001:2023 -- AI management systems](https://www.iso.org/standard/42001)
- [ISO 42001: Complete Guide to AI Management Systems (2026)](https://orbit.reconn.io/iso-42001/)
- [How to Assess and Treat AI Risks with ISO/IEC 42001:2023](https://www.schellman.com/blog/iso-certifications/how-to-assess-and-treat-ai-risks-and-impacts-with-iso42001)
- [ISO 42001: Auditing and Implementing Framework](https://cloudsecurityalliance.org/blog/2025/05/08/iso-42001-lessons-learned-from-auditing-and-implementing-the-framework)
- [AI lifecycle risk management: ISO/IEC 42001 for AI governance (AWS)](https://aws.amazon.com/blogs/security/ai-lifecycle-risk-management-iso-iec-420012023-for-ai-governance/)

### NIST AI RMF
- [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI RMF 2025 Updates](https://www.ispartnersllc.com/blog/nist-ai-rmf-2025-updates-what-you-need-to-know-about-the-latest-framework-changes/)
- [NIST AI Risk Management Framework (AI RMF 1.0): Complete Guide 2026](https://www.libertify.com/interactive-library/nist-ai-risk-management-framework-guide/)

### SOC 2
- [How AI Agents Impact SOC 2 Trust Services Criteria](https://goteleport.com/blog/ai-agents-soc-2/)
- [What Changed in SOC 2 for 2026? New Criteria and Audit Updates](https://www.konfirmity.com/blog/soc-2-what-changed-in-2026)
- [Representing AI Controls in Your SOC 2 Report](https://www.mossadams.com/articles/2025/12/ai-controls-for-soc-2-reports)
- [AI Governance Meets Compliance -- PCI, SOC 2, HITRUST, and ISO 27001](https://www.compliancepoint.com/assurance/ai-governance-meets-compliance-how-ai-is-reshaping-pci-soc-2-hitrust-and-iso-27001/)

### HIPAA
- [HRx: New Year, New AI Rules: Healthcare AI Laws Now in Effect](https://www.akerman.com/en/perspectives/hrx-new-year-new-ai-rules-healthcare-ai-laws-now-in-effect.html)
- [HIPAA, Healthcare Data, and Artificial Intelligence](https://www.hipaajournal.com/hipaa-healthcare-data-and-artificial-intelligence/)
- [HIPAA Compliant AI: 2026 Guide for Healthcare Teams](https://www.getprosper.ai/blog/hipaa-compliant-ai-guide-healthcare)

### PCI DSS
- [AI Principles: Securing the Use of AI in Payment Environments](https://blog.pcisecuritystandards.org/ai-principles-securing-the-use-of-ai-in-payment-environments)
- [New Guidance: Integrating Artificial Intelligence into PCI Assessments](https://blog.pcisecuritystandards.org/new-guidance-integrating-artificial-intelligence-into-pci-assessments)
- [AI and PCI DSS v4: New Compliance Demands](https://www.vikingcloud.com/blog/pci-v4-impact-of-ai)

### DORA
- [DORA regulation -- European Insurance and Occupational Pensions Authority](https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en)
- [What to Expect: January 2026 DORA Review and Supervision](https://www.quodorbis.com/what-to-expect-january-2026-dora-review-and-supervision/)
- [DORA Compliance 2026: What Financial Services Firms Need to Know](https://vantagepoint.io/blog/sf/dora-compliance-2026-what-financial-services-firms-need-to-know-about-digital-operational-resilience)

### FedRAMP
- [FedRAMP AI](https://www.fedramp.gov/ai/)
- [GSA and FedRAMP Announce Major Initiative: Prioritizing 20x Authorizations for AI Cloud Solutions](https://www.gsa.gov/about-us/newsroom/news-releases/gsa-fedramp-prioritize-20x-authorizations-for-ai-08252025)
- [FedRAMP is Fast-Tracking AI Tools for Government Use](https://www.paramify.com/blog/ai-fedramp)

### SOX
- [SOX 404 Compliance in 2026: Essential Controls for CFOs](https://www.knowcraftanalytics.com/sox-404-compliance/)
- [SOX Compliance 2026: A New Era of Financial Data Transparency](https://safebooks.ai/resources/sox-compliance/sox-compliance-a-new-era-of-financial-data-transparency/)

### Enterprise Landscape
- [AI Risk and Compliance 2026: Enterprise Governance Overview](https://secureprivacy.ai/blog/ai-risk-compliance-2026)
- [AI Governance: Framework, Compliance and Operational Guide (2026)](https://www.ethyca.com/news/ai-governance)
- [Latest AI Regulations Update: What Enterprises Need to Know in 2026](https://www.credo.ai/blog/latest-ai-regulations-update-what-enterprises-need-to-know)
- [2026 Operational Guide to Cybersecurity, AI Governance and Emerging Risks](https://www.corporatecomplianceinsights.com/2026-operational-guide-cybersecurity-ai-governance-emerging-risks/)
