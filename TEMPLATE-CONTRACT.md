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

`wedding-invite/components/base/template-registry.tsx`:

```ts
import Floral from '@eventlab/template-floral-wedding';

export const TEMPLATE_REGISTRY = {
  'wedding-basic': WeddingBasic,
  'wedding-invite2': WeddingInvite2,
  'floral-wedding': Floral, // id phải trùng eventlab.template.json
};
```

Nest: template published `slug = floral-wedding` + `variablesSchema` từ `slots.schema.json`. Event gán template đó → `GET /public/events/:slug` trả `templateId: "floral-wedding"` → cùng URL `/invite/:slug`.

## Theme tokens (`--el-*`)

Mỗi template **bắt buộc** wrap UI trong root có class `el-invite-root` và set CSS variables (xem `wedding-basic/src/theme.ts` + `ThemeRoot`).

| Token | Ý nghĩa |
|-------|---------|
| `--el-accent` | Màu nhấn (nút, kicker) |
| `--el-accent-soft` | Accent nhạt |
| `--el-ink` / `--el-muted` | Chữ chính / phụ |
| `--el-bg` / `--el-bg-soft` | Nền |
| `--el-font-display` / `--el-font-script` / `--el-font-body` / `--el-font-sans` | Font |
| `--el-petal-50` … `--el-petal-900` | Scale màu (Host map `text-petal-*`) |

**Nguồn dữ liệu (ưu tiên):**

1. `event.eventData.theme` (object) — skin toàn thiệp  
2. `TemplateConfig.color` / `.font` trên field then (vd. `brideName`) — hint accent/display  
3. Default preset của package  

Host Tailwind (`wedding-invite/tailwind.config.ts`) map `petal.*` và `fontFamily` → các biến trên, nên đổi `theme.accent` là đổi cả UI mà không sửa class.

Alias tương thích Nest HTML: `--el-primary-color`, `--el-font-heading`, `--el-background`.
