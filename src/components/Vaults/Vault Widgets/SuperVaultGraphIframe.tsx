import React, { useEffect, useRef } from 'react';

interface SuperVaultGraphIframeProps {
  futureCashValues: number[];
  futureLoanAmounts: number[];
  futureEquities: number[];
  withTooltip: boolean;
}

export const SuperVaultGraphIframe: React.FC<SuperVaultGraphIframeProps> = ({
  futureCashValues,
  futureLoanAmounts,
  futureEquities,
  withTooltip
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<title>Future Financial Projections</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#chart-container {
  width: 100%;
  height: 290px;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: visible;
}
#financialProjectionsChart {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: transparent;
}
#chartjs-tooltip {
  opacity: 0;
  position: absolute;
  background: #FBFBFD;
  border: 1px solid #DFDFE6;
  border-radius: 8px;
  color: white;
  pointer-events: none;
  -webkit-transition: all .1s ease;
  transition: all .1s ease;
  padding: 8px 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 227px;
  white-space: nowrap;
  overflow: visible;
  z-index: 10;
}
#tooltip-line {
  position: absolute;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #8FA7DE 55%, #8FA7DE 65%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  pointer-events: none;
  -webkit-transition: all .1s ease;
  transition: all .1s ease;
  z-index: 5;
}
.tooltip-header {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #6B6B70;
  margin-bottom: 12px;
}
.tooltip-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
}
.tooltip-item-value {
  margin-left: 4px;
  font-weight: bold;
}
.tooltip-line {
  border-bottom: 1px solid #DFDFE6;
  margin-bottom: 4px;
}
.tooltip-cash {
  color: #1B4A7B;
}
.tooltip-loan {
  color: #999F9E;
}
.tooltip-equity {
  color: #00B5AE;
}
</style>
</head>
<body>
<div id="chart-container">
<canvas id="financialProjectionsChart"></canvas>
</div>
<div id="chartjs-tooltip" class="tooltip-body"></div>
<div id="tooltip-line"></div>
<script>
function externalTooltipHandler(context) {
  var tooltipEl = document.getElementById('chartjs-tooltip');
  var tooltipLineEl = document.getElementById('tooltip-line');
  
  if (context.tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    tooltipLineEl.style.opacity = 0;
    return;
  }
  
  if (context.tooltip.body) {
    var titleLines = context.tooltip.title || [];
    var bodyLines = context.tooltip.body.map(b => b.lines[0].split(': ')[1]);
    var innerHtml = '<div class="tooltip-header">Year ' + titleLines[0] + '</div>';
    innerHtml += '<div class="tooltip-item"><span class="tooltip-cash">Cash value</span><span class="tooltip-item-value tooltip-cash">$' + bodyLines[2] + '</span></div>';
    innerHtml += '<div class="tooltip-item"><span class="tooltip-loan">Line of credit</span><span class="tooltip-item-value tooltip-loan">$' + bodyLines[1] + '</span></div>';
    innerHtml += '<div class="tooltip-line"></div>';
    innerHtml += '<div class="tooltip-item"><span class="tooltip-equity">Equity</span><span class="tooltip-item-value tooltip-equity">$' + bodyLines[0] + '</span></div>';
    tooltipEl.innerHTML = innerHtml;
  }
  
  var position = context.chart.canvas.getBoundingClientRect();
  tooltipEl.style.opacity = 1;
  var left = position.left + window.pageXOffset + context.tooltip.caretX - 243 - 16;
  var minLeft = position.left + window.pageXOffset;
  if (left < minLeft) {
    left = minLeft;
  }
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = position.top + window.pageYOffset + (context.chart.height * 0.1) + 'px';
  tooltipEl.style.font = context.tooltip.options.bodyFont.string;
  tooltipEl.style.padding = context.tooltip.options.padding + 'px ' + context.tooltip.options.padding + 'px';
  
  tooltipLineEl.style.opacity = 1;
  tooltipLineEl.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
  tooltipLineEl.style.top = position.top + window.pageYOffset + 'px';
  tooltipLineEl.style.height = context.chart.height + 'px';
}

function initializeChart(enableExternalTooltip) {
  var ctx = document.getElementById('financialProjectionsChart').getContext('2d');
  var financialProjectionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      datasets: [
        {
          label: 'Future Cash Values',
          data: [${futureCashValues.join(', ')}],
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
          data: [${futureLoanAmounts.join(', ')}],
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
          data: [${futureEquities.join(', ')}],
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
      animation: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          mode: 'index',
          intersect: false,
          external: enableExternalTooltip ? externalTooltipHandler : null
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
}

initializeChart(${withTooltip});
</script>
</body>
</html>`;
        
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [futureCashValues, futureLoanAmounts, futureEquities, withTooltip]);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: '100%',
        height: '290px',
        border: 'none',
        overflow: 'visible'
      }}
      title="Super Vault Graph"
    />
  );
};