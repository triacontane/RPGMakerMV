/*=============================================================================
 FrameImage.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/10/10 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc フレーム画像プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FrameImage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param frameImage
 * @text フレーム画像
 * @desc ゲーム中常に表示される画像を指定します。systemフォルダから選択します。
 * @default
 * @dir img/system
 * @type file
 * @default
 *
 * @help FrameImage.js
 *
 * ゲーム中、常に画面の最前面に表示される画像を指定できます。
 * ただし、画面のフェードアウト中は表示されません。
 * 原則として画面サイズと同一の大きさの画像を指定します。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const frameImage = param.frameImage;
    if (!frameImage) {
        return;
    }

    const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.apply(this, arguments);
        ImageManager.loadSystem(frameImage);
    };

    const _Scene_Base_create = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.apply(this, arguments);
        this.createFrameImage();
    };

    Scene_Base.prototype.createFrameImage = function() {
        this._frameSprite = new Sprite();
        this._frameSprite.bitmap = ImageManager.loadSystem(frameImage);
    };

    Scene_Boot.prototype.createFrameImage = function() {

    };

    Scene_Splash.prototype.createFrameImage = function() {
        if (this.isEnabled()) {
            Scene_Base.prototype.createFrameImage.apply(this, arguments);
        }
    };

    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        if (this._frameSprite) {
            this.addChild(this._frameSprite);
        }
    };
})();
