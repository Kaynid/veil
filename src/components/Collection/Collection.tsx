"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const collectionItems = [
  {
    title: "Deconstructed Blazer",
    category: "Outerwear",
    price: "€1,890",
  },
  {
    title: "Layered Denim Jacket",
    category: "Outerwear",
    price: "€2,240",
  },
  {
    title: "Sculptural Trousers",
    category: "Bottoms",
    price: "€1,120",
  },
  {
    title: "Architectural Vest",
    category: "Layering",
    price: "€1,460",
  },
  {
    title: "Oversized Denim Set",
    category: "Full Look",
    price: "€3,680",
  },
  {
    title: "Technical Hoodie",
    category: "Tops",
    price: "€980",
  },
];

function EmptyCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
      className="group"
      style={{ marginBottom: "16vh" }} // Huge macro-whitespace
    >
      {/* Double-Bezel Architecture */}
      <div 
        className="outer-shell"
        style={{
          padding: "8px",
          borderRadius: "2rem",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          width: "100%",
          aspectRatio: "3/4",
        }}
      >
        <div
          className="inner-core"
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "calc(2rem - 8px)",
            background: "rgba(5, 5, 5, 0.6)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Subtle hover gradient inside */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 70%)"
            }}
          />
          
          {/* Wireframe / Placeholder Graphic */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v16H4z" />
            <path d="M4 4l16 16" />
            <path d="M20 4L4 20" />
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingLeft: 8 }}>
        <div className="caption" style={{ marginBottom: 8 }}>
          {item.category}
        </div>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginBottom: 4,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 300,
            color: "var(--text-secondary)",
          }}
        >
          {item.price}
        </div>
      </div>
    </motion.div>
  );
}

export function Collection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section 
      ref={containerRef}
      id="collections"
      style={{
        paddingTop: "20vh",
        paddingBottom: "20vh",
        background: "#050505", // Deepest OLED black
        position: "relative",
        zIndex: 10,
      }}
    >
      <div 
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 4vw",
          display: "flex",
          flexDirection: "row",
          gap: "8vw",
          flexWrap: "wrap"
        }}
      >
        {/* Left: Sticky Editorial Typography */}
        <div 
          style={{ 
            flex: "1 1 400px", 
            position: "relative" 
          }}
        >
          <div 
            style={{
              position: "sticky",
              top: "20vh",
              display: "flex",
              flexDirection: "column",
              gap: 40
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div 
                className="caption" 
                style={{ 
                  marginBottom: 24,
                  display: "inline-block",
                  padding: "4px 16px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                05 — CATALOGUE
              </div>
              
              <h2 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(60px, 8vw, 120px)",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  fontWeight: 800,
                  letterSpacing: "-0.02em"
                }}
              >
                THE<br/>COLLECTION
              </h2>
              
              <p
                className="body-lg"
                style={{ 
                  marginTop: 40, 
                  maxWidth: 400,
                  color: "rgba(255,255,255,0.6)"
                }}
              >
                Each piece exists at the intersection of structure and fluidity. 
                Designed to be discovered. Crafted to endure.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right: Scrolling Double-Bezel Cards */}
        <div 
          style={{ 
            flex: "1 1 500px",
            paddingTop: "20vh"
          }}
        >
          {collectionItems.map((item, i) => (
            <EmptyCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          marginTop: 160,
          paddingTop: 48,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 48,
          padding: "0 4vw"
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            VEIL.
          </div>
          <p className="body-sm" style={{ maxWidth: 300, color: "rgba(255,255,255,0.5)" }}>
            A design studio exploring identity
            <br />
            through garments, silhouettes
            <br />
            and digital experiences.
          </p>
        </div>

        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          <div>
            <div className="caption" style={{ marginBottom: 16 }}>
              Navigate
            </div>
            {["Collections", "Archive", "Studio", "Journal"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link"
                style={{
                  display: "block",
                  marginBottom: 12,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.7)"
                }}
              >
                {link}
              </a>
            ))}
          </div>

          <div>
            <div className="caption" style={{ marginBottom: 16 }}>
              Connect
            </div>
            {["Instagram", "Twitter", "LinkedIn"].map((link) => (
              <a
                key={link}
                href="#"
                className="nav-link"
                style={{
                  display: "block",
                  marginBottom: 12,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.7)"
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", marginTop: 48 }}>
          <div
            className="caption"
            style={{ textAlign: "center", opacity: 0.4 }}
          >
            © 2026 VEIL. All rights reserved. Reveal what you're wearing.
          </div>
        </div>
      </motion.footer>
    </section>
  );
}
