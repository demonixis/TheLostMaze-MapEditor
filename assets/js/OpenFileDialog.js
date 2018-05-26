var OpenFileDialog = function (openCallback) {
	var mapFile = $("mapFile");

	// Open.
	$("btnOpenLevel").on("click", function (event) {
		mapFile.click();
	}, false);

	// Load file.
	mapFile.on("change", function (event) {
		var files = event.target.files;

		if (files.length) {
			var reader = new FileReader();
			reader.onload = function (event) {
				if (files[0].type === "text/xml") {
					var json = xml2JSON(event.target.result);
					openCallback(JSON.stringify(json));
				}
				else {
					openCallback(event.target.result);
				}
			};
			reader.readAsText(files[0]);
		}
	}, false);

	function xml2JSON(response) {
		var parser = new DOMParser();
		var xml = parser.parseFromString(response, "text/xml");
		
		var level = createMazeStructure();
		
		level.id = +xml.getElementsByTagName("Id")[0].childNodes[0].nodeValue;
		level.name = "Level_" + level.id;
		level.tile.width = 35;
		level.tile.height = 35;
		level.map.width = +xml.getElementsByTagName("Width")[1].childNodes[0].nodeValue;
		level.map.depth = +xml.getElementsByTagName("Depth")[1].childNodes[0].nodeValue;
		var tmpMap = xml.getElementsByTagName("Tiles")[0].childNodes[0].nodeValue;
		
		for (var i in level.layers) {
			level.layers[i].data = [];
			level.layers[i].params = {};
			var size = (level.map.width * level.map.depth);
			for (var j = 0; j < size; j++) {
				level.layers[i].data.push(0);
			}
		}
		
		var temp = tmpMap.split(" ");
		var tile = -1;
		
		for (var i = 0, l = temp.length; i < l; i++) {
			tile = +temp[i];
			
			if (tile !== 2) {
				level.layers.Grounds.data[i] = 0x100;
			}

			switch(tile) {
				case 2: level.layers.Structure.data[i] = 0x200; break;
				case 5: level.layers.Items.data[i] = 0x301; break;
				case 6: level.layers.Items.data[i] = 0x302; break;
				case 8: level.layers.Items.data[i] = 0x401; break;
				case 9: level.layers.Items.data[i] = 0x400; break;
				case 10: level.layers.Structure.data[i] = 0x221; break;
				case 11: level.layers.Items.data[i] = 0x310; break;
			}	
		}
		
		return level;
	}
};