"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { IconButton } from "./icon-button";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "left";
  className?: string;
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  className,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-surface-navy" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background outline-none transition-transform duration-slow ease-out",
            side === "right" ? "right-0" : "left-0",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
            <div>
              <Dialog.Title className="font-heading text-xl font-semibold text-foreground">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : (
                <VisuallyHidden>
                  <Dialog.Description>Drawer panel</Dialog.Description>
                </VisuallyHidden>
              )}
            </div>
            <Dialog.Close asChild>
              <IconButton label="Close" variant="soft" size="sm">
                <X className="size-5" aria-hidden />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer ? (
            <div className="border-t border-border/60 px-5 py-4">{footer}</div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
