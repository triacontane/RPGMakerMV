/*=============================================================================
 ReflectionAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2024/04/20 反射された側にアニメーションを表示しない設定を追加
 1.1.3 2020/05/24 反射したときのステータスウィンドウへのダメージ反映を、反射エフェクト後に変更
 1.1.2 2020/05/24 魔法攻撃扱いの通常攻撃を反射するとエラーになる問題を修正
 1.1.1 2020/05/24 ヘルプとコードを微修正
 1.1.0 2020/05/24 反射された側にアニメーションを表示する機能を追加
 1.0.0 2020/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 反射アニメーションプラグイン
 * @author トリアコンタン
 *
 * @param animationId
 * @text アニメーション番号
 * @desc 反射時に再生するアニメーションです。
 * @default 0
 * @type animation
 *
 * @param wait
 * @text 完了までウェイト
 * @desc 反射アニメーションが完了するまで待機します。
 * @default true
 * @type boolean
 *
 * @param noAttackAnimation
 * @text 攻撃アニメは表示しない
 * @desc 反射された側に攻撃アニメーションを表示しません。
 * @default false
 * @type boolean
 *
 * @help ReflectionAnimation.js
 *
 * 魔法反射が発生した際に魔法反射用のアニメーションを再生します。
 * また、反射された側に攻撃アニメーションを表示します。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('ReflectionAnimation');

    /**
     * BattleManager
     * 魔法反射が有効だった場合のステータス反映を遅らせます。
     */
    var _BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
    BattleManager.invokeMagicReflection = function(subject, target) {
        _BattleManager_invokeMagicReflection.apply(this, arguments);
        this._refreshStatusCancel = true;
    };

    var _BattleManager_refreshStatus = BattleManager.refreshStatus;
    BattleManager.refreshStatus = function() {
        if (this._refreshStatusCancel) {
            this._refreshStatusCancel = false;
            return;
        }
        _BattleManager_refreshStatus.apply(this, arguments);
    };

    /**
     * Window_BattleLog
     * 反射時のアニメーションを再生します。
     */
    var _Window_BattleLog_displayReflection = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        if (param.animationId > 0) {
            var method = param.wait ? 'showAnimationAndWait' : 'showAnimation';
            this.push(method, this._relectionTarget, [target], param.animationId);
        }
        _Window_BattleLog_displayReflection.apply(this, arguments);
        if (!param.noAttackAnimation) {
            this.push('showAnimationAndWait', target, [this._relectionTarget], this._relectionItem.animationId);
        }
        this.push('requestRefreshStatus');
    };

    Window_BattleLog.prototype.requestRefreshStatus = function() {
        BattleManager.refreshStatus();
    };

    Window_BattleLog.prototype.showAnimationAndWait = function(subject, targets, animationId) {
        this.showAnimation(subject, targets, animationId);
        var animation = $dataAnimations[animationId];
        if (animation) {
            // 再生レートを変更している場合、ここを変更する。(変更後の再生レートを動的かつ安全に取得することは困難)
            this._waitCount = animation.frames.length * 4;
        }
    };

    var _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        this._relectionItem = action.item();
        this._relectionTarget = subject;
        _Window_BattleLog_startAction.apply(this, arguments);
    };
})();
