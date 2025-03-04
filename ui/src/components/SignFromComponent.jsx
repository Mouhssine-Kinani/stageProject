"use client" // creat a client component and move the state with to keep this one server side compo


import '../app/css/login.css';
import Link from 'next/link';

import {Eye, EyeOff} from 'lucide-react'
import { useState } from 'react';

// import axios from 'axios'

export default function SignFromComponent({
    title,
    subtitle,
    fields,
    submitButton,
    linkText,
    link,
    handleSubmit,
    formType

  }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const handleChange = (e, fieldName)=> {
        setForm({...form, [fieldName]: e.target.value})
        setErrors({...errors, [fieldName]: ''})
    }


    function handleVisible(){
        setPasswordVisible(!passwordVisible)
    }
    function submitFct(e){
        e.preventDefault()
        handleSubmit(form, setErrors)
    }
    return (
        <>
          <div className="leading-loose">
            <h1 className="text-1xl font-medium text-center">{title}</h1>
            <h1 className="text-sm font-bold text-center">{subtitle}</h1>
          </div>
          <form className="space-y-4" onSubmit={submitFct}>
            {fields.map((field, index) => (
              <div key={index} className="input-container flex flex-col">
                <div className="flex items-center">
                  {field.icon && (
                    <field.icon size={22} strokeWidth={1.75} className={field.iconClass} />
                  )}
                  <input
                    type={
                      field.type === "email" ||
                      (field.type === "password" &&
                        field.placeholder === "Entrer le mot de passe" &&
                        passwordVisible)
                        ? "text"
                        : "password"
                    }
                    className={field.inputClass}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, field.name)}
                  />
                  {field.type === "password" &&
                    field.placeholder === "Entrer le mot de passe" && (
                      <span className="eye-icon cursor-pointer" onClick={handleVisible}>
                        {passwordVisible ? (
                          <Eye strokeWidth={1.75} size={18} />
                        ) : (
                          <EyeOff strokeWidth={1.75} size={18} />
                        )}
                      </span>
                    )}
                </div>
                {errors[field.name] && (
                  <div className="text-red-500 text-sm">{errors[field.name]}</div>
                )}
              </div>
            ))}
            {errors[formType] && <div className="text-red-500 text-center">{errors.login}</div>}
            <div className="text-right">
              <Link href={link} className="text-[#5570F1]">
                {linkText}
              </Link>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="w-32 py-2 mt-4 text-white rounded-md bg-black">
                {submitButton}
              </button>
            </div>
          </form>
        </>
      );
}