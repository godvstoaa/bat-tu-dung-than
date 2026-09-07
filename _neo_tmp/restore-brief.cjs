// restore 6 brief sections vào buildChartBrief (ai.js) — theo marker, idempotent
const fs = require('fs');
let s = fs.readFileSync('src/engine/ai.js', 'utf8');
const BT = String.fromCharCode(96); // backtick
let n = 0;

// 1+2. DATA SOURCES + SAT PHƯƠNG — trước «== ⏰ THỜI GIAN HIỆN TẠI»
if (!s.includes('== 🚨 DATA SOURCES')) {
  const marker = '  let brief = `== ⏰ THỜI GIAN HIỆN TẠI';
  const block =
    '  let brief = `== 🚨 DATA SOURCES (ĐỌC TRƯỚC — CHỐNG HALLUCINATION) ==\n' +
    '⚠ Brief này CHỈ chứa: BaZi (Tứ Trụ 四柱) + thập thần + đại vận + lưu niên + thần sát + nạp âm + Dụng Thần + tổ hợp kinh điển + ứng kỳ + sát phương năm + Đông Y + phong thủy hướng.\n' +
    '❌ KHÔNG CHỨA: Tử Vi palace/cung/sao Tử Vi (Cự Môn/Thái Âm/Vũ Khúc/Văn Khúc @ cung nào...), chỉ tay, tướng số khuôn mặt (trừ brief thập can thể tượng).\n' +
    '⛔ AI TUYỆT ĐỐI KHÔNG ĐƯỢC: (1) trích dẫn Tử Vi palace/cung — đó là BỊA; (2) tự thêm chi tiết đời user (đã lập gia đình/li dời/con cái/nghề nghiệp cụ thể) — chỉ từ câu hỏi user + brief; (3) bịa năm/tháng sự kiện không có trong mục ỨNG KỲ. MỌI kết luận phải neo indicator CÓ TÊN trong brief — nếu không có → nói «theo lá số chỉ thấy X», không bịa thêm.\n' +
    '\n' +
    '== 🧭 SAT PHƯƠNG ${curYear} (KHI KHUYÊN HƯỚNG — BAT BUỘC CHECK TRƯỚC, KHÔNG BA PHẢI) ==\n' +
    '- TAM SÁT ${curYear} (phương tối kỵ động thổ/dời nhà): ${(() => { try { return sanshaDirection(curYear).summary; } catch (e) { return \'(không tính được)\'; } })()}\n' +
    '- SAT PHƯƠNG ${curYear} TỔNG HỢP (TháiTuế/TuếPhá/TamSát/Ngũ Hoàng/Nhị Hắc — check trước khi khuyên hướng): ${(() => { try { return annualTabooOverview(curYear).summary; } catch (e) { return \'(không tính được)\'; } })()}\n' +
    '⚡ LỆNH: Khi khuyên hướng cửa/giường/bàn/bếp/động thổ → PHẢI check hướng đó có trùng Thái Tuế/Tam Sát/Ngũ Hoàng năm ${curYear} KHÔNG. Nếu trùng → KHÔNG khuyên (dù hợp Dụng Thần) — ưu tiên hướng CÁT KHÔNG phạm sát phương. Dụng Thần áp dụng cho hướng BÀN LÀM VIỆC, KHÔNG tự động cho ĐẦU GIƯỜNG (đầu giường ưu tiên Bát Trạch + sát phương năm).\n' +
    '\n' +
    '== ⏰ THỜI GIAN HIỆN TẠI';
  if (s.includes(marker)) { s = s.replace(marker, block); n++; }
}

// 3. NGOẠI HÌNH — sau dòng «源流»
if (!s.includes('NGOẠI HÌNH/TÍNH CÁCH THEO NGŨ HÀNH')) {
  const marker = "\n\nCÁCH CỤC (格局):";
  const block = "\n" +
    '- NGOẠI HÌNH/TÍNH CÁCH THEO NGŨ HÀNH (L2 FIX — KHÔNG CHỈ NHÌN HÀNH DOMINANT, xét TẤT CẢ hành ≥12%): ${(() => { const APPEAR = { \'木\':\'cao/thon/mộc mạc, ngay thẳng\', \'火\':\'sáng mắt/tươi/rực rỡ, nhiệt huyết\', \'土\':\'chắc đậm/ổn, vuông mặt, tín\', \'金\':\'thanh tú/sắc nét/da trắng, dứt khoát\', \'水\':\'uyển chuyển/tròn/mềm, thông minh\' }; const NATURE = { \'木\':\'phát triển/kiên cường/bảo vệ\', \'火\':\'lan tỏa/bốc đồng/hào phóng\', \'土\':\'bao dung/chậm chắc/thu nhận\', \'金\':\'cương quyết/kỷ luật/cứng rắn\', \'水\':\'linh hoạt/sâu kín/tự do\' }; const ord = Object.entries(R.wx?.pct || {}).filter(([,p]) => p >= 12).sort(([,a],[,b]) => b - a); if (!ord.length) return \'(không tính được)\'; return ord.map(([wx,p], i) => { const tag = i === 0 ? \' ★DOMINANT\' : (p >= 25 ? \' ← ảnh hưởng MẠNH\' : \' ← cũng có mặt\'); return `${wxVi(wx)}(${Math.round(p)}%)=ngoại hình:${APPEAR[wx]||\'?\'} | tính:${NATURE[wx]||\'?\'}${tag}`; }).join(\' || \'); })()}\n' +
    "\nCÁCH CỤC (格局):";
  if (s.includes(marker)) { s = s.replace(marker, block); n++; }
}

// 4. OVERRIDE PRIORITY — sau dòng Điều Hậu
if (!s.includes('OVERRIDE PRIORITY')) {
  const marker = "  - Điều Hậu (调候): ${R.yong.tiaohou.note || '(không)'}";
  const add = marker + "\n" +
    "  - ⚡ OVERRIDE PRIORITY (L6 FIX — AI PHẢI LUẬN THEO ĐÚNG ƯU TIÊN NÀY, KHÔNG ĐƯỢC NHẦM): ${(() => { const isCong = /从|從|tòng cách|tong cach/i.test(R.pattern?.vi || '') || /从格|從格/.test(R.pattern?.name || ''); const hasTiao = !!(R.yong?.tiaohou && R.yong.tiaohou.override); const methods = (R.yong?.method || []).join(' '); const isFuY = /扶抑|phù Ức|phu uc|bù (thân|nhược)|khắc (thân|vượng)/i.test(methods); if (isCong) return '🥇 从格 (TÒNG CÁCH) → Dụng = hành THEO thế (bỏ 扶抑/调候) — Nhật chủ quá yếu, theo thế mới sống. AI KHÔNG được nói «thân nhược cần Ấn» nếu đây là tòng cách!'; if (hasTiao) return '🥈 调候 (ĐIỀU HẬU) → Dụng = hành ĐIỀU HÒA nhiệt độ (Hỏa cho mùa đông hàn / Thủy cho mùa hè nhiệt) — override 扶抑 khi khắc nghiệt. AI KHÔNG nói «cần Ấn/Tỷ» nếu tháng quá lạnh/nóng!'; if (isFuY) return '🥉 扶抑 (PHÙ ỨC / BỆNH DƯỢC) → Dụng = hành BÙ (Ấn/Tỷ cho nhược) hoặc KHẮC (Tài/Quan/Thực cho vượng) — trường hợp bình thường.'; return '(không xác định rõ override — luận theo method + reasons phía trên)'; })()}";
  if (s.includes(marker)) { s = s.replace(marker, add); n++; }
}

// 5. TIMING HIERARCHY — trước dòng ĐẠI VẬN
if (!s.includes('TIMING HIERARCHY')) {
  const marker = "\nĐẠI VẬN: ${dayunStr}";
  const block = "\n⏰ TIMING HIERARCHY (L7 FIX — AI LUẬN VẬN THEO ĐÚNG THỨ TỰ, KHÔNG NHẦM TẦNG): ${(() => { try { const _age = _now.getFullYear() - (R.chart?.input?.year || _now.getFullYear()); const _curDy = (R.dayun||[]).find(d => d.startAge != null && _age >= d.startAge) || (R.dayun||[])[(R.dayun||[]).length-1]; const _dyRating = _curDy?.rating || '?'; const _dyGanZhi = _curDy?.ganZhi || '?'; return `🥇 ĐẠI VẬN ${_dyGanZhi} (${_dyRating}) = BỐI CẢNH 10 NĂM (quyết định xu hướng LỚN) → AI phải nói ĐẠI VẬN trước, rồi mới xuống 🥈 LƯU NIÊN ${curYear} (kích hoạt cụ thể trong bối cảnh đại vận) → cuối cùng 🥉 LƯU NGUYỆT (chi tiết tháng, chỉ cụ thể hoá). QUY TẮC KẾT HỢP: đại vận TỐT + lưu niên TỐT = cực tốt | đại vận XẤU + lưu niên TỐT = tạm ổn trong giai đoạn khó | đại vận XẤU + lưu niên XẤU = năm nguy hiểm. KHÔNG BAO GIỜ nói «năm nay tốt» mà không check đại vận đang hành có KỴ không!`; } catch(e) { return '(không tính được)'; } })()}\n" +
    "\nĐẠI VẬN: ${dayunStr}";
  if (s.includes(marker)) { s = s.replace(marker, block); n++; }
}

// 6. TÀNG CAN PHỐI NGÃU — sau dòng PHỐI NGẪU (round 2)
if (!s.includes('TÀNG CAN PHỐI NGÃU')) {
  const marker = '"PHỐI NGẪU (日支=" + dayZhi + "): " + (spouseReading ? spouseReading.traits + " | Hôn nhân: " + spouseReading.marriage : "(không có dữ liệu)") + "\\n" +';
  const add = marker + "\n" +
    '      "⚠ TÀNG CAN PHỐI NGÃU — HIỂU ĐÚNG (L5 FIX): khi phối ngẫu tinh (Quan/Sát/Tài) NẰM TÀNG CAN (ẩn trong địa chi, không lộ thiên can) → nghĩa là ĐỐI TƯỢNG ẩn / quan hệ bắt đầu phi tình cảm (đồng nghiệp/bạn → mới phát triển tình) / người đó KHÔNG LỘ ngay là «đối tượng». KHÔNG PHẢI là «con giấu tình cảm / đơn phương im lặng». Sự thể hiện tình cảm của CON phụ thuộc THƯƠNG QUAN (biểu đạt) hay ẤN (kín đáo) — KHÔNG phụ thuộc tàng can. AI KHÔNG được dịch «Sát tàng can = con giấu tình» — ĐÓ LÀ SAI.\\n" +';
  if (s.includes(marker)) { s = s.replace(marker, add); n++; }
}

fs.writeFileSync('src/engine/ai.js', s);
console.log('brief sections restored:', n, '/ 6');
