$(document).ready(function () {
    setSpeakersAndSessions();

    header();

    handleSubscription();

    mobileMenu();
});

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

            loadSpeakers(speakers, profilePictures, sessions);
            checkForSpeakerModal(speakers, profilePictures, sessions);

            window.onhashchange = function() {
                const newHash = window.location.hash;
                debugger;
                if (newHash === '' || newHash === 'speakers') {
                    $('#speaker-modal').removeClass('is-open');
                    $('body').removeClass('modal-is-open');
                } else {
                    checkForSpeakerModal(speakers, profilePictures, sessions);            
                }
            }

            if (window.location.pathname === "/") {
                $(window).resize(() => {
                    loadSpeakers(speakers, profilePictures, sessions);
                });
            }
        } else {
            console.error("Failed to fetch speakers and sessions data");
        }
    });
}

function checkForSpeakerModal(speakers, profilePictures, sessions) {
    const hash = decodeURI(window.location.hash.replace('#', ''));
    const speakerToShow = speakers.find(speaker => speaker.fullName === hash);
    if (speakerToShow) {
        const profilePicture = profilePictures.get(speakerToShow.id);
        const speakerSessions = sessions.filter(session => session.speakers.includes(speakerToShow.id));
        populateSpeakerModal(speakerToShow, profilePicture, speakerSessions, speakers);
        $('#speaker-modal').addClass('is-open');
        $('body').addClass('modal-is-open');
    }
}


function header() {
    $(window).on('scroll', function () {
        scrollPosition = $(this).scrollTop();
        const introLogo = $('.section-intro-logoType');
        introLogoBottomOffset = introLogo.outerHeight() + introLogo.offset().top;
        if (scrollPosition >= introLogoBottomOffset) {
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

function speakerModalHandler(speakers, profilePictures, sessions) {
    $('#speakers-list').on("click", "li", function (e) {
        if (e.target.tagName === 'A') { 
            return;
        } 
        const selectedSpeakerId = $(this).data('speaker-id');
        const speaker = speakers.find(speaker => speaker.id === selectedSpeakerId);
        const profilePicture = profilePictures.get(selectedSpeakerId);
        const speakerSessions = sessions.filter(session => session.speakers.includes(speaker.id));
        populateSpeakerModal(speaker, profilePicture, speakerSessions, speakers);
        $('#speaker-modal').addClass('is-open');
        $('body').addClass('modal-is-open');
        window.location.hash = speaker.fullName;
    });

    $('#speaker-modal-close').click(function () {
        $('#speaker-modal').removeClass('is-open');
        $('body').removeClass('modal-is-open');
        window.location.hash = 'speakers';
    });
}

function populateSpeakerModal(speaker, profilePicture, sessions, speakers) {
    const { fullName, links, bio, tagLine } = speaker;

    const company = tagLine.split(' at ')[1];
    const position = tagLine.split(' at ')[0];

    const companyUrl = links.filter(link => link.linkType === "Company_Website")[0].url;

    const socialLinks = links.filter(link => link.linkType != "COmpany_Website");
    const socialLinksHtml = socialLinks.map(socialLink => {
        let linkHtml =
            `<a href="PLACEHOLDER_ADDRESS" class="d-flex align-items-center">
                <div class="logo-wrapper"><img src="img/social/PLACEHOLDER_ICON" /></div>
                <span class="h6 Titillium-Rg">PLACEHOLDER_TEXT</span>
            </a>`;

        switch (socialLink.linkType) {
            case 'LinkedIn': {
                linkHtml = linkHtml.replace('PLACEHOLDER_ICON', 'linked-in.svg');
                linkHtml = linkHtml.replace('PLACEHOLDER_TEXT', fullName);
                linkHtml = linkHtml.replace('PLACEHOLDER_ADDRESS', socialLink.url);
                break;
            }
            case 'Twitter': {
                linkHtml = linkHtml.replace('PLACEHOLDER_ICON', 'twitter.svg');
                let text = socialLink.url;
                text = text.replace('http://twitter.com/', '');
                text = text.replace('https://twitter.com/', '');
                text = text.replace('twitter.com/', '');
                text = text.replace('www.twitter.com/', '');
                text = "@" + text;
                linkHtml = linkHtml.replace('PLACEHOLDER_TEXT', text);
                linkHtml = linkHtml.replace('PLACEHOLDER_ADDRESS', socialLink.url);
                break;
            }
            case 'Blog': {
                linkHtml = linkHtml.replace('PLACEHOLDER_ICON', 'linked-in.svg');
                let text = socialLink.url;
                text = text.replace('http://', '');
                text = text.replace('https://', '');
                text = text.replace('www.', '');
                linkHtml = linkHtml.replace('PLACEHOLDER_TEXT', text);
                linkHtml = linkHtml.replace('PLACEHOLDER_ADDRESS', socialLink.url);
                break;
            }
            default:
                return '';
        }
        return linkHtml;
    }).join('');

    if (sessions.length > 1) { $('#session-title').html('SESSIONS'); }

    const sessionsHtml = sessions.map(session => {
        let sessionHtml = `
            <div class="session">
                <p id="session-title" class="session-title h5 Titillium-Lt pt-3">PLACEHOLDER_TITLE</p>
                <p id="session-description" class="h6 Titillium-ExLt pt-3">PLACEHOLDER_DESCRIPTION</p>
            </div>
        `;
        const coSpeakers = session.speakers.filter(coSpeakerId => speaker.id !== coSpeakerId);

        let sessionTitle = session.title;
        let coSpeakerNote = '';
        if (coSpeakers.length) {
            coSpeakerNote = "<span class='cospeaker-note'> (This is a joined session with ";
            coSpeakers.forEach((coSpeakerId, index) => {
                const coSpeaker = speakers.find(coSpeaker => coSpeaker.id === coSpeakerId);
                coSpeakerNote += `<a class='speaker-link' href='#${coSpeaker.fullName}' data-speaker-id=${coSpeaker.id}>${coSpeaker.fullName}</a>`;
                if (index < coSpeakers.length - 3) {
                    coSpeakerNote += ', ';
                } else if (index < coSpeakers.length - 2) {
                    coSpeakerNote += ' and ';
                }
            });
            coSpeakerNote += ')';
        }
        sessionTitle += coSpeakerNote;
        sessionHtml = sessionHtml.replace('PLACEHOLDER_TITLE', sessionTitle);
        sessionHtml = sessionHtml.replace('PLACEHOLDER_DESCRIPTION', session.description);
        return sessionHtml;
    }).join('');


    $('#profilePicture').attr("src", profilePicture.src);
    $('#fullname').html(fullName);
    $('#position').html(position);
    $('#company').html(company);
    $('#company').attr("href", companyUrl);
    $('#social-links').html(socialLinksHtml);
    $('#bio').html(bio);
    $('#sessions').html(sessionsHtml);
}