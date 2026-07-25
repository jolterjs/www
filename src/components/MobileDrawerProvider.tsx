"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { DocNavGroup } from "@/lib/docs-types";

type MobileDrawerContextType = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  docsNav: DocNavGroup[] | null;
  setDocsNav: (nav: DocNavGroup[] | null) => void;
  currentDocsHref: string;
  setCurrentDocsHref: (href: string) => void;
};

const MobileDrawerContext = createContext<MobileDrawerContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
  docsNav: null,
  setDocsNav: () => {},
  currentDocsHref: "",
  setCurrentDocsHref: () => {},
});

export function MobileDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [docsNav, setDocsNav] = useState<DocNavGroup[] | null>(null);
  const [currentDocsHref, setCurrentDocsHref] = useState<string>("");

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.setAttribute("data-drawer-open", "true");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <MobileDrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        docsNav,
        setDocsNav,
        currentDocsHref,
        setCurrentDocsHref,
      }}
    >
      {children}
    </MobileDrawerContext.Provider>
  );
}

export function useMobileDrawer() {
  return useContext(MobileDrawerContext);
}
