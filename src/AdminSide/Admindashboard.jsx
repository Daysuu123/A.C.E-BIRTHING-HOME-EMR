import React from "react";
import "./Admindashboard.css";
import AdminLayout from "../components/AdminLayout";

import { 
    ChartContainer, 
    BarPlot, 
    ChartsXAxis, 
    ChartsYAxis,
    PieChart,
    BarChart 
} from '@mui/x-charts';


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



const dataset = [
  {
    month: 'Jan',
    seoul: 21,
  },
  {
    month: 'Feb',
    seoul: 23,
  },
  {
    month: 'Mar',
    seoul: 26,
  },
  {
    month: 'Apr',
    seoul: 30,
  },
  {
    month: 'May',
    seoul: 28,
  },
];

const valueFormatter = (value) => `${value}mm`;

const chartSetting = {
  xAxis: [{ label: 'Check-ups' }],
  width: 400,
  height: 300,
};


function AdminDashboard() {

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


  const pieChartData = [
    { id: 0, value: 10, label: 'Prenatal Checkup' },
    { id: 1, value: 15, label: 'General Checkup' },
    { id: 2, value: 20, label: 'Postnatal Checkup' },
  ];
  


  return (
    <AdminLayout title="Dashboard">
      
      {/* 💡 2. Main dashboard container remains the same */}
      <div className="dashboard-grid-container">

        {/* --- TOP ROW (2 COLUMNS) --- */}
        {/* 💡 This is the NEW BAR GRAPH 2 - Seoul Rainfall */}
        <div className="chart-card top-chart-small">
          <div className="subtitle">Appoint for the Past Couple of Months (Horizontal)</div>
          
          {/* 💡 REPLACED BAR CHART 2 CODE */}
          <BarChart
            dataset={dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'seoul', label: 'Checkups', valueFormatter }]}
            layout="horizontal"
            {...chartSetting}
          />
        </div>

        {/* This is the PIE GRAPH - Appointment Types */}
        <div className="chart-card top-chart-small">
          <div className="subtitle">Pie Graph: Appointment Types</div>
          <PieChart
            series={[
              {
                data: pieChartData,
                paddingAngle: 5, 
                innerRadius: 30, 
                outerRadius: 80, 
                arcLabel: (item) => item.value,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -3, color: 'gray' },
              },
            ]}
            width={400} 
            height={200}
            slotProps={{
              legend: { hidden: false, position: { vertical: 'bottom', horizontal: 'middle' } },
            }}
          />
        </div>

        {/* --- BOTTOM ROW (1 FULL-WIDTH COLUMN) --- */}
        {/* This is BAR GRAPH 1 - Monthly Patient Summary */}
        <div className="chart-card bottom-chart-full">
          <div className="subtitle">Bar Graph 1: Monthly Patient Summary</div>
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
        </div>

      </div> {/* End dashboard-grid-container */}
    </AdminLayout>
  );
}

export default AdminDashboard;