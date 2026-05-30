---
title: MCP Is a Supply Chain Now
slug: mcp-is-a-supply-chain-now
date: 2026-04-30
author: Karthik Nerella
description: The Model Context Protocol turned tools into dependencies. That makes tool servers a supply chain — and they need supply-chain defenses.
tags: MCP, Supply Chain
draft: false
---

The Model Context Protocol did for agent tools what package registries did for code: it made capability something you pull in from somewhere else. That is powerful — and it imports the same problem package ecosystems spent two decades learning to fear. **Your tools are now a supply chain.**

## What changed

An agent with MCP does not just call functions you wrote. It connects to tool servers — some internal, some third-party — and trusts their descriptions, their schemas, and their results. Each connection is a dependency. And like any dependency, it can be malicious, compromised, or simply wrong.

## The new attack surface

A few of the failure modes the ecosystem has already seen:

- **Tool poisoning** — a tool description crafted to manipulate the agent into misusing it, or into leaking data through it.
- **Rug pulls** — a server that behaves during review and changes behavior later.
- **Confused-deputy access** — an agent with legitimate credentials tricked into using them on an attacker's behalf.
- **Hijacked servers** — a trusted public server compromised and turned against everyone who connects to it.

These are not hypothetical; the back half of 2025 produced a steady stream of MCP CVEs and real-world hijacks of well-known servers.

## Supply-chain problems want supply-chain defenses

The package world's answer was not "trust carefully." It was infrastructure: registries of known-good dependencies, provenance and attestation, reputation signals, and scanning. Agent tooling needs the same posture:

- **A registry** of which servers and tools are actually authorized — and a default-deny for everything else.
- **Reputation and fingerprinting** to notice when a server's behavior changes.
- **Attestation** so you can verify a server is what it claims to be.
- **Scanning** of tool descriptions for poisoning before an agent ever acts on them.

## Govern the tools, not just the model

It is tempting to put all governance on the model's prompts and outputs. But in an agentic system, the tools are where the capability — and the risk — actually lives. Governing the model while trusting every tool it connects to is like auditing your code while installing every dependency unread.

> Govern the tools your agents connect to the same way you would govern any other dependency.

MCP made agents far more useful. It also made tool security a supply-chain discipline. Treat it like one.
