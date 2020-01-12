// rating distribution by country
Plotly.d3.csv("data/wine_main.csv", function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'violin',
        x: unpack(rows, 'country'),
        y: unpack(rows, 'points'),
        box: {
            visible: true
        },
        line: {
        //     color: 'rgb(49,189,172)',
            width: 0.5
        },
        meanline: {
            visible: true
        },
        transforms: [{
            type: 'groupby',
            groups: unpack(rows, 'country'),
            styles: [
                {target: 'United<br>States', value: {line: {color: 'rgb(49, 189, 172)'}}},
                {target: 'France', value: {line: {color: '#059BFF'}}},
                {target: 'Italy', value: {line: {color: '#C4D7FF'}}},
                {target: 'Spain', value: {line: {color: '#32FFC8'}}},
                {target: 'Portugal', value: {line: {color: '#EFCBA5'}}},
                {target: 'Chile', value: {line: {color: '#C44D58'}}},
                {target: 'Argentina', value: {line: {color: '#556270'}}},
                {target: 'Austria', value: {line: {color: '#FF6B6B'}}},
                {target: 'Australia', value: {line: {color: '#C7F464'}}},
                {target: 'Germany', value: {line: {color: '#687FFF'}}}
            ]
         }]
    }]

    var layout = {
        title: "Distribution of Reviews from Top Ten Most Rated Countries<br>from WineEnthusiast as of 11.22.17",
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        yaxis: {
            title: 'Rating',
            range: [78, 103]
        },
        violingap: 0,
        violingroupgap: 0,
        violinmode: "overlay",
        showlegend: false
    }

    Plotly.plot('distributionByCountry', data, layout, {showlink: false, displayModeBar: false, responsive: true});
});

// description polarity by points
Plotly.d3.csv("data/wine_polarityXpointscat.csv", function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'violin',
        x: unpack(rows, 'points-category'),
        y: unpack(rows, 'polarity'),
        box: {
            visible: true
        },
        line: {
            color: 'rgb(49,189,172)',
            width: 0.5
        },
        meanline: {
            visible: true
        }
    }]

    var layout = {
        title: "Calculated Polarity of Review Text by Rating Points<br>from WineEnthusiast as of 11.22.17",
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        yaxis: {
            title: 'Polarity of Review Text',
            range: [-1.25, 1.25]
        },
        xaxis: {
            title: 'Rating Points',
            range: ['80-84', '85-59', '90-94', '95-100']
        },
        violingap: 0,
        violingroupgap: 0,
        violinmode: "overlay"
    }

    Plotly.plot('polarityByPoints', data, layout, {showlink: false, displayModeBar: false, responsive: true});
});

// choropleth
Plotly.d3.csv('data/wine_topWinesUSA.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'code'),
        z: unpack(rows, 'points'),
        text: unpack(rows, 'text'),
        hovertemplate: '%{text}',
        zmin: 75,
        zmax: 100,
        colorscale: [
            ['0.0', 'rgb(242, 242, 242)'],
            ['0.23', '#ffffff'],
            ['1.0', '#31bdac']
        ],
        marker: {
            line:{
                color: '#FFFFFF',
                width: 1    
            }
        },
        colorbar: {
            title: 'Mean Rating',
            thickness: 20,
            outlinecolor: '#FFFFFF'
        }
    }];

    var layout = {
        title: 'Mean Wine Rating by State<br>from WineEnthusiast as of 11.22.17',
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        geo: {
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        },
        margin: {
            pad: 0,
            b: 0
        }
    };

    Plotly.plot('topWinesByState', data, layout, {showLink: false, displayModeBar: false, responsive: true});

});

// top wines >= 90 per country
Plotly.d3.csv('data/wine_topWines90.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'bar',
        orientation: 'h',
        x: unpack(rows, 'count'),
        y: unpack(rows, 'country'),
        marker: {
            color: ['#B1ECED', '#E55BC7', '#BC0579', '#C44D58', '#186E99', '#037A5A', '#FCEBC2', '#32FFC8', '#556270', '#C7F464', '#032699', '#059BFF', '#687FFF', 'rgb(49, 189, 172)', '#EFCBA5', '#FF6B6B', '#C4D7FF']
        }
    }];

    var layout = {
        title: 'Number of Wines with Mean Rating ≥ 90<br>from WineEnthusiast as of 11.22.17',
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        xaxis: {
            zeroline: false,
            title: 'Number of Wines',
            hoverformat: ',',
        },
        yaxis: {
            automargin: true
        },
        margin: {
            pad: 2
        }
    };

    Plotly.plot('topWines90', data, layout, {showLink: false, displayModeBar: false, responsive: true});

});

// top wines >= 93 per country
Plotly.d3.csv('data/wine_topWines93.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'bar',
        orientation: 'h',
        x: unpack(rows, 'count'),
        y: unpack(rows, 'country'),
        marker: {
            color: ['#C4D7FF', 'rgb(49, 189, 172)', '#FF6B6B', '#32FFC8', '#EFCBA5']
        }
    }];

    var layout = {
        title: 'Number of Wines with Mean Rating ≥ 93<br>from WineEnthusiast as of 11.22.17',
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        xaxis: {
            zeroline: false,
            title: 'Number of Wines'
        },
        yaxis: {
            automargin: true
        },
        margin: {
            pad: 2
        }
    };

    Plotly.plot('topWines93', data, layout, {showLink: false, displayModeBar: false, responsive: true});

});

// top wines >= 95 per country
Plotly.d3.csv('data/wine_topWines95.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'bar',
        orientation: 'h',
        x: unpack(rows, 'count'),
        y: unpack(rows, 'country'),
        marker: {
            color: ['#FF6B6B', '#EFCBA5', '#32FFC8']
        }
    }];

    var layout = {
        title: 'Number of Wines with Mean Rating ≥ 95<br>from WineEnthusiast as of 11.22.17',
        font: {
            family: "'Roboto Mono Light', sans-serif",
        },
        xaxis: {
            zeroline: false,
            title: 'Number of Wines',
            dtick: 1
        },
        yaxis: {
            automargin: true
        },
        margin: {
            pad: 2
        }
    };

    Plotly.plot('topWines95', data, layout, {showLink: false, displayModeBar: false, responsive: true});

});