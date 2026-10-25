# valaxy-theme-editorial

一个安静、完整的 Valaxy 阅读主题。暖白与炭黑配色、系统衬线标题、带精选手记的首页、可搜索归档、标签筛选、独立文章目录，以及经过深浅色适配的代码高亮。无需外部字体或 UI 库。

基于官方 valaxy-theme-starter，保留其 MIT 许可。要求 Node.js 22.12+、Valaxy 1.2.x、Vue 3.5.41+、Vue Router 5。

## 安装

尚未发布 npm；在本工作区执行 `pnpm pack:theme` 得到归档，再在博客中安装：

```sh
pnpm add ./valaxy-theme-editorial-0.1.0.tgz valaxy@1.2.0 vue@^3.5.41 vue-router@^5.0.3
```

`valaxy.config.ts`：

```ts
import type { ThemeConfig } from 'valaxy-theme-editorial'
import { defineValaxyConfig } from 'valaxy'

export default defineValaxyConfig<ThemeConfig>({
  theme: 'editorial',
  themeConfig: {
    eyebrow: 'NOTES / 随笔与记录',
    introNote: '把经历写成文字，\n把好奇留给明天。',
    homePostCount: 8,
    showOutline: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/archives/' },
      { text: '关于', link: '/about/' },
    ],
    footer: { since: 2016, text: '慢慢记录。', beian: '' },
  },
})
```

站点标题、副标题、作者、社交链接、语言、时区和域名由消费者的 `site.config.ts` 提供，主题不硬编码个人身份。可以启用 Valaxy 的本地摘录补全列表文本：

```ts
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  title: '我的博客',
  subtitle: '写代码，也写生活。',
  url: 'https://example.com/',
  lang: 'zh-CN',
  timezone: 'Asia/Hong_Kong',
  author: { name: 'Your name' },
  excerpt: { auto: true, length: 180, type: 'text' },
})
```

## 配置与布局

- `wordmark`：导航中的短字标，默认使用站点作者名。
- `eyebrow`：首页小标题，默认 NOTES & THOUGHTS。
- `introNote`：首页右侧短笺，默认空；支持换行。
- `homePostCount`：首页篇数，默认 6；归档显示全部文章。
- `showOutline`：显示目录，默认 true；`outline` 默认 [2, 3]。
- `nav`：文字与链接数组，支持站内路由、外部地址与 mailto。
- `footer`：起始年份、短句和可选备案号。

`pages/posts/*.md` 自动使用 post 布局。文章需有标题和日期；Valaxy 也能从 Git 推导日期。年份标签请写成字符串，如 `'2024'`。未写摘要时可使用框架的自动摘录；已有摘要直接保留。草稿和隐藏文章不进入首页、归档和相邻文章导航，生产构建由 Valaxy 移除草稿路由与 RSS 条目。

主题提供首页 `/`、归档 `/archives/`、标签 `/tags/?tag=名称` 和分类 `/categories/?category=名称`。标签与分类支持链接直达和筛选。普通 Markdown 页面使用 default 布局，例如 `pages/about.md`；归档 Markdown 可设置 `layout: archives`，在列表上方添加内容。单篇 `outline: false` 隐藏目录，`outline: [2, 4]` 改变级别。内置界面文字为中文。

搜索在真实文章的标题、摘要、描述与标签中进行，并可与标签筛选组合；它不是全文索引。正文经 ValaxyMd 渲染，保留 ValaxyMain 的主内容、页头、目录前后、评论与页脚插槽。评论 UI 由消费者提供。

`valaxy-theme-editorial/client` 导出 useThemeConfig、plainText 和 postTags。样式由框架自动发现 `styles/index.ts`；公共 Markdown 与高亮样式在 setup/main.ts 各引入一次。配色变量在 styles/editorial.css，外观状态使用 Valaxy 自带 store 与持久化机制。目录 useOutline 生命周期独立于 Markdown。

## 开发

在工作区根目录：

```sh
pnpm install
pnpm dev
pnpm build          # valaxy build --ssg
pnpm lint
pnpm typecheck      # 首次运行前先 build，生成组件声明
pnpm test
pnpm check
pnpm pack:theme
pnpm smoke:consumer
```

demo 包含 11 篇真实博客文章、草稿和独立的 /reading-lab 排版测试页。修改 demo 不会改动原博客。发布前请替换 demo 的 example.com 域名。

PowerShell 子路径验证：

```powershell
$env:BASE_URL = '/journal/'
pnpm build
Remove-Item Env:BASE_URL
```

独立消费测试会将归档复制到系统临时目录，安装常规依赖，先验证空站点，再验证 /journal/ 子路径、文章、普通页、客户端导出与草稿排除。保留临时目录和日志便于复查。

本主题以源码分发，无需预编译。发布 npm 或部署站点需要单独执行；开发和打包命令不会发布。

## 友链

EditorialFriendList 接收 links 数组，字段为 url、name、blog、desc、avatar；可选 random 在客户端挂载后打乱顺序，服务端先输出稳定的完整列表。具体友链数据由消费者提供，例如在 components/ 中导入 public/l.json 并传给组件。头像延迟加载，失效时回退到首字。
