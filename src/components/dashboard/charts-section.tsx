import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from "recharts";
import { ChartData } from "@/types/lead";

interface ChartsSectionProps {
  chartData: ChartData;
}

const chartConfig = {
  source: {
    label: "Source",
  },
  status: {
    label: "Status", 
  },
  leads: {
    label: "Leads",
  },
};

export function ChartsSection({ chartData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 p-2 md:p-4">
      {/* Leads by Source - Pie Chart */}
      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Leads by Source</CardTitle>
        </CardHeader>
        <CardContent className="p-1 md:p-4">
          <ChartContainer config={chartConfig} className="h-48 lg:-ml-20 md:h-64">
            <PieChart>
              <Pie
                data={chartData.sourceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Leads by Status - Funnel/Bar Chart */}
      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Leads by Status</CardTitle>
        </CardHeader>
        <CardContent className="p-1 md:p-4">
          <ChartContainer config={chartConfig} className="h-48 lg:-ml-10 w-full md:h-64">
            <BarChart data={chartData.statusData} margin={{ top: 10, right: 15, left: 15, bottom: 30 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend - Line Chart */}
      <Card className="shadow-card hover:shadow-hover transition-shadow md:col-span-2 xl:col-span-1">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-1 md:p-4">
          <ChartContainer config={chartConfig} className="h-48 md:h-64">
            <LineChart data={chartData.monthlyData} margin={{ top: 10, right: 15, left: 15, bottom: 30 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="hsl(var(--chart-primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-primary))", strokeWidth: 2 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}