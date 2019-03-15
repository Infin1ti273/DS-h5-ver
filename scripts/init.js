//应用启动的初始化操作，向服务器检测用户登录状态，如果没有超过有效期，自动触发登录
//如果用户未登录，则锁定主页下三个按钮

//与服务器端通信的根目录
const host_url="http://localhost:8000/";
init();
function init() {
    $.ajax({
        type: "POST",
        url: host_url + "init",
        tradition: true,
        dataType:"json",
        success: () => {
            alert("[Server]Online!")
        },
        error: () => {
            alert("[Server]Offline!")
        }
    });
}


function home_toggle() {
    // noinspection JSJQueryEfficiency
    let p = $("#config_button").attr("href");
    if(p === "#") {
        $("#config_button").attr("href","#config-page")
            .attr("color","#333");
        $("#choice_button").attr("href","#select-page")
            .attr("color","#333");
        $("#deploy_button").attr("href","#exec-page")
            .attr("color","#333");
        $("#wallet_button").attr("href","#wallet-page")
            .attr("color","#333");
    }
    else {
        $("#config_button").attr("href","#")
            .attr("color","#ddd");
        $("#choice_button").attr("href","#")
            .attr("color","#ddd");
        $("#deploy_button").attr("href","#")
            .attr("color","#ddd");
        $("#wallet_button").attr("href","#")
            .attr("color","#ddd");
    }
}

/* Remove the comment when testing
home_toggle();
*/

//wallet
function walletConfig() {
    let pair;
    $("#g-search").click(()=>{
        pair = getGethAccount(currentUser);
        gethInquiry(pair[0],pair[1]);
    });
    $("#g-withdraw").click(walletPanel(0));
    $("#g-charge").click(walletPanel(1));
}
walletConfig();

function walletPanel(num) {
    let pair;
    switch (num) {
        case 0:
            $("#dialog-title").html("Withdraw");
            $("#dialog-text").html("Please input the balance you want to withdraw.");
            $("#dialog-button").click(()=>{
                pair = getGethAccount(currentUser);
                gethRefund(pair[0],pair[1],$("#dialog-text").val());
            });
            break;
        case 1:
            $("#dialog-title").html("Recharge");
            $("#dialog-text").html("Please input how much you want to recharge.");
            $("#dialog-button").click(()=>{
                pair = getGethAccount(currentUser);
                gethRecharge(pair[0],pair[1],$("#dialog-text").val());
            });
            break;
    }
}