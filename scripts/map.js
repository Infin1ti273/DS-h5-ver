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
$("#terminal_button").click(()=>mapInit());
function mapInit() {
    let map = new BMap.Map("map");
    //创建点坐标
    let point = new BMap.Point(116.404, 39.915);
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(point,18);
    //开启鼠标滚轮缩放
    map.enableScrollWhellZoom(true);
    //定位功能
    map.addControl(new BMap.GeolocationControl());
    //缩略图功能
    map.addControl(new BMap.OverviewMapControl());

    let mk = new BMap.Marker(point);//创建标注
    map.addOverlay(mk);//将标注添加到地图中

    let geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() === BMAP_STATUS_SUCCESS){
            let mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            //将地图中心移动到可视区中点
            map.panTo(r.point);
            let centerPixel = map.pointToOverlayPixel(map.getCenter());
            //通过设置地图的中心点，使定位点显示在手机上部分区域
            map.setCenter(map.overlayPixelToPoint({x:centerPixel.x,y:centerPixel.y+offsetY}));
            map.addEventListener('dragend',function(){
                //获得移动之后地图中心点的像素位置
                let pixel = map.pointToOverlayPixel(map.getCenter());
                //获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
                let Point = map.overlayPixelToPoint({x: pixel.x, y: pixel.y - offsetY});
                let mkn = new BMap.Marker(Point);
                map.addOverlay(mkn);
            });
        }else {
            alert('failed'+this.getStatus());
        }
    });
}
window.onload = loadMap;

$("#terminal-select-button").click(setMapTerminal);

function setMapTerminal() {
    let terminal = "101010";
    drone.terminal = terminal;
    $("#input-terminal").val(terminal);
    mainListLocationBind(drone.start, drone.terminal);
}