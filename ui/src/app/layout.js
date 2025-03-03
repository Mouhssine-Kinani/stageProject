'use client'
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="grid-areas-layout">
        {/* Sidebar */}
        <aside className="bg-gray-800 text-white p-4 area-sidebar">
          Sidebar
        </aside>

        {/* Header */}
        <header className="bg-blue-500 text-white p-4 area-header">
          Header
          <div
            class="d-none d-sm-block"
          >
            Some Word
          </div>
          
        </header>

        {/* Content */}
        <main className="bg-gray-500 p-4 area-content">
          {children}
          <div className="">
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            lorem lorem           lorem lorem 
            <br/>
            <br/>
            <br/>
          </div>
        </main>
      </body>
    </html>
  );
}


