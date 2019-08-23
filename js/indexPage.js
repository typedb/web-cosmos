$(document).ready(function () {
    detectInView();

    scrollToSection();
});

function detectInView() {
    const windowWidth = $(window).width();

    if (windowWidth > 500) {
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
    } else {
        $('[data-animate-in]').removeAttr('data-animate-in');
    }
}

function scrollToSection() {
    $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function () {
        var trigger = $(this).attr('data-scroll-to'),
            target = $("#" + trigger),
            ss = 1000, //scroll speed
            o = $('.site-header').outerHeight(); // offset

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

function loadSpeakers(allSpeakers, profilePictures, sessions) {
    if ($('#speakers-list').length) {
        // number of speakers to load and display are determined by the
        // number if `li`s that are chosen to be displayed based on the
        // user's screen size
        const numOfSpeakers = $('#speakers-list-hidden li').filter(function () {
            return $(this).css('display') != 'none';
        }).length;

        const displayedSpeakers = allSpeakers.slice(0, numOfSpeakers);
        for (const speaker of displayedSpeakers) {
            $('#speakers-list').append(generateSpeakerHtml(speaker, profilePictures.get(speaker.id)));
            loadSpeakerCompanyLogo(speaker);
        }

        swapSpeakers(displayedSpeakers, allSpeakers, profilePictures);
        speakerModalHandler(allSpeakers, profilePictures, sessions);
    }
}

async function swapSpeakers(displayedSpeakers, allSpeakers, profilePictures) {
    const hiddenSpeakers = allSpeakers.filter((speaker) => !displayedSpeakers.includes(speaker));

    const swappingIndexes = {
        5: [1, 4, 2, 5, 3],
        4: [1, 3, 2, 4],
        3: [1, 3, 2],
        2: [1, 2],
        1: [1]
    };

    let shouldSwapSpeakers = true;

    const windowWidth = $(window).width();
    $(window).resize(() => {
        if ($(window).width() == windowWidth) return;
        shouldSwapSpeakers = false;
    });

    await new Promise(done => setTimeout(() => done(), 2000));

    while (shouldSwapSpeakers) {
        for (let i of swappingIndexes[displayedSpeakers.length]) {
            // the window hasn't been resized yet
            if (shouldSwapSpeakers) {
                const swappingSpeed = 500;
                const intervalDuration = 1 / displayedSpeakers.length * 1000;
                await new Promise(done => setTimeout(() => done(), intervalDuration));

                const speakerToHideEl = $('#speakers-list li:nth-child(' + i + ')')
                const idOfSpeakerToHide = speakerToHideEl.data("speaker-id");
                const speakerToHide = allSpeakers.find(speaker => speaker.id === idOfSpeakerToHide);

                const nextSpeaker = hiddenSpeakers[0];
                const nextSpeakerEl = $(generateSpeakerHtml(nextSpeaker, profilePictures.get(nextSpeaker.id)));
                nextSpeakerEl.hide();

                speakerToHideEl.fadeOut(swappingSpeed, () => {
                    speakerToHideEl.replaceWith(nextSpeakerEl);
                    loadSpeakerCompanyLogo(nextSpeaker);
                    nextSpeakerEl.fadeIn(swappingSpeed);
                });

                await new Promise(done => setTimeout(() => done(), swappingSpeed * 2));

                displayedSpeakers[i - 1] = nextSpeaker;
                hiddenSpeakers.shift();
                hiddenSpeakers.push(speakerToHide);
            }
        }
    }
}