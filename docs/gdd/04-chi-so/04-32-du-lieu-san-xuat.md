# 04-32 · Dữ liệu sản xuất — cấu hình lớp game dạng máy đọc

Bản sơ đồ tổng §4.6 hẹn «bảng đầy đủ trong `docs/game-data/shensha-perks.json` (giai đoạn sản xuất)». Tài liệu này **không** tạo tệp ngoài thư mục 04; khối dưới là nội dung chuẩn để 13 tách ra `src/game/data/menhban-config.json` (hoặc nơi 13 chọn). Mọi số khớp các phần 04-02 … 04-08; nếu lệch, **văn bản các phần trước là chuẩn** và khối này phải sửa theo.

## 1. Hằng số chung

```json
{
  "version": 1,
  "nguHanh": ["木", "火", "土", "金", "水"],
  "heSoNguHanhLuc": { "dung": 1.3, "ky": 0.8, "khac": 1.0 },
  "tangNguong": [5, 12, 20, 30, 45],
  "phamCan": [
    { "code": "PC10", "min": 86, "ten": "Thiên Linh Căn" },
    { "code": "PC9",  "min": 80, "ten": "Dị Linh Căn" },
    { "code": "PC8",  "min": 73, "ten": "Song Linh Căn thượng" },
    { "code": "PC7",  "min": 66, "ten": "Song Linh Căn" },
    { "code": "PC6",  "min": 58, "ten": "Tam Linh Căn thượng" },
    { "code": "PC5",  "min": 50, "ten": "Tam Linh Căn" },
    { "code": "PC4",  "min": 43, "ten": "Tứ Linh Căn thuận" },
    { "code": "PC3",  "min": 36, "ten": "Tứ Linh Căn" },
    { "code": "PC2",  "min": 28, "ten": "Ngũ Linh Căn" },
    { "code": "PC1",  "min": 0,  "ten": "Phàm Căn" }
  ],
  "phucPhan": {
    "đại phú quý":  { "goc": 12, "tang": 0 },
    "phú quý":      { "goc": 9,  "tang": 0.5 },
    "tiểu phú quý": { "goc": 6,  "tang": 1 },
    "khá no":       { "goc": 3,  "tang": 1.5 },
    "bình":         { "goc": 0,  "tang": 2.5 },
    "tiềm năng ẩn": { "goc": 0,  "tang": 3 }
  },
  "thanLuc": {
    "Thân quá vượng":  { "ten": "Độc Hành",  "tuLuc": 0.20, "nhanTro": 1.0,  "tietTu": 0.20 },
    "Thân vượng":      { "ten": "Tự Lập",    "tuLuc": 0.10, "nhanTro": 1.0 },
    "Thân trung hòa":  { "ten": "Trung Dung","tuLuc": 0.05, "nhanTro": 1.25, "thien": 0.05 },
    "Thân nhược":      { "ten": "Cầu Trợ",   "tuLuc": 0,    "nhanTro": 1.5,  "quyNhanThemTuan": 1 },
    "Thân quá nhược":  { "ten": "Thuận Thế", "tuLuc": 0,    "nhanTro": 1.5,  "buffThoiGian": 1.5 }
  },
  "nguyenKhi": { "san": 100, "heSoNen": 0.5, "hoiGio": 8, "trangThai": { "thinh": 65, "duong": 45 }, "duongKhiToiDa": 30 },
  "nguDuy": { "tmChia": 500, "boKhuyet": 0.25, "xpMotNgo": 60, "giaTang": [1, 2, 3, 4, 5],
              "dieuKienTang": [ { "daTieu": 0, "canhGioi": 1 }, { "daTieu": 3, "canhGioi": 2 },
                                { "daTieu": 9, "canhGioi": 3 }, { "daTieu": 18, "canhGioi": 4 },
                                { "daTieu": 26, "canhGioi": 5, "truyenThua": true } ] },
  "boHanh": { "tran": 20, "tuan": 3, "boDung": 5, "boHy": 3 },
  "ro": { "r1Tran": 0.40, "r2Tran": 0.15, "r3Ky": 1.3, "r3Cuu": 1.15, "r3ThuThachTran": 0.30 },
  "tranNgay": [ { "den": 60, "he": 1.0 }, { "den": 120, "he": 0.5 }, { "den": null, "he": 0.1 } ],
  "nghichThien": { "moc": 60, "chia": 100, "min": 1.0, "max": 1.5 },
  "canhGioi": { "nguong": [0, 100, 400, 1000, 2200, 4500], "heSoCanCo": 0.4, "canCoDenBac": 3, "bac6CanQuyNhat": true },
  "tamMa": { "tangMoi": 25, "congTuMoiTang": 20, "giamQuaTang": 5, "giamMoiViec": 2, "tamDocTieu": 10 }
}
```

## 2. Thời Vận

```json
{
  "daiVan": {
    "Đại cát":    { "mat": "Đỉnh vận",            "r2": 0.06, "r3": 0 },
    "Cát":        { "mat": "Thuận",               "r2": 0.04, "r3": 0 },
    "Hơi thuận":  { "mat": "Hơi thuận",           "r2": 0.02, "r3": 0 },
    "Bình hòa":   { "mat": "Bình",                "r2": 0,    "r3": 0 },
    "Hơi nghịch": { "mat": "Gợn",                 "r2": 0,    "r3": 0.05 },
    "Hung":       { "mat": "Vận thử thách",       "r2": 0,    "r3": 0.10 },
    "Đại hung":   { "mat": "Vận đại thử thách",   "r2": 0,    "r3": 0.15 }
  },
  "luuNien": {
    "Đại cát": { "mat": "Năm đỉnh",       "r2": 0.04, "r3": 0 },
    "Cát":     { "mat": "Thuận",          "r2": 0.02, "r3": 0 },
    "Bình":    { "mat": "Bình",           "r2": 0,    "r3": 0 },
    "Hơi kỵ":  { "mat": "Gợn",            "r2": 0,    "r3": 0.05 },
    "Hung":    { "mat": "Năm thử thách",  "r2": 0,    "r3": 0.10 },
    "Đại hung":{ "mat": "Năm Hạn",        "r2": 0,    "r3": 0.15 }
  },
  "thienThoi": { "vung": { "dung": 0.05, "hy": 0.02 }, "gio": { "dung": 0.03, "hy": 0.01 }, "mua": { "dung": 0.02, "hy": 0.01 } }
}
```

## 3. Hành của vùng

```json
{
  "thanh": "土", "vancoc": "水", "thulau": "水", "vodang": "水", "conlon": "*",
  "manh": "土", "chungnam": "土", "longho": "木", "lichduong": "木", "cungthong": "木",
  "maoshan": "木", "buttap": "火", "vanmieu": "火", "yentu": "火", "trichthien": "土",
  "mieucuong": "土", "phongthuy": "金", "phongdo": "金", "tubinh": "金", "tangdia": "金"
}
```

(`"*"` = hợp mọi Dụng.)

## 4. Đặc Tính

Trường: `tone` (engine), `nhom` (game: cat / trung / song / kiep), `r1` (theo loại việc, bậc I / II), `luot` (tác dụng không phải %), `moSom` (nút), `moc`, `chiTheoChi` (false = luôn bậc I).

```json
[
  { "key": "tianYi",    "ten": "Quý Nhân Phù",       "tone": "cat",      "nhom": "cat",   "luot": { "quyNhanNgay": [1, 1], "quyNhanLonTuan": [0, 1], "goiYNgay": [1, 2] }, "moSom": ["AN-09"], "moc": ["Q1"] },
  { "key": "wenChang",  "ten": "Văn Xương Chiếu",    "tone": "cat",      "nhom": "cat",   "r1": { "khoacu": [0.20, 0.25], "doc": [0.10, 0.15] }, "moSom": ["AN-04", "THUC-06"], "moc": ["Q1"] },
  { "key": "luShen",    "ten": "Lộc Thần Hộ",        "tone": "cat",      "nhom": "cat",   "r1": { "viecNgay": [0.08, 0.12] }, "luot": { "locTuan": [1, 2] }, "moSom": ["TAI-06"], "moc": ["Q1"] },
  { "key": "yangRen",   "ten": "Dương Nhận",         "tone": "volatile", "nhom": "song",  "luot": { "thuAiTri": [1, 1], "tangAiSan": [1, 1] }, "phaiSinh": "kienNhan", "moc": ["aiSan6"] },
  { "key": "xueTang",   "ten": "Học Đường Tâm",      "tone": "cat",      "nhom": "cat",   "r1": { "hoc": [0.08, 0.12] }, "moSom": ["AN-05"], "moc": ["Q1"] },
  { "key": "taoHua",    "ten": "Đào Hoa Duyên",      "tone": "neutral",  "nhom": "trung", "luot": { "thienCam": [2, 3] }, "moSom": ["TY-02"], "moc": ["Q1"] },
  { "key": "yiMa",      "ten": "Dịch Mã",            "tone": "neutral",  "nhom": "trung", "luot": { "diBo": [0.20, 0.25], "giamTram": [0.20, 0.25] }, "r1": { "duPhuong": [0.10, 0.15] }, "moc": ["Q1", "Q2"] },
  { "key": "jiangXing", "ten": "Tướng Tinh",         "tone": "cat",      "nhom": "cat",   "r1": { "truongDoi": [0.05, 0.08] }, "moSom": ["QUAN-04", "TY-08"], "moc": ["Q1"] },
  { "key": "huaGai",    "ten": "Hoa Cái Nhập Mệnh",  "tone": "neutral",  "nhom": "trung", "r1": { "daoThong": [0.15, 0.20] }, "luot": { "coPhong": [3, 3] }, "moSom": ["AN-11"], "moc": ["Q1"] },
  { "key": "tianYiMed", "ten": "Thiên Y Thủ",        "tone": "cat",      "nhom": "cat",   "r1": { "yDuoc": [0.15, 0.20] }, "moSom": ["THUC-05"], "moc": ["Q1"] },
  { "key": "tianDe",    "ten": "Thiên Đức",          "tone": "cat",      "nhom": "cat",   "luot": { "giamNghiepLo": [0.25, 0.35], "botChangKiep": [1, 1] }, "moSom": ["TY-06"], "moc": ["Q1"] },
  { "key": "yueDe",     "ten": "Nguyệt Đức",         "tone": "cat",      "nhom": "cat",   "luot": { "giamNghiepLo": [0.20, 0.30], "botChangKiep": [1, 1] }, "moc": ["Q1"] },
  { "key": "yueDeHe",   "ten": "Nguyệt Đức Hợp",     "tone": "cat",      "nhom": "cat",   "luot": { "giamNghiepLo": [0.10, 0.15], "samHoi": [0.10, 0.15], "botChangKiep": [1, 1] }, "moc": ["Q1"] },
  { "key": "tianDeHe",  "ten": "Thiên Đức Hợp",      "tone": "cat",      "nhom": "cat",   "luot": { "samHoiDauTuan": [1.2, 1.3], "botChangKiep": [1, 1] }, "moc": ["Q1"] },
  { "key": "dexiu",     "ten": "Đức Tú",             "tone": "cat",      "nhom": "cat",   "chiTheoChi": false, "r1": { "chu": [0.15, 0.15] }, "luot": { "giamTamMa": [0.10, 0.10] }, "moc": ["Q1"] },
  { "key": "ciGuan",    "ten": "Từ Quán",            "tone": "cat",      "nhom": "cat",   "r1": { "hoc": [0.05, 0.05] }, "luot": { "deTuChon": [1, 1] }, "moSom": ["AN-07"], "moc": ["Q1"] },
  { "key": "jinYu",     "ten": "Kim Dư",             "tone": "cat",      "nhom": "cat",   "r1": { "buon": [0.05, 0.08] }, "luot": { "tramMienPhiNgay": [1, 2] }, "moSom": ["TAI-04"], "moc": ["Q1"] },
  { "key": "hongYan",   "ten": "Hồng Diễm",          "tone": "neutral",  "nhom": "trung", "r1": { "hoa": [0.10, 0.15] }, "luot": { "thienCamNgheNhan": [2, 2] }, "moSom": ["THUC-09"], "moc": ["Q1"] },
  { "key": "kuiGang",   "ten": "Khôi Cương",         "tone": "volatile", "nhom": "song",  "chiTheoChi": false, "moSom": ["QUAN-06"], "moc": ["cuongNhu"] },
  { "key": "taiJi",     "ten": "Thái Cực",           "tone": "cat",      "nhom": "cat",   "r1": { "tonGiao": [0.08, 0.12] }, "moSom": ["AN-08", "THUC-04"], "moc": ["Q1"] },
  { "key": "tianChu",   "ten": "Thiên Trù",          "tone": "cat",      "nhom": "cat",   "luot": { "hoiNK": [0.20, 0.30] }, "moSom": ["TAI-08"], "moc": ["Q1"] },
  { "key": "liuXia",    "ten": "Lưu Hà",             "tone": "hung",     "nhom": "kiep",  "kiep": { "ten": "Ráng Chiều", "chang": 3 } },
  { "key": "xueRen",    "ten": "Huyết Nhận",         "tone": "hung",     "nhom": "kiep",  "kiep": { "ten": "Thân Chắn",  "chang": 3 } },
  { "key": "zaiSha",    "ten": "Tai Sát",            "tone": "hung",     "nhom": "kiep",  "kiep": { "ten": "Bạch Hổ",    "chang": 3 } },
  { "key": "shiLing",   "ten": "Thập Linh",          "tone": "cat",      "nhom": "cat",   "chiTheoChi": false, "luot": { "linhCamNgay": [1, 1], "queThem": [1, 1] }, "moc": ["Q1"] },
  { "key": "tianShe",   "ten": "Thiên Xá",           "tone": "cat",      "nhom": "cat",   "chiTheoChi": false, "luot": { "daiXaMua": [1, 1] }, "moc": ["Q1"] },
  { "key": "siFei",     "ten": "Hồi Sinh",           "tone": "hung",     "nhom": "kiep",  "chiTheoChi": false, "kiep": { "ten": "Hồi Sinh", "mua": 4, "muaKhiDungTang3": 3 } },
  { "key": "jinShen",   "ten": "Kim Thần",           "tone": "volatile", "nhom": "song",  "chiTheoChi": false, "r1": { "renDan": [0.15, 0.15] }, "dieuKien": { "tangHoa": 3 }, "moc": ["loLuyen"] },
  { "key": "sanQi",     "ten": "Tam Kỳ",             "tone": "cat",      "nhom": "cat",   "chiTheoChi": false, "xpMoiCay": [0.05, 0.10], "moc": ["Q1"] },
  { "key": "guoYin",    "ten": "Quốc Ấn",            "tone": "cat",      "nhom": "cat",   "nguon": "noble-stars", "luot": { "giamNha": [0.20, 0.30] }, "moSom": ["QUAN-08"], "moc": ["Q1"] }
]
```

Ghi chú: `sanQi.xpMoiCay` [0,05; 0,10] là [không có / có thêm Thiên Ất – Thiên Đức – Nguyệt Đức], không phải bậc I/II (04-06 §3.2). Mọi `r1` cộng vào rổ R1 trần 0,40.

## 5. Vị thuốc

```json
{
  "ti":   { "ten": "Đồng Tâm Thảo",   "vung": ["yentu"],             "viec": "dongTu3",          "truc": "ti" },
  "yin":  { "ten": "Văn Xương Chi",   "vung": ["thulau", "vanmieu"], "viec": "docSach3ChepBai1", "truc": "yin" },
  "shi":  { "ten": "Tú Linh Quả",     "vung": ["vodang"],            "viec": "lo1CauDoi1",       "truc": "shi" },
  "cai":  { "ten": "Kim Tiền Thảo",   "vung": ["thanh", "lichduong"],"viec": "buon1BoThiNua",    "truc": "cai" },
  "guan": { "ten": "Thiết Bì Lan",    "vung": ["chungnam", "longho"],"viec": "gioi7XuTranhChap1","truc": "guan" }
}
```

## 6. Tên bệnh theo `via`

```json
{
  "noroot": "Phù Căn", "kong": "Treo Cung", "he": "Hợp Khứ", "ke": "Khắc Phá", "mix": "Hỗn Tạp",
  "chong": "Lay Gốc", "dang": "Đảng Thế", "duo": "Đoạt Thực", "noyong": "Vô Dụng Xứ", "xoroot": "Tranh Đoạt",
  "support-root": "Nghịch Thế", "guan": "Phạm Vượng", "clash-hua": "Phá Hóa",
  "*-tougan": "Nghịch Thế · lộ", "*-tang": "Nghịch Thế · ẩn", "latent-*": "Thế Ẩn Họa",
  "_khac": "Bệnh Cách"
}
```

## 7. Kiểm thử cấu hình

| Mã | Kiểm |
|---|---|
| CF-1 | `phamCan` sắp giảm dần theo `min`, khớp ngưỡng engine `synthesis.js` |
| CF-2 | `heSoNguHanhLuc`, `ro.r3Ky`, `nghichThien`, `canhGioi.nguong` bằng đúng canon (khóa — đổi là lỗi build) |
| CF-3 | 30 khóa Đặc Tính = 29 khóa `SHENSHA_INFO` + `guoYin` |
| CF-4 | Mỗi `moSom` trỏ tới nút có trong 04-04 |
| CF-5 | Mỗi vùng canon §3 có hành ở §3 |
