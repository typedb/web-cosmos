const getData = async () => {
  let { speakers, sessions, categories } = await $.get(
    "https://sessionize.com/api/v2/pixtt19d/view/all"
  );

  const tags = [
    {
      name: "#analytics",
      color: "green-a",
      description:
        "Deriving insights from a Knowledge Graph, via any number of methodologies"
    },
    {
      name: "#devtools",
      color: "pink-a",
      description:
        "Tools built with Grakn specifically to help software developers"
    },
    {
      name: "#expertsystem",
      color: "blue-a",
      description:
        "Expert Systems aim to answer user questions with embedded expertise"
    },
    {
      name: "#finance",
      color: "yellow",
      description:
        "Applications of the Knowledge Graph in the finance sector"
    },
    {
      name: "#grakndev",
      color: "blue-b",
      description:
        "Stories of the development of Grakn itself, its infrastructure and research"
    },
    {
      name: "#iot",
      color: "orange-a",
      description:
        "Applications of the Knowledge Graph for the Internet of Things"
    },
    {
      name: "#lifescience",
      color: "orange-b",
      description:
        "Modelling, ingesting and analysing data from the Life Sciences"
    },
    {
      name: "#ml",
      color: "blue-b",
      description:
        "New approaches for Machine Learning in the age of Knowledge Graphs"
    },
    {
      name: "#nlp",
      color: "pink-b",
      description:
        "Augmenting or utilising Natural Language Processing with Knowledge Graphs"
    },
    {
      name: "#robotics",
      color: "blue-c",
      description:
        "How the Knowledge Graph is empowering the cutting edge of robotics research"
    },
    {
      name: "#security",
      color: "purple",
      description:
        "Network modelling and how this can be used to counter and anticipate threats"
    },
    {
      name: "#telecom",
      color: "blue-d",
      description:
        "Applications of the Knowledge Graph in the telecommunications sector"
    }
  ];  

  categories = formatCategories(categories);
  speakers = formatSpeakers(speakers);
  sessions = formatSessions(sessions, categories, tags, speakers);

  const levels = categories.filter(cat => cat.groupTitle === "Level");

  return {
    speakers,
    sessions,
    levels,
    tags
  };
};

const collect = (array, current) => array.concat(current);

const formatCategories = categories => {
  return categories
    .map(categoriesGroup =>
      categoriesGroup.items.map(item => {
        item.groupTitle = categoriesGroup.title;
        return item;
      })
    )
    .reduce(collect, []);
};

const formatSessions = (sessions, categories, tags, speakers) => {
  return sessions.map(session => {
    const {
      id,
      title,
      description,
      startsAt,
      roomId,
      speakers: speakerIds,
      categoryItems,
      questionAnswers,
    } = session;

    const keynoteQId = 17054;
    const isKeynoteAnswer = questionAnswers.find(qa => qa.questionId === keynoteQId);

    const videoQId = 21785;
    const videoIdAQA = questionAnswers.find(qa => qa.questionId === videoQId);
    const videoId = videoIdAQA ? videoIdAQA.answerValue : undefined
    
    const isKeynote = isKeynoteAnswer ? true : false;

    let level = "";
    const sessionTags = [];
    if (categoryItems) {
      categoryItems.forEach(catItemId => {
        const catItem = categories.find(cat => cat.id === catItemId);
        if (catItem.groupTitle === "Level") level = catItem.name;
        if (catItem.groupTitle === "Tags")
          sessionTags.push(tags.find(tag => tag.name === catItem.name));
      });
    }

    const pad = (num, size) => {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    const startDate = new Date(startsAt);
    let startTime = pad(startDate.getHours() % 12 || 12, 2);
    startTime += ':';
    startTime += pad(startDate.getMinutes(), 2);
    startTime += startDate.getHours() >= 12 ? ' pm' : ' am';

    const day = startDate.getDay() === 4 ? 1 : 2;

    let room = "";
    if (roomId === 8354) {
      room = "Small Hall";
    } else if (roomId === 8355) {
      room = "Council Room";
    } else if (roomId === 8356) {
      room = "Main Hall";
    }

    const speakerDetails = speakers.filter(speaker => speakerIds.includes(speaker.id));

    return {
      id,
      title,
      description,
      level,
      tags: sessionTags,
      speakers: speakerIds,
      speakerDetails,
      day,
      startTime,
      room,
      isKeynote,
      videoId
    };
  });
};

const formatSpeakers = speakers => {
  return speakers.map(speaker => {
    const {
      id,
      tagLine,
      bio,
      fullName,
      questionAnswers,
      profilePicture,
      sessions
    } = speaker;

    const profileImg = new Image();
    profileImg.src = profilePicture;

    const companyTitleQId = 16062;
    const companyTitle = questionAnswers.find(
      qa => qa.questionId === companyTitleQId
    ).answerValue;

    const companyUrlQId = 16352;
    const companyUrl = questionAnswers.find(
      qa => qa.questionId === companyUrlQId
    ).answerValue;

    const positionQnId = 16061;
    const positionShort = questionAnswers.find(
      qa => qa.questionId === positionQnId
    ).answerValue;
    const positionLong = tagLine.split(" at ")[0];

    const companyLogoQId = 16298;
    const companyLogoFileNameQA = questionAnswers.find(
      qa => qa.questionId === companyLogoQId
    );
    const companyLogoFileName = companyLogoFileNameQA ? companyLogoFileNameQA.answerValue : "";

    const twitterUrlQId = 16350;
    const twitterUrl = questionAnswers.find(
      qa => qa.questionId === twitterUrlQId
    );

    const githubUrlQId = 16349;
    const githubUrl = questionAnswers.find(qa => qa.questionId === githubUrlQId);

    const linkedinUrlQId = 16351;
    const linkedinUrl = questionAnswers.find(
      qa => qa.questionId === linkedinUrlQId
    );

    return {
      id,
      fullName,
      bio,
      profileImg,
      company: {
        title: companyTitle,
        url: companyUrl,
        logo: companyLogoFileName
      },
      position: {
        short: positionShort,
        long: positionLong
      },
      socialLinks: {
        twitter: twitterUrl,
        github: githubUrl,
        linkedin: linkedinUrl
      },
      sessions
    };
  });
};
