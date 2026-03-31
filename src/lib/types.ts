import { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    vendor: true;
    peptide: true;
  };
}>;

export type VendorWithProducts = Prisma.VendorGetPayload<{
  include: {
    products: {
      include: {
        peptide: true;
      };
    };
    reviews: true;
  };
}>;

export type PeptideWithProducts = Prisma.PeptideGetPayload<{
  include: {
    products: {
      include: {
        vendor: true;
      };
    };
  };
}>;

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true;
  };
}>;

export interface SearchFilters {
  query?: string;
  peptideIds?: string[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  usBasedOnly?: boolean;
  minRating?: number;
  minPurity?: number;
  forms?: string[];
  inStockOnly?: boolean;
  hasLabTesting?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "popularity" | "newest";
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  products: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
