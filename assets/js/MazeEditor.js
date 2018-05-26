// The Tile Maze
var createMazeStructure = function (id, version, name) {
    return {
        id: 1,
        version: "0.0.3.1-dev",
        name: "Level_1",
        tile: { 
            width: 45, 
            height: 45 
        },
        map: {
            width: 8, 
            height: 1, 
            depth: 8,
            endConditions: {
                end: true,
                time: 0,
                crystals: 0,
                requiredItems: []
            }
        },
        layers: {
            Grounds: {
                data: [],
                params: {}
            },
            Structure: {
                data: [],
                params: []
            },
            Items: {
                data: [],
                params: {}
            }
        }
    };
};

var MazeLevel = createMazeStructure();

// Editor configuration.
var MazeEditor = {
    mode: "draw",
    clicked: false,
    selectedId: 0,
    layerId: "Grounds",
    selectedTile: null,
    initialized: false
};

// DOM elements

var mapLayers = $("mapEditorLayers"),
    modeStatus = $("modeStatus"),
    showLayerCB = $("showLayers");

var mapEditors = [];

// UI objects
var levelPropertyEditor = new LevelPropertyEditor(MazeEditor);
var tilePropertyEditor = new TilePropertyEditor();
var tilePanelEditor = new TilePanelEditor(MazeEditor, tilePalet);
var openFileDialog = new OpenFileDialog(function (savedMap) {
    loadLocalMap(savedMap)
});

function getEditorIdFromLayerId (layerId) {
    var index = 0;
    for (var layer in MazeLevel.layers) {
        if (layer === layerId) {
            return index;
        }
        index++;
    }
}

// ---
// --- Editor lifecycle
// ---
function initialize() {
    if (!MazeEditor.initialized) {    
        
        // Mouse binding
        mapLayers.on("mousedown", onEditorMouseDown, false);

        levelPropertyEditor.updateEditor(MazeLevel);

        $("btnCreateLevel").on("click", createNewMap, false);
        $("btnClearLevel").on("click", clearSavedMap, false);
        $("btnExportLevel").on("click", exportMap, false);

        $("btnToggleMode").on("click", function (e) {
            setEditorMode((MazeEditor.mode === "draw") ? "edition" : "draw");
            saveLocalMap();
        }, false);

        $("btnRedraw").on("click", function (e) {
            levelPropertyEditor.updateEditor(MazeLevel);
            saveLocalMap();
            loadLocalMap();
        }, false);

        var onTitleClick = function (event) {
            var div = event.target.nextElementSibling;
            div.style.display = (div.style.display === "none") ? "block" : "none";
        };

        var titles = $(".menuTitle");
        $.forEach(titles, function (i, e) {
            e.on("click", onTitleClick, false);

            if (i === 0 || i === 4 || i === 5) {
                e.nextElementSibling.style.display = "block";
            }
            else {
                e.nextElementSibling.style.display = "none";
            }
        });

        showLayerCB.on("change", function (e) {
            setLayersVisible(e.target.checked);
        }, false);

        document.addEventListener("resize", resize, false);
        document.addEventListener("mouseup", function (e) { 
            MazeEditor.clicked = false;
            saveLocalMap();
            
            if (+e.button|0 === 2) {
                MazeEditor.selectedId = 0x000;
                tilePanelEditor.deselectedAll();
            }
        }, false);

        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);

        $("labelSelect").on("change", function (event) {
            setLayerActive(event.target.value);
        }, false);

        for (var i in MazeLevel.layers) {
            var layer = document.createElement("div");
            layer.setAttribute("id", i + "_layer")
            layer.setAttribute("class", "editor");
            mapLayers.appendChild(layer);
            mapEditors.push(layer);
        }
    }

    // Create the MazeEditor
    createEditor();
    loadLocalMap();
}

function setLayersVisible(visible) {
    var cpt = 0;
    for (var layer in MazeLevel.layers) {
        //e.target.checked
        if (!visible) {
            mapEditors[cpt].style.display = (MazeEditor.layerId === layer) ? "block" : "none";
        } 
        else {
            mapEditors[cpt].style.display = "block";
        }
        cpt++;
    }
}

function setLayerActive(layerId) {
    MazeEditor.layerId = layerId;
    tilePanelEditor.showTileList(layerId);
    for (var i = 0, l = mapEditors.length; i < l; i++) { 
        mapEditors[i].style.zIndex = mapEditors[i].id.split("_")[0] === layerId ? "999999" : "0";
    }
    setLayersVisible(showLayerCB.checked);
    MazeEditor.selectedId = 0x000;
}

function onEditorMouseDown(event) {
    event.preventDefault();
    if (event.target.id === "mapEditorLayers") {
        if (tilePropertyEditor.isOpen) {
            tilePropertyEditor.close();
        }
    }
    MazeEditor.clicked = true; 
}

function createEditor(conserve) {
    if (MazeEditor.initialized) {
        dispose();
    }

    for (var i = 0, l = mapEditors.length; i < l; i++) {    
        mapEditors[i].innerHTML = "";
    }

    var offsetX = 25,
        offsetY = 25;
    
    if (!conserve) {
        for (var i in MazeLevel.layers) {
            MazeLevel.layers[i].data = [];
            MazeLevel.layers[i].params = {};

            for (var j = 0, l = (MazeLevel.map.width * MazeLevel.map.depth); j < l; j++) {
                MazeLevel.layers[i].data.push(0);
            }
        }
    }

    var cpt = 0;
    for (var layerName in MazeLevel.layers) {
        MazeEditor.layerId = layerName;
        for (var y = 0; y < MazeLevel.map.depth; y++) {
            for (var x = 0; x < MazeLevel.map.width; x++) {
                var cTile = document.createElement("div");
                mapEditors[cpt].appendChild(cTile);

                cTile.style.top = ((+MazeLevel.tile.height * y) + offsetY) + "px";
                cTile.style.left = ((+MazeLevel.tile.width * x) + offsetX) + "px";
                cTile.style.width = +MazeLevel.tile.width + "px";
                cTile.style.height = +MazeLevel.tile.height + "px";

                if (MazeEditor.layerId === "Grounds") {
                    if (y == 0) { 
                        cTile.style.borderBottom = "border-bottom:0px"; 
                    }
                    
                    if (x > 0) { 
                        cTile.style.borderRight = "border-right:0px"; 
                    }
                }
                else {
                    cTile.style.border = "0";
                }
                
                cTile.setAttribute('class', 'tile');
                cTile.setAttribute('id', layerName + "_" + y + "_" + x);
                cTile.on('mouseover', onTileClick, false);
                cTile.on("mousedown", drawTile, false);
        
                // If it's the first time, we draw the empty tile.
                // Otherwise it's redrawn by redraw method.
                if (!conserve) {
                    drawTile(cTile);
                }
            }
        }
        cpt++;
    }

    setLayerActive("Grounds");
    resize();
}

function onTileClick (event) {
    if (MazeEditor.clicked) {
        event.preventDefault();
        drawTile(this);
    }
}

function drawTile(tile) {
    var obj = tile instanceof window.Event ? tile.target : tile;

    if (obj instanceof HTMLImageElement) {
        obj = obj.parentNode;
    }

    if (obj instanceof window.Event && obj.button !== 0) {
        return;
    }

    var temp = obj.id.split("_"),
        x = +temp[2]|0,
        y = +temp[1]|0;

    if (MazeEditor.mode === "draw") { 
        obj.setAttribute("class", "");
        obj.setAttribute("class", "tile " + MazeEditor.selectedId);
        obj.setAttribute("rel", MazeEditor.selectedId);
        obj.setAttribute("params", "");
        obj.innerHTML = "";

        if (!tilePalet[MazeEditor.selectedId].value && MazeLevel.layers[MazeEditor.layerId].params[x + y * MazeLevel.map.width]) { 
            delete MazeLevel.layers[MazeEditor.layerId].params[x + y * MazeLevel.map.width];
        }
        
        if (MazeEditor.layerId === "Grounds") {
            obj.style.backgroundColor = tilePalet[MazeEditor.selectedId].color;
        }

        var tPalet = tilePalet[MazeEditor.selectedId];
        if (tPalet.texture) { 
            var icon = document.createElement("img");
            obj.appendChild(icon);
            
            icon.style.width = MazeLevel.tile.width + "px";
            icon.style.height = MazeLevel.tile.height + "px";
            icon.src = "assets/images/" + tPalet.texture + ".png";
        }

        var params = MazeLevel.layers[MazeEditor.layerId].params[x + y * MazeLevel.map.width];

        if (params) {
            obj.setAttribute("params", params);

            var pParams = JSON.parse(params);
            if (pParams.ry) {
                obj.style.transform = "rotate(" + pParams.ry + "deg)";
            }

            if (+pParams.refId|0 !== 0) {
                var span = obj.getElementsByTagName("span");
                var elem = span.length ? span[0] : null;

                if (!elem) {
                    elem = document.createElement("span");
                    obj.appendChild(elem);
                }

                elem.innerHTML = pParams.refId;
            }
        }

        MazeLevel.layers[MazeEditor.layerId].data[x + y * MazeLevel.map.width] = tilePalet[MazeEditor.selectedId].value; 
    }
    else if (tile instanceof window.Event && tile.type === "mousedown") {
        if (MazeLevel.layers[MazeEditor.layerId].data[x + y * MazeLevel.map.width]) {
            modeStatus.innerHTML = obj.id;
            tilePropertyEditor.show(obj);

            if (MazeEditor.selectedTile) {
                MazeEditor.selectedTile.classList.remove("selected");
                MazeEditor.selectedTile = null;
            }

            MazeEditor.selectedTile = obj;
            MazeEditor.selectedTile.classList.add("selected");
        }
        else {
            if (MazeEditor.selectedTile) {
                MazeEditor.selectedTile.classList.remove("selected");
                MazeEditor.selectedTile = null;
            }

            tilePropertyEditor.close();
        }
    }  
}

function redraw () {
    var oldSelectedId = MazeEditor.selectedId;

    for (var layer in MazeLevel.layers) {
        MazeEditor.layerId = layer;
        for (var y = 0; y < MazeLevel.map.depth; y++) {
            for (var x = 0; x < MazeLevel.map.width; x++) {
                var tile = $(layer + "_" + y + "_" + x);
                var tileId = MazeLevel.layers[layer].data[x + y * MazeLevel.map.width];
       
                MazeEditor.selectedId = getTilePaletIndex(tileId);

                if (tile) {
                    drawTile(tile);
                }
            }
        } 
    }

    setLayerActive("Grounds");
    MazeEditor.selectedId = 0;
    tilePanelEditor.deselectedAll();
}

// ---
// --- Save/Load/Export
// ---

function saveLocalMap() {
    // Small hack for now
    for (var i in MazeLevel.layers) {
        if (MazeLevel.layers[i].params["0"]) {
            delete MazeLevel.layers[i].params["0"];
        }
    }

    levelPropertyEditor.updateLevel(MazeLevel);
    localStorage.setItem("maze3d.mapMazeEditor.map", JSON.stringify(MazeLevel));
    localStorage.setItem("maze3d.mapMazeEditor.tiles", JSON.stringify(tilePalet));
}

function loadLocalMap(savedMap) {
    var savedMap = savedMap || localStorage.getItem("maze3d.mapMazeEditor.map");

    if (savedMap) {
        var map = JSON.parse(savedMap);

        if (map.version !== MazeLevel.version) {
            if (map.version === "0.0.2-dev") {
                // Patch v0.2
                map.map.endConditions = { end: true, time: 0, crystals: 0, requiredItems: [] };
                map.version = MazeLevel.version;
            }
            else {
                alert("Map not compatible");
                localStorage.removeItem("maze3d.mapMazeEditor.map");
                return;
            }
        }

        MazeLevel = map;

        levelPropertyEditor.updateEditor(MazeLevel);
        createEditor(true);
        redraw();
    }
}

function generateThumb(size) {
    var size = size || {
        x: MazeLevel.map.width * MazeLevel.tile.width,
        y: MazeLevel.map.depth * MazeLevel.tile.height
    };

    var canvas = document.createElement("canvas");
    canvas.style.backgroundColor = "#fff";
    canvas.width = size.x;
    canvas.height = size.y;

    var context = canvas.getContext("2d");
    context.clearRect(0, 0, size.x, size.y);

    for (var layer in MazeLevel.layers) {
        for (var y = 0; y < MazeLevel.map.depth; y++) {
            for (var x = 0; x < MazeLevel.map.width; x++) {
                var tile = $(layer + "_" + y + "_" + x);
                
                if (layer !== "Grounds" && MazeLevel.layers[layer].data[x + y * MazeLevel.map.width] === 0) {
                    continue;
                } 

                if (tile.children.length) {
                    context.drawImage(tile.children[0], x * MazeLevel.tile.width, y * MazeLevel.tile.height, MazeLevel.tile.width, MazeLevel.tile.height);
                }
                else {
                    context.fillStyle = tilePalet[0].color;
                    context.fillRect(x * MazeLevel.tile.width, y * MazeLevel.tile.height, MazeLevel.tile.width, MazeLevel.tile.height);
                }
            }
        }
    }
  
    return canvas;
}

function exportMap() {
    saveLocalMap();
    
    var result = JSON.stringify(MazeLevel);

    var blob = new Blob([result]);
    saveAs(blob, [MazeLevel.name, ".txt"].join(""));

    var imgCanvas = generateThumb();
    imgCanvas.toBlob(function (blob) {
        saveAs(blob, MazeLevel.name + ".jpg");
    }, "image/jpeg");
}

// ---
// --- Helpers and utilities
// ---

function setEditorMode(mode) {
    MazeEditor.mode = mode;

    modeStatus.innerHTML = mode;
    modeStatus.setAttribute("class", mode);

    if (MazeEditor.selectedTile) {
        MazeEditor.selectedTile.classList.remove("selected");
        MazeEditor.selectedTile = null;
    }

    if (mode === "draw") {
        levelPropertyEditor.show();
        tilePanelEditor.show();
        tilePropertyEditor.close();
    }
    else {
        tilePanelEditor.close();
        levelPropertyEditor.close();
    }
}

function dispose() {
    var tiles = document.getElementsByClassName("tile");
    for (var i = 0, l = tiles.length; i < l; i++) {
        cTile.off('mouseover', onTileClick);
        cTile.off("mousedown", drawTile);
    }
}

function createNewMap() {
    levelPropertyEditor.updateLevel(MazeLevel);    
    createEditor();
    setLayerActive("Grounds");
}

function clearSavedMap() {
    localStorage.removeItem("maze3d.mapMazeEditor.map");
    document.location.reload();
}

function resize() {
    var tiles = mapEditors[0].getElementsByTagName("div"); 
    if (tiles.length) {
        var lastTile = tiles[tiles.length - 1]; 
        var rect = lastTile.getBoundingClientRect();

        $.forEach(mapEditors, function (i, e) {
            e.style.width = (window.innerWidth - 420) + "px";
            e.style.height = (rect.bottom + 50) + "px";
        });
    }
}