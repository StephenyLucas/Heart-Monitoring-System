// Get the canvas element
const ctx = document.getElementById('ecgChart').getContext('2d');
const needle = document.getElementById('health_needle')
var audio = new Audio("alarm.mp3");
// const promises = audio.play();
let spo2data=[]
let bpmdata=[]
// Initialize Chart.js with an empty data set
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'ECG Data',
      borderColor: 'red',
      borderWidth: 2,
      data: [],
    }]
  },
  options: {
    scales: {
      x: [{
        type: 'linear',
        position: 'bottom'
      }]
    }
  }
});

// Function to update the chart with new ECG data
function updateECGChart(x, y) {
  // Add new data point to the chart
  chart.data.labels.push(x);
  chart.data.datasets[0].data.push(y);

  // Remove the first data point if the number of data points exceeds a certain limit
  const maxDataPoints = 100;
  if (chart.data.labels.length > maxDataPoints) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  // Update the chart
  chart.update();
}

// Simulate real-time ECG data updating (replace this with your actual ECG data source)
let xValue = 0;
// setInterval(() => {
//   // Update the x and y values
//   xValue++;
//   const yValue = Math.random() * 0.2 + 0.8; // Replace this with your actual ECG data source

//   // Update the chart with new ECG data
//   updateECGChart(xValue, yValue);
// }, 100); // Update every 100 milliseconds

// Function to update the SpO2 and BPM values
const getAverage = (numlist) =>{
  let sums=0
  numlist.forEach(nums=>{
    sums+=nums
  })
  return sums/numlist.length
}

function scale (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function updateHealthReadings(spo2, bpm) {
  document.getElementById('spo2Value').textContent = spo2;
  document.getElementById('bpmValue').textContent = bpm;
  spo2data.push(parseFloat(spo2))
  bpmdata.push(parseFloat(bpm))
  if (spo2data.length%60===0) {
    let spo2avg = getAverage(spo2data)
    let bpmavg = getAverage(bpmdata)
    console.log({spo2avg,bpmavg})
    let spo2Score=0
    let bpmScore=0
    if(spo2avg>95)
    {
      spo2Score=3
    }else if (spo2avg>95) {
      spo2Score=2
    } else {
      spo2Score=1
    }

    if(bpmavg>75&&bpmavg<105)
    {
      bpmScore=3
    }else if (bpmavg>50 && bpmavg<130) {
      bpmScore=2
    } else {
      bpmScore=1
    }
    console.log({spo2Score,bpmScore})
    let needle_angle = scale(spo2Score+bpmScore,2,6,95,5)
    needle.style=`--score:${needle_angle}`
    // bpmScore=3
    // spo2Score=3
    if((spo2Score+bpmScore)<=3){
      audio.play().then(() => {
        // Audio successfully started playing
      }).catch(error => {
        // Handle potential errors, e.g., browser restrictions
        console.error("Failed to play audio:", error);
      });
    }
}}

// // Simulate real-time health data updating
// setInterval(() => {
//   // Simulate SpO2 and BPM values (replace with your actual health data source)
//   const spo2Value = Math.floor(Math.random() * (100 - 90 + 1) + 90); // Random value between 90 and 100
//   const bpmValue = Math.floor(Math.random() * (100 - 60 + 1) + 60); // Random value between 60 and 100

//   // Update the SpO2 and BPM values
//   updateHealthReadings(spo2Value, bpmValue);
// }, 1000); // Update every 1000 milliseconds (1 second)

const sleep = ms => new Promise(r => setTimeout(r, ms));

const cyclicReadCSV = async fileIndex => {
  // Maximum index of files (assuming 0-based index for 4 files)
  const maxFileIndex = 100;
  // Construct the file name based on the current index
  const fileName = `http://localhost:8000/outfile-${fileIndex}.csv`;

  // Use Fetch API to read the file
  const response = await fetch(fileName)
  const data = await response.text()
  
  const lines = data.trim().split('\n');
      lines.forEach(line => {
        // Split the line by comma and parse each value as an integer
        const values = line.split(',').map(value => parseInt(value, 10));
        // Check if there are exactly three values
        xValue++;
        // console.log({"Values":values,"File":fileIndex})
        sleep(300)
        if (values.length === 3) {
          // Create a table row with the values
          // const tr = document.createElement('tr');
          // tr.innerHTML = `<td>${values[0]}</td><td>${values[1]}</td><td>${values[2]}</td>`;
          // const record = `<tr><td>${values[0]}</td><td>${values[1]}</td><td>${values[2]}</td></tr>`
          updateHealthReadings(values[0], values[1]);
          updateECGChart(xValue, values[2]);
          // Append the row to the data_pusher element
          // dataPusherElement.innerHTML+=record;
        }
      });

       // Determine the next file index (cyclically)
       const nextFileIndex = (fileIndex + 1) > maxFileIndex ? 0 : fileIndex + 1;
       // Schedule the next read after a delay (if required)
       setTimeout(() => cyclicReadCSV(nextFileIndex), 1250);
}

setTimeout(() => {
  cyclicReadCSV(0);
}, 2000);