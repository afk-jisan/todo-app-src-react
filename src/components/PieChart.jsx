import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChartComponent = ({ completed, unfinished }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Finished Tasks', 'Unfinished Tasks'],
          datasets: [{
            label: 'Total',
            data: [completed, unfinished],
            backgroundColor: ['#28a745','#ff584d'],
            borderWidth: 1
          }]
        },
      });
    }

    
  });

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};



export default PieChartComponent;
