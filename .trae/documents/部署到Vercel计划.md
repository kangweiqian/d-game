# 游戏平台部署到 Vercel 计划

## Summary

将 Next.js 14 游戏推荐平台部署到 Vercel，实现公网可访问。关键决策：
- 部署平台：Vercel（免费版）
- 视频处理：继续使用本地文件（注意100MB限制）
- HTTPS：Vercel 自动提供
- 域名：可选（Vercel 提供免费子域名）

## Current State Analysis

**项目技术栈：**
- Next.js 14.2.35 + React 18 + TypeScript
- PWA 支持（@ducanh2912/next-pwa）
- 国际化（next-intl，支持中英文）
- framer-motion 动画
- 视频文件：30+ 个本地视频（约60MB）
- AI 推荐功能：使用通义千问 API

**当前配置：**
- 构建命令：`npm run build`
- 输出目录：`.next`
- 端口：3000/3001（开发模式）

## Proposed Changes

### 1. 创建 Vercel 配置文件

**文件：** `/d-game/vercel.json`

**内容：**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hnd1"], // 日本节点，延迟较低
  "headers": [
    {
      "source": "/videos/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**原因：** Vercel 默认配置文件，优化视频文件缓存策略。

### 2. 创建 .env.example 文件

**文件：** `/d-game/.env.example`

**内容：**
```
# 通义千问 API 密钥（用于AI推荐功能）
QWEN_API_KEY=your_api_key_here
```

**原因：** 提醒开发者需要配置 API 密钥，防止密钥提交到 Git。

### 3. 更新 .gitignore

**文件：** `/d-game/.gitignore`

**添加内容：**
```
# 临时文件
.tmp
*.tmp

# 编译产物（Vercel会自动构建）
.next
```

**原因：** 排除临时文件和本地构建产物。

### 4. 创建部署文档

**文件：** `/d-game/DEPLOY.md`

**内容：**
1. Vercel 账号注册/登录
2. 导入 GitHub 仓库
3. 配置环境变量
4. 部署步骤
5. 自定义域名（可选）
6. 注意事项（视频文件大小限制）

**原因：** 提供清晰的部署指南。

## Assumptions & Decisions

1. **Vercel 免费版限制：**
   - 100GB 带宽/月（足够）
   - 100MB 单文件限制（视频文件需要优化）
   - 注意：当前视频约60MB，需确保不超限

2. **视频文件处理：**
   - 决定继续使用本地文件
   - 如后续超限，建议压缩视频或迁移到 CDN

3. **API 密钥安全：**
   - 密钥存储在 Vercel 环境变量中
   - 不提交到 Git 仓库

4. **PWA 支持：**
   - Vercel 原生支持 PWA
   - Service Worker 正常工作

## Verification Steps

1. **本地验证：**
   ```bash
   npm run build  # 确保构建成功
   ```

2. **Vercel 部署：**
   - 登录 Vercel Dashboard
   - 导入项目
   - 配置环境变量（QWEN_API_KEY）
   - 点击 Deploy

3. **验证内容：**
   - [ ] 主页可访问
   - [ ] 游戏详情页正常
   - [ ] AI 推荐功能可用
   - [ ] 视频播放正常
   - [ ] 中英文切换正常
   - [ ] PWA 功能正常

4. **性能检查：**
   - Lighthouse 评分
   - 移动端兼容性

## 部署后访问

- Vercel 提供免费子域名：`your-project.vercel.app`
- 可绑定自定义域名
