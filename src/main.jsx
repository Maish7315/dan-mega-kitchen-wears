import React, { createContext, useContext, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Banknote,
  Bell,
  ChevronDown,
  Clock,
  Facebook,
  Filter,
  Heart,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Moon,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Sun,
  Truck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import './styles.css';

const whatsappNumber = '254700000000';

// Category mapping with folder names
const categoryFolders = {
  Cookware: 'cookwear',
  'Dinner Sets': 'dinner set',
  'Kitchen Appliances': 'kitchen appliances',
  'Storage Solutions': 'storage solutions',
  Glassware: 'glass wear',
  Cutlery: 'cutlery',
  Hotpots: 'hotpots',
  'Kitchen Organizers': 'kitchen organisers',
  Bakeware: 'bake ware',
  'Cleaning Supplies': 'cleaning suppliers',
  'Restaurant Supplies': 'restaurant supplies',
  'Wholesale Packages': 'restaurant supplies',
};

// Helper to parse image names and group by base name
const groupImagesByBaseName = (images) => {
  const groups = {};
  images.forEach(img => {
    const baseName = img.replace(/ \(\d+\)\.jpeg$/, '').replace(/\.jpeg$/, '');
    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(img);
  });
  
  // Sort variants for consistent ordering
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => {
      const aNum = a.match(/\((\d+)\)/)?.[1] ? parseInt(a.match(/\((\d+)\)/)[1]) : 0;
      const bNum = b.match(/\((\d+)\)/)?.[1] ? parseInt(b.match(/\((\d+)\)/)[1]) : 0;
      return aNum - bNum;
    });
  });
  
  return groups;
};

// Image data for each category folder
const imagesByFolder = {
  cookwear: [
    'cooking-essentials.jpeg', 'cooking-essentials (2).jpeg', 'cooking-essentials (3).jpeg', 'cooking-essentials (4).jpeg', 'cooking-essentials (5).jpeg',
    'non-stick-pans.jpeg', 'non-stick-pans (2).jpeg',
    'pressure-cooker.jpeg', 'pressure-cooker (2).jpeg', 'pressure-cooker (3).jpeg',
    'sufuria.jpeg',
    'sufurias.jpeg', 'sufurias (2).jpeg', 'sufurias-4.jpeg',
  ],
  'dinner set': [
    'ceramic.jpeg', 'ceramic (2).jpeg', 'ceramic (3).jpeg',
    'luxury-serving-set.jpeg', 'luxury-serving-set (2).jpeg', 'luxury-serving-set (3).jpeg',
    'melamine.jpeg', 'melamine (2).jpeg', 'melamine (3).jpeg',
    'porcelain.jpeg', 'porcelain (2).jpeg', 'porcelain (3).jpeg',
  ],
  'kitchen appliances': [
    'blenders.jpeg', 'blenders (2).jpeg', 'blenders (3).jpeg',
    'cookers.jpeg', 'cookers (2).jpeg', 'cookers (3).jpeg',
    'counter-top-helpers.jpeg', 'counter-top-helpers (2).jpeg', 'counter-top-helpers (3).jpeg',
    'kettle.jpeg', 'kettle (2).jpeg', 'kettle (3).jpeg',
    'mixers.jpeg', 'mixers (2).jpeg', 'mixers (3).jpeg',
    'toasters.jpeg', 'toasters (2).jpeg', 'toaster (3).jpeg',
  ],
  'storage solutions': [
    'airtight-containers.jpeg', 'airtight-containers (2).jpeg', 'airtight-containers (3).jpeg',
    'pantry-organisations.jpeg', 'pantry-organisations (2).jpeg', 'pantry-organisations (3).jpeg',
    'racks.jpeg', 'racks (2).jpeg', 'racks (3).jpeg', 'racks (4).jpeg',
    'spice-jars.jpeg', 'spice-jars (2).jpeg', 'spice-jars (3).jpeg',
  ],
  'glass wear': [
    'elegant-table-service.jpeg', 'elegant-table-service (2).jpeg', 'elegant-table-service (3).jpeg',
    'jugs.jpeg', 'jugs (2).jpeg', 'jugs (3).jpeg',
    'mugs.jpeg', 'mugs (2).jpeg', 'mugs (3).jpeg',
    'tamblers.jpeg', 'tamblers (2).jpeg', 'tamblers (3).jpeg',
    'wine-glasses.jpeg', 'wine-glasses (2).jpeg', 'wine-glasses (3).jpeg',
  ],
  cutlery: [
    'forks.jpeg', 'forks (2).jpeg', 'forks (3).jpeg',
    'knife-set.jpeg', 'knife-set (2).jpeg', 'knife-set (3).jpeg',
    'serving-tools.jpeg', 'serving-tools (2).jpeg', 'serving-tools (3).jpeg',
    'spoons.jpeg', 'spoons (2).jpeg', 'spoons (3).jpeg',
    'stainless-steel-ranges.jpeg', 'stainless-steel-ranges (2).jpeg', 'stainless-steel-ranges (3).jpeg',
  ],
  hotpots: [
    'food-warmers.jpeg', 'food-warmers (2).jpeg', 'food-warmers (3).jpeg', 'food-warmers (4).jpeg',
    'offies.jpeg',
    'restaurants.jpeg',
    'weddings.jpeg',
  ],
  'kitchen organisers': [
    'cabinet-systems.jpeg', 'cabinet-systems (2).jpeg', 'cabinet-systems (3).jpeg',
    'holders.jpeg', 'holders (2).jpeg', 'holders (3).jpeg',
    'hooks.jpeg', 'hooks (2).jpeg', 'hooks (3).jpeg',
    'shelves.jpeg', 'shelves (2).jpeg', 'shelves (3).jpeg',
    'space-saving-dish-rack.jpeg', 'space-saving-dish-rack (2).jpeg', 'space-saving-dish-rack (3).jpeg',
  ],
  'bake ware': [
    'cake-tins.jpeg', 'cake-tins (2).jpeg', 'cake-tins (3).jpeg',
    'mixer.jpeg', 'mixer (2).jpeg', 'mixer (3).jpeg',
    'pastry.jpeg', 'pastry (2).jpeg', 'pastry (3).jpeg',
    'rolling-pins.jpeg', 'rolling-pins (2).jpeg', 'rolling-pins (3).jpeg',
    'trays.jpeg', 'trays (2).jpeg', 'trays (3).jpeg',
  ],
  'cleaning suppliers': [
    'bin.jpeg', 'bin (2).jpeg', 'bin (3).jpeg',
    'brushes.jpeg', 'brushes (2).jpeg', 'brushes (3).jpeg',
    'detergents.jpeg', 'detergents (2).jpeg', 'detergents (3).jpeg',
    'gloves.jpeg', 'gloves (2).jpeg', 'gloves (3).jpeg',
    'kitchen-hygiene-tools.jpeg', 'kitchen-hygiene-tools (2).jpeg', 'kitchen-hygiene-tools (3).jpeg',
    'mops.jpeg', 'mops (2).jpeg', 'mops (3).jpeg',
  ],
  'restaurant supplies': [
    'cafes.jpeg', 'cafes (2).jpeg', 'cafes (3).jpeg',
    'caterers.jpeg', 'caterers (2).jpeg', 'caterers (3).jpeg',
    'commercial-grade-supplies.jpeg', 'commercial-grade-supplies (2).jpeg', 'commercial-grade-supplies (3).jpeg',
    'schools.jpeg', 'schools (2).jpeg', 'schools (3).jpeg',
  ],
};

// Build product images mapping: { category: { productType: { main, variants: [] } } }
const allCategoryProducts = {};
Object.entries(categoryFolders).forEach(([categoryName, folderName]) => {
  const grouped = groupImagesByBaseName(imagesByFolder[folderName]);
  allCategoryProducts[categoryName] = {};
  
  Object.entries(grouped).forEach(([baseName, images]) => {
    allCategoryProducts[categoryName][baseName] = {
      main: `/assets/${folderName}/${images[0]}`,
      variants: images.slice(1).map(img => `/assets/${folderName}/${img}`),
      all: images.map(img => `/assets/${folderName}/${img}`),
    };
  });
});

// Category display images - use first product from each category
const categoryImages = {};
const categories = [];
Object.entries(categoryFolders).forEach(([categoryName, folderName], index) => {
  const firstProduct = Object.values(allCategoryProducts[categoryName])[0];
  categoryImages[categoryName] = firstProduct.main;
  
  categories.push({
    id: categoryName.toLowerCase().replaceAll(' ', '-'),
    name: categoryName,
    count: [38, 46, 29, 33, 25, 31, 18, 27, 22, 21, 44, 16][index],
    description: [
      'Sufurias, non-stick pans, pressure cookers, and daily cooking essentials.',
      'Ceramic, porcelain, melamine, and luxury serving sets for every home.',
      'Blenders, kettles, cookers, toasters, mixers, and countertop helpers.',
      'Airtight containers, spice jars, racks, and pantry organization.',
      'Tumblers, wine glasses, mugs, jugs, and elegant table service.',
      'Knife sets, spoons, forks, serving tools, and stainless steel ranges.',
      'Food warmers for homes, offices, restaurants, weddings, and events.',
      'Space-saving dish racks, shelves, holders, hooks, and cabinet systems.',
      'Cake tins, trays, mixers, rolling pins, and pastry accessories.',
      'Mops, brushes, bins, gloves, detergents, and kitchen hygiene tools.',
      'Commercial-grade supplies for hotels, schools, cafes, and caterers.',
      'Ready bundles for retailers, institutions, weddings, and bulk buyers.',
    ][index],
    image: categoryImages[categoryName],
  });
});

// All product images for display (main image from each product type)
const productImages = [];
Object.values(allCategoryProducts).forEach(categoryProds => {
  Object.values(categoryProds).forEach(prod => {
    productImages.push(prod.main);
  });
});

// Product types list for generation (with image data)
const productImagesByType = [];
Object.values(allCategoryProducts).forEach(categoryProds => {
  Object.entries(categoryProds).forEach(([name, data]) => {
    productImagesByType.push({
      name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      images: data.all,
      variants: data.variants,
    });
  });
});

const brands = ['Dan Mega Select', 'Royal Chef', 'Prestige Home', 'Mika', 'Ramtons', 'Nunix', 'KitchenPro', 'HomeBest', 'ChefMate', 'EliteServe'];
const productTypes = {
  Cookware: ['Non-Stick Frying Pan', 'Granite Sufuria Set', 'Pressure Cooker', 'Cast Iron Grill Pan', 'Stainless Steel Pot', 'Chapati Pan', 'Casserole Pot'],
  'Dinner Sets': ['18pc Dinner Set', 'Melamine Plate Set', 'Soup Bowl Set', 'Ceramic Serving Set', 'Side Plate Pack', 'Luxury Table Set'],
  'Kitchen Appliances': ['Electric Kettle', 'Heavy Duty Blender', 'Sandwich Maker', 'Rice Cooker', 'Hand Mixer', 'Air Fryer', 'Gas Burner'],
  'Storage Solutions': ['Airtight Container Set', 'Spice Jar Rack', 'Pantry Basket', 'Lunch Box Set', 'Cereal Dispenser', 'Fridge Organizer'],
  Glassware: ['Glass Tumbler Set', 'Water Jug Set', 'Tea Mug Set', 'Wine Glass Pack', 'Juice Dispenser', 'Glass Bowl Set'],
  Cutlery: ['24pc Cutlery Set', 'Chef Knife Set', 'Serving Spoon Pack', 'Steak Knife Set', 'Golden Spoon Set', 'Kitchen Scissors'],
  Hotpots: ['Insulated Hotpot', '3pc Hotpot Set', 'Event Food Warmer', 'Thermal Serving Dish', 'Family Hotpot Combo'],
  'Kitchen Organizers': ['Dish Rack', 'Wall Spice Shelf', 'Cutlery Drainer', 'Sink Organizer', 'Under-Sink Rack', 'Cabinet Divider'],
  Bakeware: ['Cake Tin Set', 'Baking Tray', 'Measuring Cup Set', 'Rolling Pin', 'Silicone Moulds', 'Pastry Brush Kit'],
  'Cleaning Supplies': ['Spin Mop Set', 'Dish Brush Pack', 'Kitchen Bin', 'Microfiber Cloth Set', 'Scrub Sponge Pack', 'Cleaning Gloves'],
  'Restaurant Supplies': ['Commercial Stock Pot', 'Buffet Chafing Dish', 'Restaurant Plate Pack', 'Serving Trolley', 'Hotel Cutlery Bundle', 'Catering Tray Set'],
  'Wholesale Packages': ['Starter Retail Bundle', 'Restaurant Opening Kit', 'School Kitchen Pack', 'Wedding Service Package', 'Hotel Essentials Bundle'],
};

const makeProducts = () => {
  const items = [];
  let id = 1;
  categories.forEach((category, catIndex) => {
    const types = productTypes[category.name];
    const categoryProds = allCategoryProducts[category.name];
    const categoryProdsList = Object.entries(categoryProds);
    
    for (let i = 0; i < (category.name === 'Wholesale Packages' ? 12 : 18); i += 1) {
      const type = types[i % types.length];
      const brand = brands[(i + catIndex) % brands.length];
      const base = 850 + ((i * 470 + catIndex * 680) % 18200);
      const discount = [0, 5, 8, 10, 12, 15, 18, 22, 28][(i + catIndex) % 9];
      const rating = Math.min(5, 4.1 + ((i + catIndex) % 9) / 10);
      
      // Get product image data from local assets
      const prodIndex = i % categoryProdsList.length;
      const [prodName, prodData] = categoryProdsList[prodIndex];
      
      items.push({
        id: String(id),
        slug: `${type}-${brand}-${id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: `${brand} ${type}`,
        brand,
        category: category.name,
        price: Math.round(base / 10) * 10,
        oldPrice: discount ? Math.round((base / (1 - discount / 100)) / 10) * 10 : null,
        discount,
        rating,
        reviews: 18 + ((i * 11 + catIndex * 9) % 390),
        stock: i % 11 === 0 ? 'Limited stock' : i % 13 === 0 ? 'Pre-order' : 'In stock',
        badge: i % 7 === 0 ? 'Best Seller' : i % 5 === 0 ? 'New Arrival' : i % 4 === 0 ? 'Wholesale Deal' : 'Retail Ready',
        image: prodData.main,
        images: prodData.all,
        variants: prodData.variants,
        imageName: prodName,
        description: `Premium ${type.toLowerCase()} for homes, hotels, restaurants, schools, and bulk buyers across Narok and Kenya.`,
        specs: ['Retail and wholesale pricing', 'Durable daily-use quality', 'Packed safely for delivery', 'Available for WhatsApp ordering'],
      });
      id += 1;
    }
  });
  return items;
};

const products = makeProducts();

const reviews = [
  { name: 'Mary Wanjiku', location: 'Narok Town', rating: 5, text: 'The dinner set arrived well packed and looks better than expected. I ordered again for my sister.', helpful: 34, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=95&ixlib=rb-4.0.3' },
  { name: 'Peter Ole Ntutu', location: 'Bomet Road', rating: 5, text: 'Good wholesale prices and fast delivery. The restaurant pack was complete.', helpful: 28, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=95&ixlib=rb-4.0.3' },
  { name: 'Grace Akinyi', location: 'Kisii', rating: 4, text: 'The hotpots keep food warm for hours. WhatsApp ordering was simple and clear.', helpful: 21, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=95&ixlib=rb-4.0.3' },
];

const StoreContext = createContext(null);

function useStore() {
  return useContext(StoreContext);
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('dmkw_cart', []);
  const [wishlist, setWishlist] = useLocalStorage('dmkw_wishlist', []);
  const [theme, setTheme] = useLocalStorage('dmkw_theme', 'light');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const addToCart = (product, qty = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + qty } : item));
      }
      return [...current, { id: product.id, qty }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => {
    setCart((current) => current.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const toggleWishlist = (id) => setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const cartItems = cart.map((item) => ({ ...products.find((product) => product.id === item.id), qty: item.qty })).filter(Boolean);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.round(subtotal * (subtotal > 25000 ? 0.08 : subtotal > 10000 ? 0.04 : 0));
  const delivery = subtotal > 15000 ? 0 : cartItems.length ? 300 : 0;
  const total = subtotal - discount + delivery;

  const value = {
    cart,
    cartItems,
    cartOpen,
    setCartOpen,
    wishlist,
    theme,
    setTheme,
    addToCart,
    updateQty,
    removeFromCart,
    toggleWishlist,
    subtotal,
    discount,
    delivery,
    total,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const money = (value) => `KSh ${value.toLocaleString('en-KE')}`;

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <div className="min-h-screen bg-stone-50 text-gray-950 antialiased dark:bg-gray-950 dark:text-white">
          <ScrollToTop />
          <AnnouncementBar />
          <Header />
          <CartDrawer />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/wholesale" element={<WholesalePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
          <FloatingWhatsApp />
          <Footer />
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnnouncementBar() {
  const messages = ['Free Narok town delivery on orders above KSh 15,000', 'Wholesale discounts for shops, hotels, schools, and restaurants', 'New arrivals every week', 'Flash sale: selected dinner sets up to 28% off'];
  return (
    <div className="bg-emeraldDeep text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-hidden px-4 py-2 text-xs font-semibold sm:text-sm">
        <Bell className="h-4 w-4 shrink-0 text-gold" />
        <div className="flex min-w-max animate-[marquee_28s_linear_infinite] gap-10">
          {[...messages, ...messages].map((message, index) => (
            <span key={`${message}-${index}`}>{message}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { cartItems, wishlist, theme, setTheme, setCartOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const categoryMatches = categories.filter(c => c.name.toLowerCase().includes(query));
    const productMatches = products.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      (p.imageName && p.imageName.toLowerCase().includes(query))
    );
    const allResults = [...categoryMatches.map(c => ({ type: 'category', ...c })), ...productMatches.map(p => ({ type: 'product', ...p }))];
    if (allResults.length === 0) return [];
    return [...allResults.slice(0, 14), { type: 'view-all', id: 'view-all', query: searchQuery }];
  }, [searchQuery]);

  const handleSearchSelect = (item) => {
    if (item.type === 'view-all') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('catalog');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (item.type === 'category') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(item.id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      navigate(`/product/${item.slug}`);
    }
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/92">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button className="rounded-full p-2 text-emeraldDeep dark:text-gold lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          <Menu />
        </button>
        <button className="rounded-full p-2 text-emeraldDeep dark:text-gold md:hidden" onClick={() => setSearchOpen(true)} aria-label="Open search">
          <Search />
        </button>
        <Link to="/" className="flex min-w-max items-center gap-2">
          <img src="/assets/loggo.jpeg" alt="Dan Mega Kitchen Wares" className="h-11 w-11 rounded-md object-cover" loading="eager" />
          <span>
            <span className="block text-sm font-black leading-4 sm:text-base">Dan Mega</span>
            <span className="block text-xs font-semibold text-emerald-700 dark:text-gold">Kitchen Wares</span>
          </span>
        </Link>
        <div className="hidden flex-1 items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-white/5 md:flex relative">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <input 
            className="w-full bg-transparent text-sm outline-none" 
            placeholder="Search cookware, hotpots, dinner sets, restaurant supplies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchQuery(''), 200)}
          />
          {searchOpen && searchQuery.trim() && (
            searchSuggestions.length > 0 ? (
              <motion.div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-md shadow-lg max-h-96 overflow-y-auto z-50" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                {searchSuggestions.map((item) => (
                  <button key={`${item.type}-${item.id}`} className="w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-white/10 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-b-0" onClick={() => handleSearchSelect(item)}>
                    {item.type === 'view-all' ? (
                      <span className="text-emeraldDeep dark:text-gold font-bold text-xs">VIEW ALL RESULTS</span>
                    ) : item.type === 'category' ? (
                      <>
                        <span className="text-emeraldDeep dark:text-gold font-bold text-xs">CATEGORY</span>
                        <span className="font-bold">{item.name}</span>
                      </>
                    ) : (
                      <>
                        <LazyImage src={item.image} alt="" className="h-10 w-10 rounded object-cover" />
                        <div className="min-w-0">
                          <span className="block text-sm font-bold line-clamp-1">{item.title}</span>
                          <span className="text-xs text-emeraldDeep dark:text-gold">{money(item.price)}</span>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-md shadow-lg p-4 z-50" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                No products found for "{searchQuery}"
              </motion.div>
            )
          )}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Link to="/wishlist" className="relative rounded-full p-2 hover:bg-emerald-50 dark:hover:bg-white/10" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-black text-emeraldDeep">{wishlist.length}</span>}
          </Link>
          <button className="relative rounded-full p-2 hover:bg-emerald-50 dark:hover:bg-white/10" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-black text-emeraldDeep">{cartItems.reduce((sum, item) => sum + item.qty, 0)}</span>}
          </button>
          <Link to="/account" className="rounded-full p-2 hover:bg-emerald-50 dark:hover:bg-white/10" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <button className="rounded-full p-2 hover:bg-emerald-50 dark:hover:bg-white/10" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950 md:hidden" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <div className="relative flex w-full items-center gap-2 border-b border-gray-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
              <Search className="h-5 w-5 text-gray-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchSuggestions[0] && handleSearchSelect(searchSuggestions[0])}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            {searchQuery.trim() && (
              searchSuggestions.length > 0 ? (
                <div className="overflow-y-auto px-4 py-2" onClick={(e) => e.stopPropagation()}>
                  {searchSuggestions.map((item) => (
                    <button key={`${item.type}-${item.id}-mobile`} className="w-full text-left py-3 border-b border-gray-100 dark:border-white/10 last:border-b-0 flex items-center gap-3" onClick={() => handleSearchSelect(item)}>
                      {item.type === 'view-all' ? (
                        <span className="font-bold text-emeraldDeep dark:text-gold">View all results for "{searchQuery}"</span>
                      ) : item.type === 'category' ? (
                        <>
                          <span className="text-emeraldDeep dark:text-gold font-bold text-xs">CATEGORY</span>
                          <span className="font-bold">{item.name}</span>
                        </>
                      ) : (
                        <>
                          <LazyImage src={item.image} alt="" className="h-12 w-12 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-bold line-clamp-1">{item.title}</span>
                            <span className="text-xs text-emeraldDeep dark:text-gold">{money(item.price)}</span>
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No products found for "{searchQuery}"</div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <nav className={`${menuOpen ? 'block' : 'hidden'} border-t border-gray-100 bg-white dark:border-white/10 dark:bg-gray-950 lg:block`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-sm font-semibold lg:flex-row lg:items-center lg:gap-2 lg:overflow-x-auto">
          {['Cookware', 'Dinner Sets', 'Kitchen Appliances', 'Storage Solutions', 'Glassware', 'Cutlery', 'Hotpots', 'Kitchen Organizers', 'Bakeware', 'Cleaning Supplies', 'Restaurant Supplies', 'Wholesale Packages', 'New Arrivals', 'Best Sellers', 'Offers'].map((item) => (
            <button key={item} onClick={() => {
              const element = document.getElementById(item.toLowerCase().replaceAll(' ', '-'));
              if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setMenuOpen(false);
            }} className="min-w-max rounded-md px-3 py-2 hover:bg-emerald-50 hover:text-emeraldDeep dark:hover:bg-white/10">
              {item}
            </button>
          ))}
          <Link to="/wholesale" className="rounded-md bg-emeraldDeep px-4 py-2 text-white shadow-glow lg:ml-auto">Wholesale</Link>
        </div>
      </nav>
    </header>
  );
}

function ProductImageGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const zoomLevel = 2.5;
    setZoomPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      bgX: (e.clientX - rect.left) / rect.width * 100,
      bgY: (e.clientY - rect.top) / rect.height * 100,
      zoomLevel,
    });
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      let startX = 0;

      const handleTouchStartSwipe = (e) => {
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
        }
      };

      const handleTouchEndSwipe = (e) => {
        if (!startX) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && activeIndex < images.length - 1) {
            setActiveIndex(activeIndex + 1);
          } else if (diff < 0 && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
          }
        }
        startX = 0;
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener('touchstart', handleTouchStartSwipe);
        container.addEventListener('touchend', handleTouchEndSwipe);
      }
      return () => {
        if (container) {
          container.removeEventListener('touchstart', handleTouchStartSwipe);
          container.removeEventListener('touchend', handleTouchEndSwipe);
        }
      };
    }
  }, [activeIndex, images, isMobile]);

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="image-zoom-container relative h-[420px] w-full overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-white/10 dark:bg-gray-900"
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseEnter={() => !isMobile && setShowZoom(true)}
        onMouseLeave={() => !isMobile && setShowZoom(false)}
        style={{ touchAction: isMobile ? 'pinch-zoom' : 'none' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            alt={alt}
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        {showZoom && !isMobile && (
          <div 
            className="pointer-events-none absolute rounded-full border-2 border-white shadow-lg bg-no-repeat"
            style={{
              left: zoomPos.x - 60,
              top: zoomPos.y - 60,
              width: '120px',
              height: '120px',
              zIndex: 10,
              backgroundImage: `url(${images[activeIndex]})`,
              backgroundPosition: `${zoomPos.bgX}% ${zoomPos.bgY}%`,
              backgroundSize: `250%`,
            }}
          />
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActiveIndex(index)}
            className={`gallery-thumbnail flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
              activeIndex === index ? 'border-emeraldDeep shadow-md' : 'border-gray-100 dark:border-white/10'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <LazyImage 
              src={image} 
              alt={`${alt} thumbnail ${index + 1}`} 
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div ref={imgRef} className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500`}>
        Image unavailable
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      className={`${className} ${loaded ? '' : 'blur-sm scale-105'} transition-all duration-300`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <FeaturedCategories />
      <ProductMarketplace />
      <PromoSections />
      <Reviews />
      <DeliveryFAQ />
    </main>
  );
}

function Hero() {
  const slides = [
    { title: 'Wholesale & Retail Kitchen Solutions', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=95&ixlib=rb-4.0.3', note: 'Bulk-ready supplies for homes, restaurants, schools, hotels, weddings, and retailers.' },
    { title: 'Everything Your Kitchen Needs Under One Roof', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=95&ixlib=rb-4.0.3', note: 'Cookware, dinnerware, appliances, hotpots, organizers, cleaning supplies, and more.' },
    { title: 'Premium Kitchenware At Competitive Prices', image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1400&q=95&ixlib=rb-4.0.3', note: 'Narok-based store serving customers across Kenya through fast WhatsApp checkout.' },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((current) => (current + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [slides.length]);
  const slide = slides[active];
  return (
    <section className="relative min-h-[78vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={slide.title} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <LazyImage src={slide.image} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/72 to-black/20" />
      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center px-4 py-16">
        <motion.div className="max-w-3xl text-white" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-gold" /> Narok, Kenya premium kitchenware marketplace
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{slide.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/88 sm:text-xl">{slide.note}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="rounded-md bg-gold px-6 py-3 font-black text-emeraldDeep shadow-gold">Shop Now</a>
            <a href="#categories" className="rounded-md border border-white/30 bg-white/12 px-6 py-3 font-bold text-white backdrop-blur-md">Browse Categories</a>
            <a href="#flash-sales" className="rounded-md border border-gold/60 px-6 py-3 font-bold text-gold">View Offers</a>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((item, index) => (
          <button key={item.title} className={`h-2.5 rounded-full transition-all ${active === index ? 'w-10 bg-gold' : 'w-2.5 bg-white/70'}`} onClick={() => setActive(index)} aria-label={`Show ${item.title}`} />
        ))}
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-gray-100 bg-white py-5 dark:border-white/10 dark:bg-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {[
          ['12+', 'Years experience', Store],
          ['38K+', 'Products sold', ShoppingBag],
          ['9.6K+', 'Happy customers', BadgeCheck],
          ['4.8/5', 'Google reviews', Star],
        ].map(([value, label, Icon]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-50 text-emeraldDeep dark:bg-white/10 dark:text-gold"><Icon className="h-5 w-5" /></span>
            <span><strong className="block text-xl font-black">{value}</strong><span className="text-sm text-gray-500 dark:text-gray-300">{label}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-14">
      <SectionHeading eyebrow="Shop by category" title="Browse every kitchen department" action="200+ products ready to order" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 12).map((category, index) => (
          <motion.a id={category.id} href="#catalog" key={category.name} className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-gray-900" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }}>
            <div className="relative h-44 overflow-hidden">
              <LazyImage src={category.image} alt={category.name} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-black text-emeraldDeep">{category.count} items</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-black">{category.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-300">{category.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function ProductMarketplace() {
  const [filters, setFilters] = useState({ category: 'All', brand: 'All', rating: 'All', availability: 'All', discount: false, sort: 'Best Selling', maxPrice: 20000 });
  const [visible, setVisible] = useState(36);
  const filtered = useMemo(() => {
    let list = products.filter((product) =>
      (filters.category === 'All' || product.category === filters.category) &&
      (filters.brand === 'All' || product.brand === filters.brand) &&
      (filters.rating === 'All' || product.rating >= Number(filters.rating)) &&
      (filters.availability === 'All' || product.stock === filters.availability) &&
      (!filters.discount || product.discount > 0) &&
      product.price <= filters.maxPrice
    );
    if (filters.sort === 'Price Low') list = list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'Newest') list = list.sort((a, b) => Number(b.id) - Number(a.id));
    if (filters.sort === 'Highest Rated') list = list.sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'Best Selling') list = list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [filters]);
  return (
    <section id="catalog" className="bg-white py-14 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Marketplace catalog" title="Shop retail, wholesale, and restaurant supplies" action={`${filtered.length} matching products`} />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Filters filters={filters} setFilters={setFilters} />
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-stone-50 p-3 dark:border-white/10 dark:bg-gray-950">
              <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="h-4 w-4 text-emeraldDeep dark:text-gold" /> Advanced filters active</div>
              <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-900" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                {['Best Selling', 'Newest', 'Highest Rated', 'Price Low'].map((sort) => <option key={sort}>{sort}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, visible).map((product) => <ProductCard product={product} key={product.id} />)}
            </div>
            {visible < filtered.length && (
              <div className="mt-8 text-center">
                <button className="rounded-md bg-emeraldDeep px-6 py-3 font-black text-white shadow-glow" onClick={() => setVisible(visible + 36)}>Load more products</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Filters({ filters, setFilters }) {
  return (
    <aside className="h-fit rounded-lg border border-gray-100 bg-stone-50 p-4 dark:border-white/10 dark:bg-gray-950 lg:sticky lg:top-36">
      <div className="mb-4 flex items-center gap-2 text-lg font-black"><Filter className="h-5 w-5 text-emeraldDeep dark:text-gold" /> Filters</div>
      <FilterSelect label="Category" value={filters.category} options={['All', ...categories.map((c) => c.name)]} onChange={(category) => setFilters({ ...filters, category })} />
      <FilterSelect label="Brand" value={filters.brand} options={['All', ...brands]} onChange={(brand) => setFilters({ ...filters, brand })} />
      <FilterSelect label="Ratings" value={filters.rating} options={['All', '4.2', '4.5', '4.8']} onChange={(rating) => setFilters({ ...filters, rating })} />
      <FilterSelect label="Availability" value={filters.availability} options={['All', 'In stock', 'Limited stock', 'Pre-order']} onChange={(availability) => setFilters({ ...filters, availability })} />
      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-bold">Max price: {money(filters.maxPrice)}</span>
        <input type="range" min="1000" max="20000" step="500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} className="w-full accent-emeraldDeep" />
      </label>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={filters.discount} onChange={(e) => setFilters({ ...filters, discount: e.target.checked })} className="h-4 w-4 accent-emeraldDeep" />
        Discounted products only
      </label>
    </aside>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-900" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  return (
    <motion.article className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-gray-950" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <Link to={`/product/${product.slug}`}><LazyImage src={product.image} alt={product.title} className="h-full w-full object-cover" /></Link>
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <span className="rounded-full bg-emeraldDeep px-3 py-1 text-xs font-black text-white">{product.badge}</span>
          {product.discount > 0 && <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">-{product.discount}%</span>}
        </div>
        <button className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-sm" onClick={() => toggleWishlist(product.id)} aria-label="Save to wishlist">
          <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-emeraldDeep'}`} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-gold">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 block min-h-12 text-base font-black leading-6 hover:text-emeraldDeep dark:hover:text-gold">{product.title}</Link>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars rating={product.rating} />
          <span className="text-gray-500 dark:text-gray-300">({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <strong className="block text-xl font-black">{money(product.price)}</strong>
            {product.oldPrice && <span className="text-sm text-gray-400 line-through">{money(product.oldPrice)}</span>}
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-black ${product.stock === 'In stock' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{product.stock}</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button className="rounded-md bg-emeraldDeep px-4 py-2 text-sm font-black text-white" onClick={() => addToCart(product)}>Add to cart</button>
          <Link to={`/product/${product.slug}`} className="rounded-md border border-gray-200 px-3 py-2 text-sm font-bold dark:border-white/10">Quick view</Link>
        </div>
      </div>
    </motion.article>
  );
}

function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug) || products[0];
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  
  const gallery = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, categoryImages[product.category], productImages[(Number(product.id) + 3) % productImages.length]];

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImageGallery images={gallery} alt={product.title} />
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700 dark:text-gold">{product.brand} / {product.category}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">{product.title}</h1>
          {product.imageName && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">({product.imageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')})</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3"><Stars rating={product.rating} /><span>{product.rating.toFixed(1)} rating</span><span className="text-gray-400">|</span><span>{product.reviews} reviews</span><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">{product.stock}</span></div>
          <div className="mt-6 rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900">
            <div className="flex items-end gap-3"><strong className="text-4xl font-black">{money(product.price)}</strong>{product.oldPrice && <span className="text-lg text-gray-400 line-through">{money(product.oldPrice)}</span>}</div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{product.description}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">{product.specs.map((spec) => <span key={spec} className="flex items-center gap-2 text-sm"><BadgeCheck className="h-4 w-4 text-emerald-600" /> {spec}</span>)}</div>
<div className="mt-6 flex flex-wrap items-center gap-3">
              <Quantity qty={qty} setQty={setQty} />
              <button className="rounded-md bg-emeraldDeep px-6 py-3 font-black text-white shadow-glow" onClick={() => addToCart(product, qty)}>Add to cart</button>
              <button className="rounded-md border border-gray-200 px-4 py-3 font-bold dark:border-white/10" onClick={() => toggleWishlist(product.id)}>{wishlist.includes(product.id) ? 'Saved' : 'Save to wishlist'}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-2xl font-black">Customer reviews</h2>
          <div className="mt-5 grid gap-4">{reviews.map((review) => <ReviewCard review={review} key={review.name} />)}</div>
        </div>
        <div className="rounded-lg bg-emeraldDeep p-6 text-white shadow-glow">
          <h3 className="text-xl font-black">Frequently bought together</h3>
          <div className="mt-4 space-y-3">{related.slice(0, 3).map((item) => <div key={item.id} className="flex gap-3 rounded-md bg-white/10 p-2"><LazyImage src={item.image} alt="" className="h-14 w-14 rounded object-cover" /><span className="text-sm font-bold">{item.title}<br /><span className="text-gold">{money(item.price)}</span></span></div>)}</div>
        </div>
      </div>
      <SectionHeading eyebrow="Related products" title="Customers also viewed" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard product={item} key={item.id} />)}</div>
    </PageShell>
  );
}

function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, subtotal, discount, delivery, total, updateQty, removeFromCart } = useStore();
  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl dark:bg-gray-950" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Your cart</h2><button onClick={() => setCartOpen(false)}><X /></button></div>
            <div className="mt-5 flex-1 space-y-3 overflow-auto">{cartItems.length ? cartItems.map((item) => <CartLine item={item} key={item.id} updateQty={updateQty} removeFromCart={removeFromCart} />) : <p className="rounded-lg bg-stone-50 p-6 text-center dark:bg-gray-900">Your cart is empty.</p>}</div>
            <OrderSummary subtotal={subtotal} discount={discount} delivery={delivery} total={total} />
            <CheckoutButton />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CartPage() {
  const { cartItems, subtotal, discount, delivery, total, updateQty, removeFromCart } = useStore();
  return (
    <PageShell>
      <h1 className="text-4xl font-black">Cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">{cartItems.map((item) => <CartLine item={item} key={item.id} updateQty={updateQty} removeFromCart={removeFromCart} />)}</div>
        <div><OrderSummary subtotal={subtotal} discount={discount} delivery={delivery} total={total} /><CheckoutButton /></div>
      </div>
    </PageShell>
  );
}

function CartLine({ item, updateQty, removeFromCart }) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-gray-900">
      <LazyImage src={item.image} alt="" className="h-20 w-20 rounded-md object-cover" />
      <div className="min-w-0 flex-1">
        <strong className="line-clamp-2">{item.title}</strong>
        <p className="text-sm text-gray-500">{money(item.price)}</p>
        <div className="mt-2 flex items-center justify-between">
          <Quantity qty={item.qty} setQty={(qty) => updateQty(item.id, qty)} compact />
          <button className="text-sm font-bold text-red-600" onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
}

function Quantity({ qty, setQty, compact }) {
  return (
    <div className={`inline-flex items-center overflow-hidden rounded-md border border-gray-200 dark:border-white/10 ${compact ? 'h-9' : 'h-12'}`}>
      <button className="px-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus className="h-4 w-4" /></button>
      <span className="min-w-10 text-center font-black">{qty}</span>
      <button className="px-3" onClick={() => setQty(qty + 1)} aria-label="Increase"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function OrderSummary({ subtotal, discount, delivery, total }) {
  return (
    <div className="mt-5 rounded-lg bg-stone-50 p-4 dark:bg-gray-900">
      <SummaryRow label="Subtotal" value={money(subtotal)} />
      <SummaryRow label="Bulk discount" value={`-${money(discount)}`} />
      <SummaryRow label="Delivery estimate" value={delivery ? money(delivery) : 'Free'} />
      <div className="mt-3 border-t border-gray-200 pt-3 dark:border-white/10"><SummaryRow label="Total" value={money(total)} strong /></div>
    </div>
  );
}

function SummaryRow({ label, value, strong }) {
  return <div className={`flex items-center justify-between py-1 ${strong ? 'text-xl font-black' : 'text-sm'}`}><span>{label}</span><span>{value}</span></div>;
}

function CheckoutButton() {
  const { cartItems, subtotal, discount, delivery, total } = useStore();
  const navigate = useNavigate();
  const [details, setDetails] = useState({ name: '', phone: '', location: '', notes: '' });
  const update = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  const placeOrder = () => {
    if (!cartItems.length) return navigate('/');
    const lines = cartItems.map((item) => `- ${item.title} x${item.qty}: ${money(item.price * item.qty)}`).join('\n');
    const message = `Hello Dan Mega Kitchen Wares,

I want to place this order:

Customer Name: ${details.name}
Phone Number: ${details.phone}
Location: ${details.location}

Products Ordered:
${lines}

Subtotal: ${money(subtotal)}
Discount: ${money(discount)}
Delivery Estimate: ${delivery ? money(delivery) : 'Free'}
Total Cost: ${money(total)}

Delivery Notes: ${details.notes}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-gray-900">
      <h3 className="mb-3 font-black">Checkout details</h3>
      <div className="grid gap-2">
        <input className="rounded-md border border-gray-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emeraldDeep dark:border-white/10 dark:bg-gray-950" placeholder="Customer name" value={details.name} onChange={(e) => update('name', e.target.value)} />
        <input className="rounded-md border border-gray-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emeraldDeep dark:border-white/10 dark:bg-gray-950" placeholder="Phone number" value={details.phone} onChange={(e) => update('phone', e.target.value)} />
        <input className="rounded-md border border-gray-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emeraldDeep dark:border-white/10 dark:bg-gray-950" placeholder="Delivery location" value={details.location} onChange={(e) => update('location', e.target.value)} />
        <textarea className="min-h-20 rounded-md border border-gray-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-emeraldDeep dark:border-white/10 dark:bg-gray-950" placeholder="Delivery notes" value={details.notes} onChange={(e) => update('notes', e.target.value)} />
      </div>
      <button className="mt-3 w-full rounded-md bg-emeraldDeep px-6 py-3 font-black text-white shadow-glow" onClick={placeOrder}>Place Order via WhatsApp</button>
    </div>
  );
}

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wishlistItems = products.filter((p) => wishlist.includes(p.id));
  if (wishlistItems.length === 0) {
    return (
      <PageShell>
        <h1 className="text-4xl font-black">Wishlist</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Your wishlist is empty. Save items by clicking the heart icon on products.</p>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <h1 className="text-4xl font-black">Wishlist</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{wishlistItems.length} saved items</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((product) => (
          <motion.article key={product.id} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-gray-900" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <Link to={`/product/${product.slug}`}><LazyImage src={product.image} alt={product.title} className="h-full w-full object-cover" /></Link>
              <button className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm" onClick={() => toggleWishlist(product.id)} aria-label="Remove from wishlist">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-gold">{product.brand}</p>
              <Link to={`/product/${product.slug}`} className="mt-1 block text-base font-black hover:text-emeraldDeep dark:hover:text-gold">{product.title}</Link>
              <div className="mt-2 flex items-end justify-between">
                <strong className="text-xl font-black">{money(product.price)}</strong>
                <button className="rounded-md bg-emeraldDeep px-3 py-2 text-sm font-black text-white shadow-glow" onClick={() => addToCart(product)}>Add to cart</button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}

function WholesalePage() {
  const wholesaleProducts = products.filter(p => p.category === 'Wholesale Packages');
  return (
    <PageShell>
      <SectionHeading eyebrow="Wholesale" title="Bulk packages for retailers & institutions" action="Ready to order" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wholesaleProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </PageShell>
  );
}

function AccountPage() {
  return (
    <PageShell>
      <h1 className="text-4xl font-black">My Account</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Account features coming soon.</p>
    </PageShell>
  );
}

function PromoSections() {
  const flashSales = products.filter(p => p.discount >= 15).slice(0, 4);
  return (
    <section id="flash-sales" className="bg-emeraldDeep py-14 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Flash Sales" title="Limited time offers" action="Up to 28% off" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flashSales.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-white py-14 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Reviews" title="What our customers say" action={`${reviews.length} verified reviews`} />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => <ReviewCard review={review} key={review.name} />)}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <motion.div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-950" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="flex items-start gap-3">
        <LazyImage src={review.image} alt="" className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">{review.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">{review.location}</p>
        </div>
      </div>
      <Stars rating={review.rating} />
      <p className="mt-3 text-sm">{review.text}</p>
      <p className="mt-2 text-xs text-emeraldDeep dark:text-gold">{review.helpful} found helpful</p>
    </motion.div>
  );
}

function DeliveryFAQ() {
  const faqs = [
    { q: 'How fast is delivery?', a: 'Orders placed before 2pm are delivered within 24 hours in Narok. Upcountry delivery takes 2-3 days.' },
    { q: 'Do you offer wholesale pricing?', a: 'Yes, bulk discounts start at 50 units per item. Contact us via WhatsApp for custom quotes.' },
    { q: 'What is your return policy?', a: 'Unused items in original packaging can be returned within 7 days for a full refund.' },
    { q: 'Do you deliver outside Narok?', a: 'Yes, we deliver nationwide via courier. Delivery charges apply based on distance.' },
  ];
  return (
    <section className="bg-stone-50 py-14 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="FAQ" title="Delivery & returns" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900">
              <h4 className="font-bold">{faq.q}</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div><h3 className="text-2xl font-black text-gold">Dan Mega Kitchen Wares</h3><p className="mt-3 text-sm leading-7 text-white/70">Premium kitchenware, home essentials, restaurant supplies, and wholesale packages from Narok, Kenya.</p></div>
        <FooterList title="Quick links" items={['Shop', 'Best sellers', 'New arrivals', 'Offers', 'Wholesale']} />
        <FooterList title="Categories" items={categories.slice(0, 6).map((c) => c.name)} />
        <div><h4 className="font-black">Store information</h4><p className="mt-3 text-sm leading-7 text-white/70">Narok, Kenya<br />WhatsApp: +254 700 000 000<br />Email: orders@danmegakitchenwares.co.ke<br />Open Mon-Sat, 8am-6pm</p><div className="mt-4 flex gap-3"><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition" aria-label="Facebook"><Facebook className="h-5 w-5" /></a><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition" aria-label="Instagram"><Instagram className="h-5 w-5" /></a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition" aria-label="WhatsApp"><ShoppingBag className="h-5 w-5" /></a></div></div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }) {
  return <div><h4 className="font-black">{title}</h4><ul className="mt-3 space-y-2 text-sm text-white/70">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function FloatingWhatsApp() {
  return <a href={`https://wa.me/${whatsappNumber}`} className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-glow" aria-label="WhatsApp"><ShoppingBag /></a>;
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-sm font-black uppercase tracking-wide text-emerald-700 dark:text-gold">{eyebrow}</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2></div>
      {action && <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emeraldDeep dark:bg-white/10 dark:text-gold">{action}</p>}
    </div>
  );
}

function Stars({ rating }) {
  return <span className="inline-flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? 'fill-gold text-gold' : 'text-gray-300'}`} />)}</span>;
}

function PageShell({ children }) {
  return <motion.main className="mx-auto max-w-7xl px-4 py-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{children}</motion.main>;
}

createRoot(document.getElementById('root')).render(<App />);
