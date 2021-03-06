---
title: OOP 课程笔记 Week 11 模板与STL初步
date: 2021-5-6
tags: 
- OOP
mathjax: true
cover: https://z3.ax1x.com/2021/06/07/204701.png
---

## Week 11 模板与STL初步

### 11.0 Overview

+ <s>类模板与函数模板特化</s>
+ 命名空间
+ STL初步——容器与迭代器

### 11.1 命名空间

+ 为了避免在大规模程序的设计中，以及在程序员使用各种各样的C++库时，标识符的命名发生冲突，标准C++引入了关键字namespace（命名空间），可以更好地控制标识符的作用域。
+ 标准C++库（不包括标准C库）中所包含的所有内容（包括常量、变量、结构、类和函数等）都被定义在命名空间std（standard标准）中。

```cpp
// Example 11.1.1
// 定义命名空间
namespace A {
	int x, y;
}
// 使用命名空间
A::x = 3;
A::y = 6;
```

+ 使用using声明简化命名空间使用
+ 使用整个命名空间：所有成员都直接可用`using namespace A;` `x = 3; y = 6;`
+ 使用部分成员：所选成员可直接使用  `using A::x;` `x = 3; A::y = 6;`
+ 任何情况下，都不应出现命名冲突

### 11.2 STL初步

+ 标准模板库（英文：Standard Template Library，缩写：STL），是一个高效的C++软件库，它被容纳于C++ 标准程序库C++ Standard Library中。其中包含4个组件，分别为算法、容器、函数、迭代器。基于模板编写。关键理念：将“在数据上执行的操作”与“要执行操作的数据”分离。

+ 简单容器
  + 容器是包含、放置数据的工具。通常为数据结构。
    + 简单容器（simple container）
    + 序列容器（sequence container）
    + 关系容器（associative container）
+ `std::pair`
+ `std::tuple`
+ `std::vector`
  + 创建：`std::vector<int> x;`
  + 当前数组长度： `x.size();`
  + 清空： `x.clear();`
  + 在末尾添加/删除：（高速）`x.push_back(1); x.pop_back();`
  + 在中间添加/删除：（使用迭代器，低速）`x.insert(x.begin()+1, 5);` `x.erase(x.begin()+1);`

+ 迭代器
  + 一种检查容器内元素并遍历元素的数据类型。
  + 提供一种方法顺序访问一个聚合对象中各个元素, 而又不需暴露该对象的内部表示。
  + 为遍历不同的聚合结构（需拥有相同的基类）提供一个统一的接口。
  + 使用上类似指针。

+ 迭代器：失效
+ 当迭代器不再指向本应指向的元素时，称此迭代器失效。
  + vector中什么情况下会发生迭代器失效？
  + 看作纯粹的指针
    + 调用insert/erase后，所修改位置之后的所有迭代器失效。（原先的内存空间存储的元素被改变）
    + 调用push_back等修改vector大小的方法时，可能会使所有迭代器失效（Push_back到了一定程度之后，可能会造成数组的整体移动，导致所有的内存地址发生改变。）

+ `std::list`

```cpp
// 插入前端：
 l.push_front(1);
// 插入末端：
 l.push_back(2); 
// 查询：
 std::find(l.begin(), l.end(), 2); //返回迭代器
// 插入指定位置：
 l.insert(it, 4); //it为迭代器
```

+ `std::list`
  + 不支持下标等随机访问
  + 支持高速的在任意位置插入/删除数据
  + 其访问主要依赖迭代器
  + 操作不会导致迭代器失效（除指向被删除的元素的迭代器外）

+ `std::set`

```cpp
// 插入：
 s.insert(1);
// 查询：
 s.find(1);   //返回迭代器
// 删除：
 s.erase(s.find(1));   //导致被删除元素的迭代器失效
// 统计：
 s.count(1);   //1的个数，总是0或1
```

+ `std::map`
  + 其值类型为pair<Key, T>。
  + map中的元素key互不相同，需要key存在比较器。
  + 可以通过下标访问（即使key不是整数）。下标访问时如果元素不存在，则创建对应元素。