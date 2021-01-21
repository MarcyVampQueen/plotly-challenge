function init() {
    d3.json("samples.json").then(function (theData) {
        for (let sub of theData.names) {
            d3.select("#subjectInput").append("option").text(sub);
        }
        buildPage(theData.names[0]);
    }
    , function (error) {
        console.log(error);
    });
}

d3.selectAll("#subjectInput").on("change", handleSubmit);

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var subject = d3.select("#subjectInput").node().value;

    // Update the Dashboard!
    buildPage(subject);
}

function buildPage(subject) {
    d3.json("samples.json").then(function (theData) {
        // Sort the data by values and then filter by subject
        theData.samples.sort((first, second) => first.sample_values - second.sample_values);
        filtered = theData.samples.filter(id => id.id === subject)[0];

        // Grab values from the response json object to build the plots
        var values = filtered.sample_values;
        var ids = filtered.otu_ids;
        var labels = filtered.otu_labels;

        // Build the charts and information
        buildBarChart(values,ids,labels);
        buildBubbleChart(values,ids,labels);
        buildDemoInfo(theData, subject);
    }
        , function (error) {
            console.log(error);
        });
}

function buildBarChart(values,ids,labels) {
    var barChart = [{
        type: "bar",
        x: values.slice(0, 10),
        y: ids.map(id => "OTU " + id).slice(0, 10),
        orientation: 'h',
        text: labels.slice(0, 10)
    }];
    var layout = {
        title: `Subject OTUs`,
        xaxis: { title: "Sample Count" }
    };
    Plotly.newPlot("bar", barChart, layout);
}

function buildBubbleChart(values,ids,labels) {
    var bubbleChart = [{
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
            color:ids,
            size: values
        }
    }];
    layout = {
        title: `Subject OTUs`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Count" }
    };
    Plotly.newPlot("bubble", bubbleChart, layout);
}

function buildDemoInfo(theData, subject) {
    d3.select(".card-body").html('');
    var demo = theData.metadata.filter(id => id.id === +subject)[0];
    for (let x in demo){
        var info = x + ": " + demo[x];
        d3.select(".card-body").append("p").text(info);
    }
}

init();