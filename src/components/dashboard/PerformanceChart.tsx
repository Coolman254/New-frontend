import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", average: 65, target: 70 },
  { month: "Feb", average: 68, target: 70 },
  { month: "Mar", average: 72, target: 70 },
  { month: "Apr", average: 70, target: 70 },
  { month: "May", average: 75, target: 70 },
  { month: "Jun", average: 78, target: 70 },
  { month: "Jul", average: 74, target: 70 },
  { month: "Aug", average: 80, target: 70 },
];

export function PerformanceChart() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-lg">
          School Performance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="average"
                stroke="hsl(38, 92%, 50%)"
                fill="url(#colorAvg)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Average Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">Target (70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
