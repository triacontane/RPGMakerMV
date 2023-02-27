//=============================================================================
// EnemyPicture.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2023/02/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 敵キャラのピクチャ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FacePicture.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_ENEMY_PICTURE
 * @text 敵キャラピクチャ指定
 * @desc 指定した敵キャラのグラフィックをピクチャ表示します。
 *
 * @arg enemyId
 * @text 敵キャラID
 * @desc 指定したIDの敵キャラのグラフィックをピクチャ表示します。
 * @default 1
 * @type enemy
 *
 * @help FacePicture.js
 *
 * 敵キャラグラフィックをピクチャとして表示できます。
 * プラグインコマンドから敵キャラIDを指定後
 * ピクチャの表示を空ファイルで表示すると対応するフェイスグラフィックが
 * ピクチャとして表示されます。
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

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SET_ENEMY_PICTURE', args => {
        $gameScreen.setEnemyPicture(args.enemyId);
    });

    //=============================================================================
    // Game_Screen
    //  事前設定ピクチャ名を保持します。
    //=============================================================================
    Game_Screen.prototype.setEnemyPicture = function(enemyId) {
        this._enemyPicture = enemyId;
    };

    Game_Screen.prototype.getEnemyPicture = function() {
        const picture = this._enemyPicture;
        this._enemyPicture = null;
        return picture;
    };

    //=============================================================================
    // Game_Picture
    //  事前設定ピクチャ名を取得します。
    //=============================================================================
    const _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        this._enemyId = null;
        if (!name) {
            const enemyId = $gameScreen.getEnemyPicture();
            if (enemyId) {
                this._enemyId = enemyId;
                arguments[0] = `ENEMY[${enemyId}]`;
            }
        }
        _Game_Picture_show.apply(this, arguments);
    };

    Game_Picture.prototype.enemyId = function() {
        return this._enemyId;
    };

    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        const picture = this.picture();
        if (picture && picture.enemyId()) {
            const data = $dataEnemies[picture.enemyId()];
            if (data) {
                this.bitmap = ImageManager.loadEnemy(data.battlerName);
                this.setHue(data.battlerHue);
            }
        } else {
            this.setHue(0);
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };
})();
