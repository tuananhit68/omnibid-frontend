"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyBids } from "./api";
import type { MyBidsParams } from "./types";

export const bidKeys = {
  all: ["bids"] as const,
  mine: () => ["bids", "mine"] as const,
  mineList: (params?: MyBidsParams) => ["bids", "mine", "list", params] as const,
};

export function useMyBids(params?: MyBidsParams) {
  return useQuery({
    queryKey: bidKeys.mineList(params),
    queryFn: () => getMyBids(params),
    placeholderData: keepPreviousData,
  });
}
