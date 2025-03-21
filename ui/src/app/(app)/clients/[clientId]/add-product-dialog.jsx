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
import { useProviders } from "@/hooks/useProviders";
import { useProducts } from "@/components/getStatiques/getAllProducts";
import { addProductToClient } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Loader2, Plus, Lock } from "lucide-react";

export default function AddClientProductDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    billing_cycle: "",
    price: "",
    type: "",
    website: "",
    provider: "",
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [providerInfo, setProviderInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, loading: isLoadingProducts } = useProducts();

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

  // Update provider information when provider data or selection changes
  useEffect(() => {
    const fetchProviderInfo = async () => {
      if (formData.provider && providers.length > 0) {
        // Try to find the provider in the providers array
        const provider = providers.find((p) => p._id === formData.provider);
        if (provider) {
          setProviderInfo(provider);
        }
      }
    };

    fetchProviderInfo();
  }, [formData.provider, providers]);

  // Optimisation: mémoriser les options du fournisseur
  const providerOptions = useMemo(() => {
    return providers.map((provider) => (
      <SelectItem key={provider._id} value={provider._id}>
        {provider.name}
      </SelectItem>
    ));
  }, [providers]);

  // Optimisation: mémoriser les options des produits
  const productOptions = useMemo(() => {
    return products.map((product) => (
      <SelectItem key={product._id} value={product._id}>
        {product.productName}
      </SelectItem>
    ));
  }, [products]);

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
    setSelectedProductId(null);
    setProviderInfo(null);
    onOpenChange(false);
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const selectedProduct = products.find((p) => p._id === productId);
    if (selectedProduct) {
      // Provider is an array in the product model
      let providerId = "";
      let provider = null;

      // Check if provider exists and is an array with at least one element
      if (
        selectedProduct.provider &&
        Array.isArray(selectedProduct.provider) &&
        selectedProduct.provider.length > 0
      ) {
        // Get the first provider (assuming we only need one)
        if (typeof selectedProduct.provider[0] === "object") {
          // If it's a populated object with properties
          provider = selectedProduct.provider[0];
          providerId = provider._id;
        } else {
          // If it's just the ID
          providerId = selectedProduct.provider[0];
        }
      }

      // Set provider info if we have a provider object
      if (provider) {
        setProviderInfo(provider);
      }

      setFormData({
        product_reference: selectedProduct.product_reference,
        productName: selectedProduct.productName,
        category: selectedProduct.category,
        billing_cycle: selectedProduct.billing_cycle,
        price: selectedProduct.price,
        type: selectedProduct.type,
        website: selectedProduct.website,
        provider: providerId,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation de base du formulaire
    if (!formData.productName.trim()) {
      toast.error("Le nom du produit est requis");
      setIsSubmitting(false);
      return;
    }

    if (!formData.provider) {
      toast.error("Please select a provider");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await addProductToClient(clientId, formData);

      if (result.success) {
        toast.success("Produit ajouté au client avec succès");
        // Dispatch custom event for product added to client
        const event = new CustomEvent("productAddedToClient", {
          detail: { clientId, product: result.data.product },
        });
        window.dispatchEvent(event);
        handleCancel();
      } else {
        toast.error(result.message || "Échec de l'ajout du produit au client");
      }
    } catch (error) {
      console.error("Error adding product to client:", error);
      toast.error(
        error.response?.data?.message || "Échec de l'ajout du produit au client"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">
              <Plus className="w-5 h-5" />
            </span>
            Add a product for {clientName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Select a product</Label>
            <Select
              onValueChange={handleProductSelect}
              disabled={isLoadingProducts}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingProducts
                      ? "Loading products..."
                      : "Select a product"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingProducts ? (
                  <SelectItem value="loading" disabled>
                    Loading products...
                  </SelectItem>
                ) : products.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No products available
                  </SelectItem>
                ) : (
                  productOptions
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                disabled
                required
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                disabled
                required
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select value={formData.billing_cycle} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Select a cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="biennial">Biennial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Type A">Type A</SelectItem>
                  <SelectItem value="Type B">Type B</SelectItem>
                  <SelectItem value="Type C">Type C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="provider" className="flex justify-between">
              <span>Provider</span>
            </Label>

            {formData.provider ? (
              <>
                <div className="relative rounded-md border border-input bg-gray-50 px-3 py-2 text-sm">
                  {providerInfo ? (
                    <div className="flex items-center">
                      <span className="font-medium text-muted-foreground">
                        {providerInfo.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-muted-foreground">
                        Loading provider...
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="provider"
                  value={formData.provider}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provider associated with the selected product
                </p>
              </>
            ) : (
              <div className="flex items-center bg-gray-50 rounded-md border border-input h-10 px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  Please select a product first
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedProductId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add to client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
