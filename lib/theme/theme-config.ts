import type { ThemeConfig } from "./theme-types";

/** Active visual preset — Duck Donuts playful (see Assets/color-scheme.png). */
export const themeConfig: ThemeConfig = {
  name: "duck-donuts",
  layout: {
    containerWidth: "72rem",
    pagePadding: "1.25rem",
    sectionSpacing: "4.5rem",
    productGridColumns: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
  },
  typography: {
    headingFont: "var(--font-heading)",
    subtitleFont: "var(--font-subtitle)",
    bodyFont: "var(--font-body)",
    headingScale: "large",
    headingTracking: "tight",
  },
  imagery: {
    productAspectRatio: "1/1",
    objectFit: "cover",
    imageRadius: "large",
  },
  components: {
    headerStyle: "minimal",
    buttonStyle: "soft",
    productCardStyle: "boxed",
  },
  interaction: {
    cardHover: "none",
    buttonMotion: "dynamic",
  },
};
