"use client";
import { User, LockKeyhole } from "lucide-react";
import "../../(Auth)/css/login.css";
import SignFromComponent from "@/components/formComponent/SignFromComponent";
import axios from "axios";
import { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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

  const handleSubmit = async (form, setErrors) => {
    try {
      await loginSchema.validate(form, { abortEarly: false });
      setErrors({});

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URLAPI}/auth/signin`,
        form,
        {
          withCredentials: true, // ✅ Obligatoire pour envoyer et recevoir les cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data);

      // Vérifier si les cookies ont été définis correctement
      const tokenCookie = document.cookie.includes("token=");
      const userIdCookie = document.cookie.includes("userId=");

      console.log("Token cookie set:", tokenCookie);
      console.log("UserId cookie set:", userIdCookie);

      // Si les cookies ne sont pas définis via HTTP, on les définit manuellement
      // (Solution de secours pour la production)
      if (!tokenCookie && response.data.data.token) {
        Cookies.set("token", response.data.data.token, {
          path: "/",
          secure: window.location.protocol === "https:",
          sameSite: "Lax",
          // Utiliser le domaine correct en production
          ...(process.env.NODE_ENV === "production" && {
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
          }),
        });
      }

      if (!userIdCookie && response.data.data.user._id) {
        Cookies.set("userId", response.data.data.user._id, {
          path: "/",
          secure: window.location.protocol === "https:",
          sameSite: "Lax",
          // Utiliser le domaine correct en production
          ...(process.env.NODE_ENV === "production" && {
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
          }),
        });
      }

      // Store user in localStorage if needed
      if (response.data.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      router.push("/home");
    } catch (err) {
      const newErrors = {};
      if (err.name === "AxiosError") {
        newErrors[formType] =
          err.response?.data?.message || "Login failed. Please try again.";
      } else {
        err.inner?.forEach((error) => {
          if (!error.path) {
            newErrors[formType] = error.message;
          } else {
            newErrors[error.path] = error.message;
          }
        });
      }
      setErrors(newErrors);
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
