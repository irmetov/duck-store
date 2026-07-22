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
      headline: "Meet the Duck Donuts flock",
      subheadline:
        "Official rubber duckies from the brand born on the Outer Banks — bright, collectible, and ready to quack.",
      ctaLabel: "Shop the flock",
      ctaHref: "/products",
      imageSrc: "/images/hero-rubber-ducky.jpg",
      imageAlt: "Duck Donuts rubber ducky collectible",
    },
  },
  {
    type: "featured-products",
    props: {
      title: "Crowd favorites",
      subtitle: "The ducks collectors keep coming back for.",
      limit: 8,
    },
  },
  {
    type: "collection-grid",
    props: {
      title: "Find your duck",
      subtitle: "Classics, seasonal drops, and limited editions.",
      handles: ["classics", "seasonal", "limited"],
    },
  },
  {
    type: "split-content",
    props: {
      title: "Born on the Outer Banks",
      body: "Duck Donuts started on a family vacation in North Carolina’s Outer Banks. That same playful spirit now lives in our rubber duckie collectibles — cheerful little companions made to brighten a desk, a shelf, or a sunny day.",
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
      title: "More ducks. More joy.",
      subtitle:
        "Collectible rubber duckies from Duck Donuts — for shelves, soaks, desks, and anyone who needs a tiny co-pilot.",
      ctaLabel: "Quack me to the shop",
      ctaHref: "/products",
      tone: "frost",
    },
  },
  {
    type: "newsletter",
    props: {
      title: "Stay in the flock",
      subtitle: "Be first to hear about new drops and limited ducks.",
    },
  },
];
