"use client"
import {User} from 'lucide-react'
import '../css/login.css';
import SignFromComponent from '@/components/SignFromComponent'

const fields = [
    {icon: User, type: 'email', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Entrer votre email'}
];

const title = 'Mot de passe oublié';
const subtitle = 'Entrez votre email pour recevoir un lien de réinitialisation';
const submitButton = 'Envoyer';
const linkText = 'Retour à la connexion';
const link = '/login';

export default function Forget() {
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