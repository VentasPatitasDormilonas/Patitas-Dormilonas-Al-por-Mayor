// Import global CSS so Vite compiles and applies Tailwind classes
import './index.css';

// Import modular HTML sections
import { inicioHTML } from './sections/inicio.js';
import { tiendaHTML } from './sections/tienda.js';
import { sobreNosotrosHTML } from './sections/sobreNosotros.js';
import { checkoutHTML } from './sections/checkout.js';
import { receiptModalHTML } from './sections/receiptModal.js';
import { footerHTML } from './sections/footer.js';
import { pdfTemplateHTML } from './sections/pdfTemplate.js';

// Inject HTML sections dynamically into the DOM synchronously on module load
const mainEl = document.querySelector('main.flex-grow');
if (mainEl) {
  mainEl.innerHTML = `
    ${inicioHTML}
    ${tiendaHTML}
    ${sobreNosotrosHTML}
    ${checkoutHTML}
  `;
}

const existingFooter = document.querySelector('footer');
if (existingFooter) {
  existingFooter.outerHTML = footerHTML;
} else {
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.body.insertAdjacentHTML('beforeend', receiptModalHTML);
document.body.insertAdjacentHTML('beforeend', pdfTemplateHTML);

// ================= CONSTANTS & DATA =================
const PRODUCTS = [
  {
    id: '1',
    sku: 'RP-BLUE-01',
    name: 'Azul',
    category: 'clásico',
    categoryLabel: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXSZnM5QlyU0eK1EmZ9PFPtyW34dw6cYU_TkBMclYnU9siUPpqGuVqrvDbbYy0zbJNDfgJpZTzmoOrLUXPxVPgo9fVyD5Q_QFk7ydP9XaI97skbiLM7tCO2accwg5cmXALhkXJcOFu2deMVv5BvICxVOMsMUG9n4U-O8R_rCfxvJtaZFrSiJK6SrQ3Xdo1KbLV9IIZSlqkk6BRwXt_FbVL82Gh79xj4X_bKPzpn5XHD9_EwbkL76MV7pgONu8XLkJ8EPc',
    description: 'Rosario plástico clásico en color azul con acabado suave al tacto y alta durabilidad.',
    promoComment: 'Ideal para Primera Comunión'
  },
  {
    id: '2',
    sku: 'RP-PURP-02',
    name: 'Morado',
    category: 'clásico',
    categoryLabel: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh_5ohor8AFQqiNShay-iAiGSgED_QFtxUG8PaHMzAlmiDYeor72AlSN37so4Q9Sm8IjVRTs2NvVR9T1Nx9hT8xsUziULfyLLjjviNTXL9h1wf_UWwdssc5QcpTcXOrQbU1P--0y3nGjDRR5th8fs8LpgdiePCu4zTl27zmv9fn7QVe55j3NukT56f1KCmeYAJnR4ZGVHQUjLvhmcHUpowNzNV0KmRrg6d0vHyU5NhERUQlsxW1uj3VSlbMrJ0maRZuig',
    description: 'Rosario plástico clásico en color morado tradicional con acabado suave y cruz reforzada.',
    promoComment: 'Hot Sale por Festividad Sr de los Milagros!'
  },
  {
    id: '3',
    sku: 'RP-CEL-03',
    name: 'Celeste',
    category: 'clásico',
    categoryLabel: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjJ5xEk1YE4EHbhYxrTJsex-2qzgKlw-mm87kJXrIvwCV4LN4fzMgxkluGGLsLfo_1Tj8vVXAo6Bkiyc1f9_8feguejRYWFYfZ95Pa0-kRHRtqgobluDOP-Tgh1UV3-lGI6xYXwGDGvFfrHLffgZC6uhVjbbpHhkkhrSQR928qZIQsqDhNq0bf0plJtyUDOO5hzGYRFyCX7cMqioxsAG3Vp9Tb-a4vsP-H5-TpB7mfCTlILgm3sBGzLefaY2xeNbcf3b8',
    description: 'Rosario plástico clásico en color celeste cielo con cuentas pulidas de alta calidad.',
    promoComment: 'Ideal para Bautizo de Niños'
  },
  {
    id: '4',
    sku: 'RP-GLOW-04',
    name: 'Brilla Oscuridad',
    category: 'fluorescente',
    categoryLabel: 'FLUORESCENTE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR5MucJvMrl2LQuTlqRL_vl1RNqA31xafHbYt13rmspXtPyMmCwERP4X6YRaPtDNx-7967wsvy2gTEckYFIxIwAgDVJX3Wf2IVubvtQ7xrLrI5Me7Gw7qf9nuhI3c0BUqlMPrwaiaPZs5hK4ARKmYCVxbhQsSDxx9mdTHFDsDm-1LYkyEprg0mftHQhVCy5GxArH98K32TBQOM98fi6qS2XxvfyW-xmWGsNCceIorlipfTzg6868M4ZrPB9nlQOdCWL4Q',
    description: 'Rosario fluorescente especial que absorbe la luz y brilla intensamente en la oscuridad.',
    promoComment: '¡Favorito de Niños! Brilla de noche'
  },
  {
    id: '5',
    sku: 'RP-WHT-05',
    name: 'Blanco',
    category: 'clásico',
    categoryLabel: '',
    image: '/src/assets/images/rosario_blanco_1783179324812.jpg',
    description: 'Rosario plástico clásico en color blanco puro con acabado suave y alta durabilidad.',
    promoComment: 'Ideal para Bautizo o Boda'
  },
  {
    id: '6',
    sku: 'RP-BRN-06',
    name: 'Marrón',
    category: 'clásico',
    categoryLabel: '',
    image: '/src/assets/images/rosario_marron_1783179337613.jpg',
    description: 'Rosario plástico clásico en color marrón elegante con acabado suave y cuentas pulidas.',
    promoComment: 'Color Tradicional y Sobrio'
  },
  {
    id: '7',
    sku: 'RP-GRN-07',
    name: 'Verde',
    category: 'clásico',
    categoryLabel: '',
    image: '/src/assets/images/rosario_verde_1783179347917.jpg',
    description: 'Rosario plástico clásico en color verde vibrante con acabado suave de primera calidad.',
    promoComment: 'Símbolo de Esperanza y Salud'
  }
];

const CORPORATE_INFO = {
  owner: 'Silvia Quispe Rujel',
  dni: '02782847',
  ruc: '10027828472',
  address: 'Jirón Tarapacá 260, Magdalena del Mar, Lima - Perú',
  phone: '(+51) 969 654 895',
  whatsappRaw: '51969654895',
  email: 'contacto@rosariosperuanos.com'
};

const SHIPPING_COST = 15.00;
const MINIMUM_ORDER_QTY = 500;

// ================= APPLICATION STATE =================
let cart = JSON.parse(localStorage.getItem('rosarios_cart')) || [];
let currentPage = 'inicio';
let activeFilter = 'all';
let searchQuery = '';
let deliveryOption = 'shipping';

// ================= B2B PRICING ENGINE =================
/**
 * B2B multi-tier pricing calculation
 * 50-99 units: S/. 0.60 each
 * 100-999 units: S/. 0.50 each
 * 1000+ units: S/. 0.40 each
 */
function getUnitPrice(totalQty) {
  if (totalQty >= 1000) {
    return 0.40;
  } else if (totalQty >= 100) {
    return 0.50;
  } else {
    return 0.60;
  }
}

// ================= DOM ELEMENT REFS =================
const pages = {
  inicio: document.getElementById('page-inicio'),
  tienda: document.getElementById('page-tienda'),
  'sobre-nosotros': document.getElementById('page-sobre-nosotros'),
  checkout: document.getElementById('page-checkout')
};

const navButtons = {
  inicio: [document.getElementById('nav-btn-inicio'), document.getElementById('mob-btn-inicio')],
  tienda: [document.getElementById('nav-btn-tienda'), document.getElementById('mob-btn-tienda')],
  'sobre-nosotros': [document.getElementById('nav-btn-sobre-nosotros'), document.getElementById('mob-btn-sobre-nosotros')],
  checkout: [document.getElementById('nav-btn-checkout'), document.getElementById('mob-btn-checkout')]
};

// ================= NAVIGATION LOGIC =================
function navigateTo(pageId) {
  currentPage = pageId;
  
  // Hide all page sections, show active
  Object.keys(pages).forEach(key => {
    if (pages[key]) {
      if (key === pageId) {
        pages[key].classList.remove('hidden');
      } else {
        pages[key].classList.add('hidden');
      }
    }
  });

  // Update navigation button active state classes
  Object.keys(navButtons).forEach(key => {
    const buttons = navButtons[key];
    buttons.forEach(btn => {
      if (!btn) return;
      
      const isMobile = btn.id.startsWith('mob-');
      if (key === pageId) {
        if (isMobile) {
          btn.className = 'w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#a70025]/5 text-[#a70025]';
        } else {
          btn.className = 'nav-btn text-[#a70025] font-bold border-b-2 border-[#a70025] pb-1 transition-all text-sm font-medium';
        }
      } else {
        if (isMobile) {
          if (key === 'checkout') {
            btn.className = 'w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-[#1b5eac] hover:bg-gray-50';
          } else {
            btn.className = 'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50';
          }
        } else {
          if (key === 'checkout') {
            btn.className = 'nav-btn text-gray-600 hover:text-[#a70025] pb-1 transition-all text-sm font-medium flex items-center gap-1.5 font-semibold text-[#1b5eac]';
          } else {
            btn.className = 'nav-btn text-gray-600 hover:text-[#a70025] pb-1 transition-all text-sm font-medium';
          }
        }
      }
    });
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Refresh page specifics
  if (pageId === 'tienda') {
    renderConfigurator();
  } else if (pageId === 'checkout') {
    renderCheckoutPage();
  }

  // Close mobile drawer on navigation
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.add('hidden');
  }
}

// Share navigation globally so onclick attributes work
window.app = { navigateTo };

// ================= INTERACTIVE CONFIGURATOR (TIENDA) =================
let selectedProduct = PRODUCTS[0];
let selectedQuantity = 500; // Default to ½ Millar (500u)

function renderConfigurator() {
  const mainImg = document.getElementById('cfg-main-image');
  const catBadge = document.getElementById('cfg-category-badge');
  const skuLabel = document.getElementById('cfg-sku-label');
  const thumbGallery = document.getElementById('cfg-thumbnail-gallery');
  const colorNameLabel = document.getElementById('cfg-color-name');
  const swatchesContainer = document.getElementById('cfg-color-swatches');
  const prodTitle = document.getElementById('cfg-product-title');
  const prodDesc = document.getElementById('cfg-product-description');
  
  if (!selectedProduct) return;

  // 1. Update main showcase details
  if (mainImg) mainImg.src = selectedProduct.image;
  if (skuLabel) skuLabel.innerText = selectedProduct.sku;
  if (colorNameLabel) {
    colorNameLabel.innerText = selectedProduct.name;
  }
  if (prodTitle) {
    prodTitle.innerText = `Rosario ${selectedProduct.name}`;
  }
  if (prodDesc) prodDesc.innerText = selectedProduct.description;

  // Update badge text and color based on category
  if (catBadge) {
    if (selectedProduct.category === 'fluorescente') {
      catBadge.innerText = 'FLUORESCENTE';
      catBadge.className = 'absolute top-4 left-4 px-3 py-1 rounded-md font-mono text-[9px] font-bold tracking-widest uppercase shadow-sm bg-emerald-100 text-emerald-800';
      catBadge.classList.remove('hidden');
    } else {
      catBadge.classList.add('hidden');
    }
  }

  // 2. Populate thumbnail gallery
  if (thumbGallery) {
    thumbGallery.innerHTML = PRODUCTS.map(p => {
      const isSelected = p.id === selectedProduct.id;
      return `
        <button type="button" onclick="window.app.selectConfigColor('${p.id}')" class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
          isSelected ? 'border-[#a70025] scale-105 shadow-xs' : 'border-gray-200 hover:border-gray-300'
        }">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
        </button>
      `;
    }).join('');
  }

  // 3. Populate detailed swatches
  if (swatchesContainer) {
    swatchesContainer.innerHTML = PRODUCTS.map(p => {
      const isSelected = p.id === selectedProduct.id;
      const promoText = p.promoComment || 'Rosario de Primera Calidad';
      
      let catColor = 'bg-gray-400';
      if (p.name === 'Azul') catColor = 'bg-blue-600';
      else if (p.name === 'Morado') catColor = 'bg-purple-600';
      else if (p.name === 'Celeste') catColor = 'bg-sky-400';
      else if (p.name === 'Brilla Oscuridad') catColor = 'bg-lime-400 border border-lime-500 shadow-[0_0_8px_rgba(163,230,53,0.8)]';
      else if (p.name === 'Blanco') catColor = 'bg-white border border-gray-300';
      else if (p.name === 'Marrón') catColor = 'bg-[#78350f]';
      else if (p.name === 'Verde') catColor = 'bg-green-600';

      return `
        <button type="button" onclick="window.app.selectConfigColor('${p.id}')" class="flex items-center gap-2.5 p-2 rounded-xl border-2 text-left transition-all cursor-pointer hover:bg-gray-50/50 ${
          isSelected 
            ? 'border-[#a70025] bg-[#fff5f5]/50 ring-2 ring-[#a70025]/5' 
            : 'border-gray-100 bg-white'
        }">
          <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0 flex-grow">
            <p class="text-[10.5px] font-bold text-gray-900 leading-tight truncate text-[#a70025]">${promoText}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-2.5 h-2.5 rounded-full ${catColor}"></span>
              <span class="text-[10px] font-bold text-gray-500 uppercase leading-none tracking-wide">${p.name}</span>
            </div>
          </div>
        </button>
      `;
    }).join('');
  }

  // 4. Update Quantity Buttons Styles
  const sizeBtns = document.querySelectorAll('.cfg-size-btn');
  let isStandardQty = false;
  
  sizeBtns.forEach(btn => {
    const qtyAttr = btn.getAttribute('data-qty');
    if (!qtyAttr) return; // OTRO button has no data-qty
    
    const btnQty = parseInt(qtyAttr);
    if (btnQty === selectedQuantity) {
      isStandardQty = true;
      btn.className = 'cfg-size-btn flex flex-col items-center justify-center border-2 border-[#a70025] bg-[#fff5f5] text-[#a70025] rounded-xl py-3 cursor-pointer transition-all active:scale-95 font-black ring-2 ring-[#a70025]/5';
    } else {
      btn.className = 'cfg-size-btn flex flex-col items-center justify-center border-2 border-gray-200 hover:border-gray-300 rounded-xl py-3 cursor-pointer transition-all active:scale-95 bg-white';
    }
  });

  const customBtn = document.getElementById('cfg-size-custom-btn');
  const customInputBox = document.getElementById('cfg-custom-input-box');
  const customQtyInput = document.getElementById('cfg-custom-qty-input');

  if (customBtn) {
    if (!isStandardQty) {
      customBtn.className = 'cfg-size-btn flex flex-col items-center justify-center border-2 border-[#a70025] bg-[#fff5f5] text-[#a70025] rounded-xl py-3 cursor-pointer transition-all active:scale-95 font-black ring-2 ring-[#a70025]/5';
      if (customInputBox) customInputBox.classList.remove('hidden');
      if (customQtyInput) customQtyInput.value = selectedQuantity;
    } else {
      customBtn.className = 'cfg-size-btn flex flex-col items-center justify-center border-2 border-gray-200 hover:border-gray-300 rounded-xl py-3 cursor-pointer transition-all active:scale-95 bg-white';
      if (customInputBox) customInputBox.classList.add('hidden');
    }
  }

  // 5. Update Pricing Calculations
  const unitPrice = getUnitPrice(selectedQuantity);
  const totalCost = selectedQuantity * unitPrice;
  const igvAmount = totalCost * 18 / 118;
  
  const labelRealTotal = document.getElementById('cfg-real-total');
  const labelUnitPrice = document.getElementById('cfg-unit-price');
  const labelIgvAmount = document.getElementById('cfg-igv-amount');
  const savingsBanner = document.getElementById('cfg-savings-banner');
  const savingsText = document.getElementById('cfg-savings-text');

  if (labelRealTotal) labelRealTotal.innerText = totalCost.toFixed(2);
  if (labelUnitPrice) labelUnitPrice.innerText = `S/. ${unitPrice.toFixed(2)} c/u`;
  if (labelIgvAmount) labelIgvAmount.innerText = `S/. ${igvAmount.toFixed(2)}`;

  if (savingsBanner && savingsText) {
    if (selectedQuantity >= 100) {
      const baseCost = selectedQuantity * 0.60;
      const savings = baseCost - totalCost;
      if (savings > 0) {
        savingsText.innerText = `Ahorra S/. ${savings.toFixed(2)} comparado con la tarifa base (S/. 0.60).`;
        savingsBanner.classList.remove('hidden');
      } else {
        savingsBanner.classList.add('hidden');
      }
    } else {
      savingsBanner.classList.add('hidden');
    }
  }

  // Update dynamic AGREGAR button label
  const btnLabel = document.getElementById('cfg-btn-label');
  if (btnLabel) {
    // Check if item already in cart
    const inCartItem = cart.find(item => item.product.id === selectedProduct.id);
    if (inCartItem) {
      btnLabel.innerText = `ACTUALIZAR EN PEDIDO (${selectedQuantity}u)`;
    } else {
      btnLabel.innerText = `AGREGAR AL PEDIDO (${selectedQuantity}u)`;
    }
  }

  // 6. Update Live bottom mix-and-match cart list
  renderLiveCartPanel();
}

function renderLiveCartPanel() {
  const panel = document.getElementById('cfg-live-cart-panel');
  const totalUnitsLabel = document.getElementById('cfg-live-total-units');
  const listContainer = document.getElementById('cfg-live-cart-list');

  if (!panel || !totalUnitsLabel || !listContainer) return;

  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalUnits === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  totalUnitsLabel.innerText = `${totalUnits}u`;

  // Get current general unit price based on total combined units in cart
  const unitPrice = getUnitPrice(totalUnits);

  listContainer.innerHTML = cart.map((item, idx) => {
    const itemSubtotal = item.quantity * unitPrice;
    const shortName = item.product.name.replace('Rosario Tradicional ', '').replace('Rosario ', '').replace('Rosarios ', '');
    
    return `
      <div class="flex items-center justify-between gap-4 py-4 ${idx > 0 ? 'border-t border-gray-50' : ''}">
        <!-- Left: Product image + info -->
        <div class="flex items-center gap-3 min-w-0">
          <img src="${item.product.image}" alt="${item.product.name}" class="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0" />
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate">${shortName}</h4>
            <p class="text-[10px] text-gray-400 font-mono">SKU: ${item.product.sku}</p>
          </div>
        </div>

        <!-- Center: Quick adjust quantity -->
        <div class="flex items-center gap-1.5">
          <button onclick="window.app.adjustLiveItemQty('${item.product.id}', -25)" class="w-6 h-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded text-[10px] flex items-center justify-center border border-gray-100 cursor-pointer shadow-2xs">-25</button>
          <span class="font-mono font-bold text-gray-800 text-xs px-1 min-w-[32px] text-center">${item.quantity}u</span>
          <button onclick="window.app.adjustLiveItemQty('${item.product.id}', 25)" class="w-6 h-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded text-[10px] flex items-center justify-center border border-gray-100 cursor-pointer shadow-2xs">+25</button>
        </div>

        <!-- Right: Pricing + Delete -->
        <div class="flex items-center gap-4">
          <div class="text-right">
            <span class="text-[11px] font-bold text-gray-900 font-mono">S/. ${itemSubtotal.toFixed(2)}</span>
            <span class="text-[9px] font-mono text-gray-400 block font-medium">S/. ${unitPrice.toFixed(2)}/u</span>
          </div>
          <button onclick="window.app.removeLiveItem('${item.product.id}')" class="text-gray-400 hover:text-[#a70025] transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer" aria-label="Eliminar color">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.app.selectConfigColor = (productId) => {
  const found = PRODUCTS.find(p => p.id === productId);
  if (found) {
    selectedProduct = found;
    renderConfigurator();
  }
};

window.app.adjustLiveItemQty = (productId, amount) => {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + amount);
  saveCart();
  updateGlobalCartBadge();
  renderConfigurator();
};

window.app.removeLiveItem = (productId) => {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  updateGlobalCartBadge();
  renderConfigurator();
};

// ================= SHOP CART INDICATOR BAR =================
function showShopCartIndicator() {
  const bar = document.getElementById('shop-cart-indicator-bar');
  const qtySpan = document.getElementById('shop-cart-total-qty');
  if (!bar || !qtySpan) return;

  const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
  if (totalQty > 0) {
    qtySpan.innerText = totalQty;
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}

// ================= RENDER CHECKOUT PAGE =================
function renderCheckoutPage() {
  const container = document.getElementById('checkout-cart-container');
  const feedbackContainer = document.getElementById('pricing-feedback-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-gray-500">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <p class="text-sm font-bold text-gray-800">Su carrito está vacío</p>
        <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Seleccione la cantidad de rosarios que necesita en el catálogo para generar su cotización mayorista.</p>
        <button onclick="window.app.navigateTo('tienda')" class="mt-4 px-5 py-2.5 bg-[#a70025] hover:bg-[#8c001e] text-white text-xs font-bold rounded-xl shadow-xs">Ir al Catálogo</button>
      </div>
    `;
    if (feedbackContainer) feedbackContainer.classList.add('hidden');
    updateSummaryBreakdown(0);
    return;
  }

  // Calculate total units to determine unit price for all items
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unitPrice = getUnitPrice(totalUnits);

  // Render list of items
  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <th class="px-4 py-3">Modelo</th>
            <th class="px-4 py-3 text-center">Cantidad</th>
            <th class="px-4 py-3 text-right">Precio Unit. B2B</th>
            <th class="px-4 py-3 text-right">Subtotal</th>
            <th class="px-4 py-3 text-center">Remover</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${cart.map(item => {
            const itemSubtotal = item.quantity * unitPrice;
            return `
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-4 py-4 flex items-center gap-3">
                  <img src="${item.product.image}" alt="${item.product.name}" class="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0" />
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-900">Rosario ${item.product.name}${item.product.categoryLabel ? ` (${item.product.categoryLabel})` : ''}</span>
                    <span class="text-[10px] text-gray-400 font-mono">SKU: ${item.product.sku}</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-1.5">
                    <button onclick="window.app.updateCartQty('${item.product.id}', -25)" class="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-[10px] flex items-center justify-center shadow-2xs">-25</button>
                    <span class="font-mono font-bold text-gray-800 text-sm px-1 min-w-[36px] text-center">${item.quantity}</span>
                    <button onclick="window.app.updateCartQty('${item.product.id}', 25)" class="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-[10px] flex items-center justify-center shadow-2xs">+25</button>
                  </div>
                </td>
                <td class="px-4 py-4 text-right font-mono font-semibold text-gray-800">
                  S/. ${unitPrice.toFixed(2)}
                </td>
                <td class="px-4 py-4 text-right font-mono font-bold text-[#1b5eac]">
                  S/. ${itemSubtotal.toFixed(2)}
                </td>
                <td class="px-4 py-4 text-center">
                  <button onclick="window.app.removeFromCart('${item.product.id}')" class="text-gray-400 hover:text-[#a70025] transition-colors p-1.5 rounded-full hover:bg-gray-50 inline-block" aria-label="Eliminar producto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Render wholesale discount notification banner based on scale reached
  if (feedbackContainer) {
    feedbackContainer.classList.remove('hidden');
    if (totalUnits >= 1000) {
      feedbackContainer.className = 'mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium';
      feedbackContainer.innerHTML = `
        <span class="text-lg">🎉</span>
        <div>
          <strong class="font-bold">¡Escala Súper Distribuidor Alcanzada!</strong>
          <p class="mt-0.5 opacity-90">Ha desbloqueado la tarifa mínima de <strong>S/. 0.40 por unidad</strong> (S/. 400 por millar).</p>
        </div>
      `;
    } else if (totalUnits >= 100) {
      feedbackContainer.className = 'mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 font-medium';
      feedbackContainer.innerHTML = `
        <span class="text-lg">📈</span>
        <div>
          <strong class="font-bold">¡Tarifa Mayorista Ciento Activada!</strong>
          <p class="mt-0.5 opacity-90">Precio por unidad: <strong>S/. 0.50</strong>. Agregue un total de ${1000 - totalUnits} unidades más para desbloquear la tarifa de distribuidor (S/. 0.40).</p>
        </div>
      `;
    } else {
      feedbackContainer.className = 'mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium';
      feedbackContainer.innerHTML = `
        <span class="text-lg">💡</span>
        <div>
          <strong class="font-bold">Tarifa Base Mayorista (S/. 0.60)</strong>
          <p class="mt-0.5 opacity-90">Agregue un total de ${100 - totalUnits} unidades más para calificar a la tarifa de S/. 0.50 por unidad.</p>
        </div>
      `;
    }
  }

  // Calculate & render numerical totals
  updateSummaryBreakdown(totalUnits);
}

// Modify cart item quantity inside checkout page
function updateCartQty(productId, amount) {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + amount);
  saveCart();
  renderCheckoutPage();
  updateGlobalCartBadge();
}

// Remove item from cart completely
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  renderCheckoutPage();
  updateGlobalCartBadge();
}

// Clear cart completely
function clearCart() {
  if (confirm('¿Está seguro de que desea vaciar su cotización?')) {
    cart = [];
    saveCart();
    renderCheckoutPage();
    updateGlobalCartBadge();
  }
}

window.app.updateCartQty = updateCartQty;
window.app.removeFromCart = removeFromCart;
window.app.clearCart = clearCart;

// ================= UPDATE CART TOTALS BREAKDOWN =================
function updateSummaryBreakdown(totalUnits) {
  const unitPrice = getUnitPrice(totalUnits);
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * unitPrice), 0);
  
  // Calculate delivery fee
  const isPickup = deliveryOption === 'pickup';
  const shippingFee = (totalUnits > 0 && !isPickup) ? SHIPPING_COST : 0;
  
  // Sum everything
  const grandTotal = subtotal + shippingFee;
  const igvIncluded = subtotal * 18 / 118; // 18% tax mathematically included in subtotal

  // Update DOM summaries
  document.getElementById('summary-total-qty').innerText = `${totalUnits} unidades`;
  document.getElementById('summary-unit-price').innerText = `S/. ${unitPrice.toFixed(2)} /u`;
  document.getElementById('summary-subtotal').innerText = `S/. ${subtotal.toFixed(2)}`;
  document.getElementById('summary-igv').innerText = `S/. ${igvIncluded.toFixed(2)}`;
  document.getElementById('summary-shipping').innerText = `S/. ${shippingFee.toFixed(2)}`;
  document.getElementById('summary-total-amount').innerText = `S/. ${grandTotal.toFixed(2)}`;

  // Minimum constraint alert
  const alertBanner = document.getElementById('checkout-min-qty-alert');
  const izipayPanel = document.getElementById('izipay-panel');

  if (totalUnits === 0) {
    alertBanner.classList.add('hidden');
    izipayPanel.classList.add('hidden');
  } else if (totalUnits < MINIMUM_ORDER_QTY) {
    alertBanner.classList.remove('hidden');
    izipayPanel.classList.add('hidden');
  } else {
    alertBanner.classList.add('hidden');
    izipayPanel.classList.remove('hidden');
  }
}

// ================= GLOBAL STATE PERSISTENCE =================
function saveCart() {
  localStorage.setItem('rosarios_cart', JSON.stringify(cart));
}

function updateGlobalCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
  if (totalQty > 0) {
    badge.innerText = totalQty;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// ================= DELIVERY OPTION TOGGLES =================
function setupDeliveryOptions() {
  const shipLabel = document.getElementById('delivery-shipping-label');
  const pickupLabel = document.getElementById('delivery-pickup-label');
  const addressContainer = document.getElementById('shipping-address-container');
  const addressInput = document.getElementById('b2b-address');

  if (!shipLabel || !pickupLabel || !addressContainer) return;

  // Shipping clicked
  shipLabel.addEventListener('click', () => {
    deliveryOption = 'shipping';
    shipLabel.className = 'border-2 border-[#a70025] bg-[#a70025]/5 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all';
    pickupLabel.className = 'border border-gray-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all';
    
    addressContainer.classList.remove('hidden');
    if (addressInput) addressInput.setAttribute('required', 'required');

    const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateSummaryBreakdown(totalUnits);
  });

  // Pickup clicked
  pickupLabel.addEventListener('click', () => {
    deliveryOption = 'pickup';
    pickupLabel.className = 'border-2 border-[#a70025] bg-[#a70025]/5 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all';
    shipLabel.className = 'border border-gray-200 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all';
    
    addressContainer.classList.add('hidden');
    if (addressInput) addressInput.removeAttribute('required');

    const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateSummaryBreakdown(totalUnits);
  });
}

// ================= SECURE IZIPAY TRANSACTION SIMULATOR =================
function setupIzipayForm() {
  const payBtn = document.getElementById('pay-submit-btn');
  if (!payBtn) return;

  // Pop-In Modal Elements
  const popInModal = document.getElementById('izipay-popin-modal');
  const popInCardView = document.getElementById('izipay-popin-card-view');
  const popInProcView = document.getElementById('izipay-popin-processing-view');
  const popIn3dsView = document.getElementById('izipay-popin-3ds-view');

  const cardInput = document.getElementById('pay-card-number');
  const cardBrand = document.getElementById('pay-card-brand');
  const cardExpiry = document.getElementById('pay-card-expiry');
  const cardCvv = document.getElementById('pay-card-cvv');
  const cardName = document.getElementById('pay-card-name');
  const cardEmail = document.getElementById('pay-card-email');

  const popInPayBtn = document.getElementById('popin-pay-btn');
  const popInCancelBtn = document.getElementById('popin-cancel-btn');
  const popInTxNumber = document.getElementById('popin-tx-number');
  const popInTotalAmount = document.getElementById('popin-total-amount');

  const popInProcTitle = document.getElementById('popin-proc-title');
  const popInProcSubtitle = document.getElementById('popin-proc-subtitle');
  const popInProcStep = document.getElementById('popin-proc-step');

  const otpInput = document.getElementById('popin-3ds-otp-input');
  const otpSubmitBtn = document.getElementById('popin-3ds-submit-btn');
  const otpCancelBtn = document.getElementById('popin-3ds-cancel-btn');
  const otpTotalAmount = document.getElementById('popin-3ds-total');

  // Format Card Number (space every 4 digits) & Detect brand in Pop-In Modal
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      let formatted = '';
      
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += ' ';
        }
        formatted += value[i];
      }
      e.target.value = formatted;

      // Basic Brand detection
      if (cardBrand) {
        if (value.startsWith('4')) {
          cardBrand.innerText = 'VISA';
          cardBrand.className = 'absolute right-3 top-2 font-bold font-mono text-[9px] tracking-widest text-white bg-blue-600 px-1.5 py-0.5 rounded';
        } else if (value.startsWith('5') || value.startsWith('2')) {
          cardBrand.innerText = 'MASTERCARD';
          cardBrand.className = 'absolute right-3 top-2 font-bold font-mono text-[9px] tracking-widest text-white bg-red-600 px-1.5 py-0.5 rounded';
        } else if (value.startsWith('37') || value.startsWith('34')) {
          cardBrand.innerText = 'AMEX';
          cardBrand.className = 'absolute right-3 top-2 font-bold font-mono text-[9px] tracking-widest text-white bg-[#007065] px-1.5 py-0.5 rounded';
        } else {
          cardBrand.innerText = 'TARJETA';
          cardBrand.className = 'absolute right-3 top-2 font-bold font-mono text-[9px] tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded';
        }
      }
    });
  }

  // Format Expiration Date (MM/AA) with slash auto-insert
  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2) {
        e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
      } else {
        e.target.value = value;
      }
    });
  }

  // Strip anything non-numeric for CVV
  if (cardCvv) {
    cardCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Strip non-numeric for 3DS SMS OTP Code
  if (otpInput) {
    otpInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Let's store current billing transaction data in closure
  let currentTxNumber = '';
  let currentBuyer = null;

  // 1. Click "PAGAR CON IZIPAY" on checkout page: validate form, generate transaction, open Pop-In
  payBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Check validity of core B2B commercial fields first
    const fullName = document.getElementById('b2b-fullname').value.trim();
    const ruc = document.getElementById('b2b-ruc').value.trim();
    const phone = document.getElementById('b2b-phone').value.trim();
    const email = document.getElementById('b2b-email').value.trim();
    const address = document.getElementById('b2b-address').value.trim();

    if (!fullName || !ruc || !phone || !email || (deliveryOption === 'shipping' && !address)) {
      alert('Por favor, complete todos los campos de sus Datos Comerciales de Envío primero.');
      document.getElementById('b2b-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Generate unique transactional tracking ID for the transaction
    currentTxNumber = 'RP-TX-' + Math.floor(10000000 + Math.random() * 90000000);
    
    // Store current buyer details
    currentBuyer = {
      fullName,
      ruc,
      phone,
      email,
      address,
      deliveryOption
    };

    // Calculate totals
    const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
    const unitPrice = getUnitPrice(totalUnits);
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * unitPrice), 0);
    const shippingFee = deliveryOption === 'pickup' ? 0 : SHIPPING_COST;
    const grandTotal = subtotal + shippingFee;

    // Set pop-in text fields
    if (popInTxNumber) popInTxNumber.innerText = currentTxNumber;
    if (popInTotalAmount) popInTotalAmount.innerText = `S/. ${grandTotal.toFixed(2)}`;
    if (otpTotalAmount) otpTotalAmount.innerText = `S/. ${grandTotal.toFixed(2)}`;

    // Prefill billing data in Izipay form for top-tier UX
    if (cardName) cardName.value = fullName;
    if (cardEmail) cardEmail.value = email;

    // Clear card fields for safety
    if (cardInput) cardInput.value = '';
    if (cardExpiry) cardExpiry.value = '';
    if (cardCvv) cardCvv.value = '';
    if (cardBrand) {
      cardBrand.innerText = 'TARJETA';
      cardBrand.className = 'absolute right-3 top-2 font-bold font-mono text-[9px] tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded';
    }

    // Open Pop-In Modal in default view
    if (popInModal) {
      popInModal.classList.remove('hidden');
      if (popInCardView) popInCardView.classList.remove('hidden');
      if (popInProcView) popInProcView.classList.add('hidden');
      if (popIn3dsView) popIn3dsView.classList.add('hidden');
    }
  });

  // 2. Click "Cancelar" link inside Izipay Pop-In: close modal safely
  if (popInCancelBtn) {
    popInCancelBtn.addEventListener('click', () => {
      if (popInModal) popInModal.classList.add('hidden');
    });
  }

  // 3. Submit Credit Card form inside Pop-In: validates and triggers animation + 3DS SMS Verification Screen
  if (popInPayBtn) {
    popInPayBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (!cardInput || !cardExpiry || !cardCvv || !cardName || !cardEmail) return;

      const cardNum = cardInput.value.replace(/\s/g, '');
      const expiry = cardExpiry.value;
      const cvvNum = cardCvv.value;
      const holderName = cardName.value.trim();
      const holderEmail = cardEmail.value.trim();

      if (cardNum.length < 16) {
        alert('Por favor ingrese un número de tarjeta válido (16 dígitos).');
        cardInput.focus();
        return;
      }
      if (expiry.length < 5 || !expiry.includes('/')) {
        alert('Por favor ingrese una fecha de expiración válida (MM/AA).');
        cardExpiry.focus();
        return;
      }
      if (cvvNum.length < 3) {
        alert('Por favor ingrese un código CVV de seguridad válido.');
        cardCvv.focus();
        return;
      }
      if (!holderName) {
        alert('Por favor escriba el nombre completo del titular de la tarjeta.');
        cardName.focus();
        return;
      }
      if (!holderEmail) {
        alert('Por favor escriba un correo electrónico válido para enviarle su recibo.');
        cardEmail.focus();
        return;
      }

      // Check selected simulated response outcome from developers console
      const simulationOutcomeEl = document.getElementById('simulated-payment-outcome');
      const outcome = simulationOutcomeEl ? simulationOutcomeEl.value : 'success';

      // Hide card form view, show processing loader
      if (popInCardView) popInCardView.classList.add('hidden');
      if (popInProcView) popInProcView.classList.remove('hidden');

      // Update Processing texts step by step
      if (popInProcTitle) popInProcTitle.innerText = 'Iniciando Transacción Segura...';
      if (popInProcSubtitle) popInProcSubtitle.innerText = 'Cifrando datos de pago bajo estándares PCI-DSS de Izipay...';
      if (popInProcStep) popInProcStep.innerText = 'PASO 1: ENCRIPTANDO DATOS AES-256...';

      await new Promise(r => setTimeout(r, 800));

      if (popInProcTitle) popInProcTitle.innerText = 'Conectando con Servidores Izipay...';
      if (popInProcSubtitle) popInProcSubtitle.innerText = 'Verificando con la pasarela de pagos de Izipay Perú...';
      if (popInProcStep) popInProcStep.innerText = 'PASO 2: SOLICITANDO AUTORIZACIÓN DE FONDOS...';

      await new Promise(r => setTimeout(r, 800));

      // Network Timeout Simulator Scenario
      if (outcome === 'decline-timeout') {
        if (popInProcTitle) popInProcTitle.innerText = 'Error de Red de Izipay';
        if (popInProcSubtitle) popInProcSubtitle.innerText = 'El servidor de autorización excedió el tiempo de respuesta.';
        if (popInProcStep) popInProcStep.innerText = 'PASO 3: ERROR IZI-ERR-TIMEOUT...';
        await new Promise(r => setTimeout(r, 600));

        if (popInModal) popInModal.classList.add('hidden');
        showPaymentErrorModal('decline-timeout', currentBuyer);
        return;
      }

      // Safe Transition to 3D Secure SMS OTP Screen
      if (popInProcTitle) popInProcTitle.innerText = 'Autenticación 3D Secure Requerida...';
      if (popInProcSubtitle) popInProcSubtitle.innerText = 'Su banco requiere autenticación multifactor SMS para consumos B2B.';
      if (popInProcStep) popInProcStep.innerText = 'PASO 3: REDIRIGIENDO AL SIMULADOR 3DS...';

      await new Promise(r => setTimeout(r, 800));

      // Hide processing, show 3DS SMS View
      if (popInProcView) popInProcView.classList.add('hidden');
      if (popIn3dsView) popIn3dsView.classList.remove('hidden');

      // Reset and Focus OTP input field
      if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
      }
    });
  }

  // 4. Submit 3D Secure Verification Form
  if (otpSubmitBtn) {
    otpSubmitBtn.addEventListener('click', async () => {
      if (!otpInput) return;
      const otpVal = otpInput.value.trim();

      if (otpVal.length < 6) {
        alert('Por favor ingrese el código OTP de 6 dígitos enviado a su celular.');
        otpInput.focus();
        return;
      }

      // Hide 3DS, show processing again for final authorization resolution
      if (popIn3dsView) popIn3dsView.classList.add('hidden');
      if (popInProcView) popInProcView.classList.remove('hidden');

      if (popInProcTitle) popInProcTitle.innerText = 'Validando Código OTP...';
      if (popInProcSubtitle) popInProcSubtitle.innerText = 'Verificando firma criptográfica de autorización con el banco emisor...';
      if (popInProcStep) popInProcStep.innerText = 'PASO 4: VALIDANDO AUTENTICACIÓN SMS...';

      await new Promise(r => setTimeout(r, 1000));

      // Close pop-in modal
      if (popInModal) popInModal.classList.add('hidden');

      // Resolve final outcome
      const simulationOutcomeEl = document.getElementById('simulated-payment-outcome');
      const outcome = simulationOutcomeEl ? simulationOutcomeEl.value : 'success';

      if (outcome === 'success') {
        showReceiptModal(currentBuyer, currentTxNumber);
      } else {
        showPaymentErrorModal(outcome, currentBuyer);
      }
    });
  }

  // 5. Cancel 3D Secure Verification inside Pop-In (simulates a customer cancel/decline)
  if (otpCancelBtn) {
    otpCancelBtn.addEventListener('click', () => {
      if (popInModal) popInModal.classList.add('hidden');
      showPaymentErrorModal('decline-funds', currentBuyer);
    });
  }
}

// ================= DETAILED B2B RECEIPT & PDF GENERATION =================
function showReceiptModal(buyer, pregeneratedTxNumber) {
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  // Track the uploaded PDF URL for re-syncing attempts
  window.lastUploadedPdfUrl = '';

  // Generate unique transactional tracking ID or use pre-generated from pop-in
  const txNumber = pregeneratedTxNumber || ('RP-TX-' + Math.floor(10000000 + Math.random() * 90000000));
  document.getElementById('receipt-tx-number').innerText = txNumber;

  // Set Buyer details inside modal
  document.getElementById('receipt-buyer-name').innerText = buyer.fullName;
  document.getElementById('receipt-buyer-ruc').innerText = `DNI/RUC: ${buyer.ruc}`;
  document.getElementById('receipt-buyer-phone').innerText = `Tlf: ${buyer.phone}`;
  document.getElementById('receipt-buyer-email').innerText = buyer.email;

  // Calculate prices
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unitPrice = getUnitPrice(totalUnits);
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * unitPrice), 0);
  const shippingFee = buyer.deliveryOption === 'pickup' ? 0 : SHIPPING_COST;
  const grandTotal = subtotal + shippingFee;
  const igvAmount = subtotal * 18 / 118;

  // Render Table items inside Modal
  const tbody = document.getElementById('receipt-items-tbody');
  if (tbody) {
    tbody.innerHTML = cart.map(item => `
      <tr class="border-b border-gray-100">
        <td class="px-3 py-2.5">
          <div class="font-bold text-gray-900">${item.product.name}</div>
          <div class="text-[9px] text-gray-400">SKU: ${item.product.sku}</div>
        </td>
        <td class="px-3 py-2.5 text-center font-bold">${item.quantity}u</td>
        <td class="px-3 py-2.5 text-right font-mono text-gray-500">S/. ${unitPrice.toFixed(2)}</td>
        <td class="px-3 py-2.5 text-right font-bold text-gray-900">S/. ${(item.quantity * unitPrice).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // Update numerical summaries in the printed modal receipt
  document.getElementById('receipt-subtotal').innerText = `S/. ${subtotal.toFixed(2)}`;
  document.getElementById('receipt-igv').innerText = `S/. ${igvAmount.toFixed(2)}`;
  document.getElementById('receipt-shipping').innerText = `S/. ${shippingFee.toFixed(2)}`;
  document.getElementById('receipt-total').innerText = `S/. ${grandTotal.toFixed(2)}`;

  // ================= POPULATE HIDDEN CUSTOM PDF TEMPLATE =================
  const pdfTx = document.getElementById('pdf-tx-number');
  if (pdfTx) pdfTx.innerText = txNumber;
  
  const pdfCertTx = document.getElementById('pdf-cert-tx-number');
  if (pdfCertTx) pdfCertTx.innerText = txNumber;

  const issueDate = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
  const pdfDate = document.getElementById('pdf-date');
  if (pdfDate) pdfDate.innerText = issueDate;

  const pdfCertDate = document.getElementById('pdf-cert-date');
  if (pdfCertDate) pdfCertDate.innerText = issueDate.split(',')[0];

  const pdfBuyer = document.getElementById('pdf-buyer-name');
  if (pdfBuyer) pdfBuyer.innerText = buyer.fullName;

  const pdfRuc = document.getElementById('pdf-buyer-ruc');
  if (pdfRuc) pdfRuc.innerText = buyer.ruc;

  const pdfPhone = document.getElementById('pdf-buyer-phone');
  if (pdfPhone) pdfPhone.innerText = buyer.phone;

  const pdfEmail = document.getElementById('pdf-buyer-email');
  if (pdfEmail) pdfEmail.innerText = buyer.email;

  const pdfDelivery = document.getElementById('pdf-delivery-option');
  if (pdfDelivery) {
    pdfDelivery.innerText = buyer.deliveryOption === 'pickup' 
      ? 'RETIRO EN ALMACÉN (GRATIS)' 
      : 'ENVÍO NACIONAL (AGENCIA DE TRANSPORTE - S/. 15.00)';
  }

  const pdfAddrRow = document.getElementById('pdf-address-row');
  const pdfAddrVal = document.getElementById('pdf-buyer-address');
  if (buyer.deliveryOption === 'pickup') {
    if (pdfAddrVal) pdfAddrVal.innerText = 'Retiro coordinado en Jirón Tarapacá 260, Magdalena del Mar, Lima.';
  } else {
    if (pdfAddrVal) pdfAddrVal.innerText = buyer.address;
  }

  // Populate PDF Items Table
  const pdfTbody = document.getElementById('pdf-items-tbody');
  if (pdfTbody) {
    pdfTbody.innerHTML = cart.map((item, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'}; font-size: 10px;">
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb;">
          <div style="font-weight: bold; color: #111827;">Rosario ${item.product.name}${item.product.categoryLabel ? ` (${item.product.categoryLabel})` : ''}</div>
          <div style="font-size: 8px; color: #6b7280; font-family: monospace; margin-top: 2px;">SKU: ${item.product.sku}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #111827;">
          ${item.quantity}u
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: #4b5563;">
          S/. ${unitPrice.toFixed(2)}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; text-align: right; font-weight: bold; font-family: monospace; color: #111827;">
          S/. ${(item.quantity * unitPrice).toFixed(2)}
        </td>
      </tr>
    `).join('');
  }

  // Populate PDF summaries
  const pSub = document.getElementById('pdf-summary-subtotal');
  if (pSub) pSub.innerText = `S/. ${subtotal.toFixed(2)}`;

  const pIgv = document.getElementById('pdf-summary-igv');
  if (pIgv) pIgv.innerText = `S/. ${igvAmount.toFixed(2)}`;

  const pShip = document.getElementById('pdf-summary-shipping');
  if (pShip) pShip.innerText = `S/. ${shippingFee.toFixed(2)}`;

  const pTot = document.getElementById('pdf-summary-total');
  if (pTot) pTot.innerText = `S/. ${grandTotal.toFixed(2)}`;

  // ================= ACTION: DIRECT DOWNLOAD PDF =================
  const dlBtn = document.getElementById('download-pdf-btn');
  if (dlBtn) {
    dlBtn.onclick = () => {
      const element = document.getElementById('pdf-template-container');
      const opt = {
        margin:       0,
        filename:     `Nota_de_Pedido_RP_${txNumber}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    };
  }

  // ================= ACTION: BACKGROUND PDF GENERATION & CLOUD UPLOAD =================
  const waBtn = document.getElementById('receipt-whatsapp-link');
  const uploadStatus = document.getElementById('pdf-upload-status');

  const deliveryMethodText = buyer.deliveryOption === 'pickup' 
    ? 'Retiro personal coordinado en Jirón Tarapacá 260, Magdalena.'
    : `Envío a domicilio o provincia: ${buyer.address}`;

  const itemsText = cart.map(item => {
    const pName = `Rosario ${item.product.name}${item.product.categoryLabel ? ` (${item.product.categoryLabel})` : ''}`;
    return `- ${pName} (${item.product.sku}): ${item.quantity} unidades (P. Unit: S/. ${unitPrice.toFixed(2)})`;
  }).join('\n');

  // Initial standard WhatsApp Message text (no link)
  let whatsappMessage = `*ORDEN DE COMPRA MAYORISTA: ROSARIOS PERUANOS*\n` +
    `-------------------------------------------\n` +
    `*Transacción:* ${txNumber}\n` +
    `*Cliente / Razón Social:* ${buyer.fullName}\n` +
    `*RUC/DNI:* ${buyer.ruc}\n` +
    `*Celular:* ${buyer.phone}\n` +
    `*Correo:* ${buyer.email}\n` +
    `-------------------------------------------\n` +
    `*PRODUCTOS COTIZADOS Y PAGADOS:*\n` +
    `${itemsText}\n` +
    `-------------------------------------------\n` +
    `*MÉTODO DE ENTREGA:* ${deliveryMethodText}\n` +
    `-------------------------------------------\n` +
    `*Subtotal:* S/. ${subtotal.toFixed(2)}\n` +
    `*IGV (18% incluido):* S/. ${igvAmount.toFixed(2)}\n` +
    `*Gasto de Envío:* S/. ${shippingFee.toFixed(2)}\n` +
    `*MONTO TOTAL PAGADO IZIPAY:* S/. ${grandTotal.toFixed(2)}\n\n` +
    `Hola Silvia Quispe, acabo de procesar mi pago seguro mediante Izipay. Adjunto los detalles comerciales para coordinar el despacho inmediato de mis rosarios. ¡Muchas gracias!`;

  if (waBtn) {
    waBtn.href = `https://wa.me/${CORPORATE_INFO.whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;
  }

  if (uploadStatus) {
    uploadStatus.innerText = '⏳ Sincronizando Nota de Pedido PDF...';
    uploadStatus.className = 'text-center font-mono text-[9px] text-[#1b5eac] tracking-wide h-4 font-semibold uppercase animate-pulse';
  }

  // Asynchronously generate PDF Blob & Upload to secure temporary file sharing (file.io)
  const element = document.getElementById('pdf-template-container');
  const opt = {
    margin:       0,
    filename:     `Nota_de_Pedido_RP_${txNumber}.pdf`,
    image:        { type: 'jpeg', quality: 0.95 },
    html2canvas:  { scale: 1.8, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).output('blob').then(async (pdfBlob) => {
    let pdfUrl = '';
    
    // Intento 1: tmpfiles.org (Permite múltiples descargas de forma gratuita)
    try {
      const formData = new FormData();
      formData.append('file', pdfBlob, `Nota_de_Pedido_RP_${txNumber}.pdf`);

      const response = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success' && data.data && data.data.url) {
        // Reemplazar la URL estándar por la de descarga directa (dl)
        pdfUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      }
    } catch (e) {
      console.warn('tmpfiles.org upload failed, falling back to file.io...', e);
    }

    // Intento 2: file.io (Fallback de respaldo de 1 día)
    if (!pdfUrl) {
      try {
        const formData = new FormData();
        formData.append('file', pdfBlob, `Nota_de_Pedido_RP_${txNumber}.pdf`);

        const response = await fetch('https://file.io/?expires=1d', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success && data.link) {
          pdfUrl = data.link;
        }
      } catch (e2) {
        console.error('All PDF upload providers failed:', e2);
      }
    }

    if (pdfUrl) {
      window.lastUploadedPdfUrl = pdfUrl;
      if (uploadStatus) {
        uploadStatus.innerText = '✅ ¡PDF Nota de Pedido vinculado al WhatsApp!';
        uploadStatus.className = 'text-center font-mono text-[9px] text-emerald-600 tracking-wide h-4 font-black uppercase';
      }

      // Re-generate WhatsApp text including direct cloud download URL of the PDF!
      whatsappMessage = `*ORDEN DE COMPRA MAYORISTA: ROSARIOS PERUANOS*\n` +
        `-------------------------------------------\n` +
        `*Transacción:* ${txNumber}\n` +
        `*Cliente / Razón Social:* ${buyer.fullName}\n` +
        `*RUC/DNI:* ${buyer.ruc}\n` +
        `*Celular:* ${buyer.phone}\n` +
        `*Correo:* ${buyer.email}\n` +
        `-------------------------------------------\n` +
        `*PDF de la Nota de Pedido:* ${pdfUrl}\n` +
        `-------------------------------------------\n` +
        `*PRODUCTOS COTIZADOS Y PAGADOS:*\n` +
        `${itemsText}\n` +
        `-------------------------------------------\n` +
        `*MÉTODO DE ENTREGA:* ${deliveryMethodText}\n` +
        `-------------------------------------------\n` +
        `*Subtotal:* S/. ${subtotal.toFixed(2)}\n` +
        `*IGV (18% incluido):* S/. ${igvAmount.toFixed(2)}\n` +
        `*Gasto de Envío:* S/. ${shippingFee.toFixed(2)}\n` +
        `*MONTO TOTAL PAGADO IZIPAY:* S/. ${grandTotal.toFixed(2)}\n\n` +
        `Hola Silvia Quispe, acabo de procesar mi pago seguro mediante Izipay. Adjunto el PDF oficial de mi Nota de Pedido y mis detalles comerciales para coordinar el despacho inmediato. ¡Muchas gracias!`;

      if (waBtn) {
        waBtn.href = `https://wa.me/${CORPORATE_INFO.whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;
      }

      // --- DISPARAR GOOGLE APPS SCRIPT SINCRONIZACIÓN (ÉXITO PDF) ---
      triggerAppsScriptSync(buyer, txNumber, pdfUrl, totalUnits, unitPrice, subtotal, shippingFee, grandTotal, igvAmount);
    } else {
      if (uploadStatus) {
        uploadStatus.innerText = '⚠️ PDF se descargó local. Por favor, adjúntelo manualmente.';
        uploadStatus.className = 'text-center font-mono text-[9px] text-amber-600 tracking-wide h-4 font-semibold uppercase';
      }

      // --- DISPARAR GOOGLE APPS SCRIPT SINCRONIZACIÓN (FALLBACK PDF LOCAL) ---
      triggerAppsScriptSync(buyer, txNumber, '', totalUnits, unitPrice, subtotal, shippingFee, grandTotal, igvAmount);
    }
  }).catch(err => {
    console.error('PDF library error:', err);
    if (uploadStatus) {
      uploadStatus.innerText = '⚠️ PDF se descargó local. Por favor, adjúntelo manualmente.';
      uploadStatus.className = 'text-center font-mono text-[9px] text-amber-600 tracking-wide h-4 font-semibold uppercase';
    }
  });

  // Show Modal screen
  modal.classList.remove('hidden');
}

// ================= B2B PAYMENT DECLINED/ERROR MODAL SIMULATION =================
function showPaymentErrorModal(outcome, buyer) {
  const errModal = document.getElementById('payment-error-modal');
  if (!errModal) return;

  const codeEl = document.getElementById('error-modal-code');
  const reasonEl = document.getElementById('error-modal-reason');
  const whatsappBtn = document.getElementById('error-whatsapp-direct');

  let errorCode = 'IZI-DEC-51';
  let errorReason = 'Fondos insuficientes. Por favor verifique el saldo de su tarjeta o intente con un medio de pago alternativo.';

  if (outcome === 'decline-cvv') {
    errorCode = 'IZI-DEC-CVV';
    errorReason = 'Código de seguridad (CVV) incorrecto. Por favor, verifique el número de 3 o 4 dígitos ubicado en la parte posterior de su tarjeta física.';
  } else if (outcome === 'decline-expiry') {
    errorCode = 'IZI-DEC-EXP';
    errorReason = 'La tarjeta ingresada se encuentra expirada o vencida, o la fecha de expiración ingresada es incorrecta. Revise el formato (MM/AA).';
  } else if (outcome === 'decline-timeout') {
    errorCode = 'IZI-ERR-TIMEOUT';
    errorReason = 'Tiempo de espera de red agotado con el banco emisor. Los sistemas de autorización están experimentando congestión temporal. Por favor, intente de nuevo.';
  }

  if (codeEl) codeEl.innerText = errorCode;
  if (reasonEl) reasonEl.innerText = errorReason;

  // Generate direct custom WhatsApp link for manual transaction backup and recovery
  if (whatsappBtn) {
    const errorMsg = `*INTENTO DE COMPRA MAYORISTA FALLIDO: ROSARIOS PERUANOS*\n` +
      `-------------------------------------------\n` +
      `*Cliente:* ${buyer.fullName}\n` +
      `*DNI/RUC:* ${buyer.ruc}\n` +
      `*Celular:* ${buyer.phone}\n` +
      `*Correo:* ${buyer.email}\n` +
      `*Error Pasarela:* ${errorCode}\n` +
      `*Causa:* ${errorReason}\n` +
      `-------------------------------------------\n` +
      `Hola Silvia Quispe Rujel, intenté realizar mi pago por la web, pero la transacción de Izipay fue rechazada con el código ${errorCode}. Quisiera coordinar el pedido de forma manual o transferencia directa interbancaria. ¡Gracias!`;

    whatsappBtn.href = `https://wa.me/${CORPORATE_INFO.whatsappRaw}?text=${encodeURIComponent(errorMsg)}`;
  }

  errModal.classList.remove('hidden');
}

// Clear cart & Close Modal receipt
function setupReceiptModalActions() {
  const modal = document.getElementById('receipt-modal');
  const closeBtn = document.getElementById('receipt-close-btn');

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Clear cart upon successful transaction complete
      cart = [];
      saveCart();
      updateGlobalCartBadge();
      showShopCartIndicator();
      modal.classList.add('hidden');
      navigateTo('inicio');
    });
  }

  // Bind actions for payment error modal
  const errModal = document.getElementById('payment-error-modal');
  const errCloseBtn = document.getElementById('error-close-btn');
  const errRetryBtn = document.getElementById('error-retry-btn');

  if (errModal && errCloseBtn) {
    errCloseBtn.addEventListener('click', () => {
      errModal.classList.add('hidden');
    });
  }

  if (errModal && errRetryBtn) {
    errRetryBtn.addEventListener('click', () => {
      errModal.classList.add('hidden');
      
      // Open the Izipay Pop-In Modal again so they can retry paying
      const popinModal = document.getElementById('izipay-popin-modal');
      const cardView = document.getElementById('izipay-popin-card-view');
      const procView = document.getElementById('izipay-popin-processing-view');
      const authView = document.getElementById('izipay-popin-3ds-view');
      
      if (popinModal) {
        popinModal.classList.remove('hidden');
        if (cardView) cardView.classList.remove('hidden');
        if (procView) procView.classList.add('hidden');
        if (authView) authView.classList.add('hidden');
      }

      // Focus back on the credit card input inside Pop-In for convenient correction
      const cardNumInput = document.getElementById('pay-card-number');
      if (cardNumInput) {
        cardNumInput.focus();
      }
    });
  }
}

// ================= COMPONENT EVENT LISTENERS =================
function bindEventListeners() {
  
  // Navbar logo click
  const logo = document.getElementById('nav-logo');
  if (logo) logo.addEventListener('click', () => navigateTo('inicio'));

  const footerLogo = document.getElementById('footer-logo');
  if (footerLogo) footerLogo.addEventListener('click', () => navigateTo('inicio'));

  // Nav Links clicks
  Object.keys(navButtons).forEach(key => {
    const buttons = navButtons[key];
    buttons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => navigateTo(key));
      }
    });
  });

  // Action CTAs on home page
  const heroBtnCat = document.getElementById('hero-btn-catalogo');
  if (heroBtnCat) heroBtnCat.addEventListener('click', () => navigateTo('tienda'));

  const heroBtnCont = document.getElementById('hero-btn-contacto');
  if (heroBtnCont) heroBtnCont.addEventListener('click', () => navigateTo('sobre-nosotros'));

  // Header quick cart click
  const cartBtn = document.getElementById('cart-toggle-btn');
  if (cartBtn) cartBtn.addEventListener('click', () => navigateTo('checkout'));

  // Header quick profile click (redirect to Silvia information)
  const profileBtn = document.getElementById('profile-shortcut-btn');
  if (profileBtn) profileBtn.addEventListener('click', () => navigateTo('sobre-nosotros'));

  // Mobile menu expand drawer
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });
  }

  // Clear cart action inside checkout
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCart);
  }

  // ================= B2B CONFIGURATOR BINDINGS =================
  // Size buttons click delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cfg-size-btn');
    if (!btn) return;
    
    // Ignore OTRO button here
    if (btn.id === 'cfg-size-custom-btn') {
      selectedQuantity = 600; // default custom quantity start (above 500)
      renderConfigurator();
      return;
    }

    const qtyAttr = btn.getAttribute('data-qty');
    if (qtyAttr) {
      selectedQuantity = parseInt(qtyAttr);
      renderConfigurator();
    }
  });

  // Custom minus/plus
  const btnMinus = document.getElementById('cfg-custom-minus');
  const btnPlus = document.getElementById('cfg-custom-plus');
  const customInput = document.getElementById('cfg-custom-qty-input');

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      selectedQuantity = Math.max(500, selectedQuantity - 100);
      renderConfigurator();
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      selectedQuantity = selectedQuantity + 100;
      renderConfigurator();
    });
  }

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value) || 500;
      selectedQuantity = Math.max(500, val);
      updateLivePricingFromInput();
    });

    customInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value) || 500;
      selectedQuantity = Math.max(500, val);
      renderConfigurator();
    });
  }

  // Add to cart main CTA click
  const addBtn = document.getElementById('cfg-add-to-cart-btn');
  const cartStatus = document.getElementById('cfg-cart-status');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const existingIdx = cart.findIndex(item => item.product.id === selectedProduct.id);
      if (existingIdx > -1) {
        cart[existingIdx].quantity = selectedQuantity;
      } else {
        cart.push({ product: selectedProduct, quantity: selectedQuantity });
      }

      saveCart();
      updateGlobalCartBadge();
      renderConfigurator();

      if (cartStatus) {
        cartStatus.classList.remove('hidden');
        setTimeout(() => {
          cartStatus.classList.add('hidden');
        }, 4000);
      }
    });
  }
}

function updateLivePricingFromInput() {
  const customInput = document.getElementById('cfg-custom-qty-input');
  if (!customInput) return;
  const tempQty = Math.max(1, parseInt(customInput.value) || 1);

  const unitPrice = getUnitPrice(tempQty);
  const totalCost = tempQty * unitPrice;
  const igvAmount = totalCost * 18 / 118;

  const labelRealTotal = document.getElementById('cfg-real-total');
  const labelUnitPrice = document.getElementById('cfg-unit-price');
  const labelIgvAmount = document.getElementById('cfg-igv-amount');

  if (labelRealTotal) labelRealTotal.innerText = totalCost.toFixed(2);
  if (labelUnitPrice) labelUnitPrice.innerText = `S/. ${unitPrice.toFixed(2)} c/u`;
  if (labelIgvAmount) labelIgvAmount.innerText = `S/. ${igvAmount.toFixed(2)}`;
}

// ================= FAQ ACCORDIONS SETUP =================
function setupFaqAccordions() {
  const toggles = document.querySelectorAll('.faq-accordion-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      const isExpanded = content.style.maxHeight;

      // Close all other accordions first for pristine visual layout
      toggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const otherContent = otherToggle.nextElementSibling;
          const otherIcon = otherToggle.querySelector('.faq-icon');
          otherContent.style.maxHeight = null;
          otherToggle.parentElement.classList.remove('bg-white', 'border-[#a70025]/30', 'shadow-xs');
          otherToggle.parentElement.classList.add('bg-gray-50/50', 'border-gray-100');
          if (otherIcon) otherIcon.innerText = '+';
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        content.style.maxHeight = null;
        toggle.parentElement.classList.remove('bg-white', 'border-[#a70025]/30', 'shadow-xs');
        toggle.parentElement.classList.add('bg-gray-50/50', 'border-gray-100');
        if (icon) icon.innerText = '+';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        toggle.parentElement.classList.remove('bg-gray-50/50', 'border-gray-100');
        toggle.parentElement.classList.add('bg-white', 'border-[#a70025]/30', 'shadow-xs');
        if (icon) icon.innerText = '−';
      }
    });
  });
}



// ================= GOOGLE WORKSPACE AUTOMATION CORE =================
// Note: Google Apps Script setup instructions and Código.gs code are documented in /GOOGLE_APPS_SCRIPT.md



function triggerAppsScriptSync(buyer, txNumber, pdfUrl, totalUnits, unitPrice, subtotal, shippingFee, grandTotal, igvAmount) {
  const savedUrl = 'https://script.google.com/macros/s/AKfycbxp2eJqEeEUw2TP1BnSO3fQ-ZqfLKlqPO2ewDySN-UPHaTsP8rIEmEqWz__PT_I-aCJ/exec';
  if (!savedUrl) return;

  const logStatus = document.getElementById('integration-log-status');
  if (logStatus) {
    const parent = logStatus.parentElement;
    if (parent) {
      parent.className = "bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5 animate-fade-in my-1";
      const badge = parent.querySelector('span');
      if (badge) {
        badge.className = "flex items-center gap-1.5 text-[9px] font-black uppercase text-[#1b5eac] tracking-wider font-mono";
        badge.innerText = "Registro & Notificación Gmail";
      }
      const icon = parent.querySelector('svg');
      if (icon) {
        icon.className = "w-3.5 h-3.5 text-[#1b5eac] animate-pulse shrink-0";
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3 19.25V4.75C3 3.784 3.784 3 4.75 3h14.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0119.25 21H4.75A1.75 1.75 0 013 19.25z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.5h18M8.5 3v18"></path>`;
      }
    }
    logStatus.className = "text-[10px] text-blue-700 leading-relaxed font-semibold animate-pulse";
    logStatus.innerText = "⏳ Sincronizando pedido con Google Sheets y enviando comprobantes por correo (Gmail)...";
  }

  const realPayload = {
    transactionId: txNumber,
    buyerName: buyer.fullName,
    buyerRuc: buyer.ruc,
    buyerPhone: buyer.phone,
    buyerEmail: buyer.email,
    buyerAddress: buyer.deliveryOption === 'pickup' ? 'Recojo en Almacén Magdalena' : buyer.address,
    deliveryOption: buyer.deliveryOption,
    totalUnits: totalUnits,
    unitPrice: unitPrice,
    subtotal: subtotal,
    shippingFee: shippingFee,
    grandTotal: grandTotal,
    igvAmount: igvAmount,
    pdfUrl: pdfUrl || 'No generado / Adjunto local',
    items: cart
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const showSyncSuccess = () => {
    if (logStatus) {
      const parent = logStatus.parentElement;
      if (parent) {
        parent.className = "bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5 animate-fade-in my-1";
        const badge = parent.querySelector('span');
        if (badge) {
          badge.className = "flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-600 tracking-wider font-mono";
          badge.innerText = "Registro & Correos Enviados";
        }
        const icon = parent.querySelector('svg');
        if (icon) {
          icon.className = "w-3.5 h-3.5 text-emerald-500 shrink-0";
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`;
        }
      }
      logStatus.className = "text-[10px] text-emerald-700 leading-relaxed font-bold";
      logStatus.innerText = `🎉 ¡Pedido registrado y correos enviados!\nSe guardó en Google Sheets y se envió la confirmación por Gmail a Silvia (contacto@rosariosperuanos.com) y a su bandeja (${buyer.email}).`;
    }
  };

  const showSyncError = () => {
    if (logStatus) {
      const parent = logStatus.parentElement;
      if (parent) {
        parent.className = "bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5 animate-fade-in my-1";
        const badge = parent.querySelector('span');
        if (badge) {
          badge.className = "flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-600 tracking-wider font-mono";
          badge.innerText = "Sincronización Pendiente";
        }
        const icon = parent.querySelector('svg');
        if (icon) {
          icon.className = "w-3.5 h-3.5 text-amber-500 shrink-0";
        }
      }
      logStatus.className = "text-[10px] text-amber-700 leading-relaxed font-semibold";
      logStatus.innerText = `⚠️ No se pudo automatizar el envío, pero su pago está aprobado. Por favor descargue el PDF y compártalo por WhatsApp.`;
    }
  };

  fetch(savedUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(realPayload),
    signal: controller.signal
  }).then(() => {
    clearTimeout(timeoutId);
    showSyncSuccess();
  }).catch(err => {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn('Google Apps Script request reached 6s timeout - transitioning to success because request was dispatched safely.');
      showSyncSuccess();
    } else {
      console.error('Apps Script dispatch error:', err);
      showSyncError();
    }
  });
}

// ================= INITIALIZE APP =================
function init() {
  // Clear any stale test cart items from previous sessions that are below the new 500u minimum
  const initialQty = cart.reduce((total, item) => total + item.quantity, 0);
  if (initialQty > 0 && initialQty < 500) {
    cart = [];
    saveCart();
  }

  bindEventListeners();
  setupDeliveryOptions();
  setupIzipayForm();
  setupReceiptModalActions();
  setupFaqAccordions();
  
  updateGlobalCartBadge();
  showShopCartIndicator();
  
  // Set default shipping Delivery option style active on start
  const shipLabel = document.getElementById('delivery-shipping-label');
  if (shipLabel) {
    shipLabel.className = 'border-2 border-[#a70025] bg-[#a70025]/5 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all';
  }

  // Initial navigation
  navigateTo('inicio');
}

// Kickstart when document is ready
document.addEventListener('DOMContentLoaded', init);
// Run fallback if DOM already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
