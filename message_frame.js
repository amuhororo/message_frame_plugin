//【メッセージ枠調整プラグイン Ver.3.10】20178/3/21更新 v470対応版
//http://hororo.wp.xdomain.jp/56/

tyrano.plugin.kag.tag.text.start= function (pm) {
	if (this.kag.stat.is_script == true) {
		this.kag.stat.buff_script += pm.val + "\n";
		this.kag.ftag.nextOrder();
		return
	}
	if (this.kag.stat.is_html == true) {
		this.kag.stat.map_html.buff_html += pm.val;
		this.kag.ftag.nextOrder();
		return
	}
	var j_inner_message = this.kag.getMessageInnerLayer();

	// 文字数チェック
	var val_length = pm.val.length;

	// パラメータの値準備
	var message_frame = this.kag.variable.sf.message_frame;
	var line_height = "";
	if(message_frame.nounit == "true") line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing))  / parseInt(this.kag.config.defaultFontSize);
	else if(message_frame.nounit == "false") line_height = parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px";  //デフォルトのline-height
	else line_height = message_frame.nounit;

	var padding = "";
	if(message_frame.nopadding == "true") padding = 0;
	else if(message_frame.nopadding == "false") padding = this.kag.config.defaultLineSpacing;
	else padding = message_frame.nopadding;
	// パラメータの値準備終わり

	j_inner_message.css({
		"letter-spacing": this.kag.config.defaultPitch + "px",
		"line-height":line_height,//変更
		"font-family": this.kag.config.userFace
	});
	this.kag.stat.current_message_str = pm.val;

	if (this.kag.stat.vertical == "true") {
		if (this.kag.config.defaultAutoReturn != "false") {
			//var j_outer_message = this.kag.getMessageOuterLayer();
			//var limit_width = parseInt(j_outer_message.css("width")) * 0.8;
			//var current_width = parseInt(j_inner_message.find("p").css("width"));
			var limit_width = parseInt(j_inner_message.width());
			var lengthW = (message_frame.nounit == "false") ? parseInt(line_width) : Math.floor(parseInt(this.kag.config.defaultFontSize)*line_width);
			var maxline = Math.floor(parseInt(j_inner_message.height()) / parseInt(this.kag.config.defaultFontSize));
			var var_line = Math.ceil(val_length / maxline) * lengthW;
			if(message_frame.current_height) var current_width = message_frame.current_width ;
			else var current_width = 0 ;
			var next_width = parseInt(current_width)+parseInt(var_line);
			//if (current_width > limit_width) {
			if (next_width > limit_width) {
				this.kag.getMessageInnerLayer().html("");
      }
		}
		this.showMessageVertical(pm.val, pm)

		// pのサイズ取得とpadding-top調整 ※ここじゃないと、グリフ画像の描画待ちで正確にサイズ取得できない。
		this.kag.variable.sf.message_frame.current_width = parseInt(j_inner_message.find("p").width());
		j_inner_message.find("p").css("padding-top","0px");//縦書き時はpadding-top不要なので0に。
		if(message_frame.nopadding != "true") j_inner_message.find("p").css("padding-right", padding + "px" ); //margin-rightに切り替え
		// pのサイズ取得とpadding-top調整終わり

 	} else {
		if (this.kag.config.defaultAutoReturn != "false") {
			//var j_outer_message = this.kag.getMessageOuterLayer();
			//var limit_height = parseInt(j_outer_message.css("height")) * 0.8;
			//var current_height = parseInt(j_inner_message.find("p").css(height));
			var limit_height = parseInt(j_inner_message.height());//追加
			var lengthH = (message_frame.nounit == "false") ? parseInt(line_height) : Math.floor(parseInt(this.kag.config.defaultFontSize)*line_height);
			var maxline = Math.floor(parseInt(j_inner_message.width()) / parseInt(this.kag.config.defaultFontSize));
			var var_line = Math.ceil(val_length / maxline) * lengthH;
			if(message_frame.current_height) var current_height = message_frame.current_height ;
			else var current_height = 0 ;
			var next_height = parseInt(current_height)+parseInt(var_line);
			//if (urrent_height > limit_height) {
			if (next_height > limit_height) {
				this.kag.getMessageInnerLayer().html("");
			}
		}
		this.showMessage(pm.val, pm);

		// pのサイズ取得とpadding-top調整
		this.kag.variable.sf.message_frame.current_height = parseInt(j_inner_message.find("p").height());
		if(message_frame.nopadding != "false") j_inner_message.find("p").css("padding-top", padding + "px" );
		// pのサイズ取得とpadding-top調整終わり

	}
};

//position
tyrano.plugin.kag.tag.position.start= function (pm) {
	var target_layer = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_outer");
	var new_style = {};
	if(pm.left!="")   new_style["left"]   = pm.left+"px";
	if(pm.top!="")    new_style["top"]    = pm.top+"px";
	if(pm.width!="")  new_style["width"]  = pm.width+"px";
	if(pm.height!="") new_style["height"] = pm.height+"px";
	if(pm.color !="") new_style["background-color"] = $.convertColor(pm.color);

	if (pm.frame == "none") {
		target_layer.css("opacity", $.convertOpacity(this.kag.config.frameOpacity));
		target_layer.css("background-image", "");
		target_layer.css("background-color", $.convertColor(this.kag.config.frameColor))
	} else if (pm.frame != "") {
		var storage_url = "";
		if ($.isHTTP(pm.frame)) storage_url = pm.frame;
		else storage_url = "./data/image/" + pm.frame + "";
		target_layer.css("background-image", "url(" + storage_url + ")");
		target_layer.css("background-repeat", "no-repeat");
		target_layer.css("opacity", 1);
		target_layer.css("background-color", "")
	}
	if (pm.opacity != "") target_layer.css("opacity", $.convertOpacity(pm.opacity));
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
	//if (pm.marginl != "0") new_style_inner["padding-left"] = parseInt(pm.marginl) + "px";
	//if (pm.margint != "0") new_style_inner["padding-top"] = parseInt(pm.margint) + "px";
	//if (pm.marginr != "0") new_style_inner["width"] = (parseInt(layer_inner.css("width")) - parseInt(pm.marginr) - parseInt(pm.marginl)) + "px";
	//if (pm.marginb != "0") new_style_inner["height"] = (parseInt(layer_inner.css("height")) - parseInt(pm.marginb)) - parseInt(pm.margint) + "px";

	// padding指定
	if (pm.marginl != "0") new_style_inner["padding-left"] = parseInt(pm.marginl) + "px";
	if (pm.margint != "0") new_style_inner["padding-top"] = parseInt(pm.margint) + "px";
	if (pm.marginr != "0") new_style_inner["padding-right"] = parseInt(pm.marginr) + "px";
	if (pm.marginb != "0") new_style_inner["padding-bottom"] = parseInt(pm.marginb) + "px";
	// padding指定終わり

	// innerの10pxズレを補正
	var message_frame = this.kag.variable.sf.message_frame;
	if(message_frame.nospace=="true"){
		new_style_inner["top"] = parseInt(layer_inner.css("top"))-10;
		new_style_inner["left"] = parseInt(layer_inner.css("left"))-10;
		new_style_inner["width"] = parseInt(layer_inner.width())+10;
		new_style_inner["height"] = parseInt(layer_inner.height())+10;
	}
	// innerの10pxズレを補正終わり

	// ボックスサイズ指定
	new_style_inner["box-sizing"] = "border-box";
	// ボックスサイズ指定終わり

	this.kag.setStyles(layer_inner, new_style_inner);
	this.kag.ftag.nextOrder()
};
