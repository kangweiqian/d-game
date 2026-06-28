# AI 找游戏功能智能化升级计划

## 1. 现状分析

### 1.1 当前实现

- **API 调用**：使用 Qwen（通义千问）API 进行游戏推荐
- **Mock 模式**：无 API Key 时，基于关键词匹配返回游戏
- **系统提示词**：仅关注游戏推荐，无法处理其他类型问题
- **回复解析**：提取回复中的 `[游戏ID]` 格式来识别推荐游戏
- **问题**：无论用户输入什么内容，都会强制返回游戏推荐，缺乏灵活性

### 1.2 相关文件

| 文件路径 | 作用 |
|---------|------|
| `src/lib/qwen.ts` | AI API 调用、系统提示词、Mock 推荐逻辑、游戏推荐解析 |
| `src/components/AIRecommend.tsx` | AI 对话界面组件、消息处理 |
| `src/lib/types.ts` | ChatMessage 类型定义 |
| `src/data/games.ts` | 游戏数据 |

### 1.3 当前 Mock 逻辑

Mock 模式仅支持以下关键词匹配：
- RPG/角色扮演 → 返回 RPG 游戏
- 休闲/小游戏 → 返回休闲游戏
- MOBA/竞技/对战 → 返回竞技游戏
- 新/热门/hot → 返回热门游戏
- 其他 → 默认返回前 3 个游戏

## 2. 需求分析

用户希望 AI 找游戏功能更智能：

1. **智能识别意图**：根据用户输入判断是否与游戏相关
2. **游戏相关输入**：正常推荐游戏
3. **非游戏相关输入**：给出友好的不同回答，而不是硬塞游戏推荐
4. **多种场景**：支持多种非游戏场景的智能回复

## 3. 方案设计

### 3.1 意图分类

将用户输入分为以下几类：

| 意图类型 | 说明 | 示例 |
|---------|------|------|
| **game_recommend** | 明确要求推荐游戏 | "推荐好玩的游戏"、"有什么 RPG 游戏" |
| **game_query** | 询问游戏相关信息 | "原神好玩吗"、"崩坏星穹铁道类型" |
| **casual_chat** | 闲聊/打招呼 | "你好"、"你是谁"、"今天天气怎么样" |
| **off_topic** | 完全无关话题 | "帮我写代码"、"翻译一下"、"数学题怎么做" |
| **greeting** | 问候语 | "你好"、"嗨"、"hi" |
| **thanks** | 感谢 | "谢谢"、"感谢"、"thanks" |

### 3.2 Mock 模式增强（无 API Key 时使用）

在 `getMockRecommendation` 函数中增加意图识别逻辑：

1. **关键词匹配**：使用关键词列表判断用户意图
2. **场景化回复**：不同意图返回不同的回复内容
3. **优雅降级**：非游戏问题友好引导用户回到游戏话题

### 3.3 API 模式增强（有 API Key 时使用）

更新系统提示词，让 AI 能够：

1. **识别意图**：判断用户是否在问游戏相关问题
2. **灵活回复**：非游戏问题可以正常对话，但最终引导回游戏
3. **保持人设**：始终以 D-GAME 游戏推荐助手的身份回复

### 3.4 回复格式优化

为了正确解析 AI 回复，约定：

- **有游戏推荐时**：回复中包含 `[游戏ID]` 格式的游戏引用
- **无游戏推荐时**：回复中不包含 `[数字]` 格式，直接返回纯对话内容

## 4. 具体修改内容

### 4.1 修改 `src/lib/qwen.ts`

#### 4.1.1 更新系统提示词

**中文提示词**：
```
你是一位专业的东南亚手游推荐专家，名叫D-GAME助手。

游戏库（每款游戏格式：ID. 游戏名 (类型) - 简介）：
${gameListStr}

回复规则：
1. 如果用户询问游戏相关的问题或寻求游戏推荐，请从游戏库中推荐最适合的2-3款游戏
2. 如果用户的问题与游戏无关，可以先友好回应用户的问题，然后礼貌地引导用户询问游戏相关内容
3. 推荐游戏时，每款游戏格式：[游戏ID] 游戏名称 | 类型 | 推荐理由（30字以内）
4. 不推荐游戏时，不要使用 [数字] 格式，正常对话即可
5. 保持亲切友好的语气，像朋友一样聊天
```

**英文提示词**：
```
You are a professional mobile game recommendation expert for Southeast Asia, called D-GAME Assistant.

Game library (format: ID. Game name (Genre) - Description):
${gameListStr}

Response rules:
1. If the user asks about games or wants game recommendations, recommend 2-3 most suitable games from the library
2. If the user's question is not game-related, respond friendly first, then politely guide back to game topics
3. When recommending games, format: [Game ID] Game Name | Genre | Reason (within 30 words)
4. When not recommending games, don't use [number] format, just chat normally
5. Keep a friendly and warm tone, like chatting with a friend
```

#### 4.1.2 增强 Mock 推荐逻辑

新增 `detectIntent` 函数，根据关键词识别用户意图：

```typescript
function detectIntent(message: string, locale: 'zh' | 'en'): {
  type: 'game_recommend' | 'game_query' | 'greeting' | 'thanks' | 'casual_chat' | 'off_topic';
  keywords?: string[];
}
```

**关键词分类**：

| 意图 | 中文关键词 | 英文关键词 |
|-----|-----------|-----------|
| game_recommend | 推荐、好玩、游戏、手游、玩什么、找游戏、有什么 | recommend, game, mobile game, fun, what to play, suggest |
| game_query | 好玩吗、怎么样、类型、介绍、详情、怎么玩 | is it good, how, type, detail, how to play |
| greeting | 你好、嗨、哈喽、hi、hello、在吗 | hi, hello, hey, hi there, yo |
| thanks | 谢谢、感谢、多谢、thanks、thank you | thanks, thank you, appreciate, thx |
| casual_chat | 天气、吃饭、名字、你是谁、你叫什么 | weather, eat, name, who are you, your name |

#### 4.1.3 场景化回复模板

为每种非游戏场景准备多种回复模板，随机选择增加多样性：

**greeting（问候）**：
- "你好呀！我是 D-GAME 助手，专门帮你找到好玩的手游~ 想找什么类型的游戏呢？"
- "嗨嗨！欢迎来到 D-GAME 🎮 有什么我可以帮你的吗？想找好玩的游戏吗？"
- "Hello！我是你的游戏推荐小助手，想玩点什么类型的游戏呀？"

**thanks（感谢）**：
- "不客气~ 希望你能找到喜欢的游戏！还有其他想了解的吗？"
- "能帮到你就好啦 😊 还想找其他类型的游戏吗？"
- "不用谢！随时可以来找我推荐游戏哦~"

**casual_chat（闲聊）**：
- "哈哈，这个话题很有趣呢！不过说到好玩的，要不要我给你推荐几款超棒的手游？🎮"
- "嗯嗯，说到这个... 对了，最近有几款新游戏超火的，想了解一下吗？"
- "有意思！不过我更擅长推荐游戏哦~ 想玩什么类型的，我帮你找找？"

**off_topic（无关话题）**：
- "这个问题我可能不太擅长呢 😅 不过找游戏我可是专业的！想玩什么类型的游戏呀？"
- "哈哈，这个我不太懂啦~ 但说到游戏我可是行家！需要我推荐几款好玩的手游吗？"
- "抱歉哦，我主要是帮大家找游戏的~ 想找什么类型的游戏，我可以帮你推荐！"

### 4.2 保持 `src/components/AIRecommend.tsx` 不变

UI 层不需要修改，因为回复格式兼容：
- 有推荐游戏时，`recommendedGames` 数组有值，正常渲染
- 无推荐游戏时，`recommendedGames` 为空，只显示文字回复

### 4.3 保持 `src/lib/types.ts` 不变

类型定义已经满足需求，`recommendedGames` 是可选字段。

## 5. 实现步骤

1. **更新系统提示词**：修改 `qwen.ts` 中英文系统提示词，增加非游戏场景处理规则
2. **新增意图识别函数**：添加 `detectIntent` 函数，基于关键词判断用户意图
3. **重构 Mock 推荐逻辑**：将 `getMockRecommendation` 改为根据意图返回不同内容
4. **添加回复模板**：为各种场景准备多种回复模板，随机选择
5. **测试验证**：测试各种输入场景，确保回复正确

## 6. 风险与注意事项

### 6.1 API 模式风险
- AI 可能不按约定格式回复 → 解析函数已有容错处理，解析不到游戏就返回空数组
- AI 可能在非游戏话题中也带游戏 ID → 解析函数会提取，但用户体验影响不大

### 6.2 Mock 模式风险
- 关键词匹配可能不准确 → 尽量覆盖常见关键词，模糊匹配
- 回复可能显得生硬 → 准备多种模板，随机选择，增加自然感

### 6.3 兼容性
- 保持现有 API 接口不变，UI 层无需修改
- `parseGameRecommendations` 函数保持原样，解析不到游戏时返回空数组

## 7. 验证方法

测试以下场景，确认回复正确：

1. **游戏推荐**：输入"推荐好玩的游戏" → 应返回游戏推荐卡片
2. **游戏查询**：输入"原神好玩吗" → 应返回游戏推荐
3. **问候**：输入"你好" → 应返回问候语+引导，无游戏卡片
4. **感谢**：输入"谢谢" → 应返回感谢回复+引导，无游戏卡片
5. **闲聊**：输入"今天天气怎么样" → 应友好回应+引导回游戏
6. **无关话题**：输入"帮我写个 Python 脚本" → 应礼貌说明+引导回游戏
