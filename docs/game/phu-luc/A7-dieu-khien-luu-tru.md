<!-- TỆP SINH TỰ ĐỘNG bởi scripts/docs-game-gen.mjs — KHÔNG SỬA TAY. Sinh lại: node scripts/docs-game-gen.mjs -->
# A7 · Phím, phần tử HUD, khoá lưu trên máy

> Sinh từ mã nguồn. Khi một con số ở chương khác lệch với tệp này thì **tệp này (tức là mã đang chạy) thắng** và chương kia phải sửa.

## A7.1 Phím bàn phím có trong `main.js`

Bảng này chỉ chứng minh phím **có** trong mã; ý nghĩa từng phím xem chương 22.

| phím | số chỗ dùng | dòng mã đầu tiên |
|---|---|---|
| `Enter` | 1 | `if (e.code === 'KeyE' ¦¦ e.code === 'Enter') {` |
| `Escape` | 1 | `if (e.key === 'Escape') { if (panel.isOpen) panel.close(); return; }` |
| `KeyC` | 2 | `if (player.flying && (e.code === 'Space' ¦¦ e.code === 'KeyC')) { altCtl[e.code === 'Space' ? 'up' : 'down'] = true; e.preventDefault(); return; }` |
| `KeyE` | 3 | `if (e.code === 'KeyE' && boat?.keyE()) { e.preventDefault(); return; } // trên thuyền / cạnh thuyền buộc: trả, buộc, lên` |
| `KeyF` | 1 | `if (e.code === 'KeyF') { setFlying(!player.flying); e.preventDefault(); return; }` |
| `KeyH` | 1 | `if (e.code === 'KeyH') { setRide(!VE.garage(L).ride); e.preventDefault(); return; }` |
| `KeyI` | 1 | `if (e.code === 'KeyI') { openEcon('kho'); e.preventDefault(); return; }` |
| `KeyL` | 1 | `if (e.code === 'KeyL') { openLawBook(); e.preventDefault(); return; }` |
| `KeyQ` | 2 | `if (e.code === 'KeyQ' ¦¦ e.code === 'KeyR') { renderer?.rotate?.(e.code === 'KeyQ' ? Math.PI / 4 : -Math.PI / 4); return; }` |
| `KeyR` | 1 | `if (e.code === 'KeyQ' ¦¦ e.code === 'KeyR') { renderer?.rotate?.(e.code === 'KeyQ' ? Math.PI / 4 : -Math.PI / 4); return; }` |
| `KeyX` | 1 | `if (e.code === 'KeyX' && !e.repeat) { attack(); e.preventDefault(); return; }` |
| `M` | 1 | `addEventListener('keydown', (e) => { if ((e.key === 'm' ¦¦ e.key === 'M') && !e.target.closest?.('input, textarea') && !$('hq-game').hidden && !docume` |
| `ShiftLeft` | 2 | `if (e.code === 'ShiftLeft' ¦¦ e.code === 'ShiftRight') { moveIn.sprint = true; return; }` |
| `ShiftRight` | 2 | `if (e.code === 'ShiftLeft' ¦¦ e.code === 'ShiftRight') { moveIn.sprint = true; return; }` |
| `Space` | 5 | `if (player.flying && (e.code === 'Space' ¦¦ e.code === 'KeyC')) { altCtl[e.code === 'Space' ? 'up' : 'down'] = true; e.preventDefault(); return; }` |
| `m` | 1 | `addEventListener('keydown', (e) => { if ((e.key === 'm' ¦¦ e.key === 'M') && !e.target.closest?.('input, textarea') && !$('hq-game').hidden && !docume` |

## A7.2 Phần tử HUD trong `markup.js` (29)

`hq-altpad` · `hq-book` · `hq-canvas` · `hq-econ` · `hq-exit` · `hq-fly` · `hq-game` · `hq-gate` · `hq-gate-exit` · `hq-gate-title` · `hq-loading` · `hq-menu` · `hq-ngoc` · `hq-online` · `hq-panel` · `hq-panel-body` · `hq-panel-close` · `hq-panel-title` · `hq-phuc` · `hq-prompt` · `hq-ride` · `hq-social` · `hq-sound` · `hq-stick` · `hq-streak` · `hq-tasks-btn` · `hq-toasts` · `hq-wardrobe` · `hq-who`

## A7.3 Khoá `localStorage`

| khoá | mô-đun dùng |
|---|---|
| `huyenquan:autoLow` | main.js, render3d.js |
| `huyenquan:blocked` | net.js |
| `huyenquan:gaccong` | render3d.js |
| `huyenquan:mobile` | main.js |
| `huyenquan:models` | assets.js |
| `huyenquan:pid` | main.js, net.js, stations.js, vanmenh-ui.js |
| `huyenquan:quality` | render3d.js |
| `huyenquan:season` | citydress3d.js, season.js |
| `huyenquan:server` | net.js |
| `huyenquan:v1` | state.js |

