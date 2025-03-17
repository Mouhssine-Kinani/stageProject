"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProductDialog from "./components/add-product-dialog";
import EditProductDialog from "./components/edit-product-dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URLAPI}/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
    // Listen for product added/edited events
    window.addEventListener('productAdded', fetchProducts);
    window.addEventListener('productEdited', fetchProducts);
    return () => {
      window.removeEventListener('productAdded', fetchProducts);
      window.removeEventListener('productEdited', fetchProducts);
    };
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/products/delete/${productId}`
        );
        if (response.status === 200) {
          toast.success("Product deleted successfully");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Product</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.billing_cycle}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.provider?.name}</TableCell>
              <TableCell>
                <a
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {product.website}
                </a>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddDialogOpen && (
        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      )}

      {isEditDialogOpen && selectedProduct && (
        <EditProductDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          productData={selectedProduct}
        />
      )}
    </div>
  );
}
