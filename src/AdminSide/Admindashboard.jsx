import React from "react";
import "./Admindashboard.css";
import AdminLayout from "../components/AdminLayout";

// 1. IMPORT CHART LIBRARIES (REQUIRED)
import { 
    ChartContainer, 
    BarPlot, 
    ChartsXAxis, 
    ChartsYAxis 
} from '@mui/x-charts';

// 2. DEFINE THE BarLabel COMPONENT (REQUIRED)
// Note: This must be defined outside the main component function 
// if it doesn't need component state.
const BarLabel = ({ x, y, width, height, dataKey, value, index }) => (
  <text
    x={x + width / 2}
    y={y - 5}
    fontSize={12}
    fill="black"
    textAnchor="middle"
  >
    {value}
  </text>
);

function AdminDashboard() {
  // Define data using the months from your original JSX
  const data = [5, 17, 11, 20, 10, 25, 3];
  const xLabels = [
    'June 2025', 
    'July 2025', 
    'Aug. 2025', 
    'Sept. 2025', 
    'October 2025', 
    'Nov. 2025', 
    'Dec. 2025'
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="subtitle">Patient Summary</div>

      <div className="chart-card">
        {/* 3. PLACE THE CHART CODE HERE, REPLACING THE OLD DIVS */}
        <ChartContainer
          xAxis={[{ scaleType: 'band', data: xLabels }]}
          series={[{ type: 'bar', id: 'base', data: data }]}
          height={400}
          yAxis={[{ width: 30 }]}
          margin={{ left: 10, right: 10 }}
          slotProps={{
              bar: {
                  slots: { barLabel: BarLabel }, 
                  barLabel: 'value' 
              }
          }}
        >
          <BarPlot />
          <ChartsXAxis /> 
          <ChartsYAxis /> 
        </ChartContainer>
        {/* The old 'fake-chart' and 'x-labels' divs are now replaced by MUI components */}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;