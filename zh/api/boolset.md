# Boolset 编码与解码 {#boolset-encoding-and-decoding}

Boolset 是一种用于表示布尔值集合的编码方式。它将布尔值集合转换为字符串，以便于存储和传输。Cloudreve 的 API 中，Boolset 通常用于权限设置，比如用户组权限、文件权限。

## 内部表示 {#internal-representation}

`BooleanSet` 类型本质上是一个字节切片 (`[]byte`)。在这个切片中，每一个比特位（bit）代表一个布尔值（权限开关）。

- 第 `0` 个标志位对应字节切片中第 `0` 个字节的第 `0` 个比特位。
- 第 `1` 个标志位对应字节切片中第 `0` 个字节的第 `1` 个比特位。
- ...
- 第 `7` 个标志位对应字节切片中第 `0` 个字节的第 `7` 个比特位。
- 第 `8` 个标志位对应字节切片中第 `1` 个字节的第 `0` 个比特位。
- 以此类推...

一个比特位的值为 `1` 表示对应的标志位为 `true`（启用），为 `0` 表示 `false`（禁用）。

## 编码过程 {#encoding-process}

1.  **确定最大索引**: 找出需要表示的所有标志位中的最大索引 `max_n`。
2.  **计算字节数**: 确定所需的字节数。至少需要 `floor(max_n / 8) + 1` 个字节来容纳所有标志位。
3.  **初始化字节序列**: 创建一个包含所需字节数的字节序列，并将所有字节初始化为 `0`。
4.  **设置标志位**: 对于每一个需要设置为 `true` 的标志位 `n`：
    - 定位到字节序列中的第 `byte_index = floor(n / 8)` 个字节。
    - 计算该字节内的位索引 `bit_index = n % 8`。
    - 将该字节的第 `bit_index` 位设置为 `1`。这通常通过按位或 (Bitwise OR) 操作完成：`byte[byte_index] = byte[byte_index] | (1 << bit_index)`。
5.  **Base64 编码**: 将最终的字节序列编码为 Base64 字符串。

## 解码过程 {#decoding-process}

1.  **Base64 解码**: 首先将 Base64 字符串解码为原始的字节序列。
2.  **检查标志位**: 要检查特定标志位 `n` 的状态（是 `true` 还是 `false`）：
    - 计算字节索引 `byte_index = floor(n / 8)`。
    - **边界检查**: 检查 `byte_index` 是否在字节序列的有效范围内。如果超出范围，则该标志位隐式为 `false`（因为它从未被设置过）。
    - 如果 `byte_index` 有效，则定位到字节序列中的第 `byte_index` 个字节。
    - 计算位索引 `bit_index = n % 8`。
    - 检查该字节的第 `bit_index` 位的值。这通常通过按位与 (Bitwise AND) 操作完成：`is_set = (byte[byte_index] & (1 << bit_index)) != 0`。
    - 如果结果非零，则标志位 `n` 为 `true`；否则为 `false`。

## 编程语言实现 {#programming-language-implementation}

### Golang

[boolset.go](https://github.com/cloudreve/Cloudreve/blob/master/pkg/boolset/boolset.go)

```go
// 从字符串加载
bs, err := boolset.FromString("/f8B")
if err != nil {
	return nil, err
}

// 读取第 5 个标志位
fmt.Println(bs.Enabled(5))

// 设置第 1 个标志位
boolset.Set(1, true, bs)

// 保存到字符串
encoded, err := bs.String()
if err != nil {
	return nil, err
}
```

### TypeScript

[boolset.ts](https://github.com/cloudreve/frontend/blob/master/src/util/boolset.ts)

```typescript
// 从字符串加载
const bs = new Boolset("/f8B");

// 读取第 5 个标志位
console.log(bs.enabled(5));

// 设置第 1 个标志位
bs.set(1, true);

// 保存到字符串
const encoded = bs.toString();
```

## 标识位定义 {#flag-definition}

### 用户组权限 {#group-permission}

| 标志位 | 描述                                 |
| ------ | ------------------------------------ |
| `0`    | 是否为管理员                         |
| `1`    | 是否为匿名用户组                     |
| `2`    | 是否可以分享文件                     |
| `3`    | 是否可以访问 WebDAV                  |
| `4`    | 是否可以服务端打包下载               |
| `5`    | 是否可以执行归档压缩任务             |
| `6`    | 是否可以开启 WebDAV 代理             |
| `7`    | 是否可以下载他人分享                 |
| `8`    | 是否可以免费下载分享                 |
| `9`    | 是否可以离线下载                     |
| `10`   | 是否可以转移存储策略                 |
| `11`   | 是否使用重定向直链                   |
| `12`   | 是否可以使用高级删除选项             |
| `13`   | 是否可以选择指定节点处理任务         |
| `14`   | 是否可以为匿名用户设置更高的分享权限 |

### 文件权限 {#file-permission}

| 标志位 | 描述 |
| ------ | ---- |
| `0`    | 读   |
| `1`    | 更新 |
| `2`    | 创建 |
| `3`    | 删除 |

### 节点功能 {#node-function}

| 标志位 | 描述             |
| ------ | ---------------- |
| `0`    | 预留位，不要使用 |
| `1`    | 创建压缩文件     |
| `2`    | 解压缩文件       |
| `3`    | 离线下载         |
| `4`    | 转移存储策略     |
