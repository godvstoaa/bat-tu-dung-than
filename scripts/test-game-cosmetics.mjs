// Test Tàng Y Các (src/game/cosmetics.js) + thưởng Hợp mệnh (state.js › recordCase)
import assert from 'node:assert/strict';
import * as C from '../src/game/cosmetics.js';
import * as S from '../src/game/state.js';
import { parseClient } from '../src/game/protocol.js';

let n = 0;
const t = (name, fn) => { fn(); n += 1; console.log('✓', name); };
const fresh = () => { const s = S.createState(new Date(2026, 10, 4)); C.wardrobe(s); return s; };

t('Danh mục: id duy nhất, đúng ô, mỗi bộ 4 món khác ô, món trả phí có giá', () => {
  const ids = new Set(C.ITEMS.map((i) => i.id));
  assert.equal(ids.size, C.ITEMS.length);
  const slots = new Set(C.SLOTS.map((x) => x.id));
  for (const it of C.ITEMS) {
    assert.ok(slots.has(it.slot), it.id);
    assert.ok(it.rarity >= 1 && it.rarity <= 5);
    if (!it.free) assert.ok(it.price && (it.price.phuc > 0 || it.price.ngoc > 0), `${it.id} thiếu giá`);
  }
  for (const st of C.SETS) {
    assert.equal(st.pieces.length, 4);
    assert.equal(new Set(st.pieces.map((p) => C.ITEM[p].slot)).size, 4, `bộ ${st.id} trùng ô`);
    for (const p of st.pieces) assert.equal(C.ITEM[p].set, st.id);
  }
  assert.ok(C.ITEMS.length >= 45);
});

t('Tủ đồ mặc định: đồ miễn phí có sẵn, đang mặc đồ mặc định', () => {
  const s = fresh(), w = C.wardrobe(s);
  for (const [slot, id] of Object.entries(C.DEFAULT_EQUIP)) { assert.ok(w.owned.includes(id)); assert.equal(w.equipped[slot], id); }
  assert.equal(w.ngoc, 0);
});

t('Mua: trừ đúng tiền, thiếu tiền / đã có / VIP / cấp / chuỗi điểm danh bị chặn', () => {
  const s = fresh(); s.phucKhi = 300;
  assert.equal(C.buy(s, 'y_bach').ok, true); assert.equal(s.phucKhi, 60);
  assert.match(C.buy(s, 'y_bach').reason, /Đã có/);
  assert.match(C.buy(s, 'phat_tran').reason, /Thiếu Phúc Khí/);
  C.wardrobe(s).ngoc = 2000;
  assert.match(C.buy(s, 'y_tu').reason, /VIP/);
  assert.equal(C.buy(s, 'y_tu', { vip: true }).ok, true);
  assert.match(C.buy(s, 'quan_sen', { vip: true, level: 9 }).reason, /cấp 10/);
  assert.match(C.buy(s, 'khung_long').reason, /điểm danh 7/);
  assert.equal(C.wardrobe(s).ngoc, 2000 - 380);
  assert.equal(s.xp, 0, 'tiêu Phúc Khí không làm giảm cấp');
});

t('Mặc đủ bộ hợp Dụng thần → Hợp mệnh +10% khi giải án; tháo một món thì mất', () => {
  const s = fresh(); C.wardrobe(s).ngoc = 5000;
  const set = C.SETS.find((x) => x.id === 'thuy');
  for (const p of set.pieces) { assert.equal(C.buy(s, p).ok, true); C.equip(s, p, '水'); }
  const b = C.setBonus(s, '水'); assert.equal(b.set.id, 'thuy'); assert.equal(b.matched, true);
  assert.equal(C.wardrobe(s).bonus, 0.1);
  assert.equal(S.recordCase(s, { kind: 'desk', id: 'trach', name: 'x', total: 1 }, new Date(2026, 10, 4)), Math.round(S.DESK_REWARD * 1.1));
  assert.equal(C.setBonus(s, '火').matched, false, 'bộ không hợp mệnh thì không thưởng');
  C.unequip(s, 'head', '水'); assert.equal(C.wardrobe(s).bonus, 0);
});

t('Điểm danh: mỗi ngày một lần, chuỗi 7 ngày vòng lại, đứt chuỗi về ngày 1', () => {
  const s = fresh(); let total = 0;
  for (let d = 1; d <= 8; d++) { const r = C.checkin(s, new Date(2026, 10, d)); assert.equal(r.ok, true); assert.equal(r.day, ((d - 1) % 7) + 1); total += r.ngoc; }
  assert.equal(C.checkin(s, new Date(2026, 10, 8, 22)).ok, false);
  assert.equal(total, C.CHECKIN.reduce((a, b) => a + b, 0) + C.CHECKIN[0]);
  assert.equal(C.wardrobe(s).checkin.streak, 8);
  assert.equal(C.checkin(s, new Date(2026, 10, 12)).day, 1, 'nghỉ ngày → về ngày 1');
});

t('VIP nhận Ngọc mỗi ngày; quà lên cấp nhận dồn một lần', () => {
  const s = fresh();
  assert.equal(C.vipDaily(s, true, new Date(2026, 10, 4)), C.VIP_DAILY);
  assert.equal(C.vipDaily(s, true, new Date(2026, 10, 4, 23)), 0);
  assert.equal(C.vipDaily(s, false, new Date(2026, 10, 5)), 0);
  assert.equal(C.levelGifts(s, 5), 4 * C.LEVEL_GIFT);
  assert.equal(C.levelGifts(s, 5), 0);
});

t('MMO: mã hoá trang bị gọn, máy chủ lọc món lạ / sai ô', () => {
  const eq = { robe: 'y_hoa', head: 'kim_quan', back: 'canh_phuong', mount: 'kiem', frame: 'khung_tron' };
  const code = C.encodeCos(eq);
  assert.equal(code, 'r:y_hoa,h:kim_quan,b:canh_phuong');
  assert.deepEqual(C.decodeCos(code), { robe: 'y_hoa', head: 'kim_quan', back: 'canh_phuong' });
  assert.deepEqual(C.decodeCos('r:hack,h:y_hoa,b:ho_lo,<script>'), { back: 'ho_lo' });
  const m = parseClient(JSON.stringify({ t: 'hello', name: 'An', robe: '火', cos: 'r:y_hoa,x:zzz,h:kim_quan' }));
  assert.equal(m.cos, 'r:y_hoa,h:kim_quan');
  assert.deepEqual(parseClient(JSON.stringify({ t: 'cos', c: 'm:hac,f:khung_long' })), { t: 'cos', c: 'm:hac,f:khung_long' });
});

t('Lưu / đọc lại giữ tủ đồ', () => {
  const s = fresh(); C.wardrobe(s).ngoc = 999; s.phucKhi = 500; C.buy(s, 'y_bach'); C.equip(s, 'y_bach');
  const mem = new Map(); const st = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  S.saveState(s, st);
  const b = S.loadState(st, new Date(2026, 10, 4));
  assert.equal(C.wardrobe(b).equipped.robe, 'y_bach'); assert.equal(C.wardrobe(b).ngoc, 999);
});

console.log(`\n${n} test đạt`);
