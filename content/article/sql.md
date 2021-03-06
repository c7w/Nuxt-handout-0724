---
title: SQL 基础教程 笔记
date: 2021-6-23
tags: 
- sql
categories:
- Tutorial
---

内含SQL 基础教程，主要包含数据查询基础，数据修改基础和创建数据表的方法。

<!--more-->

## 参考资料

+ https://www.liaoxuefeng.com/wiki/1177760294764384
+ https://www.runoob.com/sql/sql-tutorial.html

## 数据查询

### 基础查询

+ 查询数据表的数据

```sql
SELECT * FROM students;
```

+ 判断到数据库的连接是否有效

```sql
SELECT 1;
```

### 条件查询

+ 增加条件

```sql
SELECT * FROM students WHERE score >= 80;
```

```sql
SELECT * 
FROM students 
WHERE (score >= 60 AND score < 90) OR gender = 'M';
```

![image-20210623165451226](https://i.loli.net/2021/06/23/fEkbpC2sIXxyNLY.png)

### 投影查询

+ 仅选中指定的列，且可以为该列起别名

```sql
SELECT id alias_id, score alias_score, name
FROM students;
```

### 排序

```sql
SELECT id, name, gender, score
FROM students
ORDER BY score DESC, name ASC;
```

+ ASC 可以省略 默认升序排序

```sql
SELECT id, name, gender, score
FROM students
WHERE class_id = 1
ORDER BY score DESC;
```

### 分页查询

+ 第一页

```sql
SELECT id, name, gender, score 
FROM students
ORDER BY score DESC
LIMIT 5 OFFSET 0;
```

+ 第二页

```sql
SELECT id, name, gender, score 
FROM students
ORDER BY score DESC
LIMIT 5 OFFSET 5;
```

+ `OFFSET`超过了查询的最大数量并不会报错，而是得到一个空的结果集

### 聚合查询

```sql
SELECT COUNT(*) num FROM students;
```

+ `COUNT(*)`表示查询所有列的行数，要注意聚合的计算结果虽然是一个数字，但查询的结果仍然是一个二维表，只是这个二维表只有一行一列，并且列名是`COUNT(*)`

| 函数 | 说明                                   |
| :--- | :------------------------------------- |
| SUM  | 计算某一列的合计值，该列必须为数值类型 |
| AVG  | 计算某一列的平均值，该列必须为数值类型 |
| MAX  | 计算某一列的最大值                     |
| MIN  | 计算某一列的最小值                     |



## 修改数据

### INSERT

+ <s>出成绩</s>

```sql
INSERT INTO students 
(class_id, name, gender, score) VALUES
(2, 'c7w', 'M', 85),
(1, 'g7w', 'M', 89);
```

### UPDATE

+ <s>调分</s>

```sql
UPDATE students
SET name='xxw', score=91
WHERE id=1;
```

```sql
UPDATE students
SET score=score+5 
WHERE score<95
```

### DELETE

+ <s>退学警告</s>

```sql
DELETE FROM students
WHERE id=2
```

## 创建表

```sql
CREATE TABLE IF NOT EXISTS rara
(
id BIGINT NOT NULL AUTO_INCREMENT,
message VARCHAR(255) NOT NULL,
time TIMESTAMP NOT NULL,
PRIMARY KEY (id)
);
```

+ data_type 参数规定列的数据类型（例如 varchar、integer、decimal、date 等等）。



今天也是没有什么干劲的一天，明天再继续加油吧TaT