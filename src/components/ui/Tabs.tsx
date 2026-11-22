"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

interface TabsContextValue {
  selectedTab: string;
  setSelectedTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue || "");
  const selectedTab =
    controlledValue !== undefined ? controlledValue : internalTab;

  const setSelectedTab = (val: string) => {
    if (controlledValue === undefined) {
      setInternalTab(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: ReactNode;
  variant?: "underline" | "segmented";
  className?: string;
}

export function TabList({
  children,
  variant = "underline",
  className,
}: TabListProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    );
    const activeIndex = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (activeIndex === -1) return;

    let nextIndex = activeIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        variant === "underline"
          ? "flex items-center gap-6 border-b border-border h-14 overflow-x-auto overflow-y-hidden no-scrollbar"
          : "inline-flex p-1 bg-surface-subtle rounded-lg gap-1 border border-border-brand",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  badge?: number | string;
  children: ReactNode;
  variant?: "underline" | "segmented";
  className?: string;
}

export function TabTrigger({
  value,
  badge,
  children,
  variant = "underline",
  className,
}: TabTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabTrigger must be used within Tabs");

  const isSelected = ctx.selectedTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      onClick={() => ctx.setSelectedTab(value)}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-small font-semibold transition-all select-none",
        "focus-visible:outline-2 focus-visible:outline-focus",
        variant === "underline"
          ? cn(
              "h-full relative py-3 px-1 border-b-2 -mb-[1px]",
              isSelected
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-text-secondary hover:text-text hover:border-border-strong"
            )
          : cn(
              "px-3.5 py-1.5 rounded-md",
              isSelected
                ? "bg-surface text-text font-semibold shadow-xs"
                : "text-text-secondary hover:text-text hover:bg-surface-muted/50"
            ),
        className
      )}
    >
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "text-caption font-semibold px-2 py-0.5 rounded-full tabular",
            isSelected
              ? "bg-primary-50 text-primary-700"
              : "bg-surface-muted text-text-tertiary"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabContent({ value, children, className }: TabContentProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabContent must be used within Tabs");

  if (ctx.selectedTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("pt-4 focus-visible:outline-none", className)}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

