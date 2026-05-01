# Nguyên tắc Code Frontend dành cho Senior Developer (Sport Pro)

Tài liệu này tổng hợp các tiêu chuẩn, quy chuẩn thẩm mỹ và kiến trúc Frontend bắt buộc phải tuân theo dựa trên hệ thống kỹ năng (skills) cốt lõi của dự án (React Components, Shadcn UI, Taste Design, Stitch Design). 

Mục tiêu là xây dựng một hệ thống code **module hóa cao, an toàn kiểu dữ liệu (type-safe), hiệu năng tốt** và một giao diện **premium, mang tính thẩm mỹ cao, tránh xa các thiết kế rập khuôn (anti-slop)**.

---

## 1. Kiến trúc & Quản lý Component (React & Shadcn UI)

### 1.1. Modular & Separation of Concerns (Tách biệt mối quan tâm)
- **Chia nhỏ Component:** Không viết các component khổng lồ (single-file outputs). Mỗi component chỉ đảm nhận một trách nhiệm duy nhất (Single Responsibility).
- **Logic Isolation:** Tách biệt hoàn toàn Business Logic/Event Handlers ra khỏi UI. Đưa toàn bộ logic phức tạp vào các **Custom Hooks** (`src/hooks/`).
- **Data Decoupling:** Không hardcode văn bản tĩnh, URL hình ảnh hay danh sách tĩnh trong component. Đưa chúng vào các file dữ liệu riêng biệt như `src/data/mockData.ts`.

### 1.2. Type Safety (An toàn kiểu dữ liệu)
- Mọi component bắt buộc phải định nghĩa TypeScript Interface cho Props, sử dụng hậu tố `Props` (ví dụ: `[ComponentName]Props`).
- Các Props interface nên sử dụng `Readonly` để đảm bảo tính bất biến (immutability).

### 1.3. Tiếp cận Component Library (Shadcn UI)
- **Sở hữu Source Code:** Không dùng UI Component dưới dạng thư viện `node_modules` ẩn. Sử dụng phương pháp của Shadcn UI: copy code component vào dự án (`components/ui/`) để hoàn toàn kiểm soát và tùy biến.
- **Tiện ích Class (`cn`):** Bắt buộc sử dụng hàm tiện ích `cn()` (kết hợp `clsx` và `tailwind-merge`) để nối và ghi đè class Tailwind một cách an toàn, tránh xung đột.
- **Quản lý biến thể (Variants):** Sử dụng thư viện `class-variance-authority` (`cva`) để khai báo các biến thể (variants, sizes, states) của component một cách hệ thống thay vì dùng toán tử ba ngôi chằng chịt.
- **Wrapper Components:** Khi cần mở rộng chức năng của một base component (ví dụ nút bấm có trạng thái loading), hãy tạo một wrapper component trong `components/` (không sửa trực tiếp base component trong `components/ui/` trừ phi cần đổi design core).

---

## 2. Tiêu chuẩn Thẩm mỹ (Taste Design & Vibe)

Dự án hướng tới một giao diện **Premium** và **High-Agency**, nghiêm cấm việc sử dụng các phong cách thiết kế chung chung, nhàm chán kiểu AI (AI cliches).

### 2.1. Màu sắc (Color Palette)
- **Không dùng đen tuyền (`#000000`):** Thay thế bằng Off-Black, Zinc-950, hoặc Charcoal (ví dụ `#18181B`).
- **Sự tiết chế:** Tối đa **1 Accent Color** (Màu nhấn) duy nhất với độ bão hòa (saturation) dưới 80%. Không dùng các hệ màu thay đổi nóng/lạnh lộn xộn.
- **Nghiêm cấm Neon/Glow:** Banned hoàn toàn các hiệu ứng phát sáng (glow) viền neon màu tím/xanh phong cách "AI".

### 2.2. Nghệ thuật Typography
- **Tránh font rập khuôn:** Không sử dụng font `Inter` cho các ngữ cảnh sáng tạo hoặc tiêu đề lớn. Hãy dùng các font có cá tính hơn (Geist, Outfit, Satoshi). 
- **Serif rule:** Các font serif cổ điển (Times New Roman, Georgia) bị cấm. Nếu cần dùng serif, phải dùng các font modern serif (Fraunces, Editorial New). *Cấm tuyệt đối font serif trong giao diện Dashboard/Phần mềm.*
- **Độ tương phản Typography:** Thể hiện phân cấp nội dung qua trọng lượng (weight) và màu sắc (color), không chỉ phình to kích thước chữ.
- **Số liệu & Dashboard:** Bắt buộc sử dụng font Monospace cho các con số hoặc hệ thống có mật độ thông tin cao.
- **Đọc hiểu (Readability):** Giới hạn độ dài đoạn văn ở mức 65 ký tự trên một dòng (65ch) và dùng leading (line-height) thoáng cho body text.

### 2.3. Bố cục & Không gian (Layout & Spacing)
- **Không chồng chéo (No Overlapping):** Mọi phần tử đều phải có vùng không gian riêng rõ ràng. Không dùng absolute stacking bừa bãi.
- **Bất đối xứng (Asymmetry):** Tránh layout 3 cột bằng nhau rập khuôn ("3 equal cards horizontally"). Hãy ưu tiên lưới bất đối xứng (Zig-Zag, horizontal scroll) hoặc thiết kế lệch (offset).
- **CSS Grid:** Ưu tiên dùng CSS Grid thay vì Flexbox kết hợp hàm `calc()` phức tạp.
- **Bóng đổ (Shadows):** Chỉ dùng bóng để thể hiện phân cấp chiều sâu (elevation). Dùng bóng đổ nhòe, nhẹ (whisper-soft diffused), tuyệt đối không dùng bóng đổ đen, gắt, lầy lội (muddy).

---

## 3. Motion & Interaction (Chuyển động & Tương tác)

- **Vật lý lò xo (Spring Physics):** Áp dụng cấu hình lò xo (ví dụ: `stiffness: 100, damping: 20`) để tạo cảm giác thực tế, có trọng lượng. Không dùng hiệu ứng easing tuyến tính (linear) vô hồn.
- **Perpetual Micro-Interactions:** Các thành phần đang ở trạng thái kích hoạt (active) cần có các vòng lặp hiệu ứng vi mô (Pulse, Float, Shimmer) để tạo sức sống cho UI.
- **Hiệu ứng Thác đổ (Waterfall/Staggered):** Không render một danh sách xuất hiện ngay lập tức cùng lúc. Sử dụng độ trễ xếp tầng (cascade delays).
- **Tối ưu Hiệu năng:** CHỈ animate các thuộc tính được tăng tốc phần cứng (`transform` và `opacity`). TUYỆT ĐỐI KHÔNG animate `top`, `left`, `width`, `height`.

---

## 4. Responsive & Khả năng truy cập (Accessibility)

- **Mobile-first strict:** Dưới 768px, mọi layout nhiều cột phải "collapse" thành 1 cột. Nghiêm cấm xuất hiện thanh cuộn ngang (horizontal scrollbar) do lỗi overflow trên mobile.
- **Touch Targets:** Các vùng tương tác (nút bấm, link) phải có kích thước tối thiểu `44px` x `44px` trên mobile.
- **Accessibility (A11y):** Giữ nguyên các thuộc tính ARIA từ Shadcn/Radix UI. Đảm bảo UI hoạt động trơn tru với bàn phím (Keyboard navigation) và quản lý Focus ring hợp lý.

---

## 5. Anti-Patterns (Những điều CẤM kỵ)

Những "vết xước" nghiệp dư này sẽ ngay lập tức làm giảm giá trị của dự án, Developer tuyệt đối tránh:
1. **Dữ liệu giả ngớ ngẩn:** Cấm dùng tên "John Doe", "Acme", các số liệu bịa đặt tròn trĩnh (`99.99%`, `50%`) hoặc filler text "Scroll to explore", "Swipe down". Hãy dùng placeholder rõ ràng nếu chưa có dữ liệu thật.
2. **Copywriting sáo rỗng:** Không dùng các từ ngữ cliché phong cách AI như "Elevate", "Seamless", "Unleash", "Next-Gen".
3. **Emoji:** Cấm sử dụng emoji trong UI chính.
4. **Custom Cursor:** Không sử dụng con trỏ chuột tùy chỉnh (custom mouse cursors).
5. **Cấu trúc Hero Section giữa (Centered Hero):** Bị hạn chế tối đa trong các giao diện đòi hỏi tính sáng tạo cao. Hãy ép dạt trái hoặc chia đôi màn hình (Split screen).
6. **Hardcode Style:** Không hardcode màu sắc HEX trực tiếp trong component. Luôn dùng hệ thống Design Tokens (Tailwind classes) đã được mapping với Theme (`tailwind.config`).
