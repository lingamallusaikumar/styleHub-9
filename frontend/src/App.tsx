import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';
import { ApiPortalView } from './components/ApiPortalView';

import { SmartRecommendationEngine } from './components/SmartRecommendationEngine';
import { VendorErpDashboard } from './components/VendorErpDashboard';
import { VipLoyaltyProgram } from './components/VipLoyaltyProgram';
import { SizeFitPredictor } from './components/SizeFitPredictor';
import { FulfillmentTracker } from './components/FulfillmentTracker';

import { Product, ProductVariant, CartItem, Order, User, Category } from './types';
import { ApiService } from './services/api';
import { INITIAL_CATEGORIES, MOCK_NOTIFICATIONS, MOCK_ORDERS, MOCK_SELLER_PROFILE } from './data/mockData';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<'store' | 'api'>('store');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState<string>('USD');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');

  const handleSelectCategory = (slug: string) => {
    setActiveView('store');
    setSelectedCategory(slug);
  };
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal / Drawer states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isVendorErpOpen, setIsVendorErpOpen] = useState<boolean>(false);
  const [isVipLoyaltyOpen, setIsVipLoyaltyOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [activeOrderTracker, setActiveOrderTracker] = useState<Order | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User & Cart state
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'eleanor@stylehub.com',
    full_name: 'Eleanor Vance',
    role: 'CUSTOMER'
  });
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Apply theme class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load products & categories
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetchedProducts = await ApiService.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption
      });
      setProducts(fetchedProducts);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory, searchQuery, sortOption]);

  // Cart operations
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const targetVariant = variant || product.variants[0] || { id: 1, sku: 'DEF', color_name: 'Standard', size: 'M', stock_quantity: 10 };
    const primaryImg = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || (product as any)?.primary_image;
    const brandName = typeof product.brand === 'string' ? product.brand : (product.brand?.name || 'StyleHub');

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.variant.id === targetVariant.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        updated[existingIdx].total_price = updated[existingIdx].quantity * updated[existingIdx].unit_price;
        return updated;
      }
      return [
        ...prev,
        {
          id: Date.now(),
          variant: targetVariant,
          product: {
            id: product.id,
            title: product.title,
            slug: product.slug,
            brand_name: brandName,
            image_url: primaryImg
          },
          quantity,
          unit_price: product.base_price,
          total_price: product.base_price * quantity
        }
      ];
    });

    setToastMessage(`Added "${product.title}" (${targetVariant.color_name}, ${targetVariant.size}) to your bag.`);
  };

  const handleUpdateQuantity = (cartItemId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total_price: newQty * item.unit_price };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (cartItemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    setToastMessage('Item removed from your bag.');
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      setToastMessage(`Removed "${product.title}" from Wishlist.`);
    } else {
      setWishlist(prev => [...prev, product]);
      setToastMessage(`Saved "${product.title}" to Wishlist.`);
    }
  };

  // Order Placement Success
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setActiveOrderTracker(newOrder);
    setToastMessage(`Order #${newOrder.order_number} confirmed! Shipment tracking initiated.`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--accent-gold)] selection:text-black">
      
      {/* Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        notifications={MOCK_NOTIFICATIONS}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeView={activeView}
        onToggleApiPortal={() => setActiveView(activeView === 'store' ? 'api' : 'store')}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenVendorErp={() => setIsVendorErpOpen(true)}
        onOpenVipLoyalty={() => setIsVipLoyaltyOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {activeView === 'api' ? (
          <ApiPortalView onBackToStore={() => setActiveView('store')} />
        ) : (
          <>
            {/* Editorial Hero Banner */}
            <Hero onShopNow={() => setSelectedCategory('all')} />

            {/* Catalog Section Header & Filter Controls */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-gold">AUTUMN EDIT</span>
                    <span className="text-xs text-[var(--text-muted)] font-semibold">{products.length} Products</span>
                  </div>
                  <h2 className="text-3xl font-extrabold font-['Outfit']">
                    {selectedCategory === 'all' ? 'All Collections' : categories.find(c => c.slug === selectedCategory)?.name || 'Curated Selection'}
                  </h2>
                </div>

                {/* Sort & Filter Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full px-4 py-2 text-xs">
                    <SlidersHorizontal className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span className="font-bold text-[var(--text-muted)] hidden sm:inline">SORT BY:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-transparent text-[var(--text-primary)] font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="featured" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Featured</option>
                      <option value="price_asc" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Price: Low to High</option>
                      <option value="price_desc" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Price: High to Low</option>
                      <option value="rating" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="py-24 text-center text-[var(--text-muted)] font-bold animate-pulse">
                  Curating luxury catalog...
                </div>
              ) : products.length === 0 ? (
                <div className="py-24 text-center space-y-3">
                  <Sparkles className="w-12 h-12 mx-auto text-[var(--accent-gold)] opacity-40" />
                  <h3 className="font-bold text-lg">No products found</h3>
                  <p className="text-xs text-[var(--text-muted)]">Try adjusting your search keywords or category filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
                      isWishlisted={wishlist.some(w => w.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}

              {/* AI Smart Recommendation Engine */}
              <SmartRecommendationEngine
                allProducts={products}
                onSelectProduct={(p) => setQuickViewProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-[var(--border-subtle)] py-12 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-extrabold text-xl tracking-wider font-['Outfit'] gold-text">STYLEHUB</span>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Curating the world's finest Italian cashmere, leather coats, bespoke tailoring, and luxury accessories.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--accent-gold)] mb-3">Collections</h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li><button onClick={() => setSelectedCategory('outerwear')} className="hover:text-white">Outerwear & Coats</button></li>
              <li><button onClick={() => setSelectedCategory('womens-fashion')} className="hover:text-white">Women's Couture</button></li>
              <li><button onClick={() => setSelectedCategory('mens-luxury')} className="hover:text-white">Men's Bespoke</button></li>
              <li><button onClick={() => setSelectedCategory('footwear')} className="hover:text-white">Luxury Footwear</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--accent-gold)] mb-3">Client Services</h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li><button onClick={() => setIsDashboardOpen(true)} className="hover:text-white">Order Tracking</button></li>
              <li><button onClick={() => setIsVipLoyaltyOpen(true)} className="hover:text-white">VIP Loyalty Program</button></li>
              <li><button onClick={() => setIsVendorErpOpen(true)} className="hover:text-white font-bold text-[var(--accent-gold)]">Merchant ERP Portal</button></li>
              <li><a href="#" className="hover:text-white">Authenticity Guarantee</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--accent-gold)] mb-3">Newsletter</h4>
            <p className="text-xs text-[var(--text-muted)] mb-3">Subscribe for exclusive capsule collection releases.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter client email..."
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
              />
              <button className="btn-gold !py-1.5 !px-3 !text-xs">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[var(--border-subtle)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-muted)]">
          <p>© 2026 STYLEHUB Inc. All rights reserved.</p>
          <p className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Preferences</a>
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlist.some(w => w.id === quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(coupon, discount) => {
          setAppliedCoupon(coupon);
          setDiscountAmount(discount);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        order={activeOrderTracker}
        onClose={() => setActiveOrderTracker(null)}
        onRequestReturn={(orderNum) => setToastMessage(`Return requested for Order #${orderNum}.`)}
      />

      {isVendorErpOpen && (
        <VendorErpDashboard
          sellerProfile={MOCK_SELLER_PROFILE}
          products={products}
          onClose={() => setIsVendorErpOpen(false)}
        />
      )}

      {isVipLoyaltyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <VipLoyaltyProgram
              user={user}
              onRedeemReward={(code) => setToastMessage(`Voucher "${code}" added to your account rewards.`)}
            />
            <button
              onClick={() => setIsVipLoyaltyOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isDashboardOpen && user && (
        <Dashboard
          user={user}
          onClose={() => setIsDashboardOpen(false)}
          orders={orders}
          onTrackOrder={(o) => {
            setActiveOrderTracker(o);
            setIsDashboardOpen(false);
          }}
          sellerProfile={MOCK_SELLER_PROFILE}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setToastMessage(`Signed in as ${loggedInUser.full_name} (${loggedInUser.role}).`);
        }}
      />

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}

export default App;
