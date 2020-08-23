/*=============================================================================
 PictureAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0,2 2020/08/24 ピクチャのアニメーションセル設定でセル進行かどうかの判定処理が誤っていた問題を修正
 1.0.1 2020/08/23 ピクチャのアニメーションセル設定のコマンドが機能していなかった問題を修正
 1.0.0 2020/02/28 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc ピクチャのアニメーションプラグイン
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 * 
 * @param returnToFirstCell
 * @text 最初のセルに戻る
 * @desc ループしないアニメーションの終了後、最初のセルに戻ります。無効にすると最後のセルで止まります。
 * @default true
 * @type boolean
 *
 * @command INIT
 * @text ピクチャのアニメーション準備
 * @desc ピクチャをアニメーション対象にする準備をします。「ピクチャの表示」の直前に実行してください。
 *
 * @arg cellNumber
 * @text セル数
 * @desc アニメーションするセル画の数
 * @type number
 * @default 1
 * @max 200
 * @min 1
 *
 * @arg frameNumber
 * @text フレーム数
 * @desc アニメーション間隔のフレーム数
 * @type number
 * @default 1
 * @min 1
 *
 * @arg direction
 * @text セル配置方法
 * @desc セル画像の配置方法
 * @type select
 * @default vertical
 * @option 縦
 * @value vertical
 * @option 横
 * @value horizon
 * @option 連番
 * @value number
 *
 * @arg fade
 * @text フェード時間
 * @desc 画像切替に掛かるフレーム数（0にするとフェードしない）
 * @type number
 * @default 0
 *
 * @command START
 * @text ピクチャのアニメーション開始
 * @desc 指定したピクチャ番号のピクチャをアニメーションを開始します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg loop
 * @text ループ有無
 * @desc ループ再生の有無です。
 * @type boolean
 * @default false
 *
 * @arg animationType
 * @text アニメーションタイプ
 * @desc アニメーションタイプです。
 * @type select
 * @default 1
 * @option 1→2→3→4→1→2→3→4... (セル数が4の場合)
 * @value 1
 * @option 1→2→3→4→3→2→1→2... (セル数が4の場合)
 * @value 2
 * @option カスタムパターン
 * @value 3
 *
 * @arg customPattern
 * @text カスタムパターン
 * @desc アニメーションタイプを「カスタムパターン」にした場合のパターンです。
 * @type number[]
 * @default ["1"]
 *
 * @command STOP
 * @text ピクチャのアニメーション終了
 * @desc 指定したピクチャ番号のピクチャをアニメーションを終了します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg force
 * @text 強制終了
 * @desc 有効にすると実行した瞬間にアニメーションが止まります。無効にすると一巡してから止まります。
 * @type boolean
 * @default false
 *
 * @command SET_CELL
 * @text ピクチャのアニメーションセル設定
 * @desc アニメーションのセルを直接設定します。任意のタイミングでアニメーションしたい場合に有効です。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg cellNumber
 * @text セル番号
 * @desc 指定対象のセル番号です。開始番号は1で、0を指定すると、現在のセルからひとつ進めます。
 * @type number
 * @default 0
 *
 * @arg wait
 * @text ウェイト有無
 * @desc ウェイトありを設定すると、クロスフェード中はイベントの実行を待機します。
 * @type boolean
 * @default false
 *
 * @command LINK_VARIABLE
 * @text アニメーションセルの変数のリンク
 * @desc アニメーションのセルを指定した変数と連動させます。変数の値が変化すると表示しているセルも自動的に変化します。
 *
 * @arg pictureNumber
 * @text ピクチャ番号
 * @desc ピクチャ番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @arg variableId
 * @text 変数番号
 * @desc リンク対象の変数番号です。
 * @type variable
 * @default 1
 *
 * @command LINK_SOUND
 * @text アニメーション効果音の設定
 * @desc アニメーションのセルが切り替わったタイミングで効果音を演奏します。
 *
 * @arg cellNumber
 * @text セル番号
 * @desc 指定対象のセル番号です。
 * @type number
 * @default 1
 * @min 1
 *
 * @help 指定したフレーム間隔でピクチャをアニメーションします。
 * アニメーションしたいセル画像（※）を用意の上
 * 以下のコマンドを入力してください。
 *
 * 1. ピクチャのアニメーション準備（プラグインコマンド）
 * 2. ピクチャの表示（通常のイベントコマンド）
 * 3. ピクチャのアニメーション開始（プラグインコマンド）
 * 4. ピクチャのアニメーション終了（プラグインコマンド）
 *
 * ※配置方法は以下の3通りがあります。
 *  縦　：セルを縦に並べて全体を一つのファイルにします。
 *  横　：セルを横に並べて全体を一つのファイルにします。
 *  連番：連番のセル画像を複数用意します。(original部分は任意の文字列)
 *   original00.png(ピクチャの表示で指定するオリジナルファイル)
 *   original01.png
 *   original02.png...
 *
 * 要注意！　配置方法の連番を使う場合、デプロイメント時に
 * 未使用ファイルとして除外される可能性があります。
 * その場合、削除されたファイルを入れ直す等の対応が必要です。
 *
 * また、単にアニメーションさせる以外にも、プラグインコマンドから
 * セル番号を直接指定したり、変数の値とセル番号を連動させたりできます。
 * 紙芝居のような演出や、条件次第で立ち絵の表示状態を変化させたりする場合に
 * 有効です。
 *
 * スクリプト詳細
 *
 * アニメーション中のピクチャに対して現在のセル番号を取得します。
 * イベントコマンド「変数の操作」や「条件分岐」で使用できます。
 * ピクチャを表示していないときに実行するとエラーになります。
 * $gameScreen.picture(1).cell; // ピクチャ番号[1]のセルを取得
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    PluginManagerEx.registerCommand(script, "INIT",function(args) {
        $gameScreen.setPicturesAnimation(args.cellNumber, args.frameNumber, args.direction, args.fade);
    });

    PluginManagerEx.registerCommand(script, "LINK_SOUND",function(args) {
        this.reservePaSound(args.cellNumber);
    });

    PluginManagerEx.registerCommand(script, "START",function(args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.startAnimationFrame(args.animationType, args.loop, args.customPattern);
        }
    });

    PluginManagerEx.registerCommand(script, "STOP",function(args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.stopAnimationFrame(args.force);
        }
    });

    PluginManagerEx.registerCommand(script, "SET_CELL",function(args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            if (args.cellNumber > 0) {
                picture.cell = args.cellNumber - 1;
            } else {
                picture.addCellCount();
            }
            if (args.wait) {
                this.wait(picture._fadeDuration);
            }
        }
    });

    PluginManagerEx.registerCommand(script, "LINK_VARIABLE",function(args) {
        const picture = $gameScreen.picture(args.pictureNumber);
        if (picture) {
            picture.linkToVariable(args.variableId);
        }
    });

    Game_Interpreter.prototype.reservePaSound = function(cellNumber) {
        this._paSoundFrame = cellNumber;
    };

    const _Game_Interpreter_command250      = Game_Interpreter.prototype.command250;
    Game_Interpreter.prototype.command250 = function() {
        if (this._paSoundFrame) {
            const se = this._params[0];
            AudioManager.loadStaticSe(se);
            $gameScreen.addPaSound(se, this._paSoundFrame);
            this._paSoundFrame = null;
            return true;
        }
        return _Game_Interpreter_command250.apply(this, arguments);
    };

    //=============================================================================
    // Game_Screen
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    Game_Screen.prototype.setPicturesAnimation = function(cellNumber, frameNumber, direction, fadeDuration) {
        this._paCellNumber   = cellNumber;
        this._paFrameNumber  = frameNumber;
        this._paDirection    = direction;
        this._paFadeDuration = fadeDuration;
    };

    Game_Screen.prototype.addPaSound = function(sound, frame) {
        if (!this._paSounds) this._paSounds = [];
        this._paSounds[frame] = sound;
    };

    Game_Screen.prototype.clearPicturesAnimation = function() {
        this._paCellNumber   = 1;
        this._paFrameNumber  = 1;
        this._paDirection    = '';
        this._paFadeDuration = 0;
        this._paSounds       = null;
    };

    const _Game_Screen_showPicture      = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                                 scaleX, scaleY, opacity, blendMode) {
        _Game_Screen_showPicture.apply(this, arguments);
        const realPictureId = this.realPictureId(pictureId);
        if (this._paCellNumber > 1) {
            this._pictures[realPictureId].setAnimationFrameInit(
                this._paCellNumber, this._paFrameNumber, this._paDirection, this._paFadeDuration, this._paSounds);
            this.clearPicturesAnimation();
        }
    };

    Game_Screen.prototype.isActivePicture = function(picture) {
        const realId = this._pictures.indexOf(picture);
        return realId > this.maxPictures() === $gameParty.inBattle();
    };

    //=============================================================================
    // Game_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    const _Game_Picture_initialize      = Game_Picture.prototype.initialize;
    Game_Picture.prototype.initialize = function() {
        _Game_Picture_initialize.call(this);
        this.initAnimationFrameInfo();
    };

    Game_Picture.prototype.initAnimationFrameInfo = function() {
        this._cellNumber        = 1;
        this._frameNumber       = 1;
        this._cellCount         = 0;
        this._frameCount        = 0;
        this._animationType     = 0;
        this._customArray       = null;
        this._loopFlg           = false;
        this._direction         = '';
        this._fadeDuration      = 0;
        this._fadeDurationCount = 0;
        this._prevCellCount     = 0;
        this._animationFlg      = false;
        this._linkedVariable    = 0;
        this._cellSes           = [];
    };

    Game_Picture.prototype.direction = function() {
        return this._direction;
    };

    Game_Picture.prototype.cellNumber = function() {
        return this._cellNumber;
    };

    Game_Picture.prototype.prevCellCount = function() {
        return this._prevCellCount;
    };

    Game_Picture.prototype.isMulti = function() {
        return this.direction() === 'number';
    };

    /**
     * The cellCount of the Game_Picture (0 to cellNumber).
     *
     * @property cellCount
     * @type Number
     */
    Object.defineProperty(Game_Picture.prototype, 'cell', {
        get: function() {
            if (this._linkedVariable > 0) {
                return $gameVariables.value(this._linkedVariable) % this._cellNumber;
            }
            switch (this._animationType) {
                case 3:
                    return (this._customArray[this._cellCount] - 1).clamp(0, this._cellNumber - 1);
                case 2:
                    return this._cellNumber - 1 - Math.abs(this._cellCount - (this._cellNumber - 1));
                case 1:
                    return this._cellCount;
                default:
                    return this._cellCount;
            }
        },
        set: function(value) {
            const newCellCount = value % this.getCellNumber();
            if (this._cellCount !== newCellCount) {
                this._prevCellCount     = this.cell;
                this._fadeDurationCount = this._fadeDuration;
            }
            this._cellCount = newCellCount;
        }
    });

    Game_Picture.prototype.getCellNumber = function() {
        switch (this._animationType) {
            case 3:
                return this._customArray.length;
            case 2:
                return (this._cellNumber - 1) * 2;
            case 1:
                return this._cellNumber;
            default:
                return this._cellNumber;
        }
    };

    const _Game_Picture_update      = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.call(this);
        if (this.isFading()) {
            this.updateFading();
        } else if (this.hasAnimationFrame() && this.isActive()) {
            this.updateAnimationFrame();
        }
    };

    Game_Picture.prototype.linkToVariable = function(variableNumber) {
        this._linkedVariable = variableNumber.clamp(1, $dataSystem.variables.length);
    };

    Game_Picture.prototype.updateAnimationFrame = function() {
        this._frameCount = (this._frameCount + 1) % this._frameNumber;
        if (this._frameCount === 0) {
            this.addCellCount();
            this.playCellSe();
            if (this.isEndFirstLoop() && !this._loopFlg) {
                this._animationFlg = false;
            }
        }
    };

    Game_Picture.prototype.isEndFirstLoop = function() {
        return this._cellCount === (param.returnToFirstCell ? 0 : this.getCellNumber() - 1);
    };

    Game_Picture.prototype.updateFading = function() {
        this._fadeDurationCount--;
    };

    Game_Picture.prototype.prevCellOpacity = function() {
        if (this._fadeDuration === 0) return 0;
        return this.opacity() / this._fadeDuration * this._fadeDurationCount;
    };

    Game_Picture.prototype.addCellCount = function() {
        this.cell = this._cellCount + 1;
    };

    Game_Picture.prototype.playCellSe = function() {
        const se = this._cellSes[this.cell + 1];
        if (se) {
            AudioManager.playSe(se);
        }
    };

    Game_Picture.prototype.setAnimationFrameInit = function(cellNumber, frameNumber, direction, fadeDuration, cellSes) {
        this._cellNumber   = cellNumber;
        this._frameNumber  = frameNumber;
        this._frameCount   = 0;
        this._cellCount    = 0;
        this._direction    = direction;
        this._fadeDuration = fadeDuration;
        this._cellSes      = cellSes || [];
    };

    Game_Picture.prototype.startAnimationFrame = function(animationType, loopFlg, customArray) {
        this._animationType = animationType;
        this._customArray   = customArray;
        this._animationFlg  = true;
        this._loopFlg       = loopFlg;
        if (this._cellNumber <= this._cellCount) {
            this._cellCount = this._cellNumber - 1;
        }
        this.playCellSe();
    };

    Game_Picture.prototype.stopAnimationFrame = function(forceFlg) {
        this._loopFlg = false;
        if (forceFlg) {
            this._animationFlg = false;
        }
    };

    Game_Picture.prototype.hasAnimationFrame = function() {
        return this._animationFlg;
    };

    Game_Picture.prototype.isFading = function() {
        return this._fadeDurationCount !== 0;
    };

    Game_Picture.prototype.isNeedFade = function() {
        return this._fadeDuration !== 0;
    };

    Game_Picture.prototype.isActive = function() {
        return $gameScreen.isActivePicture(this);
    };

    //=============================================================================
    // Sprite_Picture
    //  アニメーション関連の情報を追加で保持します。
    //=============================================================================
    const _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        this._prevSprite = null;
        _Sprite_Picture_initialize.apply(this, arguments);
    };

    const _Sprite_Picture_update      = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.apply(this, arguments);
        const picture = this.picture();
        if (picture && picture.name()) {
            if (picture.isMulti() && !this._bitmaps) {
                this.loadAnimationBitmap();
            }
            if (this.isBitmapReady()) {
                this.updateAnimationFrame(this, picture.cell);
                if (picture.isNeedFade()) this.updateFading();
            }
        }
    };

    const _Sprite_Picture_updateBitmap      = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        if (!this.picture()) {
            this._bitmaps = null;
            if (this._prevSprite) {
                this._prevSprite.bitmap = null;
            }
        }
    };

    Sprite_Picture.prototype.updateFading = function() {
        if (!this._prevSprite) {
            this.makePrevSprite();
        }
        if (!this._prevSprite.bitmap) {
            this.makePrevBitmap();
        }
        const picture = this.picture();
        if (picture.isFading()) {
            this._prevSprite.visible = true;
            this.updateAnimationFrame(this._prevSprite, picture.prevCellCount());
            this._prevSprite.opacity = picture.prevCellOpacity();
        } else {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.updateAnimationFrame = function(sprite, cellCount) {
        switch (this.picture().direction()) {
            case 'number':
                sprite.bitmap = this._bitmaps[cellCount];
                sprite.setFrame(0, 0, sprite.bitmap.width, sprite.bitmap.height);
                break;
            case 'vertical':
                const height = sprite.bitmap.height / this.picture().cellNumber();
                const y      = cellCount * height;
                sprite.setFrame(0, y, sprite.bitmap.width, height);
                break;
            case 'horizon':
                const width = sprite.bitmap.width / this.picture().cellNumber();
                const x     = cellCount * width;
                sprite.setFrame(x, 0, width, sprite.bitmap.height);
                break;
            default:
                sprite.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    };

    const _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        _Sprite_Picture_loadBitmap.apply(this, arguments);
        this._bitmapReady = false;
        this._bitmaps     = null;
        if (this._prevSprite) {
            this._prevSprite.visible = false;
        }
    };

    Sprite_Picture.prototype.loadAnimationBitmap = function() {
        const cellNumber = this.picture().cellNumber();
        const cellDigit  = cellNumber.toString().length;
        this._bitmaps  = [this.bitmap];
        for (let i = 1; i < cellNumber; i++) {
            const filename     = this._pictureName.substr(0,
                this._pictureName.length - cellDigit) + i.padZero(cellDigit);
            this._bitmaps[i] = ImageManager.loadPicture(filename);
        }
        this._bitmapReady = false;
    };

    Sprite_Picture.prototype.makePrevSprite = function() {
        this._prevSprite         = new Sprite();
        this._prevSprite.visible = false;
        this.addChild(this._prevSprite);
    };

    Sprite_Picture.prototype.makePrevBitmap = function() {
        this._prevSprite.bitmap   = this.bitmap;
        this._prevSprite.anchor.x = this.anchor.x;
        this._prevSprite.anchor.y = this.anchor.y;
    };

    Sprite_Picture.prototype.isBitmapReady = function() {
        if (!this.bitmap) return false;
        if (this._bitmapReady) return true;
        let result;
        if (this.picture().isMulti()) {
            result = this._bitmaps.every(function(bitmap) {
                return bitmap.isReady();
            });
        } else {
            result = this.bitmap.isReady();
        }
        this._bitmapReady = result;
        return result;
    };
})();
