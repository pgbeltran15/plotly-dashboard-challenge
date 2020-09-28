function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }
function init(){
    d3.json("/samples.json").then(function(data){
        // console.log(data)
    
        var sample_value = data.samples[0].sample_values;
        var otu_id = data.samples[0].otu_ids;
        var otu_label = data.samples[0].otu_labels;
        console.log(sample_value);
        console.log(otu_id);
        // console.log(otu_labels);
        var sortedData = data.samples.sort((a,b)=> b.sample_value - a.sample_value);
        slicedData= sortedData.slice(0, 10);
        reversedData = slicedData.reverse();
        console.log(reversedData[0].otu_ids)
        
        // var sample_values = Object.values(data.samples[0])
        
        var trace1= {
          x: reversedData[0].sample_values,
          y: `Otu:${reversedData[0].otu_ids}`,
          orientation: "h",
          text: reversedData[0].otu_labels,
          type: "bar"
        };

        // var trace1= {
        //   x: sample_value,
        //   y: `Otu:${otu_id}`,
        //   orientation: "h",
        //   text: otu_label,
        //   type: "bar"
        // };

        var data = [trace1];

        var layout = {
          yaxis: {
            autorange: true,
            type: "linear"
          },
          xaxis: {
            autorange: true,
            type: "linear"
          }
        };

        Plotly.newPlot("bar", data)

});
}


// function createPlots(){
//     d3.json("/samples.json").then(function(data){
//         // console.log(data)
//         var sample_value = [];
//         var otu_id = [];
//         var otu_label = [];
//         var sample_id = [];
//         // var s_values = data.samples[0].sample_values;
//         // console.log(s_values);
//         // var sample_values = Object.values(data.samples[0])
//         // console.log(sample_values)
//         // for (a = 0; a < data.samples.length; a++) {
//         //   sample.push(Object.values(data.samples[a]))
//         // };
//         // console.log(sample)
        
//         //Get sample id
//         for (x = 0; x <data.samples.length; x++) {
//           sample_id.push(data.samples[x].id)
//         };
//         // console.log(sample_id)

//         //Get sample_values
//         for (i = 0; i < data.samples.length; i++) {
//           sample_value.push(data.samples[i].sample_values.splice)
//         };
//         // console.log(sample_value);

//         //Get otu_ids
//         for (j = 0; j < data.samples.length; j++) {
//           otu_id.push(data.samples[j].otu_ids)
//         };
//         // console.log(otu_id);

//         //Get otu_labels
//         for (k = 0; k < data.samples.length; k++) {
//           otu_label.push(data.samples[k].otu_labels)
//         };
//         console.log(otu_label);

//         var sorted_otu_id = otu_id.sort((firstNum, secondNum) => firstNum - secondNum).slice(0,10);
//         var sorted_sample_value = sample_value.sort((firstNum, secondNum) => firstNum - secondNum).slice(0,10);
//         console.log(sorted_otu_id)
//         var trace1= {
//           x: otu_id,
//           y: sample_value,
//           text: otu_label,
//           type: "bar"
//         };

//         var data = [trace1];

//         var layout = {
//           yaxis: {
//             autorange: true,
//             type: "linear"
//           },
//           xaxis: {
//             autorange: true,
//             type: "linear"
//           }
//         };

//         Plotly.newPlot("bar", data)

// });
// }

init()