$(window).ready(function() {
    if ($("span").is(".span-for-hr")) {
        $('#make-order-btn').removeAttr('disabled');
    } else {
        $('#make-order-btn').attr('disabled', 'disabled');
        $("#error").text("В корзине нет товаров")
    }
    //Проверка на существование данных о пользователе в cookies
    if ($.cookie("username") && $.cookie("usersurname") && $.cookie("userphone") && $.cookie("userpost")) {
        $("#user-surname").val($.cookie("usersurname"))
        $("#user-name").val($.cookie("username"))
        $("#user-post").val($.cookie("userpost"))
        $("#user-phone").val($.cookie("userphone"))
        $("#user-mail").val($.cookie("usermail"))
        $('#submit-user-info').removeAttr('disabled');
    }
    //Изменение сумы товаров
    var items = $('.price'),
        cashOut = $('#sum'),
        sum = 0;
    $.each(items, function(value) {
        var itemValue = parseFloat(items[value].innerHTML);
        //Если число, то добавляем к сумме
        //иначе добавляем 0
        sum += !isNaN(itemValue) ? itemValue : 0;
    });
    cashOut.html('Сума: ' + sum + " ₴");
    //Ссылка на товар на картинке в корзине
    $(".image-href").each(function() {
        var $product_id = $(this).attr("product-id")
        var href = $product_id.replace("[", "").replace("]", "").replace("\'", "").replace(/'/g, "").replace(",", "");
        $(this).attr("href", "http://127.0.0.1:8000/" + href)
    });
    //При удалении
    $(".trash").on("click", function() {
            var product_in_basket = $(this).parent().parent()
            var hr = product_in_basket.parent().find("hr")
            var price_obj = product_in_basket.find(".price");
            var price = parseInt(price_obj.text())
            var count = product_in_basket.find(".counter").val();
            var dicrement_sum = parseInt(price) * parseInt(count)
            var current_sum = $("#sum").text()
                //Если телефон
            if (screen.width <= 768) {
                var current_img = product_in_basket.find(".main-product-photo")
                var current_price = product_in_basket.find(".basket-price")
                var current_size = product_in_basket.find(".basket-size")
                var current_count = product_in_basket.find(".basket-count")
                var delete_cross = product_in_basket.find(".delete-cross-desktop")
                var trash_body = delete_cross.find(".trash-body")
                var offset = trash_body.offset();
                var current_trash_left = offset.left
                var current_trash_top = offset.top
                current_sum = current_sum.replace(/\D/g, '');
                current_sum = parseInt(current_sum) - parseInt(dicrement_sum);
                $("#sum").text("СУМА: " + parseInt(current_sum) + " ₴")
                current_img.animate({
                    width: 40,
                    height: 40,
                    left: current_trash_left,
                    top: current_trash_top,
                    opacity: 0
                }, 50);
                current_price.animate({
                    width: 40,
                    height: 40,
                    left: current_trash_left,
                    top: current_trash_top,
                    opacity: 0
                }, 50);
                hr.animate({
                    opacity: 0
                }, 50);
                current_size.animate({
                    width: 40,
                    height: 40,
                    left: current_trash_left,
                    top: current_trash_top,
                    opacity: 0
                }, 80);
                current_count.animate({
                    width: 40,
                    height: 40,
                    left: current_trash_left,
                    top: current_trash_top,
                    opacity: 0,
                }, 100);
                $(this).parent().parent().fadeOut(400).end().remove()
                var cookie = $(this).attr("cookie")
                $.ajax({
                    url: "http://127.0.0.1:8000/deleteCookie/" + cookie,
                }).done(function(response) {})
            }
            //Если экрани больше 768px (iPad, ноут, комп...) 
            else {
                var cookie = $(this).attr("cookie")
                var current_amount_of_orders = $("#amount-of-orders").text()
                $("#amount-of-orders").text(parseInt(current_amount_of_orders) - 1)
                current_sum = current_sum.replace(/\D/g, '');
                current_sum = parseInt(current_sum) - parseInt(dicrement_sum);
                $("#sum").text("СУМА: " + parseInt(current_sum) + " ₴")
                $(this).parent().parent().fadeOut(400).end().remove()
                hr.fadeOut(400).end().remove()
                $.ajax({
                    url: "http://127.0.0.1:8000/deleteCookie/" + cookie,
                }).done(function(response) {})
            }
        })
        //Добавление количества товара в корзине на +1
    $(".increment").on("click", function() {
            var parent = $(this).parent().parent()
            var count = parent.find('.counter').val()
            var main_parent = parent.parent().parent().parent()
            var price_obj = main_parent.find(".price");
            var price = parseInt(price_obj.text())
            var current_sum = $("#sum").text()
            current_sum = current_sum.replace(/\D/g, '');
            var total = parseInt(current_sum) + parseInt(price)
            $("#sum").text("СУМА: " + parseInt(total) + " ₴")
            if (count >= 1) {
                parent.find('.counter').val(+count + 1)
            }
        })
        //Уменьшение количества товара в корзине на -1
    $(".dicrement").on("click", function() {
        var parent = $(this).parent().parent()
        var count = parent.find('.counter').val()
        var main_parent = parent.parent().parent().parent()
        var price_obj = main_parent.find(".price");
        var price = parseInt(price_obj.text())
        var current_sum = $("#sum").text()
        current_sum = current_sum.replace(/\D/g, '');
        var total = parseInt(current_sum) - parseInt(price)
        if (count > 1) {
            parent.find('.counter').val(count - 1)
            if (total >= 0) {
                $("#sum").text("СУМА: " + parseInt(total) + " ₴")
            }
        }
    });
    //Добавлени в cookies
    function addToCookies(cookie_name, cookie_val) {
        var CookieDate = new Date;
        CookieDate.setFullYear(CookieDate.getFullYear() + 10);
        document.cookie = cookie_name + "=" + cookie_val + "; expires=" + CookieDate.toGMTString() + ";";
    }

    function deleteCookie(cookie_name) {
        $.removeCookie(cookie_name, {
            path: '/'
        });
    }
    //Подтверждение данных пользователя, добавление их в cookies, отправление сообщений в телеграмм
    $("#submit-user-info").on("click", function() {
            var user_name = $("#user-name").val(),
                user_surname = $("#user-surname").val(),
                user_phone = $("#user-phone").val(),
                user_post = $("#user-post").val(),
                user_mail = $("#user-mail").val();
            var i = 1
            addToCookies("usermail", user_mail)
            addToCookies("userpost", user_post)
            addToCookies("userphone", user_phone)
            addToCookies("username", user_name)
            addToCookies("usersurname", user_surname)
            $('#user-info-modal').modal('hide');
            if ($("span").is(".span-for-hr")) {
                $(".product-in-basket").each(function() {
                    var sendOrderParams = {};
                    var trash = $(this).find(".trash")
                    var cookie = trash.attr("cookie")
                    var count = $(this).find(".counter")
                    var size = $(this).find(".cookie-size")
                    var $product_id = $(this).find(".image-href")
                    $product_id = $product_id.attr("product-id");
                    var href = $product_id.replace("[", "").replace("]", "").replace("\'", "").replace(/'/g, "").replace(",", "");
                    var id = href
                    sendOrderParams.count = parseInt(count.val());
                    sendOrderParams.size = size.val()
                    sendOrderParams.id = id
                    var div = $(this).find("div");
                    div.css('transition', '0s');
                    $.ajax({
                        url: "http://127.0.0.1:8000/basket/sendOrder/" + sendOrderParams.count + "/" + i + "/" + sendOrderParams.size + "/" + sendOrderParams.id,
                    }).done(function(response) {});
                    $.removeCookie("order1", {
                        path: '/'
                    });
                    i++;
                })
                deleteCookie("amountOfOrders")
                addToCookies("amountOfOrders", 0)
                if (screen.width >= 768) {
                    $(".basket-img").delay(400).animate({
                        opacity: 0,
                        left: -200
                    }, 500);
                    $(".delete-cross-mobile").delay(400).animate({
                        opacity: 0,
                        right: -200
                    }, 500);
                    $(".basket-size").delay(400).animate({
                        opacity: 0,
                        left: 50,
                        top: -200
                    }, 500);
                    $(".basket-count").delay(400).animate({
                        opacity: 0,
                        top: 200
                    }, 500)
                    $(".basket-price").delay(400).animate({
                        opacity: 0,
                        right: 50,
                        top: 200
                    }, 800)
                    $(".trash").delay(400).animate({
                        opacity: 0,
                        right: -300,
                    }, 800)
                    $("hr").delay(500).animate({
                        opacity: 0,
                        top: 400
                    }, 1000)
                    setTimeout(function() {
                        $(".basket").remove()
                        $(".success-order").show()
                    }, 1000);
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);
                    $('.sa').css('display', 'none');
                    setTimeout(function() {
                        $("#make-order").delay(400).animate({
                            top: 500
                        }, 100)
                        $('.sa').show();
                        $('.text-success').show();
                    }, 1500);
                } else {
                    $(".basket-img").delay(400).animate({
                        opacity: 0,
                        top: -200
                    }, 400);
                    $(".delete-cross-mobile").delay(400).animate({
                        opacity: 0,
                        right: -200
                    }, 400);
                    $(".basket-size").delay(400).animate({
                        opacity: 0,
                        left: -100,
                    }, 400);
                    $(".basket-count").delay(400).animate({
                        opacity: 0,
                        top: 200,
                        right: 50
                    }, 400)
                    $(".basket-price").delay(400).animate({
                        opacity: 0,
                        right: -100,
                    }, 400)
                    $(".trash").delay(400).animate({
                        opacity: 0,
                        right: -300,
                    }, 400)
                    $("hr").delay(500).animate({
                        opacity: 0,
                        top: 400
                    }, 1000)
                    setTimeout(function() {
                        $(".basket").fadeOut(200)
                        $(".success-order").fadeIn(200)
                    }, 1000);
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);
                    $('.sa').css('display', 'none');
                    setTimeout(function() {
                        $("#make-order").delay(400).animate({
                            top: 500
                        }, 400)
                        $('.sa').show();
                        $('.text-success').show();
                    }, 1500);
                }
                $("#sum").text("СУМА: 0 ₴")
                $("#amount-of-orders").text("0")
            } else {
                $("#error").text("В корзине нет товаров")
            }
        })
        //При наведение мышью на урну для удаления, Анимация уезжания товаров вправо
    $(".trash").mouseenter(function() {
        var product_in_basket = $(this).parent().parent()
        var current_img = product_in_basket.find(".main-product-photo")
        var current_price = product_in_basket.find(".basket-price")
        var current_size = product_in_basket.find(".basket-size")
        var current_count = product_in_basket.find(".basket-count")
        var delete_cross = product_in_basket.find(".delete-cross-desktop")
        var trash_body = delete_cross.find(".trash-body")
        var offset = trash_body.offset();
        if (current_img.position().left == 15) {
            var current_trash_left = offset.left - current_img.offset().left + 8;
            var current_trash_top = offset.top
            current_img.animate({
                width: 40,
                height: 40,
                left: current_trash_left,
                top: 50
            }, 50);
            current_price.animate({
                opacity: 0,
                top: -200
            }, 200);
            current_size.animate({
                opacity: 0,
                top: -200
            }, 80);
            current_count.animate({
                opacity: 0,
                top: -200
            }, 100);
        }
    });
    //При убирании мыши с урны для удаления, Анимация возвращение товаров
    $(".trash").mouseleave(function() {
        var product_in_basket = $(this).parent().parent()
        var current_img = product_in_basket.find(".main-product-photo")
        var current_img = product_in_basket.find(".main-product-photo")
        var current_price = product_in_basket.find(".basket-price")
        var current_size = product_in_basket.find(".basket-size")
        var current_count = product_in_basket.find(".basket-count")
        current_img.animate({
            left: 15,
            width: 90,
            height: 90,
            top: 65
        }, 50);
        current_price.animate({
            opacity: 1,
            top: 0
        }, 70);
        current_size.animate({
            opacity: 1,
            top: 0
        }, 260);
        current_count.animate({
            opacity: 1,
            top: 0
        }, 200);
    })
});