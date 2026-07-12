import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { FooterLayout } from "@/components/common/layout/footer";
import { HeaderLayout } from "@/components/common/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "CinePremium",
    template: "%s | CinePremium",
  },
  description: "Đặt vé xem phim trực tuyến tại CinePremium",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderLayout />
          <div className="flex-1">{children}</div>
          <FooterLayout />
        </ThemeProvider>
      </body>
    </html>
  );
}
