//业务相关脚本(ajax的提交和反馈)

//与服务器端通信的根目录
const host_url="http://localhost:8000/";

//进入信息页(服务端返回目前登录用户所对应信息)
function into_profile() {
    //向服务器请求一次目前登录的用户信息
    $.ajax({
        type: "POST",
        url: host_url + "profile",
        data: {"request":"enter"},
        tradition: true,
        dataType: "json",
        async: false, //同步操作
        success: function (result) {
            $("#prof_user").html(result['user']);
            $("#prof_phone").html(result['phone']);
            $("#prof_email").html(result['email']);
        },
        error: function () {
            console.log(error);
            alert("连接错误！")
        },
    });
}
//修改侧边菜单图标的内容和链接
function login_ex(usr_name) {
    $("#usr_icon_link").attr("href","#profile-page")
        .click(function () {
            into_profile();
        });
    $("#usr_icon_text").val("Welcome! " + usr_name);
}
//配置ajax的数组，[按钮id,url末端,表单id]
const submit_arr=[
    ["#login_button","login","#login_form"],//登录
    ["#signup_phone_button","signup1","#signup_phone_form"],//注册１
    ["#signup_others_button","signup2","#signup_others_form"],//注册２
    ["#forget_psw_button","forget_psw","#forget_psw_form"],//忘密码
    ["#alter_normal_button","alter_normal","#alter_normal_form"],//改普通信息
    ["#alter_phone_button","alter_phone","#alter_phone_form"],//改手机
    ["#alter_psw_button","alter_psw","#alter_psw_form"]//改密码
];
//ajax的表单发送方法　传入参数:url 表单id
//基于ajax方法的不同对象添加额外的操作（弹窗以外）
function extend_act(num, result) {
    //收到了来自服务器的正确回复
    if (result['return']==="ok"){
        switch (num) {
            //登录
            case 0:
                alert("登录成功！");
                //修改侧边菜单图标的内容和链接
                login_ex(result['username']);
                window.location.href="#main-page";
                break;
            //注册１
            case 1:
                alert("注册手机成功！");
                //修改下一个页的隐藏信息
                window.location.href="#signup-page";
                break;
            //注册２
            case 2:
                alert("你成功注册了账户！");
                //（这里最为复杂）
                //１，向服务器提交账号相关的剩余信息
                //２，将登录信息暂存在session里
                //３，修改进入登录页按钮的链接
                $("#usr_icon_link").attr("href","#profile-page");
                window.location.href="#main-page";
                break;
            //忘密码
            case 3:
                alert("密码找回成功！您的密码是： " + result['psw']);
                //没有额外操作了
                window.location.href="#login-page";
                break;
            //改普通信息
            case 4:
                alert("信息修改成功！");
                //触发一次进入用户信息页的脚本
                into_profile();
                window.location.href="#profile-page";
                break;
            //改手机
            case 5:
                alert("手机修改成功！");
                //触发一次进入用户信息页的脚本
                into_profile();
                window.location.href="#profile-page";
                break;
            //改密码
            case 6:
                alert("密码修改成功");
                //没有额外操作了
                window.location.href="#profile-page";
                break;
        }
        $("input").val("");
    }
    //服务器处理错误，但成功返回数据
    else {
        alert(result['return']);
        //清空对应输入框的内容
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
            extend_act(num, result)
        },
        error: () => {
            alert("连接错误！")
        },
    });
}
//为所有需要进行表单发送的按钮添加ajax方法
for(let i=0;i<submit_arr.length;i++){
    $(submit_arr[i][0]).click( () => {auth(submit_arr[i][1],submit_arr[i][2],i);})
}
