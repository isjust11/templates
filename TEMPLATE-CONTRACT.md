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
| `slots.schema.json` | Contract slot + sample (format admin — xem bên dưới) |
| `sample.json` | (Khuyến nghị) Flat map `fieldKey → value` cho demo host / package `./sample` |
| `package.json` | `name` scoped, `exports["."]` → `src/index.tsx` |

Không có `app/`, `next.config.ts`, script `dev` (Next).

Tham chiếu chuẩn: `wedding-invite-modern/slots.schema.json` + `sample.json`.

## `slots.schema.json` — format thống nhất (admin)

Mọi template mới **viết schema theo shape Nest/admin**, không dùng JSON Schema `properties` thuần (trừ template cũ chưa migrate).

### Cấu trúc file

```json
{
  "title": "MyTemplateSlots",
  "description": "…",
  "data": {
    "<fieldKey>": { /* field descriptor */ }
  }
}
```

Import vào admin: **Template → Import schema** (JSON). Backend đọc `parsed.data || parsed`.

### Mỗi field

| Thuộc tính | Bắt buộc | Ý nghĩa |
|------------|----------|---------|
| `type` | có | `TEXT` \| `DATE` \| `IMAGE` \| `URL` \| `TEXT_ARRAY` \| `ARRAY` \| `THEME` (chữ hoa) |
| `labelVi` / `labelEn` | nên có | Nhãn form (vd. `hosts` → `"Chủ trì"`) |
| `required` | nên có | `true` / `false` |
| `enabled` | nên có | `true` = hiện trên form; map → `config.display` `"1"` / `"0"` |
| `value` | nên có | Sample / default (string, array, object…) |
| `placeHolder` | tuỳ | Placeholder input |
| `itemSchema` | với `ARRAY` | Map sub-field → `{ type, labelVi, labelEn }` |
| `config` | tuỳ | Style / visibility per field — xem mục **Field `config`** |

### Field `config`

Lưu trong Nest `template_config` (quan hệ 1–1 với `template_data`). Admin form: nút **Field config**. React template đọc qua `field.config` / helper `fieldStyle()`; Nest còn compile vào CSS theme:

```css
[data-slot="<fieldKey>"] { /* decls từ config */ }
```

| Key | Kiểu giá trị | Ý nghĩa | Runtime |
|-----|--------------|---------|---------|
| `display` | `"1"` \| `"0"` \| `"false"` | Hiện / ẩn field trên thiệp & form | `"0"` / `"false"` → `display: none` (CSS + `fieldStyle`) |
| `color` | CSS color | Màu chữ/slot riêng | `color: …` |
| `font` | CSS `font-family` | Font riêng cho slot | `font-family: …` |
| `size` | số hoặc CSS size | Cỡ chữ | số thuần (`24`) → `24px`; chuỗi có đơn vị (`1.5rem`, `clamp(…)`) giữ nguyên → `font-size` |

**Quan hệ `enabled` ↔ `config.display`**

| Khai báo trong schema | Kết quả |
|----------------------|---------|
| `enabled: true` (không có `config`) | Import → `config.display = "1"` |
| `enabled: false` | Import → `config.display = "0"` (field ẩn) |
| `config.display: "0"` | Ẩn, dù `enabled` thiếu |
| Cả hai cùng có | Ưu tiên `config.display` nếu đã set; không thì lấy từ `enabled` |

**Các case thường dùng**

1. Hiện mặc định — đủ cho hầu hết field:

```json
"city": {
  "type": "TEXT",
  "labelVi": "Thành phố",
  "enabled": true,
  "value": "TP. Hồ Chí Minh",
  "config": { "display": "1" }
}
```

2. Ẩn khỏi form/thiệp (vd. credit nội bộ):

```json
"footerCredit": {
  "type": "TEXT",
  "labelVi": "Dòng credit",
  "enabled": false,
  "value": "Made with EventLab",
  "config": { "display": "0" }
}
```

3. Chỉ đổi màu chữ (tên cô dâu / chú rể):

```json
"brideName": {
  "type": "TEXT",
  "labelVi": "Tên cô dâu",
  "required": true,
  "enabled": true,
  "value": "Minh Anh",
  "config": { "display": "1", "color": "#a82046" }
}
```

4. Font calligraphy + size số (`48` → `48px`):

```json
"groomName": {
  "type": "TEXT",
  "labelVi": "Tên chú rể",
  "required": true,
  "enabled": true,
  "value": "Hoàng Nam",
  "config": {
    "display": "1",
    "font": "\"Great Vibes\", \"Playfair Display\", cursive",
    "size": "48"
  }
}
```

5. Size đã có đơn vị (giữ nguyên):

```json
"quote": {
  "type": "TEXT",
  "labelVi": "Câu quote",
  "enabled": true,
  "value": "Hai tâm hồn, một nhịp đập…",
  "config": { "display": "1", "size": "1.5rem", "color": "var(--el-muted)" }
}
```

6. Full style override:

```json
"eventDateDisplay": {
  "type": "TEXT",
  "labelVi": "Cách ghi ngày trên thiệp",
  "required": true,
  "enabled": true,
  "value": "Chủ nhật, 20 tháng 12, 2026",
  "config": {
    "display": "1",
    "color": "#8b5e45",
    "font": "\"Playfair Display\", serif",
    "size": "22"
  }
}
```

7. `ARRAY` — `config` áp dụng cả block (ẩn/hiện section); style từng ô con chưa có trong `itemSchema`:

```json
"gifts": {
  "type": "ARRAY",
  "labelVi": "Mừng cưới",
  "enabled": true,
  "itemSchema": {
    "owner": { "type": "TEXT", "labelVi": "Chủ tài khoản" },
    "bank": { "type": "TEXT", "labelVi": "Ngân hàng" },
    "accountNumber": { "type": "TEXT", "labelVi": "Số tài khoản" },
    "qrImage": { "type": "IMAGE", "labelVi": "Mã QR" }
  },
  "value": [{ "owner": "…", "bank": "…", "accountNumber": "…", "qrImage": "" }],
  "config": { "display": "1" }
}
```

8. `THEME` — skin nằm trong `value` (tokens + effect flags); `config.display` gần như không dùng:

```json
"theme": {
  "type": "THEME",
  "labelVi": "Giao diện",
  "enabled": true,
  "value": {
    "accent": "#8b5e45",
    "effectEnvelope": true,
    "effectPetals": true,
    "effectHearts": true,
    "effectConfetti": true,
    "autoScroll": false,
    "musicEnabled": false
  },
  "config": { "display": "1" }
}
```

**React template:** bọc text bằng `style={fieldStyle(data.brideName)}` (xem `wedding-invite-modern/src/fields.ts`). Slot HTML/Nest dùng `data-slot="brideName"` để nhận CSS compile từ admin.

**Không làm**

- Đặt màu/font toàn thiệp vào `config` của từng field → dùng `theme.value` (`--el-*`).
- Dùng `display: "none"` hoặc boolean trong `config.display` → chỉ `"0"` / `"1"` / `"false"`.
- Nhầm `enabled: false` (ẩn form) với `required: false` (không bắt buộc nhập).

Ví dụ field thường:

```json
"hosts": {
  "type": "TEXT",
  "labelVi": "Chủ trì",
  "labelEn": "Hosts",
  "placeHolder": "VD: Gia đình hai họ…",
  "required": false,
  "enabled": true,
  "value": "Gia đình hai họ trân trọng báo tin",
  "config": { "display": "1" }
}
```

### `sample.json` (flat)

Giữ file riêng để demo / host không phải unwrap:

```json
{
  "groomName": "Hoàng Nam",
  "hosts": "Gia đình hai họ…",
  "gifts": [ { "owner": "…", "bank": "…", "accountNumber": "…", "qrImage": "" } ]
}
```

**Quy ước:** `sample.json[key]` ≡ `slots.schema.json.data[key].value`. Đổi sample → cập nhật cả hai (hoặc generate từ `data.*.value`).

### Checklist tạo template mới

1. Copy `wedding-invite-modern` (hoặc scaffold tối thiểu theo bảng file bắt buộc).
2. Đặt `eventlab.template.json` → `id` = slug Nest (unique).
3. Viết `slots.schema.json` với node `data` (đủ `labelVi`, `required`, `enabled`, `value`).
4. Xuất `sample.json` flat từ các `value`.
5. `package.json` exports: `"."`, `"./schema"` / `"./slots.schema.json"`, `"./sample"` (nếu có).
6. Gắn host + `npm run generate:templates` (xem bên dưới).
7. Admin: tạo template slug trùng `id` → **Import schema** file `slots.schema.json` → Publish.
8. Landing / host: `GET /public/templates/slug/:slug/demo` và `/api/template-schema/:slug` đọc được cả format admin (`data`) lẫn JSON Schema cũ (`properties`).

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

Sau `npm install`, chạy (hoặc để `predev` / `prebuild` tự chạy):

```bash
npm run generate:templates --workspace=wedding-invite
```

Script quét deps `@eventlab/template-*`, đọc `eventlab.template.json`, sinh:

- `wedding-invite/components/base/template-registry.generated.tsx`
- `wedding-invite/components/base/template-packages.generated.json` (`transpilePackages`)

Không sửa tay registry / `next.config` khi thêm template.

Nest: tạo template `slug = floral-wedding` → Import `slots.schema.json` (node `data`) → Publish. Event gán template đó → `GET /public/events/:slug` trả `templateId: "floral-wedding"` → cùng URL `/invite/:slug`. Demo mẫu: `GET /public/templates/slug/:slug/demo`.

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
