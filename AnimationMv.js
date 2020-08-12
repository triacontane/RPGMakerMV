/*=============================================================================
 AnimationMv.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/06/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc AnimationMvPlugin
 * @author triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://raw.githubusercontent.com/triacontane/RPGMakerMZ/master/js/plugins/AnimationMv.js
 *
 * @param AnimationList
 * @desc 使用するアニメーション素材のリストです。登録しておけば未使用素材削除の対象から外れます。
 * @default []
 * @dir img/animations/
 * @type file[]
 *
 * @help AnimationMv.js
 *
 * RPGツクールMVのアニメーション再生方式とMZの再生方式との併用を可能にします。
 *
 * MVのエディタでアニメーションを作成後、データファイル『Animation.json』を
 * コピーして『data/mv』フォルダ配下に配置してください。
 * また『img/animations』フォルダ以下にMV規格のアニメーション画像を
 * 配置してください。
 *
 * MZ側のデータベースで『パーティクルエフェクト』『効果音』『フラッシュ』を
 * 全て空の状態(新規作成の状態)で作成すると、MVのアニメーションを再生します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @target MZ
 * @plugindesc MVアニメーションプラグイン
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationMv.js
 *
 * @param AnimationList
 * @text アニメーション素材のリスト
 * @desc 使用するアニメーション素材のリストです。登録しておけば未使用素材削除の対象から外れます。
 * @default []
 * @dir img/animations/
 * @type file[]
 *
 * @help AnimationMv.js
 *
 * RPGツクールMVのアニメーション再生方式とMZの再生方式との併用を可能にします。
 *
 * MVのエディタでアニメーションを作成後、データファイル『Animation.json』を
 * コピーして『data/mv』フォルダ配下に配置してください。
 * また『img/animations』フォルダ以下にMV規格のアニメーション画像を
 * 配置してください。
 *
 * MZ側のデータベースで『パーティクルエフェクト』『効果音』『フラッシュ』を
 * 全て空の状態(新規作成の状態)で作成すると、MVのアニメーションを再生します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const variableName = '$dataMvAnimations';
    const variableSrc = 'mv/Animations.json';

    DataManager._databaseFiles.push({ name: variableName, src: variableSrc });

    const _DataManager_loadDataFile = DataManager.loadDataFile;
    DataManager.loadDataFile = function(name, src) {
        // for Battle Test
        if (name === variableName) {
            arguments[1] = variableSrc;
        }
        _DataManager_loadDataFile.apply(this, arguments);
    };

    const _Spriteset_Base_createAnimation = Spriteset_Base.prototype.createAnimation;
    Spriteset_Base.prototype.createAnimation = function(request) {
        const mzAnimations = $dataAnimations;
        if (isEmptyAnimation($dataAnimations[request.animationId])) {
            $dataAnimations = window[variableName];
        }
        _Spriteset_Base_createAnimation.apply(this, arguments);
        $dataAnimations = mzAnimations;
    };

    function isEmptyAnimation(animation) {
        return animation &&
            !animation.effectName &&
            animation.flashTimings.length === 0 &&
            animation.soundTimings.length === 0;
    }
})();
