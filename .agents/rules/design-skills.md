---
trigger: model_decision
description: Áp dụng khi dùng bất kỳ skill thiết kế/UI/UX nào (impeccable, ui-ux-pro-max, frontend-design…) hoặc khi được yêu cầu "làm đẹp", "polish", "audit", "critique", chỉnh font, khoảng cách, bố cục.
---

# Dùng skill thiết kế: tự do về kiểu dáng, khoá bảng màu

Quyết định của nhóm: **chỉ màu phải giống Figma**. Font, kiểu chữ, khoảng cách, bố cục chi tiết và trang trí được phép cải thiện, theo `design/style-overrides.md`. Skill thiết kế được dùng cho phần tự do đó.

## Bất biến – skill không được đụng

- Bảng màu trong `tokens.css` và vai trò của từng màu (`primary-600` hành động, `primary-700` tiền, màu trạng thái). Không thêm màu, gradient, bóng màu, nền họa tiết.
- Nội dung và chức năng: khối, trường, nút, cột, mã lỗi trong spec; quy tắc nghiệp vụ; accessibility.
- Ba quyết định đã chốt: font Be Vietnam Pro (hoặc font thay thế có subset `vietnamese`), không nhãn chữ hoa nhỏ, không viền màu một bên.

## Được dùng skill để

- Tinh chỉnh thang chữ, độ đậm, line-height, độ dài dòng cho hợp font mới.
- Làm gọn bố cục: căn lưới, khoảng cách đều, giảm card lồng card, thứ bậc thị giác rõ hơn.
- Trạng thái loading/empty/error, form, điều hướng, responsive.
- Kiểm tra accessibility và hướng dẫn kỹ thuật theo stack.

## Cách gọi

**Impeccable** (phù hợp nhất với định hướng này):
- Lần đầu: `teach` (ghi PRODUCT.md: sàn đấu giá, người dùng Việt Nam, giọng điệu tin cậy, rõ ràng) rồi `document` để sinh `DESIGN.md` từ `tokens.css`. Sửa `DESIGN.md` ghi rõ "bảng màu bị khoá".
- Dùng: `audit`, `critique`, `polish`, `typeset`, `layout`, `distill`, `quieter`, `harden`.
- Không dùng: `colorize`, `bolder`, `delight`, `animate` (ngoài micro-interaction 150–250ms), `shape`/`craft` (thiết kế lại từ đầu).

**UI UX Pro Max**: chỉ tra một vấn đề một lần, vd `search.py "form error inline" --domain ux`, `search.py "Be Vietnam Pro pairing" --domain typography`. Không chạy `--design-system` (sẽ sinh bảng màu khác).

## Khi đề xuất của skill đụng vào màu

Giữ màu theo token. Nếu là lỗi tương phản thật, đổi sang token khác cùng tông đã có (vd `text-subtle` → `text-tertiary`) và ghi lại để nhóm design biết.
