---
title: JS 性能利器！ Web Worker怎么用!
categories:
  - 前端
  - Javascript
tags:
  - Javascript
  - Web Worker
  - Typescript
  - Vue
excerpt_type: ai
excerpt: >-
  Web
  worker是一个在web应用程序中独立于主线程运行的线程。它的优点是可以将工作交给其他线程去做，不会阻塞主线程。然而，使用any类型的写法并不推荐。在使用Web
  worker时，需要创建主线程和子线程，并通过postMessage方法来传递消息。可以通过worker.terminate()方法销毁worker。除此之外，文章还提供了一个定时器的例子，展示了如何在主线程和子线程中创建和销毁定时器。对于Vue项目，可以使用import.meta.url和URL对象创建worker，并使用postMessage方法来操作定时器。但需要注意的是，文章中的代码可能不是最佳实践，作者承诺会更新更好的例子。
---

::: warning
这是我初学Typescript的时候写的一个小例子，使用了any类型，这种写法并不推荐，后续我会更新一个更好的例子。
:::

## Worker 是什么？

Web worker就是在web应用程序中使用的worker。这个worker是独立于web主线程的，在后台运行的线程。

Web worker的优点就是可以将工作交给独立的其他线程去做，这样就不会阻塞主线程。

Tips: Web worker是一个独立的线程，它的运行不会影响主线程的运行，但是它也不能直接操作DOM。说它是线程，但其实它是运行在浏览器的另一个进程中的。

## 使用Worker

```javascript
const worker = new Worker("worker.js");
```

如果你使用的是`Typescript`你可以创建一个`worker.ts`

### 主进程

```javascript
// 监听子进程发送的消息
worker.onmessage = (e) => console.log(e.data);
// 发送消息到子线程
worker.postMessage('内容');
```

### 子进程

```javascript
// 监听接收主进程信息
self.onmessage = (e) => console.log(e.data);
// 发送信息到主进程
self.postMessage('内容');
```

### 销毁它

```javascript
worker.terminate();
```



## 定时器例子

### worker.ts
```typescript
import { workerTimer } from './workertimer'
/**
 *通过遍历器遍历参数
 *new出新的worker类
 *调用定时器方法
 */
const workertimer = new workerTimer()
self.onmessage = function (e) {
    e.data.map((item: any) => {
        if (item.type == 'add') {
            workertimer.timeInterval(item.name, item.interval, self)
        }
        if (item.type == 'close') {
            workertimer.closeInterval(item.name)
        }
    })
};
```

### workertimer.ts

```typescript
/**
 * worker类
 * export定时器方法
 *
 */
export class workerTimer {
    InterValID: any = {}
    constructor() {

    }
    timeInterval(name: string, interval: number, _this: any) {
        console.log(name + 'Timer Created')
        let id: any
        id = setInterval(() => {
            _this.postMessage({ name: name, message: interval / 1000 + '秒到了' })
        }, Number(interval))
        this.InterValID[name] = id
        console.log(this.InterValID)
    }
    closeInterval(name: string) {
        console.log(this.InterValID[name])
        clearInterval(this.InterValID[name])
    }
}
```

### 在Vue中使用

```typescript
const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module'
})
```

#### 创建定时器请求

```typescript
 worker.postMessage([
          { name: 'loginCall', interval: 50000, type: 'add' },
 ]);
```

#### 销毁定时器请求

```typescript
worker.postMessage([
          { name: 'loginCall', type: 'close' },
]);
```


