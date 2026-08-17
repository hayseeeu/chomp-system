import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHOMP",
  description:
    "A pomodoro timer for people who find starting harder than concentrating.",
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // "dark" here is only the no-JS/pre-hydration fallback — next-themes'
    // blocking script overwrites it before paint. suppressHydrationWarning
    // is required because that script mutates this element outside React.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark h-full",
        archivo.variable,
        archivoBlack.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="chomp:theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
