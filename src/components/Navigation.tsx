"use client";

import { motion } from "framer-motion";

interface NavigationProps {
  visible: boolean;
}

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Archive", href: "#archive" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function Navigation({ visible }: NavigationProps) {
  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="/" className="nav-logo">
        VEIL.
      </a>

      <ul className="nav-links">
        {navLinks.map((link, i) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: visible ? 0.7 : 0,
              y: visible ? 0 : -10,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <a href={link.href} className="nav-link">
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
