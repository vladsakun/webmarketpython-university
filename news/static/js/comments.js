var current_product_id
var pageURL = $(location).attr("href");
pageURL = pageURL.replace('http://127.0.0.1:8000/', '')
current_product_id = pageURL;
//Изменение страницу с комм. без перезагрузки страницы
$(".page-span").on("click", function() {
    var currentPage = $(this).text();
    $.ajax({
        url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=" + currentPage.replace(/\s+/g, ''),
    }).done(function(response) {
        $("#comment-content").html(response);
    })
});
//Вовзращение на первую страницу
$("#first-page").on("click", function() {
    $.ajax({
        url: "http://127.0.0.1:8000/comments/" + current_product_id + "?page=1",
    }).done(function(response) {
        $("#comment-content").html(response);
    })
});