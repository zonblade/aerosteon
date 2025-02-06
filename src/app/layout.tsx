import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const airbeat = localFont({
  src: "./Airbeat-EaW0j.ttf",
  variable: "--font-airbeat"
});

const fanta = localFont({
  src: "./Fanta-Regular.otf",
  variable: "--font-fanta"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${airbeat.variable} ${fanta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}