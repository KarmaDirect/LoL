export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  difficulty: number; // 1 = facile, 2 = moyen, 3 = difficile
  explanation: string;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  // DIFFICULTÉ 1 - FACILE
  {
    id: '1',
    question: 'Quel est le nom du royaume où vit Lux ?',
    choices: ['Demacia', 'Noxus', 'Freljord', 'Ionia'],
    correctAnswer: 'Demacia',
    difficulty: 1,
    explanation: 'Lux est une mage de Demacia, un royaume qui interdit la magie.',
    category: 'Géographie'
  },
  {
    id: '2',
    question: 'Quel est le nom de la région glacée du nord ?',
    choices: ['Freljord', 'Demacia', 'Noxus', 'Shurima'],
    correctAnswer: 'Freljord',
    difficulty: 1,
    explanation: 'Le Freljord est la région glacée du nord de Runeterra.',
    category: 'Géographie'
  },
  {
    id: '3',
    question: 'Quel est le nom de la capitale de Noxus ?',
    choices: ['Grand Noxus', 'Noxus Prime', 'Noxus Central', 'La Grande Noxus'],
    correctAnswer: 'Grand Noxus',
    difficulty: 1,
    explanation: 'Grand Noxus est la capitale de l\'empire expansionniste de Noxus.',
    category: 'Géographie'
  },
  {
    id: '4',
    question: 'Quel est le nom de la région où vivent les Yordles ?',
    choices: ['Bandle City', 'Yordle Land', 'Petite Ville', 'Yordle City'],
    correctAnswer: 'Bandle City',
    difficulty: 1,
    explanation: 'Bandle City est la capitale mystérieuse des Yordles.',
    category: 'Géographie'
  },
  {
    id: '5',
    question: 'Quel est le nom du frère de Lux ?',
    choices: ['Garen', 'Jarvan IV', 'Sylas', 'Fiora'],
    correctAnswer: 'Garen',
    difficulty: 1,
    explanation: 'Garen Crownguard est le frère aîné de Lux.',
    category: 'Relations'
  },
  {
    id: '6',
    question: 'Quel est le nom de la mère d\'Ashe ?',
    choices: ['Grena', 'Lissandra', 'Sejuani', 'Anivia'],
    correctAnswer: 'Grena',
    difficulty: 1,
    explanation: 'Grena était la mère d\'Ashe et la reine de la tribu Avarosa.',
    category: 'Relations'
  },
  {
    id: '7',
    question: 'Quel est le nom de la région de Shurima ?',
    choices: ['Grand Shurima', 'Shurima Prime', 'Shurima Central', 'La Grande Shurima'],
    correctAnswer: 'Grand Shurima',
    difficulty: 1,
    explanation: 'Grand Shurima était la capitale de l\'ancien empire de Shurima.',
    category: 'Géographie'
  },
  {
    id: '8',
    question: 'Quel est le nom de la région de Piltover ?',
    choices: ['Piltover', 'Zaun', 'Bilgewater', 'Ionia'],
    correctAnswer: 'Piltover',
    difficulty: 1,
    explanation: 'Piltover est la ville du progrès et de l\'innovation.',
    category: 'Géographie'
  },
  {
    id: '9',
    question: 'Quel est le nom de la région de Zaun ?',
    choices: ['Zaun', 'Piltover', 'Bilgewater', 'Ionia'],
    correctAnswer: 'Zaun',
    difficulty: 1,
    explanation: 'Zaun est la ville souterraine sous Piltover.',
    category: 'Géographie'
  },
  {
    id: '10',
    question: 'Quel est le nom de la région de Bilgewater ?',
    choices: ['Bilgewater', 'Piltover', 'Zaun', 'Ionia'],
    correctAnswer: 'Bilgewater',
    difficulty: 1,
    explanation: 'Bilgewater est la ville portuaire des pirates.',
    category: 'Géographie'
  },

  // DIFFICULTÉ 2 - MOYEN
  {
    id: '11',
    question: 'Quel est le vrai nom de Swain ?',
    choices: ['Jericho Swain', 'Kezion Swain', 'Roth Swain', 'Silas Swain'],
    correctAnswer: 'Jericho Swain',
    difficulty: 2,
    explanation: 'Jericho Swain est le vrai nom du Grand Général de Noxus.',
    category: 'Personnages'
  },
  {
    id: '12',
    question: 'Quel est le nom de l\'épée de Garen ?',
    choices: ['Justice', 'Honor', 'Courage', 'Valor'],
    correctAnswer: 'Justice',
    difficulty: 2,
    explanation: 'Justice est le nom de l\'épée de Garen Crownguard.',
    category: 'Objets'
  },
  {
    id: '13',
    question: 'Quel est le nom de la tribu d\'Ashe ?',
    choices: ['Avarosa', 'Winter\'s Claw', 'Frostguard', 'Iceborn'],
    correctAnswer: 'Avarosa',
    difficulty: 2,
    explanation: 'Ashe est la reine de la tribu Avarosa.',
    category: 'Organisations'
  },
  {
    id: '14',
    question: 'Quel est le nom de l\'ordre des Kinkou ?',
    choices: ['Kinkou', 'Shadow Order', 'Ninja Clan', 'Stealth Brotherhood'],
    correctAnswer: 'Kinkou',
    difficulty: 2,
    explanation: 'Les Kinkou maintiennent l\'équilibre entre le monde matériel et spirituel.',
    category: 'Organisations'
  },
  {
    id: '15',
    question: 'Quel est le nom de la capitale de Demacia ?',
    choices: ['Grande Demacia', 'Demacia City', 'La Grande Demacia', 'Demacia Prime'],
    correctAnswer: 'Grande Demacia',
    difficulty: 2,
    explanation: 'Grande Demacia est la capitale du royaume de Demacia.',
    category: 'Géographie'
  },
  {
    id: '16',
    question: 'Quel est le nom de la région de Targon ?',
    choices: ['Mont Targon', 'Targon Peak', 'Targon Mountain', 'Mount Targon'],
    correctAnswer: 'Mont Targon',
    difficulty: 2,
    explanation: 'Le Mont Targon est la montagne sacrée où vivent les Aspects.',
    category: 'Géographie'
  },
  {
    id: '17',
    question: 'Quel est le nom de la région de Ixtal ?',
    choices: ['Ixtal', 'Kumungu', 'Jungle Realm', 'Wild Lands'],
    correctAnswer: 'Ixtal',
    difficulty: 2,
    explanation: 'Ixtal est la région de la jungle mystérieuse.',
    category: 'Géographie'
  },
  {
    id: '18',
    question: 'Quel est le nom de la région de Shurima ?',
    choices: ['Shurima', 'Desert Empire', 'Sand Kingdom', 'Ancient Land'],
    correctAnswer: 'Shurima',
    difficulty: 2,
    explanation: 'Shurima est l\'ancien empire du désert.',
    category: 'Géographie'
  },
  {
    id: '19',
    question: 'Quel est le nom de la région de Ionia ?',
    choices: ['Ionia', 'Spirit Realm', 'Mystic Land', 'Enchanted Isles'],
    correctAnswer: 'Ionia',
    difficulty: 2,
    explanation: 'Ionia est la terre de la magie et de l\'équilibre.',
    category: 'Géographie'
  },
  {
    id: '20',
    question: 'Quel est le nom de la région de Bilgewater ?',
    choices: ['Bilgewater', 'Pirate City', 'Port Town', 'Harbor City'],
    correctAnswer: 'Bilgewater',
    difficulty: 2,
    explanation: 'Bilgewater est la ville portuaire des pirates et des marchands.',
    category: 'Géographie'
  },

  // DIFFICULTÉ 3 - DIFFICILE
  {
    id: '21',
    question: 'Quel est le nom de l\'ancien roi de Demacia assassiné par Sylas ?',
    choices: ['Jarvan III', 'Jarvan II', 'Jarvan IV', 'Jarvan I'],
    correctAnswer: 'Jarvan III',
    difficulty: 3,
    explanation: 'Jarvan III était le père de Jarvan IV et a été assassiné par Sylas.',
    category: 'Histoire'
  },
  {
    id: '22',
    question: 'Quel est le nom de la première Aspect de la Guerre ?',
    choices: ['Aatrox', 'Pantheon', 'Leona', 'Diana'],
    correctAnswer: 'Aatrox',
    difficulty: 3,
    explanation: 'Aatrox était le premier Aspect de la Guerre avant de devenir un Darkin.',
    category: 'Histoire'
  },
  {
    id: '23',
    question: 'Quel est le nom de l\'ancienne capitale de Shurima ?',
    choices: ['Grand Shurima', 'Shurima Prime', 'Ancient Shurima', 'Old Shurima'],
    correctAnswer: 'Grand Shurima',
    difficulty: 3,
    explanation: 'Grand Shurima était la capitale de l\'ancien empire avant sa chute.',
    category: 'Histoire'
  },
  {
    id: '24',
    question: 'Quel est le nom de la première tribu du Freljord ?',
    choices: ['Avarosa', 'Winter\'s Claw', 'Frostguard', 'Iceborn'],
    correctAnswer: 'Avarosa',
    difficulty: 3,
    explanation: 'Avarosa était la première tribu du Freljord, fondée par la reine Avarosa.',
    category: 'Histoire'
  },
  {
    id: '25',
    question: 'Quel est le nom de l\'ancien Aspect du Soleil ?',
    choices: ['Leona', 'Diana', 'Aurelion Sol', 'Taric'],
    correctAnswer: 'Leona',
    difficulty: 3,
    explanation: 'Leona est l\'Aspect du Soleil, protectrice du Mont Targon.',
    category: 'Personnages'
  },
  {
    id: '26',
    question: 'Quel est le nom de l\'ancien Aspect de la Lune ?',
    choices: ['Diana', 'Leona', 'Aphelios', 'Soraka'],
    correctAnswer: 'Diana',
    difficulty: 3,
    explanation: 'Diana est l\'Aspect de la Lune, opposée à Leona.',
    category: 'Personnages'
  },
  {
    id: '27',
    question: 'Quel est le nom de l\'ancien roi de Noxus avant Swain ?',
    choices: ['Boram Darkwill', 'Jericho Swain', 'Darius', 'Katarina'],
    correctAnswer: 'Boram Darkwill',
    difficulty: 3,
    explanation: 'Boram Darkwill était le roi de Noxus avant que Swain ne prenne le pouvoir.',
    category: 'Histoire'
  },
  {
    id: '28',
    question: 'Quel est le nom de l\'ancienne capitale de l\'empire Icathia ?',
    choices: ['Icathia', 'Void Gate', 'Ancient City', 'Lost Capital'],
    correctAnswer: 'Icathia',
    difficulty: 3,
    explanation: 'Icathia était l\'ancienne capitale avant l\'ouverture du Void.',
    category: 'Histoire'
  },
  {
    id: '29',
    question: 'Quel est le nom de l\'ancien Aspect de la Protection ?',
    choices: ['Taric', 'Leona', 'Diana', 'Aurelion Sol'],
    correctAnswer: 'Taric',
    difficulty: 3,
    explanation: 'Taric est l\'Aspect de la Protection, gardien du Mont Targon.',
    category: 'Personnages'
  },
  {
    id: '30',
    question: 'Quel est le nom de l\'ancien Aspect de la Justice ?',
    choices: ['Kayle', 'Morgana', 'Leona', 'Diana'],
    correctAnswer: 'Kayle',
    difficulty: 3,
    explanation: 'Kayle est l\'Aspect de la Justice, opposée à sa sœur Morgana.',
    category: 'Personnages'
  },

  // QUESTIONS SUPPLÉMENTAIRES - DIFFICULTÉ 1
  {
    id: '31',
    question: 'Quel est le nom de la région de Shadow Isles ?',
    choices: ['Shadow Isles', 'Cursed Isles', 'Dark Islands', 'Haunted Isles'],
    correctAnswer: 'Shadow Isles',
    difficulty: 1,
    explanation: 'Les Shadow Isles sont les îles maudites où règne la mort.',
    category: 'Géographie'
  },
  {
    id: '32',
    question: 'Quel est le nom de la région de Bandle City ?',
    choices: ['Bandle City', 'Yordle City', 'Little City', 'Magic City'],
    correctAnswer: 'Bandle City',
    difficulty: 1,
    explanation: 'Bandle City est la capitale mystérieuse des Yordles.',
    category: 'Géographie'
  },
  {
    id: '33',
    question: 'Quel est le nom de la région de Runeterra ?',
    choices: ['Runeterra', 'The World', 'The Land', 'The Realm'],
    correctAnswer: 'Runeterra',
    difficulty: 1,
    explanation: 'Runeterra est le nom du monde où se déroule l\'histoire de LoL.',
    category: 'Géographie'
  },
  {
    id: '34',
    question: 'Quel est le nom de la région de Valoran ?',
    choices: ['Valoran', 'The Continent', 'The Land', 'The Realm'],
    correctAnswer: 'Valoran',
    difficulty: 1,
    explanation: 'Valoran est le continent principal de Runeterra.',
    category: 'Géographie'
  },
  {
    id: '35',
    question: 'Quel est le nom de la région de Shurima ?',
    choices: ['Shurima', 'Desert Land', 'Sand Empire', 'Ancient Land'],
    correctAnswer: 'Shurima',
    difficulty: 1,
    explanation: 'Shurima est l\'ancien empire du désert.',
    category: 'Géographie'
  },

  // QUESTIONS SUPPLÉMENTAIRES - DIFFICULTÉ 2
  {
    id: '36',
    question: 'Quel est le nom de l\'épée de Yasuo ?',
    choices: ['Windblade', 'Stormbringer', 'Tempest', 'Hurricane'],
    correctAnswer: 'Windblade',
    difficulty: 2,
    explanation: 'Windblade est le nom de l\'épée de Yasuo.',
    category: 'Objets'
  },
  {
    id: '37',
    question: 'Quel est le nom de l\'arc d\'Ashe ?',
    choices: ['Crystal Bow', 'Ice Bow', 'Frost Bow', 'Crystal Arrow'],
    correctAnswer: 'Crystal Bow',
    difficulty: 2,
    explanation: 'Crystal Bow est le nom de l\'arc d\'Ashe.',
    category: 'Objets'
  },
  {
    id: '38',
    question: 'Quel est le nom de la lance de Jarvan IV ?',
    choices: ['Dragon Lance', 'Royal Lance', 'Imperial Lance', 'Crown Lance'],
    correctAnswer: 'Dragon Lance',
    difficulty: 2,
    explanation: 'Dragon Lance est le nom de la lance de Jarvan IV.',
    category: 'Objets'
  },
  {
    id: '39',
    question: 'Quel est le nom de l\'épée de Fiora ?',
    choices: ['Rapier', 'Fencing Sword', 'Dueling Blade', 'Noble Sword'],
    correctAnswer: 'Rapier',
    difficulty: 2,
    explanation: 'Rapier est le nom de l\'épée de Fiora.',
    category: 'Objets'
  },
  {
    id: '40',
    question: 'Quel est le nom de l\'arc de Varus ?',
    choices: ['Darkin Bow', 'Corrupted Bow', 'Void Bow', 'Shadow Bow'],
    correctAnswer: 'Darkin Bow',
    difficulty: 2,
    explanation: 'Darkin Bow est le nom de l\'arc de Varus.',
    category: 'Objets'
  },

  // QUESTIONS SUPPLÉMENTAIRES - DIFFICULTÉ 3
  {
    id: '41',
    question: 'Quel est le nom de l\'ancien Aspect de la Guerre avant Aatrox ?',
    choices: ['Atreus', 'Pantheon', 'Aatrox', 'Leona'],
    correctAnswer: 'Atreus',
    difficulty: 3,
    explanation: 'Atreus était l\'Aspect de la Guerre avant Aatrox.',
    category: 'Histoire'
  },
  {
    id: '42',
    question: 'Quel est le nom de l\'ancien roi de Demacia avant Jarvan III ?',
    choices: ['Jarvan II', 'Jarvan I', 'Jarvan IV', 'Garen'],
    correctAnswer: 'Jarvan II',
    difficulty: 3,
    explanation: 'Jarvan II était le père de Jarvan III.',
    category: 'Histoire'
  },
  {
    id: '43',
    question: 'Quel est le nom de l\'ancien Aspect de la Lune avant Diana ?',
    choices: ['Aphelios', 'Soraka', 'Diana', 'Leona'],
    correctAnswer: 'Aphelios',
    difficulty: 3,
    explanation: 'Aphelios était l\'Aspect de la Lune avant Diana.',
    category: 'Histoire'
  },
  {
    id: '44',
    question: 'Quel est le nom de l\'ancien Aspect du Soleil avant Leona ?',
    choices: ['Aurelion Sol', 'Taric', 'Leona', 'Diana'],
    correctAnswer: 'Aurelion Sol',
    difficulty: 3,
    explanation: 'Aurelion Sol était l\'Aspect du Soleil avant Leona.',
    category: 'Histoire'
  },
  {
    id: '45',
    question: 'Quel est le nom de l\'ancien Aspect de la Protection avant Taric ?',
    choices: ['Leona', 'Diana', 'Taric', 'Aurelion Sol'],
    correctAnswer: 'Leona',
    difficulty: 3,
    explanation: 'Leona était l\'Aspect de la Protection avant Taric.',
    category: 'Histoire'
  }
];

// Fonction pour obtenir des questions aléatoires
export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fonction pour obtenir des questions par difficulté
export const getQuestionsByDifficulty = (difficulty: number, count: number = 5): QuizQuestion[] => {
  const filtered = quizQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fonction pour obtenir des questions mixtes
export const getMixedQuestions = (count: number = 10): QuizQuestion[] => {
  const easy = getQuestionsByDifficulty(1, Math.ceil(count * 0.4));
  const medium = getQuestionsByDifficulty(2, Math.ceil(count * 0.4));
  const hard = getQuestionsByDifficulty(3, Math.ceil(count * 0.2));
  
  return [...easy, ...medium, ...hard].sort(() => 0.5 - Math.random()).slice(0, count);
}; 