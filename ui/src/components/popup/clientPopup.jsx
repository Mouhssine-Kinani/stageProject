import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {SquarePen, Image} from 'lucide-react'
import { useState } from "react"

import axios from 'axios'
import { object, string } from 'yup';

export function DialogDemo({buttonTitle}) {
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})

    const handleChange = (e)=> {
        setForm({...form, [e.target.id]: e.target.value})
        setErrors({...errors, [e.target.id]: ''})
    }

    async function handleSubmitAddUser(e){
        e.preventDefault()
        
    }
    const handleSubmit = async (form, setErrors)=>{
        try{
            await loginSchema.validate(form, { abortEarly: false }); 
            setErrors({});
            const response = axios.post(`${process.env.NEXT_PUBLIC_URLAPI}/auth/signin`, form)
            console.log(response)
        }
        catch (err) {
            const newErrors = {};
            err.inner.forEach((error) => {
                // by field name
                if(!error.path){
                    newErrors[formType] = error.message;
                }
                else{
                    newErrors[error.path] = error.message;
                }
            });
            setErrors(newErrors);
        }
    }
    

    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">

              Add a client
            </Button>
          </DialogTrigger>
          <DialogOverlay className="bg-black/0.1" />
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"> <SquarePen size={22} strokeWidth={1.75} className="inline-block"/> Add User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitAddUser}>
            <div className="flex flex-col md:flex-row gap-6 py-4">
              {/* Left side - First div */}
              <div className="flex-1 space-y-6">
                {/* Client name and phone number in parallel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client name</Label>
                    <Input id="clientName" placeholder="UTS Holding Of Africa" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input type={"number"} id="phoneNumber" placeholder="+212661651425" />
                  </div>
                </div>
                
                {/* Address takes full width */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Avenue annakhil, espace high tech hall b 5th floor hay riad" />
                </div>
                
                {/* Logo section */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded border">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg> */}
                      <Image size={30}  />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <Button variant="outline" className="w-40">Choose a file</Button>
                      <p className="text-xs text-gray-500">Please choose a square image, less than 100Kb</p>
                      <p className="text-sm text-gray-600">No file</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Second div */}
              <div className="flex-1 space-y-6">
                {/* Email and city in parallel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contact@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Rabat" />
                  </div>
                </div>
                
                {/* Region and country in parallel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input id="region" placeholder="Rabat-Salé-Kentira" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Morocco" />
                  </div>
                </div>
                
                {/* Empty space to push buttons to bottom */}
                {/* <div className="flex-grow"></div> */}
              </div>
            </div>
            
            {/* Footer buttons aligned to bottom right */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="px-6">Cancel</Button>
              <Button className="bg-black text-white hover:bg-gray-800 px-6">Save</Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>
      );
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">{buttonTitle}</Button>
//       </DialogTrigger>
//       <DialogOverlay className="bg-black/0.1" />
//       <DialogContent className="sm:max-w-[425px] bg-opacity-90 bg-background">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2"> <SquarePen size={22} strokeWidth={1.75} className="inline-block"/> Add User</DialogTitle>
//           {/* <DialogDescription>
//             Make changes to your profile here. Click save when you're done.
//           </DialogDescription> */}
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <Input id="name" value="Pedro Duarte" className="col-span-3" />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="username" className="text-right">
//               Username
//             </Label>
//             <Input id="username" value="@peduarte" className="col-span-3" />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
}
