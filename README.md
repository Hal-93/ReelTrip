# 開発環境

開発に必要なデータベースサーバー(PostgreSQL)はDockerコンテナに同梱している。

## 🔑 環境変数とAPIキーのセットアップ

### 0-1. .envファイルを用意

用意している雛形からコピーをとる

```
cp .env.example .env
```

### 0-2. .envファイルに必要な環境変数を記述

PostgreSQL周りはすでに設定済みなので変更する必要なし

## 🛠️ 開発用Dockerセットアップ

### 1-1. Dockerをインストール

https://www.docker.com/ja-jp/<br>

### 1-2. Dockerコンテナの起動

`docker-compose.yaml`と同階層で以下のコマンドを実行し、コンテナを起動

```bash
docker compose up -d
```

## 📦 パッケージのインストール

### 2-1. node_modulesのインストール

package.jsonにある依存関係をインストール

```
npm i
```

## △ Prismaセットアップ

### 3-1. 初期化

Dockerコンテナが起動している状態で以下のコマンドを実行してPrismaを初期化する

```
npx prisma migrate dev --name init
```

### 3-2. クライアント生成

```
npx prisma generate
```

## minIO　セットアップ

### 4-1. ログイン

http://localhost:9001 にログイン<br>
ユーザー、パスワードは.env記載<br>

### 4-2. バケットの作成

WebのGUIからバケットを「reeltrip」という名前で作成
