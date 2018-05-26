var LevelPropertyEditor = function (editor) {
	this.panel = $("LevelPropertyEditor");
	this.editor = editor;

	this.id = $("mapId");
	this.name = $("mapName");

	this.endConditions = {
		end: $("endCondition1"),
		time: $("endCondition2"),
		crystals: $("endCondition3"),
		required: $("endCondition4")
	};

	this.map = {
		width: $("mapWidth"),
		height: $("mapHeight"),
		depth: $("mapDepth")
	};

	this.tile = {
		width: $("tileWidth"),
		height: $("tileHeight")
	}; 

	this.isOpen = false;
};

LevelPropertyEditor.prototype.updateEditor = function (level) {
	this.endConditions.end.checked = level.map.endConditions.end ? true : false;
	this.endConditions.time.value = +level.map.endConditions.time|0;
	this.endConditions.crystals.value = +level.map.endConditions.crystals|0;
	this.endConditions.required.value = level.map.endConditions.requiredItems.length ? level.map.endConditions.requiredItems.join(", ") : "";

	this.map.width.value = level.map.width;
    this.map.height.value = level.map.height;
    this.map.depth.value = level.map.depth;
    this.tile.width.value = level.tile.width;
    this.tile.height.value = level.tile.height;
    this.name.value = level.name;
    this.id.value = level.id;
};

LevelPropertyEditor.prototype.updateLevel = function (level) {
	var required = this.endConditions.required.value.split(",");

	$.forEach(required, function (i, e) {
		required[i] = required[i].trim();
	});

	level.map.endConditions.end = this.endConditions.end.checked ? true : false;
	level.map.endConditions.time = +this.endConditions.time.value|0;
	level.map.endConditions.crystals = +this.endConditions.crystals.value|0;
	level.map.endConditions.requiredItems = this.endConditions.required.value !== "" ? required : [];

	level.map.width = this.map.width.value
    level.map.height = this.map.height.value
    level.map.depth = this.map.depth.value
    level.tile.width = this.tile.width.value
    level.tile.height = this.tile.height.value
    level.name = this.name.value;
    level.id = this.id.value;
};

LevelPropertyEditor.prototype.show = function (tile, params) {
	this.panel.style.display = "block";
	this.isOpen = true;
};

LevelPropertyEditor.prototype.close = function () {
	this.panel.style.display = "none";
	this.isOpen = false;
}