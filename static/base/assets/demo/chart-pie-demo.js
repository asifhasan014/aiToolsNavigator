document.addEventListener('DOMContentLoaded', function () {
  // Function to generate random colors
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function updatePieChart(selectedCategory) {
    var csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    if (!csrfTokenElement) {
      console.error("CSRF token element not found.");
      return;
    }

    var csrfToken = csrfTokenElement.value;

    $.ajax({
      url: document.getElementById("pieChartContainer").getAttribute("data-update-url"),
      type: "POST",
      data: {
        'major_category': selectedCategory,
        'csrfmiddlewaretoken': csrfToken
      },
      success: function (response) {
        // Ensure response is in the expected format
        //        if (!response.useable_for || !response.occurrence_count) {
        //          console.error('Unexpected response format:', response);
        //          return;
        //        }
        let responseData = response.count_for_pie_chart;
        let chartData = {
          useable_for: responseData.map(item => item.useable_for),
          occurrence_count: responseData.map(item => item.occurrence_count),
        };
        renderPieChart(chartData);
      },
      error: function (xhr, status, error) {
        console.error("Error updating pie chart:", error);
      }
    });
  }

  // Function to render the pie chart
  function renderPieChart(data) {
    var ctx = document.getElementById("myPieChart");

    if (window.myPieChart && typeof window.myPieChart.destroy === 'function') {
      window.myPieChart.destroy();
    }

    // Log data to check its structure
    console.log('Data received for chart:', data);

    // Ensure data.labels and data.counts are defined and are arrays
    if (!Array.isArray(data.useable_for) || !Array.isArray(data.occurrence_count)) {
      console.error('Invalid data structure for pie chart.');
      return;
    }

    // Ensure labels and counts have the same length
    if (data.useable_for.length !== data.occurrence_count.length) {
      console.error('Labels and counts arrays must have the same length.');
      return;
    }

    var chartColors = data.useable_for.map(() => getRandomColor());

    window.myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.useable_for,
        datasets: [{
          data: data.occurrence_count,
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
  }

  // Initialize the chart with default data
  var initialData = {
    useable_for: countForPieChart.map(item => item.useable_for),
    occurrence_count: countForPieChart.map(item => item.occurrence_count),
  };
  renderPieChart(initialData);

  // Attach event listeners to category radio buttons
  var categoryRadios = document.querySelectorAll('input[name="major_category"]');
  categoryRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      updatePieChart(this.value);
    });
  });
});