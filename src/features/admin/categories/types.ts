export interface AdminCategoriesParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminCategoryPayload {
  name: string;
  slug: string;
  icon: string | null;
}
