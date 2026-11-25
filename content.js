/* LinguaClass — учебный контент: 5–11 классы.
   Каждый класс: 5 юнитов. В юните словарь (vocab) и фразы (sentences).
   Из этого пула приложение собирает 4 урока на юнит. */

const CURRICULUM = [
  {
    id: "c5",
    title: "5 класс",
    level: "A1 · Начальный",
    desc: "To be, have got, Present Simple — первые шаги",
    goal: 20,
    units: [
      {
        title: "Давай знакомиться",
        emoji: "👋",
        grammar: "Глагол to be: am / is / are",
        vocab: [
          ["hello", "привет"],
          ["name", "имя"],
          ["friend", "друг"],
          ["school", "школа"],
          ["teacher", "учитель"],
          ["student", "ученик"],
          ["family", "семья"],
          ["boy", "мальчик"],
          ["girl", "девочка"],
          ["good", "хороший"]
        ],
        sentences: [
          { en: "I am a student.", ru: "Я ученик." },
          { en: "She is my friend.", ru: "Она моя подруга." },
          { en: "We are from Russia.", ru: "Мы из России." },
          { en: "My name is Anna.", ru: "Меня зовут Анна." },
          { en: "They are at school.", ru: "Они в школе." },
          { en: "He is a good teacher.", ru: "Он хороший учитель." },
          { en: "Are you from London?", ru: "Ты из Лондона?" },
          { en: "I am not a teacher.", ru: "Я не учитель." }
        ]
      },
      {
        title: "Мой класс",
        emoji: "🎒",
        grammar: "have got / has got, числа и цвета",
        vocab: [
          ["pen", "ручка"],
          ["book", "книга"],
          ["bag", "портфель"],
          ["desk", "парта"],
          ["chair", "стул"],
          ["red", "красный"],
          ["blue", "синий"],
          ["five", "пять"],
          ["ten", "десять"],
          ["pencil", "карандаш"]
        ],
        sentences: [
          { en: "I have got a red pen.", ru: "У меня есть красная ручка." },
          { en: "She has got two books.", ru: "У неё есть две книги." },
          { en: "My bag is blue.", ru: "Мой портфель синий." },
          { en: "There are ten desks in the class.", ru: "В классе десять парт." },
          { en: "Have you got a pencil?", ru: "У тебя есть карандаш?" },
          { en: "This is my chair.", ru: "Это мой стул." }
        ]
      },
      {
        title: "Животные и еда",
        emoji: "🐱",
        grammar: "Present Simple: I like / he likes",
        vocab: [
          ["cat", "кошка"],
          ["dog", "собака"],
          ["milk", "молоко"],
          ["bread", "хлеб"],
          ["apple", "яблоко"],
          ["water", "вода"],
          ["bird", "птица"],
          ["fish", "рыба"],
          ["tea", "чай"],
          ["cheese", "сыр"]
        ],
        sentences: [
          { en: "I like apples.", ru: "Я люблю яблоки." },
          { en: "My cat drinks milk.", ru: "Моя кошка пьёт молоко." },
          { en: "He eats bread and cheese.", ru: "Он ест хлеб и сыр." },
          { en: "Do you like fish?", ru: "Ты любишь рыбу?" },
          { en: "The bird is in the tree.", ru: "Птица на дереве." },
          { en: "We drink tea every morning.", ru: "Мы пьём чай каждое утро." }
        ]
      },
      {
        title: "Мой дом",
        emoji: "🏠",
        grammar: "There is / There are, предлоги места",
        vocab: [
          ["house", "дом"],
          ["room", "комната"],
          ["table", "стол"],
          ["bed", "кровать"],
          ["window", "окно"],
          ["door", "дверь"],
          ["kitchen", "кухня"],
          ["garden", "сад"],
          ["big", "большой"],
          ["small", "маленький"]
        ],
        sentences: [
          { en: "There is a table in my room.", ru: "В моей комнате есть стол." },
          { en: "My bed is near the window.", ru: "Моя кровать у окна." },
          { en: "There are two chairs in the kitchen.", ru: "На кухне два стула." },
          { en: "The garden is behind the house.", ru: "Сад за домом." },
          { en: "Is there a door in the room?", ru: "В комнате есть дверь?" },
          { en: "Our flat is not very big.", ru: "Наша квартира не очень большая." }
        ]
      },
      {
        title: "Погода и времена года",
        emoji: "☀️",
        grammar: "It is + погода, глагол can",
        vocab: [
          ["weather", "погода"],
          ["sunny", "солнечный"],
          ["rainy", "дождливый"],
          ["cold", "холодный"],
          ["hot", "жаркий"],
          ["wind", "ветер"],
          ["snow", "снег"],
          ["spring", "весна"],
          ["summer", "лето"],
          ["winter", "зима"]
        ],
        sentences: [
          { en: "It is sunny today.", ru: "Сегодня солнечно." },
          { en: "In winter it is cold and snowy.", ru: "Зимой холодно и снежно." },
          { en: "I can swim in summer.", ru: "Летом я умею плавать." },
          { en: "It is raining now.", ru: "Сейчас идёт дождь." },
          { en: "The wind is strong in autumn.", ru: "Осенью ветер сильный." },
          { en: "We like to play in the snow.", ru: "Мы любим играть в снегу." }
        ]
      }
    ]
  },
  {
    id: "c6",
    title: "6 класс",
    level: "A1–A2 · Базовый",
    desc: "Present Continuous, Past Simple, сравнения",
    goal: 30,
    units: [
      {
        title: "Мой день",
        emoji: "⏰",
        grammar: "Present Continuous, наречия частоты",
        vocab: [
          ["morning", "утро"],
          ["evening", "вечер"],
          ["breakfast", "завтрак"],
          ["homework", "домашняя работа"],
          ["always", "всегда"],
          ["usually", "обычно"],
          ["never", "никогда"],
          ["early", "рано"],
          ["late", "поздно"],
          ["busy", "занятый"]
        ],
        sentences: [
          { en: "I am doing my homework now.", ru: "Я сейчас делаю домашнюю работу." },
          { en: "She usually gets up early.", ru: "Она обычно встаёт рано." },
          { en: "We are having breakfast.", ru: "Мы завтракаем." },
          { en: "He never comes late.", ru: "Он никогда не опаздывает." },
          { en: "Are you busy in the evening?", ru: "Ты занят вечером?" },
          { en: "They are not watching TV now.", ru: "Они сейчас не смотрят телевизор." }
        ]
      },
      {
        title: "Дом и погода",
        emoji: "🏠",
        grammar: "there is / there are, предлоги места",
        vocab: [
          ["kitchen", "кухня"],
          ["bedroom", "спальня"],
          ["window", "окно"],
          ["garden", "сад"],
          ["sunny", "солнечно"],
          ["rainy", "дождливо"],
          ["cold", "холодно"],
          ["warm", "тепло"],
          ["upstairs", "наверху"],
          ["furniture", "мебель"]
        ],
        sentences: [
          { en: "There is a big window in my bedroom.", ru: "В моей спальне есть большое окно." },
          { en: "The cat is under the table.", ru: "Кошка под столом." },
          { en: "It is cold and rainy today.", ru: "Сегодня холодно и дождливо." },
          { en: "There are two chairs in the kitchen.", ru: "На кухне два стула." },
          { en: "Our garden is behind the house.", ru: "Наш сад за домом." },
          { en: "It is warm and sunny.", ru: "Тепло и солнечно." }
        ]
      },
      {
        title: "Хобби и спорт",
        emoji: "⚽",
        grammar: "Past Simple (правильные глаголы), can",
        vocab: [
          ["football", "футбол"],
          ["music", "музыка"],
          ["dance", "танцевать"],
          ["swim", "плавать"],
          ["draw", "рисовать"],
          ["played", "играл"],
          ["watched", "смотрел"],
          ["yesterday", "вчера"],
          ["weekend", "выходные"],
          ["hobby", "хобби"]
        ],
        sentences: [
          { en: "I played football yesterday.", ru: "Вчера я играл в футбол." },
          { en: "She can swim very well.", ru: "Она очень хорошо плавает." },
          { en: "We watched a film at the weekend.", ru: "На выходных мы смотрели фильм." },
          { en: "He cannot dance.", ru: "Он не умеет танцевать." },
          { en: "They listened to music yesterday.", ru: "Вчера они слушали музыку." },
          { en: "My hobby is drawing.", ru: "Моё хобби — рисование." }
        ]
      },
      {
        title: "Одежда и покупки",
        emoji: "👕",
        grammar: "this / these, How much…?",
        vocab: [
          ["clothes", "одежда"],
          ["shirt", "рубашка"],
          ["shoes", "обувь"],
          ["dress", "платье"],
          ["hat", "шапка"],
          ["jacket", "куртка"],
          ["price", "цена"],
          ["money", "деньги"],
          ["cheap", "дешёвый"],
          ["expensive", "дорогой"]
        ],
        sentences: [
          { en: "How much is this shirt?", ru: "Сколько стоит эта рубашка?" },
          { en: "These shoes are very expensive.", ru: "Эта обувь очень дорогая." },
          { en: "I want to buy a new jacket.", ru: "Я хочу купить новую куртку." },
          { en: "The price is too high.", ru: "Цена слишком высокая." },
          { en: "This hat is cheap.", ru: "Эта шапка дешёвая." },
          { en: "She has got enough money.", ru: "У неё достаточно денег." }
        ]
      },
      {
        title: "Путешествия",
        emoji: "✈️",
        grammar: "going to, will",
        vocab: [
          ["trip", "поездка"],
          ["train", "поезд"],
          ["plane", "самолёт"],
          ["ticket", "билет"],
          ["city", "город"],
          ["map", "карта"],
          ["hotel", "отель"],
          ["visit", "посещать"],
          ["travel", "путешествовать"],
          ["interesting", "интересный"]
        ],
        sentences: [
          { en: "We are going to visit London.", ru: "Мы собираемся посетить Лондон." },
          { en: "I will buy the tickets tomorrow.", ru: "Я куплю билеты завтра." },
          { en: "The train leaves at seven.", ru: "Поезд отправляется в семь." },
          { en: "Our hotel is in the city centre.", ru: "Наш отель в центре города." },
          { en: "Do you like to travel by plane?", ru: "Ты любишь путешествовать самолётом?" },
          { en: "The trip was very interesting.", ru: "Поездка была очень интересной." }
        ]
      }
    ]
  },
  {
    id: "c7",
    title: "7 класс",
    level: "A2 · Уверенный",
    desc: "Неправильные глаголы, must / should, Present Perfect",
    goal: 40,
    units: [
      {
        title: "Путешествия",
        emoji: "✈️",
        grammar: "Past Simple (неправильные глаголы), сравнения",
        vocab: [
          ["journey", "поездка"],
          ["ticket", "билет"],
          ["airport", "аэропорт"],
          ["luggage", "багаж"],
          ["hotel", "отель"],
          ["went", "поехал"],
          ["saw", "увидел"],
          ["bought", "купил"],
          ["faster", "быстрее"],
          ["cheaper", "дешевле"]
        ],
        sentences: [
          { en: "We went to Moscow by train.", ru: "Мы поехали в Москву на поезде." },
          { en: "I bought two tickets.", ru: "Я купил два билета." },
          { en: "The plane is faster than the train.", ru: "Самолёт быстрее поезда." },
          { en: "She saw the sea for the first time.", ru: "Она впервые увидела море." },
          { en: "This hotel is cheaper than that one.", ru: "Этот отель дешевле того." },
          { en: "Where did you go last summer?", ru: "Куда ты ездил прошлым летом?" }
        ]
      },
      {
        title: "Здоровье",
        emoji: "🩺",
        grammar: "must / mustn't / should",
        vocab: [
          ["health", "здоровье"],
          ["doctor", "врач"],
          ["medicine", "лекарство"],
          ["exercise", "зарядка"],
          ["sleep", "спать"],
          ["tired", "уставший"],
          ["headache", "головная боль"],
          ["healthy", "здоровый"],
          ["should", "следует"],
          ["hurt", "болит"]
        ],
        sentences: [
          { en: "You should sleep eight hours.", ru: "Тебе следует спать восемь часов." },
          { en: "I must see a doctor.", ru: "Мне нужно к врачу." },
          { en: "You must not eat so much sugar.", ru: "Тебе нельзя есть так много сахара." },
          { en: "He has a headache.", ru: "У него болит голова." },
          { en: "Exercise is good for your health.", ru: "Зарядка полезна для здоровья." },
          { en: "I feel tired today.", ru: "Сегодня я чувствую себя уставшим." }
        ]
      },
      {
        title: "Работа",
        emoji: "💼",
        grammar: "Present Perfect: since / already / yet",
        vocab: [
          ["job", "работа"],
          ["engineer", "инженер"],
          ["nurse", "медсестра"],
          ["salary", "зарплата"],
          ["office", "офис"],
          ["worked", "работал"],
          ["since", "с (какого-то времени)"],
          ["already", "уже"],
          ["yet", "ещё (нет)"],
          ["experience", "опыт"]
        ],
        sentences: [
          { en: "She has worked here since 2020.", ru: "Она работает здесь с 2020 года." },
          { en: "I have already finished my project.", ru: "Я уже закончил свой проект." },
          { en: "He has not found a job yet.", ru: "Он ещё не нашёл работу." },
          { en: "My sister is a nurse.", ru: "Моя сестра медсестра." },
          { en: "Engineers need good experience.", ru: "Инженерам нужен хороший опыт." },
          { en: "The office is near the station.", ru: "Офис рядом со станцией." }
        ]
      },
      {
        title: "Школа и учёба",
        emoji: "📖",
        grammar: "must / have to, Present Perfect",
        vocab: [
          ["subject", "предмет"],
          ["exam", "экзамен"],
          ["mark", "оценка"],
          ["answer", "ответ"],
          ["question", "вопрос"],
          ["learn", "учить"],
          ["explain", "объяснять"],
          ["difficult", "трудный"],
          ["easy", "лёгкий"],
          ["prepare", "готовиться"]
        ],
        sentences: [
          { en: "I have already done my homework.", ru: "Я уже сделал домашнюю работу." },
          { en: "You must be on time for the lesson.", ru: "Ты должен приходить на урок вовремя." },
          { en: "She has not passed the exam yet.", ru: "Она ещё не сдала экзамен." },
          { en: "This subject is difficult but interesting.", ru: "Этот предмет трудный, но интересный." },
          { en: "Can you explain the rule again?", ru: "Можешь объяснить правило ещё раз?" },
          { en: "We have to prepare for the test.", ru: "Нам нужно готовиться к контрольной." }
        ]
      },
      {
        title: "Праздники и традиции",
        emoji: "🎉",
        grammar: "Present Perfect: just / already / yet",
        vocab: [
          ["holiday", "праздник"],
          ["gift", "подарок"],
          ["party", "вечеринка"],
          ["candle", "свеча"],
          ["cake", "торт"],
          ["invite", "приглашать"],
          ["celebrate", "праздновать"],
          ["tradition", "традиция"],
          ["special", "особенный"],
          ["together", "вместе"]
        ],
        sentences: [
          { en: "We have just decorated the room.", ru: "Мы только что украсили комнату." },
          { en: "She has already bought a gift.", ru: "Она уже купила подарок." },
          { en: "They have not arrived yet.", ru: "Они ещё не приехали." },
          { en: "We always celebrate the holiday together.", ru: "Мы всегда празднуем праздник вместе." },
          { en: "This tradition is very special for us.", ru: "Эта традиция очень важна для нас." },
          { en: "I want to invite all my friends.", ru: "Я хочу пригласить всех друзей." }
        ]
      }
    ]
  },
  {
    id: "c8",
    title: "8 класс",
    level: "A2–B1 · Средний",
    desc: "Будущее время, пассив, условные предложения",
    goal: 50,
    units: [
      {
        title: "Технологии",
        emoji: "🤖",
        grammar: "will / going to, страдательный залог",
        vocab: [
          ["device", "устройство"],
          ["screen", "экран"],
          ["download", "скачивать"],
          ["improve", "улучшать"],
          ["invention", "изобретение"],
          ["robot", "робот"],
          ["online", "онлайн"],
          ["data", "данные"],
          ["probably", "вероятно"],
          ["create", "создавать"]
        ],
        sentences: [
          { en: "Robots will do more work in the future.", ru: "В будущем роботы будут выполнять больше работы." },
          { en: "I am going to buy a new phone.", ru: "Я собираюсь купить новый телефон." },
          { en: "This app was created by students.", ru: "Это приложение было создано студентами." },
          { en: "You can download the file online.", ru: "Ты можешь скачать файл онлайн." },
          { en: "Screens will probably become cheaper.", ru: "Экраны, вероятно, станут дешевле." },
          { en: "The data is stored on the server.", ru: "Данные хранятся на сервере." }
        ]
      },
      {
        title: "СМИ и общение",
        emoji: "📰",
        grammar: "Косвенная речь, Present Perfect",
        vocab: [
          ["news", "новости"],
          ["journalist", "журналист"],
          ["article", "статья"],
          ["interview", "интервью"],
          ["message", "сообщение"],
          ["said", "сказал"],
          ["told", "рассказал"],
          ["media", "СМИ"],
          ["truth", "правда"],
          ["share", "делиться"]
        ],
        sentences: [
          { en: "He said that he was busy.", ru: "Он сказал, что занят." },
          { en: "She told me the news.", ru: "Она рассказала мне новости." },
          { en: "I have already read this article.", ru: "Я уже прочитал эту статью." },
          { en: "The journalist took an interview.", ru: "Журналист взял интервью." },
          { en: "Do not share personal data.", ru: "Не делись личными данными." },
          { en: "They have never told the truth.", ru: "Они никогда не говорили правду." }
        ]
      },
      {
        title: "Культура",
        emoji: "🏛️",
        grammar: "First Conditional, relative clauses",
        vocab: [
          ["culture", "культура"],
          ["museum", "музей"],
          ["tradition", "традиция"],
          ["celebrate", "праздновать"],
          ["which", "который"],
          ["abroad", "за границей"],
          ["exhibition", "выставка"],
          ["ancient", "древний"],
          ["guide", "гид"],
          ["visit", "посещать"]
        ],
        sentences: [
          { en: "If you visit London, you will see the museum.", ru: "Если ты поедешь в Лондон, ты увидишь музей." },
          { en: "This is the city which I love.", ru: "Это город, который я люблю." },
          { en: "We celebrate New Year with our family.", ru: "Мы празднуем Новый год с семьёй." },
          { en: "The guide told us about ancient traditions.", ru: "Гид рассказал нам о древних традициях." },
          { en: "If it rains, we will stay at home.", ru: "Если пойдёт дождь, мы останемся дома." },
          { en: "I have never been abroad.", ru: "Я никогда не был за границей." }
        ]
      },
      {
        title: "Здоровье и спорт",
        emoji: "🏃",
        grammar: "should / ought to, условные предложения",
        vocab: [
          ["health", "здоровье"],
          ["exercise", "упражнение"],
          ["diet", "питание"],
          ["sleep", "сон"],
          ["energy", "энергия"],
          ["stress", "стресс"],
          ["injury", "травма"],
          ["train", "тренироваться"],
          ["fit", "в хорошей форме"],
          ["recover", "восстанавливаться"]
        ],
        sentences: [
          { en: "If you exercise, you will feel better.", ru: "Если будешь тренироваться, будешь чувствовать себя лучше." },
          { en: "You should sleep at least eight hours.", ru: "Тебе следует спать не меньше восьми часов." },
          { en: "A healthy diet gives you energy.", ru: "Здоровое питание даёт энергию." },
          { en: "He has recovered from his injury.", ru: "Он восстановился после травмы." },
          { en: "Stress can be dangerous for your health.", ru: "Стресс может быть опасен для здоровья." },
          { en: "Athletes train every day to stay fit.", ru: "Спортсмены тренируются каждый день, чтобы быть в форме." }
        ]
      },
      {
        title: "Природа и климат",
        emoji: "🌿",
        grammar: "First Conditional, because / so",
        vocab: [
          ["nature", "природа"],
          ["forest", "лес"],
          ["river", "река"],
          ["mountain", "гора"],
          ["climate", "климат"],
          ["pollution", "загрязнение"],
          ["protect", "защищать"],
          ["wildlife", "дикая природа"],
          ["storm", "буря"],
          ["dry", "сухой"]
        ],
        sentences: [
          { en: "If we protect forests, wildlife will survive.", ru: "Если мы защитим леса, дикая природа выживет." },
          { en: "Pollution is a serious problem for nature.", ru: "Загрязнение — серьёзная проблема для природы." },
          { en: "The climate is changing very fast.", ru: "Климат меняется очень быстро." },
          { en: "We should not throw rubbish into the river.", ru: "Нельзя бросать мусор в реку." },
          { en: "A storm destroyed many trees in the forest.", ru: "Буря уничтожила много деревьев в лесу." },
          { en: "The summer was hot and dry.", ru: "Лето было жарким и сухим." }
        ]
      }
    ]
  },
  {
    id: "c9",
    title: "9 класс",
    level: "B1 · Выше среднего",
    desc: "Условные, Past Perfect, пассив, наука и общество",
    goal: 60,
    units: [
      {
        title: "Образование",
        emoji: "🎓",
        grammar: "First Conditional, модальные глаголы, пассив",
        vocab: [
          ["education", "образование"],
          ["exam", "экзамен"],
          ["knowledge", "знания"],
          ["subject", "предмет"],
          ["opportunity", "возможность"],
          ["require", "требовать"],
          ["skills", "навыки"],
          ["attend", "посещать"],
          ["grade", "оценка"],
          ["develop", "развивать"]
        ],
        sentences: [
          { en: "Education gives you more opportunities.", ru: "Образование даёт больше возможностей." },
          { en: "Students are required to attend classes.", ru: "Студенты обязаны посещать занятия." },
          { en: "If you study hard, you will pass the exam.", ru: "Если будешь усердно учиться, сдашь экзамен." },
          { en: "Knowledge is more important than grades.", ru: "Знания важнее оценок." },
          { en: "This subject is taught by a young teacher.", ru: "Этот предмет преподаёт молодой учитель." },
          { en: "You should develop your skills.", ru: "Тебе следует развивать свои навыки." }
        ]
      },
      {
        title: "Наука",
        emoji: "🔬",
        grammar: "Past Perfect, пассив, герундий",
        vocab: [
          ["research", "исследование"],
          ["discovery", "открытие"],
          ["scientist", "учёный"],
          ["experiment", "эксперимент"],
          ["solve", "решать"],
          ["evidence", "доказательство"],
          ["space", "космос"],
          ["theory", "теория"],
          ["prove", "доказывать"],
          ["explore", "исследовать"]
        ],
        sentences: [
          { en: "They had finished the experiment before noon.", ru: "Они закончили эксперимент до полудня." },
          { en: "The theory was proven by scientists.", ru: "Теория была доказана учёными." },
          { en: "Research helps us understand the world.", ru: "Исследования помогают нам понимать мир." },
          { en: "He is interested in space exploration.", ru: "Он интересуется исследованием космоса." },
          { en: "Solving this problem takes time.", ru: "Решение этой задачи требует времени." },
          { en: "There is no evidence for this idea.", ru: "Для этой идеи нет доказательств." }
        ]
      },
      {
        title: "Общество",
        emoji: "🤝",
        grammar: "Косвенная речь, relative clauses",
        vocab: [
          ["society", "общество"],
          ["government", "правительство"],
          ["volunteer", "волонтёр"],
          ["charity", "благотворительность"],
          ["poverty", "бедность"],
          ["equality", "равенство"],
          ["community", "сообщество"],
          ["support", "поддерживать"],
          ["law", "закон"],
          ["responsible", "ответственный"]
        ],
        sentences: [
          { en: "Society changes faster than laws.", ru: "Общество меняется быстрее, чем законы." },
          { en: "She said she wanted to help.", ru: "Она сказала, что хочет помочь." },
          { en: "Volunteers support people who need help.", ru: "Волонтёры поддерживают людей, которым нужна помощь." },
          { en: "Everyone is responsible for their community.", ru: "Каждый отвечает за своё сообщество." },
          { en: "The government should fight poverty.", ru: "Правительство должно бороться с бедностью." },
          { en: "Equality is important for a fair society.", ru: "Равенство важно для справедливого общества." }
        ]
      },
      {
        title: "Технологии и будущее",
        emoji: "🤖",
        grammar: "Future forms, модальные глаголы вероятности",
        vocab: [
          ["device", "устройство"],
          ["network", "сеть"],
          ["data", "данные"],
          ["screen", "экран"],
          ["application", "приложение"],
          ["improve", "улучшать"],
          ["invent", "изобретать"],
          ["digital", "цифровой"],
          ["automatic", "автоматический"],
          ["connect", "подключать"]
        ],
        sentences: [
          { en: "Technology will change the way we learn.", ru: "Технологии изменят то, как мы учимся." },
          { en: "This device can connect to the network.", ru: "Это устройство может подключаться к сети." },
          { en: "Digital data is stored in the cloud.", ru: "Цифровые данные хранятся в облаке." },
          { en: "Scientists may invent new energy sources.", ru: "Учёные могут изобрести новые источники энергии." },
          { en: "The application has been improved.", ru: "Приложение было улучшено." },
          { en: "Automatic systems are used everywhere.", ru: "Автоматические системы используются повсюду." }
        ]
      },
      {
        title: "Искусство и кино",
        emoji: "🎬",
        grammar: "Passive voice, relative clauses",
        vocab: [
          ["art", "искусство"],
          ["music", "музыка"],
          ["painting", "картина"],
          ["novel", "роман"],
          ["film", "фильм"],
          ["actor", "актёр"],
          ["audience", "зрители"],
          ["create", "создавать"],
          ["talented", "талантливый"],
          ["exhibition", "выставка"]
        ],
        sentences: [
          { en: "The novel was written in 1920.", ru: "Роман был написан в 1920 году." },
          { en: "This painting is shown in the museum.", ru: "Эта картина выставлена в музее." },
          { en: "The film, which won an award, is very moving.", ru: "Фильм, получивший награду, очень трогательный." },
          { en: "A talented actor played the main role.", ru: "Талантливый актёр сыграл главную роль." },
          { en: "The audience applauded for ten minutes.", ru: "Зрители аплодировали десять минут." },
          { en: "An exhibition of modern art opens today.", ru: "Сегодня открывается выставка современного искусства." }
        ]
      }
    ]
  },
  {
    id: "c10",
    title: "10 класс",
    level: "B1+ · Продвинутый",
    desc: "Герундий и инфинитив, экономика, глобальные проблемы",
    goal: 70,
    units: [
      {
        title: "Карьера",
        emoji: "📈",
        grammar: "gerund / infinitive, First Conditional",
        vocab: [
          ["career", "карьера"],
          ["apply", "подавать заявку"],
          ["achieve", "достигать"],
          ["deadline", "срок сдачи"],
          ["teamwork", "командная работа"],
          ["decision", "решение"],
          ["ambitious", "амбициозный"],
          ["position", "должность"],
          ["patient", "терпеливый"],
          ["goal", "цель"]
        ],
        sentences: [
          { en: "She decided to apply for the job.", ru: "Она решила подать заявку на работу." },
          { en: "I enjoy working in a team.", ru: "Мне нравится работать в команде." },
          { en: "You need to meet the deadline.", ru: "Тебе нужно уложиться в срок." },
          { en: "If you want to achieve your goals, be patient.", ru: "Если хочешь достичь целей, будь терпеливым." },
          { en: "The position requires good communication skills.", ru: "Должность требует хороших навыков общения." },
          { en: "Making a decision is not always easy.", ru: "Принять решение не всегда легко." }
        ]
      },
      {
        title: "Экономика",
        emoji: "💰",
        grammar: "пассив, исчисляемые и неисчисляемые",
        vocab: [
          ["economy", "экономика"],
          ["income", "доход"],
          ["invest", "инвестировать"],
          ["market", "рынок"],
          ["debt", "долг"],
          ["profit", "прибыль"],
          ["expensive", "дорогой"],
          ["afford", "позволить себе"],
          ["budget", "бюджет"],
          ["value", "ценность"]
        ],
        sentences: [
          { en: "The market is controlled by big companies.", ru: "Рынок контролируется крупными компаниями." },
          { en: "I cannot afford such an expensive phone.", ru: "Я не могу позволить себе такой дорогой телефон." },
          { en: "Money should be invested wisely.", ru: "Деньги следует инвестировать разумно." },
          { en: "Profit is the difference between income and costs.", ru: "Прибыль — это разница между доходом и затратами." },
          { en: "Many families live on a small budget.", ru: "Многие семьи живут на небольшой бюджет." },
          { en: "Debt can become a serious problem.", ru: "Долг может стать серьёзной проблемой." }
        ]
      },
      {
        title: "Глобальные проблемы",
        emoji: "🌍",
        grammar: "Second Conditional, пассив",
        vocab: [
          ["climate", "климат"],
          ["pollution", "загрязнение"],
          ["resource", "ресурс"],
          ["reduce", "сокращать"],
          ["energy", "энергия"],
          ["recycle", "перерабатывать"],
          ["global", "глобальный"],
          ["solution", "решение"],
          ["affect", "влиять"],
          ["sustainable", "устойчивый"]
        ],
        sentences: [
          { en: "Pollution affects the global climate.", ru: "Загрязнение влияет на глобальный климат." },
          { en: "We must reduce energy use.", ru: "Мы должны сократить потребление энергии." },
          { en: "If we recycled more, there would be less waste.", ru: "Если бы мы больше перерабатывали, было бы меньше мусора." },
          { en: "Sustainable solutions are needed now.", ru: "Устойчивые решения нужны уже сейчас." },
          { en: "Natural resources are not unlimited.", ru: "Природные ресурсы не бесконечны." },
          { en: "This problem cannot be solved alone.", ru: "Эту проблему нельзя решить в одиночку." }
        ]
      },
      {
        title: "Наука и открытия",
        emoji: "🔬",
        grammar: "Passive, причастия",
        vocab: [
          ["research", "исследование"],
          ["experiment", "эксперимент"],
          ["discover", "открывать"],
          ["proof", "доказательство"],
          ["theory", "теория"],
          ["develop", "разрабатывать"],
          ["invention", "изобретение"],
          ["laboratory", "лаборатория"],
          ["result", "результат"],
          ["scientific", "научный"]
        ],
        sentences: [
          { en: "The experiment was carried out last week.", ru: "Эксперимент был проведён на прошлой неделе." },
          { en: "This theory has been proved by many studies.", ru: "Эта теория доказана многими исследованиями." },
          { en: "Scientists are developing a new vaccine.", ru: "Учёные разрабатывают новую вакцину." },
          { en: "The results of the research were surprising.", ru: "Результаты исследования были неожиданными." },
          { en: "A great invention can change the world.", ru: "Великое изобретение может изменить мир." },
          { en: "Scientific methods require careful work.", ru: "Научные методы требуют тщательной работы." }
        ]
      },
      {
        title: "СМИ и информация",
        emoji: "📰",
        grammar: "Reported speech, Passive",
        vocab: [
          ["media", "СМИ"],
          ["news", "новости"],
          ["article", "статья"],
          ["report", "репортаж"],
          ["source", "источник"],
          ["interview", "интервью"],
          ["broadcast", "трансляция"],
          ["publish", "публиковать"],
          ["reliable", "надёжный"],
          ["influence", "влияние"]
        ],
        sentences: [
          { en: "The article has been published online.", ru: "Статья была опубликована онлайн." },
          { en: "The journalist said that the news was true.", ru: "Журналист сказал, что новость правдива." },
          { en: "It is important to check your sources.", ru: "Важно проверять свои источники." },
          { en: "The interview was broadcast yesterday.", ru: "Интервью транслировали вчера." },
          { en: "Social media has a huge influence on us.", ru: "Соцсети оказывают на нас огромное влияние." },
          { en: "A reliable report must contain facts.", ru: "Надёжный репортаж должен содержать факты." }
        ]
      }
    ]
  },
  {
    id: "c11",
    title: "11 класс",
    level: "B2 · Экзаменационный",
    desc: "Conditionals 2/3, инверсия, лексика для экзамена",
    goal: 90,
    units: [
      {
        title: "Экзамены и цели",
        emoji: "🎯",
        grammar: "Third Conditional, инверсия, герундий",
        vocab: [
          ["confident", "уверенный"],
          ["crucial", "ключевой"],
          ["attempt", "попытка"],
          ["succeed", "добиться успеха"],
          ["stress", "стресс"],
          ["focus", "сосредоточиться"],
          ["outcome", "результат"],
          ["despite", "несмотря на"],
          ["patience", "терпение"],
          ["improve", "улучшать"]
        ],
        sentences: [
          { en: "If I had started earlier, I would have passed the exam.", ru: "Если бы я начал раньше, я бы сдал экзамен." },
          { en: "Had I known about the deadline, I would have applied.", ru: "Знай я о сроке, я бы подал заявку." },
          { en: "Success requires focus and patience.", ru: "Успех требует сосредоточенности и терпения." },
          { en: "She succeeded despite the stress.", ru: "Она добилась успеха, несмотря на стресс." },
          { en: "The outcome of an attempt is never certain.", ru: "Результат попытки никогда не гарантирован." },
          { en: "It is crucial to stay confident.", ru: "Крайне важно оставаться уверенным." }
        ]
      },
      {
        title: "Профессии будущего",
        emoji: "🛰️",
        grammar: "Future Perfect, пассив, герундий",
        vocab: [
          ["automation", "автоматизация"],
          ["remote", "удалённый"],
          ["flexible", "гибкий"],
          ["creativity", "креативность"],
          ["adapt", "адаптироваться"],
          ["demand", "спрос"],
          ["replace", "заменять"],
          ["industry", "отрасль"],
          ["lifelong", "пожизненный"],
          ["skill", "навык"]
        ],
        sentences: [
          { en: "Automation will have replaced many jobs by 2040.", ru: "К 2040 году автоматизация заменит многие профессии." },
          { en: "Remote work has become more flexible.", ru: "Удалённая работа стала более гибкой." },
          { en: "Workers must adapt to new demands.", ru: "Работникам нужно адаптироваться к новым требованиям." },
          { en: "Creativity cannot be replaced by machines.", ru: "Креативность нельзя заменить машинами." },
          { en: "The industry is growing fast.", ru: "Отрасль быстро растёт." },
          { en: "Lifelong learning is a modern necessity.", ru: "Пожизненное обучение — современная необходимость." }
        ]
      },
      {
        title: "Дебаты и мнение",
        emoji: "🗣️",
        grammar: "Linkers, косвенная речь, выражения мнения",
        vocab: [
          ["argue", "утверждать"],
          ["opinion", "мнение"],
          ["admit", "признавать"],
          ["persuasive", "убедительный"],
          ["however", "однако"],
          ["whereas", "тогда как"],
          ["suggest", "предлагать"],
          ["benefit", "польза"],
          ["convince", "убедить"],
          ["evidence", "доказательство"]
        ],
        sentences: [
          { en: "Some people argue that technology saves time, whereas others disagree.", ru: "Некоторые утверждают, что технологии экономят время, тогда как другие не согласны." },
          { en: "There is strong evidence for this opinion.", ru: "В пользу этого мнения есть веские доказательства." },
          { en: "He admitted that he had been wrong.", ru: "Он признал, что был неправ." },
          { en: "However, the results were not persuasive.", ru: "Однако результаты были неубедительными." },
          { en: "I suggest that we discuss the benefits first.", ru: "Я предлагаю сначала обсудить плюсы." },
          { en: "It is hard to convince people without evidence.", ru: "Трудно убедить людей без доказательств." }
        ]
      },
      {
        title: "Глобальные проблемы",
        emoji: "🌐",
        grammar: "Conditionals II–III, инверсия",
        vocab: [
          ["poverty", "бедность"],
          ["inequality", "неравенство"],
          ["conflict", "конфликт"],
          ["solution", "решение"],
          ["sustainable", "устойчивый"],
          ["global", "глобальный"],
          ["crisis", "кризис"],
          ["cooperation", "сотрудничество"],
          ["reduce", "сокращать"],
          ["aware", "осознающий"]
        ],
        sentences: [
          { en: "If countries cooperated, many crises could be prevented.", ru: "Если бы страны сотрудничали, многих кризисов можно было бы избежать." },
          { en: "Global warming is a threat to sustainable development.", ru: "Глобальное потепление угрожает устойчивому развитию." },
          { en: "Poverty and inequality must be reduced.", ru: "Бедность и неравенство должны быть сокращены." },
          { en: "Never has cooperation been so important.", ru: "Никогда сотрудничество не было таким важным." },
          { en: "The world is facing an economic crisis.", ru: "Мир сталкивается с экономическим кризисом." },
          { en: "People should be more aware of global problems.", ru: "Людям следует лучше осознавать глобальные проблемы." }
        ]
      },
      {
        title: "Цели и личный рост",
        emoji: "🎯",
        grammar: "Future Perfect, герундий и инфинитив",
        vocab: [
          ["goal", "цель"],
          ["motivation", "мотивация"],
          ["discipline", "дисциплина"],
          ["achieve", "достигать"],
          ["progress", "прогресс"],
          ["challenge", "вызов"],
          ["ambition", "амбиция"],
          ["effort", "усилие"],
          ["determination", "решимость"],
          ["overcome", "преодолевать"]
        ],
        sentences: [
          { en: "By next year I will have finished school.", ru: "К следующему году я закончу школу." },
          { en: "Achieving a goal requires discipline and determination.", ru: "Достижение цели требует дисциплины и решимости." },
          { en: "She has made great progress this term.", ru: "Она добилась большого прогресса в этой четверти." },
          { en: "Every challenge is a chance to grow.", ru: "Каждый вызов — шанс вырасти." },
          { en: "It is important to keep your motivation high.", ru: "Важно поддерживать высокую мотивацию." },
          { en: "He managed to overcome many difficulties.", ru: "Он смог преодолеть много трудностей." }
        ]
      }
    ]
  }
];

const LESSON_KINDS = [
  { kind: "words", title: "Новые слова", emoji: "📚" },
  { kind: "phrases", title: "Фразы", emoji: "💬" },
  { kind: "listen", title: "Аудирование", emoji: "🎧" },
  { kind: "review", title: "Проверка", emoji: "🏆" }
];

if (typeof window !== "undefined") {
  window.CURRICULUM = CURRICULUM;
  window.LESSON_KINDS = LESSON_KINDS;
}
