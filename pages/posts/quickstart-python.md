---
title: 歪比歪的Python入门手册
categories:
  - Python
  - QuickStart
tags:
  - Python
excerpt_type: ai
---

## 基础语法

### 注释

Python的注释和C的注释类似，Python使用以#开头的单行注释，也支持以'''或"""开头和以'''或"""结尾的多行注释。

```python
# 这是单行注释
'''
这是多行注释
'''
```

### 缩进

Python使用缩进来表示代码块，而C使用大括号{}来表示代码块。Python的缩进可以使用空格或制表符，但不允许混用空格和制表符。Python的缩进一般使用4个空格，这是一种普遍的编码规范。

```python
if True:
    print('hello')
else:
    print('world')
```

### 代码块

Python使用冒号:和缩进来表示代码块，而C使用大括号{}来表示代码块。Python的代码块一般在控制流语句（如if, for, while等）后面，冒号:表示开始，接下来的缩进部分为代码块的内容。

```python
if True:
    print('hello') # 属于if的代码块
else:
    print('world') # 属于else的代码块
```

### 代码行

Python一般使用换行符来表示代码行结束，但在一行内写多个语句时，可以使用分号;来表示代码行的结束。而C使用分号;来表示代码行。

```python
print('hello'); print('world') # 两个语句在一行内
```

### 模块

Python使用import关键字来导入模块，也可以使用from...import...关键字来导入模块的部分内容。Python的模块是用来逻辑组织Python代码的方式，通过模块可以将相关的代码分组，提高代码的可读性和可用性。

```python
import os
from os import path
```

### 函数

Python使用def关键字定义函数，通过函数可以将一段实现特定功能的代码块组织起来，方便多次调用。

```python
def greet(name):
    print('Hello, ' + name)

greet('Alice') # 调用函数
```

### 异常处理

Python使用try...except...语句来处理异常。这是一种错误处理机制，可以帮助程序在发生错误时不中断运行，而是执行特定的错误处理代码。

```python
try:
    # 试图执行的代码块
    print(1 / 0)
except ZeroDivisionError:
    # 当特定异常发生时执行的代码块
    print('Cannot divide by zero')
```

## 基本数据类型

**变量和数据类型**：C和Python都有相似的基本数据类型，如整型、浮点型和字符型。然而，Python的数据类型更加丰富，包括列表、元组、字典等。此外，Python是动态类型语言，意味着可以在运行时更改变量的类型，而C是静态类型语言，需要在编译时确定变量的类型。

### 初始化

Python的变量不需要声明，可以直接赋值。Python的变量名可以包含字母、数字和下划线，但不能以数字开头。Python的变量名区分大小写。

```python
a = 1
b = 2.0
c = 'hello'
d = True
print(a, b, c, d)
```


```bash
1 2.0 hello True
```

### 整型

Python的整型可以表示任意大小的整数，而C的整型则有固定的长度。Python的整型可以用十进制、十六进制、八进制和二进制表示。

```python
a = 123
b = 0x123
c = 0o123
d = 0b1010
print(a, b, c, d)
```


```bash
123 291 83 10
```

### 浮点型

Python的浮点型可以表示任意大小的浮点数，而C的浮点型则有固定的长度。Python的浮点型可以用科学计数法表示。

```python
a = 1.23
b = 1.23e9
print(a, b)
```


```bash
1.23 1230000000.0
```

### 字符串

Python的字符串可以用单引号或双引号表示，也可以用三引号表示多行字符串。Python的字符串可以用加号连接，也可以用乘号重复。值得注意的是，Python的字符串是不可变的。

```python
a = 'hello'
b = "world"
c = '''hello
world'''
d = a + b
e = a * 3
print(a, b, c, d, e)
```


```bash
hello world hello
world helloworld hellohellohello
```


### 布尔型

Python的布尔型是整型的子类型，可以用0表示False，用1表示True。Python的布尔型可以用and、or和not运算。

**有趣的是**：Python的布尔型可以用and、or和not运算，而C的布尔型则需要使用&&、||和!进行逻辑运算。

```python
a = True
b = False
c = a and b
d = a or b
e = not a
print(a, b, c, d, e)
```


```bash
True False False True False
```

### 列表

Python的列表是可变长的，而C的数组是固定长度的(除非重新分配内存)。Python的列表可以包含任意类型的元素，Python的列表可以用加号连接，也可以用乘号重复。Python的列表可以用下标访问，也可以用切片访问。

**有趣的是**：Python其实没有数组的概念，Python的列表相当于C的数组和链表的结合体。

```python
a = [1, 2, 3]
b = ['hello', 'world']
c = [1, 'hello', True]
d = a + b
e = a * 3
f = a[0]
g = a[1:3] # 取出下标为1和2的元素
print(a, b, c, d, e, f, g)
```


```bash
[1, 2, 3] ['hello', 'world'] [1, 'hello', True] [1, 2, 3, 'hello', 'world'] [1, 2, 3, 1, 2, 3, 1, 2, 3] 1 [2, 3]
```

### 元组

Python的元组可以包含任意类型的元素，Python的元组可以用加号连接，也可以用乘号重复。Python的元组可以用下标访问，也可以用切片访问。

**有趣的是**：Python的元组其实就是不可变的列表。

```python
a = (1, 2, 3)
b = ('hello', 'world')
c = (1, 'hello', True)
d = a + b
e = a * 3
f = a[0]
g = a[1:3] # 取出下标为1和2的元素
print(a, b, c, d, e, f, g)
```


```bash
(1, 2, 3) ('hello', 'world') (1, 'hello', True) (1, 2, 3, 'hello', 'world') (1, 2, 3, 1, 2, 3, 1, 2, 3) 1 (2, 3)
```

### 字典

Python的字典可以包含任意类型的元素。Python的字典通过键(key)来访问值(value)，不支持切片访问。

**有趣的是**：Python的字典其实就是哈希表。如果你学过Java，那么Python的字典相当于Java的HashMap，或者我们俗称的“键值对”。

```python
a = {'name': 'Tom', 'age': 18}
b = a['name']
c = a['age']
print(a, b, c)
```


```bash
{'name': 'Tom', 'age': 18} Tom 18
```

### 集合

Python的集合可以包含任意类型的元素。Python的集合是无序的且不包含重复元素，所以**不能**用下标访问，**也不能**用切片访问。Python的集合**不可以**用加号连接，也**不支持**重复的乘法运算。

**有趣的是**：Python的集合其实就是不包含重复元素的列表，并且支持集合运算如并集、交集、差集等。

```python
a = {1, 2, 3}
b = {'hello', 'world'}
c = {1, 'hello', True}
d = a | b # 并集
e = a & b # 交集
f = a - b # 差集
g = a ^ b # 对称差
print(a, b, c, d, e, f, g)
```

```bash
{1, 2, 3} {'hello', 'world'} {'hello', 1} {1, 2, 3, 'hello', 'world'} set() {1, 2, 3} {1, 2, 3, 'world', 'hello'}
```

**非常非常非常非常非常非常有趣的是**：每次输出的结果都不一样，因为集合是无序的。而且True和1是等价的(等价不等于相等,你可以试试`1 is True`)，所以集合中不能同时存在True和1。

### None
Python的None相当于C的NULL，但是Python的None不是关键字，而是一个特殊的常量。

```python
a = None
print(a)
```

```bash
None
```

### 变量赋值

Python的变量赋值采用的是引用语义，而C的变量赋值则是值语义。在Python中，当一个变量被赋予一个新值，这个变量就引用了一个新的对象，原对象并未改变。另外，Python是动态类型语言，也就是说，你可以给同一个变量赋不同类型的值。

**掏心窝子的说**：虽然Python是动态类型，但我不建议你给同一个变量赋不同类型的值，这样会让你的代码变得难以理解。同时很不`Type-Safe`。在Python中，我们有静态类型检查工具如MyPy，这可以帮助我们在编写代码时就发现类型错误，从而提高代码质量。

```python
a = 1
b = a
a = 2
c, d = 3, 4
print(a, b, c, d)
```

```bash
2 1 3 4
```

这段代码中，当我们对`a`赋新值2时，`a`引用了一个新的对象，而`b`仍然引用的是原来的对象，这就解释了为什么`a`和`b`的值不同。对于`c, d = 3, 4`，这是Python中的元组解包（tuple unpacking）特性，Python先创建了一个元组`(3, 4)`，然后分别将`c`和`d`赋值为元组中的对应元素。

**注意**：这种引用语义在处理Python的可变对象（如列表、字典等）时尤其重要，因为对可变对象的修改会影响到所有引用该对象的变量。


## 运算符

Python的运算符和C的运算符基本一致，但是Python的运算符有一些特殊的地方，比如Python的算术运算符支持字符串和列表，Python的比较运算符支持链式比较，Python的逻辑运算符支持短路运算，Python的位运算符支持按位取反，Python的赋值运算符支持链式赋值，Python的成员运算符和身份运算符也是独一无二的。

### 算术运算符
Python的算术运算符支持字符串和列表，但是不支持字典和集合。Python的算术运算符支持链式运算。

```python
a = 1 + 2
b = 3 - 4
c = 5 * 6
d = 7 / 8
e = 9 // 10 # 整除
f = 11 % 12
g = 13 ** 14 # 13的14次方
h = 'hello' + 'world'
i = [1, 2, 3] + [4, 5, 6] # 列表拼接
print(a, b, c, d, e, f, g, h, i)
```

```bash
3 -1 30 0.875 0 11 3937376385699289 helloworld [1, 2, 3, 4, 5, 6]
```

### 比较运算符
Python的比较运算符支持链式比较。

```python
a = 1 < 2 < 3
b = 4 > 5 > 6
c = 7 <= 8 <= 9
d = 10 >= 11 >= 12
e = 13 == 14 == 15
f = 16 != 17 != 18
print(a, b, c, d, e, f)
```

```bash
True False True False False True
```

### 逻辑运算符
Python的逻辑运算符支持短路运算。

```python
a = True and False
b = True or False
c = not True
print(a, b, c)
```

```bash
False True False
```

### 位运算符
Python的位运算符支持按位取反。

```python
a = 1 & 2 # 按位与
b = 3 | 4 # 按位或
c = 5 ^ 6 # 按位异或
d = ~7 # 按位取反
e = 8 << 9 # 左移
f = 10 >> 11 # 右移
print(a, b, c, d, e, f)
```

```bash
0 7 3 -8 4096 0
```

### 赋值运算符
Python的赋值运算符支持链式赋值。

```python
a = 1
b = 2
c = 3
a += 4
b -= 5
c *= 6
print(a, b, c)
```

```bash
5 -3 18
```

### 成员运算符
Python的成员运算符用于判断一个元素是否属于一个集合。

```python
a = 1 in [1, 2, 3]
b = 4 not in [1, 2, 3]
print(a, b)
```

```bash
True True
```

### 身份运算符
Python的身份运算符用于判断两个变量是否引用同一个对象。

```python
a = 1
b = 1
c = [1, 2, 3]
d = [1, 2, 3]
e = c
print(a is b)
print(c is d)
print(c is e)
```

```bash
True
False
True
```

## 控制流
控制流是编程语言中的一种语句，用于控制程序的执行流程。Python的控制流包括条件语句和循环语句。

### 条件语句
Python的条件语句包括`if`语句和`if-else`语句，`if`语句用于判断一个条件是否成立，`if-else`语句用于判断两个条件是否成立。

```python
a = 1
if a == 1:
    print('a is 1')
if a == 2:
    print('a is 2')
else:
    print('a is not 2')
```

```bash
a is 1
a is not 2
```

### 循环语句
Python的循环语句包括`while`语句和`for`语句，`while`语句用于循环执行一段代码，`for`语句用于遍历一个可迭代对象。

```python
a = 1
while a < 10:
    print(a)
    a += 1
for i in [1, 2, 3]:
    print(i)
```

```bash
# while循环部分
1
2
3
4
5
6
7
8
9
# for循环部分
1
2
3
```

## 函数
函数是一段可重用的代码，用于完成特定的功能。Python的函数可以有多个参数，可以有多个返回值，可以有默认参数，可以有可变参数，可以有关键字参数，可以有匿名函数，可以有装饰器。

### 函数定义
Python的函数使用`def`关键字定义，函数的参数可以有默认值，函数的返回值可以有多个。

```python
def add(a, b=1):
    return a + b
print(add(1))

def add(a, b=1):
    return a + b, a - b
print(add(1))
print(add(1, 2))
```

```bash
2
(2, 0)
(3, -1)
```

**可能有趣的是**：Python的函数是可以覆盖的，这个例子就是覆盖了`add`函数，可不是什么函数重载哦，Python和C一样不支持函数的重载！

### 可变参数
Python的可变参数用于接收任意数量的参数，可变参数的参数名前面加上`*`，可变参数的参数值是一个元组。

```python
def change(*args):
    print(args)
change(1)
change(1, 2)
change(1, 2, 3)
```

```bash
(1,)
(1, 2)
(1, 2, 3)
```

### 关键字参数
Python的关键字参数用于接收任意数量的关键字参数，关键字参数的参数名前面加上`**`，关键字参数的参数值是一个字典。

```python
def keyword(**kwargs):
    print(kwargs)

keyword(a=1)
keyword(a=1, b=2)
keyword(a=1, b=2, c=3)
```

```bash
{'a': 1}
{'a': 1, 'b': 2}
{'a': 1, 'b': 2, 'c': 3}
```

### 匿名函数
Python的匿名函数使用`lambda`关键字定义，匿名函数的参数可以有多个，匿名函数的返回值只有一个。

```python
add = lambda a, b: a + b
print(add(1, 2))
```

```bash
3
```

### 装饰器
Python的装饰器用于在不改变函数定义的情况下，增加函数的功能，装饰器的参数是一个函数，装饰器的返回值也是一个函数。

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print('before')
        func(*args, **kwargs)
        print('after')
    return wrapper

@decorator
def add(a, b):
    print(a + b)

add(1, 2)
```

```bash
before
3
after
```

## 类
类是一种抽象的数据类型，用于描述一类具有相同属性和方法的对象。Python的类使用`class`关键字定义，类的方法的第一个参数必须是`self`，类的方法的第一个参数表示类的实例，类的方法的第一个参数可以是其他名称，但是不建议这么做。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def say(self):
        print('my name is %s' % self.name)

    def say2(self, name):
        print('my name is %s' % name)

p = Person('Tom')
p.say()
p.say2('Jerry')
```

```bash
my name is Tom
my name is Jerry
```

### 继承
Python的类可以继承其他类，继承的类称为子类，被继承的类称为父类，子类可以重写父类的方法。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def say(self):
        print('my name is %s' % self.name)

class Student(Person):
    def __init__(self, name, age):
        super().__init__(name)
        self.age = age

    def say(self):
        print('my name is %s, my age is %d' % (self.name, self.age))

s = Student('Tom', 18)
s.say()
```

```bash
my name is Tom, my age is 18
```

### 多态
Python的类可以使用多态，多态是指子类可以替换父类，多态可以增加代码的灵活性。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def say(self):
        print('my name is %s' % self.name)

class Student(Person):
    def __init__(self, name, age):
        super().__init__(name)
        self.age = age

    def say(self):
        print('my name is %s, my age is %d' % (self.name, self.age))

def say(person):
    person.say()

p = Person('Tom')
s = Student('Jerry', 18)
say(p)
say(s)
```

```bash
my name is Tom
my name is Jerry, my age is 18
```

### 私有属性
Python的类的属性可以是私有的，私有属性只能在类的内部访问，私有属性的名称前面加上`__`。

```python
class Person:
    def __init__(self, name):
        self.__name = name

    def say(self):
        print('my name is %s' % self.__name)

p = Person('Tom')
p.say()
print(p.__name)
```

```bash
my name is Tom

Traceback (most recent call last):
  File "class.py", line 10, in <module>
    print(p.__name)
AttributeError: 'Person' object has no attribute '__name'

Exited with error status 1
```

### 私有方法
Python的类的方法可以是私有的，私有方法只能在类的内部访问，私有方法的名称前面加上`__`。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def __say(self):
        print('my name is %s' % self.name)

    def say(self):
        self.__say()

p = Person('Tom')
p.say()
p.__say()
```

```bash
my name is Tom

Traceback (most recent call last):
  File "class.py", line 13, in <module>
    p.__say()
AttributeError: 'Person' object has no attribute '__say'

Exited with error status 1
```

### 静态方法
Python的类的方法可以是静态的，静态方法不需要类的实例就可以调用，静态方法的参数可以有多个，静态方法的返回值只有一个。

```python
class Person:
    @staticmethod
    def say(name):
        print('my name is %s' % name)

Person.say('Tom')
```

```bash
my name is Tom
```

### 类方法
Python的类的方法可以是类方法，类方法的第一个参数必须是`cls`，类方法的第一个参数表示类，类方法的第一个参数可以是其他名称，但是不建议这么做，类方法的参数可以有多个，类方法的返回值只有一个。

```python
class Person:
    @classmethod
    def say(cls, name):
        print('my name is %s' % name)

Person.say('Tom')
```

```bash
my name is Tom
```

### 属性方法
Python的类的方法可以是属性方法，属性方法的第一个参数必须是`self`，属性方法的第一个参数表示类的实例，属性方法的第一个参数可以是其他名称，但是不建议这么做，属性方法的参数可以有多个，属性方法的返回值只有一个。

```python
class Person:
    def __init__(self, name):
        self.name = name

    @property
    def say(self):
        print('my name is %s' % self.name)

p = Person('Tom')
p.say
```

```bash
my name is Tom
```

## 异常
Python的异常是一种错误，Python的异常使用`try`和`except`关键字处理，`try`关键字后面的代码是可能出现异常的代码，`except`关键字后面的代码是处理异常的代码，`except`关键字后面可以跟多个异常，`except`关键字后面可以不跟异常，`except`关键字后面不跟异常表示处理所有异常，`except`关键字后面可以跟`as`关键字，`as`关键字后面的变量表示异常对象，`except`关键字后面可以跟`else`关键字，`else`关键字后面的代码是没有异常时执行的代码，`except`关键字后面可以跟`finally`关键字，`finally`关键字后面的代码是无论是否有异常都会执行的代码。

```python
try:
    print(1 / 0)
except ZeroDivisionError as e:
    print(e)
else:
    print('no exception')
finally:
    print('finally')
```

```bash
division by zero
finally
```

## 模块

### 导入模块
Python的模块是一种代码的组织方式，Python的模块使用`import`关键字导入，`import`关键字后面跟模块的名称，`import`关键字后面可以跟`as`关键字，`as`关键字后面的变量表示模块的别名，`import`关键字后面可以跟`from`关键字，`from`关键字后面跟模块的名称，`from`关键字后面跟`import`关键字，`import`关键字后面跟模块中的名称，`from`关键字后面可以跟`import *`，`import *`表示导入模块中的所有名称，`from`关键字后面可以跟`import *`，`import *`表示导入模块中的所有名称，`from`关键字后面可以跟`as`关键字，`as`关键字后面的变量表示模块中的名称的别名。

```python
import math
import math as m
from math import pi
from math import pi as p
from math import *
from math import pi as *
```

### 模块的属性
Python的模块的属性是模块中的名称，模块的属性使用`.`运算符访问。

```python
import math
print(math.pi)
```

```bash
3.141592653589793
```

### 模块的方法
Python的模块的方法是模块中的名称，模块的方法使用`.`运算符访问。

```python
import math
print(math.sin(math.pi / 2))
```

```bash
1.0
```
