/*=============================================================================
 AnimationMv.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
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
        static copyMvAnimationData() {
            const mvRoot = param.MvProjectPathText;
            if (!this.isNeedFileCopy() || !mvRoot) {
                return ;
            }
            if (!this.getFs().existsSync(mvRoot + '/index.html')) {
                PluginManagerEx.throwError(`Invalid MV Project Path :${mvRoot}`, script);
            }
            this.copyMvAnimationJson(mvRoot);
            if (!param.NoCopyImageFile) {
                this.copyMvAnimationImage(mvRoot);
            }
        }

        static getFs() {
            return require('fs')
        }

        static getPath() {
            return require('path')
        }

        static copyMvAnimationJson(mvRoot) {
            const srcPath = this.getPath().join(mvRoot, 'data/');
            const destPath = this.fileDirectoryPath('data/mv/');
            StorageManager.fsMkdir(destPath);
            this.copyFile(srcPath, destPath, 'Animations.json');
        }

        static copyMvAnimationImage(mvRoot) {
            const srcPath = this.getPath().join(mvRoot, 'img/animations/');
            const destPath = this.fileDirectoryPath('img/animations/');
            StorageManager.fsMkdir(destPath);
            this.copyAllFiles(srcPath, destPath, 'Animations.json');
        }

        static fileDirectoryPath(directory) {
            const base = this.getPath().dirname(process.mainModule.filename);
            return this.getPath().join(base, `${directory}/`);
        }

        static copyAllFiles(originalPath, targetPath) {
            const copyFile = this.copyFile.bind(this, originalPath, targetPath);
            this.getFs().readdir(originalPath, function(error, list) {
                if (error || !list) {
                    console.warn(error);
                    return;
                }
                list.forEach(function(fileName) {
                    copyFile(fileName);
                });
            });
        }

        static copyFile(originalPath, targetPath, fileName) {
            this.getFs().copyFileSync(originalPath + fileName, targetPath + fileName);
        }

        static isNeedFileCopy() {
            return Utils.isOptionValid('test') || DataManager.isBattleTest() || DataManager.isEventTest();
        }
    }

    DataManager._databaseFiles.push({ name: variableName, src: variableSrc });

    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        if (Utils.isNwjs()) {
            MvFileCopyUtil.copyMvAnimationData();
        }
        _DataManager_loadDatabase.apply(this, arguments);
    };

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
