var DataItem = {
};

DataItem.IsParent = function() {
    return !("ChildName" in this)
}

DataItem.Name = function() {
    return this.IsParent()? this.ParentName: this.ParentName + "-" + this.ChildName;
}

DataItem.Get = function(col) {
    var item = this;
    var name = col in item? col: ( "ChildName" in item? "Child" + col: "Parent" + col);
    var r = Number.NaN;
    if (name in item) {
        if (typeof item[name] == "function") {
            r = item[name].call(item);
        }
        else {
            r = item[name]
        }
    }
    return r == 0 || r? r : Number.NaN;
}


DataItem.TreatingCount = function(v) {
    return this.Get("ConfirmedCount") - this.Get("CuredCount")- this.Get("DeadCount");
}

DataItem.CuredRate = function(v) {
    return valueDiv(this.Get("CuredCount") , this.Get("ConfirmedCount"));
}

DataItem.DeadRate = function(v) {
    return valueDiv(this.Get("DeadCount"), this.Get("ConfirmedCount"));
}

DataItem.TreatingRate = function(v) {
    return valueDiv(this.Get("TreatingCount"), this.Get("ConfirmedCount"));
}

DataItem.DeadDivideCured = function(v) {
    return valueDiv(this.Get("DeadCount") , this.Get("CuredCount"));
}

DataItem.CuredDivideDead = function(v) {
    return valueDiv(this.Get("CuredCount") , this.Get("DeadCount"));
}


var DataItem2 = {
};

DataItem2.ConfirmedNorm = function(v) {
    return valueNorm(this.Get("ConfirmedCount") ,this.Count.MinConfirmedCount, this.Count.MaxConfirmedCount);
}

DataItem2.CuredNorm = function(v) {
    return valueNorm(this.Get("CuredCount") ,this.Count.MinCuredCount, this.Count.MaxCuredCount);
}

DataItem2.ConfirmedNorm = function(v) {
    return valueNorm(this.Get("ConfirmedCount") ,this.Count.MinConfirmedCount, this.Count.MaxConfirmedCount);
}

DataItem2.ConfirmedNorm = function(v) {
    return valueNorm(this.Get("ConfirmedCount") ,this.Count.MinConfirmedCount, this.Count.MaxConfirmedCount);
}

DataItem2.ConfirmedNorm = function(v) {
    return valueNorm(this.Get("ConfirmedCount") ,this.Count.MinConfirmedCount, this.Count.MaxConfirmedCount);
}

DataItem2.DeadNorm = function(v) {
    return valueNorm(this.Get("DeadCount") ,this.Count.MinDeadCount, this.Count.MaxDeadCount);
}

DataItem2.TreatingNorm = function(v) {
    return valueNorm(this.Get("TreatingCount") ,this.Count.MinTreatingCount, this.Count.MaxTreatingCount);
}

DataItem2.DeadDivideCuredNorm = function(v) {
    return valueNorm(this.Get("DeadDivideCured") ,this.Count.MinDeadDivideCured, this.Count.MaxDeadDivideCured);
}

DataItem2.CuredDivideDeadNorm = function(v) {
    return valueNorm(this.Get("CuredDivideDead") ,this.Count.MinCuredDivideDead, this.Count.MaxCuredDivideDead);
}

//DataItem.TatalConfirmedNorm = function(v) {
//    return this.Get("CuredCount") / this.Get("ConfirmedCount");
//}
//DataItem.TatalSuspectedNorm = function(v) {
//    return this.Get("CuredCount") / this.Get("ConfirmedCount");
//}
//DataItem.TatalCuredNorm = function(v) {
//    return this.Get("CuredCount") / this.Get("ConfirmedCount");
//}
//DataItem.TatalDeadNorm = function(v) {
//    return this.Get("CuredCount") / this.Get("ConfirmedCount");
//}
//DataItem.TatalTreatingNorm = function(v) {
//    return this.Get("CuredCount") / this.Get("ConfirmedCount");
//}
