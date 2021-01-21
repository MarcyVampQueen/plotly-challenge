
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}


// Add event listener for submit button
d3.selectAll("#subjectInput").on("change", handleSubmit);

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var subject = d3.select("#subjectInput").node().value;

    // Update the Dashboard!
    buildPlot(subject);
}

// function updateDash(stock) {
//     var apiKey = "YOUR API KEY HERE";
//     var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-10-01&end_date=2017-10-01&api_key=${apiKey}`;

//     // update the components on the dashboard
//     buildPlot(url);
//     buildTable(url);
// }

function buildPlot(subject) {
    d3.json("samples.json").then(function (theData) {
        // Sort the data by values and then filter by subject
        theData.samples.sort((first, second) => first.sample_values - second.sample_values);
        filtered = theData.samples.filter(id => id.id === subject)[0];
        console.log(filtered);
        
        // Grab values from the response json object to build the plots
        var values = filtered.sample_values.slice(0,10);
        var ids = filtered.otu_ids.map(id => "OTU " + id).slice(0,10);
        var labels = filtered.otu_labels.slice(0,10);

        var trace1 = {
            type: "bar",
            x: values,
            y: ids,
            orientation: 'h',
            text: labels
        };

        var data = [trace1];

        var layout = {
            title: `Subject ${subject} OTUs`,
            xaxis: {title:"Values"}
        };

        Plotly.newPlot("plot", data, layout);

    });
}

function buildTable(url) {
    // clear out the elements of the table first
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    tbody.html("");

    // call the API then fill in the elements of the table
    d3.json(url).then(function (data) {
        data.dataset.data.forEach(function (d) {
            trow = tbody.append("tr");
            trow.append("td").text(d[0]);
            trow.append("td").text(d[1]);
            trow.append("td").text(d[2]);
            trow.append("td").text(d[3]);
            trow.append("td").text(d[4]);
            trow.append("td").text(d[5]);
        });
    })
}