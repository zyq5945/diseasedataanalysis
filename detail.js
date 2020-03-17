
var TypeName = {
    Simulate:"疾病数据仿真",
    Detail:"疾病数据详情",
    Compare:"疾病数据对比",
};

var TypeSimulate = [
    {title: "数量", data:[
        {title: "确诊数", data:"ConfirmedCount"},
        {title: "康复数", data:"CuredCount"},
        {title: "死亡数", data:"DeadCount"},
        {title: "在治数", data:"TreatingCount"},
        ]},
    {title: "概率", data:[
        {title: "康复率", data:"CuredRate"},
        {title: "死亡率", data:"DeadRate"},
        {title: "在治率", data:"TreatingRate"},
        ]},
    {title: "死亡除康复", data:[
        {title: "死亡除康复", data:"DeadDivideCured"},
        ]},
    {title: "康复除死亡", data:[
        {title: "康复除死亡", data:"CuredDivideDead"},
        ]},
    {title: "康复与死亡标准化", data:[
        {title: "死亡除康复标准化", data:"DeadDivideCuredNorm"},
        {title: "康复除死亡标准化", data:"CuredDivideDeadNorm"},
        ]},
    {title: "标准化", data:[
        {title: "确诊标准化", data:"ConfirmedNorm"},
        {title: "康复标准化", data:"CuredNorm"},
        {title: "死亡标准化", data:"DeadNorm"},
        {title: "在治标准化", data:"TreatingNorm"},
        ]},
    {title: "总标准化", data:[
        {title: "总确诊标准化", data:"TatalConfirmedNorm"},
        {title: "总康复标准化", data:"TatalCuredNorm"},
        {title: "总死亡标准化", data:"TatalDeadNorm"},
        {title: "总在治标准化", data:"TatalTreatingNorm"},
        ]},
];

var TypeCompare = [
    {title: "确诊数", data:[{title: "", data:"ConfirmedCount"}]},
    {title: "康复数", data:[{title: "", data:"CuredCount"}]},
    {title: "死亡数", data:[{title: "", data:"DeadCount"}]},
    {title: "在治数", data:[{title: "", data:"TreatingCount"}]},
    {title: "康复率", data:[{title: "", data:"CuredRate"}]},
    {title: "死亡率", data:[{title: "", data:"DeadRate"}]},
    {title: "在治率", data:[{title: "", data:"TreatingRate"}]},
    {title: "死亡除康复", data:[{title: "", data:"DeadDivideCured"}]},
    {title: "康复除死亡", data:[{title: "", data:"CuredDivideDead"}]},
    {title: "确诊标准化", data:[{title: "", data:"ConfirmedNorm"}]},
    {title: "康复标准化", data:[{title: "", data:"CuredNorm"}]},
    {title: "死亡标准化", data:[{title: "", data:"DeadNorm"}]},
    {title: "在治标准化", data:[{title: "", data:"TreatingNorm"}]},
    {title: "死亡除康复标准化", data:[{title: "", data:"DeadDivideCuredNorm"}]},
    {title: "康复除死亡标准化", data:[{title: "", data:"CuredDivideDeadNorm"}]},
    {title: "总确诊标准化", data:[{title: "", data:"TatalConfirmedNorm"}]},
    {title: "总康复标准化", data:[{title: "", data:"TatalCuredNorm"}]},
    {title: "总死亡标准化", data:[{title: "", data:"TatalDeadNorm"}]},
    {title: "总在治标准化", data:[{title: "", data:"TatalTreatingNorm"}]},
];

var Params = {
    Type: "Simulate", // Simulate Compare Detail
    DataUrl:"http://127.0.0.1:8081/data", //'https://zyq5945.github.io/DXY-COVID-19-Data-Arrange-DJSON/data'
    Name: "湖北",
    Parents: "湖北,广东",
    Children: "湖北-荆门,湖北-襄阳,广东-广州,广东-深圳",
    "MinDay": 0,
    "MaxDay": 90,
    "DaysOfTreatment": 18,
    "A1": 0,
    "A2": 0,
    "X0": 0,
    "Dx": 0,
    "K": 0,
    "B": 0,
};

var UrlNames = [];


//https://blog.csdn.net/weixin_42971942/article/details/87384754
function findCloseIndex(arr, num, col) {
  var ret = arr[0][col];
  var index = 0;
  var distance = Math.abs(ret - num);
  for (var i = 1; i < arr.length; i++) {
    var newDistance = Math.abs(arr[i][col] - num);
    if (newDistance < distance) {
      distance = newDistance;
      ret = arr[i][col];
      index = i;
    }
  }
  return index;
}


function simulateCuredFunc(x, params) {
    if (params.dx == 0) {
        return NaN;
    }
    var y = params.A2 + (params.A1 - params.A2) / (1 + Math.exp((x - params.X0) / params.Dx))
    return y <0 ?0: y;
}

function simulateDeadFunc(x, params) {
    if (params.K == 0) {
        return NaN;
    }
    var y = params.K * x + params.B;
    return y <0 ?0: y;
}

function createSimulateData(xMin, xMax, xStep, params) {
    var xSize = (xMax - xMin) / xStep;
    var ret = Array.from({length: xSize},(z, i) => {
            var x = xMin + xStep * i;
            return {
                TimeOffset: x,
                CuredCount: simulateCuredFunc(x, params),
                DeadCount: simulateDeadFunc(x, params),
            }
        });
    var len = ret.length;
    for (var i=len-1; i>=0; i--) {
        var item = ret[i];
        var x = item.TimeOffset - params.DaysOfTreatment;
        var sum = item.CuredCount + item.DeadCount;
        var idx = findCloseIndex(ret, x, "TimeOffset");
        ret[idx].ConfirmedCount = sum;
        if (idx == 0) {
            break;
        }
    }


    return ret;
}

function allMax(data, cols) {
    var vals = cols.map(x=> d3.max(data, d =>d.Get(x)));
    return d3.max(vals);
}

function allMin(data, cols) {
    var vals = cols.map(x=> d3.min(data, d =>d.Get(x)));
    return d3.min(vals);
}

function allMax2(data, cols) {
    return d3.max(data.map(x=> allMax(x, cols)));
}

function allMin2(data, cols) {
    return d3.min(data.map(x=> allMin(x, cols)));
}

function allLine(xName, yNames, x, y) {
    var vals = yNames.map(yName => d3.line()
        .defined(d => isValidNum(d.Get(yName)) && isValidNum(d.Get(xName)))
        .x(d => x(d.Get(xName)))
        .y(d => y(d.Get(yName))));

    return vals;
}

function tipCallback(g, value){
  if (!value) return g.style("display", "none");

  g.style("display", null)
      .style("pointer-events", "none")
      .style("font", "10px sans-serif");

  const path = g.selectAll("path")
    .data([null])
    .join("path")
      .attr("fill", "white")
      .attr("stroke", "black");

  const text = g.selectAll("text")
    .data([null])
    .join("text")
    .call(text => text
      .selectAll("tspan")
      .data((value + "").split(/\n/))
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .style("font-weight", (_, i) => i ? null : "bold")
        .text(d => d));

  const {x, y, width: w, height: h} = text.node().getBBox();

  text.attr("transform", `translate(${-w / 2},${15 - y})`);
  path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
}

function initD3Tip(svg, optional, x, y, cb) {
    const tooltip = svg.append("g");
    svg.on(`touchmove${optional} mousemove${optional}`, function() {
        var m = d3.mouse(this);
        var mx = m[0];
        var my = m[1];
        var mX = x.invert(mx);
        var mY = y.invert(my);


        tooltip
            .attr("transform", `translate(${x(mX)},${y(mY)})`)
            .call(tipCallback, cb(mX, mY));
    });

    svg.on(`touchend${optional} mouseleave${optional}`, () => tooltip.call(tipCallback, null));

}

function simpleShow(root, data1, data2, group, groupIndex, params, sCount, cb_line, cb_legend) {

  var key = group.title;
  var yNames = group.data.map(x=> x.data);
  var yTitles = group.data.map(x=> x.title);

  var margin1 = {top: 20, right: 30, bottom: 30, left: 45};


  var height1 = isValidNum(params.Height)? params.Height : 500;

  var node = root
        .append("div")
        .attr("name", key)
        .attr("class", "childDiv")
        .style("width", params.Width);
  var width = node.node().clientWidth;
  var xName = 'TimeOffset';
  var xNames = [xName];

  function checkDay(d) {
    var v = d[xName];
    return  v >= params.MinDay && v <= params.MaxDay;
  }

  data1 = data1.map(x=> x.filter(checkDay));
  data2 = data2.map(x=> x.filter(checkDay));

  var allData = data1.concat(data2);
  data1.forEach(x=> x.forEach(y =>Object.assign(y, DataItem)));
  if (data2.length == 1 ){
    var Count = Object.assign({Count:sCount[0]});
    data2.forEach(x=> x.forEach(y =>Object.assign(y, Count)));
  }


  var xx1r = [allMin2(allData, xNames), allMax2(allData, xNames)];
  var xx1 = d3.scaleLinear()
    .domain(xx1r).nice()
    .range([margin1.left, width - margin1.right]);


  var yy1r = [allMin2(allData, yNames), allMax2(allData, yNames)];
  var yy1 = d3.scaleLinear()
    .domain(yy1r).nice()
    .range([height1 - margin1.bottom, margin1.top])

  var lines = allLine(xNames, yNames, xx1, yy1);

  var xAxis1 = g => g
    .attr("transform", `translate(0,${height1 - margin1.bottom})`)
    .call(d3.axisBottom(xx1).ticks(width / 80).tickSizeOuter(0))


  var yAxis1 = g => g
    .attr("transform", `translate(${margin1.left},0)`)
    .call(d3.axisLeft(yy1))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(key));

  cb_legend(node, viewBox, margin1, key, groupIndex, yNames, yTitles);

  var viewBox = [0, 0, width, height1];
  const svg = node
        .append("svg")
        .attr("class", "svg")
        .attr("viewBox", viewBox);

  svg.append("g")
      .call(xAxis1);

  svg.append("g")
      .call(yAxis1);


  const linesCreator = (data, label)=> {
      data.forEach((item, i) => {
            lines.forEach((line1, index) => {
            svg.append("path")
              .datum(item)
              .attr("fill", "none")
              .attr("stroke-width", 2)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("d", line1)
              .call(cb_line, i, index, key, label, yNames[index], yTitles[index]);
          });
      });
  }

  var dateBegin = new Date(params.StartTime.replace(/-/g, "/"));
  function xyPrint(x, y) {
        var sX = x.toFixed(0);
        var n = 0;
        if (y < 0.01) {
            n = 5;
        }
        else if (y < 1){
            n = 3;
        }


        var date = new Date(dateBegin);

        date.setDate(dateBegin.getDate() + x);

        var sY = y.toFixed(n);

        return `X:${sX}\nY:${sY}\n${(date.getMonth()+1)}/${(date.getDate())}`;
  }

  initD3Tip(svg, ".tooltip", xx1, yy1, xyPrint);

  linesCreator(data1, "detail");
  linesCreator(data2, "simulate");

}

function getUrl(name) {
    var url = Params.DataUrl;
    if (name.includes("-")) {
        name = name.replace("-", "/");
        url = `${url}/ChildDetail/${name}.json`;
    }
    else {

        url = `${url}/ParentDetail/${name}.json`;
    }
    return url;
}


function setTitle(text) {
    d3.select("#title").text(text);
    d3.select("title").text(text);
}

function getAllUrls() {
    var type = Params.Type;
    var ret = [];
    switch (type) {
        case "Simulate":
            d3.select("#simulate").style("display", "inline");
        case "Detail":
            ret.push(Params.Name);
        break;
        case "Compare":
            ret = Params.Name.split(",").filter(x => x);
        break;
    }

    UrlNames = ret;
    setTitle(`${TypeName[type]}: ${ret.join(" ")}`);
    return ret.map(x=> getUrl(x));
}

function createChildren(data) {

    var typeGroup = {
        Simulate : TypeSimulate,
        Detail: TypeSimulate,
        Compare : TypeCompare,
    };

    var colors = d3.scaleOrdinal(["Wholesale and Retail Trade", "Manufacturing", "Leisure and hospitality", "Business services", "Construction", "Education and Health", "Government", "Finance", "Self-employed", "Other"], d3.schemeTableau10);
    var params = Params;
    var type = params.Type;
    var isCompare = type == "Compare";
    var groups = typeGroup[type];
    var urlNames = UrlNames;


    function cb_line(g, i, j, key, label, data, title) {
        var index =isCompare ? i:j;
        var name = isCompare ? urlNames[i] : title;
        var f = label=="detail"? f => f:
            f => f.attr("stroke-dasharray", "8 5");
        g.attr("data-name", name)
            .attr("stroke", colors(index))
            .call(f);
    }

    var templateBtns = $("#ChartSelect")[0].innerHTML;
    function cb_legend(parent, viewBox, margin, key, groupIndex, yNames, yTitles) {
        var names =isCompare ? urlNames : yTitles;
        var prop = "data-name";
        //var id = `line_${groupIndex}`;
        var node = parent.append("div")
            //.attr("id", id)
            .attr("class", "lineSelect");

        node.html(templateBtns);

        node.selectAll("label")
            .data(names)
            .join("label")
            .attr("class", "legendText")
            .html((d,i)=> `<input name=${d} type="checkbox" checked="checked"/><span style="color:${colors(i)}">&#9608;</span><span>${d}</span> `);


        function checkboxClick() {
            var name = this.name;
            var show = this.checked? "visible":"hidden";
            parent.selectAll(`path[${prop}=${name}]`)
                .attr("visibility", show);
        }
        var allCheckbox = parent.selectAll("input");
        allCheckbox.on("click", checkboxClick);

        d3BtnSelectClick(parent, function() {
            allCheckbox.each(checkboxClick);
        });

    }


    //d3.select("#loading").remove();

    var root = d3.select("#root");
    var clearClick = function() {
        root.selectAll(".childDiv").remove();
    };

    var keys = groups.map(x=> x.title);
    function chartSelectClick(data) {
        d3.selectAll(`div.childDiv`).each(function() {
            var node = d3.select(this);
            var name = node.attr("name");
            node.style('display',data.includes(name)? 'inline-block': 'none');
        });
    };

    var storeName = "ChartSelect-" + params.Type;

    divSelectClick("ChartSelect", keys, chartSelectClick, storeName);

    var createClick = function() {
        jdx("input").get(params);
        objectValuesToNumber(params);

        var sData = [];
        var sCount = [];
        if (params.Type == "Simulate") {
            sData = [createSimulateData(params.MinDay, params.MaxDay, 0.5, params)];
            var dataItem = Object.assign({}, DataItem, DataItem2);
            sData.forEach(x=> x.forEach(y =>Object.assign(y, dataItem)));
            sCount = sData.map(x => {
                return {
                    MinConfirmedCount : allMin(x, ['ConfirmedCount']),
                    MinCuredCount : allMin(x, ['CuredCount']),
                    MinDeadCount : allMin(x, ['DeadCount']),
                    MinTreatingCount : allMin(x, ['TreatingCount']),
                    MinDeadDivideCured : allMin(x, ['DeadDivideCured']),
                    MinCuredDivideDead : allMin(x, ['CuredDivideDead']),
                    MaxConfirmedCount : allMax(x, ['ConfirmedCount']),
                    MaxCuredCount : allMax(x, ['CuredCount']),
                    MaxDeadCount : allMax(x, ['DeadCount']),
                    MaxTreatingCount : allMax(x, ['TreatingCount']),
                    MaxDeadDivideCured : allMax(x, ['DeadDivideCured']),
                    MaxCuredDivideDead : allMax(x, ['CuredDivideDead']),
                }
              });
        }


        clearClick();

        groups.forEach((group, groupIndex) => simpleShow(root, data, sData, group, groupIndex, params, sCount, cb_line, cb_legend));

        chartSelectClick(window[storeName]);
    };

    createClick();

    $("#btnShow").off("click").on("click", createClick);
    $("#btnClear").off("click").on("click", clearClick);

    document.onkeydown = function(e){
    if((e||event).keyCode==13)
        createClick();
    };

}

function init() {

    $.ajaxSetup({cache:false});

    var query = Url.parseQuery();
    Object.assign(Params, query);
    jdx("input").set(Params);
    var urls = getAllUrls();
    jqueryBatchAjax(urls, createChildren);
}

$(document).ready(function () {
    init();
});
