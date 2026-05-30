---
title: Deterministic Governance vs. ML Guardrails
slug: deterministic-governance-vs-ml-guardrails
date: 2026-05-21
author: Karthik Nerella
description: For enforcement, a decision you can read and reproduce beats a model you have to trust. Here is why, and where ML still earns its place.
tags: Deterministic, Governance
draft: false
---

There are two philosophies for keeping an AI agent inside the lines. One uses a model to judge each request. The other uses declared rules. For *enforcement*, the second wins, and it is worth being precise about why.

## The problem with a model that judges a model

An ML guardrail is itself a probabilistic system. It has false positives, false negatives, and a decision boundary you cannot fully enumerate. When it blocks a request, the answer to *"why?"* is a score. When it lets one through, the answer to *"why?"* is also a score. For a security control a CISO has to stand behind in an audit, "the classifier was 0.62 confident" is not a satisfying answer, and "we are not sure why it allowed that" is a finding.

## Determinism is auditability

A deterministic control is different: every block is a declared rule, evaluated the same way every time, reproducible after the fact. *This team's budget was exhausted. This tool was not on the allowlist. This action required evidence that was not gathered.* You can read the rule, test it, and prove it fired. That reproducibility is what makes governance **defensible**, not just functional.

So Altrace's enforcement core is deterministic by design. The decision that blocks a request is always a rule you can point to.

## "So you do not use ML at all?"

We do, and the distinction matters. ML belongs in **detection**, as a signal: is this text likely a prompt injection? Does this behavior deviate from the baseline? Those are fuzzy questions where a learned model genuinely helps. But the signal feeds a deterministic **decision**. The model can raise its hand; it does not get to be the judge.

> Deterministic enforcement, optional ML augmentation. The block is always a rule. The hint can be a model.

## Why this is the right split

- **Detection** wants recall against an open-ended adversary, a good place for learned signals.
- **Enforcement** wants reproducibility and zero ambiguity, a bad place for a black box.

Conflating the two gives you a guardrail that is hard to audit and easy to drift. Separating them gives you the best of both: learned signals where ambiguity is unavoidable, declared rules where accountability is non-negotiable.

When the question is *"can you prove what your AI is and is not allowed to do?"*, a determinate answer beats a confident one.
