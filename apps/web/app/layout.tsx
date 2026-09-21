import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareFlow Queue — Staff Dashboard",
  description:
    "Hospital queue management dashboard for staff — live queue, patient history, analytics, and QR signage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
