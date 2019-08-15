$(document).ready(function () {
    setSpeakersAndSessions();

    detectInView();

    scrollToSection();
});

let speakers;
let sessions;

function setSpeakersAndSessions() {
    $.get("https://sessionize.com/api/v2/pixtt19d/view/all", (response, status) => {
        if (status === "success") {
            const speakers = response.speakers;
            const sessions = response.sessions;

            const profilePictures = new Map();
            const speakerProfilePics = speakers.map(speaker => ({ id: speaker.id, profilePicture: speaker.profilePicture }));
            speakerProfilePics.forEach(speakerProfilePic => {
                const image = new Image();
                image.src = speakerProfilePic.profilePicture;
                profilePictures.set(speakerProfilePic.id, image)
            });

            loadSpeakers(speakers, profilePictures);
            $(window).resize(() => {
                loadSpeakers(speakers, profilePictures);
            });
        } else {
            console.error("Failed to fetch speakers and sessions data");
        }
    });
}

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

function loadSpeakers(allSpeakers, profilePictures) {
    if ($('#speakers-list').length) {
        let speakersHtml = "";
        // number of speakers to load and display are determined by the
        // number if `li`s that are chosen to be displayed based on the
        // user's screen size
        const numOfSpeakers = $('#speakers-list-hidden li').filter(function () {
            return $(this).css('display') != 'none';
        }).length;

        const displayedSpeakers = allSpeakers.filter(speaker => speaker.fullName.indexOf('Enzo') === -1).slice(0, numOfSpeakers);
        for (const speaker of displayedSpeakers) {
            speakersHtml += generateSpeakerHtml(speaker, profilePictures.get(speaker.id));
        }
        if (speakersHtml !== "") {
            $('#speakers-list').html(speakersHtml);
            swapSpeakers(displayedSpeakers, allSpeakers, profilePictures);
            speakerModal();
        }
    }
}

function generateSpeakerHtml(speaker, profilePicture) {
    const { id, fullName, questionAnswers, links } = speaker;

    const companyQuestionId = 16062;
    const company = questionAnswers.filter(qa => qa.questionId === companyQuestionId)[0].answerValue;
    const companyUrl = links.filter(link => link.linkType === "Company_Website")[0].url;

    const positionQuestionId = 16061;
    const position = questionAnswers.filter(qa => qa.questionId === positionQuestionId)[0].answerValue;


    return `
        <li data-speaker-id="${id}">
            <div class="speaker-frame">
                <img src="${profilePicture.src}" />
            </div>
            <p class="h5 Titillium-Rg
                        pt-2" style="font-size:18px;">${fullName}</p>
            <p class="h6 Titillium-Lt pt-1" style="font-size: 14px;">
                ${position},
                <a href="${companyUrl}" class="company h6 Titillium-Lt pt-1" style="font-size: 14px;">${company}</a>
            </p>
        </li>
    `;
}

async function swapSpeakers(displayedSpeakers, allSpeakers, profilePictures) {
    const hiddenSpeakers = allSpeakers.filter((speaker) => !displayedSpeakers.includes(speaker) && speaker.fullName.indexOf('Enzo') === -1);

    const swappingIndexes = {
        5: [1, 4, 2, 5, 3],
        4: [1, 3, 2, 4],
        3: [1, 3, 2],
        2: [1, 2],
        1: [1]
    };

    let shouldSwapSpeakers = true;

    $(window).resize(() => {
        shouldSwapSpeakers = false;
    });

    await new Promise(done => setTimeout(() => done(), 3000));

    while (shouldSwapSpeakers) {
        for (let i of swappingIndexes[displayedSpeakers.length]) {
            if (shouldSwapSpeakers) {
                const delay = 5 / displayedSpeakers.length * 2000;
                await new Promise(done => setTimeout(() => done(), delay));

                const speakerToHideEl = $('#speakers-list li:nth-child(' + i + ')')
                const idOfSpeakerToHide = speakerToHideEl.data("speaker-id");
                const speakerToHide = allSpeakers.find(speaker => speaker.id === idOfSpeakerToHide);

                speakerToHideEl.fadeOut(600, () => {
                    const nextSpeaker = hiddenSpeakers[0];
                    const nextSpeakerEl = $(generateSpeakerHtml(nextSpeaker, profilePictures.get(nextSpeaker.id)));
                    nextSpeakerEl.hide();

                    speakerToHideEl.replaceWith(nextSpeakerEl);
                    nextSpeakerEl.fadeIn(600, () => {
                        displayedSpeakers[i - 1] = nextSpeaker;
                        hiddenSpeakers.shift();
                        hiddenSpeakers.push(speakerToHide);
                    });
                });

                await new Promise(done => setTimeout(() => done(), 600));
            }
        }
    }
}