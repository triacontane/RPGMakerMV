/*=============================================================================
 MarkerTileset.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2022/02/06 A1～A5のタイルセットを個別で非表示にできる機能を追加
 1.1.0 2021/09/23 MZ用にリファクタリング
 1.0.1 2020/06/03 イベントテストを実行するとエラーになる問題を修正
 1.0.0 2018/08/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc マーカータイルセットプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MarkerTileset.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help MarkerTileset.js
 *
 * タイルセットのうち特定の画像だけをゲーム上でのみ非表示にできます。
 * 主にエディタ上でのみ表示されるマーカーのような使い方ができます。
 *
 * タイルセットのメモ欄に以下の通り指定してください。
 * <非表示タイル:A> // [A]タブがゲーム上で非表示になります。Eまで指定可
 * <HiddenTiles:A>  // 同上
 *
 * 複数指定する場合は以下のようにカンマ区切りで指定してください。
 * <非表示タイル:A,B,D>
 *
 * 表示されなくなるのは画像だけで、通行可能判定等はそのまま残ります。
 *
 * Aタイルのなかでも特定の番号のタイルのみを対象にする場合は
 * 以下のように番号も指定してください。
 * <非表示タイル:A1>
 * <HiddenTiles:A1,A2,B>
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

(()=> {
    'use strict';

    /**
     * Game map 条件を満たした場合のタイルセットファイル名を空にします。
     */
    Game_Map._tilesetTags = {
        'a': [0, 1, 2, 3, 4], 'b': [5], 'c': [6], 'd': [7], 'e': [8],
        'a1': [0], 'a2': [1], 'a3': [2], 'a4': [3], 'a5': [4]
    };

    const _Game_Map_tileset      = Game_Map.prototype.tileset;
    Game_Map.prototype.tileset = function() {
        const tileset = _Game_Map_tileset.apply(this, arguments);
        if (tileset && !tileset.makerApplied) {
            this.hiddenMakerTiles(tileset);
        }
        return tileset;
    };

    Game_Map.prototype.hiddenMakerTiles = function(tileset) {
        const hiddenTiles = PluginManagerEx.findMetaValue(tileset, ['非表示タイル', 'HiddenTiles']);
        if (hiddenTiles) {
            const hiddenTileList = hiddenTiles.split(',');
            hiddenTileList.forEach(function(hiddenTile) {
                const indexList = Game_Map._tilesetTags[hiddenTile.toLowerCase()];
                if (!indexList) {
                    throw new Error(`Invalid tag name [${hiddenTile}]. Please set A, B, C, D, or E by MarkerTileset.js`);
                }
                indexList.forEach(function(index) {
                    tileset.tilesetNames[index] = '';
                });
            });
        }
        tileset.makerApplied = true;
    };
})();
