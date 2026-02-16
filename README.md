# ART BATTLE Roulette  
LIMITS ART BATTLE 練習用テーマルーレット

---

## 🔗 Demo
https://intp.site/2905/art-battle-roulette

---

## 🐕 Overview

ART BATTLE「LIMITS」の個人練習用に制作した、  
**テーマ決定用ルーレット＋20分カウントダウンタイマーアプリ**です。

本番と同様の制限時間・即興性を意識し、

- 具体（モノ）
- 抽象（テーマ）

をランダムに組み合わせることで、  
短時間で発想力を鍛えるトレーニング環境を構築しました。

UIは自身のポートフォリオテーマでもある  
**「北欧ナチュラル × 犬」** をコンセプトに設計しています。

---

## 🎨 Concept

### LIMITS練習に必要だと感じた要素

- テーマ決定に迷わない
- 制作開始までの導線が早い
- 本番と同じ20分制限
- 集中を妨げないUI
- 終了が自然に伝わる演出

これらを満たすことを目的に、  
「回す → 止める → 描く」という流れを  
**1画面で完結**させました。

---

## ✨ Features

### 🎰 テーマルーレット
- 「具体」「抽象」を個別にSTART / STOP可能
- 両方確定でテーマ自動生成
- 即決用シャッフル機能搭載

例：
カニ × 境界
ナイフ × 静寂
犬 × 余韻

---

### ⏱ LIMITS公式ルール準拠タイマー
- 制作時間：**20分固定**
- 両方STOPで自動スタート
- 一時停止 / リセット対応

#### 時間通知UX
- 残り5分：テキスト通知
- 残り1分：テキスト通知
- ラスト3秒：カウントSE
- TIME UP時：完了演出

---

### 🐾 北欧ナチュラル × 犬UI

- 生成り背景とくすみカラーを基調とした配色
- 余白を活かした静かなレイアウト
- ファビコン(犬ロゴ)をUIアイコンとして再利用
- START・TIME UP時に犬ロゴが小さく喜ぶアニメーション

派手な演出ではなく、  
**集中を妨げない“さりげない感情表現”**を重視しました。

---

### 📝 履歴管理
- 生成されたテーマを自動保存
- localStorage によるブラウザ保存
- 最大50件まで保持

---

## 🛠 Tech Stack

| 分類 | 技術 |
|---|---|
| Markup | HTML5 |
| Styling | CSS3（Flex / Grid / Keyframes） |
| Logic | Vanilla JavaScript |
| Audio | Web Audio API |
| Storage | localStorage |
| Assets | SVG（自作犬ロゴ） |

※ライブラリ・フレームワーク不使用

---

## 💡 Technical Highlights

### JavaScriptのみで完結する設計
- フレームワークに依存せず、  
  DOM操作・状態管理をすべてVanilla JSで実装

---

### 状態管理を意識したロジック構成
- ルーレット回転状態
- STOP確定判定
- タイマー実行状態
- 通知トリガー制御

などを分離して管理しています。

---

### UXを意識したアニメーション制御
- CSS animation + JS再トリガー
- 強制リフロー（offsetWidth）による再生制御
- 状態変化時のみアニメーションを発火

---

### 音声制御（Web Audio API）
- ユーザー操作をトリガーにSE再生
- ブラウザ制限を考慮した実装
- 本番音源（YouTube）併用を想定した設計

---

## 📁 File Structure

index.html
README.md

1ファイル完結構成とし、  
GitHub Pages 等でも即公開可能な構造にしています。

---

## 🎯 Purpose

本作品は以下のスキルを示すことを目的としています。

- UI / UX設計力
- 世界観に沿ったビジュアル設計
- JavaScriptによる状態管理
- アニメーション演出の実装力
- 制作フローを意識したツール設計

---

## 🚀 Future Improvements

- 抽象テーマのカテゴリ分け
- 制作完了履歴の自動記録
- タイマー演出の段階的強調
- スマートフォン操作最適化
- 練習回数ログ可視化

---

## 👤 Author

Kenichi Kamoi  
Web Creator / Designer

Portfolio:  
https://intp.site/2905/Portfolio/

---

© 2026 Kenichi Kamoi

