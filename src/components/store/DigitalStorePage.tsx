import React, { useState, useEffect } from 'react';
import { StoreProduct, StoreCartItem, StoreOrder, StoreSettings } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ShoppingCartDrawer } from './ShoppingCartDrawer';
import { StoreCheckoutModal } from './StoreCheckoutModal';
import { MyLibraryPage } from './MyLibraryPage';
import { AdminStoreDashboard } from './AdminStoreDashboard';
import { AuthorRoyaltyDashboard } from './AuthorRoyaltyDashboard';
import { InteractiveReaderModal } from './InteractiveReaderModal';
import { GrantPermissionModal } from './GrantPermissionModal';

interface DigitalStorePageProps {
  currentUser?: { id: string; name: string; email: string; role: string } | null;
  onNavigate?: (tab: string) => void;
}

export const DigitalStorePage: React.FC<DigitalStorePageProps> = ({
  currentUser,
}) => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'catalog' | 'library' | 'author_royalties' | 'admin'>('catalog');
  const [previewProduct, setPreviewProduct] = useState<StoreProduct | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState<boolean>(false);
  const [grantTargetProduct, setGrantTargetProduct] = useState<StoreProduct | null>(null);
  const [adminModeEnabled, setAdminModeEnabled] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Cart State (Persisted in localStorage for convenience)
  const [cartItems, setCartItems] = useState<StoreCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ilillii_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ilillii_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const loadStoreData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, setRes] = await Promise.all([
        fetch('/api/store/products'),
        fetch('/api/store/settings'),
      ]);
      const prodData = await prodRes.json();
      const setData = await setRes.json();

      if (prodData.success) {
        setProducts(prodData.products || []);
      }
      if (setData.success) {
        setStoreSettings(setData.settings || null);
      }
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  const handleAddToCart = (product: StoreProduct) => {
    if (cartItems.some((it) => it.productId === product.id)) {
      setIsCartOpen(true);
      return;
    }
    setCartItems((prev) => [...prev, { productId: product.id, product, addedAt: new Date().toISOString() }]);
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: StoreProduct) => {
    if (!cartItems.some((it) => it.productId === product.id)) {
      setCartItems((prev) => [...prev, { productId: product.id, product, addedAt: new Date().toISOString() }]);
    }
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (couponCode?: string) => {
    setAppliedCouponCode(couponCode);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: StoreOrder) => {
    setCartItems([]);
    if (order.isFreeOrder) {
      setActiveView('library');
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchAuthor = p.author.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchAuthor && !matchTags) return false;
    }

    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    if (selectedFormat !== 'all' && p.fileFormat.toUpperCase() !== selectedFormat.toUpperCase()) {
      return false;
    }

    if (priceFilter === 'free' && !p.isFree) return false;
    if (priceFilter === 'paid' && p.isFree) return false;

    return true;
  });

  filteredProducts.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'price_low') return a.priceETB - b.priceETB;
    if (sortBy === 'price_high') return b.priceETB - a.priceETB;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const totalCartCount = cartItems.length;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin' || adminModeEnabled;

  if (activeView === 'library') {
    return (
      <MyLibraryPage
        currentUser={currentUser}
        onBrowseStore={() => setActiveView('catalog')}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    );
  }

  if (activeView === 'author_royalties') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs hover:opacity-90 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Digital Store
          </button>
        </div>
        <AuthorRoyaltyDashboard currentUser={currentUser} />
      </div>
    );
  }

  if (activeView === 'admin') {
    return (
      <AdminStoreDashboard
        currentUser={currentUser}
        onClose={() => setActiveView('catalog')}
      />
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Top Header Notice if available */}
      {storeSettings?.storeNotice && (
        <div className="bg-primary text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">campaign</span>
          {storeSettings.storeNotice}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
                <span className="material-symbols-outlined text-2xl">local_mall</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  Wirtuu Kompiitaraa Ilillii Digital Store
                </h1>
                <p className="text-xs text-slate-400">
                  Direct educational press, audiobooks, cybersecurity manuals & templates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-my-library"
                onClick={() => setActiveView('library')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">folder_special</span>
                My Library
              </button>

              <button
                type="button"
                id="btn-author-royalties"
                onClick={() => setActiveView('author_royalties')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">payments</span>
                Author Royalties
              </button>

              <button
                type="button"
                id="btn-admin-store-dash"
                onClick={() => setActiveView('admin')}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                Store Admin Panel
              </button>

              <button
                type="button"
                id="btn-quick-grant-permission"
                onClick={() => {
                  setGrantTargetProduct(null);
                  setIsGrantModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">vpn_key</span>
                Give Permission
              </button>

              <button
                type="button"
                id="btn-open-cart"
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Cart
                {totalCartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-black">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Admin Store Control Ribbon */}
          {isAdmin && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">shield</span>
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
                    Admin Digital Store Command & Permission Control
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      ADMIN PERMISSIONS: ENGAGED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Control store access, issue lifetime or timed scholar download waivers, manage prices & audit store logs.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-ribbon-give-perm"
                  onClick={() => {
                    setGrantTargetProduct(null);
                    setIsGrantModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">vpn_key</span>
                  Give Download Permission
                </button>

                <button
                  type="button"
                  id="btn-ribbon-admin-dashboard"
                  onClick={() => setActiveView('admin')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Manage Store Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Hero Pitch & Search */}
          <div className="max-w-3xl space-y-4 pt-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Empower Your Skills with Verified <span className="text-primary">Digital Resources</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Authentic materials in Afaan Oromoo and English. Instant secure downloads, verified Ethiopian payment processing (CBE, Telebirr, Safaricom M-Pesa), and continuous lifetime version updates.
            </p>

            {/* Live Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, English slang audio, SOC handbooks, templates, or keywords..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-zinc-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
        {/* Category Pills Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Resources', icon: 'apps' },
              { id: 'Books', label: 'Books & E-Books', icon: 'menu_book' },
              { id: 'Audio', label: 'Audio Lessons', icon: 'headphones' },
              { id: 'Video', label: 'Video Courses', icon: 'play_circle' },
              { id: 'Documents', label: 'PDF & Word Docs', icon: 'description' },
              { id: 'Presentations', label: 'Presentation Slides', icon: 'slideshow' },
              { id: 'Graphics', label: 'Graphic Assets', icon: 'palette' },
              { id: 'Software', label: 'Templates & Code', icon: 'code' },
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Price & Sort Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="MP3">Audio (MP3)</option>
              <option value="MP4">Video (MP4)</option>
              <option value="PPTX">PowerPoint (PPTX)</option>
              <option value="ZIP">Archive (ZIP)</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Pricing</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Releases</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Marketplace Catalog</span>
              <span className="text-xs font-normal text-slate-500">
                ({filteredProducts.length} items found)
              </span>
            </h3>

            {(selectedCategory !== 'all' || selectedFormat !== 'all' || priceFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFormat('all');
                  setPriceFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
              <h4 className="font-bold text-base text-slate-800 dark:text-zinc-200">No matching products found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords, format filters, or category selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  isInCart={cartItems.some((it) => it.productId === product.id)}
                  isAdmin={isAdmin}
                  onGrantPermission={(p) => {
                    setGrantTargetProduct(p);
                    setIsGrantModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => handleAddToCart(p)}
          onBuyNow={(p) => handleBuyNow(p)}
          isInCart={cartItems.some((it) => it.productId === selectedProduct.id)}
          currentUser={currentUser}
          onReviewSubmitted={() => loadStoreData()}
          isAdmin={isAdmin}
          onGrantPermission={(p) => {
            setGrantTargetProduct(p);
            setIsGrantModalOpen(true);
          }}
        />
      )}

      {/* Admin Grant Permission Modal */}
      {isGrantModalOpen && (
        <GrantPermissionModal
          isOpen={isGrantModalOpen}
          onClose={() => setIsGrantModalOpen(false)}
          products={products}
          preselectedProduct={grantTargetProduct}
          onSuccess={(msg) => {
            showToast(msg);
          }}
        />
      )}

      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && storeSettings && (
        <StoreCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          appliedCoupon={appliedCouponCode}
          storeSettings={storeSettings}
          currentUser={currentUser}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* Interactive Reader Preview Modal */}
      {previewProduct && (
        <InteractiveReaderModal
          isOpen={!!previewProduct}
          onClose={() => setPreviewProduct(null)}
          product={previewProduct}
        />
      )}
    </div>
  );
};
