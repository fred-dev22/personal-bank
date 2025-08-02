import React from 'react';
import './DSCRCard.css';

interface DSCRCardProps {
  title: string;
  value: number;
  zone1Label: string;
  zone2Label: string;
  zone3Label: string;
  zone2Value: number;
  zone3Value: number;
  zone1Color: string;
  zone2Color: string;
  zone3Color: string;
  minValue: number;
  maxValue: number;
  percentage: boolean;
  decimalPlaces: boolean;
  hideValue: boolean;
}

export const DSCRCard: React.FC<DSCRCardProps> = ({
  title,
  value,
  zone1Label,
  zone2Label,
  zone3Label,
  zone2Value,
  zone3Value,
  zone1Color,
  zone2Color,
  zone3Color,
  minValue,
  maxValue,
  percentage,
  decimalPlaces,
  hideValue
}) => {
  const iframeContent = `
<!DOCTYPE html>
<html>
<head>
    <link href='https://fonts.googleapis.com/css?family=DM Sans' rel='stylesheet'>
    <script>
        "use strict";
        let template = \`
<style>
body,html{
padding-left:0px;
padding-right:0px;
}
#figure {
    height: 88px; /* Total fixed height */
    width: 100%;
    overflow: hidden; /* Prevent horizontal scrolling */
    position: relative; /* Ensure positioned children are relative to this container */
}
.--figure-values {
    width: 85%; 
    position: relative;
    height: 38px; /* Adjusted height */
    margin: 0 auto; /* Center the figure */
    z-index: 10; /* Bring to front */
}
.--figure-zones {
    width: 85%;
    display: flex;
    height: 24px; /* Adjusted height */
    margin: 0 auto; /* Center the figure */
}
.--figure-zones .--figure-zone {
    position: relative;
    flex: 1; /* Equal flex value to ensure equal visual width */
    height: 100%; /* Set the height of the zone to 100% */
}
.--figure-zone:not(:first-child) {
    border-left: 1px solid #6B6B70;
}
.--figure-zone:first-child div {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}
.--figure-zone:last-child div {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}
.--figure-zones .--figure-zone p {
    text-align: center;
    margin: 0px 0 2px 0;
    font-family: 'DM Sans';
    font-size: 12px;
    line-height: 20px;
    color: #7B7F7F;
}

.--figure-zones .--figure-zone p.--figure-zone-value {
    height: 0;
    width: 0;
    display: flex;
    justify-content: center;
    position: absolute;
    text-align: center;
    top: 34px;
    margin-left: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
}

.--figure-inner-zone {
    height: 8px;
}
.--figure-outer-zones {
    height: 8px;
}
.--figure-value {
    position: absolute;
    margin-left: -20px;
    width: 40px;
    min-height: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 20; /* Bring to front */
    white-space: nowrap; /* Prevent the text from wrapping */
}
.--figure-value p {
    font-size: 16px;
    line-height: 16px;
    font-family: 'DM Sans','Arial';
    font-weight: 700;
    margin: 0px;
    margin-bottom: 4px; /* Add vertical spacing */
}
</style>
<div class="--figure-values">
    <div class="--figure-value">
        <p>0%</p>
        <svg width="18" height="18" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 5 10 L 10 0 z" /></svg>
    </div>
</div>
<div class="--figure-zones">
    <div class="--figure-zone --figure-zone-1"><div class="--figure-outer-zones"></div><p>too slow</p></div>
    <div class="--figure-zone --figure-zone-2"><div class="--figure-inner-zone"></div><p>optimal</p><p class="--figure-zone-value">33.00%</p></div>
    <div class="--figure-zone --figure-zone-3"><div class="--figure-outer-zones"></div><p>too fast</p><p class="--figure-zone-value">66.00%</p></div>
</div>\`;
        const init = (props) => {
            _init(props);
            window.addEventListener('resize', () => _init(props)); // Update position on resize
        };
        const update = (props) => {
            _init(props);
        };
        const _init = (props) => {
            let _divId = 'figure';
            let _value = 65;
            let _minValue = 0;
            let _maxValue = 100;
            let _percentage = true;
            let _zone1Label = 'too slow';
            let _zone2Label = 'optimal';
            let _zone3Label = 'too fast';
            let _zone2Value = 53;
            let _zone3Value = 75;
            let _zone1Color = null;
            let _zone2Color = null;
            let _zone3Color = null;
            let _decimalPlaces = true; // Default to showing decimal places
            let _hideValue = false; // Default to not hiding the value

            if (props.divId !== undefined) {
                _divId = props.divId;
            }
            if (props.value !== undefined) {
                _value = props.value;
            }
            if (props.percentage !== undefined) {
                _percentage = props.percentage;
            }
            if (props.minValue !== undefined) {
                _minValue = props.minValue;
            }
            if (props.maxValue !== undefined) {
                _maxValue = props.maxValue;
            }
            if (props.zone1Label) {
                _zone1Label = props.zone1Label;
            }
            if (props.zone2Label) {
                _zone2Label = props.zone2Label;
            }
            if (props.zone3Label) {
                _zone3Label = props.zone3Label;
            }
            if (props.zone2Value !== undefined) {
                _zone2Value = props.zone2Value;
            }
            if (props.zone3Value !== undefined) {
                _zone3Value = props.zone3Value;
            }
            if (props.zone1Color) {
                _zone1Color = props.zone1Color;
            }
            if (props.zone2Color) {
                _zone2Color = props.zone2Color;
            }
            if (props.zone3Color) {
                _zone3Color = props.zone3Color;
            }
            if (props.decimalPlaces !== undefined) {
                _decimalPlaces = props.decimalPlaces;
            }
            if (props.hideValue !== undefined) {
                _hideValue = props.hideValue;
            }

            let figure = document.getElementById(_divId);
            if (figure) {
                figure.innerHTML = template;

                // Set the opacity of the figure
                if (_hideValue) {
                    figure.style.opacity = '0.4';
                } else {
                    figure.style.opacity = '1';
                }

                let figureActual = figure.getElementsByClassName('--figure-value')[0];
                if (figureActual) {
                    if (_hideValue || _value === '') {
                        figureActual.style.display = 'none';
                    } else {
                        figureActual.style.display = 'flex';
                        let figureActualNumber = figureActual.firstElementChild;
                        if (figureActualNumber) {
                            figureActualNumber.innerHTML = '' + _value.toFixed(_decimalPlaces ? 2 : 0) + (_percentage ? '%' : '');
                        }
                        let displayPercentage;
                        if (_value < _minValue) {
                            displayPercentage = -1;
                        }
                        else if (_value > _maxValue) {
                            _value = _maxValue; // Cap the value at maxValue
                            displayPercentage = 100;
                        }
                        else {
                            displayPercentage = (_value - _minValue) / (_maxValue - _minValue) * 100;
                        }
                        let left = displayPercentage + '%';
                        // Ensure the marker stays within bounds
                        if (displayPercentage < 0) {
                            left = '0%';
                        } else if (displayPercentage > 100) {
                            left = '100%';
                        }
                        figureActual.style.left = left;
                    }
                }
                let figureZones = figure.getElementsByClassName('--figure-zones')[0];
                if (figureZones) {
                    let totalWidth = figureZones.offsetWidth;
                    let figureZone1 = figureZones.getElementsByClassName('--figure-zone-1')[0];
                    let figureZone1Bar = figureZone1.getElementsByTagName('div')[0];
                    if (_zone1Color) {
                        if (_zone1Color.includes('linear-gradient')) {
                            figureZone1Bar.style['background'] = _zone1Color;
                        } else {
                            figureZone1Bar.style['backgroundColor'] = _zone1Color;
                        }
                    }
                    let figureZone1Label = figureZone1.getElementsByTagName('p')[0];
                    figureZone1Label.innerHTML = _zone1Label;
                    let zone1Width = totalWidth / 3; // 1/3 of total width
                    figureZone1.style['width'] = zone1Width + 'px';

                    let figureZone2 = figureZones.getElementsByClassName('--figure-zone-2')[0];
                    let figureZone2Bar = figureZone2.getElementsByTagName('div')[0];
                    if (_zone2Color) {
                        if (_zone2Color.includes('linear-gradient')) {
                            figureZone2Bar.style['background'] = _zone2Color;
                        } else {
                            figureZone2Bar.style['backgroundColor'] = _zone2Color;
                        }
                    }
                    let figureZone2Label = figureZone2.getElementsByTagName('p')[0];
                    figureZone2Label.innerHTML = _zone2Label;
                    let figureZone2Value = figureZone2.getElementsByClassName('--figure-zone-value')[0];
                    figureZone2Value.innerHTML = '' + _zone2Value.toFixed(_decimalPlaces ? 2 : 0) + (_percentage ? '%' : '');
                    let zone2Width = totalWidth / 3; // 1/3 of total width
                    figureZone2.style['width'] = zone2Width + 'px';

                    let figureZone3 = figureZones.getElementsByClassName('--figure-zone-3')[0];
                    let figureZone3Bar = figureZone3.getElementsByTagName('div')[0];
                    if (_zone3Color) {
                        if (_zone3Color.includes('linear-gradient')) {
                            figureZone3Bar.style['background'] = _zone3Color;
                        } else {
                            figureZone3Bar.style['backgroundColor'] = _zone3Color;
                        }
                    }
                    let figureZone3Label = figureZone3.getElementsByTagName('p')[0];
                    figureZone3Label.innerHTML = _zone3Label;
                    let figureZone3Value = figureZone3.getElementsByClassName('--figure-zone-value')[0];
                    figureZone3Value.innerHTML = '' + _zone3Value.toFixed(_decimalPlaces ? 2 : 0) + (_percentage ? '%' : '');
                    let zone3Width = totalWidth / 3; // 1/3 of total width
                    figureZone3.style['width'] = zone3Width + 'px';

                    // Correctly position the value marker if value is not hidden and value is defined
                    if (!_hideValue && _value !== '') {
                        let valuePosition;
                        if (_value <= _zone2Value) {
                            valuePosition = (zone1Width * (_value - _minValue) / (_zone2Value - _minValue));
                        } else if (_value <= _zone3Value) {
                            valuePosition = zone1Width + (zone2Width * (_value - _zone2Value) / (_zone3Value - _zone2Value));
                        } else {
                            valuePosition = zone1Width + zone2Width + (zone3Width * (_value - _zone3Value) / (_maxValue - _zone3Value));
                        }
                        // Ensure the marker stays within bounds
                        if (valuePosition < 0) {
                            valuePosition = 0;
                        } else if (valuePosition > totalWidth) {
                            valuePosition = totalWidth;
                        }
                        figureActual.style.left = \`\${valuePosition}px\`;
                    }
                }
            }
        };
    </script>
</head>
<body>
        <div id="figure"></div>
        <script>init({divId: 'figure', value: ${value}, zone1Label: '${zone1Label}', zone2Label: '${zone2Label}', zone3Label: '${zone3Label}', zone2Value: ${zone2Value}, zone3Value: ${zone3Value}, zone2Color: '${zone2Color}', minValue: ${minValue}, maxValue: ${maxValue}, percentage: ${percentage}, zone1Color: '${zone1Color}', zone3Color: '${zone3Color}', decimalPlaces: ${decimalPlaces}, hideValue: ${hideValue}});</script>
    </body>
</html>`;

  console.log('DSCRCard rendering:', title, value);
  return (
    <div className="dscr-card">
      <div className="dscr-card-header">
        <h3>{title}</h3>
      </div>
      <div className="dscr-card-content">
        <iframe
          srcDoc={iframeContent}
          title={title}
          className="metric-card-iframe"
          style={{ border: 'none', width: '100%', height: '88px' }}
        />
      </div>
    </div>
  );
}; 