//=============================================================================
// CustomizeConfigDefault.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.2 2021/12/22 1.2.1の修正でローカル実行時にデフォルト値が反映されなくなる問題を修正
// 1.2.1 2021/12/21 アツマール等Webにあげたときにオプションのデフォルト値が反映されない問題を修正
// 1.2.0 2021/03/01 MZで動作するよう修正、リファクタリング
// 1.1.1 2020/09/13 Mano_InputConfig.jsと併用したとき、Option項目を消していると表示不整合が発生する競合を修正
// 1.1.0 2016/08/01 項目自体を非表示にする機能を追加しました。
// 1.0.3 2016/06/22 多言語対応
// 1.0.2 2016/01/17 競合対策
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/11/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Setting default value for Options
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigDefault.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param AlwaysDash
 * @desc Always dash(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param CommandRemember
 * @desc Command remember(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param TouchUi
 * @desc Touch UI(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param BgmVolume
 * @desc BGM Volume(0-100)
 * @default 100
 * @max 100
 * @type number
 *
 * @param BgsVolume
 * @desc BGS Volume(0-100)
 * @default 100
 * @max 100
 * @type number
 *
 * @param MeVolume
 * @desc ME Volume(0-100)
 * @default 100
 * @max 100
 * @type number
 *
 * @param SeVolume
 * @desc SE Volume(0-100)
 * @default 100
 * @max 100
 * @type number
 *
 * @param EraseAlwaysDash
 * @desc Erase AlwaysDash Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseCommandRemember
 * @desc Erase CommandRemember Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseTouchUi
 * @desc Erase TouchUI Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseBgmVolume
 * @desc Erase BgmVolume Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseBgsVolume
 * @desc Erase BgsVolume Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseMeVolume
 * @desc Erase MeVolume Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseSeVolume
 * @desc Erase SeVolume Option(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help Setting default value for Options.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc オプションデフォルト値設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigDefault.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param AlwaysDash
 * @text 常時ダッシュ
 * @desc 常にダッシュする。（Shiftキーを押している場合のみ歩行）(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param CommandRemember
 * @text コマンド記憶
 * @desc 選択したコマンドを記憶する。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param TouchUi
 * @text タッチUi
 * @desc タッチ用のボタン等をメニュー画面に表示する。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param BgmVolume
 * @text BGM音量
 * @desc BGMの音量。0-100
 * @default 100
 * @max 100
 * @type number
 * 
 * @param BgsVolume
 * @text BGS音量
 * @desc BGSの音量。0-100
 * @default 100
 * @max 100
 * @type number
 * 
 * @param MeVolume
 * @text ME音量
 * @desc MEの音量。0-100
 * @default 100
 * @max 100
 * @type number
 * 
 * @param SeVolume
 * @text SE音量
 * @desc SEの音量。0-100
 * @default 100
 * @max 100
 * @type number
 *
 * @param EraseAlwaysDash
 * @text 常時ダッシュ消去
 * @desc 常時ダッシュの項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseCommandRemember
 * @text コマンド記憶消去
 * @desc コマンド記憶の項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseTouchUi
 * @text タッチUI消去
 * @desc タッチUIの項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseBgmVolume
 * @text BGM音量消去
 * @desc BGM音量の項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseBgsVolume
 * @text BGS音量消去
 * @desc BGS音量の項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseMeVolume
 * @text ME音量消去
 * @desc ME音量の項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param EraseSeVolume
 * @text SE音量消去
 * @desc SE音量の項目を非表示にする。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help オプション画面で設定可能な項目のデフォルト値を指定した値に変更します。
 * 例えば、初回から常時ダッシュをONにしておけば
 * プレイヤーが設定を変更する手間を省くことができます。
 * この処理はconfig.rpgsaveが未作成の場合にのみ実行されます。
 *
 * また、項目そのものを消去することもできます。
 * 例えば、戦闘がないゲームでは「コマンド記憶」等は不要なので消去できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ConfigManager
    //  それぞれの項目に初期値を与えます。
    //=============================================================================
    const _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function () {
        this.applyDefault(); // For local.
        _ConfigManager_load.apply(this, arguments);
    }

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        if (Object.keys(config).length === 0) {
            this.applyDefault(); // For browser.
        }
    };

    ConfigManager.applyDefault = function () {
        this.alwaysDash = param.AlwaysDash;
        this.commandRemember = param.CommandRemember;
        this.touchUI = param.TouchUi;
        this.bgmVolume = param.BgmVolume;
        this.bgsVolume = param.BgsVolume;
        this.meVolume = param.MeVolume;
        this.seVolume = param.SeVolume;
    }

    //=============================================================================
    // Scene_Options
    //  オプションウィンドウの高さを調整します。
    //=============================================================================
    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        let count = _Scene_Options_maxCommands.apply(this, arguments);
        if (param.EraseAlwaysDash) count--;
        if (param.EraseCommandRemember) count--;
        if (param.EraseTouchUi) count--;
        if (param.EraseBgmVolume) count--;
        if (param.EraseBgsVolume) count--;
        if (param.EraseMeVolume) count--;
        if (param.EraseSeVolume) count--;
        return count;
    };

    //=============================================================================
    // Window_Options
    //  パラメータを空白にした項目を除去します。
    //=============================================================================
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.apply(this, arguments);
        if (param.EraseAlwaysDash) this.eraseOption('alwaysDash');
        if (param.EraseCommandRemember) this.eraseOption('commandRemember');
        if (param.EraseTouchUi) this.eraseOption('touchUI')
        if (param.EraseBgmVolume) this.eraseOption('bgmVolume');
        if (param.EraseBgsVolume) this.eraseOption('bgsVolume');
        if (param.EraseMeVolume) this.eraseOption('meVolume');
        if (param.EraseSeVolume) this.eraseOption('seVolume');
    };

    Window_Options.prototype.eraseOption = function (symbol) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol) {
                this._list.splice(i, 1);
                // for Mano_InputConfig.js
                this.adjustIndexManoInputConfig(i);
                break;
            }
        }
    };

    Window_Options.prototype.adjustIndexManoInputConfig = function (index) {
        if (this._gamepadOptionIndex > index) {
            this._gamepadOptionIndex -= 1;
        }
        if (this._keyboardConfigIndex > index) {
            this._keyboardConfigIndex -= 1;
        }
    };
})();