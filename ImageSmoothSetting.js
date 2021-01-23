//=============================================================================
// ImageSmoothSetting.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/01/23 MZで動作するよう修正
// 1.1.0 2017/06/24 テキストなど動的画像のぼかし設定を追加
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc 画像ぼかし個別設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ImageSmoothSetting.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param BattleBack
 * @text 戦闘背景
 * @desc 戦闘背景画像(戦闘背景1、戦闘背景2)にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Battler
 * @text バトラー
 * @desc バトラー画像(アクター、敵キャラ)にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Face
 * @text フェイス
 * @desc フェイス画像にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Parallax
 * @text 遠景
 * @desc 遠景画像にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Picture
 * @text ピクチャ
 * @desc ピクチャ画像にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Title
 * @text タイトル
 * @desc タイトル画像(タイトル画像1、タイトル画像2)にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param Character
 * @text キャラクター
 * @desc キャラクター画像にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @param DynamicImage
 * @text 動的画像
 * @desc ウィンドウの文字など動的に作成した画像にぼかしをかけます。
 * @default true
 * @type boolean
 *
 * @help 画像を拡大したときに「ぼかし」(Scale Mode:LINEAR)を入れて
 * 表示するかどうかを画像種別ごとに設定できます。
 * 「ぼかし」処理を行わないとくっきり映りますが、ドットが見えます。
 *
 * RPGツクールMZのデフォルトでは全ての画像に「ぼかし」が入ります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ImageManager
    //  画像種別ごとにぼかしを個別設定可能にします。
    //=============================================================================
    ImageManager._smoothMap = {
        'img/battlebacks1/': param.BattleBack,
        'img/battlebacks2/': param.BattleBack,
        'img/enemies/'     : param.Battler,
        'img/characters/'  : param.Character,
        'img/faces/'       : param.Face,
        'img/parallaxes/'  : param.Parallax,
        'img/pictures/'    : param.Picture,
        'img/sv_actors/'   : param.Battler,
        'img/sv_enemies/'  : param.Battler,
        'img/titles1/'     : param.Title,
        'img/titles2/'     : param.Title
    };

    const _ImageManager_loadBitmap = ImageManager.loadBitmap;
    ImageManager.loadBitmap      = function(folder, filename) {
        const bitmap = _ImageManager_loadBitmap.apply(this, arguments);
        if (this._smoothMap.hasOwnProperty(folder)) {
            bitmap.smooth = this._smoothMap[folder];
        }
        return bitmap;
    };

    //=============================================================================
    // Bitmap
    //  動的作成画像にぼかしを設定可能にします。
    //=============================================================================
    const _Bitmap_initialize      = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.apply(this, arguments);
        this.smooth = param.DynamicImage;
    };
})();

