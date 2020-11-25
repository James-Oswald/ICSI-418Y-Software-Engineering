$(document).ready(function(){
    $('.nav li').each(function(i){
      if($(this).children("a").attr("href") == window.location.pathname)
        $(this).addClass('active');
    });
});


function logoutReturn(res){
  if(res.err !== "")
        $("#alerts").html('<div class="alert alert-danger" role="alert">' + res.err + '</div>');
  else
  window.location.replace("/");
}

function logout()
{
  $.ajax({
    type: "POST",
    url: "/logoutEndpoint",
    success: logoutReturn
  });   
}