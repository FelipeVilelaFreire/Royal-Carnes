import React from "react";
import { AppearOnScrollRuntime } from "../runtime/AppearOnScrollRuntime";

export const metadata = {
  title: "Royal Carnes | Assinaturas, Box e Delivery para churrasco",
  description: "Produtos para churrasco, assinaturas fechadas, Royal Box mensal personalizada e Royal Delivery avulso.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('royal_prime_theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', mode);
                } catch (e) {}
              })();
            `
          }}
        />
        <style>{`
          html, body {
            background-color: var(--theme--color-background) !important;
            color: var(--theme--color-text) !important;
            transition:
              background-color var(--theme--motion-durationMd) var(--theme--motion-easingStandard),
              color var(--theme--motion-durationMd) var(--theme--motion-easingStandard);
          }
          body {
            font-family: var(--theme--typography-bodyFamily);
            margin: 0;
            padding: 0;
          }
          .appear-on-scroll {
            opacity: 1;
            transform: translateY(0);
          }
          body.appear-runtime-ready .appear-on-scroll {
            opacity: 0;
            transform: translateY(var(--theme--spacing-spaceXl));
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          body.appear-runtime-ready .appear-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </head>
      <body>
        <AppearOnScrollRuntime />
        {children}
      </body>
    </html>
  );
}
