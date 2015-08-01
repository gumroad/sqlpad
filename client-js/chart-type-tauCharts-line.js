var tauCharts = require('tauCharts');
var _ = require('lodash');
var $ = require('jquery');

module.exports =  {
    chartLabel: "tauCharts - Line",
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
        
        $('#chart').empty();
        
        if (fields.x.datatype == "date" || fields.x.datatype == "number") {
            
        } else {
            alert("x should be date or number");
        }
        
        for (var row in data) {
            data[row][fields.y.val] = Number(data[row][fields.y.val]);
        }
        
        var lineForEach = fields.split.val;
        if (lineForEach) {
            
            var chart = new tauCharts.Chart({
                data: data,
                type: 'line',
                x: fields.x.val,
                y: fields.y.val,
                color: lineForEach, // there will be two lines with different colors on the chart
                plugins: [
                    tauCharts.api.plugins.get('tooltip')({fields: [fields.x.val, fields.y.val, lineForEach]}),
                    tauCharts.api.plugins.get('legend')()
                ]
                
            });
            chart.renderTo('#chart');
            
        } else {
            
            var chart = new tauCharts.Chart({
                data: data,
                type: 'line',
                x: fields.x.val,
                y: fields.y.val,
                plugins: [
                    tauCharts.api.plugins.get('tooltip')({fields: [fields.x.val, fields.y.val]}),
                    tauCharts.api.plugins.get('legend')()
                ]
            });
            chart.renderTo('#chart');
            
        }
        
        
        return true;
    }
};