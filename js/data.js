// ===== STUDY WITH ALBERT EINSTEIN — DATA LAYER =====
// All data is stored in localStorage so it persists between sessions.

const DB_KEY = 'swae_db';

const DEFAULT_CATEGORIES = [
  { id: 'arts-culture',   name: 'Arts & Culture Quiz',  icon: '🎨' },
  { id: 'assam-gk',       name: 'Assam GK Quiz',         icon: '🌿' },
  { id: 'assam-history',  name: 'Assam History Quiz',    icon: '🏛️' },
  { id: 'computer-gk',    name: 'Computer GK Quiz',      icon: '💻' },
  { id: 'geography',      name: 'Geography Quiz',        icon: '🌍' },
  { id: 'india-gk',       name: 'India GK',              icon: '🇮🇳' },
  { id: 'indian-history', name: 'Indian History',        icon: '📜' },
  { id: 'polity',         name: 'Polity',                icon: '⚖️' },
  { id: 'science',        name: 'Science',               icon: '🔬' },
  { id: 'sports',         name: 'Sports',                icon: '🏆' },
  { id: 'technology',     name: 'Technology',            icon: '🚀' },
  { id: 'world-gk',       name: 'World GK',              icon: '🌐' },
  { id: 'previous-paper', name: 'Previous Paper',        icon: '📄' },
];

const DEFAULT_SETS = {
  'arts-culture':   ['Set 1','Set 2','Set 3'],
  'assam-gk':       ['Set 1','Set 2','Set 3'],
  'assam-history':  ['Set 1','Set 2'],
  'computer-gk':    ['Set 1','Set 2','Set 3'],
  'geography':      ['Set 1','Set 2','Set 3'],
  'india-gk':       ['Set 1','Set 2','Set 3','Set 4'],
  'indian-history': ['Set 1','Set 2','Set 3'],
  'polity':         ['Set 1','Set 2'],
  'science':        ['Set 1','Set 2','Set 3'],
  'sports':         ['Set 1','Set 2'],
  'technology':     ['Set 1','Set 2'],
  'world-gk':       ['Set 1','Set 2','Set 3'],
  'previous-paper': ['2022 Paper','2023 Paper','2024 Paper'],
};

const SAMPLE_QUESTIONS = [
  // Arts & Culture – Set 1
  { id:'q001', category:'arts-culture', set:'Set 1', question:'Which instrument is known as the "King of Instruments"?', options:{A:'Violin',B:'Piano',C:'Organ',D:'Guitar'}, correct:'C', explanation:'The pipe organ is called the King of Instruments due to its size and range.' },
  { id:'q002', category:'arts-culture', set:'Set 1', question:'Who painted the Mona Lisa?', options:{A:'Michelangelo',B:'Raphael',C:'Leonardo da Vinci',D:'Donatello'}, correct:'C', explanation:'Leonardo da Vinci painted the Mona Lisa around 1503–1519.' },
  { id:'q003', category:'arts-culture', set:'Set 1', question:'Which dance form originated in Kerala?', options:{A:'Bharatanatyam',B:'Kathak',C:'Kathakali',D:'Odissi'}, correct:'C', explanation:'Kathakali is a classical dance form originating in Kerala.' },
  { id:'q004', category:'arts-culture', set:'Set 1', question:'The book "Gitanjali" was written by?', options:{A:'Premchand',B:'Rabindranath Tagore',C:'Bankim Chandra',D:'Sarat Chandra'}, correct:'B', explanation:'Gitanjali (Song Offerings) was written by Rabindranath Tagore.' },
  { id:'q005', category:'arts-culture', set:'Set 1', question:'Which UNESCO Heritage Site is the largest brick monument in the world?', options:{A:'Angkor Wat',B:'Taj Mahal',C:'Great Wall',D:'Bagan Temples'}, correct:'A', explanation:'Angkor Wat is the largest religious monument in the world.' },

  // Assam GK – Set 1
  { id:'q006', category:'assam-gk', set:'Set 1', question:'What is the capital of Assam?', options:{A:'Jorhat',B:'Dibrugarh',C:'Guwahati',D:'Dispur'}, correct:'D', explanation:'Dispur is the capital of Assam.' },
  { id:'q007', category:'assam-gk', set:'Set 1', question:'Which river is known as the "Sorrow of Assam"?', options:{A:'Brahmaputra',B:'Barak',C:'Subansiri',D:'Kopili'}, correct:'A', explanation:'The Brahmaputra is called the Sorrow of Assam due to its annual floods.' },
  { id:'q008', category:'assam-gk', set:'Set 1', question:'Kaziranga National Park is famous for?', options:{A:'Tigers',B:'Elephants',C:'One-horned Rhinoceros',D:'Snow Leopards'}, correct:'C', explanation:'Kaziranga is home to 2/3 of the world\'s one-horned rhinoceroses.' },
  { id:'q009', category:'assam-gk', set:'Set 1', question:'The famous Bihu festival of Assam is celebrated in which season?', options:{A:'Winter',B:'Monsoon',C:'Spring',D:'Autumn'}, correct:'C', explanation:'Rongali Bihu is celebrated in spring (April) to mark the Assamese New Year.' },
  { id:'q010', category:'assam-gk', set:'Set 1', question:'Which state shares its longest border with Assam?', options:{A:'Nagaland',B:'Meghalaya',C:'Arunachal Pradesh',D:'Mizoram'}, correct:'C', explanation:'Arunachal Pradesh shares the longest border with Assam.' },

  // Computer GK – Set 1
  { id:'q011', category:'computer-gk', set:'Set 1', question:'What does CPU stand for?', options:{A:'Central Processing Unit',B:'Computer Personal Unit',C:'Core Processing Utility',D:'Central Program Unit'}, correct:'A', explanation:'CPU stands for Central Processing Unit.' },
  { id:'q012', category:'computer-gk', set:'Set 1', question:'Which of the following is NOT an operating system?', options:{A:'Windows',B:'Linux',C:'Oracle',D:'macOS'}, correct:'C', explanation:'Oracle is a database management system, not an OS.' },
  { id:'q013', category:'computer-gk', set:'Set 1', question:'What does HTTP stand for?', options:{A:'HyperText Transfer Protocol',B:'High Transfer Text Protocol',C:'Hyper Transfer Technology Protocol',D:'HyperText Technology Program'}, correct:'A', explanation:'HTTP stands for HyperText Transfer Protocol.' },
  { id:'q014', category:'computer-gk', set:'Set 1', question:'The first computer mouse was invented by?', options:{A:'Bill Gates',B:'Steve Jobs',C:'Douglas Engelbart',D:'Alan Turing'}, correct:'C', explanation:'Douglas Engelbart invented the first mouse in 1964.' },
  { id:'q015', category:'computer-gk', set:'Set 1', question:'Which memory is directly accessible by the CPU?', options:{A:'Hard Disk',B:'RAM',C:'ROM',D:'Flash Drive'}, correct:'B', explanation:'RAM (Random Access Memory) is directly accessible by the CPU.' },

  // India GK – Set 1
  { id:'q016', category:'india-gk', set:'Set 1', question:'Who is the constitutional head of India?', options:{A:'Prime Minister',B:'Chief Justice',C:'President',D:'Speaker'}, correct:'C', explanation:'The President is the constitutional head of India.' },
  { id:'q017', category:'india-gk', set:'Set 1', question:'Which is the longest river in India?', options:{A:'Yamuna',B:'Ganga',C:'Godavari',D:'Indus'}, correct:'B', explanation:'The Ganga is the longest river in India at about 2,525 km.' },
  { id:'q018', category:'india-gk', set:'Set 1', question:'India\'s first satellite was named?', options:{A:'Rohini',B:'Aryabhata',C:'INSAT-1',D:'Chandrayaan'}, correct:'B', explanation:'Aryabhata was India\'s first satellite, launched in 1975.' },
  { id:'q019', category:'india-gk', set:'Set 1', question:'National Voters Day of India is on?', options:{A:'January 25',B:'February 28',C:'March 12',D:'November 26'}, correct:'A', explanation:'National Voters Day is celebrated on January 25.' },
  { id:'q020', category:'india-gk', set:'Set 1', question:'Which state has the highest number of districts in India?', options:{A:'Maharashtra',B:'Rajasthan',C:'Uttar Pradesh',D:'Madhya Pradesh'}, correct:'C', explanation:'Uttar Pradesh has the highest number of districts (75).' },

  // Science – Set 1
  { id:'q021', category:'science', set:'Set 1', question:'What is the chemical symbol for Gold?', options:{A:'Ag',B:'Au',C:'Fe',D:'Cu'}, correct:'B', explanation:'Gold\'s chemical symbol is Au from the Latin word "Aurum".' },
  { id:'q022', category:'science', set:'Set 1', question:'Which planet is known as the Red Planet?', options:{A:'Venus',B:'Jupiter',C:'Mars',D:'Saturn'}, correct:'C', explanation:'Mars is called the Red Planet due to iron oxide on its surface.' },
  { id:'q023', category:'science', set:'Set 1', question:'The speed of light is approximately?', options:{A:'3×10⁸ m/s',B:'3×10⁶ m/s',C:'3×10¹⁰ m/s',D:'3×10⁴ m/s'}, correct:'A', explanation:'The speed of light in vacuum is approximately 3×10⁸ m/s.' },
  { id:'q024', category:'science', set:'Set 1', question:'DNA stands for?', options:{A:'DeoxyriboNucleic Acid',B:'DiNucleo Acid',C:'Double Nucleic Acid',D:'Dextro Natural Acid'}, correct:'A', explanation:'DNA stands for Deoxyribonucleic Acid.' },
  { id:'q025', category:'science', set:'Set 1', question:'Which element is essential for blood clotting?', options:{A:'Iron',B:'Calcium',C:'Sodium',D:'Magnesium'}, correct:'B', explanation:'Calcium is essential for the blood clotting process.' },

  // Geography – Set 1
  { id:'q026', category:'geography', set:'Set 1', question:'Which is the largest ocean in the world?', options:{A:'Atlantic',B:'Indian',C:'Pacific',D:'Arctic'}, correct:'C', explanation:'The Pacific Ocean is the largest ocean covering more than 30% of Earth\'s surface.' },
  { id:'q027', category:'geography', set:'Set 1', question:'Mount Everest is located in?', options:{A:'India',B:'Tibet',C:'Nepal',D:'Bhutan'}, correct:'C', explanation:'Mount Everest is located in Nepal in the Himalayas.' },
  { id:'q028', category:'geography', set:'Set 1', question:'The Sahara Desert is located in which continent?', options:{A:'Asia',B:'South America',C:'Australia',D:'Africa'}, correct:'D', explanation:'The Sahara Desert is located in North Africa.' },
  { id:'q029', category:'geography', set:'Set 1', question:'Which country is known as the Land of the Rising Sun?', options:{A:'China',B:'South Korea',C:'Japan',D:'Thailand'}, correct:'C', explanation:'Japan is called the Land of the Rising Sun.' },
  { id:'q030', category:'geography', set:'Set 1', question:'The Amazon River flows through which country?', options:{A:'Argentina',B:'Colombia',C:'Brazil',D:'Peru'}, correct:'C', explanation:'Most of the Amazon River flows through Brazil.' },

  // Polity – Set 1
  { id:'q031', category:'polity', set:'Set 1', question:'The Constitution of India came into effect on?', options:{A:'15 August 1947',B:'26 January 1950',C:'26 November 1949',D:'2 October 1950'}, correct:'B', explanation:'The Indian Constitution came into force on 26 January 1950.' },
  { id:'q032', category:'polity', set:'Set 1', question:'How many Fundamental Rights are guaranteed by the Indian Constitution?', options:{A:'5',B:'6',C:'7',D:'9'}, correct:'B', explanation:'There are 6 Fundamental Rights enshrined in the Indian Constitution.' },
  { id:'q033', category:'polity', set:'Set 1', question:'Which article of the Constitution deals with the Right to Equality?', options:{A:'Article 14',B:'Article 19',C:'Article 21',D:'Article 32'}, correct:'A', explanation:'Article 14 guarantees the Right to Equality before law.' },
  { id:'q034', category:'polity', set:'Set 1', question:'The Preamble of India begins with?', options:{A:'"We the People"',B:'"We the Citizens"',C:'"We the Nation"',D:'"We the Indians"'}, correct:'A', explanation:'The Preamble of India starts with "We, the People of India..."' },
  { id:'q035', category:'polity', set:'Set 1', question:'Who is called the "Father of the Indian Constitution"?', options:{A:'Jawaharlal Nehru',B:'Sardar Patel',C:'Dr. B.R. Ambedkar',D:'Mahatma Gandhi'}, correct:'C', explanation:'Dr. B.R. Ambedkar is called the Father of the Indian Constitution.' },

  // Sports – Set 1
  { id:'q036', category:'sports', set:'Set 1', question:'Which country has won the most FIFA World Cups?', options:{A:'Germany',B:'Argentina',C:'Italy',D:'Brazil'}, correct:'D', explanation:'Brazil has won the FIFA World Cup 5 times, more than any other country.' },
  { id:'q037', category:'sports', set:'Set 1', question:'Sachin Tendulkar scored his 100th international century against?', options:{A:'Australia',B:'Pakistan',C:'Bangladesh',D:'Sri Lanka'}, correct:'C', explanation:'Sachin scored his 100th century against Bangladesh in March 2012.' },
  { id:'q038', category:'sports', set:'Set 1', question:'The Olympic Games are held every?', options:{A:'2 years',B:'3 years',C:'4 years',D:'5 years'}, correct:'C', explanation:'The Summer Olympic Games are held every 4 years.' },
  { id:'q039', category:'sports', set:'Set 1', question:'Which country hosted the 2020 Summer Olympics?', options:{A:'China',B:'USA',C:'Japan',D:'UK'}, correct:'C', explanation:'The 2020 Summer Olympics were held in Tokyo, Japan in 2021.' },
  { id:'q040', category:'sports', set:'Set 1', question:'In cricket, how many balls are there in one over?', options:{A:'4',B:'5',C:'6',D:'8'}, correct:'C', explanation:'An over in cricket consists of 6 balls bowled by the same bowler.' },

  // Indian History – Set 1
  { id:'q041', category:'indian-history', set:'Set 1', question:'The Battle of Plassey was fought in?', options:{A:'1757',B:'1764',C:'1799',D:'1857'}, correct:'A', explanation:'The Battle of Plassey was fought on June 23, 1757.' },
  { id:'q042', category:'indian-history', set:'Set 1', question:'Who founded the Mughal Empire in India?', options:{A:'Akbar',B:'Babur',C:'Humayun',D:'Shah Jahan'}, correct:'B', explanation:'Babur founded the Mughal Empire after the Battle of Panipat in 1526.' },
  { id:'q043', category:'indian-history', set:'Set 1', question:'The Quit India Movement was launched in?', options:{A:'1920',B:'1930',C:'1942',D:'1946'}, correct:'C', explanation:'The Quit India Movement was launched by Mahatma Gandhi on August 8, 1942.' },
  { id:'q044', category:'indian-history', set:'Set 1', question:'Who was the last Viceroy of India?', options:{A:'Lord Mountbatten',B:'Lord Wavell',C:'Lord Linlithgow',D:'Lord Irwin'}, correct:'A', explanation:'Lord Mountbatten was the last Viceroy of India (1947).' },
  { id:'q045', category:'indian-history', set:'Set 1', question:'The Jallianwala Bagh massacre occurred in?', options:{A:'1915',B:'1917',C:'1919',D:'1921'}, correct:'C', explanation:'The Jallianwala Bagh massacre took place on April 13, 1919 in Amritsar.' },

  // Technology – Set 1
  { id:'q046', category:'technology', set:'Set 1', question:'Who is the co-founder of Apple Inc.?', options:{A:'Bill Gates',B:'Steve Jobs',C:'Elon Musk',D:'Jeff Bezos'}, correct:'B', explanation:'Steve Jobs co-founded Apple Inc. with Steve Wozniak and Ronald Wayne.' },
  { id:'q047', category:'technology', set:'Set 1', question:'WWW stands for?', options:{A:'World Wide Web',B:'World Web Wireless',C:'Wide Web World',D:'Web World Wireless'}, correct:'A', explanation:'WWW stands for World Wide Web.' },
  { id:'q048', category:'technology', set:'Set 1', question:'Which company developed the Android operating system?', options:{A:'Apple',B:'Microsoft',C:'Google',D:'Samsung'}, correct:'C', explanation:'Android was developed by Google (originally by Android Inc., acquired by Google).' },
  { id:'q049', category:'technology', set:'Set 1', question:'What does AI stand for?', options:{A:'Automated Interface',B:'Artificial Intelligence',C:'Advanced Internet',D:'Automated Information'}, correct:'B', explanation:'AI stands for Artificial Intelligence.' },
  { id:'q050', category:'technology', set:'Set 1', question:'Which programming language is known as the "language of the web"?', options:{A:'Python',B:'Java',C:'JavaScript',D:'C++'}, correct:'C', explanation:'JavaScript is widely considered the language of the web.' },

  // World GK – Set 1
  { id:'q051', category:'world-gk', set:'Set 1', question:'The United Nations was established in?', options:{A:'1942',B:'1945',C:'1948',D:'1950'}, correct:'B', explanation:'The United Nations was established on October 24, 1945.' },
  { id:'q052', category:'world-gk', set:'Set 1', question:'Which country has the largest land area in the world?', options:{A:'Canada',B:'China',C:'USA',D:'Russia'}, correct:'D', explanation:'Russia is the largest country by land area at about 17.1 million sq km.' },
  { id:'q053', category:'world-gk', set:'Set 1', question:'The currency of Japan is?', options:{A:'Yuan',B:'Won',C:'Yen',D:'Ringgit'}, correct:'C', explanation:'The currency of Japan is the Japanese Yen (¥).' },
  { id:'q054', category:'world-gk', set:'Set 1', question:'Which country is known as the "Land of the Midnight Sun"?', options:{A:'Iceland',B:'Finland',C:'Norway',D:'Sweden'}, correct:'C', explanation:'Norway is called the Land of the Midnight Sun.' },
  { id:'q055', category:'world-gk', set:'Set 1', question:'The headquarters of UNESCO is located in?', options:{A:'New York',B:'Geneva',C:'Paris',D:'Vienna'}, correct:'C', explanation:'UNESCO headquarters is in Paris, France.' },

  // Assam History – Set 1
  { id:'q056', category:'assam-history', set:'Set 1', question:'The Ahom Kingdom in Assam was founded by?', options:{A:'Sukaphaa',B:'Rudra Singha',C:'Lachit Borphukan',D:'Chilarai'}, correct:'A', explanation:'Sukaphaa founded the Ahom Kingdom in 1228 CE.' },
  { id:'q057', category:'assam-history', set:'Set 1', question:'The Battle of Saraighat (1671) was a victory for?', options:{A:'Mughal Empire',B:'Ahom Kingdom',C:'British East India Company',D:'Koch Kingdom'}, correct:'B', explanation:'The Ahom Kingdom under Lachit Borphukan defeated the Mughals at Saraighat.' },
  { id:'q058', category:'assam-history', set:'Set 1', question:'Assam was annexed by the British in the year?', options:{A:'1826',B:'1857',C:'1885',D:'1905'}, correct:'A', explanation:'Assam came under British rule after the Treaty of Yandabo in 1826.' },
  { id:'q059', category:'assam-history', set:'Set 1', question:'Who is known as the "Satradhikar" of Assam\'s Vaishnavism?', options:{A:'Madhavdeva',B:'Sankardeva',C:'Pitambardas',D:'Damodardev'}, correct:'B', explanation:'Sankardeva (Srimanta Sankardeva) is the founder of the Ekasarana dharma.' },
  { id:'q060', category:'assam-history', set:'Set 1', question:'The first Assam movement (Assam Agitation) started in?', options:{A:'1979',B:'1983',C:'1985',D:'1971'}, correct:'A', explanation:'The Assam Agitation against illegal immigration started in 1979.' },

  // Previous Paper – 2022
  { id:'q061', category:'previous-paper', set:'2022 Paper', question:'The Right to Education Act was passed in India in the year?', options:{A:'2005',B:'2008',C:'2009',D:'2010'}, correct:'C', explanation:'The Right to Education Act was passed in 2009.' },
  { id:'q062', category:'previous-paper', set:'2022 Paper', question:'National Science Day is celebrated on?', options:{A:'February 28',B:'March 1',C:'January 30',D:'April 5'}, correct:'A', explanation:'National Science Day is celebrated on February 28 to commemorate Raman Effect.' },
  { id:'q063', category:'previous-paper', set:'2022 Paper', question:'The term "Niti Aayog" replaced?', options:{A:'Finance Commission',B:'Planning Commission',C:'Election Commission',D:'UPSC'}, correct:'B', explanation:'Niti Aayog replaced the Planning Commission of India in January 2015.' },
  { id:'q064', category:'previous-paper', set:'2022 Paper', question:'Which article of the Indian Constitution abolishes untouchability?', options:{A:'Article 14',B:'Article 17',C:'Article 15',D:'Article 21'}, correct:'B', explanation:'Article 17 abolishes untouchability.' },
  { id:'q065', category:'previous-paper', set:'2022 Paper', question:'The 73rd Constitutional Amendment Act deals with?', options:{A:'Municipalities',B:'Panchayati Raj',C:'Scheduled Tribes',D:'Right to Education'}, correct:'B', explanation:'The 73rd Amendment Act (1992) deals with Panchayati Raj institutions.' },
];

// ===== DATABASE API =====
function initDB() {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    const db = {
      categories: DEFAULT_CATEGORIES,
      sets: DEFAULT_SETS,
      questions: SAMPLE_QUESTIONS,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
}

function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getCategories() {
  return getDB().categories;
}

function getSetsForCategory(catId) {
  const db = getDB();
  return db.sets[catId] || [];
}

function getQuestions(catId, set) {
  const db = getDB();
  return db.questions.filter(q => q.category === catId && q.set === set);
}

function getAllQuestions() {
  return getDB().questions;
   }

function addQuestion(q) {
  const db = getDB();
  // Duplicate check
  const dup = db.questions.find(x =>
    x.question.trim().toLowerCase() === q.question.trim().toLowerCase() &&
    x.category === q.category
  );
  if (dup) return { success: false, duplicate: true };
  q.id = 'q' + Date.now();
  db.questions.push(q);
  saveDB(db);
  return { success: true };
}

function deleteQuestion(qId) {
  const db = getDB();
  db.questions = db.questions.filter(q => q.id !== qId);
  saveDB(db);
}

function addCategory(cat) {
  const db = getDB();
  const dup = db.categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
  if (dup) return false;
  db.categories.push(cat);
  db.sets[cat.id] = [];
  saveDB(db);
  return true;
}

function addSetToCategory(catId, setName) {
  const db = getDB();
  if (!db.sets[catId]) db.sets[catId] = [];
  if (db.sets[catId].includes(setName)) return false;
  db.sets[catId].push(setName);
  saveDB(db);
  return true;
}

function deleteCategory(catId) {
  const db = getDB();
  db.categories = db.categories.filter(c => c.id !== catId);
  delete db.sets[catId];
  db.questions = db.questions.filter(q => q.category !== catId);
  saveDB(db);
}

function deleteSet(catId, setName) {
  const db = getDB();
  if (db.sets[catId]) db.sets[catId] = db.sets[catId].filter(s => s !== setName);
  db.questions = db.questions.filter(q => !(q.category === catId && q.set === setName));
  saveDB(db);
}

// Init on load
initDB();
