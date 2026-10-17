# 逆面接AI — FLEXY AI Tenshoku Yoshioka

「面接されるのは、会社のほうだ。」

FLEXY AIハッカソン用の動作プロトタイプ。希望職種・年収・働き方を入力すると、架空の企業3社に代理で質問し、模擬回答と比較スコアを表示します。

## 実装

- index.html: 画面とデモモード。外部API、インストール不要で動きます
- ai-enhancement.js: AIモードのクライアント拡張
- api/interview.js: Vercel Node.js Function。APIキーをサーバー側の環境変数に置き、OpenAI APIで架空企業との対話を生成
- api/health.js: 配備のヘルスチェック
- tests/api.test.js: Node.jsのバックエンドテスト

**企業はすべて架空です。実在企業を自動検索したり、実在の企業担当者へ面接する機能はありません。** スコアは説明用のルールベースです。AIモードは会話生成のみです。

## 最速：GitHub Pages（デモモード）

1. GitHubリポジトリの Settings → Pages を開く
2. Source: Deploy from a branch / Branch: main / Folder: (root) を設定して保存
3. 公開先： https://softrenzu.github.io/FLEXY-AI-Tenshoku-Yoshioka/

ブラウザだけで動作します。OpenAIへの接続はなく、API料金もかかりません。GitHub Pagesの設定が未完了の場合はURLがまだ表示されません。

## AIモード：Vercel（推奨）

1. VercelにGitHubアカウントでログインし、このリポジトリを Import
2. Framework Preset を Other、Root Directory を ./、Build Commandは無しに設定
3. VercelのProject Settings → Environment Variablesで OPENAI_API_KEY をサーバー側にだけ登録（OPENAI_MODEL は任意）
4. Deploy後、公開URLから逆面接を実行し、応答の文章がAIによって生成されることを確認

APIキー未設定時、期限切れ、ネットワーク障害ではデモモードになります。/api/health でAPIの有効状態を確認できます。**GitHubやHTMLにはAPIキーを書かないでください。** 公開エンドポイントの利用料が発生するため、一般公開前にアクセス制御・予算上限・レート制限を設けてください。

## さくらインターネット

- さくらのレンタルサーバ：index.html と ai-enhancement.js を公開フォルダへ配置すれば、デモモードは動きます。Node.js版のAPIはそのままでは動きません。
- さくらのVPS / クラウド：Node.js/HTTPS/リバースプロキシを設定して独自のAPIサーバーを構築すればAIモードも運用できます。ただし当日のデプロイ先はVercelが適しています。

## ローカル確認

index.html を開くか、python3 -m http.server 8080 からアクセス。テストは npm test（Node.js 20以上）。

## ハッカソンの権利・情報保護

- 主催者配布の匿名加工データは使っていません。配布データを公開リポジトリや公開URLに置かないでください。
- 参加賞の進呈に伴う成果物の権利帰属・商用化条件が公式資料にあります。主催者の許可なく商用化・継続開発しないでください。
- 外部に公開する前に成果物の公開条件を確認してください。
- サムネイル画像は別途必要です。
