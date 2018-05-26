var TilePropertyEditor = function () {
	this.panel = $("tilePropertyEditor");

	this.id = $("tilePropertyEditor_ItemID");
	this.refId = $("tilePropertyEditor_RefID");

	this.size = {
		width: $("tilePropertyEditor_Width"),
		depth: $("tilePropertyEditor_Depth"),
		height: $("tilePropertyEditor_Height")
	};

	this.rotation = {
		x: $("tilePropertyEditor_RX"),
		y: $("tilePropertyEditor_RY"),
		z: $("tilePropertyEditor_RZ")
	};

	this.isOpen = false;
	this.tile = null;

	var that = this;
	this.rotation.y.on("change", function (event) {
		if (that.tile) {
			that.tile.style.transform = "rotate(" + event.target.value + "deg)";
		}
		that.save();
	}, false);

	this.refId.on("change", function (event) {
		that.setTileRefId(this.value);
		that.save();
	}, false);
};

TilePropertyEditor.prototype.setTileRefId = function (refId) {
	if (this.tile && +refId|0 !== 0) { console.log(refId)
		var span = this.tile.getElementsByTagName("span");
	    var elem = span.length ? span[0] : null;

	    if (!elem) {
	        elem = document.createElement("span");
	        this.tile.appendChild(elem);
	    }

	    elem.innerHTML = refId;
	}
};

TilePropertyEditor.prototype.show = function (tile) {
	this.save();
	this.tile = null;

    var temp = tile.getAttribute("params");
    var params = temp ? JSON.parse(temp) : null;

    if (params) {
    	params.id = +params.id|0;
    	params.refId = +params.refId|0;
    	params.width = +params.width|0;
    	params.height = +params.height|0;
    	params.depth = +params.depth|0;
    	params.rx = +params.rx|0;
    	params.ry = +params.ry|0;
    	params.rz = +params.rz|0;
    }
    else {
    	params = {
    		id: 0,
    		refId: 0,
    		width: 1,
	    	height: 1,
	    	depth: 1,
	    	rx: 0,
	    	ry: 0,
	    	rz: 0
	    };
    }

	this.panel.style.display = "block";
	this.id.value = params.id;
	this.refId.value = params.refId;
	this.size.width.value = params.width; 
	this.size.height.value = params.height; 
	this.size.depth.value = params.depth; 
	this.rotation.x.value = params.rx; 
	this.rotation.y.value = params.ry; 
	this.rotation.z.value = params.rz; 
	this.tile = tile;

	this.isOpen = true;
};

TilePropertyEditor.prototype.close = function () {
	this.panel.style.display = "none";
	this.save();
	this.tile = null;
	this.isOpen = false;
}

TilePropertyEditor.prototype.save = function () {
	if (this.tile) {
		var params = {
			id: this.id.value,
			refId: this.refId.value,
			width: this.size.width.value,
			height: this.size.height.value,
			depth: this.size.depth.value,
			rx: this.rotation.x.value,
			ry: this.rotation.y.value,
			rz: this.rotation.z.value
		};

		if (params.refId) {
			this.setTileRefId(params.refId);
		}

		var paramsStr = JSON.stringify(params);

		this.tile.setAttribute('params', paramsStr);

		if (+params.ry|0 !== 0) {
			this.tile.style.transform = "rotate(" + params.ry + "deg)";
		}

		var temp = this.tile.id.split("_"),
			x = +temp[2]|0,
			y = +temp[1]|0;
      
        MazeLevel.layers[MazeEditor.layerId].params[(x + y * MazeLevel.map.width)] = paramsStr; 
	}
};