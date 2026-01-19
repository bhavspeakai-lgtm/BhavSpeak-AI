import { Module, ModuleType, DifficultyLevel, Accent } from '@/types/learning';

const alphabetLessons = [
  { id: 'alpha-1', title: 'Vowels A, E, I', content: [
    { id: 'a1', text: 'A', phonetic: '/eɪ/' },
    { id: 'a2', text: 'E', phonetic: '/iː/' },
    { id: 'a3', text: 'I', phonetic: '/aɪ/' },
  ], completed: false },
  { id: 'alpha-2', title: 'Vowels O, U', content: [
    { id: 'a4', text: 'O', phonetic: '/oʊ/' },
    { id: 'a5', text: 'U', phonetic: '/juː/' },
  ], completed: false },
  { id: 'alpha-3', title: 'Consonants B, C, D', content: [
    { id: 'a6', text: 'B', phonetic: '/biː/' },
    { id: 'a7', text: 'C', phonetic: '/siː/' },
    { id: 'a8', text: 'D', phonetic: '/diː/' },
  ], completed: false },
];

const wordLessons = [
  { id: 'word-1', title: 'Greetings', content: [
    { id: 'w1', text: 'Hello', phonetic: '/həˈloʊ/' },
    { id: 'w2', text: 'Goodbye', phonetic: '/ɡʊdˈbaɪ/' },
    { id: 'w3', text: 'Thank you', phonetic: '/θæŋk juː/' },
  ], completed: false },
  { id: 'word-2', title: 'Numbers', content: [
    { id: 'w4', text: 'One', phonetic: '/wʌn/' },
    { id: 'w5', text: 'Two', phonetic: '/tuː/' },
    { id: 'w6', text: 'Three', phonetic: '/θriː/' },
  ], completed: false },
  { id: 'word-3', title: 'Colors', content: [
    { id: 'w7', text: 'Red', phonetic: '/rɛd/' },
    { id: 'w8', text: 'Blue', phonetic: '/bluː/' },
    { id: 'w9', text: 'Green', phonetic: '/ɡriːn/' },
  ], completed: false },
];

const sentenceLessons = [
  { id: 'sent-1', title: 'Introductions', content: [
    { id: 's1', text: 'My name is John.', phonetic: '/maɪ neɪm ɪz dʒɒn/' },
    { id: 's2', text: 'Nice to meet you.', phonetic: '/naɪs tuː miːt juː/' },
    { id: 's3', text: 'How are you?', phonetic: '/haʊ ɑːr juː/' },
  ], completed: false },
  { id: 'sent-2', title: 'Daily Activities', content: [
    { id: 's4', text: 'I am going to work.', phonetic: '/aɪ æm ˈɡoʊɪŋ tuː wɜːrk/' },
    { id: 's5', text: 'What time is it?', phonetic: '/wɒt taɪm ɪz ɪt/' },
    { id: 's6', text: 'I like to read books.', phonetic: '/aɪ laɪk tuː riːd bʊks/' },
  ], completed: false },
];

const paragraphLessons = [
  { id: 'para-1', title: 'Short Story', content: [
    { id: 'p1', text: 'The sun was setting over the hills. Birds were flying home. It was a beautiful evening.' },
  ], completed: false },
  { id: 'para-2', title: 'Description', content: [
    { id: 'p2', text: 'My favorite place is the beach. I love the sound of waves and the smell of the sea. The sand is warm under my feet.' },
  ], completed: false },
];

export const getModules = (level: DifficultyLevel): Module[] => {
  const baseModules: Module[] = [
    {
      id: 'alphabets',
      type: 'alphabets',
      title: 'Alphabets',
      description: 'Learn the sounds of each letter',
      icon: '🔤',
      lessons: alphabetLessons,
      isLocked: false,
      progress: 0,
    },
    {
      id: 'words',
      type: 'words',
      title: 'Words',
      description: 'Build your vocabulary',
      icon: '📝',
      lessons: wordLessons,
      isLocked: true,
      progress: 0,
    },
    {
      id: 'sentences',
      type: 'sentences',
      title: 'Sentences',
      description: 'Form complete thoughts',
      icon: '💬',
      lessons: sentenceLessons,
      isLocked: true,
      progress: 0,
    },
    {
      id: 'paragraphs',
      type: 'paragraphs',
      title: 'Paragraphs',
      description: 'Master longer passages',
      icon: '📖',
      lessons: paragraphLessons,
      isLocked: true,
      progress: 0,
    },
  ];

  return baseModules;
};

export const getAccentPhonetics = (accent: Accent, text: string): string => {
  // This would typically come from a database with accent-specific phonetics
  const accentVariations: Record<Accent, Record<string, string>> = {
    american: {
      'water': '/ˈwɔːtər/',
      'better': '/ˈbɛtər/',
      'car': '/kɑːr/',
    },
    british: {
      'water': '/ˈwɔːtə/',
      'better': '/ˈbɛtə/',
      'car': '/kɑː/',
    },
    indian: {
      'water': '/ˈvɔːtər/',
      'better': '/ˈbeʈər/',
      'car': '/kɑːr/',
    },
    australian: {
      'water': '/ˈwoːtə/',
      'better': '/ˈbetə/',
      'car': '/kɑː/',
    },
  };

  return accentVariations[accent][text.toLowerCase()] || '';
};
