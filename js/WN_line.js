makePlot();

function makePlot() {
  d3.csv('data/WN_line.csv', function(data){makeLine(data)});
};

function makeLine(dataset) {
  var x = [];
  var y = [];

  for (var i = 0; i < dataset.length - 1; i++) {
    row = dataset[i];
    x.push(row['Year']);
    y.push(row['Total']);
  }

  var trace = {
    x: x, 
    y: y,
    type: "line",
    marker: {color: 'lightseagreen'}
  };

  var data = [trace];

  var layout = {
    title: "Total Number of Cases In U.S. by Year",
    xaxis: {title: "Year"},
    yaxis: {title: "Number of Cases"},
    font: {size: 8, family: "'Roboto Mono Light', monospace"},
    margin: {
      pad: 0
    }
  };

  Plotly.newPlot('WN_line', data, layout, {displayModeBar: false});
};