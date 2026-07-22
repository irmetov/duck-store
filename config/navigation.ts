export type NavItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavItem[] = [
  { label: "Shop", href: "/products" },
  { label: "Classics", href: "/collections/classics" },
  { label: "Seasonal", href: "/collections/seasonal" },
  { label: "Limited", href: "/collections/limited" },
];

export const footerNavigation: NavItem[] = [
  { label: "All Ducks", href: "/products" },
  { label: "Search", href: "/search" },
  { label: "Cart", href: "/cart" },
];
