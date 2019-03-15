//业务相关脚本(ajax的提交和反馈)

//标识目前所登录的账户
let currentUser = undefined;

//配置ajax的数组，[按钮id,url末端,表单id]
const submit_arr=[
    ["#login_button","login","#login_form"],//登录
    ["#signup_others_button","signup","#signup_others_form"],//注册
    ["#forget_psw_button","forget_psw","#forget_psw_form"],//忘密码
    ["#alter_normal_button","alter_normal","#alter_normal_form"],//改普通信息
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
                alert("Your account is creating,\nplease wait...");
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
            //改密码
            case 4:
                alert("密码修改成功");
                window.location.href="#profile-page";
                break;
            //支付操作提交
            case 5:
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
    return{
        blockchain: "aaa",
        password: psw
    };
}

function pairUpdate(pair) {
    $.ajax({
        type: "POST",
        url: host_url + "geth/updateGeth",
        data: pair,
        tradition: true,
        datatype: "json",
        async: false,
        success: (request) => {
            if (request['return']==="ok")
                alert("[Blockchain+Update]Sign up complete!");
            else
                alert("[Blockchain]" + request['return']);
        },
        error: () => {
            alert("[Blockchain]Update error!")
        },
    })
}

//登录完成后客户端的操作
function loginAction(result) {
    userMsgAlt(result['name'], result['phone'], result['email']);
    $("#usr_icon_link").attr("href","#profile-page");
    $("#usr_icon_text").html("Welcome! " + result['name']);
    currentUser = result['phone'];
    home_toggle();
}

//解除登录，及成功之后的客户端操作
$("#logout_button").click(()=>{cancelLoginAction()});
function cancelLoginAction() {
    userMsgAlt("","","");
    //修改侧边菜单图标和数据
    $("#usr_icon_link").attr("href","#login-page");
    $("#usr_icon_text").html("Welcome! Please tap here to login");
    window.location.href="#main-page";
    currentUser = undefined;
}

//更新修正用户信息页
function userMsgAlt(name, phone, email) {
    $("#prof_user").html(name);
    $("#prof_phone").html(phone);
    $("#prof_email").html(email);
}

//根据用户名向服务器请求对应的geth账户
function getGethAccount(user) {
    $.ajax({
        type: "POST",
        url: host_url + "geth/getGeth",
        data: user,
        tradition: true,
        dataType: "json",
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
