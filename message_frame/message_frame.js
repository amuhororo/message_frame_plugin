//【メッセージ枠調整プラグイン】
// Ver.3.40 2022/6/5
// by hororo https://memocho.no-tenki.me/

(function(){

	//テキストカウント。
	//Masao (https://mebee.info/2020/12/21/post-26346/)
	const textLength = (str) => {
		let len = 0;
		for (let i = 0; i < str.length; i++) {
			(str[i].match(/[ -~]/)) ? len += 1 : len += 2;
		}
		return len;
	};


	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {}; //memocho専用領域
	TYRANO.kag.tmp.memocho.message_frame = {
		"line_height" : TYRANO.kag.stat.mp.line_height || "nounit" ,//line-heightを単位なしにする場合は nounit ※数値値指定可
		"padding_top" : TYRANO.kag.stat.mp.padding_top || 0        ,//message_inner p の ppadding-topを0にする場合は 0 ※数値値指定可
		"align_inner" : TYRANO.kag.stat.mp.align_inner || "true"   ,//message_inner の10pxズレを無しにする場合は true
		"auto_p"      : TYRANO.kag.stat.mp.auto_p      || "false"  ,//自動改ページ時に、自動でクリック待ちを入れる場合は true
		"valLength"   : 0                                          ,//自動改ページ用、文字数カウント用
		"FontSize"    : parseInt(TYRANO.kag.config.defaultFontSize)    ,//Config参照用
		"LineSpacing" : parseInt(TYRANO.kag.config.defaultLineSpacing)  //Config参照用
	};

	//ロード対策用
	TYRANO.kag.stat.f.mcmf = {
		autop_flag : false,
		val: "",
	}

	//クリックイベント
	$(".layer_event_click").on('click.mcmf', function(e) {
		const mcmf = TYRANO.kag.tmp.memocho.message_frame;
		if(TYRANO.kag.stat.f.mcmf.autop_flag){
			TYRANO.kag.stat.f.mcmf.autop_flag = false;
			TYRANO.kag.getMessageInnerLayer().find("p").html("");
			TYRANO.kag.ftag.startTag("text",{val:TYRANO.kag.stat.f.mcmf.val});
			e.stopImmediatePropagation();
		}
	});
	//クリックイベントの順番変更
	const handlers = $._data($(".layer_event_click")[0]).events.click;
	handlers.unshift(handlers.pop());


	//[text]改造
	tyrano.plugin.kag.tag.text.start = function(pm) {
		//--- ◆ 追加 -----------------------------------------------------------------------------
		const mcmf = this.kag.tmp.memocho.message_frame;
		const that = this;
		//--- ◆ end -----------------------------------------------------------------------------

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

		//文字ステータスの設定
		j_inner_message.css({
			"letter-spacing":this.kag.config.defaultPitch + "px",
			"line-height":parseInt(this.kag.config.defaultFontSize) + parseInt(this.kag.config.defaultLineSpacing) + "px",
			"font-family":this.kag.config.userFace
		});

		//--- ◆ 追加 -----------------------------------------------------------------------------
		//line-height
		let line_height = (mcmf.FontSize + mcmf.LineSpacing) + "px";  //デフォルト
		if(mcmf.line_height == "nounit") line_height = (mcmf.FontSize + mcmf.LineSpacing)  / mcmf.FontSize;
		else if(mcmf.line_height != "default") line_height = mcmf.line_height;

		//padding-top
		let padding = mcmf.LineSpacing; //デフォルト
		if(mcmf.padding_top != "default") padding = mcmf.padding_top;

		//innerにもfont-size指定しとく
		j_inner_message.css({
			"font-size" : this.kag.config.defaultFontSize + "px",
			"line-height":line_height,
		});
		//--- ◆ end -------------------------------------------------------------------------

		//現在表示中のテキストを格納
		this.kag.stat.current_message_str = pm.val;

		/* ******* ここから削除 ***************************************************************
		//縦書き指定の場合
		if (this.kag.stat.vertical == "true") {
			//自動改ページ無効の場合
			if (this.kag.config.defaultAutoReturn != "false") {
				//テキストエリアの横幅が、一定以上いっていたばあい、テキストをクリアします
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
				//テキストエリアの高さが、一定以上いっていたばあい、テキストをクリアします
				var j_outer_message = this.kag.getMessageOuterLayer();
				var limit_height = parseInt(j_outer_message.css("height")) * 0.8;
				var current_height = parseInt(j_inner_message.find("p").css("height"));
				if (current_height > limit_height) {
					//画面クリア
					if(this.kag.stat.vchat.is_active){
						this.kag.ftag.startTag("vchat_in",{});
					}else{
						this.kag.getMessageInnerLayer().html("");
					}
				}
			}
			this.showMessage(pm.val,pm,false);
		}
		******* ここまで削除 *************************************************************** */

		//--- ◆ 追加 --------------------------------------------------------------------------
		// 縦書判定
		let vertical = this.kag.stat.vertical == "true" ? true : false;

		//文字数チェック用
		//文字の高さpx
		let lineHeight = mcmf.line_height == "default" ? parseFloat(line_height) : mcmf.FontSize * parseFloat(line_height);
		//表示部分のサイズpx
		let width = vertical ? parseInt(j_inner_message.height()) : parseInt(j_inner_message.width());
		let height = vertical ? parseInt(j_inner_message.width()) : parseInt(j_inner_message.height());
		//表示済みサイズpx
		let currentHeight = vertical ? parseInt(j_inner_message.children("p").width()) : parseInt(j_inner_message.children("p").height());
		//最大行数
		let maxLine = parseInt(height / lineHeight);
		//1行の最大文字数
		let maxLineLength = width / (mcmf.FontSize/2);
		//全体の最大文字数
		let maxLength = maxLine * maxLineLength;
		//表示済み文字数
		let currentLength = textLength(j_inner_message.text());
		//直前のテキスト
		let current_span = j_inner_message.find(".current_span");
		if(!current_span.html() && currentLength > 0) current_span = j_inner_message.find(".current_span").prev();


		//表示文字数保管用
		if(currentLength == 0) mcmf.valLength = 0;  //表示済み0ならクリア
		if(current_span.find("br").length > 0) mcmf.valLength = Math.ceil(textLength(pm.val)/maxLineLength) * maxLineLength; //直前<br>なら行数分
		mcmf.valLength += textLength(pm.val);
		if(current_span.css("margin-right")) mcmf.valLength += Math.ceil(parseInt(current_span.css("margin-right")) / (mcmf.FontSize/2)); //tip対応用
		if(current_span.find("img").length > 0) mcmf.valLength += current_span.find("img").length*2; //[graph]用とりあえず1文字換算


		if (this.kag.config.defaultAutoReturn == "true") {
			if (mcmf.valLength > maxLength) {
				if(this.kag.stat.vchat.is_active){
					this.kag.ftag.startTag("vchat_in",{});
				}else if(!this.kag.stat.fuki.active){
					if(mcmf.auto_p == "true" && currentLength > 0){
						this.kag.ftag.showNextImg();
						TYRANO.kag.stat.f.mcmf.autop_flag = true;
						TYRANO.kag.stat.f.mcmf.val = pm.val;
					}else{
						this.kag.getMessageInnerLayer().find("p").html("");
					}
				}
			}
		}

		if(!TYRANO.kag.stat.f.mcmf.autop_flag) this.showMessage(pm.val,pm,vertical);


		//padding調整
		if (this.kag.stat.vertical == "false"){
			j_inner_message.find("p").css("padding-top", padding + "px" );
			j_inner_message.find("p").css("padding-right", "" );
		}else{
			j_inner_message.find("p").css("padding-top", "" );
			j_inner_message.find("p").css("padding-right", padding + "px" ); //margin-rightに切り替え
		}
		//box-sizing調整 吹き出しの時は戻す
		if(this.kag.stat.fuki.active){
			j_inner_message.css("box-sizing","inherit");
		}else{
			j_inner_message.css("box-sizing","border-box");
		}
		//--- ◆ 追加end --------------------------------------------------------------------------

	};


	//[position]改造
	tyrano.plugin.kag.tag.position.start = function(pm) {
		var target_layer = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_outer");
		var new_style = {};
		if(pm.left!="") new_style["left"] = pm.left+"px";
		if(pm.top!="") new_style["top"] = pm.top+"px";
		if(pm.width!="") new_style["width"] = pm.width+"px";
		if(pm.height!="") new_style["height"] = pm.height+"px";
		if(pm.color !="") new_style["background-color"] = $.convertColor(pm.color);
		if(pm.radius !="") new_style["border-radius"] = parseInt(pm.radius) + "px";
		if(pm.border_size !=""){
			new_style["border-width"] = parseInt(pm.border_size) + "px";
			target_layer.css("border-style", "solid");
		}
		if(pm.border_color !="") new_style["border-color"] = $.convertColor(pm.border_color);
		//背景フレーム画像の設定 透明度も自分で設定する
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
			new_style["opacity"] = $.convertOpacity(pm.opacity);
		}
		//outer のレイヤを変更
		this.kag.setStyles(target_layer, new_style);
		//outerレイヤを保存
		this.kag.stat.fuki.def_style = $.extend(true, this.kag.stat.fuki.def_style , new_style);
		//複数のレイヤに影響がでないように。
		this.kag.layer.refMessageLayer(pm.layer);
		//message_inner のスタイルを変更する必要もある
		var layer_inner = this.kag.layer.getLayer(pm.layer, pm.page).find(".message_inner");
		//縦書き指定
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

		//--- ◆ 変更 ----------------------------------------------------------------------------
		if (pm.marginr != "0"){
			//new_style_inner["width"] = (parseInt(layer_inner.css("width")) - parseInt(pm.marginr) - parseInt(pm.marginl)) + "px";
			new_style_inner["width"] = parseInt(target_layer.css("width"))-10;
			new_style_inner["padding-right"] = parseInt(pm.marginr) + "px"; //変更
			this.kag.stat.fuki.marginr = parseInt(pm.marginr);
		}
		if (pm.marginb != "0"){
			//new_style_inner["height"] = (parseInt(layer_inner.css("height")) - parseInt(pm.marginb)) - parseInt(pm.margint) + "px";
			new_style_inner["height"] = parseInt(target_layer.css("height"))-10;
			new_style_inner["padding-bottom"] = parseInt(pm.marginb) + "px"; //変更
			this.kag.stat.fuki.marginb = parseInt(pm.marginb);
		}

		//--- ◆ 追加 ----------------------------------------------------------------------------
		// innerの10pxズレを補正
		if(this.kag.tmp.memocho.message_frame.align_inner == "true"){
			new_style_inner["top"] = target_layer.css("top");
			new_style_inner["left"] = target_layer.css("left");
			new_style_inner["width"] = target_layer.css("width");
			new_style_inner["height"] = target_layer.css("height");
	  }
		//--- ◆ end ----------------------------------------------------------------------------

		this.kag.setStyles(layer_inner, new_style_inner);
		//innerレイヤを保存
		this.kag.stat.fuki.def_style_inner = $.extend(true, this.kag.stat.fuki.def_style_inner , new_style_inner);
		//レイヤーをリフレッシュする
		if(pm.next == "true"){
			this.kag.ftag.nextOrder();
		}
	};


}());
