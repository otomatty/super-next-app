# ライブラリ詳細

このプロジェクトで使用している主要なライブラリとその具体的な活用方法について説明します。

## フロントエンド

### Next.js
- **バージョン**: 15.x
- **用途**: アプリケーションフレームワーク
- **主な活用機能**:
  - App Router: ファイルベースのルーティング
  - React Server Components: パフォーマンス最適化
  - Streaming: ユーザー体験の向上
  - Edge Runtime: 高速なレスポンス

### Tailwind CSS
- **バージョン**: 4.x
- **用途**: UIスタイリング
- **カスタマイズ**:
  - カスタムカラーパレット
  - レスポンシブデザイン設定
  - アニメーション設定

### Shadcn UI
- **用途**: UIコンポーネント
- **カスタマイズ**:
  - ダークモード対応
  - アクセシビリティ対応
  - カスタムテーマ設定

## バックエンド

### Supabase
- **用途**: バックエンドサービス
- **主な活用機能**:
  - 認証システム
  - リアルタイムサブスクリプション
  - Row Level Security
  - ストレージ

## 開発ツール

### Turborepo
- **用途**: モノレポ管理
- **主な活用機能**:
  - Remote Caching
  - タスク依存関係の管理
  - ワークスペース設定

### Biome
- **用途**: コード品質管理
- **主な設定**:
  - カスタムルール
  - 自動フォーマット
  - TypeScript統合

## テスト・検証

### Playwright
- **用途**: E2Eテスト
- **テストカバレッジ**:
  - 認証フロー
  - ユーザーフロー
  - レスポンシブデザイン

### Zod
- **用途**: スキーマ検証
- **主な活用**:
  - APIリクエスト/レスポンス
  - フォームバリデーション
  - 型安全性の確保

## 国際化

### i18next
- **用途**: 多言語対応
- **設定**:
  - 日本語/英語対応
  - サーバーサイド翻訳
  - 動的な言語切り替え

## データ管理

### React Query
- **バージョン**: 4.x
- **用途**: データフェッチング
- **主な活用機能**:
  - キャッシュ管理
  - 楽観的更新
  - リアルタイム更新

---

各ライブラリの詳細な設定や使用方法については、それぞれのソースコードやコメントを参照してください。 