import setting from "../setting"
import {
  loadModules
} from "esri-loader";
export default async (option) => {
  const [
    esriMap,
  ] = await loadModules(
    [
      "esri/Map",
    ], {
      url: setting.url,
      css: setting.css,
      dojoConfig: setting.dojoConfig
    }, {
      css: true,
    }
  )
  return new esriMap()
}
