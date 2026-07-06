# 🛡️ Admin System — Bát Tự Dụng Thần (loop 1351+)

Hệ thống admin production-grade: thống kê visitor + AI control sâu + chat history + Telegram alerts.

## Truy cập Dashboard
```
https://battu.god8.shop/admin?token=<ADMIN_TOKEN>
```
Token lưu trong Cloudflare KV (`admin:token`).

## Tính năng

### Analytics
| | |
|---|---|
| **Thống kê** | visits / lá số / AI hỏi / 💬 chats / IP thật / 🔴 active now / ⏱ load |
| **Conversion funnel** | visitor → chart → AI (% engagement) |
| **Engagement** | bounce rate / sessions / avgSessionMin / avgEvents |
| **Sự kiện** | bảng + 🔍 search (IP/câu hỏi) + lọc loại |
| **Theo visitor (IP)** | mỗi IP → geo + charts xem + **full chat history (Q+A)** + timeline |
| **7 ngày** | mini bar chart hoạt động |
| **Top** | câu hỏi AI + quốc gia + **nguồn traffic (referrer)** + **thiết bị** |
| **Bot filter** | loại crawler, chỉ đếm visitor thật |

### AI Control (KIỂM SOÁT SÂU)
| | |
|---|---|
| **AI kill-switch** | ⏸ Tắt / ▶ Bật AI toàn cục (proxy 503 khi tắt) |
| **🤖 AI Config** | chọn mode: **Free** (cf-glm) / **Custom** (API key riêng) / **Off** |
| **Thêm API** | nhập endpoint + apiKey + model → worker proxy dùng key admin |
| **Auto-enable** | user tự động nhận AI khi admin có key (transparent qua proxy) |

### Tiện ích
| | |
|---|---|
| **📱 Telegram Alert** | nhận thông báo ngay khi user lập lá số/hỏi AI/lỗi |
| **📥 CSV Export** | download events |
| **🔑 Đổi token** | đổi admin token trong dashboard |
| **Rate-limit** | events: 30/phút/IP; auth: 10 fail/5ph/IP |

## API Endpoints
| Endpoint | Auth | Chức năng |
|---|---|---|
| `POST /api/event {type,data}` | public | log visit/chart/ai_question/ai_chat/error |
| `GET /api/ai-config` | public | {mode, hasKey, endpoint, model} cho frontend |
| `GET /admin?token=X` | token | dashboard HTML |
| `GET /admin/api/stats?token=X[&nocache=1]` | token | JSON (totals/byIp/daily/funnel/engagement/devices/topQ/topC/topRef/activeNow/events/chats) |
| `POST /admin/api/ai?token=X {enabled}` | token | toggle AI (kill-switch cũ) |
| `POST /admin/api/ai-config?token=X {mode,endpoint,apiKey,model}` | token | cấu hình AI sâu (free/custom/off) |
| `GET /admin/api/ai-config?token=X` | token | xem AI config (key masked) |
| `POST /admin/api/token?token=X {new}` | token | đổi token |
| `POST /admin/api/notify?token=X {tg_token,tg_chat}` | token | cấu hình Telegram alert |
| `POST /admin/setup {token}` | one-time | tạo token lần đầu |
| `GET /admin/api/export?token=X` | token | CSV export |

## Frontend instrumentation (main.js)
- `_logEvent('visit', {ref,path,loadMs})` — load trang.
- `_logEvent('chart', {dob,time,gender})` — submit lá số.
- `_logEvent('ai_question', {q})` — gửi câu hỏi AI.
- `_logEvent('ai_chat', {q,response,source})` — **AI trả lời xong** (Q+A đầy đủ).
- `_logEvent('error', {msg,file,line})` — JS error.
- `window.onerror` + `unhandledrejection` → auto-log errors.
- Auto-enable AI: fetch `/api/ai-config` → nếu admin có key → set cf-glm preset.

## Quản lý token
- **Đổi**: dashboard → 🔑 Đổi token, HOẶC `POST /admin/api/token?token=<cur> {new:"<≥8 ký tự>"}`.
- **Quên token**: GH secret ADMIN_TOKEN (CI auto-set), HOẶC CF Dashboard → KV → xóa `admin:token` → `/admin/setup`.

## Self-audit (repeatable)
```bash
node admin-audit.mjs <token>   # 16 checks: log/stats/byIp/daily/geo/funnel/engagement/botFilter/activeNow/AI-toggle/CSV/auth
```

## Kiến trúc
- **Worker** (worker/index.js + worker/admin.js): routes /api/* + /admin* + proxy AI + kill-switch + Telegram.
- **Storage**: Cloudflare KV `ADMIN_KV`:
  - `events:log` — JSON array 100 events gần nhất (single key, fast read).
  - `cnt:*` — cumulative counters (visit/chart/ai_question/ai_chat/error/all).
  - `ai:enabled` — kill-switch (1/0).
  - `ai:config` — {mode, endpoint, apiKey, model}.
  - `admin:token` — auth token.
  - `notify:tg_token` / `notify:tg_chat` — Telegram config.
  - `cache:stats` — stats cache (60s TTL).
- **Frontend** (main.js): fire-and-forget logging + auto-enable AI.
- **CI** (.github/workflows/cloudflare.yml): deploy + set ADMIN_TOKEN secret.
