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
import { addProductToClient } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Loader2, Plus } from "lucide-react";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (value === "") return;
    setFormData({ ...formData, [field]: value });
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
      toast.error("Veuillez sélectionner un fournisseur");
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
            Ajouter un produit pour {clientName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Nom du produit</Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Ex: Hébergement Web Premium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Hébergement"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 299.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_cycle">Cycle de facturation</Label>
              <Select
                value={formData.billing_cycle}
                onValueChange={(value) =>
                  handleSelectChange(value, "billing_cycle")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="yearly">Annuel</SelectItem>
                  <SelectItem value="biennial">Bi-annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange(value, "type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
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
              <span>Fournisseur</span>
              {isLoadingProviders ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={fetchProviders}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Actualiser
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
                      ? "Chargement des fournisseurs..."
                      : "Sélectionner un fournisseur"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {providerError ? (
                  <SelectItem value="error" disabled>
                    Erreur de chargement des fournisseurs
                  </SelectItem>
                ) : providers.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Aucun fournisseur disponible
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
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Ex: https://example.com"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProviders}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout en
                  cours...
                </>
              ) : (
                "Ajouter au client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
