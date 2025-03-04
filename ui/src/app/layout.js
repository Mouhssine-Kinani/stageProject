'use client'
import "./globals.css";
import Header from "@/components/header/Header";
import SideBar from "@/components/sidebar/SideBar";
import Content from "@/components/content/dashbord";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="grid-areas-layout">
        {/* Sidebar */}
        <SideBar/>

        {/* Header */}
          <Header/>

        {/* Content */}
        <Content/>
       
      </body>
    </html>
  );
}


