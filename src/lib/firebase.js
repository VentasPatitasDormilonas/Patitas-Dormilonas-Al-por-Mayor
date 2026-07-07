import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import config from "../../firebase-applet-config.json";

// Initialize Firebase using the configuration
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID provided by AI Studio
export const db = getFirestore(app, config.firestoreDatabaseId);

// Default list of high-quality products to seed
const SEED_PRODUCTS = [
  {
    name: "Iglú Tiburón Divertido",
    sku: "LX-131",
    description: "Cama iglú cerrada con un adorable y divertido diseño de tiburón en color gris. Confeccionada con felpa de tacto suave y acolchado de espuma densa que mantiene su estructura. Posee una base antideslizante para evitar deslizamientos.",
    price: 30,
    priceRange: "S/20 - S/30",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh7LRW7ezDd97voIpb_fYnA-EtM1FmgqIRcrGx1gzYcaQL0AsbswbfPUW0ad2F7Ev0rlFygHIrgrwnAUeDhTzIFIZAyO_FkRIhvkn6s2Cb2dnfE_AsInaIEOEa7DBnQC3pPPMyEhE10mu8xLAN7MQ4gQdyOnmzZ01b1jwCMTFfhDnTSXU1MKuZ82aXf6RmZ3oLAEhkJrzbdbOcASjThoNe-uk5-wwnt41rs88gxUsKz3-er4ZrkTZx8VbG55T1KrwoUd98D4cuo"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Gris Tiburón"],
    features: ["Estructura rígida de espuma", "Relleno térmico abrigador", "Base impermeable antideslizante"],
    stock: 25,
    rating: 4.9,
    reviewsCount: 142,
    tag: "TENDENCIA",
    sizePrices: { "M": 20, "L": 30 },
    sizeMOQs: { "M": 25, "L": 25 }
  },
  {
    name: "Domo Cuna con Juguete Colgante",
    sku: "LX-140",
    description: "Cama domo semi-cerrada de color gris claro con una divertida pelota colgante que incentiva el juego de tu mascota antes de dormir. Interior acolchado de algodón de alta densidad que proporciona calor y comodidad incomparables.",
    price: 35,
    priceRange: "S/25 - S/35",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0243PHJ7v3HeVQqPsf6T6K9Jw7JaeiRttqc1O-RJuAfd92GexcpO93DIwI57xKBNcetaVz6TTajQrU7X-N2rslZQRECxIsYu7foEIxfWvzyYWauiYyp4RzIjKGr2VTSLJDq3zykQSMFl3mdCQSlZqitBstIb2irENEmiutK1L0hDZT_643I-EHdZpzCj4mjTqNM9WTkh_5E6sgwkUS0uC3pjERDaV84S9vMjFwLTrdh5Oaxm5-SS7gY8fgCl8ToKypI469bW7xQ"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Gris Claro"],
    features: ["Juguete colgante antiestrés", "Doble capa térmica protectora", "Acolchado de algodón premium"],
    stock: 20,
    rating: 4.8,
    reviewsCount: 95,
    tag: "NUEVO",
    sizePrices: { "M": 25, "L": 35 },
    sizeMOQs: { "M": 25, "L": 25 }
  },
  {
    name: "Iglú Ranita Verde",
    sku: "LX-138",
    description: "Encantadora cama cerrada con diseño de ranita verde y borde amarillo brillante. Ofrece un refugio sumamente abrigador y acogedor, ideal para gatos y perros pequeños que adoran dormir tapados o protegidos.",
    price: 37,
    priceRange: "S/25 - S/37",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh7LRW7ezDd97voIpb_fYnA-EtM1FmgqIRcrGx1gzYcaQL0AsbswbfPUW0ad2F7Ev0rlFygHIrgrwnAUeDhTzIFIZAyO_FkRIhvkn6s2Cb2dnfE_AsInaIEOEa7DBnQC3pPPMyEhE10mu8xLAN7MQ4gQdyOnmzZ01b1jwCMTFfhDnTSXU1MKuZ82aXf6RmZ3oLAEhkJrzbdbOcASjThoNe-uk5-wwnt41rs88gxUsKz3-er4ZrkTZx8VbG55T1KrwoUd98D4cuo"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Verde Ranita"],
    features: ["Forma ergonómica de ranita", "Forro térmico autocalentable", "Base antideslizante impermeable"],
    stock: 18,
    rating: 4.7,
    reviewsCount: 68,
    tag: "COLECCIÓN",
    sizePrices: { "M": 25, "L": 37 },
    sizeMOQs: { "M": 30, "L": 25 }
  },
  {
    name: "Cuna Gatito Soft",
    sku: "LX-134",
    description: "Cuna circular acolchada de felpa extra suave con un hermoso bordado de gatito en el respaldo. Posee bordes elevados súper mullidos que sirven de almohadilla de apoyo para el cuello y la cabeza de tu engreído.",
    price: 30,
    priceRange: "S/30",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpdpbqweaFatoRbDfsG8hvyGAtFXJadbiRnAlAs4xucBtUG_OZ4dwafoEyMLxf2Bf2Pfr-iUtWBmMph6EaZiu_VxhtfNO_fkfmX6yBc65CZmR_AQtL1VRFx1apHZEVFZ_QKIiDUN-np19R-mCQkAlZkkbYlRhstu-igvYvCSBsntYZwFeLBeN6RNKLcRmKhUO9D6qDpQ3jAIK7Txya8Ht_TIJc5b6xPdqg-sMl9j1cN6-1-TWPXC7l-5ZfbW8ui_1CCiEXKECxYw4"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Rosa Pastel", "Gris Plata"],
    features: ["Bordes elevados ergonómicos", "Superficie de felpa ultra suave", "Ideal para siestas profundas"],
    stock: 35,
    rating: 4.9,
    reviewsCount: 110,
    tag: "FAVORITO",
    sizePrices: { "L": 30 },
    sizeMOQs: { "L": 30 }
  },
  {
    name: "Puff Calabaza con Pompones",
    sku: "LX-137",
    description: "Espectacular cama redonda con cordón ajustable que permite cerrarla como un nido tipo calabaza o abrirla por completo. Posee pompones juguetones y un interior de felpa sherpa que retiene el calor corporal.",
    price: 30,
    priceRange: "S/30",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0243PHJ7v3HeVQqPsf6T6K9Jw7JaeiRttqc1O-RJuAfd92GexcpO93DIwI57xKBNcetaVz6TTajQrU7X-N2rslZQRECxIsYu7foEIxfWvzyYWauiYyp4RzIjKGr2VTSLJDq3zykQSMFl3mdCQSlZqitBstIb2irENEmiutK1L0hDZT_643I-EHdZpzCj4mjTqNM9WTkh_5E6sgwkUS0uC3pjERDaV84S9vMjFwLTrdh5Oaxm5-SS7gY8fgCl8ToKypI469bW7xQ"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Salmón Coral"],
    features: ["Diseño ajustable multi-nido", "Pompones de felpa incluidos", "Aislamiento de frío del piso"],
    stock: 22,
    rating: 4.8,
    reviewsCount: 74,
    tag: "BEST SELLER",
    sizePrices: { "L": 30 },
    sizeMOQs: { "L": 20 }
  },
  {
    name: "Iglú Banqueta Osito",
    sku: "LX-132",
    description: "Cama funcional 2-en-1 con diseño de osito y una tapa desmontable acolchada. Puede utilizarse como un refugio cerrado de privacidad total o como banqueta de descanso superior. Fabricada con materiales de tapicería premium de alta durabilidad.",
    price: 32,
    priceRange: "S/22 - S/32",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh7LRW7ezDd97voIpb_fYnA-EtM1FmgqIRcrGx1gzYcaQL0AsbswbfPUW0ad2F7Ev0rlFygHIrgrwnAUeDhTzIFIZAyO_FkRIhvkn6s2Cb2dnfE_AsInaIEOEa7DBnQC3pPPMyEhE10mu8xLAN7MQ4gQdyOnmzZ01b1jwCMTFfhDnTSXU1MKuZ82aXf6RmZ3oLAEhkJrzbdbOcASjThoNe-uk5-wwnt41rs88gxUsKz3-er4ZrkTZx8VbG55T1KrwoUd98D4cuo"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Gris Ceniza"],
    features: ["Estructura rígida desmontable", "Tapa acolchada removible", "Doble espacio de descanso"],
    stock: 15,
    rating: 5.0,
    reviewsCount: 42,
    tag: "2 EN 1",
    sizePrices: { "M": 22, "L": 32 },
    sizeMOQs: { "M": 25, "L": 25 }
  },
  {
    name: "Domo Orejitas de Gato",
    sku: "LX-141",
    description: "Hermosa cama en forma de domo cerrado con detalles bordados de gatito y tiernas orejitas en el frente. Confeccionada con felpa de pelo corto ultra acogedora y un juguete colgante de pompón que garantiza noches mágicas.",
    price: 35,
    priceRange: "S/25 - S/35",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0243PHJ7v3HeVQqPsf6T6K9Jw7JaeiRttqc1O-RJuAfd92GexcpO93DIwI57xKBNcetaVz6TTajQrU7X-N2rslZQRECxIsYu7foEIxfWvzyYWauiYyp4RzIjKGr2VTSLJDq3zykQSMFl3mdCQSlZqitBstIb2irENEmiutK1L0hDZT_643I-EHdZpzCj4mjTqNM9WTkh_5E6sgwkUS0uC3pjERDaV84S9vMjFwLTrdh5Oaxm5-SS7gY8fgCl8ToKypI469bW7xQ"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Gris Oxford"],
    features: ["Juguete colgante de pompón", "Orejitas decorativas en relieve", "Cojín reversible lavable"],
    stock: 28,
    rating: 4.8,
    reviewsCount: 81,
    tag: "TIENDA TOP",
    sizePrices: { "M": 25, "L": 35 },
    sizeMOQs: { "M": 35, "L": 25 }
  },
  {
    name: "Iglú Calabaza Naranja",
    sku: "LX-139L",
    description: "Cama iglú de felpa premium en forma de calabaza de color naranja brillante con hoja verde bordada. Posee una entrada perfecta para aislar el viento y un interior súper acolchado que parece un nido de nubes.",
    price: 35,
    priceRange: "S/35",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0243PHJ7v3HeVQqPsf6T6K9Jw7JaeiRttqc1O-RJuAfd92GexcpO93DIwI57xKBNcetaVz6TTajQrU7X-N2rslZQRECxIsYu7foEIxfWvzyYWauiYyp4RzIjKGr2VTSLJDq3zykQSMFl3mdCQSlZqitBstIb2irENEmiutK1L0hDZT_643I-EHdZpzCj4mjTqNM9WTkh_5E6sgwkUS0uC3pjERDaV84S9vMjFwLTrdh5Oaxm5-SS7gY8fgCl8ToKypI469bW7xQ"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Naranja Otoño"],
    features: ["Forma de calabaza acogedora", "Base impermeable de alta resistencia", "Acolchado premium siliconado"],
    stock: 14,
    rating: 4.9,
    reviewsCount: 63,
    tag: "ABRIGADOR",
    sizePrices: { "L": 35 },
    sizeMOQs: { "L": 20 }
  },
  {
    name: "Iglú Calabaza Verde",
    sku: "LX-139M",
    description: "Cama iglú de felpa premium en forma de calabaza de color verde bosque con un tierno tallo superior. Ofrece privacidad e inigualable resguardo térmico contra bajas temperaturas para tu mascota.",
    price: 20,
    priceRange: "S/20",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ0243PHJ7v3HeVQqPsf6T6K9Jw7JaeiRttqc1O-RJuAfd92GexcpO93DIwI57xKBNcetaVz6TTajQrU7X-N2rslZQRECxIsYu7foEIxfWvzyYWauiYyp4RzIjKGr2VTSLJDq3zykQSMFl3mdCQSlZqitBstIb2irENEmiutK1L0hDZT_643I-EHdZpzCj4mjTqNM9WTkh_5E6sgwkUS0uC3pjERDaV84S9vMjFwLTrdh5Oaxm5-SS7gY8fgCl8ToKypI469bW7xQ"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M"],
    colors: ["Verde Bosque"],
    features: ["Diseño exclusivo de calabaza", "Efecto madriguera antiestrés", "Relleno hipoalergénico esponjoso"],
    stock: 24,
    rating: 4.7,
    reviewsCount: 51,
    tag: "TEMPORADA",
    sizePrices: { "M": 20 },
    sizeMOQs: { "M": 25 }
  },
  {
    name: "Cuna Orejas de Conejo Lavanda",
    sku: "LX-135M",
    description: "Cómoda cama con hermosas orejas de conejo confeccionada con felpa suave estampada con divertidos motivos musicales sobre un fondo color lavanda. Interior acolchado de borreguito blanco ultra abrigador.",
    price: 25,
    priceRange: "S/25",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpdpbqweaFatoRbDfsG8hvyGAtFXJadbiRnAlAs4xucBtUG_OZ4dwafoEyMLxf2Bf2Pfr-iUtWBmMph6EaZiu_VxhtfNO_fkfmX6yBc65CZmR_AQtL1VRFx1apHZEVFZ_QKIiDUN-np19R-mCQkAlZkkbYlRhstu-igvYvCSBsntYZwFeLBeN6RNKLcRmKhUO9D6qDpQ3jAIK7Txya8Ht_TIJc5b6xPdqg-sMl9j1cN6-1-TWPXC7l-5ZfbW8ui_1CCiEXKECxYw4"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["M"],
    colors: ["Lavanda Musical"],
    features: ["Orejas de conejo lúdicas", "Estampado moderno de alta calidad", "Interior de borrego sintético ultra abrigador"],
    stock: 30,
    rating: 4.8,
    reviewsCount: 39,
    tag: "ESTILO",
    sizePrices: { "M": 25 },
    sizeMOQs: { "M": 30 }
  },
  {
    name: "Cuna Orejas de Conejo Rosado",
    sku: "LX-135L",
    description: "Encantadora cama con tiernas orejas de conejo confeccionada con felpa estampada sobre fondo rosado pastel. El borde acolchado y el cojín de borrego blanco brindan una suavidad inigualable para el descanso diario.",
    price: 39,
    priceRange: "S/39",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpdpbqweaFatoRbDfsG8hvyGAtFXJadbiRnAlAs4xucBtUG_OZ4dwafoEyMLxf2Bf2Pfr-iUtWBmMph6EaZiu_VxhtfNO_fkfmX6yBc65CZmR_AQtL1VRFx1apHZEVFZ_QKIiDUN-np19R-mCQkAlZkkbYlRhstu-igvYvCSBsntYZwFeLBeN6RNKLcRmKhUO9D6qDpQ3jAIK7Txya8Ht_TIJc5b6xPdqg-sMl9j1cN6-1-TWPXC7l-5ZfbW8ui_1CCiEXKECxYw4"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Rosado Pastel"],
    features: ["Orejas de conejo decorativas", "Interior térmico súper esponjoso", "Apta para lavado a máquina"],
    stock: 22,
    rating: 4.9,
    reviewsCount: 57,
    tag: "OFERTA",
    sizePrices: { "L": 39 },
    sizeMOQs: { "L": 30 }
  },
  {
    name: "Cuna Ovejita Fluffy",
    sku: "WO-7/8",
    description: "Cuna circular de borreguito blanco ultra afelpado con la carita bordada de una dulce ovejita negra en el frente. Proporciona una inigualable textura relajante que disminuye la ansiedad and el estrés en cachorros y felinos.",
    price: 40,
    priceRange: "S/28 - S/40",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD83S1E6H3H-2O3znr_sLRiPN8TraFZy2UNzKbWhcgGln2xOCXOoQghs1uMEeu58iI0wGsocDXE0Q5FveFwd4nbb6S7ZL31nFaAPQpZKRADo4tBsApPzIHsJO8ERx7EkadhywFy-KvN_srNiWnkTGv5NwfVbjLTAqDcpy0Zd4uJTU1sBNLTnhLciHvN_fZgrZJnxTSf-uCjI1z23hwpN076OvyvH5NC5qhuLRM1YbRzpAfi8yklAKvCdguWGlDhfRUf4hTtaUMNvTM"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["M", "L"],
    colors: ["Blanco Ovejita"],
    features: ["Efecto calma para mascotas", "Borreguito ultra denso y suave", "Diseño lúdico de ovejita"],
    stock: 40,
    rating: 5.0,
    reviewsCount: 215,
    tag: "RELAX",
    sizePrices: { "M": 28, "L": 40 },
    sizeMOQs: { "M": 30, "L": 30 }
  },
  {
    name: "Cuna Corduroy con Huesito de Felpa",
    sku: "WO-9",
    description: "Elegante cama circular con diseño a rayas corduroy texturizado en los bordes y un suave huesito de felpa amarrado de juguete. Confeccionada con rellenos de alta densidad que no pierden su volumen con el uso.",
    price: 29,
    priceRange: "S/12 - S/29",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD83S1E6H3H-2O3znr_sLRiPN8TraFZy2UNzKbWhcgGln2xOCXOoQghs1uMEeu58iI0wGsocDXE0Q5FveFwd4nbb6S7ZL31nFaAPQpZKRADo4tBsApPzIHsJO8ERx7EkadhywFy-KvN_srNiWnkTGv5NwfVbjLTAqDcpy0Zd4uJTU1sBNLTnhLciHvN_fZgrZJnxTSf-uCjI1z23hwpN076OvyvH5NC5qhuLRM1YbRzpAfi8yklAKvCdguWGlDhfRUf4hTtaUMNvTM"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["S", "M", "L"],
    colors: ["Verde Pistacho", "Gris Ceniza", "Rosa Algodón"],
    features: ["Diseño de corduroy texturizado", "Juguete de huesito incorporado", "Cojín reversible y lavable"],
    stock: 45,
    rating: 4.6,
    reviewsCount: 34,
    tag: "SUAVE",
    sizePrices: { "S": 12, "M": 19, "L": 29 },
    sizeMOQs: { "S": 30, "M": 30, "L": 30 }
  },
  {
    name: "Iglú Osito Rosado",
    sku: "LX-133M",
    description: "Cama iglú cerrada con tierno diseño de osito rosa de orejas en relieve y colgante de pompón para juego. El refugio cerrado perfecto para que las mascotas se mantengan protegidas de las corrientes de aire.",
    price: 20,
    priceRange: "S/20",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh7LRW7ezDd97voIpb_fYnA-EtM1FmgqIRcrGx1gzYcaQL0AsbswbfPUW0ad2F7Ev0rlFygHIrgrwnAUeDhTzIFIZAyO_FkRIhvkn6s2Cb2dnfE_AsInaIEOEa7DBnQC3pPPMyEhE10mu8xLAN7MQ4gQdyOnmzZ01b1jwCMTFfhDnTSXU1MKuZ82aXf6RmZ3oLAEhkJrzbdbOcASjThoNe-uk5-wwnt41rs88gxUsKz3-er4ZrkTZx8VbG55T1KrwoUd98D4cuo"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["M"],
    colors: ["Rosa Osito"],
    features: ["Diseño de osito con orejas", "Juguete colgante de pompón", "Base impermeable con microperlas"],
    stock: 16,
    rating: 4.8,
    reviewsCount: 29,
    tag: "DULCE",
    sizePrices: { "M": 20 },
    sizeMOQs: { "M": 25 }
  },
  {
    name: "Iglú Osito Marrón",
    sku: "LX-133L",
    description: "Hermosa cama iglú cerrada con diseño de osito color marrón de orejas en relieve y colgante de pompón. Ofrece un espacio seguro, oscuro y extremadamente cálido que favorece el sueño profundo.",
    price: 30,
    priceRange: "S/30",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh7LRW7ezDd97voIpb_fYnA-EtM1FmgqIRcrGx1gzYcaQL0AsbswbfPUW0ad2F7Ev0rlFygHIrgrwnAUeDhTzIFIZAyO_FkRIhvkn6s2Cb2dnfE_AsInaIEOEa7DBnQC3pPPMyEhE10mu8xLAN7MQ4gQdyOnmzZ01b1jwCMTFfhDnTSXU1MKuZ82aXf6RmZ3oLAEhkJrzbdbOcASjThoNe-uk5-wwnt41rs88gxUsKz3-er4ZrkTZx8VbG55T1KrwoUd98D4cuo"
    ],
    category: "Iglús Warm",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Marrón Chocolate"],
    features: ["Privacidad y oscuridad óptimas", "Detalles divertidos de osito", "Estructura auto-soportada"],
    stock: 25,
    rating: 4.9,
    reviewsCount: 47,
    tag: "CÁLIDO",
    sizePrices: { "L": 30 },
    sizeMOQs: { "L": 25 }
  },
  {
    name: "Cojín Hámster Súper Soft",
    sku: "WO-6",
    description: "Cama plana tipo dona acolchada con cara de tierno hámster amarillo bordada en el frente. Perfecta para gatos grandes o cachorros que prefieren descansar estirados sobre superficies planas y mullidas.",
    price: 30,
    priceRange: "S/30",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD83S1E6H3H-2O3znr_sLRiPN8TraFZy2UNzKbWhcgGln2xOCXOoQghs1uMEeu58iI0wGsocDXE0Q5FveFwd4nbb6S7ZL31nFaAPQpZKRADo4tBsApPzIHsJO8ERx7EkadhywFy-KvN_srNiWnkTGv5NwfVbjLTAqDcpy0Zd4uJTU1sBNLTnhLciHvN_fZgrZJnxTSf-uCjI1z23hwpN076OvyvH5NC5qhuLRM1YbRzpAfi8yklAKvCdguWGlDhfRUf4hTtaUMNvTM"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["Estándar"],
    colors: ["Amarillo Trigo"],
    features: ["Forma plana anatómica", "Lana de algodón de alta densidad", "Superficie de felpa extra suave"],
    stock: 12,
    rating: 4.7,
    reviewsCount: 31,
    tag: "COLOQUIAL",
    sizePrices: { "Estándar": 30 },
    sizeMOQs: { "Estándar": 30 }
  },
  {
    name: "Cuna Zorrillo Fluffy",
    sku: "LX-129",
    description: "Hermosa cuna circular ultra abrigadora y esponjosa de color naranja con detalles de orejas de zorro. Su borde mullido relleno brinda un soporte envolvente espectacular que ayuda a reducir el estrés diario.",
    price: 23,
    priceRange: "S/23",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD83S1E6H3H-2O3znr_sLRiPN8TraFZy2UNzKbWhcgGln2xOCXOoQghs1uMEeu58iI0wGsocDXE0Q5FveFwd4nbb6S7ZL31nFaAPQpZKRADo4tBsApPzIHsJO8ERx7EkadhywFy-KvN_srNiWnkTGv5NwfVbjLTAqDcpy0Zd4uJTU1sBNLTnhLciHvN_fZgrZJnxTSf-uCjI1z23hwpN076OvyvH5NC5qhuLRM1YbRzpAfi8yklAKvCdguWGlDhfRUf4hTtaUMNvTM"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["L"],
    colors: ["Naranja Zorro"],
    features: ["Efecto relaxing antiestrés", "Borde elevado de soporte cervical", "Material súper esponjoso y térmico"],
    stock: 50,
    rating: 4.6,
    reviewsCount: 22,
    tag: "ZORRITO",
    sizePrices: { "L": 23 },
    sizeMOQs: { "L": 50 }
  },
  {
    name: "Sofá Cocodrilo Divertido",
    sku: "WO-4/5",
    description: "Divertido sofá alargado en forma de cocodrilo o tiburón de color amarillo, verde o gris. Su forma de barco acuna el cuerpo de tu mascota para una postura relajada y cómoda durante sus siestas de la tarde.",
    price: 25,
    priceRange: "S/10 - S/25",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCwJKDgA9tnY_9V7FeN6Fqdt3gm9lV-O5bd1c2b1y92zxc7n0PLij_y6WA6E4-T57t4dDwmK2BvUw6kIBSNR7xL-kV1HpAmsSFHiYzFYVTlGo7ubKPPthOy-GbjCEQmja8YqO-io37LxtYMo5HF5cxYQZqT0ZFBagZL_3GkhMzg_rhuoOxBMBT1sCbT8Rsg70gETiBKre5kVjkZHHOiSMDLuIWTLMoOysF1118YMaUI_42ViPkI1DMPfrpJCtkehsnCfvXzZDNYPE"
    ],
    category: "Camas Soft",
    petType: "ambos",
    sizes: ["S", "M"],
    colors: ["Amarillo Cocodrilo", "Verde Cocodrilo", "Gris Cocodrilo"],
    features: ["Forma de barco envolvente", "Material de alta resistencia", "Acolchado mullido antiescaras"],
    stock: 30,
    rating: 4.9,
    reviewsCount: 104,
    tag: "COCODRILO",
    sizePrices: { "S": 10, "M": 25 },
    sizeMOQs: { "S": 30, "M": 30 }
  }
];

// Promise timeout helper to prevent hanging if Firestore connection is blocked or offline
function withTimeout(promise, ms = 3500) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Timeout de conexión a Firebase Firestore"));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutId);
    return result;
  }, (error) => {
    clearTimeout(timeoutId);
    throw error;
  });
}

// Seed products if database is empty
export async function seedProductsIfEmpty() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await withTimeout(getDocs(productsCol), 3500);
    let needsReseed = snapshot.empty;

    if (!snapshot.empty) {
      let hasTiburón = false;
      snapshot.forEach(doc => {
        if (doc.data().name === "Iglú Tiburón Divertido") {
          hasTiburón = true;
        }
      });
      if (!hasTiburón || snapshot.size !== 18) {
        console.log("Database contains outdated products. Preparing re-seed...");
        needsReseed = true;
        // Delete existing products
        const deleteBatch = writeBatch(db);
        snapshot.forEach(d => {
          deleteBatch.delete(doc(productsCol, d.id));
        });
        await withTimeout(deleteBatch.commit(), 3500);
        console.log("Outdated products deleted from Firestore.");
      }
    }

    if (needsReseed) {
      console.log("Seeding initial products collection to Firestore...");
      const batch = writeBatch(db);
      SEED_PRODUCTS.forEach((prod, index) => {
        const docRef = doc(productsCol, `prod_${index + 1}`);
        batch.set(docRef, {
          ...prod,
          createdAt: Timestamp.now()
        });
      });
      await withTimeout(batch.commit(), 4000);
      console.log("Products successfully seeded to Firestore!");
    }
  } catch (error) {
    console.error("Error seeding products to Firestore: ", error);
  }
}

// Fetch all products
export async function fetchProducts() {
  try {
    try {
      await withTimeout(seedProductsIfEmpty(), 4500); // Auto-seeds on first check
    } catch (err) {
      console.warn("Seeding products timed out or failed, using cache or direct docs:", err);
    }
    const productsCol = collection(db, "products");
    const snapshot = await withTimeout(getDocs(productsCol), 3500);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching products: ", error);
    // Fallback in case firestore is still preparing or offline
    return SEED_PRODUCTS.map((p, i) => ({ id: `prod_${i + 1}`, ...p }));
  }
}

// Save an order to Firestore
export async function saveOrder(orderData) {
  try {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, {
      ...orderData,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      createdAt: new Date().toISOString(),
      ...orderData
    };
  } catch (error) {
    console.error("Error saving order: ", error);
    // Local fallback return
    return {
      id: "ord_local_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...orderData
    };
  }
}

// Track/Fetch orders by email or exact order number
export async function trackOrders(searchQuery) {
  try {
    const ordersCol = collection(db, "orders");
    const qByNumber = query(ordersCol, where("orderNumber", "==", searchQuery.trim().toUpperCase()));
    const snapshotByNumber = await getDocs(qByNumber);
    
    if (!snapshotByNumber.empty) {
      return snapshotByNumber.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        };
      });
    }
    
    // If not found by order number, search by email
    const qByEmail = query(
      ordersCol, 
      where("customerInfo.email", "==", searchQuery.trim().toLowerCase()),
      orderBy("createdAt", "desc")
    );
    const snapshotByEmail = await getDocs(qByEmail);
    return snapshotByEmail.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
  } catch (error) {
    console.error("Error tracking orders: ", error);
    // Fallback to searching local storage
    const localOrdersRaw = localStorage.getItem("patitas_orders");
    if (localOrdersRaw) {
      const localOrders = JSON.parse(localOrdersRaw);
      return localOrders.filter(
        (o) =>
          o.orderNumber.toUpperCase() === searchQuery.trim().toUpperCase() ||
          o.customerInfo.email.toLowerCase() === searchQuery.trim().toLowerCase()
      );
    }
    return [];
  }
}

// Fetch all orders (for admin dashboard)
export async function fetchAllOrders() {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
  } catch (error) {
    console.error("Error fetching all orders: ", error);
    const localOrdersRaw = localStorage.getItem("patitas_orders");
    return localOrdersRaw ? JSON.parse(localOrdersRaw) : [];
  }
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    // If it's a local order
    if (orderId.startsWith("ord_local_")) {
      const localOrdersRaw = localStorage.getItem("patitas_orders");
      if (localOrdersRaw) {
        const orders = JSON.parse(localOrdersRaw);
        const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
        localStorage.setItem("patitas_orders", JSON.stringify(updated));
        return true;
      }
      return false;
    }
    
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating order status: ", error);
    return false;
  }
}
