import { EntityForm } from "./EntityForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, FormField } from "@/types";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSubmit: (formData: any) => Promise<void>;
  fields: FormField[];
}

export function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
  onSubmit,
  fields,
}: ProductFormDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>
        <EntityForm
          fields={fields}
          initialValues={editingProduct || undefined}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          columns={3}
          gap="md"
        />
      </DialogContent>
    </Dialog>
  );
}
