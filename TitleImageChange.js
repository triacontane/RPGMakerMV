//=============================================================================
// TitleImageChange.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.3.0 2025/05/07 タイトルBGMの音量、ピッチ、左右バランスを指定できる機能を追加
// 3.2.0 2024/07/28 タイトル画面2を進行状況に応じて変更する機能を追加
// 3.1.0 2024/07/27 タイトルコールと組み合わせてタイトルコールを演奏する機能を追加
// 3.0.2 2022/05/20 進行度をクリアするコマンドを追加
// 3.0.1 2022/02/19 3.0.0でブラウザ環境で正常にゲームが起動できない問題を修正
// 3.0.0 2022/02/15 一度もセーブしていない状態で進行度を保存した場合を考慮するため、データの持ち方を変更
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
 * @orderAfter PluginCommonBase
 * @orderAfter TitleCall
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
 * @command CLEAR_STORY_PHASE
 * @text CLEAR_STORY_PHASE
 * @desc
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
 * @orderAfter PluginCommonBase
 * @orderAfter TitleCall
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
 * @command CLEAR_STORY_PHASE
 * @text 進行度クリア
 * @desc 進行度の保存情報をクリアし、デフォルトのタイトルに戻します。
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
 * @param Title2Image
 * @text タイトル画像2
 * @desc 条件を満たしたときに表示されるタイトル画像2(img/titles2)のファイル名です。
 * @default
 * @dir img/titles2/
 * @type file
 *
 * @param TitleBgm
 * @text タイトルBGM
 * @desc 条件を満たしたときに演奏されるBGM(audio/bgm)のファイル名です。
 * @default
 * @dir audio/bgm/
 * @type file
 *
 * @param TitleBgmVolume
 * @text タイトルBGM音量
 * @desc タイトルBGMの音量です。0～100の範囲で指定してください。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param TitleBgmPitch
 * @text タイトルBGMピッチ
 * @desc タイトルBGMのピッチです。50～150の範囲で指定してください。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param TitleBgmPan
 * @text タイトルBGM位相
 * @desc タイトルBGMの位相(左右バランス)です。-100～100の範囲で指定してください。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @param TitleCall
 * @text タイトルコール
 * @desc 条件を満たしたときに演奏されるタイトルコールです。別途「タイトルコールプラグイン」が必要です。
 * @default
 * @type file
 * @dir audio/se/
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.TitleList) {
        PluginManagerEx.throwError('TitleList not found.', script);
    }

    PluginManagerEx.registerCommand(script, 'SAVE_STORY_PHASE', () => {
        DataManager.saveTitleInfo();
    });

    PluginManagerEx.registerCommand(script, 'CLEAR_STORY_PHASE', () => {
        DataManager.clearTitleInfo();
    });

    //=============================================================================
    // DataManager
    //  ゲーム進行状況を保存します。
    //=============================================================================
    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo      = function() {
        this.saveTitleInfo();
        return _DataManager_makeSavefileInfo.apply(this, arguments);
    };

    DataManager.getFirstPriorityGradeVariable = function() {
        // 進行度データをglobalInfoに保持する設計を見直したが、後方互換性のため取得している
        const titleInfoList = this._globalInfo.clone() || [];
        titleInfoList.push(this._titleInfo);
        const sortedGlobalInfo = titleInfoList.sort(this._compareOrderForGradeVariable);
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

    DataManager.saveTitleInfo = function() {
        const newTitleInfo = {};
        this.setGradeVariable(newTitleInfo);
        this._titleInfo = [this._titleInfo, newTitleInfo].sort(this._compareOrderForGradeVariable)[0];
        StorageManager.saveObject('titleInfo', this._titleInfo);
    };

    DataManager.clearTitleInfo = function() {
        this._titleInfo = {};
        StorageManager.saveObject('titleInfo', this._titleInfo);
    };

    DataManager.loadTitleInfo = function() {
        StorageManager.loadObject('titleInfo')
            .then(titleInfo => {
                this._titleInfo = titleInfo || {};
                return 0;
            })
            .catch(() => {
                this._titleInfo = {};
            });
    };

    DataManager.isTitleInfoLoaded = function() {
        return !!this._titleInfo;
    };

    DataManager.setGradeVariable = function(info) {
        info.storyPhaseVariable = $gameVariables.value(param.StoryPhaseVariable);
        info.priorityVariable = $gameVariables.value(param.PriorityVariable);
    };

    const _Scene_Boot_loadPlayerData = Scene_Boot.prototype.loadPlayerData;
    Scene_Boot.prototype.loadPlayerData = function() {
        _Scene_Boot_loadPlayerData.apply(this, arguments);
        DataManager.loadTitleInfo();
    };

    const _Scene_Boot_isPlayerDataLoaded = Scene_Boot.prototype.isPlayerDataLoaded;
    Scene_Boot.prototype.isPlayerDataLoaded = function() {
        return _Scene_Boot_isPlayerDataLoaded.apply(this, arguments) && DataManager.isTitleInfoLoaded();
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
            if (set.Title2Image && storyPhase >= set.StoryPhaseCondition) {
                $dataSystem.title2Name = set.Title2Image;
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
                if (set.TitleBgmVolume !== undefined) {
                    $dataSystem.titleBgm.volume = set.TitleBgmVolume;
                }
                if (set.TitleBgmPitch !== undefined) {
                    $dataSystem.titleBgm.pitch = set.TitleBgmPitch;
                }
                if (set.TitleBgmPan !== undefined) {
                    $dataSystem.titleBgm.pan = set.TitleBgmPan;
                }
            }
        });
    };

    const _Scene_Title_findTitleCall = Scene_Title.prototype.findTitleCall;
    Scene_Title.prototype.findTitleCall = function() {
        const call = _Scene_Title_findTitleCall.apply(this, arguments);
        const storyPhase = DataManager.getFirstPriorityGradeVariable();
        param.TitleList.forEach(set => {
            if (set.TitleCall && storyPhase >= set.StoryPhaseCondition) {
                call.name = set.TitleCall;
            }
            console.log(call.name);
        });
        return call;
    };
})();

