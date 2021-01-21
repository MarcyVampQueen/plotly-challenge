
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
    console.log(subject);

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
    d3.json("samples.json").then(function (data) {
        console.log(data);
        // Grab values from the response json object to build the plots
        var name = data.dataset.name;
        var stock = data.dataset.dataset_code;
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;
        // Print the names of the columns
        console.log(data.dataset.column_names);
        // Print the data for each day
        console.log(data.dataset.data);
        var dates = unpack(data.dataset.data, 0);
        // console.log(dates);
        var closingPrices = unpack(data.dataset.data, 4);
        // console.log(closingPrices);

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: name,
            x: dates,
            y: closingPrices,
            line: {
                color: "#17BECF"
            }
        };

        var data = [trace1];

        var layout = {
            title: `${stock} closing prices`,
            xaxis: {
                range: [startDate, endDate],
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            }
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