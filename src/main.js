import "./index.css";
import { 
  fetchProducts, 
  saveOrder, 
  trackOrders, 
  fetchAllOrders, 
  updateOrderStatus 
} from "./lib/firebase";
import { 
  triggerGoogleSheetsSync, 
  uploadPdfToCloud, 
  getPdfTemplateHtml
} from "./lib/pdfAndSheetsSync";
import { 
  getWholesalePriceForProduct, 
  getProductMinOrderQuantity, 
  getProductPriceForSize, 
  getPackagingInfo, 
  getSizeDetails
} from "./types";

// App State
let products = [];
let filteredProducts = [];
let cart = [];
let currentView = "home";

// Filters state
let selectedCategory = "all";
let selectedPetType = "all";
let searchTerm = "";

// Coupon state
let couponCode = "";
let discountPercentage = 0;

// Detail Modal active state
let selectedProduct = null;
let selectedSize = "";
let selectedColor = "";
let selectedQty = 12;

// Successful Order state
let currentOrder = null;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Restore cart
  const savedCart = localStorage.getItem("patitas_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to parse cart", e);
    }
  }

  // Bind All Event Listeners immediately so UI is responsive right away
  bindNavListeners();
  bindFilterListeners();
  bindSearchListeners();
  bindCartDrawerListeners();
  bindDetailModalListeners();
  bindCheckoutFormListeners();
  bindTrackerListeners();
  bindAdminListeners();
  bindPromoBannerListener();

  // Initial UI Render
  navigate("home");
  updateCartUI();

  // Load products from firebase asynchronously (non-blocking)
  loadCatalog();
});

// Load catalog products from Firebase Firestore
async function loadCatalog() {
  const loadingEl = document.getElementById("catalog-loading");
  const gridEl = document.getElementById("products-grid");

  try {
    products = await fetchProducts();
    filteredProducts = [...products];
    
    if (loadingEl) loadingEl.classList.add("hidden");
    if (gridEl) gridEl.classList.remove("hidden");
    
    filterAndRenderProducts();
  } catch (error) {
    console.error("Error loading products catalog", error);
    showToast("Error al cargar productos de Firestore", "info");
  }
}

// NAVIGATION FLOW MANAGEMENT
function navigate(view) {
  currentView = view;
  
  // Update view containers visibility
  const views = ["home", "checkout", "success", "tracker", "admin", "about", "contact"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === view) {
        el.classList.remove("hidden");
        el.classList.add("block");
      } else {
        el.classList.remove("block");
        el.classList.add("hidden");
      }
    }
  });

  // Update active state in Navigation links
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("text-[#A66C33]", "border-[#A66C33]"));
  document.querySelectorAll(".mob-link").forEach(btn => btn.classList.remove("text-[#A66C33]"));

  // Set active class
  const activeBtnMap = {
    home: "nav-inicio-btn",
    about: "nav-nosotros-btn",
    contact: "nav-contacto-btn",
    tracker: "nav-tracker-btn",
    admin: "nav-admin-btn"
  };
  
  const activeMobMap = {
    home: "mob-inicio",
    about: "mob-nosotros",
    contact: "mob-contacto",
    tracker: "mob-tracker",
    admin: "mob-admin"
  };

  const desktopBtnId = activeBtnMap[view];
  if (desktopBtnId) {
    const btn = document.getElementById(desktopBtnId);
    if (btn) btn.classList.add("text-[#A66C33]", "border-[#A66C33]");
  }

  const mobBtnId = activeMobMap[view];
  if (mobBtnId) {
    const btn = document.getElementById(mobBtnId);
    if (btn) btn.classList.add("text-[#A66C33]");
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Load data specific to view
  if (view === "admin") {
    loadAdminOrders();
  }
}

// BIND NAVIGATION EVENTS
function bindNavListeners() {
  // Logo trigger
  const logoBtn = document.getElementById("nav-logo-btn");
  if (logoBtn) {
    logoBtn.addEventListener("click", () => navigate("home"));
  }

  // Desktop Links
  const navMap = {
    "nav-inicio-btn": "home",
    "nav-tienda-btn": "home",
    "nav-nosotros-btn": "about",
    "nav-contacto-btn": "contact",
    "nav-tracker-btn": "tracker",
    "nav-admin-btn": "admin"
  };

  Object.entries(navMap).forEach(([id, view]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        if (id === "nav-tienda-btn") {
          navigate("home");
          setTimeout(() => {
            document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        } else {
          navigate(view);
        }
      });
    }
  });

  // Mobile drawer links
  const mobMap = {
    "mob-inicio": "home",
    "mob-tienda": "home",
    "mob-nosotros": "about",
    "mob-contacto": "contact",
    "mob-tracker": "tracker",
    "mob-admin": "admin"
  };

  Object.entries(mobMap).forEach(([id, view]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        closeMobileMenu();
        if (id === "mob-tienda") {
          navigate("home");
          setTimeout(() => {
            document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        } else {
          navigate(view);
        }
      });
    }
  });

  // Mobile hamburger menu toggler
  const mobMenuBtn = document.getElementById("mobile-menu-btn");
  const mobDrawer = document.getElementById("mobile-menu-drawer");
  const mobCloseBtn = document.getElementById("mobile-menu-close");

  if (mobMenuBtn && mobDrawer) {
    mobMenuBtn.addEventListener("click", () => {
      mobDrawer.classList.remove("hidden");
    });
  }

  if (mobCloseBtn && mobDrawer) {
    mobCloseBtn.addEventListener("click", () => {
      mobDrawer.classList.add("hidden");
    });
  }

  // Footer Links to Views
  document.querySelectorAll(".footer-view-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const view = e.currentTarget.getAttribute("data-view");
      if (view) navigate(view);
    });
  });
}

function closeMobileMenu() {
  const mobDrawer = document.getElementById("mobile-menu-drawer");
  if (mobDrawer) mobDrawer.classList.add("hidden");
}

// BIND CATALOG FILTER EVENTS
function bindFilterListeners() {
  // Pet Type Filters
  const petBtns = document.querySelectorAll(".pet-filter-btn");
  petBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      petBtns.forEach(b => b.classList.remove("bg-white", "shadow-sm", "text-[#3E2723]"));
      petBtns.forEach(b => b.classList.add("text-[#8D7B68]"));

      const target = e.currentTarget;
      target.classList.add("bg-white", "shadow-sm", "text-[#3E2723]");
      target.classList.remove("text-[#8D7B68]");

      selectedPetType = target.getAttribute("data-type");
      filterAndRenderProducts();
    });
  });

  // Category Filters
  const catBtns = document.querySelectorAll(".category-btn");
  catBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      catBtns.forEach(b => {
        b.classList.remove("bg-[#A66C33]", "text-white", "border-[#A66C33]");
        b.classList.add("border-[#EBE3D5]", "text-[#8D7B68]");
      });

      const target = e.currentTarget;
      target.classList.add("bg-[#A66C33]", "text-white", "border-[#A66C33]");
      target.classList.remove("border-[#EBE3D5]", "text-[#8D7B68]");

      selectedCategory = target.getAttribute("data-category") || "all";
      filterAndRenderProducts();
    });
  });

  // Footer Category Filters
  document.querySelectorAll(".footer-cat-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cat = e.currentTarget.getAttribute("data-cat") || "all";
      navigate("home");
      
      // Update primary category buttons
      const catBtns = document.querySelectorAll(".category-btn");
      catBtns.forEach(b => {
        const itemCat = b.getAttribute("data-category") || "all";
        if (itemCat === cat) {
          b.classList.add("bg-[#A66C33]", "text-white", "border-[#A66C33]");
          b.classList.remove("border-[#EBE3D5]", "text-[#8D7B68]");
        } else {
          b.classList.remove("bg-[#A66C33]", "text-white", "border-[#A66C33]");
          b.classList.add("border-[#EBE3D5]", "text-[#8D7B68]");
        }
      });

      selectedCategory = cat;
      filterAndRenderProducts();

      setTimeout(() => {
        document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    });
  });

  // Reset Filters Empty State
  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      selectedCategory = "all";
      selectedPetType = "all";
      searchTerm = "";
      
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = "";

      // Reset main button states
      const catBtns = document.querySelectorAll(".category-btn");
      catBtns.forEach(b => {
        if (b.getAttribute("data-category") === "all") {
          b.classList.add("bg-[#A66C33]", "text-white", "border-[#A66C33]");
        } else {
          b.classList.remove("bg-[#A66C33]", "text-white", "border-[#A66C33]");
          b.classList.add("border-[#EBE3D5]", "text-[#8D7B68]");
        }
      });

      const petBtns = document.querySelectorAll(".pet-filter-btn");
      petBtns.forEach(b => {
        if (b.getAttribute("data-type") === "all") {
          b.classList.add("bg-white", "shadow-sm", "text-[#3E2723]");
        } else {
          b.classList.remove("bg-white", "shadow-sm", "text-[#3E2723]");
          b.classList.add("text-[#8D7B68]");
        }
      });

      filterAndRenderProducts();
    });
  }

  // Hero Shop Button scroll down
  const heroShopBtn = document.getElementById("hero-comprar-btn");
  if (heroShopBtn) {
    heroShopBtn.addEventListener("click", () => {
      document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Hero About Button
  const heroAboutBtn = document.getElementById("hero-nosotros-btn");
  if (heroAboutBtn) {
    heroAboutBtn.addEventListener("click", () => navigate("about"));
  }
}

// SEARCH BAR EVENTS
function bindSearchListeners() {
  const searchToggle = document.getElementById("search-toggle-btn");
  const searchDropdown = document.getElementById("search-dropdown");
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear-btn");

  if (searchToggle && searchDropdown) {
    searchToggle.addEventListener("click", () => {
      searchDropdown.classList.toggle("hidden");
      if (!searchDropdown.classList.contains("hidden") && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      filterAndRenderProducts();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      searchTerm = "";
      filterAndRenderProducts();
    });
  }
}

// LIVE PRODUCT CATALOG FILTER & DRAW
function filterAndRenderProducts() {
  filteredProducts = products.filter(p => {
    // Category match
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    
    // Pet type match
    const matchPet = selectedPetType === "all" || p.petType === selectedPetType || p.petType === "ambos";
    
    // Keyword search match
    const q = searchTerm.trim().toLowerCase();
    const matchSearch = q === "" || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q);

    return matchCat && matchPet && matchSearch;
  });

  renderCatalogGrid();
}

// RENDERING THE PRODUCT TILES GRID
function renderCatalogGrid() {
  const gridEl = document.getElementById("products-grid");
  const emptyEl = document.getElementById("catalog-empty");

  if (!gridEl) return;
  gridEl.innerHTML = "";

  if (filteredProducts.length === 0) {
    gridEl.classList.add("hidden");
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  if (emptyEl) emptyEl.classList.add("hidden");
  gridEl.classList.remove("hidden");

  filteredProducts.forEach(prod => {
    const card = document.createElement("div");
    card.id = `prod-card-${prod.id}`;
    card.className = "group bg-white border border-[#EBE3D5] rounded-[24px] overflow-hidden soft-shadow card-hover flex flex-col justify-between cursor-pointer";
    
    const defaultSize = prod.sizes[0];
    const defaultColor = prod.colors[0];
    const minQty = getProductMinOrderQuantity(prod, defaultSize);
    
    const maxWholesale = getWholesalePriceForProduct(prod, defaultSize, minQty);
    const minWholesale = getWholesalePriceForProduct(prod, defaultSize, 48);

    // Optional tags
    const tagHtml = prod.tag ? `
      <div class="absolute top-3 right-3 bg-[#3E2723] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
        ${prod.tag}
      </div>
    ` : "";

    card.innerHTML = `
      <div class="relative bg-[#FCF9F2] p-6 h-[240px] flex items-center justify-center overflow-hidden">
        <img src="${prod.images[0]}" alt="${prod.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
        
        <!-- Min Order MOQ Tag -->
        <div class="absolute top-3 left-3 bg-[#A66C33] text-white px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
          <i data-lucide="package" class="w-3 h-3"></i>
          Lote Mín: ${minQty}u
        </div>

        ${tagHtml}

        <!-- Quick Action Overlay -->
        <div class="absolute inset-0 bg-[#3E2723]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button id="quick-view-btn-${prod.id}" class="p-3 bg-white text-[#3E2723] rounded-full hover:bg-[#A66C33] hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-md" title="Ver Detalle">
            <i data-lucide="eye" class="w-5 h-5"></i>
          </button>
          <button id="quick-add-btn-${prod.id}" class="p-3 bg-white text-[#C87941] rounded-full hover:bg-[#C87941] hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-md delay-75" title="Añadir Lote Mayorista (${minQty} uds)">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Info Details -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-1.5 text-left">
          <span class="text-[9px] font-mono tracking-widest text-[#A66C33] uppercase font-bold">${prod.category}</span>
          <h3 class="serif font-bold text-lg text-[#3E2723] group-hover:text-[#A66C33] transition-colors line-clamp-1">${prod.name}</h3>
          
          <div class="flex items-center gap-1.5">
            <div class="flex text-[#A66C33]">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
            </div>
            <span class="text-[10px] text-[#8D7B68] font-bold">(${prod.reviewsCount})</span>
          </div>
        </div>

        <!-- Prices breakdown -->
        <div class="flex items-end justify-between border-t border-[#F2E9E1] pt-3.5 text-left">
          <div class="space-y-0.5">
            <span class="text-[8px] font-bold text-[#8D7B68] uppercase block tracking-wider">PRECIO MAYORISTA UNIT.</span>
            <div class="flex items-baseline gap-1">
              <strong class="serif text-base font-black text-[#A66C33]">S/. ${minWholesale.toFixed(2)} - S/. ${maxWholesale.toFixed(2)}</strong>
              <span class="text-[9px] text-[#8D7B68] font-bold">c/u</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button id="card-add-btn-${prod.id}" class="w-full bg-[#A66C33] hover:bg-[#8D7B68] text-white py-2.5 rounded-full font-sans font-semibold uppercase text-xs tracking-widest transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
          <i data-lucide="shopping-cart" class="w-4 h-4"></i>
          Añadir Lote (${minQty}u)
        </button>
      </div>
    `;

    gridEl.appendChild(card);

    // Re-trigger Lucide icon creations inside card
    if (window.lucide) {
      window.lucide.createIcons({ node: card });
    }

    // Card click opens detail modal
    card.addEventListener("click", () => openProductDetail(prod));

    // Stop propagation and handle quick view
    const qvBtn = document.getElementById(`quick-view-btn-${prod.id}`);
    if (qvBtn) {
      qvBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openProductDetail(prod);
      });
    }

    // Stop propagation and quick add
    const qaBtn = document.getElementById(`quick-add-btn-${prod.id}`);
    if (qaBtn) {
      qaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(prod, defaultSize, defaultColor, minQty);
      });
    }

    // Add button click
    const addBtn = document.getElementById(`card-add-btn-${prod.id}`);
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(prod, defaultSize, defaultColor, minQty);
      });
    }
  });
}

// BIND AMBIENT PROMO BANNER ACTION
function bindPromoBannerListener() {
  const promoBtn = document.getElementById("apply-promo-banner-btn");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      couponCode = "SUEÑO";
      discountPercentage = 40;
      
      const couponInput = document.getElementById("coupon-input");
      if (couponInput) couponInput.value = "SUEÑO";
      
      const chkCouponInput = document.getElementById("checkout-coupon-input");
      if (chkCouponInput) chkCouponInput.value = "SUEÑO";

      updateCartUI();
      showToast("¡Código 'SUEÑO' activado! Obtienes un 40% de descuento en camas y mantas.", "success");
      openCartDrawer();
    });
  }
}

// SHOPPING CART LOGIC & DRAWER MANAGEMENT
function bindCartDrawerListeners() {
  const triggerBtn = document.getElementById("cart-drawer-btn");
  const closeBtn = document.getElementById("cart-drawer-close");
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const panel = document.getElementById("cart-drawer-panel");
  const checkoutBtn = document.getElementById("cart-proceed-checkout-btn");

  const openDrawer = () => {
    if (backdrop && panel) {
      backdrop.classList.remove("hidden");
      setTimeout(() => panel.classList.remove("translate-x-full"), 50);
    }
  };

  const closeDrawer = () => {
    if (backdrop && panel) {
      panel.classList.add("translate-x-full");
      setTimeout(() => backdrop.classList.add("hidden"), 300);
    }
  };

  if (triggerBtn) triggerBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeDrawer();
    });
  }

  // Checkout redirect inside drawer
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      closeDrawer();
      navigate("checkout");
      renderCheckoutSummary();
    });
  }

  // Coupon Apply Event Inside Drawer
  const applyBtn = document.getElementById("coupon-apply-btn");
  const couponInput = document.getElementById("coupon-input");

  if (applyBtn && couponInput) {
    applyBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "SUEÑO" || code === "DORMILON") {
        couponCode = code;
        discountPercentage = 40;
        showToast("¡Cupón aplicado con éxito! 40% de descuento.", "success");
      } else if (code === "") {
        couponCode = "";
        discountPercentage = 0;
      } else {
        showToast("Cupón inválido. Intenta con SUEÑO o DORMILON", "info");
        couponCode = "";
        discountPercentage = 0;
      }
      updateCartUI();
    });
  }
}

function openCartDrawer() {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const panel = document.getElementById("cart-drawer-panel");
  if (backdrop && panel) {
    backdrop.classList.remove("hidden");
    setTimeout(() => panel.classList.remove("translate-x-full"), 50);
  }
}

// ADD ITEMS TO CART
function addToCart(product, size, color, quantity) {
  const compoundId = `${product.id}-${size}-${color}`;
  const initialQty = quantity !== undefined ? quantity : getProductMinOrderQuantity(product, size);
  
  const existingIndex = cart.findIndex(item => item.id === compoundId);
  if (existingIndex > -1) {
    const newQty = cart[existingIndex].quantity + initialQty;
    cart[existingIndex].quantity = newQty;
    cart[existingIndex].selectedPrice = getWholesalePriceForProduct(product, size, newQty);
    showToast(`¡Se actualizó la cantidad de ${product.name} en el lote mayorista!`, "success");
  } else {
    cart.push({
      id: compoundId,
      product,
      size,
      color,
      quantity: initialQty,
      selectedPrice: getWholesalePriceForProduct(product, size, initialQty)
    });
    showToast(`¡Añadido lote de ${product.name} al carrito!`, "success");
  }

  // Save changes
  localStorage.setItem("patitas_cart", JSON.stringify(cart));
  updateCartUI();
}

// CART VALUE ACCUMULATORS & UI DRAWS
function updateCartUI() {
  const cartBadge = document.getElementById("cart-count-badge");
  const drawerItemsContainer = document.getElementById("cart-drawer-items");
  const subtotalValEl = document.getElementById("cart-subtotal-val");
  const discountRow = document.getElementById("cart-discount-row");
  const discountValEl = document.getElementById("cart-discount-val");
  const igvValEl = document.getElementById("cart-igv-val");
  const grandTotalValEl = document.getElementById("cart-grand-total-val");
  const proceedBtn = document.getElementById("cart-proceed-checkout-btn");
  const moqAlert = document.getElementById("cart-moq-alert");
  const moqAlertText = document.getElementById("cart-moq-alert-text");
  const couponIndicator = document.getElementById("coupon-applied-indicator");

  if (!drawerItemsContainer) return;

  // Header Badge Count
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    if (totalUnits > 0) {
      cartBadge.innerText = String(totalUnits);
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }
  }

  // Empty cart display
  if (cart.length === 0) {
    drawerItemsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div class="bg-[#F5EBE0] p-4 rounded-full text-[#A66C33]">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <h3 class="serif text-lg font-bold text-[#3E2723]">Tu lote está vacío</h3>
        <p class="text-xs text-[#8D7B68] max-w-[220px]">Añade paquetes de productos con la cantidad mínima de fabricación requerida.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ node: drawerItemsContainer });
    
    if (subtotalValEl) subtotalValEl.innerText = "S/. 0.00";
    if (discountRow) discountRow.classList.add("hidden");
    if (igvValEl) igvValEl.innerText = "S/. 0.00";
    if (grandTotalValEl) grandTotalValEl.innerText = "S/. 0.00";
    if (proceedBtn) proceedBtn.disabled = true;
    if (moqAlert) moqAlert.classList.add("hidden");
    if (couponIndicator) couponIndicator.classList.add("hidden");
    return;
  }

  // Draw Items
  drawerItemsContainer.innerHTML = "";
  cart.forEach(item => {
    const minQty = getProductMinOrderQuantity(item.product, item.size);
    const itemEl = document.createElement("div");
    itemEl.className = "flex items-center gap-4 bg-[#FCF9F2] p-3.5 rounded-2xl border border-[#EBE3D5] relative animate-fade-in text-left";
    
    itemEl.innerHTML = `
      <div class="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-[#EBE3D5] shrink-0">
        <img src="${item.product.images[0]}" alt="${item.product.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain" />
      </div>
      <div class="flex-1 space-y-1">
        <h4 class="serif font-bold text-xs text-[#3E2723] line-clamp-1">${item.product.name}</h4>
        <p class="text-[10px] text-[#8D7B68] font-bold">Talla: <span class="text-[#3E2723]">${item.size}</span> | Color: <span class="text-[#3E2723]">${item.color}</span></p>
        <div class="flex items-center justify-between pt-1">
          <!-- Quantity picker -->
          <div class="flex items-center border border-[#EBE3D5] rounded-lg overflow-hidden bg-white">
            <button id="dec-${item.id}" class="px-2 py-1 text-xs text-[#7A6A53] hover:bg-[#F5EBE0] font-black">-</button>
            <span class="w-9 text-center text-[11px] font-bold text-[#3E2723]">${item.quantity}</span>
            <button id="inc-${item.id}" class="px-2 py-1 text-xs text-[#7A6A53] hover:bg-[#F5EBE0] font-black">+</button>
          </div>
          <!-- Unit Price -->
          <span class="text-xs font-black text-[#A66C33]">S/. ${(item.selectedPrice * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <!-- Trash trigger -->
      <button id="trash-${item.id}" class="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    `;

    drawerItemsContainer.appendChild(itemEl);

    // Re-bind Lucide inside dynamic element
    if (window.lucide) window.lucide.createIcons({ node: itemEl });

    // Events
    document.getElementById(`dec-${item.id}`)?.addEventListener("click", () => {
      if (item.quantity <= minQty) {
        if (confirm(`¿Deseas eliminar ${item.product.name} (Talla: ${item.size}) de tu carrito? (El pedido mínimo para venta mayorista de esta talla es de ${minQty} unidades)`)) {
          removeItemFromCart(item.id);
        }
      } else {
        updateItemQuantity(item.id, item.quantity - 1);
      }
    });

    document.getElementById(`inc-${item.id}`)?.addEventListener("click", () => {
      updateItemQuantity(item.id, item.quantity + 1);
    });

    document.getElementById(`trash-${item.id}`)?.addEventListener("click", () => {
      if (confirm(`¿Eliminar ${item.product.name} (Talla: ${item.size}) de tu pedido mayorista?`)) {
        removeItemFromCart(item.id);
      }
    });
  });

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const discount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal - discount;
  const igvAmount = (grandTotal * 18) / 118;

  // Render values
  if (subtotalValEl) subtotalValEl.innerText = `S/. ${subtotal.toFixed(2)}`;
  if (discountRow) {
    if (discount > 0) {
      discountRow.classList.remove("hidden");
      if (discountValEl) discountValEl.innerText = `- S/. ${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add("hidden");
    }
  }
  if (igvValEl) igvValEl.innerText = `S/. ${igvAmount.toFixed(2)}`;
  if (grandTotalValEl) grandTotalValEl.innerText = `S/. ${grandTotal.toFixed(2)}`;

  // Coupon active indicator
  if (couponIndicator) {
    if (discountPercentage > 0) {
      couponIndicator.innerText = `¡Cupón '${couponCode}' activo (40% desc)!`;
      couponIndicator.classList.remove("hidden");
    } else {
      couponIndicator.classList.add("hidden");
    }
  }

  // Minimum Order total barrier (S/. 250)
  const isEligibleForWholesale = grandTotal >= 250;
  if (moqAlert) {
    if (isEligibleForWholesale) {
      moqAlert.classList.remove("border-amber-400", "bg-amber-50");
      if (moqAlertText) moqAlertText.innerHTML = `<span class="text-green-600 font-bold flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> ¡Fórmula aprobada!</span> Tu orden supera el mínimo de S/. 250 para facturar flete B2B.`;
      if (window.lucide) window.lucide.createIcons({ node: moqAlert });
    } else {
      moqAlert.classList.add("border-amber-400", "bg-amber-50");
      if (moqAlertText) moqAlertText.innerHTML = `Tu pedido total (S/. ${grandTotal.toFixed(2)}) es menor al pedido mínimo general corporativo de <strong class="text-[#3E2723]">S/250.00</strong>. Añade más productos para habilitar el flete terrestre.`;
    }
  }

  if (proceedBtn) {
    proceedBtn.disabled = !isEligibleForWholesale;
  }
}

function updateItemQuantity(id, qty) {
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].quantity = qty;
    cart[index].selectedPrice = getWholesalePriceForProduct(cart[index].product, cart[index].size, qty);
    localStorage.setItem("patitas_cart", JSON.stringify(cart));
    updateCartUI();
  }
}

function removeItemFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("patitas_cart", JSON.stringify(cart));
  updateCartUI();
  showToast("Se removió el producto de tu lote", "info");
}

// DETAIL MODAL DIALOG ENGINE
function bindDetailModalListeners() {
  const closeBtn = document.getElementById("detail-modal-close");
  const modal = document.getElementById("product-detail-modal");
  const decBtn = document.getElementById("detail-qty-decrement");
  const incBtn = document.getElementById("detail-qty-increment");
  const qtyInput = document.getElementById("detail-qty-input");
  const addToCartBtn = document.getElementById("detail-add-to-cart-btn");

  const closeModal = () => {
    if (modal) modal.classList.add("hidden");
    selectedProduct = null;
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Tabs selectors inside detail
  const tabs = document.querySelectorAll(".detail-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      tabs.forEach(t => t.classList.remove("text-[#A66C33]", "border-b-2", "border-[#A66C33]"));
      tabs.forEach(t => t.classList.add("text-[#8D7B68]"));

      const target = e.currentTarget;
      target.classList.add("text-[#A66C33]", "border-b-2", "border-[#A66C33]");
      target.classList.remove("text-[#8D7B68]");

      const selectedTab = target.getAttribute("data-tab");
      const descContent = document.getElementById("tab-desc-content");
      const specContent = document.getElementById("tab-spec-content");

      if (selectedTab === "desc") {
        if (descContent) descContent.classList.remove("hidden");
        if (specContent) specContent.classList.add("hidden");
      } else {
        if (descContent) descContent.classList.add("hidden");
        if (specContent) specContent.classList.remove("hidden");
      }
    });
  });

  // Quantity controllers
  if (decBtn && qtyInput) {
    decBtn.addEventListener("click", () => {
      if (!selectedProduct) return;
      const minQty = getProductMinOrderQuantity(selectedProduct, selectedSize);
      let val = parseInt(qtyInput.value) || minQty;
      if (val > minQty) {
        val--;
        qtyInput.value = String(val);
        selectedQty = val;
        updateModalCalculations();
      }
    });
  }

  if (incBtn && qtyInput) {
    incBtn.addEventListener("click", () => {
      if (!selectedProduct) return;
      let val = parseInt(qtyInput.value) || 12;
      val++;
      qtyInput.value = String(val);
      selectedQty = val;
      updateModalCalculations();
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener("input", () => {
      if (!selectedProduct) return;
      const minQty = getProductMinOrderQuantity(selectedProduct, selectedSize);
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < minQty) {
        val = minQty;
      }
      selectedQty = val;
      updateModalCalculations();
    });
    
    qtyInput.addEventListener("blur", () => {
      qtyInput.value = String(selectedQty);
    });
  }

  // Add to cart inside modal
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (!selectedProduct) return;
      addToCart(selectedProduct, selectedSize, selectedColor, selectedQty);
      closeModal();
      openCartDrawer();
    });
  }
}

function openProductDetail(product) {
  selectedProduct = product;
  selectedSize = product.sizes[0];
  selectedColor = product.colors[0];
  selectedQty = getProductMinOrderQuantity(product, selectedSize);

  const modal = document.getElementById("product-detail-modal");
  const detailImg = document.getElementById("detail-img");
  const detailName = document.getElementById("detail-name");
  const detailCategory = document.getElementById("detail-category");
  const detailDesc = document.getElementById("detail-description");
  const reviewCountEl = document.getElementById("detail-rating-count");
  const sizesContainer = document.getElementById("detail-sizes-container");
  const colorsContainer = document.getElementById("detail-colors-container");
  const qtyInput = document.getElementById("detail-qty-input");

  if (!modal) return;

  // Set standard fields
  if (detailImg) detailImg.src = product.images[0];
  if (detailName) detailName.innerText = product.name;
  if (detailCategory) detailCategory.innerText = product.category;
  if (detailDesc) detailDesc.innerText = product.description;
  if (reviewCountEl) reviewCountEl.innerText = `(${product.reviewsCount} valoraciones de veterinarias)`;
  if (qtyInput) qtyInput.value = String(selectedQty);

  // Set description active tab
  const tabDescBtn = document.getElementById("tab-desc-btn");
  if (tabDescBtn) tabDescBtn.click();

  // Draw sizes list buttons
  if (sizesContainer) {
    sizesContainer.innerHTML = "";
    product.sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.id = `size-opt-${size}`;
      btn.innerText = size;
      btn.className = `px-4 py-2 border-2 text-xs font-bold rounded-xl transition-all ${
        size === selectedSize 
          ? "border-[#A66C33] bg-[#FCF9F2] text-[#A66C33]" 
          : "border-[#EBE3D5] text-[#8D7B68] hover:border-[#A66C33]"
      }`;
      
      btn.addEventListener("click", () => {
        selectedSize = size;
        
        // Update selection UI classes
        sizesContainer.querySelectorAll("button").forEach(b => {
          b.classList.remove("border-[#A66C33]", "bg-[#FCF9F2]", "text-[#A66C33]");
          b.classList.add("border-[#EBE3D5]", "text-[#8D7B68]");
        });
        btn.classList.add("border-[#A66C33]", "bg-[#FCF9F2]", "text-[#A66C33]");
        btn.classList.remove("border-[#EBE3D5]", "text-[#8D7B68]");

        // Reset Qty based on selected size MOQ
        const newMOQ = getProductMinOrderQuantity(product, size);
        if (selectedQty < newMOQ) {
          selectedQty = newMOQ;
          if (qtyInput) qtyInput.value = String(selectedQty);
        }
        
        updateModalCalculations();
      });
      sizesContainer.appendChild(btn);
    });
  }

  // Draw color patterns selection pills
  if (colorsContainer) {
    colorsContainer.innerHTML = "";
    product.colors.forEach(col => {
      const btn = document.createElement("button");
      btn.id = `col-opt-${col}`;
      btn.innerText = col;
      btn.className = `px-3.5 py-1.5 border-2 text-xs font-semibold rounded-full transition-all ${
        col === selectedColor 
          ? "border-[#A66C33] bg-[#FCF9F2] text-[#A66C33]" 
          : "border-[#EBE3D5] text-[#8D7B68] hover:border-[#A66C33]"
      }`;

      btn.addEventListener("click", () => {
        selectedColor = col;
        colorsContainer.querySelectorAll("button").forEach(b => {
          b.classList.remove("border-[#A66C33]", "bg-[#FCF9F2]", "text-[#A66C33]");
          b.classList.add("border-[#EBE3D5]", "text-[#8D7B68]");
        });
        btn.classList.add("border-[#A66C33]", "bg-[#FCF9F2]", "text-[#A66C33]");
        btn.classList.remove("border-[#EBE3D5]", "text-[#8D7B68]");
      });
      colorsContainer.appendChild(btn);
    });
  }

  // Fill specifications table
  const specsUl = document.getElementById("detail-specs-ul");
  if (specsUl) {
    specsUl.innerHTML = "";
    product.features.forEach(feat => {
      const li = document.createElement("li");
      li.className = "pl-1";
      li.innerText = feat;
      specsUl.appendChild(li);
    });
  }

  updateModalCalculations();
  modal.classList.remove("hidden");
}

function updateModalCalculations() {
  if (!selectedProduct) return;

  const minQty = getProductMinOrderQuantity(selectedProduct, selectedSize);
  const retailBase = getProductPriceForSize(selectedProduct, selectedSize);
  const unitWholesale = getWholesalePriceForProduct(selectedProduct, selectedSize, selectedQty);
  
  const pkg = getPackagingInfo(selectedQty);
  const totalWholesale = unitWholesale * selectedQty;
  const retailEquivalent = retailBase * selectedQty;
  const savings = retailEquivalent - totalWholesale;

  // Render elements inside detail
  const moqNotice = document.getElementById("detail-moq-notice");
  const unitPriceEl = document.getElementById("detail-wholesale-unit-price");
  const retailPriceEl = document.getElementById("detail-retail-ref-price");
  const pkgBoxesEl = document.getElementById("detail-pkg-boxes");
  const pkgWeightEl = document.getElementById("detail-pkg-weight");
  const savingsEl = document.getElementById("detail-lote-savings");
  const totalWholesaleEl = document.getElementById("detail-lote-total");

  if (moqNotice) moqNotice.innerText = `Pedido mínimo para talla ${selectedSize}: ${minQty} unidades`;
  if (unitPriceEl) unitPriceEl.innerText = `S/. ${unitWholesale.toFixed(2)}`;
  if (retailPriceEl) retailPriceEl.innerText = `Ref S/. ${retailBase.toFixed(2)} minorista`;
  if (pkgBoxesEl) pkgBoxesEl.innerText = `${pkg.boxes} ${pkg.boxes === 1 ? "Caja máster" : "Cajas máster"}`;
  if (pkgWeightEl) pkgWeightEl.innerText = `~ ${pkg.weightKg} Kg aprox`;

  let discountPercentText = "30% desc";
  if (selectedQty >= 48) discountPercentText = "55% desc";
  else if (selectedQty >= 24) discountPercentText = "40% desc";

  if (savingsEl) savingsEl.innerText = `Ahorras S/. ${savings.toFixed(2)} (${discountPercentText})`;
  if (totalWholesaleEl) totalWholesaleEl.innerText = `S/. ${totalWholesale.toFixed(2)}`;

  // Size Specifications dimensions recommendation block update
  const sizeDetails = getSizeDetails(selectedProduct.name, selectedSize);
  const specTabContent = document.getElementById("tab-spec-content");
  if (specTabContent && selectedProduct) {
    // Keep features list, and append dimension specs at bottom
    let listHtml = selectedProduct.features.map(f => `<li class="pl-1">${f}</li>`).join("");
    listHtml += `
      <li class="pl-1 mt-3 text-left list-none border-t border-[#F2E9E1] pt-3">
        <p class="font-bold text-[#3E2723]">Dimensiones de Fábrica:</p>
        <p class="text-xs text-[#8D7B68] font-mono mt-0.5">${sizeDetails.dimensions}</p>
      </li>
      <li class="pl-1 mt-1.5 text-left list-none">
        <p class="font-bold text-[#3E2723]">Recomendación de Raza:</p>
        <p class="text-xs text-[#8D7B68] mt-0.5">${sizeDetails.recommendation}</p>
      </li>
    `;
    specsUlContainerCheck(listHtml);
  }
}

function specsUlContainerCheck(listHtml) {
  const specsUl = document.getElementById("detail-specs-ul");
  if (specsUl) specsUl.innerHTML = listHtml;
}

// CHECKOUT VIEW CONTROLLERS
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal-val");
  const discountRow = document.getElementById("checkout-discount-row");
  const discountEl = document.getElementById("checkout-discount-val");
  const igvEl = document.getElementById("checkout-igv-val");
  const totalEl = document.getElementById("checkout-total-val");

  if (!container) return;
  container.innerHTML = "";

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "flex justify-between items-center bg-white border border-[#EBE3D5] p-3 rounded-xl text-left";
    el.innerHTML = `
      <div class="space-y-0.5">
        <p class="serif font-bold text-xs text-[#3E2723] line-clamp-1">${item.product.name}</p>
        <p class="text-[9px] text-[#8D7B68]">Talla: ${item.size} | Color: ${item.color} | Cant: ${item.quantity}u</p>
      </div>
      <span class="text-xs font-black text-[#A66C33] font-mono">S/. ${(item.selectedPrice * item.quantity).toFixed(2)}</span>
    `;
    container.appendChild(el);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const discount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal - discount;
  const igvAmount = (grandTotal * 18) / 118;

  if (subtotalEl) subtotalEl.innerText = `S/. ${subtotal.toFixed(2)}`;
  if (discountRow) {
    if (discount > 0) {
      discountRow.classList.remove("hidden");
      if (discountEl) discountEl.innerText = `- S/. ${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add("hidden");
    }
  }
  if (igvEl) igvEl.innerText = `S/. ${igvAmount.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `S/. ${grandTotal.toFixed(2)}`;
}

// BIND CHECKOUT CONTROLS & SUBMIT TRANSACTION
function bindCheckoutFormListeners() {
  const form = document.getElementById("checkout-form-element");
  const proofInput = document.getElementById("chk-proof");
  const proofPlaceholder = document.getElementById("proof-upload-placeholder");
  const proofSuccess = document.getElementById("proof-upload-success");
  const proofFilename = document.getElementById("proof-filename");
  const chkDocType = document.getElementById("chk-doc-type");
  const chkDocLabel = document.getElementById("chk-doc-val-label");
  const chkDocInput = document.getElementById("chk-doc-val");

  // Toggle RUC vs DNI input formats
  if (chkDocType && chkDocLabel && chkDocInput) {
    chkDocType.addEventListener("change", () => {
      if (chkDocType.value === "RUC") {
        chkDocLabel.innerText = "Número de RUC *";
        chkDocInput.placeholder = "Ej: 20612345678";
      } else {
        chkDocLabel.innerText = "Número de DNI *";
        chkDocInput.placeholder = "Ej: 75128456";
      }
    });
  }

  // Listen for proof voucher attachment
  if (proofInput && proofPlaceholder && proofSuccess && proofFilename) {
    proofInput.addEventListener("change", () => {
      if (proofInput.files && proofInput.files.length > 0) {
        proofPlaceholder.classList.add("hidden");
        proofSuccess.classList.remove("hidden");
        proofFilename.innerText = proofInput.files[0].name;
      }
    });
  }

  // Apply coupon in checkout summary
  const checkoutCouponBtn = document.getElementById("checkout-coupon-btn");
  const checkoutCouponInput = document.getElementById("checkout-coupon-input");
  const checkoutCouponStatus = document.getElementById("checkout-coupon-status");

  if (checkoutCouponBtn && checkoutCouponInput) {
    checkoutCouponBtn.addEventListener("click", () => {
      const code = checkoutCouponInput.value.trim().toUpperCase();
      if (code === "SUEÑO" || code === "DORMILON") {
        couponCode = code;
        discountPercentage = 40;
        if (checkoutCouponStatus) checkoutCouponStatus.classList.remove("hidden");
        showToast("¡Cupón aplicado correctamente!", "success");
      } else {
        couponCode = "";
        discountPercentage = 0;
        if (checkoutCouponStatus) checkoutCouponStatus.classList.add("hidden");
        showToast("Código inválido", "info");
      }
      renderCheckoutSummary();
      updateCartUI();
    });
  }

  // Handle Checkout submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        showToast("Tu carrito está vacío", "info");
        return;
      }

      // Show loader
      const overlay = document.getElementById("loading-overlay");
      const overlayTitle = document.getElementById("loading-overlay-title");
      if (overlay) overlay.classList.remove("hidden");

      try {
        const orderNum = "PD-" + Math.floor(1000 + Math.random() * 9000);
        
        // Grab values
        const docType = chkDocType.value;
        const docVal = chkDocInput.value;
        const buyerName = document.getElementById("chk-names").value;
        const buyerLastName = document.getElementById("chk-lastnames").value;
        const phone = document.getElementById("chk-phone").value;
        const email = document.getElementById("chk-email").value;
        const businessName = document.getElementById("chk-business-name").value;
        const dept = document.getElementById("chk-dept").value;
        const prov = document.getElementById("chk-prov").value;
        const dist = document.getElementById("chk-dist").value;
        const address = document.getElementById("chk-address").value;
        const reference = document.getElementById("chk-reference").value;
        const agency = document.getElementById("chk-agency").value;

        const subtotal = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
        const discount = subtotal * (discountPercentage / 100);
        const total = subtotal - discount;

        // Structured Order Item Map
        const formattedItems = cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.selectedPrice
        }));

        const newOrderData = {
          orderNumber: orderNum,
          customerInfo: {
            email,
            name: buyerName,
            lastName: buyerLastName,
            phone,
            dni: docType === "DNI" ? docVal : "",
            ruc: docType === "RUC" ? docVal : "",
            docType,
            businessName,
            freightAgency: agency
          },
          shippingAddress: {
            department: dept,
            province: prov,
            district: dist,
            address,
            reference
          },
          paymentMethod: "yape", // default wire transfer
          paymentDetails: {
            transactionId: "TX-" + Math.floor(100000 + Math.random() * 900000)
          },
          items: formattedItems,
          subtotal,
          discount,
          shippingCost: 0, // gratis flete local
          total,
          status: "pendiente"
        };

        // 1. Generate PDF
        if (overlayTitle) overlayTitle.innerText = "Creando Nota de Pedido PDF...";
        const dateStr = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
        const tempContainer = document.getElementById("pdf-rendering-temp");
        
        let pdfDownloadUrl = "";
        
        if (tempContainer) {
          tempContainer.innerHTML = getPdfTemplateHtml(newOrderData, dateStr);
          
          const opt = {
            margin: 0,
            filename: `Nota_Pedido_${orderNum}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          const element = tempContainer.querySelector("#pdf-template-container");
          if (element) {
            const pdfBlob = await window.html2pdf().from(element).set(opt).output('blob');
            
            // 2. Upload PDF to cloud
            if (overlayTitle) overlayTitle.innerText = "Subiendo archivo a la nube...";
            pdfDownloadUrl = await uploadPdfToCloud(pdfBlob, orderNum);
          }
        }

        // 3. Save Order to Firestore
        if (overlayTitle) overlayTitle.innerText = "Guardando pedido en Firestore...";
        const finalSavedOrder = await saveOrder(newOrderData);

        // Save local history
        const localOrdersRaw = localStorage.getItem("patitas_orders");
        const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];
        localOrders.push(finalSavedOrder);
        localStorage.setItem("patitas_orders", JSON.stringify(localOrders));

        // 4. Trigger Webhook Google Sheets & Gmail Sync
        if (overlayTitle) overlayTitle.innerText = "Sincronizando con Google Sheets...";
        const payload = {
          transactionId: finalSavedOrder.id,
          buyerName: `${buyerName} ${buyerLastName}`,
          buyerRuc: docVal,
          buyerPhone: phone,
          buyerEmail: email,
          buyerAddress: `${address}, ${dist}, ${prov}`,
          deliveryOption: `${agency} - Pago Contra Entrega`,
          totalUnits: formattedItems.reduce((acc, i) => acc + i.quantity, 0),
          unitPrice: formattedItems[0].price,
          subtotal,
          igvAmount: (total * 18) / 118,
          shippingFee: 0,
          grandTotal: total,
          pdfUrl: pdfDownloadUrl || undefined,
          items: formattedItems.map(i => ({
            product: { name: i.name, sku: i.productId },
            quantity: i.quantity
          }))
        };

        await triggerGoogleSheetsSync(payload);

        // Clean cart
        cart = [];
        localStorage.removeItem("patitas_cart");
        updateCartUI();

        // 5. Open Success view
        currentOrder = finalSavedOrder;
        
        const successOrderNum = document.getElementById("success-order-num");
        const successBuyerName = document.getElementById("success-buyer-name");
        const successBuyerTotal = document.getElementById("success-buyer-total");
        const successAgencyName = document.getElementById("success-agency-name");
        
        if (successOrderNum) successOrderNum.innerText = orderNum;
        if (successBuyerName) successBuyerName.innerText = `${buyerName} ${buyerLastName}`;
        if (successBuyerTotal) successBuyerTotal.innerText = `S/. ${total.toFixed(2)}`;
        if (successAgencyName) successAgencyName.innerText = agency;

        // PDF download button inside success
        const downloadBtn = document.getElementById("success-download-pdf-btn");
        if (downloadBtn) {
          downloadBtn.onclick = () => {
            if (pdfDownloadUrl) {
              window.open(pdfDownloadUrl, "_blank");
            } else {
              showToast("Generando descarga local alternativa...", "info");
              const el = tempContainer?.querySelector("#pdf-template-container");
              if (el) {
                window.html2pdf().from(el).save(`Nota_Pedido_${orderNum}.pdf`);
              }
            }
          };
        }

        // WhatsApp direct link inside success
        const waLink = document.getElementById("success-whatsapp-link");
        if (waLink) {
          let itemsText = "";
          formattedItems.forEach(item => {
            itemsText += `\n- ${item.name} (${item.size}, ${item.color}) x${item.quantity}u : S/. ${(item.price * item.quantity).toFixed(2)}`;
          });
          
          const waMessage = `🐾 *NUEVO PEDIDO MAYORISTA - PATITAS DORMILONAS* 🐾\n\n` +
            `*Pedido:* ${orderNum}\n` +
            `*Cliente:* ${buyerName} ${buyerLastName}\n` +
            `*Empresa:* ${businessName || "No especificado"}\n` +
            `*Documento:* ${docVal} (${docType})\n` +
            `*Celular:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Agencia de Despacho:* ${agency}\n` +
            `*Dirección:* ${address}, ${dist}, ${prov}, ${dept}\n` +
            `*Detalle de Productos:*${itemsText}\n\n` +
            `*Subtotal:* S/. ${subtotal.toFixed(2)}\n` +
            (discount > 0 ? `*Descuento Cupón:* -S/. ${discount.toFixed(2)}\n` : "") +
            `*TOTAL PAGADO:* S/. ${total.toFixed(2)}\n\n` +
            (pdfDownloadUrl ? `*Nota de Pedido PDF:* ${pdfDownloadUrl}\n\n` : "") +
            `He registrado mi transferencia y adjunto aquí el voucher de pago.`;
            
          waLink.href = `https://wa.me/51951771314?text=${encodeURIComponent(waMessage)}`;
        }

        if (overlay) overlay.classList.add("hidden");
        navigate("success");

      } catch (err) {
        console.error("Critical checkout submission error:", err);
        showToast("Error procesando checkout mayorista", "info");
        if (overlay) overlay.classList.add("hidden");
      }
    });
  }

  // Back button success page
  const successBackBtn = document.getElementById("success-back-home-btn");
  if (successBackBtn) {
    successBackBtn.addEventListener("click", () => navigate("home"));
  }
}

// ORDER TRACKER QUERY SEARCH ENGINE
function bindTrackerListeners() {
  const queryInput = document.getElementById("tracker-search-input");
  const searchBtn = document.getElementById("tracker-search-btn");
  const loader = document.getElementById("tracker-loading");
  const emptyEl = document.getElementById("tracker-empty");
  const resultsContainer = document.getElementById("tracker-results");

  const runSearch = async () => {
    const term = queryInput.value.trim();
    if (term === "") {
      showToast("Por favor ingresa un código o correo", "info");
      return;
    }

    if (loader) loader.classList.remove("hidden");
    if (resultsContainer) resultsContainer.classList.add("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");

    try {
      const orders = await trackOrders(term);
      if (loader) loader.classList.add("hidden");

      if (orders.length === 0) {
        if (emptyEl) emptyEl.classList.remove("hidden");
        return;
      }

      // Draw matched tracking cards
      if (resultsContainer) {
        resultsContainer.innerHTML = "";
        resultsContainer.classList.remove("hidden");

        orders.forEach(order => {
          const card = document.createElement("div");
          card.className = "bg-white border border-[#EBE3D5] rounded-[24px] p-6 text-left space-y-6 soft-shadow animate-fade-in";
          
          // Steps statuses active classes resolver
          const statuses = ["pendiente", "en preparación", "despachado", "entregado"];
          const currentIdx = statuses.indexOf(order.status.toLowerCase());
          
          const timelineHtml = statuses.map((st, idx) => {
            const active = idx <= currentIdx;
            const completed = idx < currentIdx;
            
            const circleColorClass = active ? "bg-[#A66C33] text-white" : "bg-[#F2E9E1] text-[#8D7B68]";
            const lineHtml = idx < 3 ? `
              <div class="flex-1 h-1 ${active && idx < currentIdx ? "bg-[#A66C33]" : "bg-[#EBE3D5]"} mx-2"></div>
            ` : "";

            return `
              <div class="flex-1 flex items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${circleColorClass} shrink-0">
                  ${completed ? `<i data-lucide="check" class="w-4 h-4"></i>` : idx + 1}
                </div>
                ${lineHtml}
              </div>
            `;
          }).join("");

          const labelHtml = statuses.map((st) => {
            const stepLabelsMap = {
              "pendiente": "Pendiente",
              "en preparación": "Preparación",
              "despachado": "Despachado",
              "entregado": "Entregado"
            };
            return `<div class="flex-1 text-center text-[10px] font-bold text-[#8D7B68] uppercase">${stepLabelsMap[st]}</div>`;
          }).join("");

          const itemsListHtml = order.items.map(i => `
            <div class="flex justify-between text-xs py-1 text-left">
              <span class="text-[#8D7B68]">${i.name} (${i.size}, ${i.color}) x${i.quantity}u</span>
              <span class="font-bold text-[#3E2723] font-mono">S/. ${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          `).join("");

          card.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-[#F2E9E1] pb-4">
              <div class="space-y-0.5">
                <p class="text-[10px] font-bold text-[#A66C33] uppercase">ESTADO DE EMBALAJE B2B</p>
                <h3 class="serif font-bold text-xl text-[#3E2723]">${order.orderNumber}</h3>
              </div>
              <span class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5EBE0] text-[#A66C33]">
                ${order.status}
              </span>
            </div>

            <!-- Visual Timeline Tracker -->
            <div class="space-y-3 py-2">
              <div class="flex items-center justify-between">
                ${timelineHtml}
              </div>
              <div class="flex justify-between">
                ${labelHtml}
              </div>
            </div>

            <!-- Details metadata -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FCF9F2] p-4 rounded-xl text-xs">
              <div class="space-y-1.5 text-left">
                <p class="font-bold text-[#3E2723]">Datos de Entrega:</p>
                <p class="text-[#8D7B68]"><strong class="text-[#3E2723]">Cliente:</strong> ${order.customerInfo.name} ${order.customerInfo.lastName}</p>
                <p class="text-[#8D7B68]"><strong class="text-[#3E2723]">Agencia:</strong> ${order.customerInfo.freightAgency || "Shalom"}</p>
                <p class="text-[#8D7B68]"><strong class="text-[#3E2723]">Destino:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.province}</p>
              </div>
              <div class="space-y-1 text-left">
                <p class="font-bold text-[#3E2723]">Productos en el Lote:</p>
                <div class="divide-y divide-[#EBE3D5]">
                  ${itemsListHtml}
                </div>
                <div class="flex justify-between font-black text-xs pt-2 text-[#A66C33]">
                  <span>Total Pedido:</span>
                  <span class="font-mono">S/. ${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- WhatsApp Query -->
            <div class="flex justify-end gap-3 pt-2">
              <a href="https://wa.me/51951771314?text=Hola%20Patitas%20Dormilonas,%20quisiera%20saber%20el%20estado%20de%20mi%20pedido%20${order.orderNumber}" target="_blank" class="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm">
                <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
                Consultar con Asesor
              </a>
            </div>
          `;

          resultsContainer.appendChild(card);
          if (window.lucide) window.lucide.createIcons({ node: card });
        });
      }

    } catch (err) {
      console.error(err);
      showToast("Error cargando tracking de pedidos", "info");
      if (loader) loader.classList.add("hidden");
    }
  };

  if (searchBtn) searchBtn.addEventListener("click", runSearch);
  if (queryInput) {
    queryInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch();
    });
  }
}

// ADMIN DASHBOARD CONTROLLERS
function bindAdminListeners() {
  const refreshBtn = document.getElementById("admin-refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadAdminOrders();
      showToast("Base de datos de órdenes refrescada", "success");
    });
  }

  // Stats filter tab clicks
  const tabs = document.querySelectorAll(".admin-status-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      tabs.forEach(t => t.classList.remove("text-[#A66C33]", "border-b-2", "border-[#A66C33]"));
      tabs.forEach(t => t.classList.add("text-[#8D7B68]"));

      const target = e.currentTarget;
      target.classList.add("text-[#A66C33]", "border-b-2", "border-[#A66C33]");
      target.classList.remove("text-[#8D7B68]");

      const status = target.getAttribute("data-status") || "all";
      filterAndRenderAdminOrders(status);
    });
  });
}

let adminAllOrders = [];

async function loadAdminOrders() {
  const loader = document.getElementById("admin-loading");
  const wrapper = document.getElementById("admin-table-wrapper");

  if (loader) loader.classList.remove("hidden");
  if (wrapper) wrapper.classList.add("hidden");

  try {
    adminAllOrders = await fetchAllOrders();
    if (loader) loader.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("hidden");

    // Calculate Admin widgets stats
    const totalSales = adminAllOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCount = adminAllOrders.length;
    const pendingCount = adminAllOrders.filter(o => o.status.toLowerCase() === "pendiente").length;

    const salesEl = document.getElementById("admin-stat-sales");
    const countEl = document.getElementById("admin-stat-count");
    const pendingEl = document.getElementById("admin-stat-pending");

    if (salesEl) salesEl.innerText = `S/. ${totalSales.toFixed(2)}`;
    if (countEl) countEl.innerText = String(totalCount);
    if (pendingEl) pendingEl.innerText = String(pendingCount);

    // Initial render all orders
    filterAndRenderAdminOrders("all");

  } catch (err) {
    console.error("Error loading admin stats", err);
    showToast("Error al conectar con la base de datos de órdenes", "info");
  }
}

function filterAndRenderAdminOrders(statusFilter) {
  const tbody = document.getElementById("admin-orders-tbody");
  const emptyEl = document.getElementById("admin-orders-empty");

  if (!tbody) return;
  tbody.innerHTML = "";

  const filtered = adminAllOrders.filter(o => {
    if (statusFilter === "all") return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (filtered.length === 0) {
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  if (emptyEl) emptyEl.classList.add("hidden");

  filtered.forEach(order => {
    const tr = document.createElement("tr");
    tr.id = `admin-row-${order.id}`;
    tr.className = "hover:bg-[#FCF9F2]/60 transition-colors";

    const itemsSummary = order.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join("<br/>");
    
    // Select status dropdown html
    const selectOptions = ["pendiente", "en preparación", "despachado", "entregado", "cancelado"].map(st => {
      const selected = st.toLowerCase() === order.status.toLowerCase() ? "selected" : "";
      const stepLabelsMap = {
        "pendiente": "Pendiente",
        "en preparación": "Preparación",
        "despachado": "Despachado",
        "entregado": "Entregado",
        "cancelado": "Cancelado"
      };
      return `<option value="${st}" ${selected}>${stepLabelsMap[st]}</option>`;
    }).join("");

    const dateFormatted = order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-PE") : "-";

    tr.innerHTML = `
      <td class="p-4 text-left">
        <strong class="text-[#3E2723] block text-xs font-bold">${order.orderNumber}</strong>
        <span class="text-[10px] text-[#8D7B68] block mt-0.5">${dateFormatted}</span>
      </td>
      <td class="p-4 text-left text-xs">
        <strong class="text-[#3E2723] block">${order.customerInfo.name} ${order.customerInfo.lastName}</strong>
        <span class="text-[10px] text-[#8D7B68] block mt-0.5">${order.customerInfo.docType || "RUC"}: ${order.customerInfo.ruc || order.customerInfo.dni}</span>
        <span class="text-[10px] text-[#A66C33] block mt-0.5 font-bold">Agencia: ${order.customerInfo.freightAgency || "Shalom"}</span>
      </td>
      <td class="p-4 text-left text-[10px] text-[#8D7B68] leading-relaxed max-w-[200px]">
        ${itemsSummary}
      </td>
      <td class="p-4 font-bold text-[#A66C33] text-xs font-mono">
        S/. ${order.total.toFixed(2)}
      </td>
      <td class="p-4 text-left">
        <select id="status-select-${order.id}" class="px-2.5 py-1.5 bg-[#FCF9F2] border border-[#EBE3D5] rounded-xl text-[10px] font-bold text-[#3E2723] uppercase focus:outline-none focus:border-[#A66C33] cursor-pointer">
          ${selectOptions}
        </select>
      </td>
      <td class="p-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button id="admin-pdf-btn-${order.id}" class="p-2 bg-[#F5EBE0] text-[#A66C33] hover:bg-[#A66C33] hover:text-white rounded-full transition-all" title="Ver Nota de Pedido">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
          </button>
          <a href="https://wa.me/51${order.customerInfo.phone}" target="_blank" class="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-all" title="Contactar WhatsApp">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </td>
    `;

    tbody.appendChild(tr);

    // Re-bind Lucide inside TR
    if (window.lucide) window.lucide.createIcons({ node: tr });

    // Status change listener
    document.getElementById(`status-select-${order.id}`)?.addEventListener("change", async (e) => {
      const newStatus = e.target.value;
      const ok = await updateOrderStatus(order.id, newStatus);
      if (ok) {
        showToast(`Estado de ${order.orderNumber} actualizado a: ${newStatus}`, "success");
        order.status = newStatus;
      } else {
        showToast("No se pudo actualizar el estado de la orden", "info");
      }
    });

    // View PDF action inside admin
    document.getElementById(`admin-pdf-btn-${order.id}`)?.addEventListener("click", () => {
      showToast("Generando representación local de Nota de Pedido...", "success");
      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" }) : "-";
      const tempContainer = document.getElementById("pdf-rendering-temp");
      if (tempContainer) {
        tempContainer.innerHTML = getPdfTemplateHtml(order, dateStr);
        const element = tempContainer.querySelector("#pdf-template-container");
        if (element) {
          window.html2pdf().from(element).save(`Nota_Pedido_${order.orderNumber}.pdf`);
        }
      }
    });
  });
}

// CUSTOM TOAST NOTIFICATION CREATION
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const id = Math.random().toString(36).substring(2, 9);
  const toast = document.createElement("div");
  toast.id = `toast-${id}`;
  
  const iconHtml = type === "success" 
    ? `<div class="bg-green-50 text-green-600 p-1.5 rounded-full"><i data-lucide="check" class="w-4 h-4"></i></div>` 
    : `<div class="bg-blue-50 text-blue-600 p-1.5 rounded-full"><i data-lucide="info" class="w-4 h-4"></i></div>`;

  toast.className = "flex items-center gap-3 bg-white border border-[#EBE3D5] rounded-2xl p-4 soft-shadow animate-slide-up text-left";
  toast.innerHTML = `
    ${iconHtml}
    <p class="text-xs font-bold text-[#3E2723] flex-1 pr-4">${message}</p>
    <button id="close-toast-${id}" class="text-[#8D7B68] hover:text-[#3E2723]"><i data-lucide="x" class="w-4 h-4"></i></button>
  `;

  container.appendChild(toast);

  // Initialize Lucide for toast
  if (window.lucide) window.lucide.createIcons({ node: toast });

  // Close click event
  const closeBtn = document.getElementById(`close-toast-${id}`);
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      toast.remove();
    });
  }

  // Auto close timer
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
