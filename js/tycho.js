var btns = document.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

function showInfection(infection) {
    div = 'show' + infection;
    console.log(div);
    document.getElementById('showInfluenza').style.display = 'none';
    document.getElementById('showGonorrhea').style.display = 'none';
    document.getElementById('showMeasles').style.display = 'none';
    document.getElementById('showChlamydia').style.display = 'none';
    document.getElementById(div).style.display = 'block';

    Plotly.d3.csv('data/tycho_chlamydia.csv', function(err, rows){

        function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row['year'] == year).map(row => row[key])
        }
      
        var frames = []
        var slider_steps = []
      
        var n = 10;
        var num = 2006;
        for (var i = 0; i <= n; i++) {
          var z = filter_and_unpack(rows, 'count', num)
          var locations = filter_and_unpack(rows, 'code', num)
          var states = filter_and_unpack(rows, 'states', num)
          frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
          slider_steps.push ({
              label: num.toString(),
              method: "animate",
              args: [[num], {
                  mode: "immediate",
                  transition: {duration: 300},
                  frame: {duration: 300}
                }
              ]
            })
          num = num + 1
        }
      
          var data = [{
              type: 'choropleth',
              locationmode: 'USA-states',
              locations: frames[0].data[0].locations,
              z: frames[0].data[0].z,
              text: frames[0].data[0].locations,
              zauto: false,
              zmin: 0,
              zmax: 5000000,
              colorscale: [
                  ['0.0', '#ffffff'],
                  ['1.0', '#31bdac']
              ],
              marker: {
                  line:{
                      color: 'rgb(217, 217, 217)',
                      width: 1    
                  }
              },
              colorbar: {
                  title: 'Number of Cases',
                  thickness: 20,
                  outlinecolor: '#FFFFFF',
                  tickformat: ','
              }
      
          }];
          var layout = {
              title: 'Chlamydia Cases, 2006-2016',
              margin: {
                  pad: 0,
                  b: 0,
                  l: 0
              },
              font: {
                  family: "'Roboto', sans-serif"
              },
              geo: {
                  scope: 'usa',
                  showland: true,
                  landcolor: 'rgb(217, 217, 217)',
                  showlakes: true,
                  lakecolor: '#ffffff',
                  subunitcolor: 'rgb(217, 217, 217)',
                  lonaxis: {},
                  lataxis: {}
              },
              updatemenus: [{
                  x: 0.1,
                  y: 0,
                  yanchor: "top",
                  xanchor: "right",
                  showactive: false,
                  direction: "left",
                  type: "buttons",
                  pad: {"t": 87, "r": 10},
                  buttons: [{
                      method: "animate",
                      args: [null, {
                      fromcurrent: true,
                      transition: {
                          duration: 200,
                      },
                      frame: {
                          duration: 500
                      }
                      }],
                      label: "Play"
                  }, {
                      method: "animate",
                      args: [
                      [null],
                      {
                          mode: "immediate",
                          transition: {
                          duration: 0
                          },
                          frame: {
                          duration: 0
                          }
                      }
                      ],
                      label: "Pause"
                  }]
              }],
              sliders: [{
                  active: 0,
                  steps: slider_steps,
                  x: 0.1,
                  len: 0.9,
                  xanchor: "left",
                  y: 0,
                  yanchor: "top",
                  pad: {t: 50, b: 10},
                  currentvalue: {
                      visible: true,
                      prefix: "Year :",
                      xanchor: "right",
                      font: {
                      size: 20,
                      color: "#666"
                      }
                  },
                  transition: {
                      duration: 300,
                      easing: "cubic-in-out"
                  }
              }]
          };
      
          Plotly.newPlot('chlamydia', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
              Plotly.addFrames('chlamydia', frames);
          });
    })
      
    Plotly.d3.csv('data/tycho_gonorrhea.csv', function(err, rows){
    
        function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row['year'] == year).map(row => row[key])
        }
    
        var frames = []
        var slider_steps = []
    
        var n = 10;
        var num = 2006;
        for (var i = 0; i <= n; i++) {
        var z = filter_and_unpack(rows, 'count', num)
        var locations = filter_and_unpack(rows, 'code', num)
        var states = filter_and_unpack(rows, 'states', num)
        frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
        slider_steps.push ({
                label: num.toString(),
                method: "animate",
                args: [[num], {
                    mode: "immediate",
                    transition: {duration: 300},
                    frame: {duration: 300}
                    }
                ]
            })
        num = num + 1
        }
    
        var data = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: frames[0].data[0].locations,
            z: frames[0].data[0].z,
            text: frames[0].data[0].locations,
            zauto: false,
            zmin: 0,
            zmax: 1750000,
            colorscale: [
                ['0.0', '#ffffff'],
                ['1.0', '#31bdac']
            ],
            marker: {
                line:{
                    color: 'rgb(217, 217, 217)',
                    width: 1    
                }
            },
            colorbar: {
                title: 'Number of Cases',
                thickness: 20,
                outlinecolor: '#FFFFFF',
                tickformat: ','
            }
    
        }];
        var layout = {
            title: 'Gonorrhea Cases, 2006-2016',
            margin: {
                pad: 0,
                b: 0
            },
            font: {
                family: "'Roboto', sans-serif"
            },
            geo: {
                scope: 'usa',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showlakes: true,
                lakecolor: '#ffffff',
                subunitcolor: 'rgb(217, 217, 217)',
                lonaxis: {},
                lataxis: {}
            },
            updatemenus: [{
                x: 0.1,
                y: 0,
                yanchor: "top",
                xanchor: "right",
                showactive: false,
                direction: "left",
                type: "buttons",
                pad: {"t": 87, "r": 10},
                buttons: [{
                    method: "animate",
                    args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                    }],
                    label: "Play"
                }, {
                    method: "animate",
                    args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                        duration: 0
                        },
                        frame: {
                        duration: 0
                        }
                    }
                    ],
                    label: "Pause"
                }]
            }],
            sliders: [{
                active: 0,
                steps: slider_steps,
                x: 0.1,
                len: 0.9,
                xanchor: "left",
                y: 0,
                yanchor: "top",
                pad: {t: 50, b: 10},
                currentvalue: {
                    visible: true,
                    prefix: "Year: ",
                    xanchor: "right",
                    font: {
                    size: 20,
                    color: "#666"
                    }
                },
                transition: {
                    duration: 300,
                    easing: "cubic-in-out"
                }
            }]
        };
    
        Plotly.newPlot('gonorrhea', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
            Plotly.addFrames('gonorrhea', frames);
        });
    })
    
    Plotly.d3.csv('data/tycho_influenza.csv', function(err, rows){
    
        function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row['year'] == year).map(row => row[key])
        }
    
        var frames = []
        var slider_steps = []
    
        var n = 30;
        var num = 1920;
        for (var i = 0; i <= n; i++) {
        var z = filter_and_unpack(rows, 'count', num)
        var locations = filter_and_unpack(rows, 'code', num)
        var states = filter_and_unpack(rows, 'states', num)
        frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
        slider_steps.push ({
                label: num.toString(),
                method: "animate",
                args: [[num], {
                    mode: "immediate",
                    transition: {duration: 300},
                    frame: {duration: 300}
                    }
                ]
            })
        num = num + 1
        }
    
        var data = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: frames[0].data[0].locations,
            z: frames[0].data[0].z,
            text: frames[0].data[0].locations,
            zauto: false,
            // zmin: 0,
            // zmax: 1750000,
            colorscale: [
                ['0.0', '#ffffff'],
                ['1.0', '#31bdac']
            ],
            marker: {
                line:{
                    color: 'rgb(217, 217, 217)',
                    width: 1    
                }
            },
            colorbar: {
                title: 'Number of Cases',
                thickness: 20,
                outlinecolor: '#FFFFFF',
                tickformat: ','
            }
    
        }];
        var layout = {
            title: 'Influenza Cases, 1920-1950',
            margin: {
                pad: 0,
                b: 0
            },
            font: {
                family: "'Roboto', sans-serif"
            },
            geo: {
                scope: 'usa',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showlakes: true,
                lakecolor: '#ffffff',
                subunitcolor: 'rgb(217, 217, 217)',
                lonaxis: {},
                lataxis: {}
            },
            updatemenus: [{
                x: 0.1,
                y: 0,
                yanchor: "top",
                xanchor: "right",
                showactive: false,
                direction: "left",
                type: "buttons",
                pad: {"t": 87, "r": 10},
                buttons: [{
                    method: "animate",
                    args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                    }],
                    label: "Play"
                }, {
                    method: "animate",
                    args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                        duration: 0
                        },
                        frame: {
                        duration: 0
                        }
                    }
                    ],
                    label: "Pause"
                }]
            }],
            sliders: [{
                active: 0,
                steps: slider_steps,
                x: 0.1,
                len: 0.9,
                xanchor: "left",
                y: 0,
                yanchor: "top",
                pad: {t: 50, b: 10},
                currentvalue: {
                    visible: true,
                    prefix: "Year: ",
                    xanchor: "right",
                    font: {
                    size: 20,
                    color: "#666"
                    }
                },
                transition: {
                    duration: 300,
                    easing: "cubic-in-out"
                }
            }]
        };
    
        Plotly.newPlot('influenza', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
            Plotly.addFrames('influenza', frames);
        });
    })
    
    Plotly.d3.csv('data/tycho_measles.csv', function(err, rows){
    
        function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row['year'] == year).map(row => row[key])
        }
    
        var frames = []
        var slider_steps = []
    
        var n = 9;
        var num = 1960;
        for (var i = 0; i <= n; i++) {
        var z = filter_and_unpack(rows, 'count', num)
        var locations = filter_and_unpack(rows, 'code', num)
        var states = filter_and_unpack(rows, 'states', num)
        frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
        slider_steps.push ({
                label: num.toString(),
                method: "animate",
                args: [[num], {
                    mode: "immediate",
                    transition: {duration: 300},
                    frame: {duration: 300}
                    }
                ]
            })
        num = num + 1
        }
    
        var data = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: frames[0].data[0].locations,
            z: frames[0].data[0].z,
            text: frames[0].data[0].locations,
            zauto: false,
            // zmin: 0,
            // zmax: 1750000,
            colorscale: [
                ['0.0', '#ffffff'],
                ['1.0', '#31bdac']
            ],
            marker: {
                line:{
                    color: 'rgb(217, 217, 217)',
                    width: 1    
                }
            },
            colorbar: {
                title: 'Number of Cases',
                thickness: 20,
                outlinecolor: '#FFFFFF',
                tickformat: ','
            }
    
        }];
        var layout = {
            title: 'Measles Cases, 1960-1969',
            margin: {
                pad: 0,
                b: 0
            },
            font: {
                family: "'Roboto', sans-serif"
            },
            geo: {
                scope: 'usa',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showlakes: true,
                lakecolor: '#ffffff',
                subunitcolor: 'rgb(217, 217, 217)',
                lonaxis: {},
                lataxis: {}
            },
            updatemenus: [{
                x: 0.1,
                y: 0,
                yanchor: "top",
                xanchor: "right",
                showactive: false,
                direction: "left",
                type: "buttons",
                pad: {"t": 87, "r": 10},
                buttons: [{
                    method: "animate",
                    args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                    }],
                    label: "Play"
                }, {
                    method: "animate",
                    args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                        duration: 0
                        },
                        frame: {
                        duration: 0
                        }
                    }
                    ],
                    label: "Pause"
                }]
            }],
            sliders: [{
                active: 0,
                steps: slider_steps,
                x: 0.1,
                len: 0.9,
                xanchor: "left",
                y: 0,
                yanchor: "top",
                pad: {t: 50, b: 10},
                currentvalue: {
                    visible: true,
                    prefix: "Year: ",
                    xanchor: "right",
                    font: {
                    size: 20,
                    color: "#666"
                    }
                },
                transition: {
                    duration: 300,
                    easing: "cubic-in-out"
                }
            }]
        };
    
        Plotly.newPlot('measles', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
            Plotly.addFrames('measles', frames);
        });
    })
}

Plotly.d3.csv('data/tycho_chlamydia.csv', function(err, rows){

  function filter_and_unpack(rows, key, year) {
  return rows.filter(row => row['year'] == year).map(row => row[key])
  }

  var frames = []
  var slider_steps = []

  var n = 10;
  var num = 2006;
  for (var i = 0; i <= n; i++) {
    var z = filter_and_unpack(rows, 'count', num)
    var locations = filter_and_unpack(rows, 'code', num)
    var states = filter_and_unpack(rows, 'states', num)
    frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
    slider_steps.push ({
        label: num.toString(),
        method: "animate",
        args: [[num], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300}
          }
        ]
      })
    num = num + 1
  }

    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].locations,
        zauto: false,
        zmin: 0,
        zmax: 5000000,
        colorscale: [
            ['0.0', '#ffffff'],
            ['1.0', '#31bdac']
        ],
        marker: {
            line:{
                color: 'rgb(217, 217, 217)',
                width: 1    
            }
        },
        colorbar: {
            title: 'Number of Cases',
            thickness: 20,
            outlinecolor: '#FFFFFF',
            tickformat: ','
        }

    }];
    var layout = {
        title: 'Chlamydia Cases, 2006-2016',
        margin: {
            pad: 0,
            b: 0,
            l: 0
        },
        font: {
            family: "'Roboto', sans-serif"
        },
        geo: {
            scope: 'usa',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: '#ffffff',
            subunitcolor: 'rgb(217, 217, 217)',
            lonaxis: {},
            lataxis: {}
        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                fromcurrent: true,
                transition: {
                    duration: 200,
                },
                frame: {
                    duration: 500
                }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                [null],
                {
                    mode: "immediate",
                    transition: {
                    duration: 0
                    },
                    frame: {
                    duration: 0
                    }
                }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: "Year: ",
                xanchor: "right",
                font: {
                size: 20,
                color: "#666"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };

    Plotly.newPlot('chlamydia', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
        Plotly.addFrames('chlamydia', frames);
    });
})

Plotly.d3.csv('data/tycho_gonorrhea.csv', function(err, rows){

    function filter_and_unpack(rows, key, year) {
    return rows.filter(row => row['year'] == year).map(row => row[key])
    }
  
    var frames = []
    var slider_steps = []
  
    var n = 10;
    var num = 2006;
    for (var i = 0; i <= n; i++) {
      var z = filter_and_unpack(rows, 'count', num)
      var locations = filter_and_unpack(rows, 'code', num)
      var states = filter_and_unpack(rows, 'states', num)
      frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
      slider_steps.push ({
            label: num.toString(),
            method: "animate",
            args: [[num], {
                mode: "immediate",
                transition: {duration: 300},
                frame: {duration: 300}
                }
            ]
        })
      num = num + 1
    }
  
      var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].locations,
        zauto: false,
        zmin: 0,
        zmax: 1750000,
        colorscale: [
            ['0.0', '#ffffff'],
            ['1.0', '#31bdac']
        ],
        marker: {
            line:{
                color: 'rgb(217, 217, 217)',
                width: 1    
            }
        },
        colorbar: {
            title: 'Number of Cases',
            thickness: 20,
            outlinecolor: '#FFFFFF',
            tickformat: ','
        }
  
      }];
      var layout = {
        title: 'Gonorrhea Cases, 2006-2016',
        margin: {
            pad: 0,
            b: 0
        },
        font: {
            family: "'Roboto', sans-serif"
        },
        geo: {
            scope: 'usa',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: '#ffffff',
            subunitcolor: 'rgb(217, 217, 217)',
            lonaxis: {},
            lataxis: {}
        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                fromcurrent: true,
                transition: {
                    duration: 200,
                },
                frame: {
                    duration: 500
                }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                [null],
                {
                    mode: "immediate",
                    transition: {
                    duration: 0
                    },
                    frame: {
                    duration: 0
                    }
                }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: "Year: ",
                xanchor: "right",
                font: {
                size: 20,
                color: "#666"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };

    Plotly.newPlot('gonorrhea', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
        Plotly.addFrames('gonorrhea', frames);
    });
})

Plotly.d3.csv('data/tycho_influenza.csv', function(err, rows){

    function filter_and_unpack(rows, key, year) {
    return rows.filter(row => row['year'] == year).map(row => row[key])
    }
  
    var frames = []
    var slider_steps = []
  
    var n = 30;
    var num = 1920;
    for (var i = 0; i <= n; i++) {
      var z = filter_and_unpack(rows, 'count', num)
      var locations = filter_and_unpack(rows, 'code', num)
      var states = filter_and_unpack(rows, 'states', num)
      frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
      slider_steps.push ({
            label: num.toString(),
            method: "animate",
            args: [[num], {
                mode: "immediate",
                transition: {duration: 300},
                frame: {duration: 300}
                }
            ]
        })
      num = num + 1
    }
  
      var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].locations,
        zauto: false,
        // zmin: 0,
        // zmax: 1750000,
        colorscale: [
            ['0.0', '#ffffff'],
            ['1.0', '#31bdac']
        ],
        marker: {
            line:{
                color: 'rgb(217, 217, 217)',
                width: 1    
            }
        },
        colorbar: {
            title: 'Number of Cases',
            thickness: 20,
            outlinecolor: '#FFFFFF',
            tickformat: ','
        }
  
      }];
      var layout = {
        title: 'Influenza Cases, 1920-1950',
        margin: {
            pad: 0,
            b: 0
        },
        font: {
            family: "'Roboto', sans-serif"
        },
        geo: {
            scope: 'usa',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: '#ffffff',
            subunitcolor: 'rgb(217, 217, 217)',
            lonaxis: {},
            lataxis: {}
        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                fromcurrent: true,
                transition: {
                    duration: 200,
                },
                frame: {
                    duration: 500
                }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                [null],
                {
                    mode: "immediate",
                    transition: {
                    duration: 0
                    },
                    frame: {
                    duration: 0
                    }
                }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: "Year: ",
                xanchor: "right",
                font: {
                size: 20,
                color: "#666"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };

    Plotly.newPlot('influenza', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
        Plotly.addFrames('influenza', frames);
    });
})

Plotly.d3.csv('data/tycho_measles.csv', function(err, rows){

    function filter_and_unpack(rows, key, year) {
    return rows.filter(row => row['year'] == year).map(row => row[key])
    }
  
    var frames = []
    var slider_steps = []
  
    var n = 9;
    var num = 1960;
    for (var i = 0; i <= n; i++) {
      var z = filter_and_unpack(rows, 'count', num)
      var locations = filter_and_unpack(rows, 'code', num)
      var states = filter_and_unpack(rows, 'states', num)
      frames[i] = {data: [{z: z, locations: locations, text: states}], name: num}
      slider_steps.push ({
            label: num.toString(),
            method: "animate",
            args: [[num], {
                mode: "immediate",
                transition: {duration: 300},
                frame: {duration: 300}
                }
            ]
        })
      num = num + 1
    }
  
      var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].locations,
        zauto: false,
        // zmin: 0,
        // zmax: 1750000,
        colorscale: [
            ['0.0', '#ffffff'],
            ['1.0', '#31bdac']
        ],
        marker: {
            line:{
                color: 'rgb(217, 217, 217)',
                width: 1    
            }
        },
        colorbar: {
            title: 'Number of Cases',
            thickness: 20,
            outlinecolor: '#FFFFFF',
            tickformat: ','
        }
  
      }];
      var layout = {
        title: 'Measles Cases, 1960-1969',
        margin: {
            pad: 0,
            b: 0
        },
        font: {
            family: "'Roboto', sans-serif"
        },
        geo: {
            scope: 'usa',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: '#ffffff',
            subunitcolor: 'rgb(217, 217, 217)',
            lonaxis: {},
            lataxis: {}
        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                fromcurrent: true,
                transition: {
                    duration: 200,
                },
                frame: {
                    duration: 500
                }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                [null],
                {
                    mode: "immediate",
                    transition: {
                    duration: 0
                    },
                    frame: {
                    duration: 0
                    }
                }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: "Year: ",
                xanchor: "right",
                font: {
                size: 20,
                color: "#666"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };

    Plotly.newPlot('measles', data, layout, {showLink: false, displayModeBar: false, responsive: true}).then(function() {
        Plotly.addFrames('measles', frames);
    });
})