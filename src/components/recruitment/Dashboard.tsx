import { MetricCard } from './MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '@/types/recruitment';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Timer,
  TrendingUp 
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface DashboardProps {
  metrics: DashboardMetrics;
}

export function Dashboard({ metrics }: DashboardProps) {
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total de Vagas"
          value={metrics.totalPositions}
          icon={ClipboardList}
          description="Últimos 12 meses"
        />
        
        <MetricCard
          title="Vagas Ativas"
          value={metrics.activePositions}
          icon={Users}
          variant="warning"
          description="Em andamento"
        />
        
        <MetricCard
          title="Finalizadas"
          value={metrics.completedPositions}
          icon={CheckCircle}
          variant="success"
          description="Últimos 12 meses"
        />
        
        <MetricCard
          title="Tempo Médio R&S"
          value={`${metrics.avgRecruitmentTime} dias`}
          icon={Clock}
          description="Recrutamento completo"
        />
        
        <MetricCard
          title="Tempo Médio DP"
          value={`${metrics.avgHRTime} dias`}
          icon={Timer}
          description="Processamento RH"
        />
        
        <MetricCard
          title="Taxa de Conversão"
          value={`${metrics.conversionRate}%`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 5.2, isPositive: true }}
          description="Eficiência geral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vagas por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vagas por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.positionsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Status das Vagas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.positionsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {metrics.positionsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de Vagas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Timeline de Vagas - Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="opened" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                name="Abertas"
                dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="closed" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                name="Fechadas"
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}