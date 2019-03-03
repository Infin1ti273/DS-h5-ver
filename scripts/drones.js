//为现有无人机添加数值和链接绑定
//向服务端获取无人机的数量和型号并将对应按钮插入到选择页的框体中
let droneCounter = 0;
let drone = {
    number : undefined,
    start : undefined,
    terminal : undefined,
};

droneInit();
function droneInit() {
    $("#drone_sample_1").click(()=>{
        droneBind(1);
        getDroneStart(1);
        window.location.href="#main-page";
    });
    $("#drone_sample_2").click(()=>{
        droneBind(2);
        getDroneStart(2);
        window.location.href="#main-page";
    });
}

function droneBind(num) {
    drone.number = num;
    mainListDroneBind(drone.number);
}

function getDroneStart(num) {
    $.ajax({
        type: "POST",
        url: host_url + "get_drones",
        data: num.serialize(),
        dataType: "json",
        async: false,
        success: (res)=>{
            drone.start = JSON.parse(res);
            $("#input-start").val(drone.start);
        },
        error: ()=>{
            alert("Cannot add the drone!");
        }
    });
}

function mainListDroneBind(num) {
    $("#main-list-drone").html("Drone: " + num);
    $("#main-list-location").html("Location: Unknown");
    $("#main-list-status").html("Status: Waiting for configuration");
}

function mainListLocationBind(start, terminal) {
    $("#main-list-location").html(`Location: From ${ start } to ${ terminal }`);
    $("#main-list-status").html("Status: Ready for deployment");
}

function mainListConnecting() {
    $("#main-list-status").html("Status: Connecting");
}

function mainListReset() {
    drone.number = undefined;
    drone.start = undefined;
    drone.terminal = undefined;
    $("#main-list-drone").html("Drone: Please choose a drone!");
    $("#main-list-location").html("Location: Please choose a drone!");
    $("#main-list-status").html("Status: Please choose a drone!");
}

function getDroneCount() {
    $("#drone_field").empty();
    $.ajax({
        type: "POST",
        url: host_url + "get_drones",
        dataType: "json",
        async: true,
        success: (res)=>{
            droneCounter = JSON.parse(res);
        },
        error: () =>{
          drone.number = 0;
        }
    });
}
//getDroneCount();

