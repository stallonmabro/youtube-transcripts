@AGENTS.md

## Design-First Workflow (MANDATORY)

**Rule: No connected code before visual approval.**

### Phase A — Design System
Before any page work, produce `DESIGN.md`:
- Color palette (hex values, usage)
- Typography scale (headings, body, captions — size, weight, line-height)
- Spacing system (section padding, card gaps, container max-width)
- Shared components: Card, EmptyState, StatTile, DataTable, FormLayout, PageHeader, TabBar, Modal, Toast

### Phase B — Page Mockups
For EVERY page/route/section, generate standalone HTML mockup FIRST. Include ALL states:
- Loading / skeleton
- Empty (no data yet)
- Error (API failure)
- Populated (realistic sample data)
- Edge cases (long text, missing images, zero counts)

### Phase C — Review & Approve
- Present mockups. Do NOT write connected code.
- User reviews and approves each page.
- Only after ALL pages approved → Phase D.

### Phase D — Build
- Implement connected pages matching approved mockups exactly.
- Any deviation from mockup = re-approve.

### Enforcement
- If user asks to "build X page" without mockup → push back, generate mockup first.
- If user asks to "connect" or "wire up" → verify mockup approval first.
- When in doubt, mockup first.
