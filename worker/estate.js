// ============================================================================
//  ESTATE — Durable Object duy nhất («estate») giữ sổ nhà riêng Thành Bát Quái cho mọi shard:
//  ai sở hữu căn nào (mỗi người một căn, căn đã bán người khác không mua được), bố cục đồ đạc
//  (chuỗi mã gọn — protocol.js đã kiểm hợp lệ trước khi tới đây), lượt khen nhà.
//  u = mã ổn định máy chủ tự băm từ pid (quan-room.js › stableId) — client không tự khai.
//  TownShard gọi qua RPC: env.ESTATE.get(env.ESTATE.idFromName('estate')).claim(h, u, name)…
//  Lưu trữ KV: h:<h> → { u, name, it, c, likes, at } · own:<u> → h · lk:<h>:<u> → 1
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import { LISTING_COUNT } from '../src/game/estate-core.js';

const okH = (h) => Number.isInteger(h) && h >= 0 && h < LISTING_COUNT;

export class Estate extends DurableObject {
  async list(u) {
    const rows = await this.ctx.storage.list({ prefix: 'h:' });
    const list = [];
    for (const [k, v] of rows) list.push([Number(k.slice(2)), v.name, v.likes | 0]);
    const mine = u ? (await this.ctx.storage.get(`own:${u}`)) ?? null : null;
    return { ok: true, list, mine };
  }

  async get(h) {
    if (!okH(h)) return { ok: false, err: 'bad' };
    const v = await this.ctx.storage.get(`h:${h}`);
    return v ? { ok: true, it: v.it || '', c: v.c | 0, name: v.name, likes: v.likes | 0 } : { ok: false, err: 'empty' };
  }

  async claim(h, u, name) {
    if (!okH(h) || !u) return { ok: false, err: 'bad' };
    // input gate của DO: không sự kiện nào chen giữa các lệnh lưu trữ liền nhau → đọc-kiểm-ghi nguyên tử
    if (await this.ctx.storage.get(`h:${h}`)) return { ok: false, err: 'taken' };
    if ((await this.ctx.storage.get(`own:${u}`)) != null) return { ok: false, err: 'limit' };
    await this.ctx.storage.put({ [`h:${h}`]: { u, name: String(name || 'Khách').slice(0, 24), it: '', c: 0, likes: 0, at: Date.now() }, [`own:${u}`]: h });
    return { ok: true };
  }

  async release(h, u) {
    const v = okH(h) ? await this.ctx.storage.get(`h:${h}`) : null;
    if (!v || v.u !== u) return { ok: false, err: 'notowner' };
    const likes = await this.ctx.storage.list({ prefix: `lk:${h}:` });
    await this.ctx.storage.delete([`h:${h}`, `own:${u}`, ...likes.keys()]);
    return { ok: true };
  }

  async save(h, u, it, c) {
    const v = okH(h) ? await this.ctx.storage.get(`h:${h}`) : null;
    if (!v || v.u !== u) return { ok: false, err: 'notowner' };
    await this.ctx.storage.put(`h:${h}`, { ...v, it: String(it).slice(0, 12000), c: c | 0, at: Date.now() });
    return { ok: true, likes: v.likes | 0 };
  }

  /** khách liên kết tài khoản: chuyển căn nhà từ mã khách (pid) sang mã tài khoản — chỉ khi tài khoản chưa có nhà */
  async rekey(oldU, newU) {
    if (!oldU || !newU || oldU === newU) return { ok: false, err: 'bad' };
    const h = await this.ctx.storage.get(`own:${oldU}`);
    if (h == null) return { ok: true, moved: false };
    if ((await this.ctx.storage.get(`own:${newU}`)) != null) return { ok: false, err: 'limit' };
    const v = await this.ctx.storage.get(`h:${h}`);
    if (!v || v.u !== oldU) return { ok: false, err: 'bad' };
    await this.ctx.storage.put({ [`h:${h}`]: { ...v, u: newU }, [`own:${newU}`]: h });
    await this.ctx.storage.delete(`own:${oldU}`);
    return { ok: true, moved: true, h };
  }

  async like(h, u) {
    const v = okH(h) ? await this.ctx.storage.get(`h:${h}`) : null;
    if (!v) return { ok: false, err: 'empty' };
    if (v.u === u) return { ok: false, err: 'self' };
    const k = `lk:${h}:${u}`;
    if (await this.ctx.storage.get(k)) return { ok: false, err: 'dup' };
    const likes = (v.likes | 0) + 1;
    await this.ctx.storage.put({ [k]: 1, [`h:${h}`]: { ...v, likes } });
    return { ok: true, likes, name: v.name };
  }
}
