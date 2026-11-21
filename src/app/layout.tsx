import { pageMetadata } from "@/lib/seo";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsultationProvider from "@/components/ConsultationProvider";
import ConsultationPersistence from "@/components/ConsultationPersistence";
import { catalogEntries, catalogEntryHref, catalogProductSlugs } from "@/data/catalogEntries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = pageMetadata('/');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ConsultationProvider products={catalogProductSlugs.map((id) => ({ id, name: catalogEntries[id].title, path: catalogEntryHref(id) }))}>
        <Header />
        <ConsultationPersistence />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        </ConsultationProvider>
      </body>
    </html>
  );
}
