


function onReturn(res){
    if(res.err !== "")
        $("#alerts").html('<div class="alert alert-danger" role="alert">' + res.err + '</div>');
    else
    window.location.replace("/edit");
}

function login(){
    let data = "password=" + $("#password").val() + "&username=" + $("#username").val();
    console.log(data);
    $.ajax({
        type: "POST",
        url: "/loginEndpoint",
        data: data,
        success: onReturn,
        dataType: "json"
    });
}