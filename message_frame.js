/* 【メッセージ枠調整プラグイン Ver.3.30】2021/7/16     */
/*  by hororo http://hororo.wp.xdomain.jp/56/          */

//テキストカウント。
//Copyright (c) 2021 by ぴー助 (https://codepen.io/pisuke-code/pen/GYPbWb)
//Released under the MIT license
//https://opensource.org/licenses/mit-license.php
$.textLength = function(text){
 	let regexp = /[\x01-\x7E\u{FF65}-\u{FF9F}]/mu;
	let len = 0;
  for(i = 0; i < text.length; i++){
 		let ch = text[i];
		len += regexp.test(new String(ch)) ? 1 : 2;
	}
	return len;
};

//■[text]改造
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

	//--- ◆ 追加 -----------------------------------------------------------------------------
	// パラメータの値準備
	let line_height;
	if(this.kag.tmp.message_frame.nounit == "true") line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing))  / parseInt(this.kag.config.defaultFontSize);
	else if(this.kag.tmp.message_frame.nounit == "false") line_height = parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px";  //デフォルトのline-height
	else line_height = this.kag.tmp.message_frame.nounit;

	let padding;
	if(this.kag.tmp.message_frame.nopadding == "true") padding = 0;
	else if(this.kag.tmp.message_frame.nopadding == "false") padding = this.kag.config.defaultLineSpacing;
	else padding = this.kag.tmp.message_frame.nopadding;
	//--- ◆ end -----------------------------------------------------------------------------

	j_inner_message.css({
		"letter-spacing":this.kag.config.defaultPitch + "px",
		"line-height":parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px",
		"font-family":this.kag.config.userFace
	});

	//--- ◆ 追加 ------------------------------------------------------------------------
	j_inner_message.css("line-height",line_height);

	//outerにもfont-sizeとか指定しないとemとか使えんのだ・・・！
	let outer_message = this.kag.getMessageOuterLayer();
	outer_message.css({
		"font-size" : this.kag.config.defaultFontSize + "px",
		"letter-spacing":this.kag.config.defaultPitch + "px",
		"line-height":line_height,
		"font-family":this.kag.config.userFace
	});
	//--- ◆ end -------------------------------------------------------------------------

	/* ******* ここから削除 ***************************************************************
	this.kag.stat.current_message_str = pm.val;
	if (this.kag.stat.vertical == "true") {
		if (this.kag.config.defaultAutoReturn != "false") {
			var j_outer_message = this.kag.getMessageOuterLayer();
			var limit_width = parseInt(j_outer_message.css("width")) * 0.8;
			var current_width = parseInt(j_inner_message.find("p").css("width"));
			if (current_width > limit_width) {
				if(this.kag.stat.vchat.is_active){
					this.kag.ftag.startTag("vchat_in",{});
				}else{
					this.kag.getMessageInnerLayer().html("");
				}
			}
		}
		this.showMessage(pm.val,pm,true);
	} else {
		if (this.kag.config.defaultAutoReturn != "false") {
			var j_outer_message = this.kag.getMessageOuterLayer();
			var limit_height = parseInt(j_outer_message.css("height")) * 0.8;
			var current_height = parseInt(j_inner_message.find("p").css("height"));
			if (current_height > limit_height) {
				if(this.kag.stat.vchat.is_active){
					this.kag.ftag.startTag("vchat_in",{});
				}else{
					this.kag.getMessageInnerLayer().html("");
				}
			}
		}
		this.showMessage(pm.val,pm,false);
	},
	******* ここまで削除 *************************************************************** */

	//--- ◆ 変更 --------------------------------------------------------------------------
	let vertical;    // 縦書きか

	//メッセージ表示領域のサイズ取得
	let limit;   //限界サイズ（px）
	let length;  //1行の幅サイズ（px）
	let current;  //今のPのサイズ（px）
	let line;  //1行の行間も含めたサイズ（px）

	if (this.kag.stat.vertical == "true"){
		vertical = true;
		limit = parseInt(j_inner_message.width());
		length = parseInt(j_inner_message.height());
		current = parseInt(j_inner_message.children("p").width());
	}else{
		vertical = false;
		limit = parseInt(j_inner_message.height());
		length = parseInt(j_inner_message.width());
		current = parseInt(j_inner_message.children("p").height());
	}

	let val_length = $.textLength(pm.val);  //テキストの文字数
	if(this.kag.tmp.message_frame.nounit != "false") line = parseInt(this.kag.config.defaultFontSize * line_height);
	else line = parseInt(line_height)+(parseInt(this.kag.config.defaultLineSpacing)/2);

	const word_length = Math.floor(length / (parseInt(this.kag.stat.font.size) + parseInt(this.kag.config.defaultPitch))) * 2;    //1行の文字数
	const max_line = Math.floor(limit / line);                                         //最大行数
	const max_length = Math.floor(word_length * max_line);                             //最大文字数
	let current_length = $.textLength(j_inner_message.text());                         //表示済み文字数

	//改行した時の余白文字数を数えて保存
	let current_span = j_inner_message.find(".current_span").html();
	if(current_span === undefined) this.kag.tmp.message_frame.blank = 0 ;
	else if(current_span.slice( -4 ) == "<br>"){ //最後が<br>であれば余白文字数を加算
		this.kag.tmp.message_frame.blank += word_length - (current_length - ( word_length * (Math.ceil(current_length/word_length)-1)));
	}
	let next_length = current_length + val_length + this.kag.tmp.message_frame.blank;

	if (this.kag.config.defaultAutoReturn != "false") {
		if (next_length > max_length) {
			if(this.kag.stat.vchat.is_active){
				this.kag.ftag.startTag("vchat_in",{});
			}else{
				this.kag.getMessageInnerLayer().html("");
				this.kag.tmp.message_frame.blank = 0;
			}
		}
	}

	this.showMessage(pm.val,pm,vertical);

	//margin調整
	if (this.kag.stat.vertical == "false"){
		if(this.kag.tmp.message_frame.nopadding != "false") j_inner_message.find("p").css("padding-top", padding + "px" );
	}else{
		j_inner_message.find("p").css("padding-top", "0px" );
		if(this.kag.tmp.message_frame.nopadding != "false") j_inner_message.find("p").css("padding-right", padding + "px" ); //margin-rightに切り替え
	}
	//--- ◆ 変更end --------------------------------------------------------------------------

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
	if (pm.marginl != "0") new_style_inner["padding-left"] = parseInt(pm.marginl) + "px";
	if (pm.margint != "0") new_style_inner["padding-top"] = parseInt(pm.margint) + "px";

	//--- ◆ 削除 ----------------------------------------------------------------------
	//if (pm.marginr != "0")
	//  new_style_inner["width"] = (parseInt(layer_inner.css("width")) - parseInt(pm.marginr) - parseInt(pm.marginl)) + "px";
	//if (pm.marginb != "0")
	//  new_style_inner["height"] = (parseInt(layer_inner.css("height")) - parseInt(pm.marginb)) - parseInt(pm.margint) + "px";
	//--- ◆ 変更 -----------------------------------------------------------------------
	//paddingに変更
	if (pm.marginr != "0") new_style_inner["padding-right"] = parseInt(pm.marginr) + "px";
	if (pm.marginb != "0") new_style_inner["padding-bottom"] = parseInt(pm.marginb) + "px";
	// innerの10pxズレを補正
	if(this.kag.tmp.message_frame.nospace=="true"){
		new_style_inner["top"] = target_layer.css("top");
		new_style_inner["left"] = target_layer.css("left");
		new_style_inner["width"] = target_layer.css("width");
		new_style_inner["height"] = target_layer.css("height");
  }
	// ボックスサイズ指定
	new_style_inner["box-sizing"] = "border-box";
	//--- ◆ end ----------------------------------------------------------------------------

	this.kag.setStyles(layer_inner, new_style_inner);
	this.kag.ftag.nextOrder();
};
