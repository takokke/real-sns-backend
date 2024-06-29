# Node.js&Express&MongoDB 学習用リポジトリ
参考動画

[【完全保存版】MERNフルスタック開発で本格的なSNSアプリを１から自分の手で構築してみよう](https://www.udemy.com/course/fullstack-mern-project-course/?couponCode=JPLETSLEARNNOW)
## 目的
1. Node.jsでRest APIを作れるようになる。
1. SPAでのログイン機能を作れるようになる。ライブラリをなるべく使わずに作り、認証機能の仕組みを理解する
1. 既存の開発環境にTypeScriptを導入することができるようになる

## 負荷の設定
### 1. Common JSをES modulesに書き換える。
適切にpackage.jsonを編集する。
### 2. TypeScriptで書き換える。
tsconfig.jsonの編集。
必要なライブラリを取り込む。
- typescript
- @types/node
- @types/express

## トランスコンパイルとファイル変更監視を同時に行う
ts-nodeでtsファイルを起動したかったが、できなかった。
そのため、トランパイルしたjsファイルをnodeで起動することにした。

1. node dist/server.jsでサーバーを再起動
2. src配下のtsファイルが変更されたときに、TS→JSへのトランスコンパイル
の2つを``npm run start``で行いたい。
そのため、concurrentlyパッケージを使用する
```
npm install concurrently -D
```
package.jsonのscriptを修正
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "concurrently \"npm run watch\" \"npm run dev\"",
    "dev": "nodemon dist/server.js",
    "watch": "tsc -watch",
    "build": "tsc"
  },
```