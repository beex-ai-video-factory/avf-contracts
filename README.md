# Contracts & Typed Schemas (R01_contracts)

**Repository ID:** `R01`  
**Architectural Layer:** `Layer 0`  
**Status:** `INITIALIZED`  
**Frozen Blueprint:** [`01_FROZEN_RELEASE/v1.0.0/FROZEN_SPEC_CANDIDATE/03_repo_blueprints/R01_CONTRACTS.md`](file:////Applications/XAMPP/xamppfiles/htdocs/AGENTIC/AVF_SPEC_REVIEW/01_FROZEN_RELEASE/v1.0.0/FROZEN_SPEC_CANDIDATE/03_repo_blueprints/R01_CONTRACTS.md)

---

## 1. Responsibility & Domain Boundaries

### OWNS:
- Canonical JSON Schemas (`02_contracts/*.schema.json`).
- Generated TypeScript type definitions and interfaces for all domain models and RPC payloads.
- Ajv / Zod runtime validation functions and schema compilation utilities.
- Positive and negative contract conformance test fixtures for CI verification.
- Standard AVF error taxonomy schemas and normalized error code definitions.

### DOES NOT OWN:
- Runtime state storage or database connections (owned exclusively by `R02_core_state`).
- Business logic execution, saga workflows, or service orchestration.
- Provider adapters, direct network calls, or browser automation.
- Media transcoding, stitching, or quality assessment.

---

## 2. Primary Contracts & Schemas
- `02_contracts/domain-entities.schema.json`
- `02_contracts/event-envelope.schema.json`
- `02_contracts/provider-request.schema.json`
- `02_contracts/provider-result.schema.json`
- `02_contracts/browser-command.schema.json`
- `02_contracts/flow-execution-result.schema.json`

---

## 3. Dependency Envelopes & Architectural Constraints

- **Allowed Inbound Dependencies:** `R02`, `R03`, `R04`, `R05`, `R06`, `R07`, `R08`, `R09`, `R10`, `R11`, `R12`, `R13`, `R14`, `R15`
- **Allowed Outbound Dependencies:** *(None)*

### Forbidden Dependencies:
- `R02` through `R15` (Zero upstream dependencies; strictly foundational Layer 0)
- Direct database connections or external service SDKs

---

## 4. Expected Deliverables & Artifacts
npm/ts contract package with JSON schemas, generated TS types, and validation test fixtures.

---

## 5. Invariants, Conformance & Testing

- **Invariants:** Must preserve system invariants INV-001 through INV-012.
- **Error Taxonomy:** Defines and exports the 9 standard AVF error codes (`PROVIDER_RATE_LIMIT`, `AUTH_REQUIRED`, `SECURITY_CHALLENGE`, `UI_CHANGED`, `BUDGET_EXHAUSTED`, `UNSUPPORTED_CAPABILITY`, `NETWORK_TIMEOUT`, `BAD_REQUEST`, `PROVIDER_INTERNAL_ERROR`).
- **Test Coverage:** Branch coverage >= 85% with positive and negative schema validation test fixtures.
- **Observability:** Compatible with OpenTelemetry tracing and event envelope structure.

---
*Initialized as an independent polyrepo in accordance with AVF Architecture Baseline v1.0.0.*
