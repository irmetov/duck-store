import { themeConfig } from "./theme-config";

export function getProductAspectClass() {
  switch (themeConfig.imagery.productAspectRatio) {
    case "4/5":
      return "aspect-[4/5]";
    case "3/4":
      return "aspect-[3/4]";
    default:
      return "aspect-square";
  }
}

export function getImageRadiusClass() {
  switch (themeConfig.imagery.imageRadius) {
    case "none":
      return "rounded-none";
    case "small":
      return "rounded-sm";
    case "medium":
      return "rounded-md";
    case "large":
      return "rounded-image";
  }
}

export function getButtonRadiusClass() {
  switch (themeConfig.components.buttonStyle) {
    case "square":
      return "rounded-none";
    case "soft":
      return "rounded-button";
    case "pill":
      return "rounded-full";
  }
}

export function getCardHoverClass() {
  switch (themeConfig.interaction.cardHover) {
    case "zoom":
      return "transition-transform duration-normal group-hover:scale-[1.03]";
    case "lift":
      return "transition-transform duration-normal group-hover:-translate-y-1";
    case "image-swap":
      return "";
    default:
      return "";
  }
}
