"use client";
import { User, LockKeyhole } from "lucide-react";
import "../../(Auth)/css/login.css";
import SignFromComponent from "@/components/formComponent/SignFromComponent";
import axios from "axios";
import { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
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
    placeholder: "Entrer votre email",
  },
  {
    name: "password",
    icon: LockKeyhole,
    type: "password",
    iconClass: "user-icon",
    inputClass: "w-full px-10 py-2 rounded-md bg-[#EFF1F999]",
    placeholder: "Entrer le mot de passe",
  },
];

const loginSchema = object({
  email: string().email("Invalid email format").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const title = "Bienvenue à vous !";
const subtitle = "Connectez-vous à votre compte";
const submitButton = "Connexion";
const linkText = "Mot de pass oublié ?";
const link = "/forget";
const formType = "login";

export default function Login() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (values) => {
    setProcessing(true);
    setErrors(null);

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
        setErrors("Erreur de connexion. Veuillez réessayer.");
        setProcessing(false);
        return;
      }

      const data = response.data;
      console.log("[Login] Connexion réussie:", data);

      // Définir manuellement les cookies pour s'assurer qu'ils sont présents
      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `userId=${data.user._id}; path=/; max-age=604800; SameSite=Lax`;

      // Stocker les données utilisateur dans localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));

      console.log("[Login] Cookies définis:", document.cookie);
      console.log(`[Login] Redirection vers: ${returnUrl}`);

      // Ajouter un petit délai pour s'assurer que les cookies sont bien définis
      setTimeout(() => {
        router.push(returnUrl);
      }, 100);
    } catch (error) {
      console.error("[Login] Erreur inattendue:", error);
      setErrors("Une erreur s'est produite. Veuillez réessayer plus tard.");
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
          />
        </div>
      </div>
    </div>
  );
}
