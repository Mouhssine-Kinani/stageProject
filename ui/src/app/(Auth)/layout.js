export default function AuthLayout({ children }) {
    console.log("AuthLayout applied");
    return (
        <div className="test">{children}</div>
    );
  }