export default function AuthLayout({ children }) {
    console.log("AuthLayout applied");
    return (
      <div className="auth-layout">
        {children}
      </div>
    );
  }