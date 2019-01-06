//业务相关脚本(ajax的提交和反馈)

//与服务器端通信的根目录
const host_url="http://localhost:8000/";

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
    switch (num) {
        //登录
        case 0:
            if (result['return']==="ok"){
                alert("登录成功！");
                //（加上登录完成的一系列操作，为界面添加信息等）
                window.location.href="#main-page";
            }
            else {
                alert(result['return']);
                $("#login_psw_input").val("");
            }
            break;
        //注册１
        case 1:
            if (result['return']==="ok"){
                alert("注册手机成功！");
                //修改下一个页的隐藏信息
                //向数据库添加账户信息
                window.location.href="#signup-page";
            }
            else {
                alert(result['return']);
            }
            break;
        //注册２
        case 2:
            if (result['return']==="ok"){
                alert("你成功注册了账户！");
                //（这里最为复杂）
                //１，向服务器提交账号相关的剩余信息
                //２，将登录信息暂存在session里
                //３，修改进入登录页按钮的链接
                window.location.href="#main-page";
            }
            else {
                alert(result['return']);
            }
            break;
        //忘密码
        case 3:
            if(result['result']==="ok"){
                alert("密码重置成功！");
            }
            else {
                alert(result['return']);
            }
            break;
        //改普通信息
        case 4:
            break;
        //改手机
        case 5:
            break;
        //改密码
        case 6:
            break;
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
        success: function (result) {
            extend_act(num, result)
        },
        error: function () {
            console.log(error);
            alert("Failed!")
        },
    });
}
//为所有需要进行表单发送的按钮添加ajax方法
for(let i=0;i<submit_arr.length;i++){
    $(submit_arr[i][0]).click(function () {
        auth(submit_arr[i][1],submit_arr[i][2],i);
    })
}
