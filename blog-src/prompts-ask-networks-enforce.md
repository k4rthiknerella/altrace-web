---
title: Prompts Ask. Networks Enforce.
slug: prompts-ask-networks-enforce
date: 2026-05-28
author: Karthik Nerella
description: Prompt-based guardrails are requests an agent can ignore. Real governance lives below the application, in the network path every request has to cross.
tags: Enforcement, Governance
draft: false
---

Most "AI guardrails" are written in the same place the model reads its instructions: the prompt. That is a category error.

## A prompt is a request, not a control

When you put a rule in a system prompt — *never call the delete tool*, *never spend more than $500*, *never send data to an external host* — you are asking the model to behave. A cooperative model usually will. But governance is not for the cooperative case. It is for the jailbroken agent, the confused agent, the prompt-injected agent, the agent that finds a path you did not anticipate. A rule the agent can read is a rule the agent can rationalize around.

## Enforcement has to live where the agent cannot reach it

The fix is structural: move the control *below* the application, into the network path every request has to cross. At that layer the decision is not a suggestion — it is a gate. The request to overspend is refused before it reaches the provider. The connection to an unauthorized host is never established. The kill switch does not ask the agent to stop; it stops the traffic.

This is the difference between **asking** and **enforcing**, and it is the whole reason Altrace runs as a transparent proxy rather than a library you import. A library sits inside the application's trust boundary. A proxy below it does not.

> Monitoring tells you what an agent did. Altrace decides what it is allowed to do.

## What this looks like in practice

- **Budgets** are checked before the upstream call. Over the limit, the model is never invoked and nothing is spent.
- **Kill switches** block new requests synchronously and cancel active streams — and survive restarts.
- **Content governance** scans both directions; a policy violation cancels the stream at the point it appears.
- **Tool and action controls** deny what the contract did not allow, regardless of what the prompt says.

On Kubernetes, kernel-level network rules make this unbypassable — agents have no route around the proxy. (Docker is advisory; Fargate uses a gateway.) The idea is the same every time: do not ask the agent nicely. Put the control somewhere the agent cannot edit.

Prompts ask. Networks enforce.
