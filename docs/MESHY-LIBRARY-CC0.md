# Model tải từ thư viện cộng đồng Meshy

Tải ngày 2026-11-03, tài khoản maz.elements3. Mọi model dưới đây đều ghi giấy phép **CC0** trên trang chi tiết: dùng tự do, kể cả thương mại, không bắt buộc ghi tên.

File gốc (rất nặng) nằm ở `assets-meshy/library/<tên>.glb` và không đưa lên git (`.gitignore`). Bản dùng trong game do `scripts/meshy-pack-library.mjs` tạo ra:

| Bản | Số mặt | Texture | Dùng cho |
|---|---|---|---|
| `public/models/lib_<tên>.hd.glb` | ~300k | 2048 | máy mạnh, chỉ bản web |
| `public/models/lib_<tên>.glb` | ~80k | 1024 | mặc định, gồm điện thoại |
| `public/models/lib_<tên>.lod.glb` | ~12k | 512 | nhìn từ xa |

| Tên | Trang Meshy (id task) | Số mặt gốc | Dùng trong game |
|---|---|---|---|
| pavilion2 | Two-Tier Chinese Pavilion · 019e626f-63e7-7e3e-b8aa-95fd2e04c362 | 7.744.880 | góc Tây Bắc Huyền Thành |
| garden_pav | Chinese Garden Pavilion · 019dcd9a-baf6-71e8-a4db-ddd595fe1473 | 4.513.277 | bên Sảnh Điều Hậu (Cùng Thông Hồ) |
| pagoda_red | Red Chinese Pagoda · 019e2985-75a5-73a6-afc4-06cc1743aea8 | 7.286.855 | góc Đông Bắc Huyền Thành |
| pagoda5 | Five-Tiered Chinese Pagoda · 019cd3af-64be-7871-ad36-0045258373d5 | 4.273.378 | Trích Thiên Đỉnh |
| courtyard | A small traditional Chinese courtyard house · 01a08854-ca6b-73c5-86d7-2c41a3632b4f | 3.007.533 | nhà vườn vành thành |
| mtn_house | Chinese old house on top of a mountain · 0198bd9e-d6e7-7273-a212-257d7d5c0631 | 3.061.149 | chân Tử Bình Phong |
| stone_bridge | Stone Bridge · 01a05033-b0f0-722c-b2b8-5d270b206144 | 1.924.888 | cầu qua sông |
| stall_timber | Timber Market Stall · 019e9ad7-c183-7ac1-906f-a7ecb0d46d16 | 1.707.126 | phố chợ đại lộ Nam |
| horse | horse · 019dc34e-1a5f-7bbc-96fa-1838af5c5843 | 788.869 | trạm đi nhanh |
| cart | Ancient Carriage Model (kasiwize) · 01976fa4-3160-77b5-a060-64567b434714 | 9.996 | trạm đi nhanh |
| blossom | Cherry blossom tree · 019e62ff-929d-7af5-a46a-dd3b70122b10 | 8.232.797 | trong thành, ven hồ |
| bonsai | Bonsai · 019b731e-f783-7245-b9f1-d26ecba28d33 | 9.621.214 | cạnh bàn mỗi sảnh |
| wood_pavilion | Traditional Chinese Wooden Pavilion · 019dae78-aa7f-7cb8-9f0a-2e46770e82ea | 1.670.156 | mái che sau bàn sảnh |
| willow | Willow tree · 0196cf4e-321a-71ae-82fc-296bd1567535 | 3.649.331 | ven hồ Cùng Thông |
| bookshelf | Antique Bookshelf · 019b838e-efcf-7602-ae91-91ac921f18d4 | 1.329.861 | Thư Lâu |
| paifang | Colorful Paifang Gate · 019d38c1-31ae-78d2-8cdb-6a5823d3b558 | 1.974.393 | cổng chào đại lộ Nam |
| lantern | Chinese paper festival lantern (DorkusMalorkus) · 019db912-329a-7af1-81d6-ac8af38ef881 | 1.655.692 | cột đèn dọc đường, quanh sảnh |

**Đã xem nhưng không dùng:**
- lạc chủ đề: Royal Carriage, kiểu châu Âu;
- có chữ: cổng rồng, bình phong, nhà phố có biển hiệu;
- chưa có texture: cầu gỗ, quầy trái cây;
- kiểu fantasy: trà quán quả trứng.
