# 13.23 · Phụ lục H — Trình tự các luồng chính

> Sơ đồ trình tự dạng chữ (đọc từ trên xuống; `→` gọi, `⇢` trả). Mỗi luồng ghi điểm lỗi và cách hệ thống phản ứng. Tham chiếu đặc tả ở cuối mỗi luồng.

## H.1 Lần đầu mở game (web, chưa có lưu)

```
Người chơi        game.html/mount.js     main.js              save2.js         stations.js/engine     menhban.js      quests            render3d
   │ mở trang ──────▶ mountGame(host) ───▶ startGame()
   │                                       │ loadState2() ──────▶ không có v2, không có v1 ⇢ createState2()
   │                                       │ config.refresh() (nền, không chặn)
   │                                       │ showGate() → form bát tự
   │ nhập ngày giờ ───────────────────────▶│ chartOf(birth) ───────────────────────▶ analyze() ⇢ R (≈ 16 ms lần đầu)
   │                                       │ ceremony(R) — lật trụ, Dụng/Hỷ/Kỵ
   │ «Mặc phẩm phục» ─────────────────────▶│ buildMenhBan(R) ─────────────────────────────────────▶ mb (≈ 2 ms)
   │                                       │ state.player = {…}; state.menh = { key, engineV, hash }
   │                                       │ consent-ui (một lần) ⇢ consent
   │                                       │ quests.start('MQ-P-…') ─────────────────────────────────────────────▶ active
   │                                       │ enter() ──────────────────────────────────────────────────────────────────────────▶ create3D()
   │                                       │   stream.update(START) → chờ ô vòng N có va chạm (≤ 3 s)
   │                                       │   net.start(); analytics.track('session_start'); loop()
   │ thấy Lão Tùng ở Sơn Môn ◀──────────── │ quests.markers() → dấu NPC
```

Điểm lỗi:

| Lỗi | Phản ứng |
|---|---|
| `analyze` ném (ngày không hợp lệ) | thông báo tiếng Việt của engine dưới form (đã có) |
| WebGL không khởi tạo được | renderer 2D (đã có); Mệnh Bàn, nhiệm vụ vẫn chạy |
| Ô vòng N chưa có va chạm sau 3 s | vào với va chạm nướng sẵn (nhỏ, tải trước); nếu cả hai thiếu → giới hạn tốc độ đi (phần 07 §9) |
| Người chơi từ chối mọi đồng ý | game chạy đủ; không phân tích, không công khai căn cốt |

Đặc tả: phần 02 §2, §8; phần 03 §10; phụ lục C.6.

## H.2 Một sự kiện qua máy nhiệm vụ

```
main.js (vòng lặp)          bus            quests/runtime          cond.js          ledger.js        save2
  │ regionAt đổi → emit({t:'arrive', region:'vancoc'}) ─▶ dispatch(ev)
  │                                              listeners['arrive'] = {MQ-1-03}
  │                                              node n1 type goto, target.region khớp
  │                                              guard? ───────────────▶ evalCond ⇢ true
  │                                              tx = begin(state)
  │                                              applyAll(n1.onDone)  (aid đã áp → bỏ qua)
  │                                              advance → n2 (talk) ; applyAll(n2.onEnter)
  │                                              commit(tx) → checkInvariants ⇢ ok
  │                                              rebuildListeners() ; saver.soon(state) ─────────────────────────────▶ (800 ms) ghi v2
  │ ◀── { changed, effects:[{do:'notify', …}] }  emit → main.js toast, cập nhật dấu NPC Vân Cốc
```

Điểm lỗi: `checkInvariants` ném → `rollback(tx)`, `debug.trace` ghi `{ quest, node, error }`, trạng thái không đổi; nút có `stuck` → UI «Báo kẹt». Đặc tả: phần 03 §10.3, phụ lục D.4.

## H.3 Một lượt hỏi NPC có persona (web)

```
npc-chat-ui        persona.js          net/account     Worker /api/hq/ai/chat     PlayerVault DO     backend LLM       ai.js (client)
  │ người chơi gõ câu hỏi
  │ crisisGate(q) ⇢ không khớp
  │ cache phiên? ⇢ trượt
  │ buildGameContext() ⇢ { text ≤ 600, allow }
  │ askAI(q, R, cfg{endpoint:'/api/hq/ai/chat'}, { persona, gameContext, toolsAllow, briefMode:'lite' }) ─────────────────────────▶ lắp messages
  │                                                                              (fetch stream) ───────────▶ kiểm token
  │                                                                                                         consumeAiTurn(day) ─▶ used 4/10 ⇢ ok
  │                                                                                                         KV cache (câu cacheable)? ⇢ trượt
  │                                                                                                         chuyển tiếp freeRoute ───▶ stream SSE
  │ ◀──────────────────────────────────────────── token stream (hiện mờ «đang viết») ◀─────────────────────────────────────────────
  │ (nếu mô hình gọi công cụ) execTool(name) — name ∉ toolsAllow ⇢ { error: 'tool_not_allowed' }
  │ stream xong → postFilter(answer, { allow, briefSent }) ⇢ { text, removed: 1, neo }
  │ hiện bản cuối + 3 gợi ý ; analytics.track('ai_turn', { persona, briefMode, src:'ai' }, [inTok, outTok, neo.score, removed])
  │ noteFromSession() → state.persona.mem[npc]
```

Điểm lỗi:

| Lỗi | Phản ứng |
|---|---|
| `crisisGate` khớp | không gọi AI; thẻ hỗ trợ; `crisis_shown` (không nội dung) |
| 429 `quota` | thoại kịch bản `fallbackDialogue`; HUD «hết lượt hôm nay» |
| backend 5xx / timeout | `refundAiTurn`; `askAI` tự rơi về `composeAnswer` (persona `master`) hoặc cảnh fallback (persona `guide`) |
| `postFilter` gỡ ≥ 50% câu | bỏ cả câu trả lời, dùng fallback, ghi `ai_filter` |
| `FEATURES.ai = false` (iOS) | không có nhánh mạng; chỉ fallback |

Đặc tả: phần 05 §2–§9.

## H.4 Lưu đám mây có xung đột

```
Thiết bị A (cloud.js)                 Worker                 PlayerVault                Thiết bị B
  │                                                                                         │ PUT save {rev 418, baseRev 417} ⇢ 200 rev 418
  │ PUT save {rev 418*, baseRev 417} ─▶ kiểm token, schema ─▶ putSave: server.rev 418 > baseRev 417
  │ ◀──────────── 409 { server: save(rev 418 của B) }
  │ mergeSaves(local, server) (phụ lục D.13)
  │ PUT save {rev 419, baseRev 418} ──▶ ─────────────────────▶ lưu, giữ 5 bản ⇢ 200 rev 419
  │ cập nhật state cục bộ = bản gộp ; saver.now()
```

Bất biến sau gộp: `xp`, `realmMax`, `quests.done`, `ledger` không giảm; Ngọc lấy bản máy chủ. Đặc tả: phần 08 §4.

## H.5 Đồng bộ sổ có biên nhận án NPC

```
case-ui        net.js (WS v2)        TownShard              receipt.js           PlayerVault          ledger.js
  │ người chơi nộp 6 bước
  │ solve{slot, date, ans} ─▶ ───────▶ kiểm tok; makeNpc(date:slot:pid); cases.grade(ans) ⇢ total 0.83
  │                                     sign receipt ──────▶ HMAC ⇢ rcpt
  │ ◀────────── graded{ total, rcpt }
  │ recordCase (client) → ledger.log(DEED cứu người, src case, rcpt) ⇢ entry trust 'receipt'
  │ (≤ 5 phút) ledger/sync ──────────────────────────────────────────────────────▶ syncLedger: verify(rcpt), ref chưa dùng ⇢ credit đủ
  │                                                                                ThienBang.submit(acc, { dh, merit })
```

Ngoại tuyến: client vẫn chấm và ghi mục `trust: 'local'` (chịu trần khai báo). Đặc tả: phần 04 §6, phần 08 §6.

## H.6 Mua đồ trên iOS (M6)

```
wardrobe-ui      StoreKit (plugin)     Apple            Worker /pay/apple        PlayerVault         Apple Notifications
  │ chọn SKU ──────▶ purchase(productId) ─▶ giao dịch ⇢ signedTransactionInfo (JWS)
  │ POST /api/hq/pay/apple { JWS } ──────────────────────▶ kiểm chuỗi chứng chỉ, bundleId, productId ↔ SKU
  │                                                         grant(ent, tx UNIQUE) ─▶ ent ⇢
  │ ◀──────────────────────────────── { ent } → cosmetics.owned += items
  │ finishTransaction()
  │                                                                                         (sau) REFUND V2 ─▶ /pay/apple/notify → revoke(tx)
```

Mất mạng sau khi Apple trừ tiền: lần mở app sau, plugin trả giao dịch chưa `finish` → gửi lại; `grant` lũy đẳng theo `tx`. Đặc tả: phần 08 §5.

## H.7 Vào phòng MMO v2

```
net.js                         Worker /ws/quan                 TownShard(town-<region>-<n>)
  │ WS /ws/quan?region=thanh&room=0 ─▶ kiểm Origin ─▶ idFromName('town-thanh-0').fetch
  │                                                         đầy (≥ 60)? → full, đóng 4001 → client thử room 1
  │ hello{…, tok, region, cv} ────────────────────────────▶ cv cũ? → err upgrade (4003)
  │                                                         verify(tok) ⇢ acc (không có tok: khách ẩn danh, không biên nhận)
  │                                                         a.x,y = toTile(court.START_M)
  │ ◀──────── welcome{ v:2, now, aoi:120, players: trong AOI }
  │ mv (≤ 10/s) ──────────────────────────────────────────▶ cập nhật lưới 32 m, dirty
  │ ◀──────── mvb mỗi 125 ms (người trong AOI đã đổi), join/leave khi qua 120/140 m
```

Đặc tả: phần 08 §6, phụ lục D.11.

## H.8 Truyền tống tới vùng xa

```
UI trận        main.js            stream.js                 assets / colgrid            render3d
  │ chọn Long Hổ ─▶ teleportTo(longho)
  │                 màn chuyển (overlay)
  │                 preload(1460, −190) ─▶ planRings tại đích ⇢ toLoad (vòng N trước)
  │                                         tải kê khai ô, va chạm nướng, nav ⇢ colReady
  │                                         tải shell bản thường (≤ 4 song song)
  │                 ⇢ resolve (≤ 8 s) hoặc timeout → vào với `.lod` + va chạm nướng
  │                 player.x,y = đích ; camera nhảy (khoảng cách > 40 m, đã có)
  │                 bỏ overlay ─────────────────────────────────────────────────────────────▶ khung đầu tại đích
  │                 dỡ vòng N cũ sau 10 s (trễ)
```

Đặc tả: phần 07 §4, §6.3.

## H.9 Bước vào Chính Đường

```
main.js (step)        cells.js                       render3d                       lights          quests
  │ player qua ngưỡng p_main ─▶ cellAt(player) ⇢ c1 (đổi từ c1h)
  │ emit arrive{bld:'BLD-thanh-01', cell:'c1'} ────────────────────────────────────────────────────▶ nút goto { cell } hoàn thành
  │                     update(): camCell c1 → flood(c1) qua p_stair (ảo) tới c2? (c2 khác tầng, rect ∩ ⇒ có thể)
  │                     visible = {c1, c1h?, c2?}
  │                                                   chế độ trong nhà: __roof → 0 trong 0,4 s, __floor2 ẩn
  │                                                   camera maxDist 9 ; hemi × 0,35 ; fog.far × 3
  │                                                                                ─────▶ pool ưu tiên đèn c1 (3 đèn)
  │                     d_main: giờ Tuất? → đóng; người chơi vào qua d_side
```

Đặc tả: phần 06 §4, §5.4, §6.

## H.10 Sự cố: tắt AI khẩn cấp

```
OPS/TD          Bảng quản trị app        KV ai:config / công tắc        Worker                    Client game
  │ tắt AI ─────▶ isAiEnabled = false
  │                                                                    /api/hq/ai/chat ⇢ 503 disabled
  │                                                                                              npc-chat-ui: fallback, không báo lỗi đỏ
  │ (tùy chọn) hq:config.features.ai = false ─▶ /api/hq/config (≤ 2 phút) ─────────────────────▶ ẩn ô hỏi tự do, chỉ còn thoại kịch bản
  │ theo dõi ai_turn src='fallback' tăng, chi phí token về 0
  │ bật lại từng phần (persona `guide` trước, `master` sau)
```

Đặc tả: phần 15 §6.2, §6.3.

## H.11 Lá số đổi do sửa engine

```
Người chơi mở game sau cập nhật          main.js                    menhban.js
  │                                       chartOf(birth) ⇢ R (engine mới)
  │                                       mb = buildMenhBan(R) ; mb.hash ≠ state.menh.hash và ENGINE_V khác
  │ ◀─── «Thầy vừa chỉnh lại sách tính» + diffMenhBan (vd «Tiềm Lực 41 → 42») — hiện một lần
  │                                       state.menh = { …, hash mới, seenDiff: ENGINE_V }
  │                                       quests: điều kiện dựa trên mb mới; nhánh đã chọn trước đó không đổi (đã ghi trong hist)
```

Nguyên tắc: không đảo ngược lựa chọn cốt truyện đã chơi vì engine đổi; chỉ điều kiện **từ nay** dùng số mới. Đặc tả: phần 02 §4, §10.4.
