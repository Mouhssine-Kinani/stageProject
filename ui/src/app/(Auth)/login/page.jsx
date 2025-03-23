"use client";
import { User, LockKeyhole } from "lucide-react";
import "../../(Auth)/css/login.css";
import SignFromComponent from "@/components/formComponent/SignFromComponent";
import { useState, useEffect } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login, checkAuth } from "@/lib/api";

const fields = [
  {
    name: "email",
    icon: User,
    type: "email",
    iconClass: "user-icon",
    inputClass: "w-full px-10 py-2 rounded-md bg-[#EFF1F999]",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    icon: LockKeyhole,
    type: "password",
    iconClass: "user-icon",
    inputClass: "w-full px-10 py-2 rounded-md bg-[#EFF1F999]",
    placeholder: "Enter your password",
  },
];

const loginSchema = object({
  email: string().email("Invalid email format").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const title = "Welcome!";
const subtitle = "Login to your account";
const submitButton = "Login";
const linkText = "Forgot password?";
const link = "/forget";
const formType = "login";

export default function Login() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    // Utiliser l'API d'authentification pour vérifier si l'utilisateur est déjà connecté
    const checkAuthentication = async () => {
      try {
        const { isAuthenticated } = await checkAuth();

        if (isAuthenticated) {
          const returnUrl =
            new URLSearchParams(window.location.search).get("returnUrl") ||
            "/home";
          console.log(
            `[Login] User already logged in, redirecting to: ${returnUrl}`
          );
          router.push(returnUrl);
        }
      } catch (error) {
        console.error("[Login] Error checking authentication:", error);
        // En cas d'erreur, on reste sur la page de connexion
      }
    };

    checkAuthentication();
  }, [router]);

  const handleSubmit = async (values) => {
    setProcessing(true);
    setErrors({});

    try {
      console.log("[Login] Login attempt with:", values.email);

      // Get the returnUrl from query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = searchParams.get("returnUrl") || "/home";
      console.log(`[Login] Return URL after login: ${returnUrl}`);

      // Appeler le service d'authentification
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (!result.success) {
        console.error("[Login] Login failed:", result.message);
        setErrors({
          login: result.message || "Login error. Please try again.",
        });
        setProcessing(false);
        return;
      }

      toast.success("Login successful");

      // Force reload before redirect to ensure session is recognized
      setTimeout(() => {
        // Use window.location for a full page refresh
        window.location.href = returnUrl;
      }, 1000);
    } catch (error) {
      console.error("[Login] Unexpected error:", error);
      if (error.response?.data?.message) {
        // If the error comes from the server with a specific message
        if (error.response.data.message.includes("email")) {
          setErrors({ email: "Incorrect email or password" });
        } else if (error.response.data.message.includes("password")) {
          setErrors({ password: "Incorrect email or password" });
        } else {
          setErrors({ login: error.response.data.message });
        }
      } else {
        setErrors({
          login: "An error occurred. Please try again later.",
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="loginContainerBg">
      <div className="flex items-center justify-center min-h-screen">
        <div className="login-container max-w-[478px] max-h-[636px] px-10 py-14 space-y-14 rounded-lg border border-gray-500">
          <SignFromComponent
            title={title}
            subtitle={subtitle}
            fields={fields}
            submitButton={submitButton}
            linkText={linkText}
            link={link}
            formType={formType}
            handleSubmit={handleSubmit}
            parentErrors={errors}
          />
        </div>
      </div>
    </div>
  );
}
