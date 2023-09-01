---
title: Vue3 经常用到的一些小技巧
categories:
  - 前端
  - Vue
  - Typescript
tags:
  - Vue
  - Typescript
summary: Vue3 经常用到的一些小技巧
---

本文主要介绍了在Vue Router + Vite项目中设置404页面加载和解决Typescript下引入Vue组件找不到定义的问题。另外还介绍了不想使用事件总线时使用原生的Message事件进行通信的方法，以及如何使用Highlight代码高亮插件和解决组件不铺满窗口的问题。

<!-- more -->

## Vue Router + Vite 没有设定的路由加载404页面

```ts
{
    path: '/:pathMatch(.*)*',
    name: "404",
    meta: {
        title: '你来错地方了',
    },
    component: () => import('@/views/errors/404.vue')
}
```
在router目录下的index.ts设置，注意这个一定要放在最后，否则会覆盖其他路由。

## Typescript下引入Vue组件时找不到定义

```ts
declare module '*.vue' {
    import { App, defineComponent } from 'vue'
    const component: ReturnType<typeof defineComponent> & {
        install(app: App): void
    }
    export default component
};
```
在env.d.ts文件里面引入声明

## Window 找不到定义

```ts
declare interface Window {
    //这里可以填写你设置的其他方法
};
```
在env.d.ts文件里面引入声明


## 不想使用事件总线的偷懒方法

### 原生的Message事件

#### 发送Message

```ts
window.parent.postMessage("parameter");
```
#### 监听Message事件

```ts
onMounted(() => {
  //注册message监听事件
  window.addEventListener("message", (e) => {
    const message: string = e.data.toString();
    //message即为你发送Message时填写的参数，可以使用split来实现监听多个事件
  });
});
```
如果你提示找不到Window的声明，请看上一条。

## 使用Highlight代码高亮

### 轮子安装

```bash
npm install --save vue-highlightjs
npm install --save highlight.js
```

### main.ts里面引入、挂载

```ts
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css'  //导入代码高亮样式
```

这是定义一个事件

```ts
//const app = createApp(App); 确保你已经定义了app
app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block: any) => {
        hljs.highlightBlock(block)
    })
})
```

### 使用

```html
<div id="content" v-html="data" v-highlight></div>
```

## 出现组件不铺满窗口的解决方法

```css
#root,
body,
html {
  height: 100%;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

