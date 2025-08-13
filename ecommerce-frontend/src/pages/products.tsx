import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, priceEUR, createProduct } from '../lib/api'
import type { Product } from '../types'

export default function Products() {
  const [items, setItems] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    imageUrl: '',
    category: '',
    description: ''
  })

  useEffect(() => {
    console.log('Searching for:', search)
    fetchProducts({ search })
      .then(({ items }) => {
        console.log('Search results:', items)
        setItems(items as Product[])
      })
      .catch((error) => {
        console.error('Search failed:', error)
      })
  }, [search])

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    
    try {
      const productData = {
        title: newItem.title,
        priceCents: Math.round(parseFloat(newItem.price) * 100),
        imageUrl: newItem.imageUrl,
        category: newItem.category,
        description: newItem.description
      }

      await createProduct(productData)
      
      // Reset form
      setNewItem({
        title: '',
        price: '',
        imageUrl: '',
        category: '',
        description: ''
      })
      setShowCreateForm(false)
      
      // Refresh products list
      const { items } = await fetchProducts({ search })
      setItems(items as Product[])

    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create item. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container">
      {/* toolbar */}
      <div className="toolbar" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: '2px solid #FF5F00',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '16px',
            color: '#30446F',
            backgroundColor: '#FFFFFF',
            flex: 1,
            outline: 'none'
          }}
        />
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#FF5F00',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E54D00'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF5F00'
            e.currentTarget.style.transform = 'translateY(0px)'
          }}
        >
          + Add Product
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            border: '2px solid #FF5F00',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#30446F', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Add New Product</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  color: '#30446F',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FF5F00',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#30446F',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Price (EUR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FF5F00',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#30446F',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FF5F00',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#30446F',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FF5F00',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#30446F',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Description *
                </label>
                <textarea
                  required
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FF5F00',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#30446F',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'transparent',
                    color: '#30446F',
                    border: '2px solid #30446F',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#FF5F00',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    opacity: isCreating ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isCreating ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* grid */}
      <div className="product-grid">
        {items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '3px solid #FF5F00',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(255, 95, 0, 0.1)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 95, 0, 0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 95, 0, 0.1)'
                e.currentTarget.style.transform = 'translateY(0px)'
              }}
            >
              <div style={{
                aspectRatio: '3/2',
                marginBottom: '12px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid #FF5F00',
                alignContent: 'center'
              }}>
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#30446F',
                fontSize: '18px',
                lineHeight: '1.3',
                flex: 1,
                justifyContent: 'center',
              }}>
                {p.title}
              </div>

              <div style={{
                color: '#FF5F00',
                marginBottom: '16px',
                fontSize: '20px',
                fontWeight: 'bold',
                alignContent: 'center',
              }}>
                {priceEUR(p.priceCents)}
              </div>

              <button
                style={{
                  width: '100%',
                  backgroundColor: '#FF5F00',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                View details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
