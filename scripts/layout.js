//应用程序布局和样式补充


//导航栏和页脚固定在界面上下
$("header").attr("data-position","fixed");
$("footer").attr("data-position","fixed");

//覆盖侧边栏，主页按钮样式
$("#side_comp1 a").addClass("ui-btn");
$(".main_content a").addClass("ui-btn");

//设定导航栏图标的缩放
$(".navi_icon, #side_icon").css({"width":"17px"},{"height":"17px"});