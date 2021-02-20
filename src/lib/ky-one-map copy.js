import {
  loadModules
} from "esri-loader";
import "reset-css";

const options = {
  url: "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/init.js",
  css: "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/esri/css/main.css",
  dojoConfig: {
    async: false,
  },
};
let mapConfig;

const [esriConfig,
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
  BaseDynamicLayer
] = await loadModules(
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
  options, {
    css: true,
  }
)


mapConfig = function (Vue, globalOption = {}) {
  let self = {},
    clickMap = new Map(),
    mouseoverMap = new Map(),
    mapToSetTimeout;
  const defaultOption = {
    baseUrl: "http://{subDomain}.tianditu.gov.cn",
    token: "5630174b76350ef58bc5a615a890a46a",
    //影像注记(球面墨卡托投影)
    imgAnnoUrl: `${baseUrl}/cia_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${token}`,
    //天地图影像
    imgTdtUrl: `${baseUrl}/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${token}`,
    //天地图矢量
    vecTdtUrl: `${baseUrl}/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${token}`,
    //天地图地形
    terTdtUrl: `${baseUrl}/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=${token}`,
    tileInfo: () => {
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
        lods: [{
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
    }
  };
  const map = new esriMap();
  self.createMapView = (option) => {
    self.mapView = new MapView(Object.assign({
      container: option.el,
      map: map,
    }, option));
    // center: [115.9, 28.777],
    // zoom: 13,
    // constraints: { maxZoom: 18 },
  }

  self.addLayer = (layerType, options) => {
    options = Object.assign({
        url: "",
        opacity: 1,
        id: Math.random().toString(36).substr(4),
        outFields: ["*"],
      },
      options || {}
    );
    return this.addLayerMethod.get(layerType)(options);
  }

  self.removeLayer = (layerId) => {
    var layer = map.findLayerById(layerId);
    if (clickMap.has(layerId)) {
      clickMap.delete(layerId);
    }
    if (mouseoverMap.has(layerId)) {
      mouseoverMap.delete(layerId);
    }
    map.remove(layer);
  }

  self.addLayerMethod = new Map([
    [
      "MapImageLayer",
      (options) => {
        var layer = new MapImageLayer(options);

        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
        if (options.onClick && typeof options.onClick == "function") {}
        if (
          options.onMouseover &&
          typeof options.onMouseover == "function"
        ) {
          mouseoverMap.set(options.id, options.onMouseover);
        }
        if (options.toFullExtent) {
          layer.when(function () {
            layer.fullExtent.spatialReference = {
              wkid: 4326,
            };
            //mapView.goTo(layer.fullExtent.expand(1.7));
          });
        }
        return layer;
      },
    ],
    [
      "FeatureLayer",
      (options) => {
        var layer = new FeatureLayer(options);
        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
        if (options.onClick && typeof options.onClick == "function") {
          clickMap.set(options.id, options.onClick);
        }
        if (
          options.onMouseover &&
          typeof options.onMouseover == "function"
        ) {
          mouseoverMap.set(options.id, options.onMouseover);
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
        var defaultLonField = options.lonField ?
          options.lonField :
          "lon",
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
            symbol = oneMap.symbol(options.data[i].symbol);
          } else if (options.symbol) {
            symbol = oneMap.symbol(options.symbol);
          }
          if (options.data[i].label) {
            var textPoint = new Point({
              spatialReference: 4326,
              x: options.data[i][defaultLonField],
              y: options.data[i][defaultLatField],
            });
            var textSymbol = oneMap.symbol(options.data[i].label);
            var textGraphic = new Graphic(textPoint, textSymbol);
            layer.add(textGraphic);
          }
          var graphic = new Graphic(point, symbol, options.data[i]);

          layer.add(graphic);
        }
        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
        if (options.onClick && typeof options.onClick == "function") {
          clickMap.set(options.id, options.onClick);
        }
        if (
          options.onMouseover &&
          typeof options.onMouseover == "function"
        ) {
          mouseoverMap.set(options.id, options.onMouseover);
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
        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
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
            symbol = oneMap.symbol(options.data[i].symbol);
          } else if (options.symbol) {
            symbol = oneMap.symbol(options.symbol);
          }
          // debugger;
          var graphic = new Graphic({
            geometry: polyline,
            symbol: symbol,
            attributes: options.data[i].data || {},
          });
          layer.add(graphic);
        }
        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
        if (options.onClick && typeof options.onClick == "function") {
          clickMap.set(options.id, options.onClick);
        }
        if (
          options.onMouseover &&
          typeof options.onMouseover == "function"
        ) {
          mouseoverMap.set(options.id, options.onMouseover);
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
            symbol = oneMap.symbol(options.data[i].symbol);
          } else if (options.symbol) {
            symbol = oneMap.symbol(options.symbol);
          }
          var graphic = new Graphic({
            geometry: polygon,
            symbol: symbol,
            attributes: options.data[i].data || {},
          });
          layer.add(graphic);
        }
        options.layerIndex ?
          map.add(layer, options.layerIndex) :
          map.add(layer);
        if (options.onClick && typeof options.onClick == "function") {
          clickMap.set(options.id, options.onClick);
        }
        if (
          options.onMouseover &&
          typeof options.onMouseover == "function"
        ) {
          mouseoverMap.set(options.id, options.onMouseover);
        }

        return layer;
      },
    ],
    [
      "CustomImageOverlayLayer", //自定义图片图层
      (options) => {
        //自定义叠加图片图层
        var _self = this;
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
            var screenPoint = _self.mapView.toScreen(mapPoint);
            var leftbottom = {
              x: this.extent.xmin,
              y: this.extent.ymin,
              spatialReference: {
                wkid: 4326,
              },
            };
            var screenLeftbottom = _self.mapView.toScreen(leftbottom);
            var righttop = {
              x: this.extent.xmax,
              y: this.extent.ymax,
              spatialReference: {
                wkid: 4326,
              },
            };
            var screenRighttop = _self.mapView.toScreen(righttop);

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
        map.add(imageOverlayLayer);
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
          map.add(layer);
        }
        return layer;
      },
    ],
  ])

  self.symbol = (options) => {
    return this.symbolMethod.get(options.type)(options);
  }

  self.symbolMethod = new Map([
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
  ])

  self.createBuffer = (options) => {
    var geometry = null;
    var bufferGraphic = null;
    var layer = new GraphicsLayer({
      opacity: 1,
      id: options.id ?
        options.id : Math.random().toString(36).substr(4),
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
  }

  //根据经纬度以及zoom定位
  selft.mapToCenter = (options) => {
    var _self = this;
    clearTimeout(mapToSetTimeout);
    _self.removeLayer("kyFlashFeatureLayer");
    var layer = new FeatureLayer({
      id: "kyFlashFeatureLayer",
      source: [{
        geometry: {
          type: "point",
          longitude: options.x,
          latitude: options.y,
        },
      }, ],
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
    map.add(layer);
    mapToSetTimeout = setTimeout(function () {
      _self.removeLayer("kyFlashFeatureLayer");
    }, 4000);
    var point = new Point({
      spatialReference: 4326,
      x: options.x,
      y: options.y,
    });
    _self.mapView.goTo({
      target: point,
      zoom: options.zoom,
    }, {
      duration: 700,
    });
  }

  /**此方法只支持如下图层GraphicsLayer, FeatureLayer, SceneLayer,
   * BuildingSceneLayer, PointCloudLayer, CSVLayer,
   * StreamLayer, GeoJSONLayer and SceneView.graphics. **/
  self.mapView.on("pointer-move", (evt) => {
    self.mapView.hitTest(evt).then(function (event) {
      if (event.results.length) {
        var result = event.results[0];
        if (
          typeof mouseoverMap.get(result.graphic.layer.id) !=
          "undefined"
        ) {
          mouseoverMap.get(result.graphic.layer.id)(result);
        }
      }
    });
  });

  self.mapView.on("click", (evt) => {
    self.mapView.hitTest(evt).then(function (event) {
      if (event.results.length) {
        var result = event.results[0];
        if (
          typeof clickMap.get(result.graphic.layer.id) !=
          "undefined"
        ) {
          clickMap.get(result.graphic.layer.id)(result);
        }
      }
    });
  });


  var tiledLayer = new WebTileLayer({
    id: "TdtImg",
    urlTemplate:

      "http://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5630174b76350ef58bc5a615a890a46a",
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    spatialReference: 4326,
    tileInfo: defaultOption.getTileInfo(),
  });
  map.add(tiledLayer, 0);








  return self;

};
export default mapConfig;
