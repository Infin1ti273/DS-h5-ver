//地图相关服务

//选择地图坐标
let positionSelect = undefined;

//装载地图api
function loadMap() {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=3.0&ak=6iNdcRkHuYSPqYFrtotpX9dPLpaKngSZ&callback=initMap";
    document.body.appendChild(script);
}

//调用地图
function mapInit() {
    let map = new BMap.Map("map");
    //创建点坐标
    let point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point,18);
    map.enableScrollWhellZoom();
}

window.onload = loadMap;

//绑定按钮
$("#terminal_button").click(()=>mapInit());