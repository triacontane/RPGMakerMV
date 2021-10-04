/*=============================================================================
 TemplateEvent.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.3 2021/10/05 1.1.2の修正で「固有イベント呼び出し」をページ番号[0]で呼び出したときエラーになる問題を修正
 1.1.2 2021/10/05 「マップイベント呼び出し」でページ番号を[0]で呼び出したとき、実行中のページではなく1ページが呼ばれてしまう問題を修正
 1.1.1 2021/08/11 「マップイベント呼び出し」のコマンドでイベント名を指定して呼び出せるよう修正
 1.1.0 2021/07/23 セルフ変数のキーに文字列を指定できるよう修正
 1.0.7 2021/05/29 1.0.6の修正で正常に機能しなくなっていた問題を修正
 1.0.6 2021/05/22 RandomDungeon.jsと共存できるよう修正
 1.0.5 2021/03/15 「セルフ変数の一括設定」のコマンドが正しく設定できていなかった問題を修正
 1.0.4 2020/12/08 メモ欄の統合が正常に機能しない不具合を修正
 1.0.3 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.0.2 2020/09/24 固有イベントによる設定上書きのメモ欄が機能しない問題を修正
                  上書き対象項目『向き』を有効にして上書きすると、テンプレートイベントの向き固定の設定が解除されてしまう問題を修正
 1.0.1 2020/08/26 ベースプラグインの説明を追加
 1.0.0 2020/07/25 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @base PluginCommonBase
 * @plugindesc Template Events
 * @author Triacontane
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TemplateEvent.js
 *
 * @param TemplateMapId
 * @text Template Map ID
 * @desc Template event is a map ID where the template event exists.
 * @default 1
 * @type number
 *
 * @param KeepEventId
 * @text Keep Event ID
 * @desc Maintains the caller's event ID when calling a map event. The behavior changes when the target is "This Event".
 * @default false
 * @type boolean
 *
 * @param OverrideTarget
 * @text Override Target
 * @desc Set the override target for the specified event in the Note field (prioritize the setting of specific events over template events).
 * @default
 * @type struct<override>
 *
 * @param AutoOverride
 * @text Auto Override
 * @desc Override the settings of "OverrideTarget" without the need to set the override in the memo field.
 * @default false
 * @type boolean
 *
 * @param IntegrateNote
 * @text Integrate Note
 * @desc Merge or overwrite the Note fields of template events and unique events.
 * @default 0
 * @type select
 * @option None
 * @value 0
 * @option Integrate
 * @value 1
 * @option Overwrite
 * @value 2
 *
 * @command CALL_ORIGIN_EVENT
 * @text Call origin event
 * @desc Call the original event processing to replace it. After processing is complete, return to the original processing.
 *
 * @arg pageIndex
 * @text Page Index
 * @desc The page index of the event to be called. A value of 0 calls the same number as the page being run.
 * @default 0
 * @type number
 *
 * @command CALL_MAP_EVENT
 * @text Call Map Event
 * @desc Call the processing of map events.
 *
 * @arg pageIndex
 * @text Page Index
 * @desc The page index of the event to be called. A value of 0 calls the same number as the page being run.
 * @default 0
 * @type number
 *
 * @arg eventId
 * @text Event ID
 * @desc The ID (or Name) of the event to be called. A value of 0 will target the event being executed.
 * @default 0
 *
 * @command SET_SELF_VARIABLE
 * @text Self Variable Manipulation
 * @desc Manipulate self variables.
 *
 * @arg index
 * @text Index
 * @desc The index of the self variable to be manipulated.
 * @default 1
 * @type number
 *
 * @arg type
 * @text Type of Operation
 * @desc Type of Operation.
 * @default 0
 * @type select
 * @option  0 : Set
 * @value 0
 * @option  1 : Add
 * @value 1
 * @option  2 : Subtract
 * @value 2
 * @option  3 : Multiply
 * @value 3
 * @option  4 : Division
 * @value 4
 * @option  5 : Modulo
 * @value 5
 *
 * @arg operand
 * @text Setting value
 * @desc The value to be set in the self variable.
 * @default 0
 *
 * @command SET_RANGE_SELF_VARIABLE
 * @text Set Range Self Variable
 * @desc Set range self variable.
 *
 * @arg startIndex
 * @text Start Index
 * @desc The starting index of the self variable to be operated on.
 * @default 1
 * @type number
 *
 * @arg endIndex
 * @text End Index
 * @desc The end index of the self variable to be operated on.
 * @default 1
 *
 * @arg type
 * @text Type of Operation
 * @desc Type of Operation.
 * @default 0
 * @type select
 * @option  0 : Set
 * @value 0
 * @option  1 : Add
 * @value 1
 * @option  2 : Subtract
 * @value 2
 * @option  3 : Multiply
 * @value 3
 * @option  4 : Division
 * @value 4
 * @option  5 : Modulo
 * @value 5
 *
 * @arg operand
 * @text Setting value
 * @desc The value to be set in the self variable.
 * @default 0
 *
 * @help TemplateEvent.js[Template Event Plugin]
 *
 * Can be templated for general use.
 * Template events should be defined on a specially prepared map.
 * It can be replaced dynamically with template events simply 
 * by making the prescribed description in the notes field of the actual event.
 *
 * You can also call the original event replaced from the template event.
 * It is useful if you want to handle only some unique processing, such as treasure chests and place-moving events.
 * Describe the event processing of the appearance and common parts of the event in a template event, and describe only the unique parts, 
 * such as item acquisition and location destination specification, in the original event.
 *
 * It also provides the function to call any map event as a common event.
 * You can specify an event to be called by ID and event name.
 *
 * Usage
 * 1.Create a template map and place the template events.
 *
 * 2.Describe the memo field of the event you want to replace in the template event.
 *   Both the ID and the event name can be specified.
 * <TE:1>   Replaced by an event in the template map ID[1].
 * <TE:aaa> Replaced by an event in the template map event name [aaa].
 * <TE:\v[1]> Replaced by an event in the template map ID [value of variable [1]].
 *
 * In principle, all settings except the initial placement will be replaced by template event settings.
 * If the memo field (*1) is written as an exception, any of the following settings will be overwritten by the unique event settings.
 * -Image
 * -Autonomous Movement
 * -Options
 * -Priority
 * -Trigger
 *
 * *1 Write the following in the memo section of the unique event.
 * <TEOverRide>
 *
 * -Self Variable Function
 * You can define self variables (variables specific to that event) for an event.
 * Operated from the plugin command, 
 * it can be used as a "Show Text" and event appearance "Conditions".
 * When used with "Show Text
 * Control Characters"\sv[n](n:Index)" to view.
 *
 * When used with "Conditions"
 * Make the target page's event command start with "Comment".
 * And please specify the conditions in the following format.
 * Multiple conditions can also be specified.
 *
 * \TE{Conditions}
 *
 * The "Conditions" are written in as JavaScript, control characters are available.
 * Example
 * \TE{\sv[1] >= 3}      # If the self variable [1] is greater than or equal to 3
 * \TE{\sv[2] === \v[1]} # If the self variable [2] is equal to the variable [1]
 * \TE{\sv[3] === 'AAA'} # If the self variable [3] is equal to 'AAA'
 *
 * When used in scripts such as "Conditional Branch"
 * You can get the index self variable specified in the script below.
 * this.getSelfVariable(n)
 * Example
 * this.getSelfVariable(1) !== 0 # If the self variable [1] is greater than or equal to 3
 *
 * You can use the control character \sv[n] in all plugin commands of this plugin.
 *
 * Script (call from event command "Script" or "Control Variables")
 * Get the ID and name of a template event during a unique processing call.
 *  this.character(0).getTemplateId();
 *  this.character(0).getTemplateName();
 *
 * Get the self variable for the specified index.
 *  this.getSelfVariable(index);
 *
 * Set the value to a self variable.
 * This script can also be executed in the "Set Movement Route".
 * If formulaFlg is set to true, evaluate operand as a formula.
 *  this.controlSelfVariable(index, type, operand, formulaFlg);
 *
 * Set the value to a self variable in bulk.
 * This script can also be executed in the "Set Movement Route".
 *  this.controlSelfVariableRange(start, end, type, operand, formulaFlg);
 *
 * Manipulate external event self variables.
 *  $gameSelfSwitches.setVariableValue([MapID, EventID, INDEX], Value);
 *
 * Get the self variable of an external event.
 *  $gameSelfSwitches.getVariableValue([MapID, EventID, INDEX]);
 *
 * When combined with "SAN_MapGenerator.js"
 * Define this plugin under "SAN_MapGenerator.js".
 *
 * You need the base plugin "PluginCommonBase.js" to use this plugin.
 * The "PluginCommonBase.js" is stored in the following folder under the installation folder of RPG Maker MZ.
 * dlc/BasicResources/plugins/official
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*~struct~override:
 *
 * @param Image
 * @text Image
 * @desc The event image and image index.
 * @type boolean
 * @default false
 *
 * @param Direction
 * @text Direction
 * @desc The direction of the event and the animation pattern.
 * @type boolean
 * @default false
 *
 * @param Move
 * @text Autonomous Movement
 * @desc Autonomous movement of the event
 * @type boolean
 * @default false
 *
 * @param Priority
 * @text Priority
 * @desc The priority of the event.
 * @type boolean
 * @default false
 *
 * @param Trigger
 * @text Trigger
 * @desc The trigger of the event.
 * @type boolean
 * @default false
 *
 * @param Option
 * @text Option
 * @desc The option of the event.
 * @type boolean
 * @default false
 */
/*:ja
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter RandomDungeon
 * @plugindesc テンプレートイベントプラグイン
 * @author トリアコンタン
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TemplateEvent.js
 *
 * @param TemplateMapId
 * @text テンプレートマップID
 * @desc テンプレートイベントが存在するマップIDです。
 * @default 1
 * @type number
 *
 * @param KeepEventId
 * @text イベントIDを維持
 * @desc マップイベントを呼び出す際に、呼び出し元のイベントIDを維持します。対象を「このイベント」にした際の挙動が変わります。
 * @default false
 * @type boolean
 *
 * @param OverrideTarget
 * @text 上書き対象項目
 * @desc メモ欄で上書き(テンプレートイベントより固有イベントの設定を優先)指定したイベントの上書き対象項目を設定します。
 * @default
 * @type struct<override>
 *
 * @param AutoOverride
 * @text 自動上書き
 * @desc メモ欄で上書き設定をしなくても「上書き対象項目」の設定を上書きします。
 * @default false
 * @type boolean
 *
 * @param IntegrateNote
 * @text メモ欄統合
 * @desc テンプレートイベントと固有イベントのメモ欄を統合もしくは上書きします。
 * @default 0
 * @type select
 * @option 何もしない
 * @value 0
 * @option 統合
 * @value 1
 * @option 上書き
 * @value 2
 *
 * @command CALL_ORIGIN_EVENT
 * @text 固有イベント呼び出し
 * @desc 置き換え元のイベント処理を呼び出します。処理完了後、元の処理に戻ります。
 *
 * @arg pageIndex
 * @text ページ番号
 * @desc 呼び出すイベントのページ番号です。0を指定すると実行中のページと同じ番号を呼び出します。
 * @default 0
 * @type number
 *
 * @command CALL_MAP_EVENT
 * @text マップイベント呼び出し
 * @desc マップイベントの処理を呼び出します。
 *
 * @arg pageIndex
 * @text ページ番号
 * @desc 呼び出すイベントのページ番号です。0を指定すると実行中のページと同じ番号を呼び出します。
 * @default 0
 * @type number
 *
 * @arg eventId
 * @text イベントID(もしくは名称)
 * @desc 呼び出すイベントのIDもしくはイベント名です。0を指定すると実行中のイベントが対象になります。
 * @default 0
 *
 * @command SET_SELF_VARIABLE
 * @text セルフ変数の操作
 * @desc セルフ変数を操作します。
 *
 * @arg index
 * @text キー
 * @desc 操作対象のセルフ変数のキーです。数値や文字列を指定できます。文字列を指定した場合、大文字小文字は区別されます。
 * @default 1
 *
 * @arg type
 * @text 操作種別
 * @desc 操作種別です。
 * @default 0
 * @type select
 * @option  0 : 代入
 * @value 0
 * @option  1 : 加算
 * @value 1
 * @option  2 : 減算
 * @value 2
 * @option  3 : 乗算
 * @value 3
 * @option  4 : 除算
 * @value 4
 * @option  5 : 剰余
 * @value 5
 *
 * @arg operand
 * @text 設定値
 * @desc セルフ変数に設定する値です。
 * @default 0
 *
 * @command SET_RANGE_SELF_VARIABLE
 * @text セルフ変数の一括操作
 * @desc セルフ変数を一括操作します。
 *
 * @arg startIndex
 * @text 開始インデックス
 * @desc 操作対象のセルフ変数の開始インデックスです。数値のみ指定できます。
 * @default 1
 * @type number
 *
 * @arg endIndex
 * @text 終了インデックス
 * @desc 操作対象のセルフ変数の終了インデックスです。数値のみ指定できます。
 * @default 1
 * @type number
 *
 * @arg type
 * @text 操作種別
 * @desc 操作種別です。
 * @default 0
 * @type select
 * @option  0 : 代入
 * @value 0
 * @option  1 : 加算
 * @value 1
 * @option  2 : 減算
 * @value 2
 * @option  3 : 乗算
 * @value 3
 * @option  4 : 除算
 * @value 4
 * @option  5 : 剰余
 * @value 5
 *
 * @arg operand
 * @text 設定値
 * @desc セルフ変数に設定する値です。
 * @default 0
 *
 * @help TemplateEvent.js[テンプレートイベントプラグイン]
 *
 * 汎用的に使用するイベントをテンプレート化できます。
 * テンプレートイベントは、専用に用意したマップに定義してください。
 * 実際のイベントのメモ欄に所定の記述をするだけで、テンプレートイベントと
 * 動的に置き換えることができます。
 *
 * またテンプレートイベントから置き換え元のイベントを呼び出すことができます。
 * 宝箱や場所移動イベント等、一部だけ固有の処理をしたい場合に有効です。
 * 外観や共通部分のイベント処理をテンプレートイベントに記述し、
 * アイテム入手や場所移動先指定など固有部分だけを元のイベントに記述します。
 *
 * 任意のマップイベントをコモンイベントのように呼び出す機能も提供します。
 * IDおよびイベント名で呼び出すイベントを指定可能です。
 *
 * 利用手順
 * 1.テンプレートマップを作成して、テンプレートイベントを配置します。
 *
 * 2.テンプレートイベントに置き換えたいイベントのメモ欄を記述します。
 *   IDとイベント名の双方が指定可能です。
 * <TE:1>   テンプレートマップのID[1]のイベントに置き換わります。
 * <TE:aaa> テンプレートマップのイベント名[aaa]のイベントに置き換わります。
 * <TE:\v[1]> テンプレートマップのID[変数[1]の値]のイベントに置き換わります。
 *
 * 原則、初期配置以外の全設定はテンプレートイベントの設定に置き換わりますが
 * 例外としてメモ欄(※1)を記述した場合は
 * 以下の任意の設定について固有イベントの設定で上書きします。
 * ・画像
 * ・自律移動
 * ・オプション
 * ・プライオリティ
 * ・トリガー
 *
 * ※1 固有イベントのメモ欄に以下の通り記述します。
 * <TE上書き>
 * <TEOverRide>
 *
 * ・セルフ変数機能
 * イベントに対してセルフ変数（そのイベント専用の変数）を定義できます。
 * プラグインコマンドから操作し、文章の表示やイベント出現条件として使用可能です。
 *
 * 「文章の表示」で使用する場合
 * 制御文字「\sv[n](n:インデックス)」で表示できます。
 *
 * 「イベント出現条件」で使用する場合
 * 対象ページのイベントコマンドの先頭を「注釈」にして
 * 以下の書式で条件を指定してください。複数指定も可能です。
 *
 * \TE{条件}
 *
 * 条件はJavaScriptとしてで記述し、制御文字が使用可能です。
 * 指定例：
 * \TE{\sv[1] >= 3}      # セルフ変数[1]が3以上の場合
 * \TE{\sv[2] === \v[1]} # セルフ変数[2]が変数[1]と等しい場合
 * \TE{\sv[3] === 'AAA'} # セルフ変数[3]が'AAA'と等しい場合
 *
 * 「条件分岐」などのスクリプトで使用する場合
 * 以下のスクリプトで指定したインデックスのセルフ変数が取得できます。
 * this.getSelfVariable(n)
 * 指定例：
 * this.getSelfVariable(1) !== 0 # セルフ変数[1]が3以上の場合
 *
 * 本プラグインのすべてのプラグインコマンドで制御文字\sv[n]を使用できます。
 *
 * ・スクリプト（イベントコマンドのスクリプト、変数の操作から実行）
 * 固有処理呼び出し中にテンプレートイベントのIDと名称を取得します。
 *  this.character(0).getTemplateId();
 *  this.character(0).getTemplateName();
 *
 * 指定したインデックスのセルフ変数を取得します。
 *  this.getSelfVariable(index);
 *
 * セルフ変数に値を設定します。
 * このスクリプトは「移動ルートの設定」でも実行できます。
 * formulaFlgをtrueに設定すると、operandを計算式として評価します。
 *  this.controlSelfVariable(index, type, operand, formulaFlg);
 *
 * セルフ変数に値を一括設定します。
 * このスクリプトは「移動ルートの設定」でも実行できます。
 *  this.controlSelfVariableRange(start, end, type, operand, formulaFlg);
 *
 * 外部のイベントのセルフ変数を操作します。
 *  $gameSelfSwitches.setVariableValue([マップID, イベントID, INDEX], 設定値);
 *
 * 外部のイベントのセルフ変数を取得します。
 *  $gameSelfSwitches.getVariableValue([マップID, イベントID, INDEX]);
 *
 * SAN_MapGenerator.jsと組み合わせる場合
 * このプラグインをSAN_MapGenerator.jsより下に定義してください。
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

/*~struct~override:
 *
 * @param Image
 * @text Image
 * @desc The event image and image index.
 * @type boolean
 * @default false
 *
 * @param Direction
 * @text Direction
 * @desc The direction and animation pattern of the event.
 * @type boolean
 * @default false
 *
 * @param Move
 * @text Autonomous Movement
 * @desc Autonomous movement of the event
 * @type boolean
 * @default false
 *
 * @param Priority
 * @text Priority
 * @desc The priority of the event.
 * @type boolean
 * @default false
 *
 * @param Trigger
 * @text Trigger
 * @desc The trigger of the event.
 * @type boolean
 * @default false
 *
 * @param Option
 * @text Option
 * @desc The option of the event.
 * @type boolean
 * @default false
 */
/*~struct~override:ja
 *
 * @param Image
 * @text 画像
 * @desc イベントの画像および画像インデックスです。
 * @type boolean
 * @default false
 *
 * @param Direction
 * @text 向き
 * @desc イベントの向き及びアニメパターンです。
 * @type boolean
 * @default false
 *
 * @param Move
 * @text 自律移動
 * @desc イベントの自律移動です。
 * @type boolean
 * @default false
 *
 * @param Priority
 * @text プライオリティ
 * @desc イベントのプライオリティです。
 * @type boolean
 * @default false
 *
 * @param Trigger
 * @text トリガー
 * @desc イベントのトリガーです。
 * @type boolean
 * @default false
 *
 * @param Option
 * @text オプション
 * @desc イベントのオプションです。
 * @type boolean
 * @default false
 */

let $dataTemplateEvents = null;

(() => {
    'use strict';
    const script = document.currentScript;

    const searchDataItem = function(dataArray, columnName, columnValue) {
        let result = 0;
        dataArray.some(dataItem => {
            if (dataItem && dataItem[columnName] === columnValue) {
                result = dataItem;
                return true;
            }
            return false;
        });
        return result;
    };

    PluginManagerEx.registerCommand(script, 'CALL_ORIGIN_EVENT', function(args) {
        this.callOriginEvent(args.pageIndex);
    });

    PluginManagerEx.registerCommand(script, 'CALL_MAP_EVENT', function(args) {
        const pageIndex = args.pageIndex;
        const eventId   = args.eventId;
        if ($gameMap.event(eventId)) {
            this.callMapEventById(pageIndex, eventId);
        } else if (eventId !== 0) {
            this.callMapEventByName(pageIndex, eventId);
        } else {
            this.callMapEventById(pageIndex, this.eventId());
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_SELF_VARIABLE', function(args) {
        const index   = args.index;
        const type    = args.type;
        const operand = args.operand;
        this.controlSelfVariable(index, type, operand, false);
    });

    PluginManagerEx.registerCommand(script, 'SET_RANGE_SELF_VARIABLE', function(args) {
        const startIndex = args.startIndex;
        const endIndex = args.endIndex;
        const type = args.type;
        const operand = args.operand;
        this.controlSelfVariableRange(startIndex, endIndex, type, operand, false);
    });

    const _PluginManagerEx_convertEscapeCharactersEx = PluginManagerEx.convertEscapeCharactersEx;
    PluginManagerEx.convertEscapeCharactersEx = function(text) {
        text = _PluginManagerEx_convertEscapeCharactersEx.call(this, text);
        const key = this._selfSwitchKey;
        if (!key) {
            return text;
        }
        text = text.replace(/\x1bSV\[(\w+)]/gi, (_, p1) => {
            key[2] = p1;
            return $gameSelfSwitches.getVariableValue(key).toString();
        });
        return text;
    };

    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    const _Game_Interpreter_command101    = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command101.apply(this, arguments);
    };

    const _Game_Interpreter_command105    = Game_Interpreter.prototype.command105;
    Game_Interpreter.prototype.command105 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command105.apply(this, arguments);
    };

    Game_Interpreter.prototype.callOriginEvent = function(pageIndex) {
        const event = $gameMap.event(this._eventId);
        if (event && event.hasTemplate()) {
            if (pageIndex === 0) {
                pageIndex = event.getPageIndex() + 1;
            }
            this.setupAnotherList(null, event.getOriginalPages(), pageIndex);
        }
    };

    Game_Interpreter.prototype.callMapEventById = function(pageIndex, eventId) {
        const event = $gameMap.event(eventId);
        if (event) {
            if (pageIndex === 0) {
                pageIndex = event.getPageIndex() + 1;
            }
            this.setupAnotherList(param.KeepEventId ? null : eventId, event.getPages(), pageIndex);
        }
    };

    Game_Interpreter.prototype.callMapEventByName = function(pageIndex, eventName) {
        const event = searchDataItem($dataMap.events, 'name', eventName);
        if (event) {
            this.callMapEventById(pageIndex, event.id);
        }
    };

    Game_Interpreter.prototype.setupAnotherList = function(eventId, pages, pageIndex) {
        const page = pages[pageIndex - 1];
        if (!page) {
            return;
        }
        if (!eventId) eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(page.list, eventId);
    };

    Game_Interpreter.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        const character = this.character(0);
        if (character) {
            character.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };

    Game_Interpreter.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        const character = this.character(0);
        if (character) {
            character.controlSelfVariableRange(startIndex, endIndex, type, operand, formulaFlg);
        }
    };

    Game_Interpreter.prototype.getSelfVariable = function(selfVariableIndex) {
        const character = this.character(0);
        return character ? character.getSelfVariable(selfVariableIndex) : 0;
    };

    //=============================================================================
    // Game_Message
    //  メッセージ表示中のイベントIDを保持します。
    //=============================================================================
    const _Game_Message_clear    = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._eventId = 0;
    };

    Game_Message.prototype.setEventId = function(id) {
        this._eventId = id;
    };

    Game_Message.prototype.getEventId = function() {
        return this._eventId;
    };

    //=============================================================================
    // Game_System
    //  ロード完了時に必要ならセルフ変数を初期化します。
    //=============================================================================
    const _Game_System_onAfterLoad    = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameSelfSwitches.clearVariableIfNeed();
    };

    //=============================================================================
    // Game_SelfSwitches
    //  セルフ変数を追加します。
    //=============================================================================
    const _Game_SelfSwitches_initialize    = Game_SelfSwitches.prototype.initialize;
    Game_SelfSwitches.prototype.initialize = function() {
        _Game_SelfSwitches_initialize.apply(this, arguments);
        this.clearVariable();
    };

    Game_SelfSwitches.prototype.clearVariable = function() {
        this._variableData = {};
    };

    Game_SelfSwitches.prototype.clearVariableIfNeed = function() {
        if (!this._variableData) {
            this.clearVariable();
        }
    };

    Game_SelfSwitches.prototype.getVariableValue = function(key) {
        return this._variableData.hasOwnProperty(key) ? this._variableData[key] : 0;
    };

    Game_SelfSwitches.prototype.setVariableValue = function(key, value) {
        if (this._variableData[key] === value) {
            return;
        }
        if (value !== undefined && value !== 0) {
            this._variableData[key] = value;
        } else {
            delete this._variableData[key];
        }
        this.onChange();
    };

    Game_SelfSwitches.prototype.makeSelfVariableKey = function(eventId, index) {
        return eventId > 0 ? [$gameMap.mapId(), eventId, index] : null;
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        this.initDynamicEvents();
        _Game_Map_setup.apply(this, arguments);
    };

    //=============================================================================
    // Game_Event
    //  テンプレートイベントマップをロードしてグローバル変数に保持します。
    //=============================================================================
    const _Game_Event_initialize    = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        if (arguments.length > 2) {
            this._eventByRandomDungeon = arguments[2];
        }
        const event = this.getDataEvent(eventId);
        this.setTemplate(event);
        _Game_Event_initialize.apply(this, arguments);
        if (this.hasTemplate()) {
            this.setPosition(event.x, event.y);
            this.refreshBushDepth();
        }
    };

    Game_Event.prototype.getDataEvent = function(eventId) {
        return $dataMap.events[eventId] || this._eventByRandomDungeon;
    };

    const _Game_Event_setupPageSettings    = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.apply(this, arguments);
        if (this.hasTemplate() && param.OverrideTarget && this._override) {
            this.overridePageSettings();
        }
    };

    Game_Event.prototype.overridePageSettings = function() {
        const page = this.getOriginalPage();
        if (!page) {
            return;
        }
        const image  = page.image;
        const target = param.OverrideTarget;
        if (target.Image) {
            if (image.tileId > 0) {
                this.setTileImage(image.tileId);
            } else {
                this.setImage(image.characterName, image.characterIndex);
            }
        }
        if (target.Direction) {
            if (this._originalDirection !== image.direction) {
                this._originalDirection = image.direction;
                this._prelockDirection  = 0;
                const fix = this._directionFix;
                this.setDirectionFix(false);
                this.setDirection(image.direction);
                this.setDirectionFix(fix);
            }
            if (this._originalPattern !== image.pattern) {
                this._originalPattern = image.pattern;
                this.setPattern(image.pattern);
            }
        }
        if (target.Move) {
            this.setMoveSpeed(page.moveSpeed);
            this.setMoveFrequency(page.moveFrequency);
            this.setMoveRoute(page.moveRoute);
            this._moveType = page.moveType;
        }
        if (target.Priority) {
            this.setPriorityType(page.priorityType);
        }
        if (target.Option) {
            this.setWalkAnime(page.walkAnime);
            this.setStepAnime(page.stepAnime);
            this.setDirectionFix(page.directionFix);
            this.setThrough(page.through);
        }
        if (target.Trigger) {
            this._trigger = page.trigger;
            if (this._trigger === 4) {
                this._interpreter = new Game_Interpreter();
            } else {
                this._interpreter = null;
            }
        }
    };

    Game_Event.prototype.setTemplate = function(event) {
        const templateId    = this.generateTemplateId(event);
        const templateEvent = $dataTemplateEvents[templateId];
        if (templateEvent) {
            this._templateId    = templateId;
            this._templateEvent = templateEvent;
            this._override      = param.AutoOverride || !!PluginManagerEx.findMetaValue(event, ['TEOverRide', 'TE上書き']);
            const type = parseInt(param.IntegrateNote);
            if (type > 0) {
                this.integrateNote(event, type);
            }
        } else {
            if (templateId) {
                console.error(`Invalid templateId : ${templateId}`);
            }
            this._templateId    = 0;
            this._templateEvent = null;
            this._override      = false;
        }
    };

    Game_Event.prototype.generateTemplateId = function(event) {
        const templateId = PluginManagerEx.findMetaValue(event, 'TE');
        if (!templateId) {
            return 0;
        }
        if (templateId === String(templateId)) {
            const template = searchDataItem($dataTemplateEvents, 'name', templateId);
            return template ? template.id : 0;
        }
        return templateId;
    };

    Game_Event.prototype.integrateNote = function(event, type) {
        this._templateEvent      = JsonEx.makeDeepCopy(this._templateEvent);
        this._templateEvent.note = (type === 1 ? this._templateEvent.note : '') + event.note;
        DataManager.extractMetadata(this._templateEvent);
    };

    Game_Event._userScripts            = ['getTemplateId', 'getTemplateName'];
    Game_Event.prototype.getTemplateId = function() {
        return this._templateId;
    };

    Game_Event.prototype.getTemplateName = function() {
        return this.hasTemplate() ? this._templateEvent.name : '';
    };

    Game_Event.prototype.hasTemplate = function() {
        return this._templateId > 0;
    };

    const _Game_Event_event    = Game_Event.prototype.event;
    Game_Event.prototype.event = function() {
        return this.hasTemplate() ? this._templateEvent : _Game_Event_event.apply(this, arguments);
    };

    Game_Event.prototype.getOriginalPages = function() {
        const eventId = PluginManagerEx.isExistPlugin('SAN_MapGenerator') ? this._dataEventId : this._eventId;
        return this.getDataEvent(eventId).pages;
    };

    Game_Event.prototype.getOriginalPage = function() {
        return this.getOriginalPages()[this._pageIndex];
    };

    Game_Event.prototype.getPages = function() {
        return this.event().pages;
    };

    Game_Event.prototype.getPageIndex = function() {
        return this._pageIndex;
    };

    const _Game_Event_meetsConditions    = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function(page) {
        return _Game_Event_meetsConditions.apply(this, arguments) && this.meetsConditionsForSelfVariable(page);
    };

    Game_Event.prototype.meetsConditionsForSelfVariable = function(page) {
        const comment = this.getStartComment(page);
        return !(comment && this.execConditionScriptForSelfVariable(comment) === false);
    };

    Game_Event.prototype.getStartComment = function(page) {
        return page.list.filter(function(command) {
            return command && (command.code === 108 || command.code === 408);
        }).reduce(function(prev, command) {
            return prev + command.parameters[0];
        }, '');
    };

    Game_Event.prototype.execConditionScriptForSelfVariable = function(note) {
        const scripts = [];
        note.replace(/\\TE{(.+?)}/gi, function() {
            scripts.push(arguments[1]);
        }.bind(this));
        return scripts.every(function(script) {
            PluginManagerEx.generateSelfSwitchKey(this._eventId);
            script = PluginManagerEx.convertVariables(script);
            return eval(script);
        }, this);
    };

    Game_Event.prototype.getSelfVariableKey = function(index) {
        return $gameSelfSwitches.makeSelfVariableKey(this._eventId, index);
    };

    Game_Event.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        const key = this.getSelfVariableKey(index);
        if (key) {
            this.operateSelfVariable(key, type, formulaFlg ? eval(operand) : operand);
        }
    };

    Game_Event.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        for (let index = startIndex; index <= endIndex; index++) {
            this.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };

    Game_Event.prototype.getSelfVariable = function(selfVariableIndex) {
        const key = this.getSelfVariableKey(selfVariableIndex);
        return $gameSelfSwitches.getVariableValue(key);
    };

    Game_Event.prototype.operateSelfVariable = function(key, operationType, value) {
        let oldValue = $gameSelfSwitches.getVariableValue(key);
        switch (operationType) {
            case 0:  // Set
                $gameSelfSwitches.setVariableValue(key, oldValue = value);
                break;
            case 1:  // Add
                $gameSelfSwitches.setVariableValue(key, oldValue + value);
                break;
            case 2:  // Sub
                $gameSelfSwitches.setVariableValue(key, oldValue - value);
                break;
            case 3:  // Mul
                $gameSelfSwitches.setVariableValue(key, oldValue * value);
                break;
            case 4:  // Div
                $gameSelfSwitches.setVariableValue(key, oldValue / value);
                break;
            case 5:  // Mod
                $gameSelfSwitches.setVariableValue(key, oldValue % value);
                break;
        }
    };

    //=============================================================================
    // Scene_Boot
    //  テンプレートイベントマップをロードしてグローバル変数に保持します。
    //=============================================================================
    const _Scene_Boot_create    = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        this._templateMapGenerator = this.templateMapLoadGenerator();
        $dataMap                   = {};
    };

    const _Scene_Boot_isReady    = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        const isReady = _Scene_Boot_isReady.apply(this, arguments);
        return this._templateMapGenerator.next().done && isReady;
    };

    Scene_Boot.prototype.templateMapLoadGenerator = function* () {
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        // Resolve conflict for OnlineAvatar.js
        if (!$gamePlayer) {
            $gamePlayer = {isTransferring: function() {}};
        }
        DataManager.loadMapData(param.TemplateMapId);
        $gamePlayer = null;
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        $dataTemplateEvents = $dataMap.events;
        $dataMap            = {};
        return true;
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        PluginManagerEx.generateSelfSwitchKey($gameMessage.getEventId());
        return _Window_Base_convertEscapeCharacters.apply(this, arguments);
    };
})();

