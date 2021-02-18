<template>
  <div id="map__container"></div>
</template>
<script>
import { loadModules } from "esri-loader";
export default {
  name: "ky-map",
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
    };
    loadModules(
      [
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
        "esri/tasks/support/IdentifyParameters",
        "esri/geometry/geometryEngine",
        "esri/tasks/support/Query",
      ],
      options,
      {
        css: true,
      }
    ).then(
      ([
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
        IdentifyParameters,
        geometryEngine,
        Query,
      ]) => {
        var tiandituBaseUrl = "http://{subDomain}.tianditu.gov.cn"; //天地图服务地址
        var token = "5630174b76350ef58bc5a615a890a46a"; //天地图token
        _that.map = new esriMap({});
        _that.mapView = new MapView({
          container: this.$el,
          map: _that.map,
          center: [117.938, 26.127],
          zoom: 8,
        });
        //影像地图(球面墨卡托投影)
        var tiledLayer = new WebTileLayer({
          urlTemplate:
            tiandituBaseUrl +
            "/img_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=img&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
            token,
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        });
        //影像注记(球面墨卡托投影)
        var tiledLayerAnno = new WebTileLayer({
          urlTemplate:
            tiandituBaseUrl +
            "/cia_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=" +
            token,
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        });
        var cityBoundry = new MapImageLayer({
          url:
            "http://120.79.6.214:6080/arcgis/rest/services/SXYfjxzjx/MapServer",
          sublayers: [
            {
              id: 3,
              visible: false,
            },
            {
              id: 2,
              visible: true,
            },
            {
              id: 1,
              visible: false,
            },
            {
              id: 0,
              visible: false,
            },
            {
              id: 4,
              visible: false,
            },
          ],
        });

        _that.oneMap = {
          zoom: "7",
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
                    _that.mapview.goTo(layer.fullExtent.expand(1.7));
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
                  type: "text", // autocasts as new TextSymbol()
                  color: "#000",
                  haloColor: "#fff",
                  haloSize: "2px",
                  text: options.text,
                  xoffset: options.offsetX ? options.offsetX : 3,
                  yoffset: options.offsetY ? options.offsetY : -20,
                  font: {
                    // autocasts as new Font()
                    size: options.fontSize ? options.fontSize : 10,
                    family: "Josefin Slab",
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
              () => {
                return {
                  type: "simple",
                  symbol: {
                    type: "simple-fill",
                    style: "none",
                    outline: {
                      width: 0.5,
                      color: "gray",
                    },
                  },
                };
              },
            ],
            [
              "SimpleLineSymbol",
              () => {
                return {
                  type: "simple",
                  symbol: {
                    type: "simple-line",
                    style: "none",
                    width: 0.7,
                    color: "white",
                  },
                };
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
          IdentifyTaskQuery(options, callback) {
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
            map.add(layer);
            map.reorder(layer, 1);
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
          setMapZoom(option) {
            _that.mapView.goTo(
              {
                zoom: option.zoom,
              },
              {
                duration: 700,
              }
            );
            // _that.mapView.zoom = zoom;
          },
        };
        _that.map.add(tiledLayer);
        _that.map.add(tiledLayerAnno);
        _that.map.add(cityBoundry);

        _that.mapView.ui.components = [];
        _that.$store.commit("SET_ONEMAP", _that.oneMap);
        _that.$store.commit("SET_MAP", _that.map);
        _that.$store.commit("SET_MAPVIEW", _that.mapView);
        _that.$emit("done");

        /**此方法只支持如下图层GraphicsLayer, FeatureLayer, SceneLayer,
         * BuildingSceneLayer, PointCloudLayer, CSVLayer,
         * StreamLayer, GeoJSONLayer and SceneView.graphics. **/
        // _that.mapView.watch("zoom", function () {
        //   _that.oneMap.zoom = _that.mapView.zoom;
        //   console.log(_that.mapView.zoom);
        // });
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

        _that.mapView.watch("extent", (evt) => {
          _that.mapView.center.longitude;
          _that.mapView.center.latitude;
          console.log(_that.mapView.center.longitude);
          console.log(_that.mapView.center.latitude);
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
  /* position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1; */
  width: 100%;
  height: calc(100vh - 140px);
}
</style>
