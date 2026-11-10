# Cài đặt đăng nhập tài khoản (production)

Mã đã có sẵn: `worker/auth.js`, `worker/accounts.js`. Muốn bật trên `battu.god8.shop`, bạn cần tự làm các bước dưới. Đây là thao tác trên tài khoản của bạn, Claude không đăng nhập hộ.

## 1. Google

1. Vào Google Cloud Console › APIs & Services › **OAuth consent screen**:
   - Loại **External**.
   - Tên ứng dụng «Huyền Quán».
   - Email hỗ trợ.
   - Domain `god8.shop`.
   - Link chính sách quyền riêng tư.
   - Scope: `openid`, `email`, `profile`.
2. Vào **Credentials** › Create credentials › **OAuth client ID**:
   - Loại **Web application**.
   - Authorized redirect URI: `https://battu.god8.shop/api/auth/google/callback`.
   - Nếu muốn thử ở máy dev: thêm `http://127.0.0.1:5182/api/auth/google/callback`, và đặt `PUBLIC_ORIGIN` cho phù hợp.
3. Lưu secret cho Worker:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
```

```bash
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

## 2. Email (mã đăng nhập)

1. Tạo tài khoản Resend, xác minh domain gửi (`god8.shop`): thêm các bản ghi DNS SPF / DKIM mà Resend đưa.
2. Tạo API key chỉ có quyền gửi, rồi lưu:

```bash
npx wrangler secret put RESEND_API_KEY
```

```bash
npx wrangler secret put MAIL_FROM
```

(Giá trị `MAIL_FROM` ví dụ: `Huyền Quán <no-reply@god8.shop>`.)

## 3. Số điện thoại (chưa bật)

- Cần chọn nhà cung cấp SMS: eSMS, SpeedSMS (nhà mạng VN, cần đăng ký brandname) hoặc Twilio. Mỗi tin nhắn tốn phí.
- Chọn xong thì báo để nối vào `worker/auth.js` (hàm `channel` / gửi tin) và bật Turnstile trước khi gửi.

## 4. Deploy

- `wrangler.jsonc` đã có binding `ACCOUNTS` và migration `accounts-v1` (cùng `estate-v1` còn chờ).
- CI tự deploy khi push lên `main`. **Chỉ push khi đã sẵn sàng.**
- Không được đặt `AUTH_DEV` trên production. Biến này chỉ có trong `scripts/dev-mmo.mjs`.
