"use client";

import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  PasswordInput,
  MoneyInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  StatusBadge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  DataTable,
  type Column,
  Pagination,
  Breadcrumb,
  Modal,
  ConfirmDialog,
  useToast,
  Skeleton,
  EmptyState,
  CountdownTimer,
  ShipmentStepper,
} from "@/components/ui";
import {
  BellIcon,
  SearchIcon,
  ClockIcon,
  UserIcon,
} from "@/components/icons";
import {
  AuctionStatus,
  BidStatus,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  ProductStatus,
  ReportStatus,
  UserStatus,
  ReservePriceStatus,
} from "@/types/enums";

interface MockRow {
  id: string;
  name: string;
  price: string;
  status: AuctionStatus;
}

const mockColumns: Column<MockRow>[] = [
  { key: "id", header: "Mã phiên", className: "font-semibold" },
  { key: "name", header: "Tên sản phẩm" },
  { key: "price", header: "Giá hiện tại", align: "right" },
  {
    key: "status",
    header: "Trạng thái",
    align: "center",
    render: (row) => (
      <StatusBadge statusType="auction" value={row.status} />
    ),
  },
];

const mockData: MockRow[] = [
  {
    id: "#AUC-9821",
    name: "Đồng hồ Patek Philippe Calatrava 5227R",
    price: "24.500.000 ₫",
    status: AuctionStatus.ACTIVE,
  },
  {
    id: "#AUC-9822",
    name: "Máy ảnh Leica M11 Rangefinder Black",
    price: "18.200.000 ₫",
    status: AuctionStatus.ACTIVE,
  },
  {
    id: "#AUC-9823",
    name: "Túi xách Hermès Birkin 25 Togo Gold",
    price: "45.000.000 ₫",
    status: AuctionStatus.ENDED,
  },
];

export default function DevUiPage() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [moneyVal, setMoneyVal] = useState(22500000);
  const [checked, setChecked] = useState(false);
  const [radioVal, setRadioVal] = useState("option1");

  return (
    <div className="min-h-screen bg-bg text-text p-4 md:p-8 max-w-6xl mx-auto space-y-12">
      <header className="border-b border-border-brand pb-6">
        <span className="label font-medium text-primary-700">Trang phát triển (Dev Only)</span>
        <h1 className="text-display font-bold text-text mt-1">OmniBid UI Components</h1>
        <p className="text-body text-text-secondary mt-2">
          Thư viện component hoàn chỉnh theo token Figma và hướng thiết kế &quot;Rõ ràng, đáng tin&quot;.
        </p>
      </header>

      {/* 1. Buttons */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          1. Button & IconButton
        </h2>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary (Mặc định)</Button>
            <Button variant="primary-strong">Primary Strong (Đặt giá / Thanh toán)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger-soft">Danger Soft</Button>
            <Button variant="ghost">Ghost link</Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Cỡ sm (32px)</Button>
            <Button size="md">Cỡ md (40px)</Button>
            <Button size="lg">Cỡ lg (44px form)</Button>
            <Button size="xl" variant="primary-strong">Cỡ xl (52px Đặt giá)</Button>
            <Button loading>Đang tải...</Button>
            <Button disabled>Bị khoá</Button>
          </div>

          <div className="flex items-center gap-3">
            <IconButton label="Thông báo" icon={<BellIcon />} variant="ghost" />
            <IconButton label="Tìm kiếm" icon={<SearchIcon />} variant="outline" />
            <IconButton label="Người dùng" icon={<UserIcon />} variant="tertiary" />
            <IconButton label="Đồng hồ" icon={<ClockIcon />} variant="secondary" />
            <IconButton label="Đang tải" icon={<BellIcon />} loading variant="primary" />
          </div>
        </div>
      </section>

      {/* 2. Inputs */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          2. Ô nhập liệu (Input, Password, Money, Textarea, Select, Checkbox, Radio)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            hint="Nhập đầy đủ tên có dấu theo CMND/CCCD"
            required
          />
          <Input
            label="Email tài khoản"
            placeholder="user@example.com"
            error="Email không đúng định dạng"
            defaultValue="invalid-email"
          />
          <PasswordInput
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            required
          />
          <MoneyInput
            label="Mức giá đặt của bạn"
            value={moneyVal}
            onChange={setMoneyVal}
            hint="Bước giá tối thiểu 500.000 ₫"
          />
          <Select
            label="Phương thức thanh toán"
            options={[
              { value: "MOCK_CARD", label: "Thẻ ngân hàng / Thẻ tín dụng (Thử nghiệm)" },
              { value: "MOCK_BANK", label: "Chuyển khoản QR (Thử nghiệm)" },
              { value: "MOCK_WALLET", label: "Ví điện tử (Thử nghiệm)" },
            ]}
          />
          <Textarea
            label="Mô tả chi tiết khiếu nại"
            placeholder="Nêu rõ tình trạng hàng hoá nhận được..."
            showCount
            maxLength={500}
            defaultValue="Mặt kính sản phẩm có vết trầy xước không đúng mô tả của người bán."
          />
        </div>

        <div className="flex flex-wrap items-center gap-8 pt-2">
          <Checkbox
            label="Tôi đồng ý với Quy chế hoạt động và Điều khoản đấu giá"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <div className="flex items-center gap-6">
            <Radio
              name="shipping"
              label="Giao tiêu chuẩn"
              checked={radioVal === "option1"}
              onChange={() => setRadioVal("option1")}
            />
            <Radio
              name="shipping"
              label="Giao hoả tốc"
              checked={radioVal === "option2"}
              onChange={() => setRadioVal("option2")}
            />
          </div>
        </div>
      </section>

      {/* 3. Status Badges */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          3. StatusBadge (Mọi trạng thái & Tông màu)
        </h2>
        <div className="space-y-3">
          <div>
            <span className="label block mb-2">Trạng thái phiên (AuctionStatus):</span>
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge statusType="auction" value={AuctionStatus.SCHEDULED} />
              <StatusBadge statusType="auction" value={AuctionStatus.ACTIVE} />
              <StatusBadge statusType="auction" value={AuctionStatus.ENDED} />
              <StatusBadge statusType="auction" value={AuctionStatus.UNSOLD} />
              <StatusBadge statusType="auction" value={AuctionStatus.CANCELLED} />
            </div>
          </div>

          <div>
            <span className="label block mb-2">Trạng thái lượt đặt (BidStatus):</span>
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge statusType="bid" value={BidStatus.LEADING} />
              <StatusBadge statusType="bid" value={BidStatus.OUTBID} />
              <StatusBadge statusType="bid" value={BidStatus.WON} />
              <StatusBadge statusType="bid" value={BidStatus.NOT_WON} />
              <StatusBadge statusType="bid" value={BidStatus.INVALIDATED} />
            </div>
          </div>

          <div>
            <span className="label block mb-2">Trạng thái đơn hàng (OrderStatus):</span>
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge statusType="order" value={OrderStatus.PENDING_PAYMENT} />
              <StatusBadge statusType="order" value={OrderStatus.PAID} />
              <StatusBadge statusType="order" value={OrderStatus.SHIPPING} />
              <StatusBadge statusType="order" value={OrderStatus.COMPLETED} />
              <StatusBadge statusType="order" value={OrderStatus.CANCELLED} />
              <StatusBadge statusType="order" value={OrderStatus.EXPIRED} />
            </div>
          </div>

          <div>
            <span className="label block mb-2">Các trạng thái khác:</span>
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge statusType="payment" value={PaymentStatus.SUCCESS} />
              <StatusBadge statusType="payment" value={PaymentStatus.FAILED} />
              <StatusBadge statusType="shipment" value={ShipmentStatus.IN_TRANSIT} />
              <StatusBadge statusType="product" value={ProductStatus.AVAILABLE} />
              <StatusBadge statusType="report" value={ReportStatus.PENDING} />
              <StatusBadge statusType="user" value={UserStatus.ACTIVE} />
              <StatusBadge statusType="user" value={UserStatus.BANNED} />
              <StatusBadge statusType="reservePrice" value={ReservePriceStatus.MET} />
              <StatusBadge statusType="reservePrice" value={ReservePriceStatus.NOT_MET} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cards & KPI */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          4. Card & StatCard (KPI)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Tổng lượt đặt giá"
            value="1.248"
            tone="info"
            icon={<ClockIcon />}
            subText="+12% so với hôm qua"
          />
          <StatCard
            label="Doanh thu tạm tính"
            value="142.500.000 ₫"
            tone="success"
            subText="5 đơn thành công"
          />
          <StatCard
            label="Đơn chờ thanh toán"
            value="3"
            tone="warning"
            highlight
            subText="Hạn thanh toán 24h"
          />
          <StatCard
            label="Báo cáo vi phạm mới"
            value="1"
            tone="danger"
            highlight
            subText="Cần xử lý gấp"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Thẻ tiêu chuẩn (Card)</CardTitle>
              <CardDescription>
                Nền trắng viền 1px border-brand, không đổ bóng theo style-overrides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-text">
                Nội dung bên trong thẻ trình bày thông tin phiên đấu giá hoặc đơn hàng.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="label font-medium text-text-tertiary">Mã thẻ: CRD-01</span>
              <Button size="sm" variant="outline">Xem chi tiết</Button>
            </CardFooter>
          </Card>

          <Card subtle>
            <h4 className="text-h4 font-semibold text-text mb-2">
              Khối thông tin phụ (Subtle Card)
            </h4>
            <p className="text-body text-text-secondary">
              Nền surface-subtle #F2F3FF bo 10px, dùng bên trong card chính để phân tách vùng số liệu.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Tabs & Segmented */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          5. Tabs & Segmented Control
        </h2>
        <Tabs defaultValue="desc">
          <TabList variant="underline">
            <TabTrigger value="desc">Mô tả sản phẩm</TabTrigger>
            <TabTrigger value="history" badge={18}>
              Lịch sử đặt giá
            </TabTrigger>
            <TabTrigger value="terms">Quy định bảo hành</TabTrigger>
          </TabList>
          <TabContent value="desc">
            <div className="p-4 bg-surface rounded-xl border border-border-brand">
              Nội dung mô tả sản phẩm chi tiết với ảnh và thông số kỹ thuật.
            </div>
          </TabContent>
          <TabContent value="history">
            <div className="p-4 bg-surface rounded-xl border border-border-brand">
              Bảng danh sách toàn bộ 18 lượt đặt giá của người mua.
            </div>
          </TabContent>
          <TabContent value="terms">
            <div className="p-4 bg-surface rounded-xl border border-border-brand">
              Cam kết hàng chính hãng 100%, bảo hành hoàn tiền trong 7 ngày.
            </div>
          </TabContent>
        </Tabs>

        <div className="pt-2">
          <span className="label block mb-2">Bộ lọc nhanh (Segmented Control):</span>
          <Tabs defaultValue="all">
            <TabList variant="segmented">
              <TabTrigger variant="segmented" value="all">Tất cả (45)</TabTrigger>
              <TabTrigger variant="segmented" value="active">Đang diễn ra (12)</TabTrigger>
              <TabTrigger variant="segmented" value="ended">Đã kết thúc (33)</TabTrigger>
            </TabList>
          </Tabs>
        </div>
      </section>

      {/* 6. DataTable & Pagination */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-brand pb-2">
          <h2 className="text-h2 font-semibold">6. DataTable & Pagination</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTableLoading((prev) => !prev)}
          >
            {tableLoading ? "Tắt Skeleton" : "Bật Skeleton mẫu"}
          </Button>
        </div>

        <DataTable
          columns={mockColumns}
          data={mockData}
          keyExtractor={(row) => row.id}
          loading={tableLoading}
          highlightRow={(row) => row.id === "#AUC-9821"}
        />

        <Pagination
          page={page}
          totalPages={5}
          totalElements={98}
          pageSize={20}
          onPageChange={setPage}
        />
      </section>

      {/* 7. Breadcrumb & Stepper */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          7. Breadcrumb & ShipmentStepper
        </h2>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Đồng hồ & Trang sức", href: "/categories/watches" },
            { label: "Patek Philippe 5227R" },
          ]}
        />

        <div className="p-6 bg-surface border border-border-brand rounded-xl">
          <h4 className="text-h4 font-semibold text-text mb-4">Tiến trình vận đơn #SHP-9128</h4>
          <ShipmentStepper
            currentStatus={ShipmentStatus.IN_TRANSIT}
            events={[
              { status: ShipmentStatus.CREATED, createdAt: "2026-11-06T10:00:00" },
              { status: ShipmentStatus.PICKED_UP, createdAt: "2026-11-06T14:30:00" },
              { status: ShipmentStatus.IN_TRANSIT, createdAt: "2026-11-07T09:15:00" },
            ]}
          />
        </div>
      </section>

      {/* 8. Countdown Timer */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          8. Đồng hồ đếm ngược (CountdownTimer)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="label block mb-2">Trạng thái bình thường (&gt; 5 phút):</span>
            <CountdownTimer endTime="2026-11-08T22:30:00" />
          </div>
          <div>
            <span className="label block mb-2">Trạng thái gấp (&lt; 5 phút / đã kết thúc):</span>
            <CountdownTimer endTime="2026-11-08T11:02:00" />
          </div>
        </div>
      </section>

      {/* 9. Modal, ConfirmDialog & Toast */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          9. Hộp thoại & Thông báo nổi (Modal, ConfirmDialog, Toast)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Mở Modal mẫu
          </Button>
          <Button variant="danger-soft" onClick={() => setConfirmOpen(true)}>
            Mở ConfirmDialog huỷ phiên
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.success("Đã đặt giá thành công 24.500.000 ₫!", "Thành công")}
          >
            Toast Thành công
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.error("Mức giá đặt phải cao hơn 25.000.000 ₫", "Lỗi đặt giá")}
          >
            Toast Lỗi (Không tự ẩn)
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info("Có 1 thông báo mới từ hệ thống.", "Thông báo")}
          >
            Toast Thông tin
          </Button>
        </div>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Thông tin chi tiết phiên #AUC-9821"
          description="Đồng hồ Patek Philippe Calatrava 5227R"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Đóng
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Xác nhận
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-body text-text">
              Đây là nội dung thử nghiệm trong Modal chuẩn 448px theo Figma S13.
              Hộp thoại hỗ trợ bẫy focus bàn phím và phím Escape để đóng.
            </p>
            <Input label="Ghi chú thêm" placeholder="Nhập ghi chú nếu có..." />
          </div>
        </Modal>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            toast.success("Đã huỷ phiên đấu giá thành công.");
          }}
          title="Xác nhận huỷ phiên đấu giá?"
          description="Hành động này không thể hoàn tác. Phiên đấu giá sẽ bị đóng vĩnh viễn và không tiếp nhận đặt giá nữa."
          confirmLabel="Huỷ phiên ngay"
          confirmVariant="danger-soft"
        />
      </section>

      {/* 10. EmptyState & Skeleton */}
      <section className="space-y-4">
        <h2 className="text-h2 font-semibold border-b border-border-brand pb-2">
          10. Trạng thái rỗng (EmptyState) & Skeleton
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="Chưa có lượt đặt giá nào"
            description="Hãy là người đầu tiên đặt giá để nắm giữ cơ hội sở hữu sản phẩm này."
            action={<Button size="md">Đặt giá khởi điểm</Button>}
          />
          <div className="p-6 bg-surface border border-border-brand rounded-xl space-y-3">
            <h4 className="text-small font-semibold text-text">Mẫu Skeleton nạp dữ liệu:</h4>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
