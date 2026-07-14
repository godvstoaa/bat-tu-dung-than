// naming.js — 姓名 học: letter numerology (PRIMARY, mọi tên) + 5格 (tên Hán-Việt map được)
// Data: grok research (81 nét + Expression/Soul/Personality) + surname/given char strokes.
export const STROKES_81 = {
  "1": {
    "tone": "Cát",
    "text": "Khởi đầu tốt, có chí lớn, dễ làm chủ."
  },
  "2": {
    "tone": "Hung",
    "text": "Dao động, thiếu vững, hay phụ thuộc người."
  },
  "3": {
    "tone": "Cát",
    "text": "Phát triển suôn sẻ, tài năng sớm lộ."
  },
  "4": {
    "tone": "Hung",
    "text": "Trắc trở, dễ thất bại, khó bền."
  },
  "5": {
    "tone": "Cát",
    "text": "Sinh khí mạnh, dễ thành công, có phúc."
  },
  "6": {
    "tone": "Cát",
    "text": "Ổn định, hanh thông, quý nhân phù trợ."
  },
  "7": {
    "tone": "Cát",
    "text": "Ý chí mạnh, vượt khó rồi thắng."
  },
  "8": {
    "tone": "Cát",
    "text": "Cần cù được đền đáp, đường dài tốt."
  },
  "9": {
    "tone": "Hung",
    "text": "Cô đơn, gian nan, dễ nản giữa đường."
  },
  "10": {
    "tone": "Hung",
    "text": "Rỗng tuếch, hao tán, thiếu lực."
  },
  "11": {
    "tone": "Cát",
    "text": "Phục hưng, may mắn, mở đường mới."
  },
  "12": {
    "tone": "Hung",
    "text": "Yếu thế, hay bị chèn ép, chậm tiến."
  },
  "13": {
    "tone": "Cát",
    "text": "Thông minh, có duyên học vấn, danh tiếng."
  },
  "14": {
    "tone": "Hung",
    "text": "Cô lập, lao lực, khó được giúp."
  },
  "15": {
    "tone": "Cát",
    "text": "Phúc lớn, giúp người được người giúp."
  },
  "16": {
    "tone": "Cát",
    "text": "Quyền uy, lãnh đạo, danh vị cao."
  },
  "17": {
    "tone": "Cát",
    "text": "Uy tín, quyết đoán, dễ nắm quyền."
  },
  "18": {
    "tone": "Cát",
    "text": "Được nâng đỡ, thành công rực rỡ."
  },
  "19": {
    "tone": "Hung",
    "text": "Đầu khó khăn, nhiều thử thách."
  },
  "20": {
    "tone": "Hung",
    "text": "Vất vả, lo toan, thành quả chậm."
  },
  "21": {
    "tone": "Cát",
    "text": "Tự lực thành danh, đường rộng mở."
  },
  "22": {
    "tone": "Hung",
    "text": "Thiển cận, dễ lỡ cơ, hay thất bại."
  },
  "23": {
    "tone": "Cát",
    "text": "Tiến vững, dần thăng tiến, có hậu."
  },
  "24": {
    "tone": "Cát",
    "text": "Giàu sang, danh lợi song toàn."
  },
  "25": {
    "tone": "Cát",
    "text": "Tài hoa nở rộ, được trọng vọng."
  },
  "26": {
    "tone": "Hung",
    "text": "Biến động, hay đổi hướng, khó yên."
  },
  "27": {
    "tone": "Hung",
    "text": "Gấp đôi nỗ lực mới được, dễ kiệt."
  },
  "28": {
    "tone": "Hung",
    "text": "Tổn thất, trắc trở, dễ mất mát."
  },
  "29": {
    "tone": "Cát",
    "text": "Trí tuệ, kiên nhẫn, cuối cùng thắng."
  },
  "30": {
    "tone": "Bình",
    "text": "Bấp bênh, lúc tốt lúc xấu, cần giữ mình."
  },
  "31": {
    "tone": "Cát",
    "text": "Thông tuệ, may mắn, dễ thành tựu."
  },
  "32": {
    "tone": "Cát",
    "text": "Gặp cơ may, quý nhân bất ngờ."
  },
  "33": {
    "tone": "Cát",
    "text": "Danh tiếng vang, thăng tiến mạnh."
  },
  "34": {
    "tone": "Hung",
    "text": "Họa ẩn, dễ gặp tai ương lớn."
  },
  "35": {
    "tone": "Cát",
    "text": "An hòa, tiến bộ êm đềm, tốt đẹp."
  },
  "36": {
    "tone": "Hung",
    "text": "Sóng gió, thăng trầm, khó yên ổn."
  },
  "37": {
    "tone": "Cát",
    "text": "Có uy, được tin, dễ thành đạt."
  },
  "38": {
    "tone": "Bình",
    "text": "Có tài nhưng nhiều cản, nửa may nửa rủi."
  },
  "39": {
    "tone": "Hung",
    "text": "Danh trước khó sau, dễ sa sút muộn."
  },
  "40": {
    "tone": "Hung",
    "text": "Suy giảm, hao hụt, đường càng hẹp."
  },
  "42": {
    "tone": "Bình",
    "text": "Đa tài nhưng thiếu chuyên tâm, dễ nửa chừng bỏ dở."
  },
  "43": {
    "tone": "Hung",
    "text": "Ngoài vẻ tốt, trong khổ tâm, dễ mất tín nhiệm."
  },
  "44": {
    "tone": "Hung",
    "text": "Sầu lo liên miên, phá tài phá sản, vận hung nặng."
  },
  "45": {
    "tone": "Cát",
    "text": "Vượt khó mở vận mới, về sau hanh thông vinh hiển."
  },
  "46": {
    "tone": "Hung",
    "text": "Lưới tai vướng thân, đời nhiều khổ nạn tai ương."
  },
  "47": {
    "tone": "Cát",
    "text": "Khai hoa kết quả, nghiệp lớn thành, gia đình viên mãn."
  },
  "48": {
    "tone": "Cát",
    "text": "Có đức có trí, danh lợi song toàn, được kính trọng."
  },
  "49": {
    "tone": "Bình",
    "text": "Trước cát sau hung, lao khổ không dứt nếu không vững."
  },
  "50": {
    "tone": "Bình",
    "text": "Một được một mất, thăng trầm khó định, khó yên ổn."
  },
  "51": {
    "tone": "Bình",
    "text": "Thịnh suy đan xen, giữ vững mới tránh được họa."
  },
  "52": {
    "tone": "Cát",
    "text": "Mưa tạnh trời quang, danh lợi trọn vẹn, đời vinh hiển."
  },
  "53": {
    "tone": "Bình",
    "text": "Ngoài thịnh trong suy, cuối đời dễ sa sút."
  },
  "54": {
    "tone": "Hung",
    "text": "Tai ương ngang trái, vận hung cực lớn, rất nguy."
  },
  "55": {
    "tone": "Bình",
    "text": "Ngoài đẹp trong khổ, cát hung xen lẫn khó đoán."
  },
  "56": {
    "tone": "Hung",
    "text": "Chiều tà ảm đạm, muộn vận khó, dễ phá gia."
  },
  "57": {
    "tone": "Cát",
    "text": "Tùng xanh trong tuyết, qua họa rồi vinh hoa cuối đời."
  },
  "58": {
    "tone": "Cát",
    "text": "Trước khổ sau ngọt, qua cửa ải rồi được phù trợ."
  },
  "59": {
    "tone": "Hung",
    "text": "Được rồi lại mất, gãy trục khó gượng, vận hung."
  },
  "60": {
    "tone": "Hung",
    "text": "Tối tăm vô lối, khổ bệnh hao tổn, khó thành sự."
  },
  "61": {
    "tone": "Cát",
    "text": "Danh lợi song thu, khiêm tốn thì tốt, kiêu thì mất hòa."
  },
  "62": {
    "tone": "Hung",
    "text": "Chí khí yếu, dễ lười biếng, đời nhiều gian khó."
  },
  "63": {
    "tone": "Cát",
    "text": "Phú quý vinh đạt, con cháu đông, phúc lộc trọn vẹn."
  },
  "64": {
    "tone": "Hung",
    "text": "Vận đã tàn, chia lìa cô độc, buồn khổ triền miên."
  },
  "65": {
    "tone": "Cát",
    "text": "Phú quý trường thọ, gia vận hưng thịnh, mọi sự hanh."
  },
  "66": {
    "tone": "Hung",
    "text": "Trong ngoài bất hòa, tiến thoái lưỡng nan, tai họa chồng."
  },
  "67": {
    "tone": "Cát",
    "text": "Lợi lộc hanh thông, vạn sự suôn sẻ, gia nghiệp thịnh."
  },
  "68": {
    "tone": "Cát",
    "text": "Biết nắm cơ hội, lập nghiệp vững, uy tín được trọng."
  },
  "69": {
    "tone": "Hung",
    "text": "Ngồi đứng không yên, bệnh tật sóng gió, tâm bất an."
  },
  "70": {
    "tone": "Hung",
    "text": "Phế vật diệt vong, nghèo khổ, bệnh tật dai dẳng."
  },
  "71": {
    "tone": "Bình",
    "text": "Dưỡng thần nhẫn nại, kiên trì thực hiện mới thành."
  },
  "72": {
    "tone": "Hung",
    "text": "Trước tốt sau xấu, ngoài thịnh trong suy, dễ sụp."
  },
  "73": {
    "tone": "Cát",
    "text": "Chí cao lực mỏng lúc đầu, muộn vận mới an nhàn."
  },
  "74": {
    "tone": "Hung",
    "text": "Chìm nghịch cảnh, ngồi không tiêu hết của, già càng khổ."
  },
  "75": {
    "tone": "Bình",
    "text": "Giữ phận thì an, liều lĩnh thì bại họa ập đến."
  },
  "76": {
    "tone": "Hung",
    "text": "Đổ nát ly tán, phá tài tan nhà, nghèo bệnh bức bách."
  },
  "77": {
    "tone": "Bình",
    "text": "Cực vui sinh bi, trước tốt sau kém, già mới khá."
  },
  "78": {
    "tone": "Bình",
    "text": "Trẻ trung niên khá, về già sa sút, khốn khó dần."
  },
  "79": {
    "tone": "Hung",
    "text": "Bị đè nén, mất tín mất chí, khó gượng dậy."
  },
  "80": {
    "tone": "Hung",
    "text": "Cả đời vất vả hư không, cô độc bệnh tật triền miên."
  },
  "81": {
    "tone": "Cát",
    "text": "Vạn vật hồi xuân, hoàn nguyên phục thủy, cực cát thịnh."
  }
};
export const NAME_NUMS = {
  "Expression": {
    "1": "Số Destiny 1 — lãnh đạo, độc lập, tiên phong; đời thúc đẩy tự chủ và mở đường, tránh độc đoán.",
    "2": "Số Destiny 2 — hợp tác, hòa giải, nhạy cảm; sứ mệnh kết nối và hỗ trợ, tránh lệ thuộc ý kiến.",
    "3": "Số Destiny 3 — sáng tạo, biểu đạt, giao tiếp; đời hướng tới nghệ thuật và lan tỏa niềm vui, tránh phân tán.",
    "4": "Số Destiny 4 — kỷ luật, xây dựng, thực tế; sứ mệnh tạo nền tảng vững, tránh cứng nhắc.",
    "5": "Số Destiny 5 — tự do, thay đổi, trải nghiệm; đời là du hành và đa dạng, tránh thiếu cam kết.",
    "6": "Số Destiny 6 — trách nhiệm, yêu thương, nuôi dưỡng; sứ mệnh chăm sóc gia đình/cộng đồng, tránh hy sinh quá mức.",
    "7": "Số Destiny 7 — nội tâm, trí tuệ, tìm kiếm sự thật; đời hướng tri thức/tâm linh, tránh cô lập thái quá.",
    "8": "Số Destiny 8 — thành tựu, quyền lực, thịnh vượng; sứ mệnh sự nghiệp và tài chính, tránh tham vọng mù quáng.",
    "9": "Số Destiny 9 — nhân ái, hoàn thiện, phụng sự; đời hướng cống hiến và chữa lành, tránh ôm đồm kiệt sức."
  },
  "Soul": {
    "1": "Thúc đẩy nội tâm khao khát tự do quyết định, được công nhận là người dẫn dắt, không phụ thuộc.",
    "2": "Thúc đẩy nội tâm mong bình yên, được yêu thương, làm việc theo cặp/đội, tránh xung đột gay gắt.",
    "3": "Thúc đẩy nội tâm muốn vui vẻ, được lắng nghe, thể hiện cảm xúc qua lời nói và sáng tạo.",
    "4": "Thúc đẩy nội tâm khao khát ổn định, trật tự, an toàn vật chất và kế hoạch rõ ràng.",
    "5": "Thúc đẩy nội tâm thèm tự do, mới lạ, phiêu lưu; sợ bị gò bó và nhàm chán.",
    "6": "Thúc đẩy nội tâm mong có nhà ấm, được cần đến, tạo hài hòa và chăm sóc người thân.",
    "7": "Thúc đẩy nội tâm khao khát hiểu sâu, yên tĩnh, khám phá tri thức và chiều kích tâm linh.",
    "8": "Thúc đẩy nội tâm muốn thành công vật chất, địa vị, kiểm soát và được tôn trọng về năng lực.",
    "9": "Thúc đẩy nội tâm mong giúp đời, rộng lượng, sống vì ý nghĩa lớn hơn bản thân."
  },
  "Personality": {
    "1": "Bề ngoài tự tin, mạnh mẽ, nổi bật; người khác thấy bạn quyết đoán và có chính kiến.",
    "2": "Bề ngoài dịu dàng, lịch sự, dễ gần; gây ấn tượng khiêm tốn và tinh tế.",
    "3": "Bề ngoài hoạt bát, hài hước, có duyên; dễ thu hút bằng nụ cười và cách nói chuyện.",
    "4": "Bề ngoài nghiêm túc, đáng tin, chăm chỉ; gây ấn tượng người đáng dựa vào.",
    "5": "Bề ngoài năng động, quyến rũ, linh hoạt; người khác thấy bạn phóng khoáng và thích biến động.",
    "6": "Bề ngoài ấm áp, chu đáo, đáng tin cậy; gây ấn tượng người “chăm lo” và có trách nhiệm.",
    "7": "Bề ngoài trầm, bí ẩn, suy nghĩ nhiều; người khác thấy bạn bí ẩn và khó đọc.",
    "8": "Bề ngoài mạnh mẽ, quyết liệt, có khí chất lãnh đạo; gây ấn tượng người có quyền lực và tham vọng.",
    "9": "Bề ngoài phóng khoáng, giàu lòng trắc ẩn, “người lớn”; gây ấn tượng bao dung và có tầm nhìn."
  }
};
const VN_SURNAME = {"nguyễn":{"ch":"阮","strokes":7},"trần":{"ch":"陳","strokes":7},"lê":{"ch":"黎","strokes":15},"phạm":{"ch":"范","strokes":8},"hoàng":{"ch":"黃","strokes":12},"huỳnh":{"ch":"黃","strokes":12},"phan":{"ch":"潘","strokes":15},"vũ":{"ch":"武","strokes":8},"võ":{"ch":"武","strokes":8},"đặng":{"ch":"鄧","strokes":14},"bùi":{"ch":"裴","strokes":14},"đỗ":{"ch":"杜","strokes":7},"hồ":{"ch":"胡","strokes":9},"ngô":{"ch":"吳","strokes":7},"dương":{"ch":"楊","strokes":13},"lý":{"ch":"李","strokes":7},"lưu":{"ch":"劉","strokes":15},"trương":{"ch":"張","strokes":11},"cao":{"ch":"高","strokes":10},"đinh":{"ch":"丁","strokes":2},"tô":{"ch":"蘇","strokes":20}};
const GIVEN_CHAR = {"minh":{"ch":"明","s":8},"anh":{"ch":"英","s":8},"thư":{"ch":"書","s":10},"lan":{"ch":"蘭","s":19},"hương":{"ch":"香","s":9},"mai":{"ch":"梅","s":11},"hoa":{"ch":"花","s":7},"hà":{"ch":"河","s":8},"dung":{"ch":"容","s":10},"nhung":{"ch":"絨","s":12},"thảo":{"ch":"草","s":9},"trang":{"ch":"莊","s":10},"hiền":{"ch":"賢","s":15},"hằng":{"ch":"姮","s":9},"ngọc":{"ch":"玉","s":5},"như":{"ch":"如","s":6},"quỳnh":{"ch":"瓊","s":18},"phương":{"ch":"芳","s":7},"thu":{"ch":"秋","s":9},"xuân":{"ch":"春","s":9},"nhất":{"ch":"一","s":1},"vinh":{"ch":"榮","s":14},"long":{"ch":"龍","s":16},"thành":{"ch":"成","s":6},"nam":{"ch":"南","s":9},"bảo":{"ch":"寶","s":20},"duc":{"ch":"德","s":15},"đức":{"ch":"德","s":15},"phúc":{"ch":"福","s":13},"tâm":{"ch":"心","s":4},"thiện":{"ch":"善","s":12},"trí":{"ch":"智","s":12},"tuấn":{"ch":"俊","s":9},"hùng":{"ch":"雄","s":12},"dũng":{"ch":"勇","s":9},"hải":{"ch":"海","s":10},"sơn":{"ch":"山","s":3},"quang":{"ch":"光","s":6}};
const LETTER_VAL = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":1,"k":2,"l":3,"m":4,"n":5,"o":6,"p":7,"q":8,"r":9,"s":1,"t":2,"u":3,"v":4,"w":5,"x":6,"y":7,"z":8};
const VOWELS = new Set(['a','e','i','o','u','y']);
function reduceNum(n){ while(n>9&&n!==11&&n!==22&&n!==33){n=String(n).split('').reduce((a,d)=>a+(+d),0);} return n; }

// PRIMARY: letter numerology (Pythagorean) — works for ANY name (Quốc Ngữ incl.)
export function letterName(name){
  const s = String(name||'').toLowerCase().replace(/[^a-z]/g,'');
  if(!s) return null;
  const exp = reduceNum([...s].filter(c=>LETTER_VAL[c]).reduce((a,c)=>a+LETTER_VAL[c],0));
  const soul = reduceNum([...s].filter(c=>VOWELS.has(c)&&LETTER_VAL[c]).reduce((a,c)=>a+LETTER_VAL[c],0));
  const pers = reduceNum([...s].filter(c=>!VOWELS.has(c)&&LETTER_VAL[c]).reduce((a,c)=>a+LETTER_VAL[c],0));
  return {
    expression: { num: exp, text: NAME_NUMS.Expression[String(exp)]||'' },
    soulUrge: { num: soul, text: NAME_NUMS.Soul[String(soul)]||'' },
    personality: { num: pers, text: NAME_NUMS.Personality[String(pers)]||'' },
  };
}

// map token → strokes (surname first, else given char)
function tokenStrokes(tok){
  const t = tok.toLowerCase();
  if (VN_SURNAME[t]) return VN_SURNAME[t].strokes;
  if (GIVEN_CHAR[t]) return GIVEN_CHAR[t].s;
  return null;
}

// SECONDARY: 5格 — chỉ khi TẤT CẢ token map được stroke
export function fiveGrid(name){
  const parts = String(name||'').toLowerCase().trim().split(/[\s]+/);
  if (parts.length < 2) return null;
  const surnameStr = parts[0];
  const givenParts = parts.slice(1);
  const surS = tokenStrokes(surnameStr);
  const givS = givenParts.map(tokenStrokes);
  if (surS == null || givS.some(s => s == null)) return { unmapped: true, missing: [surS==null?surnameStr:'', ...givenParts.filter((g,i)=>givS[i]==null)].filter(Boolean) };
  const givenTotal = givS.reduce((a,b)=>a+b,0);
  const tian = surS + 1;                          // 天格
  const ren = surS + givS[0];                      // 人格 (surname + first given)
  const dia = givenTotal + 1;                      // 地格
  const total = surS + givenTotal;                 // 总格
  const wai = total - ren + 1;                      // 外格
  const lookup = (n) => ({ num: n, ...(STROKES_81[String(n)]||{tone:'?',text:'(ngoài bảng)'}) });
  return { tian: lookup(tian), ren: lookup(ren), dia: lookup(dia), wai: lookup(wai), total: lookup(total), _nums:{tian,ren,dia,wai,total} };
}

export function analyzeName(name){
  const letter = letterName(name);
  const grid = fiveGrid(name);
  let note = 'Letter numerology (Pythagorean) áp dụng cho mọi tên (incl. Quốc Ngữ). 5格 ngũ cách cần tên Hán-Việt map được nét Khang Hy.';
  if (grid?.unmapped) note += ' ⚠ 5格 bỏ qua (token không map nét: '+grid.missing.join(', ')+' — cần tên Hán-Việt chính xác).';
  return { name, letter, grid, note };
}

export function renderNameReading(name){
  const a = analyzeName(name);
  if (!a.letter) return '<p class="hint">Cần tên để luận.</p>';
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const L = a.letter;
  let h = '<div class="naming-grid">';
  h += '<p><b>Expression '+L.expression.num+'</b> (tiềm năng bẩm sinh từ tên): <span class="wi-text">'+esc(L.expression.text)+'</span></p>';
  h += '<p><b>Soul Urge '+L.soulUrge.num+'</b> (khao khát nội tâm): <span class="wi-text">'+esc(L.soulUrge.text)+'</span></p>';
  h += '<p><b>Personality '+L.personality.num+'</b> (ấn tượng bề ngoài): <span class="wi-text">'+esc(L.personality.text)+'</span></p>';
  if (a.grid && !a.grid.unmapped) {
    const g = a.grid;
    h += '<p style="margin-top:8px"><b>5格 Ngũ Cách (Khang Hy):</b></p>';
    for (const [k,vi] of [['tian','天格 Thiên (trên)'],['ren','人格 Nhân (chủ — quan trọng nhất)'],['dia',' địa Địa (dưới)'],['wai','外格 Ngoại (ngoài)'],['total','总格 Tổng (cả tên)']]) {
      const cell = g[k];
      h += '<p><b>'+vi+'</b> = '+cell.num+' ('+cell.tone+'): <span class="wi-text">'+esc(cell.text)+'</span></p>';
    }
  } else if (a.grid?.unmapped) {
    h += '<p class="hint">5格 ngũ cách: '+esc(a.grid.missing.join(', '))+' không map được nét Khang Hy — dùng letter numerology trên.</p>';
  }
  h += '<p class="hint-inline" style="margin-top:6px;display:block">'+esc(a.note)+'</p>';
  h += '</div>';
  return h;
}
