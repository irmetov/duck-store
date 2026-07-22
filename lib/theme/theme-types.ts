export type ThemeConfig = {
  name: string;
  layout: {
    containerWidth: string;
    pagePadding: string;
    sectionSpacing: string;
    productGridColumns: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  typography: {
    headingFont: string;
    subtitleFont: string;
    bodyFont: string;
    headingScale: "compact" | "balanced" | "large";
    headingTracking: "tight" | "normal" | "wide";
  };
  imagery: {
    productAspectRatio: "1/1" | "4/5" | "3/4";
    objectFit: "cover" | "contain";
    imageRadius: "none" | "small" | "medium" | "large";
  };
  components: {
    headerStyle: "minimal" | "centered" | "editorial";
    buttonStyle: "square" | "soft" | "pill";
    productCardStyle: "minimal" | "boxed" | "editorial";
  };
  interaction: {
    cardHover: "none" | "zoom" | "lift" | "image-swap";
    buttonMotion: "none" | "subtle" | "dynamic";
  };
};
