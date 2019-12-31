/*=============================================================================
 ApngPicture.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.1 2019/12/31 シーン追加画像でgifが表示されない問題を修正
 1.2.0 2019/12/31 APNGのみツクール本体の暗号化機能に対応
 1.1.0 2019/12/29 シーン追加画像の表示優先度を設定できる機能を追加
 1.0.0 2019/12/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ApngSupportPlugin
 * @author triacontane
 *
 * @param PictureList
 * @desc List of picture images to be handled as APNG.
 * @default []
 * @require 1
 * @dir img/pictures/
 * @type file[]
 *
 * @param EnemyList
 * @desc List of enemy images to be handled as APNG.
 * @default []
 * @require 1
 * @dir img/enemies/
 * @type file[]
 *
 * @param SceneApngList
 * @desc This is a list of APNG to be displayed for each scene.
 * @default []
 * @type struct<SceneApngRecord>[]
 *
 * @help ApngPicture.js
 * APNG or GIF is treated as a picture and animated on the screen.
 * From the parameters, select the file in which the APNG picture file is registered.
 * It will be animated if it is displayed in "Display Picture".
 *
 * The following libraries are required for use.
 * https://github.com/sbfkcel/pixi-apngAndGif
 *
 * Download the target file and import it from the plugin management screen.
 * https://github.com/sbfkcel/pixi-apngAndGif/blob/master/dist/PixiApngAndGif.js
 *
 * In addition, the color tone change of the picture is not reflected.
 * Also, extensions by other plug-ins may not work.
 *
 * In addition, APNG registered from parameters can be additionally displayed for each scene.
 * Display can be controlled by switch.
 *
 * There is also a function to display APNG on the enemy character image, but this function
 * The image is incomplete because no flash is performed.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc APNGピクチャプラグイン
 * @author トリアコンタン
 *
 * @param PictureList
 * @text APNGのピクチャリスト
 * @desc APNGとして扱うピクチャ画像のリストです。GIFを指定したい場合は拡張子付きで直接入力してください。
 * @default []
 * @require 1
 * @dir img/pictures/
 * @type file[]
 *
 * @param EnemyList
 * @text APNGの敵キャラリスト
 * @desc APNGとして扱う敵キャラ画像のリストです。GIFを指定したい場合は拡張子付きで直接入力してください。この機能は不完全です。
 * @default []
 * @require 1
 * @dir img/enemies/
 * @type file[]
 *
 * @param SceneApngList
 * @text シーンAPNGのリスト
 * @desc シーンごとに表示するAPNGのリストです。GIFを指定したい場合は拡張子付きで直接入力してください。
 * @default []
 * @type struct<SceneApngRecord>[]
 *
 * @help ApngPicture.js
 * APNG、もしくはGIFアニメをピクチャとして画面上にアニメ表示します。
 * パラメータからAPNGのピクチャとして登録したファイルを
 * 「ピクチャの表示」で表示すればアニメーションされます。
 *
 * 使用には以下のライブラリが必要です。
 * https://github.com/sbfkcel/pixi-apngAndGif
 *
 * 対象ファイルをダウンロードしてプラグイン管理画面から取り込んでください。
 * https://github.com/sbfkcel/pixi-apngAndGif/blob/master/dist/PixiApngAndGif.js
 *
 * なお、ピクチャの色調変更は反映されません。
 * また、他のプラグインによる拡張が機能しない場合があります。
 *
 * さらに、各シーンでパラメータから登録したAPNGを追加表示できます。
 * スイッチによる表示制御が可能です。
 *
 * 敵キャラ画像にAPNGを表示する機能もありますが、この機能は
 * 画像のフラッシュが一切行われないため不完全です。
 * また、画像サイズの大きいAPNGを読み込むと、表示が遅くなる場合があります。
 * 表示が遅い場合はGIFアニメもお試しください。
 *
 * GIFを使用したい場合、拡張子がgifのファイルはツクールMVで認識されないので
 * パラメータに拡張子付きのファイル名を直接入力してください。
 * また、ピクチャを表示するときはスクリプトから表示するか
 * 同名のダミーpngファイルを使って指定してください。
 * また、GIFはツクールMVの暗号化機能の対象外となります。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SceneApngRecord:
 *
 * @param SceneName
 * @text 対象シーン
 * @desc 画像を追加するシーンです。
 * @type select
 * @default Scene_Title
 * @option タイトル
 * @value Scene_Title
 * @option ゲームオーバー
 * @value Scene_Gameover
 * @option バトル
 * @value Scene_Battle
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
 * @desc 追加するAPNGのファイル名です。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param X
 * @text X座標
 * @desc 追加するAPNGのX座標です。
 * @default 0
 * @type number
 *
 * @param Y
 * @text Y座標
 * @desc 追加するAPNGのY座標です。
 * @default 0
 * @type number
 *
 * @param Origin
 * @text 原点
 * @desc 追加するAPNGの原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param Priority
 * @text 優先度
 * @desc 画像の表示優先度です。最背面は画面上に表示されないことが多いので通常の使用では推奨しません。
 * @default 0
 * @type select
 * @option 最前面
 * @value 0
 * @option ウィンドウの下
 * @value 1
 * @option 最背面
 * @value 2
 *
 * @param Switch
 * @text 出現条件スイッチ
 * @desc 指定したスイッチがONのときのみ表示されます。指定しない場合、常に表示されます。
 * @default 0
 * @type switch
 */

(function() {
    'use strict';

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param script currentScript
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(script) {
        var pluginName = script.src.replace(/^.*\/(.*).js$/, function() {
            return arguments[1];
        });
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

    var param = createPluginParameter(document.currentScript);

    /**
     * ApngLoader
     * APNGもしくはGIF画像を読み込んで保持します。
     */
    class ApngLoader {
        constructor(folder, paramList) {
            this._folder = folder;
            this._fileHash = {};
            this._paramList = paramList;
            if (this._paramList) {
                this.addAllImage();
            }
        }

        addAllImage() {
            var option = this.getLoadOption();
            this._paramList.forEach(function(item) {
                this.addImage(item, option);
            }, this);
        }

        addImage(item, option) {
            var name = item.FileName || item;
            var ext = Decrypter.hasEncryptedImages ? 'rpgmvp' : 'png';
            name = name.replace(/\.gif$/gi, function() {
                ext = 'gif';
                return '';
            });
            var path = name.match(/http:/) ? name : `img/${this._folder}/${name}.${ext}`;
            if (!this._fileHash.hasOwnProperty(name)) {
                this._fileHash[name] = ApngLoader.convertDecryptExt(path);
                PIXI.loader.add(path, option);
            }
        }

        getLoadOption() {
            return {
                loadType   : PIXI.loaders.Resource.LOAD_TYPE.XHR,
                xhrType    : PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
                crossOrigin: ''
            }
        }

        createSprite(name) {
            if (!this.isApng(name)) {
                return null;
            }
            var apng = new PixiApngAndGif(this._fileHash[name], ApngLoader._resource);
            return apng.sprite;
        }

        isApng(name) {
            return !!this._fileHash[name];
        }

        static loadResource() {
            PIXI.loader.load(function(progress, resource) {
                this._resource = resource;
                Object.keys(this._resource).forEach(function(key) {
                    if (this._resource[key].extension === 'rpgmvp') {
                        ApngLoader.decryptResource(key);
                    }
                }, this);
            }.bind(this));
        }

        static decryptResource(key) {
            var resource = this._resource[key];
            resource.data = Decrypter.decryptArrayBuffer(resource.data);
            var newKey = ApngLoader.convertDecryptExt(key);
            resource.name = newKey;
            resource.url = newKey;
            resource.extension = 'png';
            this._resource[newKey] = resource;
            delete this._resource[key];
        };

        static isReady() {
            return !!this._resource;
        }

        static convertDecryptExt(key) {
            return key.replace(/\.rpgmvp$/, '.png');
        }
    }
    ApngLoader._resource = null;

    var _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        var result = _Scene_Boot_isReady.apply(this, arguments);
        if (result) {
            SceneManager.setupApngLoaderIfNeed();
        }
        return result && ApngLoader.isReady();
    };

    var _Scene_Base_create = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.apply(this, arguments);
        this.createSceneApng();
    };

    Scene_Base.prototype.createSceneApng = function() {
        this._apngList = this.findSceneApngList().map(function(item) {
            return new SpriteSceneApng(item);
        }, this);
    };

    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        this.setApngPriority();
    };

    Scene_Base.prototype.setApngPriority = function() {
        var windowLayerIndex = this._windowLayer ? this.getChildIndex(this._windowLayer) : 0;
        this._apngList.forEach(function(sprite) {
            switch (sprite.getPriority()) {
                case 0:
                    this.addChild(sprite);
                    break;
                case 1:
                    this.addChildAt(sprite, windowLayerIndex);
                    windowLayerIndex++;
                    break;
                default:
                    this.addChildAt(sprite, 0);
            }
        }, this);
    };

    Scene_Base.prototype.findSceneApngList = function() {
        var currentSceneName = getClassName(this);
        return (param.SceneApngList || []).filter(function(data) {
            return data.SceneName === currentSceneName;
        }, this);
    };

    /**
     * SceneManager
     * APNGのローダを管理します。
     */
    SceneManager.setupApngLoaderIfNeed = function() {
        if (this._apngLoaderPicture) {
            return;
        }
        this._apngLoaderPicture = new ApngLoader('pictures', param.PictureList);
        this._apngLoaderEnemy = new ApngLoader('enemies', param.EnemyList);
        this._apngLoaderSystem = new ApngLoader('system', param.SceneApngList);
        ApngLoader.loadResource();
    };

    SceneManager.tryLoadApngPicture = function(name) {
        return this._apngLoaderPicture.createSprite(name);
    };

    SceneManager.tryLoadApngEnemy = function(name) {
        return this._apngLoaderEnemy.createSprite(name);
    };

    SceneManager.tryLoadApngSystem = function(name) {
        return this._apngLoaderSystem.createSprite(name);
    };

    /**
     * Sprite
     * APNGの読み込み処理を追加します。
     */
    Sprite.prototype.addApngChild = function(name) {
        if (this._apngSprite) {
            this.removeChild(this._apngSprite);
        }
        this._apngSprite = this.loadApngSprite(name);
        if (this._apngSprite) {
            this.addChild(this._apngSprite);
            this.bitmap = ImageManager.loadPicture('');
            this.updateApngAnchor();
            this.updateApngBlendMode();
        }
    };

    Sprite.prototype.loadApngSprite = function() {
        return null;
    };

    Sprite.prototype.updateApngAnchor = function() {
        if (this._apngSprite) {
            this._apngSprite.anchor.x = this.anchor.x;
            this._apngSprite.anchor.y = this.anchor.y;
        }
    };

    Sprite.prototype.updateApngBlendMode = function() {
        if (this._apngSprite) {
            this._apngSprite.blendMode = this.blendMode;
        }
    };

    /**
     * Sprite_Picture
     * APNGとして登録されているピクチャの読み込みを追加します。
     */
    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        _Sprite_Picture_loadBitmap.apply(this, arguments);
        this.addApngChild(this._pictureName);
    };

    Sprite_Picture.prototype.loadApngSprite = function(name) {
        return SceneManager.tryLoadApngPicture(name);
    };

    var _Sprite_Picture_updateOrigin = Sprite_Picture.prototype.updateOrigin;
    Sprite_Picture.prototype.updateOrigin = function() {
        _Sprite_Picture_updateOrigin.apply(this, arguments);
        this.updateApngAnchor();
    };

    var _Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;
    Sprite_Picture.prototype.updateOther = function() {
        _Sprite_Picture_updateOther.apply(this, arguments);
        this.updateApngBlendMode();
    };

    /**
     * Sprite_Enemy
     * APNGとして登録されている敵キャラの読み込みを追加します。
     */
    var _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function(name, hue) {
        _Sprite_Enemy_loadBitmap.apply(this, arguments);
        this.addApngChild(name);
    };

    Sprite_Enemy.prototype.loadApngSprite = function(name) {
        return SceneManager.tryLoadApngEnemy(name);
    };

    /**
     * SpriteSceneApng
     * シーンに追加表示するAPNGスプライトです。
     */
    class SpriteSceneApng extends Sprite {
       constructor(item) {
           super();
           this.setup(item)
       }

       setup(item) {
           this.addApngChild(item.FileName);
           this.x = item.X;
           this.y = item.Y;
           if (item.Origin === 1) {
               this.anchor.x = 0.5;
               this.anchor.y = 0.5;
           }
           this._switch = item.Switch;
           this._priority = item.Priority;
       }

       loadApngSprite(name) {
           return SceneManager.tryLoadApngSystem(name.replace(/\..*/, ''));
       }

       update() {
           this.visible = this.isValid();
       }

       isValid() {
           return !this._switch || $gameSwitches.value(this._switch);
       }

       getPriority() {
           return this._priority;
       }
   }
})();
