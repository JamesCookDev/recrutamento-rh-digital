import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PositionForm } from './PositionForm';
import { PositionFormData } from '@/schemas/recruitment';
import { RecruitmentPosition } from '@/types/recruitment';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit } from 'lucide-react';

interface PositionFormDialogProps {
  mode: 'create' | 'edit';
  initialData?: Partial<RecruitmentPosition>;
  trigger?: React.ReactNode;
  onSuccess?: (data: PositionFormData) => void;
}

export function PositionFormDialog({ mode, initialData, trigger, onSuccess }: PositionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: PositionFormData) => {
    setIsLoading(true);
    
    try {
      // Simular salvamento - aqui você integraria com Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: mode === 'create' ? 'Vaga criada com sucesso!' : 'Vaga atualizada com sucesso!',
        description: `A vaga "${data.jobTitle}" foi ${mode === 'create' ? 'criada' : 'atualizada'} com sucesso.`,
      });
      
      onSuccess?.(data);
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar vaga',
        description: 'Ocorreu um erro ao tentar salvar a vaga. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const defaultTrigger = (
    <Button className="gap-2">
      {mode === 'create' ? (
        <>
          <Plus className="h-4 w-4" />
          Nova Vaga
        </>
      ) : (
        <>
          <Edit className="h-4 w-4" />
          Editar Vaga
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Nova Vaga' : 'Editar Vaga'}
          </DialogTitle>
        </DialogHeader>
        <PositionForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}