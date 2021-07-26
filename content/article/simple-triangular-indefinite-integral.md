---
title: 三角函数的正整数幂的不定积分
date: 2020-11-22 09:36:41
tags: 
- Calculus
mathjax: true
cover: https://s3.ax1x.com/2020/11/22/DGBt7q.png
---

啊说真的排版好麻烦明天再来调吧

## Knowledge Base

+ 换元法（凑微分法）

$$
\int f'(\phi(x))\phi'(x)dx = \int f'(\phi(x))d\phi(x) = f(\phi(x))+C
$$

$$
\int f'(u)du = \int f'(\phi(x)) \phi'(x)dx = g(x)+C = g(\phi^{-1} (x))+C
$$

+ 分部积分法



## 关于三角函数的幂的积分

### sin 或 cos 的幂

若指数中存在奇数：
$$
\int \cos^7x \sin^{10}xdx
$$

1. 选定 cos 与 sin 中次幂较低，且为奇数的一个，使用凑微分法
2. 使用公式 $sin^2x+cos^2x=1$ 替换掉剩下的项

*Solve:*
$$
\begin{aligned}
&\int \cos ^{7} x \sin ^{10} x d x \\
&=\int \cos ^{6} x \sin ^{10} x d \sin x \\
&=\int\left(1-\sin ^{2} x\right)^{3} \sin ^{10} x d \sin x \\
(t &=\sin x) \\
&= \int\left(1-3 t^{2}+3 t^{4}-t^{6}\right) t^{10} d t \\
&=\int\left(t^{10}-3 t^{12}+3 t^{14}-t^{16}\right) d t \\
&=\frac {t^{11}} {11}-\frac{3}{13} t^{13}+\frac{3}{15} t^{15}-\frac{1}{17} t^{17}+C \\
&=\frac{1}{11} \sin ^{11} x-\frac{3}{13} \sin ^{2} x+\frac{1}{5} \sin ^{10} x-\frac{1}{17} \sin ^{17} x+C
\end{aligned}
$$

若指数中不存在奇数：
$$
\quad \int \cos ^{2} x \sin ^{4} x d x
$$

1. 使用二倍角公式
2. 展开后分别积分

*Solve:*

$\quad \int \cos ^{2} x \sin ^{4} x d x=\int \frac{1+\cos 2 x}{2} \frac{\left(1-\cos ^{2} x\right)^{2}}{4} d x$
$=\frac{1}{8} \int\left(\cos ^{2} 2 x-2 \cos 2 x+1\right)(1+\cos 2 x) d x$
$=\frac{1}{8} \int\left(\cos ^{3} 2 x-\cos ^{2} 2 x-\cos 2 x+1\right) d x$
$=\frac{1}{8} \int \cos ^{3} 2 x d x-\frac{1}{8} \int \cos ^{2} 2 x d x-\frac{1}{8} \int \cos 2 x d x+\frac{1}{8} \int d x$
$=\frac{1}{8} \cdot \frac{1}{2} \int \cos ^{2} 2x d \sin 2 x-\frac{1}{8} \int \frac{1+\cos 4 x}{2} d x-\frac{1}{8} \cdot \frac{1}{2} \sin 2 x+\frac{1}{8} x+C
$

$=\frac{1}{16} \int d \sin 2 x-\frac{1}{16} \int \sin ^{2} 2 x d \sin 2 x-\frac{1}{16} x-\frac{1}{16} \cdot \frac{1}{4} \sin 4 x-\frac{1}{16} \sin 2 x+\frac{1}{8} x+C$

$=\frac{x}{16}-\frac{\sin^32x}{48}-\frac{\sin4x}{64}+C$



### tan 与 cot 的幂

$$
\int \tan ^{4} x d x
$$

使用公式 $ \tan ^{2} x=\sec ^{2} x-1 $
$$
\begin{array}{l}
\int \tan ^{0} x d x=\int d x=x+C \\
\int \tan ^{1} x d x=\int \frac{\sin x}{\cos x} d x=-\int \frac{1}{\cos x} d \cos x=-\ln |\cos x|+C \\
\qquad=\ln |\sec x|+C \\
\end{array}
$$

$$
\begin{aligned}
I_{n} &=\int \tan ^{n} x d x \\
&=\int \tan ^{n-2} x \tan ^{2} x d x \\
&=\int \tan ^{n-2} x\left(\sec ^{2} x-1\right) d x \\
&=\int \tan ^{n-2} x \sec ^{2} x d x-\int \tan ^{n-2} x d x \\
&=\int \tan ^{n-2} x d \tan x-\int \tan ^{n-2} x d x \\
&=\frac{1}{n-1} \cdot \tan ^{n-1} x-I_{n-2}
\end{aligned}
$$

*Solve:*
$$
\begin{aligned}
\int \tan ^{4} x d x &=\int \tan ^{2} x\left(\sec ^{2} x-1\right) d x \\
&=\int \tan ^{2} x \sec ^{2} x d x-\int \tan ^{2} x d x \\
&=\frac{1}{3} \tan ^{3} x-\int \sec ^{2} x d x+\int d x \\
&=\frac{1}{3} \tan ^{3} x-\tan x+x+C
\end{aligned}
$$
cot 的幂读者自证不难.



### sec 与 csc 的幂


$$
\begin{aligned}
\int \sec x d x &=\int \frac{(\sec x)(\sec x+\tan x)}{\sec x+\tan x} d x \\
&=\int \frac{\sec x \tan x+\sec ^{2} x}{\sec x+\tan x} d x \\
&=\ln |\sec x+\tan x|+C \\
\int \sec ^{2} x d x &=\tan x+C
\end{aligned}
$$

$$
\begin{aligned}
\int \sec ^{n} x d x &=\int \sec ^{n-2} x \sec ^{2} x d x \\
&=\int \sec ^{n-2} x d \tan x \\
&=\sec ^{n-2} x \tan x-\int \tan x(n-2) \sec ^{n-3} x \sec x \tan x d x \\
&=\sec ^{n-2} \tan x-(n-2) \int \sec ^{n-2} x \tan ^{2} x d x \\
&=\sec ^{n-2} x \tan x-(n-2) \int \sec ^{n-2} x\left(\sec ^{2} x-1\right) d x \\
&=\sec ^{n-2} x \tan x-(n-2) \int \sec ^{n} x d x+(n-2) \int \sec ^{n-2} x d x \\
\end{aligned}
$$

因此我们有：
$$
\int \sec ^{n} x d x=\frac{1}{n-1} \sec ^{n-2} x \tan x+\frac{n-2}{n-1} \int \sec ^{n-2} x d x
$$
csc 的幂同理显然.