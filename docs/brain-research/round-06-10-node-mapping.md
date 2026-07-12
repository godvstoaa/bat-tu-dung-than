# ROUND 6-10/50: Node Mapping — Thập Thần + Ngũ Hành + Interactions

## 1. THẬP THẦN NODES (10 + variants = 15 nodes)

### 正官 (zheng_guan)
- type: shishen | wx: varies | category: authority
- governs: [sự_nghiệp, chức_vụ, danh_vọng, chồng(nữ), kỷ_luật, pháp_luật]
- conditions: { clarity: "minh/rõ ràng", strength: "vượng → quyền lớn, nhược → quyền ảo" }
- conflicts_with: [伤官(khắc quan → sự nghiệp đứt)]
- supported_by: [正印(ấn sinh quan → quyền+học), 财(tài sinh quan → tài hỗ trợ sự nghiệp)]
- rule_fires: { with_伤官: "伤官见官 → sự nghiệp đứt đoạn", with_正印: "官印相生 → quyền lực + danh vọng" }
- position_meaning: { year: "gia đình có quyền", month: "sự nghiệp chính", day: "bản thân/bạn đời", time: "con cái/晚 niên" }

### 七杀 (qi_sha)
- type: shishen | category: power/violence
- governs: [quyền_lực_cực, quân_sự, cảnh_sát, phó_chủ_tịch, chồng(nữ)-bạo]
- conflicts_with: [正官(hỗn tạp)]
- controlled_by: [食神(thực chế sát → kỹ năng chế ngự), 正印(ấn hóa sát → quyền + học)]
- rule_fires: { with_食神: "食制杀 → kỹ năng chế ngự uy quyền", with_正印: "杀印相生 → quyền lực tối cao + học vấn", with_正官: "官煞混雑 → hôn nhân bất ổn, quyền lực loạn" }

### 正印 (zheng_yin)
- governs: [học_vấn, bằng_cấp, mẹ, bảo_vệ, tài_trợ, trí_tuệ, giấy_tờ, nhà_cửa]
- generates: [正官(ấn sinh quan), myself(ấn sinh thân)]
- conflicts_with: [正财(tài phá ấn → học gián đoạn)]
- rule_fires: { with_伤官: "伤官配印 → học vấn cao", with_七杀: "杀印相生 → quyền+học", with_正财: "财破印 → học gián đoạn" }

### 偏印/枭神 (pian_yin)
- governs: [học_vấn_phi_chính, thuật_số, tôn_giáo, trực_giác, cô_đơn]
- conflicts_with: [食神(枭夺食 → tài năng bị èm)]
- rule_fires: { with_食神: "枭夺食 → tài năng bị èm, cần giải" }

### 食神 (shi_shen)
- governs: [thực_phẩm, sức_khỏe, con_trai, sinh_hoạt, nghệ_thuật, hưởng_thụ]
- generates: [正财(thực sinh tài → phát tài), controls: 七杀(thực chế sát)]
- rule_fires: { with_七杀: "食制杀", with_偏印: "枭夺食 → BỊ PHÁ" }

### 伤官 (shang_guan)
- governs: [sáng_tạo, khẩu_tài, nghệ_thuật, phản_kháng, con_gái, kỹ_thuật, miệng]
- conflicts_with: [正官(thương quan khắc quan)]
- controlled_by: [正印(ấn chế thương → trí tuệ công nhận)]
- rule_fires: { with_正官: "伤官见官 → SỰ NGHIỆP đứt", with_正印: "伤官配印 → học vấn CAO (rule phủ định rule trên!)" }

### 比肩 (bi_jian)
- governs: [anh_chị_em, bạn_bè, cạnh_tranh, độc_lập, ý_chí]
- conflicts_with: [正财(tỷ kiếp tranh tài)]

### 劫财 (jie_cai)
- governs: [cạnh_tranh_tài_sản, bạn_bè_xấu, hao_tài, tranh_giành]
- conflicts_with: [正财, 偏财]

### 正财 (zheng_cai)
- governs: [vợ(nam), tài_sản_chính, lương, tiết_kiệm]
- generates: [正官(tài sinh quan)]
- conflicts_with: [正印(tài phá ấn), 比肩/劫财(tỷ kiếp tranh tài)]

### 偏财 (pian_cai)
- governs: [tài_phi, người_yêu, đầu_tư, kinh_doanh, cha]
- conflicts_with: [比肩/劫财]

## 2. NGŨ HÀNH INTERACTION EDGES
```
木 →generates→ 火 →generates→ 土 →generates→ 金 →generates→ 水 →generates→ 木
木 →controls→ 土 →controls→ 水 →controls→ 火 →controls→ 金 →controls→ 木
```

## 3. ORGAN/HEALTH EDGES
```
木 → liver/gallbladder (can/dởm) → anger
火 → heart/small intestine (tim/tiểu trường) → joy
土 → spleen/stomach (tỳ/vị) → worry
金 → lungs/large intestine (phổi/đại tràng) → sadness
水 → kidneys/bladder (thận/bàng quang) → fear
```

## 4. KEY CONFLICT RULES (resolution priority)
1. 伤官配印 OVERRIDES 伤官见官 (Ấn chế → học vấn cao, không phá sự nghiệp)
2. 调候 OVERRIDES 扶抑 (sinh mùa hàn → dùng Hỏa, không luận vượng nhược)
3. 从格 OVERRIDES all (tòng cách → Dụng theo thế cục, không Phù Ức)
4. 病药 OVERRIDES simple (có bệnh → cần dược → "có bệnh mới quý")

## Next: Round 11-15 — Cách cục nodes + 格局 rules
