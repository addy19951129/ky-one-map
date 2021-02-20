export default {
  url: "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/init.js",
  css: "http://118.89.18.66/arcgis/arcgis_js_v417_api/arcgis_js_api/library/4.17/esri/css/main.css",
  dojoConfig: {
    async: false,
  },
  tdtToken:"5630174b76350ef58bc5a615a890a46a",
  //影像注记(球面墨卡托投影)
  imgAnnoTdtUrl: `http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${this.tdtToken}`,
  //天地图影像
  imgTdtUrl: `http://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${this.tdtToken}`,
  //天地图矢量
  vecTdtUrl: `http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${this.tdtToken}`,
  //天地图地形
  terTdtUrl: `http://{subDomain}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=${this.tdtToken}`,
  
}
