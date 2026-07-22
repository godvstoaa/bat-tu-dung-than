# 🛡️ Admin System — Bát Tự Dụng Thần (loop 1355+)

Hệ thống admin production-grade: thống kê visitor + AI control sâu + chat history + Telegram + chống cào/phá + real-time.

## Truy cập Dashboard
```
https://battu.god8.shop/admin?token=<ADMIN_TOKEN>
```

## Quick Start (3 bước)
1. **🤖 AI**: Mở «🤖 AI Config» → chọn Custom → dán API key (z.ai/model-api) → endpoint + model pre-filled → Lưu.
2. **📱 Telegram**: @BotFather → /newbot → copy token → dán vào «📱 Telegram Alert» → Bật.
3. **📊 Monitor**: Dashboard auto-refresh 3s. 🔴 LIVE + 🔊 Sound + 🔔 title flash khi event mới.

## Tính năng (40+)

### Analytics
| | |
|---|---|
| **Stats** | visits / charts / AI / chats / errors / clicks / IP / 🔴 active / bounce / load / sessions / AI-rate / returning / **AI latency avg/p95/max** |
| **Health Check** | AI rate ✅/⚠ · **AI latency p95 ✅/⚠** · errors ✅/⚠ · load ✅/⚠ · bounce ✅/⚠ |
| **Action Alerts** | banner đỏ «AI FAIL» + vàng «Load chậm» + **🐢 «AI CHẬM»** (max>90s / p95>60s) |
| **Funnel** | visitor → chart → AI (% conversion) |
| **Engagement** | bounceRate / sessions / avgSessionMin / avgEvents / avgCharts / avgLoadMs / aiSuccessRate / returningVisitors |
| **Events** | bảng + 🔍 search + filter 6 loại (visit/chart/ai_question/ai_chat/error/click) + **click row ai_chat → modal full Q+A** |
| **By IP** | mỗi IP → geo + charts + **full chat Q+A (click mở modal, có durationMs)** + 📅 timeline (chronological journey) + 🚫 Block button |
| **🔎 Visitor Finder** | 🔍 tìm tổng (tên / ngày sinh / IP / câu hỏi / trả lời AI / ghi chú / tag) + lọc (giới tính · quốc gia · «có»: lá số/chat/❓/ghi chú/tag/tên/quay lại · khoảng điểm · khoảng thời gian) + sort (gần nhất/điểm/nhiều lá số…) + đếm kết quả + tag cloud click-to-filter |
| **📝 Note + 🏷️ Tag** | mỗi visitor: ghi chú tự do + tag phân loại (KV `vnote:<ip>`) — **bộ nhớ dài hạn admin «ai là ai»** → tìm lại theo ghi chú/tag |
| **📒 Danh bạ tên** | profiles bền vững (`vprof:<dob>\|<time>\|<gender>`) — tìm theo tên **dù events:log đã rollover** (1500 events) |
| **Retention** | **events:log cap 1500** (~1-2 tuần) + **dayagg:<date> TTL 90 ngày** → 30-day trend không phụ thuộc cap |
| **7 ngày** | mini bar chart (từ events) |
| **30 ngày** | **sparkline trend từ dayagg** (retention dài, độc lập cap 1500) |
| **24 giờ** | hourly activity (VN UTC+7) |
| **Top** | câu hỏi AI + quốc gia + nguồn traffic + **conversion rate** + thiết bị + feature clicks |
| **Referrer Conversion** | FB vs direct vs Google → % chart conversion per source |
| **Bot Filter** | loại crawler, chỉ đếm visitor thật |

### AI Control (sâu)
| | |
|---|---|
| **Kill-switch** | ⏸ Tắt / ▶ Bật AI toàn cục |
| **🤖 AI Config** | mode: Free (cf-glm) / Custom (API key) / Off |
| **Custom Key** | nhập endpoint + apiKey + model → proxy dùng key admin |
| **Auto-enable** | user tự nhận AI khi admin có key |
| **Fetch Timeout** | 12s per attempt + skip thinking retry → fallback nhanh (24s max) |

### Chống cào + Chống phá
| | |
|---|---|
| **Anti-scraping** | Block scraper UA (scrapy/python/wget/curl/headless/puppeteer...) |
| **Bot whitelist** | Googlebot/Bingbot OK (SEO) |
| **Global rate-limit** | 120 req/phút/IP cho main site |
| **Event rate-limit** | 30 events/phút/IP cho /api/event |
| **Auth rate-limit** | 10 fail/5ph/IP cho /admin/* |
| **IP Blacklist** | 🚫 Block button per visitor + 🚫 Blocked IPs list |
| **Cloudflare** | Bật Bot Fight Mode + WAF rules trong Dashboard (edge-level) |
| **🔒 Audit log** | mọi admin action (toggle/block/clear/token/config) ghi KV `audit:log` (IP+ts, TTL 90d) — dashboard «🔒 Audit log» |
| **Security headers** | dashboard: **strict CSP** + HSTS + nosniff + X-Frame DENY + Referrer no-referrer · main app: HSTS + nosniff + Referrer (qua `run_worker_first`) |
| **Token URL hygiene** | `history.replaceState` strip token khỏi URL + Referrer no-referrer (chống leak history/share/Referer) |
| **Anti-scraping mọi route** | `run_worker_first=true` → scraper block áp dụng cả main document (trước đây edge bypass) |

### Real-time + Alerts
| | |
|---|---|
| **Poll 3s nocache** | TRUE real-time (<3s delay) |
| **🔴 LIVE** | pulsing indicator |
| **🔊 Sound** | beep 880Hz khi event mới (toggle) |
| **🔔 Title flash** | «🔔 (N) Admin» 3s khi activity mới |
| **📱 Telegram** | alert ngay: chart/ai_question/ai_chat/error/🆕 new visitor |

### Tools
| | |
|---|---|
| **📥 CSV Export** | download events |
| **🔍 IP Search** | filter visitor cards theo IP |
| **🗑 Clear Data** | reset events + counters |
| **🔑 Change Token** | đổi admin token trong dashboard |

## API Endpoints
| Endpoint | Auth | Chức năng |
|---|---|---|
| `POST /api/event {type,data}` | public | log visit/chart/ai_question/ai_chat/error/click |
| `GET /api/ai-config` | public | {mode, hasKey} cho frontend auto-enable |
| `GET /admin?token=X` | token | dashboard HTML |
| `GET /admin/api/stats?token=X&nocache=1` | token | full JSON (30+ fields) |
| `GET /admin/api/events?token=X&type=&limit=` | token | filtered events |
| `POST /admin/api/ai?token=X {enabled}` | token | kill-switch |
| `POST /admin/api/ai-config?token=X {mode,endpoint,apiKey,model}` | token | AI config sâu |
| `POST /admin/api/token?token=X {new}` | token | đổi token |
| `POST /admin/api/notify?token=X {tg_token,tg_chat}` | token | Telegram config |
| `POST /admin/api/block?token=X {ip,block/list}` | token | IP blacklist |
| `POST /admin/api/note?token=X {ip,note,tags[]}` | token | ghi chú + tag visitor (lưu/xóa `vnote:<ip>`, bust cache) |
| `POST /admin/api/clear?token=X` | token | clear data |
| `GET /admin/api/export?token=X` | token | CSV export |
| `POST /admin/setup {token}` | one-time | tạo token |

## Frontend Instrumentation (main.js)
- `_logEvent('visit', {ref,path,loadMs})` — load
- `_logEvent('chart', {dob,time,gender})` — submit lá số (+ `name` nếu khách nhập ô «Tên» tùy chọn → upsert profile bền vững `vprof:<dob>|<time>|<gender>`)
- `_logEvent('ai_question', {q})` — gửi câu hỏi
- `_logEvent('ai_chat', {q,response,source,durationMs})` — AI trả lời (Q+A+duration)
- `_logEvent('error', {msg,file,line})` — JS error + unhandledrejection
- `_logEvent('click', {id,txt})` — button clicks (feature usage)
- Auto-enable AI: fetch `/api/ai-config` → cf-glm preset nếu admin có key

## Self-audit (39 checks)
```bash
node admin-audit.mjs <token>
```

## Kiến trúc
- **Worker** (worker/index.js): anti-scraping + rate-limit + IP block + proxy + assets
- **Admin** (worker/admin.js): 13 endpoints + dashboard + analytics + Telegram
- **KV ADMIN_KV**: events:log (1500 events), dayagg:<date> (TTL 90d), counters (cnt:*), ai:config, ai:enabled, admin:token, notify:*, block:*, cache:stats, **vnote:<ip>** (ghi chú+tag visitor), **vprof:<dob>|<time>|<gender>** (profile tên bền vững)
- **CI**: deploy + set ADMIN_TOKEN (GH secret)
