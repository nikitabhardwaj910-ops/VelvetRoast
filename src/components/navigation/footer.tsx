"use client";

import { Coffee, FileText, MapPin, Phone, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuWindow = window.open("", "_blank");
    if (menuWindow) {
      menuWindow.document.write(`
        <html>
          <head>
            <title>Velvet Roast - Official Tasting Menu 2026</title>
            <style>
              body { font-family: 'Georgia', serif; background: #0F0F0F; color: #F6F2EC; padding: 40px; text-align: center; }
              h1 { font-size: 36px; color: #C49A6C; margin-bottom: 8px; }
              p.sub { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: #8F6B43; margin-bottom: 40px; }
              .section { max-width: 600px; margin: 0 auto 30px; text-align: left; border-bottom: 1px solid rgba(196,154,108,0.2); padding-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px; }
              .price { color: #C49A6C; font-weight: bold; }
              .desc { font-size: 13px; color: #AAA; font-family: sans-serif; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <h1>Velvet Roast</h1>
            <p class="sub">Luxury Café & Roastery • Tasting Menu</p>
            <div class="section">
              <div class="item"><span>Club Sandwich (Triple Layer)</span><span class="price">₹189</span></div>
              <div class="desc">Loaded with fresh veggies, paneer tikka filling & melted cheese slice.</div>
              <div class="item"><span>Paneer Tikka Sandwich</span><span class="price">₹169</span></div>
              <div class="desc">Spicy paneer tikka filling grilled to golden crisp perfection with cheese.</div>
              <div class="item"><span>Cheese Corn Sandwich</span><span class="price">₹149</span></div>
              <div class="desc">Cheesy & delicious grilled sandwich loaded with sweet corn kernels.</div>
              <div class="item"><span>Cheesy Maggie</span><span class="price">₹89</span></div>
              <div class="desc">Piping hot masala maggie smothered in rich gooey melted cheddar cheese.</div>
              <div class="item"><span>Masala Maggie</span><span class="price">₹79</span></div>
              <div class="desc">Classic desi comfort bowl cooked with special herb seasoning.</div>
              <div class="item"><span>Vege Overloaded Pizza</span><span class="price">₹299</span></div>
              <div class="desc">Loaded with onion, capsicum, red paprika, black olives & jalapenos.</div>
              <div class="item"><span>Paneer Tikka Pizza</span><span class="price">₹269</span></div>
              <div class="desc">Spiced paneer tikka chunks, onion, capsicum and makhani sauce.</div>
              <div class="item"><span>Farmhouse Pizza</span><span class="price">₹249</span></div>
              <div class="desc">Loaded with fresh onion, crisp capsicum, ripe tomato & mushrooms.</div>
              <div class="item"><span>White Sauce Pasta</span><span class="price">₹189</span></div>
              <div class="desc">Creamy & cheesy penne pasta tossed in white parmesan garlic sauce.</div>
              <div class="item"><span>Zaikaa Special Burger</span><span class="price">₹179</span></div>
              <div class="desc">Premium double veg patty with cheese slice, fresh veggies & special sauce.</div>
              <div class="item"><span>Loaded Fries</span><span class="price">₹159</span></div>
              <div class="desc">Smothered in cheese sauce, fresh veggies, olives & jalapenos.</div>
              <div class="item"><span>Zaikaa Cold Coffee</span><span class="price">₹139</span></div>
              <div class="desc">Creamy blended artisan cold coffee drizzled with dark cocoa syrup.</div>
              <div class="item"><span>Classic Espresso</span><span class="price">₹249</span></div>
              <div class="desc">Double extraction single-origin Ethiopian roast with thick velvet crema.</div>
              <div class="item"><span>Classic Americano</span><span class="price">₹279</span></div>
              <div class="desc">Rich artisan espresso shots topped with hot filtered water.</div>
              <div class="item"><span>Artisan Cafe Latte</span><span class="price">₹349</span></div>
              <div class="desc">Full-bodied espresso balanced with steamed milk and a light layer of foam.</div>
              <div class="item"><span>Silk Cappuccino</span><span class="price">₹349</span></div>
              <div class="desc">Equal parts dark espresso, steamed milk, and dense velvety microfoam.</div>
              <div class="item"><span>Dark Belgian Mocha</span><span class="price">₹399</span></div>
              <div class="desc">Rich 70% dark chocolate melted into artisan espresso.</div>
              <div class="item"><span>Spiced Chai Latte</span><span class="price">₹329</span></div>
              <div class="desc">Aromatic black tea infused with cardamom, cinnamon, clove & steamed milk.</div>
              <div class="item"><span>Ceremonial Matcha Latte</span><span class="price">₹399</span></div>
              <div class="desc">First-harvest Uji green tea whisked with silky milk and honey.</div>
              <div class="item"><span>Golden Turmeric Latte</span><span class="price">₹329</span></div>
              <div class="desc">Warming blend of organic turmeric, ginger, and frothed milk.</div>
              <div class="item"><span>Artisan Hot Chocolate</span><span class="price">₹349</span></div>
              <div class="desc">Melted dark ganache whisked with steamed milk and marshmallow fluff.</div>
              <div class="item"><span>Layered Iced Matcha</span><span class="price">₹429</span></div>
              <div class="desc">Chilled ceremonial green matcha poured over ice spheres.</div>
            </div>
            <p style="font-size:12px; color:#666; margin-top:40px;">Please press Ctrl+P or Cmd+P to save as PDF.</p>
          </body>
        </html>
      `);
      menuWindow.document.close();
      menuWindow.focus();
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      name: "X",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.378-.293 1.186-.332 1.355-.061.26-.201.315-.463.193-1.728-.802-2.81-3.324-2.81-5.352 0-4.36 3.169-8.368 9.145-8.368 4.806 0 8.544 3.428 8.544 8.005 0 4.776-3.011 8.625-7.194 8.625-1.404 0-2.725-.731-3.177-1.593 0 0-.695 2.645-.863 3.298-.313 1.206-1.157 2.715-1.723 3.633 1.28.396 2.648.614 4.062.614 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer id="footer" className="relative bg-[#0A0A0A] border-t border-accent/20 pt-20 pb-12 text-cream">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        className="max-w-7xl mx-auto px-6 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-accent/15">
          {/* Brand Column */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-primary shadow-lg">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl font-bold tracking-wider text-cream">
                Velvet Roast
              </span>
            </div>
            <p className="text-sm text-cream/70 font-light leading-relaxed max-w-sm">
              An award-winning sanctuary dedicated to specialty coffee mastery, sensory architecture, and uncompromising hospitality in the heart of the city.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  href="#"
                  aria-label={s.name}
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-cream/80 hover:text-accent hover:border-accent transition-colors shadow-md"
                >
                  {s.svg}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="lg:col-span-2 space-y-4"
          >
            <h4 className="font-serif text-xl text-cream font-medium">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              {["Home", "About Our Roastery", "Signature Menu", "Gallery Sanctuary", "VIP Reservations", "Journal & Blog"].map((item, i) => (
                <li key={i}>
                  <motion.a
                    href={`#${item.toLowerCase().split(" ")[0]}`}
                    whileHover={{
                      x: 8,
                      scale: 1.05,
                      color: "#D4AF37",
                      transition: { type: "spring", stiffness: 400, damping: 15 },
                    }}
                    className="inline-block hover:text-accent transition-colors"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
              <li className="pt-2 border-t border-accent/15">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-accent hover:text-primary hover:bg-gold-gradient px-2.5 py-1 rounded-lg font-bold text-xs transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Executive Admin Suite</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="lg:col-span-3 space-y-4"
          >
            <h4 className="font-serif text-xl text-cream font-medium">Opening Hours</h4>
            <div className="space-y-3 text-sm text-cream/70">
              <div className="flex justify-between border-b border-accent/10 pb-2">
                <span>Monday – Friday</span>
                <span className="text-accent font-medium">6:30 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-accent/10 pb-2">
                <span>Saturday – Sunday</span>
                <span className="text-accent font-medium">7:30 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Holiday Roasting</span>
                <span className="text-accent font-medium">8:00 AM – 6:00 PM</span>
              </div>
            </div>
          </motion.div>

          {/* Contact & Download PDF */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="lg:col-span-3 space-y-4"
          >
            <h4 className="font-serif text-xl text-cream font-medium">Flagship Contact</h4>
            <div className="space-y-3 text-sm text-cream/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>450 Velvet Avenue, Flagship Roastery District, New York, NY 10012</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+1 (212) 800-ROAST</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>concierge@velvetroast.com</span>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadPDF}
                className="w-full py-3 rounded-full border border-accent/40 text-cream text-xs uppercase tracking-widest font-semibold hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-accent group-hover:text-primary" /> Download Menu PDF
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Credits & Award Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>&copy; {new Date().getFullYear()} Velvet Roast Inc. All rights reserved. Designed with Apple-level luxury finish.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Accessibility Statement</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
