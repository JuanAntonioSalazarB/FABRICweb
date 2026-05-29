"use client";

import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Metodología",
    links: [
      { label: "Doctrina FABRIC", href: "#doctrina" },
      { label: "FABRIC OS", href: "#fabricos" },
      { label: "Ciclo de Vida", href: "#lifecycle" },
      { label: "Idea Radical", href: "#generator-idea" },
      { label: "Industrias", href: "#industrias" },
    ],
  },
  {
    title: "Evidencia",
    links: [
      { label: "Casos de Éxito", href: "#casos" },
      { label: "Expediente de Auditoría", href: "#audit-trail" },
      { label: "Referencias", href: "#referencias" },
      { label: "Transparencia", href: "#transparencia" },
      { label: "Investigación", href: "#investigacion" },
    ],
  },
  {
    title: "Herramientas AI",
    links: [
      { label: "Comparadores de Costo", href: "#comparadores" },
      { label: "Consultor de Riesgo IA", href: "#terminal" },
      { label: "Insights Filtrados", href: "#doctrina-filtrado" },
    ],
  },
  {
    title: "Admisión",
    links: [
      { label: "Solicitar Admisión", href: "#admision" },
      { label: "Horas de Oficina", href: "#agenda" },
      { label: "Registro de Rechazados", href: "#apply-reverse" },
      { label: "Fundador", href: "#founder" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/fabricsoft",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/fabricsoft_mx",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@fabricsoft",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/fabricsoft-mx",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

/* ── Social icon button ─────────────────────────────────────────── */
function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center justify-center transition-all duration-300"
      style={{
        width: 40,
        height: 40,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-tertiary)",
        textDecoration: "none",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "var(--accent)";
        el.style.borderColor = "var(--accent)";
        el.style.color = "var(--bg-base)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = "var(--bg-elevated)";
        el.style.borderColor = "var(--border)";
        el.style.color = "var(--text-tertiary)";
      }}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        padding: "120px 0 64px",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-24 mb-24">
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: 48,
                marginBottom: 16,
                letterSpacing: "0.05em",
                fontWeight: 400,
                color: "var(--text-primary)",
              }}
            >
              FABRIC
            </div>
            <div
              style={{
                color: "var(--accent)",
                fontFamily: "var(--mono)",
                fontSize: 12,
                marginBottom: 48,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
              }}
            >
              Oracle Critical Engineering
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--mono)",
                fontSize: 14,
              }}
            >
              <div style={{ marginBottom: 12 }}>Ciudad de México · México</div>
              <div style={{ marginBottom: 12 }}>
                <a
                  href="mailto:contacto@fabricsoft.com.mx"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  contacto@fabricsoft.com.mx
                </a>
              </div>
              <div>
                <a
                  href="mailto:julio@fabricsoft.com.mx"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  julio@fabricsoft.com.mx
                </a>
              </div>
            </div>

            {/* Social icons */}
            <div style={{ marginTop: 40, marginBottom: 8 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--accent)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Síguenos
              </div>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <SocialIcon key={s.label} href={s.href} label={s.label} icon={s.icon} />
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
                color: "var(--text-tertiary)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              ◆ Indica funcionalidad disponible Q3-Q4 2026
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--accent)",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginBottom: 24,
                  }}
                >
                  {col.title}
                </div>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="block transition-colors duration-300"
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      padding: "8px 0",
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--text-secondary)")
                    }
                  >
                    {l.label}
                    {l.soon && (
                      <span
                        style={{
                          color: "var(--text-tertiary)",
                          fontSize: 10,
                          marginLeft: 4,
                        }}
                      >
                        ◆
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 32,
            color: "var(--text-tertiary)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.1em",
          }}
        >
          <div>© 2026 FABRIC SOFT MEXICO SA DE CV · Todos los derechos reservados</div>
          <div className="flex items-center gap-6">
            {/* Inline social repeat for bottom bar */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="transition-colors duration-300"
                  style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--text-tertiary)")
                  }
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <span>fabricsoft.com.mx</span>
          </div>
        </div>
      </div>
    </footer>
  );
}