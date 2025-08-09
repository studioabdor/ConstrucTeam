import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, GlassmorphismProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConstrucTeam - Connect. Create. Construct.",
  description: "A modern consultant-client matchmaking platform for the real estate and construction industry in India. Connect with verified architects, engineers, and specialized consultants.",
  keywords: ["construction", "architecture", "engineering", "consultant", "real estate", "India"],
  authors: [{ name: "ConstrucTeam Team" }],
  creator: "ConstrucTeam",
  openGraph: {
    title: "ConstrucTeam - Connect. Create. Construct.",
    description: "A modern consultant-client matchmaking platform for the real estate and construction industry in India.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConstrucTeam - Connect. Create. Construct.",
    description: "A modern consultant-client matchmaking platform for the real estate and construction industry in India.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlassmorphismProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </GlassmorphismProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
