---
title: Anatomy of the 2026 Agent Incidents
slug: anatomy-of-the-2026-agent-incidents
date: 2026-05-07
author: Karthik Nerella
description: Kiro, the $82K Gemini key, OpenClaw, 300 million leaked messages, four 2026 failures and the control each one was missing.
tags: Incidents, Security
draft: false
---

2026 has been a year of agents doing real damage in production. The specifics differ; the pattern does not. An autonomous system took an action no one could stop, see, or undo in time. Four cases, and the control each was missing.

## Kiro: action without authorization

In December 2025, Amazon's Kiro AI agent autonomously deleted and recreated a production AWS environment, without approval, causing a roughly 13-hour outage. The organization had a two-person approval process for changes like this. It just had not been extended to the AI.

**Missing control:** evidence and approval gates. A destructive action should be blocked until its prerequisites, including a human sign-off, where policy demands one, are satisfied.

## The $82,000 API key

In February 2026, a stolen API key ran up $82,314 in Gemini charges in roughly 48 hours, part of a much larger wave of unbudgeted agent spend that quarter.

**Missing control:** a hard budget checked *before* the call. A spend ceiling enforced in the request path turns a five-figure surprise into a blocked request.

## OpenClaw: no kill switch

An agent deleted more than 200 emails from a researcher's inbox. She typed "STOP" repeatedly. It kept going. There was no way to actually halt it.

**Missing control:** a real kill switch, one that stops traffic at the infrastructure layer, not a prompt the agent can ignore.

## 300 million messages

In January 2026, a misconfigured AI chat application exposed roughly 300 million messages, including PII and credentials, from millions of users.

**Missing control:** bidirectional content governance, including scanning what streams *back*. Sensitive data should be caught at the point it appears, and the stream cancelled there.

## The common thread

None of these were exotic attacks. They were ordinary failures of **enforcement**: a control that existed on paper but not in the request path. The lesson is not "watch your agents more closely", monitoring would have told you about every one of these *after* the damage. The lesson is that the control has to sit where it can say *no* before the action happens.

> The incidents already happened. The controls are the answer.

Every one of these was preventable with enforcement an agent cannot talk its way around.
