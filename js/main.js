$(document).ready(function () {
    detectInView();

    scrollToSection();

    loadSpeakers();
    $(window).resize(() => {
        loadSpeakers();
    });
});

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

function scrollToSection() {
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

function loadSpeakers() {
    if ($('#speakers-list').length) {
        let allSpeakersHtml = "";
        // number of speakers to load and display are determined by the
        // number if `li`s that are chosen to be displayed based on the
        // user's screen size
        const numOfSpeakers = $('#speakers-list-hidden li').filter(function () {
            return $(this).css('display') != 'none';
        }).length;

        const initialSpeakers = speakersList.slice(0, numOfSpeakers);
        for (const speaker of initialSpeakers) {
            generateSpeakerHtml(speaker);
            allSpeakersHtml += generateSpeakerHtml(speaker);
        }
        $('#speakers-list').html(allSpeakersHtml);
        swapSpeakers(initialSpeakers);
    }
}

function generateSpeakerHtml(speaker) {
    const { profileUrl, pictureFile, fullName, position, company } = speaker;

    return `
        <li data-speaker-id="${fullName}">
            <a href="${profileUrl}" target="_blank">
                <div class="speaker-frame">
                    <img src="img/speakers/${pictureFile}" alt="speaker 1" />
                </div>
                <p class="h5 Geogrotesque-Rg
                            pt-2">${fullName}</p>
                <p class="h6 Titillium-Lt pt-1">${position}</p>
                <p class="h6 Titillium-Lt pt-1" style="color: #BDB5FF">${company}</p>
            </a>
        </li>
    `;
}

async function swapSpeakers(initialSpeakers) {
    const displayedSpeakers = initialSpeakers;
    const hiddenSpeakers = speakersList.filter((i) => !initialSpeakers.includes(i));
    const swappingIndexes = {
        5: [1, 4, 2, 5, 3],
        4: [1, 3, 2, 4],
        3: [1, 3, 2],
        2: [1, 2],
        1: [1]
    };
    const numOfSpeakers = displayedSpeakers.length;
    let shouldSwapSpeakers = true;

    $(window).resize(() => {
        shouldSwapSpeakers = false;
    });

    while (shouldSwapSpeakers) {
        for (let i of swappingIndexes[numOfSpeakers]) {
            if (shouldSwapSpeakers) {
                const delay = 5 / numOfSpeakers * 1000;
                await new Promise(done => setTimeout(() => done(), delay));

                speakerToRemoveFullName = $('#speakers-list li:nth-child(' + i + ')').data("speaker-id");
                $('#speakers-list li:nth-child(' + i + ')').fadeOut("slow", function () {
                    const replacingSpeaker = $(generateSpeakerHtml(hiddenSpeakers[0])).hide();
                    $(this).replaceWith(replacingSpeaker);
                    replacingSpeaker.fadeIn("slow");
                });
                displayedSpeakers[i - 1] = hiddenSpeakers[0];
                hiddenSpeakers.shift();
                hiddenSpeakers.push(speakersList.filter(s => s.fullName === speakerToRemoveFullName)[0]);
            }
        }
    }
}