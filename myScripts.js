const total_color = "#FFFFFF";        // White
const value_color = "#DDDDDD";        // Light Gray
const legend_color = "#CCCCCC";       // Gray
const slice_border_color = "#cccccc"; // Dark Gray
const bg_color = "#1A1A1A";           // Dark Background
const color_palette = ["#00B1F2", "#5653FE", "#7D02EB", "#A300D6", "#1FA2FF", "#12D8FA", "#0C4A6E", "#4F86F7", "#904C77", "#D81159"]; // Light to Dark Blues and

async function getApiData() {
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

// function plotApexPie1() {
//   (async () => {
//     try {
//       const apiData = await getApiData_pie1();
//       values = apiData[0];
//       labels = apiData[1];
//       var options = {
//         series: values,
//         chart: {
//           width: "100%",
//           height: "100%",
//           type: "pie",
//         },
//         labels: labels,
//         responsive: [
//           {
//             breakpoint: 480,
//             options: {
//               chart: {
//                 width: 500,
//               },
//               legend: {
//                 position: "bottom",
//               },
//             },
//           },
//         ],
//       };

//       var chart = new ApexCharts(
//         document.querySelector("#Apex_Pie_chart"),
//         options
//       );
//       chart.render();
//     } catch (error) {
//       // Handle error if needed
//     }
//   })();
// }

async function getUIData(iteration, data_type) {
  try {
    const response = await fetch("Latest/ui.json");
    const data = await response.json();
    iter_data = data[iteration];
    var values = [];
    var labels = [];
    for (var key in iter_data) {
      if (iter_data.hasOwnProperty(key)) {
        if (data_type == "test") {
          if (
            [
              "test_other",
              "test_skipped",
              "test_passed",
              "test_failed",
            ].includes(key)
          ) {
            values.push(parseInt(iter_data[key]));
            labels.push(key);
          }
        } else if (data_type == "log") {
          if (["event_passed", "event_failed", "event_other"].includes(key)) {
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

async function plotApexPie(iteration, div_id, data_type) {
  const chartElement = document.querySelector(div_id);

  try {
    // If a chart instance exists for the given div_id, destroy it
    if (chartInstances[div_id]) {
      console.log(`Destroying existing chart in ${div_id}`);
      await chartInstances[div_id].destroy();
      chartInstances[div_id] = null; // Ensure the instance is removed
    } else {
      console.log(`No existing chart to destroy in ${div_id}`);
    }
  } catch (error) {
    console.error(`Error destroying chart in ${div_id}:`, error);
  }
  try {
    var values;
    var labels;
    if (data_type == "api") {
      const apiData = await getApiData();
      values = apiData[0];
      labels = apiData[1];
    } else {
      const apiData = await getUIData(iteration, data_type);
      values = apiData[0];
      labels = apiData[1];
    }
    const options = {
      legend: {
        labels: {
          colors: legend_color, // Set the legend text color to white
        },
      },
        colors: color_palette,
      series: values,
      stroke: {
        show: true,
        width: 2,
        colors: [slice_border_color], // Set the border color for the slices
      },
      chart: {
        width: "100%",
        height: "100%",
        type: "donut",
      },
      labels: labels,
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: false,
                label: "Total",
                fontSize: "22px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: total_color,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
              value:{
                color: value_color
              }
            },
          },
        },
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        textAnchor: "middle",
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: undefined,
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 2,
          borderRadius: 1,
          borderWidth: 0,
          borderColor: "#fff",
          opacity: 0.0,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.9,
          },
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          color: "#000",
          opacity: 0.45,
        },
      },

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

    chartInstances[div_id] = new ApexCharts(chartElement, options);
    chartInstances[div_id].render();
  } catch (error) {
    console.error("Error rendering chart:", error);
    s;
  }
}
const chartInstances = {};
document.addEventListener("DOMContentLoaded", function () {
  // Attach the event listener to the button
  document.getElementById("Update_UI").onclick = function () {
    plotApexPie("1", "#Apex_Pie_chart_UI", "test");
    plotApexPie("1", "#Apex_Pie_chart_UI2", "log");
    plotApexPie("1", "#Apex_Pie_chart", "api");
  };
});
window.onload = function () {
  plotApexPie("1", "#Apex_Pie_chart_UI", "test");
  plotApexPie("1", "#Apex_Pie_chart_UI2", "log");
  plotApexPie("1", "#Apex_Pie_chart", "api");
};
