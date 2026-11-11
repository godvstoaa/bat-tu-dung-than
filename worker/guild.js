// ============================================================================
//  GUILD — Durable Object duy nhất («guild») giữ sổ việc làm cho mọi shard: chỗ làm có hạn ở từng tiệm,
//  hồ sơ nghề (tay nghề, uy tín), ca đang làm, sổ tiền công, mạch quặng mỏ dân sự. Lương do máy chủ tính
//  (src/game/guild-core.js — cùng mã chạy trong test). TownShard gọi qua RPC và tự cấp vị trí người chơi
//  (toạ độ đã kiểm từ gói mv / tp), client không tự khai vị trí.
//  migration guild-v1 (wrangler.jsonc). Đặc tả: docs/GAME-SINH-TON-KINH-TE-DAC-TA.md §5.3.
// ============================================================================
import { DurableObject } from 'cloudflare:workers';
import { GuildEngine } from '../src/game/guild-core.js';

export class Guild extends DurableObject {
  constructor(ctx, env) { super(ctx, env); this.g = new GuildEngine(ctx.storage); ctx.blockConcurrencyWhile(() => this.g.migrate()); } // v4: chỗ giữ theo chỉ số tiệm cũ bỏ một lần
  me(u) { return this.g.me(u, Date.now()); }
  board(k, u) { return this.g.board(k, u, Date.now()); }
  apply(u, name, k, r, y) { return this.g.apply(u, name, k, r, y, Date.now()); }
  renew(u) { return this.g.renew(u, Date.now()); }
  quit(u) { return this.g.quit(u, Date.now()); }
  start(u, job, k, y, pos) { return this.g.start(u, job, k, y, pos, Date.now()); }
  task(u, m, pos) { return this.g.task(u, m, pos, Date.now()); }
  end(u) { return this.g.end(u, Date.now()); }
  claim(u) { return this.g.claim(u); }
  async ores() { return { ok: true, ores: await this.g.ores(Date.now()) }; }
  ledger(u) { return this.g.ledger(u); }
}
