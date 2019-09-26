$(document).ready(async function() {
  const { sessions, speakers } = await getData();
  const scheduleData = getScheduleData(sessions);
  loadSchedule(scheduleData, 1);
  truncateSessionTitles();

  $(".day-switcher-option").on("click", function() {
    $(".day-switcher-option").removeClass("selected");
		$(this).toggleClass("selected");

    const selectedDay = $(this).data("value");
		
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('day', selectedDay);
		const originalUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		const newUrl = originalUrl + "?" + urlParams.toString();
		window.history.pushState({ path: newUrl }, '', newUrl + window.location.hash);

    loadSchedule(scheduleData, parseInt(selectedDay));
	});
	
	respondToParams();

	handleModalRequest(speakers, sessions);
  window.onhashchange = () => { handleModalRequest(speakers, sessions); };
  setModalHandlers();
  handleHeaderOnScroll();
  handleSubscription();
  handleMobileMenu();
});

const truncateSessionTitles = () => {
  Array.prototype.slice
    .call(document.getElementsByClassName("clamped-session-title"))
    .forEach(x => $clamp(x, { clamp: 3 }));
};

const respondToParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('day')) {
		const selectedDay = urlParams.get('day');
		$(`.day-switcher-option[data-value=${selectedDay}]`).trigger('click');
  }
}

const getScheduleData = sessions => {
  const scheduleData = {
    1: [],
    2: []
  };

  for (const session of sessions) {
    const { day, startTime, title, room, isKeynote, speakerDetails } = session;
    const indexOfTimeData = scheduleData[day].findIndex(
      timeData => timeData.time === startTime
    );
    if (indexOfTimeData > -1) {
      scheduleData[day][indexOfTimeData][room] = { title, speakers: [] };
      for (const speaker of speakerDetails) {
        const { fullName, profileImg } = speaker;
        scheduleData[day][indexOfTimeData][room].speakers.push({
          fullName,
          profileImg
        });
      }
    } else {
      const timedData = {
        time: startTime,
        isKeynote,
        "Great Hall": undefined,
        "Small Hall": undefined,
        "Council Chamber": undefined
      };
      timedData[room] = { title, speakers: [] };
      for (const speaker of speakerDetails) {
        const { fullName, profileImg } = speaker;
        timedData[room].speakers.push({ fullName, profileImg });
      }
      scheduleData[day].push(timedData);
    }
  }

  return scheduleData;
};

const loadSchedule = (data, day) => {
  $(".schedule-content").html("");
  for (const item of data[day]) {
    $(".schedule-content").append(generateScheduleTime(item));
  }
};

const generateScheduleTime = data => {
  let scheduleTimeHtml = "";

  if (data.time === "01:00 pm") {
    scheduleTimeHtml += `
			<div class="schedule-items d-lg-flex">
				<p class="schedule-time text-left">12:00 pm</p>
				<div class="schedule-sessions d-lg-flex">
					<div class="break">
					 	<p class="h4 Titillium-Rg w-100 text-center">Lunch</p>
					</div>
				</div>
			</div>
		`;
  }

  scheduleTimeHtml += `
		<div class="schedule-items d-lg-flex">
			<p class="schedule-time text-left">${data.time}</p>
			<div class="schedule-sessions d-lg-flex">
	`;

  if (data["Great Hall"]) {
    scheduleTimeHtml += generateScheduleSession({
      room: "Great Hall",
      title: data["Great Hall"].title,
      fullName: data["Great Hall"].speakers[0].fullName,
      profileImg: data["Great Hall"].speakers[0].profileImg,
      isKeynote: data.isKeynote
    });
  } else {
    scheduleTimeHtml += '<div class="session d-flex align-items-center"></div>';
  }

  if (data["Small Hall"]) {
    scheduleTimeHtml += generateScheduleSession({
      room: "Small Hall",
      title: data["Small Hall"].title,
      fullName: data["Small Hall"].speakers[0].fullName,
      profileImg: data["Small Hall"].speakers[0].profileImg,
      isKeynote: data.isKeynote
    });
  } else if (!data.isKeynote) {
    scheduleTimeHtml += '<div class="session d-flex align-items-center"></div>';
  }

  if (data["Council Chamber"]) {
    scheduleTimeHtml += generateScheduleSession({
      room: "Council Chamber",
      title: data["Council Chamber"].title,
      fullName: data["Council Chamber"].speakers[0].fullName,
      profileImg: data["Council Chamber"].speakers[0].profileImg,
      isKeynote: data.isKeynote
    });
  } else if (!data.isKeynote) {
    scheduleTimeHtml += '<div class="session d-flex align-items-center"></div>';
  }
  scheduleTimeHtml += "</div></div>";

  return scheduleTimeHtml;
};

const generateScheduleSession = data => {
  const { room, profileImg, title, fullName, isKeynote } = data;

  const roomClassMap = {
    "Great Hall": "pink",
    "Small Hall": "yellow",
    "Council Chamber": "blue"
  };

  return `
		<div class="opens-modal session d-flex align-items-center border-left-color-${
      roomClassMap[room]
    } ${isKeynote ? "is-keynote" : ""}" data-hash="#session-${title}">
			<div class="speaker-frame flex-">
				<img src="${profileImg.src}" class="mx-auto mx-lg-0" />
			</div>
			<div class="details">
				<p class="title clamped-session-title h6 Titillium-Rg text-left">${title}</p>
				<p class="speaker-name opens-modal h6 Titillium-Rg text-color-brand text-left" data-hash="#speaker-${fullName}">${fullName}</p>
			</div>
			<p class="room d-block d-sm-none color-${roomClassMap[room]}">${room}</p>
		</div>
	`;
};
