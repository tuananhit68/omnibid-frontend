export interface BidWsData {
  id: number;
  auctionId: number;
  bidderId: number;
  bidderName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface AuctionWsMessage<T = unknown> {
  type: "BID_PLACED" | "AUCTION_UPDATED";
  auctionId: number;
  data: T;
}

export interface NotificationWsData {
  id: number;
  type: string;
  title: string;
  content: string;
  refType?: string;
  refId?: number;
  isRead: boolean;
  createdAt: string;
  unreadCount?: number;
}
