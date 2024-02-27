const d3 = require('d3');

// Define the URL for the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the dashboard
function init() {
   
    d3.json(url).then(data => {
       
        let names = data.names;
     
        let dropdownMenu = d3.select("#selDataset");
     
        names.forEach(id => {
            dropdownMenu.append("option")
                .text(id)
                .attr("value", id);
        });
        
        let firstSample = names[0];
       
        buildCharts(firstSample, data);
        buildMetadata(firstSample, data);
    });
}

// Function to handle dropdown change event
function optionChanged(sampleId) {
    // Load data from samples.json
    d3.json(url).then(data => {

        buildCharts(sampleId, data);
        buildMetadata(sampleId, data);
    });
}

// Function to populate the metadata info
function buildMetadata(sample, data) {
    // Get the metadata from the data
    let metadata = data.metadata;
  
    let result = metadata.filter(obj => obj.id == sample);
 
    let panel = d3.select("#sample-metadata");

    panel.html("");
    //
    Object.entries(result[0]).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
    });
}

// Function to build the charts
function buildCharts(sample, data) {
    
    let samples = data.samples;
    
    let result = samples.filter(obj => obj.id == sample);
  
    buildBarChart(result);
    
    buildBubbleChart(result);
}

// Function to build the bar chart
function buildBarChart(sampleData) {
    // Extract data for bar chart
    let otuIds = sampleData[0].otu_ids.slice(0, 10).reverse();
    let sampleValues = sampleData[0].sample_values.slice(0, 10).reverse();
    let otuLabels = sampleData[0].otu_labels.slice(0, 10).reverse();
   
    let trace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };
   
    let layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };
    
    Plotly.newPlot("bar", [trace], layout);
}

// Function to build the bubble chart
function buildBubbleChart(sampleData) {
    
    let trace = {
        x: sampleData[0].otu_ids,
        y: sampleData[0].sample_values,
        text: sampleData[0].otu_labels,
        mode: "markers",
        marker: {
            size: sampleData[0].sample_values,
            color: sampleData[0].otu_ids,
            colorscale: "Earth"
        }
    };
    // Create layout for the bubble chart
    let layout = {
        title: "Bacteria Per Sample",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [trace], layout);
}

// Call the function to initialize the dashboard
init();