function loadAllSpeakers(speakers, profilePictures, sessions) {
  for (const speaker of speakers) {
    $("#speakers-all-list").append(
      generateSpeakerHtml(speaker, profilePictures.get(speaker.id))
    );
    loadSpeakerCompanyLogo(speaker);
  }

  speakerModalHandler(speakers, profilePictures, sessions);
}
