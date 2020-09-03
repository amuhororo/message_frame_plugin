/* 【メッセージ枠調整プラグイン Ver.3.20】2020/9/3     */
/*  by hororo http://hororo.wp.xdomain.jp/56/      */

//■[text]
tyrano.plugin.kag.tag.text.start = function(pm) {
  if (this.kag.stat.is_script == true) {
    this.kag.stat.buff_script += pm.val + "\n";
    this.kag.ftag.nextOrder();
    return;
  }
  if (this.kag.stat.is_html == true) {
    this.kag.stat.map_html.buff_html += pm.val;
    this.kag.ftag.nextOrder();
    return;
  }
  var j_inner_message = this.kag.getMessageInnerLayer();

  //--- ◆ 改造開始 -----------------------------------------------------------------------------
  // 文字数チェック
  var val_length = pm.val.length;
  // パラメータの値準備
  var line_height = "";
  if(this.kag.tmp.message_frame.nounit == "true") line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing))  / parseInt(this.kag.config.defaultFontSize);
  else if(this.kag.tmp.message_frame.nounit == "false") line_height = parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px";  //デフォルトのline-height
  else line_height = this.kag.tmp.message_frame.nounit;

  var padding = "";
	if(this.kag.tmp.message_frame.nopadding == "true") padding = 0;
	else if(this.kag.tmp.message_frame.nopadding == "false") padding = this.kag.config.defaultLineSpacing;
	else padding = this.kag.tmp.message_frame.nopadding;
	//--- ◆ end ---------------------------------------------------------------------------------

  j_inner_message.css({
    "letter-spacing":this.kag.config.defaultPitch + "px",
    //--- ◆ 変更 ------------------------------------------------------------------------
    //"line-height":parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px",
    "line-height":line_height,
    //--- ◆ end -------------------------------------------------------------------------
    "font-family":this.kag.config.userFace
  });
  this.kag.stat.current_message_str = pm.val;
  if (this.kag.stat.vertical == "true") {
    if (this.kag.config.defaultAutoReturn != "false") {
      //--- ◆ 変更 ---------------------------------------------------------------------
      //var j_outer_message = this.kag.getMessageOuterLayer();
      //var limit_width = parseInt(j_outer_message.css("width")) * 0.8;
      //var current_width = parseInt(j_inner_message.find("p").css("width"));
      var limit_width = parseInt(j_inner_message.width());
      var lengthW = (this.kag.tmp.message_frame.nounit == "false") ? parseInt(line_width) : Math.floor(parseInt(this.kag.config.defaultFontSize)*line_width);
      var maxline = Math.floor(parseInt(j_inner_message.height()) / parseInt(this.kag.config.defaultFontSize));
      var var_line = Math.ceil(val_length / maxline) * lengthW;
      var current_width = 0 ;
      if(this.kag.tmp.message_frame.current_height) current_width = this.kag.tmp.message_frame.current_width ;
      var next_width = parseInt(current_width)+parseInt(var_line);
      //if (current_width > limit_width) {
      if (next_width > limit_width) {
      //--- ◆ end -----------------------------------------------------------------------
        if(this.kag.stat.vchat.is_active){
          this.kag.ftag.startTag("vchat_in",{});
        }else{
          this.kag.getMessageInnerLayer().html("");
        }
      }
    }
    this.showMessage(pm.val,pm,true);

    //--- ◆ pのサイズ取得とpadding-top調整 ※ここじゃないと、グリフ画像の描画待ちで正確にサイズ取得できない。
		this.kag.variable.sf.message_frame.current_width = parseInt(j_inner_message.find("p").width());
		j_inner_message.find("p").css("padding-top","0px");//縦書き時はpadding-top不要なので0に。
		if(this.kag.tmp.message_frame.nopadding != "true") j_inner_message.find("p").css("padding-right", padding + "px" ); //margin-rightに切り替え
		//--- ◆ end ----------------------------------------------------------------------------

  } else {
    if (this.kag.config.defaultAutoReturn != "false") {

      //--- ◆ 変更 -----------------------------------------------------------------------
      //var j_outer_message = this.kag.getMessageOuterLayer();
      //var limit_height = parseInt(j_outer_message.css("height")) * 0.8;
      //var current_height = parseInt(j_inner_message.find("p").css("height"));
      var limit_height = parseInt(j_inner_message.height());//追加
      var lengthH = (this.kag.tmp.message_frame.nounit == "false") ? parseInt(line_height) : Math.floor(parseInt(this.kag.config.defaultFontSize)*line_height);
      var maxline = Math.floor(parseInt(j_inner_message.width()) / parseInt(this.kag.config.defaultFontSize));
      var var_line = Math.ceil(val_length / maxline) * lengthH;
      var current_height = 0;
      if(this.kag.tmp.message_frame.current_height) current_height = this.kag.tmp.message_frame.current_height ;
      var next_height = parseInt(current_height)+parseInt(var_line);
      //if (current_height > limit_height) {
      if (next_height > limit_height) {
      //--- ◆ end -------------------------------------------------------------------------
        if(this.kag.stat.vchat.is_active){
          this.kag.ftag.startTag("vchat_in",{});
        }else{
          this.kag.getMessageInnerLayer().html("");
        }
      }
    }
    this.showMessage(pm.val,pm,false);

    //--- ◆ pのサイズ取得とpadding-top調整 ----------------------------------------------------
    this.kag.tmp.message_frame.current_height = parseInt(j_inner_message.find("p").height());
    if(this.kag.tmp.message_frame.nopadding != "false") j_inner_message.find("p").css("padding-top", padding + "px" );
    j_inner_message.find("p").css("padding-top", padding + "px" );
    //--- ◆ end ----------------------------------------------------------------------------
  }
};


//■[pisition]
tyrano.plugin.kag.tag.position.start = function(pm) {
  var target_layer = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_outer");
  var new_style = {};
  if(pm.left!="") new_style["left"] = pm.left+"px";
  if(pm.top!="") new_style["top"] = pm.top+"px";
  if(pm.width!="") new_style["width"] = pm.width+"px";
  if(pm.height!="") new_style["height"] = pm.height+"px";
  if(pm.color !="") new_style["background-color"] = $.convertColor(pm.color);
  if(pm.radius !="") target_layer.css("border-radius", parseInt(pm.radius) + "px");
  if (pm.frame == "none") {
    target_layer.css("opacity", $.convertOpacity(this.kag.config.frameOpacity));
    target_layer.css("background-image", "");
    target_layer.css("background-color", $.convertColor(this.kag.config.frameColor));
  } else if (pm.frame != "") {
    var storage_url = "";
    if ($.isHTTP(pm.frame)) {
      storage_url = pm.frame;
    } else {
      storage_url = "./data/image/" + pm.frame + "";
    }
    target_layer.css("background-image", "url(" + storage_url + ")");
    target_layer.css("background-repeat", "no-repeat");
    target_layer.css("opacity", 1);
    target_layer.css("background-color", "");
  }
  if (pm.opacity != "") {
    target_layer.css("opacity", $.convertOpacity(pm.opacity));
  }
  this.kag.setStyles(target_layer, new_style);
  this.kag.layer.refMessageLayer(pm.layer);
  var layer_inner = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_inner");
  if(pm.vertical !=""){
    if (pm.vertical == "true") {
      this.kag.stat.vertical = "true";
      layer_inner.find("p").addClass("vertical_text");
    } else {
      this.kag.stat.vertical = "false";
      layer_inner.find("p").removeClass("vertical_text");
    }
  }
  var new_style_inner = {};
  if (pm.marginl != "0")
    new_style_inner["padding-left"] = parseInt(pm.marginl) + "px";
  if (pm.margint != "0")
    new_style_inner["padding-top"] = parseInt(pm.margint) + "px";

  //--- ◆ 変更start ----------------------------------------------------------------------
  //padding指定に変更
  //if (pm.marginr != "0")
  //  new_style_inner["width"] = (parseInt(layer_inner.css("width")) - parseInt(pm.marginr) - parseInt(pm.marginl)) + "px";
  //if (pm.marginb != "0")
  //  new_style_inner["height"] = (parseInt(layer_inner.css("height")) - parseInt(pm.marginb)) - parseInt(pm.margint) + "px";
  if (pm.marginr != "0") new_style_inner["padding-right"] = parseInt(pm.marginr) + "px";
  if (pm.marginb != "0") new_style_inner["padding-bottom"] = parseInt(pm.marginb) + "px";

  // innerの10pxズレを補正
  if(this.kag.tmp.message_frame.nospace=="true"){
    new_style_inner["top"] = parseInt(layer_inner.css("top"))-10;
    new_style_inner["left"] = parseInt(layer_inner.css("left"))-10;
    new_style_inner["width"] = parseInt(layer_inner.width())+10;
    new_style_inner["height"] = parseInt(layer_inner.height())+10;
  }

  // ボックスサイズ指定
  new_style_inner["box-sizing"] = "border-box";
  //--- ◆ end ----------------------------------------------------------------------------

  this.kag.setStyles(layer_inner, new_style_inner);
  this.kag.ftag.nextOrder();
};
