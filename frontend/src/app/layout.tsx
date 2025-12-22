import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes'
import "@/styles/globals.css";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

const font = "Arial, Helvetica, sans-serif";

export const metadata: Metadata = {
  title: "Swap Spot",
  description: "A second-hand e-commerce platform",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grid grid-rows-[auto_1fr_auto] min-h-screen" style={{ fontFamily: font }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="row-start-2 flex flex-col sm:flex-row gap-[32px] items-start w-full flex-1 min-h-0">
            <aside className="flex-shrink-0 sticky top-23 z-40 w-full sm:w-1/4">
              <SideBar />
            </aside>
            <div className="flex-1 min-h-0 overflow-auto w-full sm:w-3/4">
              {children}
            </div>
          </main>
          <footer className="row-start-3">
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
