"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/useCrud";
import { toast } from "react-toastify";
import { PlusCircle, Grid, ImagePlus } from "lucide-react";

export default function AddClientDialog({ open, onOpenChange, onClientAdded }) {
  const { createItem, validateFile, isLoading } = useCrud("clients");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    logo: null,
    renewal_status: "ok",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'écran est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      renewal_status: "ok",
      logo: null,
    });
    setLogoPreview(null);
    onOpenChange(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use the validateFile function from useCrud
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        type: "image",
      });

      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      setFormData({ ...formData, logo: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSelectChange = (value, field) => {
    if (value === "") return; // Ne pas autoriser les valeurs vides
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const clientFormData = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          clientFormData.append(key, formData[key]);
        }
      });

      const result = await createItem(clientFormData);

      if (result.success) {
        toast.success("Client added successfully");
        handleCancel();

        // Trigger refresh of client list
        const event = new CustomEvent("clientAdded");
        window.dispatchEvent(event);

        if (onClientAdded) {
          onClientAdded();
        }
      } else {
        toast.error(`Failed to add client: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Failed to add client: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">
              <Grid className="w-6 h-6" />
            </span>
            Add Client
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-6 responsive-form-grid`}
            >
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

            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-6 responsive-form-grid`}
            >
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

            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-6 responsive-form-grid`}
            >
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
              <div>
                <Label htmlFor="renewal_status" className="block mb-2">
                  Renewal Status
                </Label>
                <Select
                  id="renewal_status"
                  name="renewal_status"
                  value={formData.renewal_status}
                  onValueChange={(value) =>
                    handleSelectChange(value, "renewal_status")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ok">OK</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Expiring">Expiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-6 responsive-form-grid`}
            >
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
              <div
                className={`${
                  isMobile ? "flex flex-col gap-4" : "flex items-start"
                }`}
              >
                <div
                  className={`bg-gray-100 p-4 ${
                    isMobile ? "" : "mr-4"
                  } rounded-md ${
                    isMobile ? "w-full max-h-[150px]" : "w-32 h-32"
                  } flex items-center justify-center`}
                >
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
                <div className="flex-1 w-full">
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
          <DialogFooter className={`${isMobile ? "flex-col gap-2" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={isMobile ? "w-full" : ""}
            >
              {isLoading ? "Adding..." : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
