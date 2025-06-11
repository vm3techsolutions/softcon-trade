import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import ReduxProvider from "./ReduxProvider"; // ✅

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Softcon-Trade",
  description: "E-commerce app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
