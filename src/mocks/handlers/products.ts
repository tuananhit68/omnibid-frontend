import type { Page, Product, ProductImage, ProductListItem } from "@/lib/api/contract";
import {
  AuctionStatus,
  ProductCondition,
  ProductStatus,
  UserRole,
} from "@/types/enums";
import { requireMockAuth } from "../auth";
import { getMockDb, mockNowIso, persistMockDb } from "../db";
import { mockError } from "../errors";
import type { MockProduct } from "../seed";
import { paginate } from "./categories";
import { readValidatedImageAsDataUrl } from "./users";

const MAX_TOTAL_UPLOAD_BYTES = 25 * 1024 * 1024;
const ALLOWED_PRODUCT_SORTS = new Set([
  "createdAt,desc",
  "createdAt,asc",
  "updatedAt,desc",
  "title,asc",
  "title,desc",
]);
const VALID_CONDITIONS = new Set<string>(Object.values(ProductCondition));

function findActiveAuctionId(productId: number): number | null {
  const db = getMockDb();
  const active = db.auctions.find(
    (a) =>
      a.productId === productId &&
      (a.status === AuctionStatus.SCHEDULED || a.status === AuctionStatus.ACTIVE)
  );
  return active?.id ?? null;
}

export function toProductListItem(product: MockProduct): ProductListItem {
  const db = getMockDb();
  const category = db.categories.find((c) => c.id === product.categoryId);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl ??
    null;

  return {
    id: product.id,
    title: product.title,
    categoryId: product.categoryId,
    categoryName: category?.name ?? "Khác",
    condition: product.condition,
    status: product.status,
    primaryImageUrl: primaryImage,
    imageCount: product.images.length,
    activeAuctionId: findActiveAuctionId(product.id),
    everAuctioned: product.everAuctioned,
    createdAt: product.createdAt,
  };
}

export function toProductDetail(product: MockProduct): Product {
  return {
    ...toProductListItem(product),
    description: product.description,
    images: product.images.map((img) => ({ ...img })),
    updatedAt: product.updatedAt,
  };
}

function validateProductFields(
  body: Record<string, unknown>,
  partial = false
): {
  title?: string;
  description?: string;
  categoryId?: number;
  condition?: ProductCondition;
} {
  const db = getMockDb();
  const fields: Record<string, string> = {};
  const result: {
    title?: string;
    description?: string;
    categoryId?: number;
    condition?: ProductCondition;
  } = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (title.length < 3 || title.length > 200) {
      fields.title = "Tiêu đề phải từ 3 đến 200 ký tự";
    } else {
      result.title = title;
    }
  }

  if (!partial || body.description !== undefined) {
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    if (description.length < 10 || description.length > 5000) {
      fields.description = "Mô tả phải từ 10 đến 5000 ký tự";
    } else {
      result.description = description;
    }
  }

  if (!partial || body.categoryId !== undefined) {
    const categoryId = Number(body.categoryId);
    const exists = db.categories.some((c) => c.id === categoryId);
    if (!Number.isInteger(categoryId) || !exists) {
      fields.categoryId = "Danh mục không hợp lệ";
    } else {
      result.categoryId = categoryId;
    }
  }

  if (!partial || body.condition !== undefined) {
    const condition = typeof body.condition === "string" ? body.condition : "";
    if (!VALID_CONDITIONS.has(condition)) {
      fields.condition = "Tình trạng sản phẩm không hợp lệ";
    } else {
      result.condition = condition as ProductCondition;
    }
  }

  if (Object.keys(fields).length > 0) {
    throw mockError("VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ", { fields });
  }

  return result;
}

async function parseMultipartProductJson(formData: FormData): Promise<Record<string, unknown>> {
  const raw = formData.get("product");
  if (!raw) {
    throw mockError("VALIDATION_ERROR", "Thiếu thông tin sản phẩm", {
      fields: { product: "Thiếu dữ liệu sản phẩm" },
    });
  }
  let text = "";
  if (typeof raw === "string") {
    text = raw;
  } else if (raw instanceof Blob) {
    text = await raw.text();
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fallback below
  }
  throw mockError("VALIDATION_ERROR", "Dữ liệu sản phẩm không đúng định dạng JSON");
}

function extractFiles(formData: FormData): File[] {
  const entries = formData.getAll("files");
  return entries.filter((item): item is File => item instanceof File);
}

export function handleGetMyProducts(
  authHeader: string | undefined,
  params: URLSearchParams
): Page<ProductListItem> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const keyword = (params.get("keyword") ?? "").trim().toLowerCase();
  const statusParam = params.get("status");
  const sort = params.get("sort") || "createdAt,desc";
  const page = Number(params.get("page") ?? "0");
  const size = Number(params.get("size") ?? "10");

  if (!ALLOWED_PRODUCT_SORTS.has(sort)) {
    throw mockError("VALIDATION_ERROR", "Tham số sắp xếp không hợp lệ", {
      fields: { sort: "Giá trị sort không nằm trong danh sách cho phép" },
    });
  }

  let list = db.products.filter((p) => {
    if (p.sellerId !== user.id) return false;
    if (statusParam && p.status !== statusParam) return false;
    if (keyword && !p.title.toLowerCase().includes(keyword)) return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "createdAt,asc":
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      case "updatedAt,desc":
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      case "title,asc":
        return a.title.localeCompare(b.title, "vi");
      case "title,desc":
        return b.title.localeCompare(a.title, "vi");
      case "createdAt,desc":
      default:
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });

  return paginate(list.map(toProductListItem), page, size);
}

export function handleGetProductDetail(
  productId: number,
  authHeader?: string
): Product {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw mockError("NOT_FOUND");
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");
  return toProductDetail(product);
}

export async function handleCreateProduct(
  authHeader: string | undefined,
  formData: FormData
): Promise<Product> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();

  const body = await parseMultipartProductJson(formData);
  const validated = validateProductFields(body, false);

  const files = extractFiles(formData);
  if (files.length < 1 || files.length > 5) {
    throw mockError("INVALID_IMAGE", "Sản phẩm phải có từ 1 đến 5 ảnh");
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    throw mockError("PAYLOAD_TOO_LARGE");
  }

  const dataUrls: string[] = [];
  for (const file of files) {
    dataUrls.push(await readValidatedImageAsDataUrl(file));
  }

  const nowIso = mockNowIso();
  const productId = db.nextIds.product++;
  const images: ProductImage[] = dataUrls.map((url, idx) => ({
    id: db.nextIds.productImage++,
    imageUrl: url,
    isPrimary: idx === 0,
  }));

  const created: MockProduct = {
    id: productId,
    sellerId: user.id,
    categoryId: validated.categoryId!,
    title: validated.title!,
    description: validated.description!,
    condition: validated.condition!,
    status: ProductStatus.AVAILABLE,
    images,
    everAuctioned: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.products.unshift(created);
  persistMockDb();
  return toProductDetail(created);
}

export function handleUpdateProduct(
  productId: number,
  authHeader: string | undefined,
  body: Record<string, unknown>
): Product {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw mockError("NOT_FOUND");
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");
  if (product.status !== ProductStatus.AVAILABLE) {
    throw mockError("PRODUCT_NOT_EDITABLE");
  }

  const validated = validateProductFields(body, true);
  if (validated.title !== undefined) product.title = validated.title;
  if (validated.description !== undefined) product.description = validated.description;
  if (validated.categoryId !== undefined) product.categoryId = validated.categoryId;
  if (validated.condition !== undefined) product.condition = validated.condition;
  product.updatedAt = mockNowIso();

  persistMockDb();
  return toProductDetail(product);
}

export function handleDeleteProduct(
  productId: number,
  authHeader?: string
): null {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const idx = db.products.findIndex((p) => p.id === productId);
  if (idx === -1) throw mockError("NOT_FOUND");

  const product = db.products[idx];
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");
  if (product.status !== ProductStatus.AVAILABLE || product.everAuctioned) {
    throw mockError(
      "INVALID_STATUS_TRANSITION",
      "Sản phẩm đã từng lên phiên hoặc không ở trạng thái sẵn sàng nên không thể xóa"
    );
  }

  db.products.splice(idx, 1);
  persistMockDb();
  return null;
}

export async function handleAddProductImages(
  productId: number,
  authHeader: string | undefined,
  formData: FormData
): Promise<Product> {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw mockError("NOT_FOUND");
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");
  if (product.status !== ProductStatus.AVAILABLE) {
    throw mockError("PRODUCT_NOT_EDITABLE");
  }

  const files = extractFiles(formData);
  if (files.length < 1) {
    throw mockError("INVALID_IMAGE", "Vui lòng chọn ít nhất 1 ảnh để tải lên");
  }
  if (product.images.length + files.length > 5) {
    throw mockError("INVALID_IMAGE", "Tổng số ảnh sản phẩm không được vượt quá 5");
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    throw mockError("PAYLOAD_TOO_LARGE");
  }

  const dataUrls: string[] = [];
  for (const file of files) {
    dataUrls.push(await readValidatedImageAsDataUrl(file));
  }

  const hadImages = product.images.length > 0;
  for (let i = 0; i < dataUrls.length; i++) {
    product.images.push({
      id: db.nextIds.productImage++,
      imageUrl: dataUrls[i],
      isPrimary: !hadImages && i === 0,
    });
  }

  product.updatedAt = mockNowIso();
  persistMockDb();
  return toProductDetail(product);
}

export function handleDeleteProductImage(
  productId: number,
  imageId: number,
  authHeader?: string
): Product {
  const user = requireMockAuth(authHeader, [UserRole.USER]);
  const db = getMockDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw mockError("NOT_FOUND");
  if (product.sellerId !== user.id) throw mockError("FORBIDDEN");
  if (product.status !== ProductStatus.AVAILABLE) {
    throw mockError("PRODUCT_NOT_EDITABLE");
  }

  const imgIdx = product.images.findIndex((img) => img.id === imageId);
  if (imgIdx === -1) throw mockError("NOT_FOUND");
  if (product.images.length <= 1) {
    throw mockError("INVALID_IMAGE", "Sản phẩm phải giữ lại ít nhất 1 ảnh");
  }

  const [removed] = product.images.splice(imgIdx, 1);
  if (removed.isPrimary && product.images.length > 0) {
    product.images[0].isPrimary = true;
  }

  product.updatedAt = mockNowIso();
  persistMockDb();
  return toProductDetail(product);
}
