"use client";

import { motion } from "framer-motion";

const NAV_LINKS = ["Collections", "Archive", "Journal", "Studio", "Lookbook"];
const CONNECT_LINKS = ["Instagram", "Behance", "Pinterest", "Contact"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function VeilFooter() {
  return (
    <footer
      id="footer"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
        borderTop: "1px solid rgba(61, 21, 32, 0.4)",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric burgundy glow — seamless continuation */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(90, 34, 51, 0.6), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "300px",
        background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(61, 21, 32, 0.2), transparent)",
        pointerEvents: "none",
      }} />

      {/* Main footer content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 80px)",
        }}
      >
        {/* Top row: brand + nav columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "clamp(40px, 5vw, 80px)",
          marginBottom: "clamp(60px, 10vh, 120px)",
          flexWrap: "wrap",
        }}>

          {/* Brand block */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1,
            }}>
              VEIL.
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(138, 131, 133, 0.7)",
              marginBottom: "24px",
            }}>
              Designed to Be Revealed.
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "rgba(138, 131, 133, 0.7)",
              maxWidth: "320px",
            }}>
              A digital design studio exploring fashion, identity and interactive
              storytelling through modern craftsmanship.
            </p>
          </motion.div>

          {/* Explore */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(196, 192, 188, 0.4)",
              marginBottom: "28px",
            }}>
              Explore
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: "rgba(245, 240, 236, 0.6)",
                    textDecoration: "none",
                    transition: "color 0.4s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245, 240, 236, 0.95)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245, 240, 236, 0.6)")}
                >
                  {link}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(196, 192, 188, 0.4)",
              marginBottom: "28px",
            }}>
              Connect
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {CONNECT_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: "rgba(245, 240, 236, 0.6)",
                    textDecoration: "none",
                    transition: "color 0.4s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245, 240, 236, 0.95)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245, 240, 236, 0.6)")}
                >
                  {link}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(196, 192, 188, 0.4)",
              marginBottom: "28px",
            }}>
              Newsletter
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "rgba(138, 131, 133, 0.7)",
              marginBottom: "24px",
            }}>
              Stay informed about new collections, collaborations and future exhibitions.
            </p>
            {/* Email input */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              <div style={{
                padding: "8px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "var(--text-primary)",
                    padding: "8px 12px",
                    letterSpacing: "0.05em",
                  }}
                />
              </div>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                background: "rgba(90, 34, 51, 0.5)",
                border: "1px solid rgba(90, 34, 51, 0.8)",
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(245, 240, 236, 0.8)",
                cursor: "none",
                transition: "background 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(90, 34, 51, 0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(90, 34, 51, 0.5)";
              }}
              >
                Join the Archive
              </button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(196, 192, 188, 0.12), transparent)",
            marginBottom: "clamp(32px, 5vh, 56px)",
          }}
        />

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgba(90, 85, 87, 0.7)",
          }}>
            © 2026 VEIL. Designed with intention.
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            fontStyle: "italic",
            letterSpacing: "0.1em",
            color: "rgba(90, 85, 87, 0.5)",
          }}>
            Every layer tells a story.
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
