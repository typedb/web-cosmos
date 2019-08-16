$(document).ready(function () {
    setSpeakersAndSessions();
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
        } else {
            console.error("Failed to fetch speakers and sessions data");
        }
    });
}

function loadSpeakers(speakers, profilePictures, sessions) {
    let allSpeakersHtml = "";

    for (const speaker of speakers.filter(speaker => speaker.fullName.indexOf('Enzo') === -1)) {
        allSpeakersHtml += generateSpeakerHtml(speaker, profilePictures.get(speaker.id));
    }
    $('#speakers-list').html(allSpeakersHtml);

    speakerModal(speakers, profilePictures, sessions);
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
                        pt-2">${fullName}</p>
            <p class="h6 Titillium-Lt pt-1">${position}</p>
            <a href="${companyUrl}" class="company h6 Titillium-Lt pt-1" style="font-size: 14px;">${company}</a>
        </li>
    `;
}