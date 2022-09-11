/*=============================================================================
 TraitTotalization.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 特徴の全体化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraitTotalization.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param battleMemberOnly
 * @text 戦闘メンバーのみ
 * @desc 全体化の対象を戦闘メンバーに限定します。無効にすると非戦闘メンバーの特徴も全体化します。
 * @type boolean
 * @default true
 *
 * @help TraitTotalization.js
 *
 * 指定したステートや装備品の特徴がパーティ全員に適用されます。
 * アクター、職業、敵キャラ、武具、ステートのメモ欄に以下の通り記述します。
 * <TraitTotal>
 * <特徴全体化>
 *　
 * 全体化されるのは特徴のみなのでステートや装備品のパラメータ増減などは
 * 他メンバーには影響しません。
 * 同一の全体化ステートや装備品が複数適用された場合、特徴の効果は重複しません。
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
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Unit
    //  全体化ステートを対象メンバーを取得します。
    //=============================================================================
    Game_Unit.prototype.getTraitTotalMember = function() {
        return this.members();
    };

    Game_Party.prototype.getTraitTotalMember = function() {
        return param.battleMemberOnly ? Game_Unit.prototype.getTraitTotalMember.call(this) : this.allMembers();
    };

    let subject = null;

    //=============================================================================
    // Game_BattlerBase
    //  全体化ステートを追加定義します。
    //=============================================================================
    const _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    Game_BattlerBase.prototype.traitObjects = function() {
        const objects = _Game_BattlerBase_traitObjects.apply(this, arguments);
        if (this.isDead() || (subject !== this && subject !== null)) {
            return objects;
        }
        subject = this;
        const addObjects = this.traitTotalObjects();
        subject = null;
        return Array.from(new Set(objects.concat(addObjects)));
    };

    Game_BattlerBase.prototype.traitTotalObjects = function() {
        return this.friendsUnit().getTraitTotalMember().reduce((objList, member) => {
            if (member !== this) {
                const addList = member.traitObjects()
                    .filter(obj => PluginManagerEx.findMetaValue(obj, ['特徴全体化', 'TraitTotal']));
                return objList.concat(addList);
            }
            return objList;
        }, []);
    };
})();
