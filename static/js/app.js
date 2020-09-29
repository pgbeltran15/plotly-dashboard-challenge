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
            x: reversedTopTen.map(row => row.sample_value),
            y: reversedTopTen.map(row => row.otu_id),
            mode: 'markers',
            marker: {
                color: colors,
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
        Plotly.newPlot('buble', bubbledata, bubble_layout);
    });
};

