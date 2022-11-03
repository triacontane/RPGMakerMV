/*=============================================================================
 SceneCustomMenuEx.js
----------------------------------------------------------------------------
 (C)2022 Triacontane, (改造したらここに作者名を追加)
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/10/27 テンプレート作成
=============================================================================*/

/*:
 * @plugindesc カスタムメニュープラグイン改造テンプレート
 * @author 作者名を入れます
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

