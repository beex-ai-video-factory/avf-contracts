# @avf/contracts (R01_contracts)

**Repository ID:** `R01`  
**Architectural Layer:** `Layer 0 (Foundation)`  
**Status:** `IMPLEMENTED`  
**Package Name:** `@avf/contracts`  
**Frozen Blueprint:** [`01_FROZEN_RELEASE/v1.0.0/FROZEN_SPEC_CANDIDATE/03_repo_blueprints/R01_CONTRACTS.md`](file:////Applications/XAMPP/xamppfiles/htdocs/AGENTIC/AVF_SPEC_REVIEW/01_FROZEN_RELEASE/v1.0.0/FROZEN_SPEC_CANDIDATE/03_repo_blueprints/R01_CONTRACTS.md)  
**Implementation Plan:** [`PLAN.md`](file:////Applications/XAMPP/xamppfiles/htdocs/AGENTIC/AVF_SPEC_REVIEW/05_IMPLEMENTATION/repos/R01_contracts/PLAN.md)

---

## 1. Responsibility & Domain Boundaries

### OWNS:
- Canonical JSON Schemas (`schemas/*.schema.json`) conforming strictly to JSON Schema Draft 2020-12 / Draft-07.
- Automated TypeScript type generation toolchain (`json-schema-to-typescript`).
- Strongly-typed discriminated union interfaces for all 10 `FlowExecutionPort` operations.
- Runtime AJV validation functions (`validate*` and `assertValid*`) with detailed error reporting.
- Two-tier hierarchical state machine definition and transition guards (7 statuses, 17 execution stages).
- Standard AVF error taxonomy (9 canonical error codes) and retry classifications.
- Comprehensive positive and negative test fixtures ($\ge 4$ positive and $\ge 4$ negative per schema; 48 total).
- Common reusable `FlowExecutionPort` conformance test harness for Track A (Browser Worker) and Track B (FlowKit Bridge).

### DOES NOT OWN:
- Runtime state storage or database connections (owned exclusively by `R02_core_state`).
- Business logic execution, saga workflows, or service orchestration.
- Provider adapters, direct network calls, or browser automation.
- Media transcoding, stitching, or quality assessment.

---

## 2. Directory Layout

```text
R01_contracts/
├── .github/workflows/ci.yml         # CI pipeline
├── schemas/                         # Canonical JSON Schema files
│   ├── domain-entities.schema.json
│   ├── event-envelope.schema.json
│   ├── provider-request.schema.json
│   ├── provider-result.schema.json
│   ├── browser-command.schema.json
│   └── flow-execution-result.schema.json
├── src/
│   ├── index.ts                     # Unified entrypoint
│   ├── schemas/                     # Raw JSON schema constants
│   ├── types/                       # Compiled & custom TypeScript definitions
│   │   ├── domain.ts                # Domain models (Project, Shot, Take, etc.)
│   │   ├── events.ts                # Distributed event envelope
│   │   ├── provider.ts              # Provider request and result interfaces
│   │   ├── flow.ts                  # Discriminated FlowExecutionPort unions (10 ops)
│   │   ├── errors.ts                # 9 canonical error codes & retry categories
│   │   └── state-machine.ts         # Two-tier status & 17 execution stages
│   ├── validators/                  # AJV runtime validation helpers
│   ├── state-machine/               # State transition validation logic & guards
│   └── conformance/                 # Exportable FlowExecutionPort test suite
├── tests/
│   ├── fixtures/                    # 48 positive and negative JSON fixtures
│   ├── schema-validation.test.ts    # Meta-schema & URI validation
│   ├── fixtures.test.ts             # 100% fixture pass/rejection tests
│   ├── state-machine.test.ts        # 17-stage state machine matrix tests
│   ├── validators.test.ts           # Runtime validator unit tests
│   └── conformance-harness.test.ts  # Self-test of conformance test harness
└── scripts/
    ├── compile-schemas.ts           # Type generation automation
    └── validate-fixtures.ts         # Standalone CLI validator for fixtures
```

---

## 3. Available Scripts

- `npm run build`: Compiles TypeScript source code to `dist/`.
- `npm run build:types`: Compiles raw JSON Schemas to `.d.ts` definitions using `json-schema-to-typescript`.
- `npm run lint`: Runs ESLint across `src/` and `tests/`.
- `npm run validate:fixtures`: Validates all JSON fixtures against runtime AJV validators.
- `npm test`: Runs Jest test suite with 100% branch and statement coverage.

---

## 4. Conformance Test Harness Usage

Downstream execution worker packages (`R09_browser_worker` and `R10_flowkit_bridge`) verify semantic equivalence across all 10 `FlowExecutionPort` operations by importing and executing the common test suite:

```typescript
import { defineFlowExecutionPortConformanceSuite } from '@avf/contracts';
import { BrowserWorkerFlowExecutionPort } from './browser-port';

defineFlowExecutionPortConformanceSuite(
  () => new BrowserWorkerFlowExecutionPort(),
  { trackName: 'TRACK_A_BROWSER' }
);
```

---

## 5. Verification Results

- **Test Suites:** 5 passed (100%)
- **Tests:** 130 passed (100%)
- **Statement Coverage:** 100%
- **Branch Coverage:** 100%
- **Function Coverage:** 100%
- **Line Coverage:** 100%
- **Lint Errors/Warnings:** 0
