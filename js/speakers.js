$(document).ready(function () {
    loadSpeakers();
});

function loadSpeakers() {
    let allSpeakersHtml = "";

    for (const speaker of speakersList) {
        generateSpeakerHtml(speaker);
        allSpeakersHtml += generateSpeakerHtml(speaker);
    }
    $('#speakers-list').html(allSpeakersHtml);
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