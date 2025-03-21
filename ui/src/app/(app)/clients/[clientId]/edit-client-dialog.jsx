"use client";
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
import { updateClient } from "@/lib/api";
import { toast } from "react-toastify";

export default function EditClientDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);

  // État initial vide pour éviter les erreurs
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    client_reference: "",
    contacts: "",
    description: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Mettre à jour formData et logoPreview quand client change
  useEffect(() => {
    if (client) {
      console.log("Updating form data with client:", client);

      // Mettre à jour les données du formulaire
      setFormData({
        name: client.name || "",
        address: client.address || "",
        client_reference: client.client_reference || "",
        contacts: client.contacts || "",
        description: client.description || "",
      });

      // Mettre à jour l'aperçu du logo
      if (client.logo) {
        const logoPath = client.logo.replace(/\\/g, "/");
        setLogoPreview(`${process.env.NEXT_PUBLIC_URLAPI}/${logoPath}`);
      } else {
        setLogoPreview(null);
      }
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Créer un aperçu de l'image
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérification que client et client._id existent
      if (!client || !client._id) {
        console.error("Client or client ID is undefined", { client });
        toast.error("Informations du client manquantes. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }

      console.log("Soumission du formulaire avec les données:", formData);
      console.log("ID du client:", client._id);

      // Créer un FormData si un fichier logo est sélectionné
      if (logoFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("logo", logoFile);

        // Ajouter les autres champs du formulaire
        Object.keys(formData).forEach((key) => {
          formDataWithFile.append(key, formData[key]);
        });

        console.log("Envoi avec fichier FormData");
        await updateClient(client._id, formDataWithFile);
      } else {
        // Sinon, envoyer simplement les données JSON
        console.log("Envoi sans fichier, données JSON");
        await updateClient(client._id, formData);
      }

      toast.success(
        "Les informations du client ont été mises à jour avec succès."
      );

      // Fermer le dialogue et rafraîchir les données
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      console.error("Détails:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la mise à jour du client."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations du client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client_reference" className="text-right">
                Référence
              </Label>
              <Input
                id="client_reference"
                name="client_reference"
                value={formData.client_reference}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contacts" className="text-right">
                Contacts
              </Label>
              <Input
                id="contacts"
                name="contacts"
                value={formData.contacts}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo
              </Label>
              <div className="col-span-3">
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={client.logo}
                      alt="Aperçu du logo"
                      className="max-h-20 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
