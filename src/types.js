// WHOLESALE GLOBAL CONFIGURATION
export const WHOLESALE_MOQ = 12; // Minimum units per product
export const MIN_ORDER_TOTAL = 500; // Minimum S/ for wholesale checkout

export const PRICE_TIERS = [
  { minQty: 12, maxQty: 23, discountPercent: 0.30, label: "Mayorista Junior (30% OFF)" },
  { minQty: 24, maxQty: 47, discountPercent: 0.40, label: "Distribuidor (40% OFF)" },
  { minQty: 48, maxQty: 9999, discountPercent: 0.55, label: "Socio Master (55% OFF)" }
];

/**
 * Returns the MOQ for a given product and size.
 */
export function getProductMinOrderQuantity(product, size) {
  if (product.sizeMOQs && product.sizeMOQs[size]) {
    return product.sizeMOQs[size];
  }
  if (product.minOrderQuantity) {
    return product.minOrderQuantity;
  }
  return WHOLESALE_MOQ;
}

/**
 * Returns the retail price for a given product and size.
 */
export function getProductPriceForSize(product, size) {
  if (product.sizePrices && product.sizePrices[size]) {
    return product.sizePrices[size];
  }
  return product.price;
}

/**
 * Calculates the wholesale unit price for a given product, size and quantity.
 */
export function getWholesalePriceForProduct(product, size, quantity) {
  const basePrice = getProductPriceForSize(product, size);
  let discount = 0;
  if (quantity >= 48) {
    discount = 0.55;
  } else if (quantity >= 24) {
    discount = 0.40;
  } else if (quantity >= 12) {
    discount = 0.30;
  } else {
    discount = 0.30;
  }
  return Number((basePrice * (1 - discount)).toFixed(2));
}

/**
 * Calculates the wholesale unit price for a given retail base price and quantity.
 */
export function getWholesalePrice(retailPrice, quantity) {
  let discount = 0;
  if (quantity >= 48) {
    discount = 0.55;
  } else if (quantity >= 24) {
    discount = 0.40;
  } else if (quantity >= 12) {
    discount = 0.30;
  } else {
    discount = 0.30;
  }
  return Number((retailPrice * (1 - discount)).toFixed(2));
}

/**
 * Calculates total weight/packaging for wholesale shipping
 */
export function getPackagingInfo(quantity) {
  const weightPerUnit = 1.2; // average weight of orthopaedic bed in kg
  const unitsPerBox = 12; // fits in standard wholesale box
  const totalWeight = quantity * weightPerUnit;
  const totalBoxes = Math.ceil(quantity / unitsPerBox);
  return {
    boxes: totalBoxes,
    weightKg: Number(totalWeight.toFixed(1))
  };
}

export function getSizeDetails(productName, size) {
  const name = productName.toLowerCase();
  
  if (name.includes("manta")) {
    if (size.toLowerCase().includes("grande")) {
      return { dimensions: "150 x 100 cm", recommendation: "Ideal para cubrir sofás o perros medianos/grandes" };
    }
    return { dimensions: "100 x 75 cm", recommendation: "Ideal para el interior de transportadoras o gatos/perros pequeños" };
  }
  
  if (name.includes("cuna gatuna")) {
    return { dimensions: "50 x 50 x 15 cm", recommendation: "Ideal para gatos y perros pequeños (hasta 7 kg)" };
  }
  
  if (name.includes("iglú") || name.includes("iglu")) {
    if (size === "S") {
      return { dimensions: "40 x 40 x 35 cm", recommendation: "Recomendado para gatos pequeños y cachorros (hasta 4 kg)" };
    }
    return { dimensions: "48 x 48 x 40 cm", recommendation: "Recomendado para gatos grandes y perros miniatura (hasta 8 kg)" };
  }
  
  if (name.includes("calabaza")) {
    if (size === "S") {
      return { dimensions: "40 x 40 x 38 cm", recommendation: "Para mascotas de hasta 4 kg" };
    }
    if (size === "M") {
      return { dimensions: "48 x 48 x 43 cm", recommendation: "Para mascotas de hasta 8 kg" };
    }
    return { dimensions: "55 x 55 x 48 cm", recommendation: "Para mascotas de hasta 12 kg" };
  }
  
  // Default beds (Nube de oveja, Sofá Lux)
  switch (size) {
    case "S":
      return { dimensions: "50 x 40 x 18 cm", recommendation: "Hasta 5 kg (Chihuahua, Pomerania, Gato)" };
    case "M":
      return { dimensions: "65 x 50 x 20 cm", recommendation: "De 5 a 12 kg (Pug, French Poodle, Shitzu)" };
    case "L":
      return { dimensions: "85 x 65 x 22 cm", recommendation: "De 12 a 22 kg (Cocker, Bulldog, Beagle)" };
    case "XL":
      return { dimensions: "105 x 80 x 24 cm", recommendation: "De 22 a 40 kg (Golden, Labrador, Husky)" };
    default:
      return { dimensions: "Estándar", recommendation: "Medidas estándar de fábrica" };
  }
}
