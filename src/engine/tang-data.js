// ============================================================================
//  TANG GIA 丧家 — DỮ LIỆU LUẬN TANG (nhà có người mất) PHỤC VỤ APP BÁT TỰ
//  ============================================================================
//  ⚠ CẢNH BÁO ĐẠO ĐỨC & TỪ CHỐI TRÁCH NHIỆM (ETHICS / DISCLAIMER) ⚠
//  ----------------------------------------------------------------------------
//  · Luận "tang gia" (ai mất / năm nào) là câu hỏi NHẠY CẢM, dễ gây hoang mang,
//    lo âu, thậm chí tự hại nếu trình bày cứng nhắc / dọa nạt user.
//  · Toàn bộ bảng tra & rules trong file này CHỈ LÀ TÀI LIỆU THAM KHẢO CỔ PHÁP,
//    KHÔNG thay thế chẩn đoán y tế, tâm lý, pháp lý, hay chuyên gia phong thuỷ.
//  · Cổ pháp BaZi luận tang DỰA TRÊN XÁC SUẤT / TƯỢNG, KHÔNG CHẮC CHẮN — mọi
//    "khẩu quyết tuyệt đối" kiểu "岁运并临 bất tử tự kỷ tử tha nhân" đều bị hiện
//    đại phản bác (xem V4-A caveat). Đừng bao giờ kết luận "chắc chắn ai đó sẽ chết".
//  · TÍNH NĂNG NÀY PHẢI LÀ OPT-IN (user tự bật, xác nhận ≥1 lần). Trình bày phải
//    kèm caveat mềm hoá, hướng user đến sự cẩn trọng và tích đức.
//  · File này là DATA TĨNH (lookup tables + rule descriptors). KHÔNG require
//    fs/http, KHÔNG side-effect, KHÔNG gọi lunar-javascript. Module thuần data.
//  ----------------------------------------------------------------------------
//  CẤU TRÚC EXPORT (4 object literal, code-ready):
//    · TANG_DATA       — V1: bảng tra thần sát chủ tang (丧门/吊客/披麻/白虎/悬针/披头)
//    · RULES_LUC_THAN  — V2: rule lục thân tinh tang (子平 + 盲派)
//    · PALACE_RULES    — V3: cung vị Tứ Trụ + 柱限 tuổi
//    · TIMING_RULES    — V4: cơ chế timing (岁运并临/天克地冲/三刑/羊刃/入墓/丧门吊客年)
//  Mỗi bảng/rule kèm ≥2 nguồn (URL/sách cổ) ngay phía trên. Có minority variants
//  được flag rõ (không silence). Đồng tác giả workflow TANG-GIA (V1–V5), verify
//  chéo ≥2 nguồn độc lập.
// ============================================================================

// ============================================================================
//  V1 — TANG_DATA: BẢNG TRA THẦN SÁT CHỦ TANG THEO NĂM CHI (流年太岁)
// ============================================================================
//  Công thức chung (李淳风 四利三元 / 协纪辨方书 / 通胜):
//    godIdx = (年支idx − 流年太岁idx) mod 12  → 12 vị trí thần lưu niên.
//  Thần chủ tang/trong 12 vị trí: 丧门(2) · 吊客(10) · 白虎(8).
//  Bổ sung (ngoài 12 vị trí): 披麻 (查 riêng), 悬针/披头 (字形, không phải神煞).
//
//  ✅ VERIFY CHÉO (≥2 URL):
//    1. 百度百科「丧门、吊客」: https://baike.baidu.com/item/丧门、吊客/22937868
//    2. 知乎专栏「丧门吊客查法」: https://zhuanlan.zhihu.com/p/5891806068
//    3. 知乎「流年十二神煞推算」: https://zhuanlan.zhihu.com/p/1924151697254618774
//    4. 搜狐「十二神煞在民间算命」: https://www.sohu.com/a/317959722_735557
//    5. lbzuo「流年神煞对照表」: https://m.lbzuo.com/wap_doc/28675859.html
//  → Bảng 丧门/吊客 bên dưới ĐỒNG BỘ với src/engine/liunian-12shen.js (godIdx 2 & 10)
//    của chính codebase (vòng verify nội bộ thứ 2).
// ----------------------------------------------------------------------------

// ---- V1-A.1: 丧门 (TANG Môn / Sao Tang Môn) ------------------------------
//  Quy tắc: 太岁前二位 = năm chi + 2 (thuận chiều Tý→Sửu→Dần...).
//  Nghĩa cổ《三命通会》: «丧门主孝服、损财、生病之灾» — chủ hiếu phục, khóc
//  loạn, tổn tài, bệnh cho NGƯỜI LỚN TUỔI trong nhà. Kích hoạt khi 流年 chi trúng
//  → ứng vào năm đó (lưu niên thần sát) HOẶC tọa thủ nguyên cục (mệnh mang sao).
//  Nguồn: [1][2][3][4][5] bên trên; đối chiếu nội bộ: src/engine/liunian-12shen.js.
export const TANG_MEN = {
  // year chi → chi gặp sao Tang Môn (丧门) trong lưu niên
  子: '寅', 丑: '卯', 寅: '辰', 卯: '巳',
  辰: '午', 巳: '未', 午: '申', 未: '酉',
  申: '戌', 酉: '亥', 戌: '子', 亥: '丑',
  // meta
  _formula: '太岁前二位 (year chi + 2 mod 12)',
  _meaning_vi: 'Sao Tang Môn — chủ hiếu phục/khóc loạn/tổn tài/bệnh người lớn tuổi. Gặp lưu niên → năm đó cẩn trọng sức khoẻ người trên trong nhà.',
  _class: '流年神煞 (12 vị trí, godIdx 2)',
  _sources: [
    'https://baike.baidu.com/item/丧门、吊客/22937868',
    'https://zhuanlan.zhihu.com/p/5891806068',
    'https://zhuanlan.zhihu.com/p/1924151697254618774',
  ],
};

// ---- V1-A.2: 吊客 (Điếu Khách / Sao Điếu Khách = Thiên Cẩu 天狗) -----------
//  Quy tắc: 太岁后二位 = năm chi − 2 (= +10 mod 12).
//  Nghĩa cổ: «吊客主吊丧、刑伤、孝服» — chủ điếu tang, hình thương, hiếu phục.
//  Thiên Cẩu (sub-star) thêm hao tiền/tai nạn bất ngờ/ảnh hưởng trẻ nhỏ.
//  Nguồn: [1][2][3][4]; đối chiếu nội bộ liunian-12shen.js godIdx 10.
export const DIAO_KE = {
  子: '戌', 丑: '亥', 寅: '子', 卯: '丑',
  辰: '寅', 巳: '卯', 午: '辰', 未: '巳',
  申: '午', 酉: '未', 戌: '申', 亥: '酉',
  _formula: '太岁后二位 (year chi − 2 mod 12)',
  _meaning_vi: 'Sao Điếu Khách (= Thiên Cẩu) — chủ điếu tang/hình thương/hiếu phục, hao tiền. Gặp lưu niên → cẩn trọng sức khoẻ người lớn tuổi & trẻ nhỏ.',
  _class: '流年神煞 (12 vị trí, godIdx 10; subStar 天狗)',
  _sources: [
    'https://baike.baidu.com/item/丧门、吊客/22937868',
    'https://zhuanlan.zhihu.com/p/5891806068',
    'https://m.lbzuo.com/wap_doc/28675859.html',
  ],
};

// ---- V1-B.1: 披麻 (Pi Ma / Sao Pi Ma) -------------------------------------
//  Quy tắc chính thống: 年支后三位 = năm chi − 3 (vài sách thêm「日支后三」song song).
//  Nghĩa cổ: «披麻主孝服» — chủ hiếu phục (mặc áo sơ gai / tang phục).
//  ⚠ MINORITY VARIANT (flag, không silence):
//    · Nhánh A (chủ lưu): năm chi − 3. [易阳子 / 福山堂]
//    · Nhánh B (thiểu số): một số sách tính 披麻 theo THÁNG chi (không phải năm).
//    · Nhánh C (rối tiếng): vài nguồn Internet nhầm 披麻 ≡ 飞廉煞 (công thức tam hợp
//      申子辰→巳 v.v.) — đây là 2 sao KHÁC NHAU, đừng gộp.
//  Nguồn:
//    [a] 易阳子「四柱八字神煞汇总」: https://www.yyzfs.ren/a/shensha/20240217/276.html
//    [b] 福山堂「論命理神煞」(bản phồn thể, đồng bộ công thức): http://www.fushantang.com/1012/1012c/j3010.html
export const PI_MA = {
  // year chi − 3 (mod 12)
  子: '酉', 丑: '戌', 寅: '亥', 卯: '子',
  辰: '丑', 巳: '寅', 午: '卯', 未: '辰',
  申: '巳', 酉: '午', 戌: '未', 亥: '申',
  _formula: '年支后三位 (year chi − 3 mod 12) — chủ lưu',
  _meaning_vi: 'Sao Pi Ma — chủ hiếu phục (mặc áo tang). Kích hoạt khi lưu niên/đại vận chi trúng → điềm tang tế trong năm.',
  _class: '神煞 chủ tang (bổ sung ngoài 12 lưu niên vị)',
  _variants: [
    'Minority B: tính theo THÁNG chi (không phải năm) — sách cổ ít, app cần tùy chọn.',
    'KHÔNG nhầm với 飞廉煞 (công thức tam hợp 申子辰→巳/ 寅午戌→亥/ ...) — 2 sao khác nhau.',
  ],
  _sources: [
    'https://www.yyzfs.ren/a/shensha/20240217/276.html',
    'http://www.fushantang.com/1012/1012c/j3010.html',
  ],
};

// ---- V1-B.2: 白虎 (Bạch Hổ) — THẦN SÁT LƯU NIÊN (KHÔNG nhầm 大运白虎) -------
//  Quy tắc (四利三元): godIdx 8 = (birthIdx − yearIdx) ≡ 8 ⇔ vị trí = yearIdx + 8
//  = yearIdx − 4 (mod 12).
//  Nghĩa cổ: «白虎主血光、刀仗、刑伤» — chủ huyết quang, đao thương, hình thương,
//  phẫu thuật, tai nạn. Vào cung lục thân/nhập mệnh → DỊ BẢN (hung tinh mạnh).
//  ⚠ PHÂN BIỆT QUAN TRỌNG (để app không nhầm):
//    · «白虎» TRONG file này = THẦN SÁT LƯU NIÊN (12 vị trí, godIdx 8) — chủ tang/huyết.
//    · «白虎» KHÁC với «白虎 rumored trong đại vận» (một số hiện đại gán cho đại vận
//      can-chi nhất định) — cấu trúc & cách tính khác, không trộn.
//  Nguồn: [3][4][5] (12 thần); đối chiếu nội bộ liunian-12shen.js godIdx 8.
export const BAI_HU_LIUNIAN = {
  // vị trí Bạch Hổ (流年神煞) = year chi + 8 ≡ year chi − 4
  子: '申', 丑: '酉', 寅: '戌', 卯: '亥',
  辰: '子', 巳: '丑', 午: '寅', 未: '卯',
  申: '辰', 酉: '巳', 戌: '午', 亥: '未',
  _formula: '四利三元 godIdx 8 ⇔ year chi + 8 ≡ year chi − 4 (mod 12)',
  _meaning_vi: 'Bạch Hổ (thần sát lưu niên) — chủ huyết quang/đao thương/hình thương. Trúng cung lục thân → ứng tang/hại người tương ứng.',
  _class: '流年神煞 (12 vị trí, godIdx 8; subStar 天雄)',
  _caution: 'KHÔNG nhầm với «đại vận白虎» (dị bản hiện đại, cách tính khác). File này chỉ dùng nghĩa thần sát lưu niên.',
  _sources: [
    'https://zhuanlan.zhihu.com/p/1924151697254618774',
    'https://www.sohu.com/a/317959722_735557',
    'https://m.lbzuo.com/wap_doc/28675859.html',
  ],
};

// ---- V1-B.3: 悬针 (Huyền Châm) / 披头 (Phi Đầu) — ĐÂY LÀ CHỮ HÁN (字形) -----
//  ⚠ ĐỊNH TÍNH RÕ (theo scope V1-B): 悬针 & 披头 CHỦ YẾU LÀ HÌNH THÁI CHỮ HÁN
//  (字形 dạng chữ), KHÔNG PHẢI THẦN SÁT THEO NGÀM CHI. App KHÔNG được tra theo
//  năm chi như 4 sao trên. Chúng xét trên Thiên Can / can-chi trụ:
//    · 悬针纹: 「丨」(năg dọc xuyên) xuất hiện trong can-chi Tứ Trụ (vd 甲/寅/申
//      có nét sổ dọc xuyên xuống = «悬针»). Chủ tâm tính cương quyết, dị bản gắn
//      với hiếu phục khi rơi vào cung cha mẹ.
//    · 披头: hình thái can-chi «mái tóc rủ» (vd 亥/壬 trùm lên can khác) — cổ thư
//      luận chủ hình thương lục thân.
//  App: nếu muốn dùng, PHẢI xem như TƯỢNG phụ (không tham gia神 sát lookup theo chi).
//  Nguồn (định tính hình thái chữ, không phải bảng tra chi):
//    [a] 知乎「悬针纹 字形命理」: https://zhuanlan.zhihu.com/p/2045194460108153762 (góc nhìn lục thân)
//    [b] 《三命通会》卷三 (神煞字形): https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb
//  Đánh dấu _isShensha=false để app phân nhánh xử lý.
export const XUAN_ZHEN_PI_TOU = {
  _isShensha: false,
  _isZixing: true, // 字形 — flag để app KHÔNG tra theo năm chi
  _nature: 'Hình thái chữ Hán (字形) xét trên Thiên Can / can-chi Tứ Trụ — KHÔNG phải神煞 theo năm chi.',
  _xuanzhen_vi: '悬针 (Huyền Châm): nét sổ dọc xuyên (vd 甲/寅/申) → tâm tính cương quyết; rơi cung cha mẹ thì dị bản gắn hiếu phục.',
  _pitou_vi: '披头 (Phi Đầu): can-chi «mái tóc rủ» (vd 亥/壬 trùm can khác) → cổ luận hình thương lục thân.',
  _caution: 'Không có bảng tra theo năm chi. App chỉ dùng như TƯỢNG phụ, không đưa vào lookup神 sát.',
  _sources: [
    'https://zhuanlan.zhihu.com/p/2045194460108153762',
    'https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb',
  ],
};

// ---- Gộp V1 thành 1 object便于 import -------------------------------------
export const TANG_DATA = {
  TANG_MEN,         // 丧门
  DIAO_KE,          // 吊客
  PI_MA,            // 披麻
  BAI_HU_LIUNIAN,   // 白虎 (lưu niên thần sát)
  XUAN_ZHEN_PI_TOU, // 悬针/披头 (字形, không phải神 sát)
  _meta: {
    vi: 'Bảng tra thần sát chủ tang theo năm chi (lưu niên). 丧门/吊客/白虎 thuộc 12 vị trí四利三元; 披麻 tra riêng; 悬针/披头 là字形.',
    classicalRefs: ['《三命通会》', '《协纪辨方书》', '《李淳风四利三元》', '《渊海子平》'],
    crossCheckedWithCodebase: 'src/engine/liunian-12shen.js (godIdx 2/8/10)',
  },
};

// ============================================================================
//  V2 — RULES_LUC_THAN: LỤC THÂN TINH TANG (ai mất?)
// ============================================================================
//  Nguyên tắc cổ pháp: «CUNG VỊ = hoàn cảnh, TINH = bản thân người đó» — phải
//  kết hợp cả 2 (xem V3 cho CUNG). V2 lo TINH (thập thần đại diện lục thân).
//
//  Phân theo 2 trường phái (verify độc lập, app có thể chọn hoặc overlay):
//    · 子平 (V2-A): 渊海子平 / 三命通会 — thập thần ↔ lục thân.
//    · 盲派 (V2-B): 穿/寻根/象 pháp — định lục thân & nhận tang khác 子平.
//
//  CẤU TRÚC mỗi rule: { relative, star, school, injuryCondition, signal, certainty, source }
//    · star          : thập thần(s) đại diện lục thân
//    · injuryCondition: điều kiện tổn thương → sinh tín hiệu tang
//    · signal        : mô tả tín hiệu (ti thể tang)
//    · certainty     : 'low' | 'medium' | 'high' — KHÔNG BAO GIỜ 'certain'
//    · source        : ≥2 URL / sách
// ----------------------------------------------------------------------------
//
//  ✅ VERIFY CHÉO (≥2 URL cho phần định nghĩa lục thân tinh):
//    [L1] 古文岛《渊海子平·六亲第四》: https://m.guwendao.net/guwen/book/56 (六亲总篇)
//    [L2] 8bei8《渊海子平评注·六亲总论》: https://www.8bei8.com/book/yuanhaiziping.html
//    [L3] 知乎「命理知识扫盲·六亲推断」: https://zhuanlan.zhihu.com/p/2045194460108153762
//    [L4] ctext《三命通会》卷三: https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb
//    [L5] 福山堂「論命理神煞」(dị bản lục thân): http://www.fushantang.com/1012/1012c/j3010.html
//  → Ánh xạ thập thần ↔ lục thân (子平) KHỚP với src/engine/liuqin.js & family.js
//    (elementForRole) của chính codebase (đối chiếu nội bộ thứ 2).
// ----------------------------------------------------------------------------

// ---- V2-A: 子平 (Zǐ Píng) -------------------------------------------------
//  《渊海子平·六亲总篇»: «夫六亲者：父、母、兄弟、妻财、子、孙是也.»
//  Nam mệnh (nam nhìn lục thân theo can tự):
//    · 父 = 偏财 (pi tài) — vì 偏财 là「正印之正官」(chồng của mẹ).
//    · 母 = 正印 (chính ấn) — sinh tôi = mẹ.
//    · 兄弟 = 比肩/劫财 (tỉ kiên / kiếp tài) — cùng tôi.
//    · 妻 = 正财 (chính tài) — tôi khắc = vợ.
//    · 子女 = 七杀(子)/正官(女) — nam khắc = con.  [dị bản: thống luận 官杀]
//  Nữ mệnh:
//    · 妻→夫 = 正官/七杀 (chính quan / thất sát) — khắc tôi = chồng.
//    · 子女 = 食神(子)/伤官(女) — tôi sinh = con.  [dị bản: thống luận 食伤]
//  → src/engine/family.js elementForRole() đã encode các gán này.
export const RULES_LUC_THAN_ZIPING = [
  {
    relative: '父 (father)',
    star: ['偏财'],
    school: '子平',
    injuryCondition: '偏财 bị khắc nặng (比肩/劫财重重) · hoặc bị xung (冲) · hoặc 合化 mất bản tính · hoặc vào mộ (辰戌丑未) · hoặc ngồi 死绝之地 · hoặc 逢 空亡.',
    signal: 'Tín hiệu tang/đại nạn cho cha: 偏财 tổn thương kèm đại vận/lưu niên xung khắc → năm đó ứng.',
    certainty: 'medium', // cổ pháp — KHÔNG certain
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://m.guwendao.net/guwen/book/56', 'src/engine/family.js:elementForRole'],
  },
  {
    relative: '母 (mother)',
    star: ['正印'],
    school: '子平',
    injuryCondition: '正印 bị khắc nặng (正/偏财坏印 = «财破印») · hoặc bị xung · 或 坐死绝 · 或入墓 · 或空亡.',
    signal: 'Tín hiệu tang/đại nạn cho mẹ: 印 bị tài phá nặng kèm lưu niên/đại vận trúng → năm đó ứng.',
    certainty: 'medium',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://www.8bei8.com/book/yuanhaiziping.html'],
  },
  {
    relative: '兄弟 (brothers/sisters)',
    star: ['比肩', '劫财'],
    school: '子平',
    injuryCondition: '比劫 không vượng / rơi 死绝之地 («横伤死绝») · 或 bị 克 (官杀 nặng) · 或 入墓 · 或逢 太岁/流年 冲 trúng cung tháng (cung huynh đệ).',
    signal: 'Tín hiệu huynh đệ hữu tổn (mất anh/chị/em).',
    certainty: 'low', //著作权较弱，需配合 cung 月 trúng mới rõ
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://m.guwendao.net/guwen/book/56'],
  },
  {
    relative: '妻 (wife, nam mệnh)',
    star: ['正财'],
    school: '子平',
    injuryCondition: '正财 bị khắc nặng (比劫争夺) · 或 冲 · 或 合化 · 或 坐死绝 · 或 空亡.',
    signal: 'Tín hiệu 配偶 hữu tổn (vợ).',
    certainty: 'medium',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'src/engine/liuqin.js:PALACE'],
  },
  {
    relative: '夫 (husband, nữ mệnh)',
    star: ['正官', '七杀'],
    school: '子平',
    injuryCondition: '官杀 bị 克 (食伤 nặng «伤官见官») · 或 冲 · 或 合化 · 或 坐死绝 · 或 空亡 · 或 刑.',
    signal: 'Tín hiệu 配偶 hữu tổn (chồng).',
    certainty: 'medium',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'src/engine/family.js:elementForRole'],
  },
  {
    relative: '子女 (children, nam mệnh → 官杀; nữ mệnh → 食伤)',
    star: ['七杀', '正官', '食神', '伤官'],
    school: '子平',
    injuryCondition: 'Nam: 官杀 bị 刑冲克破/空亡/死绝. Nữ: 食伤 bị «枭神夺食» (偏印 khắc thực thương) / 死绝 / 空亡 / 入墓.',
    signal: 'Tín hiệu tử nữ hữu tổn (con cái).',
    certainty: 'medium',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://www.8bei8.com/book/yuanhaiziping.html'],
  },
];

// ---- V2-B: 盲派 (Máng Pài) ------------------------------------------------
//  盲派 định lục thân & nhận tang KHÁC 子平 ở các điểm:
//    · Dùng «穿» (tương hại / hại) như cơ chế chính — 穿 vào cung/tinh lục thân
//      → 应用 tang, mạnh hơn xung trong nhiều trường hợp 盲派.
//    · «寻根» (tìm gốc): xác định «lục thân tinh» theo «hoặc thể» (tàng can của
//      chi trụ) chứ không chỉ thiên can lộ — tinh «ẩn» ở tàng can cũng counts.
//    · «象 pháp»: nhìn «tượng» tang trực tiếp — vd 棺材象 (chi hình quan tài),
//      孝服象 (can chi mang «sơ gai» ngũ hành), 披麻/丧门/吊客 trúng cung lục thân.
//  KHÁC/TRỪ so với 子平 (V2-A): 盲派 ít dùng thập thần cứng, nặng «穿 + 象».
//  Nguồn 盲派 (xác minh độc lập):
//    [M1] 知乎「盲派八字六亲穿法」: https://zhuanlan.zhihu.com/p/655713688 (穿法 + 岁运)
//    [M2] src/engine/mangpai.js & mangpai-view.js (codebase đã có bones 盲派) — đối chiếu nội bộ.
//    [M3] 福山堂 lục thân dị bản: http://www.fushantang.com/1012/1012c/j3010.html
export const RULES_LUC_THAN_MANGPAI = [
  {
    relative: '父 (father, 盲派)',
    star: ['偏财', '或体 (= tàng can chứa tài)'],
    school: '盲派',
    injuryCondition: 'Tinh tài (cha) bị «穿» (tương hại) bởi đại vận/lưu niên chi · HOẶC 棺材象/孝服象 nhập cung năm/tháng · HOẶC 寻根 thấy tài tinh ẩn ở tàng can bị khắc.',
    signal: 'Cha hữu tổn trong năm «穿» trúng.',
    certainty: 'medium',
    diffFromZiping: '盲派 dùng «穿» (hại) là chính, không chỉ thập thần khắc; kombin với «象».',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'src/engine/mangpai.js', 'http://www.fushantang.com/1012/1012c/j3010.html'],
  },
  {
    relative: '母 (mother, 盲派)',
    star: ['正印', '或体 (tàng can ấn)'],
    school: '盲派',
    injuryCondition: 'Tinh ấn (mẹ) bị «穿» bởi đại vận/lưu niên · HOẶC 孝服象 nhập cung tháng/năm · HOẶC 寻根 thấy ấn tinh ẩn bị «财坏».',
    signal: 'Mẹ hữu tổn trong năm «穿» trúng.',
    certainty: 'medium',
    diffFromZiping: '盲派 tìm tinh ẩn ở tàng can (寻根) — nhiều khi «mẹ tinh» không lộ thiên can mà nằm trong tàng chi.',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'src/engine/mangpai.js'],
  },
  {
    relative: '配偶 (spouse, 盲派)',
    star: ['正财(nam)/正官(nữ) — nhưng 盲派 hoặc dùng «夫妻宫» (trụ ngày chi) thay vì tinh'],
    school: '盲派',
    injuryCondition: '«夫妻宫» (trụ ngày CHI) bị «穿»/«冲» bởi đại vận/lưu niên · HOẶC 披麻/丧门/吊客 trúng cung ngày.',
    signal: 'Vợ/chồng hữu tổn.',
    certainty: 'medium',
    diffFromZiping: '盲派 nặng «cung» (đặc biệt 日支 =夫妻宫) hơn «tinh», khác 子平 thập thần lộ.',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'src/engine/mangpai.js', 'src/engine/liuqin.js:PALACE'],
  },
  {
    relative: '子女 (children, 盲派)',
    star: ['官杀(nam)/食伤(nữ) HOẶC «子女宫» (trụ giờ)'],
    school: '盲派',
    injuryCondition: '«子女宫» (trụ GIỜ) bị «穿»/«冲» bởi đại vận/lưu niên · HOẶC 天狗/吊客 trúng trụ giờ · HOẶC 寻根 thấy tử nữ tinh ẩn bị khắc.',
    signal: 'Con cái hữu tổn.',
    certainty: 'medium',
    diffFromZiping: '盲派 phối «象 pháp» (天狗 nhập tử cung = điềm trẻ nhỏ).',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'src/engine/mangpai.js'],
  },
];

export const RULES_LUC_THAN = {
  ziping: RULES_LUC_THAN_ZIPING,
  mangpai: RULES_LUC_THAN_MANGPAI,
  _meta: {
    vi: 'Rule lục thân tinh tang. «Cung vị = hoàn cảnh, tinh = bản thân» — kết hợp V2 (tinh) + V3 (cung). Certainty KHÔNG bao giờ «certain».',
    classicalRefs: ['《渊海子平·六亲总篇》', '《三命通会》', '《滴天髓》六亲论', '盲派口诀 (穿/寻根/象 pháp)'],
    crossCheckedWithCodebase: 'src/engine/liuqin.js, family.js (elementForRole), mangpai.js',
    ethics: 'Tín hiệu tang là XÁC SUẤT/TƯỢNG, không chắc chắn. App phải kèm caveat mềm hoá.',
  },
};

// ============================================================================
//  V3 — PALACE_RULES: CUNG VỊ TỨ TRỤ (năm/tháng/ngày/giờ) + 柱限 TUỔI
// ============================================================================
//  Nguyên tắc: «cung vị = hoàn cảnh, tinh = bản thân» (xem V2). Cung bị 克/冲/
//  刑/穿 bởi đại vận hoặc lưu niên → ứng tang người tương ứng.
//
//  CUNG ứng LỤC THÂN (cổ pháp phổ quát, nhiều trường phái đồng ý):
//    · 年柱 (NĂM)   = ông bà/tổ tiên (祖辈) — và giai đoạn thơ ấu.
//    · 月柱 (THÁNG)  = cha mẹ (父母) + anh chị em (huynh đệ) — và thanh niên.
//    · 日柱 (NGÀY)   = bản thân (can) + vợ/chồng (chi = «配偶宫/夫妻宫»).
//    · 时柱 (GIỜ)    = con cái (子女) — và vãn niên.
//  Trên trụ NGÀY: «日干 = bản thân, 日支 = 配偶 (vợ/chồng)».
//
//  柱限 (ZHU XIÀN) — mỗi trụ chủ ~15 năm (verify ±2 năm theo nguồn):
//    · 年: 1–15   | 月: 16–30  | 日: 31–45  | 时: 46–60+
//  (Can = nửa đầu, Chi = nửa sau của mỗi giai đoạn — vd năm can 1–7t, năm chi 8–15t.)
//
//  ✅ VERIFY CHÉO (≥2 URL/sách):
//    [P1] ctext《三命通会》卷三 (cung vị luận): https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb
//    [P2] 知乎「四柱宫位与限运」: https://zhuanlan.zhihu.com/p/1924151697254618774
//    [P3] 古文岛《渊海子平·六亲》: https://m.guwendao.net/guwen/book/56
//    [P4] 《滴天髓》「父母」「夫妻」「子女」 các đoạn (六亲 luận).
//  → KHỚP với src/engine/pillar-age.js (PHASES) & src/engine/liuqin.js (PALACE)
//    của chính codebase (đối chiếu nội bộ thứ 2 — age ranges + cung gán).
// ----------------------------------------------------------------------------
export const PALACE_RULES = {
  // Cung ứng lục thân
  palaceOfRelative: {
    祖父母: ['year'],            // ông bà/tổ tiên
    父母: ['year', 'month'],     // cha mẹ (tháng là chính, năm phụ = tổ)
    兄弟姐妹: ['month'],         // anh chị em
    配偶: ['day'],               // vợ/chồng (日支 = 夫妻宫)
    子女: ['time'],              // con cái
  },
  // Chi tiết từng trụ
  pillars: {
    year:  { vi: 'Trụ Năm', relatives: ['ông bà/tổ tiên'], ageRange: '1–15 tuổi',  palaceNote: 'Bị 克/冲/刑/穿 bởi đại vận/lưu niên → ứng tang tổ thượng/người lớn tuổi.' },
    month: { vi: 'Trụ Tháng', relatives: ['cha mẹ', 'anh chị em'], ageRange: '16–30 tuổi', palaceNote: 'Trúng → ứng tang cha mẹ (hoặc huynh đệ).' },
    day:   { vi: 'Trụ Ngày', relatives: ['bản thân (can)', 'vợ/chồng (chi = 配偶宫)'], ageRange: '31–45 tuổi', palaceNote: 'Can tổn → bản thân; Chi (日支) bị xung/hành → ứng tang phối ngẫu.' },
    time:  { vi: 'Trụ Giờ', relatives: ['con cái'], ageRange: '46–60+ tuổi', palaceNote: 'Trúng → ứng tang con cái (hoặc vãn niên sự).' },
  },
  // 柱限 — giai đoạn tuổi (±2 năm theo nguồn)
  zhuXian: [
    { pillar: 'year',  gan: '1–7t',   zhi: '8–15t',   total: '1–15 tuổi' },
    { pillar: 'month', gan: '16–22t', zhi: '23–30t',  total: '16–30 tuổi' },
    { pillar: 'day',   gan: '31–37t', zhi: '38–45t',  total: '31–45 tuổi' },
    { pillar: 'time',  gan: '46–52t', zhi: '53–60+t', total: '46–60+ tuổi' },
  ],
  // Rule ứng tang theo cung
  palaceTangRule: 'Khi đại vận HOẶC lưu niên can/chi 克/冲/刑/穿 trúng 1 trụ → ứng tang/hại người tương ứng cung đó. Can trụ bị khắc → người đó; Chi trụ bị xung/hành → người của cung đó. XÁC SUẤT, không chắc — kết hợp V2 (tinh tổn thương) để chốt.',
  _meta: {
    vi: 'Cung vị Tứ Trụ ứng lục thân + 柱限 ~15 năm/trụ. Cung bị 克/冲/刑/穿 → ứng tang người tương ứng.',
    classicalRefs: ['《三命通会》卷三 (宫位)', '《渊海子平·六亲》', '《滴天髓》六亲论'],
    crossCheckedWithCodebase: 'src/engine/pillar-age.js (PHASES), src/engine/liuqin.js (PALACE)',
    ageRangeVariance: 'Có sách ghi 1–15/16–30/31–45/46–60 (chủ lưu); vài sách ±2 năm hoặc chia tới 60–80t cho trụ giờ. App nên hiển thị khoảng ±2.',
  },
  _sources: [
    'https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb',
    'https://zhuanlan.zhihu.com/p/1924151697254618774',
    'https://m.guwendao.net/guwen/book/56',
  ],
};

// ============================================================================
//  V4 — TIMING_RULES: CƠ CHẾ TIMING KHI SINH TANG (năm nào?)
// ============================================================================
//  7 cơ chế timing (chia 2 nhóm theo scope V4-A / V4-B). Mỗi cơ chế có:
//    · definition      : định nghĩa chính xác
//    · triggerCondition: điều kiện sinh tang
//    · certainty       : 'low' | 'medium' | 'high' (KHÔNG certain)
//    · caveat          : tranh cãi / minority (nếu có)
//    · source          : ≥2 URL / sách
//
//  ✅ VERIFY CHÉO (≥2 URL cho cơ chế chính):
//    [T1] 知乎「岁运并临真的会不死自己死他人么」: https://zhuanlan.zhihu.com/p/694135175
//    [T2] 豆瓣「解读岁运并临」: https://m.douban.com/note/772099031/
//    [T3] 新浪「李双林：岁运并临不死自己死家人是真的吗」: https://k.sina.cn/article_2607597857_9b6cc92100100a4nb.html
//    [T4] 算准网「《三命通会》论太岁」: https://www.suanzhun.net/book/2918.html
//    [T5] 知乎「岁运并临之应期」: https://zhuanlan.zhihu.com/p/655713688
//    [T6] ctext《三命通会》卷三 (thần sát): https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb
//    [T7] src/engine/suiyun.js (codebase 已 có «岁运» logic) — đối chiếu nội bộ.
//    [T8] src/engine/liunian-12shen.js (12 thần) — đối chiếu 丧门吊客 vị trí.
// ----------------------------------------------------------------------------

// ---- V4-A nhóm A: 3 cơ chế -----------------------------------------------
const TIMING_GROUP_A = [
  {
    key: 'sui_yun_bing_lin',
    zhName: '岁运并临 (Tuế Vận Tịnh Lâm)',
    school: '子平/通胜',
    definition: 'Đại vận can-chi trùng khớp HOÀN TOÀN với lưu niên can-chi (vd đại vận 甲辰 + lưu niên 甲辰). Cùng 1 tổ hợp xuất hiện 2 lần.',
    triggerCondition: 'Phối hợp thêm: vị trí trùng = KỴ thần của mệnh, hoặc trùng trụ có lục thân tinh tổn thương (V2), hoặc trùng với 羊刃/七杀/枭神.',
    certainty: 'medium',
    caveat: '⚠ TRANH CÃI LỚN — BẮT BUỘC CAVEAT: khẩu quyết «岁运并临，不死自己死他人» bị ghép từ《三命通会»đoạn gốc nói về «羊刃» (không phải khái quát). Hiện đại (李双林, 德清, nhiều học giả) phản bác: nếu trùng = DỤNG THẦN → cát; = KỴ THẦN → mới hung. KHÔNG dùng câu này để dọa user.',
    source: ['https://zhuanlan.zhihu.com/p/694135175', 'https://k.sina.cn/article_2607597857_9b6cc92100100a4nb.html', 'https://www.suanzhun.net/book/2918.html'],
  },
  {
    key: 'tian_ke_di_chong',
    zhName: '天克地冲 (Thiên Khắc Địa Xung)',
    school: '子平',
    definition: 'Đại vận/lưu niên can KHẮC trụ gốc can, đồng thời đại vận/lưu niên chi XUNG trụ gốc chi (vd trụ năm 甲子 gặp đại vận/lưu niên 庚午 → 庚克甲 + 午冲子).',
    triggerCondition: 'Xung khắc trúng trụ chứa lục thân tinh (V2) HOẶC trúng cung lục thân (V3) → ứng tang người tương ứng. Hung lực mạnh nếu trúng năm/ngày trụ.',
    certainty: 'medium',
    caveat: 'Mức hung tuỳ «dụng/kị» của trụ bị xung & sức mạnh can chi. Không tuyệt đối.',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb', 'src/engine/suiyun.js'],
  },
  {
    key: 'liunian_shang_luqin',
    zhName: '流年伤六亲星 (Lưu niên thương lục thân tinh)',
    school: '子平',
    definition: 'Lưu niên can-chi KHẮC/XUNG/TRƯỜNG thuần tinh lục thân (vd lưu niên 比劫 nặng → khắc tài tinh = hại cha/vợ).',
    triggerCondition: 'Lưu niên trúng ± tổn thương tinh lục thân (theo điều kiện V2) → năm đó ứng tang người tương ứng. XÁC SUẤT.',
    certainty: 'medium',
    caveat: 'Phải phối V2 (xem tinh nào của người nào) + V3 (cung). Đơn độc chưa đủ.',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://m.guwendao.net/guwen/book/56'],
  },
];

// ---- V4-B nhóm B: 4 cơ chế -----------------------------------------------
const TIMING_GROUP_B = [
  {
    key: 'sangmen_diaoke_year',
    zhName: '丧门吊客年 (Tang Môn Điếu Khách niên)',
    school: '通胜/神煞',
    definition: 'Lưu niên chi trúng 丧门 hoặc 吊客 vị trí (tra bảng TANG_DATA.TANG_MEN / DIAO_KE bên trên — KHÔNG redefine tại đây).',
    triggerCondition: '丧门/吊客 trúng CUNG lục thân (vd trúng trụ tháng = cha mẹ) HOẶC trúng chi của trụ chứa lục thân tinh → tăng tín hiệu tang người tương ứng.',
    certainty: 'low', // thần sát là lớp tín hiệu nhẹ, không chính
    caveat: 'Thần sát chỉ là TẦNG tin phụ («1 lớp tín hiệu thần sát»). Phải phối V2/V3 & đại vận. KHÔNG kết luận tang chỉ dựa 丧门/吊客.',
    source: ['https://baike.baidu.com/item/丧门、吊客/22937868', 'https://zhuanlan.zhihu.com/p/1924151697254618774', 'src/engine/liunian-12shen.js'],
  },
  {
    key: 'san_xing',
    zhName: '三刑 (Tam Hình)',
    school: '子平',
    definition: '3 bộ tam hình chính: 寅巳申 (Dần-Tỵ-Thân), 丑戌未 (Sửu-Tuất-Mùi). Vài thêm 子卯 (Tý-Mão) tự hình, 辰辰/午午/酉酉/亥亥 (tự hình).',
    triggerCondition: 'Đại vận/lưu niên đưa chi hoàn thiện bộ tam hình, MÀ hình vào cung/tinh lục thân → ứng tang người tương ứng. Vd 寅巳申 trúng tháng → hại cha mẹ.',
    certainty: 'medium',
    threeXingSets: ['寅巳申', '丑戌未', '子卯', '辰辰', '午午', '酉酉', '亥亥'],
    caveat: 'Tam hình chủ «hình thương, quan phi, tai nạn», không nhất thiết tang. Phải thêm tổn thương tinh lục thân.',
    source: ['https://zhuanlan.zhihu.com/p/655713688', 'https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb'],
  },
  {
    key: 'yang_ren',
    zhName: '羊刃 (Dương Nhận) xung đại vận/lưu niên',
    school: '子平',
    definition: '羊刃 = Đế Vượng vị của nhật can (vd 甲→卯, 丙→午, 庚→酉 — bảng đầy đủ trong src/engine/shensha.js:YANG_REN). Khi đại vận/lưu niên chi XUNG trúng 羊刃 vị («羊刃冲») → hung.',
    triggerCondition: '羊刃 bị xung kèm 配 hợp «孤辰寡宿» (cô quależ tinh) HOẶC trúng cung lục thân → ứng tang/hại lớn (huyết quang, đao thương, tang).',
    certainty: 'medium',
    yangRenRef: 'src/engine/shensha.js:YANG_REN (đã vetted) —甲→卯, 乙→辰, 丙/戊→午, 丁/己→未, 庚→酉, 辛→戌, 壬→子, 癸→丑.',
    guChenGuaSuRef: '«孤辰寡宿» = thần sát chủ cô quả — phối với 羊刃 xung → tăng lực tang phối ngẫu.',
    caveat: '羊刃冲 chưa đủ — phải phối tổn thương tinh/cung. «不死自己死他人» cổ khẩu phần lớn nói THỰC CHẤT về trường hợp này (羊刃)+岁运并临, không phải 岁运并临 nói không.',
    source: ['https://www.suanzhun.net/book/2918.html', 'https://zhuanlan.zhihu.com/p/694135175', 'src/engine/shensha.js:YANG_REN'],
  },
  {
    key: 'gui_yuan_ru_mu',
    zhName: '归垣/入墓 (Quy Viên / Nhập Mộ)',
    school: '子平',
    definition: 'Tinh lục thân gặp MỘ địa (辰戌丑未 = «四墓» = 4 chi mộ) trong đại vận/lưu niên. «归垣» = tinh trở về vị ngũ hành gốc; «入墓» = tinh bị nhốt vào mộ địa.',
    triggerCondition: 'Tinh lục thân (V2) gặp chi 辰戌丑未 trong đại vận/lưu niên, MÀ kèm 克/冲/刑 → ứng tang người tương ứng («入墓» = ẩn tàng/đóng lại = điềm mất).',
    certainty: 'medium',
    fourMu: ['辰 (Thìn)', '戌 (Tuất)', '丑 (Sửu)', '未 (Mùi)'],
    caveat: '«入墓» một mình không đủ — mộ còn chủ «tàng» (chỉ tạm ẩn). Phải phối 克/冲 hoặc 空亡 mới rõ tang.',
    source: ['https://zhuanlan.zhihu.com/p/2045194460108153762', 'https://ctext.org/wiki.pl?if=en&chapter=868825&remap=gb'],
  },
];

export const TIMING_RULES = {
  groupA: TIMING_GROUP_A,
  groupB: TIMING_GROUP_B,
  all: [...TIMING_GROUP_A, ...TIMING_GROUP_B],
  _meta: {
    vi: '7 cơ chế timing tang. Certainty = «low/medium/high», KHÔNG có «certain». 岁运并临 bắt buộc caveat tranh cãi.',
    classicalRefs: ['《三命通会》', '《渊海子平》', '《协纪辨方书》', '《滴天髓》'],
    crossCheckedWithCodebase: 'src/engine/suiyun.js, liunian-12shen.js, shensha.js (YANG_REN)',
    ethics: 'KHÔNG dùng «不死自己死他人» để dọa user. Mức độ luôn kèm caveat + opt-in.',
  },
};

// ============================================================================
//  ETHICS / OPT-IN META — để app import & hiển thị cảnh báo
// ============================================================================
export const TANG_ETHICS = {
  optInRequired: true,
  disclaimerVi:
    'Luận tang (ai mất / năm nào) chỉ là TÀI LIỆU THAM KHẢO CỔ PHÁP, dựa trên XÁC SUẤT & TƯỢNG — KHÔNG chắc chắn, KHÔNG thay thế y tế/chuyên gia. Khẩu quyết cổ «不死自己死他人» bị hiện đại phản bác; app không dùng để dọa nạt. Tính năng chỉ dùng khi user tự bật (opt-in) & xác nhận.',
  disclaimerEn:
    'Bereavement (Tang Gia) readings are CLASSICAL-REFERENCE ONLY, probabilistic, NOT medical/professional advice. Classical aphorisms are contested; never used to frighten users. Opt-in only.',
  presentationRules: [
    'Luôn kèm caveat mềm hoá («đây chỉ là tín hiệu cổ pháp, xác suất, không chắc»).',
    'KHÔNG dùng từ «chắc chắn chết», «bất tử» (不死), «chết người».',
    'Hướng user đến cẩn trọng, tích đức, khám sức khoẻ định kỳ cho người lớn tuổi.',
    'Cho phép user TẮT tính năng (opt-out) bất cứ lúc nào.',
    '岁运并临 phải kèm caveat tranh cãi (xem TIMING_RULES.groupA[0]).',
  ],
  forbiddenAbsoluteClaims: [
    '«岁运并临，不死自己死他人» (dạng tuyệt đối hoá)',
    '«丧门吊客 trúng → chắc chắn tang»',
    'Bất kỳ phát ngôn kết luận chắc chắn chết/ai chết/năm nào.',
  ],
};

// ============================================================================
//  DEFAULT AGGREGATE EXPORT — tiện import 1 dòng
// ============================================================================
export default {
  TANG_DATA,
  RULES_LUC_THAN,
  PALACE_RULES,
  TIMING_RULES,
  TANG_ETHICS,
};
