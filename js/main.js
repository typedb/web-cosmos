$(document).ready(function () {
    header();
    detectInView();
    scrollTo();
    $('form button').bind('click', function (event) {
        if (event) event.preventDefault();
        subscribe($('form'));
    });
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

function detectInView() {
    const items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]'),
        pageOffset = window.pageYOffset;

    function isScrolledIntoView(el) {
        const rect = el.getBoundingClientRect(),
            elemTop = rect.top,
            elemBottom = rect.top + el.offsetHeight,
            bottomWin = pageOffset + window.innerHeight;

        return (elemTop < bottomWin && elemBottom > 0);
    }

    function detect() {
        for (let i = 0; i < items.length; i++) {
            if (isScrolledIntoView(items[i])) {
                if (!items[i].classList.contains('in-view')) {
                    items[i].classList.add('in-view');
                }
            }
        }
    }

    window.addEventListener('scroll', detect);
    window.addEventListener('resize', detect);


    for (let i = 0; i < items.length; i++) {
        let d = 0,
            el = items[i];

        if (items[i].getAttribute('data-animate-in-delay')) {
            d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
        } else {
            d = 0;
        }
        el.style.transitionDelay = d;
    }

    setTimeout(function () {
        detect();
    }, 500);
}

function scrollTo() {
    $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function () {

        var trigger = $(this).attr('data-scroll-to'),
            target = $("#" + trigger),
            ss = 1000, //scroll speed
            o = 0; // offset

        $('body').removeClass('menu-is-open');


        if ($(this).attr('data-scroll-speed')) {
            ss = $(this).attr('data-scroll-speed');
        }

        if ($(this).attr('data-scroll-offset')) {
            o = $(this).attr('data-scroll-offset');
        }

        $('html, body').animate({
            scrollTop: target.offset().top - o
        }, ss);
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
            } else {
                $('#mce-error-response').hide();
                $('#mce-success-response').html(data.msg).show();
            }
        }
    });
}