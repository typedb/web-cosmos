const getData = async () => {
  let { speakers, sessions, categories } = await $.get(
    "https://sessionize.com/api/v2/pixtt19d/view/all"
  );
  
  categories = formatCategories(categories);
  sessions = formatSessions(sessions, categories);
  speakers = formatSpeakers(speakers);

  const levels = categories.filter(cat => cat.groupTitle === "Level");
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

const formatSessions = (sessions, categories) => {
  return sessions.map(session => {
    const {
      id,
      title,
      description,
      startsAt,
      endsAt,
      speakers,
      categoryItems
    } = session;

    let level = "";
    const tags = [];
    if (categoryItems) {
      categoryItems.forEach(catItemId => {
        const catItem = categories.find(cat => cat.id === catItemId);
        if (catItem.groupTitle === "Level") level = catItem.name;
        if (catItem.groupTitle === "Tags") tags.push(catItem.name);
      });
    }

    const hasMultipleSpeakers = speakers.length > 1;

    return {
      id,
      title,
      description,
      level,
      tags,
      speakers,
      hasMultipleSpeakers,
      // apart from start and end time, we also need the day
      // on which the session takes place i.e. Day 1 or Day 2
      startsAt,
      endsAt
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
      profilePicture
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
    const companyLogoFileName = questionAnswers.find(
      qa => qa.questionId === companyLogoQId
    ).answerValue;

    const twitterUrlQId = 16350;
    let twitterUrl = questionAnswers.find(
      qa => qa.questionId === twitterUrlQId
    );

    const githubUrlQId = 16349;
    let githubUrl = questionAnswers.find(qa => qa.questionId === githubUrlQId);

    const linkedinUrlQId = 16351;
    let linkedinUrl = questionAnswers.find(
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
      }
    };
  });
};
