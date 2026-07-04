"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/app-context";
import { Star, Plus, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedMenu() {
  const { addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ["All", "Breakfast", "Lunch", "Coffee & Espresso", "Specialty Drinks", "Pizza & Pasta", "Burgers & Sandwiches", "Maggie & Fries", "Beverages"];

  const menuItems = [
    // ── BREAKFAST (Sandwiches, Maggie, Cold Coffee) ──
    {
      id: "uz-1",
      name: "Club Sandwich",
      price: 189,
      description: "Triple layer sandwich loaded with fresh veggies, spicy paneer tikka filling & melted cheese slice.",
      rating: 4.9,
      popular: true,
      meal: "Breakfast",
      category: "Burgers & Sandwiches",
      image: "/images/menu-sandwich.png",
    },
    {
      id: "uz-2",
      name: "Paneer Tikka Sandwich",
      price: 169,
      description: "Spicy paneer tikka filling grilled to golden crisp perfection with creamy cheese.",
      rating: 4.8,
      popular: false,
      meal: "Breakfast",
      category: "Burgers & Sandwiches",
      image: "/images/menu-sandwich.png",
    },
    {
      id: "uz-3",
      name: "Cheese Corn Sandwich",
      price: 149,
      description: "Cheesy & delicious grilled sandwich loaded with juicy sweet corn kernels.",
      rating: 4.9,
      popular: true,
      meal: "Breakfast",
      category: "Burgers & Sandwiches",
      image: "/images/menu-sandwich.png",
    },
    {
      id: "uz-4",
      name: "Veg Sandwich",
      price: 129,
      description: "Fresh garden veggies layered with creamy cheese inside artisan sourdough bread.",
      rating: 4.7,
      popular: false,
      meal: "Breakfast",
      category: "Burgers & Sandwiches",
      image: "/images/menu-sandwich.png",
    },
    {
      id: "uz-5",
      name: "Cheesy Maggie",
      price: 89,
      description: "Piping hot desi masala maggie noodles smothered in rich gooey melted cheese.",
      rating: 4.9,
      popular: true,
      meal: "Breakfast",
      category: "Maggie & Fries",
      image: "/images/menu-maggie.png",
    },
    {
      id: "uz-6",
      name: "Masala Maggie",
      price: 79,
      description: "Classic desi comfort noodle bowl cooked with special herb seasoning and secret spice mix.",
      rating: 4.8,
      popular: false,
      meal: "Breakfast",
      category: "Maggie & Fries",
      image: "/images/menu-maggie.png",
    },
    {
      id: "uz-7",
      name: "Peri Peri Maggie",
      price: 99,
      description: "Fiery zesty peri-peri tossed masala noodles for an energizing morning kick.",
      rating: 4.8,
      popular: false,
      meal: "Breakfast",
      category: "Maggie & Fries",
      image: "/images/menu-maggie.png",
    },
    {
      id: "uz-8",
      name: "Zaikaa Cold Coffee",
      price: 139,
      description: "Creamy blended artisan cold coffee drizzled with dark cocoa syrup and whipped froth.",
      rating: 4.9,
      popular: true,
      meal: "Breakfast",
      category: "Beverages",
      image: "/images/menu-latte.png",
    },

    // ── COFFEE & ESPRESSO ──
    {
      id: "ce-1",
      name: "Classic Espresso",
      price: 249,
      description: "Double extraction single-origin Ethiopian roast with thick velvet crema.",
      rating: 4.9,
      popular: true,
      meal: "Anytime",
      category: "Coffee & Espresso",
      image: "/images/menu-espresso.png",
    },
    {
      id: "ce-2",
      name: "Classic Americano",
      price: 279,
      description: "Rich artisan espresso shots topped with hot filtered water for a clean, deep flavor.",
      rating: 4.8,
      popular: false,
      meal: "Anytime",
      category: "Coffee & Espresso",
      image: "/images/menu-espresso.png",
    },
    {
      id: "ce-3",
      name: "Artisan Cafe Latte",
      price: 349,
      description: "Full-bodied espresso balanced with steamed milk and a light layer of foam.",
      rating: 4.9,
      popular: true,
      meal: "Anytime",
      category: "Coffee & Espresso",
      image: "/images/menu-latte.png",
    },
    {
      id: "ce-4",
      name: "Silk Cappuccino",
      price: 349,
      description: "Equal parts dark espresso, steamed milk, and dense velvety microfoam with cocoa dust.",
      rating: 5.0,
      popular: true,
      meal: "Anytime",
      category: "Coffee & Espresso",
      image: "/images/menu-cappuccino.png",
    },
    {
      id: "ce-5",
      name: "Dark Belgian Mocha",
      price: 399,
      description: "Rich 70% Ecuadorian dark chocolate melted into espresso and topped with artisan foam.",
      rating: 4.9,
      popular: false,
      meal: "Anytime",
      category: "Coffee & Espresso",
      image: "/images/menu-mocha.png",
    },

    // ── SPECIALTY DRINKS ──
    {
      id: "sd-1",
      name: "Spiced Chai Latte",
      price: 329,
      description: "Aromatic black tea infused with cardamom, cinnamon, clove and steamed milk.",
      rating: 4.9,
      popular: true,
      meal: "Anytime",
      category: "Specialty Drinks",
      image: "/images/menu-latte.png",
    },
    {
      id: "sd-2",
      name: "Ceremonial Matcha Latte",
      price: 399,
      description: "First-harvest Uji green tea whisked with silky oat or whole milk and honey.",
      rating: 5.0,
      popular: true,
      meal: "Anytime",
      category: "Specialty Drinks",
      image: "/images/luxebrew-cup.png",
    },
    {
      id: "sd-3",
      name: "Golden Turmeric Latte",
      price: 329,
      description: "Warming blend of organic turmeric, ginger, black pepper, and frothed almond milk.",
      rating: 4.8,
      popular: false,
      meal: "Anytime",
      category: "Specialty Drinks",
      image: "/images/menu-latte.png",
    },
    {
      id: "sd-4",
      name: "Artisan Hot Chocolate",
      price: 349,
      description: "Melted dark ganache whisked with steamed milk and topped with marshmallow fluff.",
      rating: 4.9,
      popular: false,
      meal: "Anytime",
      category: "Specialty Drinks",
      image: "/images/menu-mocha.png",
    },
    {
      id: "sd-5",
      name: "Layered Iced Matcha",
      price: 429,
      description: "Chilled ceremonial green matcha poured over ice spheres and sweet vanilla milk.",
      rating: 4.9,
      popular: true,
      meal: "Anytime",
      category: "Specialty Drinks",
      image: "/images/menu-cold-brew.png",
    },

    // ── LUNCH (Burgers, Pizzas, Pastas, Loaded Fries) ──
    {
      id: "uz-9",
      name: "Vege Overloaded Pizza",
      price: 299,
      description: "Loaded with fresh onion, capsicum, red paprika, black olives & spicy jalapenos on herb crust.",
      rating: 5.0,
      popular: true,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-pizza.png",
    },
    {
      id: "uz-10",
      name: "Paneer Tikka Pizza",
      price: 269,
      description: "Desi spiced paneer tikka chunks, onion, capsicum and signature makhani tikka sauce.",
      rating: 4.9,
      popular: true,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-pizza.png",
    },
    {
      id: "uz-11",
      name: "Farmhouse Pizza",
      price: 249,
      description: "Loaded with crunchy onion, crisp capsicum, ripe tomato & golden roasted mushrooms.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-pizza.png",
    },
    {
      id: "uz-12",
      name: "Margherita Pizza",
      price: 199,
      description: "Classic authentic cheese pizza topped with Italian mozzarella and fragrant basil herb seasoning.",
      rating: 4.7,
      popular: false,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-pizza.png",
    },
    {
      id: "uz-13",
      name: "White Sauce Pasta",
      price: 189,
      description: "Creamy & cheesy penne pasta tossed in rich white parmesan garlic sauce with herbs.",
      rating: 4.9,
      popular: true,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-truffle-pasta.png",
    },
    {
      id: "uz-14",
      name: "Mix Sauce Pasta",
      price: 199,
      description: "Pink sauce perfection combining tangy arrabbiata tomato and rich velvety cheese cream.",
      rating: 4.9,
      popular: false,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-truffle-pasta.png",
    },
    {
      id: "uz-15",
      name: "Red Sauce Pasta",
      price: 179,
      description: "Classic Italian arrabbiata tomato basil sauce tossed with penne and roasted garlic.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Pizza & Pasta",
      image: "/images/menu-truffle-pasta.png",
    },
    {
      id: "uz-16",
      name: "Zaikaa Special Burger",
      price: 179,
      description: "Premium double layer veg patty with melted cheese slice, fresh veggies & signature desi sauce.",
      rating: 5.0,
      popular: true,
      meal: "Lunch",
      category: "Burgers & Sandwiches",
      image: "/images/menu-wagyu-burger.png",
    },
    {
      id: "uz-17",
      name: "Cheese Burger",
      price: 159,
      description: "Cheesy & yummy burger with golden crispy veg patty and double cheese overlay.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Burgers & Sandwiches",
      image: "/images/menu-wagyu-burger.png",
    },
    {
      id: "uz-18",
      name: "Aloo Tikki Burger",
      price: 139,
      description: "Classic golden spiced aloo tikki topped with fresh onion slice and mint mayo.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Burgers & Sandwiches",
      image: "/images/menu-wagyu-burger.png",
    },
    {
      id: "uz-19",
      name: "Veg Burger",
      price: 129,
      description: "Crispy vegetable patty served on toasted sesame bun with crisp lettuce and dressing.",
      rating: 4.7,
      popular: false,
      meal: "Lunch",
      category: "Burgers & Sandwiches",
      image: "/images/menu-wagyu-burger.png",
    },
    {
      id: "uz-20",
      name: "Loaded Fries",
      price: 159,
      description: "Golden crispy fries smothered in cheese sauce, fresh veggies, olives & jalapenos.",
      rating: 4.9,
      popular: true,
      meal: "Lunch",
      category: "Maggie & Fries",
      image: "/images/menu-fries.png",
    },
    {
      id: "uz-21",
      name: "Cheese Fries",
      price: 139,
      description: "Crispy French fries drenched in warm flowing cheddar cheese dip.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Maggie & Fries",
      image: "/images/menu-fries.png",
    },
    {
      id: "uz-22",
      name: "Peri Peri Fries",
      price: 119,
      description: "Crispy golden potato fries tossed in fiery zesty peri-peri seasoning.",
      rating: 4.8,
      popular: false,
      meal: "Lunch",
      category: "Maggie & Fries",
      image: "/images/menu-fries.png",
    },
    {
      id: "uz-23",
      name: "Classic Fries",
      price: 109,
      description: "Salted golden French fries served piping hot and crisp.",
      rating: 4.7,
      popular: false,
      meal: "Lunch",
      category: "Maggie & Fries",
      image: "/images/menu-fries.png",
    },
    {
      id: "uz-24",
      name: "Chilled Cold Drink",
      price: 49,
      description: "Refreshing carbonated beverage served ice chilled to pair with your meal.",
      rating: 4.7,
      popular: false,
      meal: "Lunch",
      category: "Beverages",
      image: "/images/menu-cold-brew.png",
    },
  ];

  const filteredItems = activeCategory === "All"
    ? menuItems
    : activeCategory === "Breakfast"
    ? menuItems.filter((i) => i.meal === "Breakfast")
    : activeCategory === "Lunch"
    ? menuItems.filter((i) => i.meal === "Lunch")
    : activeCategory === "Beverages"
    ? menuItems.filter((i) => i.category === "Beverages" || i.category === "Coffee & Espresso" || i.category === "Specialty Drinks")
    : menuItems.filter((i) => i.category === activeCategory);

  const handleAdd = (item: typeof menuItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="menu" className="relative py-28 bg-[#121212] overflow-hidden">
      {/* Background glowing orb */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Curated Offerings
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-normal">
              The Tasting <span className="text-gold-gradient italic">Menu</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{
                  scale: 1.12,
                  y: -4,
                  boxShadow: "0 10px 25px rgba(212, 175, 55, 0.35)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gold-gradient text-primary shadow-lg shadow-accent/20"
                    : "glass-panel text-cream/70 hover:text-accent hover:border-accent/40"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Menu Cards Grid with Layout Transitions */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.8, y: 60 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 3) * 0.12,
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -16,
                  boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.4)",
                  transition: { type: "spring", stiffness: 350, damping: 20 },
                }}
                className="glass-card rounded-3xl overflow-hidden flex flex-col group relative shadow-2xl cursor-pointer"
              >
                {/* Image Container with Hover Zoom + Parallax */}
                <div className="relative h-64 w-full overflow-hidden bg-secondary">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-90" />

                  {/* Popular Badge */}
                  {item.popular && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                      className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold-gradient text-primary text-[10px] uppercase font-bold tracking-widest shadow-md"
                    >
                      ★ Best Seller
                    </motion.span>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 glass-panel px-2.5 py-1 rounded-full flex items-center gap-1 text-xs text-cream font-medium">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span>{item.rating}</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-6">
                    <span className="font-serif text-3xl text-accent font-semibold">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-accent/80 font-medium mb-1">
                      {item.category}
                    </div>
                    <h3 className="font-serif text-2xl text-cream group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-cream/70 font-light mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAdd(item)}
                    className={`w-full py-3.5 rounded-full font-medium text-xs tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      addedId === item.id
                        ? "bg-green-600 text-white"
                        : "glass-panel border border-accent/30 text-cream hover:bg-gold-gradient hover:text-primary hover:border-transparent"
                    }`}
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Tasting Cart
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-accent group-hover:text-primary" /> Order Now
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
