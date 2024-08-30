document.addEventListener('DOMContentLoaded', function () {
  // Set default font settings
  if (Chart.defaults && Chart.defaults.font) {
    Chart.defaults.font.family = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.font.color = '#292b2c';
  } else {
    console.error('Chart.defaults.font is undefined');
  }

  // Simulated data from the backend
//  var toolCountByCategory = [
//    {
//      "payment_condition": "Contact for Pricing",
//      "value_count": 325
//    },
//    {
//      "payment_condition": "Deals",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Free",
//      "value_count": 1704
//    },
//    {
//      "payment_condition": "Free Trial",
//      "value_count": 771
//    },
//    {
//      "payment_condition": "Free | Freemium | Paid",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Free | Paid",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Free-Trial | Deals",
//      "value_count": 3
//    },
//    {
//      "payment_condition": "Free-Trial | Freemium",
//      "value_count": 8
//    },
//    {
//      "payment_condition": "Free-Trial | Paid",
//      "value_count": 8
//    },
//    {
//      "payment_condition": "FreeDeals",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "FreeFreemium",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Freemium",
//      "value_count": 1284
//    },
//    {
//      "payment_condition": "Freemium | Deals",
//      "value_count": 8
//    },
//    {
//      "payment_condition": "Freemium | Free",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Freemium | Free-Trial",
//      "value_count": 15
//    },
//    {
//      "payment_condition": "Freemium |Contact for Pricing",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Paid",
//      "value_count": 832
//    },
//    {
//      "payment_condition": "Paid | Deals",
//      "value_count": 1
//    },
//    {
//      "payment_condition": "Paid |Free-Trial",
//      "value_count": 3
//    }
//  ];

  // Prepare labels and data from the backend
  var labels = countByPaymentCondition.map(function (item) {
    return item.payment_condition;  // Use the correct property
  });

  var data = countByPaymentCondition.map(function (item) {
    return item.value_count;  // Use the correct property
  });

  // Create the chart
  var ctx = document.getElementById("myAreaChart");
  if (ctx) {
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Tool Count by Payment Condition",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: data,
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category', // Use 'category' for non-time-based data
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: labels.length // Adjust based on your label count
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...data) + 500,
            ticks: {
              maxTicksLimit: 5
            },
            grid: {
              color: "rgba(0, 0, 0, .125)"
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
    console.error("Canvas element with id 'myAreaChart' not found.");
  }
});