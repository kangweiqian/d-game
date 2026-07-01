export type PersonalityType = 'competitive' | 'strategic' | 'casual' | 'adventure' | 'social' | 'rhythm';

export interface PersonalityInfo {
  type: PersonalityType;
  emoji: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  matchGenresZh: string[];
  matchGenresEn: string[];
}

export interface QuizOption {
  textZh: string;
  textEn: string;
  score: Record<PersonalityType, number>;
}

export interface QuizQuestion {
  id: number;
  questionZh: string;
  questionEn: string;
  options: QuizOption[];
}

export const personalities: Record<PersonalityType, PersonalityInfo> = {
  competitive: {
    type: 'competitive',
    emoji: '🏆',
    nameZh: '竞技王者',
    nameEn: 'Competitive Champion',
    descZh: '你是天生的斗士！喜欢在竞技场上证明自己的实力，享受战胜对手带来的成就感。对你来说，游戏就是一场场热血的战斗。',
    descEn: 'You are a born fighter! You love proving your skills in the arena and enjoy the thrill of victory. For you, games are intense battles.',
    matchGenresZh: ['MOBA', 'FPS', '动作'],
    matchGenresEn: ['MOBA', 'FPS', 'Action'],
  },
  strategic: {
    type: 'strategic',
    emoji: '🧩',
    nameZh: '策略大师',
    nameEn: 'Strategic Mastermind',
    descZh: '你善于思考，喜欢用智慧取胜。在你的世界里，每一个决策都至关重要，运筹帷幄决胜千里才是最大的乐趣。',
    descEn: 'You are a thinker who loves winning with wisdom. Every decision matters to you, and outsmarting opponents is the greatest joy.',
    matchGenresZh: ['策略', '塔防', '卡牌'],
    matchGenresEn: ['Strategy', 'Tower Defense', 'Card'],
  },
  casual: {
    type: 'casual',
    emoji: '🌸',
    nameZh: '休闲养老党',
    nameEn: 'Casual Relaxer',
    descZh: '你玩游戏只为放松心情，享受游戏里的美好时光。种花养鱼、收集养成、轻松愉快才是你想要的游戏生活。',
    descEn: 'You play games to relax and enjoy the good times. Gardening, collecting, and chilling are what you want from gaming.',
    matchGenresZh: ['放置', '休闲', '经营'],
    matchGenresEn: ['Idle', 'Casual', 'Simulation'],
  },
  adventure: {
    type: 'adventure',
    emoji: '⚔️',
    nameZh: '冒险探险家',
    nameEn: 'Adventure Explorer',
    descZh: '你心中住着一个冒险者！喜欢探索未知的世界，体验精彩的故事，在奇幻的旅程中找到属于自己的传说。',
    descEn: 'An adventurer lives in your heart! You love exploring unknown worlds, experiencing great stories, and finding your own legend.',
    matchGenresZh: ['RPG', '开放世界', '动作'],
    matchGenresEn: ['RPG', 'Open World', 'Action'],
  },
  social: {
    type: 'social',
    emoji: '🎭',
    nameZh: '社交达人',
    nameEn: 'Social Butterfly',
    descZh: '你玩游戏最重要的是有朋友陪！组队开黑、公会团战、认识新朋友，游戏因人与人的连接而精彩。',
    descEn: 'Friends make games worth playing for you! Team up, guild battles, meeting new people — games shine through connections.',
    matchGenresZh: ['MMO', '休闲派对', '社交'],
    matchGenresEn: ['MMO', 'Party', 'Social'],
  },
  rhythm: {
    type: 'rhythm',
    emoji: '🎵',
    nameZh: '节奏艺术生',
    nameEn: 'Rhythm Artist',
    descZh: '你对音乐和美有着独特的品味。跟着节拍律动，在游戏中感受艺术与游戏的完美结合，是你最享受的时刻。',
    descEn: 'You have a unique taste for music and beauty. Feeling the rhythm and experiencing the blend of art and gaming is your favorite moment.',
    matchGenresZh: ['音游', '休闲', '经营'],
    matchGenresEn: ['Rhythm', 'Casual', 'Simulation'],
  },
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionZh: '玩游戏对你来说，最主要的目的是？',
    questionEn: "What's your main goal when playing games?",
    options: [
      {
        textZh: '赢！战胜对手的感觉最爽',
        textEn: 'Win! Nothing beats beating opponents',
        score: { competitive: 3, strategic: 1, casual: 0, adventure: 1, social: 1, rhythm: 0 },
      },
      {
        textZh: '放松心情，打发时间',
        textEn: 'Relax and pass the time',
        score: { competitive: 0, strategic: 1, casual: 3, adventure: 1, social: 1, rhythm: 2 },
      },
      {
        textZh: '体验精彩的故事和世界',
        textEn: 'Experience great stories and worlds',
        score: { competitive: 0, strategic: 1, casual: 1, adventure: 3, social: 0, rhythm: 1 },
      },
      {
        textZh: '和朋友一起玩，开心就好',
        textEn: 'Play with friends, just have fun',
        score: { competitive: 1, strategic: 0, casual: 2, adventure: 1, social: 3, rhythm: 1 },
      },
    ],
  },
  {
    id: 2,
    questionZh: '你更喜欢什么样的游戏节奏？',
    questionEn: 'What game pace do you prefer?',
    options: [
      {
        textZh: '快节奏，紧张刺激',
        textEn: 'Fast-paced, intense and exciting',
        score: { competitive: 3, strategic: 1, casual: 0, adventure: 2, social: 1, rhythm: 2 },
      },
      {
        textZh: '慢慢玩，想停就停',
        textEn: 'Take it slow, pause anytime',
        score: { competitive: 0, strategic: 2, casual: 3, adventure: 1, social: 1, rhythm: 1 },
      },
      {
        textZh: '有起有伏，跟着剧情走',
        textEn: 'Paced with the story, ups and downs',
        score: { competitive: 1, strategic: 1, casual: 1, adventure: 3, social: 0, rhythm: 1 },
      },
      {
        textZh: '跟着音乐律动就对了',
        textEn: 'Just go with the music rhythm',
        score: { competitive: 1, strategic: 0, casual: 2, adventure: 0, social: 1, rhythm: 3 },
      },
    ],
  },
  {
    id: 3,
    questionZh: '遇到打不过的关卡/对手，你会？',
    questionEn: 'When facing a tough level/opponent, you?',
    options: [
      {
        textZh: '死磕到底，一定要赢',
        textEn: 'Keep trying until I win',
        score: { competitive: 3, strategic: 2, casual: 0, adventure: 2, social: 1, rhythm: 1 },
      },
      {
        textZh: '查攻略找方法，智取',
        textEn: 'Find strategies, outsmart it',
        score: { competitive: 1, strategic: 3, casual: 0, adventure: 2, social: 0, rhythm: 1 },
      },
      {
        textZh: '先放一放，换个游戏玩',
        textEn: 'Take a break, play something else',
        score: { competitive: 0, strategic: 1, casual: 3, adventure: 1, social: 1, rhythm: 2 },
      },
      {
        textZh: '叫上朋友一起想办法',
        textEn: 'Call friends to figure it out together',
        score: { competitive: 1, strategic: 1, casual: 1, adventure: 1, social: 3, rhythm: 0 },
      },
    ],
  },
  {
    id: 4,
    questionZh: '你更喜欢单人游戏还是多人游戏？',
    questionEn: 'Do you prefer single-player or multiplayer?',
    options: [
      {
        textZh: '单人，沉浸在自己的世界里',
        textEn: 'Single-player, immerse in my own world',
        score: { competitive: 1, strategic: 2, casual: 2, adventure: 3, social: 0, rhythm: 2 },
      },
      {
        textZh: '多人对战，和人斗才有意思',
        textEn: 'Multiplayer PvP, competing against people is fun',
        score: { competitive: 3, strategic: 1, casual: 0, adventure: 0, social: 2, rhythm: 0 },
      },
      {
        textZh: '多人合作，组队开黑最快乐',
        textEn: 'Multiplayer co-op, teaming up is the best',
        score: { competitive: 1, strategic: 1, casual: 1, adventure: 1, social: 3, rhythm: 0 },
      },
      {
        textZh: '都行，看心情',
        textEn: 'Either, depends on my mood',
        score: { competitive: 1, strategic: 1, casual: 2, adventure: 1, social: 2, rhythm: 1 },
      },
    ],
  },
  {
    id: 5,
    questionZh: '游戏中最吸引你的是？',
    questionEn: 'What attracts you most in games?',
    options: [
      {
        textZh: '华丽的操作和连招',
        textEn: 'Flashy combos and skilled plays',
        score: { competitive: 3, strategic: 0, casual: 0, adventure: 2, social: 1, rhythm: 2 },
      },
      {
        textZh: '精美的画面和音乐',
        textEn: 'Beautiful visuals and music',
        score: { competitive: 0, strategic: 1, casual: 2, adventure: 2, social: 0, rhythm: 3 },
      },
      {
        textZh: '收集和养成的成就感',
        textEn: 'The satisfaction of collecting and raising',
        score: { competitive: 0, strategic: 2, casual: 3, adventure: 1, social: 1, rhythm: 1 },
      },
      {
        textZh: '认识有趣的人',
        textEn: 'Meeting interesting people',
        score: { competitive: 1, strategic: 0, casual: 1, adventure: 0, social: 3, rhythm: 0 },
      },
    ],
  },
  {
    id: 6,
    questionZh: '选一个你最喜欢的游戏场景？',
    questionEn: 'Pick your favorite game scene?',
    options: [
      {
        textZh: '热血沸腾的竞技场',
        textEn: 'A thrilling arena battlefield',
        score: { competitive: 3, strategic: 1, casual: 0, adventure: 1, social: 2, rhythm: 0 },
      },
      {
        textZh: '宁静治愈的小镇',
        textEn: 'A peaceful and cozy town',
        score: { competitive: 0, strategic: 1, casual: 3, adventure: 1, social: 1, rhythm: 2 },
      },
      {
        textZh: '神秘壮阔的奇幻世界',
        textEn: 'A mysterious and epic fantasy world',
        score: { competitive: 1, strategic: 2, casual: 0, adventure: 3, social: 0, rhythm: 1 },
      },
      {
        textZh: '灯光璀璨的舞台',
        textEn: 'A dazzling stage with bright lights',
        score: { competitive: 0, strategic: 0, casual: 1, adventure: 0, social: 2, rhythm: 3 },
      },
    ],
  },
];

export function calculatePersonality(answers: number[]): PersonalityType {
  const scores: Record<PersonalityType, number> = {
    competitive: 0,
    strategic: 0,
    casual: 0,
    adventure: 0,
    social: 0,
    rhythm: 0,
  };

  answers.forEach((optionIndex, questionIndex) => {
    const question = quizQuestions[questionIndex];
    if (question && question.options[optionIndex]) {
      const optionScore = question.options[optionIndex].score;
      Object.keys(optionScore).forEach((key) => {
        scores[key as PersonalityType] += optionScore[key as PersonalityType];
      });
    }
  });

  let maxType: PersonalityType = 'casual';
  let maxScore = -1;

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as PersonalityType;
    }
  });

  return maxType;
}
