import { Module, Lesson, LessonContent } from '@/types/learning';
import { PHONETIC_SOUNDS } from './phoneticSounds';

// Sentence reading lessons - progressive difficulty
const sentenceLessons2_3: Lesson[] = [
  {
    id: 'sent-2-3-1',
    title: 'Simple Sentences 1',
    content: [
      { id: 's1', text: 'The cat sat on the mat.' },
      { id: 's2', text: 'I like to read books.' },
      { id: 's3', text: 'She walks to school every day.' },
    ],
    completed: false,
  },
  {
    id: 'sent-2-3-2',
    title: 'Simple Sentences 2',
    content: [
      { id: 's4', text: 'The sun shines bright in the sky.' },
      { id: 's5', text: 'We play games in the park.' },
      { id: 's6', text: 'He eats breakfast at eight o\'clock.' },
    ],
    completed: false,
  },
  {
    id: 'sent-2-3-3',
    title: 'Simple Sentences 3',
    content: [
      { id: 's7', text: 'Birds fly high above the trees.' },
      { id: 's8', text: 'My friend lives in a big house.' },
      { id: 's9', text: 'The dog runs fast in the garden.' },
    ],
    completed: false,
  },
];

const sentenceLessons4_5: Lesson[] = [
  {
    id: 'sent-4-5-1',
    title: 'Medium Sentences 1',
    content: [
      { id: 'm1', text: 'The teacher explained the lesson clearly to all students.' },
      { id: 'm2', text: 'I enjoy reading books in the library during my free time.' },
      { id: 'm3', text: 'She decided to visit her grandmother next weekend.' },
      { id: 'm4', text: 'The weather was perfect for a picnic in the park.' },
      { id: 'm5', text: 'We need to finish our homework before dinner time.' },
    ],
    completed: false,
  },
  {
    id: 'sent-4-5-2',
    title: 'Medium Sentences 2',
    content: [
      { id: 'm6', text: 'My brother plays guitar and sings songs beautifully.' },
      { id: 'm7', text: 'The children were excited about the school trip tomorrow.' },
      { id: 'm8', text: 'I bought fresh vegetables from the market this morning.' },
      { id: 'm9', text: 'The movie was interesting but it lasted too long.' },
      { id: 'm10', text: 'She practices piano every day to improve her skills.' },
    ],
    completed: false,
  },
];

const sentenceLessons10_20: Lesson[] = [
  {
    id: 'sent-10-20-1',
    title: 'Long Paragraph 1',
    content: [
      { id: 'l1', text: 'Once upon a time, there was a young girl who loved to explore the forest near her home.' },
      { id: 'l2', text: 'Every morning, she would pack a small bag with snacks and water, then set off on her adventure.' },
      { id: 'l3', text: 'The forest was full of tall trees, colorful flowers, and singing birds that filled the air with beautiful melodies.' },
      { id: 'l4', text: 'She would walk along the winding paths, discovering new places she had never seen before.' },
      { id: 'l5', text: 'Sometimes, she would sit by a small stream and listen to the gentle sound of flowing water.' },
      { id: 'l6', text: 'Other times, she would climb up a hill to get a better view of the surrounding landscape.' },
      { id: 'l7', text: 'The girl felt peaceful and happy during these moments, far away from the noise of the city.' },
      { id: 'l8', text: 'She learned to identify different types of plants and animals during her explorations.' },
      { id: 'l9', text: 'Her parents were always proud of her curiosity and love for nature.' },
      { id: 'l10', text: 'These forest walks became her favorite activity, and she looked forward to them every single day.' },
    ],
    completed: false,
  },
  {
    id: 'sent-10-20-2',
    title: 'Long Paragraph 2',
    content: [
      { id: 'l11', text: 'The library was a magical place filled with thousands of books on every topic imaginable.' },
      { id: 'l12', text: 'Students and researchers would spend hours there, searching for information and knowledge.' },
      { id: 'l13', text: 'The quiet atmosphere made it perfect for reading and studying without any distractions.' },
      { id: 'l14', text: 'Librarians were always ready to help visitors find exactly what they were looking for.' },
      { id: 'l15', text: 'The building itself was old and beautiful, with tall windows that let in natural light.' },
      { id: 'l16', text: 'People of all ages came to the library to read, learn, and explore new ideas.' },
      { id: 'l17', text: 'Children would gather in the children\'s section, listening to stories read aloud by librarians.' },
      { id: 'l18', text: 'Adults would sit at tables, working on their projects or reading for pleasure.' },
      { id: 'l19', text: 'The library offered free internet access and computer services to all its members.' },
      { id: 'l20', text: 'It was truly a community center where knowledge was shared and learning never stopped.' },
    ],
    completed: false,
  },
];

// Speaking topics for familiar topics practice
export const SPEAKING_TOPICS = [
  {
    id: 'topic-1',
    title: 'My Daily Routine',
    description: 'Describe your typical day from morning to night',
    prompt: 'Talk about what you do every day. Include your morning routine, work or school activities, meals, hobbies, and evening activities. Speak for about 2 minutes.',
  },
  {
    id: 'topic-2',
    title: 'My Family',
    description: 'Tell us about your family members',
    prompt: 'Describe your family. Talk about your parents, siblings, or other family members. Share what they do, their personalities, and what you like about them. Speak for about 2 minutes.',
  },
  {
    id: 'topic-3',
    title: 'My Hobbies',
    description: 'Share your favorite hobbies and interests',
    prompt: 'Tell us about your hobbies. Explain what activities you enjoy, why you like them, how often you do them, and what makes them special to you. Speak for about 2 minutes.',
  },
  {
    id: 'topic-4',
    title: 'My Favorite Food',
    description: 'Talk about food you love',
    prompt: 'Describe your favorite food. Explain what it is, how it tastes, when you eat it, and why you like it so much. You can also talk about how it\'s prepared. Speak for about 2 minutes.',
  },
  {
    id: 'topic-5',
    title: 'My Best Friend',
    description: 'Tell us about your best friend',
    prompt: 'Talk about your best friend. Describe their personality, how you met, what you do together, and why they are important to you. Speak for about 2 minutes.',
  },
];

// AI Interview questions
export const AI_INTERVIEW_QUESTIONS = [
  {
    id: 'q1',
    question: 'Tell me about yourself. What are your interests and goals?',
    category: 'Introduction',
  },
  {
    id: 'q2',
    question: 'Describe a challenging situation you faced and how you handled it.',
    category: 'Problem Solving',
  },
  {
    id: 'q3',
    question: 'What are your strengths and weaknesses?',
    category: 'Self Assessment',
  },
  {
    id: 'q4',
    question: 'Where do you see yourself in five years?',
    category: 'Future Plans',
  },
  {
    id: 'q5',
    question: 'Tell me about a time when you worked in a team.',
    category: 'Teamwork',
  },
  {
    id: 'q6',
    question: 'What motivates you in life?',
    category: 'Motivation',
  },
  {
    id: 'q7',
    question: 'Describe a skill you want to learn or improve.',
    category: 'Learning',
  },
  {
    id: 'q8',
    question: 'How do you handle stress or pressure?',
    category: 'Stress Management',
  },
];

// Create phonetic sounds lessons - one lesson per sound
export const createPhoneticLessons = (): Lesson[] => {
  return PHONETIC_SOUNDS.map((sound, index) => ({
    id: `phonetic-${sound.id}`,
    title: `${sound.symbol} - ${sound.name}`,
    content: sound.words.map((word, wordIndex) => ({
      id: `p-${sound.id}-${wordIndex}`,
      text: word.word,
      phonetic: word.phonetic,
      audioUrl: undefined, // Will be generated with TTS
    })),
    completed: false,
  }));
};

// Create structured modules based on learning path
export const getStructuredModules = (): Module[] => {
  const phoneticLessons = createPhoneticLessons();
  
  return [
    {
      id: 'phonetic-sounds',
      type: 'alphabets',
      title: 'Phonetic Sounds',
      description: 'Master all 44 English phonetic sounds. Each sound has 10 example words to practice.',
      icon: '🔤',
      lessons: phoneticLessons,
      isLocked: false,
      progress: 0,
    },
    {
      id: 'sentences-2-3',
      type: 'sentences',
      title: 'Sentence Reading (2-3 lines)',
      description: 'Practice reading simple sentences with 2-3 lines. AI will analyze your pronunciation.',
      icon: '📝',
      lessons: sentenceLessons2_3,
      isLocked: true,
      progress: 0,
    },
    {
      id: 'sentences-4-5',
      type: 'sentences',
      title: 'Sentence Reading (4-5 lines)',
      description: 'Practice reading medium-length sentences with 4-5 lines.',
      icon: '📄',
      lessons: sentenceLessons4_5,
      isLocked: true,
      progress: 0,
    },
    {
      id: 'sentences-10-20',
      type: 'paragraphs',
      title: 'Paragraph Reading (10-20 lines)',
      description: 'Practice reading longer paragraphs with 10-20 lines.',
      icon: '📖',
      lessons: sentenceLessons10_20,
      isLocked: true,
      progress: 0,
    },
    {
      id: 'speaking-topics',
      type: 'paragraphs',
      title: 'Speaking Practice',
      description: 'Practice speaking on familiar topics for 2 minutes. AI will provide feedback.',
      icon: '🗣️',
      lessons: SPEAKING_TOPICS.map(topic => ({
        id: topic.id,
        title: topic.title,
        content: [{ id: topic.id, text: topic.prompt }],
        completed: false,
      })),
      isLocked: true,
      progress: 0,
    },
    {
      id: 'ai-interview',
      type: 'paragraphs',
      title: 'AI Interview',
      description: 'Final interview with AI to test your language skills and get comprehensive results.',
      icon: '🤖',
      lessons: AI_INTERVIEW_QUESTIONS.map(q => ({
        id: q.id,
        title: q.question,
        content: [{ id: q.id, text: q.question }],
        completed: false,
      })),
      isLocked: true,
      progress: 0,
    },
  ];
};

