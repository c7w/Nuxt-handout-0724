---
title: OOP 课程笔记 Week 09 虚函数
date: 2021-4-19
tags: 
- OOP
mathjax: true
cover: https://z3.ax1x.com/2021/06/07/204701.png
---

## Week 09 虚函数

### 9.0 Overview

+ 向上类型转换
+  对象切片
+  函数调用捆绑
+  虚函数和虚函数表
+  虚函数和构造函数、析构函数
+  重写覆盖，override和final

### 9.1 向上类型转换

+ **派生类**对象/引用/指针**转换成基类**对象/引用/指针，称为向上类型转换。只对`public`继承有效，在继承图上是上升的；对`private`、`protected`继承无效。
+ 向上类型转换（派生类到基类）可以由编译器自动完成，是一种隐式类型转换。
+ 凡是**接受基类对象/引用/指针的地方**（如函数参数），都可以**使用派生类对象/引用/指针**，编译器会自动将派生类对象转换为基类对象以便使用。

### 9.2 对象切片

+ 当**派生类的对象**`(不是指针或引用)`被通过**传参或赋值**的方式转换为**基类的对象**时，派生类的对象被**切片**为对应基类的子对象。
  + ![image-20210419081125275](https://i.loli.net/2021/04/19/2tVMgrhZ3GPT1cI.png)
  + 派生类的新数据和新方法丢失（图 9.2.1）

+ 当派生类的`指针（引用）`被通过**传参或赋值**的方式转换为基类`指针（引用）`时，不会创建新的对象，但只保留基类的接口。

```cpp
// Example 9.2.2 私有继承“照此实现”
#include <iostream>
using namespace std;
class B {
   private:
    int data{0};
   public:
    int getData() { return data; }
    void setData(int i) { data = i; }
};
class D1 : private B {
   public:
    using B::getData;
};
int main() {
    D1 d1;
    cout << d1.getData();  
    // d1.setData(10) //隐藏了基类的setData函数，不可访问 
    // B& b = d1;     //不允许私有继承的向上转换
    // b.setData(10); //否则可以绕过D1，调用基类的setData函数
}
```

### 9.3 函数调用捆绑

```cpp
// Example 9.3.1
#include <iostream>
using namespace std;

class Instrument {
public:
  void play() { cout << "Instrument::play" << endl; }
};

class Wind : public Instrument {
public:
  // Redefine interface function:
  void play() { cout << "Wind::play" << endl; }
};

void tune(Instrument& i) {
  i.play();
}

int main() {
  Wind flute;
  tune(flute); //引用的向上类型转换(传参)，编译器早绑定，无对象切片产生
  Instrument &inst = flute;  // 引用的向上类型转换(赋值)
  inst.play();
}
```

+ 把函数体与函数调用相联系称为**捆绑**(binding)。
  + 即将函数体实现代码的入口地址，与调用的函数名绑定。执行到调用代码时进入函数体内部。
+ 当捆绑在程序运行之前（由编译器和连接器）完成时，称为**早捆绑**(early binding)。
  + 运行之前已经决定了函数调用代码到底进入哪个函数。
  + 上面程序中的问题是早捆绑引起的，编译器将tune中的函数调用i.play()与Instrument::play()绑定。
+ 当捆绑根据对象的实际类型(上例中即子类Wind而非Instrument)，发生在程序运行时，称为**晚捆绑**(late binding)，又称动态捆绑或运行时捆绑。
  + 要求在运行时能确定对象的实际类型，并绑定正确的函数。
  + 晚捆绑只对类中的虚函数起作用，使用 virtual 关键字声明虚函数。

### 9.4 虚函数与虚函数表

+ 对于被派生类重新定义的成员函数，若它**在基类中被声明为虚函数**，则通过基类**`指针或引用`**调用该成员函数时，编译器将根据所指（或引用）对象的实际类型决定是调用基类中的函数，还是调用派生类重写的函数。
+ 
  若某成员函数在基类中声明为虚函数，当派生类重写覆盖(同名，同参数函数)它时，无论是否声明为虚函数，该成员函数都仍然是虚函数。

```cpp
// Example 9.4.1
#include <iostream>
using namespace std;

class Instrument {
public:
  virtual void play() { cout << "Instrument::play" << endl; }
};

class Wind : public Instrument {
public:
  void play() { cout << "Wind::play" << endl; }
     /// 重写覆盖(稍后：重写隐藏和重写覆盖的区别）
};

void tune(Instrument& ins) {
  ins.play(); /// 由于 Instrument::play 是虚函数，编译时不再直接绑定，运行时根据 ins 的实际类型调用。
}

int main() {
  Wind flute;
  tune(flute); /// 向上类型转换
}

```

+ 一般来说，派生类虚函数的返回类型应该和基类相同。

  + 或者，是协变(Covariant)的，例如

    + 基类和派生类的指针是协变的
    + 基类和派生类的引用是协变的

  + ```cpp
    // Example 9.4.2
    #include <iostream>
    using namespace std;
    
    class Instrument {
    public:
      virtual Instrument& getObj() { return *this; }
    };
    
    class Wind : public Instrument {
    public:
      virtual Wind& getObj() { return *this;} 
      //Wind&和Instrument&协变
    };
    ```

+ 虚函数表
  + 对象自身要包含自己实际类型的信息：用虚函数表表示。运行时通过虚函数表确定对象的实际类型。
  + **虚函数表**(VTABLE)：每个包含虚函数的类用于存储虚函数地址的表(虚函数表有唯一性，即使没有重写虚函数)。
  + 每个**包含虚函数的类对象**中，编译器秘密地放一个**指针**，称为**虚函数指针**(vpointer/VPTR)，指向这个类的VTABLE。
  + 当通过基类指针做虚函数调用时，编译器静态地插入能取得这个VPTR并在VTABLE表中查找函数地址的代码，这样就能调用正确的函数并引起晚捆绑的发生。
    + **编译**期间：**建立虚函数表VTABLE**，记录每个类或该类的基类中所有已声明的虚函数入口地址。
    + **运行**期间：**建立虚函数指针VPTR**，在构造函数中发生，指向相应的VTABLE。

```cpp
// Example 9.4.3
#include <iostream>
using namespace std;
class B {
   public:
    virtual void fun1() { cout << "B::fun1()" << endl; }
    virtual void fun2() { cout << "B::fun2()" << endl; }

   private:
    int i;
    float j;
};
class D : public B {
   public:
    virtual void fun1() {
        cout << "D::fun1()" << endl;
    }  ///对fun1重写覆盖，对fun2没有，则fun2使用基类的虚函数地址
    double k;
};
int main() {
    B b;
    D d;
    B* pB = &d;
    pB->fun1();
}
```

![image-20210419083950089](https://i.loli.net/2021/04/19/LEmhf6Y7igcUnPT.png)

（图 9.4.4）

### 9.5 虚函数与构造函数、析构函数

+ 虚函数与构造函数
  + 当创建一个包含有虚函数的对象时，必须初始化它的VPTR以指向相应的VTABLE。设置VPTR的工作由构造函数完成。编译器在构造函数的开头秘密的插入能初始化VPTR的代码。
  + 构造函数不能也不必是虚函数。
    + 不能：如果构造函数是虚函数，则创建对象时需要先知道VPTR，而在构造函数调用前，VPTR未初始化。
    + 不必：构造函数的作用是提供类中成员初始化，调用时明确指定要创建对象的类型，没有必要是虚函数。
  + 在构造函数中调用一个虚函数，被调用的只是这个函数的本地版本(即当前类的版本)，即虚机制在构造函数中不工作。
  + 初始化顺序：(与构造函数初始化列表顺序无关)
    + 基类初始化
    + 对象成员初始化
    + 构造函数体
  + 原因：基类的构造函数比派生类先执行，调用基类构造函数时派生类中的数据成员还没有初始化。如果允许调用实际对象的虚函数，则可能会用到未初始化的派生类成员。

+ 虚函数与析构函数
  + 析构函数能是虚的，且常常是虚的。虚析构函数仍需定义函数体。
  + 虚析构函数的用途：当删除基类对象指针时，编译器将根据指针所指对象的实际类型，调用相应的析构函数。
  + 若基类析构不是虚函数，则删除基类指针所指派生类对象时，编译器仅自动调用基类的析构函数，而不会考虑实际对象是不是基类的对象。这可能会导致内存泄漏。
  + 在析构函数中调用一个虚函数，被调用的只是这个函数的本地版本，即虚机制在析构函数中不工作。 

```cpp
// Example 9.5.1
#include <iostream>
using namespace std;

class Base1 {
public:
  ~Base1() { cout << "~Base1()\n"; }
};

class Derived1 : public Base1 {
public:
  ~Derived1() { cout << "~Derived1()\n"; }
};

class Base2 {
public:
  virtual ~Base2() { cout << "~Base2()\n"; }
};

class Derived2 : public Base2 {
public:
  ~Derived2() { cout << "~Derived2()\n"; }
};

int main() {
  Base1* bp = new Derived1;
  delete bp; /// 只调用了基类的虚析构函数
  Base2* b2p = new Derived2;
  delete b2p; /// 派生类虚析构函数调用完后调用基类的虚析构函数
}

// Output
~Base1()
~Derived2()
~Base2()
```

+ 重要原则：总是将基类的析构函数设置为虚析构函数

### 9.6 重载、重写覆盖与重写隐藏

+ **重载(overload)：**
  + 函数名必须相同，函数参数必须不同，作用域相同(同一个类)，返回值可以相同或不同。
+ **重写覆盖(override)：**
  + 派生类重新定义基类中的**虚函数**，**函数名必须相同**，函数**参数必须相同**，**返回值一般情况应相同**。
  + 派生类的虚函数表中原基类的虚函数指针会被派生类中重新定义的虚函数指针覆盖掉。
+ **重写隐藏(redefining)：**
  + 派生类重新定义基类中的函数，**函数名相同**，但是**参数不同或者基类的函数不是虚函数**。
  + 虚函数表不会发生覆盖。
+ 重写覆盖和重写隐藏：
  + 相同点：
    + 都要求派生类定义的函数与基类同名。
    + 都会屏蔽基类中的同名函数，即派生类的实例无法调用基类的同名函数。
  + 不同点：
    + 重写覆盖要求基类的函数是虚函数，且函数参数相同，返回值一般情况应相同；重写隐藏要求基类的函数不是虚函数或者函数参数不同。
    + 重写覆盖会使派生类虚函数表中基类的虚函数的指针被派生类的虚函数指针覆盖。重写隐藏不会。

+ override与final关键字
  + 重写覆盖要满足的条件很多，很容易写错，可以使用override关键字辅助检查。
  + override关键字明确地告诉编译器一个函数是对基类中一个虚函数的重写覆盖，编译器将对重写覆盖要满足的条件进行检查，正确的重写覆盖才能通过编译。
  + 如果没有override关键字，但是满足了重写覆盖的各项条件，也能实现重写覆盖。它只是编译器的一个检查，正确实现override时，对编译结果没有影响。

+ 不想让使用者继承？-> final关键字!
  + 在虚函数声明或定义中使用时，final确保函数为虚且不可被派生类重写。可在继承关系链的“中途”进行设定，禁止后续派生类对指定虚函数重写。
  + 在类定义中使用时，final指定此类不可被继承。