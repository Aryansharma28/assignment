import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProduct, priceEUR, updateProduct, deleteProduct } from '../lib/api'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState<Product | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editItem, setEditItem] = useState({
    title: '',
    price: '',
    imageUrl: '',
    category: '',
    description: ''
  })

  useEffect(() => {
    if (!id) return
    fetchProduct(id).then(product => {
      setP(product)
      setEditItem({
        title: product.title,
        price: (product.priceCents / 100).toString(),
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description
      })
    }).catch((e) => setErr(e.message))
  }, [id])

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !p) return
    setIsUpdating(true)
    
    try {
      const productData = {
        title: editItem.title,
        priceCents: Math.round(parseFloat(editItem.price) * 100),
        imageUrl: editItem.imageUrl,
        category: editItem.category,
        description: editItem.description
      }

      const updatedProduct = await updateProduct(id, productData)
      setP(updatedProduct)
      setShowEditForm(false)
      
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!id || !p) return
    
    const confirmed = window.confirm(`Are you sure you want to delete "${p.title}"? This action cannot be undone.`)
    if (!confirmed) return
    
    setIsDeleting(true)
    
    try {
      await deleteProduct(id)
      navigate('/')
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (err) return (
    <div style={{ 
      padding: '32px', 
      display: 'flex', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        backgroundColor: '#ffebee', 
        color: '#d32f2f', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #f5c6cb'
      }}>
        Error: {err}
      </div>
    </div>
  )
  
  if (!p) return (
    <div style={{ 
      padding: '32px', 
      display: 'flex', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        color: '#FF5F00', 
        fontSize: '18px' 
      }}>
        Loading…
      </div>
    </div>
  )

  return (
    <div style={{ width: '100%' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          color: '#30446F',
          marginBottom: '24px',
          display: 'inline-block',
          fontWeight: '600',
          fontSize: '18px',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FF5F00'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#30446F'}
        >
          ← Back to products
        </div>
      </Link>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '3px solid #FF5F00',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(255, 95, 0, 0.15)',
          maxWidth: '1200px',
          width: '100%',
          position: 'relative'
        }}>
          {/* Delete Button */}
          <button
            onClick={handleDeleteProduct}
            disabled={isDeleting}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#f44336',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: isDeleting ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = '#d32f2f'
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = '#f44336'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
            title={isDeleting ? 'Deleting...' : 'Delete product'}
          >
            {isDeleting ? '...' : '×'}
          </button>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
            gap: '32px',
            width: '100%'
          }}>
            <div style={{
              border: '2px solid #FF5F00',
              borderRadius: '8px',
              overflow: 'hidden',
              height: window.innerWidth >= 1024 ? '500px' : '400px'
            }}>
              <img 
                src={p.imageUrl} 
                alt={p.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{
                  color: '#30446F',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0'
                }}>
                  {p.title}
                </h2>
                
                <div style={{
                  color: '#FF5F00',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '16px'
                }}>
                  {priceEUR(p.priceCents)}
                </div>
                
                <div style={{
                  color: '#30446F',
                  opacity: 0.8,
                  marginBottom: '24px',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  {p.category}
                </div>
                
                <p style={{
                  color: '#30446F',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  fontSize: '1rem'
                }}>
                  {p.description}
                </p>
              </div>
              
              <div>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <button
                    onClick={() => setShowEditForm(true)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '8px',
                      border: '2px solid #FF5F00',
                      backgroundColor: '#FFFFFF',
                      color: '#FF5F00',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF5F00'
                      e.currentTarget.style.color = '#FFFFFF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                      e.currentTarget.style.color = '#FF5F00'
                    }}
                  >
                    Edit Product
                  </button>
                  
                  <button
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#FF5F00',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Buy now
                  </button>
                </div>
                
                <div style={{
                  color: '#30446F',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {p.inventory > 0 ? (
                    <span style={{ color: '#FF5F00' }}>In stock: {p.inventory}</span>
                  ) : (
                    <span style={{ color: '#f44336' }}>Out of stock</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              <h2 style={{ color: '#30446F', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Edit Product</h2>
              <button
                onClick={() => setShowEditForm(false)}
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

            <form onSubmit={handleEditProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#30446F', fontWeight: 'bold' }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
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
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
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
                  value={editItem.imageUrl}
                  onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })}
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
                  value={editItem.category}
                  onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
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
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
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
                  onClick={() => setShowEditForm(false)}
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
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#FF5F00',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isUpdating ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
