//应用启动的初始化操作，向服务器检测用户登录状态，如果没有超过有效期，自动触发登录

function init() {
    $.ajax({
        type: "POST",
        url: host_url + "init",
        data: {"request":"if_login"},
        tradition: true,
        dataType:"json",
        async: false,
        success: (result) => {
           init_ext(result);
        },
        error: () => {
            alert("网络无连接！")
        }
    });
}


function init_ext(res) {
    const result = JSON.parse(res);
    if (result['return']==="un"){
        //未登录（测试）
        alert("未登录！");
    }
    else{
        login_action(result);
    }
}
init();

