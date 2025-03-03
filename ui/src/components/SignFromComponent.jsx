"use client" // creat a client component and move the state with to keep this one server side compo

import '../css/login.css';
import Link from 'next/link';
import Image from 'next/image';
import LockIcon from '../../../public/iconLight/Lock.svg';
import Visible from '../../../public/iconLight/Visible.svg';
import userIcon from '../../../public/iconLight/user-solid.svg';
import eye from '../../../public/iconLight/eye-regular.svg';
import { useState } from 'react';


export default function SignFromComponent(){
    const [passwordVisible, setPasswordVisible] = useState(false)

    function handleVisible(){
        setPasswordVisible(!passwordVisible)
    }
    return (
    <>
        <div className='leading-loose'>
            <h1 className="text-1xl font-medium text-center">Bienvenue à vous</h1>
            <h1 className="text-sm font-bold text-center">connectez-vous à votre compte</h1>
        </div>
        <form className="space-y-4">
            <div className='input-container flex items-center'>
                <Image src={userIcon} alt='user icon' className='user-icon' />
                <input type="email" className="w-full px-10 py-2 rounded-md bg-[#EFF1F999]" />
            </div>
            <div className='input-container flex items-center'>
                <Image src={LockIcon} alt='lock icon' className='lock-icon' />
                <input type={passwordVisible ? "text" : "password"} className="password-input w-full px-10 py-2 mt-1 rounded-md bg-[#EFF1F999]" />
                {passwordVisible === true ? <Image src={eye} alt='eye icon' className='eye-icon cursor-pointer' onClick={handleVisible} />
                : <Image src={Visible} alt='unvisible icon' className='unvisible-icon cursor-pointer' onClick={handleVisible} />}
            </div>
            <div className='text-right'>
                <Link href="/forget" className='text-[#5570F1]'>Mot de pass oublié ?</Link>
            </div>
            <div className='flex justify-center'>
                <button className="w-32 py-2 mt-4 text-white rounded-md bg-black">Connexion</button>
            </div>
        </form>
    </>
    )
}