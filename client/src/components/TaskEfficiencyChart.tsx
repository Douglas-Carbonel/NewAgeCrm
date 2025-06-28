import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskEfficiencyChartProps {
  data: Array<{
    week: string;
    completed: number;
    created: number;
    efficiency: number;
  }>;
}

export function TaskEfficiencyChart({ data }: TaskEfficiencyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eficiência das Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'efficiency' ? `${value}%` : value,
                  name === 'completed' ? 'Concluídas' : 
                  name === 'created' ? 'Criadas' : 'Eficiência'
                ]}
              />
              <Bar dataKey="completed" fill="#10b981" name="Concluídas" />
              <Bar dataKey="created" fill="#3b82f6" name="Criadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}