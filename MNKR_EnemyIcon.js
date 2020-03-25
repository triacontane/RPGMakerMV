/*:
 * @param Default Icon
 * @text デフォルトアイコン
 * @type string
 * @desc メモタグを入れない場合に表示するアイコン。デフォルト16
 * 0にすると、非表示で左に詰まります。
 * @default 16
 *
 * @plugindesc 戦闘画面で敵キャラの名前の前にアイコンを表示します。
 * @help
 * 戦闘画面で敵キャラの名前の前にアイコンを表示します。
 *
 * 敵キャラのメモ欄に下記のようにタグを入れてください。
 * <EnemyIcon:アイコンID>
 *
 * 例
 * <EnemyIcon:64>
 *
 * 利用規約
 * 作者としての著作権を放棄します。
 * パブリックドメインです。
 *
 */

(function() {
	'use strict';
	var parameters = PluginManager.parameters('MNKR_EnemyIcon');
	var defaultIcon = parseInt(parameters['Default Icon'] || 16);

    Window_BattleEnemy.prototype.drawItem = function(index) {
        this.resetTextColor();
        const enemy = this._enemies[index];
        var name = enemy.name();
        var rect = this.itemRectForText(index);
        var icon = parseInt(enemy.enemy().meta.EnemyIcon);
        if (icon) {
            var iconBoxWidth = Window_Base._iconWidth + 4;
            this.drawIcon(icon, rect.x + 2, rect.y + 2);
            this.drawText(name, rect.x + iconBoxWidth, rect.y, rect.width - iconBoxWidth);
            return index;
        }
        if (defaultIcon === 0) {
            this.drawText(name, rect.x, rect.y, rect.width);
            return index;
        }
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.drawIcon(defaultIcon, rect.x + 2, rect.y + 2);
        this.drawText(name, rect.x + iconBoxWidth, rect.y, rect.width - iconBoxWidth);
    };
    
})();