var echarts = require('echarts');
var _ = require('lodash');

module.exports =  {
    chartLabel: "echart Line",
    fields: {
        x: {
            required: true,
            label: "x",
            inputType: "field-dropdown",
            $input: null,
            val: null,
            datatype: null,
            min: null,
            max: null
        },
        y: { 
            required: true,
            label: "y",
            inputType: "field-dropdown"
        },
        split: {
            required: false,
            label: "line for each:",
            inputType: "field-dropdown"
        }
    },
    renderChart: function (meta, data, fields) {
        // id is #chart
        //console.log(meta);
        //console.log(fields);
        //console.log(data);
        // base options
        var xAxisType = (fields.x.datatype == "date" ? 'time' : 'category')
        var option = {
            tooltip : {
                trigger: 'item'/*,
                formatter : function (params) {
                    var date = new Date(params.value[0]);
                    var datelabel = date.getFullYear() + '-'
                           + (date.getMonth() + 1) + '-'
                           + date.getDate() + ' '
                           + date.getHours() + ':'
                           + date.getMinutes();
                    return params.seriesName + '<br/>' 
                           + datelabel + '<br/>'
                           + params.value[1]
                }*/
            },
            grid: {
                y2: 80
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    restore : {show: false},
                    saveAsImage : {show: true}
                }
            },
            animation: false,
            xAxis : [
                {
                    type : xAxisType,
                    splitNumber:10
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : []
        };
        
        
        // massage the data to fit echarts
        
        var lineForEach = fields.split.val;
        var series = {};
        var normalColor = 'rgba(10,121,189,0.45)';
        //normalColor = 'rgba(5,60,95,0.6)';
        var emphasisColor = 'rgba(255,0,0,1)';
        if (lineForEach) {
            var indexed = _.groupBy(data, lineForEach);
            console.log(indexed);
            for (var eachLine in indexed) {
                var subdataset = indexed[eachLine];
                if (subdataset && subdataset.length) {
                    series = {
                        name: eachLine,
                        type: 'line',
                        showAllSymbol: true,
                        symbolSize: 0.5,
                        itemStyle: {
                            normal: {
                                color: normalColor,
                                lineStyle: {
                                    color: normalColor
                                }
                            },
                            emphasis: {
                                color: emphasisColor,
                                    lineStyle: {
                                        color: emphasisColor
                                    }
                            }
                        },
                        data: []
                    };
                    for (var i = 0; i < subdataset.length; i++) {
                        var x = subdataset[i][fields.x.val];
                        var y = subdataset[i][fields.y.val];
                        series.data.push([x, y]);
                    }
                    option.series.push(series);   
                }
            }
        } else {
            series = {
                name: '',
                type: 'line',
                showAllSymbol: true,
                symbolSize: 0.5,
                itemStyle: {
                    normal: {
                        color: normalColor,
                        lineStyle: {
                            color: normalColor
                        }
                    },
                    emphasis: {
                        color: emphasisColor,
                            lineStyle: {
                                color: emphasisColor
                            }
                    }
                },
                data: []
            };
            for (var i = 0; i < data.length; i++) {
                var x = data[i][fields.x.val];
                var y = data[i][fields.y.val];
                series.data.push([x, y]);
            }
            option.series.push(series);
        }
        
        var myChart = echarts.init(document.getElementById('chart')); 
        
        // Load data into the ECharts instance 
        myChart.setOption(option); 
        
        
        return myChart;
        
        /*
        var svg = dimple.newSvg("#chart", "100%", "100%");
        // svg is a d3 selection
        svg.attr("id", "svgchart");
        
        var myChart = new dimple.chart(svg, data);
        myChart.setMargins(80, 30, 30, 80); // left top right bottom
        
        if (fields.x.datatype == "date" || fields.x.datatype == "number") {
            
        } else {
            alert("x should be date or number");
        }
        var x = myChart.addCategoryAxis("x", fields.x.val);
        if (fields.x.datatype == "date") x.addOrderRule("Date");
        myChart.addMeasureAxis("y", fields.y.val);
        
        var lineForEach = fields.split.val || null;
        var s = myChart.addSeries(lineForEach, dimple.plot.line);
        //myChart.addLegend(60, 10, width, 20, "right"); 
        myChart.draw();
        return myChart;
        */
    }
};