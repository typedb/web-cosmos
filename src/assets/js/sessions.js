$(document).ready(async function() {
  const { tags, sessions, speakers } = await getData();
  loadTags(tags);
  setTagsHandlers();

  loadSessions(sessions, speakers, tags);
  setSessionsListHandlers();

  respondToParams();

  $('.menu-item').removeClass('selected');
  $('#menu-item-sessions').addClass('selected');
  
  handleModalRequest(speakers, sessions);
  window.onhashchange = () => { handleModalRequest(speakers, sessions); };
  setModalHandlers();
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
    <div class='tag-button tag-button--${color}'>
        <span class="tag h6 Titillium-Rg">${name}</span>
        <div class="tooltip-container">
            <div class='icon icon-info' />
        </div>
        <div class="tag-tooltip">${description}</div>
    </div>
    `;
};

const respondToParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('tags')) {
    const selectedTags = urlParams.get('tags').split(',');
    
    selectedTags.forEach(tag => {
      $(`.tag-button .tag:contains(${tag})`).trigger('click');
    });
  }

  if (urlParams.has('searched')) {
    const searchedValue = urlParams.get('searched');
    $("#sessions-list-searchbox").val(searchedValue).trigger('keyup');
  }
}

const updateTagsInParams = (tagName) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('tags')) {
    const selectedTagsRaw = urlParams.get('tags');
    const selectedTags = selectedTagsRaw.split(',');
    if (!selectedTags.includes(tagName)) {
      selectedTags.push(tagName);
    }
    urlParams.set("tags", selectedTags.join(','));
  } else {
    urlParams.set("tags", tagName);
  }
  
  const originalUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  const newUrl = originalUrl + "?" + urlParams.toString();
  window.history.pushState({ path: newUrl }, '', newUrl + window.location.hash);
}

const clearTagsInParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("tags", '');
  const originalUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  const newUrl = originalUrl + "?" + urlParams.toString();
  window.history.pushState({ path: newUrl }, '', newUrl);
};

const toggleTagSelection = tag => { $(tag).toggleClass("selected").trigger("tag-selection-changed"); };
const showTagTooltop = container => { $(container).siblings(".tag-tooltip").show(); };
const hideTagTooltop = container => { $(container).siblings(".tag-tooltip").hide(); };
const unselectAllTags = () => { 
  $(".tag-button").removeClass("selected").trigger("tag-selection-changed");
  clearTagsInParams();
};

const showSessionTagsAsSelected = (tagName) => {
  updateTagsInParams(tagName);
  $(`.sessions-list-item .tag:contains(${tagName})`).addClass("selected").trigger("session-item-tag-selection-changed"); 
};
const showSessionTagsAsUnselected = (tagName) => { $(`.sessions-list-item .tag:contains(${tagName})`).removeClass("selected").trigger("session-item-tag-selection-changed"); }

const setTagsHandlers = () => {
  $(".tag-button").on("click", function() { toggleTagSelection(this); });
  $(".tooltip-container").on("mouseover", function() { showTagTooltop(this); });
  $(".tooltip-container").on("mouseleave", function() { hideTagTooltop(this); });
  $("#unselect-tags-btn").on("click", (e) => { if ($(e.target).hasClass('active')) unselectAllTags(); });

  $(".tag-button").on("tag-selection-changed", function() {
    const isTagSelected = $(this).hasClass("selected");
    const tagName = $(this).find(".tag").html();
    isTagSelected ? showSessionTagsAsSelected(tagName) : showSessionTagsAsUnselected(tagName);
    $("#sessions-list").trigger("tags-changed");

    const noTagsSelected = $('.tag-button.selected').length === 0;
    if (noTagsSelected) {
      $('#unselect-tags-btn').removeClass('active');
    } else {
      $('#unselect-tags-btn').addClass('active');
    }
  });
};

const loadSessions = (sessions, speakers) => {
  for (const session of sessions) {
    const sessionSpeakers = speakers.filter(speaker => session.speakers.includes(speaker.id));
    const searchableText = getSearchableText(session, sessionSpeakers);
    $("#sessions-list").append(generateSessionItem(session, sessionSpeakers, searchableText));
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

const generateSessionItem = (session, speakers, searchableText) => {
  let sessionItemHtml = `
    <div data-hash="#session-${session.title}" class="opens-modal sessions-list-item d-flex align-items-center p-3" data-has-multi-speakers="${speakers.length > 1}" data-num-selected-tags="0">`;
  
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

  sessionItemHtml += session.tags.map(tag => `<div class="tag tag--${tag.color} mt-2 mt-lg-0">${tag.name}</div>`).join('');

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
const getSearchableText = (session, speakers) => {
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

  for (const tag of session.tags) {
    searchableText += tag.name + " ";
    searchableText += tag.description + " ";
  }

  return searchableText;
};

const hideUnSearchedSessions = () => { $(".sessions-list-item[data-search-count='0']").removeClass("d-flex").addClass("d-none"); };
const showSearchedSessions = () => { $(".sessions-list-item:not([data-search-count='0'])").addClass("d-flex").removeClass("d-none"); };

const updateSrarchedInParams = (searchedValue) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('searched', searchedValue);
  const originalUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  const newUrl = originalUrl + "?" + urlParams.toString();
  window.history.pushState({ path: newUrl }, '', newUrl + window.location.hash);  
};

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
      updateSrarchedInParams(searchValue);
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
