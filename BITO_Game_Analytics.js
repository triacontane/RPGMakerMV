//=============================================================================
// BITO_Game_Analytics.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 BIT/O
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// 本プラグインは、トリアコンタン(Triacontane)さん作成の
// _BaseScript.js を元に作成しています。
// ----------------------------------------------------------------------------
// Version
// 0.9.0 2016/11/07 ベータ版
// ----------------------------------------------------------------------------
// [Blog]   : http://bit-orchard.hatenablog.com/
// [Twitter]: https://twitter.com/BITORCHARD
//=============================================================================

/*:
 * @plugindesc Google Analytics Plugin for RPG Maker MV Games
 * @author BIT/O
 *
 * @param TrackingID
 * @desc Googleアナリティクスアカウントを作成し"UA-0000000-1"といった文字列のトラッキングIDを入力します 
 * @default UA-0000000-1
 *
 * @param isAnalyzing 
 * @desc トラッキング実施を行うか設定します。ONの場合、最初のマップに移動した直後からトラッキングを行います。
 * (ON:最初のマップからトラッキング/OFF:トラッキングしない)
 * @default OFF
 *
 * @param isAnalyzingStartup
 * @desc ゲームの起動直後からトラッキングを開始します。タイトルをスキップする場合などにONにしてください。(ON/OFF)
 * @default OFF
 *
 * @param isAnalyzingMove
 * @desc イベント「場所移動」「ゲームオーバー」「タイトル画面に戻す」を実行した時に「ページ遷移」としてトラッキングを行います。
 * マップIDがURL、マップ名がタイトルとして記録されます(ON/PFF)。
 * @default ON
 *
 * @param isDisplayPolicy
 * @desc タイトルメニューにプライバシーポリシーの項目を追加します。
 * 掲載はアナリティクスの利用規約で定められています。(ON/OFF)
 * @default ON
 *
 * @param PolicyName
 * @desc タイトルのメニュー項目の名称
 * default:Privacy Policy
 * @default Privacy Policy
 *
 * @param PolicyDetail
 * @desc プライバシーポリシーの内容を入力します。
 * @default 本ゲームでは、ユーザの分析と改善のために、ゲームのニューゲーム・ロード時からGoogleアナリティクスを使用しています。その際、データ収集のためにGoogle がお使いのブラウザに cookie を設定したり、既存のcookieを読み取ったりする場合があります。また、本ゲームをご利用中のウェブブラウザは、Googleに特定の非個人情報（たとえば、アクセスしたページのウェブ アドレスや IP アドレスなど）を自動的に送信します。本ゲームはそれらの情報を、ゲーム利用状況の把握やゲームの改善、ユーザーの傾向をコンテンツとして紹介するといった用途で利用する可能性があります。本ゲームのユーザーは本ゲームを利用することで、上記方法および目的においてGoogleとゲーム制作者が行うこうしたデータ処理に対して、許可を与えたものとみなします。Google社によるアクセス情報の収集方法および利用方法については、Google Analyticsサービス利用規約およびGoogle社プライバシーポリシーによって定められています。【Cookieについて】cookieとは、ゲーム（もしくはGoogleアナリティクスのような第三者サービス）が、ゲームユーザーが利用するデバイスのブラウザに情報を保存し、あとで取り出すことができる符号です。ただしゲーム管理者は、当ゲームで設定するcookieからゲームユーザーの個人情報（氏名、生年月日、電話番号、メールアドレス等）を把握することはできませんのでご安心ください。なお、ゲームユーザーはブラウザの設定によりcookieの受け取りを拒否することができます。Googleアナリティクスのcookieを受け取り拒否されたい場合は、次をご参照ください(Googleアナリティクス オプトアウトアドオン https://tools.google.com/dlpage/gaoptout)。
 * 
 * @help Googleアナリティクスを使ってゲームのアクセス解析を行うことができます。
 * 
 * [注意1] このプラグインはローカル環境では正常に動作しません。
 * [注意2] このプラグインは外部接続が制限されている環境下では動作しません。
 *
 * 場所移動時、タイトルへ戻った時、ゲームオーバー時をページ遷移としてトラッキングします。
 * またプラグインコマンドを使って
 * 「ページ遷移」、「イベント」を送信できます。
 *
 * アクセス解析を行うには、Google Analytics のアカウントを作成し、
 * トラッキングIDを取得が必要があります。
 * (https://www.google.com/intl/ja_jp/analytics/)
 * 
 * ご利用の際には、Google Analytics サービス利用規約
 * (https://www.google.co.jp/analytics/terms/jp.html)
 * およびGoogle社プライバシーポリシー
 * (https://www.google.com/intl/ja/policies/privacy/)をご覧ください。
 * 
 * なお、Google Analytics に 1か月に送信されるヒット数が
 * アナリティクスの利用規約で定められている上限を超えた場合、
 * その超過分のヒット数が処理される保証はありません。
 * その場合は、有料サービスにアップグレードする必要があります。
 *
 * Google Analytics は、Google Inc. の登録商標です。
 * 
 * プラグインコマンド：
 * 
 * ▼トラッキングの有効化・無効化
 * BITO_GA_TURN (ON/OFF)
 * 例）BITO_GA_TURN OFF
 *
 * ▼ページ トラッキング
 * BITO_GA_VIEW (ページ名)
 * 例1）BITO_GA_VIEW 1年前の回想
 * 例2）BITO_GA_VIEW \P[n]の部屋
 * 例3）BITO_GA_VIEW
 * 　　 ※何も指定しない場合は、マップ名を送信
 * 
 * ▼イベント トラッキング
 * BITO_GA_EVENT (イベントカテゴリ) (イベントアクション) (イベントラベル)
 * 例）BITO_GA_EVENT 宝箱 入手 古びた鍵 
 * 例）BITO_GA_EVENT モンスター 討伐完了 裏ボスA
 * 例）BITO_GA_EVENT レベル チェック \V[10]
 *
 * プラグインコマンドで実行されるトラッキング処理は、
 * トラッキングを無効化しても実行されます。
 * 
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
 
/*:ja
 * @plugindesc Google Analytics を使ったゲームのアクセス解析
 * @author BIT/O
 * 
 * @param トラッキングID
 * @desc Googleアナリティクスアカウントを作成し"UA-0000000-1"といった文字列のトラッキングIDを入力します。
 * @default UA-0000000-1
 *
 * @param トラッキング実施
 * @desc トラッキング実施を行うか設定します。ONの場合、最初のマップに移動した直後からトラッキングを行います。
 * (ON:最初のマップからトラッキングする/OFF:しない)
 * @default ON
 *
 * @param 起動直後からトラッキング実施
 * @desc ゲームの起動直後からトラッキングを開始します。タイトルをスキップする場合などにONにしてください。(ON/OFF)
 * @default OFF
 *
 * @param 場所移動をトラッキング
 * @desc イベント「場所移動」「ゲームオーバー」「タイトル画面に戻す」を実行した時に「ページ遷移」としてトラッキングを行います。
 * マップIDがURL、マップ名がタイトルとして記録されます。(ON/PFF)
 * @default ON
 *
 * @param ポリシーの掲載
 * @desc タイトルメニューにプライバシーポリシーの項目を追加します。
 * 掲載はアナリティクスの利用規約で定められています。(ON/OFF)
 * @default ON
 *
 * @param ポリシーの名称
 * @desc タイトルのメニュー項目の名称
 * default:プライバシーポリシー
 * @default プライバシーポリシー
 *
 * @param ポリシーの内容
 * @desc プライバシーポリシーの内容を入力します。
 * @default 本ゲームでは、ユーザの分析と改善のために、ゲームのニューゲーム・ロード時からGoogleアナリティクスを使用しています。その際、データ収集のためにGoogle がお使いのブラウザに cookie を設定したり、既存のcookieを読み取ったりする場合があります。また、本ゲームをご利用中のウェブブラウザは、Googleに特定の非個人情報（たとえば、アクセスしたページのウェブ アドレスや IP アドレスなど）を自動的に送信します。本ゲームはそれらの情報を、ゲーム利用状況の把握やゲームの改善、ユーザーの傾向をコンテンツとして紹介するといった用途で利用する可能性があります。本ゲームのユーザーは本ゲームを利用することで、上記方法および目的においてGoogleとゲーム制作者が行うこうしたデータ処理に対して、許可を与えたものとみなします。Google社によるアクセス情報の収集方法および利用方法については、Google Analyticsサービス利用規約およびGoogle社プライバシーポリシーによって定められています。【Cookieについて】cookieとは、ゲーム（もしくはGoogleアナリティクスのような第三者サービス）が、ゲームユーザーが利用するデバイスのブラウザに情報を保存し、あとで取り出すことができる符号です。ただしゲーム管理者は、当ゲームで設定するcookieからゲームユーザーの個人情報（氏名、生年月日、電話番号、メールアドレス等）を把握することはできませんのでご安心ください。なお、ゲームユーザーはブラウザの設定によりcookieの受け取りを拒否することができます。Googleアナリティクスのcookieを受け取り拒否されたい場合は、次をご参照ください(Googleアナリティクス オプトアウトアドオン https://tools.google.com/dlpage/gaoptout)。
 * 
 * @help Googleアナリティクスを使ってゲームのアクセス解析を行うことができます。
 * 
 * [注意1] このプラグインはローカル環境では正常に動作しません。
 * [注意2] このプラグインは外部接続が制限されている環境下では動作しません。
 *
 * 場所移動時、タイトルへ戻った時、ゲームオーバー時をページ遷移としてトラッキングします。
 * またプラグインコマンドを使って
 * 「ページ遷移」、「イベント」を送信できます。
 *
 * アクセス解析を行うには、Google Analytics のアカウントを作成し、
 * トラッキングIDを取得が必要があります。
 * (https://www.google.com/intl/ja_jp/analytics/)
 * 
 * ご利用の際には、Google Analytics サービス利用規約
 * (https://www.google.co.jp/analytics/terms/jp.html)
 * およびGoogle社プライバシーポリシー
 * (https://www.google.com/intl/ja/policies/privacy/)をご覧ください。
 * 
 * なお、Google Analytics に 1か月に送信されるヒット数が
 * アナリティクスの利用規約で定められている上限を超えた場合、
 * その超過分のヒット数が処理される保証はありません。
 * その場合は、有料サービスにアップグレードする必要があります。
 *
 * Google Analytics は、Google Inc. の登録商標です。
 * 
 * プラグインコマンド：
 * 
 * ▼トラッキングの有効化・無効化
 * BITO_GA_TURN (ON/OFF)
 * 例）BITO_GA_TURN OFF
 *
 * ▼ページ トラッキング
 * BITO_GA_VIEW (ページ名)
 * 例1）BITO_GA_VIEW 1年前の回想
 * 例2）BITO_GA_VIEW \P[n]の部屋
 * 例3）BITO_GA_VIEW
 * 　　 ※何も指定しない場合は、マップ名を送信
 * 
 * ▼イベント トラッキング
 * BITO_GA_EVENT (イベントカテゴリ) (イベントアクション) (イベントラベル)
 * 例）BITO_GA_EVENT 宝箱 入手 古びた鍵 
 * 例）BITO_GA_EVENT モンスター 討伐完了 裏ボスA
 * 例）BITO_GA_EVENT レベル チェック \V[10]
 *
 * プラグインコマンドで実行されるトラッキング処理は、
 * トラッキングを無効化しても実行されます。
 * 
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
	'use strict';
	
    var pluginName    = 'BITO_Game_Analytics';
    var metaTagPrefix = 'BITO_GA';
	
    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
	
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
	
    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamFloat = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
	 
	//-----------------------------------------------------------------------------
	// プラグインパラメータ 取得
	//-----------------------------------------------------------------------------
	
	var paramTrackingID         = getParamString(['TrackingID','トラッキングID']);
	var paramIsAnalyzing        = getParamBoolean(['isAnalyzing ','トラッキング実施']);
	var paramIsAnalyzingStartup = getParamBoolean(['isAnalyzingStartup ','起動直後からトラッキング実施']);
	var paramIsAnalyzingMove    = getParamBoolean(['isAnalyzingMove','場所移動をトラッキング']);
	var paramIsDisplayPolicy    = getParamBoolean(['isDisplayPolicy','ポリシーの掲載']);
	var paramPolicyName         = getParamString(['PolicyName','ポリシーの名称']);
	var paramPolicyDetail       = getParamString(['PolicyDetail','ポリシーの内容']);
	var Startuped               = paramIsAnalyzingStartup;
	var LocationPathname        = location.pathname;
	var onNetwork               = document.location.protocol.match(/^http|^https/);
	
	//-----------------------------------------------------------------------------
	// Google Analytics 読込
	//-----------------------------------------------------------------------------
	if( onNetwork ) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', paramTrackingID, 'auto');
		// ga('send', 'pageview');
	} else {
		console.warn( "ローカル環境では動作しません。" );
	}	

	//=============================================================================
	// Window_TitleCommand
	//  プライバシーポリシーの選択肢を追加定義します。
	//=============================================================================

	function Scene_PolicyView() {
	}

	var _BITO_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function() {
		_BITO_Window_TitleCommand_makeCommandList.call(this);
		this.addCommand(paramPolicyName, 'PolicyView', paramIsDisplayPolicy);
	};

	/*
	 * 加えた処理について
	 * $gameMessageにテキストを設定してもテキストを表示するウィンドウがなければ
	 * メッセージは表示されません。また、メッセージ表示後はタイトルコマンドを再度
	 * アクティブ（選択・決定可能な状態にすること）にする必要があります。
	 *
	 * 以上の点から、Window_ScrollTextの作成処理と、
	 * フレーム更新時にテキストが存在しない状態、かつタイトルコマンドが非アクティブなら
	 * タイトルコマンドをアクティブにする処理を追加しています。
	 *
	 * また、ウィンドウに表示するメッセージは自動改行されないので
	 * もとのメッセージの中に必要に応じて改行コードを挿入する必要があります。
	 *
	 * Scene_PolicyViewは特に必要ないかと思います。
	 */
	var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.apply(this, arguments);
        this.createScrollTextWindow();
    };

    Scene_Title.prototype.createScrollTextWindow = function() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    };

    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        if (!$gameMessage.hasText() && !this._commandWindow.active) {
            this._commandWindow.activate();
        }
    };

	Scene_Title.prototype.commandPolicyView = function() {
		console.log( paramPolicyDetail );
		// 動作しない
		$gameMessage.add( paramPolicyDetail );
		$gameMessage.setScroll(2, true);

		//SceneManager.goto(Scene_Title);
	};

	var _BITO_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
	Scene_Title.prototype.createCommandWindow = function() {
		_BITO_Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler('PolicyView', this.commandPolicyView.bind(this));
	};

	//-----------------------------------------------------------------------------
	// Scene_Title.prototype.start
	//  タイトル時 トラッキング
	//-----------------------------------------------------------------------------
	var _BITO_Scene_Title_prototype_start = Scene_Title.prototype.start;
	Scene_Title.prototype.start = function() {
		_BITO_Scene_Title_prototype_start.call(this);
		if( paramIsAnalyzing && Startuped && paramIsAnalyzingMove ) {
			console.info( "ga('send','pageview',{'page':'" +LocationPathname+ "?id=totitle','title':'TITLE'}); でトラッキング" );
			if( onNetwork ) {
				ga('send','pageview',{'page':LocationPathname+"?id=totitle",'title':'TITLE'});
			}
		} else {
			// 最初のタイトル表示を経てトラッキング開始
			Startuped = true;
		}
	}
	
	//-----------------------------------------------------------------------------
	// Scene_Gameover.prototype.createBackgroun
	//  ゲームオーバー時 トラッキング
	//-----------------------------------------------------------------------------
	var _BITO_Scene_Gameover_prototype_createBackground = Scene_Gameover.prototype.createBackground;
	Scene_Gameover.prototype.createBackground = function() {
		_BITO_Scene_Gameover_prototype_createBackground.call(this);
		if( paramIsAnalyzing && Startuped && paramIsAnalyzingMove ) {
			console.info( "ga('send','pageview',{'page':'" +LocationPathname+ "?id=gameover','title':'GAME OVER'}); でトラッキング" );
			ga('send','pageview',{'page':LocationPathname + "?id=totitle",'title':'GAME OVER'});
		}
	}

	//-----------------------------------------------------------------------------
	// Game_Player.prototype.reserveTransfer
	//  場所移動時 トラッキング
	//-----------------------------------------------------------------------------	
	var _BITO_Game_Player_prototype_reserveTransfer = Game_Player.prototype.reserveTransfer;
	Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
		_BITO_Game_Player_prototype_reserveTransfer.call(this, mapId, x, y, d, fadeType);
		if( paramIsAnalyzing && Startuped && paramIsAnalyzingMove ) {
			console.info( "ga('send','pageview',{'page':'" +LocationPathname+ "?id=" + mapId + "&x=" + x + "&y=" + y + "','title':'" +$dataMapInfos[mapId].name+ "'}); でトラッキング" );
			if( onNetwork ) {
				ga('send','pageview',{'page':LocationPathname + "?id=" + mapId + "&x=" + x + "&y=" + y,'title':$dataMapInfos[mapId].name});
			}
		}
	};
	
    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramParamName = getParamString(['ParamName', 'パラメータ名']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        try {
            this.pluginCommandGameAnalytics(command.replace(commandPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandGameAnalytics = function(command, args) {
		var mapId  = $gameMap.mapId();
		var x      = this.character(-1).x;
		var y      = this.character(-1).y;
        switch (getCommandName(command)) {
            case '_TURN' :
				var turnMode = ( getArgString(args[0], 1) ) ? getArgString(args[0], 1) : "ON";
				if( turnMode === "ON" ) {
					paramIsAnalyzing = true;
				} else if( turnMode === "OFF" ) {
					paramIsAnalyzing = false;
				}
            break;
            case '_VIEW' :
				var mapName = ( getArgString(args[0], 1) ) ? getArgString(args[0], 1) : $dataMapInfos[mapId].name;
				console.info( "ga('send','pageview',{'page':'" +LocationPathname+ "?id=" + mapId + "&x=" + x + "&y=" + y + "','title':'" +mapName+ "'}); でトラッキング" );
				if( onNetwork ) {
					ga('send','pageview',{'page':LocationPathname + "?id=" + mapId + "&x=" + x + "&y=" + y,'title':mapName});
				}
            break;
            case '_EVENT' :
				console.log("Event");
				var eventCategory = getArgString(args[0], 1);
				var eventAction   = getArgString(args[1], 1);
				var eventLabel    = getArgString(args[2], 1);
				console.info( "ga('send','event','" + eventCategory + "','" + eventAction + "','" + eventLabel + "'); でイベントトラッキング" );
				if( onNetwork ) {
					ga('send','event',eventCategory,eventAction,eventLabel);
				}
            break;
        }
    };
	
})();