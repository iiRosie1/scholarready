import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScholarReady — prepare with clarity",
  description: "A calmer workspace for discovering and preparing scholarship applications.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
