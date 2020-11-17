namespace editor
{
    createObjectMenu.push(
        {
            label: "地形", click: () =>
            {
                hierarchy.addGameObject(feng3d.GameObject.createPrimitive("Terrain"));
            }
        },
    );

    componentIconMap.set(feng3d.Terrain, "Terrain_png");
}