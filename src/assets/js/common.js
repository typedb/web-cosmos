const handleHeaderOnScroll = () => {
  $(window).on("scroll", function() {
    scrollPosition = $(this).scrollTop();
    const introLogo = $(".section-intro-logoType");
    if (introLogo.length) {
      introLogoBottomOffset = introLogo.outerHeight() + introLogo.offset().top;
      if (scrollPosition >= introLogoBottomOffset) {
        $(".site-header").addClass("is-scrolling");
      } else {
        $(".site-header").removeClass("is-scrolling");
      }
    }
  });
};

const handleSubscription = () => {
  $("form button").bind("click", function (event) {
    const subscribe = (form) => {
      // taking the first email because there is a second hidden email input
      const data = form.serialize().split("&")[0];
      $.ajax({
        type: form.attr("method"),
        url: form.attr("action"),
        data,
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        error: function(xhr, ajaxOptions, thrownError) {
          console.log(xhr.responseText);
        },
        success: function(data) {
          if (data.result != "success") {
            $("#mce-success-response")
              .removeClass("d-block")
              .addClass("d-none");
            $("#mce-error-response")
              .html(data.msg.replace("0 -", ""))
              .removeClass("d-none")
              .addClass("d-block");
            $("form button").html("Subscribe");
          } else {
            $("#mce-error-response")
              .removeClass("d-block")
              .addClass("d-none");
            $("#mce-success-response")
              .html(data.msg)
              .removeClass("d-none")
              .addClass("d-block");
            $("form button").html("Subscribe");
          }
        }
      });
    };

    if (event) event.preventDefault();
    $(this).html(
      '<div class="spinner-border spinner-border-sm" role="status"></div>'
    );
    subscribe($("form"));
  });
};


const handleMobileMenu = () => {
  const toggleMobileMenu = () => {
    const windowWidth = $(window).width();
    if (windowWidth < 768) {
      $(".site-header").addClass("mobile");
    } else {
      $(".site-header").removeClass("mobile");
    }
  };

  toggleMobileMenu();

  $(window).resize(() => {
    toggleMobileMenu();
  });

  $(".hamburger").click(function () {
    $(this).toggleClass("is-active");
    $(".site-header").toggleClass("expanded");
  });

  $(window).click((e) => {
    const clickedElement = $(e.target);
    const menuIsClicked =
      clickedElement.hasClass("hamburger") ||
      clickedElement.parents(".hamburger").length;
    if (!menuIsClicked) {
      $(".hamburger").removeClass("is-active");
      $(".site-header").removeClass("expanded");
    }
  });

  $("header").attr("style", "display: block !important");
};

const showSpeakerModal = (speakers, sessions) => {
  const hash = decodeURI(window.location.hash.replace("#", ""));
  const speakerToShow = speakers.find(speaker => speaker.fullName === hash);
  if (speakerToShow) {
    const speakerSessions = sessions.filter(session =>
      session.speakers.includes(speakerToShow.id)
    );
    populateSpeakerModal(speakerToShow, speakerSessions, speakers);
    $("#speaker-modal").addClass("is-open");
    $("body").addClass("modal-is-open");
  }
};

const handleSpeakerModalRequest = (speakers, sessions) => {
  showSpeakerModal(speakers, sessions);

  window.onhashchange = () => {
    const newHash = window.location.hash.replace("#", "");
    if (newHash === "" || newHash === "speakers") {
      $("#speaker-modal").removeClass("is-open");
      $("body").removeClass("modal-is-open");
    } else {
      showSpeakerModal(speakers, sessions);
    }
  };
}

const setSpeakerModalHandlers = (speakers, sessions) => {
  $("#speakers-all-list, #speakers-home-list").on("click", "li", function (e) {
    // clicking a hyperlink does not open speaker modal but the link that's been clicked
    if (e.target.tagName === "A" || $(e.target).parent()[0].tagName === "A")
      return;

    const selectedSpeakerId = $(this).data("speaker-id");
    const speaker = speakers.find(speaker => speaker.id === selectedSpeakerId);

    const speakerSessions = sessions.filter(session =>
      session.speakers.includes(speaker.id)
    );

    populateSpeakerModal(speaker, speakerSessions, speakers);

    $("#speaker-modal").addClass("is-open");
    $("body").addClass("modal-is-open");
    window.location.hash = speaker.fullName;
  });

  $("#speaker-modal-close").click(function() {
    $("#speaker-modal").removeClass("is-open");
    $("body").removeClass("modal-is-open");
    if ($("#speakers").length) {
      window.location.hash = "speakers";
    } else {
      window.history.pushState("", document.title, window.location.pathname);
    }
  });
};

const populateSpeakerModal = (speaker, sessions, speakers) => {
  const {
    fullName,
    bio,
    profileImg,
    company: { url: companyUrl, logo: companyLogoFileName },
    position: { long: positionLong }
  } = speaker;

  let socialLinksHtml = "";
  for (const social in speaker.socialLinks) {
    const url = speaker.socialLinks[social];
    if (url) {
      let linkHtml = `
            <a href="PLACEHOLDER_ADDRESS" target="_blank">
                <div class="logo-wrapper"><img src="/img/icons/PLACEHOLDER_ICON" /></div>
            </a>`;

      switch (social) {
        case "linkedin": {
          linkHtml = linkHtml.replace(
            "PLACEHOLDER_ICON",
            "social-linked-in.svg"
          );
          break;
        }
        case "twitter": {
          linkHtml = linkHtml.replace("PLACEHOLDER_ICON", "social-twitter.svg");
          break;
        }
        case "github": {
          linkHtml = linkHtml.replace("PLACEHOLDER_ICON", "social-github.svg");
          break;
        }
        default:
          linkHtml = "";
      }
      linkHtml = linkHtml.replace("PLACEHOLDER_ADDRESS", url);
      socialLinksHtml += linkHtml;
    }
  }

  if (sessions.length > 1) {
    $("#session-title").html("SESSIONS");
  }

  const sessionsHtml = sessions
    .map(session => {
      let { title, description } = session;

      let sessionHtml = `
            <div class="session">
                <p id="session-title" class="session-title h5 Titillium-Lt pt-3">PLACEHOLDER_TITLE</p>
                <p id="session-description" class="description h6 Titillium-ExLt pt-3">PLACEHOLDER_DESCRIPTION</p>
            </div>
        `;
      const coSpeakers = session.speakers.filter(
        coSpeakerId => speaker.id !== coSpeakerId
      );

      let coSpeakerNote = "";
      if (coSpeakers.length) {
        coSpeakerNote =
          "<br /><br /><span class='cospeaker-note'> This is a joined session with ";
        coSpeakers.forEach((coSpeakerId, index) => {
          const coSpeaker = speakers.find(
            coSpeaker => coSpeaker.id === coSpeakerId
          );
          coSpeakerNote += `<a class='speaker-link' href='#${coSpeaker.fullName}' data-speaker-id=${coSpeaker.id}>${coSpeaker.fullName}</a>`;
          if (index < coSpeakers.length - 3) {
            coSpeakerNote += ", ";
          } else if (index < coSpeakers.length - 2) {
            coSpeakerNote += " and ";
          }
        });
        coSpeakerNote += ".";
      }
      description += coSpeakerNote;
      sessionHtml = sessionHtml.replace("PLACEHOLDER_TITLE", title);
      sessionHtml = sessionHtml.replace("PLACEHOLDER_DESCRIPTION", description);
      return sessionHtml;
    })
    .join("");

  $("#profilePicture").attr("src", profileImg.src);
  $("#fullname").html(fullName);
  $("#position").html(positionLong);
  $("#company").attr("href", companyUrl);
  $("#company img").attr("src", `/img/companies/${companyLogoFileName}`);
  $("#social-links").html(socialLinksHtml);
  $("#bio").html(bio);
  $("#sessions").html(sessionsHtml);

};

const loadSpeakerCompanyLogo = speaker => {
  const {
    id,
    company: { logo: companyLogoFileName }
  } = speaker;

  const TARGET_WIDTH = 150;
  const TARGET_HEIGHT = 42;

  const companyLogo = new Image();
  companyLogo.src = "/img/companies/" + companyLogoFileName;

  const companyLogoPoll = setInterval(function() {
    if (companyLogo.naturalWidth) {
      const originalWidth = companyLogo.naturalWidth;
      const originalHeight = companyLogo.naturalHeight;
      let newHeight = (originalHeight * TARGET_WIDTH) / originalWidth;
      let newWidth;

      if (newHeight > TARGET_HEIGHT) {
        newWidth = (TARGET_WIDTH * TARGET_HEIGHT) / newHeight;
        newHeight = TARGET_HEIGHT;
      } else {
        newWidth = TARGET_WIDTH;
      }

      companyLogo.width = newWidth;
      companyLogo.height = newHeight;
      companyLogo.style = `margin-top: ${(TARGET_HEIGHT - newHeight) / 2}px;`;

      $(`.speaker[data-speaker-id='${id}']`)
        .find(".company-logo")
        .html(companyLogo);

      clearInterval(companyLogoPoll);
    }
  }, 10);
};

const generateSpeakerHtml = speaker => {
  const {
    id,
    fullName,
    profileImg,
    position: { short: shortPosition },
    company: { url: companyUrl }
  } = speaker;

  return `
        <li class="speaker" data-speaker-id="${id}">
            <div class="speaker-frame">
                <img class="profile-picture" src="${profileImg.src}" />
            </div>
            <p class="fullname h5 Titillium-Rg pt-2">${fullName}</p>
            <p class="position h6 Titillium-Lt pt-1">${shortPosition}</p>
            <a href="${companyUrl}" target="_blank" class="company-logo"></a>
        </li>
    `;
};
