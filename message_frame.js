//【メッセージ枠調整プラグイン Ver.3.00】2017/6/4更新 v454対応版
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

	//◆ここから追加
	var message_frame = this.kag.variable.sf.message_frame; //パラメータ値を取得
	var line_height = parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px";  //デフォルトのline-height
	//nounit 指定時のline-height
	if(message_frame.nounit == "true") line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing))  / parseInt(this.kag.config.defaultFontSize);
	if(message_frame.nopadding == "true") var padding = 0;
	else if(message_frame.nopadding == "false") padding = this.kag.config.defaultLineSpacing;
	else padding = message_frame.nopadding;
	//◆追加ここまで
	
	j_inner_message.css({
		"letter-spacing": this.kag.config.defaultPitch + "px",
		//"line-height": parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px",
		"line-height":line_height,//◆↑を変更
		"font-family": this.kag.config.userFace,
		"box-sizing":"border-box"//◆追加
	});
	this.kag.stat.current_message_str = pm.val;
	if (this.kag.stat.vertical == "true") {
		if (this.kag.config.defaultAutoReturn != "false") {
			//var j_outer_message = this.kag.getMessageOuterLayer(); ◆削除
			//var limit_width = parseInt(j_outer_message.css("width")) * 0.8;
			var limit_width = parseInt(j_inner_message.width()) - parseInt(this.kag.config.defaultFontSize);//◆↑を変更
			var current_width = parseInt(j_inner_message.find("p").css("width"));
			if (current_width > limit_width) this.kag.getMessageInnerLayer().html("")
		}
		this.showMessageVertical(pm.val, pm)
		
		j_inner_message.find("p").css("padding-top",0); //◆追加 縦書きの時はpadding-topいらない。
		if(message_frame.nopadding != "true") j_inner_message.find("p").css("padding-right", padding + "px"); //◆追加：縦書き時はmargin-rightに切り替え
		
 	} else {
		if (this.kag.config.defaultAutoReturn != "false") {
			//var j_outer_message = this.kag.getMessageOuterLayer(); ◆削除
			//var limit_height = parseInt(j_outer_message.css("height")) * 0.8;
			var limit_height = parseInt(j_inner_message.height()) - parseInt(this.kag.config.defaultFontSize);//◆↑を変更
			var current_height = parseInt(j_inner_message.find("p").css("height"));
			if (current_height > limit_height) this.kag.getMessageInnerLayer().html("")
		}
		this.showMessage(pm.val, pm)
		
		if(message_frame.nopadding != "false") j_inner_message.find("p").css("padding-top", padding + "px"); //◆追加：padding値変更用

	}
};

//■position■
tyrano.plugin.kag.tag.position.start= function (pm) {
	var target_layer = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_outer");
	var new_style = {
		left: pm.left + "px",
		top: pm.top + "px",
		width: pm.width + "px",
		height: pm.height + "px",
		"background-color": $.convertColor(pm.color)
	};
	
	if (pm.vertical != "") if (pm.vertical == "true") this.kag.stat.vertical = "true";
	else this.kag.stat.vertical = "false";
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
	this.kag.layer.refMessageLayer();
	var layer_inner = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_inner");
	var new_style_inner = {};
	if (pm.marginl != "0") new_style_inner["padding-left"] = parseInt(pm.marginl) - 10 + "px";　//◆変更：-10 を追加
	if (pm.margint != "0") new_style_inner["padding-top"] = parseInt(pm.margint) - 10 + "px";　 //◆変更：-10 を追加
	if (pm.marginr != "0") new_style_inner["width"] = parseInt(layer_inner.css("width")) - parseInt(pm.marginr) + "px";
	if (pm.marginb != "0") new_style_inner["height"] = parseInt(layer_inner.css("height")) - parseInt(pm.marginb) + "px";
	this.kag.setStyles(layer_inner, new_style_inner);
	this.kag.ftag.nextOrder()
};