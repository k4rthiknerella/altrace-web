# Altrace Architecture Diagrams

## 1. High-Level: Agent Traffic Flow

```mermaid
flowchart LR
    subgraph Agent["AI Agent Pod"]
        A[Agent Application]
    end

    subgraph Altrace["Altrace Sidecar"]
        direction TB
        IPT[iptables REDIRECT<br/>Kernel-Level Enforcement]
        PROXY[Transparent Proxy<br/>HTTP/HTTPS]
        CHAIN[33-Stage Decision Chain]
        DETECT[6-Layer Detection Engine]
        ENF[Enforcement Actions]
    end

    subgraph Providers["LLM Providers"]
        ANT[Anthropic]
        OAI[OpenAI]
        GEM[Gemini]
    end

    A -->|All traffic forced| IPT
    IPT --> PROXY
    PROXY --> CHAIN
    CHAIN --> DETECT
    DETECT --> ENF
    ENF -->|Allow| Providers
    ENF -->|Block| A

    style IPT fill:#e74c3c,color:#fff
    style CHAIN fill:#3498db,color:#fff
    style DETECT fill:#2ecc71,color:#fff
    style ENF fill:#f39c12,color:#fff
```

## 2. Decision Chain (33 Stages)

```mermaid
flowchart TD
    subgraph Core["Core (0-1)"]
        D0[delegation]
        D1[manifest]
    end

    subgraph Ingress["Ingress Filter (2)"]
        D2[ingress_scan<br/>Prompt Injection Detection]
    end

    subgraph Access["Access Control (3-8)"]
        D3[policy]
        D4[model_filter]
        D5[mcp_registry]
        D6[mcp_reputation]
        D7[mcp_fingerprint]
        D8[mcp_attestation]
    end

    subgraph MCP["MCP Governance (9-14)"]
        D9[mcp_poisoning<br/>89 patterns]
        D10[tool_perm]
        D11[tbac + DAPC-1<br/>Dynamic Parameter Constraints]
        D12[evidence_grounding]
        D13[action_level]
        D14[approval_gate]
    end

    subgraph Budget["Budget & Risk (15-18)"]
        D15[cost_tool]
        D16[dow_breaker]
        D17[trust_contagion]
        D18[network_trust]
    end

    subgraph Content["Content Governance (19-25)"]
        D19[frontier]
        D20[taint_flow]
        D21[ssn_guard]
        D22[rtl_guard]
        D23[content_gov]
        D24[chain_detect]
        D25[prompt_registry]
    end

    subgraph Policy["Policy Engines (26-30)"]
        D26[external_classifier]
        D27[opa]
        D28[cedar]
        D29[cel]
        D30[allow_fallback]
    end

    Core --> Ingress --> Access --> MCP --> Budget --> Content --> Policy

    style Ingress fill:#e74c3c,color:#fff
    style MCP fill:#2ecc71,color:#fff
    style Content fill:#3498db,color:#fff
```

## 3. Detection Depth: 6 Independent Layers

```mermaid
flowchart TB
    subgraph Input["INPUT SIDE (Request)"]
        L1[Layer 1: RE2 Patterns<br/>299+ patterns across 3 surfaces<br/>Content + Injection + MCP Poisoning]
        L2[Layer 2: Statistical Signals<br/>Shannon Entropy + Char Distribution<br/>+ Base64 Decode-Attempt]
        L3[Layer 3: Session History<br/>Per-Session Injection Tracking<br/>Catches PAIR/TAP/BoN]
    end

    subgraph Output["OUTPUT SIDE (Response)"]
        L4[Layer 4: Response Injection<br/>7 SUCCESS Patterns<br/>DAN Ack / Prompt Leak / Exfil]
        L5[Layer 5: Label Mismatch<br/>Input vs Response Labels<br/>Goal Hijacking Detection]
        L6[Layer 6: Cross-Request C2<br/>URL Hash Tracking<br/>Fleet-Wide Attack Signals]
    end

    subgraph Fusion["EVIDENCE FUSION"]
        DS[Dempster-Shafer<br/>Yager's Rule<br/>Block on Plausibility]
    end

    L1 --> DS
    L2 --> DS
    L3 --> DS
    L4 --> DS
    L5 --> DS
    L6 --> DS

    DS -->|Plausibility >= threshold| BLOCK[BLOCK]
    DS -->|Below threshold| ALLOW[ALLOW]

    style L1 fill:#3498db,color:#fff
    style L2 fill:#9b59b6,color:#fff
    style L3 fill:#e67e22,color:#fff
    style L4 fill:#e74c3c,color:#fff
    style L5 fill:#1abc9c,color:#fff
    style L6 fill:#34495e,color:#fff
    style DS fill:#f39c12,color:#fff
```

## 4. DAPC-1: Dynamic Parameter Constraints

```mermaid
flowchart LR
    subgraph Detection["Detection Signals"]
        INJ[Injection Detected]
        TAINT[Session Tainted]
        BEHAV[Behavioral Anomaly]
    end

    subgraph Graduated["Graduated Enforcer"]
        N["NORMAL<br/>Full limits"]
        M["MONITOR<br/>50% limits"]
        T["THROTTLE<br/>25% limits"]
        B["BLOCK<br/>0% limits"]
        Q["QUARANTINE<br/>Kill switch"]
    end

    subgraph TBAC["TBAC Parameter Validation"]
        FORMULA["effectiveMax =<br/>base_max<br/>x risk_multiplier<br/>x min(taint_mults)"]
        CHECK["amount <= effectiveMax?"]
    end

    Detection -->|Score increase| Graduated
    N -->|score > 0.3| M
    M -->|score > 0.5| T
    T -->|score > 0.7| B
    B -->|score > 0.85| Q

    Graduated -->|level| FORMULA
    TAINT -->|multiplier| FORMULA
    FORMULA --> CHECK
    CHECK -->|Yes| ALLOW[Allow Tool Call]
    CHECK -->|No| DENY[Block: Malformed Transaction]

    style N fill:#2ecc71,color:#fff
    style M fill:#f39c12,color:#fff
    style T fill:#e67e22,color:#fff
    style B fill:#e74c3c,color:#fff
    style Q fill:#c0392b,color:#fff
```

## 5. Competitive Positioning

```mermaid
quadrantChart
    title Detection Depth vs Enforcement Strength
    x-axis "Weak Enforcement" --> "Strong Enforcement"
    y-axis "Shallow Detection" --> "Deep Detection"
    quadrant-1 "THE GOAL"
    quadrant-2 "Detect but can't stop"
    quadrant-3 "Neither"
    quadrant-4 "Stop but can't detect"
    "Altrace": [0.92, 0.78]
    "Cloudflare AI GW": [0.35, 0.90]
    "Azure Prompt Shields": [0.30, 0.85]
    "Pipelock": [0.25, 0.55]
    "Traefik Triple Gate": [0.45, 0.75]
    "Lakera Guard": [0.20, 0.95]
    "LLM Guard": [0.15, 0.70]
```

## 6. Swiss Cheese Model: Why 6 Layers Matter

```mermaid
flowchart LR
    ATK[Attack] --> S1

    subgraph S1["Layer 1<br/>RE2 Patterns"]
        H1["  "]
    end

    subgraph S2["Layer 2<br/>Statistical"]
        H2["  "]
    end

    subgraph S3["Layer 3<br/>Session"]
        H3["  "]
    end

    subgraph S4["Layer 4<br/>Response"]
        H4["  "]
    end

    subgraph S5["Layer 5<br/>Label Match"]
        H5["  "]
    end

    subgraph S6["Layer 6<br/>C2 Track"]
        H6["  "]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> SAFE[Safe]

    style S1 fill:#3498db,color:#fff
    style S2 fill:#9b59b6,color:#fff
    style S3 fill:#e67e22,color:#fff
    style S4 fill:#e74c3c,color:#fff
    style S5 fill:#1abc9c,color:#fff
    style S6 fill:#34495e,color:#fff
```
