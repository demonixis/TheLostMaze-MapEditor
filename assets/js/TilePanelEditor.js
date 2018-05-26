var TilePanelEditor = function (editor, tilePalet) {
    this.domElement = $("tilePaletListContainer");
    this.tilesList = [];

    var currentList = null;

    for (var i = 0, l = tilePalet.length; i < l; i++) {
        if (tilePalet[i].title) {
            currentList = document.createElement("ul");
            currentList.setAttribute("id", tilePalet[i].title);
            currentList.setAttribute("class", "paletItemList");
            this.domElement.appendChild(currentList);

            this.tilesList.push(currentList);
        }

        var li = document.createElement("li");
        li.setAttribute("class", "paletteItem");
        li.setAttribute("rel", i);
        currentList.appendChild(li);

        var div = document.createElement("div");
        div.setAttribute("class", "colorItem");
        li.appendChild(div);

        if (tilePalet[i].texture) {
            var img = document.createElement("img");
            img.src = "assets/images/" + tilePalet[i].texture + ".png";
            div.appendChild(img);
        }
        else {
            div.style.backgroundColor = tilePalet[i].color;
        }

        var span1 = document.createElement("span");
        span1.setAttribute("class", "colorActionItem");
        span1.innerHTML = tilePalet[i].action;
        li.appendChild(span1);
    }

    var paletItemList = document.getElementsByClassName("paletItemList");
    var paletHeaders = document.getElementsByClassName("paletItemTitle");
    this._paletItems = document.getElementsByClassName("paletteItem");

    var that = this;
    var onPaletItemClick = function (event) {
	    editor.selectedId = +this.getAttribute("rel")|0;

	    $.forEach(that._paletItems, function (i, e) {
	    	e.classList.remove("selected");
	    });

	    this.classList.add("selected");
	};
    
    $.forEach(that._paletItems, function (i, e) {
    	e.on("click", onPaletItemClick, false);
    });

    this.showTileList("Grounds");
};

TilePanelEditor.prototype.show = function () {
    this.domElement.style.display = "block";
};

TilePanelEditor.prototype.close = function () {
    this.domElement.style.display = "none";
};

TilePanelEditor.prototype.showTileList = function (id) {
    $.forEach(this.tilesList, function (i, e) { 
        e.style.display = (e.id === id) ? "block" : "none";
    });
};

TilePanelEditor.prototype.deselectedAll = function () {
    $.forEach(this._paletItems, function (i, e) {
        e.classList.remove("selected");
    });
};