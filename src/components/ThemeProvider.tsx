// 🔒 CORE SYSTEM - DO NOT MODIFY
// Theme provider using next-themes for dark mode support
// Handles theme persistence, system preference, and hydration

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="saas-theme"
    >
      {children}
    </NextThemesProvider>
  );
};
