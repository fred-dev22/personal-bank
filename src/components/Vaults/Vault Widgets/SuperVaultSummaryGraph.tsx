import React, { useEffect, useRef } from 'react';
import './SuperVaultSummaryGraph.css';

interface SuperVaultSummaryGraphProps {
  futureCashValues: number[];
  futureLoanAmounts: number[];
  futureEquities: number[];
  withTooltip: boolean;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export const SuperVaultSummaryGraph: React.FC<SuperVaultSummaryGraphProps> = ({
  futureCashValues,
  futureLoanAmounts,
  futureEquities,
  withTooltip
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initializeChart();
      };
      document.head.appendChild(script);
    } else {
      initializeChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [futureCashValues, futureLoanAmounts, futureEquities, withTooltip]);

  const externalTooltipHandler = (context: any) => {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');
    var tooltipLineEl = document.getElementById('tooltip-line');

    if (!tooltipEl || !tooltipLineEl) return;

    // Hide if no tooltip
    if (context.tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      tooltipLineEl.style.opacity = '0';
      return;
    }

    // Set Text
    if (context.tooltip.body) {
      var titleLines = context.tooltip.title || [];
      var bodyLines = context.tooltip.body.map((b: any) => b.lines[0].split(': ')[1]);

      var innerHtml = '<div class="tooltip-header">Year ' + titleLines[0] + '</div>';
      innerHtml += '<div class="tooltip-item"><span class="tooltip-cash">Cash value</span><span class="tooltip-item-value tooltip-cash">$' + bodyLines[2] + '</span></div>';
      innerHtml += '<div class="tooltip-item"><span class="tooltip-loan">Line of credit</span><span class="tooltip-item-value tooltip-loan">$' + bodyLines[1] + '</span></div>';
      innerHtml += '<div class="tooltip-line"></div>';
      innerHtml += '<div class="tooltip-item"><span class="tooltip-equity">Equity</span><span class="tooltip-item-value tooltip-equity">$' + bodyLines[0] + '</span></div>';

      tooltipEl.innerHTML = innerHtml;
    }

    // Display, position, and set styles for font
    var position = context.chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = '1';
    var left = position.left + window.pageXOffset + context.tooltip.caretX - 243 - 16; // Offset by 16px to the left
    var minLeft = position.left + window.pageXOffset;
    if (left < minLeft) {
      left = minLeft;
    }
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + (context.chart.height * 0.1) + 'px';  // Fixed vertical position at 10% of the chart height
    tooltipEl.style.font = context.tooltip.options.bodyFont.string;
    tooltipEl.style.padding = context.tooltip.options.padding + 'px ' + context.tooltip.options.padding + 'px';

    // Display and position the vertical line
    tooltipLineEl.style.opacity = '1';
    tooltipLineEl.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px'; // Position over the cursor
    tooltipLineEl.style.top = position.top + window.pageYOffset + 'px';
    tooltipLineEl.style.height = context.chart.height + 'px';
  };

  const initializeChart = () => {
    if (!chartRef.current || !window.Chart) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    var ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        datasets: [
          {
            label: 'Future Cash Values',
            data: futureCashValues,
            borderColor: '#1B4A7B',
            borderWidth: 2,
            fill: false,
            borderDash: [4, 8],
            borderCapStyle: 'round',
            pointRadius: 0,
            order: 3
          },
          {
            label: 'Future Loan Amounts',
            data: futureLoanAmounts,
            borderColor: '#999F9E',
            borderWidth: 2,
            fill: false,
            borderDash: [4, 8],
            borderCapStyle: 'round',
            pointRadius: 0,
            order: 2
          },
          {
            label: 'Future Equities',
            data: futureEquities,
            borderColor: '#00B5AE',
            borderWidth: 2,
            fill: false,
            borderDash: [4, 8],
            borderCapStyle: 'round',
            pointRadius: 0,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Disable animation
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            mode: 'index',
            intersect: false,
            external: withTooltip ? externalTooltipHandler : null
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: true,
              color: '#DFDFE6',
              lineWidth: 1,
              borderDash: [4, 4],
              borderDashOffset: 0,
              drawBorder: false
            }
          },
          y: {
            display: false,
            grid: {
              display: true,
              color: '#DFDFE6',
              lineWidth: 1,
              borderDash: [4, 4],
              borderDashOffset: 0,
              drawBorder: false
            }
          }
        }
      }
    });
  };

  return (
    <div className="super-vault-chart-container">
      <canvas ref={chartRef} className="super-vault-chart"></canvas>
      <div id="chartjs-tooltip" className="tooltip-body"></div>
      <div id="tooltip-line"></div>
    </div>
  );
};