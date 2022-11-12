//【メッセージ枠調整プラグイン】
// by hororo https://memocho.no-tenki.me/

(function () {
  //ティラノ対応チェック。515betaも除外
  if (TYRANO.kag.version < 520) {
    alert("お使いの「メッセージ枠調整プラグイン」はV514以前には対応していません。\nプラグインの読み込みを停止します。");
    return;
  }

  //memocho専用領域作っとく
  TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};

  //パラメータ保存
  //align_innerとline_height_valだけでいいけど一応…
  TYRANO.kag.tmp.memocho.message_frame = {
    align_inner: TYRANO.kag.stat.mp.align_inner || "true", //message_inner の10pxズレを無しにする場合は true
    padding_top: TYRANO.kag.stat.mp.padding_top || 0, //message_inner p の ppadding-topを0にする場合は 0 ※数値値指定可
    line_height: TYRANO.kag.stat.mp.line_height || "nounit", //line-heightを単位なしにする場合は nounit ※数値値指定可
    line_height_val: "", //計算済み値格納用
  };

  //line_height値計算しとく
  const line_height = TYRANO.kag.tmp.memocho.message_frame.line_height;
  const FontSize = parseInt(TYRANO.kag.config.defaultFontSize); //Config参照
  const LineHeight = parseInt(TYRANO.kag.config.defaultFontSize) + parseInt(TYRANO.kag.config.defaultLineSpacing);
  let line_height_val = `${LineHeight}px`; //デフォルト
  if (line_height == "nounit") line_height_val = Math.round((LineHeight / FontSize) * 10) / 10; //1.6 とかにする
  else line_height_val = !isNaN(line_height) ? line_height : `${LineHeight}px`; //数値は入力値のまま、文字列はデフォルト

  TYRANO.kag.tmp.memocho.message_frame.line_height_val = line_height_val;

  //line_height
  if (!isNaN(TYRANO.kag.tmp.memocho.message_frame.line_height_val)) {
    //inner_message用 いらないのかも
    tyrano.plugin.kag.tag.text.setMessageInnerStyle = function (j_inner_message) {
      // 字詰め
      const font_feature_settings = this.getMessageConfig("kerning") === "true" ? '"palt"' : "initial";

      j_inner_message.setStyleMap({
        "letter-spacing": this.kag.config.defaultPitch + "px",
        "line-height": this.kag.tmp.memocho.message_frame.line_height_val, //変更 parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px",
        "font-family": this.kag.config.userFace,
        "font-feature-settings": font_feature_settings,
      });
    };
    //テキストspan用
    const _setCurrentSpanStyle = tyrano.plugin.kag.tag.text.setCurrentSpanStyle;
    tyrano.plugin.kag.tag.text.setCurrentSpanStyle = function (j_span, chara_name) {
      _setCurrentSpanStyle.apply(this, arguments);
      if (!this.kag.stat.vchat.is_active) {
        j_span.setStyleMap({
          "line-height": this.kag.tmp.memocho.message_frame.line_height_val,
        });
      }
    };
  }

  //align_inner
  if (TYRANO.kag.tmp.memocho.message_frame.align_inner == "true") {
    //refMessageLayer改造
    tyrano.plugin.kag.layer.refMessageLayer = function (target_layer) {
      var num = 0;

      if (!target_layer) {
        while (true) {
          if (this.map_layer_fore["message" + num]) {
            const j_message_outer = this.map_layer_fore["message" + num].find(".message_outer");
            const j_message_inner = this.map_layer_fore["message" + num].find(".message_inner");

            //+10 -10 削除
            j_message_inner
              .css("left", parseInt(j_message_outer.css("left")))
              .css("top", parseInt(j_message_outer.css("top")))
              .css("width", parseInt(j_message_outer.css("width")))
              .css("height", parseInt(j_message_outer.css("height")));
          } else {
            break;
          }

          num++;
        }
      } else {
        if (this.map_layer_fore[target_layer]) {
          const j_message_outer = this.map_layer_fore[target_layer].find(".message_outer");
          const j_message_inner = this.map_layer_fore[target_layer].find(".message_inner");

          //+10 -10 削除
          j_message_inner
            .css("left", parseInt(j_message_outer.css("left")))
            .css("top", parseInt(j_message_outer.css("top")))
            .css("width", parseInt(j_message_outer.css("width")))
            .css("height", parseInt(j_message_outer.css("height")));
        }
      }
    };
  }

  //padding_top
  let padding_top = TYRANO.kag.tmp.memocho.message_frame.padding_top;
  if (padding_top == "true") padding_top = 0;
  //true以外の文字列だったらデフォルトのまま
  if (!isNaN(padding_top)) {
    //念のため削除しとく
    const sheet = document.styleSheets[document.styleSheets.length - 1];
    sheet.deleteRule(0);
    //横書き用
    $.insertRule(`.message_inner p{ padding-top: ${padding_top}px; padding-right: 0;}`);
    //縦書き用
    $.insertRule(`.message_inner p.vertical_text{ padding-top: 0; padding-right: ${padding_top}px;}`);
  }

  //text内の関数呼び出すとthisでtmpやstat参照できないので
  tyrano.plugin.kag.tag.text.kag = TYRANO.kag;
})();
