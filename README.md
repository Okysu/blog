# 小于同学的异世界

基于 Valaxy 1.2.0。现有博客使用 Editorial 主题；主题源码和 demo 在独立目录中开发，文章原稿仍位于 pages/posts。

## 本地运行

要求 Node.js 22.12+，建议 Node.js 24。仓库固定 pnpm 12.4.2。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

pnpm build 执行 SSG 并生成 RSS。GitHub Actions 与 Docker 构建环境已切换到 Node.js 24 和 pnpm。

## AI 摘要

autoSummary.ts 在构建前处理 `excerpt_type: ai` 且未填写 excerpt 的已发表 Markdown。支持嵌套目录，保留已有摘要，跳过草稿；请求失败不会覆盖正文或写入不完整摘要。

环境变量：

- OPENAI_API_KEY：服务密钥；未配置时跳过自动摘要，本地运行和构建仍然可用。
- OPENAI_BASE_URL：服务地址，默认 https://api.deepseek.com。仅追加 /chat/completions，不自动添加 /v1。网关需要 /v1 时将它写在此变量中。
- SKIP_AI_SUMMARY=1：离线验证时关闭摘要请求。

默认模型为 deepseek-flash，关闭思考模式，完整传入文章，不做小字符上限截断。服务端校验其 1M-token 上下文窗口；字符数不等于 token 数。输出预算 512 tokens，提示词要求约 150 字中文摘要。请求超时为 5 分钟，文章按顺序处理。

PowerShell 示例：

```powershell
$env:OPENAI_BASE_URL = 'https://your-gateway.example/api'
$env:OPENAI_API_KEY = 'your-key'
pnpm build
```

密钥仅通过环境变量读取，不写入前端。CI 从同名 GitHub Secrets 读取。测试使用模拟响应，包含超过 100 万字符的完整输入、路径拼接、错误结果、草稿和嵌套文件检查。

## Editorial 新主题

```sh
cd valaxy-theme-editorial
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm pack:theme
pnpm smoke:consumer
```

[主题工作区说明](valaxy-theme-editorial/README.md) · [安装和配置](valaxy-theme-editorial/theme/README.md)

demo 收录现有的 11 篇文章。仅在 demo 为没有 date 的文章补上 Git 首次提交时间，并启用本地摘录，不改变原文内容。/reading-lab 是独立的排版测试页，覆盖长标题、目录、代码、表格与图片。草稿只用于开发预览。

博客通过 vendor/ 中已提交的源码归档安装 Editorial，CI 与 Docker 无需依赖本机 link 路径。友链已迁移到 EditorialFriendList，保留原始 public/l.json 和随机排序；标签、分类与归档地址保持不变。主题没有发布到 npm。

## 内容与配置

- pages/：Markdown 文章和普通页面。
- site.config.ts：站点身份、域名、社交链接。
- valaxy.config.ts：主题、Mermaid 插件及自动摘要钩子。
- components/、layouts/、styles/：现有博客的自定义扩展。
- valaxy-theme-editorial/theme/：可移植的源码主题包。
- valaxy-theme-editorial/demo/：主题消费站点。

Docker：

```sh
docker build . -t okysu-blog
```

当前站点域名仍沿用 site.config.ts 的配置；没有自动改动现有文章地址或执行部署。


## 同步主题源码到博客

修改 theme/ 后，在根目录执行 pnpm theme:sync，再运行 pnpm build。此命令重新打包主题、复制归档到 vendor/，并更新当前博客依赖与锁文件；提交源码时一并提交 vendor/ 归档和锁文件。
