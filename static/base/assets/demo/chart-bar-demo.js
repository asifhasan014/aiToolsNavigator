document.addEventListener('DOMContentLoaded', function () {
  if (Chart.defaults && Chart.defaults.font) {
    Chart.defaults.font.family = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.font.color = '#292b2c';
  } else {
    console.error('Chart.defaults.font is undefined');
  }

  // Your chart setup code
  var labels = toolCountByCategory.map(function(item) {
    return item.major_category;
  });

  var data = toolCountByCategory.map(function(item) {
    return item.tool_count;
  });

  var ctx = document.getElementById("myBarChart");
  if (ctx) {
    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Tool Count By Major Categories",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: data,
        }],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          },
          y: {
            min: 0,
            max: Math.max(...data) + 1,
            ticks: {
              maxTicksLimit: 5
            },
            grid: {
              display: true
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  } else {
    console.error("Canvas element with id 'myBarChart' not found.");
  }
});