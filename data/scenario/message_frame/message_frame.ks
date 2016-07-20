;【メッセージ枠調整プラグイン】2016/7/20
; by hororo http://hororo.wp.xdomain.jp/
;
; ＜機能＞
;　　[position] の margin 各種の数値を、見た目通りに指定できるプラグインです。
;　　
;　[補足機能]
;　　・自動改行/改ページ時にメッセージが枠からはみ出てしまうのを防ぐ。
;　　・行間を px から単位なしに変更可能。
;　　・ルビサイズ指定と、ルビ使用時の表示ズレ防止を追加。
;
; ＜注意点＞
;　　スクリプトのエンジン本体を改造していますので、Ver変更には対応できない可能性があります。
;　　ブラウザによっては反映されない可能性があります。
;　　全てのメッセージレイヤーに適応されます。
;　　[position]のwidrh、height は正確に設定してください。
;
;　　ティラノスクリプトVer420 で動作確認。
;
; ＜使い方＞
;  　最初にinner_message.ksファイルを読み込んでください。
;  　[call storage=”inner_message/inner_message.ks”]
;
;　　行間を単位ありのままで使用したい場合は、下記設定部分を false にしてください。
;　　Config.tjs の行間を、単位なしの数値（1.5など）で設定する事はできません。
;
[iscript]
var line_height = {

//■ 設定 ■
// ◆ 行間を単位なしにする場合は true、単位ありの場合は false
"nounit" : true
,
// ◆ ルビの行間調整を自動で行う場合は true、しない場合は false
//　※ルビサイズに、Config.tjsで設定した defaultRubySize を指定します。。
//　※Config.tjsで設定した defaultLineSpacing の値は無視され、強制的に「font-size×0.5」になります。
//　※メッセージエリア上に 1行目のルビ用として「font-size×0.35」程のスペースが空きます。
"ruby" : false
};


if(line_height.ruby == true){
	LineSpacing = parseInt(this.kag.config.defaultFontSize) * 0.35 ;
	var style = '<style>.message_inner p {padding-top:' + parseInt(LineSpacing) + 'px}.message_inner p rt {font-size:' + this.kag.config.defaultRubySize + 'px}</style>';
	$('head link:last').after(style);
}
tf.config_line_height = line_height;
[endscript]
[loadjs storage="inner_message/inner_message.js"]
[return]
