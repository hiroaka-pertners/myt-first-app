# 診断士1次 過去問道場

中小企業診断士 第1次試験(全7科目)の過去問・実戦演習Webアプリケーション。

## 技術スタック

- フロントエンド: React 19 + TypeScript + Vite + Tailwind CSS v4(`@tailwindcss/vite`)
- バックエンド: Express (`server.ts`, `tsx` で実行)
- AI連携: Gemini 2.5 Flash (`@google/genai`)
- ルーティング: react-router-dom v7
- 状態管理: React Context(`ProgressProvider`)+ `localStorage` / `sessionStorage`

## 開発コマンド

```bash
cp .env.example .env   # GEMINI_API_KEY を設定
npm install
npm run dev             # フロントエンド(:3000)とAPI(:3001)を同時起動
```

- `npm run dev:client` … Vite のみ起動
- `npm run dev:server` … Express API のみ起動
- `npm run build` … 型チェック + フロントエンドの本番ビルド(`dist/`)
- `npm run server` … ビルド後の `dist/` を Express から配信しつつ API を提供(本番相当)

フロントエンドの `/api/*` へのリクエストは、開発時は Vite の `server.proxy` 設定により
`http://localhost:3001` の Express サーバーへ転送される(`vite.config.ts`)。

## ディレクトリ構成

```
server.ts                  Express API (/api/explain, /api/generate-questions)
src/
  types.ts                 共通の型定義(Question, MockExamResult など)
  data/
    subjects.ts             7科目のメタデータ(色・表示名)
    questions/
      economics.ts           経済学・経済政策(9問)
      finance.ts              財務・会計(9問)
      management.ts           企業経営理論(9問)
      operations.ts           運営管理(9問)
      legal.ts                経営法務(9問)
      it.ts                   経営情報システム(9問)
      smePolicy.ts            中小企業経営・中小企業政策(9問)
      index.ts                7科目分をまとめたヘルパー(QUESTIONS_BY_SUBJECT など)
  hooks/
    useProgress.tsx          回答履歴・ブックマークの Context(localStorage永続化)
  utils/
    scoring.ts               模擬試験の採点・合否判定ロジック
    storage.ts                localStorage/sessionStorage の JSON 読み書きヘルパー
  api/
    client.ts                /api/explain, /api/generate-questions の呼び出し
  components/
    Header.tsx, ProgressBar.tsx, SubjectCard.tsx, AnswerChoices.tsx,
    QuestionPanel.tsx, AiExplainPanel.tsx, Timer.tsx
  pages/
    HomePage.tsx              科目一覧・全体進捗
    PracticePage.tsx           科目別の演習(タップ即採点)
    BookmarksPage.tsx          ブックマークした問題の一覧・復習
    StatsPage.tsx               科目別成績・正答率
    MockExamStartPage.tsx       模擬試験の説明・開始画面
    MockExamSessionPage.tsx     模擬試験の解答画面(60分タイマー)
    MockExamResultPage.tsx      模擬試験の採点結果(足切り判定・誤答レビュー)
    AiGeneratePage.tsx          AIによる追加問題生成画面
```

## 実装済み機能

- **全7科目・計63問**(各科目9問)の詳細解説付き演習問題データ(`src/data/questions/`)。
  実在の過去問文そのままの複製ではなく、出題形式・難易度を模したオリジナル問題として作成している。
- **タップ即採点**: `QuestionPanel` で選択肢をタップした瞬間に正誤判定・解説を表示(`useProgress.recordAnswer`)。
- **正答率計算**: 科目別・全体の回答数/正答率を `useProgress.getSubjectStats` で算出し、ホーム・成績画面に表示。
- **ブックマーク機能**: 問題ごとに ☆ トグルで保存し、`/bookmarks` でまとめて復習可能。
- **模擬試験モード**(`/mock-exam`): 全63問を通しで解答。60分のカウントダウンタイマー(タイムアップで自動採点)、
  科目別の得点集計、合格基準判定(総得点60%以上 かつ 全科目40%以上=足切りなし)、誤答問題の一覧レビューに対応。
- **AI深掘り解説**(`POST /api/explain`): 問題文・選択肢・正解・本人の解答を Gemini 2.5 Flash に渡し、
  既存の簡易解説より踏み込んだ解説を生成。
- **AI問題生成**(`POST /api/generate-questions`, `/ai-generate` 画面): 科目・問題数を指定すると
  Gemini 2.5 Flash が JSON スキーマ制約付きで新規の4択問題を生成する(生成結果はその場限りで永続化しない)。

## 今後の拡張候補

- 生成AIによる追加問題を `src/data/questions/` に永続保存できるレビュー・採用フロー
- 模擬試験の科目別タイマー(本番は科目ごとに制限時間が異なる)への対応
- 誤答問題を対象にした苦手分野の復習モード
