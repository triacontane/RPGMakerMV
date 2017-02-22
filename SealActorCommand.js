//=============================================================================
// SealActorCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SealActorCommandPlugin
 * @author triacontane
 *
 * @help 主要アクターコマンド「攻撃」「防御」「アイテム」を封印できます。
 * 封印されたコマンドはウィンドウから消失します。
 * 特定のコマンドが使用できないアクター、職業、装備品、ステートが作成できます。
 * さらに、スイッチやJavaScript計算式により、細かい条件が指定できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記入してください。
 *
 * <SAC攻撃封印スイッチ:4> # ID[4]のスイッチがONのとき攻撃を封印
 * <SACAttackSwitch:4>     # 同上
 * <SAC防御封印スイッチ:5> # ID[5]のスイッチがONのとき防御を封印
 * <SACGuardSwitch:5>      # 同上
 * <SAC道具封印スイッチ:6> # ID[6]のスイッチがONのときアイテムを封印
 * <SACItemSwitch:6>       # 同上
 * <SAC攻撃封印計算式:f>   # 計算式[f]の結果がtrueのとき攻撃を封印
 * <SACAttackFormula:f>    # 同上
 * <SAC防御封印計算式:f>   # 計算式[f]の結果がtrueのとき防御を封印
 * <SACGuardFormula:f>     # 同上
 * <SAC道具封印計算式:f>   # 計算式[f]の結果がtrueのときアイテムを封印
 * <SACItemFormula:f>      # 同上
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例
 * <SACAttackFormula:\v[1] &gt;= 5> # 変数[1]が5以下の場合攻撃封印
 * <SACGuardFormula:true>           # 常に防御封印
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アクターコマンド封印プラグイン
 * @author トリアコンタン
 *
 * @help 主要アクターコマンド「攻撃」「防御」「アイテム」を封印できます。
 * 封印されたコマンドはウィンドウから消失します。
 * 特定のコマンドが使用できないアクター、職業、装備品、ステートが作成できます。
 * さらに、スイッチやJavaScript計算式により、細かい条件が指定できます。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記入してください。
 *
 * <SAC攻撃封印スイッチ:4> # ID[4]のスイッチがONのとき攻撃を封印
 * <SACAttackSwitch:4>     # 同上
 * <SAC防御封印スイッチ:5> # ID[5]のスイッチがONのとき防御を封印
 * <SACGuardSwitch:5>      # 同上
 * <SAC道具封印スイッチ:6> # ID[6]のスイッチがONのときアイテムを封印
 * <SACItemSwitch:6>       # 同上
 * <SAC攻撃封印計算式:f>   # 計算式[f]の結果がtrueのとき攻撃を封印
 * <SACAttackFormula:f>    # 同上
 * <SAC防御封印計算式:f>   # 計算式[f]の結果がtrueのとき防御を封印
 * <SACGuardFormula:f>     # 同上
 * <SAC道具封印計算式:f>   # 計算式[f]の結果がtrueのときアイテムを封印
 * <SACItemFormula:f>      # 同上
 *
 * 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例
 * <SACAttackFormula:\v[1] &gt;= 5> # 変数[1]が5以下の場合攻撃封印
 * <SACGuardFormula:true>           # 常に防御封印
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'SAC';

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Actor
    //  コマンド封印が有効かどうかを判定します。
    //=============================================================================
    Game_Actor.prototype.getSealMetaInfo = function(names) {
        var metaValue = null;
        this.traitObjects().some(function(traitObject) {
            metaValue = getMetaValues(traitObject, names);
            return metaValue;
        });
        return metaValue;
    };

    Game_Actor.prototype.isSealCommandAttack = function() {
        var switchId = this.getSealMetaInfo(['AttackSwitch', '攻撃封印スイッチ']);
        if (switchId && $gameSwitches.value(getArgNumber(switchId))) {
            return true;
        }
        var formula = this.getSealMetaInfo(['AttackFormula', '攻撃封印計算式']);
        return formula && eval(formula);
    };

    Game_Actor.prototype.isSealCommandGuard = function() {
        var switchId = this.getSealMetaInfo(['GuardSwitch', '防御封印スイッチ']);
        if (switchId && $gameSwitches.value(getArgNumber(switchId))) {
            return true;
        }
        var formula = this.getSealMetaInfo(['GuardFormula', '防御封印計算式']);
        return formula && eval(formula);
    };

    Game_Actor.prototype.isSealCommandItem = function() {
        var switchId = this.getSealMetaInfo(['ItemSwitch', '道具封印スイッチ']);
        if (switchId && $gameSwitches.value(getArgNumber(switchId))) {
            return true;
        }
        var formula = this.getSealMetaInfo(['ItemFormula', '道具封印計算式']);
        return formula && eval(formula);
    };

    //=============================================================================
    // Window_ActorCommand
    //  コマンドが封印されていた場合、処理を終了します。
    //=============================================================================
    var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (this._actor.isSealCommandAttack()) return;
        _Window_ActorCommand_addAttackCommand.apply(this, arguments);
    };

    var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
    Window_ActorCommand.prototype.addGuardCommand = function() {
        if (this._actor.isSealCommandGuard()) return;
        _Window_ActorCommand_addGuardCommand.apply(this, arguments);
    };

    var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        if (this._actor.isSealCommandItem()) return;
        _Window_ActorCommand_addItemCommand.apply(this, arguments);
    };
})();

