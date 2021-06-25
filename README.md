# 餐廳評論網 restaurant-forum

此專案為餐廳論壇網站，提供使用查詢、評論餐廳。

### Demo

[Heroku](https://mighty-springs-40479.herokuapp.com/)

| email             | password |
| ----------------- | -------- |
| root@example.com  | 12345678 |
| user1@example.com | 12345678 |
| user2@example.com | 12345678 |

## Features - 功能描述

#### 前台

- 使用者可以瀏覽餐廳資訊
- 使用者可以依據餐廳類別查詢
- 使用者可以註冊帳號、登入
- 使用者可以留下對餐廳的評論
- 使用者可以收藏餐廳
- 使用者可以對餐廳點 Like
- 使用者可以追蹤其他使用者
- 使用者可以瀏覽餐廳最新消息
- 使用者可以編輯帳號頭像與暱稱

#### 後台

- 管理員可以新增餐廳
- 管理員這可以編輯餐廳介紹
- 管理員可以刪除餐廳
- 管理員可以新增餐廳類別
- 管理員可以修改餐廳類別名稱
- 管理員可以刪除餐廳類別
- 管理員可以修改使用者權限

## Installing - 專案安裝流程

1.開啟終端機(Terminal)，Clone 此專案至本機電腦。

```
git clone https://github.com/wintersprouter/restaurant-forum-express
```

2.CD 進入存放此專案的資料夾

```
cd restaurant-forum-express
```

3.安裝 npm 套件

```
輸入 npm install 指令

```

4.設定 database

```
username: root
password: password
database: forum
```

5.Migrate

```
$ npx sequelize db:migrate
```

6.設定環境變數.env

```
1. add .env              <add file name .env>
2. IMGUR_CLIENT_ID=XXX   <your imgur client id>
3. SECRET=XXX            <set your secret string>

```

4.新增種子資料

```
輸入 npm run seed 指令
```

5.啟動伺服器，執行 app.js 檔案

```
輸入 npm run dev 指令
於任一瀏覽器輸入 http://localhost:3000
```

## Environment SetUp - 環境建置

- Visual Studio Code - 開發環境
- Node.js - JavaScript 執行環境
- mysql2: 2.2.5 - 資料庫
- sequelize: 6.3.5
- sequelize-cli: 6.2.0
- Express: 4.17.1 - 應用程式架構
- Express-Handlebars: 5.2.0 - 模板引擎
- Express-session: 1.17.1
- Body-parser: 1.19.0
- Method-override: 3.0.0
- Bcryptjs: 2.4.3
- Connect-flash: 0.1.1 - 快閃訊息
- Dotenv: 9.0.0 - 管理環境變數
- Faker: 5.5.3
- Passport: 0.4.1 - 使用者認證
- Passport-local: 1.0.0 - 使用者本地登入驗證
- imgur-node-api: 0.1.0
- moment: 2.29.1
- multer: 1.4.2
