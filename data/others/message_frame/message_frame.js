//■text■
tyrano.plugin.kag.tag.text.start = function(pm) {
	
	//スクリプト解析状態の場合は、その扱いをする
	if (this.kag.stat.is_script == true) {
		this.kag.stat.buff_script += pm.val + "\n";
		this.kag.ftag.nextOrder();
		return;
	}

	//HTML解析状態の場合
	if (this.kag.stat.is_html == true) {
		this.kag.stat.map_html.buff_html += pm.val;
		this.kag.ftag.nextOrder();
		return;
	}
	
	var j_inner_message = this.kag.getMessageInnerLayer();
	
	//◆ここから追加
	var line_height = this.kag.variable.sf.config_line_height;
	var LineSpacing = this.kag.config.defaultLineSpacing;
	if(line_height.ruby == true) var LineSpacing = (parseInt(this.kag.config.defaultFontSize) * 0.5 );
	if(line_height.nounit == true) var line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(LineSpacing))  / parseInt(this.kag.config.defaultFontSize);
	else var line_height = (parseInt(this.kag.config.defaultFontSize) + parseInt(LineSpacing)) + 'px';
	//◆追加ここまで
	
	//文字ステータスの設定
	j_inner_message.css({
		"letter-spacing":this.kag.config.defaultPitch + "px",
		"line-height":line_height,//◆変更
		"font-family":this.kag.config.userFace,
		"box-sizing":"border-box"//◆追加
	});

	//現在表示中のテキストを格納
	this.kag.stat.current_message_str = pm.val;

	//縦書き指定の場合
	if (this.kag.stat.vertical == "true") {

		//自動改ページ無効の場合
		if (this.kag.config.defaultAutoReturn != "false") {

			//テキストエリアの横幅が、一定以上いっていたばあい、テキストをクリアします
			//var j_inner_message = this.kag.getMessageInnerLayer();//◆変更→削除要らなかった

			var limit_width = parseInt(j_inner_message.width()) - parseInt(this.kag.config.defaultFontSize);//◆変更
			var current_width = parseInt(j_inner_message.find("p").css("width"));

			if (current_width > limit_width) {
				this.kag.getMessageInnerLayer().html("");
			}
		}
		this.showMessageVertical(pm.val);

	} else {
		
		if (this.kag.config.defaultAutoReturn != "false") {

			//テキストエリアの高さが、一定以上いっていたばあい、テキストをクリアします
			//var j_inner_message = this.kag.getMessageInnerLayer();//◆変更→削除要らなかった


			var limit_height = parseInt(j_inner_message.height()) - parseInt(this.kag.config.defaultFontSize);//◆変更
			var current_height = parseInt(j_inner_message.find("p").css("height"));

			if (current_height > limit_height) {

				//画面クリア
				this.kag.getMessageInnerLayer().html("");

			}

		}

		this.showMessage(pm.val);

	}

};


//■position■
tyrano.plugin.kag.tag.position.start = function(pm) {

	//指定のレイヤを取得
	var target_layer = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_outer");
	
	var new_style = {
		left : pm.left + "px",
		top : pm.top + "px",
		width : pm.width + "px",
		height : pm.height + "px",
		"background-color" : $.convertColor(pm.color)
	};
	
	//縦書き指定
	if(pm.vertical !=""){
		if (pm.vertical == "true") {
			this.kag.stat.vertical = "true";
		} else {
			this.kag.stat.vertical = "false";
		}
	}

	//背景フレーム画像の設定 透明度も自分で設定する

	if (pm.frame == "none") {
	
		target_layer.css("opacity", $.convertOpacity(this.kag.config.frameOpacity));
		target_layer.css("background-image", "");
		target_layer.css("background-color", $.convertColor(this.kag.config.frameColor));

/*
	} else if (pm.border != "") {
		target_layer.css("-webkit-border-image", "url(./data/image/" + pm.border + ") 10");
		target_layer.css("border-style", "solid");
		target_layer.css("border-width", "10px");
		target_layer.css("opacity", pm.opacity);
		target_layer.css("background-color", "");
		target_layer.css("box-sizing", "border-box");
*/
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

	//outer のレイヤを変更
	this.kag.setStyles(target_layer, new_style);

	this.kag.layer.refMessageLayer();

	//message_inner のスタイルを変更する必要もある

	var layer_inner = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_inner");

	var new_style_inner = {};
	
	if (pm.marginl != "0")
		new_style_inner["padding-left"] = (parseInt(pm.marginl) - 10) + "px";//◆変更
	if (pm.margint != "0")
		new_style_inner["padding-top"] = (parseInt(pm.margint) - 10) + "px";//◆変更
	if (pm.marginr != "0")
		new_style_inner["width"] = (parseInt(layer_inner.css("width")) - parseInt(pm.marginr)) + "px";
	if (pm.marginb != "0")
		new_style_inner["height"] = (parseInt(layer_inner.css("height")) - parseInt(pm.marginb)) + "px";

	this.kag.setStyles(layer_inner, new_style_inner);

	//レイヤーをリフレッシュする

	this.kag.ftag.nextOrder();
};
