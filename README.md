# ティラノスクリプト用「メッセージ枠調整プラグイン」

## 概要

[position] 関係の強制的な指定を解消するプラグインです。

## 主な機能

- message_inner が自動的に 10px ズレるのを解消できます。（※ふきだしを使う場合は解消できません）
- メッセージの行間（`line-height`）を px 指定から単位なしへ変更可能です。
- `message_inner p` に自動指定される `margin-top` を、縦書き時は `margin-right` へ変更します。また、数値を変更できます。

### 出来ない事

- **ふきだし使用時は、10px ズレの解消はできません。**

## 使い方

1. 「message_frame」フォルダを `data/others/plugin` に 入れてください。
2. `first.ks` 等、ゲーム起動時に必ず通過するシナリオファイルに下記コードを記述しプラグインを読み込みます。
   ```
   [plugin name="message_frameg"]
   ```
3. 必要があれば、[plugin] タグにパラメータを指定してください。

## パラメーター

| パラメータ名 | 必須 | 説明                                                                      |      初期値      |
| ------------ | :--: | ------------------------------------------------------------------------- | :--------------: |
| line_height  |  ×   | `message_inner` の `line-heigth` を指定します。\*1                        | 単位なし（自動） |
| padding_top  |  ×   | `message_inner p` の `padding-top` 値を指定します（px 値、数値のみ）。\*1 |        0         |
| align_inner  |  ×   | `message_inner` の 10px ズレを 0 にする場合は `true` \*1                  |      `true`      |

\*1 ティラノの仕様のままにする場合は `false` を指定します。

**サンプルコード**

- 例 1：行間を単位無しに、message_inner p の padding-top 0 に、message_inner の 10px ズレを無しに。

  ```tyranoscript
  [plugin name="message_frameg"]
  ```

- 例 2：全てティラノのデフォルトのままにする。

  ```tyranoscript
  [plugin name="message_frameg" line_height="false" padding_top="false" align_inner="false"]
  ```

- 例 3：行間は単位無しで 1.8 に指定。padding-top 0 、message_inner の 10px ズレ無し。

  ```tyranoscript
  [plugin name="message_frameg" line_height="1.8"]
  ```

## 動作確認

ティラノスクリプト v520c

## 注意点

ティラノスクリプトのエンジン本体を改造しています。  
同じ関数を変更しているプラグインとの併用はできません。

**動作確認バージョン以外のティラノスクリプトでの動作は保障できません。**
**ティラノスクリプト v520 以降専用です。下位バージョンとの互換性はありません。**

## 改造項目

| ファイル名   | 関数名                                          |
| ------------ | ----------------------------------------------- |
| kag.layer.js | tyrano.plugin.kag.layer.refMessageLayer         |
| kag.tag.js   | tyrano.plugin.kag.tag.text.setMessageInnerStyle |
| kag.tag.js   | tyrano.plugin.kag.tag.text.setCurrentSpanStyle  |

## 免責

このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。

## 利用規約

- 改造・再配布は自由です。ただし、有償での再配布は禁止します。  
  改造後データの配布も同様にお願いします。
- 利用報告・クレジット表記は任意です。
- このプラグインはドネーションウェア（カンパウェア）です。  
  もしお役に立てましたら寄付にてご支援を頂ければ幸いです。開発・運営費用とさせて頂きます。
  詳しくはブログの「利用規約」をご確認ください。  
   [https://memocho.no-tenki.me/terms](https://memocho.no-tenki.me/terms)

## 制作者

name ： hororo  
site ： めも調　[https://memocho.no-tenki.me/](https://memocho.no-tenki.me/)  
mail ： ruru.amu@gmail.com  
twitter ： [@hororo_memocho](https://twitter.com/hororo_memocho)

## 更新履歴

Github リリースノート [https://github.com/amuhororo/message_frame_plugin/releases](https://github.com/amuhororo/message_frame_plugin/releases)

| 更新日     | Ver     | 詳細                                                                              |
| ---------- | ------- | --------------------------------------------------------------------------------- |
| 2022/11/11 | ver3.50 | ティラノ 520c 対応。自動改ページ調整は削除。                                      |
| 2022/06/05 | ver3.40 | ティラノ 513c 対応。パラメータ名変更。自動改ページ時のクリック待ち対応。          |
| 2021/07/16 | ver3.30 | ティラノ 507b 対応。自動改ページを強化。他微調整。                                |
| 2020/09/03 | ver3.20 | ティラノ 504 対応。機能変更なし                                                   |
| 2018/03/21 | ver3.10 | ティラノ 470 対応。message_inner の 10px ズレ防止。自動改ページを強化。他微調整。 |
| 2017/06/04 | ver3.00 | ティラノ 450 対応。ルビ表示関係機能を削除。message_inner の padding 調整を追加。  |
| 2016/08/08 | ver2.03 | ロード後にエラーで止まってしまう不具合を修正。                                    |
| 2016/08/06 | ver2.02 | Config.tjs defaultRubyOffset 値を使用してのルビの表示位置変更に対応。             |
| 2016/07/10 | ver2.01 | フォルダ名間違い修正                                                              |
| 2016/07/10 | ver2.00 | line-height の単位ありなし選択可能に、ルビ表示関係を追加。                        |
| 2016/07/01 | ver1.00 | 公開                                                                              |
