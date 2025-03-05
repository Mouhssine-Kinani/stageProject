export default function AuthLayout({ children }) {
    console.log("AuthLayout applied");
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }