import { useMemo, useSyncExternalStore } from 'react'
import { storeManager } from './StoreManager'
import './App.css'

export function DemoStore() {
  const state = useSyncExternalStore(
    (l) => storeManager.subscribe(l),
    () => storeManager.getState()
  )

  const {
    selectedBrand,
    selectedGender,
    selectedCategory,
    cart,
    isCartOpen,
    showCheckout
  } = state

  const shoes = storeManager.getItems()
  const brands = storeManager.getBrands()
  const genders = storeManager.getGenders()
  const categories = storeManager.getCategories()

  // Filter shoes
  // Note: user said sorting can be in React, but filtering is currently in store.
  // We can also compute filtered shoes here if preferred.
  const filteredShoes = useMemo(() => {
    return shoes.filter(shoe => {
      const brandMatch = selectedBrand === 'ALL' || shoe.brand === selectedBrand
      const genderMatch = selectedGender === 'ALL' || shoe.gender === selectedGender
      const categoryMatch = selectedCategory === 'ALL' || shoe.category === selectedCategory
      return brandMatch && genderMatch && categoryMatch && shoe.is_in_inventory
    })
  }, [shoes, selectedBrand, selectedGender, selectedCategory])

  const totalPrice = storeManager.getTotalPrice()
  const totalItems = storeManager.getTotalItems()

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">👟 ShoeMart</h1>
          <button className="cart-button" onClick={() => storeManager.setCartOpen(!isCartOpen)}>
            🛒 Cart ({totalItems})
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Brand:</label>
          <select value={selectedBrand} onChange={e => storeManager.setSelectedBrand(e.target.value)}>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Gender:</label>
          <select value={selectedGender} onChange={e => storeManager.setSelectedGender(e.target.value)}>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={e => storeManager.setSelectedCategory(e.target.value)}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button
          className="reset-button"
          onClick={() => storeManager.resetFilters()}
        >
          Reset Filters
        </button>
      </div>

      {/* Products Grid */}
      <main className="products">
        <div className="products-header">
          <h2>Available Shoes ({filteredShoes.length})</h2>
        </div>
        <div className="products-grid">
          {filteredShoes.map(shoe => (
            <div key={shoe.id} className="product-card">
              <div className="product-image">
                <img src={shoe.imageURL} alt={shoe.name} />
                {shoe.featured === 1 && <span className="badge">Featured</span>}
              </div>
              <div className="product-info">
                <h3>{shoe.name}</h3>
                <p className="product-meta">
                  {shoe.brand} • {shoe.gender} • {shoe.category}
                </p>
                <div className="product-footer">
                  <span className="price">${shoe.price}</span>
                  <button
                    className="add-button"
                    onClick={() => storeManager.addToCart(shoe.id)}
                  >
                    Add to Cart
                  </button>
                </div>
                <p className="stock">Only {shoe.items_left} left!</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => storeManager.setCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <button className="close-button" onClick={() => storeManager.setCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.imageURL} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${item.price}</p>
                        <div className="quantity-controls">
                          <button onClick={() => storeManager.updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => storeManager.updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => storeManager.removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-price">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button className="buy-button" onClick={() => storeManager.handleBuy()}>
                    Buy Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="success-icon">✓</div>
            <h2>Purchase Successful!</h2>
            <p>Thank you for your order.</p>
          </div>
        </div>
      )}
    </div>
  )
}
