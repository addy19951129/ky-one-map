<template>
  <div id="map__container"></div>
</template>
<script>
import { loadModules } from "esri-loader";
import "../../assets/css/reset.css";
export default {
  name: "web-map",
  data() {
    return {
      map: {},
      mapView: {},
      oneMap: {},
      clickMap: new Map(),
      mouseoverMap: new Map(),
      varSetTimeout: "",
    };
  },
  created() {
    var _that = this;
    const options = {
      url:
        "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/init.js",
      css:
        "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/esri/css/main.css",
      dojoConfig: {
        async: false,
      },
    };
    loadModules(
      [
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/WebTileLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/TileLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/VectorTileLayer",
        "esri/layers/GeoJSONLayer",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/tasks/IdentifyTask",
        "esri/layers/support/TileInfo",
        "esri/tasks/support/IdentifyParameters",
        "esri/geometry/geometryEngine",
        "esri/tasks/support/Query",
        "esri/layers/BaseDynamicLayer",
      ],
      options,
      {
        css: true,
      }
    ).then(
      ([
        esriConfig,
        esriMap,
        MapView,
        WebTileLayer,
        FeatureLayer,
        TileLayer,
        MapImageLayer,
        VectorTileLayer,
        GeoJSONLayer,
        GraphicsLayer,
        Graphic,
        Point,
        PictureMarkerSymbol,
        TextSymbol,
        IdentifyTask,
        TileInfo,
        IdentifyParameters,
        geometryEngine,
        Query,
        BaseDynamicLayer,
      ]) => {
        esriConfig.fontsUrl = "http://120.79.6.214/styzt/fonts";
        var tiandituBaseUrl = "http://{subDomain}.tianditu.gov.cn"; //天地图服务地址
        var token = "5630174b76350ef58bc5a615a890a46a"; //天地图token
        _that.map = new esriMap({});
        _that.mapView = new MapView({
          container: this.$el,
          map: _that.map,
          center: [115.9, 28.777],
          zoom: 13,
          constraints: { maxZoom: 18 },
        });
        //影像注记(球面墨卡托投影)
        var tiledLayerAnno = new WebTileLayer({
          urlTemplate:
            tiandituBaseUrl +
            "/cia_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
            token,
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        });
        _that.oneMap = {
          addLayer(layerType, options) {
            options = Object.assign(
              {
                url: "",
                opacity: 1,
                id: Math.random().toString(36).substr(4),
                outFields: ["*"],
              },
              options || {}
            );
            return this.addLayerMethod.get(layerType)(options);
          },
          removeLayer(layerId) {
            var layer = _that.map.findLayerById(layerId);
            if (_that.clickMap.has(layerId)) {
              _that.clickMap.delete(layerId);
            }
            if (_that.mouseoverMap.has(layerId)) {
              _that.mouseoverMap.delete(layerId);
            }
            _that.map.remove(layer);
          },
          addLayerMethod: new Map([
            [
              "MapImageLayer",
              (options) => {
                var layer = new MapImageLayer(options);

                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                if (options.onClick && typeof options.onClick == "function") {
                }
                if (
                  options.onMouseover &&
                  typeof options.onMouseover == "function"
                ) {
                  _that.mouseoverMap.set(options.id, options.onMouseover);
                }
                if (options.toFullExtent) {
                  layer.when(function () {
                    layer.fullExtent.spatialReference = {
                      wkid: 4326,
                    };
                    _that.mapView.goTo(layer.fullExtent.expand(1.7));
                  });
                }
                return layer;
              },
            ],
            [
              "FeatureLayer",
              (options) => {
                var layer = new FeatureLayer(options);
                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                if (options.onClick && typeof options.onClick == "function") {
                  _that.clickMap.set(options.id, options.onClick);
                }
                if (
                  options.onMouseover &&
                  typeof options.onMouseover == "function"
                ) {
                  _that.mouseoverMap.set(options.id, options.onMouseover);
                }
                return layer;
              },
            ],
            [
              "PointLayer",
              (options) => {
                var layer = new GraphicsLayer({
                  opacity: 1,
                  id: options.id,
                });
                var defaultLonField = options.lonField
                    ? options.lonField
                    : "lon",
                  defaultLatField = options.latField ? options.latField : "lat";
                for (let i = 0; i < options.data.length; i++) {
                  var point = new Point({
                    spatialReference: 4326,
                    x: options.data[i][defaultLonField],
                    y: options.data[i][defaultLatField],
                  });
                  var symbol = {
                    type: "simple-marker",
                    color: [226, 119, 40],
                    outline: {
                      color: [255, 255, 255],
                      width: 2,
                    },
                  };
                  if (options.data[i].symbol) {
                    symbol = _that.oneMap.symbol(options.data[i].symbol);
                  } else if (options.symbol) {
                    symbol = _that.oneMap.symbol(options.symbol);
                  }
                  if (options.data[i].label) {
                    var textPoint = new Point({
                      spatialReference: 4326,
                      x: options.data[i][defaultLonField],
                      y: options.data[i][defaultLatField],
                    });
                    var textSymbol = _that.oneMap.symbol(options.data[i].label);
                    var textGraphic = new Graphic(textPoint, textSymbol);
                    layer.add(textGraphic);
                  }
                  var graphic = new Graphic(point, symbol, options.data[i]);

                  layer.add(graphic);
                }
                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                if (options.onClick && typeof options.onClick == "function") {
                  _that.clickMap.set(options.id, options.onClick);
                }
                if (
                  options.onMouseover &&
                  typeof options.onMouseover == "function"
                ) {
                  _that.mouseoverMap.set(options.id, options.onMouseover);
                }

                return layer;
              },
            ],
            [
              "simplePointLayer",
              (options) => {
                var point = new Point({
                  spatialReference: 4326,
                  x: options.lon,
                  y: options.lat,
                });

                return point;
              },
            ],
            [
              "VectorTileLayer",
              (options) => {
                var layer = new VectorTileLayer(options);
                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                return layer;
              },
            ],
            [
              "PolylineLayer",
              (options) => {
                var layer = new GraphicsLayer({
                  opacity: 1,
                  id: options.id,
                });
                for (let i = 0; i < options.data.length; i++) {
                  var polyline = {
                    type: "polyline",
                    paths: options.data[i].paths,
                  };
                  var symbol = {
                    type: "simple-line",
                    color: [0, 255, 255, 0.8],
                    width: 1,
                    //style: "dash",
                  };
                  if (options.data[i].symbol) {
                    symbol = _that.oneMap.symbol(options.data[i].symbol);
                  } else if (options.symbol) {
                    symbol = _that.oneMap.symbol(options.symbol);
                  }
                  // debugger;
                  var graphic = new Graphic({
                    geometry: polyline,
                    symbol: symbol,
                    attributes: options.data[i].data || {},
                  });
                  layer.add(graphic);
                }
                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                if (options.onClick && typeof options.onClick == "function") {
                  _that.clickMap.set(options.id, options.onClick);
                }
                if (
                  options.onMouseover &&
                  typeof options.onMouseover == "function"
                ) {
                  _that.mouseoverMap.set(options.id, options.onMouseover);
                }

                return layer;
              },
            ],
            [
              "PolygonLayer",
              (options) => {
                var layer = new GraphicsLayer({
                  opacity: 1,
                  id: options.id,
                });
                for (let i = 0; i < options.data.length; i++) {
                  var polygon = {
                    type: "polygon",
                    paths: options.data[i].rings,
                  };
                  var symbol = {
                    type: "simple-fill",
                    color: [227, 139, 79, 0.8],
                    outline: {
                      color: [255, 255, 255, 0.8],
                      width: 1,
                    },
                  };
                  if (options.data[i].symbol) {
                    symbol = _that.oneMap.symbol(options.data[i].symbol);
                  } else if (options.symbol) {
                    symbol = _that.oneMap.symbol(options.symbol);
                  }
                  var graphic = new Graphic({
                    geometry: polygon,
                    symbol: symbol,
                    attributes: options.data[i].data || {},
                  });
                  layer.add(graphic);
                }
                options.layerIndex
                  ? _that.map.add(layer, options.layerIndex)
                  : _that.map.add(layer);
                if (options.onClick && typeof options.onClick == "function") {
                  _that.clickMap.set(options.id, options.onClick);
                }
                if (
                  options.onMouseover &&
                  typeof options.onMouseover == "function"
                ) {
                  _that.mouseoverMap.set(options.id, options.onMouseover);
                }

                return layer;
              },
            ],
            [
              "CustomImageOverlayLayer", //自定义图片图层
              (options) => {
                //自定义叠加图片图层
                var CustomImageOverlayLayer = BaseDynamicLayer.createSubclass({
                  properties: {
                    picUrl: null,
                    extent: null,
                    image: null,
                    canvas: null,
                    id: null,
                  },
                  getImageUrl: function (extent, width, height) {
                    if (!this.image) {
                      this.image = new Image();
                    }
                    this.image.src = this.picUrl;
                    this.image.setAttribute("crossOrigin", "Anonymous");
                    if (!this.canvas) {
                      this.canvas = document.createElement("canvas");
                    }
                    this.canvas.width = 2000;
                    this.canvas.height = 2000;
                    var mapPoint = {
                      x: this.extent.xmin,
                      y: this.extent.ymax,
                      spatialReference: {
                        wkid: 4326,
                      },
                    };
                    var screenPoint = _that.mapView.toScreen(mapPoint);
                    var leftbottom = {
                      x: this.extent.xmin,
                      y: this.extent.ymin,
                      spatialReference: {
                        wkid: 4326,
                      },
                    };
                    var screenLeftbottom = _that.mapView.toScreen(leftbottom);
                    var righttop = {
                      x: this.extent.xmax,
                      y: this.extent.ymax,
                      spatialReference: {
                        wkid: 4326,
                      },
                    };
                    var screenRighttop = _that.mapView.toScreen(righttop);

                    this.canvas
                      .getContext("2d")
                      .drawImage(
                        this.image,
                        screenPoint.x,
                        screenPoint.y,
                        Math.abs(screenRighttop.x - screenLeftbottom.x),
                        Math.abs(screenRighttop.y - screenLeftbottom.y)
                      );

                    return this.canvas.toDataURL("image/png");
                  },
                });

                var imageOverlayLayer = new CustomImageOverlayLayer({
                  picUrl: options.url,
                  extent: options.extent,
                  id: options.id,
                });
                _that.map.add(imageOverlayLayer);
              },
            ],
            [
              "GraphicLayer",
              (options) => {
                var layer = new Graphic({
                  geometry: options.geometry,
                  id: options.id,
                });
                if (options.addMap) {
                  _that.map.add(layer);
                }
                return layer;
              },
            ],
          ]),
          symbol(options) {
            return this.symbolMethod.get(options.type)(options);
          },
          symbolMethod: new Map([
            [
              "PictureMarkerSymbol",
              (options) => {
                return {
                  type: "picture-marker",
                  url: options.url,
                  width: options.width,
                  height: options.height,
                };
                return new PictureMarkerSymbol(
                  options.url,
                  options.width,
                  options.height
                );
              },
            ],
            [
              "TextSymbol",
              (options) => {
                return {
                  type: "text",
                  color: "#000",
                  haloColor: "#fff",
                  haloSize: "2px",
                  text: options.text,
                  xoffset: options.offsetX ? options.offsetX : 3,
                  yoffset: options.offsetY ? options.offsetY : -20,
                  font: {
                    size: options.fontSize ? options.fontSize : 10,
                    weight: "bold",
                  },
                };
                return new PictureMarkerSymbol(
                  options.url,
                  options.width,
                  options.height
                );
              },
            ],
            [
              "SimpleMarkerSymbol",
              () => {
                return {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    size: 3,
                    color: "white",
                    style: "circle",
                    outline: {
                      width: 0.5,
                      color: "gray",
                    },
                  },
                };
              },
            ],
            [
              "SimpleFillSymbol",
              (options) => {
                return {
                  type: "simple-fill",
                  color: options.color || [226, 119, 40, 0.3],
                  outline: {
                    width: options.outline.width || 1.5,
                    color: options.outline.color || [255, 128, 0, 0.5],
                  },
                };
              },
            ],
            [
              "SimpleLineSymbol",
              (options) => {
                var symbol = {
                  type: "simple-line",
                  style: options.style || "solid",
                  width: options.width || 1,
                  color: options.color || [255, 75, 0, 0.8],
                };
                if (options.marker) {
                  symbol.marker = options.marker;
                }
                return symbol;
              },
            ],
            [
              "FeatureLayerPictureMarkerSymbol",
              (options) => {
                return {
                  type: "simple",
                  symbol: {
                    type: "picture-marker",
                    url: options.url,
                    width: options.width,
                    height: options.height,
                  },
                };
              },
            ],
          ]),
          identifyTaskQuery(options, callback) {
            var identifyTask = new IdentifyTask(options.url);
            var params = new IdentifyParameters();
            params.tolerance = 3;
            params.returnGeometry = true;
            params.layerIds = options.layerIds;
            params.layerOption = "top";
            params.width = _that.mapView.width;
            params.height = _that.mapView.height;
            params.geometry = options.evt.mapPoint;
            params.mapExtent = _that.mapView.extent;

            identifyTask
              .execute(params)
              .then((response) => {
                callback(response.results);
              })
              .then(() => {});
          },
          /**根据经纬度生成缓冲区
           *
           * buffer(geometry, distance, unit, unionResults)
           * "meters"|"feet"|"kilometers"|"miles"|"nautical-miles"|"yards"
           * */
          createBuffer(options) {
            var geometry = null;
            var bufferGraphic = null;
            var layer = new GraphicsLayer({
              opacity: 1,
              id: options.id
                ? options.id
                : Math.random().toString(36).substr(4),
            });
            if (options.geometryType == "point") {
              geometry = new Point({
                spatialReference: 4326,
                x: options.data.longitude,
                y: options.data.latitude,
              });
            }

            var buff = geometryEngine.geodesicBuffer(
              geometry,
              options.distance,
              options.unit
            );

            bufferGraphic = new Graphic({
              geometry: buff,
              symbol: {
                type: "simple-fill",
                color: [226, 119, 40, 0.3],
                outline: {
                  width: 1.5,
                  color: [255, 128, 0, 0.5],
                },
              },
            });
            layer.add(bufferGraphic);
            _that.map.add(layer);
            _that.map.reorder(layer, 1);
            return layer;
          },
          //mapServer服务地址转换为FeatureServer
          mapServerToFeatureServer(url) {
            var urlArr = url.split("/");
            urlArr.splice(urlArr.length - 1, 1);
            urlArr.push("FeatureServer", "0");
            return urlArr.join("/");
          },
          // MapServer转换为FeatureServer 查询定位extent
          mapImageLayerToExtent(url, where = "1=1") {
            var joinUrl = this.mapServerToFeatureServer(url);
            const tempLayer = new FeatureLayer({
              url: joinUrl,
            });
            const query = new Query();
            query.where = where;
            tempLayer.queryExtent(query).then(function (results) {
              if (results.count == 0) return;
              var tempExtent = results.extent;
              tempExtent.spatialReference = {
                wkid: 4326,
              };
              _that.mapView.goTo(tempExtent.expand(1.7));
            });
          },
          //根据经纬度以及zoom定位
          mapToCenter(options) {
            var _self = this;
            clearTimeout(_that.varSetTimeout);
            _self.removeLayer("kyFlashFeatureLayer");
            var layer = new FeatureLayer({
              id: "kyFlashFeatureLayer",
              source: [
                {
                  geometry: {
                    type: "point",
                    longitude: options.x,
                    latitude: options.y,
                  },
                },
              ],
              objectIdField: "ObjectID",
              renderer: {
                type: "simple",
                symbol: {
                  type: "picture-marker",
                  url: require("../assets/img/g500.gif"),
                  width: "30px",
                  height: "30px",
                },
              },
            });
            _that.map.add(layer);
            _that.varSetTimeout = setTimeout(function () {
              _self.removeLayer("kyFlashFeatureLayer");
            }, 4000);
            var point = new Point({
              spatialReference: 4326,
              x: options.x,
              y: options.y,
            });
            _that.mapView.goTo(
              {
                target: point,
                zoom: options.zoom,
              },
              {
                duration: 700,
              }
            );
          },
          getTileInfo() {
            return new TileInfo({
              dpi: 90.71428571428571,
              rows: 256,
              cols: 256,
              compressionQuality: 0,
              origin: {
                x: -180,
                y: 90,
              },
              spatialReference: {
                wkid: 4326,
              },
              lods: [
                {
                  level: 0,
                  levelValue: 1,
                  resolution: 0.703125,
                  scale: 295829355.454566,
                },
                {
                  level: 1,
                  levelValue: 2,
                  resolution: 0.3515625,
                  scale: 147914677.727283,
                },
                {
                  level: 2,
                  levelValue: 3,
                  resolution: 0.17578125,
                  scale: 73957338.863641,
                },
                {
                  level: 3,
                  levelValue: 4,
                  resolution: 0.087890625,
                  scale: 36978669.431821,
                },
                {
                  level: 4,
                  levelValue: 5,
                  resolution: 0.0439453125,
                  scale: 18489334.71591,
                },
                {
                  level: 5,
                  levelValue: 6,
                  resolution: 0.02197265625,
                  scale: 9244667.357955,
                },
                {
                  level: 6,
                  levelValue: 7,
                  resolution: 0.010986328125,
                  scale: 4622333.678978,
                },
                {
                  level: 7,
                  levelValue: 8,
                  resolution: 0.0054931640625,
                  scale: 2311166.839489,
                },
                {
                  level: 8,
                  levelValue: 9,
                  resolution: 0.00274658203125,
                  scale: 1155583.419744,
                },
                {
                  level: 9,
                  levelValue: 10,
                  resolution: 0.001373291015625,
                  scale: 577791.709872,
                },
                {
                  level: 10,
                  levelValue: 11,
                  resolution: 0.0006866455078125,
                  scale: 288895.854936,
                },
                {
                  level: 11,
                  levelValue: 12,
                  resolution: 0.00034332275390625,
                  scale: 144447.927468,
                },
                {
                  level: 12,
                  levelValue: 13,
                  resolution: 0.000171661376953125,
                  scale: 72223.963734,
                },
                {
                  level: 13,
                  levelValue: 14,
                  resolution: 8.58306884765625e-5,
                  scale: 36111.981867,
                },
                {
                  level: 14,
                  levelValue: 15,
                  resolution: 4.291534423828125e-5,
                  scale: 18055.990934,
                },
                {
                  level: 15,
                  levelValue: 16,
                  resolution: 2.1457672119140625e-5,
                  scale: 9027.995467,
                },
                {
                  level: 16,
                  levelValue: 17,
                  resolution: 1.0728836059570313e-5,
                  scale: 4513.997733,
                },
                {
                  level: 17,
                  levelValue: 18,
                  resolution: 5.3644180297851563e-6,
                  scale: 2256.998867,
                },
                {
                  level: 18,
                  levelValue: 19,
                  resolution: 0.000002682209014892578,
                  scale: 1128.499433,
                },
              ],
            });
          },
          loadTdtImg() {
            var _self = this;
            var tiledLayer = new WebTileLayer({
              id: "TdtImg",
              urlTemplate:
                tiandituBaseUrl +
                "/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
                token,
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              spatialReference: 4326,
              tileInfo: _self.getTileInfo(),
            });
            _that.map.add(tiledLayer, 0);
          },
          loadTdtVec() {
            var _self = this;
            var tiledLayer = new WebTileLayer({
              id: "TdtVec",
              urlTemplate:
                tiandituBaseUrl +
                "/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
                token,
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              spatialReference: 4326,
              tileInfo: _self.getTileInfo(),
            });
            _that.map.add(tiledLayer, 0);
          },
          loadTdtTer() {
            var _self = this;
            var tiledLayer = new WebTileLayer({
              id: "TdtTer",
              urlTemplate:
                tiandituBaseUrl +
                "/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=" +
                token,
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              spatialReference: 4326,
              tileInfo: _self.getTileInfo(),
            });
            _that.map.add(tiledLayer, 0);
          },
        };
        _that.oneMap.loadTdtImg();
        //_that.map.add(tiledLayerAnno);
        _that.mapView.ui.components = [];
        _that.$store.commit("SET_ONEMAP", _that.oneMap);
        _that.$store.commit("SET_MAP", _that.map);
        _that.$store.commit("SET_MAPVIEW", _that.mapView);
        _that.$emit("done");

        /**此方法只支持如下图层GraphicsLayer, FeatureLayer, SceneLayer,
         * BuildingSceneLayer, PointCloudLayer, CSVLayer,
         * StreamLayer, GeoJSONLayer and SceneView.graphics. **/
        _that.mapView.on("pointer-move", (evt) => {
          _that.mapView.hitTest(evt).then(function (event) {
            if (event.results.length) {
              var result = event.results[0];
              if (
                typeof _that.mouseoverMap.get(result.graphic.layer.id) !=
                "undefined"
              ) {
                _that.mouseoverMap.get(result.graphic.layer.id)(result);
              }
            }
          });
        });

        _that.mapView.on("click", (evt) => {
          _that.mapView.hitTest(evt).then(function (event) {
            if (event.results.length) {
              var result = event.results[0];
              if (
                typeof _that.clickMap.get(result.graphic.layer.id) !=
                "undefined"
              ) {
                _that.clickMap.get(result.graphic.layer.id)(result);
              }
            }
          });
        });
      }
    );
  },
  mounted() {},
  beforeUnmount() {
    if (this.view) {
      this.view.destroy();
    }
  },
};
</script>
<style scoped>
#map__container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
