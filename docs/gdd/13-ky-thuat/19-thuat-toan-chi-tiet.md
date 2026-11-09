# 13.19 · Phụ lục D — Thuật toán chi tiết

> Mã giả đủ chi tiết để cài đặt và viết test cho các thuật toán được nhắc ở phần 02–09. Mỗi mục có: đầu vào/ra, mã giả, độ phức tạp, ca biên.

## D.1 Giờ can chi, ngày âm lịch, tiết khí cho SCHEMA-WINDOW

**Vào:** `now: Date` (giờ địa phương thiết bị), `window`. **Ra:** `boolean`.

```
shichenOf(now):
  h = now.getHours()
  idx = floor(((h + 1) mod 24) / 2)            // 23:00–00:59 → 0 (子), 01:00–02:59 → 1 (丑) …
  return '子丑寅卯辰巳午未申酉戌亥'[idx]

lunarOf(now):
  l = Solar.fromYmdHms(Y, M, D, h, m, 0).getLunar()       // lunar-javascript, đã là phụ thuộc
  return { month: abs(l.getMonth()), leap: l.getMonth() < 0, day: l.getDay() }

termActive(now, term):                                     // tiết khí: từ thời khắc tiết tới tiết kế
  t0 = l.getJieQiTable()[term]                             // Solar của tiết
  next = tiết kế tiếp trong bảng (theo thứ tự 24 tiết)
  return now ≥ t0 && now < next

inWindow(now, w):
  if w.solar:   mmdd = format(now); ok = from ≤ to ? (from ≤ mmdd ≤ to) : (mmdd ≥ from || mmdd ≤ to)   // qua năm
  if w.lunar:   L = lunarOf(now); ok &= L.month == w.lunar.month && (dayFrom ?? 1) ≤ L.day ≤ (dayTo ?? 30)
  if w.term:    ok &= termActive(now, w.term)
  if w.shichen: ok &= shichenOf(now) ∈ w.shichen
  if w.weekday: ok &= now.getDay() ∈ w.weekday
```

Ca biên:

| Ca | Kỳ vọng |
|---|---|
| 23:30 | giờ 子 (Tý) — cùng quy ước «子时换日» của engine (`chart.js › ziShiRoll`); **ngày âm** vẫn theo ngày dương hiện tại (window không đổi ngày lúc 23 h) |
| Tháng nhuận | `leap = true`, `month` trả số tháng thường → lễ tháng 7 diễn ra cả tháng 7 nhuận (ghi rõ trong tài liệu 10; nếu lễ chỉ muốn tháng thường, thêm `"leap": false` — mở rộng schema khi cần) |
| `solar` qua năm (`12-20` → `01-10`) | nhánh `||` |
| Lập Xuân 2026 (04/02) | trước thời khắc tiết vẫn là năm 乙巳 — khớp `thaitue.js › suiYear` |

Độ phức tạp O(1); `getLunar()` tốn vài chục micro giây → gọi tối đa mỗi phút (nhịp `tick`), đệm theo phút.

## D.2 `ulid()` cho mục sổ

```
ulid(nowMs, rand = crypto.getRandomValues):
  time = nowMs encoded Crockford base32, 10 ký tự (48 bit)
  r = 80 bit ngẫu nhiên → 16 ký tự
  nếu nowMs == lastMs: r = lastR + 1 (đơn điệu trong cùng ms)
  return time + r
```

Đơn điệu giúp sắp mục theo thời gian bằng so chuỗi; trùng xác suất bỏ qua được (80 bit).

## D.3 `mbHash` (FNV-1a 32 bit)

```
canon(mb) = JSON.stringify([mb.tiemLuc.value, mb.phamCan.idx, mb.phucPhan.key, wxArr(mb.nguHanh.pct),
                            mb.thanLuc.value, mb.thienMenh.dung, mb.thienMenh.hy, mb.thienMenh.ky, mb.thienMenh.cuu,
                            dimsArr(mb.nguDuy.dims), mb.menhCach.quality, mb.menhCap?.level, mb.nguyenKhi?.value,
                            sorted(mb.dacTinh.map(k)), mb.tucNghiep?.realm])
h = 0x811c9dc5
for byte b of utf8(canon): h ^= b; h = (h × 0x01000193) mod 2³²
return hex8(h)
```

Không dùng cho bảo mật (chỉ phát hiện thay đổi). Không gồm `thoiVan` (đổi theo năm).

## D.4 Giao dịch và `aid` của máy nhiệm vụ

```
begin(state):
  return { quests: structuredClone(state.quests), ledger: shallowCopyLedger(state.ledger),
           dao: { ...state.dao, today: { ...state.dao.today } }, flags: { ...state.flags },
           world: { visited: [...], unlocked: [...] }, phucKhi: state.phucKhi, xp: state.xp, applied: [] }
   // ledger.entries: mảng mới tham chiếu cùng phần tử cũ + phần tử thêm (không sao chép sâu 2.000 mục)

applyOne(tx, eff, aid):
  if aid ∈ q.applied || aid ∈ done[id].aidSet: return            // lũy đẳng
  switch eff.do: … ghi vào tx …
  q.applied.push(aid)

commit(tx):
  checkInvariants(merged(state, tx))         // ném → rollback (bỏ tx)
  gán từng khối của tx vào state; saver.soon(state)
```

`structuredClone(state.quests)` với ≤ 60 nhiệm vụ đang làm, mỗi `applied` ≤ 400 chuỗi → ≤ ~100 KB, < 1 ms. Khi nhiệm vụ xong: `done[id].aid = fnv32(applied.join('|'))` thay mảng (nén), giữ khả năng chặn áp lại khi nhiệm vụ lặp (`repeat`) bằng cách thêm hậu tố lần lặp vào `aid`.

## D.5 Gộp tháng của sổ

```
rollup(ledger, maxEntries = 2000, keepRecentDays = 60):
  if ledger.entries.length ≤ maxEntries: return
  cutoff = đầu tháng của (now − keepRecentDays)
  groups = nhóm các mục kind ≠ 'rollup' có at < cutoff theo 'YYYY-MM'
  for (month, es) in groups:
    r = existing rollup(month) ?? { id: 'rollup-'+month, kind: 'rollup', month, thien: 0, ac: 0, net: 0, count: 0, trusted: 0 }
    for e in es: (e.pts > 0 ? r.thien : r.ac) += e.pts; r.net += e.pts; r.count += 1; if e.trust ≠ 'local': r.trusted += e.pts
  thay các mục đó bằng các rollup; đảm bảo Σ net không đổi (bất biến §8.6 phần 02)
```

Mục chưa đồng bộ (`syncedRev` cũ hơn) **không** được gộp (máy chủ cần từng mục để khử trùng).

## D.6 `cellAt` và `screenRect` (ô cổng)

```
convexContains(poly, x, z):                  // poly ngược chiều kim đồng hồ
  for i: (ax, az) = poly[i]; (bx, bz) = poly[(i+1) mod n]
    if (bx − ax)(z − az) − (bz − az)(x − ax) < −1e-6: return false
  return true

screenRect(quad4World, camera):
  V = quad4World.map(p → camera.matrixWorldInverse × p)          // không gian camera, nhìn về −z
  near = −camera.near
  poly = clip(V, plane z ≤ near)                                 // Sutherland–Hodgman một mặt
  if poly rỗng: return EMPTY
  P = poly.map(v → camera.projectionMatrix × v → NDC (x/w, y/w))
  return { x0: max(−1, min Px), x1: min(1, max Px), y0: max(−1, min Py), y1: min(1, max Py) }   // EMPTY nếu x0 ≥ x1 hoặc y0 ≥ y1

intersect(a, b) = { x0: max, x1: min, y0: max, y1: min } ; EMPTY nếu suy biến
```

Ca biên: cổng xuyên mặt near (camera đứng ngay ngưỡng cửa) → `clip` tạo đa giác hợp lệ, rect phủ gần hết màn → vẽ ô bên kia (đúng: đang đứng ở cửa). Camera ở trong ô nhưng `cellAt(camera)` null do camera hơi lố trần → dùng `cellAt(player)` làm dự phòng.

## D.7 RLE va chạm nướng

```
encode(bits, w, h):                           // bits: Uint8Array w×h (0/1)
  out = []; run = 0; cur = 0                  // bắt đầu bằng run «trống»
  for k in 0..w×h−1:
    if bits[k] == cur: run++ else: pushVarint(out, run); run = 1; cur = 1 − cur
  pushVarint(out, run)
  return base64(out)

decode(s, w, h):
  bytes = base64Decode(s); k = 0; cur = 0; bits = Uint8Array(w×h)
  while k < w×h: n = readVarint(bytes); if cur: bits.fill(1, k, k+n); k += n; cur = 1 − cur
  assert k == w×h
```

`pushVarint`: 7 bit mỗi byte, bit cao = còn tiếp. Kiểm `encode(decode(x)) == x` trên 1.000 lưới ngẫu nhiên trong `test-bake`.

## D.8 Lập kế hoạch vòng streaming

```
planRings(px, pz, alt, cells, prev, Q):          // Q: { N, M, hyst = 1.3 }
  (N, M) = alt > 60 ? (200, 1200) : (Q.N, Q.M)
  want = {}
  for c in cells (324 ô):                         // có thể chỉ duyệt ô trong bán kính M×hyst bằng chỉ số
    d = distance((px, pz), center(c))
    was = prev[c]                                 // 'N' | 'M' | 'F' | undefined
    if d ≤ N || (was == 'N' && d ≤ N × hyst): want[c] = 'N'
    elif d ≤ M || (was ∈ {'N','M'} && d ≤ M × hyst): want[c] = 'M'
    else want[c] = 'F'
  diff: toLoad = { c : want[c] mạnh hơn prev[c] }, toDrop = { c : want[c] yếu hơn prev[c] }
  sắp toLoad theo (vòng N trước, rồi khoảng cách, rồi ô nằm trước theo vận tốc)
  return { want, toLoad, toDrop }
```

O(324) mỗi 0,5 s — không đáng kể. Test: đi dọc biên vòng N qua lại ±5 m không sinh `toDrop` (trễ 1,3).

## D.9 Ngân sách bộ nhớ và LRU

```
onLoaded(asset, bytesGpu): mem.gpu += bytesGpu; lru.touch(asset)
release(asset): ref[asset]--; if ref[asset] == 0: lru.markIdle(asset)
enforce():
  while mem.gpu > budget.gpu && lru.hasIdle():
    a = lru.oldestIdle(); dispose(a); mem.gpu −= size(a)
  if mem.gpu > budget.gpu: pressure++ → streamer thu vòng N 15% (một lần mỗi 10 s)
```

`size(a)` tính lúc nạp: Σ texture `w × h × 4 × 1,33` (WebP) hoặc `w × h × bpp` (KTX2 theo định dạng chuyển mã: ASTC/ETC2 1 byte/điểm ảnh cho UASTC, 0,5 cho ETC1S) + Σ byteLength hình học.

## D.10 Tìm đường hai tầng

```
findPathLong(from, to):
  if |to − from| ≤ 150 ô: return findPath(from, to)
  a = nearestNode(from, r = 80 m, visible = clearLine) ; b = nearestNode(to, …)
  if !a || !b: return findPath(from, to)          // dự phòng: hành vi cũ
  route = astarGraph(a, b)                         // heuristic Euclid, chi phí = len × (kind == 'stairs' ? 1,5 : 1)
  if !route: return []
  return lazyPath([from → a], route, [b → to])    // client yêu cầu đoạn kế khi còn ≤ 2 điểm
```

Đồ thị nạp theo ô cùng kê khai (nhẹ, ≤ 400 nút/ô); ô chưa nạp nav → yêu cầu nạp và trả đường tới mép ô đã biết.

## D.11 AOI máy chủ

```
grid: Map<cellKey(32 m), Set<wsId>>
onMove(a, x, y):
  k = key(toWorld(x, y)); if k ≠ a.k: grid[a.k].delete(a.id); grid[k].add(a.id); a.k = k
  a.dirty = true; scheduleTick()
tick() every 125 ms while anyDirty within 2 s:
  for r in ready sockets:
    cand = ∪ grid[k'] for k' in ring(r.k, ceil(140 / 32) = 5)       // 11 × 11 ô quanh
    vis = { p ∈ cand : d(p, r) ≤ (p ∈ r.vis ? 140 : 120) } \ {r}
    send join(vis − r.vis), leave(r.vis − vis), mvb([p ∈ vis : p.dirty])
    r.vis = vis ; ws.serializeAttachment(r)   // chỉ khi vis đổi (giảm ghi)
  clear dirty
```

`r.vis` lưu trong attachment để sống qua hibernation (tập ≤ 59 id × 10 ký tự). Bán kính vòng ô 5 × 32 m = 160 m ≥ 140 m.

## D.12 Ký và kiểm token, biên nhận

```
sign(payloadObj, key, kv):
  h = b64url(JSON.stringify({ alg: 'HS256', typ: 'hq1' }))
  p = b64url(JSON.stringify({ ...payloadObj, kv }))
  s = b64url(HMAC_SHA256(key[kv], h + '.' + p))
  return h + '.' + p + '.' + s
verify(tok, keys, now):
  [h, p, s] = split('.'); if !h || !p || !s → fail
  payload = JSON.parse(b64urlDecode(p)); k = keys[payload.kv] ; if !k → fail
  if !timingSafeEqual(s, HMAC(k, h + '.' + p)) → fail          // crypto.subtle.verify (thời gian hằng)
  if payload.exp < now → fail('expired')
  return payload
receiptSig = HMAC(RECEIPT_KEY, [k, acc, ref, score, pts, dh, iat].join('|'))
```

Xoay khóa: `keys = { [kvMới]: khóa mới, [kvCũ]: khóa cũ }` trong 7 ngày rồi bỏ khóa cũ.

## D.13 Gộp bản lưu

```
mergeSaves(L, R):                               // L cục bộ, R máy chủ
  out = deepCopy(R)
  for k in ['achievements']:               out[k] = { ...R[k], ...L[k] } (lấy ts nhỏ hơn khi cả hai có)
  for k in ['incenseDays','stationsVisited','world.visited','world.unlocked','wardrobe.owned']: out[k] = union(L[k], R[k])
  out.ledger.entries = unionById(L, R) ; recomputeTotals(out.ledger)
  out.quests.done = { ...R.done, ...L.done } (khóa trùng: at nhỏ hơn)
  for id in keys(L.quests.active ∪ R.quests.active): out.quests.active[id] = better(L, R)   // hist dài hơn, rồi since mới hơn
     nếu id ∈ out.quests.done: xóa khỏi active
  out.xp = max(L.xp, R.xp) ; out.dao.realmMax = max(...)
  out.dao.daoHanh = L.dao.rev ≥ R.dao.rev ? L.dao.daoHanh : R.dao.daoHanh
  for k in ['phucKhi','settings','player.name','player.look','player.robe','persona.mem']: newer(L.savedAt, R.savedAt)
  out.wardrobe.ngoc = R.wardrobe.ngoc                 // máy chủ là nguồn đúng
  out.rev = max(L.rev, R.rev) + 1
  return out
```

Tính chất kiểm (`test-merge-saves`): `merge(x, x) ≡ x` (bỏ `rev`); hợp tập giao hoán; `merge` không làm giảm `xp`, `realmMax`, số nhiệm vụ đã xong.

## D.14 Bộ điều chỉnh chất lượng

```
ring = CircularBuffer(240)                       // ~2–4 s khung
sample(ms):
  ring.push(ms); t = now()
  if t − lastEval < 2000: return
  lastEval = t; p90 = quantile(ring, 0.9)
  if t < lockUntil: return
  if p90 > budget × 1.15: overCount++ else overCount = 0
  if p90 < budget × 0.70: underSince ??= t else underSince = null
  if overCount ≥ 2 && level < 7 && level < cap: level++; apply(KNOBS[level−1], 'down'); lockUntil = t + 4000; overCount = 0
  elif underSince && t − underSince ≥ 10000 && level > 0: apply(KNOBS[level−1], 'up'); level--; lockUntil = t + 4000; underSince = null
```

`quantile` trên 240 mẫu: sao chép + `sort` mỗi 2 s — rẻ. Test bằng chuỗi thời gian giả (phần 09 §10).

## D.15 Cắt câu tiếng Việt cho `postFilter`

```
splitSentences(text):
  bảo vệ: số thập phân «1,5», chữ viết tắt «v.v.», «TP.», chuỗi Hán trong 「」/«», danh sách gạch đầu dòng
  tách tại /([.!?…])\s+(?=[A-ZÀ-Ỹ0-9«"(•\-])/u và tại xuống dòng
  giữ nguyên dấu câu cuối mỗi câu
```

Bộ lọc thay **cả câu**, không thay từ, để câu còn lại vẫn đúng ngữ pháp. Nếu ≥ 50% câu bị gỡ → bỏ cả câu trả lời, dùng thoại thay thế (tránh câu trả lời rời rạc).

## D.16 Tìm lá số mẫu theo dải (`gen-mau-charts`)

```
for y in 1950..2010, m in 1..12, d in [3, 11, 19, 27], h in [0, 4, 8, 12, 16, 20] (thứ tự xáo bằng rng(2026)):
  R = analyze(y, m, d, h, 30, gender ∈ ['nam','nữ'] luân phiên, 2026)
  phân loại: band(score) ∈ {<28, 28–35, 50–57, ≥73}, quality ∈ {有救, 特殊, 未知}
  lấy lá số đầu tiên cho mỗi ô còn trống; dừng khi đủ hoặc sau 50.000 lá số
ghi id MAU-C… theo thứ tự cố định của bảng nhóm
```

Hạt giống cố định → chạy lại cùng engine cho cùng kết quả; engine đổi → có thể chọn lá số khác (cảnh báo, người duyệt quyết).
