# 七政四余天星择日 — Spec triển khai (nghiên cứu cycle 37)

> Mô-đun tiếp theo cần tạo: `src/engine/tianxing-zheri.js`.
> PREREQUISITE đã hoàn thành cycle 37: `qizheng.js` đã SỬA frame (geocentric + sidereal ayanamsa +
> 角@174°). Trước cycle 37, qizheng dùng tropical không trừ ayanamsa + heliocentric cho 5 tinh →
> SAI toàn bộ. Nay đã đúng → có thể xây 天星择日 trên nền đúng.

## Mục đích
"Tôi muốn khởi công/dọn nhà/an táng hướng X — ngày nào sao sáng chiếu đúng hướng?" — chọn ngày
dựa trên vị trí THẬT của 7 chính tinh (đặc biệt Nhật/ Nguyệt) tới 坐向 (sơn/hướng nhà mồ).

## Thuật toán (tối thiểu ĐÚNG — chỉ hiện cái cổ thư đồng thuận)

### Inputs
- `sitting` ∈ 24 sơn (vd 子), `facing` = đối xung (vd 午)
- `mountainSystem`: `'huaji'` (化气, mặc định) | `'zhengti'` (正体)
- date range

### Mỗi ngày — scoreDay(date):
1. Lấy 7 kinh độ sidereal từ `getLuminaries(date)` (đã sửa cycle 37).
2. `M = mountainElement(sitting, mountainSystem)` — xem bảng dưới.
3. Với mỗi body (日/月/水/金/火/木/土):
   - `mIdx = mountainIndexOf(sidereal_lon)` — ánh xạ 24 sơn (mỗi sơn 15°, neo冬至→子).
   - `onSitting` / `onFacing` / `trineSitting` (120°三合).
   - **Tier 1 (nhật/nguyệt — cổ thư rõ ràng):**
     - 太阳到向: +5 (首选, "đến hướng chiếu tôi")
     - 太阳到山: +3 (cổ: chỉ vương hầu, dân gian "khó đương")
     - 太阴到山: +4 (mặt trời đến sơn — chuẩn nhất cho Nguyệt)
     - 太阴到向: +2
     - 金水辅日月 (Kim/Thủy kẹp Nhật/Nguyệt): +2
   - **Tier 2 (恩用仇难 — chỉ sơn 5 hành, bỏ sơn 日/月 đặc biệt):**
     - role = fiveCycleRole(planetElement, M)
     - 恩(生我): +3 | 主(đồng): +2 | 用(tôi sinh): +2 | 财/仇(tôi khắc): 0 (bảo thủ) | 难(克我): −3
     - × magnitude (到向/到山 1.0, 三合 0.5)
   - **Tier 3:** 归垣 (tinh về cung nhà) +1
4. **Tier 4 (调候 mùa):** đông → +1 nếu Hỏa tới hướng; hạ → +1 nếu Thủy/Kim tới.
5. **Tier 5 (cấm cứng):** near-eclipse (罗计掩日月) → score = −100; 燃烧 (tinh quá gần Nhật <8°) −2.

### mountainIndexOf (sidereal longitude → 24 sơn)
24 sơn theo la bàn thuận từ 子:
`[子,癸,丑,艮,寅,甲,卯,乙,辰,巽,巳,丙,午,丁,未,坤,申,庚,酉,辛,戌,乾,亥,壬]`
Neo: 冬至 (Nhật tropical 270°) → trung tâm 子 (index 0).
`mountainIndex = round(((sidereal_lon − anchor) mod 360) / 15)` mod 24.
(Lưu ý: cần dùng sidereal_lon của NHẬT để xác định "Nhật đến sơn nào", neo theo thực tế.)

### Bảng planet → element (đồng thuận cao)
日=火 | 月=水 (DEBATED — có phái dùng 金, cho toggle) | 水=水 | 金=金 | 火=火 | 木=木 | 土=土
四余: 紫气=木余 | 罗睺=火余 | 计都=土余 | 月孛=水余

### Bảng mountain → 化气五行 (天盘化气, phái 易先生/赖布衣)
| Sơn (4/số) | 化气 |
|---|---|
| 壬 子 癸 丑 | 土 |
| 艮 寅 乾 亥 | 木 |
| 甲 卯 辛 戌 | 火 |
| 乙 辰 庚 酉 | 金 |
| 巽 巳 坤 申 | 水 |
| 丙 午 | 太阳 (đặc biệt, chuộng Kim/Thủy phụ) |
| 丁 未 | 太阴 (đặc biệt) |

⚠️ **Phái khác dùng 正体五行** (壬子癸=水...). PHẢI cho toggle; ép 1 phái = sai.
⚠️ **Đây là 1 phái (地支六合化气)**; phái 正体 khác. Document rõ + toggle.

### Bảng 正体五行 (toggle thay thế)
壬子癸=水 | 丑=土 | 艮寅=木 | 甲卯乙=木 | 辰=土 | 巽巳=木 | 丙午丁=火 | 未=土 | 坤申=土/金 | 庚酉辛=金 | 戌=土 | 乾亥=金/水

## Tránh (KHÔNG hiện v1 — cờ "debated")
- **天星化曜** (天贵/天嗣/天官/天禄): bảng trường-phái cụ thể, không có source verified = bịa.
- **动盘命宫** (Ascendant-based): paradigm khác (弧角), cần trig mặt cầu — khác 山家用星.
- **禄马贵元星** (năm-can → tinh nào là 禄/马/贵): CỔ + có bảng đầy đủ (易先生 §13-14) → tốt cho v2.

## Pitfalls (đã tránh cycle 37)
1. ✅ Frame sidereal (đã sửa qizheng — ayanamsa 24.2°).
2. ✅ Geocentric (đã sửa — không còn heliocentric).
3. ⚠️ 太阳到山 ≠ 到向 (cổ: 到向 trên, 到山 dưới; dân gian tránh 到山).
4. ⚠️ 调候 mùa (đông chuộng Hỏa, hạ chuộng Thủy).
5. ⚠️ Eclipse window = cấm cứng.
6. ⚠️ 逆/伏/留 (retrograde): astronomy-engine cho phát hiện; 逆 tới hướng = hung (đặc biệt Hỏa).

## Nguồn
1. 易先生/赖布衣研究院 — 七政四余择日法速递 (https://www.yixiansheng.com/article/4479.html) — 恩用仇难 + 化气表 + 禄马贵元.
2. 搜狐/岳鼎竣 — 七政四余天星择日(三) (https://www.sohu.com/a/113535154_488508) — 调候 + 静盘vs动盘 warning.
3. 豆瓣 — 中國七政四餘天星擇日基礎 (https://m.douban.com/group/topic/103867967/) — 中国传统派 vs 弧角派.
4. 福山堂 — 七政四余天星课 (http://www.fushantang.com/1013/m1016.html).
5. 维基文库 — 钦定协纪辨方书卷34.

## Plan triển khai (cycle 38)
1. Tạo `src/engine/tianxing-zheri.js` export `tianxingZheri(sitting, fromY, fromM, fromD, days=60, opts)`.
2. Reuse `getLuminaries` + `ayanamsa` từ qizheng.js (đã đúng).
3. scoring per Q5.2, conservative ở chỗ disputed.
4. Card UI (renderTianxing) — top-5 ngày + worst, cho 1 坐向.
5. Wire vào AI brief (section 天星择日) + rule-13 ("ngày nào khởi công/dọn nhà tốt nhất theo sao").
6. Selftest: verify 太阳到向 cho 1 坐向 + 1 ngày; eclipse guard.
