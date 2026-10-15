# Story39 corrected Fastify architecture — native SAR scoped request

Date: October15,2026 (America/Chicago). Tracked issue: https://github.com/kburson/AIVC/issues/39.

Artifact: docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md.
Artifact commit:200bb8c4680d22a1315e357ccf70dda19b7e451a.
Artifact SHA-256:8c74c0533d3debe88f3f4f475361b2d3df87a3752b9df6aa25c903cf0ff52d66.
Governing amended spec: docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md.
Spec commit:3e96c9e5734e2e940d849c3e1339bcb0f0592c97.
Spec SHA-256:7146781add44a11ba5f90371482901a645ffc4b14c8e8fa50ef23f3361270db4.

Owner steering during prior SAR materially corrected the target: Next.js serves UI/thin BFF; a standalone Fastify orchestrator owns STT/model/tools/retrieval/TTS; a separate Fastify lookup service remains. Future telephony calls core directly. Primary metrics and resource/worker/replica curves must measure Fastify orchestration directly, with lookup attribution and a bounded Next.js forwarding-overhead comparison.

Read the whole corrected plan and spec, predecessor reports/dispositions and predecessor-scope-status.md. Prior Next.js-owned scope stopped after two changes-requested rounds, not acceptance, when the owner changed the architecture. The outstanding open-residence and selected-slow/tail findings are carried into the corrected artifact and require independent closure verification. This request starts an explicitly declared materially changed architecture scope with at most three rounds, in the SAME native Astra/high session. Do not discard old findings or claim a third round on the old artifact passed. This is not a protocol supersede operation; native SAR has no sealed two-party state.

Requested selection remains gpt-6-astra/high. Write full analysis, prioritized required findings, optional observations, exact locations and actual decision in astra-sar-report.md in this subdirectory. Recheck architecture ownership/source prerequisites, direct-core/web/lookup definitions, actual Fastify lifecycle instrumentation and private-core/web-auth separation, streaming/abort/voice oracles, inference/calibration cost controls, complete finite inventory including residual open residence and slow/tail/web controls, count/hour consistency, statistical labels, implementation gates and scope. No application migration, benchmark or paid run is authorized by these documents.

Only exact report writes and your own AITM timing metadata are permitted. No Git commands, plan/spec/source edits, commits, pushes, issue mutation, installation or API/benchmark work. Coordinator has paused/released only its own occupancy before handoff; genuinely bind/resume #39, Explain, then pause/release only your own claim after the report. Preserve requested-selection versus provider-attestation caveats. Full analysis stays in durable documents; chat stays operational. Same session continues for subsequent rounds if needed; stop on acceptance or the new declared bound with unresolved findings explicit.
