import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { CheckIcon } from "../icons";
import { ShipmentStatus, SHIPMENT_STATUS_META } from "@/types/enums";

export interface ShipmentEventItem {
  status: ShipmentStatus;
  createdAt?: string;
  note?: string;
}

export interface ShipmentStepperProps {
  currentStatus?: ShipmentStatus;
  events?: ShipmentEventItem[];
  className?: string;
}

const STEPS: ShipmentStatus[] = [
  ShipmentStatus.CREATED,
  ShipmentStatus.PICKED_UP,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.DELIVERED,
];

export function ShipmentStepper({
  currentStatus = ShipmentStatus.CREATED,
  events = [],
  className,
}: ShipmentStepperProps) {
  const currentIndex = STEPS.indexOf(currentStatus);

  // Map events theo status để lấy ngày giờ
  const eventMap = new Map<ShipmentStatus, ShipmentEventItem>();
  events.forEach((ev) => eventMap.set(ev.status, ev));

  return (
    <div className={cn("w-full py-4 select-none", className)}>
      <div className="flex items-center justify-between relative">
        {/* Đường nối giữa các bước */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -translate-y-1/2 z-0" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-primary-700 -translate-y-1/2 transition-all duration-300 z-0"
          style={{
            width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Các nút bước */}
        {STEPS.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isDoneOrCurrent = idx <= currentIndex;
          const event = eventMap.get(step);
          const meta = SHIPMENT_STATUS_META[step];

          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10 text-center flex-1"
            >
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center font-semibold text-caption transition-colors",
                  isDoneOrCurrent
                    ? "bg-primary-700 text-text-inverse shadow-xs"
                    : "bg-surface border-2 border-border text-text-tertiary"
                )}
              >
                {isPassed ? (
                  <CheckIcon className="size-4 stroke-[2.5]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="mt-2.5 space-y-0.5">
                <span
                  className={cn(
                    "block text-small font-semibold",
                    isCurrent
                      ? "text-primary-700"
                      : isPassed
                      ? "text-text"
                      : "text-text-tertiary"
                  )}
                >
                  {meta.label}
                </span>
                {event?.createdAt && (
                  <span className="block text-caption text-text-tertiary tabular">
                    {formatDateTime(event.createdAt, "DD/MM HH:mm")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

