import Map from "./core/Map"
import MapView from "./core/MapView"
import WebTileLayer from "./layer/WebTileLayer"
export default {
  mapView: "",
  map:"",
  createMapView: (option) => {
    var _self = this;
    MapView(option).then((response) => {
      _self.default.mapView = response.mapView;
 _self.default.map = response.map;
    })
  },
  addLayer(option) {
    var _self = this;
    WebTileLayer(option).then((layer) => {
      console.log(layer)
      setTimeout(() => {
           console.log(_self.map)
        _self.map.add(layer, 0);
      },3000) 
    })
  }
}
