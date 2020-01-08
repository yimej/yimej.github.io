makePlot();

function makePlot() {
  d3.csv('data/WN_bar.csv', function(data){makeBar(data)});
};

function makeBar(dataset) {
  var x = [];
  var y = [];
  var text = [];

  for (var i = 0; i < dataset.length - 1; i++) {
    row = dataset[i];
    x.push(row['AB']);
    y.push(row['TotalByState']);
    text.push(row['State']);
  }

  var trace = {
    x: x, 
    y: y,
    text: text,
    type: "bar",
    marker: {color: 'rgb(49, 189, 172)'}
  };

  var data = [trace];
  
  var layout = {
    title: "Total Number of Cases by State: 2010-2016",
    xaxis: {title: "State", tickangle: -90},
    yaxis: {title: "Number of Cases"},
    font: {size: 8, family: "'Roboto Mono Light', monospace"},
  };

  Plotly.newPlot('WN_bar', data, layout, {displayModeBar: false});
};