//=============================================================================
// TitleImageChange.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2022/01/16 ゲーム進行度のみ保存のコマンドを使って保存したとき、保存先のセーブファイルIDが間違っていた問題を修正
// 2.0.0 2021/01/16 MZで動作するよう全面的に修正
// 1.4.5 2020/03/01 進行度変数の値を戻したときに、リロードするまで元のタイトル画面に戻らない問題を修正
// 1.4.4 2018/07/11 1.4.3の修正でタイトル画面が変更される条件を満たした状態でセーブ後にタイトルに戻るで再表示しても変更が反映されない問題を修正
// 1.4.3 2018/06/09 セーブファイル数の上限を大きく増やしている場合にタイトル画面の表示が遅くなる現象を修正
// 1.4.2 2018/04/26 ニューゲーム開始後、一度もセーブしていないデータで進行状況のみをセーブするスクリプトを実行しても設定が反映されない問題を修正
// 1.4.1 2017/07/20 1.4.0で追加した機能で画像やBGMを4つ以上しないとタイトルがずれてしまう問題を修正
// 1.4.0 2017/02/12 画像やBGMを4つ以上指定できる機能を追加
// 1.3.1 2017/02/04 簡単な競合対策
// 1.3.0 2017/02/04 どのセーブデータの進行度を優先させるかを決めるための優先度変数を追加
// 1.2.1 2016/12/17 進行状況のみセーブのスクリプトを実行した場合に、グローバル情報が更新されてしまう問題を修正
// 1.2.0 2016/08/27 進行状況に応じてタイトルBGMを変更できる機能を追加
// 1.1.0 2016/06/05 セーブデータに歯抜けがある場合にエラーが発生する問題を修正
//                  進行状況のみをセーブする機能を追加
// 1.0.0 2016/04/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TitleImageChange
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleImageChange.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param StoryPhaseVariable
 * @text StoryPhaseVariable
 * @desc The variable number where the game progress is stored.
 * @default 1
 * @type variable
 *
 * @param PriorityVariable
 * @text PriorityVariable
 * @desc This is a variable number that determines which saved data has priority over the story phase.
 * @default 0
 * @type variable
 *
 * @param TitleList
 * @text TitleList
 * @desc This is a list of the title screen and BGM.
 * @default []
 * @type struct<TitleSet>[]
 *
 * @command SAVE_STORY_PHASE
 * @text SAVE_STORY_PHASE
 * @desc Saves only the progress without saving the game data.
 *
 * @help TitleImageChange.js
 *
 * Changes the title screen image and BGM according to the game progress (an arbitrary variable).
 * The game progress will reflect the maximum value among all saved data.
 * However, if a priority variable is specified separately, the image and BGM will be determined
 * based on the game progress of the saved data with the highest priority variable.
 * Multiple title images and BGMs can be specified in a list format, and when multiple
 * conditions are met at once, the one at the bottom of the list will take priority.
 *
 * If you want to save only the progress without saving the game data, you can use a special plug-in command.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 */

/*:ja
 * @plugindesc タイトル画面変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleImageChange.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param StoryPhaseVariable
 * @text 進行度変数
 * @desc ゲーム進行度が格納される変数番号です。
 * @default 1
 * @type variable
 *
 * @param PriorityVariable
 * @text 優先度変数
 * @desc 複数のセーブデータが存在するとき、どのセーブデータのゲーム進行度を優先するかを決める変数番号です。
 * @default 0
 * @type variable
 *
 * @param TitleList
 * @text タイトルリスト
 * @desc 進行度変数の値によって変動するタイトル画面とBGMのリストです。
 * @default []
 * @type struct<TitleSet>[]
 *
 * @command SAVE_STORY_PHASE
 * @text ゲーム進行度のみ保存
 * @desc ゲームデータをセーブせず進行状況のみをセーブします。
 *
 * @help TitleImageChange.js
 *
 * ゲーム進行度(任意の変数)に応じてタイトル画面の画像およびBGMを変更します。
 * ゲーム進行度は全セーブデータの中の最大値が反映されます。
 * ただし、優先度変数が別途指定されている場合は、優先度変数が最も大きい
 * セーブデータのゲーム進行度をもとに画像、BGMが決まります。
 * タイトル画像とBGMはリスト形式で複数指定可能で、
 * 複数の条件を一度に満たしたときはリストの下の方が優先されます。
 *
 * ゲームデータをセーブせず進行状況のみをセーブしたい場合は、
 * 専用のプラグインコマンドを実行します。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~TitleSet:
 *
 * @param StoryPhaseCondition
 * @text 進行度条件
 * @desc 進行度変数の値がこの値以上なら指定した画像とBGMになります。
 * @default 1
 *
 * @param TitleImage
 * @text タイトル画像
 * @desc 条件を満たしたときに表示されるタイトル画像(img/titles1)のファイル名です。
 * @default
 * @dir img/titles1/
 * @type file
 *
 * @param TitleBgm
 * @text タイトルBGM
 * @desc 条件を満たしたときに演奏されるBGM(audio/bgm)のファイル名です。
 * @default
 * @dir audio/bgm/
 * @type file
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.TitleList) {
        PluginManagerEx.throwError('TitleList not found.', script);
    }

    PluginManagerEx.registerCommand(script, 'SAVE_STORY_PHASE', () => {
        const id = $gameSystem.savefileId();
        if (id > 0) {
            DataManager.saveOnlyGradeVariable(id);
        }
    });

    //=============================================================================
    // DataManager
    //  ゲーム進行状況を保存します。
    //=============================================================================
    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo      = function() {
        const info = _DataManager_makeSavefileInfo.apply(this, arguments);
        this.setGradeVariable(info);
        return info;
    };

    DataManager.getFirstPriorityGradeVariable = function() {
        const globalInfo = this._globalInfo || [];
        const sortedGlobalInfo = globalInfo.clone().sort(this._compareOrderForGradeVariable);
        if (sortedGlobalInfo[0]) {
            return sortedGlobalInfo[0].storyPhaseVariable || 0;
        }
        return 0;
    };

    DataManager._compareOrderForGradeVariable = function(a, b) {
        if (!a) {
            return 1;
        } else if (!b) {
            return -1;
        } else if (a.priorityVariable !== b.priorityVariable && param.PriorityVariable > 0) {
            return (b.priorityVariable || 0) - (a.priorityVariable || 0);
        } else {
            return (b.storyPhaseVariable || 0) - (a.storyPhaseVariable || 0);
        }
    };

    DataManager.saveOnlyGradeVariable = function(saveFileId) {
        const globalInfo = this._globalInfo || [];
        if (globalInfo[saveFileId]) {
            this.setGradeVariable(globalInfo[saveFileId]);
        } else {
            globalInfo[saveFileId] = this.makeSavefileInfo();
        }
        this.saveGlobalInfo(globalInfo);
    };

    DataManager.setGradeVariable = function(info) {
        info.storyPhaseVariable = $gameVariables.value(param.StoryPhaseVariable);
        info.priorityVariable = $gameVariables.value(param.PriorityVariable);
    };

    //=============================================================================
    // Scene_Title
    //  進行状況が一定以上の場合、タイトル画像を差し替えます。
    //=============================================================================
    const _Scene_Title_initialize      = Scene_Title.prototype.initialize;
    Scene_Title.prototype.initialize = function() {
        _Scene_Title_initialize.apply(this, arguments);
        const storyPhase = DataManager.getFirstPriorityGradeVariable();
        this.changeTitleImage(storyPhase);
        this.changeTitleBgm(storyPhase);
    };

    Scene_Title.prototype.changeTitleImage = function(storyPhase) {
        if ($dataSystem.originalTitle1Name !== undefined) {
            $dataSystem.title1Name = $dataSystem.originalTitle1Name;
        }
        param.TitleList.forEach(set => {
            if (set.TitleImage && storyPhase >= set.StoryPhaseCondition) {
                $dataSystem.originalTitle1Name = $dataSystem.title1Name;
                $dataSystem.title1Name = set.TitleImage;
            }
        });
    };

    Scene_Title.prototype.changeTitleBgm = function(storyPhase) {
        if ($dataSystem.titleBgm.originalName !== undefined) {
            $dataSystem.titleBgm.name = $dataSystem.titleBgm.originalName;
        }
        param.TitleList.forEach(set => {
            if (set.TitleBgm && storyPhase >= set.StoryPhaseCondition) {
                $dataSystem.titleBgm.originalName = $dataSystem.titleBgm.name;
                $dataSystem.titleBgm.name = set.TitleBgm;
            }
        });
    };
})();

