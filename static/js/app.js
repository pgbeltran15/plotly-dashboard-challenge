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
                color: 'blue',
                line: {
                    color:'rgb'
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
  
    }).catch(function (error) {
      console.log(error);
    });
  }

function optionChanged(newsample) {
    //grab new data each time a new sample is selected
    createCharts(newsample);
    getMetaData(newsample);
};

//call init to set the default loading page
init();
