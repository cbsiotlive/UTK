export const PRODUCT_NAMES = {
  MBCB: "MBCB",
  HM: "HM",
  POLE: "POLE",
} as const

export type ProductName = keyof typeof PRODUCT_NAMES



