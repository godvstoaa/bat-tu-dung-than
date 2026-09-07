// fix dòng NGOẠI HÌNH bị chèn sai (thiếu ${ )
const fs = require('fs');
const lines = fs.readFileSync('src/engine/ai.js', 'utf8').split('\n');
const idx = lines.findIndex(l => l.startsWith('- NGOẠI HÌNH/TÍNH CÁCH THEO NGŨ HÀNH') && !l.includes('${(()'));
if (idx < 0) { console.log('not found or already fixed'); process.exit(0); }
const D = '$'; // dollar
const INS = '- NGOẠI HÌNH/TÍNH CÁCH THEO NGŨ HÀNH (L2 FIX — KHÔNG CHỈ NHÌN HÀNH DOMINANT, xét TẤT CẢ hành ≥12%): ' + D + '{(() => { const APPEAR = { \'木\':\'cao/thon/mộc mạc, ngay thẳng\', \'火\':\'sáng mắt/tươi/rực rỡ, nhiệt huyết\', \'土\':\'chắc đậm/ổn, vuông mặt, tín\', \'金\':\'thanh tú/sắc nét/da trắng, dứt khoát\', \'水\':\'uyển chuyển/tròn/mềm, thông minh\' }; const NATURE = { \'木\':\'phát triển/kiên cường/bảo vệ\', \'火\':\'lan tỏa/bốc đồng/hào phóng\', \'土\':\'bao dung/chậm chắc/thu nhận\', \'金\':\'cương quyết/kỷ luật/cứng rắn\', \'水\':\'linh hoạt/sâu kín/tự do\' }; const ord = Object.entries(R.wx?.pct || {}).filter(([,p]) => p >= 12).sort(([,a],[,b]) => b - a); if (!ord.length) return \'(không tính được)\'; return ord.map(([wx,p], i) => { const tag = i === 0 ? \' ★DOMINANT\' : (p >= 25 ? \' ← ảnh hưởng MẠNH\' : \' ← cũng có mặt\'); return wxVi(wx)+\'(\'+Math.round(p)+\'%)=ngoại hình:\'+(APPEAR[wx]||\'?\')+\' | tính:\'+(NATURE[wx]||\'?\')+tag; }).join(\' || \'); })()}';
lines[idx] = INS;
fs.writeFileSync('src/engine/ai.js', lines.join('\n'));
console.log('fixed line', idx + 1);
