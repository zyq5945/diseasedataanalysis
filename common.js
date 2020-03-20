
function loadingShow() {
    $("#loading").css("display", "block");
}

function loadingHide() {
    $("#loading").css("display", "None");
}

function arrayMap(a, cb = function(x) {return x;}) {
    var len = a.length;
    var r = [];
    for (var i=0; i<len; i++) {
        r.push(cb.call(this, a[i], i, a));
    }
    return r;
}

function arrayUnique(a, cb = function(x) {return x;}) {
    var len = a.length;
    var r = [];
    for (var i=0; i<len; i++) {
        var v = cb.call(this, a[i], i, a);
        if (!r.includes(v)) {
             r.push(v);
        }
    }
    return r;
}


function windowCall(cb, timer = 0) {
    setTimeout(cb.call(window), timer);
}

function jqueryBatchAjax(urls, success, error = null) {
    loadingShow();
    return $.when.apply(this, urls.map(x => $.ajax({type: 'get',url: x, dataType: 'json',crossDomain: true})))
        .then(function() {
            var v = arguments;
            var ret = urls.length == 1? [v[0]]: arrayMap(arguments, function(x) {return x[0];});

            loadingHide();
            windowCall(function() {
                success(ret);
            });
        },
        function(err) {
            console.error("---jqueryBatchAjax error---:",err);
            loadingHide();
            if (error != null) {
                var msg = ` status:${err.status}\n readyState:${err.readyState}\n statusText:${err.statusText}`;
                windowCall(function() {
                    error(msg);
                });
            }
        })
}


function objectValuesToNumber(obj) {
    for (var key in obj) {
        var val = new Number(obj[key]);
        if (!isNaN(val)) {
            obj[key] = val;
        }
    }
}

function isValidNum(v) {
    return v!== null
        && v!== undefined
        && !isNaN(v)
        && isFinite(v);
}


function valueDiv(v1, v2) {
    var v = Number.NaN;
    if (v2 != 0 && isValidNum(v2) && isValidNum(v1)) {
        v = v1 / v2;
    }
    return v;
}

function valueNorm(v, vMin, vMax) {
    var r = Number.NaN;
    if (isValidNum(v)
        && isValidNum(vMin)
        && isValidNum(vMax)
        && vMin < vMax) {
        r = valueDiv(v - vMin, vMax -vMin);
    }
    return r;
}

// https://blog.csdn.net/qq_39408204/article/details/90438390
var Storage = {

    set:function(key, value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get:function (key, defVal = null){
        var v = localStorage.getItem(key);
        if (v)
            return JSON.parse(v);
        else
            return defVal;
    },
    exist:function (key){
        return localStorage.getItem(key);
    },
    remove:function (key){
        localStorage.removeItem(key);
    }

}

function nameCompare(param1, param2) {
    return param1.localeCompare(param2);
}


function initCheckboxs(parent, names, storeName = null, group = "chk", className = "chkDiv"){
    var s = storeName? Storage.get(storeName, {}) : {};
    var cs = s[group] || [];
    var ns = s.names || [];
    if (storeName) {
        window[storeName] = ns.length == names.length && ns.every((x, i)=> x == names[i])? cs : names;
    }

    d3.select(`#${parent}`)
        .selectAll("label")
        .data(names)
        .join("label")
        .attr("class", className)
        .html(d => {
            var checked = ns.includes(d)? (cs.includes(d)? "checked": "") : "checked"
            return `<input name=${group} type="checkbox" class=${className} value=${d} ${checked}/><span>${d}</span>`
            });

    function changeClick() {
        var obj = {names};
        jdx(parent).get(obj);
        if (storeName) {
            Storage.set(storeName, obj);
            window[storeName] = obj[group];
        }
        return obj[group];
    }

    return changeClick;
}

function btnSelectClick(id, cb) {
    $(`${id} .btnAllSelect`).off("click").on("click", function() {
        $(`${id} input:checkbox`).each(function() {
            this.checked = true;
        });
        cb.call(this);
    });
    $(`${id} .btnUnSelect`).off("click").on("click", function() {
        $(`${id} input:checkbox`).each(function() {
            this.checked = false;
        });
        cb.call(this);
    });
    $(`${id} .btnReverse`).off("click").on("click", function() {
        $(`${id} input:checkbox`).each(function() {
            this.checked = !this.checked;
        });
        cb.call(this);
    });
}

function d3BtnSelectClick(node, cb) {
    var list = node.selectAll(`input[type='checkbox']`);
    node.select(`.btnAllSelect`).on("click", function() {
        list.each(function() {
            this.checked = true;
        });
        cb.call(this);
    });
    node.select(`.btnUnSelect`).on("click", function() {
        list.each(function() {
            this.checked = false;
        });
        cb.call(this);
    });
    node.select(`.btnReverse`).on("click", function() {
        list.each(function() {
            this.checked = !this.checked;
        });
        cb.call(this);
    });
}

function divSelectClick(id, names, cb, storeName = null) {
    var cc = initCheckboxs(id, names, storeName);

    function reCall() {
        var data = cc();
        cb.call(this, data, names);
    };

    var node = d3.select(`#${id}`);
    d3BtnSelectClick(node, reCall);

    node.selectAll(`input[type='checkbox']`).on("click", reCall);
}
