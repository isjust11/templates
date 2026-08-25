# templates

Sandbox **1 Next host + N template packages**. Mỗi design là folder/repo riêng; host chạy một port.

Chi tiết contract: [`TEMPLATE-CONTRACT.md`](./TEMPLATE-CONTRACT.md)  
Demo: [`wedding-invite/DEMO.md`](./wedding-invite/DEMO.md)

```text
templates/
  wedding-invite/      Next host  →  npm run dev   (port 3000)
  wedding-basic/       package    →  không next dev
  wedding-invite2/     package    →  không next dev
```

```bash
# 1) Nest API
cd ../codebase-admin && npm run start:dev

# 2) Admin FE — /manager/events → Seed wedding demo
cd ../codebase_admin_fe && npm run dev

# 3) Host (workspace: 1 port, 2 packages)
# (đang ở templates/)
npm install && npm run dev
# EVENTLAB_API_URL trong wedding-invite/.env.local
```

Mở:

- Admin: `/manager/events`
- Host: http://localhost:3000/demo
- `wedding-basic`: http://localhost:3000/invite/minh-anh-hoang-nam
- `wedding-invite2`: http://localhost:3000/invite/ngoc-anh-tuan
