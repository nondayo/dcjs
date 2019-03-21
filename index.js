var chart = dc.dataTable("#test");
var piechart = dc.pieChart("#piechart");

var ndx;
d3.csv("morley.csv").then(function (experiments) {
    ndx = crossfilter(experiments);
    // d - decimal notation, rounded to integer.
    var fmt = d3.format('02d');
    var runDimension = ndx.dimension(function (d) {
            return [fmt(+d.Expt), fmt(+d.Run)];
        }),
        experimentDimension = ndx.dimension(function (d) {
            return d.Expt;
        }),
        grouping = function (d) {
            return d.Expt;
        },
        experimentGroup = experimentDimension.group().reduceCount();

    piechart.width(300).height(300)
        .innerRadius(50)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(experimentDimension).group(experimentGroup)
        .legend(dc.legend())
        .controlsUseVisibility(true);

    chart
        .width(300)
        .height(480)
        .dimension(runDimension)
        .group(grouping)
        .size(Infinity)
        .showGroups(false)
        .columns(['Expt', 'Run', 'Speed'])
        .sortBy(function (d) {
            return [fmt(+d.Expt), fmt(+d.Run)];
        })
        .order(d3.ascending)
        .on('preRender', update_offset)
        .on('preRedraw', update_offset)
        .on('pretransition', display);

    dc.renderAll();
});

// use odd page size to show the effect better
var ofs = 0,
    pag = 17; //表格有17列

function update_offset() {
    var totFilteredRecs = ndx.groupAll().value();
    // end 的位置是否大於 totFilteredRecs 的總筆數
    var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
    ofs = ofs < 0 ? 0 : ofs;

    chart.beginSlice(ofs);
    chart.endSlice(ofs + pag);
}

function display() {
    var totFilteredRecs = ndx.groupAll().value();
    // end 的位置是否大於 totFilteredRecs 的總筆數
    var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    d3.select('#begin')
        .text(end === 0 ? ofs : ofs + 1);
    d3.select('#end')
        .text(end);
    d3.select('#last')
        .attr('disabled', ofs - pag < 0 ? 'true' : null);
    d3.select('#next')
        .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
    d3.select('#size').text(totFilteredRecs);
    if (totFilteredRecs != ndx.size()) {
        d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
    } else {
        d3.select('#totalsize').text('');
    }
}

// 下一頁
function next() {
    ofs += pag; // 每次換下一頁的第一列是前一個ofs+17
    update_offset();
    chart.redraw();
}

// 上一頁
function last() {
    ofs -= pag; // 每次換上一頁的第一列是前一個ofs+17
    update_offset();
    chart.redraw();
}