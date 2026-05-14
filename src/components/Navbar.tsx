import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Hakkımızda", path: "/hakkimizda" },
    { name: "Hizmetlerimiz", path: "/hizmetler" },
    { name: "Aktiviteler", path: "/aktiviteler" },
    { name: "İletişim", path: "/iletisim" },
  ];

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <Link
          to="/"
          className="text-2xl font-bold text-pastel-orange flex items-center gap-2">
          <Sun className="w-8 h-8" />
          ÇOCUK ELİ ANA OKULU
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden md:flex gap-6 text-gray-600 font-semibold">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative hover:text-pastel-orange transition ${location.pathname === link.path ? "text-pastel-orange" : ""}`}>
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 h-1 bg-pastel-orange bottom-[-4px] rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobil Hamburger Butonu */}
        <button
          className="md:hidden text-gray-800 hover:text-pastel-orange transition"
          onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobil Sidebar (Çekmece Menü) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Arka Plan Karartması */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Siyah Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-2xl z-[70] md:hidden flex flex-col">
              <div className="p-6 flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex flex-col gap-6 px-8 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-pastel-orange"
                        : "text-gray-300 hover:text-white"
                    }`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
