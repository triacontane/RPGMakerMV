/*=============================================================================
 TitleHelp.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/11/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイトルヘルププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleHelp.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param descriptionList
 * @text ヘルプリスト
 * @desc コマンドごとのヘルプ一覧です。プラグインで追加されたコマンドがある場合はシンボルを確認してください。
 * @default []
 * @type struct<TitleHelp>[]
 *
 * @param helpWindowX
 * @text ヘルプウィンドウX座標
 * @desc ヘルプウィンドウのX座標です。
 * @default 0
 * @type number
 *
 * @param helpWindowY
 * @text ヘルプウィンドウY座標
 * @desc ヘルプウィンドウのY座標です。
 * @default 0
 * @type number
 *
 * @param helpWindowLines
 * @text ヘルプウィンドウ行数
 * @desc ヘルプウィンドウの行数です。
 * @default 1
 * @type number
 *
 * @param helpButton
 * @text ヘルプボタン
 * @desc ヘルプウィンドウを表示するボタンです。指定しない場合、常に表示されます。
 * @default
 * @type combo
 * @option cancel
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option menu
 *
 * @param helpButtonTrigger
 * @text ヘルプボタントリガー
 * @desc ヘルプウィンドウを表示するボタンのトリガーです。
 * @default toggle
 * @type select
 * @option 切り替え
 * @value toggle
 * @option 押し続け
 * @value press
 *
 * @help TitleHelp.js
 *
 * タイトル画面にヘルプウィンドウを表示できます。
 * シンボルを指定することでコマンドごとのヘルプテキストを表示できます。
 * シンボルが特定できれば、プラグインで追加されたコマンドにも対応できます。
 *
 * newGame : ニューゲーム
 * continue : コンティニュー
 * options : オプション
 * 以下はプラグインで追加されるコマンドです。
 * nameGame2_0 : アナザーニューゲーム(1番目)
 * nameGame2_1 : アナザーニューゲーム(2番目)
 * shutdown : ゲーム終了
 * soundTest : サウンドテスト
 *
 * ヘルプの外観の調整は「ウィンドウ背景画像指定プラグイン」などが使えます。
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~TitleHelp:
 * @param symbol
 * @text シンボル
 * @desc コマンドごとに一意になるシンボルです。
 * @default
 * @type combo
 * @option newGame
 * @option continue
 * @option options
 * @option nameGame2_0
 * @option nameGame2_1
 * @option shutdown
 * @option soundTest
 *
 * @param description
 * @text 説明
 * @desc コマンドの説明文です。
 * @default
 * @type multiline_string
 *
 * @param enableOnly
 * @text 選択可能時のみ表示
 * @desc コマンドが選択可能な場合のみヘルプを表示します。
 * @default false
 * @type boolean
 *
 * @param disableOnly
 * @text 選択不可時のみ表示
 * @desc コマンドが選択不可な場合のみヘルプを表示します。
 * @default false
 * @type boolean
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.apply(this, arguments);
        this.createHelpWindow();
        this._commandWindow.setHelpWindow(this._helpWindow);
    };

    Scene_Title.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_TitleHelp(rect);
        this.addWindow(this._helpWindow);
    };

    Scene_Title.prototype.helpWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(param.helpWindowLines || 1, false);
        const wx = param.helpWindowX || 0;
        const wy = param.helpWindowY || 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    Window_TitleCommand.prototype.updateHelp = function() {
        const help = this.findHelpDescription();
        this._helpWindow.setText(help ? help.description : '');
    };

    Window_TitleCommand.prototype.findHelpDescription = function() {
        const symbol = this.currentSymbol();
        const enable = this.isCurrentItemEnabled();
        return param.descriptionList.find(data => {
            return data.symbol === symbol && !(data.enableOnly && !enable || data.disableOnly && enable);
        });
    };

    class Window_TitleHelp extends Window_Help {
        constructor(rect) {
            super(rect);
            this.hide();
            this.update();
        }

        update() {
            super.update();
            this.updateHelpButton(param.helpButton);
        }

        updateHelpButton(button) {
            if (this.isHelpVisible(button)) {
                this.show();
            } else {
                this.hide();
            }
        }

        isHelpVisible(button) {
            if (!button) {
                return true;
            }
            if (param.helpButtonTrigger === 'toggle') {
                return Input.isTriggered(button) ? !this.visible : this.visible;
            } else {
                return Input.isPressed(button);
            }
        }
    }
    window.Window_TitleHelp = Window_TitleHelp;
})();
