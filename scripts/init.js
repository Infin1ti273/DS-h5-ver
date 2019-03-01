//应用启动的初始化操作，向服务器检测用户登录状态，如果没有超过有效期，自动触发登录
//如果用户未登录，则锁定主页下三个按钮

init();
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
    let result = JSON.parse(res);
    if (result['return']==="un"){
        //未登录（测试）
        alert("未登录！");
    }
    else{
        loginAction(result);
    }
}

function home_toggle() {
    // noinspection JSJQueryEfficiency
    let p = $("#config_button").attr("href");
    if(p === "#") {
        $("#config_button").attr("href","#config-page");
        $("#choice_button").attr("href","#select-page");
        $("#deploy_button").attr("href","#exec-page");
        $("#wallet_button").attr("href","#wallet-page");
    }
    else {
        $("#config_button").attr("href","#");
        $("#choice_button").attr("href","#");
        $("#deploy_button").attr("href","#");
        $("#wallet_button").attr("href","#");
    }
}

/* Remove the comment when testing
home_toggle();
*/

