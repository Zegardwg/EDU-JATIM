"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieLabelRenderProps,
} from "recharts";

interface Sekolah {
  bentuk: string;
  status: string;
}

interface QuickChartsProps {
  data: Sekolah[];
}

interface PieDataItem {
  name: string;
  value: number;
  percentage: string;
  [key: string]: string | number;
}

interface BarDataItem {
  jenis: string;
  jumlah: number;
}

export default function QuickCharts({ data }: QuickChartsProps) {
  const computeChartData = () => {
    if (data.length === 0) {
      return { pie: [] as PieDataItem[], bar: [] as BarDataItem[] };
    }

    // Process data for pie chart
    const bentukCount: Record<string, number> = {};
    data.forEach((item) => {
      const bentuk = item.bentuk || "Lainnya";
      bentukCount[bentuk] = (bentukCount[bentuk] || 0) + 1;
    });

    // Get top 6 categories, group the rest as "Lainnya"
    const sortedEntries = Object.entries(bentukCount).sort(
      (a, b) => b[1] - a[1]
    );

    let pieChartData: Array<{ name: string; value: number }>;
    if (sortedEntries.length > 6) {
      const top5 = sortedEntries.slice(0, 5);
      const othersCount = sortedEntries
        .slice(5)
        .reduce((sum, [, count]) => sum + count, 0);
      pieChartData = [...top5.map(([name, value]) => ({ name, value }))];
      if (othersCount > 0) {
        pieChartData.push({ name: "Lainnya", value: othersCount });
      }
    } else {
      pieChartData = sortedEntries.map(([name, value]) => ({ name, value }));
    }

    // Calculate percentages
    const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
    const pieDataWithPercentage = pieChartData.map((item) => ({
      ...item,
      percentage: ((item.value / total) * 100).toFixed(1),
    }));

    // Process data for bar chart (status distribution)
    const statusCount: Record<string, number> = {};
    data.forEach((item) => {
      const status = item.status === "N" ? "Negeri" : "Swasta";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const barChartData = Object.entries(statusCount)
      .map(([jenis, jumlah]) => ({ jenis, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    return { pie: pieDataWithPercentage, bar: barChartData };
  };

  const chartData = computeChartData();

  const PIE_COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
    "#a4de6c",
  ];
  const BAR_COLORS = ["#3b82f6", "#10b981"];

  const isLoading = data.length === 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse">
          <div className="h-full bg-gray-200 rounded"></div>
        </div>
        <div className="h-48 animate-pulse">
          <div className="h-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Custom label function for pie chart
  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { name } = props;
    const percentage =
      chartData.pie.find((item) => item.name === name)?.percentage || "0";
    if (!name) return "";
    return `${name}: ${percentage}%`;
  };

  // Custom tooltip formatter for pie chart
  const pieTooltipFormatter = (
    value: number | undefined,
    name: string | undefined,
    props: { payload?: PieDataItem }
  ) => {
    const percentage = props.payload?.percentage || "0";
    const displayValue = value ?? 0;
    return [
      `${displayValue} sekolah (${percentage}%)`,
      props.payload?.name || name || "",
    ];
  };

  // Custom tooltip formatter for bar chart
  const barTooltipFormatter = (value: number | undefined) => {
    const displayValue = value ?? 0;
    return [`${displayValue} sekolah`, "Jumlah"];
  };

  return (
    <div className="space-y-8">
      {/* Pie Chart with Data Table */}
      <div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.pie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {chartData.pie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={pieTooltipFormatter} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table for Pie Chart */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-gray-600 font-medium">
                  Jenis Sekolah
                </th>
                <th className="py-2 text-left text-gray-600 font-medium">
                  Jumlah
                </th>
                <th className="py-2 text-left text-gray-600 font-medium">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.pie.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={
                          {
                            backgroundColor:
                              PIE_COLORS[index % PIE_COLORS.length],
                          } as React.CSSProperties
                        }
                      />
                      {item.name}
                    </div>
                  </td>
                  <td className="py-2">{item.value.toLocaleString("id-ID")}</td>
                  <td className="py-2 font-medium">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h4 className="text-lg font-medium text-gray-700 mb-4">
          Distribusi Status Sekolah
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.bar}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="jenis" />
              <YAxis />
              <Tooltip formatter={barTooltipFormatter} />
              <Legend />
              <Bar
                dataKey="jumlah"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Jumlah Sekolah">
                {chartData.bar.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
