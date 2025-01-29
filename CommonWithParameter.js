/*=============================================================================
 CommonWithParameter.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.4.0 2025/01/29 プラグインパラメータに識別用のラベルを追加
 1.3.0 2024/04/01 すべてのコモンイベントで共通の引数を定義できる機能を追加
 1.2.0 2023/08/11 メッセージコモンプラグインと連携して、引数付きコモンを制御文字から呼べる機能を追加
 1.1.0 2023/05/24 名称による検索を完全一致と部分一致の2種類に対応
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
 * @param likeSearch
 * @text 名称部分一致検索
 * @desc 名称で呼び出すコモンイベントを指定するとき、部分一致検索になります。
 * @default true
 * @type boolean
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
 * ずべてのコモンイベントで共通の引数を定義することも可能です。
 * その場合、コモンイベントIDに0を指定したうえで、
 * そのデータをリストの一番下に定義してください。
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
 *
 * @param label
 * @text ラベル
 * @desc 識別用のラベルです。特に用途はないので判別しやすい名前を付けてください。
 * @default
 * @type string
 *
 * @param id
 * @text コモンイベントID
 * @desc 引数情報を登録するコモンイベントのIDです。0を指定すると全コモンイベントで共通で使われる変数になります。
 * @default 0
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
        const commonEvent = DataManager.setupCommonParameter(args.id, args.parameters);
        const eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    });

    DataManager.setupCommonParameter = function(idValue, parameters) {
        const commonEvent = this.findCommonEvent(idValue, String(idValue));
        if (!commonEvent) {
            PluginManagerEx.throwError('Common event is not found. id=' + idValue, script);
        }
        const id = $dataCommonEvents.findIndex(event => event === commonEvent);
        const variables = param.arguments.find(item => item.id === id || item.id === 0)?.variables || [];
        variables.forEach((variableId, index) => {
            if (parameters[index] !== undefined) {
                $gameVariables.setValue(variableId, parameters[index]);
            } else {
                $gameVariables.setValue(variableId, 0);
            }
        });
        return commonEvent;
    };

    DataManager.findCommonEvent = function(id, name) {
        if ($dataCommonEvents[id]) {
            return $dataCommonEvents[id];
        } else {
            return $dataCommonEvents.find(event => param.likeSearch ? event?.name.includes(name) : event?.name === name);
        }
    }
})();
