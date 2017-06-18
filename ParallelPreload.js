//=============================================================================
// ParallelPreload.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.2 2017/06/18 本体v1.5.0で機能しなくなる問題に対応（by 奏ねこま様）
// 2.0.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 2.0.0 2016/08/05 本体v1.3.0対応（1.2.0では使えなくなります）
//                  素材のプリロード時に発生するエラー(対象が存在しない等)を抑制するよう仕様変更
// 1.1.2 2016/07/23 コードのリファクタリングとヘルプの修正
// 1.1.1 2016/04/29 ログ出力を無効化するパラメータを追加
// 1.1.0 2016/04/28 音声素材の並列プリロードに対応
//                  他のプラグインの影響等で、特定のシーンでプリロードが止まってしまう問題を修正
// 1.0.1 2016/04/25 色相が0以外の画像がすべて0で表示されてしまう問題を修正
//                  色相に関する制約の説明を追加
//                  ブラウザプレー時、戦闘アニメの表示速度が著しく低下する問題を修正
//                  バトルテストとイベントテストが実行できなくなる問題を修正
// 1.0.0 2016/04/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 並列プリロードプラグイン
 * @author トリアコンタン
 *
 * @param 素材一覧データ
 * @desc 「/data」以下に配置するJSONファイル名
 * @default MV_Project
 *
 * @param ロード間隔
 * @desc ファイルをロードする間隔(フレーム単位)です。0に指定すると全てロードしてからゲーム開始します。(ブラウザ時は除く)
 * @default 0
 *
 * @param ログ出力
 * @desc ロードしたファイルパスをログに出力します。(テストプレー時のみ)
 * @default OFF
 *
 * @help ゲーム開始時に画像素材を並列ロードします。
 * 可能な限り負荷を分散、軽減するように設計されています。
 *
 * ロードする素材の一覧はfftfantt氏制作の「素材一覧用JSON作成プログラム」を
 * 使用してください。(2016/04/28時点でMITライセンス)
 * 同プログラムから必要な素材の一覧が作成されたJSONファイル
 * 「MV_Project.json」を作成して「/data」以下に配置します。
 * 作成する際は、「拡張子をつける」チェックを外してください。
 *
 * ・使い方
 * https://github.com/fftfantt/RPGMakerMV/wiki/JSON_Maker_for_MV
 *
 * ・本体
 * https://raw.githubusercontent.com/fftfantt/RPGMakerMV/master/JSON_Maker_for_MV.zip
 *
 * ブラウザから実行する場合、画像のロードが完了してから次のロードを開始します。
 * そのため、大量の画像を指定するとロード完了までに時間が掛かり
 * 効果が薄くなります。
 *
 * chromeでプレーする場合、大量に画像をロードすると処理速度が著しく低下します。
 * （本プラグインなしでも一定時間プレーすると発生する本体側の問題です）
 * その場合、下記を参考に対策プラグインの導入をお願いします。(本体ver1.2.0の場合)
 *
 * http://fanblogs.jp/tabirpglab/archive/422/0
 *
 * プリロードできるのは、色相が0の画像データのみです。
 * どうしても色相を変えた画像をロードしたい場合は「MV_Project.json」を
 * 該当箇所を以下の通り直接編集する必要があります。
 *
 * 例：色相が「100」の「Bat.png」をプリロードしたい場合
 * "Bat" -> "Bat:100"
 *
 * 注意！
 * このプラグインを適用したゲームをモバイルネットワークでプレーすると、
 * 通信量が膨大になる恐れがあります。必要に応じて注意喚起ください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var $dataMaterials = null;

(function () {
    'use strict';
    var pluginName = 'ParallelPreload';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramMaterialListData = getParamString(['MaterialListData', '素材一覧データ']) + '.json';
    var paramLoadInterval     = getParamNumber(['LoadInterval', 'ロード間隔']);
    var paramOutputLog        = getParamBoolean(['OutputLog', 'ログ出力']);

    var localLoadComplete     = false;
    var localIntervalCount    = 0;

    //=============================================================================
    // DataManager
    //  ロード対象素材スタックの作成を追加定義します。
    //=============================================================================
    DataManager._databaseFiles.push(
        {name: '$dataMaterials', src: paramMaterialListData}
    );
    DataManager.materialFilePaths = null;

    var _DataManager_loadDataFile = DataManager.loadDataFile;
    DataManager.loadDataFile = function(name, src) {
        if (name === '$dataMaterials' && (this.isBattleTest() || this.isEventTest())) {
            arguments[1] = paramMaterialListData;
        }
        _DataManager_loadDataFile.apply(this, arguments);
    };

    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataMaterials) {
            this.initParallelPreload();
        }
    };

    DataManager.initParallelPreload = function() {
        this.materialFilePaths = [];
        iterate($dataMaterials, function (key, value) {
            for (var i = 0, n = value.length; i < n; i++) {
                this.materialFilePaths.push([key, value[i]]);
            }
        }.bind(this));
    };

    DataManager.loadMaterial = function() {
        var filePathInfo = this.materialFilePaths.shift();
        if (filePathInfo) {
            if (Utils.isOptionValid('test') && paramOutputLog) {
                console.log('Load material : ' + filePathInfo[0] + '/' + filePathInfo[1]);
            }
            var loadImageHandler = ImageManager.loadHandlers[filePathInfo[0]];
            if (loadImageHandler) this.loadImage(loadImageHandler, filePathInfo);
            var loadAudioHandler = AudioManager.loadHandlers[filePathInfo[0]];
            if (loadAudioHandler) this.loadAudio(loadAudioHandler, filePathInfo);
        } else {
            localLoadComplete = true;
        }
    };

    DataManager.loadImage = function(loadHandler, filePathInfo) {
        var key = filePathInfo[1].split(':');
        var hue = key.length > 1 ? parseInt(key[1], 10) : 0;
        var bitmap = ImageManager[loadHandler](key[0], hue);
        if (bitmap.isReady()) return;
        bitmap._isNeedLagDraw = true;
        bitmap._lagDrawHue = hue;
        if (Utils.isNwjs()) {
            localIntervalCount = paramLoadInterval;
        } else {
            localIntervalCount = Infinity;
            bitmap.addLoadListener(function () {
                localIntervalCount = paramLoadInterval;
            }.bind(this));
        }
    };

    DataManager.loadAudio = function(loadHandler, filePathInfo) {
        if (AudioManager.shouldUseHtml5Audio()) return;
        var audio = AudioManager[loadHandler](filePathInfo[0], filePathInfo[1]);
        if (Utils.isNwjs()) {
            localIntervalCount = paramLoadInterval;
        } else {
            localIntervalCount = Infinity;
            audio.addLoadListener(function () {
                localIntervalCount = paramLoadInterval;
            }.bind(this));
        }
    };

    //=============================================================================
    // SceneManager
    //  ロード処理を実行します。
    //=============================================================================
    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (!localLoadComplete && DataManager.materialFilePaths) this.updateParallelPreload();
    };

    SceneManager.updateParallelPreload = function() {
        while (localIntervalCount <= 0 && !localLoadComplete) {
            DataManager.loadMaterial();
        }
        localIntervalCount--;
    };

    //=============================================================================
    // ImageManager
    //  ロード処理を実行します。
    //=============================================================================
    ImageManager.loadHandlers = {
        animations   : 'loadAnimation',
        battlebacks1 : 'loadBattleback1',
        battlebacks2 : 'loadBattleback2',
        enemies      : 'loadEnemy',
        characters   : 'loadCharacter',
        faces        : 'loadFace',
        parallaxes   : 'loadParallax',
        pictures     : 'loadPicture',
        sv_actors    : 'loadSvActor',
        sv_enemies   : 'loadSvEnemy',
        system       : 'loadSystem',
        tilesets     : 'loadTileset',
        titles1      : 'loadTitle1',
        titles2      : 'loadTitle2'
    };

    var _ImageManager_loadNormalBitmap = ImageManager.loadNormalBitmap;
    ImageManager.loadNormalBitmap = function(path, hue) {
        var bitmap = _ImageManager_loadNormalBitmap.apply(this, arguments);
        if (!bitmap.isReady()) bitmap._isNeedLagDraw = false;
        return bitmap;
    };

    var _ImageManager_isReady = ImageManager.isReady;
    ImageManager.isReady = function() {
        var result = _ImageManager_isReady.apply(this, arguments);
        if (result) return true;
        for (var key in this.cache._inner) {
            if (!this.cache._inner.hasOwnProperty(key)) continue;
            var bitmap = this.cache._inner[key].item;
            if (!bitmap.isReady() && !bitmap._isNeedLagDraw) {
                return false;
            }
        }
        return true;
    };

    var _ImageManager_isReady2 = ImageManager.isReady;
    ImageManager.isReady      = function() {
        var result = false;
        try {
            result = _ImageManager_isReady2.apply(this, arguments);
        } catch (e) {
            for (var key in this.cache._inner) {
                if (!this.cache._inner.hasOwnProperty(key)) continue;
                var bitmap = this.cache._inner[key].item;
                if (bitmap.isError() && bitmap._isNeedLagDraw) {
                    bitmap.eraseError();
                    delete this.cache._inner[key];
                }
            }
            result = _ImageManager_isReady2.apply(this, arguments);
        }
        return result;
    };

    //=============================================================================
    // AudioManager
    //  ロード用のメソッド名を定義します。
    //=============================================================================
    AudioManager.loadHandlers = {
        bgm : 'createBuffer',
        bgs : 'createBuffer',
        se  : 'createBuffer',
        me  : 'createBuffer'
    };

    //=============================================================================
    // Bitmap
    //  ロードと描画のタイミングを分離します。
    //=============================================================================
    var _Bitmap__onLoad = Bitmap.prototype._onLoad;
    Bitmap.prototype._onLoad = function() {
        if (!this._isNeedLagDraw) {
            _Bitmap__onLoad.apply(this, arguments);
        } else {
            this._isLoading = false;
            this._loadingState = 'loaded';  // added by nekoma.
            this.resize(this._image.width, this._image.height);
            this._callLoadListeners();
        }
    };

    Bitmap.prototype.drawImage = function() {
        this._context.drawImage(this._image, 0, 0);
        if (this._lagDrawHue !== 0) {
            this.rotateHue(this._lagDrawHue);
        }
        this._setDirty();
        this._isNeedLagDraw = false;
    };

    Bitmap.prototype.drawImageIfNeed = function() {
        if (this._isNeedLagDraw) {
            if (this.isReady()) {
                this.drawImage();
            } else {
                this._isNeedLagDraw = false;
            }
        }
    };

    var _Bitmap_blt = Bitmap.prototype.blt;
    Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        source.drawImageIfNeed();
        _Bitmap_blt.apply(this, arguments);
    };

    var _Bitmap_bltImage = Bitmap.prototype.bltImage;
    Bitmap.prototype.bltImage = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        source.drawImageIfNeed();
        _Bitmap_bltImage.apply(this, arguments);
    };

    Bitmap.prototype.eraseError = function() {
        this._hasError  = false;
        this._isLoading = false;
        this._loadingState = 'none';    // added by nekoma.
    };

    //=============================================================================
    // Sprite
    //  Bitmapのロード完了時に描画処理を実行します。
    //=============================================================================
    var _Sprite__onBitmapLoad = Sprite.prototype._onBitmapLoad;
    Sprite.prototype._onBitmapLoad = function() {
        if (this._bitmap) this._bitmap.drawImageIfNeed();
        _Sprite__onBitmapLoad.apply(this, arguments);
    };

    //=============================================================================
    // TilingSprite
    //  Bitmapのロード完了時に描画処理を実行します。
    //=============================================================================
    var _TilingSprite__onBitmapLoad = TilingSprite.prototype._onBitmapLoad;
    TilingSprite.prototype._onBitmapLoad = function() {
        if (this._bitmap) this._bitmap.drawImageIfNeed();
        _TilingSprite__onBitmapLoad.apply(this, arguments);
    };

    //=============================================================================
    // Spriteset_Map
    //  タイルセットはすぐに描画します。
    //=============================================================================
    var _Spriteset_Map_loadTileset = Spriteset_Map.prototype.loadTileset;
    Spriteset_Map.prototype.loadTileset = function() {
        _Spriteset_Map_loadTileset.apply(this, arguments);
        if (this._tileset) {
            this._tilemap.bitmaps.forEach(function(bitmap) {
                bitmap.drawImageIfNeed();
            });
        }
    };
})();

