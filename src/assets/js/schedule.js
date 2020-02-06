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
      const speakers = speakerDetails.map(s => ({fullName: s.fullName, profileImg: s.profileImg}));
      scheduleData[day][indexOfTimeData].talks.push({ title, room, speakers });
    } else {
      const speakers = speakerDetails.map(s => ({fullName: s.fullName, profileImg: s.profileImg}));

      const timedData = {
        time: startTime,
        room,
        isKeynote,
        talks: [{ title, room, speakers }]
      };
      
      scheduleData[day].push(timedData);
    }
  }

  return scheduleData;
};

const loadSchedule = (data, day) => {
  $(".schedule-content").html("");
  for (const item of data[day]) {
    $(".schedule-content").append(generateScheduleTime(item, day));
  }
};

const generateScheduleTime = (data, day) => {
  let scheduleTimeHtml = "";

  if (data.time === "09:00 am") {
    scheduleTimeHtml += `
      <div class="schedule-items d-lg-flex">
        <p class="schedule-time text-left" style="line-height: 70px">08:30 am</p>
        <div class="schedule-sessions d-lg-flex">
          <div class="break">
            <p class="h4 Titillium-Rg w-100 text-center" style="line-height: 70px">Breakfast and Welcome</p>
          </div>
        </div>
      </div>
    `;
  }

  if (day === 2 && data.time === "10:45 am") {
    scheduleTimeHtml += `
			<div class="schedule-items d-lg-flex">
				<p class="schedule-time text-left" style="line-height: 50px">10:30 pm</p>
				<div class="schedule-sessions d-lg-flex">
					<div class="break">
					 	<p class="h4 Titillium-Rg w-100 text-center" style="line-height: 50px">Coffee and Tea</p>
					</div>
				</div>
			</div>
		`;
  }

  if ((day === 1 && data.time === "01:15 pm") || (day === 2 && data.time === "01:00 pm")) {
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

  if (day === 1 && data.time === "03:15 pm") {
    scheduleTimeHtml += `
			<div class="schedule-items d-lg-flex">
				<p class="schedule-time text-left" style="line-height: 50px">03:00 pm</p>
				<div class="schedule-sessions d-lg-flex">
					<div class="break">
					 	<p class="h4 Titillium-Rg w-100 text-center" style="line-height: 50px">Afternoon Recharge</p>
					</div>
				</div>
			</div>
		`;
  }

  if (day === 2 && data.time === "03:45 pm") {
    scheduleTimeHtml += `
			<div class="schedule-items d-lg-flex">
				<p class="schedule-time text-left" style="line-height: 70px">03:15 pm</p>
				<div class="schedule-sessions d-lg-flex">
					<div class="break">
					 	<p class="h4 Titillium-Rg w-100 text-center" style="line-height: 70px">Afternoon Recharge</p>
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
  
  scheduleTimeHtml += generateScheduleSession(data);

  scheduleTimeHtml += "</div></div>";

  return scheduleTimeHtml;
};

const generateScheduleSession = data => {
  const { talks } = data;
  talks.sort((a,b) => (a.room > b.room) ? 1 : ((b.room > a.room) ? -1 : 0)); 


  const roomClassMap = {
    "Main Hall": "pink",
    "Small Hall": "yellow",
    "Council Room": "blue"
  };

  let sessionsHtml = '';

  talks.forEach(talk => {
    const { title, room } = talk;
    const { profileImg, fullName } = talk.speakers[talk.speakers.length - 1];

    sessionsHtml += `
      <div class="opens-modal session d-flex align-items-center border-left-color-${
        roomClassMap[room]
      } ${talks.length === 1 ? "is-keynote" : ""}" data-hash="#session-${title}">
        <div class="speaker-frame flex-">
          <img src="${profileImg.src}" class="mx-auto mx-lg-0" />
        </div>
        <div class="details">
          <p class="title clamped-session-title h6 Titillium-Rg text-left">${title}</p>
          <div class="footer">
            <p class="speaker-name opens-modal h6 Titillium-Rg text-color-brand text-left" data-hash="#speaker-${fullName}">${fullName}</p>
            <p class="h6 Titillium-Rg" style="font-size: 13px;">&nbsp;@&nbsp;</p>
            <p class="h6 Titillium-Rg room color-${roomClassMap[room]}"> ${room}</p>
          </div>
        </div>
      </div>
    `;
  });

  return sessionsHtml;
};
