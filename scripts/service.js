//应用启动的初始化操作，向服务器检测用户登录状态，如果没有超过有效期，自动触发登录
//如果用户未登录，则锁定主页下三个按钮

//与服务器端通信的根目录
const host_url="http://localhost:8000/";
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



//业务相关脚本(ajax的提交和反馈) 登录　和　解除登录

//标识目前所登录的账户
let currentUser = undefined;

//配置ajax的数组，[按钮id,url末端,表单id]
const submit_arr=[
    ["#login_button","login","#login_form"],//登录
    ["#signup_others_button","signup","#signup_others_form"],//注册
    ["#forget_psw_button","forget_psw","#forget_psw_form"],//忘密码
    ["#alter_normal_button","alter_normal","#alter_normal_form"],//改普通信息
    ["#alter_phone_button","alter_phone","#alter_phone_form"],//改手机
    ["#alter_psw_button","alter_psw","#alter_psw_form"],//改密码
    ["#exec_button","exec","exec_form"]//支付操作提交
];
//ajax的表单发送方法　传入参数:url 表单id
//基于ajax方法的不同对象添加额外的操作
function extendAct(num, result_json) {
    //收到了来自服务器的正确回复
    let result = JSON.parse(result_json);
    if (result['return']==="ok"){
        switch (num) {
            //登录
            case 0:
                alert("登录成功！");
                //修改侧边菜单图标的内容和链接
                loginAction(result);
                window.location.href="#main-page";
                break;
            case 1:
                //向geth请求生成一个对应的以太坊账号
                let pair = gethGenerate(result['phone']);
                //将账号-密码值对交由服务器保存
                pairUpdate(pair);
                window.location.href="#login-page";
                break;
            //忘密码
            case 2:
                alert("密码找回成功！您的密码是： " + result['psw']);
                //没有额外操作了
                window.location.href="#login-page";
                break;
            //改普通信息
            case 3:
                alert("信息修改成功！");
                //触发用户信息修正
                userMsgAlt(result['username'], result['phone'], result['email']);
                window.location.href="#profile-page";
                break;
            //改手机
            case 4:
                alert("手机修改成功！");
                //触发用户信息修正
                userMsgAlt(result['username'], result['phone'], result['email']);
                window.location.href="#profile-page";
                break;
            //改密码
            case 5:
                alert("密码修改成功");
                window.location.href="#profile-page";
                break;
            //支付操作提交
            case 6:
                alert("支付操作成功，无人机正在执行您的操作！");
                window.location.href="#main-page";
                break;
        }
        $("input").val("");
    }
    //服务器处理错误，但成功返回数据
    else {
        alert(result['return']);
        //清空所有对应输入框的内容
        $("#login_psw_input").val("");
        $("#signup_psw_input").val("");
        $("#signup_psw2_input").val("");
    }
}
//具体的返回结果会根据url交给后台判断
function auth(url, form_id, num){
    $.ajax({
        type: "POST",
        url: host_url + url,
        data: $(form_id).serialize(),
        tradition: true,
        dataType: "json",
        async: false, //同步操作。即：用户必须要等待服务器反馈之后才能操作
        success: (result) => {
            extendAct(num, result)
        },
        error: () => {
            alert("[Server]No response!")
        },
    });
}
//为所有需要进行表单发送的按钮添加ajax方法
for(let i=0;i<submit_arr.length;i++){
    $(submit_arr[i][0]).click( () => {auth(submit_arr[i][1],submit_arr[i][2],i);})
}

function gethGenerate(psw) {
    return ["aaa",psw];
}

function pairUpdate(pair) {
    $.ajax({
        type: "POST",
        url: host_url + url,
        data: pair.serialize(),
        tradition: true,
        dataType: "json",
        async: false,
        success: () => {
            alert("[Blockchain+Update]Sign up complete!");
        },
        error: () => {
            alert("[Blockchain]Update error!")
        },
    })
}

//登录完成后客户端的操作
function loginAction(result) {
    //更新用户信息页数据
    userMsgAlt(result['name'], result['phone'], result['email']);
    //修改侧边菜单图标和数据
    $("#usr_icon_link").attr("href","#profile-page");
    $("#usr_icon_text").val("Welcome! " + result['user']);
    //前端登记已登录的用户名
    currentUser = result['phone'];
    home_toggle();
}

//解除登录，及成功之后的客户端操作
$("#logout_button").click(()=>{cancelLoginAction()});
function cancelLoginAction() {
    //向服务器请求解除登录,不要求返回数据
    $.ajax({
        type: "POST",
        url: host_url + "exit",
        data: {"request":"user"},
        tradition: true,
        async: false,
        success: function () {
            userMsgAlt("","","");
            //修改侧边菜单图标和数据
            $("#usr_icon_link").attr("href","#login-page");
            $("#usr_icon_text").val("Welcome! Please tap here to login");
            currentUser = undefined;
        },
        error: ()=>{
            alert("[Logout]Fail to sign out!");
        },
    });
}

//更新修正用户信息页的操作
function userMsgAlt(name, phone, email) {
    $("#prof_user").html(name);
    $("#prof_phone").html(phone);
    $("#prof_email").html(email);
}

//wallet页服务配置
function walletConfig() {
    let pair;   //账号－密码对
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

//根据用户名向服务器请求对应的geth账户
function getGethAccount(user) {
    $.ajax({
        type: "POST",
        url: host_url + "getGeth",
        data: [user].serialize(),
        tradition: true,
        dataType: "json",
        async: false,
        success: (result) => {
            return JSON.parse(result);
        },
        error: () => {
            alert("Failed to get blockchain account!")
        },
    });
}

function gethInquiry(geth, psw) {
    ver()
}

function gethRefund(geth, psw, cash) {
    ver()
}

function gethRecharge(geth, psw, cash) {
    ver()
}