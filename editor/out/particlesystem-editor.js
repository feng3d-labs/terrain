var editor;
(function (editor) {
    editor.createObjectMenu.push({
        label: "地形",
        click: function () {
            editor.hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Terrain"));
        }
    });
    editor.componentIconMap.set(feng3d.Terrain, "Terrain_png");
})(editor || (editor = {}));
//# sourceMappingURL=particlesystem-editor.js.map