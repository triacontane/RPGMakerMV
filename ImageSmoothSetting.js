//=============================================================================
// ImageSmoothSetting.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/06/24 テキストなど動的画像のぼかし設定を追加
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ImageSmoothSettingPlugin
 * @author triacontane
 *
 * @param Animation
 * @desc アニメーション画像にぼかしをかけます。
 * @default ON
 *
 * @param BattleBack
 * @desc 戦闘背景画像(戦闘背景1、戦闘背景2)にぼかしをかけます。
 * @default ON
 *
 * @param Battler
 * @desc バトラー画像(アクター、敵キャラ)にぼかしをかけます。
 * @default ON
 *
 * @param Face
 * @desc フェイス画像にぼかしをかけます。
 * @default ON
 *
 * @param Parallax
 * @desc 遠景画像にぼかしをかけます。
 * @default ON
 *
 * @param Picture
 * @desc ピクチャ画像にぼかしをかけます。
 * @default ON
 *
 * @param Title
 * @desc タイトル画像(タイトル画像1、タイトル画像2)にぼかしをかけます。
 * @default ON
 *
 * @param Character
 * @desc キャラクター画像にぼかしをかけます。
 * @default OFF
 *
 * @param System
 * @desc システム画像にぼかしをかけます。
 * @default OFF
 *
 * @param Tileset
 * @desc タイルセット画像にぼかしをかけます。
 * @default OFF
 *
 * @param DynamicImage
 * @desc ウィンドウの文字など動的に作成した画像にぼかしをかけます。
 * @default OFF
 *
 * @help 画像を拡大したときに「ぼかし」処理を行うかどうかを
 * 画像種別ごとに設定できます。
 * 「ぼかし」処理を行わないとくっきり映りますが、ドットが見えます。
 *
 * Parallax Mappingなどで遠景やピクチャとキャラクターとの差が目立って
 * しまう場合などに設定を統一することで自然な表現になります。
 *
 * なお、拡大しない限り、ぼかし処理の有無は目視ではほとんど判別できません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画像ぼかし個別設定プラグイン
 * @author トリアコンタン
 *
 * @param アニメーション
 * @desc アニメーション画像にぼかしをかけます。
 * @default ON
 *
 * @param 戦闘背景
 * @desc 戦闘背景画像(戦闘背景1、戦闘背景2)にぼかしをかけます。
 * @default ON
 *
 * @param バトラー
 * @desc バトラー画像(アクター、敵キャラ)にぼかしをかけます。
 * @default ON
 *
 * @param フェイス
 * @desc フェイス画像にぼかしをかけます。
 * @default ON
 *
 * @param 遠景
 * @desc 遠景画像にぼかしをかけます。
 * @default ON
 *
 * @param ピクチャ
 * @desc ピクチャ画像にぼかしをかけます。
 * @default ON
 *
 * @param タイトル
 * @desc タイトル画像(タイトル画像1、タイトル画像2)にぼかしをかけます。
 * @default ON
 *
 * @param キャラクター
 * @desc キャラクター画像にぼかしをかけます。
 * @default OFF
 *
 * @param システム
 * @desc システム画像にぼかしをかけます。
 * @default OFF
 *
 * @param タイルセット
 * @desc タイルセット画像にぼかしをかけます。
 * @default OFF
 *
 * @param 動的画像
 * @desc ウィンドウの文字など動的に作成した画像にぼかしをかけます。
 * @default OFF
 *
 * @help 画像を拡大したときに「ぼかし」処理を行うかどうかを
 * 画像種別ごとに設定できます。
 * 「ぼかし」処理を行わないとくっきり映りますが、ドットが見えます。
 *
 * Parallax Mappingなどで遠景やピクチャとキャラクターとの差が目立って
 * しまう場合などに設定を統一することで自然な表現になります。
 *
 * なお、拡大しない限り、ぼかし処理の有無は目視ではほとんど判別できません。
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
    var pluginName = 'ImageSmoothSetting';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param          = {};
    param.tileset      = getParamBoolean(['Tileset', 'タイルセット']);
    param.system       = getParamBoolean(['System', 'システム']);
    param.character    = getParamBoolean(['Character', 'キャラクター']);
    param.title        = getParamBoolean(['Title', 'タイトル']);
    param.picture      = getParamBoolean(['Picture', 'ピクチャ']);
    param.parallax     = getParamBoolean(['Parallax', '遠景']);
    param.face         = getParamBoolean(['Face', 'フェイス']);
    param.battler      = getParamBoolean(['Battler', 'バトラー']);
    param.battleBack   = getParamBoolean(['BattleBack', '戦闘背景']);
    param.animation    = getParamBoolean(['Animation', 'アニメーション']);
    param.dynamicImage = getParamBoolean(['DynamicImage', '動的画像']);

    //=============================================================================
    // ImageManager
    //  画像種別ごとにぼかしを個別設定可能にします。
    //=============================================================================
    ImageManager._smoothMap = {
        'img/animations/'  : param.animation,
        'img/battlebacks1/': param.battleBack,
        'img/battlebacks2/': param.battleBack,
        'img/enemies/'     : param.battler,
        'img/characters/'  : param.character,
        'img/faces/'       : param.face,
        'img/parallaxes/'  : param.parallax,
        'img/pictures/'    : param.picture,
        'img/sv_actors/'   : param.battler,
        'img/sv_enemies/'  : param.battler,
        'img/system/'      : param.system,
        'img/tilesets/'    : param.tileset,
        'img/titles1/'     : param.title,
        'img/titles2/'     : param.title
    };

    var _ImageManager_loadBitmap = ImageManager.loadBitmap;
    ImageManager.loadBitmap      = function(folder, filename, hue, smooth) {
        if (this._smoothMap.hasOwnProperty(folder)) {
            arguments[3] = this._smoothMap[folder];
        }
        return _ImageManager_loadBitmap.apply(this, arguments);
    };

    //=============================================================================
    // Bitmap
    //  動的作成画像にぼかしを設定可能にします。
    //=============================================================================
    var _Bitmap_initialize      = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.apply(this, arguments);
        if (param.dynamicImage) {
            this.smooth = true;
        }
    };
})();

