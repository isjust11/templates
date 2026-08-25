# @eventlab/template-wedding-basic

Template **package** (không phải Next app). Host `templates/wedding-invite` import vào `TEMPLATE_REGISTRY`.

## Contract (GitHub repo)

Repo template chỉ cần:

| File | Bắt buộc |
|------|----------|
| `eventlab.template.json` | `id` = Nest `templates.slug` = registry key |
| `src/index.tsx` | `export default function Template({ data })` |
| `slots.schema.json` | Contract `eventData` |

Không có `app/`, `next.config`, `npm run dev`.

## Gắn vào host

```bash
# local sibling
git clone <repo-url> templates/wedding-basic

# host package.json
"@eventlab/template-wedding-basic": "file:../wedding-basic"
# sau này: "github:org/wedding-basic#main"
```

Một dòng trong `wedding-invite/components/base/template-registry.tsx`.
