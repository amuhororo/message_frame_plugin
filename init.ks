;【メッセージ枠調整プラグイン Ver.3.30】
; 2021/7/16更新　v507b対応版
; by hororo http://hororo.wp.xdomain.jp/56/

[iscript]
TG.tmp.message_frame = {

  "nounit"    : mp.nounit    || "true"      ,//ine-heightを単位なしにする場合は true ※1.5 等数値での入力も可
  "nopadding" : mp.nopadding || "true"      ,//message_inner ppadding-topを0にする場合は true ※数値でpadding値指定可
  "nospace"   : mp.nospace   || "true"      ,//message_inner の10pxズレを無しにする場合は true



//以下、パラメータ保存用
"blank"        : 0          //自動改ページ用、改行時の余白文字数カウント用
};
[endscript]
[loadjs storage="plugin/message_frame/message_frame.js"]
[return]
