import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BaseDialog({ 
  open, 
  onOpenChange, 
  title, 
  children, 
  icon: Icon,
  onCancel,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  width = "sm:max-w-[800px]",
  triggerButton
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className={width}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon size={22} strokeWidth={1.75} className="inline-block"/>} 
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}

        {/* Footer buttons aligned to bottom right */}
        <DialogFooter>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" className="px-6" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            className="bg-black text-white hover:bg-gray-800 px-6" 
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 