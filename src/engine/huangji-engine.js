// huangji-engine.js — 皇极经世 (邵雍) prophetic engine: 元会运世 + 值年卦 (BÍ TRUYEN/CAM KY)
// Nguon: 邵雍《皇极经世》+ 值年卦推算法 (docs.suhe.space). Day la he TIEN TRI (prophetic) —
// historically restricted (用 cho quốc gia trị loạn). 1元=129600 nam, hien tai: 午会·大过卦·姤运·鼎卦(1984-2043).
// 值年卦 = hexagram cua moi nam (theo tien thien phuong vien do, bo 乾坤离坎 4正卦, 60 nam 1 chu ky).

// 值年卦 60-nam chu ky (bat dau 鼎@1984, theo 先天方圆图 thu tu, bo 4正). Lap lai moi 60 nam.
export const ZHI_NIAN_GUA_60 = [
  '鼎','恒','巽','井','蛊','升','讼','困','未济','解',   // 1984-1993
  '涣','蒙','师','遁','咸','旅','小过','渐','蹇','艮',   // 1994-2003
  '谦','否','萃','晋','豫','观','比','剥','复','颐',     // 2004-2013
  '屯','益','震','噬嗑','随','无妄','明夷','贲','既济','家人', // 2014-2023
  '丰','革','同人','临','损','节','中孚','归妹','睽','兑', // 2024-2033
  '履','泰','大畜','需','小畜','大壮','大有','夬','姤','大过', // 2034-2043
];

// 64 hexagram y nghia (compact) — ten → (vi, meaning)
export const HEXAGRAM_MEANING = {
  '乾': { vi: 'Thiên', m: 'cuc manh, sang, qui nguyen, kien cuong' },
  '坤': { vi: 'Đia', m: 'ban nang chiu dang, ho, binh thang' },
  '屯': { vi: 'Tru', m: 'khoi dau nan kho, can than tai nguyen' },
  '蒙': { vi: 'Mong', m: 'ngu ngo, can hoc hoi, co su chi dan' },
  '需': { vi: 'Nhu', m: 'cho đoi, cho thoi co, kien dinh' },
  '讼': { vi: 'Tung', m: 'tranh chap, kiem dinh, tranh tai' },
  '师': { vi: 'Su', m: 'quan đong, lanh đao, ky luat' },
  '比': { vi: 'Ty', m: 'than can, ket đong minh, hop tac' },
  '小畜': { vi: 'Tieu Tru', m: 'tich luy nho, cam che mem' },
  '履': { vi: 'Ly', m: 'buoc can than, hanh xin cang than' },
  '泰': { vi: 'Thai', m: 'thai binh, thinh vuong, giao luu' },
  '否': { vi: 'Phi', m: 'bi tac, ngung đong, kinh chung' },
  '同人': { vi: 'Đong Nhan', m: 'hop tac, cong đong, lieu minh' },
  '大有': { vi: 'Đai Huu', m: 'co thanh tuu lon, phu quy' },
  '谦': { vi: 'Khiem', m: 'khiem ton, can than, binh yen' },
  '豫': { vi: 'Du', m: 'vui ve, chuan bi, dong vien' },
  '随': { vi: 'Tuy', m: 'theo yeu cau, linh hoat, uong thai' },
  '蛊': { vi: 'Co', m: 'sua chua, phuc hoi, huyet moc' },
  '临': { vi: 'Lam', m: 'tien bo, lanh đao, đat quy' },
  '观': { vi: 'Quan', m: 'quan sat, hieu biet, phan tu' },
  '噬嗑': { vi: 'The Hop', m: 'giam đinh, dung han, pha ngan' },
  '贲': { vi: 'Bi', m: 'trang tri, hinh thuc, van hoa' },
  '剥': { vi: 'Bac', m: 'lung lay, suy đoi, can giu gin' },
  '复': { vi: 'Phuc', m: 'tro lai, hoi phuc, chuyen co' },
  '无妄': { vi: 'Vo Vong', m: 'khong mong, bat ngo, than kinh' },
  '大畜': { vi: 'Đai Tru', m: 'tich luy lon, tu luyen, chuan bi' },
  '颐': { vi: 'Nghi', m: 'nuoi duong, bao ve, cham soc' },
  '大过': { vi: 'Đai Qua', m: 'qua tai, cuc điem, can can than' },
  '坎': { vi: 'Kham', m: 'nguy hiem, kho nan,_than kinh' },
  '离': { vi: 'Ly', m: 'sang, phat hien, chieu toi' },
  '咸': { vi: 'Ham', m: 'cam xuc, yeu duong, ket noi' },
  '恒': { vi: 'Hang', m: 'keo ben, thuong xuyen, đinh ky' },
  '遁': { vi: 'Đon', m: 'rut lui, tranh nguy, an than' },
  '大壮': { vi: 'Đai Trang', m: 'manh me, quyet điet, tien len' },
  '晋': { vi: 'Tien', m: 'tien tac, đe bat, thanh tuu' },
  '明夷': { vi: 'Minh Di', m: 'sang bi che, than trong, đoi thoi' },
  '家人': { vi: 'Gia Nhan', m: 'gia đinh, noi bo, trach nhiem' },
  '睽': { vi: 'Khuynh', m: 'phan đoi, le lap, can hoa giai' },
  '蹇': { vi: 'Kien', m: 'kho khan, bat lloi, can giup đo' },
  '解': { vi: 'Giai', m: 'giai quyet, tha thu, giam nguoi' },
  '损': { vi: 'Ton', m: 'giam bot, hy sinh, don sach' },
  '益': { vi: 'Ich', m: 'tang cuong, loi ich, phat trien' },
  '夬': { vi: 'Quyet', m: 'quyet điet, phat đot, quyet đinh' },
  '姤': { vi: 'Cau', m: 'gap go, bat ngo, dan toc nu' },
  '萃': { vi: 'Tuy', m: 'tap hop, đong lai, đai hoi' },
  '升': { vi: 'Thang', m: 'len len, phat trien, tien bo' },
  '困': { vi: 'Khon', m: 'cung đuong, bi kep, can doi pho' },
  '井': { vi: 'Tinh', m: 'nguon, cong dong, cham soc' },
  '革': { vi: 'Cach', m: 'cach menh, thay đoi, đot phat' },
  '鼎': { vi: 'Đinh', m: 'ky di, than trong, phuc hung, cam che + bien đoi' },
  '震': { vi: 'Chan', m: 'soi noi, đong đat, hanh đong' },
  '艮': { vi: 'Can', m: 'đung lai, nghi ngoi, can than' },
  '渐': { vi: 'Tien', m: 'tu tu, tien bo, chuan bi' },
  '归妹': { vi: 'Quy Muoi', m: 'kho xu, bat thich hop, can can than' },
  '丰': { vi: 'Phong', m: 'đay đu, thanh tuu, cuc thinh' },
  '旅': { vi: 'Lu', m: 'du hanh, bat đinh, can than' },
  '巽': { vi: 'Tuan', m: 'phu tuan, mem mai, long nhiet' },
  '兑': { vi: 'Đoi', m: 'vui ve, giao tiep, hoi hop' },
  '涣': { vi: 'Hoan', m: 'phan tan, tan ra, can tap trung' },
  '节': { vi: 'Tiet', m: 'gioi han, ky luat, tien toc' },
  '中孚': { vi: 'Trung Phu', m: 'chan thanh, tin tuong, long trung' },
  '小过': { vi: 'Tieu Qua', m: 'qua tai nho, can khiem tam' },
  '既济': { vi: 'Ky Te', m: 'hoan thanh, on đinh, can giu' },
  '未济': { vi: 'Vi Te', m: 'chua xong, tiep tuc, chuyen tiep' },
};

// 值年卦 cho 1 nam (1984+ ; truoc 1984 tinh theo chu ky 60)
export function zhiNianGua(year) {
  // chu ky 60 bat dau 鼎@1984. offset = (year-1984) mod 60
  const offset = ((year - 1984) % 60 + 60) % 60;
  const name = ZHI_NIAN_GUA_60[offset];
  const m = HEXAGRAM_MEANING[name] || { vi: name, m: '?' };
  return { year, hexagram: name, vi: m.vi, meaning: m.m, cycleNote: 'Chu ky 60 nam (bat dau 鼎@1984, theo 先天方圆图, bo 乾坤离坎). Hien tai nam trong 鼎卦 60-nam dai van (1984-2043).' };
}

// 元会运世 vi tri (hien tai — co đinh theo 邵雍)
export function yuanHuiYunShi(year) {
  return {
    yuan: '1 nguyen (129600 nam) bat dau BC 67017',
    hui: 'Hoi 7 = 午会 (75600 nam trong nguyen, con ~6560 nam)',
    yun: 'Đai Qua hoi (2160 nam, BC56-AD2103) → 姤运 (360 nam, 1744-2103)',
    shi: '鼎卦 the (60 nam, 1984-2043) — hien dai van chinh',
    note: '元会运世: 1元=12会(10800), 1会=30运(360), 1运=12世(30). 邵雍 dung de tien tri quốc gia trị loạn + 铁板神数.'
  };
}

// === assessHuangji — tong hop (DEEP, prophetic) ===
export function assessHuangji(year) {
  const zg = zhiNianGua(year);
  const ys = yuanHuiYunShi(year);
  const m = HEXAGRAM_MEANING[zg.hexagram] || { m: '?' };
  let tone = 'trung tinh';
  if (/thinhh vuong|đay đu|thai binh|co thanh|tien bo|tang cuong|phuc hung|sang|vui|manh me|cuc thinh/.test(m.m)) tone = 'CAT (nam co co hoi/phat trien)';
  else if (/kho nan|bi tac|soi noi|nguy hiem|cung đuong|bat đinh|phan tan|suy đoi|tranh|cach menh|đot phat|bat ngo|kho kho|bi kep|lung lay|sang bi che|phan đoi|kho xu|bat thich hop/.test(m.m)) tone = 'CAN THAN (nam co bien đong/thu thach)';
  return { ...zg, yuanHuiYunShi: ys, tone, verdict: `Nam ${year} = quẻ「${zg.hexagram} ${zg.vi}」(${m.m}). Đai van 鼎卦 (1984-2043) = cam che + bien đoi. Goc tiên tri 皇极经世 (邵雍), thuoc loai BÍ TRUYEN/CAM KY (tien tri/tri quoc).` };
}
