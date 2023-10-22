---
title: Springboot业务异常全局Handler
categories:
  - 后端
  - Java
  - Spring
  - Springboot
tags:
  - Java
  - Spring
  - Springboot
excerpt_type: ai
---

## 添加异常处理器

```java
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public String handleException(Exception e) {
        return "System error";
    }
}
```

`@ControllerAdvice`注解表示我们定义的是一个控制器增强类，当其他任何控制器发生异常且异常类型符合`@ExceptionHandler`注解中指定的异常类时，原请求将会被拦截到这个我们自定义的控制器方法中。

在该方法中，我们可以拿到异常信息，于是便可以自定义该如何处理异常，是返回一个我们自定义的模版错误页面，还是返回JSON数据，这将都由我们根据实际应用场景而自己决定。并且我们还可以自定义异常类处理特殊情况。

另外，`@ExceptionHandler`注解只有一个value参数，为指定的异常类。`@ControllerAdvice`注解查看源码参数发现我们还可以指定需要拦截的控制器所在的包路径。

## 测试异常获取

```java
@GetMapping("/error")
public String makeError() {
    int i = 1 / 0;
    return "不可以除以0哦~";
}
```
