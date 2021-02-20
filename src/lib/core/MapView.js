import setting from "../setting"
import {
  loadModules
} from "esri-loader";
export default async (option) => {
  const [
    esriMap,
    MapView,
  ] = await loadModules(
    [
      "esri/Map",
      "esri/views/MapView",
    ], {
      url: setting.url,
      css: setting.css,
      dojoConfig: setting.dojoConfig
    }, {
      css: true,
    }
  )
  const map = new esriMap();
  return {
    mapView:new MapView(Object.assign({
      container: option.el,
      map: map,
    }, option)),
    map:map
  }
}
