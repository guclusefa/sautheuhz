(function () {
    'use strict';
    window.addEventListener('load', function () {
        var form = document.getElementById('needs-validation');
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

$(document).ready(function() {  
  
    $(".add-more").click(function(){   
        var html = $(".copy").html();  
        $(".after-add-more").after(html);  
    });  

    $("body").on("click",".remove",function(){   
        $(this).parents(".control-group").remove();  
    });  

  });  