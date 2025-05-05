import { PRODUCT_NAMES, PRODUCT_DETAILS } from "./constants"
import type { ProductName } from "./constants"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

type Product = {
  id: number
  name: ProductName
  code: string
  description: string
  category: string
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    // For testing purposes, return dummy data
    // In production, uncomment the fetch call and remove this dummy data
    return [
      { id: 1, ...PRODUCT_DETAILS[PRODUCT_NAMES.MBCB] },
      { id: 2, ...PRODUCT_DETAILS[PRODUCT_NAMES.HM] },
      { id: 3, ...PRODUCT_DETAILS[PRODUCT_NAMES.POLE] },
    ]

    // Uncomment this for actual API call
    // const response = await fetch(`${API_URL}/products`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function addProduct(productData: Omit<Product, "id">): Promise<Product> {
  try {
    // For testing purposes, return dummy data
    // In production, uncomment the fetch call and remove this dummy data
    return { id: Date.now(), ...productData }

    // Uncomment this for actual API call
    // const response = await fetch(`${API_URL}/products`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(productData),
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

export async function updateProduct(id: number, productData: Omit<Product, "id">): Promise<Product> {
  try {
    // For testing purposes, return dummy data
    // In production, uncomment the fetch call and remove this dummy data
    return { id, ...productData }

    // Uncomment this for actual API call
    // const response = await fetch(`${API_URL}/products/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(productData),
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

