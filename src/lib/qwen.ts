import { Game, ChatMessage } from './types';
import { games } from '../data/games';

export async function callQwenAPI(
  userMessage: string,
  history: ChatMessage[],
  locale: 'zh' | 'en'
): Promise<{ reply: string; recommendedGames: Game[] }> {
  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || process.env.QWEN_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
  const model = process.env.NEXT_PUBLIC_MODEL_NAME || 'qwen-turbo';

  if (!apiKey) {
    return getMockRecommendation(userMessage, locale);
  }

  const gameListStr = games.map(g => 
    `${g.id}. ${locale === 'zh' ? g.name : g.nameEn} (${locale === 'zh' ? g.genre : g.genreEn}) - ${locale === 'zh' ? g.description.slice(0, 50) : g.descriptionEn.slice(0, 50)}`
  ).join('\n');

  const systemPrompt = locale === 'zh' 
    ? `你是一位专业的东南亚手游推荐专家，名叫D-GAME助手。

游戏库（每款游戏格式：ID. 游戏名 (类型) - 简介）：
${gameListStr}

回复规则：
1. 如果用户询问游戏相关的问题或寻求游戏推荐，请从游戏库中推荐最适合的2-3款游戏
2. 如果用户明确表示不想玩游戏、不想要推荐、没兴趣等否定意图，请友好回应，表示理解，不要推荐任何游戏
3. 如果用户的问题与游戏无关，可以先友好回应用户的问题，然后礼貌地引导用户询问游戏相关内容
4. 推荐游戏时，每款游戏格式：[游戏ID] 游戏名称 | 类型 | 推荐理由（30字以内）
5. 不推荐游戏时，不要使用 [数字] 格式，正常对话即可
6. 保持亲切友好的语气，像朋友一样聊天
7. 如果用户想找武侠/仙侠/江湖类游戏（提到武侠、wuxia、江湖、剑、刀、仙侠等关键词），只推荐genre包含"武侠"或"仙侠"的游戏（如一梦江湖、天涯明月刀、剑侠世界3），不要推荐其他类型的游戏`
    : `You are a professional mobile game recommendation expert for Southeast Asia, called D-GAME Assistant.

Game library (format: ID. Game name (Genre) - Description):
${gameListStr}

Response rules:
1. If the user asks about games or wants game recommendations, recommend 2-3 most suitable games from the library
2. If the user clearly expresses negative intent such as not wanting to play games, not wanting recommendations, not interested, etc., respond friendly and understandingly, do NOT recommend any games
3. If the user's question is not game-related, respond friendly first, then politely guide back to game topics
4. When recommending games, format: [Game ID] Game Name | Genre | Reason (within 30 words)
5. When not recommending games, don't use [number] format, just chat normally
6. Keep a friendly and warm tone, like chatting with a friend`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const recommendedGames = parseGameRecommendations(reply);

    return { reply, recommendedGames };
  } catch (error) {
    console.error('Qwen API error:', error);
    return getMockRecommendation(userMessage, locale);
  }
}

function parseGameRecommendations(reply: string): Game[] {
  const gameIds: string[] = [];
  const regex = /\[(\d+)\]/g;
  let match;
  
  while ((match = regex.exec(reply)) !== null) {
    if (!gameIds.includes(match[1])) {
      gameIds.push(match[1]);
    }
  }

  return gameIds
    .map(id => games.find(g => g.id === id))
    .filter((g): g is Game => g !== undefined)
    .slice(0, 3);
}

type IntentType = 'game_recommend' | 'game_query' | 'greeting' | 'thanks' | 'casual_chat' | 'off_topic' | 'negative';

function detectIntent(message: string, locale: 'zh' | 'en'): IntentType {
  const lowerMsg = message.toLowerCase().trim();

  const negativeKeywords = locale === 'zh'
    ? ['不想', '不要', '别', '不玩', '没兴趣', '不感兴趣', '不需要', '算了', '不用了', '拉倒', '不想玩', '不想打', '不想玩游戏', '不想打游戏', '不推荐', '别推荐']
    : ['don\'t want', 'don\'t play', 'no thanks', 'not interested', 'don\'t recommend', 'no game', 'don\'t feel like', 'nah', 'pass', 'not in the mood'];

  const gameKeywords = locale === 'zh'
    ? ['游戏', '手游', '推荐', '好玩', '玩什么', '找游戏', '有什么', 'rpg', 'moba', '休闲', '策略', '动作', '角色', '二次元', '动漫', '武侠', '仙侠', '竞技', '对战', '新游', '热门', '射击', 'fps', '竞速', '赛车', '沙盒', '生存', 'slg', '棋牌', '卡牌', '体育', '足球', '篮球', '建造', '吃鸡', '大逃杀']
    : ['game', 'mobile game', 'recommend', 'fun', 'what to play', 'suggest', 'rpg', 'moba', 'casual', 'strategy', 'action', 'role', 'anime', 'martial', 'competitive', 'pvp', 'new', 'hot', 'shooter', 'fps', 'racing', 'sandbox', 'survival', 'slg', 'card', 'sports', 'football', 'basketball', 'building', 'battle royale'];

  const gameQueryKeywords = locale === 'zh'
    ? ['好玩吗', '怎么样', '类型', '介绍', '详情', '怎么玩', '评测', '评价']
    : ['is it good', 'how is', 'type', 'detail', 'how to play', 'review', 'about'];

  const greetingKeywords = locale === 'zh'
    ? ['你好', '嗨', '哈喽', 'hello', 'hi', '在吗', '你好呀', '嗨嗨', '你好啊']
    : ['hi', 'hello', 'hey', 'hi there', 'yo', 'hola', 'greetings'];

  const thanksKeywords = locale === 'zh'
    ? ['谢谢', '感谢', '多谢', 'thanks', 'thank you', '辛苦了']
    : ['thanks', 'thank you', 'appreciate', 'thx', 'ty', 'much appreciated'];

  const casualChatKeywords = locale === 'zh'
    ? ['天气', '吃饭', '名字', '你是谁', '你叫什么', '你多大', '你从哪来', '今天', '昨天', '明天']
    : ['weather', 'eat', 'food', 'name', 'who are you', 'your name', 'how old', 'where are you from', 'today', 'yesterday', 'tomorrow'];

  for (const kw of negativeKeywords) {
    if (lowerMsg.includes(kw)) return 'negative';
  }

  for (const kw of gameKeywords) {
    if (lowerMsg.includes(kw)) return 'game_recommend';
  }

  for (const kw of gameQueryKeywords) {
    if (lowerMsg.includes(kw)) return 'game_query';
  }

  for (const kw of thanksKeywords) {
    if (lowerMsg.includes(kw)) return 'thanks';
  }

  for (const kw of greetingKeywords) {
    if (lowerMsg === kw || lowerMsg.includes(kw + ' ') || lowerMsg.includes(' ' + kw) || lowerMsg === kw + '吗' || lowerMsg === kw + '呀') {
      return 'greeting';
    }
  }

  for (const kw of casualChatKeywords) {
    if (lowerMsg.includes(kw)) return 'casual_chat';
  }

  if (lowerMsg.length <= 6) return 'greeting';

  return 'off_topic';
}

function getRandomReply(replies: string[]): string {
  return replies[Math.floor(Math.random() * replies.length)];
}

function getMockRecommendation(message: string, locale: 'zh' | 'en'): { reply: string; recommendedGames: Game[] } {
  const intent = detectIntent(message, locale);
  const lowerMsg = message.toLowerCase();

  const greetingRepliesZh = [
    '你好呀！我是 D-GAME 助手，专门帮你找到好玩的手游~ 想找什么类型的游戏呢？🎮',
    '嗨嗨！欢迎来到 D-GAME ✨ 有什么我可以帮你的吗？想找好玩的游戏吗？',
    'Hello！我是你的游戏推荐小助手，想玩点什么类型的游戏呀？',
    '你好你好~ 我是 D-GAME 游戏推荐官！想找什么类型的游戏，尽管告诉我哦~',
  ];

  const greetingRepliesEn = [
    'Hi there! I\'m D-GAME Assistant, here to help you find fun mobile games~ What type of games are you looking for? 🎮',
    'Hey hey! Welcome to D-GAME ✨ How can I help you? Looking for fun games?',
    'Hello! I\'m your game recommendation buddy~ What kind of games do you feel like playing today?',
    'Hi hi~ I\'m D-GAME game recommender! Tell me what type of games you like and I\'ll find them for you~',
  ];

  const thanksRepliesZh = [
    '不客气~ 希望你能找到喜欢的游戏！还有其他想了解的吗？😊',
    '能帮到你就好啦 ✨ 还想找其他类型的游戏吗？',
    '不用谢！随时可以来找我推荐游戏哦~ 🎮',
    '嘻嘻，客气啦~ 玩得开心！有需要随时找我推荐游戏~',
  ];

  const thanksRepliesEn = [
    'You\'re welcome~ Hope you find games you love! Anything else you\'d like to know? 😊',
    'Glad I could help ✨ Want to explore other game types?',
    'No problem! Feel free to come back anytime for game recommendations~ 🎮',
    'Aww, you\'re welcome~ Have fun playing! Come back anytime for more recs~',
  ];

  const casualChatRepliesZh = [
    '哈哈，这个话题很有趣呢！不过说到好玩的，要不要我给你推荐几款超棒的手游？🎮',
    '嗯嗯，说到这个... 对了，最近有几款新游戏超火的，想了解一下吗？',
    '有意思！不过我更擅长推荐游戏哦~ 想玩什么类型的，我帮你找找？✨',
    '哇，这个我也觉得！对了对了，你平时喜欢玩什么类型的游戏呀？我给你推荐几款~',
  ];

  const casualChatRepliesEn = [
    'Haha, that\'s interesting! Speaking of fun things, want me to recommend some awesome mobile games? 🎮',
    'Hmm, right about that... hey, there are some really hot new games lately, wanna check them out?',
    'Interesting! I\'m actually better at recommending games though~ What type do you like, I can help you find some ✨',
    'Wow, I think so too! Hey by the way, what kind of games do you usually play? I can recommend some~',
  ];

  const offTopicRepliesZh = [
    '这个问题我可能不太擅长呢 😅 不过找游戏我可是专业的！想玩什么类型的游戏呀？',
    '哈哈，这个我不太懂啦~ 但说到游戏我可是行家！需要我推荐几款好玩的手游吗？🎮',
    '抱歉哦，我主要是帮大家找游戏的~ 想找什么类型的游戏，我可以帮你推荐！✨',
    '哎呀，这个话题我不太擅长呢... 不如我们聊点游戏相关的？我超会推荐游戏的哦~',
  ];

  const offTopicRepliesEn = [
    'Hmm, I might not be the best at that 😅 But I AM a pro at finding games! What type do you feel like playing?',
    'Haha, that\'s not really my thing~ But when it comes to games, I\'m an expert! Want me to recommend some fun ones? 🎮',
    'Sorry, I mostly help people find games~ What type are you looking for? I\'ve got great recommendations! ✨',
    'Oops, not really my strong suit... How about we talk about games instead? I\'m really good at recommending them~',
  ];

  const negativeRepliesZh = [
    '好哒~ 不想玩也没关系呀 😊 等你想玩的时候随时来找我，我随时准备好给你推荐好玩的游戏哦！',
    '没问题没问题~ 不想玩就先不玩啦 ✨ 等你哪天想找游戏了，记得来找我呀~',
    '了解~ 那就先不推荐啦 🎮 等你有兴趣了随时告诉我，我给你推荐超好玩的游戏！',
    '哈哈，好的好的~ 不想玩就先休息休息吧 😄 想玩的时候随时喊我哦！',
  ];

  const negativeRepliesEn = [
    'Alrighty~ No problem if you don\'t feel like playing 😊 Come back anytime you want game recommendations, I\'ll be here!',
    'Sure thing~ No pressure at all ✨ Whenever you feel like gaming, just come find me~',
    'Got it~ I\'ll hold off on recommendations for now 🎮 Let me know whenever you\'re interested, I\'ve got great games to suggest!',
    'Haha, okay okay~ Take a break from gaming if you want 😄 Hit me up whenever you feel like playing!',
  ];

  if (intent === 'negative') {
    return {
      reply: locale === 'zh' ? getRandomReply(negativeRepliesZh) : getRandomReply(negativeRepliesEn),
      recommendedGames: [],
    };
  }

  if (intent === 'greeting') {
    return {
      reply: locale === 'zh' ? getRandomReply(greetingRepliesZh) : getRandomReply(greetingRepliesEn),
      recommendedGames: [],
    };
  }

  if (intent === 'thanks') {
    return {
      reply: locale === 'zh' ? getRandomReply(thanksRepliesZh) : getRandomReply(thanksRepliesEn),
      recommendedGames: [],
    };
  }

  if (intent === 'casual_chat') {
    return {
      reply: locale === 'zh' ? getRandomReply(casualChatRepliesZh) : getRandomReply(casualChatRepliesEn),
      recommendedGames: [],
    };
  }

  if (intent === 'off_topic') {
    return {
      reply: locale === 'zh' ? getRandomReply(offTopicRepliesZh) : getRandomReply(offTopicRepliesEn),
      recommendedGames: [],
    };
  }

  let recommendedGames: Game[] = [];

  if (lowerMsg.includes('rpg') || lowerMsg.includes('角色扮演') || lowerMsg.includes('角色') || lowerMsg.includes('二次元') || lowerMsg.includes('anime')) {
    recommendedGames = games.filter(g => 
      g.genreEn.toLowerCase().includes('rpg') || g.genre.includes('角色') || g.genre.includes('二次元')
    ).slice(0, 3);
  } else if (lowerMsg.includes('moba') || lowerMsg.includes('竞技') || lowerMsg.includes('对战') || lowerMsg.includes('pvp') || lowerMsg.includes('5v5')) {
    recommendedGames = games.filter(g => 
      g.genreEn.toLowerCase().includes('moba') || g.genre.includes('MOBA') || g.genre.includes('竞技')
    ).slice(0, 3);
  } else if (lowerMsg.includes('射击') || lowerMsg.includes('shooter') || lowerMsg.includes('fps') || lowerMsg.includes('吃鸡') || lowerMsg.includes('大逃杀') || lowerMsg.includes('battle royale')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('射击') || g.genreEn.toLowerCase().includes('shooter') || g.genre.includes('大逃杀')
    ).slice(0, 3);
  } else if (lowerMsg.includes('竞速') || lowerMsg.includes('赛车') || lowerMsg.includes('racing') || lowerMsg.includes('飞车') || lowerMsg.includes('飙车')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('竞速') || g.genreEn.toLowerCase().includes('racing')
    ).slice(0, 3);
  } else if (lowerMsg.includes('沙盒') || lowerMsg.includes('sandbox') || lowerMsg.includes('建造') || lowerMsg.includes('building') || lowerMsg.includes('我的世界') || lowerMsg.includes('迷你世界')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('沙盒') || g.genreEn.toLowerCase().includes('sandbox')
    ).slice(0, 3);
  } else if (lowerMsg.includes('生存') || lowerMsg.includes('survival')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('生存') || g.genreEn.toLowerCase().includes('survival')
    ).slice(0, 3);
  } else if (lowerMsg.includes('策略') || lowerMsg.includes('strategy') || lowerMsg.includes('塔防') || lowerMsg.includes('slg') || lowerMsg.includes('三国') || lowerMsg.includes('三国志')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('策略') || g.genre.includes('塔防') || g.genreEn.toLowerCase().includes('strategy') || g.genre.includes('SLG')
    ).slice(0, 3);
  } else if (lowerMsg.includes('棋牌') || lowerMsg.includes('card') || lowerMsg.includes('斗地主') || lowerMsg.includes('象棋') || lowerMsg.includes('麻将') || lowerMsg.includes('扑克')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('棋牌') || g.genreEn.toLowerCase().includes('card') || g.genre.includes('board')
    ).slice(0, 3);
  } else if (lowerMsg.includes('体育') || lowerMsg.includes('sports') || lowerMsg.includes('足球') || lowerMsg.includes('football') || lowerMsg.includes('篮球') || lowerMsg.includes('basketball')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('体育') || g.genreEn.toLowerCase().includes('sports')
    ).slice(0, 3);
  } else if (lowerMsg.includes('动作') || lowerMsg.includes('action') || lowerMsg.includes('格斗')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('动作') || g.genreEn.toLowerCase().includes('action')
    ).slice(0, 3);
  } else if (lowerMsg.includes('武侠') || lowerMsg.includes('wuxia') || lowerMsg.includes('江湖') || lowerMsg.includes('剑') || lowerMsg.includes('刀')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('武侠') || g.genreEn.toLowerCase().includes('wuxia')
    ).slice(0, 3);
  } else if (lowerMsg.includes('音乐') || lowerMsg.includes('music') || lowerMsg.includes('节奏')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('音乐') || g.genreEn.toLowerCase().includes('music') || g.genre.includes('节奏')
    ).slice(0, 3);
  } else if (lowerMsg.includes('休闲') || lowerMsg.includes('casual') || lowerMsg.includes('小') || lowerMsg.includes('消除') || lowerMsg.includes('益智') || lowerMsg.includes('放置')) {
    recommendedGames = games.filter(g => 
      g.genre.includes('休闲') || g.genre.includes('益智') || g.genreEn.toLowerCase().includes('casual') || g.genre.includes('放置')
    ).slice(0, 3);
  } else if (lowerMsg.includes('新') || lowerMsg.includes('new') || lowerMsg.includes('热门') || lowerMsg.includes('hot')) {
    recommendedGames = games.filter(g => g.isHot).slice(0, 3);
  } else {
    recommendedGames = games.slice(0, 3);
  }

  if (recommendedGames.length === 0) {
    recommendedGames = games.slice(0, 3);
  }

  const replyZh = `好的！根据你的需求，我为你推荐以下几款游戏：\n\n${recommendedGames.map((g) => 
    `[${g.id}] ${g.name} | ${g.genre} | ${g.description.slice(0, 30)}...`
  ).join('\n')}\n\n希望你喜欢！还想了解其他类型的游戏吗？`;

  const replyEn = `Great! Based on your preference, I recommend these games:\n\n${recommendedGames.map((g) => 
    `[${g.id}] ${g.nameEn} | ${g.genreEn} | ${g.descriptionEn.slice(0, 30)}...`
  ).join('\n')}\n\nHope you like them! Want to explore more game types?`;

  return {
    reply: locale === 'zh' ? replyZh : replyEn,
    recommendedGames,
  };
}
