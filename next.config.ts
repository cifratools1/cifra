import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que el navegador adivine el MIME type (previene ataques de sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla qué información se envía en la cabecera Referer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs del navegador que no necesitamos
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Impide que la web sea embebida en un iframe ajeno (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Aísla la ventana del navegador de popups maliciosos
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // ──────────────────────────────────────────────────────────────
  // CSP — DESACTIVADA hasta que AdSense esté integrado.
  // Cuando actives AdSense, descomenta y añade los dominios de Google:
  //   *.googlesyndication.com *.googletagmanager.com
  //   *.google.com *.gstatic.com pagead2.googlesyndication.com
  //   tpc.googlesyndication.com
  //
  // {
  //   key: "Content-Security-Policy",
  //   value: [
  //     "default-src 'self'",
  //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googlesyndication.com *.googletagmanager.com",
  //     "style-src 'self' 'unsafe-inline'",
  //     "img-src 'self' data: *.google.com *.gstatic.com",
  //     "frame-src *.googlesyndication.com",
  //     "connect-src 'self' *.google.com *.googlesyndication.com",
  //   ].join("; "),
  // },
  // ──────────────────────────────────────────────────────────────
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // Aplica las cabeceras a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
