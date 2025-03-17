"use client"
import {User, LockKeyhole} from 'lucide-react'
import '../../(Auth)/css/login.css'
import SignFromComponent from '@/components/formComponent/SignFromComponent'
import { object, string , ref} from 'yup';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const fields = [
    {name:'password', icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]' , placeholder: 'Entrer le mot de passe'},
    {name:'passwordConfirmation', icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Confirmez le mot de passe'}
];

const resetPasswordSchema = object({
    password: string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirmation: string()
      .oneOf([ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
});

const title = 'Réinitialisez votre mot de passe';
const subtitle = 'Entrez votre nouveau mot de passe';
const submitButton = 'Réinitialiser';
const linkText = 'Retour à la connexion';
const link = '/login';
const formType = 'reset-password';

export default function Reset() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            alert("Token de réinitialisation manquant. Veuillez réessayer.");
            window.location.href = '/forget';
        }
    }, [token]);

    const handleSubmit = async (form, setErrors) => {
        try {
            await resetPasswordSchema.validate(form, { abortEarly: false });
            setErrors({});

            const response = await axios.post(`${process.env.NEXT_PUBLIC_URLAPI}/auth/reset-password`, {
                resetToken: token,
                newPassword: form.password
            });

            if (response.data.message) {
                alert("Votre mot de passe a été réinitialisé avec succès.");
                window.location.href = '/login';
            }
        } catch (err) {
            const newErrors = {};
            if (err.response?.data?.message) {
                // Handle API error
                newErrors[formType] = err.response.data.message;
            } else if (err.inner) {
                // Handle validation errors
                err.inner.forEach((error) => {
                    if(!error.path) {
                        newErrors[formType] = error.message;
                    } else {
                        newErrors[error.path] = error.message;
                    }
                });
            } else {
                // Handle other errors
                newErrors[formType] = "Une erreur s'est produite. Veuillez réessayer.";
            }
            setErrors(newErrors);
        }
    };

    return (
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
                    schemaValidation={resetPasswordSchema}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}