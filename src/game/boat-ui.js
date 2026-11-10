// ============================================================================
//  THUÊ & LÁI THUYỀN (client): bến thuyền (boats.docks) là điểm tương tác ngoài trời — chủ đò cho thuê đò chèo /
//  thuyền hoa / thuyền buồm (tiền kim loại, life.js), lái bằng W/S (chèo / kéo buồm, lùi) A/D (bánh lái), Shift chèo gắng;
//  E: sát bến → trả thuyền (quá 30 phút tính thêm theo phút), sát bờ → buộc thuyền bước lên bờ, đứng gần thuyền
//  đang buộc → lên lại. Khi trên thuyền: không ngự kiếm, không cưỡi ngựa trạm.
// ============================================================================
import * as B from './boats.js';
import * as LIFE from './life.js';
import { setOpenSpots } from './rooms.js';
import { waterTime } from './water.js';
import { fmt as fmtCoin } from './coins.js';
import { perkMul } from './fatequest.js';

export const DOCK_KEY = 'boat:docks';
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

let done = false;
export function registerDocks() {
  if (done) return; done = true;
  setOpenSpots(DOCK_KEY, B.docks().map((d) => ({ id: d.id, kind: 'boat', name: d.name, verb: 'Thuê thuyền · trả thuyền', x: d.x, z: d.z, r: 3.2 })));
}

/** o: { player, L, toast, panel, save, updateVitals, place(x, z, quiet), where() → {x, z}, keys, stick, moveIn } */
export function createBoatControl(o) {
  const { player, L, toast, panel } = o;
  let rent = null; // { type, at, boat, moored }
  const typeIdx = () => (rent ? rent.boat.type.idx : 0);
  function setAboard(on) {
    if (on) { player.boat = { h: rent.boat.h, typeIdx: rent.boat.type.idx, b: rent.boat }; player.path = []; }
    else player.boat = null;
  }
  function rentPanel(dock) {
    const box = el('<div class="hq-life hq-work"></div>');
    const render = () => {
      box.replaceChildren();
      box.append(el(`<p class="hq-work-h">⚓ <b>${esc(dock.name)}</b> · chủ đò</p>`));
      if (rent) {
        const fee = B.overdueFee(rent.type, rent.at);
        box.append(el(`<p class="hq-note">Bạn đang thuê <b>${esc(rent.type.name)}</b>${rent.moored ? ' (đang buộc ở chỗ khác)' : ''}. ${fee ? `Quá giờ — trả thuyền thêm ${fee} đồng.` : 'Còn trong giờ thuê.'}</p>`));
        const b = el('<button class="hq-btn" type="button">Trả thuyền ở bến này</button>');
        b.onclick = () => { giveBack(); panel.close(); };
        const acts = el('<div class="hq-actions"></div>'); acts.append(b); box.append(acts);
        return;
      }
      box.append(el(`<p class="hq-life-van">💰 ${fmtCoin(L.xu)} · giá thuê mỗi 30 phút, quá giờ tính thêm theo phút</p>`));
      const acts = el('<div class="hq-actions"></div>');
      for (const id of dock.types) {
        const t = B.BOAT_TYPES[id];
        const b = el(`<button class="hq-btn" type="button">${t.icon} ${esc(t.name)} · ${t.price} đồng</button>`);
        b.disabled = L.van < t.price;
        b.onclick = () => {
          if (!LIFE.pay(L, Math.round(t.price * perkMul(L, 'boat')))) { toast('Không đủ tiền.'); return; } // Thủy vận (P5): −50%
          const boat = B.createBoat(id, dock.spawn.x, dock.spawn.z, dock.spawn.h);
          rent = { type: t, at: Date.now(), boat, moored: false };
          setAboard(true); o.place(boat.x, boat.z);
          o.save(); o.updateVitals(); panel.close();
          toast(`${t.icon} Đã thuê ${t.name}. W/S ${t.sail ? 'kéo buồm / lùi' : 'chèo tới / lùi'} · A/D bánh lái · Shift chèo gắng · E trả thuyền ở bến hoặc lên bờ.`);
        };
        acts.append(b);
      }
      box.append(acts);
      box.append(el(`<p class="hq-note">Đò chèo đi được mọi kênh rạch. Thuyền hoa cao 4,2 m lọt gầm cầu thành (5,5 m) — đi giữa lòng vòm. Thuyền buồm cột 12 m chỉ chạy sông và hồ, thủy môn không cho qua; buồm ăn gió ngang mạnh nhất, ngược gió thì đứng.</p>`));
    };
    render();
    panel.open({ title: `⚓ ${dock.name}`, body: box });
  }
  function giveBack() {
    if (!rent) return;
    const fee = B.overdueFee(rent.type, rent.at);
    if (fee) { if (LIFE.pay(L, fee)) toast(`Trả thuyền · quá giờ ${fee} đồng.`); else { L.debt += fee; toast(`Trả thuyền · quá giờ ${fee} đồng — không đủ tiền, ghi nợ.`); } }
    else toast(`Đã trả ${rent.type.name}. Cảm ơn khách!`);
    const onBoat = !!player.boat;
    rent = null; setAboard(false);
    if (onBoat) { const w = o.where(), d = B.dockNear(w.x, w.z, 60); if (d) o.place(d.x, d.z); }
    o.save(); o.updateVitals();
  }
  /** E khi đang trên thuyền / gần thuyền buộc. Trả true nếu đã xử lý. */
  function keyE() {
    if (!rent) return false;
    const bt = rent.boat;
    if (player.boat) {
      const dock = B.dockNear(bt.x, bt.z, Math.max(18, bt.type.len));
      if (dock) { giveBack(); return true; }
      const s = B.shoreNear(bt, 6 + bt.type.beam);
      if (!s) { toast('Xa bờ quá — cập thuyền sát bờ (hoặc bậc bến) rồi mới lên được.'); return true; }
      rent.moored = true; setAboard(false); o.place(s.x, s.z);
      toast(`Đã buộc ${bt.type.name} ven bờ. Quay lại bấm E để lên thuyền, hoặc trả ở bến nào cũng được.`);
      return true;
    }
    const w = o.where();
    if (rent.moored && Math.hypot(w.x - bt.x, w.z - bt.z) < bt.type.len / 2 + 5) { rent.moored = false; setAboard(true); o.place(bt.x, bt.z); toast(`Lên ${bt.type.name}.`); return true; }
    return false;
  }
  let lastBlockMsg = 0;
  /** mỗi khung khi đang trên thuyền: đọc phím / cần ảo, bước vật lý, đặt người chơi theo thuyền */
  function step(dt) {
    if (!player.boat || !rent) return false;
    const k = o.keys, stick = o.stick;
    let th = (k.has('u') ? 1 : 0) - (k.has('d') ? 1 : 0), rud = (k.has('r') ? 1 : 0) - (k.has('l') ? 1 : 0);
    if (!th && !rud && Math.hypot(stick.x, stick.y) > 0.18) { th = -stick.y; rud = stick.x; }
    const sprint = o.moveIn.sprint && L.wake > 5;
    const r = B.stepBoat(rent.boat, { throttle: th, rudder: rud, sprint }, dt, waterTime());
    if (sprint && th) L.wake = Math.max(0, L.wake - dt * 0.02);
    if (r.blocked && performance.now() - lastBlockMsg > 6000 && (th || rud)) {
      lastBlockMsg = performance.now();
      o.toast(r.blocked === 'low' ? 'Gầm cầu / thủy môn thấp hơn thuyền — đi giữa lòng vòm hoặc vòng đường khác.' : r.blocked === 'pier' ? 'Va trụ cầu!' : 'Mắc cạn — lùi ra chỗ sâu.');
    }
    player.boat.h = rent.boat.h;
    o.place(rent.boat.x, rent.boat.z, true);
    player.moving = r.speed > 0.2; player.h = rent.boat.h;
    return true;
  }
  return {
    spot(st) { const d = B.dockById(st.data?.id); if (d) rentPanel(d); },
    step, keyE,
    aboard: () => !!player.boat,
    rented: () => rent,
    typeIdx,
  };
}
