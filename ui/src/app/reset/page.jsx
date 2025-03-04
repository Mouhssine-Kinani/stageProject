"use client"
import {User, LockKeyhole} from 'lucide-react'
import '../css/login.css';
import SignFromComponent from '@/components/SignFromComponent'

const fields = [
    {icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]' , placeholder: 'Entrer le mot de passe'},
    {icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Confirmez le mot de passe'}
];

const title = 'Réinitialisez votre mot de passe';
const subtitle = 'Entrez votre email pour réinitialiser votre mot de passe';
const submitButton = 'Réinitialiser';
const linkText = 'Retour à la connexion';
const link = '/login';

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
                />
            </div>
        </div>
    );
}