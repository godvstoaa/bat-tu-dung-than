// Test tích hợp hai TÀI KHOẢN THỬ (localhost, OTP dev — không dùng dịch vụ thật) qua máy chủ cục bộ:
// ví chợ có trần, chợ ký gửi giữa hai tài khoản, hôn nhân một vợ một chồng, thầy mệnh lý + trọng tài gọi LLM.
// Chuẩn bị: `npm run dev:mmo` (cổng 8788) + `node scripts/mock-llm.mjs` (LLM giả cổng 8899) + nạp cấu hình AI cục bộ:
//   cd <os.tmpdir()>/huyenquan-mmo-dev && node <repo>/node_modules/wrangler/bin/wrangler.js kv key put "ai:config" //     '{"freePool":[{"name":"mock","endpoint":"http://127.0.0.1:8899/v1","model":"mock-1","apiKey":"test"}]}' --binding ADMIN_KV --local
// Chạy: node scripts/test-econ-accounts.mjs
import { EXAM } from '../src/game/divination.js';
const B = 'http://127.0.0.1:8788', WS = 'ws://127.0.0.1:8788';
async function login(email, name) {
  const H = { Origin: B, 'Content-Type': 'application/json' };
  const s = await (await fetch(`${B}/api/auth/otp/send`, { method: 'POST', headers: H, body: JSON.stringify({ kind: 'email', key: email }) })).json();
  const v = await fetch(`${B}/api/auth/otp/verify`, { method: 'POST', headers: H, body: JSON.stringify({ kind: 'email', key: email, code: s.dev, name }) });
  const cookie = (v.headers.get('set-cookie') || '').split(';')[0];
  const t = await (await fetch(`${B}/api/auth/ws-token`, { headers: { Cookie: cookie } })).json();
  return { cookie, tok: t.tok, name };
}
function connect(acc, room) {
  return new Promise((res) => {
    const ws = new WebSocket(`${WS}/ws/quan?room=${room}`), c = { ws, inbox: [] };
    ws.onmessage = (e) => c.inbox.push(JSON.parse(e.data));
    ws.onopen = () => { ws.send(JSON.stringify({ t: 'hello', name: acc.name, robe: '金', pid: 'p' + Math.random().toString(36).slice(2, 10), tok: acc.tok })); res(c); };
  });
}
const wait = async (c, p, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const i = c.inbox.findIndex(p); if (i >= 0) return c.inbox.splice(i, 1)[0]; await new Promise((r) => setTimeout(r, 40)); } return { ok: false, err: 'timeout' }; };
let q = 100;
const ask = async (c, op, a = {}) => { const id = ++q; c.ws.send(JSON.stringify({ t: 'ec', op, a, q: id })); await new Promise((r) => setTimeout(r, 120)); return wait(c, (m) => m.t === 'ec_res' && m.q === id); };
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) process.exitCode = 1; };

const room = 20 + Math.floor(Math.random() * 10), tag = Date.now().toString(36);
const nameA = `Thử A ${tag.slice(-4)}`, nameB = `Thử B ${tag.slice(-4)}`;
const A = await login(`thua.${tag}@example.test`, nameA), Bb = await login(`thub.${tag}@example.test`, nameB);
const a = await connect(A, room), b = await connect(Bb, room);
const wa = await wait(a, (m) => m.t === 'welcome'), wb = await wait(b, (m) => m.t === 'welcome');
const joinB = (await wait(a, (m) => m.t === 'join')) || {};
ok(!!wa.you && !!wb.you, 'hai tài khoản vào cùng phòng');
const uB = joinB.p?.u || joinB.u;
// ví chợ: tài khoản trần 5.000 đồng / ngày
ok((await ask(a, 'deposit', { xu: 400000, k: `da${tag}` })).ok, 'A gửi 4.000 đồng (tài khoản: trần 5.000)');
ok((await ask(b, 'deposit', { xu: 400000, k: `db${tag}` })).ok, 'B gửi 4.000 đồng');
ok(/5000|thêm được/.test((await ask(a, 'deposit', { xu: 200000, k: `dx${tag}` })).err || ''), 'vượt trần 5.000 / ngày bị chặn');
// chợ ký gửi
const thPrice = (await ask(a, 'th_board')).sell.find((x) => x.id === 'gao').price; // giá tham chiếu đổi theo giao dịch trước đó
await ask(a, 'th_buy', { id: 'gao', n: 10, k: `g${tag}` });
const post = await ask(a, 'mk_post', { i: 0, n: 5, price: 400 });
ok(post.ok, 'A (tài khoản) ký gửi 5 gạo giá 4 đồng');
const buy = await ask(b, 'mk_buy', { id: post.id, n: 5, k: `m${tag}` });
ok(buy.ok && !buy.hold && buy.inv.some((s) => s.id === 'gao' && s.n === 5), 'B mua được, hàng về túi B, không vào két (trong biên độ)');
const meA = await ask(a, 'me');
ok(meA.purse === 400000 - 10 * thPrice + Math.round(2000 - 60 - 100), `A nhận tiền trừ phí 3% + phí kho (ví A ${meA.purse})`);
// hôn nhân
const uOfB = uB;
const prop = await ask(a, 'cv_propose', { to: uOfB, tier: 'hanvi', phrase: 0 });
ok(prop.ok, 'A cầu hôn B (u từ gói join)');
const props = (await ask(b, 'cv_view')).props || [];
ok(props.some((p) => p.name === nameA), 'B thấy lời cầu hôn của A');
const ans = await ask(b, 'cv_answer', { from: props[0]?.from, yes: true });
ok(ans.ok && ans.married?.tierName === 'Hàn vi', 'B nhận lời → hôn thư Hàn vi (A trả 60 đồng)');
ok(/hôn thú/.test((await ask(a, 'cv_propose', { to: uOfB })).err || ''), 'một vợ một chồng: không cầu hôn khi đã có hôn thú');
// thầy mệnh lý + trọng tài LLM
const W = { 金: 'Kim', 木: 'Mộc', 火: 'Hỏa' };
const essays = EXAM.map((e) => `Lá số có tứ trụ ${e.pillars}. Nhật chủ ${e.dm}, ${e.strong}. ${e.note} Vì thế Dụng thần là ${W[e.yong]}, lấy hành ấy làm trọng để cân bằng ngũ hành. Xét tương sinh tương khắc trong cục, Hỷ thần đi kèm giúp sức, còn Kỵ thần cần tránh khi chọn hướng nhà và màu áo. Đại vận mười năm tới thuận cho việc học nghề hợp hành ${W[e.yong]} trong thành: nên tìm tiệm thuộc cung cùng hành để làm công, giữ sức, tích Phúc Khí đều đặn.`);
const ex = await ask(a, 'dv_exam', { texts: essays });
ok(ex.ok && ex.pass, `A qua sát hạch (trung bình ${ex.avg})`);
ok((await ask(a, 'dv_register', { fee: 100, level: 12, k: `r${tag}` })).ok, 'A ký quỹ 2 lượng, treo biển 100 đồng / quẻ');
const list = await ask(b, 'dv_list');
const thay = (list.list || []).find((d) => d.name === nameA);
ok(!!thay, 'B thấy thầy A trong danh sách');
const bk = await ask(b, 'dv_book', { to: thay?.u, q: 'Con nên chọn nghề gì?', consent: true, profile: { dm: 'Mậu Thổ', strong: 'thân vượng', yong: { primary: '金' }, pillars: ['Giáp Tý', 'Bính Dần', 'Mậu Ngọ', 'Canh Thân'], year: 1994, email: 'x@y.z' }, k: `b${tag}` });
ok(bk.ok, 'B đặt quẻ, tiền vào két');
ok(/7 ngày/.test((await ask(b, 'dv_book', { to: thay?.u, q: 'lại', consent: true, profile: {}, k: `b2${tag}` })).err || ''), '1 lượt / cặp / 7 ngày');
const mine = await ask(a, 'dv_mine');
const job = mine.asT?.[0];
ok(job && job.profile && job.profile.year === undefined && job.profile.email === undefined && job.profile.pillars.length === 4, 'thầy chỉ thấy hồ sơ rút gọn + tứ trụ (năm sinh, email bị lọc)');
const text = `Nhật chủ Mậu Thổ thân vượng, Thổ dày được Hỏa sinh nên khí quá thịnh. Dụng thần là Kim để tiết tú, Hỷ thần Thủy giúp lưu thông. Đại vận hiện tại thuận cho nghề hành Kim trong thành: thợ rèn, thu ngân Tiền Trang, kim hoàn ở cung Càn. Nên tránh nghề hành Hỏa nhiều khói lửa, giữ giấc ngủ, làm việc thiện để tích Âm Đức. Màu áo hợp là trắng và xám bạc; hướng nhà nên quay về Tây.`;
const dl = await ask(a, 'dv_deliver', { id: job?.id, text });
ok(dl.ok && dl.l0?.pass, `lời luận qua kiểm tất định (${dl.l0?.score}/10)`);
ok(dl.l1 && dl.l1.logic === 8 && dl.l1.decision === 'APPROVE_PAYOUT', `trọng tài LLM được gọi và đọc đúng schema (logic ${dl.l1?.logic})`);
ok((await ask(b, 'dv_rate', { id: job?.id, happy: true })).ok, 'B đánh giá hài lòng (giải ngân sau khi tiền nằm két đủ 24 giờ)');
a.ws.close(); b.ws.close();
const log = await (await fetch('http://127.0.0.1:8899/log')).json();
ok(log.length > 0 && !log.some((l) => l.hasBirth), 'không lời gọi mô hình nào chứa ngày sinh');
console.log('xong');
process.exit(process.exitCode || 0);
