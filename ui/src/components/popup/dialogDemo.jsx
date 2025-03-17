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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { object, string } from 'yup';

// Define Yup validation schema
const userSchema = object({
  fullName: string()
    .required('Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be less than 50 characters'),
  
  email: string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10-15 digits')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  
  status: string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending'], 'Invalid status'),
  
  roleName: string()
    .required('Role is required')
    .oneOf(['User', 'Admin', 'Super Admin'], 'Invalid role')
});

export function DialogDemo({buttonTitle}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: '',
    roleName: '',
    logo: null
  });
  
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear the error for this field when user types
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };
  
  const handleSelectChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear the error for this field when user selects
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select an image file' }));
        return;
      }
      
      // Check file size (100KB = 102400 bytes)
      if (file.size > 102400) {
        setErrors(prev => ({ ...prev, logo: 'Image must be less than 100KB' }));
        return;
      }
      
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, logo: file }));
      setErrors(prev => ({ ...prev, logo: undefined }));
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Validate form data using Yup
      await userSchema.validate(formData, { abortEarly: false });
      
      const submitData = {...formData, 
        role: {roleName: formData.roleName}
      }
      // Remove the `roleName` property
      delete submitData.roleName
      // If validation passes, you can proceed with form submission
      // console.log('Form submitted successfully:', submitData);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URLAPI}/users/create`, submitData)
      console.log(response)
      
      // Reset form and close dialog
      // resetForm();
      // closeDialog();
      
    } catch (error) {
      // Handle validation errors
      if(error.inner){
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
      // Handle server errors
      else if (axios.isAxiosError(error)) {
        console.log("Axios error:", error);
        
        // Get the error message from the response if it exists
        let errorMessage = "Server error";
        if (error.response || error.response.data) {
          // The server responded with a status code outside of 2xx
          errorMessage = error.response.data.message || 
                        "Server returned error: " + error.response.status;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response received from server";
        } else {
          // Something happened in setting up the request
          errorMessage = error.message || "Error in request setup";
        }
        
        setErrors((prev) => ({...prev, submit: errorMessage}));
        }else {
        // Unknown error
        setErrors((prev) => ({ ...prev, submit: "Error" }));
      }
      
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          Add a user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"> <SquarePen size={22} strokeWidth={1.75} className="inline-block"/> Add User</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 py-4">
          {/* Left side - First div */}
          <div className="flex-1 space-y-6">
            {/* Full name and phone in parallel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input 
                  id="phone" 
                  placeholder="212 661651425" 
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
            
            {/* Status dropdown takes full width using grid */}
            <div className="grid grid-cols-1 w-full">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, 'status')}
                  value={formData.status}
                >
                  <SelectTrigger id="status" className={errors.status ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-500">{errors.status}</p>
                )}
              </div>
            </div>
            
            {/* Logo section */}
            <div className="space-y-2">
              <Label htmlFor="logo">Profile picture</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded-full border">
                  {selectedFile ? (
                    <img 
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    // <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    //   <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    //   <circle cx="12" cy="7" r="4"></circle>
                    // </svg>
                    <Image size={30}  />
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  <label htmlFor="logoInput">
                    <Button variant="outline" className="w-40" type="button" onClick={() => document.getElementById('logoInput').click()}>
                      Choose a file
                    </Button>
                    <input
                      type="file"
                      id="logoInput"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Please choose a square image, less than 100Kb</p>
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "No file"}
                  </p>
                  {errors.logo && (
                    <p className="text-xs text-red-500">{errors.logo}</p>
                  )}
                  {errors.submit && (
                    // <p className="text-xs text-red-500">{errors.submit}</p>
                    <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <p className="text-sm font-medium">{errors.submit}</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Second div */}
          <div className="flex-1 space-y-6">
            {/* Email takes full width */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Role dropdown takes full width using grid */}
            <div className="grid grid-cols-1 w-full">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, 'roleName')}
                  value={formData.roleName}
                >
                  <SelectTrigger id="roleName" className={errors.roleName ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roleName && (
                  <p className="text-xs text-red-500">{errors.roleName}</p>
                )}
              </div>
            </div>
            
            {/* Empty space to push buttons to bottom */}
            <div className="flex-grow"></div>
          </div>
        </div>
        
        {/* Footer buttons aligned to bottom right */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" className="px-6">Cancel</Button>
          <Button 
            className="bg-black text-white hover:bg-gray-800 px-6" 
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}