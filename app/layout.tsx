import type { Metadata, Viewport } from "next";
import { Playfair_Display, Dancing_Script, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "For My Rinu 💕",
  description: "A special place created with all my heart, just for you.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "For Rinu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf2f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dancing.variable} ${poppins.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
