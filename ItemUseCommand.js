/*=============================================================================
 ItemUseCommand.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2022/03/31 効果範囲が「味方」以外のアイテムを使用できない問題を修正
 1.0.0 2022/01/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイテム使用コマンドプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemUseCommand.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param unusableSwitch
 * @text 使用不可トリガー
 * @desc アイテムを使用できなかった場合にONになるスイッチです。
 * @default 0
 * @type switch
 *
 * @param playSe
 * @text 効果音演奏
 * @desc アイテム使用時に効果音を演奏します。
 * @default true
 * @type boolean
 * 
 * @command ITEM_USE
 * @text アイテム使用
 * @desc 指定した対象にアイテムを使用します。
 *
 * @arg itemId
 * @text アイテムID
 * @desc 使用するアイテムのIDです。
 * @default 1
 * @type item
 *
 * @arg itemIdVariable
 * @text アイテムID(変数から取得)
 * @desc 使用するアイテムのIDを変数値から取得する場合こちらを指定します。
 * @default 0
 * @type variable
 * 
 * @arg targetIndex
 * @text 使用対象
 * @desc アイテムを使用する対象のインデックス(並び順)です。1が先頭です。味方全体のアイテムなどでは指定不要です。
 * @default 1
 * @type number
 *
 * @arg targetActor
 * @text 使用対象(直接指定)
 * @desc アイテムを使用する対象をアクターから直接指定する場合に選択します。パーティにいないアクター場合は無視されます。
 * @default 0
 * @type actor
 *
 * @help ItemUseCommand.js
 *
 * 指定したIDのアイテムを使用するコマンドを提供します。
 * コマンド実行後は必要に応じてアイテムを消費し、
 * またアイテムがなければ使用はできません。
 *
 * メニュー画面で使用可能なアイテムのみが対象で戦闘用の
 * アイテムは使用できず、敵キャラは効果の適用外です。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'ITEM_USE', args => {
        const itemId = args.itemIdVariable ? $gameVariables.value(args.itemIdVariable) : args.itemId;
        let target = $gameParty.members().findIndex(actor => actor.actorId() === args.targetActor);
        if (target < 0) {
            target = args.targetIndex - 1;
        }
        $gameTemp.callItemUse(itemId, target);
    });

    Game_Temp.prototype.callItemUse = function(itemId, targetIndex) {
        const item = $dataItems[itemId];
        if (item) {
            const itemUse = new Game_ItemUse(item, targetIndex);
            itemUse.execute();
        }
    };

    /**
     * Game_ItemUse
     */
    class Game_ItemUse {
        constructor(item, targetIndex) {
            this._user = this.findUser();
            this._item = item;
            this._targetIndex = targetIndex || 0;
            this._action = new Game_Action(this._user);
            this._action.setItemObject(item);
        }

        canUse() {
            return this._user.canUse(this._item) && this.isEffectsValid();
        }

        execute() {
            if (!this.canUse()) {
                if (param.unusableSwitch) {
                    $gameSwitches.setValue(param.unusableSwitch, true);
                }
                return;
            }
            if (param.playSe) {
                SoundManager.playUseItem();
            }
            this._user.consumeItem(this._item);
            const action = this._action;
            this.findTarget().forEach(target => {
                const repeats = action.numRepeats();
                for (let i = 0; i < repeats; i++) {
                    action.apply(target);
                }
            });
            action.applyGlobal();
        }

        isEffectsValid() {
            const action = this._action;
            if (!action.isForFriend()) {
                return true;
            }
            return this.findTarget().some(target => action.testApply(target));
        }

        findTarget() {
            const action = this._action;
            if (!action.isForFriend()) {
                return [];
            } else if (action.isForAll()) {
                return $gameParty.members();
            } else {
                return [$gameParty.members()[this._targetIndex]];
            }
        }

        findUser() {
            const members = $gameParty.movableMembers();
            const bestPha = Math.max(...members.map(member => member.pha));
            return members.find(member => member.pha === bestPha);
        }
    }
})();
