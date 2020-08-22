//=============================================================================
// WindowBackImage.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2020/08/22 カスタムメニュープラグインで作成したウィンドウ背景を変えられる機能を追加
// 2.0.0 2020/08/13 MZ対応版作成
// 1.3.0 2019/01/13 ウィンドウ背景の画像を複数表示できる機能を追加
//                  ウィンドウ背景を指定した場合も元のウィンドウフレームを表示したままにできる機能を追加
// 1.2.0 2018/11/29 ウィンドウ背景を有効にするかどうかを動的に制御するスイッチを追加
// 1.1.0 2017/11/19 拡大率を設定できる機能を追加
// 1.0.0 2017/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ウィンドウ背景画像指定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowBackImage.js
 * @author トリアコンタン
 *
 * @param windowImageInfo
 * @text ウィンドウ画像情報
 * @desc 背景画像を差し替えるウィンドウの情報です。
 * @default
 * @type struct<WindowImages>[]
 *
 * @help WindowBackImage.js
 *
 * ウィンドウの背景を任意の画像に置き換えます。
 * 画像は複数指定可能で、それぞれに出現条件スイッチを指定できます。
 * 画像が表示された場合、元のウィンドウフレームを非表示するかどうかを
 * 選択できます。
 *
 * 背景画像はウィンドウのサイズにかかわらず、中央を原点に表示されます。
 * 拡大率と座標を補正することは可能ですがサイズが可変、不定のウィンドウに
 * 対して背景画像を指定することは推奨しません。
 *
 * プラグインによって追加されたウィンドウにも指定可能ですが
 * 正常に動作するとは限りません。
 *
 * SceneCustomMenu.jsで追加したウィンドウの背景を変えたい場合は
 * WindowClassの指定を同プラグインの『ウィンドウ識別子』を指定してください。
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
 * @desc 差し替える画像のファイル名です。(img/pictureの中から選択します)　空を指定すると枠だけが非表示になります。
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
 *
 * @param ScaleX
 * @desc X方向の拡大率(%指定)です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleY
 * @desc Y方向の拡大率(%指定)です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param WindowShow
 * @desc 画像が表示されているときでもウィンドウの元背景を表示したままにします。
 * @default false
 * @type boolean
 *
 * @param SwitchId
 * @desc 指定したスイッチがONのときのみウィンドウを差し替えます。
 * @default 0
 * @type switch
 */

(function() {
    'use strict';

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('WindowBackImage');
    if (!param.windowImageInfo) {
        param.windowImageInfo = [];
    }

    //=============================================================================
    // Window
    //  専用の背景画像を設定します。
    //=============================================================================
    var _Window__createAllParts      = Window.prototype._createAllParts;
    Window.prototype._createAllParts = function() {
        _Window__createAllParts.apply(this, arguments);
        this._backImageDataList = this.initBackImageData();
        if (this._backImageDataList.length >= 0) {
            this._createBackImage();
        }
    };

    Window.prototype._setBackImageProperty = function(backImageData) {
        this._backImageDx        = parseInt(backImageData['OffsetX']) || 0;
        this._backImageDy        = parseInt(backImageData['OffsetY']) || 0;
        this._backSprite.scale.x = (parseInt(backImageData['ScaleX']) || 100) / 100;
        this._backSprite.scale.y = (parseInt(backImageData['ScaleY']) || 100) / 100;
    };

    /**
     * 背景画像を作成します。
     * @private
     */
    Window.prototype._createBackImage = function() {
        this._backSprite.visible  = false;
        this._frameSprite.visible = false;
        this.frameVisible = false;
        this._windowBackImageSprites    = [];
        this._backImageDataList.forEach(function(backImageData) {
            var bitmap     = ImageManager.loadPicture(backImageData['ImageFile']);
            var sprite     = new Sprite_WindowBackImage(bitmap);
            sprite.scale.x = (backImageData['ScaleX'] || 100) / 100;
            sprite.scale.y = (backImageData['ScaleY'] || 100) / 100;
            this._windowBackImageSprites.push(sprite);
            this._container.addChild(sprite);
        }, this);
    };

    Window.prototype.initBackImageData = function() {
        var className = getClassName(this);
        // for SceneCustomMenu.js
        if (this._data && this._data.Id) {
            className = this._data.Id;
        }
        return param.windowImageInfo.filter(function(data) {
            return data['WindowClass'] === className;
        }, this);
    };

    Window.prototype.getBackImageDataItem = function(index, propName) {
        return this._backImageDataList[index][propName];
    };

    var _Window__refreshAllParts      = Window.prototype._refreshAllParts;
    Window.prototype._refreshAllParts = function() {
        if (this._windowBackImageSprites) {
            this._refreshBackImage();
        }
        _Window__refreshAllParts.apply(this, arguments);
    };

    /**
     * 背景画像をリフレッシュします。
     * @private
     */
    Window.prototype._refreshBackImage = function() {
        this._windowBackImageSprites.forEach(function(sprite, index) {
            sprite.x = this.width / 2 + this.getBackImageDataItem(index, 'OffsetX');
            sprite.y = this.height / 2 + this.getBackImageDataItem(index, 'OffsetY');
        }, this);
    };

    var _Window_update      = Window.prototype.update;
    Window.prototype.update = function() {
        _Window_update.apply(this, arguments);
        if (!this._windowBackImageSprites) {
            return;
        }
        var defaultVisible = true;
        this._windowBackImageSprites.forEach(function(sprite, index) {
            var switchId = this.getBackImageDataItem(index, 'SwitchId');
            sprite.visible = !switchId || $gameSwitches.value(switchId);
            if (sprite.visible && !this.getBackImageDataItem(index, 'WindowShow')) {
                defaultVisible = false;
            }
        }, this);
        this._backSprite.visible  = defaultVisible;
        this._frameSprite.visible = defaultVisible;
        this.frameVisible = defaultVisible;
    };

    //=============================================================================
    // Sprite_WindowBackImage
    //  ウィンドウ背景画像のスプライトです。
    //=============================================================================
    function Sprite_WindowBackImage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_WindowBackImage.prototype             = Object.create(Sprite.prototype);
    Sprite_WindowBackImage.prototype.constructor = Sprite_WindowBackImage;

    Sprite_WindowBackImage.prototype.initialize = function(bitmap) {
        Sprite.prototype.initialize.call(this);
        this.bitmap   = bitmap;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };
})();

