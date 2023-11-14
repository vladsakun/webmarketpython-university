$(document).ready(function() {
    var local = "http://127.0.0.1:8000/"
    var current_category
    var left_ul = $(".left-admin-menu").children("ul")
    if (screen.width <= 768 && window.innerHeight > window.innerWidth) {
        $(".admin-menu-text").remove()
        $(".left-admin-menu").attr("id", "mobile-menu")
        $("#add-product").append('<img src="/static/image/add.svg">')
        $("#comments").append('<img src="/static/image/comment.svg">')
    }
    // $(left_ul).on("click", function(e){
    //     $("li").removeClass("active")
    //     console.log("removeClass('active')")
    // })
    $("#add-product").on("click", function() {
        var clean = left_ul.find("li")
        clean.removeClass("active")
        if (screen.width > 768) {
            $("#add-product").addClass("active")
        }
        $.ajax({
            url: local + "products/create"
        }).done(function(response) {
            $("#right-admin-func").html(response);
        })
    })
    $("#categories").on("click", function(e) {
        var clean = left_ul.find("li")
        clean.removeClass("active")
        if ($(e.target).hasClass("category-item")) {
            $.ajax({
                url: local + "admin/products/edit/" + $(e.target).attr("id")
            }).done(function(response) {
                $("#right-admin-func").html(response);
            })
            current_category = $(e.target).attr("id")
        }
    })
    $("#comments").on("click", function() {
        var clean = left_ul.find("li")
        clean.removeClass("active")
        if (screen.width > 768) {
            $(this).addClass("active")
        }
        $.ajax({
            url: local + "admin/comments"
        }).done(function(response) {
            $("#right-admin-func").html(response);
        })
    })
    $('body').on('click', function(e) {
        if ($(e.target).hasClass('submit')) {
            var comment_id = $(e.target).attr("comment_id")
            $.ajax({
                url: local + "admin/comment/submit/" + comment_id
            }).done(function(response) {})
            parent = $('body').find(".comment" + comment_id)
            parent.hide(300)
        }
        if ($(e.target).hasClass('delete')) {
            var comment_id = $(e.target).attr("comment_id")
            $.ajax({
                url: local + "admin/comment/delete/" + comment_id
            }).done(function(response) {})
            parent = $('body').find(".comment" + comment_id)
            parent.hide(300)
        }
        if ($(e.target).hasClass('edit-submit-btn')) {
            var parent = $(e.target).parent()
            var id = parent.find(".edit-submit-btn").attr("product_id")
            var title = parent.find(".edit-title").val()
            var price = parent.find(".edit-price").val()
            var status = parent.find(".edit-status").val()
            var post = parent.find(".edit-post").val()
            var gender = parent.find(".edit-gender").val()
            gender = gender.split(' ').join('_');
            post = post.split(' ').join('_');
            status = status.split(' ').join('_');
            price = price.split(' ').join('_');
            title = title.split(' ').join('_');
            $.ajax({
                url: local + "admin/product/edit/" + id + "/" + title + "/" + price + "/" + status + "/" + post + "/" + gender
            }).done(function(response) {
                $("#right-admin-func").html(response);
                $("#edit-title").val(title)
                $("#edit-price").val(price)
                $("#edit-status").val(status)
                $("#edit-post").val(post)
            })
        }
        if ($(e.target).hasClass('page-span')) {
            if (!$(e.target).attr("id")) {
                var currentPage = $(e.target).text();
                $(".page-span").removeAttr("id")
                $(e.target).attr("id", "current-num")
                $.ajax({
                    url: local + "admin/products/edit/" + current_category + "?page=" + currentPage.replace(/\s+/g, ''),
                    cache: false,
                    success: function(response) {
                        result = $(response).find(".edit-product");
                        $("#products").html(result);
                    }
                });
            }
        }
        if ($(e.target).attr('id') == 'first-page') {
            $.ajax({
                url: local + "admin/products/edit/" + current_category + "?page=1/",
                cache: false,
                success: function(response) {
                    result = $(response).find(".edit-product");
                    $("#products").html(result);
                }
            })
        }
        if ($(e.target).hasClass('search-btn')) {
            var search_input = $("#search").find('#search-input')
            var search_text = search_input.val()
            $.ajax({
                url: local + "admin/product/search/" + search_text,
                cache: false,
                success: function(response) {
                    result = $(response).find(".edit-product");
                    $("#users").html(result);
                }
            })
        }
    });
});