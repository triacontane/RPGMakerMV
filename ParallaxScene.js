/*=============================================================================
 ParallaxScene.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/11/24 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 既存シーンの遠景設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallaxScene.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param SceneList
 * @text 遠景設定シーンリスト
 * @desc 遠景を表示するシーンの設定リストです。
 * @default []
 * @type struct<Parallax>[]
 *
 * @help ParallaxScene.js
 *
 * メニュー系の既存シーンにマップ画面のような遠景を表示する機能を追加します。
 * スクロール設定もできます。
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

/*~struct~Parallax:ja
 *
 * @param SceneName
 * @text 対象シーン
 * @desc 遠景画像を表示するシーン名です。
 * @type select
 * @option メインメニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_End
 * @option ショップ
 * @value Scene_Shop
 * @option 名前入力
 * @value Scene_Name
 * @option デバッグ
 * @value Scene_Debug
 * @option サウンドテスト
 * @value Scene_SoundTest
 * @option 用語辞典
 * @value Scene_Glossary
 *
 * @param FileName
 * @text ファイル名
 * @desc 表示する遠景のファイル名です。
 * @default
 * @dir img/parallaxes/
 * @type file
 *
 * @param ScrollX
 * @text スクロールX
 * @desc 背景画像の横方向のスクロール速度です。
 * @default 0
 * @type number
 *
 * @param ScrollY
 * @text スクロールY
 * @desc 背景画像の縦方向のスクロール速度です。
 * @default 0
 * @type number
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Scene_MenuBase.prototype.findParallaxData = function() {
        const sceneName = PluginManagerEx.findClassName(this);
        return param.SceneList.find(data => data.SceneName === sceneName);
    };

    Scene_MenuBase.prototype.createParallax = function() {
        const data = this.findParallaxData();
        if (!data) {
            return;
        }
        this._pararallaxData = data;
        const name = data.FileName;
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._parallax.bitmap = ImageManager.loadParallax(name);
        this.addChild(this._parallax);
    };

    const _Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
    Scene_MenuBase.prototype.createBackground = function() {
        _Scene_MenuBase_createBackground.apply(this, arguments);
        this.createParallax();
    };

    const _Scene_MenuBase_update = Scene_MenuBase.prototype.update;
    Scene_MenuBase.prototype.update = function() {
        _Scene_MenuBase_update.apply(this, arguments);
        if (this._parallax) {
            this.updateParallax();
        }
    };

    Scene_MenuBase.prototype.updateParallax = function() {
        const data = this._pararallaxData;
        this._parallax.origin.x += data.ScrollX || 0;
        this._parallax.origin.y += data.ScrollY || 0;
    };
})();
