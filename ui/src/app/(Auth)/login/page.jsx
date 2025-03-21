"use client";
import { User, LockKeyhole } from "lucide-react";
import "../../(Auth)/css/login.css";
import SignFromComponent from "@/components/formComponent/SignFromComponent";
import axios from "axios";
import { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;
// Ensure credentials are sent with every request
axios.defaults.withCredentials = true;

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

  const handleSubmit = async (values) => {
    setProcessing(true);
    setErrors({});

    try {
      console.log("[Login] Tentative de connexion", values);

      // Get the returnUrl from query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = searchParams.get("returnUrl") || "/home";
      console.log(`[Login] URL de retour après connexion: ${returnUrl}`);

      // Utiliser Axios avec withCredentials pour s'assurer que les cookies sont correctement traités
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URLAPI}/auth/signin`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );

      if (!response.data || response.status !== 200) {
        console.error("[Login] Échec de connexion:", response.data);
        setErrors({ login: "Login error. Please try again." });
        setProcessing(false);
        return;
      }

      const data = response.data;
      console.log("[Login] Connexion réussie:", data);
      console.log("[Login] Données utilisateur:", data.user);

      // Définir manuellement les cookies en respectant SameSite pour cross-origin
      const isProduction = process.env.NODE_ENV === "production";
      const sameSite = isProduction ? "None" : "Lax";
      const secure = isProduction ? "; Secure" : "";

      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=${sameSite}${secure}`;
      document.cookie = `userId=${data.user._id}; path=/; max-age=604800; SameSite=${sameSite}${secure}`;

      // Stocker les données utilisateur dans localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));
      console.log(
        "[Login] Données utilisateur stockées dans localStorage:",
        data.user
      );

      console.log("[Login] Cookies définis:", document.cookie);
      console.log(`[Login] Redirection vers: ${returnUrl}`);

      // Ajouter un petit délai pour s'assurer que les cookies sont bien définis
      setTimeout(() => {
        router.push(returnUrl);
      }, 100);
    } catch (error) {
      console.error("[Login] Erreur inattendue:", error);
      if (error.response?.data?.message) {
        // Si l'erreur vient du serveur avec un message spécifique
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
