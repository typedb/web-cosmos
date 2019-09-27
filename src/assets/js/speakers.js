$(document).ready(async function() {
  const { speakers, sessions } = await getData();
  loadAllSpeakers(speakers);
  
  $('.menu-item').removeClass('selected');
  $('#menu-item-speakers').addClass('selected');

  // common
  handleModalRequest(speakers, sessions);
  window.onhashchange = () => { handleModalRequest(speakers, sessions); };
  setModalHandlers();
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