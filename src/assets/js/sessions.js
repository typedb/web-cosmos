$(document).ready(async function() {
  const { tags, sessions, speakers } = await getData();
  loadTags(tags);
  setTagsHandlers();

  loadSessions(sessions, speakers);
  setSessionsListHandlers();

  // common
  // handleSpeakerModalRequest(speakers, sessions);
  // setSpeakerModalHandlers(speakers, sessions);
  handleHeaderOnScroll();
  handleSubscription();
  handleMobileMenu();
});

const tags = [
  {
    name: "#analytics",
    color: "green-a",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#devtools",
    color: "pink-a",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#expertsystem",
    color: "blue-a",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#finance",
    color: "yellow",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#grakndev",
    color: "blue-b",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#iot",
    color: "orange-a",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#lifescience",
    color: "orange-b",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#ml",
    color: "blue-b",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#nlp",
    color: "pink-b",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#robotics",
    color: "blue-c",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#security",
    color: "purple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  },
  {
    name: "#telecom",
    color: "blue-d",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus ante mattis tellus mattis convallis. Morbi ultricies dolor ut nisi."
  }
];

const loadTags = () => {
  for (const tag of tags) {
    $("#tag-buttons").append(generateTagButton(tag));
  }
};

const generateTagButton = tag => {
  const { name, color, description } = tag;
  return `
    <div class='tag-button tag-button--${color} selected'>
        <span class="tag h6 Titillium-Rg">${name}</span>
        <div class="tooltip-container">
            <div class='icon icon-info' />
        </div>
        <div class="tag-tooltip">${description}</div>
    </div>
    `;
};

const setTagsHandlers = () => {
  $(".tag-button").on("click", function() {
    $(this)
      .toggleClass("selected")
      .trigger("tag-selection-changed");
  });

  $(".tooltip-container").on("mouseover", function() {
    $(this)
      .siblings(".tag-tooltip")
      .show();
  });

  $(".tooltip-container").on("mouseleave", function() {
    $(this)
      .siblings(".tag-tooltip")
      .hide();
  });

  $("#unselect-tags-btn").on("click", () => {
    $(".tag-button")
      .removeClass("selected")
      .trigger("tag-selection-changed");
  });

  $(".tag-button").on("tag-selection-changed", function() {
    const isSelected = $(this).hasClass("selected");
    const tagName = $(this)
      .find(".tag")
      .html();

    if (isSelected) {
      $(`.sessions-list-item .tag:contains(${tagName})`)
        .addClass("selected")
        .trigger("session-item-tag-selection-changed");
    } else {
      $(`.sessions-list-item .tag:contains(${tagName})`)
        .removeClass("selected")
        .trigger("session-item-tag-selection-changed");
    }

    $("#sessions-list").trigger("tags-changed");
  });
};

const loadSessions = (sessions, speakers) => {
  for (const session of sessions) {
    const sessionSpeakers = speakers.filter(speaker =>
      session.speakers.includes(speaker.id)
    );

    const searchableText = getSearchableText(session, sessionSpeakers);
    $("#sessions-list").append(
      generateSessionItem(session, sessionSpeakers, searchableText)
    );
  }

  $(".sessions-list-item[data-has-multi-speakers=true]").each(async function() {
    while (true) {
      const speakerContainers = $(this).children(".speaker-container");
      for (const speakerContainer of speakerContainers) {
        await new Promise(done => setTimeout(() => done(), 2000));
        speakerContainers.removeClass("d-lg-flex").addClass("d-none");
        $(speakerContainer)
          .removeClass("d-none")
          .addClass("d-lg-flex");
      }
    }
  });
};

const generateSessionItem = (session, speakers, searchableText) => {
  const sessionTags = session.tags;
  let sessionItemHtml = `
    <div class="sessions-list-item d-flex align-items-center p-3" data-has-multi-speakers="${speakers.length >
      1}" data-num-selected-tags="${sessionTags.length}">`;
  for (const [index, speaker] of speakers.entries()) {
    sessionItemHtml += `
        <div class="speaker-container ${
          index === 0 ? "d-lg-flex" : "d-none"
        } align-items-center flex-1">
          <div class="speaker-frame">
            <img src="${speaker.profileImg.src}" class="mx-auto mx-lg-0" />
          </div>
          <p class="h6 Titillium-Rg">${speaker.fullName}</p>
        </div>
    `;
  }
  sessionItemHtml += `
        <div class="session-details-container d-lg-flex flex-1 justify-content-between">
          <p class="title h6 Titillium-Rg flex-1">${session.title}</p>
          <div class="tags-container h6 Titillium-Rg d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end flex-1">
  `;

  for (sessionTag of sessionTags) {
    const tagColor = tags.find(tag => tag.name === sessionTag).color;
    sessionItemHtml += `
            <div class="tag tag--${tagColor} selected mt-2 mt-lg-0">${sessionTag}</div>
    `;
  }

  sessionItemHtml += `
        </div>
      </div>
      <div class="searchable-text" style="display: none">
        ${searchableText}
      </div>
    </div>`;

  return sessionItemHtml;
};

const getSearchableText = (session, speakers) => {
  let searchableText = "";
  for (const speaker of speakers) {
    const {
      fullName,
      bio,
      company: { title: companyTitle }
    } = speaker;

    searchableText += fullName + " ";
    searchableText += bio + " ";
    searchableText += companyTitle + " ";
  }

  const { title, description } = session;
  searchableText += title + " ";
  searchableText += description + " ";

  for (const sessionTag of session.tags) {
    searchableText += sessionTag + " ";
    searchableText +=
      tags.find(tag => tag.name === sessionTag).description + " ";
  }

  return searchableText;
};

const setSessionsListHandlers = () => {
  $(".sessions-list-item .tag").on(
    "session-item-tag-selection-changed",
    function() {
      const container = $(this).parents(".sessions-list-item");
      const numOfSelectedTags = container.find(".tag.selected").length;
      container.attr("data-num-selected-tags", numOfSelectedTags);
      if ($('#sessions-list-searchbox').val() === '') {
        console.log('sorting based on tags');
        sortChildrenBy(
          "data-num-selected-tags",
          "#sessions-list",
          ".sessions-list-item",
          "desc"
        );
      }
    }
  );

  $("#sessions-list-searchbox").on("keyup", function() {
    const searchValue = $(this).val();

    if (searchValue !== "") {
      $(".sessions-list-item").each(function() {
        const searchableText = $(this)
          .find(".searchable-text")
          .html();
        const searchRegExp = new RegExp(searchValue, "gi");
        const searchCount = (searchableText.match(searchRegExp) || []).length;
        $(this).attr("data-search-count", searchCount);
      });
    } else {
      $(".sessions-list-item").removeAttr('data-search-count');
      sortChildrenBy(
        "data-num-selected-tags",
        "#sessions-list",
        ".sessions-list-item",
        "desc"
      );
    }

    setTimeout(() => {
    $(".sessions-list-item[data-search-count='0'").removeClass('d-flex').addClass('d-none');
    $(".sessions-list-item:not([data-search-count='0'])").addClass('d-flex').removeClass('d-none');

      sortChildrenBy(
        "data-search-count",
        "#sessions-list",
        ".sessions-list-item",
        "desc"
      );
    }, 1000);
  });
};

function sortChildrenBy(arg, sel, elem, order) {
  var $selector = $(sel),
    $element = $selector.children(elem);
  $element.sort(function(a, b) {
    var an = parseInt(a.getAttribute(arg)),
      bn = parseInt(b.getAttribute(arg));
    if (order == "asc") {
      if (an > bn) return 1;
      if (an < bn) return -1;
    } else if (order == "desc") {
      if (an < bn) return 1;
      if (an > bn) return -1;
    }
    return 0;
  });
  $element.detach().appendTo($selector);
}
