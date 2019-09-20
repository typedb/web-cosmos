$(document).ready(async function() {
  const { tags, sessions, speakers } = await getData();
  loadTags(tags);
  setTagsHandlers();

  loadSessions(sessions, speakers, tags);
  setSessionsListHandlers();

  handleHeaderOnScroll();
  handleSubscription();
  handleMobileMenu();
});

const loadTags = tags => {
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

const toggleTagSelection = tag => { $(tag).toggleClass("selected").trigger("tag-selection-changed"); };
const showTagTooltop = container => { $(container).siblings(".tag-tooltip").show(); };
const hideTagTooltop = container => { $(container).siblings(".tag-tooltip").hide(); };
const unselectAllTags = () => { $(".tag-button").removeClass("selected").trigger("tag-selection-changed"); };

const showSessionTagsAsSelection = (tagName) => { $(`.sessions-list-item .tag:contains(${tagName})`).addClass("selected").trigger("session-item-tag-selection-changed"); };
const showSessionTagsAsUnselection = (tagName) => { $(`.sessions-list-item .tag:contains(${tagName})`).removeClass("selected").trigger("session-item-tag-selection-changed"); }

const setTagsHandlers = () => {
  $(".tag-button").on("click", function() { toggleTagSelection(this); });
  $(".tooltip-container").on("mouseover", function() { showTagTooltop(this); });
  $(".tooltip-container").on("mouseleave", function() { hideTagTooltop(this); });
  $("#unselect-tags-btn").on("click", () => { unselectAllTags(); });

  $(".tag-button").on("tag-selection-changed", function() {
    const isTagSelected = $(this).hasClass("selected");
    const tagName = $(this).find(".tag").html();
    isTagSelected ? showSessionTagsAsSelection(tagName) : showSessionTagsAsUnselection(tagName);
    $("#sessions-list").trigger("tags-changed");
  });
};

const loadSessions = (sessions, speakers, tags) => {
  for (const session of sessions) {
    const sessionSpeakers = speakers.filter(speaker => session.speakers.includes(speaker.id));
    const searchableText = getSearchableText(session, sessionSpeakers, tags);
    $("#sessions-list").append(generateSessionItem(session, sessionSpeakers, searchableText, tags));
  }

  // handle swapping of speaker for sessions with multiple speakers
  $(".sessions-list-item[data-has-multi-speakers=true]").each(async function() {
    while (true) {
      const speakerContainers = $(this).children(".speaker-container");
      for (const speakerContainer of speakerContainers) {
        await new Promise(done => setTimeout(() => done(), 2000));
        speakerContainers.removeClass("d-lg-flex").addClass("d-none");
        $(speakerContainer).removeClass("d-none").addClass("d-lg-flex");
      }
    }
  });
};

const generateSessionItem = (session, speakers, searchableText, tags) => {
  const sessionTags = session.tags;
  let sessionItemHtml = `
    <div class="sessions-list-item d-flex align-items-center p-3" data-has-multi-speakers="${speakers.length > 1}" data-num-selected-tags="${sessionTags.length}">`;
  
  // show the first speaker and hide the ones after
  // in loadSessions, we swap them in intervals
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

// concatenate all text relating to a session in 
// which keywords provided by the user are search 
const getSearchableText = (session, speakers, tags) => {
  let searchableText = "";
  for (const speaker of speakers) {
    const { fullName, bio, company: { title: companyTitle } } = speaker;

    searchableText += fullName + " ";
    searchableText += bio + " ";
    searchableText += companyTitle + " ";
  }

  const { title, description } = session;
  searchableText += title + " ";
  searchableText += description + " ";

  for (const sessionTag of session.tags) {
    searchableText += sessionTag + " ";
    searchableText += tags.find(tag => tag.name === sessionTag).description + " ";
  }

  return searchableText;
};

const hideUnSearchedSessions = () => { $(".sessions-list-item[data-search-count='0'").removeClass("d-flex").addClass("d-none"); };
const showSearchedSessions = () => { $(".sessions-list-item:not([data-search-count='0'])").addClass("d-flex").removeClass("d-none"); };

const setSessionsListHandlers = () => {
  $(".sessions-list-item .tag").on("session-item-tag-selection-changed", function() {
      const container = $(this).parents(".sessions-list-item");
      const numOfSelectedTags = container.find(".tag.selected").length;
      container.attr("data-num-selected-tags", numOfSelectedTags);
      
      const isSearchInProgress = $("#sessions-list-searchbox").val() !== "";
      // sorting by number of tags is ignored if the user has searched a keyword
      if (!isSearchInProgress) {
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
        const searchableText = $(this).find(".searchable-text").html();
        const searchRegExp = new RegExp(searchValue, "gi");
        const searchCount = (searchableText.match(searchRegExp) || []).length;
        $(this).attr("data-search-count", searchCount);
      });
    } else {
      $(".sessions-list-item").removeAttr("data-search-count");
      sortChildrenBy(
        "data-num-selected-tags",
        "#sessions-list",
        ".sessions-list-item",
        "desc"
      );
    }

    setTimeout(() => {
      hideUnSearchedSessions();
      showSearchedSessions();
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
  const $selector = $(sel), $element = $selector.children(elem);
  $element.sort(function(a, b) {
    const an = parseInt(a.getAttribute(arg)), bn = parseInt(b.getAttribute(arg));
    if (order === "asc") {
      if (an > bn) return 1;
      if (an < bn) return -1;
    } else if (order === "desc") {
      if (an < bn) return 1;
      if (an > bn) return -1;
    }
    return 0;
  });
  $element.detach().appendTo($selector);
}
