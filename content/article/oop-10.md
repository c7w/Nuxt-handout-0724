---
title: OOP 课程笔记 Week 10 多态与模板
date: 2021-4-26
tags: 
- OOP
mathjax: true
cover: https://z3.ax1x.com/2021/06/07/204701.png
---

## Week 10 多态与模板

 ### 10.0 Overview

+ 纯虚函数与抽象类
+  向下类型转换
+  多重继承的虚函数表，多重继承的利弊
+  多态
+  函数模板与类模板

### 10.1 纯虚函数与抽象类

+ 虚函数还可以进一步声明为纯虚函数，包含纯虚函数的类，通常被称为“抽象类”。

  + `virtual 返回类型 函数名(形式参数) = 0; `

+ 抽象类不允许定义对象，定义基类为抽象类的主要用途是为派生类规定共性“接口”

```cpp
    // Example 10.1.1
    class A {
       public:
        virtual void f() = 0; /// 可在类外定义函数体提供默认实现。派生类通过 A::f() 调用
    };
    A obj; /// 不准抽象类定义对象！编译不通过！
```
+ 抽象类
  + 定义：含有至少一个纯虚函数。
  + 特点：
    + 不允许定义对象。
    + 只能为派生类提供接口。
    + 能避免对象切片：保证只有指针和引用能被向上类型转换。

+ 基类纯虚函数被派生类重写覆盖之前仍是纯虚函数。因此当继承一个抽象类时，必须实现所有纯虚函数，否则继承出的类也是抽象类。
+ **纯虚析构函数除外**
  + 对于纯虚析构函数而言，即便派生类中不显式实现，编译器也会自动合成默认析构函数。因此，即使派生类不覆盖纯虚析构函数，派生类可以不是抽象类，可以定义派生类对象。
  + 回顾：虚函数与析构函数
    + 析构函数能是虚的，且常常是虚的。**虚析构函数仍需定义函数体**。
    + 虚析构函数的用途：当删除基类对象指针时，编译器将根据指针所指对象的实际类型，调用相应的析构函数。
  + 析构函数也可以是纯虚函数
    + 纯虚析构函数仍然需要函数体
    + 目的：使基类成为抽象类，不能创建基类的对象。如果有其他函数是纯虚函数，则析构函数不必是纯虚的。

```cpp
// Example 10.1.2
class Base {
   public: 
    virtual ~Base()=0; 
};
Base::~Base() {} /// 必须有函数体
class Derive : public Base {};
int main() {
    Base b; /// 编译错误，基类是抽象类
    Derive d1;
    return 0;
}
```

### 10.2 向下类型转换

+ 基类指针/引用转换成派生类指针/引用，则称为向下类型转换。（类层次中向下移动）
+ 如何确保转换的正确性？
  + 如何保证基类指针指向的对象也可以被要转换的派生类的指针指向？—— 借助虚函数表进行动态类型检查！
+ C++提供了一个特殊的显式类型转换，称为`dynamic_cast`，是一种安全类型向下类型转换。
  + 使用dynamic_cast的对象必须有虚函数，因为它使用了存储在虚函数表中的信息判断实际的类型。使用方法：
    + obj_p，obj_r分别是T1类型的指针和引用
      + `T2* pObj = dynamic_cast<T2*>(obj_p); `//转换为T2指针，运行时失败返回 `nullptr`
      + `T2& refObj = dynamic_cast<T2&>(obj_r);` //转换为T2引用，运行时失败抛出 `bad_cast` 异常
    + T1必须是多态类型（声明或继承了至少一个虚函数的类），否则不过编译；T2不必。T1,T2没有继承关系也能通过编译，只不过运行时会转换失败。
  + 如果我们知道正在处理的是哪些类型，可以使用static_cast来避免这种开销。
    + static_cast在编译时静态浏览类层次，只检查继承关系。没有继承关系的类之间，必须具有转换途径才能进行转换（要么自定义，要么是语言语法支持），否则不过编译。运行时无法确认是否正确转换。
    + static_cast使用方法：
      + obj_p，obj_r分别是T1类型的指针和引用
      + `T2* pObj = static_cast<T2*>(obj_p);`   //转换为T2指针
      + `T2& refObj = static_cast<T2&>(obj_r);`   //转换为T2引用
      + 不安全：不保证转换后的目标是T2类型的，可能导致非法内存访问。

```cpp
// Example 10.2.1
#include <iostream>
using namespace std;
class B {
   public:
    virtual void f(){};
};
class D : public B {
   public:
    int i{2018};
};
int main() {
    D d;
    B b;
    //    D d1 = static_cast<D>(b); ///未定义类型转换方式
    //    D d2 = dynamic_cast<D>(b); ///只允许指针和引用转换

    D* pd1 = static_cast<D*>(&b);  /// 有继承关系，允许转换
    if (pd1 != nullptr) {
        cout << "static_cast, B*(B) --> D*: OK" << endl;
        cout << "D::i=" << pd1->i << endl;
    }
    /// 但是不安全：对D中成员i可能非法访问

    D* pd2 = dynamic_cast<D*>(&b);
    if (pd2 == nullptr)  /// 不允许不安全的转换
        cout << "dynamic_cast, B*(B) --> D*: FAILED" << endl;
}

>>> static_cast, B*(B) --> D*:OK
>>> D::i=124455624
>>> dynamic_cast, B*(B) --> D*: FAILED
```

```cpp
// Example 10.2.2
#include <iostream>
using namespace std;
class B {
   public:
    virtual void f(){};
};
class D : public B {
   public:
    int i{2018};
};
int main() {
    D d;
    B b;
    //    D d1 = static_cast<D>(b); ///未定义类型转换
    //    D d2 = dynamic_cast<D>(b); ///只允许指针和引用转换
    B* pb = &d;
    D* pd3 = static_cast<D*>(pb);
    if (pd3 != nullptr) {
        cout << "static_cast, B*(D) --> D*: OK" << endl;
        cout << "D::i=" << pd3->i << endl;
    }
    D* pd4 = dynamic_cast<D*>(pb);
    if (pd4 != nullptr) {
        cout << "dynamic_cast, B*(D) --> D*: OK" << endl;
        cout << "D::i=" << pd4->i << endl;
    }
    return 0;
}

>>> static_cast, B*(D) --> D*: OK
>>> D::i=2018
>>> dynamic_cast, B*(D) --> D*: OK
>>> D::i=2018
```

+ 重要原则(清楚指针所指向的真正对象)：
  1）指针或引用的向上转换总是安全的；
  2）向下转换时用dynamic_cast，安全检查；
  3）避免对象之间的转换。

+ 对于基类中有虚函数的情况：
  + 向上类型转换：
    + 转换为基类指针或引用，则对应虚函数表仍为派生类的虚函数表（晚绑定）。
    + 转换为基类对象，则对应虚函数表是基类的虚函数表（早绑定）。
  + 向下类型转换：
    dynamic_cast通过虚函数表来判断是否能进行向下类型转换。

```cpp
// Example 10.2.3
#include <iostream>
using namespace std;

class Pet {
   public:
    virtual ~Pet() {}
};
class Dog : public Pet {
   public:
    void run() { cout << "dog run" << endl; }
};
class Bird : public Pet {
   public:
    void fly() { cout << "bird fly" << endl; }
};

void action(Pet* p) {
    auto d = dynamic_cast<Dog*>(p);   /// 向下类型转换
    auto b = dynamic_cast<Bird*>(p);  /// 向下类型转换
    if (d)  /// 运行时根据实际类型表现特性
        d->run();
    else if (b)
        b->fly();
}

int main() {
    Pet* p[2];
    p[0] = new Dog;   /// 向上类型转换
    p[1] = new Bird;  /// 向上类型转换
    for (int i = 0; i < 2; ++i) {
        action(p[i]);
    }
    return 0;
}
```

### 10.3 多重继承的虚函数表与利弊

+ 多重继承中的虚函数
  + 最多继承一个非抽象类 **避免** 多重继承的二义性
  + 可以集成多个抽象类 **利用** 一个对象可以实现多个接口

### 10.4 多态

+ 按照基类的接口定义，调用指针或引用所指对象的接口函数，函数执行过程因对象实际所属派生类的不同而呈现不同的效果（表现），这个现象被称为“多态”。
  + 当利用基类指针/引用调用函数时
    + 虚函数在运行时确定执行哪个版本，取决于引用或指针对象的真实类型
    + 非虚函数在编译时绑定
  + 当利用类的对象直接调用函数时
    + 无论什么函数，均在编译时绑定
  + 产生多态效果的条件：继承 && 虚函数 && (引用 || 指针)

+ 应用：TEMPLATE METHOD设计模式
  + 在接口的一个方法中定义算法的骨架
  + 将一些步骤的实现延迟到子类中
  + 使得子类可以在不改变算法结构的情况下，重新定义算法中的某些步骤。
+ 模板方法是一种源代码重用的基本技术，在类库的设计实现中应用十分广泛，因为这个设计模式能有效地解决 “类库提供公共行为”与“用户定制特殊细节”之间的折中平衡。

```cpp
// Example 10.4.1
#include <iostream>
using namespace std;

class Base {
   public:
    void action() {
        step1();
        step2();
        step3();
    }
    virtual void step1() { cout << "Base::step1" << endl; }
    virtual void step2() { cout << "Base::step2" << endl; }
    virtual void step3() { cout << "Base::step3" << endl; }
};

class Derived1 : public Base {
    void step1() { cout << "Derived1::step1" << endl; }
};
class Derived2 : public Base {
    void step2() { cout << "Derived2::step2" << endl; }
};

int main() {
    Base* ba[] = {new Base, new Derived1, new Derived2};
    for (int i = 0; i < 3; ++i) {
        ba[i]->action();
        cout << "===" << endl;
    }
    return 0;
}

>>>
Base::step1
Base::step2
Base::step3
===
Derived1::step1
Base::step2
Base::step3
===
Base::step1
Derived2::step2
Base::step3
===
```

### 10.5 函数模板与类模板

1. 函数模板

+ 有些算法实现与类型无关，所以可以将函数的参数类型也定义为一种特殊的“参数”，这样就得到了“函数模板”。
+ 定义函数模板的方法
  + `template <typename T> ReturnType Func(Args)；`
  + 如：任意类型两个变量相加的“函数模板”
  + `template <typename T>  T sum(T a, T b) { return a + b; }`
  + 注：typename也可换为class
+ 函数模板在调用时，编译器能自动推导出实际参数的类型（这个过程叫做实例化）。
  + 所以，形式上调用一个函数模板与普通函数没有区别。
  + 当多个参数的类型不一致时，无法推导：
    + `cout << sum(9, 2.1);` //编译错误
    + 手工指定调用类型：`sum<int>(9, 2.1);`

2. 类模板

+ 在定义类时也可以将一些类型信息抽取出来，用模板参数来替换，从而使类更具通用性。这种类被称为“类模板”。

```cpp
// Example 10.5.1
#include <iostream>
using namespace std;

template <typename T>
class A {
    T data;

   public:
    void print() { cout << data << endl; }
};
int main() {
    A<int> a;
    a.print();
}
```

+ 类模板中成员函数的类外定义

```cpp
// Example 10.5.2
#include <iostream>
using namespace std;

template <typename T>
class A {
    T data;

   public:
    void print();
};

template <typename T>
void A<T>::print() {
    cout << data << endl;
}

int main() {
    A<int> a;
    a.print();
}
```

+ 类模板的“模板参数”
  + 类型参数：使用typename或class标记
  + 非类型参数：整数，枚举，指针（指向对象或函数），引用（引用对象或引用函数）。整数型比较常用。

```cpp
// Example 10.5.3
template <typename T, unsigned size>
class array {
    T elems[size];
    ...
};

array<char, 10> array0;
```

+ 模板与多态
  + 模板使用泛型标记，使用同一段代码，来关联不同但相似的特定行为，最后可以获得不同的结果。模板也是多态的一种体现。
  + 但模板的关联是在编译期处理，称为静多态。
    + 往往和函数重载同时使用
    + 高效，省去函数调用
    + 编译后代码增多
  + 基于继承和虚函数的多态在运行期处理，称为动多态
    + 运行时，灵活方便
    + 侵入式，必须继承
    + 存在函数调用