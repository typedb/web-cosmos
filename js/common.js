$(document).ready(function () {
    header();

    handleSubscription();

    mobileMenu();
});

function header() {
    $(window).on('scroll', function () {
        scrollPosition = $(this).scrollTop();
        if (scrollPosition >= 500) {
            $('.site-header').addClass('is-scrolling');
        } else {
            $('.site-header').removeClass('is-scrolling');
        }
    });
}

function handleSubscription() {
    $('form button').bind('click', function (event) {
        if (event) event.preventDefault();
        $(this).html('<div class="spinner-border spinner-border-sm" role="status"></div>');
        subscribe($('form'));
    });
}

function subscribe($form) {
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        error: function (xhr, ajaxOptions, thrownError) { console.log(xhr.responseText); },
        success: function (data) {
            if (data.result != "success") {
                $('#mce-success-response').hide();
                $('#mce-error-response').html(data.msg.replace("0 -", "")).show();
                $('form button').html('Subscribe');
            } else {
                $('#mce-error-response').hide();
                $('#mce-success-response').html(data.msg).show();
                $('form button').html('Subscribe');
            }
        }
    });
}

function mobileMenu() {
    toggleMobileMenu();

    $(window).resize(function () {
        toggleMobileMenu();
    })

    $('.hamburger').click(function () {
        $(this).toggleClass('is-active');
        $('.site-header').toggleClass('expanded');
    });

    $(window).click(function (e) {
        const clickedElement = $(e.target);
        const menuIsClicked = clickedElement.hasClass("hamburger") || clickedElement.parents('.hamburger').length;
        if (!menuIsClicked) {
            $('.hamburger').removeClass('is-active');
            $('.site-header').removeClass('expanded');
        }
    });

    $('header').attr("style", "display: block !important");

    function toggleMobileMenu() {
        const windowWidth = $(window).width();
        if (windowWidth < 1210) {
            $('.site-header').addClass('mobile');
        } else {
            $('.site-header').removeClass('mobile');
        }
    }
}