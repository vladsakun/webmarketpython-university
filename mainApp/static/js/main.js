$(window).ready(function() {
    var $close = $("#close-nav");
    var $open = $("#open-nav");
    //Закрытие меню для телефон
    $close.on("click", function() {
        $("#site-nav ul").removeClass("active");
        $("#basket-desktop").css('display', 'block')
    });
    //Открытие меню для телефон
    $open.on("click", function() {
        $("#basket-desktop").css('display', 'none')
        $("#site-nav ul").addClass("active");
    });
    $('.footer-menu-item').after('<hr/>')
});