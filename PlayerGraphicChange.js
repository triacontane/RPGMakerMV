//=============================================================================
// PlayerGraphicChange.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/05/05 MZ版を作成
// 1.0.0 2016/11/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc プレイヤーの画像変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerGraphicChange.js
 * @author トリアコンタン
 *
 * @command RESET
 * @text プレイヤー画像リセット
 * @desc 変更したプレイヤー画像を元に戻します。
 *
 * @help PlayerGraphicChange.js
 *
 * プレイヤー画像をアクターとは無関係に設定できるようになります。
 *
 * プレイヤーに対して一度でも「移動ルートの指定」から「画像の変更」を
 * 行うと、その変更が場所移動やセーブなどを行った後も継続するようになります。
 *
 * 変更したグラフィックを元に戻す場合は、プラグインコマンドを実行してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    PluginManager.registerCommand('PlayerGraphicChange', 'RESET', args => {
        $gamePlayer.resetCustomizeGraphic();
    });

    //=============================================================================
    // Game_Player
    //  プレイヤーに対するグラフィック変更処理を永続化します。
    //=============================================================================
    const _Game_Player_refresh = Game_Player.prototype.refresh;
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

