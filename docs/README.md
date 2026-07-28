# Documentation Index — Sahm Real Estate Frontend

Lean documentation set for the implemented application. Read in this order.

---

## 1. Architecture

| # | Document | Description |
|---|----------|-------------|
| 1 | [overview.md](./architecture/overview.md) | Layers, dependency rules, high-level diagram |
| 2 | [folder-structure.md](./architecture/folder-structure.md) | Full `src/` tree, layer responsibilities, naming conventions |
| 3 | [decisions.md](./architecture/decisions.md) | **Locked decisions + open questions** (ADR) |

---

## 2. API reference

| Document | Description |
|----------|-------------|
| [endpoint-map.md](./api/endpoint-map.md) | Backend endpoints → query/body fields |

Source of truth: the backend API collection (maintained privately by the team — not committed to the repository).

Base URL: `https://backend.smartvision4p.com/sahm/public/api/`

---

## Document maintenance

When you change a **locked decision**, update `docs/architecture/decisions.md` first, then any affected document.
