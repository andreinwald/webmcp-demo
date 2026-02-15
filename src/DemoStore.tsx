import { useState, useMemo } from 'react'
import storeItems from './misc/StoreItems'
import './misc/App.css'
import { showAlert } from './misc/ShowAlert'
import { useRegisterMCP } from './useRegisterMCP'

export function DemoStore() {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL')
  const [selectedGender, setSelectedGender] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const shoes = useMemo(() => Object.values(storeItems) as ShoeItem[], [])

  // Extract unique filter values
  const brands = useMemo(() => ['ALL', ...new Set(shoes.map(s => s.brand))], [shoes])
  const genders = useMemo(() => ['ALL', ...new Set(shoes.map(s => s.gender))], [shoes])
  const categories = useMemo(() => ['ALL', ...new Set(shoes.map(s => s.category))], [shoes])

  // Filter shoes
  const filteredShoes = useMemo(() => {
    return shoes.filter(shoe => {
      const brandMatch = selectedBrand === 'ALL' || shoe.brand === selectedBrand
      const genderMatch = selectedGender === 'ALL' || shoe.gender === selectedGender
      const categoryMatch = selectedCategory === 'ALL' || shoe.category === selectedCategory
      return brandMatch && genderMatch && categoryMatch && shoe.is_in_inventory
    })
  }, [shoes, selectedBrand, selectedGender, selectedCategory])

  // Cart functions
  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id)
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      const shoe = shoes.find(s => s.id === id)
      if (!shoe) return prev
      return [...prev, { ...shoe, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleBuy = () => {
    setShowCheckout(true)
    setTimeout(() => {
      setShowCheckout(false)
      setCart([])
      setIsCartOpen(false)
    }, 2000)
  }

  useRegisterMCP({
    name: "get_all_store_items",
    description: "Get all available store items",
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: () => {
      showAlert("get_all_store_items called")
      return shoes
    }
  })

  useRegisterMCP({
    name: "add_to_cart",
    description: "Add an item to the shopping cart",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The ID of the item to add to the cart"
        }
      },
      required: ["id"]
    },
    execute: ({ id }: { id: number }) => {
      showAlert("add_to_cart called")
      addToCart(id)
      return `Successfully added item ${id} to cart`
    }
  })

  useRegisterMCP({
    name: "display_cart",
    description: "Display the current shopping cart items to user",
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: () => {
      console.log("display_cart called")
      showAlert("display_cart called")
      setIsCartOpen(true)
      return {
        content: [
          {
            type: "text",
            text: "The shopping cart has been opened and is now visible to the user."
          }
        ]
      }
    }
  })

  useRegisterMCP({
    name: "purchase_cart",
    description: "Purchase the current shopping cart items",
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: () => {
      showAlert("purchase_cart called")
      handleBuy()
      return "Shopping cart purchased successfully"
    }
  })

  useRegisterMCP({
    name: "get_filter_options",
    description: "Get available filter options for products",
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: () => {
      showAlert("get_filter_options called")
      return {
        by_brand: brands,
        by_gender: genders,
        by_category: categories,
      }
    }
  })

  useRegisterMCP({
    name: "filter_by_brand",
    description: "Filter products by brand",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description: "The brand to filter by"
        }
      },
      required: ["brand"]
    },
    execute: ({ brand }: { brand: string }) => {
      showAlert("filter_by_brand called")
      setSelectedBrand(brand)
      return `Successfully filtered by brand ${brand}`
    }
  })

  useRegisterMCP({
    name: "filter_by_gender",
    description: "Filter products by gender (e.g., MEN, WOMEN, KIDS)",
    inputSchema: {
      type: "object",
      properties: {
        gender: {
          type: "string",
          description: "The gender to filter by"
        }
      },
      required: ["gender"]
    },
    execute: ({ gender }: { gender: string }) => {
      showAlert("filter_by_gender called")
      setSelectedGender(gender)
      return `Successfully filtered by gender ${gender}`
    }
  })

  useRegisterMCP({
    name: "filter_by_category",
    description: "Filter products by category",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The category to filter by"
        }
      },
      required: ["category"]
    },
    execute: ({ category }: { category: string }) => {
      showAlert("filter_by_category called")
      setSelectedCategory(category)
      return `Successfully filtered by category ${category}`
    }
  })

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">👟 ShoeMart</h1>
          <button className="cart-button" onClick={() => setIsCartOpen(!isCartOpen)}>
            🛒 Cart ({totalItems})
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Brand:</label>
          <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Gender:</label>
          <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <button
          className="reset-button"
          onClick={() => {
            setSelectedBrand('ALL')
            setSelectedGender('ALL')
            setSelectedCategory('ALL')
          }}
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
                    onClick={() => addToCart(shoe.id)}
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
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <button className="close-button" onClick={() => setIsCartOpen(false)}>✕</button>
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
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
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
                  <button className="buy-button" onClick={handleBuy}>
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

type ShoeItem = {
  id: number;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: number;
  is_in_inventory: boolean;
  items_left: number;
  imageURL: string;
  slug: string;
  featured: number;
};

type CartItem = ShoeItem & { quantity: number };
