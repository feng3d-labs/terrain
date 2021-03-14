namespace feng3d
{

    export interface ComponentMap { Terrain: Terrain }

    /**
     * The Terrain component renders the terrain.
     */
    // @ov({ component: "OVTerrain" })
    @RegisterComponent()
    export class Terrain extends Renderable
    {
        __class__: "feng3d.Terrain";

        /**
         * 地形资源
         */
        assign: TerrainData;

        geometry = Geometry.getDefault("Terrain-Geometry");

        material = Material.getDefault("Terrain-Material");
    }

    Entity.registerPrimitive("Terrain", (g) =>
    {
        g.addComponent(feng3d.Terrain);
    });

    export interface PrimitiveEntity
    {
        Terrain: Entity;
    }
}