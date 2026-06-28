# 部署指南

本项目使用 Vercel 部署，可以快速将游戏推荐平台发布到公网。

## 部署到 Vercel

### 方式一：GitHub 导入（推荐）

1. **准备 GitHub 仓库**
   - 将项目推送到 GitHub
   - 确保 `vercel.json` 已包含在项目中

2. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

4. **配置环境变量**（重要！）
   - 在项目设置中找到 "Environment Variables"
   - 添加以下变量：
     - `Name`: `QWEN_API_KEY`
     - `Value`: 你的通义千问 API 密钥
   - 申请地址：https://dashscope.console.aliyun.com/

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 部署成功后获得 URL：`your-project.vercel.app`

### 方式二：Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 进入项目目录
cd d-game

# 部署（测试环境）
vercel

# 部署（生产环境）
vercel --prod
```

## 部署后配置

### 1. 获取 API 密钥

AI 推荐功能需要通义千问 API：

1. 访问[阿里云百炼平台](https://dashscope.console.aliyun.com/)
2. 注册/登录账号
3. 创建应用，获取 API Key
4. 在 Vercel 项目设置中添加 `QWEN_API_KEY` 环境变量

### 2. 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待域名生效

## 访问地址

部署成功后：
- **自动域名**：`your-project.vercel.app`
- **自定义域名**：`your-domain.com`（如已配置）

## 注意事项

### ⚠️ 文件大小限制

Vercel 免费版限制：
- 单个文件最大 **100MB**
- 带宽 **100GB/月**

当前项目包含约 60MB 的视频文件，确保总大小不超限。

### 视频优化建议

如需优化，可考虑：
1. 压缩视频文件大小
2. 使用视频 CDN 服务
3. 迁移视频到对象存储

### HTTPS

Vercel 自动提供 HTTPS 证书，无需额外配置。

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 API 密钥

# 启动开发服务器
npm run dev
```

## 故障排查

### 部署失败

1. 检查构建日志
2. 确保所有依赖正确安装
3. 验证环境变量配置

### AI 推荐功能不工作

1. 检查 `QWEN_API_KEY` 是否正确设置
2. 确认 API 密钥有余额
3. 查看浏览器控制台错误信息

### 视频无法播放

1. 检查视频文件大小是否超限
2. 确认视频文件格式受支持（MP4）
3. 检查浏览器控制台错误信息

## 技术支持

如有问题，请检查：
1. Vercel Dashboard 的部署日志
2. 浏览器开发者工具的 Network 和 Console
3. 项目 GitHub Issues
