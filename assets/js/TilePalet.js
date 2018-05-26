// Palet of available tiles.
var tilePalet = [
    { color: "rgba(255, 255, 255, 0.4)", action: "Empty", value: 0x000, texture: "", title: "Grounds" },
    { color: "#999", action: "Ground", value: 0x100, texture: "" },
    { color: "#888", action: "Ground 2", value: 0x101, texture: "" },
    { color: "#777", action: "Ground 3", value: 0x102, texture: "" },
    { color: "#666", action: "Ground 4", value: 0x103, texture: "" },
    { color: "#555", action: "Ground 5", value: 0x104, texture: "" },
    { color: "#00F", action: "Water", value: 0x110, texture: "water_icon" },
    { color: "#00F", action: "Hole", value: 0x120, texture: "hole_icon" },
    { color: "#00F", action: "Spikes Auto", value: 0x121, texture: "trap_auto_pic_icon" },
    { color: "#00F", action: "Spikes", value: 0x122, texture: "trap_pic_icon" },

    { color: "rgba(255, 255, 255, 0.4)", action: "Empty", value: 0x000, texture: "", title: "Structure" },
    { color: "BBB", action: "Wall", value: 0x200, texture: "wall_icon" },
    { color: "BBB", action: "Wall 2", value: 0x201, texture: "wall_icon_2" },
    { color: "BBB", action: "Wall 3", value: 0x202, texture: "wall_icon_3" },
    { color: "BBB", action: "Wall 4", value: 0x203, texture: "wall_icon_4" },
    { color: "BBB", action: "Wall 5", value: 0x204, texture: "wall_icon_5" },
    
    { color: "#999", action: "Arch", value: 0x210, texture: "arch_icon" },
    { color: "#999", action: "Grid (auto)", value: 0x220, texture: "grid_icon" },
    { color: "#999", action: "Door 1", value: 0x221, texture: "door_icon" },
    { color: "#999", action: "Door 2", value: 0x222, texture: "door2_icon" },
    { color: "#999", action: "Stairs 1", value: 0x230, texture: "stairs_icon" },
    { color: "#999", action: "Stairs 2", value: 0x231, texture: "stairs2_icon" },
    { color: "#999", action: "Ladder", value: 0x232, texture: "ladder_icon" },
    { color: "#999", action: "Rock", value: 0x240, texture: "stone_icon" },
    { color: "#999", action: "Pilar", value: 0x250, texture: "pilar_icon" },

    { color: "rgba(255, 255, 255, 0.4)", action: "Empty", value: 0x000, texture: "", title: "Items" },
    { color: "#5FF", action: "Purple Crystal", value: 0x300, texture: "purple_crystal_icon" },
    { color: "#00F", action: "Blue Crystal", value: 0x301, texture: "blue_crystal_icon" },
    { color: "#0F0", action: "Green Crystal", value: 0x302, texture: "green_crystal_icon" },
    { color: "#F00", action: "Red Crystal", value: 0x303, texture: "red_crystal_icon" },
    { color: "#FF0", action: "Key for Door 1", value: 0x310, texture: "key_icon" },
    { color: "#FF0", action: "Key for Door 2", value: 0x311, texture: "key2_icon" },
    { color: "#FF0", action: "Lever", value: 0x320, texture: "lever_icon" },
    { color: "#FF0", action: "Lever 2", value: 0x321, texture: "lever2_icon" },
    { color: "#FF0", action: "Potion", value: 0x330, texture: "potion_icon" },
    { color: "#FF0", action: "Giant Rat", value: 0x380, texture: "enemy_icon" },
    { color: "#FF0", action: "Skeleton", value: 0x381, texture: "enemy2_icon" },
    { color: "#FF0", action: "Disabled Object", value: 0x394, texture: "disabled_go_icon" },
    { color: "#FF0", action: "Trigger Zone", value: 0x395, texture: "trigger_icon" },
    { color: "#FF0", action: "Naration Zone", value: 0x396, texture: "text_icon" },
    { color: "#FF0", action: "Check Point", value: 0x399, texture: "checkpoint_icon" },
    { color: "#0F0", action: "Start Point", value: 0x400, texture: "start_icon" },
    { color: "#F00", action: "End Point", value: 0x401, texture: "end_icon" }
];

function getTilePaletIndex(value) {
    for (var i = 0, l = tilePalet.length; i < l; i++) {
        if (tilePalet[i].value === value) {
            return i;
        }
    }
    return 0;
}
