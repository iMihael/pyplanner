$(function(){
    $(".remove_btn").click(function(e){
        var url = $(e.target.parentNode).attr("href");
        $(e.target.parentNode.parentNode.parentNode).hide('fade');

        $.ajax({
            url: url,
            type: 'DELETE'
        });
        return false;
    });
});