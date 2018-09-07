var margin = {top: 10, right: 10, bottom: 20, left: 35},
// calculate the width of the chart from the width of the line-wrapper
width = parseInt(d3.select(".chart").style("width")) - margin.left - margin.right,
height = parseInt(d3.select(".chart").style("height")) - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");
// var parseDate2 = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// define the line
var line = d3.line()
    .defined(function(d) { return d.average1 != 0; }) // remove values with exactly 0, since these are the nulls
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.average1); });

// for data after 1900
// using this rather than the keys method since there's just two of them
var line2 = d3.line()
    .defined(function(d) { return d.average2 != 0; })
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.average2); });

var zeroLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(0); });

// from https://bl.ocks.org/mbostock/5649592

function transition(path) {
    path.transition()
        .duration(5000)
        .attrTween("stroke-dasharray", tweenDash);
}
    
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t); };
}

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var svg = d3.select("#myChart").append("svg")
    .attr("id", "svg-1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var csv = "./data/london.csv";

function drawChart() {
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.average1 = +d.smoothed_anoms1;
            d.average2 = +d.smoothed_anoms2; // this is the bit that turns blanks to 0
        });

        x.domain([parseDate(1850), parseDate(2018)]);
        y.domain([-2, 3]);

        // Add the axis label (before line so always underneath)

        svg.append("text")
        .attr("class", "axis label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .text("Temperature anomaly (C)");

        // add draw text
        svg.append("text")
        .attr("class", "instructions")
        .attr("y", 15)
        .attr("x", 175)
        .attr("dy", ".5em")
        .style("text-anchor", "start")
        .text("Draw here!");

        svg.append("clipPath")
        .attr("id", "graph-clip")
        .append("rect")
        .attr("width", width) 
        .attr("height", height); 

        // Add the line at zero.
        svg.append("path")
        .data([data])
        .attr("class", "zero-line")
        .attr("clip-path","url(#graph-clip)")
        .attr("d", zeroLine);

        // Add the X Axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        // Add the line path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("clip-path","url(#graph-clip)")
        .attr("d", line);


    })

}

drawChart();

function updateChart() {

    d3.csv(csv, function(error, data) {
        // load the data again

        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.average1 = +d.smoothed_anoms1;
            d.average2 = +d.smoothed_anoms2;
        });

        x.domain([parseDate(1850), parseDate(2018)]);
        y.domain([-2, 3]);

        // Add the second line path.
        svg.append("path")
        .data([data])
        .attr("class", "line2")
        .attr("clip-path","url(#graph-clip)")
        .attr("d", line2)
        .call(transition);

    })

}

function resetChart() {

    svg.selectAll(".line2").exit().remove();

    removeUserPath();

}