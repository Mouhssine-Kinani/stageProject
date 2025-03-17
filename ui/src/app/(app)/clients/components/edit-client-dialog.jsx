"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { toast } from "react-toastify";
import { Grid, ImagePlus } from "lucide-react";

export default function EditClientDialog({open, onOpenChange, onClientEdited, clientData}) {
  const { updateItem, validateFile, isLoading } = useCrud('clients');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    renewal_status: 'ok',
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        address: clientData.address || '',
        city: clientData.city || '',
        country: clientData.country || '',
        postalCode: clientData.postalCode || '',
        logo: null
      });
      
      // If client has a logo, set the preview
      if (clientData.logo) {
        setLogoPreview(clientData.logo);
      } else {
        setLogoPreview(null);
      }
    }
  }, [clientData]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use the validateFile function from useCrud
      const validation = validateFile(file, { 
        maxSize: 5 * 1024 * 1024, // 5MB
        type: "image" 
      });
      
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
      
      setFormData({...formData, logo: file});
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleChange(e){
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const clientFormData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          clientFormData.append(key, formData[key]);
        }
      });
      
      const result = await updateItem(clientData._id, clientFormData);
      
      if (result.success) {
        toast.success('Client updated successfully');
        onOpenChange(false);
        
        // Trigger refresh of client list
        const event = new CustomEvent('clientEdited');
        window.dispatchEvent(event);
        
        if (onClientEdited) {
          onClientEdited();
        }
      } else {
        toast.error(`Failed to update client: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Failed to update client: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">
              <Grid className="w-6 h-6" />
            </span>
            Edit Client
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="block mb-2">
                  Client Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="UTS Holding Of Africa"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+212661651425"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="block mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="block mb-2">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Rabat"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1">
              <div>
                <Label htmlFor="address" className="block mb-2">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Avenue annakhil, espace high tech hall b 5th floor hay riad"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="region" className="block mb-2">
                  Region
                </Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="Rabat-Sale-Kenitra"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="country" className="block mb-2">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Morocco"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="logo" className="block mb-2">
                Logo
              </Label>
              <div className="flex items-start">
                <div className="bg-gray-100 p-4 mr-4 rounded-md w-32 h-32 flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImagePlus className="w-10 h-10" />
                      <span className="text-sm mt-2">Upload Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 5MB. Supported formats: PNG, JPG, JPEG
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 