/*=============================================================================
 CharacterPicture.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/05/22 キャラクターではない通常のピクチャ表示でエラーになる問題を修正
 1.0.0 2023/05/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc キャラクターのピクチャ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterPicture.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_CHARACTER_PICTURE
 * @text キャラクターピクチャ指定
 * @desc 指定したキャラクターグラフィックをピクチャ表示します。
 *
 * @arg imageFile
 * @text ファイル
 * @desc キャラクターグラフィックのファイルパスです。
 * @default
 * @type file
 * @dir img/characters
 *
 * @arg index
 * @text インデックス
 * @desc キャラクターグラフィックのファイルインデックスです。(0-7)
 * @default 0
 * @type number
 * @max 7
 *
 * @arg cell
 * @text セル番号
 * @desc キャラクターグラフィックのセル番号です。(0-11)
 * @default 1
 * @type number
 * @max 11
 *
 * @command CHANGE_CELL_NUMBER
 * @text セル番号変更
 * @desc 指定したIDのキャラクターピクチャのセル番号を変更します。
 *
 * @arg pictureId
 * @text ピクチャID
 * @desc 変更するピクチャのIDです。
 * @default 1
 * @type number
 * @min 1
 * @max 100
 *
 * @arg cell
 * @text セル番号
 * @desc キャラクターグラフィックのセル番号です。(0-11)
 * @default 1
 * @type number
 * @max 11
 *
 * @help CharacterPicture.js
 *
 * キャラクターグラフィックをピクチャとして表示できます。
 * プラグインコマンドからキャラクターグラフィックを指定後
 * ピクチャの表示を空ファイルで表示すると対応するグラフィックが
 * ピクチャとして表示されます。
 *
 * コマンドで指定するセル番号とは、アニメパターンと向きに対応した番号で
 * 左上から右下に向かって0～11の番号が割り当てられています。
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

    PluginManagerEx.registerCommand(script, 'SET_CHARACTER_PICTURE', args => {
        $gameScreen.setCharacterPicture(args.imageFile, args.index, args.cell);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_CELL_NUMBER', args => {
        const pictureId = args.pictureId;
        const cell = args.cell % 12;
        $gameScreen.picture(pictureId)?.setCharacterCell(cell);
    });

    //=============================================================================
    // Game_Screen
    //  事前設定ピクチャ名を保持します。
    //=============================================================================
    Game_Screen.prototype.setCharacterPicture = function(imageFile, index, cell) {
        this._characterPicture = {
            imageFile: imageFile, index: index, cell: cell
        }
    };

    Game_Screen.prototype.getCharacterPicture = function() {
        const picture = this._characterPicture;
        this._characterPicture = null;
        return picture;
    };

    //=============================================================================
    // Game_Picture
    //  事前設定ピクチャ名を取得します。
    //=============================================================================
    const _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        this._characterInto = null;
        if (!name) {
            const characterInfo = $gameScreen.getCharacterPicture();
            if (characterInfo) {
                this._characterInto = characterInfo;
                arguments[0] = `CHARACTER[${characterInfo.imageFile}:${characterInfo.index}]`;
                this.setCharacterCell(characterInfo.cell);
            }
        }
        _Game_Picture_show.apply(this, arguments);
    };

    Game_Picture.prototype.characterInfo = function() {
        return this._characterInto;
    };

    Game_Picture.prototype.setCharacterCell = function(number) {
        this._characterCell = number;
    };

    Game_Picture.prototype.getCharacterCell = function() {
        return this._characterCell;
    }

    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        const picture = this.picture();
        const info = picture?.characterInfo();
        if (info) {
            const fileName = info.imageFile
            this.bitmap = ImageManager.loadCharacter(fileName);
            this._isBigCharacter = ImageManager.isBigCharacter(fileName);
            this._cellNumber = info.cell;
            this.updateCharacterFrame();
        } else {
            this._cellNumber = -1;
            this.setFrame(0, 0, 0, 0);
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    const _Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;
    Sprite_Picture.prototype.updateOther = function() {
        _Sprite_Picture_updateOther.apply(this, arguments);
        const picture = this.picture();
        if (picture && picture.characterInfo() && picture.getCharacterCell() !== this._cellNumber) {
            this._cellNumber = picture.getCharacterCell();
            this.updateCharacterFrame();
        }
    };

    Sprite_Picture.prototype.updateCharacterFrame = function() {
        this.bitmap.addLoadListener(() =>{
            const pw = this.patternWidth();
            const ph = this.patternHeight();
            const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
            const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
            this.setFrame(sx, sy, pw, ph);
        });
    };

    Sprite_Picture.prototype.characterBlockX = function() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this.picture().characterInfo().index;
            return (index % 4) * 3;
        }
    };

    Sprite_Picture.prototype.characterBlockY = function() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this.picture().characterInfo().index;
            return Math.floor(index / 4) * 4;
        }
    };

    Sprite_Picture.prototype.characterPatternX = function() {
        return this._cellNumber % 3;
    };

    Sprite_Picture.prototype.characterPatternY = function() {
        return Math.floor(this._cellNumber / 3);
    };

    Sprite_Picture.prototype.patternWidth = function() {
        if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / 12;
        }
    };

    Sprite_Picture.prototype.patternHeight = function() {
        if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    };
})();
