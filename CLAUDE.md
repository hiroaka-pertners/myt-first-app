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
    useCustomQuestions.tsx    AI採用問題の Context(サーバーの /api/custom-questions と同期)
  utils/
    scoring.ts               模擬試験の採点・合否判定ロジック
    storage.ts                localStorage/sessionStorage の JSON 読み書きヘルパー
  api/
    client.ts                /api/explain, /api/generate-questions, /api/custom-questions の呼び出し
  components/
    Header.tsx, ProgressBar.tsx, SubjectCard.tsx, AnswerChoices.tsx,
    QuestionPanel.tsx, AiExplainPanel.tsx, Timer.tsx
  pages/
    HomePage.tsx              科目一覧・全体進捗
    PracticePage.tsx           科目別の演習(タップ即採点、AI採用問題を含む)
    BookmarksPage.tsx          ブックマークした問題の一覧・復習
    ReviewMistakesPage.tsx      間違えた問題だけを集めた苦手復習モード
    StatsPage.tsx               科目別成績・正答率
    MockExamStartPage.tsx       模擬試験の説明・開始画面
    MockExamSessionPage.tsx     模擬試験の解答画面(60分タイマー)
    MockExamResultPage.tsx      模擬試験の採点結果(足切り判定・誤答レビュー)
    AiGeneratePage.tsx          AIによる追加問題生成・採用画面
data/
  custom-questions.json      採用済みAI生成問題の永続化ファイル(gitignore対象、サーバー起動時に自動生成)
```

## 実装済み機能

- **全7科目・計63問**(各科目9問)の詳細解説付き演習問題データ(`src/data/questions/`)。
  実在の過去問文そのままの複製ではなく、出題形式・難易度を模したオリジナル問題として作成している。
- **タップ即採点**: `QuestionPanel` で選択肢をタップした瞬間に正誤判定・解説を表示(`useProgress.recordAnswer`)。
- **正答率計算**: 科目別・全体の回答数/正答率を `useProgress.getSubjectStats` で算出し、ホーム・成績画面に表示。
  AI採用問題(下記)も合算した問題数・正答率が反映される。
- **ブックマーク機能**: 問題ごとに ☆ トグルで保存し、`/bookmarks` でまとめて復習可能。
- **苦手復習モード**(`/review-mistakes`): これまでに間違えた問題だけを一覧表示し、「もう一度解く」で
  回答記録をリセットして再挑戦できる(`useProgress.clearAnswer`)。
- **模擬試験モード**(`/mock-exam`): 全63問(コア問題のみ、AI採用問題は含まない)を通しで解答。
  60分のカウントダウンタイマー(タイムアップで自動採点)、科目別の得点集計、
  合格基準判定(総得点60%以上 かつ 全科目40%以上=足切りなし)、誤答問題の一覧レビューに対応。
- **AI深掘り解説**(`POST /api/explain`): 問題文・選択肢・正解・本人の解答を Gemini 2.5 Flash に渡し、
  既存の簡易解説より踏み込んだ解説を生成。
- **AI問題生成・採用フロー**(`POST /api/generate-questions`, `/ai-generate` 画面): 科目・問題数を指定すると
  Gemini 2.5 Flash が JSON スキーマ制約付きで新規の4択問題を生成する。生成された問題ごとに
  「◯◯に採用する」ボタンで `POST /api/custom-questions` を呼び、`data/custom-questions.json` に永続化。
  採用後はその科目の演習(`PracticePage`)・成績集計・ブックマーク・苦手復習にも通常の問題と同様に登場する
  (`useCustomQuestions` がサーバーの永続化ストアと同期し、コア問題とマージする)。
  `DELETE /api/custom-questions/:id` で個別に取り消すことも可能。

## 意図的に対応していないこと

- **模擬試験の科目別タイマー**: 本番の中小企業診断士1次試験は科目ごとに制限時間が異なるが、
  本アプリの模擬試験は元の要件どおり「全体で60分」の単一タイマーとしている。科目別タイマーへの変更は
  既存の合意済み仕様を上書きすることになるため、依頼があるまでは変更しない。

## 今後の拡張候補

- 模擬試験にAI採用問題を含めるかどうかの選択オプション
- AI採用問題の一括レビュー・編集・並べ替えができる管理画面
