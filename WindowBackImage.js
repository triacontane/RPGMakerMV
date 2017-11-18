//=============================================================================
// WindowBackImage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ウィンドウ背景画像指定プラグイン
 * @author トリアコンタン
 *
 * @param ウィンドウ画像情報
 * @desc 背景画像を差し替えるウィンドウの情報です。
 * @default
 * @type struct<WindowImages>[]
 *
 * @help WindowBackImage.js
 *
 * ウィンドウの背景を任意の画像に置き換えます。
 * 画像が指定された場合、元のウィンドウフレームは非表示になります。
 *
 * 背景画像はウィンドウのサイズにかかわらず、中央を原点に等倍表示されます。
 * よってサイズが可変、不定のウィンドウに対して背景画像を指定することは
 * 推奨しません。
 *
 * プラグインによって追加されたウィンドウにも指定可能ですが
 * 正常に動作するとは限りません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~WindowImages:
 *
 * @param WindowClass
 * @desc 専用の画像に差し替える対象のウィンドウです。一覧にない場合は直接入力してください。
 * @type select
 * @default
 * @option [ゲーム全般]ヘルプウィンドウ
 * @value Window_Help
 * @option [ゲーム全般]お金ウィンドウ
 * @value Window_Gold
 * @option [メインメニュー]メインコマンドウィンドウ
 * @value Window_MenuCommand
 * @option [メインメニュー]アクターステータスウィンドウ
 * @value Window_MenuStatus
 * @option [アイテム画面]アイテムカテゴリウィンドウ
 * @value Window_ItemCategory
 * @option [アイテム画面]アイテムリストウィンドウ
 * @value Window_ItemList
 * @option [アイテム画面]アクター選択ウィンドウ
 * @value Window_MenuActor
 * @option [スキル画面]スキルタイプウィンドウ
 * @value Window_SkillType
 * @option [スキル画面]ステータスウィンドウ
 * @value Window_SkillStatus
 * @option [スキル画面]スキルリストウィンドウ
 * @value Window_SkillList
 * @option [装備画面]ステータスウィンドウ
 * @value Window_EquipStatus
 * @option [装備画面]装備コマンドウィンドウ
 * @value Window_EquipCommand
 * @option [装備画面]装備スロットウィンドウ
 * @value Window_EquipSlot
 * @option [装備画面]装備リストウィンドウ
 * @value Window_EquipItem
 * @option [ステータス画面]ステータスウィンドウ
 * @value Window_Status
 * @option [オプション画面]オプションウィンドウ
 * @value Window_Options
 * @option [セーブ、ロード画面]ファイルリストウィンドウ
 * @value Window_SavefileList
 * @option [ショップ画面]ショップコマンドウィンドウ
 * @value Window_ShopCommand
 * @option [ショップ画面]購入アイテムウィンドウ
 * @value Window_ShopBuy
 * @option [ショップ画面]売却アイテムウィンドウ
 * @value Window_ShopSell
 * @option [ショップ画面]数値入力ウィンドウ
 * @value Window_ShopNumber
 * @option [ショップ画面]ステータスウィンドウ
 * @value Window_ShopStatus
 * @option [名前入力画面]名前ウィンドウ
 * @value Window_NameEdit
 * @option [名前入力画面]名前入力ウィンドウ
 * @value Window_NameInput
 * @option [マップ画面]選択肢ウィンドウ
 * @value Window_ChoiceList
 * @option [マップ画面]数値入力ウィンドウ
 * @value Window_NumberInput
 * @option [マップ画面]アイテム選択ウィンドウ
 * @value Window_EventItem
 * @option [マップ画面]メッセージウィンドウ
 * @value Window_Message
 * @option [マップ画面]スクロールメッセージウィンドウ
 * @value Window_ScrollText
 * @option [マップ画面]マップ名ウィンドウ
 * @value Window_MapName
 * @option [戦闘画面]バトルログウィンドウ
 * @value Window_BattleLog
 * @option [戦闘画面]パーティコマンドウィンドウ
 * @value Window_PartyCommand
 * @option [戦闘画面]アクターコマンドウィンドウ
 * @value Window_ActorCommand
 * @option [戦闘画面]アクター一覧ウィンドウ
 * @value Window_BattleActor
 * @option [戦闘画面]敵キャラ一覧ウィンドウ
 * @value Window_BattleEnemy
 * @option [戦闘画面]スキル一覧ウィンドウ
 * @value Window_BattleSkill
 * @option [戦闘画面]アイテム一覧ウィンドウ
 * @value Window_BattleItem
 * @option [タイトル画面]タイトルウィンドウ
 * @value Window_TitleCommand
 * @option [ゲーム終了画面]終了確認ウィンドウ
 * @value Window_GameEnd
 * @option [デバッグ画面]変数選択ウィンドウ
 * @value Window_DebugRange
 * @option [デバッグ画面]変数設定ウィンドウ
 * @value Window_DebugEdit
 * @option [行動目標ウィンドウプラグイン]行動目標ウィンドウ
 * @value Window_Destination
 * @option [行動目標ウィンドウプラグイン]メニュー行動目標ウィンドウ
 * @value Window_DestinationMenu
 * @option [ゲーム内時間の導入プラグイン]時間ウィンドウ
 * @value Window_Chronus
 * @option [公式ガチャプラグイン]ガチャ表示ウィンドウ
 * @value Window_Gacha
 * @option [公式ガチャプラグイン]コマンドウィンドウ
 * @value Window_GachaCommand
 * @option [公式ガチャプラグイン]入手確認ウィンドウ
 * @value Window_GachaGetCommand
 * @option [公式ガチャプラグイン]入手情報ウィンドウ
 * @value Window_GachaGet
 * @option [公式ガチャプラグイン]コストウィンドウ
 * @value Window_Cost
 * @option [ノベルゲーム総合プラグイン]ノベル選択肢ウィンドウ
 * @value Window_NovelChoiceList
 * @option [ノベルゲーム総合プラグイン]ノベルメッセージウィンドウ
 * @value Window_NovelMessage
 * @option [ノベルゲーム総合プラグイン]ノベルタイトルコマンドウィンドウ
 * @value Window_NovelTitleCommand
 * @option [ノベルゲーム総合プラグイン]ノベル数値入力ウィンドウ
 * @value Window_NovelNumberInput
 * @option [ノベルゲーム総合プラグイン]ポーズメニューウィンドウ
 * @value Window_PauseMenu
 * @option [クロスセーブプラグイン]パスワード入力ウィンドウ
 * @value Window_PasswordInput
 * @option [クロスセーブプラグイン]パスワードウィンドウ
 * @value Window_PasswordEdit
 * @option [用語辞典プラグイン]用語カテゴリウィンドウ
 * @value Window_GlossaryCategory
 * @option [用語辞典プラグイン]用語リストウィンドウ
 * @value Window_GlossaryList
 * @option [用語辞典プラグイン]使用確認ウィンドウ
 * @value Window_GlossaryConfirm
 * @option [用語辞典プラグイン]収集率ウィンドウ
 * @value Window_GlossaryComplete
 * @option [用語辞典プラグイン]用語ウィンドウ
 * @value Window_Glossary
 * @option [サウンドテストプラグイン]オーディオカテゴリウィンドウ
 * @value Window_AudioCategory
 * @option [サウンドテストプラグイン]オーディオリストウィンドウ
 * @value Window_AudioList
 * @option [サウンドテストプラグイン]オーディオ設定ウィンドウ
 * @value Window_AudioSetting
 * @option [数値入力画面プラグイン]数値入力ウィンドウ
 * @value Window_NumberInput
 * @option [数値入力画面プラグイン]数値ウィンドウ
 * @value Window_NumberEdit
 *
 * @param ImageFile
 * @desc 差し替える画像のファイル名です。(img/pictureの中から選択します)
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param OffsetX
 * @desc 表示X座標の補正値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param OffsetY
 * @desc 表示Y座標の補正値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 */

(function() {
    'use strict';
    var pluginName    = 'WindowBackImage';

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
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamArrayJson = function(paramNames, defaultValue) {
        var value = getParamString(paramNames) || null;
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            } else {
                value = value.map(function(valueData) {
                    return JSON.parse(valueData);
                });
            }
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:.js\nName:[]\nValue:`);
            value = defaultValue;
        }
        return value;
    };

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param             = {};
    param.windowImageInfo = getParamArrayJson(['WindowImageInfo', 'ウィンドウ画像情報'], []);

    //=============================================================================
    // Window
    //  専用の背景画像を設定します。
    //=============================================================================
    var _Window__createAllParts = Window.prototype._createAllParts;
    Window.prototype._createAllParts = function() {
        _Window__createAllParts.apply(this, arguments);
        var backImageData = this.getBackImageData();
        if (backImageData) {
            this._backImageDx = parseInt(backImageData['OffsetX']) || 0;
            this._backImageDy = parseInt(backImageData['OffsetY']) || 0;
            this._createBackImage(backImageData['ImageFile']);
        }
    };

    /**
     * 背景画像を作成します。
     * @param fileName 背景画像のファイル名
     * @private
     */
    Window.prototype._createBackImage = function(fileName) {
        this._windowBackSprite.visible = false;
        this._windowFrameSprite.visible = false;
        var bitmap = ImageManager.loadPicture(fileName);
        this._windowBackImageSprite = new Sprite_WindowBackImage(bitmap);
        this._windowSpriteContainer.addChild(this._windowBackImageSprite);
    };

    Window.prototype.getBackImageData = function() {
        var className = getClassName(this);
        return param.windowImageInfo.filter(function(data) {
            return data['WindowClass'] === className;
        }, this)[0];
    };

    var _Window__refreshAllParts = Window.prototype._refreshAllParts;
    Window.prototype._refreshAllParts = function() {
        if (this._windowBackImageSprite) {
            this._refreshBackImage();
        }
        _Window__refreshAllParts.apply(this, arguments);
    };

    /**
     * 背景画像をリフレッシュします。
     * @private
     */
    Window.prototype._refreshBackImage = function() {
        this._windowBackImageSprite.x = this.width / 2 + this._backImageDx;
        this._windowBackImageSprite.y = this.height / 2 + this._backImageDy;
    };

    //=============================================================================
    // Sprite_WindowBackImage
    //  ウィンドウ背景画像のスプライトです。
    //=============================================================================
    function Sprite_WindowBackImage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_WindowBackImage.prototype = Object.create(Sprite.prototype);
    Sprite_WindowBackImage.prototype.constructor = Sprite_WindowBackImage;

    Sprite_WindowBackImage.prototype.initialize = function(bitmap) {
        Sprite.prototype.initialize.call(this);
        this.bitmap = bitmap;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };
})();

