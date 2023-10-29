let isGeneric = true;
let apiData = null;  // This will hold the data from the Binance API

async function getGraphData() {
    console.log('getGraphData function called');

    // Make an API call to Binance to fetch the data
    try {
        const response = await fetch('https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        apiData = await response.json();
    } catch (error) {
        console.error('Error fetching data from Binance:', error);
        alert('Failed to fetch data from Binance');
        return;
    }

    // At this point, apiData should be an array of data from Binance
    if (!apiData || apiData.length === 0) {
        alert('No data received from Binance');
        return;
    }
    
    const closePrices = apiData.map(d => +d[4]);

    //const closePrices = apiData.slice(0, 10).map(d => +d[4]);    
    // Hide the table container and show the graph container
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('graphContainer').style.display = 'block';
    
    plotGraph(closePrices);
}
  
function plotGraph(data) {
    const graphContainer = document.getElementById('graphContainer');
    let svg = d3.select('#graphContainer svg');

    // If the SVG doesn't exist, create it
    if (svg.empty()) {
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        svg = d3.select('#graphContainer')
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr('class', 'x-axis');

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([height, 0]);
        svg.append('g')
            .call(d3.axisLeft(y))
            .attr('class', 'y-axis');

        // Add line path
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x((d, i) => x(i))
                .y(d => y(d))
            )
            .attr('class', 'line');
    } else {
        // If the SVG exists, update the data
        const x = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, width]);
        
        const y = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([height, 0]);

        svg.select('.x-axis').call(d3.axisBottom(x));
        svg.select('.y-axis').call(d3.axisLeft(y));
        svg.select('.line').datum(data)
            .attr('d', d3.line()
                .x((d, i) => x(i))
                .y(d => y(d))
            );
    }

    // Hide the table container and show the graph container
    document.getElementById('tableContainer').style.display = 'none';
    graphContainer.style.display = 'block';
}


async function submitTime() {
    const timeSelect = document.getElementById('timeSelect');
    const interval = timeSelect.value; // Get the selected time interval
    try {
        const url = `https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=${interval}m&limit=10`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        populateTable(data);
    } catch (error) {
        console.error('Error fetching Binance data:', error);
    }
    //document.getElementById('graphContainer').style.display = 'none';
   // document.getElementById('tableContainer').style.display = 'block';

}

function populateTable(data) {
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = ''; // Clear existing data

    const headings = ['Open Time', 'Open', 'High', 'Low', 'Close', 'Volume', 'Close Time', 'Quote Asset Volume', 'Number of Trades', 'Taker Buy Base Asset Volume', 'Taker Buy Quote Asset Volume', 'Ignore'];
    dataTable.innerHTML += `<tr>${headings.map(heading => `<th>${heading}</th>`).join('')}</tr>`;

    data.forEach(row => {
        dataTable.innerHTML += `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    });
}

function toggleUI() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const slider = toggleSwitch.querySelector('.slider');
  const genericUI = document.getElementById('genericUI');
  const personalizedUI = document.getElementById('personalizedUI');

  isGeneric = !isGeneric;

  if (isGeneric) {
    slider.style.left = '2px';
    
    genericUI.style.display = 'block';
    personalizedUI.style.display = 'none';
    toggleSwitch.classList.remove('personalized');
  } else {
    slider.style.left = 'calc(100% - 38px)'; // Adjusted for slider width and border
    genericUI.style.display = 'none';
    personalizedUI.style.display = 'block';
    toggleSwitch.classList.add('personalized');
  }
}

document.getElementById('timeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const timeValue = document.getElementById('timeSelect').value;
    // Here you can use timeValue to make an API call or update the UI as needed
    console.log(`Time selected: ${timeValue} minutes`);
  });

  document.addEventListener('DOMContentLoaded', (event) => {
    const dataTable = document.getElementById('dataTable');
    
    let tableRows = '';
    for (let i = 0; i < 5; i++) {
      let tableData = '';
      for (let j = 0; j < 5; j++) {
        tableData += '<td></td>';
      }
      tableRows += `<tr>${tableData}</tr>`;
    }
    
    dataTable.innerHTML = tableRows;
  });
    
  document.addEventListener('DOMContentLoaded', (event) => {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        alert(`You clicked ${this.id}`);
        // Here, you can add your specific functionality for each option
      });
    });
  });
  
document.getElementById('toggleSwitch').addEventListener('click', toggleUI);
