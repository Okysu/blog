# Valaxy Theme Editorial

为 Okysu 的技术与生活记录设计的独立主题工作区。基于官方 starter，采用 theme/ + demo/，兼容 Valaxy 1.2.0。

视觉保持简洁：暖白／炭黑底色、衬线标题、少量青绿色、细线网格。通过精选文章、标签、搜索、精修目录和代码高亮建立层次。

```sh
pnpm install
pnpm dev
pnpm check
pnpm pack:theme
pnpm smoke:consumer
```

- theme/：源码分发的主题包，详见 [主题说明](theme/README.md)。
- demo/：11 篇当前博客文章，/reading-lab 为独立排版测试页，草稿不出现在生产中。
- tests/：摘录处理与 starter 初始化测试。
- scripts/smoke-consumer.mjs：归档在工作区外的消费验证。

新工作区已初始化，后续不再运行 theme:init。pnpm build 明确执行 SSG。开发命令不发布 npm，也不部署。
