var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var feng3d;
(function (feng3d) {
    /**
     * 地形几何体
     */
    var TerrainGeometry = /** @class */ (function (_super) {
        __extends(TerrainGeometry, _super);
        /**
         * 创建高度地形 拥有segmentsW*segmentsH个顶点
         */
        function TerrainGeometry(raw) {
            var _this = _super.call(this) || this;
            /**
             * 高度图路径
             */
            _this.heightMap = feng3d.Texture2D.default;
            /**
             * 地形宽度
             */
            _this.width = 10;
            /**
             * 地形高度
             */
            _this.height = 1;
            /**
             * 地形深度
             */
            _this.depth = 10;
            /**
             * 横向网格段数
             */
            _this.segmentsW = 30;
            /**
             * 纵向网格段数
             */
            _this.segmentsH = 30;
            /**
             * 最大地形高度
             */
            _this.maxElevation = 255;
            /**
             * 最小地形高度
             */
            _this.minElevation = 0;
            _this._heightImageData = defaultHeightMap;
            _this.name = "terrain";
            feng3d.serialization.setValue(_this, raw);
            return _this;
        }
        TerrainGeometry.prototype._onHeightMapChanged = function () {
            var _this = this;
            if (!this.heightMap["_pixels"]) {
                this._heightImageData = defaultHeightMap;
                this.invalidateGeometry();
                this.heightMap.once("loadCompleted", function () {
                    var img = _this.heightMap["_pixels"];
                    _this._heightImageData = feng3d.ImageUtil.fromImage(img).imageData;
                    _this.invalidateGeometry();
                });
                return;
            }
            var img = this.heightMap["_pixels"];
            this._heightImageData = feng3d.ImageUtil.fromImage(img).imageData;
            this.invalidateGeometry();
        };
        /**
         * 创建顶点坐标
         */
        TerrainGeometry.prototype.buildGeometry = function () {
            if (!this._heightImageData)
                return;
            var x, z;
            var numInds = 0;
            var base = 0;
            //一排顶点数据
            var tw = this.segmentsW + 1;
            //总顶点数量
            var numVerts = (this.segmentsH + 1) * tw;
            //一个格子所占高度图X轴像素数
            var uDiv = (this._heightImageData.width - 1) / this.segmentsW;
            //一个格子所占高度图Y轴像素数
            var vDiv = (this._heightImageData.height - 1) / this.segmentsH;
            var u, v;
            var y;
            var vertices = [];
            var indices = [];
            numVerts = 0;
            var col;
            for (var zi = 0; zi <= this.segmentsH; ++zi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    //顶点坐标
                    x = (xi / this.segmentsW - .5) * this.width;
                    z = (zi / this.segmentsH - .5) * this.depth;
                    //格子对应高度图uv坐标
                    u = xi * uDiv;
                    v = (this.segmentsH - zi) * vDiv;
                    //获取颜色值
                    col = this.getPixel(this._heightImageData, u, v) & 0xff;
                    //计算高度值
                    y = (col > this.maxElevation) ? (this.maxElevation / 0xff) * this.height : ((col < this.minElevation) ? (this.minElevation / 0xff) * this.height : (col / 0xff) * this.height);
                    //保存顶点坐标
                    vertices[numVerts++] = x;
                    vertices[numVerts++] = y;
                    vertices[numVerts++] = z;
                    if (xi != this.segmentsW && zi != this.segmentsH) {
                        //增加 一个顶点同时 生成一个格子或两个三角形
                        base = xi + zi * tw;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base;
                        indices[numInds++] = base + tw + 1;
                        indices[numInds++] = base + 1;
                    }
                }
            }
            var uvs = this.buildUVs();
            this.positions = vertices;
            this.uvs = uvs;
            this.indices = indices;
        };
        /**
         * 创建uv坐标
         */
        TerrainGeometry.prototype.buildUVs = function () {
            var numUvs = (this.segmentsH + 1) * (this.segmentsW + 1) * 2;
            var uvs = [];
            numUvs = 0;
            //计算每个顶点的uv坐标
            for (var yi = 0; yi <= this.segmentsH; ++yi) {
                for (var xi = 0; xi <= this.segmentsW; ++xi) {
                    uvs[numUvs++] = xi / this.segmentsW;
                    uvs[numUvs++] = 1 - yi / this.segmentsH;
                }
            }
            return uvs;
        };
        /**
         * 获取位置在（x，z）处的高度y值
         * @param x x坐标
         * @param z z坐标
         * @return 高度
         */
        TerrainGeometry.prototype.getHeightAt = function (x, z) {
            //得到高度图中的值
            var u = (x / this.width + .5) * (this._heightImageData.width - 1);
            var v = (-z / this.depth + .5) * (this._heightImageData.height - 1);
            var col = this.getPixel(this._heightImageData, u, v) & 0xff;
            var h;
            if (col > this.maxElevation) {
                h = (this.maxElevation / 0xff) * this.height;
            }
            else if (col < this.minElevation) {
                h = (this.minElevation / 0xff) * this.height;
            }
            else {
                h = (col / 0xff) * this.height;
            }
            return h;
        };
        /**
         * 获取像素值
         */
        TerrainGeometry.prototype.getPixel = function (imageData, u, v) {
            //取整
            u = ~~u;
            v = ~~v;
            var index = (v * imageData.width + u) * 4;
            var data = imageData.data;
            var red = data[index]; //红色色深
            var green = data[index + 1]; //绿色色深
            var blue = data[index + 2]; //蓝色色深
            var alpha = data[index + 3]; //透明度
            return blue;
        };
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("_onHeightMapChanged")
        ], TerrainGeometry.prototype, "heightMap", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "width", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "height", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "depth", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "segmentsW", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "segmentsH", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "maxElevation", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav(),
            feng3d.watch("invalidateGeometry")
        ], TerrainGeometry.prototype, "minElevation", void 0);
        return TerrainGeometry;
    }(feng3d.Geometry));
    feng3d.TerrainGeometry = TerrainGeometry;
    /**
     * 默认高度图
     */
    var defaultHeightMap = new feng3d.ImageUtil(1024, 1024, new feng3d.Color4(0, 0, 0, 0)).imageData;
    feng3d.Geometry.setDefault("Terrain-Geometry", new TerrainGeometry());
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    var TerrainUniforms = /** @class */ (function (_super) {
        __extends(TerrainUniforms, _super);
        function TerrainUniforms() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.s_splatTexture1 = feng3d.Texture2D.default;
            _this.s_splatTexture2 = feng3d.Texture2D.default;
            _this.s_splatTexture3 = feng3d.Texture2D.default;
            _this.s_blendTexture = feng3d.Texture2D.default;
            _this.u_splatRepeats = new feng3d.Vector4(1, 1, 1, 1);
            return _this;
        }
        __decorate([
            feng3d.serialize,
            feng3d.oav({ block: "terrain" })
        ], TerrainUniforms.prototype, "s_splatTexture1", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav({ block: "terrain" })
        ], TerrainUniforms.prototype, "s_splatTexture2", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav({ block: "terrain" })
        ], TerrainUniforms.prototype, "s_splatTexture3", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav({ block: "terrain" })
        ], TerrainUniforms.prototype, "s_blendTexture", void 0);
        __decorate([
            feng3d.serialize,
            feng3d.oav({ block: "terrain" })
        ], TerrainUniforms.prototype, "u_splatRepeats", void 0);
        return TerrainUniforms;
    }(feng3d.StandardUniforms));
    feng3d.TerrainUniforms = TerrainUniforms;
    feng3d.shaderConfig.shaders["terrain"].cls = TerrainUniforms;
    feng3d.Material.setDefault("Terrain-Material", { shaderName: "terrain" });
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * 地形材质
     */
    var TerrainMergeMethod = /** @class */ (function (_super) {
        __extends(TerrainMergeMethod, _super);
        /**
         * 构建材质
         */
        function TerrainMergeMethod() {
            var _this = _super.call(this) || this;
            _this.splatMergeTexture = feng3d.Texture2D.default;
            _this.blendTexture = feng3d.Texture2D.default;
            _this.splatRepeats = new feng3d.Vector4(1, 1, 1, 1);
            _this.splatMergeTexture.minFilter = feng3d.TextureMinFilter.NEAREST;
            _this.splatMergeTexture.magFilter = feng3d.TextureMagFilter.NEAREST;
            _this.splatMergeTexture.wrapS = feng3d.TextureWrap.REPEAT;
            _this.splatMergeTexture.wrapT = feng3d.TextureWrap.REPEAT;
            return _this;
        }
        TerrainMergeMethod.prototype.beforeRender = function (renderAtomic) {
            renderAtomic.uniforms.s_blendTexture = this.blendTexture;
            renderAtomic.uniforms.s_splatMergeTexture = this.splatMergeTexture;
            renderAtomic.uniforms.u_splatMergeTextureSize = this.splatMergeTexture.getSize();
            renderAtomic.uniforms.u_splatRepeats = this.splatRepeats;
            //
            renderAtomic.uniforms.u_imageSize = new feng3d.Vector2(2048.0, 1024.0);
            renderAtomic.uniforms.u_tileSize = new feng3d.Vector2(512.0, 512.0);
            renderAtomic.uniforms.u_maxLod = 7;
            renderAtomic.uniforms.u_uvPositionScale = 0.001;
            renderAtomic.uniforms.u_tileOffset = [
                new feng3d.Vector4(0.5, 0.5, 0.0, 0.0),
                new feng3d.Vector4(0.5, 0.5, 0.5, 0.0),
                new feng3d.Vector4(0.5, 0.5, 0.0, 0.5),
            ];
            renderAtomic.uniforms.u_lod0vec = new feng3d.Vector4(0.5, 1, 0, 0);
        };
        return TerrainMergeMethod;
    }(feng3d.EventDispatcher));
    feng3d.TerrainMergeMethod = TerrainMergeMethod;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * The TerrainData class stores heightmaps, detail mesh positions, tree instances, and terrain texture alpha maps.
     *
     * The Terrain component links to the terrain data and renders it.
     */
    var TerrainData = /** @class */ (function () {
        function TerrainData() {
            /**
             * Resolution of the heightmap.
             */
            this.heightmapResolution = 513;
            /**
             * The total size in world units of the terrain.
             */
            this.size = new feng3d.Vector3(500, 600, 500);
            // /**
            //  * Height of the alpha map.
            //  * 混合贴图高度
            //  * @see https://blog.csdn.net/qq_29523119/article/details/52776731
            //  */
            // alphamapHeight
            // /**
            //  * Number of alpha map layers.
            //  */
            // alphamapLayers
            // /**
            //  * Resolution of the alpha map.
            //  */
            // alphamapResolution
            // /**
            //  * Alpha map textures used by the Terrain. Used by Terrain Inspector for undo.
            //  */
            // alphamapTextures
            // /**
            //  * Width of the alpha map.
            //  */
            // alphamapWidth
            // /**
            //  * Resolution of the base map used for rendering far patches on the terrain.
            //  */
            // baseMapResolution
            // /**
            //  * Detail height of the TerrainData.
            //  */
            // detailHeight
            // /**
            //  * Contains the detail texture / meshes that the terrain has.
            //  */
            // detailPrototypes
            // /**
            //  * Detail Resolution of the TerrainData.
            //  */
            // detailResolution
            // /**
            //  * Detail width of the TerrainData.
            //  */
            // detailWidth
            // /**
            //  * Splat texture used by the terrain.
            //  */
            // splatPrototypes
            // /**
            //  * The thickness of the terrain used for collision detection.
            //  */
            // thickness
            // /**
            //  * Returns the number of tree instances.
            //  */
            // treeInstanceCount
            // /**
            //  * Contains the current trees placed in the terrain.
            //  */
            // treeInstances
            // /**
            //  * The list of tree prototypes this are the ones available in the inspector.
            //  */
            // treePrototypes
            // /**
            //  * Amount of waving grass in the terrain.
            //  */
            // wavingGrassAmount
            // /**
            //  * Speed of the waving grass.
            //  */
            // wavingGrassSpeed
            // /**
            //  * Strength of the waving grass in the terrain.
            //  */
            // wavingGrassStrength
            // /**
            //  * Color of the waving grass that the terrain has.
            //  */
            // wavingGrassTint
        }
        Object.defineProperty(TerrainData.prototype, "heightmapWidth", {
            /**
             * Width of the terrain in samples(Read Only).
             */
            get: function () {
                return this.heightmapResolution;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TerrainData.prototype, "heightmapHeight", {
            /**
             * Height of the terrain in samples(Read Only).
             */
            get: function () {
                return this.heightmapResolution;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TerrainData.prototype, "heightmapScale", {
            /**
             * The size of each heightmap sample.
             */
            get: function () {
                return this.size.divideNumberTo(this.heightmapResolution);
            },
            enumerable: false,
            configurable: true
        });
        return TerrainData;
    }());
    feng3d.TerrainData = TerrainData;
})(feng3d || (feng3d = {}));
var feng3d;
(function (feng3d) {
    /**
     * The Terrain component renders the terrain.
     */
    // @ov({ component: "OVTerrain" })
    var Terrain = /** @class */ (function (_super) {
        __extends(Terrain, _super);
        function Terrain() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.geometry = feng3d.Geometry.getDefault("Terrain-Geometry");
            _this.material = feng3d.Material.getDefault("Terrain-Material");
            return _this;
        }
        Terrain = __decorate([
            feng3d.RegisterComponent()
        ], Terrain);
        return Terrain;
    }(feng3d.Renderable));
    feng3d.Terrain = Terrain;
    feng3d.GameObject.registerPrimitive("Terrain", function (g) {
        g.addComponent("Terrain");
    });
})(feng3d || (feng3d = {}));
//# sourceMappingURL=terrain.js.map