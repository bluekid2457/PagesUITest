async function getApiData_pie1() {
    try {
      const response = await fetch("Latest/api.json");
      const data = await response.json();
      var values = [];
      var labels = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          values.push(parseInt(data[key]));
          labels.push(key);
        }
      }
      return [values, labels];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  function plotApexPie() {
    (async () => {
      try {
        const apiData = await getApiData_pie1();
        values = apiData[0];
        labels = apiData[1];
        var options = {
          series: values,
          chart: {
            width: 600,
            height: 300,
            type: "pie",
          },
          labels: labels,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        };

        var chart = new ApexCharts(
          document.querySelector("#Apex_Pie_chart"),
          options
        );
        chart.render();
      } catch (error) {
        // Handle error if needed
      }
    })();
  }
  plotApexPie();

  async function getUIData_pie1(iteration,data_type) {
    console.log(data_type);
    console.log(data_type == "test");
    try {
      const response = await fetch("Latest/ui.json");
      const data = await response.json();
      iter_data = data[iteration];
      var values = [];
      var labels = [];
      for (var key in iter_data) {
        if (iter_data.hasOwnProperty(key)) {
          if (data_type == "test"){
            if (["test_other","test_skipped","test_passed","test_failed"].includes(key)){
              values.push(parseInt(iter_data[key]));
              labels.push(key);
            }
          }
          else if (data_type == "log"){
            if (["event_passed", "event_failed","event_other"].includes(key)){
              values.push(parseInt(iter_data[key]));
              labels.push(key);
            }
          }
        }
      }
      const randomIntegers = [];
      for (let i = 0; i < 4; i++) {
        const randomInt = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        randomIntegers.push(randomInt);
      }
      // values = randomIntegers;
      return [values, labels];
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function plotApexPieUI(iteration,div_id,data_type) {
    const chartElement = document.querySelector(div_id);

    try {
      // If a chart already exists, destroy it
      if (chart) {
        console.log("Destroying existing chart");
        await chart.destroy();
      } else {
        console.log("No existing chart to destroy");
      }
    } catch (error) {
      console.error("Error destroying chart:", error);
    }

    try {
      const apiData = await getUIData_pie1(iteration,data_type);
      const values = apiData[0];
      const labels = apiData[1];
      const options = {
        series: values,
        chart: {
          width: 500,
          height: 300,
          type: "pie",
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };

      chart = new ApexCharts(chartElement, options);
      chart.render();
    } catch (error) {
      console.error("Error rendering chart:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Attach the event listener to the button
    document.getElementById("Update_UI").onclick = function () {
      plotApexPieUI("1","#Apex_Pie_chart_UI","test");
      plotApexPieUI("1","#Apex_Pie_chart_UI2","log");
    };
  });
  