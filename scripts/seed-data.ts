export type SeedProduct = {
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  price: string;
  compareAtPrice?: string;
  sku: string;
  collections: ("classics" | "seasonal" | "limited")[];
  imageFile: string;
  imageAlt: string;
};

export const seedCollections = [
  {
    handle: "classics",
    title: "Classics",
    description: "Everyday Duck Donuts rubber duckies with iconic icing energy.",
  },
  {
    handle: "seasonal",
    title: "Seasonal",
    description: "Limited-time ducks inspired by seasonal flavors and beachy vibes.",
  },
  {
    handle: "limited",
    title: "Limited",
    description: "Collector ducks that hatch in small batches.",
  },
] as const;

export const seedProducts: SeedProduct[] = [
  {
    handle: "classic-donut-floatie-duck",
    title: "Classic Donut Floatie Duck",
    description:
      "Our signature rubber ducky rides a green-iced donut floatie with rainbow sprinkles, pink visor, and Duck Donuts tank top. Splash-ready collectible fun.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["classic", "floatie", "bestseller"],
    price: "18.00",
    compareAtPrice: "22.00",
    sku: "DD-DUCK-001",
    collections: ["classics"],
    imageFile: "classic-donut-floatie.png",
    imageAlt: "Yellow rubber duck in a green iced donut floatie",
  },
  {
    handle: "blueberry-frost-duck",
    title: "Blueberry Frost Duck",
    description:
      "A frosty blueberry icing look with sprinkle accents. Cool, collectible, and ready for the flock.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["classic", "blueberry", "frost"],
    price: "16.00",
    sku: "DD-DUCK-002",
    collections: ["classics"],
    imageFile: "blueberry-frost.png",
    imageAlt: "Rubber duck with blueberry frosting accents",
  },
  {
    handle: "sprinkle-party-duck",
    title: "Sprinkle Party Duck",
    description:
      "Covered in rainbow sprinkles and pink drizzle — the life of every Duck Donuts party.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["classic", "sprinkles", "party"],
    price: "17.00",
    sku: "DD-DUCK-003",
    collections: ["classics"],
    imageFile: "sprinkle-party.png",
    imageAlt: "Rubber duck covered in colorful sprinkles",
  },
  {
    handle: "maple-bacon-duck",
    title: "Maple Bacon Duck",
    description:
      "Maple glaze shine with bacon-inspired toppings. Sweet, savory, and wonderfully quirky.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["seasonal", "maple", "bacon"],
    price: "19.00",
    sku: "DD-DUCK-004",
    collections: ["seasonal"],
    imageFile: "maple-bacon.png",
    imageAlt: "Rubber duck with maple glaze and bacon accents",
  },
  {
    handle: "lemon-sunshine-duck",
    title: "Lemon Sunshine Duck",
    description:
      "Bright lemon glaze vibes with citrus zest energy. A sunny addition to any shelf.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["seasonal", "lemon", "sunshine"],
    price: "16.00",
    sku: "DD-DUCK-005",
    collections: ["seasonal"],
    imageFile: "lemon-sunshine.png",
    imageAlt: "Lemon yellow rubber duck with citrus glaze look",
  },
  {
    handle: "cotton-candy-duck",
    title: "Cotton Candy Duck",
    description:
      "Soft pink cotton-candy icing swirls and pastel sprinkles for maximum sweetness.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["seasonal", "cotton-candy", "pastel"],
    price: "17.00",
    sku: "DD-DUCK-006",
    collections: ["seasonal"],
    imageFile: "cotton-candy.png",
    imageAlt: "Rubber duck with cotton candy pink icing",
  },
  {
    handle: "shamrock-mint-duck",
    title: "Shamrock Mint Duck",
    description:
      "Mint icing and shamrock sparkle — lucky, fresh, and flock-approved.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["seasonal", "mint", "shamrock"],
    price: "18.00",
    sku: "DD-DUCK-007",
    collections: ["seasonal"],
    imageFile: "shamrock-mint.png",
    imageAlt: "Rubber duck with mint green icing and shamrock sprinkles",
  },
  {
    handle: "raspberry-drizzle-duck",
    title: "Raspberry Drizzle Duck",
    description:
      "Bold raspberry icing drizzle with heart sprinkles. A sweet limited-feel classic.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["classic", "raspberry", "drizzle"],
    price: "17.00",
    sku: "DD-DUCK-008",
    collections: ["classics"],
    imageFile: "raspberry-drizzle.png",
    imageAlt: "Rubber duck with raspberry icing drizzle",
  },
  {
    handle: "outer-banks-beach-duck",
    title: "Outer Banks Beach Duck",
    description:
      "Sunglasses on, towel ready — inspired by the Outer Banks vacation where Duck Donuts began.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["limited", "beach", "outer-banks"],
    price: "24.00",
    compareAtPrice: "28.00",
    sku: "DD-DUCK-009",
    collections: ["limited", "seasonal"],
    imageFile: "outer-banks-beach.png",
    imageAlt: "Beach vacation rubber duck with sunglasses",
  },
  {
    handle: "limited-ollie-collectible-duck",
    title: "Limited Ollie Collectible Duck",
    description:
      "Small-batch collectible duck with Duck Donuts logo energy and frosted donut accessory.",
    productType: "Rubber Duck",
    vendor: "Duck Donuts",
    tags: ["limited", "collectible", "ollie"],
    price: "29.00",
    sku: "DD-DUCK-010",
    collections: ["limited"],
    imageFile: "limited-ollie.png",
    imageAlt: "Limited edition Duck Donuts collectible rubber duck",
  },
];
