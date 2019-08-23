function loadSpeakers(speakers, profilePictures, sessions) {
    let allSpeakersHtml = "";

    for (const speaker of speakers) {
        $('#speakers-list').append(generateSpeakerHtml(speaker, profilePictures.get(speaker.id)));
        loadSpeakerCompanyLogo(speaker);
    }

    speakerModalHandler(speakers, profilePictures, sessions);
}