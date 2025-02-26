/*=============================================================================
 KeySwitch.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2025/02/26 トリガーに押し続け以外の選択肢を追加、トグルスイッチ用の設定を追加
 1.0.0 2025/02/09 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc キースイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/KeySwitch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param keyList
 * @text キー設定リスト
 * @desc キースイッチの設定です。スイッチ制御するキー情報を登録します。
 * @default []
 * @type struct<Key>[]
 *
 * @param codeList
 * @text キーコードリスト
 * @desc 登録するキーコードのリストです。既存のキー以外のキーを登録する場合に使用します。
 * @default []
 * @type struct<Code>[]
 *
 * @help KeySwitch.js
 *
 * キー入力によってスイッチをONにできます。
 * 押し続けている間は常にスイッチ条件を満たします。
 * シーンにかかわらず有効になるので注意してください。
 *
 * 既存のキー以外を使いたい場合はキーコードリストに追加してください。
 * ただし、登録内容によってはキーボードが必須になる可能性があります。
 * キーに対応するキーコードの値は各自調査してください。
 * 例えば、Aキーのキーコードは65です。
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

/*~struct~Key:
 * @param keyName
 * @text キー名称
 * @desc スイッチをONにするキーの名称です。既存のキー以外を使用する場合は直接入力してください。
 * @default
 * @type combo
 * @option ok
 * @option cancel
 * @option shift
 * @option control
 * @option tab
 * @option pageup
 * @option pagedown
 * @option escape
 * @option down
 * @option left
 * @option right
 * @option up
 *
 * @param switchId
 * @text スイッチID
 * @desc ONにするスイッチのIDです。
 * @default 1
 * @type switch
 *
 * @param conditionSwitchId
 * @text 条件スイッチID
 * @desc このスイッチがONのときのみキー入力が有効になります。指定しない場合、常に有効になります。
 * @default 0
 * @type switch
 *
 * @param autoOff
 * @text 自動OFF
 * @desc キー入力されていない状態だとスイッチをOFFに戻します。
 * @default false
 * @type boolean
 *
 * @param reverse
 * @text 反転
 * @desc スイッチのON/OFFを反転させ、キー入力でスイッチをOFFにします。
 * @default false
 * @type boolean
 *
 * @param toggle
 * @text トグル
 * @desc キー入力が有効になるたびにスイッチのON/OFFを切り替えます。有効にした場合、反転と自動OFFの設定は無効になります。
 * @default false
 * @type boolean
 *
 * @param trigger
 * @text トリガー
 * @desc キー入力のトリガーです。
 * @type select
 * @option 押し続け
 * @value isPressed
 * @option 押した瞬間
 * @value isTriggered
 * @option 長押し
 * @value isLongPressed
 * @option リピート
 * @value isRepeated
 * @default isPressed
 */

/*~struct~Code:
 *
 * @param keyName
 * @text キー名称
 * @desc キー名称です。既存のキー名称と重複しない任意の値を指定してください。
 *
 * @param code
 * @text キーコード
 * @desc 登録するキーのキーコードです。入力値はJavaScriptのキーコードと同じなので各自調査してください。
 * @default 65
 * @type number
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.keyList) {
        param.keyList = [];
    }
    if (!param.codeList) {
        param.codeList = [];
    }
    param.codeList.forEach(item => {
        Input.keyMapper[item.code] = item.keyName;
    });
    const keyList = param.keyList.map(item => {
        const data = {};
        const prevData = item._parameter;
        for (const key in prevData) {
            data[key] = prevData[key];
        }
        return data;
    });

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.apply(this, arguments);
        if ($gameVariables) {
            this.updateKeySwitch();
        }
    };

    SceneManager.updateKeySwitch = function() {
        keyList.forEach(item => {
            const keyValue = this.findKeySwitchValue(item);
            if (keyValue === undefined) {
                return;
            }
            const prevValue = $gameSwitches.value(item.switchId);
            let newValue = item.reverse ? !keyValue : keyValue;
            if (item.toggle) {
                newValue = !prevValue;
            }
            if (prevValue !== newValue) {
                $gameSwitches.setValue(item.switchId, newValue);
            }
        });
    };

    SceneManager.findKeySwitchValue = function(item) {
        if (item.conditionSwitchId > 0 && !$gameSwitches.value(item.conditionSwitchId)) {
            return false;
        } else if (Input.isKeySwitchTriggered(item)) {
            return true;
        } else if (item.autoOff && !item.toggle) {
            return false;
        } else {
            return undefined;
        }
    };

    Input.isKeySwitchTriggered = function(item) {
        const method = item.trigger;
        return this[method] ? this[method](item.keyName) : this.isPressed(item.keyName);
    };
})();
