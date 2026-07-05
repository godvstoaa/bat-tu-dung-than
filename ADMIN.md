# 🛡️ Admin System — Bát Tự Dụng Thần (loop 1351)

Hệ thống admin: thống kê visitor (IP/geo/lá số/câu hỏi AI) + AI kill-switch + analytics.

## Truy cập Dashboard
```
https://battu.god8.shop/admin?token=<ADMIN_TOKEN>
```
Token lưu trong Cloudflare KV (`admin:token`).

## Tính năng
| | |
|---|---|
| **Thống kê** | visits / lá số / AI hỏi / IP unique / 🔴 active now |
| **Sự kiện** | bảng gần đây + 🔍 search (IP/câu hỏi) + lọc loại |
| **Theo visitor (IP)** | mỗi IP → geo + charts xem + câu hỏi AI + timeline |
| **7 ngày** | mini bar chart hoạt động |
| **Top** | câu hỏi AI hay gặp + quốc gia |
| **AI kill-switch** | ⏸ Tắt / ▶ Bật AI toàn cục (proxy trả 503 khi tắt) |
| **CSV export** | 📥 download 1000 events gần nhất |
| **🔑 Đổi token** | đổi admin token ngay trong dashboard |
| **Rate-limit** | /api/event: max 30/phút/IP (anti-spam) |

## API
| Endpoint | Auth | Chức năng |
|---|---|---|
| `POST /api/event {type,data}` | public | log visit/chart/ai_question |
| `GET /admin?token=X` | token | dashboard HTML |
| `GET /admin/api/stats?token=X` | token | JSON stats (totals/byIp/daily/topQ/topC/activeNow/events) |
| `POST /admin/api/ai?token=X {enabled}` | token | toggle AI |
| `POST /admin/api/token?token=X {new}` | token | đổi token |
| `POST /admin/setup {token}` | one-time | tạo token lần đầu |
| `GET /admin/api/export?token=X` | token | CSV export |

## Frontend instrumentation (main.js)
- `_logEvent('visit')` — load trang.
- `_logEvent('chart', {dob,time,gender})` — submit lá số.
- `_logEvent('ai_question', {q})` — gửi câu hỏi AI.

## Quản lý token
- **Đổi**: dashboard → 🔑 Đổi token, HOẶC `POST /admin/api/token?token=<cur> {new:"<≥8 ký tự>"}`.
- **Quên token (recovery)**:
  1. Set GitHub secret `ADMIN_TOKEN` → CI auto-set wrangler secret (env override KV), HOẶC
  2. Cloudflare Dashboard → Workers & Pages → battu → KV ADMIN_KV → xóa key `admin:token` → POST `/admin/setup {token}` lại.

## Self-audit (repeatable)
```bash
node admin-audit.mjs <token>   # 13 checks: log/stats/byIp/daily/geo/activeNow/AI-toggle/CSV/auth
```
Chạy mỗi deploy để chắc không regress.

## Kiến trúc
- **Worker** (worker/index.js + worker/admin.js): routes /api/event + /admin* + proxy AI kill-switch.
- **Storage**: Cloudflare KV `ADMIN_KV` (events 90-day TTL + counters + token + ai:enabled).
- **Frontend** (main.js): fire-and-forget logging.
- **CI** (.github/workflows/cloudflare.yml): deploy + set ADMIN_TOKEN secret (nếu GH secret có).
