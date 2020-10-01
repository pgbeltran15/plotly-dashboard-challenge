function createCharts(sample) {
    d3.json("samples.json").then((Data)=> {
        var sampleresult = Data.samples.filter(sampleObject => sampleObject.id == sample);
        result = sampleresult[0];

        //for loop to create plot_data

        var plot_data = [];

        for (i=0; i < result.otu_ids.length; i++){
            plot_data.push({
                otu_id: `OTU ${result.otu_ids[i]}`,
                sample_value: result.sample_values[i],
                otu_label: result.otu_labels[i]
            })
        };

        // console.log(plot_data)

        //sort plot_data
        var sortedData = plot_data.sort((a,b)=> b.sample_value - a.sample_value);

        //slice top 10
        var topTen = sortedData.slice(0, 10);

        //reverse to accomodate Plotly
        var reversedTopTen = topTen.reverse();

        //bar trace
        trace1 = {
            type: "bar",
            orientation: 'h',
            x: reversedTopTen.map(row => row.sample_value),
            y: reversedTopTen.map(row => row.otu_id),
            mode: 'markers',
            marker: {
                color: 'darkblue',
                line: {
                    color:'black'
                }
            },
            text: reversedTopTen.map(row => row.otu_label)
        };

        bardata = [trace1]

        //bar layout
        bar_layout= {
            title:`Top Ten OTU Data`,
            yaxis: {autoarange: true},
            xaxis: {autoarange: true}
        }

        //bar plot
        Plotly.newPlot('bar', bardata, bar_layout);

        //Bubble chart trace
        trace2 = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids
            },
            text: result.otu_labels
        };

        bubbledata= [trace2]

        //bubble layout
        bubble_layout = {
            title: 'OTU Data',
            xaxis: {
                autorange: true,
                type: "linear",
                title: "OTU ID"
              },
              yaxis: {
                autorange: true,
                type: "linear"
              }
        };

        //bubble plot
        Plotly.newPlot('bubble', bubbledata, bubble_layout);
    });
};
  
function getMetaData(sample) {
    //Builds Demographic info

    d3.json("samples.json").then((MetaDataSample)=> {
        var metadataResult = MetaDataSample.metadata.filter(sampleObject => sampleObject.id == sample);

        //select infobox to place data storage
        var info_box = d3.select('#sample-metadata');
        //clear previous data
        info_box.html("");

        //add ul list tag
        var info_list = info_box.append('ul')
        info_list.classed('list-unstyled', true);

        //use forEach loop to get key, value pairs for the metadata info box 

        Object.entries(metadataResult[0]).forEach(([key, value])=> {
            var info_box_item = info_list.append('li')
            info_box_item.html("<strong>" + key + ": " + "</strong>" + value);
        });

    });
};

function createGauge(sample) {
    //Builds Demographic info

    d3.json("samples.json").then((GaugeDataSample)=> {
        var gaugedataResult = GaugeDataSample.metadata.filter(sampleObject => sampleObject.id == sample);
        
    // gauge chart trace
    gauge_trace = [{
        type: "indicator",
        mode: "gauge+number+delta",
        title: '<b>Belly Button Washing Frequency</b><br>Scrubs per week<br>',
        domain: {
          x: [0, 5],
          y: [0, 1]
        },
        gauge: {
          axis: {
            // Setting the max of the range to 10 (max(wfreq) + 1)
            range: [null, 10],
            tickwidth: 1,
            tickcolor: "darkblue"
          },
          bar: { color: "darkblue" },
          steps: [
            { range: [0, 1.99], color: "rgb(133,193,233)" },
            { range: [1.99, 2.01], color: "red" }, // Represents the Median value
            { range: [2.01, 4], color: "rgb(93,173,226)" },
            { range: [4, 6], color: "rgb(52,152,219)" },
            { range: [6, 8], color: "rgb(46,134,193)" },
            { range: [8, 8.99], color: "rgb(40,116,166)" },
            { range: [8.99, 9.01], color: "red" }, // Represents the Max value
            { range: [9.01, 10], color: "rgb(37,97,140)" },
          ],
          threshold: {
            line: { color: "red", width: 6 },
            thickness: 0.8,
            value: 9.95
          }
        },
        // Cast any NULL values to Zero
        value: Number(gaugedataResult[0].wfreq),
        delta: { reference: 2, increasing: { color: "Green" } }
      }];
  
      // Gauge chart layout
      gauge_layout = {
        width: 520,
        height: 470,
        margin: { t: 10, r: 25, l: 15, b: 10 },
        font: { color: "darkblue" }
      };
  
      var hvr = d3.select("#gauge");
      console.log(hvr);
  
      // Gauge plot
  
      Plotly.newPlot('gauge', gauge_trace, gauge_layout);
  

    });
};


function init() {
    // Initialize Page
  
    // Read the samples.json data and extract all the Data Sample names
    d3.json("samples.json").then(function (data) {
      // console.log(data);
      var sampleNames = data.names;
  
      d3.selectAll("#selDataset")
        .selectAll("option")
        .data(sampleNames)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });
  
      // Use the first set of the sample data to build the initial plots and Metadata display
      const firstSampleName = sampleNames[0];
  
      // Build the Charts (Bar and Bubble)
      createCharts(firstSampleName);
      
      // Build the Demographic Metadata 
      getMetaData(firstSampleName);

      // Build Gauge Chart
      createGauge(firstSampleName);
  
    }).catch(function (error) {
      console.log(error);
    });
  }

function optionChanged(newsample) {
    //grab new data each time a new sample is selected
    createCharts(newsample);
    getMetaData(newsample);
    createGauge(newsample)
};

//call init to set the default loading page
init();
