$(window).ready(function() {
    $('body').on('click', function(e) {
        // Переключение между страничками комменатариев
        if ($(e.target).hasClass('page-span')) {
            var current_product_id
            var pageURL = $(location).attr("href");
            pageURL = pageURL.replace('http://127.0.0.1:8000/', '')
            current_product_id = pageURL;
            var currentPage = $(e.target).text();
            var divPosition = $('#comment-header-group').offset();
            $('body').animate({
                scrollTop: divPosition.top
            }, 'slow');
            $.ajax({
                url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=" + currentPage.replace(/\s+/g, ''),
            }).done(function(response) {
                $("#show-comments").html(response);
            })
        }
        if ($(e.target).attr('id') == '#first-page') {
            $.ajax({
                url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=1",
            }).done(function(response) {
                $("#show-comments").html(response);
            })
        }
    })
    //Изменение страницу с комм. без перезагрузки страницы
    // $(".page-span").on("click", function() {
    //     var current_product_id
    //     var pageURL = $(location).attr("href");
    //     pageURL = pageURL.replace('http://127.0.0.1:8000/', '')
    //     current_product_id = pageURL;
    //     var currentPage = $(this).text();
    //     $.ajax({
    //         url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=" + currentPage.replace(/\s+/g, ''),
    //     }).done(function(response) {
    //         $("#comment-content").html(response);
    //     })
    // });
    //Вовзращение на первую страницу
    // $("#").on("click", function() {
    //     $.ajax({
    //         url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=1",
    //     }).done(function(response) {
    //         $("#comment-content").html(response);
    //     })
    // });
    var current_product_id
    var pageURL = $(location).attr("href");
    var $sizeBtn = $(".size");
    pageURL = pageURL.replace('http://127.0.0.1:8000/', '')
    current_product_id = pageURL;
    //Обведение в серый цвет активный размер
    $sizeBtn.on('click', function() {
        $sizeBtn.removeClass('active-size')
        $(this).addClass('active-size');
    });
    //Изменение картинки 
    $(".image-secondary").on("click", function() {
        var background = $(this).attr("background");
        $("#main-product-photo").attr("src", background);
    })
    // Добавить комментарий
    $(".comments-submit-btn").on("click", function() {
        var user_name = $("#user-name").val()
        var comment_text = $("#add-comment-text").val()
        var merits = $("#merits").val()
        var limitations = $("#limitations").val()
        if (merits == "") {
            merits = "Нет"
        }
        if (limitations == "") {
            limitations = "Нет"
        }
        var comment_text_without_spaces
        var user_name_without_spaces
        var merits_without_spaces
        var limitations_text_without_spaces
        limitations_text_without_spaces = limitations.split(' ').join('_');
        merits_without_spaces = merits.split(' ').join('_');
        user_name_without_spaces = user_name.split(' ').join('_');
        comment_text_without_spaces = comment_text.split(' ').join('_');
        $.ajax({
            url: "http://127.0.0.1:8000/addComment/" + current_product_id + "/" + user_name_without_spaces + "/" + merits_without_spaces + "/" + limitations_text_without_spaces + "/" + comment_text_without_spaces,
        }).done(function(response) {
            console.log(response)
        })
        console.log(12)
        //Блок с поля для ввода данных
        $(".form-horizontal").css('display', 'none')
        $("#comment-process").css('display', 'block')
    })
    // Показать все комментарии конткретного продукта
    $("#comment-header-name").on("click", function() {
        if (!$("#comment-header-name").hasClass("active")) {
            $("#show-comments").css('display', 'block')
            $("#comments-div").css('display', 'block')
            $("#write-comment-form").css('display', 'none')
            $("#comment-header-name").addClass("active")
            $("#show-comments").slideUp(0);
            var current_product_id
            var pageURL = $(location).attr("href");
            pageURL = pageURL.replace('http://127.0.0.1:8000/', '')
            current_product_id = pageURL;
            $.ajax({
                url: "http://127.0.0.1:8000/comments/" + current_product_id,
                async: true,
            }).done(function(response) {
                $("#show-comments").html(response);
                // Если нету комментариев
                if (!$('.comment').length) {
                    $(".pagination").css('display', 'none')
                    $("#comments-div").append("<div id=\"no-comments\">Отзывов нету.<br/> Станьте первым комментатором.</div>")
                }
                $("#show-comments").slideDown(500);
            })
        }
    });
    // Открыть окно с input, чтобы написать комментарий
    $(".write-comment").on("click", function() {
        $("#show-comments").css('display', 'none')
        $("#comment-header-name").removeClass("active")
        $("#write-comment-form").css('display', 'block')
        $(".form-horizontal").css('display', 'block')
        $("#comment-process").css('display', 'none')
        $("#comments-div").css('display', 'block')
    });
});