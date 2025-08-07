import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface VaultChartProps {
  totalAmount: number;
  reserve: number;
  hold: number;
  title?: string;
}

export const VaultChart: React.FC<VaultChartProps> = ({ 
  totalAmount, 
  reserve, 
  hold, 
  title = "Account balance" 
}) => {
  const available = Math.max(0, totalAmount - reserve - hold);
  
  const data = {
    labels: ['Available', 'Reserve', 'Hold'],
    datasets: [
      {
        data: [available, reserve, hold],
        backgroundColor: [
          '#00B5AE', // Teal for Available
          '#1B4A7B', // Dark blue for Reserve
          '#B49D47', // Gold for Hold
        ],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Désactive la légende par défaut
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: number; dataset: { data: number[] } }) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{
      background: '#fbfbfd',
      borderRadius: 8,
      padding: 24,
      width: '100%',
      maxWidth: 350,
      minHeight: 260,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
        ${totalAmount.toLocaleString()}
      </div>
      <div style={{ color: '#595959', fontSize: 14, marginBottom: 16 }}>
        {title}
      </div>
      <div style={{ width: 240, height: 240, position: 'relative' }}>
        <Doughnut data={data} options={options} />
        {/* Texte au centre du graphique */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#0d1728' }}>
            ${available.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#595959' }}>
            Available to lend
          </div>
        </div>
      </div>
      {/* Légende personnalisée alignée */}
      <div style={{ 
        marginTop: 16, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8,
        width: '100%',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
          <div style={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            backgroundColor: '#00B5AE' 
          }} />
          <span style={{ fontSize: 12, color: '#595959' }}>
            Available: ${available.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
          <div style={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            backgroundColor: '#1B4A7B' 
          }} />
          <span style={{ fontSize: 12, color: '#595959' }}>
            Reserve: ${reserve.toLocaleString()}
          </span>
        </div>
        {hold > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: '#B49D47' 
            }} />
            <span style={{ fontSize: 12, color: '#595959' }}>
              Hold: ${hold.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultChart; 