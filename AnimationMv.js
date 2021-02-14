/*=============================================================================
 AnimationMv.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.3 2021/02/14 使用素材リストのパラメータに効果音を追加
 1.2.2 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.2.1 2020/11/07 1.2.0の修正によりコピー用のプロジェクトを指定しないとエラーになる問題を修正
 1.2.0 2020/10/16 コピー処理を非同期処理に変更。MVプロジェクトからの自動移行が高速になりました。
                  VisuMZ_1_BattleCore.js利用時、画面全体に表示するアニメーションが左上に表示されるバグを代わりに修正
 1.1.1 2020/08/29 1.1.0の修正でブラウザ実行でエラーになっていた問題を修正
 1.1.0 2020/08/16 MVプロジェクトを指定するだけで必要ファイルを自動コピーできる機能を追加
 1.0.0 2020/06/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc MV Animation Plugin
 * @author Triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationMv.js
 *
 * @param AnimationList
 * @text Animation List
 * @desc The list of the animation material to be used. Registering it will exclude it from the "Exclude unused files" option.
 * @default []
 * @dir img/animations/
 * @type file[]
 *
 * @param SeList
 * @text SE List
 * @desc The list of the SE material to be used. Registering it will exclude it from the "Exclude unused files" option.
 * @default []
 * @dir audio/se/
 * @type file[]
 *
 * @param MvProjectPathText
 * @text The absolute path of MV project.
 * @desc The path of the MV project to edit the animation. If you leave it empty, auto-copying will be disabled.
 * @default
 *
 * @param NoCopyImageFile
 * @text Images do not copy
 * @desc No longer auto-copy animated image files. Useful if the copying is taking a long time.
 * @default false
 * @type boolean
 *
 * @help AnimationMv.js
 * It can be used in conjunction with the new MZ playback method with the MV animation playback method.
 *
 * Editing the animation data in the editor of RPGMaker MV
 * Specify the path to your MV project from the parameter.
 * During test play, the images under "img/animations" and "data/Animations.json" 
 * will be stored in it will be copied automatically into your MZ project.
 * Animations.json" will be copied to "mv/Animations.json".
 *
 * Particle Effects, Sound Effects, and Flash in the MZ database.
 * If it is created with everything empty (i.e., newly created), it will play the animation of the MV.
 *
 * This plugin uses the global variable "$dataMvAnimations".
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
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
 * @text アニメーションリスト
 * @desc 使用するアニメーション素材のリストです。登録しておけば未使用素材削除の対象から外れます。
 * @default []
 * @dir img/animations/
 * @type file[]
 *
 * @param SeList
 * @text 効果音リスト
 * @desc 使用する効果音素材のリストです。登録しておけば未使用素材削除の対象から外れます。
 * @default []
 * @dir audio/se/
 * @type file[]
 *
 * @param MvProjectPathText
 * @text MVプロジェクトの絶対パス
 * @desc アニメーションを編集するMVプロジェクトのパスです。空にすると自動コピーが無効になります。
 * @default
 *
 * @param NoCopyImageFile
 * @text 画像はコピーしない
 * @desc アニメーション画像ファイルを自動コピーしなくなります。コピーに時間が掛かっている場合に有効です。
 * @default false
 * @type boolean
 *
 * @help AnimationMv.js
 * RPGツクールMVのアニメーション再生方式と新しいMZの再生方式との併用できます。
 *
 * RPGツクールMVのエディタでアニメーションデータを編集して、
 * パラメータからMVプロジェクトのパスを指定してください。
 * テストプレー時に『img/animations』以下の画像と『data/Animations.json』が
 * MZプロジェクトに自動でコピーされます。
 * 『Animations.json』は『mv/Animations.json』にコピーされます。
 *
 * MZ側のデータベースで『パーティクルエフェクト』『効果音』『フラッシュ』を
 * 全て空の状態(新規作成の状態)で作成すると、MVのアニメーションを再生します。
 *
 * 本プラグインはグローバル変数『$dataMvAnimations』を使用します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    const variableName = '$dataMvAnimations';
    const variableSrc = 'mv/Animations.json';

    /**
     * MvFileCopyUtil
     *  MVのプロジェクトからファイルをコピーするユーティリティクラスです。
     */
    class MvFileCopyUtil {
        static async copyMvAnimationData() {
            if (!this.isAnyTest() || !param.MvProjectPathText) {
                DataManager.loadDataFile(variableName, variableSrc);
                return false;
            }
            await this.copyAllFiles('data/', 'data/mv/', /Animations.json/);
            DataManager.loadDataFile(variableName, variableSrc);
            if (!param.NoCopyImageFile) {
                await this.copyAllFiles('img/animations/', 'img/animations/');
            }
            return true;
        }

        static fileDirectoryPath(directory) {
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            return path.join(base, `${directory}/`);
        }

        static async copyAllFiles(src, dist, regExp) {
            const srcPath = require('path').join(param.MvProjectPathText, src);
            const destPath = this.fileDirectoryPath(dist);
            const copyModel = new FileCopyModel(srcPath, destPath);
            await copyModel.copyAllFiles(regExp);
        }

        static isAnyTest() {
            return Utils.isNwjs() &&
                (Utils.isOptionValid('test') || DataManager.isBattleTest() || DataManager.isEventTest());
        }
    }

    /**
     * FileCopyModel
     * 再帰的な非同期ファイルコピーを実装します。
     */
    class FileCopyModel {
        constructor(src, dist) {
            this._fs = require('fs').promises;
            this._src = src;
            this._dist = dist;
        }

        async copyAllFiles(fileReqExp = null) {
            await this._fs.mkdir(this._dist, {recursive: true});
            const dirents = await this._fs.readdir(this._src, {withFileTypes: true});
            for (const dirent of dirents) {
                const name = dirent.name;
                if (fileReqExp && !fileReqExp.test(name)) {
                    continue;
                }
                if (dirent.isDirectory()) {
                    await this._copyDirectory(name + '/');
                } else {
                    await this._copyFile(name);
                }
            }
        }

        async _copyDirectory(dirName) {
            const path = require('path');
            const src = path.join(this._src, dirName);
            const dist = path.join(this._dist, dirName);
            await this._fs.mkdir(dist, {recursive: true});
            const subCopyModel = new FileCopyModel(src, dist);
            await subCopyModel.copyAllFiles();
        }

        async _copyFile(fileName) {
            const src = this._src + fileName;
            const dist = this._dist + fileName;
            await this._fs.copyFile(src, dist);
        }
    }

    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        this.loadAnimationData();
        _DataManager_loadDatabase.apply(this, arguments);
    };

    DataManager.loadAnimationData = function() {
        MvFileCopyUtil.copyMvAnimationData().then(result => {
            if (result) {
                console.log('Animation file copy complete.');
            }
        }).catch(error => {
            if (error.code === 'ENOENT') {
                PluginManagerEx.throwError(`Invalid MV Project Path :${param.MvProjectPathText}`, script);
            } else {
                throw error;
            }
        });
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

    const _Sprite_AnimationMV_updatePosition = Sprite_AnimationMV.prototype.updatePosition;
    Sprite_AnimationMV.prototype.updatePosition = function() {
        _Sprite_AnimationMV_updatePosition.apply(this, arguments);
        if (this._animation.position === 3) {
            this.x = Graphics.boxWidth / 2;
            this.y = Graphics.boxHeight / 2;
        }
    }
})();
