import storeItems from './data/StoreItems';

export type ShoeItem = {
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

export type CartItem = ShoeItem & { quantity: number };

export interface StoreState {
    selectedBrand: string;
    selectedGender: string;
    selectedCategory: string;
    cart: CartItem[];
    isCartOpen: boolean;
    showCheckout: boolean;
}

class StoreManager {
    private state: StoreState = {
        selectedBrand: 'ALL',
        selectedGender: 'ALL',
        selectedCategory: 'ALL',
        cart: [],
        isCartOpen: false,
        showCheckout: false,
    };

    private listeners: Set<() => void> = new Set();
    private shoes: ShoeItem[] = Object.values(storeItems) as ShoeItem[];

    constructor() { }

    // React Integration
    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach((listener) => listener());
    }

    // Getters
    getState(): StoreState {
        return this.state;
    }

    getItems(): ShoeItem[] {
        return this.shoes;
    }

    getFilteredShoes(): ShoeItem[] {
        return this.shoes.filter((shoe) => {
            const brandMatch = this.state.selectedBrand === 'ALL' || shoe.brand === this.state.selectedBrand;
            const genderMatch = this.state.selectedGender === 'ALL' || shoe.gender === this.state.selectedGender;
            const categoryMatch = this.state.selectedCategory === 'ALL' || shoe.category === this.state.selectedCategory;
            return brandMatch && genderMatch && categoryMatch && shoe.is_in_inventory;
        });
    }

    getBrands(): string[] {
        return ['ALL', ...new Set(this.shoes.map((s) => s.brand))];
    }

    getGenders(): string[] {
        return ['ALL', ...new Set(this.shoes.map((s) => s.gender))];
    }

    getCategories(): string[] {
        return ['ALL', ...new Set(this.shoes.map((s) => s.category))];
    }

    getCart(): CartItem[] {
        return this.state.cart;
    }

    getTotalPrice(): number {
        return this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getTotalItems(): number {
        return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Actions
    setSelectedBrand(brand: string) {
        this.state = { ...this.state, selectedBrand: brand };
        this.notify();
    }

    setSelectedGender(gender: string) {
        this.state = { ...this.state, selectedGender: gender };
        this.notify();
    }

    setSelectedCategory(category: string) {
        this.state = { ...this.state, selectedCategory: category };
        this.notify();
    }

    setCartOpen(isOpen: boolean) {
        this.state = { ...this.state, isCartOpen: isOpen };
        this.notify();
    }

    resetFilters() {
        this.state = {
            ...this.state,
            selectedBrand: 'ALL',
            selectedGender: 'ALL',
            selectedCategory: 'ALL'
        };
        this.notify();
    }

    addToCart(id: number) {
        const existing = this.state.cart.find((item) => item.id === id);
        let newCart;
        if (existing) {
            newCart = this.state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            const shoe = this.shoes.find((s) => s.id === id);
            if (!shoe) return;
            newCart = [...this.state.cart, { ...shoe, quantity: 1 }];
        }
        this.state = { ...this.state, cart: newCart };
        this.notify();
    }

    removeFromCart(id: number) {
        const newCart = this.state.cart.filter((item) => item.id !== id);
        this.state = { ...this.state, cart: newCart };
        this.notify();
    }

    updateQuantity(id: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(id);
        } else {
            const newCart = this.state.cart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            );
            this.state = { ...this.state, cart: newCart };
            this.notify();
        }
    }

    handleBuy() {
        this.state = { ...this.state, showCheckout: true };
        this.notify();
        setTimeout(() => {
            this.state = {
                ...this.state,
                showCheckout: false,
                cart: [],
                isCartOpen: false
            };
            this.notify();
        }, 2000);
    }
}

export const storeManager = new StoreManager();
