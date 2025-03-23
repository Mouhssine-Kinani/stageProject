import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { object, string } from "yup";
import { useCrud } from "@/hooks/useCrud";
import ProfilePreview from "../../dashboard/components/profile-preview";

// Yup validation schema
const userSchema = object({
  fullName: string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters"),

  email: string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),

  phone: string()
    .matches(/^\d{10,15}$/, "Phone number must be between 10-15 digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),

  status: string()
    .required("Status is required")
    .oneOf(["active", "inactive", "pending"], "Invalid status"),

  roleName: string()
    .required("Role is required")
    .oneOf(["User", "Admin", "Super Admin"], "Invalid role"),
});

export default function EditUserDialog({ open, onOpenChange, userData }) {
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    status: "",
    roleName: "",
    logo: null,
  });

  const { updateItem, validateFile } = useCrud("users");

  // Load user data when the dialog opens or userData changes
  useEffect(() => {
    if (userData && open) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        status: userData.status || "active",
        roleName: userData.role?.roleName || "User",
        logo: userData.logo || null,
      });
    }
  }, [userData, open]);

  const handleCancel = () => {
    onOpenChange(false);
    setErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file, { maxSize: 1024000 }); // Max size 1MB
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, logo: validation.error }));
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, logo: file }));
      setErrors((prev) => ({ ...prev, logo: undefined }));
    }
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when field is changed
    if (errors[e.target.id]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: undefined }));
    }
  }

  const handleSelectChange = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await userSchema.validate(formData, { abortEarly: false });

      let result;

      // Si nous avons un logo, utilisons FormData
      if (selectedFile) {
        const submitData = new FormData();

        // Ajouter les champs de base
        submitData.append("fullName", formData.fullName);
        submitData.append("email", formData.email);
        submitData.append("phone", formData.phone);
        submitData.append("status", formData.status);

        // Ajouter l'objet role comme JSON string
        const roleObj = {
          roleName: formData.roleName,
          description: `${formData.roleName} role`,
        };
        submitData.append("role", JSON.stringify(roleObj));

        // Ajouter le logo explicitement avec son nom de fichier
        submitData.append("logo", selectedFile, selectedFile.name);

        console.log(
          "Updating user with FormData (includes new logo):",
          userData._id
        );
        result = await updateItem(userData._id, submitData);
      } else {
        // Sans logo, utilisez un objet JSON simple
        const updateData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          role: {
            roleName: formData.roleName,
            description: `${formData.roleName} role`,
          },
        };

        console.log("Updating user with JSON data:", userData._id);
        result = await updateItem(userData._id, updateData);
      }

      if (result.success) {
        // Dispatch event for user edited with updated data
        const event = new CustomEvent("userEdited", {
          detail: {
            ...result.data,
            logo: selectedFile ? result.data?.data?.logo : userData.logo,
          },
        });
        window.dispatchEvent(event);

        // Close the dialog
        handleCancel();
      } else {
        console.error("Update failed:", result.message);
        setErrors((prev) => ({ ...prev, submit: result.message }));
      }
    } catch (error) {
      console.error("Validation error:", error);
      if (error.inner) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors((prev) => ({ ...prev, submit: error.message }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 py-4">
            {/* Left column - Main form fields */}
            <div className="flex-1 space-y-6">
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

              <div className="grid grid-cols-1 w-full">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "status")
                    }
                    value={formData.status}
                  >
                    <SelectTrigger
                      id="status"
                      className={
                        errors.status ? "border-red-500 w-full" : "w-full"
                      }
                    >
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
            </div>

            {/* Right column - Email and role */}
            <div className="flex-1 space-y-6">
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

              <div className="grid grid-cols-1 w-full">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "roleName")
                    }
                    value={formData.roleName}
                  >
                    <SelectTrigger
                      id="roleName"
                      className={
                        errors.roleName ? "border-red-500 w-full" : "w-full"
                      }
                    >
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
            </div>
          </div>

          {/* Profile picture section */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="logo">Profile picture</Label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <ProfilePreview
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : formData.logo
                    ? `${process.env.NEXT_PUBLIC_URLAPI}/${formData.logo}`
                    : null
                }
                alt={formData.fullName || "Profile"}
                size={96}
              />

              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={errors.logo ? "border-red-500" : ""}
                />
                {errors.logo && (
                  <p className="text-xs text-red-500 mt-1">{errors.logo}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a profile picture (max 1MB)
                </p>
              </div>
            </div>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 rounded">
              {errors.submit}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
