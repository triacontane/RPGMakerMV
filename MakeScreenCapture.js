//=============================================================================
// MakeScreenCapture.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2023/11/03 全面的なリファクタリングを実施し、不要な仕様を撤廃
//                  キャプチャのトリミング機能と、キャプチャフォルダを自動的に開く機能を追加
// 1.8.0 2021/09/24 署名に制御文字\v[n]を使えるよう修正
// 1.7.4 2021/05/16 プラグインコマンドがMZ対応できていなかったので修正
// 1.7.3 2018/06/28 出力パスの算出方法を変更
// 1.7.2 2018/03/06 各種ファンクションキーにCtrlおよびAltの同時押し要否の設定を追加しました。
// 1.7.1 2017/11/11 総合開発支援プラグインとの連携による修正
// 1.7.0 2017/08/13 パラメータの型指定機能に対応
// 1.6.0 2016/12/25 jpg保存時の拡張子を「jpeg」→「jpg」に変更
//                  jpeg品質をパラメータから指定できる機能を追加
// 1.5.0 2016/10/20 本体バージョン1.3.2でエラーが発生していたのを修正
// 1.4.0 2016/10/06 パラメータに環境変数を使えるように修正
// 1.3.0 2016/06/24 WEBP形式のショートカットキーを追加
// 1.2.3 2016/06/23 著名に画像とテキストを両方使えるよう修正
// 1.2.2 2016/05/13 プラグインコマンドから出力したときに拡張子の表示がおかしくなる問題を修正
// 1.2.1 2016/05/11 定期実行キャプチャを行ったときに拡張子の表示がおかしくなる問題を修正
// 1.2.0 2016/04/23 署名に任意の画像ファイルを利用できるようになりました。
//                  細部のリファクタリング
// 1.1.5 2016/04/10 画像の出力先を管理画面のパラメータとして設定できるよう修正
// 1.1.4 2016/03/31 画像の出力先を絶対パスで指定できるよう修正
// 1.1.3 2016/03/15 文章のスクロール表示が正しくキャプチャできない問題を修正
// 1.1.2 2016/03/01 pngとjpegの形式ごとのファンクションキーを割り当てるよう修正
// 1.1.1 2016/02/26 PrintScreenでもキャプチャできるように修正
// 1.1.0 2016/02/25 複数のウィンドウを含む画面で正しくキャプチャできない不具合を修正
//                  高度な設定項目の追加
// 1.0.0 2016/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 画面キャプチャ管理プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MakeScreenCapture.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param FileName
 * @text ファイル名
 * @desc 画像のファイル名です。%1が日付、%2が連番に置き換わります。
 * @default image_%1_%2
 *
 * @param LocationText
 * @text 出力場所
 * @desc ファイルの出力パスです。相対パス、絶対パスともに利用できます。エクスプローラ等からパスをコピーしてください。
 * @default captures
 *
 * @param FileFormat
 * @text 保存形式
 * @desc 画像の保存形式です。(png/jpeg/webp)
 * @default png
 * @type select
 * @option png
 * @option jpeg
 * @option webp
 *
 * @param Quality
 * @text 画像品質
 * @desc 画像品質です。png形式の場合、影響は受けません。値を小さくすると品質が低下し容量も小さくなります。(1...10)
 * @default 9
 * @type number
 * @min 1
 * @max 10
 *
 * @param Signature
 * @text 署名
 * @desc 保存時にキャプチャに含まれる署名情報です。
 * @default {}
 * @type struct<Signature>

 * @param Interval
 * @text 実行間隔
 * @desc キャプチャを定期実行する間隔（秒単位）です。
 * 0にすると、定期キャプチャを行いません。
 * @default 0
 * @type number
 *
 * @param SoundEffect
 * @text 効果音
 * @desc キャプチャ実行時に演奏する効果音のファイル名です。
 * @default {}
 * @type struct<SoundEffect>
 *
 * @param OpenDirectory
 * @text ディレクトリを開く
 * @desc キャプチャを保存した後、自動で保存先のディレクトリを開きます。テストプレー時以外は無効です。
 * @default true
 * @type boolean
 *
 * @param Trimming
 * @text トリミング
 * @desc キャプチャ時に画面を指定した矩形でトリミングします。
 * @default {}
 * @type struct<Trimming>
 *
 * @command MAKE
 * @text キャプチャ作成
 * @desc 実行時点でのキャプチャを作成してメモリ上に保持します。
 *
 * @arg trimming
 * @text トリミング
 * @desc キャプチャ時に画面を指定した矩形でトリミングします。
 * @default {}
 * @type struct<Trimming>
 *
 * @command OUT_PICTURE
 * @text ピクチャ出力
 * @desc キャプチャ作成で保持していた画面キャプチャをピクチャに表示します。コマンドの直後に「ピクチャの表示」を実行してください。
 *
 * @command OUT_FILE
 * @text ファイル作成
 * @desc キャプチャ作成で保持していた画面キャプチャをファイルに保存します。ローカル実行でのみ動作します。
 *
 * @arg name
 * @text ファイル名
 * @desc 画像のファイル名です。%1が日付、%2が連番に置き換わります。
 * @default image_%1_%2
 *
 * @help MakeScreenCapture.js
 *
 * プレー中のゲーム画面をキャプチャして
 * ファイルに保存したり、ピクチャとして表示したりできます。
 * キャプチャは以下のタイミングで実行されます。
 *
 * ・PrintScreen押下
 * ・一定時間ごと
 * ・プラグインコマンド実行時
 *
 * プラグインコマンド以外は、テストプレー時のみ有効になります。
 *
 * 注意！
 * キャプチャピクチャの表示状態はセーブできません。
 * セーブされる前に「ピクチャの消去」で消去してください。
 *
 * 注意！
 * キャプチャを出力する機能はローカル環境でのみ有効です。
 * ブラウザやスマホ上では動作しません。
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

/*~struct~SoundEffect:
 * @param name
 * @text ファイル名
 * @desc 効果音のファイル名です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text 音量
 * @desc 効果音の音量です。
 * @default 90
 * @type number
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 効果音のピッチです。
 * @default 100
 * @type number
 * @max 150
 *
 * @param pan
 * @text 位相
 * @desc 効果音の位相です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~Signature:
 *
 * @param signature
 * @text 署名テキスト
 * @desc 署名の文章です。制御文字\v[n]が使えます。
 * @default
 * @type string
 *
 * @param image
 * @text 署名画像
 * @desc 署名に画像を指定したい場合のファイル名です。ピクチャフォルダに格納したものを使用します。
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @param fontFace
 * @text 署名フォント
 * @desc 署名のフォントをメインフォントから変更したい場合に使用します。別途フォントロードプラグインが必要です。
 * @default
 * @type string
 *
 * @param fontSize
 * @text 署名サイズ
 * @desc 署名のフォントサイズです。省略するとメインフォントサイズになります。
 * @default 0
 * @type number
 *
 * @param fontColor
 * @text 署名カラー
 * @desc 署名のフォントカラーです。テキストカラーから選択します。
 * @default 0
 * @type color
 *
 * @param align
 * @text 署名揃え
 * @desc 署名の揃えです。
 * @default right
 * @type select
 * @option left
 * @option center
 * @option right
 *
 */

/*~struct~Trimming:
 *
 * @param x
 * @text X座標
 * @desc トリミングする範囲のX座標です。変数値を指定したい場合は制御文字\v[n]を使ってください。
 * @default 0
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc トリミングする範囲のY座標です。変数値を指定したい場合は制御文字\v[n]を使ってください。
 * @default 0
 * @type number
 *
 * @param width
 * @text 幅
 * @desc トリミングする範囲の幅です。変数値を指定したい場合は制御文字\v[n]を使ってください。
 * @default 1
 * @type number
 * @min 1
 *
 * @param height
 * @text 高さ
 * @desc トリミングする範囲の高さです。変数値を指定したい場合は制御文字\v[n]を使ってください。
 * @default 1
 * @type number
 * @min 1
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'MAKE', args => {
        SceneManager.makeCapture(args.trimming);
    });

    PluginManagerEx.registerCommand(script, 'OUT_PICTURE', args => {
        $gameScreen.captureFlg = true;
    });

    PluginManagerEx.registerCommand(script, 'OUT_FILE', args => {
        SceneManager.saveCapture(args.name);
    });

    //=============================================================================
    // Game_Screen
    //  キャプチャピクチャ用のプロパティを追加定義します。
    //=============================================================================
    const _Game_Screen_clear      = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearCapturePicture();
    };

    Game_Screen.prototype.clearCapturePicture = function() {
        this.captureFlg = false;
    };

    //=============================================================================
    // Game_Picture
    //  キャプチャピクチャ用のプロパティを追加定義します。
    //=============================================================================
    const _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        if ($gameScreen.captureFlg) {
            arguments[0]    = Date.now().toString();
            this.captureFlg = true;
        } else {
            this.captureFlg = null;
        }
        $gameScreen.clearCapturePicture();
        _Game_Picture_show.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Base
    //  定期実行キャプチャを定義します。
    //=============================================================================
    const _Scene_Base_update      = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        const count = Graphics.frameCount;
        if (param.Interval !== 0 && Utils.isTestCapture() && (count + 1) % (param.Interval * 60) === 0) {
            SceneManager.takeCapture(false);
        }
    };

    //=============================================================================
    // Sprite_Picture
    //  画像の動的生成を追加定義します。
    //=============================================================================
    const _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture().captureFlg) {
            this.bitmap = SceneManager.getCapture();
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    //=============================================================================
    // Utils
    //  テスト用のキャプチャを許可するかどうかを返します。
    //=============================================================================
    Utils.isTestCapture = function() {
        return Utils.isOptionValid('test');
    };

    //=============================================================================
    // Bitmap
    //  対象のビットマップを保存します。現状、ローカル環境下でのみ動作します。
    //=============================================================================
    Bitmap.prototype.signAndSave = async function(fileName) {
        const fileFullPath = StorageManager.getLocalImgFileName(fileName);
        const signature = param.Signature || {};
        await this.signImage(signature);
        this.signText(signature);
        this.save(fileFullPath, param.Quality / 10);
    };

    Bitmap.prototype.signText = function(signature) {
        const text = signature.signature;
        if (!text) {
            return;
        }
        this.fontFace  = signature.fontFace || $gameSystem.mainFontFace();
        this.fontSize  = signature.fontSize || $gameSystem.mainFontSize();
        this.textColor = ColorManager.textColor(signature.fontColor || 0);
        this.drawText(text, 8, this.height - this.fontSize - 8,
            this.width - 8 * 2, this.fontSize, signature.align);
    };

    Bitmap.prototype.save = function(fileName, extend) {
        const data = this._canvas.toDataURL('image/' + param.FileFormat, extend)
            .replace(/^.*,/, '');
        StorageManager.saveImg(fileName, param.FileFormat, data);
    };

    Bitmap.prototype.signImage = function(signature) {
        if (!signature.image) {
            return Promise.resolve();
        }
        const signBitmap = ImageManager.loadPicture(signature.image);
        return new Promise(resolve => {
            signBitmap.addLoadListener(() => {
                this.drawSignBitmap(signBitmap, signature);
                resolve();
            });
        });
    };

    Bitmap.prototype.drawSignBitmap = function(signBitmap, signature) {
        let dx = 0, dy = this.height - signBitmap.height;
        switch (signature.align) {
            case 'center':
                dx = this.width / 2 - signBitmap.width / 2;
                break;
            case 'right':
                dx = this.width - signBitmap.width;
                break;
        }
        this.blt(signBitmap, 0, 0, signBitmap.width, signBitmap.height, dx, dy);
    }

    //=============================================================================
    // SceneManager
    //  ファンクションキーが押下されたときにキャプチャを実行します。
    //=============================================================================
    SceneManager.captureNumber = 0;
    SceneManager.makeCapture   = function(rect = param.Trimming || {}) {
        if (param.SoundEffect?.name) {
            AudioManager.playSe(param.SoundEffect);
        }
        const bitmap = this.snap();
        if (rect.width && rect.height) {
            this._captureBitmap = new Bitmap(rect.width, rect.height);
            this._captureBitmap.blt(bitmap, rect.x, rect.y, rect.width, rect.height, 0, 0);
        } else {
            this._captureBitmap = bitmap;
        }
    };

    SceneManager.getCapture = function() {
        return this._captureBitmap || ImageManager.loadBitmap('', '');
    };

    SceneManager.saveCapture = function(fileName) {
        if (!this._captureBitmap) {
            return;
        }
        this._captureBitmap.signAndSave(fileName).then(() => {
            this._captureBitmap.destroy();
            this._captureBitmap = null;
            this.openCaptureDirectory();
        });
    };

    SceneManager.openCaptureDirectory = function() {
        if (!param.OpenDirectory || !Utils.isTestCapture()) {
            return;
        }
        const child_process= require('child_process');
        try {
            child_process.execSync('start "" ' + StorageManager.localImgFileDirectoryPath());
        } catch (e) {
            console.error(e);
        }
    };

    SceneManager.takeCapture = function() {
        this.makeCapture();
        this.saveCapture(param.FileName);
    };

    const _SceneManager_setupEventHandlers = SceneManager.setupEventHandlers;
    SceneManager.setupEventHandlers      = function() {
        _SceneManager_setupEventHandlers.apply(this, arguments);
        if (Utils.isTestCapture()) {
            document.addEventListener('keyup', this.onKeyUpForCapture.bind(this));
        }
    };

    SceneManager.onKeyUpForCapture = function(event) {
        // PrintScreen
        if (event.keyCode === 44) {
            SceneManager.takeCapture(true);
        }
    };

    //=============================================================================
    // StorageManager
    //  イメージファイルを保存します。
    //=============================================================================
    StorageManager.saveImg = function(fileName, format, data) {
        if (this.isLocalMode()) {
            this.saveImgToLocalFile(fileName + '.' + format, data);
        } else {
            PluginManagerEx.throwError('ローカル実行以外ではキャプチャを保存できません。', script);
        }
    };

    StorageManager.saveImgToLocalFile = function(fileName, data) {
        const dirPath  = this.localImgFileDirectoryPath();
        const filePath = dirPath + fileName;
        this.fsMkdir(dirPath);
        this.fsWriteFile(filePath, new Buffer(data, 'base64'));
    };

    StorageManager.localImgFileDirectoryPath = function() {
        let filePath = param.LocationText;
        if (!filePath.match(/^[A-Z]:/)) {
            const path = require('path');
            filePath = path.join(path.dirname(process.mainModule.filename), filePath);
        }
        return decodeURIComponent(filePath.match(/\/$/) ? filePath : filePath + '/');
    };

    StorageManager.getLocalImgFileName = function(fileName) {
        const date = new Date();
        const timestamp = date.getFullYear() + (date.getMonth() + 1).padZero(2) + date.getDate().padZero(2) +
            '_' + date.getHours().padZero(2) + date.getMinutes().padZero(2) + date.getSeconds().padZero(2);
        const captureNumber = SceneManager.captureNumber;
        SceneManager.captureNumber++;
        return fileName.format(timestamp, captureNumber.padZero(4));
    };
})();
