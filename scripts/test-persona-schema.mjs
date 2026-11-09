// Test NPC-AI G0 · SCHEMA 20 PERSONA (mục 15 §15.5f; đặc tả mục 16 §16.3.2).
// Node thuần, không DOM — import thẳng module game. Chạy:
//   node scripts/test-persona-schema.mjs
import assert from 'node:assert/strict';
import {
  PERSONAS, PERSONA_IDS, PERSONA_CHUNG_LUAT, PERSONA_CHUNG_10_LUAT,
} from '../src/game/persona-data.js';
import { getPersona, personaSystemPrompt, personaBark } from '../src/game/npc-personas.js';

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.stack.split('\n').slice(0, 4).join('\n ')); process.exitCode = 1; } };

// ---- Bảng chốt mục 04 §4.3: 20 id + mức aiEnabled (10 co · 4 khong · 6 kichban)
const BANG_04 = {
  thay_tubinh: 'co', khong_tiensinh: 'co', van_coc: 'co', te_tuu: 'co',
  huyen_hu: 'co', maoshan_daonhan: 'co', phan_quan: 'co', diatang_su: 'co',
  dan_dinh: 'co', phuong_si: 'co',
  gac_cong: 'khong', tho_may: 'khong', lo_ban_su: 'khong', dinh_menh_hoi: 'khong',
  truong_thiensu: 'kichban', dieu_am: 'kichban', truclam_thiensu: 'kichban',
  khau_daotruong: 'kichban', vu_y_amau: 'kichban', lama_dakiet: 'kichban',
};
// Bảng biến ĐÓNG của personaSystemPrompt (mục 04 §4.4.1) — chủ sở hữu duy nhất.
const BANG_BIEN_DONG = new Set([
  'name', 'story', 'soCauDo', 'hinhAnh', 'moDau', 'ketCau', 'cam', 'mau',
  'tuXung', 'goi', 'ctx', 'ctx.theoDao', 'ctx.liudao', 'ctx.talu', 'ctx.soChu',
]);

// ---------------------------------------------------------------- súкость ----
test('Đủ 20 persona id, khớp đúng bảng chốt mục 04 §4.3 (không thiếu, không thừa)', () => {
  assert.equal(PERSONAS.length, 20, `phải đúng 20 persona, thấy ${PERSONAS.length}`);
  assert.deepEqual([...PERSONA_IDS].sort(), Object.keys(BANG_04).sort());
  for (const p of PERSONAS) assert.equal(p.id, BANG_04[p.id] ? p.id : undefined, `id lạ: ${p.id}`);
});

test('Id duy nhất — không persona nào trùng id', () => {
  assert.equal(new Set(PERSONA_IDS).size, 20);
});

test('Schema: mỗi persona đủ 7 trường + id, đúng kiểu, không rỗng', () => {
  for (const p of PERSONAS) {
    assert.ok(typeof p.id === 'string' && p.id, `${p.id}: id string không rỗng`);
    // 7 trường dữ liệu hợp đồng (mục 16 §16.3.2 — không null, không chuỗi rỗng)
    assert.ok(typeof p.name === 'string' && p.name.trim(), `${p.id}: name`);
    assert.ok(p.danhXung && typeof p.danhXung === 'object', `${p.id}: danhXung object`);
    assert.ok(typeof p.danhXung.tuXung === 'string' && p.danhXung.tuXung, `${p.id}: danhXung.tuXung`);
    assert.ok(typeof p.danhXung.goi === 'string' && p.danhXung.goi, `${p.id}: danhXung.goi`);
    assert.ok(['co', 'khong', 'kichban'].includes(p.aiEnabled), `${p.id}: aiEnabled 3 mức`);
    assert.ok(typeof p.story === 'string' && p.story.trim(), `${p.id}: story`);
    // voice đủ 6 khoá con (mục 04 §4.1.1)
    assert.ok(p.voice && typeof p.voice === 'object', `${p.id}: voice object`);
    for (const k of ['soCauDo', 'hinhAnh', 'moDau', 'ketCau']) {
      assert.ok(typeof p.voice[k] === 'string' && p.voice[k].trim(), `${p.id}: voice.${k}`);
    }
    assert.ok(Array.isArray(p.voice.cam) && p.voice.cam.length > 0
      && p.voice.cam.every((c) => typeof c === 'string' && c.trim()), `${p.id}: voice.cam[]`);
    assert.ok(Array.isArray(p.voice.mau) && p.voice.mau.length >= 3 && p.voice.mau.length <= 5
      && p.voice.mau.every((m) => typeof m === 'string' && m.trim()), `${p.id}: voice.mau[] đúng 3–5 câu`);
    assert.ok(typeof p.promptTemplate === 'string' && p.promptTemplate.trim(), `${p.id}: promptTemplate`);
    assert.ok(Array.isArray(p.barkPool) && p.barkPool.length > 0
      && p.barkPool.every((b) => typeof b === 'string' && b.trim()), `${p.id}: barkPool[]`);
    // không thêm thẻ cấu hình lượt gọi vào object (mục 04 §4.4.4)
    for (const k of ['toolsAllow', 'briefMode', 'fallback', 'style', 'lengthHint']) {
      assert.ok(!(k in p), `${p.id}: thẻ lượt gọi "${k}" không được là trường của PERSONA object`);
    }
  }
});

test('aiEnabled khớp bảng chốt §4.3: tổng 10 co + 4 khong + 6 kichban', () => {
  for (const p of PERSONAS) assert.equal(p.aiEnabled, BANG_04[p.id], `${p.id}: aiEnabled`);
  const dem = (m) => PERSONAS.filter((p) => p.aiEnabled === m).length;
  assert.equal(dem('co'), 10); assert.equal(dem('khong'), 4); assert.equal(dem('kichban'), 6);
});

test('Tên đúng docs canon từng chữ (Vân Cốc không Vạn Cốc, Khổng không Không, Diệu Âm không Điều Âm…)', () => {
  const tenChuan = {
    van_coc: 'Vân Cốc (thiền sư)', khong_tiensinh: 'Khổng tiên sinh',
    truong_thiensu: 'Trương Thiên Sư', dieu_am: 'Ni sư Diệu Âm',
    te_tuu: 'Tế tửu Văn Miếu (Chu Văn Trinh)', huyen_hu: 'Huyền Hư chân nhân (Võ Đăng)',
    khau_daotruong: 'Khâu đạo trưởng (Chung Nam)', maoshan_daonhan: 'Mao Sơn đạo nhân (Mao Tiểu Tùng)',
    truclam_thiensu: 'Thiền sư Trúc Lâm (Yên Tử)', lama_dakiet: 'Lạt-ma Đa Kiệt (Tàng Địa)',
    phan_quan: 'Phán quan Thôi', diatang_su: 'Địa Tạng sứ giả', vu_y_amau: 'Vu y bà A Mậu',
    lo_ban_su: 'Yểm sư Lỗ Ban (Công Thâu Nghiệt)', dinh_menh_hoi: 'Định Mệnh Hội',
    gac_cong: 'Lão Tùng (gác cổng Sơn Môn)', tho_may: 'Bà Tư thợ may (Tiên Y)',
    dan_dinh: 'Đan Đỉnh chân nhân (Cát Huyền)', phuong_si: 'Phương sĩ Vô Danh',
    thay_tubinh: 'Thầy Tử Bình',
  };
  for (const p of PERSONAS) assert.equal(p.name, tenChuan[p.id], `${p.id}: name phải khớp canon`);
});

test('Lạt-ma Đa Kiệt: runtime:false cứng + getPersona TỪ CHỐI khi cờ runtime tôn giáo chưa bật', () => {
  const lama = PERSONAS.find((p) => p.id === 'lama_dakiet');
  assert.equal(lama.runtime, false, 'guard dữ liệu runtime:false (mục 15 §15.5a)');
  assert.equal(typeof lama.kichbanLyDo, 'string', 'kichbanLyDo ghi lý do chờ biên bản');
  assert.equal(getPersona('lama_dakiet'), null, 'chưa bật cờ → từ chối (null), không trả persona nháp');
  assert.equal(getPersona('lama_dakiet', {}), null, 'opts rỗng vẫn từ chối — fail-closed');
  const mo = getPersona('lama_dakiet', { allowReligionRuntime: true });
  assert.ok(mo && mo.id === 'lama_dakiet', 'cờ bật (biên bản có hiệu lực) → trả persona cho đường kịch bản');
});

test('getPersona: id lạ → null, không ném; id hợp lệ → persona đúng', () => {
  assert.equal(getPersona('khong_co_ai_day'), null);
  assert.equal(getPersona('van_coc'), null === getPersona('van_coc') ? null : getPersona('van_coc'));
  assert.equal(getPersona('van_coc').id, 'van_coc');
  assert.equal(getPersona('khach_dieuhau'), null, 'nhóm khách AI-light không có PERSONA object (mục 04 §4.3)');
});

test('promptTemplate chỉ dùng biến trong BẢNG ĐÓNG mục 04 §4.4.1 (biến lạ đi literal vào prompt)', () => {
  for (const p of PERSONAS) {
    const gaps = [...p.promptTemplate.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1].trim());
    for (const g of gaps) {
      assert.ok(BANG_BIEN_DONG.has(g), `${p.id}: biến "{{${g}}}" ngoài bảng đóng — bị gửi literal vào prompt`);
    }
  }
});

test('personaSystemPrompt thay ĐỦ mọi biến — ctx đầy đủ → kết quả KHÔNG còn "{{"', () => {
  const ctx = {
    gioiThieu: 'Bối cảnh: khách đang ngồi ở sân Sơn Môn.', theoDao: 'người chơi đã theo Chính Nhất',
    liudao: 'tham 2 · sân 1 · si 3', talu: 'người chơi đang ở Tà Lộ', soChu: 170,
  };
  for (const p of PERSONAS) {
    const out = personaSystemPrompt(p, ctx);
    assert.ok(!out.includes('{{'), `${p.id}: prompt còn khe chưa thay:\n${out.match(/.{0,60}\{\{[^}]+\}\}.{0,40}/)?.[0] || ''}`);
    assert.ok(out.includes(p.name), `${p.id}: có tên nhân vật`);
    assert.ok(out.includes(p.story), `${p.id}: có story`);
  }
});

test('personaSystemPrompt: khe ctx thiếu → chuỗi rỗng (không bịa dữ kiện), prompt vẫn đủ biến chính', () => {
  const p = getPersona('dieu_am'); // persona dùng khe ctx con {{ctx.talu}} (hồ sơ 21)
  const out = personaSystemPrompt(p, {});
  assert.ok(!out.includes('{{'));
  const dayDu = personaSystemPrompt(p, { talu: 'đang ở Tà Lộ' });
  assert.ok(dayDu.includes('đang ở Tà Lộ'), 'khe talu có dữ liệu thì được nạp đúng chỗ');
});

test('PERSONA-CHUNG: đủ 10 luật, đánh số cố định 1→10, có mệnh đề thắng + quy tắc ghép', () => {
  assert.equal(PERSONA_CHUNG_LUAT.length, 10, 'đúng 10 luật — không hơn không kém');
  PERSONA_CHUNG_LUAT.forEach((luat, i) => {
    assert.ok(luat.startsWith(`Luật ${i + 1} — `), `luật ${i + 1} đánh số đúng vị trí cố định`);
    assert.ok(luat.length > 40, `luật ${i + 1} có nội dung`);
  });
  assert.ok(PERSONA_CHUNG_10_LUAT.includes('LUẬT CHUNG THẮNG'), 'mệnh đề ưu tiên (§4.2)');
  assert.ok(PERSONA_CHUNG_10_LUAT.includes('ghép TRƯỚC'), 'quy tắc ghép (§4.2)');
});

test('Thứ tự ghép: PERSONA-CHUNG TRƯỚC biến thể (quy tắc ghép mục 04 §4.2)', () => {
  const p = getPersona('van_coc');
  const out = personaSystemPrompt(p, {});
  const viChung = out.indexOf('PERSONA-CHUNG');
  const viBienThe = out.indexOf(p.story);
  assert.ok(viChung >= 0 && viBienThe > viChung, 'khung 10 luật đứng trước phần biến thể nhân vật');
  assert.ok(out.startsWith('== NHÂN VẬT: Vân Cốc (thiền sư) =='), 'dòng nhân vật mở đầu theo khuôn §4.4.1');
});

test('personaSystemPrompt: persona rỗng / promptTemplate rỗng → throw lỗi rõ ràng', () => {
  assert.throws(() => personaSystemPrompt(null), /không tồn tại|promptTemplate/i);
  assert.throws(() => personaSystemPrompt(undefined, {}), /không tồn tại/i);
  assert.throws(() => personaSystemPrompt({ id: 'x', promptTemplate: '' }), /promptTemplate/);
  assert.throws(() => personaSystemPrompt({ id: 'x' }), /promptTemplate/);
});

test('personaBark: cùng seed → cùng bark; bark trả về nằm trong pool; pool thiếu → ""', () => {
  const p = getPersona('thay_tubinh');
  for (let i = 0; i < 20; i++) {
    const a = personaBark(p, '2026-11-09:an0:pid42');
    const b = personaBark(p, '2026-11-09:an0:pid42');
    assert.equal(a, b, 'same-seed deterministic (khuôn npc.js:41)');
    assert.ok(p.barkPool.includes(a), 'bark phải nguyên văn từ pool — bark là thoại viết sẵn (§4.5)');
  }
  assert.equal(personaBark(null, 'x'), '', 'persona thiếu → chuỗi rỗng, không ném');
});

console.log(`\nPersona schema — ${passed} test đạt.`);
