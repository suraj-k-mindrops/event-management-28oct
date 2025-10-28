import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useVendors as useVendorsApi } from "@/hooks/useApiData";
import { LocalStorage, STORAGE_KEYS } from "@/lib/storage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Vendor } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function VendorManagement() {
  const navigate = useNavigate();
  const { data: vendors, add, update, remove, isLoading } = useVendorsApi();
  const { toast } = useToast();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    contact: "",
    email: "",
    category: "",
    address: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState({
    id: "",
    name: "",
    contact: "",
    email: "",
    category: "",
    address: "",
  });

  // One-time migration: if API has no vendors but local dummy data exists, seed them to backend
  useEffect(() => {
    if (isLoading) return;
    try {
      const seededFlagKey = "admin_eve_vendors_seeded_to_api";
      const alreadySeeded = LocalStorage.getItem<boolean>(seededFlagKey, false);
      if (alreadySeeded) return;
      if (!vendors || vendors.length > 0) return;
      const localVendors = LocalStorage.getItem<any[]>(STORAGE_KEYS.VENDORS, []);
      if (!Array.isArray(localVendors) || localVendors.length === 0) return;
      (async () => {
        for (const v of localVendors) {
          const payload = {
            name: v.name || "",
            contact: v.contact || "",
            email: v.email || "",
            category: v.category || "",
            address: v.address || "",
          };
          try { await add(payload as any); } catch (_) {}
        }
        LocalStorage.setItem(seededFlagKey, true);
      })();
    } catch (_) {}
  }, [isLoading, vendors, add]);

  const handleAdd = () => {
    if (!newVendor.name.trim()) return;
    add(newVendor);
    toast({
      title: "Success",
      description: "Vendor added successfully",
    });
    setNewVendor({
      name: "",
      contact: "",
      email: "",
      category: "",
      address: "",
    });
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    const vendor = vendors[(currentPage - 1) * itemsPerPage + idx];
    setEditValue({
      id: vendor.id.toString(),
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email,
      category: vendor.category,
      address: vendor.address,
    });
  };

  const handleEditSave = () => {
    update(parseInt(editValue.id), {
      name: editValue.name,
      contact: editValue.contact,
      email: editValue.email,
      category: editValue.category,
      address: editValue.address,
    });
    toast({
      title: "Success",
      description: "Vendor updated successfully",
    });
    setEditIndex(null);
    setEditValue({
      id: "",
      name: "",
      contact: "",
      email: "",
      category: "",
      address: "",
    });
  };

  const handleDelete = (idx: number) => {
    const vendor = vendors[(currentPage - 1) * itemsPerPage + idx];
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vendorToDelete) {
      remove(vendorToDelete.id);
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const paginatedVendors = vendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground">Manage vendors and suppliers</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Add Vendor
        </Button>
      </div>
      {showAddForm && (
        <div className="flex flex-col gap-2 mb-4">
          <Input
            placeholder="Name"
            value={newVendor.name}
            onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Contact"
            value={newVendor.contact}
            onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Email"
            value={newVendor.email}
            onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Category"
            value={newVendor.category}
            onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
            className="w-full"
          />
          <Input
            placeholder="Address"
            value={newVendor.address}
            onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
            className="w-full"
          />

          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                handleAdd();
                setShowAddForm(false);
              }}
            >
              Add
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setNewVendor({
                  name: "",
                  contact: "",
                  email: "",
                  category: "",
                  address: "",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-auto border rounded-md">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Contact</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Address</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No vendors yet.
                </td>
              </tr>
            )}
            {paginatedVendors.map((vendor, idx) => (
              <tr key={vendor.id} className="border-b hover:bg-muted/50 transition-colors">
                {editIndex === idx ? (
                  <>
                    <td className="p-3">
                      <Input
                        placeholder="Name"
                        value={editValue.name}
                        onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Contact"
                        value={editValue.contact}
                        onChange={(e) => setEditValue({ ...editValue, contact: e.target.value })}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Email"
                        value={editValue.email}
                        onChange={(e) => setEditValue({ ...editValue, email: e.target.value })}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Category"
                        value={editValue.category}
                        onChange={(e) => setEditValue({ ...editValue, category: e.target.value })}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Address"
                        value={editValue.address}
                        onChange={(e) => setEditValue({ ...editValue, address: e.target.value })}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" onClick={handleEditSave}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditIndex(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{vendor.name}</td>
                    <td className="p-3">{vendor.contact}</td>
                    <td className="p-3">{vendor.email}</td>
                    <td className="p-3">{vendor.category}</td>
                    <td className="p-3">{vendor.address}</td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(idx)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(idx)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Vendor"
        description={`Are you sure you want to delete "${vendorToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
