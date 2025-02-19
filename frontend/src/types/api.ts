export const QUERY_KEYS = {
  positions: ["positions"] as const,
  divisions: ["divisions"] as const,
  employees: ["employees"] as const,
  tiers: ["tiers"] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
