"use client"
import {User, LockKeyhole} from 'lucide-react'
import '../css/login.css';
import SignFromComponent from '@/components/SignFromComponent'
import { object, string } from 'yup';

const fields = [
    {name:'password', icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]' , placeholder: 'Entrer le mot de passe'},
    {name:'passwordConfirmation', icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Confirmez le mot de passe'}
];

const resetPasswordSchema = object({
    password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: string()
      .oneOf([ref("password"), null], "Passwords do not match")
      .required("Confirm password is required"),
  });
  

const title = 'Réinitialisez votre mot de passe';
const subtitle = 'Entrez votre email pour réinitialiser votre mot de passe';
const submitButton = 'Réinitialiser';
const linkText = 'Retour à la connexion';
const link = '/login';
const formType = 'reset-password';

export default function Reset() {
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
                />
            </div>
        </div>
    );
}