# Swisse 防伪查询站点

## Vercel 部署

1. 在 Vercel 项目里进入 Storage。
2. Create Database，选择 Blob。
3. Access 选择 Private。
4. 绑定 Production 环境，创建后确认项目环境变量里有 `BLOB_READ_WRITE_TOKEN`。
5. 部署本项目。

## 二维码链接

通用查询链接：

```text
/index.html?lang=zh
/index.html?lang=id
```

也可以继续使用带序列号的链接：

```text
/index.html?sn=10617346508908&lang=zh
/index.html?sn=10617317570606&lang=zh
/index.html?sn=10617346508908&lang=id
/index.html?sn=10617317570606&lang=id
```

不带 `sn` 时，系统会按用户输入的 5 位防伪码自动识别对应产品。

## 有效验证码

```text
10617346508908: 19001, 19002, 19003, 19004, 19005
10617317570606: 60400, 60401, 60402, 60403, 60404
测试码: 99999，可不带序列号使用
```

有效验证码每次查询都会在 Vercel Blob 中写入一条记录。第 1 到第 10 次显示正品，超过 10 次显示高频查询。
