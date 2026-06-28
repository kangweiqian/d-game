'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Star, Play, Sparkles, ChevronRight, Shuffle } from 'lucide-react';
import { Game } from '../lib/types';
import { useI18n } from '../context/I18nContext';
import Danmaku from './Danmaku';

interface GameRecommendProps {
  games: Game[];
  onAIRecommendClick?: () => void;
  onRandomGameClick?: () => void;
}

// 从图片提取主色调的函数
function getAverageColor(imgSrc: string): Promise<{ r: number; g: number; b: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      
      const imageData = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }
      
      resolve({
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      });
    };
    img.onerror = () => resolve(null);
    img.src = imgSrc;
  });
}

const genreColors: Record<string, string> = {
  '武侠MMO': 'from-red-500/20 to-orange-500/20',
  '武侠RPG': 'from-amber-500/20 to-yellow-500/20',
  '武侠MMORPG': 'from-blue-500/20 to-indigo-500/20',
  '武侠动作': 'from-orange-500/20 to-red-500/20',
  '武侠放置': 'from-emerald-500/20 to-teal-500/20',
  '武侠经营': 'from-cyan-500/20 to-blue-500/20',
  '休闲益智': 'from-pink-500/20 to-rose-500/20',
  '休闲消除': 'from-purple-500/20 to-pink-500/20',
  '休闲派对': 'from-yellow-500/20 to-green-500/20',
  '休闲跳跃': 'from-lime-500/20 to-green-500/20',
  '休闲竞速': 'from-sky-500/20 to-cyan-500/20',
  '休闲体育': 'from-green-500/20 to-emerald-500/20',
  '放置经营': 'from-teal-500/20 to-green-500/20',
  '飞行射击': 'from-violet-500/20 to-purple-500/20',
  '策略塔防': 'from-blue-500/20 to-cyan-500/20',
  '仙侠RPG': 'from-fuchsia-500/20 to-purple-500/20',
  '仙侠MMO': 'from-indigo-500/20 to-purple-500/20',
  '修仙放置': 'from-violet-500/20 to-fuchsia-500/20',
  '益智文字': 'from-rose-500/20 to-orange-500/20',
};

function getGenreColor(genre: string): string {
  return genreColors[genre] || 'from-gray-500/20 to-gray-600/20';
}

const gameReviews: Record<string, { user: string; userEn: string; avatar: string; content: string; contentEn: string; likes: number }[]> = {
  '1': [
    { user: '五杀小王子', userEn: 'PentaKing', avatar: '👑', content: '王者段位轻松上！', contentEn: 'Easy to reach King tier!', likes: 5678 },
    { user: '峡谷之神', userEn: 'ValleyGod', avatar: '⚡', content: '这波操作秀翻了', contentEn: 'This move is insane!', likes: 4321 },
    { user: '辅助玩家', userEn: 'SupportPlayer', avatar: '🛡️', content: '团战配合太默契了', contentEn: 'Team coordination is perfect!', likes: 2345 },
    { user: '打野大神', userEn: 'JunglePro', avatar: '🗡️', content: '节奏带飞起', contentEn: 'Carrying the tempo!', likes: 3456 },
    { user: '中单法王', userEn: 'MidMage', avatar: '🔥', content: '技能释放太丝滑', contentEn: 'Skills are so smooth!', likes: 2890 },
  ],
  '2': [
    { user: '星穹列车长', userEn: 'TrainCaptain', avatar: '🚂', content: '剧情封神！', contentEn: 'The story is god-tier!', likes: 6789 },
    { user: '开拓者', userEn: 'Trailblazer', avatar: '⭐', content: '画质天花板', contentEn: 'Graphics are top-notch!', likes: 5432 },
    { user: '三月七', userEn: 'March7th', avatar: '📷', content: '每个角色都爱', contentEn: 'Love every character!', likes: 3456 },
    { user: '瓦尔特', userEn: 'Walter', avatar: '🎩', content: '回合制策略拉满', contentEn: 'Turn-based strategy at its best!', likes: 2345 },
  ],
  '3': [
    { user: '安倍晴明', userEn: 'AbeSeimei', avatar: '🔮', content: 'SSR抽到手软', contentEn: 'Got so many SSRs!', likes: 4567 },
    { user: '大天狗', userEn: 'DogTengu', avatar: '🦅', content: '画风太美了', contentEn: 'Art style is beautiful!', likes: 3456 },
    { user: '妖刀姬', userEn: 'YaoDao', avatar: '⚔️', content: '战斗特效炸裂', contentEn: 'Battle effects are explosive!', likes: 2890 },
    { user: '神乐', userEn: 'Kagura', avatar: '🎐', content: '配乐绝了', contentEn: 'Music is amazing!', likes: 2134 },
  ],
  '4': [
    { user: '刀客塔', userEn: 'Doctor', avatar: '🏥', content: '策略深度拉满', contentEn: 'Strategy depth is maxed!', likes: 5678 },
    { user: '阿米娅', userEn: 'Amiya', avatar: ' bunny', content: '立绘太精美', contentEn: 'Illustrations are gorgeous!', likes: 4321 },
    { user: '银灰老板', userEn: 'SilverAsh', avatar: '❄️', content: '真银斩永远的神', contentEn: 'True Silver Slash is legendary!', likes: 3456 },
    { user: '能天使', userEn: 'Exusiai', avatar: '🎯', content: '剧情超有代入感', contentEn: 'Story is so immersive!', likes: 2345 },
  ],
  '5': [
    { user: '骑士君', userEn: 'Knight', avatar: '⚔️', content: '老婆们太可爱了', contentEn: 'Waifus are so cute!', likes: 4567 },
    { user: '佩可莉姆', userEn: 'Pecorine', avatar: '🍳', content: '吃瘪龙超可爱', contentEn: 'Hungry dragon is adorable!', likes: 3456 },
    { user: '凯露', userEn: 'Karyl', avatar: '🐱', content: '臭鼬头梗永流传', contentEn: 'Skunk meme forever!', likes: 2890 },
    { user: '可可萝', userEn: 'Kokkoro', avatar: '🌸', content: '妈妈我好喜欢你', contentEn: 'Mom I really like you!', likes: 2134 },
  ],
  '6': [
    { user: '指挥官', userEn: 'Commander', avatar: '⚓', content: '舰娘收集太上头', contentEn: 'Ship girl collection addictive!', likes: 5678 },
    { user: '企业', userEn: 'Enterprise', avatar: '🦅', content: '老婆+1', contentEn: 'Waifu +1!', likes: 4321 },
    { user: '贝尔法斯特', userEn: 'Belfast', avatar: '👑', content: '女仆长赛高', contentEn: 'Head maid is best!', likes: 3456 },
    { user: '赤城', userEn: 'Akagi', avatar: '🦊', content: '重樱天下第一', contentEn: 'Sakura Empire #1!', likes: 2345 },
  ],
  '7': [
    { user: '御主', userEn: 'Master', avatar: '✨', content: 'fate信仰充值', contentEn: 'Fate fan dedication!', likes: 6789 },
    { user: 'Saber', userEn: 'Saber', avatar: '⚔️', content: '吾王剑锋所指', contentEn: 'My king leads the way!', likes: 5432 },
    { user: '贞德', userEn: 'Jeanne', avatar: '🏰', content: '剧情太感人了', contentEn: 'Story is so touching!', likes: 3456 },
    { user: '金闪闪', userEn: 'Gilgamesh', avatar: '👑', content: '宝具演出炸裂', contentEn: 'Noble Phantasm effects are epic!', likes: 2345 },
  ],
  '8': [
    { user: '乐队主唱', userEn: 'LeadSinger', avatar: '🎤', content: '音乐太好听了！', contentEn: 'Music is amazing!', likes: 3456 },
    { user: '吉他手', userEn: 'Guitarist', avatar: '🎸', content: '节奏游戏天花板', contentEn: 'Rhythm game masterpiece!', likes: 2890 },
    { user: '鼓手', userEn: 'Drummer', avatar: '🥁', content: '少女乐队赛高', contentEn: 'Girl bands are best!', likes: 2134 },
    { user: '键盘手', userEn: 'Keyboardist', avatar: '🎹', content: '每首歌都单曲循环', contentEn: 'Looping every song!', likes: 1876 },
  ],
  '9': [
    { user: '骑空士', userEn: 'SkyRider', avatar: '🚁', content: '碧蓝幻想yyds', contentEn: 'Granblue is the best!', likes: 4567 },
    { user: '露莉亚', userEn: 'Lyria', avatar: '✨', content: '画风太精美了', contentEn: 'Art is exquisite!', likes: 3456 },
    { user: '卡塔莉娜', userEn: 'Katalina', avatar: '⚔️', content: '剧情超宏大', contentEn: 'Story is epic!', likes: 2890 },
    { user: '伊欧', userEn: 'Io', avatar: '📚', content: '角色都超有魅力', contentEn: 'Characters are charming!', likes: 2134 },
  ],
  '10': [
    { user: '制作人', userEn: 'Producer', avatar: '🎵', content: '偶像们太可爱了', contentEn: 'Idols are adorable!', likes: 3456 },
    { user: '粉丝', userEn: 'Fan', avatar: '💖', content: '演唱会超燃', contentEn: 'Live concert is lit!', likes: 2890 },
    { user: '氪金大佬', userEn: 'Whale', avatar: '💎', content: '为了老公们冲', contentEn: 'Spending for the husbandos!', likes: 2134 },
    { user: '音游玩家', userEn: 'RhythmGamer', avatar: '🎮', content: '歌曲都很好听', contentEn: 'Songs are great!', likes: 1876 },
  ],
  '11': [
    { user: '骑士团长', userEn: 'KnightCaptain', avatar: '🛡️', content: '像素风太可爱了', contentEn: 'Pixel art is cute!', likes: 3456 },
    { user: '小公主', userEn: 'LittlePrincess', avatar: '👑', content: '剧情超治愈', contentEn: 'Story is healing!', likes: 2890 },
    { user: '海军舰长', userEn: 'Admiral', avatar: '⚓', content: '玩梗玩到飞起', contentEn: 'Memes everywhere!', likes: 2134 },
    { user: '老骑士', userEn: 'OldKnight', avatar: '🗡️', content: '横版战斗超爽', contentEn: 'Side-scrolling combat is fun!', likes: 1876 },
  ],
  '12': [
    { user: '神格者', userEn: 'GodHolder', avatar: '⚡', content: '动作打击感超棒', contentEn: 'Action combat feels great!', likes: 3456 },
    { user: '月羲九', userEn: 'MoonXi', avatar: '🌙', content: '角色设计太酷了', contentEn: 'Character design is cool!', likes: 2890 },
    { user: '浮士德', userEn: 'Faust', avatar: '🎭', content: '战斗特效炸裂', contentEn: 'Battle effects are explosive!', likes: 2134 },
    { user: '贝黑莫斯', userEn: 'Behemoth', avatar: '🐉', content: '连招超丝滑', contentEn: 'Combos are smooth!', likes: 1876 },
  ],
  '13': [
    { user: '异世界勇者', userEn: 'IsekaiHero', avatar: '🗡️', content: '穿越冒险超有趣', contentEn: 'Isekai adventure is fun!', likes: 2345 },
    { user: '魔王', userEn: 'DemonKing', avatar: '😈', content: '放置就能变强', contentEn: 'Idle game makes you strong!', likes: 1876 },
    { user: '精灵弓手', userEn: 'ElfArcher', avatar: '🏹', content: '立绘很好看', contentEn: 'Artwork is beautiful!', likes: 1567 },
    { user: '贤者', userEn: 'Sage', avatar: '📖', content: '不肝不氪很休闲', contentEn: 'Casual and chill!', likes: 1234 },
  ],
  '14': [
    { user: '青春制作人', userEn: 'Producer', avatar: '💃', content: '小姐姐们太可爱了', contentEn: 'Girls are so cute!', likes: 3456 },
    { user: '粉丝后援', userEn: 'FanClub', avatar: '🎤', content: '养成超有成就感', contentEn: 'Raising is satisfying!', likes: 2890 },
    { user: '舞蹈担当', userEn: 'Dancer', avatar: '💫', content: '舞台演出超棒', contentEn: 'Stage performance is great!', likes: 2134 },
    { user: 'vocal担当', userEn: 'Vocalist', avatar: '🎵', content: '歌曲都很好听', contentEn: 'Songs are lovely!', likes: 1876 },
  ],
  '15': [
    { user: '导航员', userEn: 'Navigator', avatar: '🌟', content: '光灵都太好看了', contentEn: 'Aurorians are beautiful!', likes: 3456 },
    { user: '光灵收集', userEn: 'Collector', avatar: '✨', content: '策略性很强', contentEn: 'Strategy is deep!', likes: 2890 },
    { user: '战斗大师', userEn: 'BattleMaster', avatar: '⚔️', content: '连击系统超爽', contentEn: 'Chain system is fun!', likes: 2134 },
    { user: '剧情党', userEn: 'StoryLover', avatar: '📖', content: '世界观很宏大', contentEn: 'World-building is epic!', likes: 1876 },
  ],
  '16': [
    { user: '人偶师', userEn: 'DollMaker', avatar: '🎎', content: '人偶都超可爱', contentEn: 'Dolls are adorable!', likes: 2890 },
    { user: '解谜达人', userEn: 'Puzzler', avatar: '🧩', content: '玩法很有创意', contentEn: 'Gameplay is creative!', likes: 2345 },
    { user: '剧情党', userEn: 'StoryLover', avatar: '📖', content: '故事很吸引人', contentEn: 'Story is engaging!', likes: 1876 },
    { user: '收集控', userEn: 'Collector', avatar: '🎁', content: '收集欲爆棚', contentEn: 'Collection fever!', likes: 1567 },
  ],
  '17': [
    { user: '佛系玩家', userEn: 'ChillPlayer', avatar: '🧘', content: '挂机就能变强', contentEn: 'Idle to get stronger!', likes: 3456 },
    { user: '收集控', userEn: 'Collector', avatar: '🎴', content: '卡牌收集超上头', contentEn: 'Card collecting is addictive!', likes: 2890 },
    { user: '休闲党', userEn: 'Casual', avatar: '☕', content: '不氪也能玩', contentEn: 'Playable without spending!', likes: 2134 },
    { user: '颜值党', userEn: 'VisualFan', avatar: '💫', content: '立绘太精美了', contentEn: 'Artwork is gorgeous!', likes: 1876 },
  ],
  '18': [
    { user: '拓荒者', userEn: 'Pioneer', avatar: '🗺️', content: '开放世界太自由了', contentEn: 'Open world is so free!', likes: 5678 },
    { user: '莎莉', userEn: 'Shally', avatar: '⚔️', content: '战斗超爽快', contentEn: 'Combat is satisfying!', likes: 4321 },
    { user: '奈美西斯', userEn: 'Nemesis', avatar: '🤖', content: '剧情超震撼', contentEn: 'Story is shocking!', likes: 3456 },
    { user: '探索党', userEn: 'Explorer', avatar: '🔍', content: '地图探索超有趣', contentEn: 'Map exploration is fun!', likes: 2890 },
  ],
  '19': [
    { user: '继承者', userEn: 'Heir', avatar: '⚔️', content: '第七史诗yyds', contentEn: 'Epic Seven is the best!', likes: 4567 },
    { user: '戴丝蒂娜', userEn: 'Destina', avatar: '✨', content: '立绘天花板', contentEn: 'Art is top-tier!', likes: 3456 },
    { user: '瑟琳', userEn: 'Sez', avatar: '🗡️', content: '战斗演出超棒', contentEn: 'Battle animations are great!', likes: 2890 },
    { user: '梅宣', userEn: 'Mercedes', avatar: '🐉', content: '剧情超精彩', contentEn: 'Story is amazing!', likes: 2345 },
  ],
  '20': [
    { user: '唤醒者', userEn: 'Awakener', avatar: '⚔️', content: '角色都超美', contentEn: 'Characters are beautiful!', likes: 2890 },
    { user: '小闪', userEn: 'Flashy', avatar: '✨', content: '回合制策略拉满', contentEn: 'Turn-based strategy maxed!', likes: 2345 },
    { user: '克罗赛尔', userEn: 'Crocel', avatar: '🔥', content: '战斗特效炸裂', contentEn: 'Battle effects explosive!', likes: 1876 },
    { user: '贝蒂', userEn: 'Betty', avatar: '🌸', content: '剧情很有深度', contentEn: 'Story has depth!', likes: 1567 },
  ],
  '21': [
    { user: '传奇玩家', userEn: 'Legend', avatar: '🏆', content: 'MOBA手游天花板', contentEn: 'Best MOBA mobile game!', likes: 5678 },
    { user: '打野王', userEn: 'JungleKing', avatar: '🗡️', content: '节奏带飞起', contentEn: 'Carrying the tempo!', likes: 4321 },
    { user: '中单carry', userEn: 'MidCarry', avatar: '⚡', content: '操作空间很大', contentEn: 'Lots of room for skill!', likes: 3456 },
    { user: '辅助之神', userEn: 'SupportGod', avatar: '🛡️', content: '团队配合超重要', contentEn: 'Team coordination matters!', likes: 2890 },
  ],
  '22': [
    { user: '吃鸡大佬', userEn: 'Winner', avatar: '🐔', content: '今晚吃鸡！', contentEn: 'Winner winner chicken dinner!', likes: 6789 },
    { user: '伏地魔', userEn: 'Camper', avatar: '🌿', content: '苟到最后就是赢', contentEn: 'Survive to win!', likes: 5432 },
    { user: '刚枪王', userEn: 'GunMaster', avatar: '🔫', content: '枪法决定一切', contentEn: 'Aim decides everything!', likes: 4321 },
    { user: '跳伞达人', userEn: 'Paratrooper', avatar: '🪂', content: '地图超大超自由', contentEn: 'Huge map, total freedom!', likes: 3456 },
  ],
  '23': [
    { user: '车神', userEn: 'CarGod', avatar: '🏎️', content: '速度与激情！', contentEn: 'Speed and passion!', likes: 5678 },
    { user: '漂移大师', userEn: 'DriftMaster', avatar: '💨', content: '漂移过弯超帅', contentEn: 'Drifting is so cool!', likes: 4321 },
    { user: '收集控', userEn: 'Collector', avatar: '🚗', content: '豪车收集太爽', contentEn: 'Car collection is fun!', likes: 3456 },
    { user: '竞速玩家', userEn: 'Racer', avatar: '⚡', content: '画面太震撼了', contentEn: 'Graphics are stunning!', likes: 2890 },
  ],
  '24': [
    { user: '史蒂夫', userEn: 'Steve', avatar: '⛏️', content: '万物皆可方块', contentEn: 'Everything is blocks!', likes: 6789 },
    { user: '建筑大师', userEn: 'Architect', avatar: '🏰', content: '只有想不到没有做不到', contentEn: 'Imagine and build!', likes: 5432 },
    { user: '红石大佬', userEn: 'RedstonePro', avatar: '🔴', content: '红石科技永无止境', contentEn: 'Redstone is endless!', likes: 4321 },
    { user: '生存专家', userEn: 'Survivor', avatar: '🗡️', content: '自由度拉满', contentEn: 'Maximum freedom!', likes: 3456 },
  ],
  '25': [
    { user: '主公', userEn: 'Lord', avatar: '👑', content: '策略深度拉满', contentEn: 'Strategy depth maxed!', likes: 5678 },
    { user: '诸葛亮', userEn: 'Strategist', avatar: '🪭', content: '三国迷必玩', contentEn: 'Must-play for Three Kingdoms fans!', likes: 4321 },
    { user: '曹操', userEn: 'CaoCao', avatar: '⚔️', content: '招兵买马打天下', contentEn: 'Build your army!', likes: 3456 },
    { user: '刘备', userEn: 'LiuBei', avatar: '👔', content: '同盟兄弟情', contentEn: 'Alliance brotherhood!', likes: 2890 },
  ],
  '26': [
    { user: '斗地主王', userEn: 'CardKing', avatar: '🃏', content: '癞子玩法超刺激', contentEn: 'Wild card mode is exciting!', likes: 4567 },
    { user: '农民翻身', userEn: 'Farmer', avatar: '🌾', content: '炸弹炸翻天', contentEn: 'Bomb everything!', likes: 3456 },
    { user: '欢乐豆大户', userEn: 'BeanMaster', avatar: '💰', content: '休闲必备神器', contentEn: 'Perfect casual game!', likes: 2890 },
    { user: '牌神', userEn: 'CardGod', avatar: '🎴', content: '不洗牌模式超爽', contentEn: 'No shuffle mode is fun!', likes: 2345 },
  ],
  '27': [
    { user: '足球先生', userEn: 'FootballStar', avatar: '⚽', content: '足球游戏天花板', contentEn: 'Best football game!', likes: 4567 },
    { user: '前锋', userEn: 'Striker', avatar: '🥅', content: '进球的感觉太棒了', contentEn: 'Scoring feels amazing!', likes: 3456 },
    { user: '门将', userEn: 'Goalkeeper', avatar: '🧤', content: '操作手感一流', contentEn: 'Controls are smooth!', likes: 2890 },
    { user: '教练', userEn: 'Coach', avatar: '📋', content: '球队养成超有成就感', contentEn: 'Team building is satisfying!', likes: 2345 },
  ],
  '28': [
    { user: '特种兵', userEn: 'Soldier', avatar: '🎯', content: 'FPS手游天花板', contentEn: 'Best FPS mobile game!', likes: 5678 },
    { user: '狙击手', userEn: 'Sniper', avatar: '🔫', content: '一枪爆头超爽', contentEn: 'One shot headshot!', likes: 4321 },
    { user: '爆破专家', userEn: 'Demolition', avatar: '💣', content: '团队配合很重要', contentEn: 'Teamwork is key!', likes: 3456 },
    { user: '冲锋手', userEn: 'Rusher', avatar: '⚡', content: '画面太真实了', contentEn: 'Graphics are realistic!', likes: 2890 },
  ],
  '29': [
    { user: '飞车党', userEn: 'Rider', avatar: '🏍️', content: '漂移太帅了！', contentEn: 'Drifting is awesome!', likes: 4567 },
    { user: '竞速之王', userEn: 'SpeedKing', avatar: '🏎️', content: '速度感拉满', contentEn: 'Speed feels great!', likes: 3456 },
    { user: '改装达人', userEn: 'Customizer', avatar: '🔧', content: '赛车改装超自由', contentEn: 'Car customization is free!', likes: 2890 },
    { user: '道具赛', userEn: 'ItemRacer', avatar: '🎯', content: '道具赛超欢乐', contentEn: 'Item race is hilarious!', likes: 2345 },
  ],
  '30': [
    { user: '迷你玩家', userEn: 'MiniPlayer', avatar: '🏠', content: '沙盒创造太有趣', contentEn: 'Sandbox creation is fun!', likes: 3456 },
    { user: '建筑师', userEn: 'Builder', avatar: '🏰', content: '想象力就是一切', contentEn: 'Imagination is everything!', likes: 2890 },
    { user: '冒险家', userEn: 'Adventurer', avatar: '🗺️', content: '探索未知世界', contentEn: 'Explore the unknown!', likes: 2134 },
    { user: '创造者', userEn: 'Creator', avatar: '✨', content: 'Q版画风超可爱', contentEn: 'Cute art style!', likes: 1876 },
  ],
  '31': [
    { user: '盟主', userEn: 'AllianceLeader', avatar: '👑', content: '率土之滨yyds', contentEn: 'Rate of Land is the best!', likes: 4567 },
    { user: '谋士', userEn: 'Advisor', avatar: '📜', content: '策略深度拉满', contentEn: 'Strategy depth maxed!', likes: 3456 },
    { user: '将军', userEn: 'General', avatar: '⚔️', content: '国战超燃', contentEn: 'Nation war is epic!', likes: 2890 },
    { user: '太守', userEn: 'Governor', avatar: '🏯', content: '同盟兄弟一起打天下', contentEn: 'Alliance brothers unite!', likes: 2345 },
  ],
  '32': [
    { user: '棋圣', userEn: 'ChessMaster', avatar: '♟️', content: '象棋益智健脑', contentEn: 'Chess is brain training!', likes: 2345 },
    { user: '大爷', userEn: 'Elder', avatar: '👴', content: '残局挑战超有意思', contentEn: 'Endgame puzzles are fun!', likes: 1876 },
    { user: '棋友', userEn: 'ChessFriend', avatar: '🎯', content: '在线对弈很方便', contentEn: 'Online play is convenient!', likes: 1567 },
    { user: '新手', userEn: 'Beginner', avatar: '📖', content: '新手教程很友好', contentEn: 'Beginner tutorial is helpful!', likes: 1234 },
  ],
  '33': [
    { user: '江湖小白', userEn: 'JianghuNovice', avatar: '🗡️', content: '画质真的绝了，江湖感拉满！', contentEn: 'Graphics are stunning, full Jianghu vibes!', likes: 2341 },
    { user: '剑舞倾城', userEn: 'SwordDancer', avatar: '🌸', content: '轻功系统太帅了', contentEn: 'Qigong system is amazing!', likes: 1856 },
    { user: '逍遥子', userEn: 'FreeSpirit', avatar: '🍃', content: '剧情很有代入感', contentEn: 'Story is immersive!', likes: 1203 },
    { user: '武侠迷', userEn: 'WuxiaFan', avatar: '⚔️', content: '这特效绝了！', contentEn: 'Effects are incredible!', likes: 3421 },
    { user: '月下独酌', userEn: 'MoonDrinker', avatar: '🌙', content: '捏脸系统太好玩了', contentEn: 'Character customization is fun!', likes: 2156 },
  ],
  '34': [
    { user: '武侠迷', userEn: 'WuxiaFan', avatar: '⚔️', content: '天涯明月刀yyds！', contentEn: 'Moon Blade is the best!', likes: 3421 },
    { user: '月下独酌', userEn: 'MoonDrinker', avatar: '🌙', content: '画质细腻', contentEn: 'Graphics are detailed!', likes: 2156 },
    { user: '楚留香', userEn: 'ChuLiuxiang', avatar: '🍷', content: '门派平衡做得不错', contentEn: 'Class balance is good!', likes: 1678 },
    { user: '江湖小白', userEn: 'JianghuNovice', avatar: '🗡️', content: '轻功飞来飞去超爽', contentEn: 'Flying with Qigong is fun!', likes: 2341 },
  ],
  '35': [
    { user: '乔峰', userEn: 'QiaoFeng', avatar: '🐉', content: '剑侠世界情怀党必玩！', contentEn: 'Must-play for JX fans!', likes: 4532 },
    { user: '段誉', userEn: 'DuanYu', avatar: '📖', content: '轻功水上漂太帅了', contentEn: 'Water walking is cool!', likes: 2890 },
    { user: '虚竹', userEn: 'XuZhu', avatar: '🙏', content: '珍珑棋局设计有创意', contentEn: 'Puzzle design is creative!', likes: 1567 },
    { user: '阿朱', userEn: 'AZhu', avatar: '💮', content: '画面太美了', contentEn: 'Scenery is beautiful!', likes: 1987 },
  ],
};

export default function GameRecommend({ games, onAIRecommendClick, onRandomGameClick }: GameRecommendProps) {
  const { locale } = useI18n();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const playingIndexRef = useRef<number | null>(null);
  const [bgColors, setBgColors] = useState<Record<number, string>>({});
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playingIndexRef.current = playingIndex;
  }, [playingIndex]);

  // 提取图片主色调
  useEffect(() => {
    games.forEach(async (game, index) => {
      if (!bgColors[index]) {
        const color = await getAverageColor(game.icon || game.cover);
        if (color) {
          const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
          setBgColors(prev => ({ ...prev, [index]: colorString }));
        }
      }
    });
  }, [games, bgColors]);

  // Intersection Observer 用于自动播放/暂停视频（root=滚动容器）
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let firstVisible: number | undefined;
        const newVisibleIndices = new Set<number>();

        entries.forEach((entry) => {
          const index = Array.from(cardRefs.current.entries()).find(
            ([, ref]) => ref === entry.target
          )?.[0];

          if (typeof index === 'number') {
            if (entry.isIntersecting) {
              newVisibleIndices.add(index);
            }
            if (!entry.isIntersecting && playingIndexRef.current === index) {
              videoRefs.current.get(index)?.pause();
              setPlayingIndex(null);
            }
            if (entry.isIntersecting && firstVisible === undefined) {
              firstVisible = index;
            }
          }
        });

        // 更新可见性状态
        setVisibleIndices(newVisibleIndices);

        if (firstVisible !== undefined && playingIndexRef.current !== firstVisible) {
          if (playingIndexRef.current !== null) {
            videoRefs.current.get(playingIndexRef.current)?.pause();
          }
          videoRefs.current.get(firstVisible)?.play()?.catch(() => {});
          setPlayingIndex(firstVisible);
        }
      },
      {
        root,
        threshold: 0.6,
        rootMargin: '0px',
      }
    );

    cardRefs.current.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [games]);

  const setVideoRef = useCallback((index: number, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(index, el);
    } else {
      videoRefs.current.delete(index);
    }
  }, []);

  const setCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(index, el);
    } else {
      cardRefs.current.delete(index);
    }
  }, []);

  const togglePlay = useCallback((index: number) => {
    const video = videoRefs.current.get(index);
    if (!video) return;

    if (playingIndex === index) {
      // 正在播放，点击则暂停
      video.pause();
      setPlayingIndex(null);
    } else {
      // 暂停上一个视频
      if (playingIndex !== null) {
        const prevVideo = videoRefs.current.get(playingIndex);
        if (prevVideo) {
          prevVideo.pause();
        }
      }
      // 播放当前视频
      video.play().catch(() => {});
      setPlayingIndex(index);
    }
  }, [playingIndex]);

  const isVideoPaused = useCallback((index: number) => {
    // 显示播放图标：当前视频未在播放
    return playingIndex !== index;
  }, [playingIndex]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="px-4 pt-4">
        <div className="flex gap-3">
          {/* AI 智能找游戏 */}
          <button
            onClick={onAIRecommendClick}
            className="flex-1 relative overflow-hidden rounded-2xl h-20 group"
          >
            {/* 主背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-700" />
            {/* 光泽效果 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
            {/* 边框 */}
            <div className="absolute inset-0 rounded-2xl border border-white/[0.06]" />
            {/* hover 光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300" />
            
            <div className="relative z-10 flex items-center gap-3 h-full px-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-5 h-5 text-dark-900" />
                </div>
                {/* 图标光晕 */}
                <div className="absolute inset-0 w-10 h-10 rounded-xl gold-gradient-bg blur-md opacity-50 -z-10" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {locale === 'zh' ? 'AI 找游戏' : 'AI Finder'}
                </span>
                <span className="text-[10px] text-gray-500 block truncate mt-0.5">
                  {locale === 'zh' ? '精准推荐 · 智能匹配' : 'Smart Picks · AI Match'}
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-dark-600/80 flex items-center justify-center border border-white/10 group-hover:border-primary-400/30 transition-colors">
                <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-primary-400 transition-colors" />
              </div>
            </div>
          </button>

          {/* 抽一款小游戏 */}
          <button
            onClick={onRandomGameClick}
            className="flex-1 relative overflow-hidden rounded-2xl h-20 group"
          >
            {/* 主背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-700" />
            {/* 光泽效果 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
            {/* 边框 */}
            <div className="absolute inset-0 rounded-2xl border border-white/[0.06]" />
            {/* hover 光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/5 transition-all duration-300" />
            
            <div className="relative z-10 flex items-center gap-3 h-full px-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Shuffle className="w-5 h-5 text-white" />
                </div>
                {/* 图标光晕 */}
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-50 -z-10" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {locale === 'zh' ? '抽小游戏' : 'Random'}
                </span>
                <span className="text-[10px] text-gray-500 block truncate mt-0.5">
                  {locale === 'zh' ? '试试手气 · 惊喜不断' : 'Try Luck · Surprises'}
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-dark-600/80 flex items-center justify-center border border-white/10 group-hover:border-purple-400/30 transition-colors">
                <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-5 px-4 mt-4">
        {games.map((game, index) => {
          const colorClass = getGenreColor(locale === 'zh' ? game.genre : game.genreEn);
          const bgColor = bgColors[index];

          return (
            <div
              key={game.id}
              ref={(el) => setCardRef(index, el)}
              data-index={index}
              className="rounded-2xl overflow-hidden"
            >
              <div className="flex gap-3">
                {/* 左侧：图标、视频和标题 - 可点击进入详情页 */}
                <Link
                  href={`/game/${game.id}`}
                  className={`w-[34%] shrink-0 rounded-xl p-2.5 bg-gradient-to-br ${colorClass} flex flex-col relative overflow-hidden cursor-pointer`}
                  style={{
                    backgroundColor: bgColor ? `${bgColor}33` : undefined,
                  }}
                >
                  {/* 背景高斯模糊层 */}
                  {bgColor && (
                    <>
                      <div
                        className="absolute inset-0 backdrop-blur-xl opacity-50"
                        style={{ backgroundColor: bgColor }}
                      />
                      <div className="absolute inset-0 backdrop-blur-sm" />
                    </>
                  )}

                  {/* 图片 */}
                  <div className="relative z-10 w-full aspect-square rounded-lg overflow-hidden">
                    <img
                      src={game.icon || game.cover}
                      alt={locale === 'zh' ? game.name : game.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 标题 - 居中 */}
                  <h3 className="font-bold text-white text-xs truncate mt-2 text-center relative z-10">
                    {locale === 'zh' ? game.name : game.nameEn}
                  </h3>
                  <div className="text-center relative z-10">
                    {/* 显示游戏类型 + 标签，用 · 分隔，最多2个 */}
                    {(() => {
                      const genreText = locale === 'zh' ? game.genre : game.genreEn;
                      const allTags = locale === 'zh' ? game.tags : game.tagsEn;
                      const filteredTags = allTags.filter(tag => !genreText.toLowerCase().includes(tag.toLowerCase()));
                      const displayTags = [genreText, ...filteredTags.slice(0, 1)];
                      return (
                        <span className="text-[10px] font-medium text-white/70 whitespace-nowrap">
                          {displayTags.join(' · ')}
                        </span>
                      );
                    })()}
                  </div>
                </Link>

                <div className="flex-1 rounded-xl overflow-hidden relative bg-dark-800 aspect-video">
                  {/* 游戏宣传图 - 只有可见时才带 Ken Burns 动效 */}
                  <img
                    src={game.screenshots?.[1] || game.screenshots?.[0] || game.cover}
                    alt=""
                    className={`w-full h-full object-cover absolute inset-0 transition-transform duration-700 ${
                      visibleIndices.has(index) ? (
                        index % 3 === 0 ? 'animate-ken-burns' :
                        index % 3 === 1 ? 'animate-ken-burns-slow' :
                        'animate-ken-burns-fast'
                      ) : 'scale-100'
                    }`}
                    style={{ animationDelay: visibleIndices.has(index) ? `${index * 0.5}s` : '0s' }}
                  />
                  {game.video ? (
                    <>
                      <video
                        ref={(el) => setVideoRef(index, el)}
                        src={game.video}
                        poster={game.screenshots?.[1] || game.screenshots?.[0] || game.cover}
                        loop
                        playsInline
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover absolute inset-0 z-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {isVideoPaused(index) && (
                        <div
                          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-black/30"
                          onClick={() => togglePlay(index)}
                        >
                          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-2xl hover:scale-110 transition-transform animate-float">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border-2 border-white/30 animate-float">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                  {/* 顶部光效 */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10 animate-shimmer" />
                  {/* 底部渐变 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
                  {/* 弹幕 */}
                  {game.video && (
                    <Danmaku
                      comments={gameReviews[game.id] || [
                        { user: '玩家123', userEn: 'Player123', avatar: '🎮', content: '这款游戏太好玩了！', contentEn: 'This game is so fun!', likes: 999 },
                        { user: '游戏达人', userEn: 'ProGamer', avatar: '⭐', content: '画质精美，五星好评', contentEn: 'Great graphics, 5 stars!', likes: 666 },
                        { user: '小白玩家', userEn: 'Newbie', avatar: '🌟', content: '新手友好', contentEn: 'Beginner friendly', likes: 333 },
                      ]}
                      isPlaying={playingIndex === index}
                      locale={locale}
                    />
                  )}
                </div>
              </div>

              <div className="px-3 pt-3 pb-4" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 15, 15, 0.8) 100%)' }}>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                  {locale === 'zh' ? game.description : game.descriptionEn}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                    <span className="text-xs font-bold text-white">{game.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {locale === 'zh' ? `${game.downloads} 下载` : `${game.downloadsEn} downloads`}
                  </span>
                  <div className="flex-1" />
                  <Link href={`/game/${game.id}`}>
                    <button className="px-4 py-2 rounded-xl gold-gradient-bg text-dark-900 text-xs font-bold hover:scale-105 active:scale-95 transition-transform">
                      {locale === 'zh' ? '玩一玩' : 'Play'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
