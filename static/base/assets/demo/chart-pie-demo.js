document.addEventListener('DOMContentLoaded', function () {
  // Set default font settings
  if (Chart.defaults && Chart.defaults.font) {
    Chart.defaults.font.family = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.font.color = '#292b2c';
  } else {
    console.error('Chart.defaults.font is undefined');
  }
  // Prepare labels and data from the backend
  var labels = countForPieChart.map(function (item) {
    return item.useable_for;
  });

  var data = countForPieChart.map(function (item) {
    return item.occurrence_count;
  });

  // Function to generate random colors
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Generate a color for each data point
  var chartColors = labels.map(() => getRandomColor());

  // Create the pie chart
  var ctx = document.getElementById("myPieChart");
  if (ctx) {
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: chartColors,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  } else {
    console.error("Canvas element with id 'myPieChart' not found.");
  }
});