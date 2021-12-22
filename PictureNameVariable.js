/*=============================================================================
 PictureNameVariable.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/12/22 制御文字で指定した変数が変更された場合、ピクチャを再読み込みする機能を追加
 1.0.0 2021/06/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ピクチャ名の変数設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureNameDynamic.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_PICTURE_NAME
 * @text ピクチャ名設定
 * @desc ピクチャの表示で使用するファイル名をあらかじめ設定できます。
 *
 * @arg name
 * @text ピクチャ名
 * @desc ピクチャの表示で使用するファイル名を指定します。拡張子不要。制御文字\v[n]を使用できます。
 * @default
 * @type multiline_string
 *
 * @arg scriptUse
 * @text スクリプトとして評価
 * @desc ファイル名を直接指定するのではなく、スクリプトとして評価した結果をファイル名とします。上級者向け。
 * @default false
 * @type boolean
 *
 * @arg realTime
 * @text リアルタイム変更
 * @desc 制御文字で指定した変数が変更されたらピクチャを再読込します。本機能は『スクリプトとして評価』とは両立できません。
 * @default false
 * @type boolean
 *
 * @help PictureNameVariable.js
 *
 * イベントコマンド「ピクチャの表示」で使用するファイルをあらかじめ設定できます。
 * 制御文字\v[n]が使えるので、連番を含むファイル名など動的な指定が可能です。
 * プラグインコマンドを実行後、ピクチャの表示を行ってください。
 *
 * 本プラグインで使用したピクチャは「未使用ファイルを除外する」機能の
 * 対象になる可能性があります。ご注意ください。
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

    PluginManagerEx.registerCommand(script, 'SET_PICTURE_NAME', function (args) {
        if (args.realTime) {
            $gameScreen.reservePictureName(args.name, true);
        } else {
            const name = PluginManagerEx.convertEscapeCharacters(args.name);
            $gameScreen.reservePictureName(args.scriptUse ? eval(name) : name);
        }
    });

    Game_Screen.prototype.reservePictureName = function(name, realTime = false) {
        this._reservePictureName = name;
        this._realTimePictureName = realTime;
    };

    const _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(
        pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
    ) {
        if (this._reservePictureName) {
            arguments[1] = this._reservePictureName;
            this._reservePictureName = null;
        }
        _Game_Screen_showPicture.apply(this, arguments);
        const picture = this._pictures[this.realPictureId(pictureId)];
        if (this._realTimePictureName) {
            picture.setRealTimeName();
            this._realTimePictureName = false;
        }
    };

    Game_Picture.prototype.setRealTimeName = function() {
        this._realTimeName = true;
        this._originalName = this._name;
    };

    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        _Game_Picture_show.apply(this, arguments);
        this._realTimeName = false;
        this._originalName = '';
    }

    const _Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.apply(this, arguments);
        if (this._realTimeName) {
            this.updateName();
        }
    };

    Game_Picture.prototype.updateName = function() {
        this._name = PluginManagerEx.convertEscapeCharacters(this._originalName);
    };
})();
