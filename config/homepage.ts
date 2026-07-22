export type HomepageSection =
  | {
      type: "hero";
      props: {
        headline: string;
        subheadline: string;
        ctaLabel: string;
        ctaHref: string;
        imageSrc: string;
        imageAlt: string;
      };
    }
  | {
      type: "featured-products";
      props: {
        title: string;
        subtitle: string;
        collectionHandle?: string;
        limit?: number;
      };
    }
  | {
      type: "collection-grid";
      props: {
        title: string;
        subtitle: string;
        handles: string[];
      };
    }
  | {
      type: "image-banner";
      props: {
        title: string;
        subtitle: string;
        ctaLabel: string;
        ctaHref: string;
        tone: "frost" | "lemon" | "cotton" | "navy";
      };
    }
  | {
      type: "split-content";
      props: {
        title: string;
        body: string;
        ctaLabel: string;
        ctaHref: string;
        imageSrc: string;
        imageAlt: string;
        imagePosition: "left" | "right";
      };
    }
  | {
      type: "newsletter";
      props: {
        title: string;
        subtitle: string;
      };
    };

export const homepageSections: HomepageSection[] = [
  {
    type: "hero",
    props: {
      headline: "Rubber duckies, Duck Donuts style",
      subheadline:
        "Collectible ducks with icing energy, sprinkle joy, and Outer Banks heart.",
      ctaLabel: "Shop the flock",
      ctaHref: "/products",
      imageSrc: "/images/hero-rubber-ducky.jpg",
      imageAlt: "Duck Donuts rubber ducky in a donut floatie",
    },
  },
  {
    type: "featured-products",
    props: {
      title: "Fresh from the flock",
      subtitle: "Our most-loved rubber duckies, ready to splash into your cart.",
      limit: 8,
    },
  },
  {
    type: "collection-grid",
    props: {
      title: "Find your flavor",
      subtitle: "Classics, seasonal drops, and limited editions.",
      handles: ["classics", "seasonal", "limited"],
    },
  },
  {
    type: "split-content",
    props: {
      title: "The tale of Duck Donuts",
      body: "The dream of Duck Donuts was hatched on a family vacation in the Outer Banks of North Carolina. That same playful spirit now lives in our rubber duckie collectibles — bright, custom, and made to make you smile.",
      ctaLabel: "Meet the ducks",
      ctaHref: "/products",
      imageSrc: "/images/hero-rubber-ducky.jpg",
      imageAlt: "Duck Donuts branded rubber ducky",
      imagePosition: "right",
    },
  },
  {
    type: "image-banner",
    props: {
      title: "Warm. Delicious. Quack-tastic.",
      subtitle: "Build your flock with playful duckies inspired by our made-to-order magic.",
      ctaLabel: "Start shopping",
      ctaHref: "/products",
      tone: "frost",
    },
  },
  {
    type: "newsletter",
    props: {
      title: "Stay in the flock",
      subtitle: "New drops, limited ducks, and sprinkle-worthy surprises.",
    },
  },
];
