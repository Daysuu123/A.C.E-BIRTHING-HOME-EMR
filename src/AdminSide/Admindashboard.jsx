import React, { useState, useEffect } from "react";
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
  const [monthlyPatients, setMonthlyPatients] = useState([]);
  const [monthlyCheckups, setMonthlyCheckups] = useState([]);
  const [checkupTypes, setCheckupTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch monthly patients
        const patientsResponse = await fetch('http://localhost:8000/api/dashboard/monthly-patients');
        const patientsData = await patientsResponse.json();
        if (patientsData.success) {
          setMonthlyPatients(patientsData.data);
        }

        // Fetch monthly checkups
        const checkupsResponse = await fetch('http://localhost:8000/api/dashboard/monthly-checkups');
        const checkupsData = await checkupsResponse.json();
        if (checkupsData.success) {
          setMonthlyCheckups(checkupsData.data);
        }

        // Fetch checkup types
        const typesResponse = await fetch('http://localhost:8000/api/dashboard/checkup-types');
        const typesData = await typesResponse.json();
        if (typesData.success) {
          setCheckupTypes(typesData.data);
        }

      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for the monthly patients bar chart
  const patientsData = monthlyPatients.map(item => item.patients);
  const patientsLabels = monthlyPatients.map(item => item.month);

  // Prepare data for the monthly checkups horizontal bar chart
  const checkupsData = monthlyCheckups.map(item => item.checkups);
  const checkupsLabels = monthlyCheckups.map(item => item.month);
  


  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="dashboard-grid-container">
          <div className="loading-container">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="dashboard-grid-container">
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      
      {/* 💡 2. Main dashboard container remains the same */}
      <div className="dashboard-grid-container">

        {/* --- TOP ROW (2 COLUMNS) --- */}
        {/* Monthly Checkups Horizontal Bar Chart */}
        <div className="chart-card top-chart-small">
          <div className="subtitle">Monthly Checkups</div>
          
          <BarChart
            dataset={monthlyCheckups}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'checkups', label: 'Checkups', valueFormatter: (value) => `${value}` }]}
            layout="horizontal"
            {...chartSetting}
          />
        </div>

        {/* Checkup Types Pie Chart */}
        <div className="chart-card top-chart-small">
          <div className="subtitle">Checkup Types Distribution</div>
          <PieChart
            series={[
              {
                data: checkupTypes,
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
        {/* Monthly Patient Registrations Bar Chart */}
        <div className="chart-card bottom-chart-full">
          <div className="subtitle">Monthly Patient Registrations</div>
          <ChartContainer
            xAxis={[{ scaleType: 'band', data: patientsLabels }]}
            series={[{ type: 'bar', id: 'base', data: patientsData }]}
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