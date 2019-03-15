//最终决定交易

$("#exec_button").click(()=>{deal()});
function deal() {
    $.ajax({
        type: "POST",
        url: host_url + url,
        data: $("#exec_form").serialize(),
        tradition: true,
        dataType: "json",
        async: true,
        success: (result) => {

        },
        error: () => {
            alert("[Server]No response!")
        },
    })
}
