# Hướng dẫn up web (deploy lên battu.god8.shop)

> ✅ **GIẢI PHÁP MỚI (GitHub Actions auto-deploy)** — đã có sẵn workflow `.github/workflows/deploy.yml`. Chỉ cần thêm 2 secrets (1 LẦN, 2 phút), mỗi push → web tự update.

---

## ⭐ Cách 0 — GitHub Actions auto-deploy (KHUYẾN NGHỊ — 1 lần setup, tự động mãi mãi)

1. **Vào GitHub repo** → Settings → Secrets and variables → Actions → **New repository secret**:
   - `CLOUDFLARE_API_TOKEN`: dashboard → My Profile → API Tokens → Create Token → template "Edit Cloudflare Workers".
   - `CLOUDFLARE_ACCOUNT_ID`: dashboard → bên phải Overview (Account ID).
2. **Xong!** Mỗi push → GitHub Action tự `npm run build` + deploy lên Cloudflare Pages → web tự update.
3. (1 lần) Vào Cloudflare Pages → custom domain → trỏ `battu.god8.shop` về Pages project "battu" (nếu đang trỏ Worker thì gỡ Worker route).

---

## Các cách khác (nếu không dùng GitHub Actions)

---

## ✅ Cách 1 — Bật Cloudflare Pages auto-deploy (KHUYẾN NGHỊ — 1 lần, tự động mãi mãi)

Sau khi setup, mỗi lần `git push` → Cloudflare TỰ build + deploy. Bạn không cần làm gì thêm.

1. Vào https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Chọn repo `godvstoaa/bat-tu-dung-than`.
3. Cấu hình:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (để trống)
4. **Save and Deploy**. Lần đầu build ~1-2 phút.
5. (Tuỳ chọn) Vào **Custom domains** của Pages project → trỏ `battu.god8.shop` về Pages (nếu đang trỏ Worker thì gỡ Worker route).

Sau đó: tôi `git push` → web tự update.

---

## 🔑 Cách 2 — Cấp API Token để Claude deploy mỗi loop

Cho phép tôi chạy `wrangler deploy` tự động sau mỗi task.

1. https://dash.cloudflare.com → avatar → **My Profile** → **API Tokens** → **Create Token**.
2. Dùng template **"Edit Cloudflare Workers"** (hoặc Custom: Account → Workers Scripts → Edit, scoped Worker `battu`).
3. Copy token → gửi cho tôi (hoặc set vào môi trường: `setx CLOUDFLARE_API_TOKEN "xxx"` rồi restart).
4. Tôi sẽ chạy `npm run deploy` (build + wrangler deploy) mỗi loop → web up tự động.

> Token chỉ có quyền deploy Worker, không đọc dữ liệu khác. Có thể revoke bất cứ lúc nào.

---

## 💻 Cách 3 — Bạn tự deploy khi muốn test

Mở terminal ở thư mục app:

```bash
# 1 lần đầu: login qua browser
npx wrangler login

# mỗi lần muốn up web (sau khi tôi push code):
git pull
npm run deploy      # = vite build + wrangler deploy
```

Hoặc nếu đã set `CLOUDFLARE_API_TOKEN`:
```bash
git pull && npm run deploy
```

---

## Kiểm tra web đã update

```bash
# xem hash bundle (đổi mỗi lần build = đã update)
curl -s https://battu.god8.shop/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js'
```

Sau deploy, mở https://battu.god8.shop (Ctrl+Shift+R để clear cache).
