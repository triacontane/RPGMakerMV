/*=============================================================================
 ApngPicture.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.6.1 2020/11/03 プラグイン上でapng画像の高さを正しく取得できるよう修正
 1.6.0 2020/10/24 再生回数を指定したときに最初ではなく最後のフレームでアニメーションが止まる設定を追加
 1.5.0 2020/10/17 サイドビューの敵キャラをapng化できるよう修正。機能が不完全であることに変わりはありません。
 1.4.3 2020/03/17 ライブラリがpixi5.0対応によるバージョンアップで使用できなくなったのでヘルプの取得元を旧版に変更
 1.4.2 2020/03/07 キャッシュしない設定のapngを繰り返し表示、削除し続けるとメモリリークが発生する問題を修正
 1.4.1 2020/02/23 英語版のプラグインパラメータの記述が不足していたので修正
 1.4.0 2020/02/01 アニメーションのループ回数を指定できる機能を追加
 1.3.1 2019/12/31 画像を登録せずゲーム開始するとローディングが完了しない問題を修正
 1.3.0 2019/12/31 APNGのキャッシュ機能を追加
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
 * @type struct<PictureApngRecord>[]
 *
 * @param EnemyList
 * @desc List of enemy images to be handled as APNG.
 * @default []
 * @type struct<EnemyApngRecord>[]
 *
 * @param SideEnemyList
 * @desc List of enemy images to be handled as APNG.
 * @default []
 * @type struct<SideEnemyApngRecord>[]
 *
 * @param SceneApngList
 * @desc This is a list of APNG to be displayed for each scene.
 * @default []
 * @type struct<SceneApngRecord>[]
 *
 * @param DefaultLoopTimes
 * @desc The number of animation loops. It stops after looping the specified number of times.
 * @default 0
 * @type number
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
 * https://github.com/sbfkcel/pixi-apngAndGif/blob/fd2e0fb3274bf2c360c608b42e527889d10a6330/dist/PixiApngAndGif.js
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
 * @type struct<PictureApngRecord>[]
 *
 * @param EnemyList
 * @text APNGの敵キャラリスト
 * @desc APNGとして扱う敵キャラ画像のリストです。GIFを指定したい場合は拡張子付きで直接入力してください。この機能は不完全です。
 * @default []
 * @type struct<EnemyApngRecord>[]
 *
 * @param SideEnemyList
 * @text APNGのSV敵キャラリスト
 * @desc APNGとして扱うSV敵キャラ画像のリストです。サイドビューの画像を使用したい場合はこちらから登録してください。
 * @default []
 * @type struct<SideEnemyApngRecord>[]
 *
 * @param SceneApngList
 * @text シーンAPNGのリスト
 * @desc シーンごとに表示するAPNGのリストです。GIFを指定したい場合は拡張子付きで直接入力してください。
 * @default []
 * @type struct<SceneApngRecord>[]
 *
 * @param DefaultLoopTimes
 * @text デフォルトループ回数
 * @desc アニメーションのループ回数です。指定した回数分ループ再生すると止まります。0を指定すると無限にアニメーションします。
 * @default 0
 * @type number
 *
 * @param StopLastFrame
 * @text 最終フレームで止める
 * @desc ループ回数が決まっているアニメーションを再生したとき最初のフレームではなく最後のフレームでアニメーションが止まります。
 * @default false
 * @type boolean
 *
 * @help ApngPicture.js
 * APNG、もしくはGIFアニメをピクチャとして画面上にアニメ表示します。
 * パラメータからAPNGのピクチャとして登録したファイルを
 * 「ピクチャの表示」で表示すればアニメーションされます。
 *
 * 使用には以下のライブラリが必要です。
 * https://github.com/sbfkcel/pixi-apngAndGif
 *
 * ただし、ライブラリの最新版はpixi5.0に対応した結果、ツクールMV側の最新である4.0では
 * 再生できなくなりました。よって最新版ではなく、下記の旧版を使用する必要があります。
 *
 * 対象ファイルをダウンロードしてプラグイン管理画面から取り込んでください。
 * https://github.com/sbfkcel/pixi-apngAndGif/blob/fd2e0fb3274bf2c360c608b42e527889d10a6330/dist/PixiApngAndGif.js
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

/*~struct~SceneApngRecord:ja
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
 * @param CachePolicy
 * @text キャッシュ方針
 * @desc 画像のキャッシュ方針です。大量にキャッシュするとメモリ使用量に影響が出る場合があります。
 * @default 0
 * @type select
 * @option キャッシュしない
 * @value 0
 * @option 初回表示時にキャッシュ
 * @value 1
 * @option ゲーム起動時にキャッシュ
 * @value 2
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
 *
 * @param LoopTimes
 * @text ループ回数
 * @desc アニメーションのループ回数です。0を指定するとデフォルト設定に従います。
 * @default 0
 * @type number
 */

/*~struct~PictureApngRecord:ja
 *
 * @param FileName
 * @text ファイル名
 * @desc 追加するAPNGのファイル名です。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CachePolicy
 * @text キャッシュ方針
 * @desc 画像のキャッシュ方針です。大量にキャッシュするとメモリ使用量に影響が出る場合があります。
 * @default 0
 * @type select
 * @option キャッシュしない
 * @value 0
 * @option 初回表示時にキャッシュ
 * @value 1
 * @option ゲーム起動時にキャッシュ
 * @value 2
 *
 * @param LoopTimes
 * @text ループ回数
 * @desc アニメーションのループ回数です。0を指定するとデフォルト設定に従います。
 * @default 0
 * @type number
 */

/*~struct~EnemyApngRecord:ja
 *
 * @param FileName
 * @text ファイル名
 * @desc 追加するAPNGのファイル名です。
 * @default
 * @require 1
 * @dir img/enemies/
 * @type file
 *
 * @param CachePolicy
 * @text キャッシュ方針
 * @desc 画像のキャッシュ方針です。大量にキャッシュするとメモリ使用量に影響が出る場合があります。
 * @default 0
 * @type select
 * @option キャッシュしない
 * @value 0
 * @option 初回表示時にキャッシュ
 * @value 1
 * @option ゲーム起動時にキャッシュ
 * @value 2
 *
 * @param LoopTimes
 * @text ループ回数
 * @desc アニメーションのループ回数です。0を指定するとデフォルト設定に従います。
 * @default 0
 * @type number
 */

/*~struct~SideEnemyApngRecord:ja
 *
 * @param FileName
 * @text ファイル名
 * @desc 追加するAPNGのファイル名です。
 * @default
 * @require 1
 * @dir img/sv_enemies/
 * @type file
 *
 * @param CachePolicy
 * @text キャッシュ方針
 * @desc 画像のキャッシュ方針です。大量にキャッシュするとメモリ使用量に影響が出る場合があります。
 * @default 0
 * @type select
 * @option キャッシュしない
 * @value 0
 * @option 初回表示時にキャッシュ
 * @value 1
 * @option ゲーム起動時にキャッシュ
 * @value 2
 *
 * @param LoopTimes
 * @text ループ回数
 * @desc アニメーションのループ回数です。0を指定するとデフォルト設定に従います。
 * @default 0
 * @type number
 */

/*~struct~SceneApngRecord:
 *
 * @param SceneName
 * @desc Target Scene
 * @type select
 * @default Scene_Title
 * @option Scene_Title
 * @option Scene_Gameover
 * @option Scene_Battle
 * @option Scene_Menu
 * @option Scene_Item
 * @option Scene_Skill
 * @option Scene_Equip
 * @option Scene_Status
 * @option Scene_Options
 * @option Scene_Save
 * @option Scene_Load
 * @option Scene_End
 * @option Scene_Shop
 * @option Scene_Name
 * @option Scene_Debug
 * @option Scene_SoundTest
 * @option Scene_Glossary
 *
 * @param FileName
 * @desc File name of apng
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param CachePolicy
 * @desc Cache policy
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Cache on first display
 * @value 1
 * @option Cache at game start
 * @value 2
 *
 * @param X
 * @desc X of apng
 * @default 0
 * @type number
 *
 * @param Y
 * @desc Y of apng
 * @default 0
 * @type number
 *
 * @param Origin
 * @desc Origin of apng
 * @default 0
 * @type select
 * @option Upper left
 * @value 0
 * @option Center
 * @value 1
 *
 * @param Priority
 * @desc Priority of apng
 * @default 0
 * @type select
 * @option Front
 * @value 0
 * @option Under window
 * @value 1
 * @option Back
 * @value 2
 *
 * @param Switch
 * @desc Displayed only when the specified switch is ON
 * @default 0
 * @type switch
 *
 * @param LoopTimes
 * @desc The number of animation loops. Specifying 0 follows the default setting.
 * @default 0
 * @type number
 */

/*~struct~PictureApngRecord:
 *
 * @param FileName
 * @desc File name of apng
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CachePolicy
 * @desc Cache policy
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Cache on first display
 * @value 1
 * @option Cache at game start
 * @value 2
 *
 * @param LoopTimes
 * @desc The number of animation loops. Specifying 0 follows the default setting.
 * @default 0
 * @type number
 */

/*~struct~EnemyApngRecord:
 *
 * @param FileName
 * @desc File name of apng
 * @default
 * @require 1
 * @dir img/enemies/
 * @type file
 *
 * @param CachePolicy
 * @desc Cache policy
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Cache on first display
 * @value 1
 * @option Cache at game start
 * @value 2
 *
 * @param LoopTimes
 * @desc The number of animation loops. Specifying 0 follows the default setting.
 * @default 0
 * @type number
 */

/*~struct~SideEnemyApngRecord:
 *
 * @param FileName
 * @desc File name of apng
 * @default
 * @require 1
 * @dir img/sv_enemies/
 * @type file
 *
 * @param CachePolicy
 * @desc Cache policy
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Cache on first display
 * @value 1
 * @option Cache at game start
 * @value 2
 *
 * @param LoopTimes
 * @desc The number of animation loops. Specifying 0 follows the default setting.
 * @default 0
 * @type number
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
            this._cachePolicy = {};
            this._loopCount = {};
            this._paramList = paramList;
            if (this._paramList && this._paramList.length > 0) {
                this.addAllImage();
            }
            this._spriteCache = {};
        }

        addAllImage() {
            var option = this.getLoadOption();
            this._paramList.forEach(function(item) {
                this.addImage(item, option);
            }, this);
            PIXI.loader.onComplete.add(this.cacheStartup.bind(this));
            ApngLoader.startLoading();
        }

        addImage(item, option) {
            var name = item.FileName || '';
            var ext = Decrypter.hasEncryptedImages ? 'rpgmvp' : 'png';
            name = name.replace(/\.gif$/gi, function() {
                ext = 'gif';
                return '';
            });
            var path = name.match(/http:/) ? name : `img/${this._folder}/${name}.${ext}`;
            if (!this._fileHash.hasOwnProperty(name)) {
                this._fileHash[name] = ApngLoader.convertDecryptExt(path);
                this._cachePolicy[name] = item.CachePolicy;
                this._loopCount[name] = item.LoopTimes || param.DefaultLoopTimes;
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
            if (this._isNeedCache(name)) {
                if (this._spriteCache[name]) {
                    return this._spriteCache[name];
                }
                var sprite = this._createPixiApngAndGif(name);
                this._spriteCache[name] = sprite;
                return sprite;
            } else {
                return this._createPixiApngAndGif(name);
            }
        }

        _createPixiApngAndGif(name) {
            var pixiApng = new PixiApngAndGif(this._fileHash[name], ApngLoader._resource);
            var loopCount = this._loopCount[name];
            if (loopCount > 0) {
                pixiApng.play(loopCount);
            }
            var sprite = pixiApng.sprite;
            sprite.pixiApng = pixiApng;
            sprite.pixiApngLoopCount = loopCount;
            return sprite;
        }

        _isNeedCache(name) {
            return this._cachePolicy[name] > 0;
        }

        isApng(name) {
            return !!this._fileHash[name];
        }

        cacheStartup() {
            Object.keys(this._cachePolicy).forEach(function(name) {
                if (this._cachePolicy[name] === 2) {
                    this.createSprite(name)
                }
            }, this);
        }

        static startLoading() {
            this._loading = true;
        };

        static onLoadResource(progress, resource) {
            this._resource = resource;
            Object.keys(this._resource).forEach(function(key) {
                if (this._resource[key].extension === 'rpgmvp') {
                    ApngLoader.decryptResource(key);
                }
            }, this);
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
            return !!this._resource || !this._loading;
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

    var _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        this.destroySceneApng();
        if (this._spriteset) {
            this._spriteset.destroyApngPicture();
        }
    };

    Scene_Base.prototype.destroySceneApng = function() {
        this._apngList.forEach(function(sprite) {
            sprite.destroyApng();
        })
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

    Spriteset_Base.prototype.destroyApngPicture = function() {
        this.destroyApngPictureContainer(this._pictureContainer);
        // for PicturePriorityCustomize.js
        this.destroyApngPictureContainer(this._pictureContainerLower);
        this.destroyApngPictureContainer(this._pictureContainerMiddle);
        this.destroyApngPictureContainer(this._pictureContainerUpper);
    };

    Spriteset_Base.prototype.destroyApngPictureContainer = function(container) {
        if (!container) {
            return;
        }
        container.children.forEach(function(sprite) {
            if (sprite.destroyApngIfNeed) {
                sprite.destroyApngIfNeed();
            }
        });
    };

    Spriteset_Battle.prototype.destroyApngPicture = function() {
        Spriteset_Base.prototype.destroyApngPicture.call(this);
        this._enemySprites.forEach(function(sprite) {
            sprite.destroyApngIfNeed();
        });
    };

    /**
     * SceneManager
     * APNGのローダを管理します。
     */
    SceneManager.setupApngLoaderIfNeed = function() {
        if (this._apngLoaderPicture) {
            return;
        }
        PIXI.loader.onComplete.add(ApngLoader.onLoadResource.bind(ApngLoader));
        this._apngLoaderPicture = new ApngLoader('pictures', param.PictureList);
        this._apngLoaderEnemy = new ApngLoader('enemies', param.EnemyList);
        this._apngLoaderSideEnemy = new ApngLoader('sv_enemies', param.SideEnemyList);
        this._apngLoaderSystem = new ApngLoader('system', param.SceneApngList);
        PIXI.loader.load();
    };

    SceneManager.tryLoadApngPicture = function(name) {
        return this._apngLoaderPicture.createSprite(name);
    };

    SceneManager.tryLoadApngEnemy = function(name) {
        return this._apngLoaderEnemy.createSprite(name);
    };

    SceneManager.tryLoadApngSideEnemy = function(name) {
        return this._apngLoaderSideEnemy.createSprite(name);
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
            this.destroyApng();
        }
        this._apngSprite = this.loadApngSprite(name);
        if (this._apngSprite) {
            this.addChild(this._apngSprite);
            const original = ImageManager.loadPicture(name);
            original.addLoadListener(function() {
                this.bitmap = new Bitmap(original.width, original.height);
            }.bind(this));
            this.updateApngAnchor();
            this.updateApngBlendMode();
        }
        this._apngLoopCount = 1;
        this._apngLoopFrame = 0;
    };

    Sprite.prototype.destroyApngIfNeed = function() {
        if (this._apngSprite) {
            this.destroyApng();
        }
    };

    Sprite.prototype.destroyApng = function() {
        var pixiApng = this._apngSprite.pixiApng;
        if (pixiApng) {
            pixiApng.textures.forEach(function(texture) {
                texture.baseTexture.destroy();
                texture.destroy();
            });
            pixiApng.stop();
        }
        this.removeChild(this._apngSprite);
        this._apngSprite = null;
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

    var _Sprite_update = Sprite.prototype.update;
    Sprite.prototype.update = function() {
        _Sprite_update.apply(this, arguments);
        if (this._apngSprite && param.StopLastFrame) {
            this.updateApngFrameStop();
        }
    };

    Sprite.prototype.updateApngFrameStop = function() {
        var frame = this._apngSprite.pixiApng.__status.frame;
        if (frame < this._apngLoopFrame) {
            this._apngLoopCount++;
        }
        this._apngLoopFrame = frame;
        var loopLimit = this._apngSprite.pixiApngLoopCount;
        if (loopLimit <= 0) {
            return;
        }
        var frameLength = this._apngSprite.pixiApng.getFramesLength();
        if (loopLimit <= this._apngLoopCount && frameLength <= frame + 1) {
            this._apngSprite.pixiApng.stop();
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

    var _Sprite_Picture_updateBitmap =Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        var picture = this.picture();
        if (!picture && this._apngSprite) {
            this.destroyApng();
        }
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
        if ($gameSystem.isSideView()) {
            return SceneManager.tryLoadApngSideEnemy(name);
        } else {
            return SceneManager.tryLoadApngEnemy(name);
        }
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
           super.update();
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
