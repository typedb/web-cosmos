$(document).ready(async function() {
  const { speakers, sessions } = await getData();
  loadAllSpeakers(speakers);
  setSpeakerModalHandlers(speakers, sessions);
  
  // common
  handleSpeakerModalRequest(speakers, sessions);
  setSpeakerModalHandlers(speakers, sessions);
  handleHeaderOnScroll();
  handleSubscription();
  handleMobileMenu();
});

function loadAllSpeakers(speakers) {
  for (const speaker of speakers) {
    $("#speakers-all-list").append(generateSpeakerHtml(speaker));
    loadSpeakerCompanyLogo(speaker);
  }
}