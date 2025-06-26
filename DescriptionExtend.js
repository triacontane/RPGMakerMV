//=============================================================================
// DescriptionExtend.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.1 2025/06/27 ヘルプに注意書きを追加
// 1.3.0 2024/09/07 画面ごとにヘルプウィンドウの行数を変更できる機能を追加
// 1.2.1 2021/12/06 ヘルプ行数の設定が戦闘画面に反映されない問題を修正
//                  AdditionalDescription.jsとの並び順を定義
// 1.2.0 2021/10/01 MZで動作するよう修正
// 1.1.0 2018/05/22 プラグインの機能を無効化するスイッチを追加
// 1.0.0 2018/05/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 説明拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DescriptionExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderBefore AdditionalDescription
 * @author トリアコンタン
 *
 * @param swapDescription
 * @text 説明置き換え
 * @desc 元の説明文を無視してメモ欄の値で置き換えます。OFFの場合は元の説明文の次行に表示されます。
 * @default true
 * @type boolean
 *
 * @param helpLines
 * @text ヘルプ行数
 * @desc ヘルプウィンドウの高さを変更したい場合は指定してください。0の場合は何もしません。
 * @default 0
 * @type number
 *
 * @param helpLinesByScene
 * @text シーン別ヘルプ行数
 * @desc シーンごとにヘルプウィンドウの高さを変更したい場合は指定してください。指定が無ければ共通設定が適用されます。
 * @default []
 * @type struct<Line>[]
 *
 * @param validSwitch
 * @text 有効スイッチ
 * @desc 指定した番号のスイッチがONのときのみプラグインが有効になります。0の場合は常に有効になります。
 * @default 0
 * @type switch
 *
 * @help DescriptionExtend.js
 *
 * ヘルプウィンドウの説明欄を拡張します。3行目以降を表示できるようになります。
 * メモ欄に以下の通り設定してください。
 * <ExtendDesc:aaa> // [aaa]を追加表示します。
 * <拡張説明:aaa>   // 同上
 *
 * 本プラグインを使って説明欄を拡張した結果、他の項目の表示幅が小さくなったり
 * 一部項目が表示されなくなる場合があります。
 * その場合の対処は利用者の方で各自行ってください。
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

/*~struct~Line:
 * @param scene
 * @text シーン
 * @desc ヘルプウィンドウの高さを変更したいシーンを指定してください。
 * @default Scene_Item
 * @type select
 * @option アイテム画面
 * @value Scene_Item
 * @option スキル画面
 * @value Scene_Skill
 * @option 装備画面
 * @value Scene_Equip
 * @option 戦闘画面
 * @value Scene_Battle
 *
 * @param lines
 * @text 行数
 * @desc ヘルプウィンドウの高さを変更したい場合は指定してください。
 * @default 0
 */
(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_MenuBase_helpAreaHeight = Scene_MenuBase.prototype.helpAreaHeight;
    Scene_MenuBase.prototype.helpAreaHeight = function() {
        const lineNumber = this.findHelpLines();
        if (lineNumber > 0) {
            return this.calcWindowHeight(lineNumber, false);
        } else {
            return _Scene_MenuBase_helpAreaHeight.apply(this, arguments);
        }
    };

    const _Scene_Battle_helpAreaHeight = Scene_Battle.prototype.helpAreaHeight;
    Scene_Battle.prototype.helpAreaHeight = function() {
        const lineNumber = this.findHelpLines();
        if (lineNumber > 0) {
            return this.calcWindowHeight(lineNumber, false);
        } else {
            return _Scene_Battle_helpAreaHeight.apply(this, arguments);
        }
    };

    Scene_Base.prototype.findHelpLines = function() {
        if (param.helpLinesByScene) {
            const scene = this.constructor.name;
            const data = param.helpLinesByScene.find(data => data.scene === scene);
            if (data && data.lines) {
                return data.lines;
            }
        }
        return param.helpLines;
    };

    /**
     * Window_Help
     * 拡張説明を追記します。
     */
    const _Window_Help_setItem = Window_Help.prototype.setItem;
    Window_Help.prototype.setItem = function(item) {
        _Window_Help_setItem.apply(this, arguments);
        if (!item || !this.isValidDescriptionExtend()) {
            return;
        }
        const extendText = PluginManagerEx.findMetaValue(item, ['拡張説明', 'ExtendDesc']);
        if (extendText) {
            this.setText((param.swapDescription ? '' : this._text + '\n') + extendText);
        }
    };

    Window_Help.prototype.isValidDescriptionExtend = function() {
        return !param.validSwitch || $gameSwitches.value(param.validSwitch)
    };
})();
