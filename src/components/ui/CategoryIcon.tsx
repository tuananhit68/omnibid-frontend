import {
  BookOpen,
  Camera,
  Car,
  Gamepad2,
  Gem,
  Headphones,
  Home,
  Laptop,
  Music,
  Package,
  Palette,
  Shirt,
  Smartphone,
  Tag,
  Trophy,
  Watch,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  watch: Watch,
  camera: Camera,
  smartphone: Smartphone,
  "book-open": BookOpen,
  gem: Gem,
  shirt: Shirt,
  laptop: Laptop,
  headphones: Headphones,
  car: Car,
  home: Home,
  palette: Palette,
  trophy: Trophy,
  "gamepad-2": Gamepad2,
  music: Music,
  package: Package,
  tag: Tag,
};

export const ALLOWED_CATEGORY_ICONS = Object.keys(CATEGORY_ICON_MAP);

export interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const normalized = (name ?? "").trim().toLowerCase();
  const Icon = CATEGORY_ICON_MAP[normalized] ?? Tag;
  return <Icon className={cn("size-5 shrink-0", className)} aria-hidden="true" />;
}
