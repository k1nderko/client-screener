import { useState, useRef, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { useSocket } from './hooks/useSocket';
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip);

function App() {
  const [prices, setPrices] = useState([]);
  const maxPoints = 100;
  const chartRef = useRef();

  const handlePriceUpdate = useCallback((data) => {
    if (!data?.price || isNaN(parseFloat(data.price))) return;

    setPrices((prev) => {
      const next = [...prev, { x: data.time, y: parseFloat(data.price) }];
      return next.length > maxPoints ? next.slice(-maxPoints) : next;
    });
  }, []);

  useSocket({
    pair: 'btcusdt',
    onPriceUpdate: handlePriceUpdate,
  });

  const data = {
    datasets: [
      {
        label: 'BTC/USDT Price',
        data: prices,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', paddingTop: 50 }}>
      <h1>BTC/USDT</h1>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

export default App;
