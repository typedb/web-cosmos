function loadSpeakers(speakers, profilePictures, sessions) {
    let allSpeakersHtml = "";

    for (const speaker of speakers.filter(speaker => speaker.fullName.indexOf('Enzo') === -1)) {
        allSpeakersHtml += generateSpeakerHtml(speaker, profilePictures.get(speaker.id));
    }
    $('#speakers-list').html(allSpeakersHtml);

    speakerModalHandler(speakers, profilePictures, sessions);
}

function generateSpeakerHtml(speaker, profilePicture) {
    const { id, fullName, questionAnswers, links } = speaker;

    const companyQuestionId = 16062;
    const company = questionAnswers.filter(qa => qa.questionId === companyQuestionId)[0].answerValue;
    const companyUrl = links.filter(link => link.linkType === "Company_Website")[0].url;

    const positionQuestionId = 16061;
    const position = questionAnswers.filter(qa => qa.questionId === positionQuestionId)[0].answerValue;

    return `
        <li class="speaker" data-speaker-id="${id}">
            <div class="speaker-frame">
                <img src="${profilePicture.src}" />
            </div>
            <p class="fullname h5 Titillium-Rg pt-2">${fullName}</p>
            <p class="position h6 Titillium-Lt pt-1">${position}</p>
            <a href="${companyUrl}" target="_blank" class="company h6 Titillium-Lt pt-1">${company}</a>
        </li>
    `;
}