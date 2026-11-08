export interface MockCategory {
  id: number;
  name: string;
  slug: string;
  auctionCount: number;
  icon: string;
}

// TODO(backend B2): Thay thế bằng API GET /categories khi backend hoàn tất controller công khai
export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: 1,
    name: "Điện thoại & Máy tính bảng",
    slug: "dien-thoai-may-tinh-bang",
    auctionCount: 48,
    icon: "phone",
  },
  {
    id: 2,
    name: "Máy tính & Laptop",
    slug: "may-tinh-laptop",
    auctionCount: 32,
    icon: "laptop",
  },
  {
    id: 3,
    name: "Đồng hồ & Phụ kiện",
    slug: "dong-ho-phu-kien",
    auctionCount: 21,
    icon: "watch",
  },
  {
    id: 4,
    name: "Máy ảnh & Ống kính",
    slug: "may-anh-ong-kinh",
    auctionCount: 19,
    icon: "camera",
  },
  {
    id: 5,
    name: "Đồ gia dụng cao cấp",
    slug: "do-gia-dung-cao-cap",
    auctionCount: 24,
    icon: "home",
  },
];

