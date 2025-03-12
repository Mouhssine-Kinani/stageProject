"use client"
import {User} from 'lucide-react'
import '../../(Auth)/css/login.css'
import SignFromComponent from '@/components/formComponent/SignFromComponent'
import { object, string } from 'yup';
import axios from 'axios';

const fields = [
    {name:'email', icon: User, type: 'email', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Entrer votre email'}
];

const forgotPasswordSchema = object({
    email: string().email("Invalid email format").required("Email is required"),
});

const title = 'Mot de passe oublié';
const subtitle = 'Entrez votre email pour recevoir un lien de réinitialisation';
const submitButton = 'Envoyer';
const linkText = 'Retour à la connexion';
const link = '/login';
const formType = 'reset-password';


const handleSubmit = async (form, setErrors)=>{
    try{
        await forgotPasswordSchema.validate(form, { abortEarly: false }); 
        setErrors({});
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URLAPI}/auth/forgot-password`, form);
        
        if (response.data.message) {
            // Show success message
            alert("Un email de réinitialisation a été envoyé à votre adresse email.");
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    }
    catch (err) {
        const newErrors = {};
        if (err.response?.data?.message) {
            // Handle API error - show at form level
            newErrors[formType] = err.response.data.message;
        } else if (err.inner) {
            // Handle validation errors
            err.inner.forEach((error) => {
                if(!error.path){
                    newErrors[formType] = error.message;
                }
                else{
                    newErrors[error.path] = error.message;
                }
            });
        } else {
            // Handle network or other errors
            newErrors[formType] = "Une erreur s'est produite lors de l'envoi de l'email. Veuillez réessayer.";
        }
        setErrors(newErrors);
    }
}

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
                    formType={formType}
                    schemaValidation={forgotPasswordSchema}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}