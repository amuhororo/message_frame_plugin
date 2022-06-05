# ティラノスクリプト用「メッセージ枠調整プラグイン」


## 概要

[position] 関係の強制的な指定を解消するプラグインです。


### 主な機能

- [position] タグの各margin値を継承できるようになります。  
  （※4方向共 `padding` になり、message_inner に `box-sizing: border-box` が指定されます）
- message_innerが自動的に10pxズレるのを解消できます。（※ふきだしを使う場合は解消できません）
- メッセージの行間（`line-height`）をpx指定から単位なしへ変更可能です。
- `message_inner p` に自動指定される `margin-top` を、縦書き時は `margin-right` へ変更します。また、数値を変更できます。
- 自動改ページを微調整しています。また、クリック待ちを入れる事ができます。（※改行orタグが必要）

### 出来ない事

- ふきだし機能は、10pxズレの解消はできません。


## 使い方

1. data/others/plugin に 「message_frame」フォルダを入れてください。
2. first.ks でプラグインを呼び出してください。
   ```
   [plugin name="message_frameg"]
   ```
3. 通常通り、`[position]` タグでメッセージレイヤを指定します。


## パラメーター
（※デフォルトの場合は省略可）

| パラメータ名 | 必須 | 説明 |
|--------------|:----:|------|
| line_height  |  ×  | `message_inner` の `line-heigth` を指定します。*1<br>省略時は自動計算で単位なし。 |
| padding_top  |  ×  | `message_inner p` の `padding-top` 値を指定します（px値、数値のみ）。*1<br>省略時は 0。 |
| align_outer  |  ×  | `message_inner` の10pxズレを0にする場合は `true`。*1<br>省略時は `true`。 |
| auto_p       |  ×  | 自動改ページ時にクリック待ちを入れる場合は `true`。<br>省略時は `false`。 |

*1 ティラノの仕様のままにする場合は `default` を指定します。


## 記述例

- 例1：行間を単位無しに、message_inner p の padding-top 0 に、message_inner の 10pxズレを無しに。
  ```
  [plugin name="message_frameg"]
  ```

- 例2：全てティラノのデフォルトのままにする。  
  ```
  [plugin name="message_frameg" line_height="default" padding_top="default" align_outer="default"]
  ```

- 例3：行間は単位無しで1.3に指定。padding-top 0 、message_inner の 10pxズレ無し。
  ```
  [plugin name="message_frameg" line_height="1.3"]
  ```

- 例4：自動改ページ時にクリック待ちを入る。
  ```
  [plugin name="message_frameg" auto_p="true"]
  ```

## 自動改ページについて

エディタ上での改行（[r]でなくて良い）かティラノスクリプトのタグが無いと枠からははみ出ます。  
例えば、横20文字で3行入るメッセージ枠に、60文字以上の改行・タグ無し文章があると普通にはみ出ます。

## 動作確認

ティラノスクリプトv513c

## 注意点

ティラノスクリプトのエンジン本体を改造しています。  
他verのティラノスクリプトでは動作しない可能性があります。  
また、text、position を改造しているプラグインとは併用できません。  

### 改造項目
- tyrano.plugin.kag.tag.text.start
- tyrano.plugin.kag.tag.position.start


## 免責

このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。


## 利用規約

- 改造・再配布は自由です。ただし、有償での再配布は禁止します。  
  改造後データの配布も同様にお願いします。
- 利用報告・クレジット表記は任意です。
- このプラグインはドネーションウェア（カンパウェア）です。  
  もしよろしければ寄付をお願いいたします。（強制ではありません）
- 詳しくはブログの「利用規約」をお読み頂くようお願いいたします。  
  [https://memocho.no-tenki.me/terms](https://memocho.no-tenki.me/terms)

## 制作者

name  ： hororo  
site  ： めも調　[https://memocho.no-tenki.me/](https://memocho.no-tenki.me/)  
mail  ： ruru.amu@gmail.com  
twitter ： [@hororo_memocho](https://twitter.com/hororo_memocho)


## 更新履歴

| 更新日     | Ver     | 詳細 |
|------------|---------|------|
| 2022/06/05 | ver3.40 | ティラノ513c対応。パラメータ名変更。自動改ページ時のクリック待ち対応。
| 2021/07/16 | ver3.30 | ティラノ507b対応。自動改ページを強化。他微調整。
| 2020/09/03 | ver3.20 | ティラノ504対応。機能変更なし
| 2018/03/21 | ver3.10 | ティラノ470対応。message_inner の10pxズレ防止。自動改ページを強化。他微調整。
| 2017/06/04 | ver3.00 | ティラノ450対応。ルビ表示関係機能を削除。message_innerのpadding調整を追加。
| 2016/08/08 | ver2.03 | ロード後にエラーで止まってしまう不具合を修正。
| 2016/08/06 | ver2.02 | Config.tjs defaultRubyOffset 値を使用してのルビの表示位置変更に対応。
| 2016/07/10 | ver2.01 | フォルダ名間違い修正
| 2016/07/10 | ver2.00 | line-heightの単位ありなし選択可能に、ルビ表示関係を追加。
| 2016/07/01 | ver1.00 | 公開
