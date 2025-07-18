import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FilterOptions, RecruitmentPosition } from '@/types/recruitment';
import { Filter, X, Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PositionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function PositionFilters({ 
  filters, 
  onFiltersChange, 
  searchTerm, 
  onSearchChange 
}: PositionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions: Array<{ value: RecruitmentPosition['status'], label: string }> = [
    { value: 'open', label: 'Aberta' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Finalizada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const recruitmentTypeOptions: Array<{ value: RecruitmentPosition['recruitmentType'], label: string }> = [
    { value: 'external', label: 'Externo' },
    { value: 'internal', label: 'Interno' }
  ];

  const positionLevelOptions: Array<{ value: RecruitmentPosition['positionLevel'], label: string }> = [
    { value: 'strategic', label: 'Estratégico' },
    { value: 'tactical', label: 'Tático' },
    { value: 'operational', label: 'Operacional' }
  ];

  const departmentOptions = [
    'Recursos Humanos',
    'Tecnologia da Informação',
    'Comercial',
    'Financeiro',
    'Operacional',
    'Marketing',
    'Jurídico'
  ];

  const hasActiveFilters = 
    filters.status.length > 0 ||
    filters.recruitmentType.length > 0 ||
    filters.positionLevel.length > 0 ||
    filters.departments.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const activeFiltersCount = 
    filters.status.length +
    filters.recruitmentType.length +
    filters.positionLevel.length +
    filters.departments.length +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      departments: [],
      status: [],
      recruitmentType: [],
      positionLevel: [],
      dateRange: {}
    });
  };

  const toggleArrayFilter = <T extends string>(
    key: keyof FilterOptions,
    value: T,
    currentArray: T[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onFiltersChange({
      ...filters,
      [key]: newArray
    });
  };

  return (
    <div className="space-y-4">
      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cargo, código da vaga, departamento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filtros de Busca</SheetTitle>
                <SheetDescription>
                  Use os filtros abaixo para refinar sua busca
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.status.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayFilter('status', option.value, filters.status)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tipo de Recrutamento */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tipo de Recrutamento</Label>
                  <div className="flex flex-wrap gap-2">
                    {recruitmentTypeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.recruitmentType.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayFilter('recruitmentType', option.value, filters.recruitmentType)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Nível da Posição */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Nível da Posição</Label>
                  <div className="flex flex-wrap gap-2">
                    {positionLevelOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.positionLevel.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayFilter('positionLevel', option.value, filters.positionLevel)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Departamentos */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Departamentos</Label>
                  <div className="flex flex-wrap gap-2">
                    {departmentOptions.map((dept) => (
                      <Button
                        key={dept}
                        variant={filters.departments.includes(dept) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayFilter('departments', dept, filters.departments)}
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Data de Abertura */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Período de Abertura</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateRange.start && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.start ? (
                            format(filters.dateRange.start, "dd/MM/yyyy")
                          ) : (
                            "Data início"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.start}
                          onSelect={(date) => onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, start: date }
                          })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !filters.dateRange.end && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.end ? (
                            format(filters.dateRange.end, "dd/MM/yyyy")
                          ) : (
                            "Data fim"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.end}
                          onSelect={(date) => onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, end: date }
                          })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map(status => (
            <Badge key={status} variant="secondary" className="gap-1">
              {statusOptions.find(s => s.value === status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('status', status, filters.status)}
              />
            </Badge>
          ))}
          {filters.recruitmentType.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              {recruitmentTypeOptions.find(t => t.value === type)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('recruitmentType', type, filters.recruitmentType)}
              />
            </Badge>
          ))}
          {filters.positionLevel.map(level => (
            <Badge key={level} variant="secondary" className="gap-1">
              {positionLevelOptions.find(l => l.value === level)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('positionLevel', level, filters.positionLevel)}
              />
            </Badge>
          ))}
          {filters.departments.map(dept => (
            <Badge key={dept} variant="secondary" className="gap-1">
              {dept}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleArrayFilter('departments', dept, filters.departments)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}