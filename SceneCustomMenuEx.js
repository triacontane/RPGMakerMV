/*=============================================================================
 SceneCustomMenuEx.js
----------------------------------------------------------------------------
 (C)${YEAR} Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/10/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc カスタムメニュープラグイン改造テンプレート
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneCustomMenuEx.js
 * @base SceneCustomMenu
 * @orderAfter SceneCustomMenu
 * @author トリアコンタン
 *
 * @help SceneCustomMenuEx.js
 *
 * カスタムメニュープラグインを改造するためのテンプレートです。
 * Window_CustomMenuにメソッドを追加することで
 * 複雑なウィンドウの描画処理を外部定義できます。
 *
 */
(()=> {

    /**
     * 既存メソッドを書き換えたい場合
     */
    const _Window_CustomMenu_drawItem = Window_CustomMenu.prototype.drawItem;
    Window_CustomMenu.prototype.drawItem = function(index) {
        _Window_CustomMenu_drawItem.apply(this, arguments);
    };

    /**
     * メソッドを追加したい場合
     * [methodName]を自由に変更します。
     *
     * 呼び出し例:
     * this.methodName();
     */
    Window_CustomMenu.prototype.methodName = function() {
        console.log('test');
    };
})();

