import setting from "../setting"
import {
  loadModules
} from "esri-loader";
export default async (option) => {
  const [
    WebTileLayer,
    TileInfo,
  ] = await loadModules(
    [
      "esri/layers/WebTileLayer",
      "esri/layers/support/TileInfo",
    ], {
      url: setting.url,
      css: setting.css,
      dojoConfig: setting.dojoConfig
    }, {
      css: true,
    }
  )

  var tileInfo = () => {
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


  var tiledLayer = new WebTileLayer({
    id: "TdtImg",
    urlTemplate: setting.imgTdtUrl,
    subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    spatialReference: 4326,
    tileInfo: tileInfo(),
  });
  return tiledLayer
}
