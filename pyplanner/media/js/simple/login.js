$(function(){
    $("#remember-btn").click(function(e){

        if(typeof($("#remember-chk").attr('checked')) != 'undefined')
            $("#remember-chk").removeAttr('checked');
        else
            $("#remember-chk").attr('checked','checked');
    });
});