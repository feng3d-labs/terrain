declare namespace feng3d {
    interface GeometryTypes {
        TerrainGeometry: TerrainGeometry;
    }
    /**
     * 地形几何体
     */
    class TerrainGeometry extends Geometry {
        /**
         * 高度图路径
         */
        heightMap: Texture2D;
        /**
         * 地形宽度
         */
        width: number;
        /**
         * 地形高度
         */
        height: number;
        /**
         * 地形深度
         */
        depth: number;
        /**
         * 横向网格段数
         */
        segmentsW: number;
        /**
         * 纵向网格段数
         */
        segmentsH: number;
        /**
         * 最大地形高度
         */
        maxElevation: number;
        /**
         * 最小地形高度
         */
        minElevation: number;
        private _heightImageData;
        /**
         * 创建高度地形 拥有segmentsW*segmentsH个顶点
         */
        constructor(raw?: gPartial<TerrainGeometry>);
        private _onHeightMapChanged;
        /**
         * 创建顶点坐标
         */
        protected buildGeometry(): void;
        /**
         * 创建uv坐标
         */
        private buildUVs;
        /**
         * 获取位置在（x，z）处的高度y值
         * @param x x坐标
         * @param z z坐标
         * @return 高度
         */
        getHeightAt(x: number, z: number): number;
        /**
         * 获取像素值
         */
        private getPixel;
    }
    interface DefaultGeometry {
        "Terrain-Geometry": TerrainGeometry;
    }
}
declare namespace feng3d {
    interface UniformsTypes {
        terrain: TerrainUniforms;
    }
    class TerrainUniforms extends StandardUniforms {
        __class__: "feng3d.TerrainUniforms";
        s_splatTexture1: Texture2D;
        s_splatTexture2: Texture2D;
        s_splatTexture3: Texture2D;
        s_blendTexture: Texture2D;
        u_splatRepeats: Vector4;
    }
    interface DefaultMaterial {
        "Terrain-Material": Material;
    }
}
declare namespace feng3d {
    /**
     * 地形材质
     */
    class TerrainMergeMethod extends EventDispatcher {
        splatMergeTexture: Texture2D;
        blendTexture: Texture2D;
        splatRepeats: Vector4;
        /**
         * 构建材质
         */
        constructor();
        beforeRender(renderAtomic: RenderAtomic): void;
    }
}
declare namespace feng3d {
    /**
     * The TerrainData class stores heightmaps, detail mesh positions, tree instances, and terrain texture alpha maps.
     *
     * The Terrain component links to the terrain data and renders it.
     */
    class TerrainData {
        /**
         * Width of the terrain in samples(Read Only).
         */
        get heightmapWidth(): number;
        /**
         * Height of the terrain in samples(Read Only).
         */
        get heightmapHeight(): number;
        /**
         * Resolution of the heightmap.
         */
        heightmapResolution: number;
        /**
         * The size of each heightmap sample.
         */
        get heightmapScale(): Vector3;
        /**
         * The total size in world units of the terrain.
         */
        size: Vector3;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Terrain: Terrain;
    }
    /**
     * The Terrain component renders the terrain.
     */
    class Terrain extends Renderable {
        __class__: "feng3d.Terrain";
        /**
         * 地形资源
         */
        assign: TerrainData;
        geometry: TerrainGeometry;
        material: Material;
    }
    interface PrimitiveGameObject {
        Terrain: GameObject;
    }
}
//# sourceMappingURL=terrain.d.ts.map