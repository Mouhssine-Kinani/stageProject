"use client" // creat a client component and move the state with to keep this one server side compo

import '../css/login.css';
import SignFromComponent from  '@/components/SignFromComponent'

export default function Reset() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="login-container max-w-[478px] max-h-[636px] px-10 py-14 space-y-14 rounded-lg border border-gray-500">
                <SignFromComponent/>
            </div>
        </div>
    );
}