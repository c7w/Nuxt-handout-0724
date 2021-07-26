---
title: OOP 课程笔记 Week 08 组合与继承
date: 2021-4-12
tags: 
- OOP
mathjax: true
cover: https://z3.ax1x.com/2021/06/07/204701.png
---

## Week 08 组合与继承

### § 8.0 Overview

+ 组合
+  继承
+  成员访问权限
+  重写隐藏与重载
+  多重继承

### § 8.1 组合

+ 对象组合的两种实现方法：
  + 已有类的对象作为新类的公有数据成员，这样通过允许直接访问子对象而“提供”旧类接口
  + 已有类的对象作为新类的私有数据成员。新类可以调整旧类的对外接口，可以不使用旧类原有的接口（相当于对接口作了转换）
+ 对象拷贝与赋值运算
  + 如果调用拷贝构造函数且没有给类显式定义拷贝构造函数，编译器将自动合成：
    + 对有显式定义拷贝构造函数的子对象调用该拷贝构造函数
    + 对无显式定义拷贝构造函数的子对象采用位拷贝
  + 赋值的默认操作类似

### § 8.2 继承

+ 基本概念

  + 被继承的已有类，被称为基类 **base class**，也称“父类”。
  + 通过继承得到的新类，被为派生类 **derived class**，也称“子类”、“扩展类”。
+ 继承方式

  + 常见的继承方式：public, private
    + `class Derived : [private] Base { .. };` 缺省继承方式
    + `class Derived : public Base { ... };`
  + protected 继承很少被使用
    + `class Derived : protected Base { ... };`
+ 什么不能被继承？

  + 构造函数：创建派生类对象时，必须调用派生类的构造函数，派生类构造函数调用基类的构造函数，以创建派生对象的基类部分。C++11新增了继承构造函数的机制（使用using），但默认不继承
  + 析构函数：释放对象时，先调用派生类析构函数，再调用基类析构函数
  + 赋值运算符：因为赋值运算符包含一个类型为其所属类的形参
  + 友元函数：不是类成员
+ 派生类对象的构造与析构过程
+ 调用基类构造函数

  + 若没有显式调用，则编译器会自动生成一个对基类的默认构造函数的调用。
  + 若想要显式调用，则**只能**在派生类构造函数的**初始化成员列表**中进行。
+ 继承基类构造函数

  + 在派生类中使用 `using Base::Base;` 来继承基类构造函数，相当于给派生类“定义”了相应参数的构造函数，如下例 8.2.1.
+ 当基类存在多个构造函数时，使用using会给派生类自动构造多个相应的构造函数，如下例 8.2.2.
  + 如果基类的某个构造函数被声明为私有成员函数，则不能在派生类中声明继承该构造函数。
  + 如果派生类使用了继承构造函数，编译器就不会再为派生类生成默认构造函数。

```cpp
// Example 8.2.1
class Base 
{
    int data;
public:
    Base(int i) : data(i) { cout << "Base::Base(" << i << ")\n"; }
};

class Derive : public Base {
public:
    using Base::Base; 		///相当于 Derive(int i):Base(i){};
};

int main() {
    Derive obj(356);
	
    return 0;
} 
```

```cpp
// Example 8.2.2
class Base 
{
    int data;
public:
    Base(int i) : data(i) { cout << "Base::Base(" << i << ")\n"; }
	Base(int i, int j) 
		{ cout << "Base::Base(" << i << “," << j << ")\n";}
};

class Derive : public Base {
public:
    using Base::Base; 		///相当于 Derive(int i):Base(i){};
                     ///加上 Derive(int i, int j):Base(i，j){};
};

int main() {
    Derive obj(356);
	Derive obj(356, 789);
    return 0;
}
```

+ 继承方式
  + public 继承：基类中公有成员仍能在派生类中保持公有。（图 8.2.3）
  + private 继承：用基类接口实现派生类功能。（图 8.2.4）

![image-20210412091000928](https://i.loli.net/2021/04/12/EwhXWMB2RUrOzkT.png)

（图 8.2.3）



![image-20210412091010013](https://i.loli.net/2021/04/12/5Q9VMBnZk7YUHpq.png)

（图 8.2.4）



### § 8.3 成员访问权限

+ 基类中的私有成员
  + 不允许在派生类成员函数中访问
  + 不允许派生类的对象访问它们
+ 基类中的公有成员
  + 允许在派生类成员函数中被访问
  + 若是使用`public`继承方式，则成为派生类公有成员，可以被派生类的对象访问
  + 若是使用 `private/protected` 继承方式，则成为派生类私有/保护成员，不能被派生类的对象访问
    + 若想让某成员能被派生类的对象访问，可在派生类 `public` 部分用关键字 `using`  声明它的名字（例 8.3.1）
+ 基类中的保护成员
  + 与基类中的私有成员的不同在于：保护成员允许在派生类成员函数中被访问。

```cpp
// Example 8.3.1
#include <iostream>
using namespace std;
class Base {
public: 
  void baseFunc() { cout << "in Base::baseFunc()..." << endl; }
};

class Derive3: private Base {// B的私有继承
public:
  /// 私有继承时，在派生类public部分声明基类成员名字
  using Base::baseFunc; 
};

int main() {
  Derive3 obj3;
  cout << "calling obj3.baseFunc()..." << endl;
  obj3.baseFunc(); //基类接口在派生类public部分声明，则派生类对象可调用

  return 0;
}
```

+ 基类成员的访问权限
  + public 继承：基类的公有成员，保护成员，私有成员作为派生类的成员时，都保持原有的状态。
  + private 继承：基类的公有成员，保护成员，私有成员作为派生类的成员时，都作为私有成员。
  + protected 继承：基类的公有成员，保护成员作为派生类的成员时，都成为保护成员，基类的私有成员仍然是私有的。

![image-20210412091900016](https://i.loli.net/2021/04/12/Wsf9mCAqRuQMdHz.png)

（表 8.3.2）

### § 8.4 重写隐藏与重载

+ 重载(overload)：
  + 目的：提供同名函数的不同实现，属于静态多态。
  + 函数名必须相同，函数参数必须不同，作用域相同（如位于同一个类中；或同名全局函数）。
+ 重写隐藏(redefining)：
  + 目的：在派生类中重新定义基类函数，实现派生类的特殊功能。
  + 屏蔽了基类的所有其它同名函数。（例 8.4.1）
  + 函数名必须相同，函数参数可以不同
  + 可以在派生类中通过 `using 类名::成员函数名; ` 在派生类中“恢复”指定的基类成员函数（即去掉屏蔽），使之重新可用（例 8.4.2）

>程序编译时系统就能决定调用哪个函数，因此静态多态性又称为编译时的多态性。
>
>多态分为两类：静态多态性和动态多态性，以前学过的函数重载和运算符重载实现的多态性属于静态多态性，在程序编译时系统就能决定调用哪个函数，因此静态多态性又称为编译时的多态性。静态多态性是通过函数的重载实现的。动态多态性是在程序运行过程中才动态地确定操作所针对的对象。它又称运行时的多态性。动态多态性是通过虚函数实现的。

```cpp
// Example 8.4.1
#include <iostream>
using namespace std;

class T {};

class Base {
public:
  void f() { cout << "B::f()\n"; }
  void f(int i) { cout << "Base::f(" << i << ")\n"; } /// 重载
  void f(double d) { cout << "Base::f(" << d << ")\n"; } ///重载
  void f(T) { cout << "Base::f(T)\n"; } ///重载
};

class Derive : public Base {
public:
  void f(int i) { cout << "Derive::f(" << i << ")\n"; } ///重写隐藏
};

int main() {
  Derive d;
  d.f(10);
  d.f(4.9);		/// 编译警告。执行自动类型转换。
  //  d.f();		/// 被屏蔽，编译错误
  //  d.f(T());	/// 被屏蔽，编译错误
  return 0;
}
```

```cpp
// Example 8.4.2
#include <iostream>
using namespace std;

class T {};

class Base {
public:
  void f() { cout << "Base::f()\n"; }
  void f(int i) { cout << "Base::f(" << i << ")\n"; }
  void f(double d) { cout << "Base::f(" << d << ")\n"; }
  void f(T) { cout << "Base::f(T)\n"; }
};

class Derive : public Base {
public:
  using Base::f;
  void f(int i) { cout << "Derive::f(" << i << ")\n"; }
};

int main() {
  Derive d;
  d.f(10);
  d.f(4.9);
  d.f();
  d.f(T());
  return 0;
}
```

+ `using` 关键字
  + 继承基类构造函数
  + 恢复被屏蔽的基类成员函数
  + 还可用于：
    + 指示命名空间，`using namespace std;`
    + 将另一个命名空间的成员引入当前命名空间`using std::cout; cout << endl;`
    + 定义类型别名，`using a = int;`

### § 8.5 多重继承

+ 派生类同时继承多个基类

```cpp
class File{}; 
class InputFile: public File{}; 
class OutputFile: public File{}; 
class IOFile: public InputFile, public OutputFile{};
```

![image-20210412092825715](https://i.loli.net/2021/04/12/jCy49k6pKcM7XhE.png)

（图 8.5.1）

+ 数据存储
  + 如果派生类D继承的两个基类A,B，是同一基类Base的不同继承，则A,B中继承自Base的数据成员会在D有两份独立的副本，可能带来数据冗余。
+ 二义性
  + 如果派生类D继承的两个基类A,B，有同名成员a，则访问D中a时，编译器无法判断要访问的哪一个基类成员。

```cpp
// Example 8.5.2
#include <iostream>
using namespace std;

class Base {
public:
  int a{0};
};

class MiddleA : public Base {
public:
  void addA() { cout << "a=" << ++a << endl; };
  void bar() { cout << "A::bar" << endl; };
};

class MiddleB : public Base {
public:
  void addB() { cout << "a=" << ++a << endl; };
  void bar() { cout << "B::bar" << endl; };
};

class Derive : public MiddleA, public MiddleB{
};


int main() {
  Derive d;
  d.addA(); 		/// 输出 a=1。
  d.addB(); 		/// 仍然输出 a=1。
  cout << d.a; 	/// 编译错误，A和B都有成员a
  cout << d.A::a; /// 输出A中的成员a的值
  d.bar(); 		/// 编译错误，A和B都有成员函数bar
  return 0;
}
```

