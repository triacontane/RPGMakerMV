//=============================================================================
// CrossSave.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.6 2016/07/12 ネットワークセーブの限界容量を緩和
// 1.0.5 2016/07/02 「ファイルに追加」が無効な場合にセーブ画面でのカーソル初期位置がひとつずれる問題の修正
// 1.0.4 2016/06/29 追加でネットワークエラー対応
// 1.0.3 2016/06/28 ゲーム中にネットワークが切断された場合にエラーになる現象を修正
// 1.0.2 2016/06/02 認証ファイルの形式をJSONでも作成できるよう修正
// 1.0.1 2016/05/29 ヘルプの記述ミスを修正
// 1.0.0 2016/05/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc クロスセーブプラグイン
 * @author トリアコンタン
 * 
 * @param ユーザID
 * @desc 本プラグインを利用するためのユーザIDです。MilkcocoaのユーザIDではありません。12文字以下で指定してください。
 * @default
 *
 * @param ロード名称
 * @desc ネットワークロードの名称です。ロード画面の1行目に追加されます。
 * @default ネットワークロード
 *
 * @param セーブ名称
 * @desc ネットワークセーブの名称です。セーブ画面の1行目に追加されます。
 * @default ネットワークセーブ
 *
 * @param パスワード桁数
 * @desc 入力するパスワードの桁数です。プレイヤー数が多く見込まれる場合は桁数を増やしてください。(4-6)
 * @default 4
 *
 * @param 説明文
 * @desc ヘルプウィンドウに表示される文章です。
 * @default ネットワークパスワードを入力してください。
 *
 * @param タイトルに追加
 * @desc タイトル画面にネットワークロードのコマンドを追加します。
 * @default ON
 *
 * @param ファイルに追加
 * @desc セーブ画面、ロード画面の先頭行にネットワークセーブ、ロードのコマンドを追加します。
 * @default ON
 * 
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 認証ファイル形式
 * @desc 認証ファイルの形式をJSON形式で作成します。ブラウザ実行時にファイルをうまく読み込めない場合、ONにしてください。
 * @default OFF
 *
 * @help セーブデータをサーバ上にアップロード/ダウンロードして
 * 異なるプラットフォーム間で共有します。
 *
 * ブラウザの体験版の続きをダウンロード版でプレーしたり
 * 外出先にスマホで続きをプレーする……といったことが可能になります。
 *
 * 以下の注意点を必要に応じてプレイヤー各位に告知してください。
 *
 * セーブファイルはゲームごとの共有スペースにアップロードされるので
 * あまりに平易なパスワードを指定すると、別のプレイヤーによって
 * 上書きされる危険があります。
 *
 * メンテナンスのためプラグイン提供者によって事前の告知なしに
 * サーバ上のセーブファイルを削除する場合があります。
 * 長期的な保管場所としてサーバ上にファイルを保存するのは
 * 避けてください。
 *
 * BaaS(Backend as a service)にMilkcocoa(https://mlkcca.com/)を使用していますが、
 * 新規に利用登録する必要はなく通常利用する上で意識する必要はありません。
 * 詳細は「使用方法」を参照してください。
 *
 * ・使用方法
 * 1. パラメータ「ユーザID」に任意の文字列を設定する。
 *    入力できるのは12文字までです。
 * 例：triacontane
 *
 * 2. プロジェクトを保存(Ctrl+S)する。
 *
 * 3. イベントテスト(イベントエディタで右クリック)から
 *    以下のプラグインコマンドを実行する。
 * CS_MAKE_AUTH_DATA 任意のパスワード
 *
 * ログに「その名称のユーザはすでに登録されています。」が表示された場合は
 * パラメータ「ユーザID」に別の値を設定して再実行してください。
 *
 * ログに「登録が完了しました。...」が表示されれば登録成功です。
 *
 * 4. あとはネットワークロード(セーブ)画面からプレイヤーが任意のパスワードを
 *    入力することでセーブデータをアップロード/ダウンロードできます。
 *
 * ネットワークロード画面は以下の方法で遷移できます。
 * ・タイトル画面のコマンド
 * ・ロード画面の一番上の選択肢
 * ・プラグインコマンド実行時
 *
 * ネットワークセーブ画面は以下の方法で遷移できます。
 * ・セーブ画面の一番上の選択肢
 * ・プラグインコマンド実行時
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * CS_認証データ作成 password
 * CS_MAKE_AUTH_DATA password
 *  パラメータのユーザIDと指定したパスワードでサーバに認証情報を登録し
 *  認証情報ファイルを作成します。イベントテストから実行してください。
 *
 * CS_REMAKE_AUTH_FILE password
 * CS_認証ファイル再作成 password
 *  認証情報ファイルを再作成します。誤ってファイルを削除した場合などに
 *  イベントテストから実行してください。
 *
 * CS_DELETE_AUTH_DATA
 * CS_認証データ削除
 *  認証情報をサーバから削除し、同時に認証情報ファイルも削除します。
 *  イベントテストから実行してください。
 *
 * CS_NETWORK_LOAD
 * CS_ネットワークロード
 *  ネットワークロード画面を呼び出します。
 *
 * CS_NETWORK_SAVE
 * CS_ネットワークセーブ
 *  ネットワークセーブ画面を呼び出します。
 *
 * ！！注意事項！！
 * 1. セーブデータに、個人情報などの情報資産にあたるものを
 * 絶対に格納しない(させない)よう注意してください。
 * いかなる場合でもこのプラグインを使用することによって生じた
 * 不利益に関しては一切責任を負いません。
 *
 * 2. 本プラグインは試験運用中です。利用状況によっては
 * サービスの運用を停止せざるを得ない場合があります。
 * 
 * 3. 認証ファイルとはセキュリティを担保するものではなく
 * 共有スペース内で同一のユーザIDが使用されないように区切る
 * ためのものです。
 * 他のサービスで使っているパスワードを流用することは
 * 止めてください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function CrossSaveManager() {
    throw new Error('This is a static class');
}

(function() {
    'use strict';
    var pluginName   = 'CrossSave';
    var localMessage = {
        OFF_LINE: 'ネットワークへの接続が確認できませんでした。',
        REJECT  : 'サーバへの接続に失敗しました。',
        TIME_OUT: '時間内に処理が完了しませんでした。',
        SIZE_ERR: 'セーブデータの容量が大きすぎます。',
        NO_DATA : '指定したパスワードのセーブデータが見付かりませんでした。',
        FILE_ERR: 'ロードしたファイルが破損していました。',
        WAITING : '通信中です。しばらくお待ちください。',
        UNKNOWN : '原因不明のエラーで処理が失敗しました。'
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var windowLayer = SceneManager._scene._windowLayer;
        if (windowLayer) {
            var result = windowLayer.children[0].convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramUserId          = getParamString(['UserId', 'ユーザID']);
    var paramLoadName        = getParamString(['LoadName', 'ロード名称']);
    var paramSaveName        = getParamString(['SaveName', 'セーブ名称']);
    var paramDescription     = getParamString(['Description', '説明文']);
    var paramPassDigit       = getParamNumber(['PassDigit', 'パスワード桁数'], 4, 6);
    var paramAddCommandTitle = getParamBoolean(['AddCommandTitle', 'タイトルに追加']);
    var paramAddCommandFile  = getParamBoolean(['AddCommandFile', 'ファイルに追加']);
    var paramBackPicture     = getParamString(['BackPicture', '背景ピクチャ']);
    var paramAuthFileFormat  = getParamBoolean(['AuthFileFormat', '認証ファイル形式']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandCrossSave(command, args);
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
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandCrossSave = function(command, args) {
        switch (getCommandName(command)) {
            case 'CS_MAKE_AUTH_DATA' :
            case 'CS_認証データ作成' :
                CrossSaveManager.makeAuthData(getArgString(args[0]));
                break;
            case 'CS_REMAKE_AUTH_FILE' :
            case 'CS_認証ファイル再作成' :
                CrossSaveManager.makeAuthFile(getArgString(args[0]));
                break;
            case 'CS_DELETE_AUTH_DATA' :
            case 'CS_認証データ削除' :
                CrossSaveManager.deleteAuthData();
                break;
            case 'CS_NETWORK_LOAD' :
            case 'CS_ネットワークロード' :
                SceneManager.push(Scene_Password);
                SceneManager.prepareNextScene('load');
                break;
            case 'CS_NETWORK_SAVE' :
            case 'CS_ネットワークセーブ' :
                SceneManager.push(Scene_Password);
                SceneManager.prepareNextScene('save');
                break;
        }
    };

    //=============================================================================
    // Scene_Title
    //  ネットワークロード画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Title_createCommandWindow      = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if (paramAddCommandTitle) {
            this._commandWindow.setHandler('networkLoad', this.commandNetworkLoad.bind(this));
        }
    };

    Scene_Title.prototype.commandNetworkLoad = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_Password);
        SceneManager.prepareNextScene('load');
    };

    //=============================================================================
    // Window_TitleCommand
    //  ネットワークロード画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_TitleCommand_makeCommandList      = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if (paramAddCommandTitle) {
            this.addCommand(paramLoadName, 'networkLoad');
        }
    };

    var _Window_TitleCommand_updatePlacement      = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.apply(this, arguments);
        if (paramAddCommandTitle) {
            this.y += this.height / 8;
        }
    };

    if (paramAddCommandFile) {
        //=============================================================================
        // Scene_File
        //  ネットワークセーブ画面の呼び出しを追加します。
        //=============================================================================
        var _Scene_File_savefileId      = Scene_File.prototype.savefileId;
        Scene_File.prototype.savefileId = function() {
            return _Scene_File_savefileId.apply(this, arguments) - 1;
        };

        Scene_File.prototype.isCrossSave = function() {
            return this._listWindow.index() === 0;
        };
        
        //=============================================================================
        // Scene_Save
        //  ネットワークセーブ画面の呼び出しを追加します。
        //=============================================================================
        var _Scene_Save_onSavefileOk      = Scene_Save.prototype.onSavefileOk;
        Scene_Save.prototype.onSavefileOk = function() {
            if (this.isCrossSave()) {
                SoundManager.playOk();
                SceneManager.push(Scene_Password);
                SceneManager.prepareNextScene('save');
            } else {
                _Scene_Save_onSavefileOk.apply(this, arguments);
            }
        };

        var _Scene_Save_firstSavefileIndex      = Scene_Save.prototype.firstSavefileIndex;
        Scene_Save.prototype.firstSavefileIndex = function() {
            if (SceneManager.isPreviousScene(Scene_Password)) {
                return 0;
            } else {
                return _Scene_Save_firstSavefileIndex.apply(this, arguments) + 1;
            }
        };

        //=============================================================================
        // Scene_Load
        //  ネットワークロード画面の呼び出しを追加します。
        //=============================================================================
        var _Scene_Load_onSavefileOk      = Scene_Load.prototype.onSavefileOk;
        Scene_Load.prototype.onSavefileOk = function() {
            if (this.isCrossSave()) {
                SoundManager.playOk();
                SceneManager.push(Scene_Password);
                SceneManager.prepareNextScene('load');
            } else {
                _Scene_Load_onSavefileOk.apply(this, arguments);
            }
        };

        var _Scene_Load_firstSavefileIndex      = Scene_Load.prototype.firstSavefileIndex;
        Scene_Load.prototype.firstSavefileIndex = function() {
            if (SceneManager.isPreviousScene(Scene_Password)) {
                return 0;
            } else {
                return _Scene_Load_firstSavefileIndex.apply(this, arguments) + 1;
            }
        };

        //=============================================================================
        // Window_SavefileList
        //  セーブファイルリスト画面
        //=============================================================================
        Window_SavefileList.prototype.isModeSave = function() {
            return this._mode === 'save';
        };

        var _Window_SavefileList_maxItems      = Window_SavefileList.prototype.maxItems;
        Window_SavefileList.prototype.maxItems = function() {
            return _Window_SavefileList_maxItems.apply(this, arguments) + 1;
        };

        var _Window_SavefileList_drawItem      = Window_SavefileList.prototype.drawItem;
        Window_SavefileList.prototype.drawItem = function(index) {
            if (index > 0) {
                arguments[0]--;
                _Window_SavefileList_drawItem.apply(this, arguments);
            } else {
                var rect = this.itemRectForText(-1);
                this.changePaintOpacity(true);
                this.drawText(this.isModeSave() ? paramSaveName : paramLoadName, rect.x, rect.y, 180);
            }
        };

        Window_SavefileList.prototype.itemRectForText = function(index) {
            return Window_Selectable.prototype.itemRectForText.call(this, index + 1);
        };
    }

    //=============================================================================
    // Window_PasswordInput
    //  パスワード入力ウィンドウ
    //=============================================================================
    function Window_PasswordInput() {
        this.initialize.apply(this, arguments);
    }

    Window_PasswordInput.numberTable = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
        '0', 'Bak', 'OK'
    ];

    Window_PasswordInput.prototype             = Object.create(Window_NameInput.prototype);
    Window_PasswordInput.prototype.constructor = Window_PasswordInput;

    Window_PasswordInput.prototype.initialize = function(editWindow) {
        this._editWindow = editWindow;
        Window_NameInput.prototype.initialize.call(this, editWindow);
    };

    Window_PasswordInput.prototype.windowHeight = function() {
        return this.fittingHeight(4);
    };

    Window_PasswordInput.prototype.standardFontSize = function() {
        return this._editWindow.standardFontSize();
    };

    Window_PasswordInput.prototype.lineHeight = function() {
        return this._editWindow.lineHeight();
    };

    Window_PasswordInput.prototype.table = function() {
        return Window_PasswordInput.numberTable;
    };

    Window_PasswordInput.prototype.maxCols = function() {
        return 3;
    };

    Window_PasswordInput.prototype.maxItems = function() {
        return Window_PasswordInput.numberTable.length;
    };

    Window_PasswordInput.prototype.getLastIndex = function() {
        return this.maxItems() - 1;
    };

    Window_PasswordInput.prototype.character = function() {
        return this._index < this.getLastIndex() - 1 ? this.table()[this._index] : '';
    };

    Window_PasswordInput.prototype.isOk = function() {
        return this._index === this.getLastIndex();
    };

    Window_PasswordInput.prototype.isDel = function() {
        return this._index === this.getLastIndex() - 1;
    };

    Window_PasswordInput.prototype.isAnyTriggered = function() {
        return Input.isTriggered('ok') || Input.isTriggered('escape') || Input.dir4 !== 0 ||
            TouchInput.isTriggered() || TouchInput.isCancelled();
    };

    Window_PasswordInput.prototype.itemRect = function(index) {
        return {
            x     : this.contentsWidth() / 2 - this.maxCols() * this.lineHeight() / 2 + index % this.maxCols() * this.lineHeight(),
            y     : Math.floor(index / this.maxCols()) * this.lineHeight(),
            width : this.lineHeight(),
            height: this.lineHeight()
        };
    };

    Window_PasswordInput.prototype.refresh = function() {
        var table       = this.table();
        var textPadding = 3;
        this.contents.clear();
        this.resetTextColor();
        for (var i = 0; i < this.maxItems(); i++) {
            var rect = this.itemRect(i);
            rect.x += textPadding;
            rect.width -= textPadding * 2;
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(i));
            this.drawText(table[i], rect.x, rect.y, rect.width, 'center');
        }
    };

    Window_PasswordInput.prototype.isCommandEnabled = function(index) {
        if (index === this.getLastIndex()) {
            return this._editWindow.isInputFull();
        } else if (index === this.getLastIndex() - 1) {
            return true;
        } else {
            return !this._editWindow.isInputFull();
        }
    };

    Window_PasswordInput.prototype.cursorDown = function(wrap) {
        if (this._index < this.maxItems() - this.maxCols() || wrap) {
            this._index = (this._index + this.maxCols()) % this.maxItems();
        }
    };

    Window_PasswordInput.prototype.cursorUp = function(wrap) {
        if (this._index >= this.maxCols() || wrap) {
            this._index = (this._index + this.maxItems() - this.maxCols()) % this.maxItems();
        }
    };

    Window_PasswordInput.prototype.cursorRight = function(wrap) {
        if (this._index % this.maxCols() < this.maxCols() - 1) {
            this._index++;
        } else if (wrap) {
            this._index -= this.maxCols() - 1;
        }
    };

    Window_PasswordInput.prototype.cursorLeft = function(wrap) {
        if (this._index % this.maxCols() > 0) {
            this._index--;
        } else if (wrap) {
            this._index += this.maxCols() - 1;
        }
    };

    Window_PasswordInput.prototype.onNameAdd = function() {
        var prevFull = this._editWindow.isInputFull();
        Window_NameInput.prototype.onNameAdd.call(this);
        if (!prevFull && this._editWindow.isInputFull()) {
            this.processJump(true);
        }
    };

    Window_PasswordInput.prototype.onNameOk = function() {
        if (!this.isAnyTriggered()) return;
        Window_NameInput.prototype.onNameOk.call(this, arguments);
    };

    Window_PasswordInput.prototype.cursorPagedown = function() {
    };

    Window_PasswordInput.prototype.cursorPageup = function() {
    };

    Window_PasswordInput.prototype.processOk = function() {
        if (!this.isCommandEnabled(this.index())) {
            if (this.isAnyTriggered()) this.playBuzzerSound();
            return;
        }
        if (this.isDel()) {
            this.processBack();
        } else {
            Window_NameInput.prototype.processOk.call(this);
        }
        this.refresh();
    };

    Window_PasswordInput.prototype.processBack = function() {
        if (this._editWindow.isInputEmpty()) {
            if (this.isAnyTriggered()) Window_Selectable.prototype.processCancel.call(this);
        } else {
            Window_NameInput.prototype.processBack.call(this);
        }
        this.refresh();
    };

    Window_PasswordInput.prototype.processJump = function(silentFlg) {
        if (this._index !== this.getLastIndex()) {
            this._index = this.getLastIndex();
            if (!silentFlg)SoundManager.playCursor();
        }
    };

    //=============================================================================
    // Window_PasswordEdit
    //  パスワード作成ウィンドウ
    //=============================================================================
    function Window_PasswordEdit() {
        this.initialize.apply(this, arguments);
    }

    Window_PasswordEdit.prototype             = Object.create(Window_NameEdit.prototype);
    Window_PasswordEdit.prototype.constructor = Window_PasswordEdit;

    Window_PasswordEdit.prototype.standardFontSize = function() {
        return Utils.isMobileDevice() ? 56 : 42;
    };

    Window_PasswordEdit.prototype.lineHeight = function() {
        return this.standardFontSize() + 8;
    };

    Window_PasswordEdit.prototype.initialize = function(name) {
        this._name        = name;
        this._index       = this._name.length;
        this._maxLength   = paramPassDigit;
        this._defaultName = '';
        var width         = this.windowWidth();
        var height        = this.windowHeight();
        var x             = (Graphics.boxWidth - width) / 2;
        var y             = (Graphics.boxHeight - (height + this.fittingHeight(4) + 8)) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.deactivate();
        this.refresh();
    };

    Window_PasswordEdit.prototype.windowWidth = function() {
        return this.lineHeight() * 3 + this.standardPadding() * 2;
    };

    Window_PasswordEdit.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_PasswordEdit.prototype.itemRect = function(index) {
        return {
            x     : this.left() + index * this.charWidth(),
            y     : 0,
            width : this.charWidth(),
            height: this.lineHeight()
        };
    };

    Window_PasswordEdit.prototype.faceWidth = function() {
        return 0;
    };

    Window_PasswordEdit.prototype.charWidth = function() {
        return this.textWidth('1');
    };

    Window_PasswordEdit.prototype.drawActorFace = function(actor, x, y, width, height) {
    };

    Window_PasswordEdit.prototype.isInputFull = function() {
        return this._name.length === this._maxLength;
    };

    Window_PasswordEdit.prototype.isInputEmpty = function() {
        return this._name.length === 0;
    };

    //=============================================================================
    // Scene_Password
    //  パスワード入力画面
    //=============================================================================
    function Scene_Password() {
        this.initialize.apply(this, arguments);
    }

    Scene_Password.prototype             = Object.create(Scene_Name.prototype);
    Scene_Password.prototype.constructor = Scene_Password;

    Scene_Password.prototype.initialize = function() {
        Scene_Name.prototype.initialize.call(this);
    };

    Scene_Password.prototype.prepare = function(mode) {
        this._mode = mode;
    };

    Scene_Password.prototype.isModeSave = function() {
        return this._mode === 'save';
    };

    Scene_Password.prototype.update = function() {
        Scene_Name.prototype.update.call(this);
        if (this._processing) {
            this.updateBusy();
        } else {
            this.updateInput();
        }
    };

    Scene_Password.prototype.updateBusy = function() {
        if (CrossSaveManager.isBusy()) {
            this._processFrame++;
            if (this._processFrame > 60 * CrossSaveManager.timeOutSecond) {
                this.onProcessError(localMessage.TIME_OUT);
            }
        } else {
            var message = CrossSaveManager.getResultMessage();
            if (!message) {
                this.onProcessComplete();
            } else {
                this.onProcessError(message);
            }
        }
    };

    Scene_Password.prototype.updateInput = function() {
        if (Input.dir4 !== 0) {
            this.setHelpDefault();
        }
    };

    Scene_Password.prototype.onProcessComplete = function() {
        this._processing = false;
        if (this.isModeSave()) {
            SoundManager.playSave();
            if (SceneManager.isPreviousScene(Scene_Save)) {
                this.popScene();
            }
            this.popScene();
            this.keepPassword();
            CrossSaveManager.outLog('ネットワークセーブが正常に終了しました。');
        } else {
            var result = DataManager.loadGameFromNetwork();
            if (result) {
                this.onLoadSuccess();
                $gameSystem.onAfterLoad();
                this.keepPassword();
                CrossSaveManager.outLog('ネットワークロードが正常に終了しました。');
            } else {
                this.onProcessError(localMessage.FILE_ERR);
            }
        }
    };

    Scene_Password.prototype.keepPassword = function() {
        if (this._password) {
            ConfigManager.lastPassword = this._password;
            ConfigManager.save();
        }
    };

    Scene_Password.prototype.onLoadSuccess      = Scene_Load.prototype.onLoadSuccess;
    Scene_Password.prototype.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;

    Scene_Password.prototype.onProcessError = function(message) {
        console.warn(message);
        this._processing = false;
        SoundManager.playBuzzer();
        this._editWindow.restoreDefault();
        this._inputWindow.refresh();
        this._inputWindow.activate();
        this.setHelp(message);
    };

    Scene_Password.prototype.setHelpDefault = function() {
        this.setHelp(paramDescription);
    };

    Scene_Password.prototype.setHelp = function(text) {
        this._helpWindow.setText(this.getModeName() + '\n' + text);
    };

    Scene_Password.prototype.getModeName = function() {
        return this.isModeSave() ? paramSaveName : paramLoadName;
    };

    Scene_Password.prototype.create = function() {
        Scene_Name.prototype.create.call(this);
        this.createHelpWindow();
    };

    Scene_Password.prototype.createEditWindow = function() {
        this._editWindow = new Window_PasswordEdit(ConfigManager.lastPassword);
        this.addWindow(this._editWindow);
    };

    Scene_Password.prototype.createInputWindow = function() {
        this._inputWindow = new Window_PasswordInput(this._editWindow);
        this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
        this._inputWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._inputWindow);
    };

    Scene_Password.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.call(this);
        this.setHelpDefault();
    };

    Scene_Password.prototype.createBackground = function() {
        if (paramBackPicture) {
            var sprite    = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(paramBackPicture, 0);
            sprite.bitmap.addLoadListener(function() {
                sprite.scale.x = Graphics.boxWidth / sprite.width;
                sprite.scale.y = Graphics.boxHeight / sprite.height;
            }.bind(this));
            this._backgroundSprite = sprite;
            this.addChild(this._backgroundSprite);
        } else {
            Scene_Name.prototype.createBackground.call(this);
        }
    };

    Scene_Password.prototype.onInputOk = function() {
        this._password = this._editWindow.name();
        if (this.isModeSave()) {
            $gameSystem.onBeforeSave();
            CrossSaveManager.saveGameData(this._password);
        } else {
            CrossSaveManager.loadGameData(this._password);
        }
        this.startAsyncProcess();
    };

    Scene_Password.prototype.startAsyncProcess = function() {
        this._processing   = true;
        this._processFrame = 0;
        this._inputWindow.deactivate();
        this.setHelp(localMessage.WAITING);
    };

    //=============================================================================
    // CrossSaveManager
    //  クロスセーブのためにMilkCocoaとの通信を行います。
    //=============================================================================
    CrossSaveManager.authFileName    = (paramAuthFileFormat ? 'CrossSave.json' : 'CrossSave.rpgdata');
    CrossSaveManager.timeOutSecond   = 10;
    CrossSaveManager.suppressOnError = false;
    CrossSaveManager._milkCocoaUrl   = 'https://cdn.rawgit.com/triacontane/RPGMakerMV/master/milkcocoa.js';
    CrossSaveManager._milkCocoaApiId = 'leadiomt9dk1.mlkcca.com';
    CrossSaveManager._loadListeners  = [];
    CrossSaveManager._authFile       = null;
    CrossSaveManager._fragmentLength = 4000;
    CrossSaveManager._limitFragment  = 20;

    CrossSaveManager.initialize = function() {
        this._milkCocoa     = new MilkCocoa(this._milkCocoaApiId);
        this._authData      = this._milkCocoa.dataStore('auth');
        this._mainData      = this._milkCocoa.dataStore('main');
        this._online        = true;
        this._authority     = false;
        this._processCount  = 0;
        this._reaultMessage = '';
        this._password      = '';
        this._restoredData  = null;
        if (!DataManager.isEventTest()) this.loadAuthData();
        this._callLoadListeners();
    };

    CrossSaveManager.getRestoredData = function() {
        var result = '';
        if (this._restoredData) {
            this._restoredData.forEach(function(data) {
                result = result.concat(data);
            });
        }
        return result;
    };

    CrossSaveManager.isBusy = function() {
        return this._processCount > 0;
    };

    CrossSaveManager.getResultMessage = function() {
        return this._reaultMessage;
    };

    CrossSaveManager.resetResultMessage = function() {
        this._reaultMessage = '';
    };

    CrossSaveManager.addLoadListener = function(listener) {
        if (!this._online) {
            this._loadListeners.push(listener);
        } else {
            listener();
        }
    };

    CrossSaveManager._callLoadListeners = function() {
        while (this._loadListeners.length > 0) {
            var listener = this._loadListeners.shift();
            listener();
        }
    };

    CrossSaveManager.canUse = function() {
        return this._online && this._authority;
    };

    CrossSaveManager.getAuthData = function(onComplete) {
        this.setSuppressOnError();
        this._authData.get(paramUserId, onComplete);
    };

    CrossSaveManager.setSuppressOnError = function() {
        this.suppressOnError = true;
        setTimeout(function() {
            this.suppressOnError = false;
        }.bind(this), 1000);
    };

    CrossSaveManager.loadAuthData = function(onComplete, onError) {
        this.loadAuthFile(this.onLoadAuthData.bind(this, onComplete, onError));
    };

    CrossSaveManager.onLoadAuthData = function(onComplete, onError) {
        this.getAuthData(function(err, datum) {
            if (!err && datum.value.pass === this._authFile.pass) {
                this.outLog('認証に成功しました。');
                this._authority = true;
                if (onComplete) onComplete();
            } else {
                this._online = false;
                if (onError) onError();
                this.outLog('認証に失敗しました。ユーザ登録を行っていない場合は行ってください。');
            }
        }.bind(this));
    };

    CrossSaveManager.makeAuthData = function(pass) {
        this.addLoadListener(function() {
            this.showDevTools();
            if (!paramUserId) this.terminate('パラメータ「ユーザID」を指定してください。');
            if (paramUserId.length > 12) this.terminate('パラメータ「ユーザID」は12文字以下で指定してください。');
            this.getAuthData(function(err) {
                if (err) {
                    this._authData.set(paramUserId, {pass: pass}, function() {
                        StorageManager.saveCrossSaveAuthFile(JsonEx.stringify({pass: pass}));
                        this.terminate('登録が完了しました。パスワードは削除の際に必要なので控えておいてください。:' + pass);
                    }.bind(this));
                } else {
                    this.terminate('その名称のユーザはすでに登録されています。');
                }
            }.bind(this));
        }.bind(this));
    };

    CrossSaveManager.makeAuthFile = function(pass) {
        this.addLoadListener(function() {
            this.showDevTools();
            StorageManager.saveCrossSaveAuthFile(JsonEx.stringify({pass: pass}));
            this.terminate('認証ファイルの再作成が完了しました。');
        }.bind(this));
    };

    CrossSaveManager.deleteAuthData = function() {
        this.addLoadListener(function() {
            this.showDevTools();
            this.loadAuthData(function() {
                this._authData.remove(paramUserId, function() {
                    StorageManager.removeCrossSaveAuthFile();
                    this._mainData.remove(paramUserId);
                    this.terminate('対象のユーザ情報を削除しました。:' + paramUserId);
                }.bind(this), function() {
                    this.terminate('対象のユーザ情報を削除できませんでした。:' + paramUserId);
                }.bind(this));
            }.bind(this), function() {
                this.terminate('ユーザ情報の認証に失敗しました。すでに削除済みか、認証が不正です。:' + paramUserId);
            }.bind(this));
        }.bind(this));
    };

    CrossSaveManager.loadAuthFile = function(onLoad) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + this.authFileName;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload  = function() {
            if (xhr.status < 400) {
                var data                   = LZString.decompressFromBase64(xhr.responseText);
                CrossSaveManager._authFile = JsonEx.parse(paramAuthFileFormat ? xhr.responseText : data);
                onLoad();
            }
        };
        xhr.onerror = function() {
            this.outLog('認証ファイルを確認できませんでした。');
        }.bind(this);
        xhr.send();
    };

    CrossSaveManager.outLog = function(message) {
        console.log(pluginName + ':' + message);
    };

    CrossSaveManager.terminate = function(message) {
        this.outLog(message);
        this.pause(SceneManager.terminate.bind(SceneManager));
    };

    CrossSaveManager.showDevTools = function() {
        var nwWin = require('nw.gui').Window.get();
        if (!nwWin.isDevToolsOpen()) {
            var devTool = nwWin.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
            nwWin.focus();
        }
    };

    CrossSaveManager.pause = function(handler) {
        console.log('続行するには何かキーを押してください……');
        setInterval(function() {
            if (Object.keys(Input._currentState).length > 0 || TouchInput.isPressed()) handler();
        }, 100);
    };

    CrossSaveManager.saveGameData = function(passWord) {
        this._password = passWord;
        if (!this.canUse()) {
            this._reaultMessage = localMessage.OFF_LINE;
            return false;
        }
        var fragmentLength = this._fragmentLength;
        var saveGameBase64 = DataManager.saveGameToNetwork();
        var dataNumber     = Math.floor(saveGameBase64.length / fragmentLength) + 1;
        if (dataNumber > this._limitFragment) {
            this._reaultMessage = localMessage.SIZE_ERR;
            return false;
        }
        this.resetResultMessage();
        this._processCount = 0;
        for (var i = 0; i < dataNumber; i++) {
            this.setMainData(i, {data: saveGameBase64.substr(i * fragmentLength, fragmentLength)});
        }
        this.setMainData('Length', {data: dataNumber});
        this.setSuppressOnError();
        return true;
    };

    CrossSaveManager.loadGameData = function(passWord) {
        this._password = passWord;
        if (!this.canUse()) {
            this._reaultMessage = localMessage.OFF_LINE;
            return false;
        }
        this.resetResultMessage();
        this.getMainData('Length', this.loadDataContents.bind(this), localMessage.NO_DATA);
        this.setSuppressOnError();
    };

    CrossSaveManager.loadDataContents = function(datum) {
        var length         = datum.value.data;
        this._restoredData = [];
        for (var i = 0; i < length; i++) {
            this.getMainData(i, this.setRestoredData.bind(this), localMessage.NO_DATA);
        }
    };

    CrossSaveManager.setRestoredData = function(datum, param) {
        this._restoredData[param] = datum.value.data;
    };

    CrossSaveManager.setMainData = function(param, data) {
        this._mainData.set(paramUserId + ':' + this._password + ':' + param, data, function(errorInfo) {
                if (!errorInfo) {
                    this.onProcessSuccess();
                } else {
                    this.outLog(errorInfo);
                    this.onProcessFailure(localMessage.UNKNOWN);
                }
            }.bind(this),
            this.onProcessFailure.bind(this, localMessage.REJECT)
        );
        this._processCount++;
    };

    CrossSaveManager.getMainData = function(param, onComplete, errorMessage) {
        this._mainData.get(paramUserId + ':' + this._password + ':' + param, function(errorInfo, datum) {
            if (!errorInfo) {
                this.onProcessSuccess();
                onComplete(datum, param);
            } else {
                this.outLog(errorInfo);
                this.onProcessFailure(errorMessage);
            }
        }.bind(this));
        this._processCount++;
    };

    CrossSaveManager.onProcessSuccess = function() {
        this._processCount--;
    };

    CrossSaveManager.onProcessFailure = function(errorMessage) {
        this._processCount  = 0;
        this._reaultMessage = errorMessage;
    };

    //=============================================================================
    // DataManager
    //  ネットワークセーブ用のデータをセーブ/ロードします。
    //=============================================================================
    DataManager.saveGameToNetwork = function() {
        var json = JsonEx.stringify(this.makeSaveContents());
        return LZString.compressToBase64(json);
    };

    DataManager.loadGameFromNetwork = function() {
        try {
            var json = LZString.decompressFromBase64(CrossSaveManager.getRestoredData());
            this.createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this.selectSavefileForNewGame();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    //=============================================================================
    // StorageManager
    //  認証ファイルのセーブやロードを追加定義します。
    //=============================================================================
    StorageManager.saveCrossSaveAuthFile = function(json) {
        var data     = LZString.compressToBase64(json);
        var fs       = require('fs');
        var dirPath  = this.authFileDirectoryPath();
        var filePath = this.authFileDirectoryPath() + CrossSaveManager.authFileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, paramAuthFileFormat ? json : data);
    };

    StorageManager.removeCrossSaveAuthFile = function() {
        var fs       = require('fs');
        var filePath = this.authFileDirectoryPath() + CrossSaveManager.authFileName;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    StorageManager.authFileDirectoryPath = function() {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        return decodeURIComponent(path);
    };

    //=============================================================================
    // PluginManager
    //  Milkcocoaのライブラリを読み込みます。
    //=============================================================================
    PluginManager.loadOnlineScript = function(name, callBackFunction) {
        var url        = name;
        var script     = document.createElement('script');
        script.type    = 'text/javascript';
        script.src     = url;
        script.async   = false;
        script.onerror = this.onError.bind(this);
        script.onload  = callBackFunction;
        script._url    = url;
        document.body.appendChild(script);
    };

    //=============================================================================
    // SceneManager
    //  CrossSaveManager用にスクリプトを読み込みます。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        PluginManager.loadOnlineScript(CrossSaveManager._milkCocoaUrl, CrossSaveManager.initialize.bind(CrossSaveManager));
        _SceneManager_initialize.apply(this, arguments);
    };

    var _SceneManager_onError = SceneManager.onError;
    SceneManager.onError      = function(e) {
        if (CrossSaveManager.suppressOnError) return;
        _SceneManager_onError.apply(this, arguments);
    };

    //=============================================================================
    // ConfigManager
    //  最後に入力したネットワークパスワードを保持します。
    //=============================================================================
    ConfigManager.lastPassword  = '';
    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config          = _ConfigManager_makeData.apply(this, arguments);
        config.lastPassword = ConfigManager.lastPassword;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        this.lastPassword = config.lastPassword || '';
    };
})();

