Element.prototype.on = Element.prototype.addEventListener;
Element.prototype.off = Element.prototype.removeEventListener;

var $ = function(e) {
	return (e[0] == ".") ? document.querySelectorAll(e) : document.getElementById(e);
};

$.ajax = function (params) {
	var successCB = params.success || function(s) {};
	var failCB = params.fail || function() {};
	var xhr = new XMLHttpRequest();

	var handleXHRResponse = function (xhr) {
		if (xhr.status == 200) {
			successCB(xhr.responseText);
		}
		else if (xhr.status == 404 || xhr.status == 500) {
			failCB(xhr.responseText);
		}
	};
	
	if (params.method == "POST") {
		xhr.open("POST", params.url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				handleXHRResponse(xhr);
			}
		};
		xhr.send(params.data || null);
	}
	else {
		var fUrl = params.data ? [params.url, "?", params.data].join("") : params.url;
		xhr.open("GET", fUrl, true);
		xhr.onreadystatechange = function() { 
			if (xhr.readyState == 4) {
				handleXHRResponse(xhr);
			}    
		};
		xhr.send(null);
	}
};

$.forEach = function (element, callback) {
	if (element.length) { 
		for (var i = 0, l = element.length; i < l; i++) {
			callback(i, element[i]);
		}
	}
	else {
		for (var i in element) {
			callback(i, element[i]);
		}
	}
};

$.notify = function (name, params) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(name, true, false);
   
    if (typeof(params) === "object") {
        for(var i in params) {
            event[i] = params[i];
        }
    }
    
    document.dispatchEvent(event);
};