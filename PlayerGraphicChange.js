//=============================================================================
// PlayerGraphicChange.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/11/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PlayerGraphicChangePlugin
 * @author triacontane
 *
 * @help プレイヤー画像をアクターとは無関係に設定できるようになります。
 *
 * プレイヤーに対して一度でも「移動ルートの指定」から「画像の変更」を
 * 行うと、その変更が場所移動やセーブなどを行った後も継続するようになります。
 *
 * 変更したグラフィックを元に戻す場合は、イベントコマンドの「スクリプト」から
 * 以下のスクリプトを実行してください。
 *
 * $gamePlayer.resetCustomizeGraphic();
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc プレイヤーの画像変更プラグイン
 * @author トリアコンタン
 *
 * @help プレイヤー画像をアクターとは無関係に設定できるようになります。
 *
 * プレイヤーに対して一度でも「移動ルートの指定」から「画像の変更」を
 * 行うと、その変更が場所移動やセーブなどを行った後も継続するようになります。
 *
 * 変更したグラフィックを元に戻す場合は、イベントコマンドの「スクリプト」から
 * 以下のスクリプトを実行してください。
 *
 * $gamePlayer.resetCustomizeGraphic();
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    //=============================================================================
    // Game_Player
    //  プレイヤーに対するグラフィック変更処理を永続化します。
    //=============================================================================
    var _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        this._refreshing = true;
        _Game_Player_refresh.apply(this, arguments);
        this._refreshing = false;
    };

    Game_Player.prototype.setImage = function(characterName, characterIndex) {
        if (!this._refreshing) {
            this._customized = true;
        }
        if (this._refreshing && this._customized) return;
        Game_CharacterBase.prototype.setImage.apply(this, arguments);
    };

    Game_Player.prototype.resetCustomizeGraphic = function() {
        this._customized = false;
        this.refresh();
    };
})();

