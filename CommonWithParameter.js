/*=============================================================================
 CommonWithParameter.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 引数付きコモン呼び出しプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CommonWithParameter.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param arguments
 * @text 引数リスト
 * @desc コモンイベントの引数情報を登録します。
 * @default []
 * @type struct<CommonArguments>[]
 *
 * @command CALL
 * @text コモンイベント呼び出し
 * @desc 専用のパラメータを指定してコモンイベントを呼び出します。
 *
 * @arg id
 * @text コモンイベントID
 * @desc 呼び出す対象のコモンイベントIDです。名称で呼び出したい場合はテキストタブから名称を入力します。
 * @default 0
 * @type common_event
 *
 * @arg parameters
 * @text パラメータ
 * @desc プラグインパラメータの引数情報で指定した変数にここで指定した値が格納されます。
 * @default []
 * @type string[]
 *
 * @help CommonWithParameter.js
 *
 * コモンイベントを引数付きで呼び出すことができます。
 * プラグインパラメータで引数が渡される変数番号を登録し、
 * 専用のプラグインコマンドからパラメータを指定してコモンイベントを呼びます。
 *
 * また、コモンイベント名称を基準にコモンイベントを呼ぶことも可能です。
 * 名称によるコモンイベント呼び出しは名称の部分一致検索になります。
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

/*~struct~CommonArguments:
 * @param id
 * @text コモンイベントID
 * @desc 引数情報を登録するコモンイベントのIDです。
 * @default 1
 * @type common_event
 *
 * @param variables
 * @text 引数が格納される変数
 * @desc 呼び出し時に値が格納される変数番号の一覧です。
 * @default []
 * @type variable[]
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.arguments) {
        param.arguments = [];
    }

    PluginManagerEx.registerCommand(script, 'CALL', function(args) {
        const commonEvent = DataManager.findCommonEvent(args.id, String(args.id));
        if (commonEvent) {
            const id = $dataCommonEvents.findIndex(event => event === commonEvent);
            this.setupCommonParameter(id, args.parameters);
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
    });

    Game_Interpreter.prototype.setupCommonParameter = function(id, parameters) {
        const variables = param.arguments.find(item => item.id === id)?.variables;
        if (!variables) {
            return;
        }
        variables.forEach((variableId, index) => {
            if (parameters[index] !== undefined) {
                $gameVariables.setValue(variableId, parameters[index]);
            } else {
                $gameVariables.setValue(variableId, 0);
            }
        });
    };

    DataManager.findCommonEvent = function(id, name) {
        if ($dataCommonEvents[id]) {
            return $dataCommonEvents[id];
        } else {
            return $dataCommonEvents.find(event => event?.name.includes(name));
        }
    }
})();
