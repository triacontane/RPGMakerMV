//=============================================================================
// BugFixChromeForEach.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/08/05 対応範囲の拡大
// 1.0.1 2017/07/31 適用バージョンが60固定になっていたので6Xに変更
// 1.0.0 2017/07/31 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixChromeForEachPlugin
 * @author triacontane
 *
 * @help In Chrome version 60 or later, we will tentatively deal with
 * the problem where battle may be forcibly terminated.
 *
 * The root cause is that if the element of the target array is deleted
 * in the course of forEach iteration,
 * (Undefined) value outside the range of the array may be passed.
 * Since it is unknown why values outside the range are passed,
 * this is an interim measure.
 *
 * Version
 * Google Chrome 60.0.3112.78
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc Chrome60の戦闘クラッシュ防止プラグイン
 * @author トリアコンタン
 *
 * @help  BugFixChromeForEach.js
 *
 * Chromeのバージョン60以降で、戦闘が強制終了する場合がある問題に暫定対処します。
 *
 * 根本原因は、forEachの繰り返し途中で、対象配列の要素が削除された場合に、
 * 配列の範囲外(長さを上回るindex)の値（undefined）が渡されることがあるためです。
 * 範囲外の値が渡されるのはChromeのバグの可能性が高いためこちらは暫定対策となります。
 *
 * エラー発生時は以下のメッセージが出力されます。
 * Cannot read property 'update' of undefined
 *
 * 発生を確認したバージョン
 * Google Chrome 60.0.3112.78
 * Google Chrome 60.0.3112.90
 *
 * このプラグインはコアスクリプトを上書きしている箇所が多いので
 * プラグイン管理画面で極力、上の方に配置してください。
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
    var pluginName = 'BugFixCrashForChrome60';

    if (!navigator.userAgent.match(/Chrome\/6/) && !Utils.isOptionValid('test')) {
        console.log('**********\n' + pluginName + ' is unnecessary in the current execution environment.\n**********\n');
        return;
    }

    Sprite.prototype.update = function() {
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
    };

    Scene_Base.prototype.updateChildren = function() {
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
    };

    TilingSprite.prototype.update = function() {
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
    };

    Tilemap.prototype.update = function() {
        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
        for (var i=0; i<this.bitmaps.length;i++) {
            if (this.bitmaps[i]) {
                this.bitmaps[i].touch();
            }
        }
    };

    Window.prototype.update = function() {
        if (this.active) {
            this._animationCount++;
        }
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
    };

    WindowLayer.prototype.update = function() {
        this.children.forEach(function(child) {
            if (child && child.update) {
                child.update();
            }
        });
    };
})();

