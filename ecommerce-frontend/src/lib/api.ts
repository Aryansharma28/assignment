const BASE = '/api'

export async function fetchProducts(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : ''
  const res = await fetch(`${BASE}/products${qs}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json() as Promise<{ items: unknown[]; total: number; page: number; limit: number }>
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${BASE}/products/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function createProduct(productData: {
  title: string
  priceCents: number
  imageUrl: string
  category: string
  description: string
}) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData)
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(id: string, productData: {
  title: string
  priceCents: number
  imageUrl: string
  category: string
  description: string
}) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData)
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.ok
}

export const priceEUR = (cents: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
