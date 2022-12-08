//=============================================================================
// MessageSelectPicture.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2022/12/08 選択肢ピクチャに同一のピクチャ番号を指定できるよう修正
// 2.0.0 2021/05/22 MZで動作するようプラグインコマンド周りの処理を修正
// 1.2.4 2020/07/12 1.2.3の対応で選択肢をイベントコマンドの上限を超えて指定すると正常に機能しない問題を修正
// 1.2.3 2020/07/12 MPP_ChoiceEX.jsと併用したとき、非表示の選択肢があると選択肢と表示ピクチャとがズレる競合を修正
// 1.2.2 2019/09/29 ピクチャ選択と無関係な選択肢を選択後に、ピクチャ選択肢のコマンドを実行すると
//                  以前に選択した選択肢の番号に対応するピクチャが一瞬表示される問題を修正
// 1.2.1 2019/04/07 1.2.0で選択肢のインデックスが1つずれていた問題を修正
// 1.2.0 2019/04/07 複数のピクチャを選択肢に関連づけられる機能を追加
// 1.1.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.1.0 2016/02/20 選択肢拡張プラグイン（MPP_ChoiceEX.js）に対応
// 1.0.2 2016/01/24 マウス操作でピクチャが更新されない問題を修正
// 1.0.1 2016/01/24 起動しないバグ修正(笑)
// 1.0.0 2016/01/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 選択肢のピクチャ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageSelectPicture.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_UP
 * @text セットアップ
 * @desc 選択肢ピクチャの情報をセットアップします。設定は選択肢の表示を行うと解除されます。
 *
 * @arg pictureIdList
 * @text ピクチャ番号リスト
 * @desc 選択肢に対応するピクチャ番号を定義します。
 * @default []
 * @type number[]
 *
 * @help MessageSelectPicture.js
 *
 * イベントコマンド「選択肢の表示」で選択肢にカーソルを合わせた際に
 * 選択肢に対応するピクチャを表示するようにします。
 *
 * あらかじめ不透明度0でピクチャを表示したうえで
 * プラグインコマンドを実行して、関連づけを指定してください。
 *
 * 選択肢を決定後、プラグイン側でピクチャを非表示にすることはないので
 * 自由にイベントコマンドで操作してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SET_UP', args => {
        args.pictureIdList.forEach((pictureId, index) => {
            $gameMessage.setSelectPictureId(index, pictureId);
        });
    });

    const _Game_Message_initialize      = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this.clearSelectPictures();
    };

    Game_Message.prototype.setSelectPictureId = function(index, pictureId) {
        this._selectPictures.push({index: index, pictureId: pictureId});
    };

    Game_Message.prototype.clearSelectPictures = function() {
        this._selectPictures = [];
    };

    Game_Message.prototype.getSelectPictures = function() {
        return this._selectPictures;
    };

    const _Game_Message_onChoice      = Game_Message.prototype.onChoice;
    Game_Message.prototype.onChoice = function(n) {
        _Game_Message_onChoice.apply(this, arguments);
        this.clearSelectPictures();
    };

    Game_Picture.prototype.setOpacity = function(value) {
        this._opacity = value;
    };

    const _Window_ChoiceList_update      = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        _Window_ChoiceList_update.apply(this, arguments);
        if (this.isOpen()) {
            this.updateSelectPicture();
        }
    };

    Window_ChoiceList.prototype.updateSelectPicture = function() {
        let selectedPictureId = 0;
        $gameMessage.getSelectPictures().forEach(function(data) {
            const picture = $gameScreen.picture(data.pictureId);
            if (!picture) {
                return;
            }
            const selected = data.index === this.findMessageIndex() || data.pictureId === selectedPictureId;
            if (selected) {
                selectedPictureId = data.pictureId;
            }
            picture.setOpacity(selected ? 255 : 0);
        }, this);
    };

    // for MPP_ChoiceEX.js start
    Window_ChoiceList.prototype.findMessageIndex = function() {
        let index = this.index();
        if ($gameMessage.hiddenIndexList) {
            $gameMessage.hiddenIndexList.forEach(function(hidden, i) {
                if (hidden && index >= i) {
                    index++;
                }
            });
        }
        return index;
    };

    const _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        if (this.addChoices) {
            $gameMessage.hiddenIndexList = [];
        }
        _Game_Interpreter_setupChoices.apply(this, arguments);
    };

    const _Game_Interpreter_addChoices = Game_Interpreter.prototype.addChoices;
    Game_Interpreter.prototype.addChoices = function(params, i, data, d) {
        const regIf = /\s*if\((.+?)\)/;
        const hiddenIndexList = $gameMessage.hiddenIndexList;
        for (let n = 0; n < params[0].length; n++) {
            let str = params[0][n];
            if (regIf.test(str)) {
                str = str.replace(regIf, '');
                hiddenIndexList.push(RegExp.$1 && !this.evalChoice(RegExp.$1));
            } else {
                hiddenIndexList.push(false);
            }
        }
        return _Game_Interpreter_addChoices.apply(this, arguments);
    }
    // for MPP_ChoiceEX.js end
})();
