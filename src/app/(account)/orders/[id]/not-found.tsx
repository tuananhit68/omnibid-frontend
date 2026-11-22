import Link from "next/link";
import { getButtonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function OrderNotFoundPage() {
  return (
    <Card className="p-8 md:p-12 text-center space-y-4 max-w-lg mx-auto">
      <h1 className="text-h2 text-text">Không tìm thấy đơn hàng</h1>
      <p className="text-body text-text-secondary">
        Đơn hàng bạn tìm không tồn tại hoặc bạn không có quyền truy cập.
      </p>
      <div>
        <Link
          href="/me/orders"
          className={getButtonClassName({ variant: "primary", size: "md" })}
        >
          Về danh sách đơn hàng
        </Link>
      </div>
    </Card>
  );
}
