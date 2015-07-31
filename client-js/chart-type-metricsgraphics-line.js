var MG = require('MG');
var _ = require('lodash');
var $ = require('jquery');

module.exports =  {
    chartLabel: "MetricsGraphics - Line",
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
        
        var width = $('#chart').width();
        var height = $('#chart').height() - 140;
        
        if (fields.x.datatype == "date" || fields.x.datatype == "number") {
            
        } else {
            alert("x should be date or number");
        }
        
        // massage data for MG formats
        var lineForEach = fields.split.val;
        var mgData = [];
        if (lineForEach) {
            
            /*
            data needs to be like
            [
                [
                    {date: 'date value', value: 42}
                    {date: 'date value', value: 42},
                ],
                [
                    {date: 'date value', value: 42},
                    {date: 'date value', value: 42}
                ]
            ]
            */
            
            var lines = []; // array of line names for legend purposes
            var indexed = _.groupBy(data, lineForEach);
            for (var eachLine in indexed) {
                lines.push(eachLine);
                var mgDataSeries = [];
                var subdataset = indexed[eachLine];
                if (subdataset && subdataset.length) {
                    for (var i = 0; i < subdataset.length; i++) {
                        mgDataSeries.push({
                            date: new Date(subdataset[i][fields.x.val]),
                            value: Number(subdataset[i][fields.y.val])
                        });
                    }
                    mgData.push(mgDataSeries);
                }
            }
            
            var colormap = [];
            for (var line in lines) {
                colormap.push(1);
            }
            
            console.log(lines);
            console.log(colormap);
            console.log(mgData);
            
            MG.data_graphic({
                title: "Multi-Line Chart",
                description: "This line chart contains multiple lines.",
                data: mgData,
                width: width,
                height: height,
                right: 140,
                target: '#chart',
                legend: lines
                //legend_target: '.legend'
            });
        } else {
            
            var mgDataSeries = [];
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    mgDataSeries.push({
                        date: data[i][fields.x.val],
                        value: Number(data[i][fields.y.val])
                    });
                }
            }
            
            MG.data_graphic({
                data: mgDataSeries,
                width: width,
                height: height,
                right: 40,
                target: '#chart'
                //,
                //legend_target: '.legend'
            });
        }
        
        
        return true;
    }
};