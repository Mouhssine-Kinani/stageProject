"use client"
import {User, LockKeyhole} from 'lucide-react'
import '../css/login.css';
import SignFromComponent from '@/components/SignFromComponent'

const fields = [
    {icon: User, type: 'email', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Entrer votre email'},
    {icon: LockKeyhole, type: 'password', iconClass: 'user-icon', inputClass: 'w-full px-10 py-2 rounded-md bg-[#EFF1F999]', placeholder: 'Entrer le mot de passe'}
];

const title = 'Bienvenue à vous !';
const subtitle = 'Connectez-vous à votre compte';
const submitButton = 'Connexion';
const linkText = 'Mot de pass oublié ?';
const link = '/forget';


export default function Login() {
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

// "use client" // creat a client component and move the state with to keep this one server side compo

// import { usePathname } from "next/navigation";
// import '../app/css/login.css';
// import Link from 'next/link';
// import {LockKeyhole} from 'lucide-react'
// import {User} from 'lucide-react'
// import {Eye} from 'lucide-react'
// import {EyeOff} from 'lucide-react'
// import { useState } from 'react';


// export default function SignFromComponent({title, subtitle, fields}){

//     function handleVisible(){
//         setPasswordVisible(!passwordVisible)
//     }
//     return (
//     <>
//         {/* <div className='bg-black w-[300px] h-[65px] mb-[20px]'></div> */}
//         <div className='leading-loose'>
//             <h1 className="text-1xl font-medium text-center">{title}</h1>
//             <h1 className="text-sm font-bold text-center">{subtitle}</h1>
//         </div>
//         <form className="space-y-4">
//             <div className='input-container flex items-center'>
//                 <User size={22} strokeWidth={1.75} className='user-icon' />
//                 <input type="email" className="w-full px-10 py-2 rounded-md bg-[#EFF1F999]" />
//             </div>
//             {pathname === '/login' &&
//             <>
//                 <div className='input-container flex items-center'>
//                     <LockKeyhole size={22} strokeWidth={1.75} className='lock-icon'/>
//                     <input type={passwordVisible ? "text" : "password"} className="password-input w-full px-10 py-2 mt-1 rounded-md bg-[#EFF1F999]" />
//                     {passwordVisible === true ? <Eye strokeWidth={1.75} size={18} className='eye-icon cursor-pointer' onClick={handleVisible}/>
//                     : <EyeOff strokeWidth={1.75} size={18} className='eye-icon cursor-pointer' onClick={handleVisible}/>}
//                 </div>
//                 <div className='text-right'>
//                     <Link href="/forget" className='text-[#5570F1]'>Mot de pass oublié ?</Link>
//                 </div>
//             </>
//             }
//             <div className='flex justify-center'>
//                 <button className="w-32 py-2 mt-4 text-white rounded-md bg-black">Connexion</button>
//             </div>
//         </form>
//     </>
//     )
// }