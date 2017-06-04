//=============================================================================
// DirectlyAttackEffect.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.4 2017/06/04 残像を使用する設定で複数のキャラクターに対して連続でアニメーションを再生すると処理落ちする問題を修正
// 1.1.3 2017/06/04 StateRolling.jsとの競合を解消
// 1.1.2 2017/05/18 高速で戦闘を進めた場合に、たまにダメージが敵キャラの後ろに隠れてしまうことがある問題を修正
// 1.1.1 2016/11/13 設定次第で、戦闘終了後にセーブできなくなる場合がある不具合を修正
// 1.1.0 2016/10/05 常時残像を有効にする設定の追加
//                  BattlerGraphicExtend.jsとの連携を強化
// 1.0.0 2016/09/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DirectlyAttackEffectPlugin
 * @author triacontane
 *
 * @param Duration
 * @desc 相手の元に移動するまでに掛けるフレーム数のデフォルト値です。メモ欄で指定がないとこの値が参照されます。
 * @default 12
 *
 * @param Altitude
 * @desc 相手の元に放物線移動する際の高度のデフォルト値です。メモ欄で指定がないとこの値が参照されます。
 * @default 10
 *
 * @param ValidActor
 * @desc 直接攻撃演出をアクターに適用します。OFFにすると適用されません。
 * @default ON
 *
 * @param ValidEnemy
 * @desc 直接攻撃演出を敵キャラに適用します。OFFにすると適用されません。
 * @default ON
 *
 * @param NoAfterimage
 * @desc ONにすると残像表示が無効になります。競合やパフォーマンス対策になります。
 * @default OFF
 *
 * @param AlwaysAfterimage
 * @desc ONにすると戦闘中は常に残像が表示されます。他のプラグインとの連携がしやすくなります。
 * @default OFF
 *
 * @help スキル実行時にターゲットまで近寄ってから実行します。
 * 追加で以下の機能を実装します。
 *
 * ・放物線移動
 * ・座標直接指定移動
 * ・戦闘アニメーション表示
 * ・残像表示
 *
 * 主に競合等の理由でYEPアクションシーケンスを使用しない方向けです。
 * スキルのメモ欄に以下の通り指定してください。
 *
 * <DAE攻撃:12,10,0,0>      # 12フレーム、高度10で対象まで移動
 * <DAEAttack:12,10,0,0>    # 同上
 * <DAE帰投:18,25>          # 18フレーム、高度25で元に位置に戻る
 * <DAEReturn:18,25>        # 同上
 * <DAE姿隠し>              # 移動する際にバトラーの姿を隠します。
 * <DAEHidden>              # 同上
 * <DAE残像>                # 移動する際にバトラーの残像を表示します。
 * <DAEAfterimage>          # 同上
 * <DAE帰投なし>            # 発動後に元の位置に戻らなくなります。
 * <DAENoReturn>            # 同上
 * <DAEアニメ:1>            # 発動者にID[1]のアニメーションを再生します。
 * <DAEAnimation:1>         # 同上
 * <DAE対象者アニメ:1>      # 対象者にID[1]のアニメーションを再生します。
 * <DAETargetAnimation:1>   # 同上
 * <DAE絶対位置:320,240>    # 座標[320, 240]に移動します。
 * <DAEAbsolutePos:320,240> # 同上
 * <DAE相対位置:30,10>      # 対象者から[30, 10]の位置に移動します。
 * <DAERelativePos:30,10>   # 同上
 * <DAE自己相対位置:5,0>    # 自分自身から[5, 0]の位置に移動します。
 * <DAESelfRelativePos:5,0> # 同上
 * <DAE瞬間移動:320,240>    # 座標[320, 240]に瞬間移動します。
 * <DAETeleport:320,240>    # 同上
 * <DAEアクターのみ>        # アクターが実行したときのみ演出が有効になります。
 * <DAEActorOnly>           # 同上
 * <DAE敵キャラのみ>        # 敵キャラが実行したときのみ演出が有効になります。
 * <DAEEnemyOnly>           # 同上
 * <DAE武器:1>              # 攻撃時のモーションが「攻撃：武器タイプ[1]」になります。
 * <DAEWeapon:1>            # 同上
 * <DAEモーション:dead>     # 攻撃時のモーションが「戦闘不能」になります。
 * <DAEMotion:dead>         # 同上
 *
 * メモ欄詳細
 * <DAE攻撃:[フレーム数],[高度],[Z座標],[中心移動]>
 * 指定したフレーム数で対象まで移動してからスキルを実行します。
 * 高度を設定すると放物線移動するようになります。
 * Z座標を指定すると本来の地点より高い場所に移動します。
 * 中心移動に[1]を設定すると、相手の正面ではなく中心に移動します。
 *
 * <DAE帰投:[フレーム数],[高度],[Z座標]>
 * スキル実行後に元の位置に戻ります。
 * 指定しなかった場合、攻撃と同じフレーム数、高度で戻ります。
 * 攻撃でZ座標を指定した場合は、0を指定しないと宙に浮いたままです。
 *
 * <DAE帰投なし>
 * スキル実行後に帰投しなくなります。
 * ずっとその位置に留まるので、特殊なスキルのみ指定します。
 *
 * <DAEアニメ:[アニメーションID]>
 * 対象者にID[1]のアニメーションを再生します。
 * 再生されるタイミングは、移動開始する直前です。
 * 効果音のみのアニメーションを指定すれば、任意の効果音を再生できます。
 *
 * <DAE絶対位置:[X座標],[Y座標]>
 * 移動先がターゲットとは無関係に、画面上の指定座標になります。
 * 敵キャラが使用する場合、X座標が反転します。
 *
 * <DAE相対位置:[X座標],[Y座標]>
 * 移動先がターゲットの正面から指定した座標分ずれた位置になります。
 *
 * <DAE自己相対位置:[X座標],[Y座標]>
 * 移動先が自分自身の座標から指定した座標分ずれた位置になります。
 *
 * <DAE瞬間移動:[X座標],[Y座標]>
 * 即座に指定位置に移動してから、ターゲットへの移動を開始します。
 *
 * <DAE武器:[武器タイプID]>
 * 装備武器とは無関係に指定した武器タイプIDでスキルを実行します。
 * 武器タイプIDを指定しない（<DAE武器>）と装備武器で実行します。
 *
 * <DAEモーション:[モーション名称]>
 * スキル実行時のモーションを指定したものに変更します。
 * モーション名称は以下の通りです。(「[SV]戦闘キャラ」に準拠)
 *
 * walk     歩行
 * wait     待機
 * chant    詠唱
 * guard    防御
 * damage   ダメージ
 * evade    回避
 * thrust   攻撃(突き)
 * swing    攻撃(振り)
 * missile  攻撃(飛び道具)
 * skill    スキル
 * spell    魔法
 * item     アイテム
 * escape   逃走
 * victory  勝利
 * dying    瀕死
 * abnormal 状態異常
 * sleep    睡眠
 * dead     戦闘不能
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 直接攻撃演出プラグイン
 * @author トリアコンタン
 *
 * @param フレーム数
 * @desc 相手の元に移動するまでに掛けるフレーム数のデフォルト値です。メモ欄で指定がないとこの値が参照されます。
 * @default 12
 *
 * @param 高度
 * @desc 相手の元に放物線移動する際の高度のデフォルト値です。メモ欄で指定がないとこの値が参照されます。
 * @default 10
 *
 * @param アクターに適用
 * @desc 直接攻撃演出をアクターに適用します。OFFにすると適用されません。
 * @default ON
 *
 * @param 敵キャラに適用
 * @desc 直接攻撃演出を敵キャラに適用します。OFFにすると適用されません。
 * @default ON
 *
 * @param 残像不使用
 * @desc ONにすると残像表示が無効になります。競合やパフォーマンス対策になります。
 * @default OFF
 *
 * @param 常時残像使用
 * @desc ONにすると戦闘中は常に残像が表示されます。他のプラグインとの連携がしやすくなります。
 * @default OFF
 *
 * @help スキル実行時にターゲットまで近寄ってから実行します。
 * 追加で以下の機能を実装します。
 *
 * ・放物線移動
 * ・座標直接指定移動
 * ・戦闘アニメーション表示
 * ・残像表示
 *
 * 主に競合等の理由でYEPアクションシーケンスを使用しない方向けです。
 * スキルのメモ欄に以下の通り指定してください。
 *
 * <DAE攻撃:12,10,0,0>      # 12フレーム、高度10で対象まで移動
 * <DAEAttack:12,10,0,0>    # 同上
 * <DAE帰投:18,25>          # 18フレーム、高度25で元に位置に戻る
 * <DAEReturn:18,25>        # 同上
 * <DAE姿隠し>              # 移動する際にバトラーの姿を隠します。
 * <DAEHidden>              # 同上
 * <DAE残像>                # 移動する際にバトラーの残像を表示します。
 * <DAEAfterimage>          # 同上
 * <DAE帰投なし>            # 発動後に元の位置に戻らなくなります。
 * <DAENoReturn>            # 同上
 * <DAEアニメ:1>            # 発動者にID[1]のアニメーションを再生します。
 * <DAEAnimation:1>         # 同上
 * <DAE対象者アニメ:1>      # 対象者にID[1]のアニメーションを再生します。
 * <DAETargetAnimation:1>   # 同上
 * <DAE絶対位置:320,240>    # 座標[320, 240]に移動します。
 * <DAEAbsolutePos:320,240> # 同上
 * <DAE相対位置:30,10>      # 対象者から[30, 10]の位置に移動します。
 * <DAERelativePos:30,10>   # 同上
 * <DAE自己相対位置:5,0>    # 自分自身から[5, 0]の位置に移動します。
 * <DAESelfRelativePos:5,0> # 同上
 * <DAE瞬間移動:320,240>    # 座標[320, 240]に瞬間移動します。
 * <DAETeleport:320,240>    # 同上
 * <DAEアクターのみ>        # アクターが実行したときのみ演出が有効になります。
 * <DAEActorOnly>           # 同上
 * <DAE敵キャラのみ>        # 敵キャラが実行したときのみ演出が有効になります。
 * <DAEEnemyOnly>           # 同上
 * <DAE武器:1>              # 攻撃時のモーションが「攻撃：武器タイプ[1]」になります。
 * <DAEWeapon:1>            # 同上
 * <DAEモーション:dead>     # 攻撃時のモーションが「戦闘不能」になります。
 * <DAEMotion:dead>         # 同上
 *
 * メモ欄詳細
 * <DAE攻撃:[フレーム数],[高度],[Z座標],[中心移動]>
 * 指定したフレーム数で対象まで移動してからスキルを実行します。
 * 高度を設定すると放物線移動するようになります。
 * Z座標を指定すると本来の地点より高い場所に移動します。
 * 中心移動に[1]を設定すると、相手の正面ではなく中心に移動します。
 *
 * <DAE帰投:[フレーム数],[高度],[Z座標]>
 * スキル実行後に元の位置に戻ります。
 * 指定しなかった場合、攻撃と同じフレーム数、高度で戻ります。
 * 攻撃でZ座標を指定した場合は、0を指定しないと宙に浮いたままです。
 *
 * <DAE帰投なし>
 * スキル実行後に帰投しなくなります。
 * ずっとその位置に留まるので、特殊なスキルのみ指定します。
 *
 * <DAEアニメ:[アニメーションID]>
 * 対象者にID[1]のアニメーションを再生します。
 * 再生されるタイミングは、移動開始する直前です。
 * 効果音のみのアニメーションを指定すれば、任意の効果音を再生できます。
 *
 * <DAE絶対位置:[X座標],[Y座標]>
 * 移動先がターゲットとは無関係に、画面上の指定座標になります。
 * 敵キャラが使用する場合、X座標が反転します。
 *
 * <DAE相対位置:[X座標],[Y座標]>
 * 移動先がターゲットの正面から指定した座標分ずれた位置になります。
 *
 * <DAE自己相対位置:[X座標],[Y座標]>
 * 移動先が自分自身の座標から指定した座標分ずれた位置になります。
 *
 * <DAE瞬間移動:[X座標],[Y座標]>
 * 即座に指定位置に移動してから、ターゲットへの移動を開始します。
 *
 * <DAE武器:[武器タイプID]>
 * 装備武器とは無関係に指定した武器タイプIDでスキルを実行します。
 * 武器タイプIDを指定しない（<DAE武器>）と装備武器で実行します。
 *
 * <DAEモーション:[モーション名称]>
 * スキル実行時のモーションを指定したものに変更します。
 * モーション名称は以下の通りです。(「[SV]戦闘キャラ」に準拠)
 *
 * walk     歩行
 * wait     待機
 * chant    詠唱
 * guard    防御
 * damage   ダメージ
 * evade    回避
 * thrust   攻撃(突き)
 * swing    攻撃(振り)
 * missile  攻撃(飛び道具)
 * skill    スキル
 * spell    魔法
 * item     アイテム
 * escape   逃走
 * victory  勝利
 * dying    瀕死
 * abnormal 状態異常
 * sleep    睡眠
 * dead     戦闘不能
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
    var pluginName    = 'DirectlyAttackEffect';
    var metaTagPrefix = 'DAE';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        if (values[0] === '') values = [];
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgArrayEval = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = eval(values[i]).clamp(min, max);
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramAltitude         = getParamNumber(['Altitude', '高度'], 0);
    var paramDuration         = getParamNumber(['Duration', 'フレーム数'], 1);
    var paramValidActor       = getParamBoolean(['ValidActor', 'アクターに適用']);
    var paramValidEnemy       = getParamBoolean(['ValidEnemy', '敵キャラに適用']);
    var paramNoAfterimage     = getParamBoolean(['NoAfterimage', '残像不使用']);
    var paramAlwaysAfterimage = getParamBoolean(['AlwaysAfterimage', '常時残像使用']);

    //=============================================================================
    // Game_Battler
    //  対象に接近する演出をリクエストします。
    //=============================================================================
    var _Game_Battler_initMembers      = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.apply(this, arguments);
        this.initDirectlyAttack();
    };

    Game_Battler.prototype.initDirectlyAttack = function() {
        this._directlyAttackInfo     = null;
        this._directlyReturnInfo     = null;
        this._directlyAdditionalInfo = null;
    };

    Game_Battler.prototype.setDirectlyAttack = function(target, action) {
        var attackArgs = getMetaValues(action.item(), ['Attack', '攻撃']);
        if (attackArgs) {
            this._directlyAttackInfo = this.makeDirectlyInfo(target, getArgArrayNumber(attackArgs));
        } else {
            this._directlyAttackInfo = null;
        }
        var returnArgs = getMetaValues(action.item(), ['Return', '帰投']);
        if (returnArgs) {
            this._directlyReturnInfo = this.makeDirectlyInfo(target, getArgArrayNumber(returnArgs));
        } else {
            this._directlyReturnInfo = this._directlyAttackInfo;
        }
        this.setDirectlyAttackAdditionalInfo(action.item());
    };

    Game_Battler.prototype.setDirectlyAttackAdditionalInfo = function(item) {
        var info   = {};
        var hidden = getMetaValues(item, ['姿隠し', 'Hidden']);
        if (hidden) info.hidden = true;
        var afterimage = getMetaValues(item, ['残像', 'Afterimage']);
        if (afterimage) info.afterimage = true;
        var absPos = getMetaValues(item, ['絶対位置', 'AbsolutePos']);
        if (absPos) info.absolutePosition = getArgArrayEval(absPos);
        var relPos = getMetaValues(item, ['相対位置', 'RelativePos']);
        if (relPos) info.relativePosition = getArgArrayEval(relPos);
        var selfRelPos = getMetaValues(item, ['自己相対位置', 'SelfRelativePos']);
        if (selfRelPos) info.selfRelativePosition = getArgArrayEval(selfRelPos);
        var telPos = getMetaValues(item, ['瞬間移動', 'Teleport']);
        if (telPos) info.teleportPosition = getArgArrayEval(telPos);
        var noReturn = getMetaValues(item, ['帰投なし', 'NoReturn']);
        if (noReturn) info.noReturn = true;
        var subjectAnimationId = getMetaValues(item, ['アニメ', 'Animation']);
        if (subjectAnimationId) info.subjectAnimationId = getArgNumber(subjectAnimationId, 1);
        var targetAnimationId = getMetaValues(item, ['対象者アニメ', 'TargetAnimation']);
        if (targetAnimationId) info.targetAnimationId = getArgNumber(targetAnimationId, 1);
        var actorOnly = getMetaValues(item, ['アクターのみ', 'ActorOnly']);
        if (actorOnly) info.actorOnly = true;
        var enemyOnly = getMetaValues(item, ['敵キャラのみ', 'EnemyOnly']);
        if (enemyOnly) info.enemyOnly = true;
        this._directlyAdditionalInfo = info;
    };

    Game_Battler.prototype.makeDirectlyInfo = function(target, args) {
        var directlyAttack        = {};
        directlyAttack.target     = target;
        directlyAttack.duration   = args[0] !== undefined ? args[0] : paramDuration;
        directlyAttack.altitude   = args[1] !== undefined ? args[1] : paramAltitude;
        directlyAttack.z          = args[2] !== undefined ? args[2] : 0;
        directlyAttack.moveCenter = !!args[3];
        return directlyAttack;
    };

    Game_Battler.prototype.getDirectoryAttack = function() {
        return this._directlyAttackInfo;
    };

    Game_Battler.prototype.getDirectoryReturn = function() {
        return this._directlyReturnInfo;
    };

    Game_Battler.prototype.getDirectoryAddition = function() {
        return this._directlyAdditionalInfo;
    };

    Game_Battler.prototype.hasDirectoryAttack = function() {
        return !!this._directlyAttackInfo;
    };

    var _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        _Game_Battler_performActionStart.apply(this, arguments);
        if (this.hasDirectoryAttack()) {
            this._directlyAttack = true;
        }
    };

    var _Game_Battler_performActionEnd      = Game_Battler.prototype.performActionEnd;
    Game_Battler.prototype.performActionEnd = function() {
        _Game_Battler_performActionEnd.apply(this, arguments);
        if (this.hasDirectoryAttack()) {
            this._directlyReturn = true;
        }
    };

    Game_Battler.prototype.isDirectlyAttackRequested = function() {
        return this._directlyAttack;
    };

    Game_Battler.prototype.isDirectlyReturnRequested = function() {
        return this._directlyReturn;
    };

    Game_Battler.prototype.resetDirectlyAttackRequest = function() {
        this._directlyAttack = false;
    };

    Game_Battler.prototype.resetDirectlyReturnRequest = function() {
        this._directlyReturn = false;
    };

    //=============================================================================
    // Game_Actor
    //  攻撃モーションをスキルごとに設定します。
    //=============================================================================
    Game_Actor.prototype.hasDirectoryAttack = function() {
        var info = this._directlyAdditionalInfo;
        return Game_Battler.prototype.hasDirectoryAttack.apply(this, arguments) &&
            ((!info.enemyOnly && paramValidActor) || info.actorOnly);
    };

    var _Game_Actor_performAction      = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        if (paramValidActor) {
            var customMotion = getMetaValues(action.item(), ['モーション', 'Motion']);
            if (customMotion) {
                this.requestMotion(getArgString(customMotion).toLowerCase());
                return;
            }
            var attackMotion = getMetaValues(action.item(), ['武器', 'Weapon']);
            if (attackMotion) {
                if (attackMotion !== true) {
                    this._motionWeapon = {wtypeId: getArgNumber(attackMotion)};
                }
                this.performAttack();
                this._motionWeapon = null;
                return;
            }
        }
        _Game_Actor_performAction.apply(this, arguments);
    };

    var _Game_Actor_weapons      = Game_Actor.prototype.weapons;
    Game_Actor.prototype.weapons = function() {
        if (this._motionWeapon) {
            return [this._motionWeapon];
        } else {
            return _Game_Actor_weapons.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Enemy
    //  直接攻撃演出の可否を判定します。
    //=============================================================================
    Game_Enemy.prototype.hasDirectoryAttack = function() {
        var info = this._directlyAdditionalInfo;
        return Game_Battler.prototype.hasDirectoryAttack.apply(this, arguments) &&
            ((!info.actorOnly && paramValidEnemy) || info.enemyOnly);
    };

    //=============================================================================
    // BattleManager
    //  戦闘終了後に直接攻撃用の参照を破棄します。
    //=============================================================================
    var _BattleManager_endAction = BattleManager.endBattle;
    BattleManager.endBattle      = function(result) {
        _BattleManager_endAction.apply(this, arguments);
        $gameParty.battleMembers().forEach(function(member) {
            member.initDirectlyAttack();
        });
    };

    //=============================================================================
    // Window_BattleLog
    //  ターゲットへの直接攻撃演出を追加定義します。
    //=============================================================================
    var _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        var waiting = false;
        switch (this._waitMode) {
            case 'animation':
                waiting = this._spriteset.isAnimationPlaying();
                break;
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };

    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode('animation');
    };

    var _Window_BattleLog_startAction      = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        var target = (targets[0] && subject.opponentsUnit() !== targets[0].opponentsUnit() ? targets[0] : null);
        subject.setDirectlyAttack(target, action);
        this.startActionAnimation(subject, targets);
        _Window_BattleLog_startAction.apply(this, arguments);
    };

    Window_BattleLog.prototype.startActionAnimation = function(subject, targets) {
        var attackInfo = subject.getDirectoryAddition();
        if (!attackInfo) return;
        if (attackInfo.subjectAnimationId > 0) {
            this.push('showAnimation', subject, [subject], attackInfo.subjectAnimationId);
            this.push('waitForAnimation');
        }
        if (attackInfo.targetAnimationId > 0) {
            this.push('showAnimation', subject, targets, attackInfo.targetAnimationId);
            this.push('waitForAnimation');
        }
    };

    var _Window_BattleLog_performActionStart      = Window_BattleLog.prototype.performActionStart;
    Window_BattleLog.prototype.performActionStart = function(subject, action) {
        _Window_BattleLog_performActionStart.apply(this, arguments);
        this.push('waitForMovement');
    };

    var _Window_BattleLog_performActionEnd      = Window_BattleLog.prototype.performActionEnd;
    Window_BattleLog.prototype.performActionEnd = function(subject) {
        _Window_BattleLog_performActionEnd.apply(this, arguments);
        this.push('waitForMovement');
    };

    //=============================================================================
    // Sprite_Battler
    //  ターゲットへの直接攻撃演出を追加定義します。
    //=============================================================================
    Sprite_Battler.prototype.isAfterImage = function() {
        return false;
    };

    Sprite_Battler.prototype.createAfterimageSprites = function() {
        if (paramNoAfterimage) return;
        var numbers = this.getAfterimageNumbers();
        for (var i = 0; i < numbers; i++) {
            this.createAfterimageSprite(i);
        }
    };

    Sprite_Battler.prototype.setSpriteSet = function(spriteSet) {
        this._spriteSet = spriteSet;
    };

    Sprite_Battler.prototype.createAfterimageSprite = function(index) {
        var sprite = this.getObjectSpriteAfterimage();
        sprite.setAfterimageIndex(index);
        sprite.visible = false;
        sprite.setOriginalSprite(this);
        this._afterimageSprites.push(sprite);
        this.parent.addChildAt(sprite, this.parent.getChildIndex(this) - index);
    };

    Sprite_Battler.prototype.getObjectSpriteAfterimage = function() {
        return this instanceof Sprite_Actor ? new Sprite_AfterimageActor(this._battler) :
            new Sprite_AfterimageEnemy(this._battler);
    };

    var _Sprite_Battler_initMembers      = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._attackX                  = 0;
        this._attackY                  = 0;
        this._attackZ                  = 0;
        this._afterimageSprites        = [];
        this._afterimageLocus          = [];
        this._afterimageViaibleCounter = 0;
        this.setVisibleAfterImage(false);
    };

    Sprite_Battler.prototype.setVisibleAfterImage = function(value) {
        this._visibleAfterimage = value || paramAlwaysAfterimage;
    };

    var _Sprite_Battler_setBattler      = Sprite_Battler.prototype.setBattler;
    Sprite_Battler.prototype.setBattler = function(battler) {
        if (!this.isAfterImage()) {
            _Sprite_Battler_setBattler.apply(this, arguments);
        } else {
            this._battler = battler;
        }
        this._afterimageSprites.forEach(function(sprite) {
            sprite.setBattler(battler);
        });
    };

    var _Sprite_Battler_update      = Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update = function() {
        _Sprite_Battler_update.apply(this, arguments);
        if (this._battler) {
            this.updateDirectly();
        }
    };

    Sprite_Battler.prototype.setPriorityMostFront = function() {
        if (!this.isAfterImage()) {
            this._afterimageSprites.forEach(function(sprite) {
                sprite.setPriorityMostFront();
            });
        }
        var frontIndex = this.parent.children.length - 1;
        this.parent.children.some(function(sprite, index) {
            if (sprite instanceof Sprite_Damage || sprite instanceof Sprite_Animation) {
                frontIndex = index - 1;
                return true;
            }
            return false;
        });
        this.parent.setChildIndex(this, frontIndex);
    };

    Sprite_Battler.prototype.updateDirectly = function() {
        if (this._battler.isDirectlyAttackRequested()) {
            this._battler.resetDirectlyAttackRequest();
            this._targetSprite     = this.getActionTargetSprite();
            var attackInfo         = this._battler.getDirectoryAttack();
            this._attackMoveCenter = attackInfo.moveCenter;
            var position           = this.getDirectoryPosition();
            this.startAttackMotion(position.x, position.y, attackInfo, false);
        }
        if (this._battler.isDirectlyReturnRequested()) {
            this._battler.resetDirectlyReturnRequest();
            var returnInfo = this._battler.getDirectoryReturn();
            if (!this._noReturn) {
                this.startReturnMotion(returnInfo);
            }
            this._noReturn = false;
        }
    };

    Sprite_Battler.prototype.getDirectoryPosition = function() {
        var target = this._targetSprite;
        var x      = (target ? target.x - this.getNoAttackX() + this.getDirectoryPositionShiftX() : 0);
        var y      = (target ? target.y - this.getNoAttackY() + this.getDirectoryPositionShiftY() : 0);
        return {x: x, y: y};
    };

    Sprite_Battler.prototype.getDirectoryPositionShiftX = function() {
        return 0;
    };

    Sprite_Battler.prototype.getDirectoryPositionShiftY = function() {
        return 0;
    };

    Sprite_Battler.prototype.getBattler = function() {
        return this._battler;
    };

    Sprite_Battler.prototype.getActionTargetSprite = function() {
        var spriteSet = this.parent.parent.parent;
        return spriteSet.getBattlerSprite(this._battler.getDirectoryAttack().target);
    };

    Sprite_Battler.prototype.startAttackMotion = function(x, y, attackInfo, returnFlg) {
        if (this.isPlayingAttackMotion()) return;
        var additionalInfo = this._battler.getDirectoryAddition();
        if (!returnFlg) {
            var newPos          = this.shiftAttackMotion(x, y, additionalInfo);
            this._targetAttackX = newPos.x;
            this._targetAttackY = newPos.y;
        } else {
            this._targetAttackX = x;
            this._targetAttackY = y;
        }
        this._targetAttackZ      = attackInfo.z;
        this._attackDuration     = attackInfo.duration;
        this._attackDurationTime = this._attackDuration;
        this._attackAltitude     = attackInfo.altitude;
        this._noReturn           = additionalInfo.noReturn;
        this._originalOpacity    = (additionalInfo.hidden ? this.opacity : null);
        if (attackInfo.duration === 0) {
            this._attackX = this._targetAttackX;
            this._attackY = this._targetAttackY;
            this._attackZ = this._targetAttackZ;
        } else {
            this.setPriorityMostFront();
            if (additionalInfo.afterimage && !paramNoAfterimage) {
                this.setVisibleAfterImage(true);
            }
        }
    };

    Sprite_Battler.prototype.shiftAttackMotion = function(x, y, additionalInfo) {
        var absPos = additionalInfo.absolutePosition;
        if (absPos) {
            x = this.getEnemyReverseX(absPos[0] || 0) - this.getNoAttackX();
            y = (absPos[1] || 0) - this.getNoAttackY();
        }
        var selfRelPos = additionalInfo.selfRelativePosition;
        if (selfRelPos) {
            x = (selfRelPos[0] || 0) * (this.isEnemySprite() ? -1 : 1);
            y = (selfRelPos[1] || 0);
        }
        var relPos = additionalInfo.relativePosition;
        if (relPos) {
            x = relPos[0] ? x + relPos[0] * (this.isEnemySprite() ? -1 : 1) : x;
            y = relPos[1] ? y + relPos[1] : y;
        }
        var telPos = additionalInfo.teleportPosition;
        if (telPos) {
            this._attackX = this.getEnemyReverseX(absPos[0] || 0) - this.getNoAttackX();
            this._attackY = (absPos[1] || 0) - this.getNoAttackY();
        }
        return {x: x, y: y};
    };

    Sprite_Battler.prototype.startReturnMotion = function(returnInfo) {
        this.startAttackMotion(0, 0, returnInfo, true);
    };

    var _Sprite_Battler_updateMove      = Sprite_Battler.prototype.updateMove;
    Sprite_Battler.prototype.updateMove = function() {
        _Sprite_Battler_updateMove.apply(this, arguments);
        this.updateAttackMotion();
    };

    Sprite_Battler.prototype.updateAttackMotion = function() {
        if (this._attackDuration > 0) {
            var d         = this._attackDuration;
            this._attackX = (this._attackX * (d - 1) + this._targetAttackX) / d;
            this._attackY = (this._attackY * (d - 1) + this._targetAttackY) / d;
            this._attackZ = (this._attackZ * (d - 1) + this._targetAttackZ) / d;
            this._attackDuration--;
            if (this.isAttackMotionHidden()) this.getMainSprite().opacity = this.getAttackMotionOpacity();
            if (this._attackDuration === 0) {
                this.onMoveEnd();
                if (this._attackX === 0 && this._attackY === 0) {
                    this._spriteSet.resetBattlerOrder();
                }
                this._attackEndFrame = Graphics.frameCount;
                this.setVisibleAfterImage(false);
            }
        }
    };

    Sprite_Battler.prototype.getAttackMotionOpacity = function() {
        var t = this._attackDurationTime;
        var d = this._attackDuration;
        return this._originalOpacity * Math.pow(this.getDaTimeLine(d, t), 4);
    };

    var _Sprite_Battler_updatePosition      = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        this.x += this._attackX;
        this.y += this._attackY - this.getAttackAltitude();
        if (this.isVisibleAfterimage()) {
            this.updateAfterimages();
        } else if (this._afterimageLocus.length > 0) {
            this._afterimageLocus = [];
        }
    };

    Sprite_Battler.prototype.updateAfterimages = function() {
        this._afterimageLocus.unshift([this.getRealX(), this.getRealY()]);
        var interval = this.getAfterimageInterval();
        var numbers  = this.getAfterimageNumbers();
        var counter  = this._afterimageViaibleCounter;
        if (this._afterimageLocus.length % interval === 0 && counter < numbers && this._visibleAfterimage) {
            this._afterimageSprites[counter].visible = true;
            this._afterimageViaibleCounter++;
        }
        for (var i = 0; i < this._afterimageSprites.length; i++) {
            this.updateAfterimage(this._afterimageSprites[i]);
        }
        if (this._afterimageLocus.length > interval * numbers) {
            this._afterimageLocus.pop();
        }
    };

    Sprite_Battler.prototype.getRealX = function() {
        return this.x;
    };

    Sprite_Battler.prototype.getRealY = function() {
        return this.y;
    };

    Sprite_Battler.prototype.updateAfterimage = function(afterimage) {
        if (!afterimage.visible) return;
        var afterimageIndex = afterimage.getAfterimageIndex();
        var interval        = this.getAfterimageInterval();
        var frameDelay      = Math.min(afterimageIndex * interval, this._afterimageLocus.length - 1);
        var x               = this._afterimageLocus[frameDelay][0];
        var y               = this._afterimageLocus[frameDelay][1];
        if (!this._visibleAfterimage && Graphics.frameCount - this._attackEndFrame > frameDelay && afterimage.visible) {
            afterimage.visible = false;
            this._afterimageViaibleCounter--;
        }
        afterimage.move(x, y);
    };

    Sprite_Battler.prototype.getAfterimageInterval = function() {
        return this._attackDurationTime > 60 ? 4 : 2;
    };

    Sprite_Battler.prototype.getAfterimageNumbers = function() {
        return this._attackDurationTime > 60 ? 6 : 8;
    };

    Sprite_Battler.prototype.isVisibleAfterimage = function() {
        return !this.isAfterImage() && (this._visibleAfterimage || this._afterimageViaibleCounter > 0) &&
            this._afterimageSprites.length > 0;
    };

    Sprite_Battler.prototype.getAttackAltitude = function() {
        var t = this._attackDurationTime;
        var d = this._attackDuration;
        return (this.isPlayingAttackMotion() ? this._calcAltitude(1, t) - this._calcAltitude(d, t) : 0) + this._attackZ;
    };

    Sprite_Battler.prototype._calcAltitude = function(d, t) {
        var altitude = Math.floor(Math.pow(this.getDaTimeLine(d, t) * this._attackAltitude, 2));
        if (this._attackAltitude < 0) altitude *= -1;
        return altitude;
    };

    Sprite_Battler.prototype.getDaTimeLine = function(d, t) {
        return ((d - (t / 2)) / (t / 2));
    };

    var _Sprite_Battler_isMoving      = Sprite_Battler.prototype.isMoving;
    Sprite_Battler.prototype.isMoving = function() {
        return _Sprite_Battler_isMoving.apply(this, arguments) || this.isPlayingAttackMotion();
    };

    Sprite_Battler.prototype.isPlayingAttackMotion = function() {
        return this._attackDuration > 0;
    };

    Sprite_Battler.prototype.isAttackMotionHidden = function() {
        return !!this._originalOpacity;
    };

    Sprite_Battler.prototype.isEnemySprite = function() {
        return this._battler.isEnemy();
    };

    Sprite_Battler.prototype.getNoAttackX = function() {
        return this.x - this._attackX;
    };

    Sprite_Battler.prototype.getNoAttackY = function() {
        return this.y - this._attackY + this._attackZ;
    };

    Sprite_Battler.prototype.getEnemyReverseX = function(x) {
        return x;
    };

    Sprite_Battler.prototype.moveForward = function() {

    };

    //=============================================================================
    // Sprite_Actor
    //  ターゲットへの直接攻撃演出を追加定義します。
    //=============================================================================
    var _Sprite_Actor_updatePosition      = Sprite_Actor.prototype.hasOwnProperty('updatePosition') ?
        Sprite_Actor.prototype.updatePosition : null;
    Sprite_Actor.prototype.updatePosition = function() {
        if (_Sprite_Actor_updatePosition) {
            _Sprite_Actor_updatePosition.apply(this, arguments);
        } else {
            Sprite_Battler.prototype.updatePosition.call(this);
        }
        var altitude = this.getAttackAltitude();
        if (altitude >= 0) {
            this._shadowSprite.y       = this.getAttackAltitude();
            this._shadowSprite.opacity = 255 - this._shadowSprite.y / 2;
        }
    };

    Sprite_Actor.prototype.getDirectoryPositionShiftX = function() {
        if (this._attackMoveCenter) {
            return Sprite_Battler.prototype.getDirectoryPositionShiftX.apply(this, arguments);
        }
        var targetSprite = this._targetSprite;
        return this.anchor.x * this.width + (1 - targetSprite.anchor.x) * targetSprite.width + 16;
    };

    var _Sprite_Actor_stepForward      = Sprite_Actor.prototype.stepForward;
    Sprite_Actor.prototype.stepForward = function() {
        if (this._battler.hasDirectoryAttack()) return;
        _Sprite_Actor_stepForward.apply(this, arguments);
    };

    Sprite_Actor.prototype.getRealX = function() {
        return Sprite_Battler.prototype.getRealX.apply(this, arguments) + this._mainSprite.x;
    };

    Sprite_Actor.prototype.getRealY = function() {
        return Sprite_Battler.prototype.getRealY.apply(this, arguments) + this._mainSprite.y * this.scale.y;
    };

    Sprite_Actor.prototype.getMainSprite = function() {
        return this._mainSprite;
    };

    //=============================================================================
    // Sprite_Enemy
    //  ターゲットへの直接攻撃演出を追加定義します。
    //=============================================================================
    Sprite_Enemy.prototype.getDirectoryPositionShiftX = function() {
        if (this._attackMoveCenter) {
            return Sprite_Battler.prototype.getDirectoryPositionShiftX.apply(this, arguments);
        }
        var targetSprite = this._targetSprite;
        return -((1 - this.anchor.x) * this.width + targetSprite.anchor.x * targetSprite.width + 16);
    };

    Sprite_Enemy.prototype.getEnemyReverseX = function(x) {
        return Graphics.width - Sprite_Battler.prototype.getEnemyReverseX.apply(this, arguments);
    };

    Sprite_Enemy.prototype.getMainSprite = function() {
        return this;
    };

    //=============================================================================
    // Sprite_AfterimageActor
    //  アクターの残像クラス
    //=============================================================================
    function Sprite_AfterimageActor() {
        this.initialize.apply(this, arguments);
    }

    Sprite_AfterimageActor.prototype             = Object.create(Sprite_Actor.prototype);
    Sprite_AfterimageActor.prototype.constructor = Sprite_AfterimageActor;

    Sprite_AfterimageActor.prototype.updateMotion   = function() {};
    Sprite_AfterimageActor.prototype.updatePosition = function() {};

    Sprite_AfterimageActor.prototype.setBattler = function(battler) {
        Sprite_Actor.prototype.setBattler.apply(this, arguments);
    };

    Sprite_AfterimageActor.prototype.createShadowSprite = function() {
        this._shadowSprite = new Sprite_Dummy();
    };

    Sprite_AfterimageActor.prototype.createStateSprite = function() {
        this._stateSprite     = new Sprite_Dummy();
        this._stateIconSprite = new Sprite_Dummy();
    };

    Sprite_AfterimageActor.prototype.createWeaponSprite = function() {
        this._weaponSprite = new Sprite_Dummy();
    };

    Sprite_AfterimageActor.prototype.setAfterimageIndex = function(index) {
        this._afterimageIndex = index;
        var numbers           = this.getAfterimageNumbers();
        this._opacityRate     = (numbers - index) / numbers;
    };

    Sprite_AfterimageActor.prototype.getAfterimageIndex = function() {
        return this._afterimageIndex;
    };

    Sprite_AfterimageActor.prototype.update = function() {
        if (this._battler) {
            this.updateMain();
            this.updateProperty();
        } else {
            this.bitmap = null;
        }
    };

    Sprite_AfterimageActor.prototype.updateProperty = function() {
        if (paramAlwaysAfterimage) {
            this.visible = (this.x !== this._originalSprite.getRealX() || this.y !== this._originalSprite.getRealY());
        }
        if (!this.visible) return;
        this.scale.x   = this._originalSprite.scale.x;
        this.scale.y   = this._originalSprite.scale.y;
        this.opacity   = this._originalMainSprite.opacity * this._opacityRate;
        this.blendMode = this._originalMainSprite.blendMode;
        this.setColorTone(this._originalMainSprite.getColorTone());
        this.setBlendColor(this._originalMainSprite.getBlendColor());
    };

    Sprite_AfterimageActor.prototype.setOriginalSprite = function(originalSprite) {
        this._originalSprite     = originalSprite;
        this._originalMainSprite = originalSprite.getMainSprite();
    };

    Sprite_AfterimageActor.prototype.isAfterImage = function() {
        return true;
    };

    //=============================================================================
    // Sprite_AfterimageEnemy
    //  敵キャラの残像クラス
    //=============================================================================
    function Sprite_AfterimageEnemy() {
        this.initialize.apply(this, arguments);
    }

    Sprite_AfterimageEnemy.prototype             = Object.create(Sprite_Enemy.prototype);
    Sprite_AfterimageEnemy.prototype.constructor = Sprite_AfterimageEnemy;

    Sprite_AfterimageEnemy.prototype.updatePosition = function() {};

    Sprite_AfterimageEnemy.prototype.createStateIconSprite = function() {
        this._stateIconSprite = new Sprite_Dummy();
    };

    Sprite_AfterimageEnemy.prototype.isAfterImage = function() {
        return true;
    };

    Sprite_AfterimageEnemy.prototype.update             = Sprite_AfterimageActor.prototype.update;
    Sprite_AfterimageEnemy.prototype.updateProperty     = Sprite_AfterimageActor.prototype.updateProperty;
    Sprite_AfterimageEnemy.prototype.setOriginalSprite  = Sprite_AfterimageActor.prototype.setOriginalSprite;
    Sprite_AfterimageEnemy.prototype.setAfterimageIndex = Sprite_AfterimageActor.prototype.setAfterimageIndex;
    Sprite_AfterimageEnemy.prototype.getAfterimageIndex = Sprite_AfterimageActor.prototype.getAfterimageIndex;

    //=============================================================================
    // Sprite_Dummy
    //  ダミースプライト
    //=============================================================================
    function Sprite_Dummy() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Dummy.prototype.initialize = function() {};

    Sprite_Dummy.prototype.constructor = Sprite_Dummy;

    Sprite_Dummy.prototype.setup = function() {};

    //=============================================================================
    // Spriteset_Battle
    //  バトラースプライトを取得可能にします。
    //=============================================================================
    Spriteset_Battle.prototype.getBattlerSprite = function(battler) {
        if (!battler) return null;
        var sprites = (battler.isActor() ? this._actorSprites : this._enemySprites);
        return sprites.filter(function(sprite) {
            return sprite.getBattler() === battler;
        })[0];
    };

    var _Spriteset_Battle_createEnemies      = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        _Spriteset_Battle_createEnemies.apply(this, arguments);
        this.iterateEnemySprites(this.createBattlerAfterimage.bind(this));
    };

    var _Spriteset_Battle_createActors      = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.apply(this, arguments);
        this.iterateActorSprites(this.createBattlerAfterimage.bind(this));
    };

    Spriteset_Battle.prototype.createBattlerAfterimage = function(sprite) {
        sprite.createAfterimageSprites();
        sprite.setSpriteSet(this);
    };

    Spriteset_Battle.prototype.resetBattlerOrder = function() {
        this.iterateActorSprites(this.setBattlerPriorityMostFront);
        this.iterateEnemySprites(this.setBattlerPriorityMostFront);
    };

    Spriteset_Battle.prototype.setBattlerPriorityMostFront = function(sprite, playingOnly) {
        if (!playingOnly || sprite.isPlayingAttackMotion()) sprite.setPriorityMostFront();
    };

    var _Spriteset_Battle_updateZCoordinates      = Spriteset_Battle.prototype.updateZCoordinates;
    Spriteset_Battle.prototype.updateZCoordinates = function() {
        _Spriteset_Battle_updateZCoordinates.apply(this, arguments);
        this.iterateEnemySprites(this.setBattlerPriorityMostFront, true);
        this.iterateActorSprites(this.setBattlerPriorityMostFront, true);
    };

    Spriteset_Battle.prototype.iterateActorSprites = function(callBack, extend) {
        this.iterateBattlerSprites(this._actorSprites, callBack, extend);
    };

    Spriteset_Battle.prototype.iterateEnemySprites = function(callBack, extend) {
        this.iterateBattlerSprites(this._enemySprites, callBack, extend);
    };

    Spriteset_Battle.prototype.iterateBattlerSprites = function(sprites, callBack, extend) {
        for (var i = 0, n = sprites.length; i < n; i++) {
            callBack.call(this, sprites[i], extend);
        }
    };
})();

