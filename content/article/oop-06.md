---
title: OOP 课程笔记 Week 06 引用与复制
date: 2021-3-29
tags: 
- OOP
mathjax: true
cover: https://z3.ax1x.com/2021/06/07/204701.png
---

## § 6 引用与复制

### § 6.0 Overview

+ 6.1 常量引用
+ 6.2 拷贝构造函数
+ 6.3 右值引用
+ 6.4 移动构造函数
+ 6.5 赋值运算符
+ 6.6 类型转换

### § 6.1 常量引用

+ 最小特权原则：给函数足够的权限去完成相应的任务，但不要给予他多余的权限。
  + 例如函数`void add(int& a, int& b)`，如果将参数类型定义为`int&`，则给予该函数在函数体内修改a和b的值的权限
  + 如果我们不想给予函数修改权限，则可以在参数中使用常量/常量引用
  + `void add(const int& a, const int& b)`
  + 此时函数中仅能读取a和b的值，无法对a, b进行任何修改操作。

### § 6.2 拷贝构造函数

+ 拷贝构造函数是一种特殊的构造函数，它的参数是语言规定的，是同类对象的常量引用
+ `MyClass(const MyClass&) {}`
+ 拷贝构造函数被调用的三种常见情况
  + 用一个类对象定义另一个新的类对象
  + 函数调用时以类的对象为形参
  + 函数返回类对象

```cpp
// Example 6.2.1

// a
Test a; // NO
Test b(a); //YES
Test c = a; //YES

// b
Func(Test a)

// c
return a;
```

+ 如果**调用拷贝构造函数**且当前**没有**给类**显式定义**拷贝构造函数，编译器将自动合成“**隐式定义**的拷贝构造函数”，其功能是**调用所有数据成员的拷贝构造函数或拷贝赋值运算符**。
+ 隐式定义拷贝构造函数在遇到**指针类型**成员时可能会出错,导致多个指针类型的变量指向同一个地址。
+ 拷贝构造函数的频繁调用会降低程序运行的效率，解决方法：
  + 使用引用/常量引用来传参或返回对象
  + 将拷贝构造函数声明为 `private` ，或使用 `delete` 取消拷贝构造函数的隐式合成

### § 6.3 右值引用

+ 左值和右值
  + 左值：可以取地址、有名字的值。
  + 右值：不能取地址、没有名字的值; 常见于常值、函数返回值、表达式

```cpp
// Example 6.3.1
int a = 1;
int b = func();
int c = a + b;
// 其中a、b、c为左值，1、func函数返回值、a+b的结果为右值。
```

+ 右值引用
  + 虽然右值无法取地址，但可以被&&引用(右值引用)
    + `int &&e = a+b;`
  + 右值引用无法绑定左值
    + `int &&e = a; //Compile Error`
  + 例外：常量左值引用能也绑定右值
    + `const int &e = 3;`

### § 6.4 移动构造函数

+ 移动构造函数
  + 右值引用可以延续即将销毁变量的生命周期，用于构造函数可以**提升处理效率**，在此过程中尽可能少地进行拷贝。
  + 使用右值引用作为参数的构造函数叫做移动构造函数。

```cpp
// Example 6.4.1

// 拷贝构造函数
ClassName(const ClassName& VariableName);
// 移动构造函数
ClassName(ClassName&& VariableName);
```

+ 移动构造函数与拷贝构造函数最主要的差别就是类中堆内存是重新开辟并拷贝，还是直接将指针指向那块地址。
+ 对于一些即将析构的临时类，移动构造函数直接利用了原来临时对象中的堆内存，新的对象无需开辟内存，临时对象无需释放内存，从而大大提高计算效率。

```cpp
// Example 6.4.2

class Test {
public:
	int * buf; //// only for demo.
	Test() {
		buf = new int[10]; //申请一块内存
		cout << "Test(): this->buf @ " << hex << buf << endl;
	}
	~Test() {
		cout << "~Test(): this->buf @ " << hex << buf << endl;
		if (buf) delete[] buf;
	}
	Test(const Test& t) : buf(new int[10]) {
		for(int i=0; i<10; i++) 
			buf[i] = t.buf[i]; //拷贝数据
		cout << "Test(const Test&) called. this->buf @ "
			<< hex << buf << endl;
	}
	Test(Test&& t) : buf(t.buf) { //直接复制地址，避免拷贝
		cout << "Test(Test&&) called. this->buf @ "
			<< hex << buf << endl;
		t.buf = nullptr; //将t.buf改为nullptr，使其不再指向原来内存区域
	}
};

Test GetTemp() {
	Test tmp;
	cout << "GetTemp(): tmp.buf @ "
		<< hex << tmp.buf << endl;
	return tmp;
}

void fun(Test t) {
	cout << "fun(Test t): t.buf @ "
		<< hex << t.buf << endl;
}

int main() {
	Test a = GetTemp();
	cout << "main() : a.buf @ " << hex << a.buf << endl;
	fun(a);
	return 0;
}

// g++ test.cpp --std=c++11 -fno-elide-constructors -o test
```

+ 移动语义
  + `std::move` 函数
    + 输入：左值（包括变量等，该左值一般不再使用）
    + 返回值：该左值对应的右值

### § 6.5 赋值运算符

+ 拷贝复制运算符

```cpp
// Example 6.5.1

// 区分
ClassName a;
ClassName b;
a = b;

ClassName a = b;

// 前者调用
ClassName& operator= (const ClassName& right) {
   if (this != &right) {// 避免自己赋值给自己
		// 将right对象中的内容拷贝到当前对象中...
	}
   return *this;
}
```

+ 移动赋值运算符

```cpp
// Example 6.5.2
Test& operator= (Test&& right) {
	if (this == &right)  cout << "same obj!\n";
	else {	
		this->buf = right.buf;  //直接赋值地址
		right.buf = nullptr;
	cout << "operator=(Test&&) called.\n";
}
	return *this;
}
```

### § 6.6 类型转换

1. 在源类中定义**目标类型转换运算符**

```cpp
// Example 6.6.1
#include <iostream>
using namespace std;


class Dst { //目标类Destination
public:
  Dst() { cout << "Dst::Dst()" << endl; }
};



class Src { //源类Source
public:
  Src() { cout << "Src::Src()" << endl; }
  operator Dst() const { 
	cout << "Src::operator Dst() called" << endl;
	return Dst(); 
  }
};
```

2. 在目标类中定义“源类对象作参数的构造函数”

```cpp
// Example 6.6.2
#include <iostream>
using namespace std;

class Src;	// 前置类型声明，因为在Dst中要用到Src类
class Dst {
public:
  Dst() { cout << "Dst::Dst()" << endl; }
  Dst(const Src& s) { 
	cout << "Dst::Dst(const Src&)" << endl; 
  }
};

class Src {
public:
  Src() { cout << "Src::Src()" << endl; }
};
```

+ 注意：两种自动类型转换的方法不能同时使用，使用时请任选其中一种。

+ 禁止自动类型转换
  + 如果用 `explicit` 修饰类型转换运算符或类型转换构造函数，则相应的类型转换必须显式地进行

