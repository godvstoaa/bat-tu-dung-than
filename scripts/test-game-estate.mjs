// ============================================================================
//  TEST NHÀ RIÊNG (estate.js, estate-core.js, homefs.js, state.grantHome, protocol est_* — thuần Node):
//   · danh sách rao bán tất định, đủ 4 hạng, khớp LISTING_TIERS (máy chủ dùng bản lõi nhẹ);
//   · mã hoá bố cục hai chiều; chuỗi rác / món không phải bài trí bị từ chối;
//   · kiểm tra đặt đồ: đè nhau, ra ngoài, chặn lối cửa, đồ chức năng không tới được;
//   · phong thủy theo lá số mẫu: luật cộng / trừ đúng chiều; thưởng ngày có trần;
//   · giao thức: gói est_* hợp lệ qua, sai bị bỏ.
// ============================================================================
import assert from 'node:assert/strict';
import * as E from '../src/game/estate.js';
import * as EC from '../src/game/estate-core.js';
import { scoreHome, warmReward, sectorOf } from '../src/game/homefs.js';
import { createState, grantHome, HOME_DAILY_CAP } from '../src/game/state.js';
import { parseClient } from '../src/game/protocol.js';

let pass = 0;
const fails = [];
const check = (name, fn) => {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { fails.push(`${name} → ${e.message}`); console.log(`  ✗ ${name}`); }
};
const L = E.listings();
const room = { w: 13, d: 10 };
const it = (u, i, x, z, r = 0) => ({ u, i, x, z, r });

check(`${L.length} nhà rao bán tất định, đủ 4 hạng, khớp LISTING_TIERS`, () => {
  assert.deepEqual(L.map((l) => l.tier), EC.LISTING_TIERS);
  for (const t of Object.keys(E.TIERS)) assert.ok(L.some((l) => l.tier === t), t);
  assert.equal(L.filter((l) => l.tier === 'bietphu').length, 16);
  assert.equal(L.filter((l) => l.tier === 'bietthu').length, 240);
  for (const l of L.filter((q) => q.tier === 'bietphu')) assert.ok(l.W * l.D >= 4000 && l.W * l.D <= 10000, `${l.name} ${l.W * l.D} m²`);
  assert.equal(new Set(L.filter((q) => q.tier === 'bietphu').map((q) => q.style)).size, 16, 'mỗi phủ một phong cách');
  L.slice(0, 16).forEach((l, i) => assert.equal(l.mansion, i, 'biệt phủ chiếm h 0–15'));
  assert.equal(new Set(L.map((l) => l.name)).size, L.length);
  for (const l of L) assert.ok(l.house?.door, `${l.name} không có cửa`);
});
check('phòng trong khớp khung nhà ngoài: bảng LISTING_ROOMS (máy chủ) = listings().room; mỗi phòng ≤ khung ngoài, đủ ở (≥ 7 × 5 m); bố cục cũ không vừa thì cất bớt', () => {
  const homes = L.filter((l) => !l.W);
  assert.deepEqual(homes.map((l) => [l.room.w, l.room.d]), E.LISTING_ROOMS);
  for (const l of homes) { const r = E.roomOfH(l.h); assert.equal(r.w, l.room.w); assert.equal(r.d, l.room.d); assert.ok(r.w * r.d >= 35 && r.w >= 7, `${l.name} ${r.w}×${r.d}`); assert.ok(r.w <= l.house.f * 1.015, `${l.name} rộng hơn nhà ngoài`); }
  const room = E.roomOf(homes[0]);
  const big = [{ u: 'a', i: 'giuong', x: -room.w / 2 + 1.8, z: -room.d / 2 + 1.8, r: 0 }, { u: 'b', i: 'ghe_tanh', x: room.w / 2 + 3, z: 0, r: 0 }];
  const f = E.fitLayout(room, big); assert.equal(f.keep.length, 1); assert.equal(f.drop[0].u, 'b');
  assert.ok(E.validLayout(E.roomOfH(homes[0].h), f.keep));
});
check('giá: Biệt Viện bằng Ngọc, Tứ Hợp Viện có giá Ngọc thay thế; hợp mệnh theo Dụng thần', () => {
  assert.ok(E.priceOf(L.find((l) => l.tier === 'bietphu')).xu >= 100 * 100000 && E.altPriceOf(L.find((l) => l.tier === 'bietphu')).ngoc > 0);
  assert.ok(E.altPriceOf(L.find((l) => l.tier === 'tuhop')).ngoc > 0);
  const y = { primary: '火', accent: '土', ji: '水' };
  assert.equal(E.fitStars('火', y), 5); assert.equal(E.fitStars('土', y), 4); assert.equal(E.fitStars('水', y), 1); assert.equal(E.fitStars('木', y), 4);
  assert.equal(E.fitStars('金', null), 3);
});
check('mã hoá bố cục hai chiều; rác / đồ dùng / quá 60 món bị từ chối', () => {
  const items = [it(1, 'ban_tho', 0, -4, 0), it(2, 'giuong', 4.25, -2.5, 1), it(3, 'tranh_son_thuy', 0, -4.75, 0)];
  const back = E.decodeLayout(E.encodeLayout(items));
  assert.deepEqual(back.map((m) => [m.i, m.x, m.z, m.r]), items.map((m) => [m.i, m.x, m.z, m.r]));
  assert.equal(E.decodeLayout('<script>'), null);
  assert.equal(E.decodeLayout('zz,0,0,0'), null);
  const tea = EC.encodeLayout([it(1, 'tra_longtinh', 0, 0)]); assert.equal(E.decodeLayout(tea), null, 'đồ dùng không bài trí được');
  assert.equal(E.decodeLayout(Array(241).fill('0,0,0,0').join(';')), null, 'quá 240 món');
  assert.equal(E.decodeLayout(Array(61).fill('0,0,0,0').join(';'), E.MAX_ITEMS), null, 'nhà nhỏ quá 60 món');
  assert.equal(E.decodeLayout('0,0,0,0,1,9'), null, 'thừa trường');
});
check('canPlace: ra ngoài, đè nhau, chặn lối cửa bị từ chối; treo tường không đè nhau trên cùng vách', () => {
  assert.equal(E.canPlace(room, [], it(1, 'giuong', 6, 0)).ok, false, 'ra ngoài');
  assert.equal(E.canPlace(room, [it(1, 'ban_tron', 2, -2)], it(2, 'ban_tra', 2.5, -2)).ok, false, 'đè nhau');
  assert.equal(E.canPlace(room, [], it(1, 'ban_tra', 0, 4)).ok, false, 'chặn lối cửa');
  assert.ok(E.canPlace(room, [], it(1, 'ban_tra', 3, 0)).ok);
  const w1 = { ...it(1, 'tranh_son_thuy', 0, 0), ...E.snapWall(room, 0, -10) };
  assert.equal(w1.r, 0);
  assert.equal(E.canPlace(room, [w1], { ...w1, u: 2 }).ok, false);
  assert.ok(E.canPlace(room, [w1], { ...it(2, 'tranh_mai', 0, 0), ...E.snapWall(room, 10, 0) }).ok, 'vách khác thì được');
});
check('unreachable: đồ chức năng bị vây kín thì báo; validLayout tổng hợp', () => {
  const small = { w: 10, d: 8 };
  const ok = [it(1, 'ban_tho', 0, -3, 0), it(2, 'ban_tra', 3, -1)];
  assert.equal(E.unreachable(small, ok).length, 0); assert.ok(E.validLayout(small, ok));
  // hàng bình phong + tủ chắn ngang phòng: bàn thờ phía sau không còn lối tới
  const boxed = [it(1, 'ban_tho', 0, -3.0, 0), it(2, 'binh_phong', -3.25, -1.5, 0), it(3, 'binh_phong', -0.85, -1.5, 0), it(4, 'binh_phong', 1.55, -1.5, 0), it(5, 'tu_cham', 3.4, -1.5, 0)];
  const bad = E.unreachable(small, boxed);
  assert.ok(bad.some((m) => m.i === 'ban_tho'), 'bàn thờ bị vây mà không báo');
  assert.equal(E.validLayout(small, boxed), false);
});
check('phong thủy: bàn thờ tựa vách sau nhìn ra cửa (+), giường đối cửa (−), nước phương Nam (−), hành theo lá số', () => {
  const y = { primary: '火', accent: '土', ji: '水' };
  const base = scoreHome({ room, items: [], yong: y, wardWx: '火' });
  assert.equal(base.score, 58);
  const altarGood = scoreHome({ room, items: [it(1, 'ban_tho', 3, -4.4, 0)], yong: y });
  const altarBack = scoreHome({ room, items: [it(1, 'ban_tho', 3, 0, 2)], yong: y });
  assert.ok(altarGood.score > altarBack.score, `${altarGood.score} > ${altarBack.score}`);
  const bedDoor = scoreHome({ room, items: [it(1, 'giuong', 0, -2, 0)] }), bedWall = scoreHome({ room, items: [it(1, 'giuong', -4.75, -2, 0)] });
  assert.ok(bedWall.score > bedDoor.score);
  // fry = 0: cửa (+z) quay hướng Nam → nửa phòng phía cửa là Nam
  assert.equal(sectorOf(0, 4, 0), 'Nam'); assert.equal(sectorOf(0, -4, 0), 'Bắc'); assert.equal(sectorOf(4, 0, 0), 'Đông');
  const waterS = scoreHome({ room, items: [it(1, 'be_ca', 1, 3.6)] }), waterN = scoreHome({ room, items: [it(1, 'be_ca', 0.5, -3.8)] });
  assert.equal(sectorOf(1, 3.6, 0), 'Nam'); assert.equal(sectorOf(0.5, -3.8, 0), 'Bắc');
  assert.ok(waterN.score > waterS.score, `nước Bắc ${waterN.score} > nước Nam ${waterS.score}`);
  const fireItems = scoreHome({ room, items: [it(1, 'ghe_son', -4, -3), it(2, 'den_long_do', 4, -3.5)], yong: y });
  const waterItems = scoreHome({ room, items: [it(1, 'binh_ngoc', -4, -3), it(2, 'chum_nuoc', 4, -3.5)], yong: y });
  assert.ok(fireItems.score > waterItems.score, 'đồ hành Dụng thần phải hơn đồ hành Kỵ thần');
  for (const r of [altarGood, bedDoor, waterS]) assert.ok(r.score >= 0 && r.score <= 100 && r.notes.length);
});
check(`thưởng nhà mỗi khoá một lần / ngày, tổng ≤ ${HOME_DAILY_CAP}; về nhà = 3 + điểm/10`, () => {
  const s = createState();
  assert.equal(warmReward(0), 3); assert.equal(warmReward(100), 13);
  assert.equal(grantHome(s, 'altar', 12), 12); assert.equal(grantHome(s, 'altar', 12), 0);
  let total = 12;
  for (const k of ['tea', 'books', 'fish', 'plant', 'warm', 'pray:a', 'pray:b', 'pray:c']) total += grantHome(s, k, 13);
  assert.equal(total, HOME_DAILY_CAP);
  assert.equal(grantHome(s, 'x', 99), 0);
});
check('giao thức est_*: h trong khoảng, bố cục hợp lệ mới qua; gói est_save được dài hơn 1024', () => {
  assert.ok(parseClient(JSON.stringify({ t: 'est_list', q: 1 })));
  assert.ok(parseClient(JSON.stringify({ t: 'est_claim', h: L.length - 1, q: 2 })));
  assert.equal(parseClient(JSON.stringify({ t: 'est_claim', h: L.length, q: 2 })), null);
  assert.equal(parseClient(JSON.stringify({ t: 'est_like', h: '1' })), null);
  const good = EC.encodeLayout([it(1, 'ban_tho', 0, -3, 0), it(2, 'ban_tra', 2.5, -0.5, 0)]);
  assert.ok(parseClient(JSON.stringify({ t: 'est_save', h: 0, it: good, c: 0, q: 3 })));
  assert.equal(parseClient(JSON.stringify({ t: 'est_save', h: 0, it: good, c: 99, q: 3 })), null, 'câu đối ngoài danh sách');
  assert.equal(parseClient(JSON.stringify({ t: 'est_save', h: 0, it: '0,0,40,0', c: 0, q: 3 })), null, 'ra ngoài phòng');
  // bố cục lớn (nhiều món nhỏ trong Biệt Viện) > 1024 ký tự vẫn qua
  const bv = L.findIndex((l) => l.tier === 'bietphu'), many = [];
  for (let k = 0; k < 40; k++) many.push({ ...it(k + 1, 'chau_lan', -40 + (k % 10) * 1.2, -7.5 + Math.floor(k / 10) * 1.4, 0), k: EC.zonesOfH(bv).find((z) => z.id === 'front').k }); // 40 chậu lan trong Tiền Viện
  const big = JSON.stringify({ t: 'est_save', h: bv, it: EC.encodeLayout(many), c: 0, q: 4, pad: 'x'.repeat(700) });
  assert.ok(big.length > 1024);
  assert.ok(parseClient(big), 'gói lớn hợp lệ bị bỏ');
});

check('biệt phủ / biệt thự: bố cục theo vùng — đồ đúng nhà / sân qua; ra ngoài vùng · đè lối · treo tường ngoài sân bị từ chối', () => {
  const phu = EC.roomOfH(0), Z = EC.zonesOfH(0), k = (id) => Z.find((z) => z.id === id).k;
  assert.ok(phu.mansion && Z.length >= 4);
  const front = Z.find((z) => z.id === 'front'), guest = Z.find((z) => z.id === 'guest');
  const ok = [{ ...it(1, 'ban_tho', 8, -Z[0].d / 2 + 1.6, 0), k: 0 }, { ...it(2, 'giuong', -3, 0, 1), k: k('guest') }, { ...it(3, 'be_ca', -20, 0), k: k('front') }, { ...it(4, 'tranh_son_thuy', 0, 0), ...EC.snapWall(EC.zoneRoom(guest), 0, -10), k: k('guest') }];
  assert.ok(EC.validLayout(phu, ok), 'bố cục hợp lệ bị từ chối');
  assert.equal(EC.validLayout(phu, [{ ...it(1, 'ban_tra', 0, guest.d / 2 + 1), k: k('guest') }]), false, 'nhà khách: ra ngoài');
  assert.equal(EC.validLayout(phu, [{ ...it(1, 'ban_tra', 0, 0), k: k('front') }]), false, 'tiền viện: giữa lối đi');
  assert.equal(EC.validLayout(phu, [{ ...it(1, 'tranh_son_thuy', 0, 0, 0), k: k('front') }]), false, 'treo tường ngoài sân');
  assert.equal(EC.validLayout(phu, [{ ...it(1, 'ban_tra', 0, -Z[0].d / 2 + 1.2), k: 0 }]), false, 'chính đường có cửa sau: lối sau phải trống');
  assert.equal(EC.validLayout(EC.roomOfH(EC.LISTING_COUNT - 1), [{ ...it(1, 'ban_tra', 3, 0), k: 2 }]), false, 'nhà phố không có vùng');
  assert.deepEqual(EC.decodeLayout(EC.encodeLayout(ok)).map((m) => m.k), ok.map((m) => m.k));
  // biệt thự: nhà chính + sân trước
  const vh = EC.PHU_COUNT + 3, vz = EC.zonesOfH(vh);
  assert.ok(EC.roomOfH(vh).mansion && vz.some((z) => z.kind === 'hall') && vz.some((z) => z.kind === 'yard'));
  assert.ok(EC.validLayout(EC.roomOfH(vh), [{ ...it(1, 'ban_tho', 3, -2.6, 0), k: 0 }]));
});

console.log(fails.length ? `\n${fails.length} test TRƯỢT:` : '');
for (const f of fails) console.log('  - ' + f);
console.log(fails.length ? `\n${pass} test đạt, ${fails.length} trượt` : `\n${pass} test đạt`);
process.exit(fails.length ? 1 : 0);
