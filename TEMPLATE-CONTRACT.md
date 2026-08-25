# Template repo contract

Mỗi design là **một Git repo / npm package**, không phải Next app. Host `wedding-invite` chạy **một port**; registry chọn component theo `templateId`.

```text
templates/
  wedding-invite/          ← host (duy nhất `next dev`)
  wedding-basic/           ← package @eventlab/template-wedding-basic
  wedding-invite2/         ← package @eventlab/template-wedding-invite2
  <clone-from-github>/     ← repo mới, cùng contract
```

## File bắt buộc trong repo template

| File | Ý nghĩa |
|------|---------|
| `eventlab.template.json` | `id` = Nest `templates.slug` = key registry |
| `src/index.tsx` | `export default function Template({ data })` |
| `slots.schema.json` | Contract `event.eventData` |
| `package.json` | `name` scoped, `exports["."]` → `src/index.tsx` |

Không có `app/`, `next.config.ts`, script `dev` (Next).

## Gắn repo mới (một port)

```bash
cd templates
git clone git@github.com:org/floral-wedding.git floral-wedding
```

Thêm vào `templates/package.json` → `workspaces`, rồi host `package.json`:

```json
"@eventlab/template-floral-wedding": "file:../floral-wedding"
```

Sau này publish GitHub:

```json
"@eventlab/template-floral-wedding": "github:org/floral-wedding#main"
```

`next.config.ts` → thêm vào `transpilePackages`.

`components/base/template-registry.tsx`:

```ts
import Floral from '@eventlab/template-floral-wedding';

export const TEMPLATE_REGISTRY = {
  'wedding-basic': WeddingBasic,
  'wedding-invite2': WeddingInvite2,
  'floral-wedding': Floral, // id phải trùng eventlab.template.json
};
```

Nest: template published `slug = floral-wedding` + `variablesSchema` từ `slots.schema.json`. Event gán template đó → `GET /public/events/:slug` trả `templateId: "floral-wedding"` → cùng URL `/invite/:slug`.
