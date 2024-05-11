import type { Metadata } from "next";
import "./globals.css";
import { Vazirmatn } from "next/font/google";
import NavBar from "./dashboard/files/NavBar";

//const inter = Inter({ subsets: ["latin"] });
//const lemonad = Lemonada({subsets:["arabic"]});
const vazirmatn = Vazirmatn({subsets:["arabic"],weight:"400"});

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
    <html lang="ar">
      <body className={vazirmatn.className} >
        {children}
      </body>
    </html>
  );
}