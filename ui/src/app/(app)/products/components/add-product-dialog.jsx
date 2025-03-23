"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useCrud } from "@/hooks/useCrud";
import { useProviders } from "@/hooks/useProviders";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function AddProductDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    billing_cycle: "",
    price: "",
    type: "",
    website: "",
    provider: "",
  });

  const { createItem } = useCrud("products");
  const {
    providers,
    isLoading: isLoadingProviders,
    error: providerError,
    fetchProviders,
  } = useProviders();

  // Charger les fournisseurs quand le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open, fetchProviders]);

  // Optimisation: mémoriser les options du fournisseur
  const providerOptions = useMemo(() => {
    return providers.map((provider) => (
      <SelectItem key={provider._id} value={provider._id}>
        {provider.name}
      </SelectItem>
    ));
  }, [providers]);

  const handleCancel = () => {
    setFormData({
      productName: "",
      category: "",
      billing_cycle: "",
      price: "",
      type: "",
      website: "",
      provider: "",
    });
    onOpenChange(false);
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSelectChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de base du formulaire
    if (!formData.productName.trim()) {
      toast.error("Le nom du produit est requis");
      return;
    }

    if (!formData.provider || formData.provider === "0") {
      toast.error("Please select a provider");
      return;
    }

    try {
      const result = await createItem(formData);

      if (result.success) {
        toast.success("Produit ajouté avec succès");
        // Dispatch custom event for product added
        const event = new CustomEvent("productAdded", {
          detail: result.data,
        });
        window.dispatchEvent(event);
        handleCancel();
      } else {
        toast.error(result.error || "Échec de l'ajout du produit");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error.response?.data?.message || "Échec de l'ajout du produit"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="billing_cycle">Billing Cycle</Label>
            <Select
              value={formData.billing_cycle}
              onValueChange={(value) =>
                handleSelectChange(value, "billing_cycle")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="biennial">Biennial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange(value, "type")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Type A">Type A</SelectItem>
                <SelectItem value="Type B">Type B</SelectItem>
                <SelectItem value="Type C">Type C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider" className="flex justify-between">
              <span>Provider</span>
              {isLoadingProviders ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={fetchProviders}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Refresh
                </button>
              )}
            </Label>

            <Select
              value={formData.provider}
              onValueChange={(value) => handleSelectChange(value, "provider")}
              disabled={isLoadingProviders}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingProviders
                      ? "Loading providers..."
                      : "Select provider"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {providerError ? (
                  <SelectItem value="error" disabled>
                    Error loading providers
                  </SelectItem>
                ) : providers.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No providers available
                  </SelectItem>
                ) : (
                  providerOptions
                )}
              </SelectContent>
            </Select>

            {providerError && (
              <p className="text-red-500 text-xs mt-1">{providerError}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
