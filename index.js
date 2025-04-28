const dataUrl =
  'https://raw.githubusercontent.com/suneel190700/datasets/refs/heads/main/individual_pollution_respiratory_records.csv';

function average(arr) {
  const clean = arr.filter((n) => !isNaN(n));
  return clean.length > 0
    ? clean.reduce((a, b) => a + b, 0) / clean.length
    : 0;
}

d3.csv(dataUrl).then(function (data) {
  const causes = [
    ...new Set(data.map((d) => d.Cause_of_Death)),
  ].sort();
  causes.forEach((cause) => {
    const option = document.createElement('option');
    option.value = cause;
    option.text = cause;
    document
      .getElementById('causeSelect')
      .appendChild(option);
  });

  document
    .getElementById('causeSelect')
    .addEventListener('change', updateScatter);
  document
    .getElementById('pollutantSelect')
    .addEventListener('change', updateScatter);

  function updateScatter() {
    const selectedCause =
      document.getElementById('causeSelect').value;
    const selectedPollutant = document.getElementById(
      'pollutantSelect',
    ).value;
    const filteredData = data.filter(
      (d) => d.Cause_of_Death === selectedCause,
    );
    const years = filteredData.map((d) => +d.Year);
    const pollutantValues = filteredData.map(
      (d) => +d[selectedPollutant],
    );
    const deathRates = filteredData.map(
      (d) => +d.Death_Rate_per_100k,
    );

    Plotly.newPlot(
      'scatterPlot',
      [
        {
          x: pollutantValues,
          y: deathRates,
          mode: 'markers',
          text: years.map((y) => `Year: ${y}`),
          marker: { size: 12, color: 'seagreen' },
        },
      ],
      {
        title: `${selectedPollutant} vs Death Rate (${selectedCause})`,
        xaxis: { title: selectedPollutant },
        yaxis: { title: 'Death Rate per 100k' },
      },
    );
  }

  updateScatter();

  const asthma = data.filter((d) =>
    d.Cause_of_Death.toLowerCase().includes('asthma'),
  );
  const copd = data.filter((d) =>
    d.Cause_of_Death.toLowerCase().includes('copd'),
  );
  const pneumonia = data.filter((d) =>
    d.Cause_of_Death.toLowerCase().includes('pneumonia'),
  );

  Plotly.newPlot(
    'lineChart',
    [
      {
        x: asthma.map((d) => +d.Year),
        y: asthma.map((d) => +d.Death_Rate_per_100k),
        mode: 'lines+markers',
        name: 'Asthma',
      },
      {
        x: copd.map((d) => +d.Year),
        y: copd.map((d) => +d.Death_Rate_per_100k),
        mode: 'lines+markers',
        name: 'COPD',
      },
      {
        x: pneumonia.map((d) => +d.Year),
        y: pneumonia.map((d) => +d.Death_Rate_per_100k),
        mode: 'lines+markers',
        name: 'Pneumonia',
      },
    ],
    {
      title: 'Death Rate Trends by Cause',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Death Rate per 100k' },
    },
  );

  const years = [
    ...new Set(data.map((d) => +d.Year)),
  ].sort();

  Plotly.newPlot(
    'pollutionLineChart',
    [
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['NO2 Mean']),
          ),
        ),
        name: 'NO₂',
        type: 'scatter',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['CO Mean']),
          ),
        ),
        name: 'CO',
        type: 'scatter',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['SO2 Mean']),
          ),
        ),
        name: 'SO₂',
        type: 'scatter',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['O3 Mean']),
          ),
        ),
        name: 'O₃',
        type: 'scatter',
      },
    ],
    {
      title: 'Pollution Trends Over Time',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Average Pollutant Level' },
    },
  );

  const year2010 = data.filter((d) => +d.Year === 2010);

  Plotly.newPlot(
    'causeBarChart',
    [
      {
        x: year2010.map((d) => d.Cause_of_Death),
        y: year2010.map((d) => +d.Death_Rate_per_100k),
        type: 'bar',
        marker: { color: 'mediumseagreen' },
      },
    ],
    {
      title: 'Death Rates by Cause in 2010',
      xaxis: { title: 'Cause of Death' },
      yaxis: { title: 'Death Rate per 100k' },
    },
  );

  Plotly.newPlot(
    'pollutionPieChart',
    [
      {
        labels: ['NO₂', 'CO', 'SO₂', 'O₃'],
        values: [
          average(year2010.map((d) => +d['NO2 Mean'])),
          average(year2010.map((d) => +d['CO Mean'])),
          average(year2010.map((d) => +d['SO2 Mean'])),
          average(year2010.map((d) => +d['O3 Mean'])),
        ],
        type: 'pie',
      },
    ],
    {
      title: 'Pollution Composition in 2010',
    },
  );

  // Bubble Chart: Pollution vs Death Rate
  // Bubble Chart: Pollution vs Death Rate
  const selectedCause = 'Asthma'; // You can make this dynamic later
  const bubbleData = data.filter((d) =>
    d.Cause_of_Death.includes(selectedCause),
  );

  // Correct Dynamic Bubble Chart
  Plotly.newPlot(
    'bubbleChart',
    [
      {
        x: bubbleData.map((d) => +d['NO2 Mean']),
        y: bubbleData.map((d) => +d.Death_Rate_per_100k),
        text: bubbleData.map((d) => `Year: ${d.Year}`),
        mode: 'markers',
        marker: {
          size: bubbleData.map((d) =>
            Math.max(10, d.Death_Rate_per_100k * 2),
          ), // Proper bubble size
          color: bubbleData.map((d) => +d['NO2 Mean']), // Optional: Color by pollution
          colorscale: 'Viridis',
          showscale: true,
          sizemode: 'area', // Important: Treat size as area
          sizeref:
            (2.0 *
              Math.max(
                ...bubbleData.map(
                  (d) => +d.Death_Rate_per_100k,
                ),
              )) /
            100 ** 2, // Scaling factor for good bubble size
          sizemin: 5, // Minimum bubble size
        },
      },
    ],
    {
      title: 'Bubble Chart: Pollution vs Death Rate',
      xaxis: { title: 'NO₂ Mean' },
      yaxis: { title: 'Death Rate per 100k' },
    },
  );

  // Heatmap: Year vs Cause
  const allYears = [
    ...new Set(data.map((d) => +d.Year)),
  ].sort();
  const allCauses = [
    ...new Set(data.map((d) => d.Cause_of_Death)),
  ];

  const heatmapData = allCauses.map((cause) =>
    allYears.map((year) => {
      const match = data.find(
        (d) =>
          +d.Year === year && d.Cause_of_Death === cause,
      );
      return match ? +match.Death_Rate_per_100k : 0;
    }),
  );

  Plotly.newPlot(
    'deathHeatmap',
    [
      {
        x: allYears,
        y: allCauses,
        z: heatmapData,
        type: 'heatmap',
        colorscale: 'Viridis',
      },
    ],
    {
      title: 'Death Rate Heatmap (Cause vs Year)',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Cause of Death' },
    },
  );

  // Rolling Average Chart
  const rollingData = asthma.map((d, idx, arr) => {
    const window = arr.slice(
      Math.max(0, idx - 1),
      Math.min(arr.length, idx + 2),
    );
    const avg =
      window.reduce(
        (sum, item) => sum + +item.Death_Rate_per_100k,
        0,
      ) / window.length;
    return { year: +d.Year, avgRate: avg };
  });

  Plotly.newPlot(
    'rollingAverageChart',
    [
      {
        x: rollingData.map((d) => d.year),
        y: rollingData.map((d) => d.avgRate),
        mode: 'lines+markers',
        name: 'Asthma (3-year avg)',
      },
    ],
    {
      title: 'Rolling Average Death Rates (Asthma)',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Smoothed Death Rate per 100k' },
    },
  );

  // Grouped Bar Chart: Pollution by Year
  Plotly.newPlot(
    'groupedBarChart',
    [
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['NO2 Mean']),
          ),
        ),
        name: 'NO₂',
        type: 'bar',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['CO Mean']),
          ),
        ),
        name: 'CO',
        type: 'bar',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['SO2 Mean']),
          ),
        ),
        name: 'SO₂',
        type: 'bar',
      },
      {
        x: years,
        y: years.map((y) =>
          average(
            data
              .filter((d) => +d.Year === y)
              .map((d) => +d['O3 Mean']),
          ),
        ),
        name: 'O₃',
        type: 'bar',
      },
    ],
    {
      barmode: 'group',
      title: 'Grouped Bar Chart: Pollution Levels Yearly',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Average Pollutant Level' },
    },
  );

  // Radar Chart: Pollution Composition
  const avgNO2 = average(
    year2010.map((d) => +d['NO2 Mean']),
  );
  const avgCO = average(year2010.map((d) => +d['CO Mean']));
  const avgSO2 = average(
    year2010.map((d) => +d['SO2 Mean']),
  );
  const avgO3 = average(year2010.map((d) => +d['O3 Mean']));

  Plotly.newPlot(
    'radarChart',
    [
      {
        type: 'scatterpolar',
        r: [avgNO2, avgCO, avgSO2, avgO3],
        theta: ['NO₂', 'CO', 'SO₂', 'O₃'],
        fill: 'toself',
        name: 'Pollution Composition',
      },
    ],
    {
      polar: { radialaxis: { visible: true } },
      title: 'Radar Chart: Pollution Composition (2010)',
    },
  );

  // Timeline Bubble Animation

  const frames = years.map((year) => {
    const yearData = data.filter((d) => +d.Year === +year);
    return {
      name: year.toString(),
      data: [
        {
          x: yearData.map((d) => +d['NO2 Mean']),
          y: yearData.map((d) => +d['CO Mean']),
          mode: 'markers',
          text: yearData.map(
            (d) =>
              `Cause: ${d.Cause_of_Death}<br>Death Rate: ${d.Death_Rate_per_100k}`,
          ),
          marker: {
            size: yearData.map((d) =>
              Math.max(10, d.Death_Rate_per_100k * 2),
            ),
            color: yearData.map((d) => +d['SO2 Mean']),
            colorscale: 'Viridis',
            showscale: true,
            sizemode: 'area',
            sizeref:
              (2.0 *
                Math.max(
                  ...yearData.map(
                    (d) => +d.Death_Rate_per_100k,
                  ),
                )) /
              100 ** 2,
            sizemin: 5,
          },
        },
      ],
    };
  });

  Plotly.newPlot(
    'pollutionBubbleTimeline',
    [
      {
        x: [0],
        y: [0],
        mode: 'markers',
        marker: { size: 12 },
      },
    ],
    {
      title: 'Pollution Timeline Bubble Animation',
      xaxis: { title: 'NO₂ Mean' },
      yaxis: { title: 'CO Mean' },
      updatemenus: [
        {
          type: 'buttons',
          showactive: false,
          buttons: [
            {
              label: 'Play',
              method: 'animate',
              args: [
                null,
                {
                  frame: { duration: 500, redraw: true },
                  fromcurrent: true,
                  transition: { duration: 300 },
                },
              ],
            },
            {
              label: 'Pause',
              method: 'animate',
              args: [
                [null],
                {
                  mode: 'immediate',
                  transition: { duration: 0 },
                  frame: { duration: 0, redraw: false },
                },
              ],
            },
          ],
        },
      ],
      sliders: [
        {
          active: 0,
          steps: years.map((year, index) => ({
            label: year.toString(),
            method: 'animate',
            args: [
              [year.toString()],
              {
                frame: { duration: 500, redraw: true },
                transition: { duration: 300 },
              },
            ],
          })),
        },
      ],
    },
  ).then(function () {
    Plotly.addFrames('pollutionBubbleTi