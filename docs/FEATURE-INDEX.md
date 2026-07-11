# FEATURE INDEX — Bát Tự App bí truyền cấm kị (v3.1.0)

## Tổng quan
- **kb.js**: 151 exports / ~2650 dòng — knowledge base
- **Engines**: 5 module computed (gufa/huangji/taiyi/chenggu/wuyun-liuqi)
- **AI tools**: 28 (27 analysis + 1 log_error)
- **Brief**: ~77k chars, 32+ sections, pre-computed (thập thần đếm + tổ hợp kinh điển)
- **SYSTEM_PROMPT**: 18 sections (includes cấm kị tool direction + analytical rigor + error logging)

## 21+ HỆ BÍ TRUYỀN CẤM KỴ

### A. ENGINES (computed — gọi tool để tính)
| Tool | Hệ | Output |
|------|-----|--------|
| `analyze_gufa` | 古法 nạp âm (兰台 42 patterns + thần đầu lộc 60/60 + 九命 + 五行方向 + 太过不及) | cách cục nạp âm detected + verdict |
| `analyze_huangji` | 皇极经世 (值年卦 tiên tri, 60-năm cycle) | quẻ năm + ý nghĩa |
| `analyze_taiyi` | 太乙神数 (国运, tam thức) | thái ất cung + chủ/khách |
| `analyze_chenggu` | 称骨算命 (袁天罡) | trọng lượng tứ trụ → bài thơ số phận |
| `analyze_wuyun` | 五运六气 (Y-thiên văn) | vận + khí → tạng bệnh + khí hậu |

### B. KNOWLEDGE EXPORTS (trong kb.js — AI đọc từ brief)
| Export | Hệ | Round |
|--------|-----|-------|
| PATTERN_CHENG_BAI | 子平真诠 thành/bại/cứu ứng | 22 |
| XIANGSHEN_LAW + PATTERN_QUALITY_DEEP | 相神 + cách cục chất lượng | 22 |
| JIXIONG_FANLI | 倒 luận 吉凶 thần + thuần tạp | 22 |
| ZAQI_TIANGAN_USE | 杂气 取 dụng | 22 |
| YUEYAN_QUGE/YONGSHEN/GUANSHA/META | 命理约言 chuẩn hóa + school toggle | 23 |
| BAZI_SCHOOL | chế độ trường phái (4 schools) | 23 |
| SANMING_LIUQIN_FU/SHENSHA_FULL/etc | 三命通会 sâu | 24 |
| MINGLI_HISTORY_LINEAGE/CRITICAL_EVALUATION | 洪丕谟 meta | 25 |
| MANGPAI_ZUOGONG/SANFA/GONGWEI_XIANG/etc | 盲派 framework + advanced | 26,29 |
| MANGPAI_KOUJUE | 盲派 金口诀 40 verses (vị trí × thần) | 39 |
| GUFA_MODEL/LUOLUZI_VERSES/JIUMING_SYSTEM | 古法珞琭子 + 李虚中 | 27 |
| SHENTOU_LU_NAYIN (60/60) | thần đầu lộc nạp âm đầy đủ | 27+ |
| GUFA_NOBLE_BENJIA/NAYIN_WUYIN_THEORY | 天乙贵人 bản gia + ngũ âm | 28 |
| GEO_WUXING_PERSON/SHIYIYAO_CRITIQUE | 五方五民 + 十一曜 | 30 |
| TIEBAN_SHENSHU | 铁板神数 bí mật (reference) | 35 |
| TUIBEITU + MAQIANKE_SHAOBINGE | 推背图+马前课+烧饼歌 (bộ 3 cấm) | 38,41 |
| SANMING_ZHIMI_LOST_TEXTS | 三命指迷赋 thất truyền | 33 |
| HELU_LUOSHU | 河图洛书 foundational | 40 |
| PENGZU_BAIJI | 彭祖百忌 dân gian | 43 |
| YANGGONG_JIRI | 杨公忌日 13 ngày bách sự kỵ | 44 |
| ZANGJING | 葬经 phong thủy foundation | 45 |
| LANTAI_PATTERNS (42) | 兰台妙选 cách cục nạp âm | 31 |

### C. BRIEF PRE-COMPUTE (ngăn lỗi AI)
| Section | Tính gì | Ngăn lỗi nào |
|---------|---------|--------------|
| THẬP THẦN ĐẾM (kể tàng can) | mỗi sao X/4 trụ [lộ/tàng + can] | L1: bỏ sót tàng can |
| TỔ HỢP KINH ĐIỂN | auto-detect ✓伤官配印/✓杀印相生/⚠官煞混杂 | L3: bỏ sót tổ hợp |

### D. SYSTEM_PROMPT DIRECTIVES (chất lượng AI)
| Section | Directive |
|---------|-----------|
| 16 | GỌI TOOL cấm kị khi relevant + GIẢI THÍCH được tất cả hệ |
| 17A-E | PHÂN TÍCH KỸ: đếm tàng can / tất cả hành / tổ hợp / neo data / defend |
| 18 | LOG LỖI: gọi log_error khi sai + defend khi đúng |

### E. ERROR LOGGING
| Tool | Khi nào gọi | Output |
|------|------------|--------|
| `log_error` | AI nhận ra sai (user sửa) → kiểm tra → nếu thật sai | structured: wrong_claim/user_correction/root_cause/correct_analysis |

## Cách dùng
1. User hỏi về cổ pháp → AI gọi `analyze_gufa` → engine phát hiện 兰台 patterns + thần đầu lộc
2. User hỏi «năm X quẻ gì» → AI gọi `analyze_huangji` → 值年卦
3. User hỏi sức khỏe năm → AI gọi `analyze_wuyun` → 五运六气
4. User sửa AI → AI kiểm tra → nếu sai → gọi `log_error` → admin xem log
