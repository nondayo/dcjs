var chart = dc.dataTable("#test");
var piechart = dc.pieChart("#piechart");
var barchart = dc.barChart("#barchart");

var ndx;
d3.json("quakes.json").then(function (experiments) {
    ndx = crossfilter(experiments);
    var magDimension = ndx.dimension(function (d) {
            return Number(d.mag);
        }),
        grouping = function (d) {
            return Number(d.mag);
        },
        magGroup = magDimension.group().reduceCount(),
        typeDimension = ndx.dimension(function (d) {
            // return d.mag;
            return Math.floor(Number(d.mag));
        }),
        typeGroup = typeDimension.group().reduceCount(),
        // Table 一定要用 crossfilter group
        idDimension = ndx.dimension(d => Number(d.id)),
        // idGroup = idDimension.group(),
        idGrouping = d => Number(d.id);


    barchart.width(300).height(300)
        .x(d3.scaleLinear().domain([3, 7]))
        // .brushOn(false)
        .dimension(typeDimension)
        .group(typeGroup);

    piechart.width(800).height(800)
        .radius(300)
        .innerRadius(150)
        // .externalLabels(20)
        // .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(magDimension).group(magGroup)
        .legend(dc.legend().x(700).y(10).itemHeight(13).gap(5))
        .controlsUseVisibility(true);

    chart
        .width(500)
        .height(500)
        .dimension(idDimension)
        .group(idGrouping)
        .size(Infinity)
        .showGroups(false)
        .columns(['id', 'lat', 'lng', 'depth', 'mag', 'stations'])
        // .sortBy(d => d.depth)
        // .sortBy(function (d) {
        //     return d.id;
        // })
        .sortBy(function (d) {
            return Number(d.id);
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