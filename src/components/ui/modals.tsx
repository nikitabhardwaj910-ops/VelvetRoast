"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Search, Calendar, Clock, Users, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import ReservationStepper from "@/components/reservations/reservation-stepper";
import AuthModal from "@/components/auth/auth-modal";
import CheckoutModal from "@/components/orders/checkout-modal";

export default function GlobalModals() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    isReservationOpen,
    setIsReservationOpen,
    activeLightboxImg,
    setActiveLightboxImg,
    requireAuth,
    setIsCheckoutModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [resStep, setResStep] = useState<"form" | "success">("form");
  const [resData, setResData] = useState({
    name: "Alexander Wright",
    email: "alexander@velvetroast.com",
    date: "2026-07-04",
    time: "19:00",
    guests: "2",
    notes: "Quiet table near the gold fireplace please.",
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    requireAuth(() => {
      setIsCartOpen(false);
      setIsCheckoutModalOpen(true);
    });
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#C49A6C", "#F6F2EC", "#D4B28C"],
    });
    setResStep("success");
  };

  const menuSearchItems = [
    { name: "Club Sandwich", price: "₹189", category: "Breakfast", desc: "Triple layer sandwich loaded with fresh veggies, paneer tikka & melted cheese." },
    { name: "Paneer Tikka Sandwich", price: "₹169", category: "Breakfast", desc: "Spicy paneer tikka filling grilled to golden crisp perfection." },
    { name: "Cheese Corn Sandwich", price: "₹149", category: "Breakfast", desc: "Cheesy & delicious grilled sandwich loaded with juicy sweet corn." },
    { name: "Veg Sandwich", price: "₹129", category: "Breakfast", desc: "Fresh garden veggies layered with creamy cheese inside sourdough." },
    { name: "Cheesy Maggie", price: "₹89", category: "Breakfast", desc: "Masala maggie smothered in rich gooey melted cheese." },
    { name: "Masala Maggie", price: "₹79", category: "Breakfast", desc: "Classic desi comfort noodle bowl cooked with herb seasoning." },
    { name: "Peri Peri Maggie", price: "₹99", category: "Breakfast", desc: "Fiery zesty peri-peri tossed masala noodles." },
    { name: "Zaikaa Cold Coffee", price: "₹139", category: "Breakfast", desc: "Creamy blended artisan cold coffee drizzled with dark cocoa syrup." },
    { name: "Vege Overloaded Pizza", price: "₹299", category: "Lunch", desc: "Loaded with fresh onion, capsicum, red paprika, olives & jalapenos." },
    { name: "Paneer Tikka Pizza", price: "₹269", category: "Lunch", desc: "Desi spiced paneer tikka chunks, onion, capsicum and makhani sauce." },
    { name: "Farmhouse Pizza", price: "₹249", category: "Lunch", desc: "Loaded with crunchy onion, capsicum, tomato & roasted mushrooms." },
    { name: "Margherita Pizza", price: "₹199", category: "Lunch", desc: "Classic cheese pizza topped with mozzarella and basil herbs." },
    { name: "White Sauce Pasta", price: "₹189", category: "Lunch", desc: "Creamy & cheesy penne pasta tossed in white parmesan sauce." },
    { name: "Mix Sauce Pasta", price: "₹199", category: "Lunch", desc: "Pink sauce perfection combining arrabbiata and cheese cream." },
    { name: "Red Sauce Pasta", price: "₹179", category: "Lunch", desc: "Classic Italian arrabbiata tomato basil sauce tossed with penne." },
    { name: "Zaikaa Special Burger", price: "₹179", category: "Lunch", desc: "Premium double layer veg patty with melted cheese & fresh veggies." },
    { name: "Cheese Burger", price: "₹159", category: "Lunch", desc: "Cheesy burger with golden crispy veg patty and double cheese overlay." },
    { name: "Aloo Tikki Burger", price: "₹139", category: "Lunch", desc: "Classic golden spiced aloo tikki topped with fresh onion slice." },
    { name: "Veg Burger", price: "₹129", category: "Lunch", desc: "Crispy vegetable patty served on toasted bun with crisp lettuce." },
    { name: "Loaded Fries", price: "₹159", category: "Lunch", desc: "Golden crispy fries smothered in cheese sauce, olives & jalapenos." },
    { name: "Cheese Fries", price: "₹139", category: "Lunch", desc: "Crispy French fries drenched in warm flowing cheddar cheese dip." },
    { name: "Peri Peri Fries", price: "₹119", category: "Lunch", desc: "Crispy golden potato fries tossed in zesty peri-peri seasoning." },
    { name: "Classic Espresso", price: "₹249", category: "Coffee & Espresso", desc: "Double extraction single-origin Ethiopian roast." },
    { name: "Classic Americano", price: "₹279", category: "Coffee & Espresso", desc: "Rich artisan espresso shots topped with hot filtered water." },
    { name: "Artisan Cafe Latte", price: "₹349", category: "Coffee & Espresso", desc: "Full-bodied espresso balanced with steamed milk and foam." },
    { name: "Silk Cappuccino", price: "₹349", category: "Coffee & Espresso", desc: "Equal parts dark espresso, steamed milk, and dense microfoam." },
    { name: "Dark Belgian Mocha", price: "₹399", category: "Coffee & Espresso", desc: "Rich 70% dark chocolate melted into espresso." },
    { name: "Spiced Chai Latte", price: "₹329", category: "Specialty Drinks", desc: "Aromatic black tea infused with cardamom, cinnamon & steamed milk." },
    { name: "Ceremonial Matcha Latte", price: "₹399", category: "Specialty Drinks", desc: "First-harvest Uji green tea whisked with silky milk and honey." },
    { name: "Golden Turmeric Latte", price: "₹329", category: "Specialty Drinks", desc: "Warming blend of organic turmeric, ginger, and frothed milk." },
    { name: "Artisan Hot Chocolate", price: "₹349", category: "Specialty Drinks", desc: "Melted dark ganache whisked with steamed milk." },
    { name: "Layered Iced Matcha", price: "₹429", category: "Specialty Drinks", desc: "Chilled ceremonial green matcha poured over ice spheres." },
  ];

  const filteredSearch = searchQuery.trim()
    ? menuSearchItems.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuSearchItems;

  return (
    <>
      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#121212] border-l border-accent/20 h-full flex flex-col z-10 shadow-2xl"
            >
            <div className="p-6 border-b border-accent/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-2xl text-cream">Your Tasting Cart</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 border border-accent/20 flex items-center justify-center text-accent/50 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-serif text-xl text-cream mb-2">Your Cup is Empty</p>
                  <p className="text-sm text-cream/60 max-w-xs mb-6">Explore our artisanal menu and discover exquisite blends handcrafted just for you.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-primary transition-all"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-card border border-accent/10 items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-cream truncate">{item.name}</h4>
                      <p className="text-sm text-accent font-medium">₹{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-accent/20 rounded-md bg-secondary/50">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-cream/60 hover:text-accent transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-cream">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-cream/60 hover:text-accent transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-cream/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-accent/15 bg-[#151515]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-cream/70 text-sm">Subtotal</span>
                  <span className="font-serif text-2xl text-cream font-medium">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-full bg-gold-gradient text-primary font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-accent/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Proceed to Order
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", damping: 22, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-[#151515] border border-accent/30 rounded-2xl p-6 shadow-2xl z-10"
            >
            <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
              <Search className="w-5 h-5 text-accent" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee blends, roasting notes, or table availability..."
                autoFocus
                className="w-full bg-transparent text-cream placeholder-cream/40 outline-none text-lg font-serif"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-cream/60 hover:text-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
              <span className="text-xs uppercase tracking-widest text-accent/80 font-medium block mb-2">Curated Results</span>
              {filteredSearch.map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-secondary/50 border border-accent/10 hover:border-accent/40 flex items-center justify-between transition-all cursor-pointer group"
                  onClick={() => {
                    setIsSearchOpen(false);
                    const element = document.getElementById("menu");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg text-cream group-hover:text-accent transition-colors">{item.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{item.category}</span>
                    </div>
                    <p className="text-sm text-cream/60 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-serif text-lg text-accent font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Table Reservation Modal */}
      <AnimatePresence>
        {isReservationOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsReservationOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 60 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <button
                type="button"
                onClick={() => setIsReservationOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-cream/70 hover:text-accent z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <ReservationStepper onClose={() => setIsReservationOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-lg"
              onClick={() => setActiveLightboxImg(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: "spring", damping: 22, stiffness: 350 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center z-10"
            >
              <button
                onClick={() => setActiveLightboxImg(null)}
                className="absolute -top-12 right-0 md:top-4 md:right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-accent/40 text-cream flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-accent/30 shadow-2xl">
                <Image
                  src={activeLightboxImg}
                  alt="Velvet Roast Gallery Lightbox"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal />
      <CheckoutModal />
    </>
  );
}
