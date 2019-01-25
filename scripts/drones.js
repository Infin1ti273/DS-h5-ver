function getDroneCount() {
    //向服务端获取无人机的数量和型号并将对应按钮插入到选择页的框体中
    $.ajax({
        type: "POST",
        url: host_url + "get_drones",
        dataType: "json",
        async: true,
        success: (res)=>{
            let result = JSON.parse(res);
            //传入对象为两组数组
            for (var i in result.num){
                $("#drone_field").append('<a id="choose_' + result.drone[i] + '">'+ result.drone[i] +'</a>')
            }
            droneCounter = i;
            //为所有无人机选择按钮添加选择机型
            for (let j=0;j<=droneCounter;j++){
                $("#choose_"+ j).click(()=>{
                        currentDrone = $("#choose_"+ j).attr("id");
                        window.location.href="#main-page";
                    }
                )
            }
        }
    });
}

