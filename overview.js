
var Columns_Parent =[
    { "title":"天差", "data": "TimeOffset" },
    { "title":"更新时间", "data": "UpdateTime" },
    { "title":"名称", "data": "ParentName" },
    { "title":"确诊数", "data": "ParentConfirmedCount" },
    { "title":"康复数", "data": "ParentCuredCount" },
    { "title":"死亡数", "data": "ParentDeadCount" },
    { "title":"在治数", "data": "ParentTreatingCount" },
    { "title":"康复率", "data": "ParentCuredRate" },
    { "title":"死亡率", "data": "ParentDeadRate" },
    { "title":"在治率", "data": "ParentTreatingRate" },
    { "title":"死亡除康复", "data": "ParentDeadDivideCured" },
    { "title":"康复除死亡", "data": "ParentCuredDivideDead" },
];


var Columns_Child =[
    { "title":"天差", "data": "TimeOffset" },
    { "title":"更新时间", "data": "UpdateTime" },
    { "title":"省份", "data": "ParentName" },
    { "title":"市区", "data": "ChildName" },
    { "title":"确诊数", "data": "ChildConfirmedCount" },
    { "title":"康复数", "data": "ChildCuredCount" },
    { "title":"死亡数", "data": "ChildDeadCount" },
    { "title":"在治数", "data": "ChildTreatingCount" },
    { "title":"康复率", "data": "ChildCuredRate" },
    { "title":"死亡率", "data": "ChildDeadRate" },
    { "title":"在治率", "data": "ChildTreatingRate" },
    { "title":"死亡除康复", "data": "ChildDeadDivideCured" },
    { "title":"康复除死亡", "data": "ChildCuredDivideDead" },
];

var SelectMsg = "请点击选择一些数据，再点击相应操作!";

var LoadDataErrorMsg = "数据加载失败，请检查数据地址是否正确!\n";
var SimulateErrorMsg = "仿真数据加载失败，仿真功能将被禁用!\n";


var DataUrls = [
    "Total.json",
    "LastParents.json",
    "LastChildren.json",
];

var SimulateUrls = [
    "ParentsBoltzmann.json",
    "ChildrenBoltzmann.json",
];

var Params = {
    //Url:"http://127.0.0.1:8081/data",
    "DataUrl":"https://zyq5945.github.io/DXY-COVID-19-Data-Arrange-DJSON/data",
    "MinDay": 0,
    "MaxDay": 90,
    "DaysOfTreatment": 18,
    "Width": "100%",
    "Height": 600,
    "StartTime": "2020-01-24",
}

var SimulateData = { Parents:[], Children:[]};

var IsFrame = false;


var jdxLoad = jdx("load");

var Tables = [];

function fetch_data(data) {

    Tables.forEach(x=> x.destroy());
    Tables.length = 0;

    function fmtRate(tds, index, cols, data) {
        var len = index+3;
        for (var i=index; i<len; i++) {
            var v = data[cols[i].data];
            if (isValidNum(v)) {
                v = Math.round(v * 10000) / 100;
                tds.eq(i).text(`${v}%`);
            }
        }
    }

    var columns_p = Columns_Parent;
    var columns_c = Columns_Child;
    var dataTotal = data[0];
    var dataLastParents = data[1];
    var dataLastChildren = data[2];

    var names = dataLastParents.map(x=> x.ParentName).sort(nameCompare);

    function createTableDrawCb(n) {
        return function () {
            var table = Tables[n];
            if (table) {
                table.draw();
            }
        }
    };

    divSelectClick("LastParentsName", names, createTableDrawCb(1), "LastParentsName");
    divSelectClick("LastChildrenName", names, createTableDrawCb(2), "LastChildrenName");

    var tbl_order = 3;
    var tbl_offset = 4;
    var columns = columns_p;
    var table_tps =  $('#Total').DataTable({
        "paging":   false,
        "ordering": false,
        "info":     false,
        "searching": false,
        //"order": [[ tbl_order, "desc" ]],
        columns : columns,
        data : dataTotal,
        createdRow : function ( row, data, index ) {
            fmtRate($('td', row), tbl_order+ tbl_offset, columns, data);
        }});

    var table_lps =  $('#LastParents').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "searching": true,
        "order": [[ tbl_order, "desc" ]],
        columns : columns,
        data : dataLastParents,
        createdRow : function ( row, data, index ) {
            fmtRate($('td', row), tbl_order+ tbl_offset, columns, data);
        }});

    tbl_order = 4;
    columns = columns_c;
    var table_lcs =$('#LastChildren').DataTable({
        "paging":   true,
        "ordering": true,
        "info":     true,
        "searching": true,
        //"stateSave" : true,
        "order": [[ tbl_order, "desc" ]],
        columns : columns,
        data : dataLastChildren,
        createdRow : function ( row, data, index ) {
            fmtRate($('td', row), tbl_order+ tbl_offset, columns, data);
        }});

    Tables = [table_tps, table_lps, table_lcs];

    $("tbody").off("click",'tr');

    $('tbody').on("click", 'tr', function () {
        $(this).toggleClass('selected');
    });

    window.getSelectRows = function() {
        var names = arrayMap(table_lps.rows('.selected').data().map(x => x.ParentName))
            .concat(arrayMap(table_lcs.rows('.selected').data().map(x => x.ParentName + "-" + x.ChildName)))
        return names;
    };


    var urls = SimulateUrls.map(x=> Params.DataUrl +"/" + x);
    jqueryBatchAjax(urls,
        data=> {
            SimulateData.Parents = data[0];
            SimulateData.Children = data[1];
            $("button[name='Simulate']").attr("disabled",false);
        },
        error => {
            $("button[name='Simulate']").attr("disabled",true);
            alert(SimulateErrorMsg + error);
            //alert(SimulateErrorMsg);
        });

}

function load_data() {
    jdxLoad.get(Params);

    var urls = DataUrls.map(x=> Params.DataUrl +"/" + x);
    jqueryBatchAjax(urls,
    fetch_data,
    error => {
        alert(LoadDataErrorMsg + error);
        //alert(LoadDataErrorMsg);
    });

}

function createUrl(obj) {
    var s = Url.stringify(obj);
    var url = "detail.html?" + s;
    console.log("---url:", url);
    return url;
}

function detailClick(type) {

    var names = getSelectRows();
    if (names.length <=0) {
        alert(SelectMsg);
        return;
    }

    jdxLoad.get(Params);
    var ret = Object.assign({Type:type}, Params);

    var urls = [];
    if (type == 'Compare') {
        Object.assign(ret, {Name :names});
        urls.push(createUrl(ret));
    }
    else {
        var isSimulate = type == 'Simulate';
        var listParent = SimulateData.Parents;
        var listChild = SimulateData.Children;
        names.forEach(x => {
            ret.Name = x;
            if (isSimulate) {
                var data = x.includes("-")? listChild : listParent;
                var p = data.find(y=> y.Name == x) || {};
                Object.assign(ret, p)
            }

            urls.push(createUrl(ret));
        });
    }


    if (IsFrame) {
        d3.select("#divFrame")
            .selectAll("iframe")
            .data(urls)
            .join("iframe")
            .attr("src", d=>d);
    }
    else {
        d3.select("#divFrame")
            .selectAll("iframe")
            .remove();
        urls.forEach(x => window.open(x, "_blank"));
    }
}

function loadClick() {
    load_data();
    Storage.set("cfg", Params);
}

$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var id = $(settings.nTable).attr("name");
        var names = window[id];
        if (!names) {
            return true;
        }
        var name = data[2];

        if (names.includes(name))
        {
            return true;
        }
        return false;
    }
);


$(document).ready(function() {

    Object.assign(Params, Storage.get("cfg", {}), Url.parseQuery());
    IsFrame = Storage.get("IsFrame", false);

    chkFrame.prop('checked', IsFrame);
    jdxLoad.set(Params);

    $("#btnLoad").click(loadClick);
    $(".btnOption").click(function() {
        var type = this.name;
        detailClick(type);
    });
    $(".btnClsSel").click(function() {
        $("tr").removeClass('selected');
    });
    var chkFrame = $("input.Frame");
    chkFrame.click(function() {
        var status = $(this).is(':checked');
        chkFrame.prop('checked', status);
        IsFrame = status;
        Storage.set("IsFrame", IsFrame);
    });

    load_data();
});