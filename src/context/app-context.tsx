"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  specialInstructions?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateItemInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  activeLightboxImg: string | null;
  setActiveLightboxImg: (img: string | null) => void;
  // Auth state
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  requireAuth: (action: () => void) => void;
  // Checkout state
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "esp-1",
      name: "Velvet Signature Espresso",
      price: 349,
      quantity: 1,
      image: "/images/menu-espresso.png",
      category: "Coffee",
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Load persisted user session from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("velvet_user_session");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
  }, []);

  const login = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem("velvet_user_session", JSON.stringify(profile));
    } catch (e) {}
    setIsAuthModalOpen(false);

    // Resume any pending action after successful login
    if (pendingAuthAction) {
      setTimeout(() => {
        pendingAuthAction();
        setPendingAuthAction(null);
      }, 300);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("velvet_user_session");
    } catch (e) {}
  };

  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAuthAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateItemInstructions = (id: string, instructions: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, specialInstructions: instructions } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemInstructions,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isReservationOpen,
        setIsReservationOpen,
        activeLightboxImg,
        setActiveLightboxImg,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        requireAuth,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
