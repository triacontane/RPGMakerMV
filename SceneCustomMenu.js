/*=============================================================================
 SceneCustomMenu.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/03/21 スクリプトの凡例追加とヘルプの微修正
 1.0.0 2020/03/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc カスタムメニュー作成プラグイン
 * @author トリアコンタン
 *
 * @param Scene1
 * @text シーン1
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {"Id":"Scene_ActorList","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"member_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"480\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"4\\\",\\\"ItemHeight\\\":\\\"120\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"$gameParty.members(); // パーティメンバー\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"アクターを選択してください。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"confirm\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"false\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"confirm\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"130\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"2\\\",\\\"ItemHeight\\\":\\\"36\\\",\\\"CommandList\\\":\\\"[\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"はい\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"いいえ\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\"}\\\\\\\"]\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"本当によろしいですか？\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"SceneManager.callCustomMenu('Scene_ActorListNext'); //\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"true\\\"}\"]"}
 * @type struct<Scene>
 *
 * @param Scene2
 * @text シーン2
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {"Id":"Scene_ActorListNext","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"window1\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"2\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"$dataClasses.filter(data => !!data); // データベースの職業\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"item.meta['value']; // メモ欄に<value>の記述がある\\\",\\\"CommonHelpText\\\":\\\"メモ欄に<value>と書いた職業だけ選択できます。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"this.popScene(); // 元のシーンに戻る\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
 * @type struct<Scene>
 *
 * @param Scene3
 * @text シーン3
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {"Id":"Scene_ActorDetail","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"actor_name\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"420\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"1\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"[this._actor]; // メインメニューで選択したアクター\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"PgUp, PgDnキーでアクターを変更できます。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"actor_name\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"slot\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"200\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equipSlots(); // メインメニューで選択したアクターの装備スロット\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"$dataSystem.equipTypes[item]; // 装備スロットIDを装備スロット名称に変換\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"equip\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"slot\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"400\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equips(); // メインメニューで選択したアクターの装備スロットID\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
 * @type struct<Scene>
 *
 * @param Scene4
 * @text シーン4
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene5
 * @text シーン5
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene6
 * @text シーン6
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene7
 * @text シーン7
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene8
 * @text シーン8
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene9
 * @text シーン9
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @help SceneCustomMenu.js
 *
 * このプラグインはRPGツクールMV1.6.0以降でのみ動作します。
 *
 * プラグインパラメータからウィンドウ情報を定義して独自のメニュー画面を作れます。
 * 初期状態で動作するサンプルや豊富なスクリプトのプリセットが用意されていて
 * すぐに動作を確認できます。
 * また、コモンイベントが使えるので細かい要件にも対応できます。
 *
 * カスタムメニュー画面を作成するには、大まかに以下の手順を踏みます。
 *
 * 1. ウィンドウを定義する
 * 　プラグインパラメータからウィンドウと項目内容を定義します。
 * 　項目内容は固定文字列のほか、データベースやアクターデータ等も指定可能です。
 *
 * 2. ウィンドウ間の繋がりを定義する
 * 　ウィンドウで決定やキャンセルをしたとき、別のウィンドウに移ったり
 * 　画面を出たりするよう、ウィンドウ間の繋がりを定義します。
 *
 * 3. イベントを定義する
 * 　ウィンドウで決定やキャンセルをしたときに実行されるスクリプトや
 * 　コモンイベントの情報を定義します。
 *
 * カスタムメニューを呼び出すには以下のスクリプトを実行します。
 * 『Scene_ActorList』の箇所には『シーン識別子』を設定します。
 *
 *  SceneManager.callCustomMenu('Scene_ActorList');
 *
 * メインメニュー画面にカスタムメニューの項目を追加する機能はありません。
 * 既存のプラグイン等と連携させてください。
 *
 * 例：メニュー画面のサブコマンドプラグイン
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuSubCommand.js
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *
 * - English
 *
 * You can create your own menu screen by defining window information from plug-in parameters.
 * There are a lot of script presets and samples that work out of the box.
 * You can check the operation immediately.
 * In addition, since common events can be used, it is possible to respond to detailed requirements.
 *
 * To create a custom menu screen, follow these general steps:
 *
 * 1. Define the window
 * Define window and item contents from plug-in parameters.
 * In addition to fixed character strings, database and actor data can be specified as item contents.
 *
 * 2. Define connections between windows
 * When a decision or cancellation is made in the window,
 * Define the connection between windows, such as leaving the screen.
 *
 * 3. Define the event
 * Scripts that are executed when a decision or cancellation is made in the window
 * Define common event information.
 *
 * Execute the following script to call the custom menu.
 *  SceneManager.callCustomMenu ('Scene_ActorList');
 *
 * There is no function to add custom menu items to the main menu screen.
 * Please link with existing plugins.
 *
 * Example:
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuSubCommand.js
 *
 * This plugin is released under the MIT License.
 */

/*~struct~Scene:
 *
 * @param Id
 * @text シーン識別子
 * @desc シーンを呼び出す際の識別子です。他の識別子と重複しない文字列を指定してください。
 * @default Scene_Test
 * @type string
 *
 * @param UseHelp
 * @text ヘルプウィンドウ使用
 * @desc 有効にした場合、画面上部にヘルプウィンドウを表示します。各ウィンドウはヘルプウィンドウの下に配置されます。
 * @default true
 * @type boolean
 *
 * @param InitialEvent
 * @text 初期イベント
 * @desc シーンが表示された瞬間に発生するイベントです。初期イベントに指定したウィンドウでキャンセルすると画面から抜けます。
 * @default {}
 * @type struct<Event>
 *
 * @param WindowList
 * @text ウィンドウ一覧
 * @desc シーンで使用されるウィンドウの一覧です。
 * @default []
 * @type struct<Window>[]
 *
 */

/*~struct~Window:
 *
 * @param Id
 * @text ウィンドウ識別子
 * @desc ウィンドウの識別子です。リスト内で他の識別子と重複しない文字列を指定してください。
 * @default window1
 * @type string
 *
 * @param x
 * @text X座標
 * @desc X座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param RelativeWindowIdX
 * @text 相対X座標ウィンドウ
 * @desc 指定した場合、X座標が対象ウィンドウからの相対位置になります。
 * @default
 *
 * @param y
 * @text Y座標
 * @desc Y座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param RelativeWindowIdY
 * @text 相対Y座標ウィンドウ
 * @desc 指定した場合、Y座標が対象ウィンドウからの相対位置になります。
 * @default
 *
 * @param width
 * @text 横幅
 * @desc 横幅です。0を指定した場合は画面の横幅に合わせられます。
 * @default 0
 * @type number
 *
 * @param height
 * @text 高さ
 * @desc 高さです。0を指定した場合は『行数』の指定をもとに自動設定されます。
 * @default 0
 * @type number
 *
 * @param ColumnNumber
 * @text 列数
 * @desc ウィンドウの列数です。
 * @default 1
 * @type number
 * @min 1
 *
 * @param RowNumber
 * @text 行数
 * @desc ウィンドウの行数です。高さを決定するために使われます。0を指定した場合はコマンド数をもとに自動設定されます。
 * @default 0
 * @type number
 *
 * @param ItemHeight
 * @text 項目の高さ
 * @desc 1項目あたりの高さです。0を指定した場合はウィンドウのデフォルト値が使用されます。
 * @default 0
 * @type number
 *
 * @param CommandList
 * @text コマンドリスト
 * @desc ウィンドウに表示される項目や表示可否を直接指定します。項目が最初から決まっている場合に使います。
 * @type struct<Command>[]
 *
 * @param DataScript
 * @text データスクリプト
 * @desc ウィンドウに表示される項目や表示可否をスクリプトから構築します。使用する場合はコマンドリストを空にしてください。
 *
 * @param ListScript
 * @parent DataScript
 * @text 一覧取得スクリプト
 * @desc 項目の一覧を返すスクリプトです。プリセットから選ぶこともできます。
 * @default
 * @type combo
 * @option $gameParty.members(); // パーティメンバー
 * @option $gameParty.battleMembers(); // 戦闘メンバー
 * @option $gameParty.reserveMembers(); // リザーブメンバー
 * @option $gameParty.items(); // 所持消耗品
 * @option $gameParty.weapons(); // 所持武器
 * @option $gameParty.armors(); // 所持防具
 * @option $gameParty.equipItems(); // 所持装備品
 * @option $gameParty.allItems(); // 所持アイテム
 * @option [this._actor]; // メインメニューで選択したアクター
 * @option this._actor.weapons(); // メインメニューで選択したアクターの装備武器
 * @option $gameParty.members()[v(1)].weapons(); // 変数[1]のPTメンバーの装備武器
 * @option this._actor.armors(); // メインメニューで選択したアクターの装備防具
 * @option this._actor.equips(); // メインメニューで選択したアクターの装備品
 * @option this._actor.equipSlots(); // メインメニューで選択したアクターの装備スロットID
 * @option this._actor.skills(); // メインメニューで選択したアクターの所持スキル
 * @option this._actor.usableSkills(); // メインメニューで選択したアクターの使用可能スキル
 * @option this._actor.currentClass().learnings; //メインメニューで選択したアクターの職業の習得スキル
 * @option $dataActors.filter(data => !!data); // データベースのアクター
 * @option $dataClasses.filter(data => !!data); // データベースの職業
 * @option $dataSkills.filter(data => !!data); // データベースのスキル
 * @option $dataItems.filter(data => !!data); // データベースのアイテム
 * @option $dataWeapons.filter(data => !!data); // データベースの武器
 * @option $dataArmors.filter(data => !!data); // データベースの防具
 * @option $dataEnemies.filter(data => !!data); // データベースの敵キャラ
 * @option $dataTroops.filter(data => !!data); // データベースの敵グループ
 * @option $dataStates.filter(data => !!data); // データベースのステート
 * @option $dataSystem.weaponTypes.filter((d, i) => i > 0); // 武器タイプ
 * @option $dataSystem.armorTypes.filter((d, i) => i > 0); // 防具タイプ
 * @option $dataSystem.skillTypes.filter((d, i) => i > 0); // スキルタイプ
 * @option $dataSystem.equipTypes.filter((d, i) => i > 0); // 装備タイプ
 * @option $dataSystem.elements.filter((d, i) => i > 0); // 属性
 * @option $dataSystem.switches; // スイッチ名
 * @option $dataSystem.variables; // 変数名
 * @option $dataSystem.params; // 能力値(用語)
 * @option $dataSystem.commands; // コマンド(用語)
 * @option $dataSystem.basic; // 基本ステータス(用語)
 *
 * @param FilterScript
 * @parent DataScript
 * @text フィルタスクリプト
 * @desc 項目の一覧に対して表示条件を設定します。変数[item]から各要素が参照できます。
 * @default
 * @type combo
 * @option item.meta['value']; // メモ欄に<value>の記述がある
 * @option item.name.match('value'); // 名前にvalueを含む
 * @option item.id > v(10); // IDが変数[10]の値より大きい
 * @option item !== ''; // 空文字以外
 * @option !!item; // null, undefined, 0, 空文字以外
 * @option item.stypeId === v(10); // スキルタイプが変数[10]の値と等しい
 * @option item.etypeId === v(10); // 装備タイプが変数[10]の値と等しい
 * @option item.wtypeId === v(10); // 武器タイプが変数[10]の値と等しい
 * @option item.atypeId === v(10); // 防具タイプが変数[10]の値と等しい
 * @option item.itypeId === 1; // アイテムタイプが[通常アイテム]
 * @option this._actor.canEquip(item); // メインメニューで選択したアクターが装備可能
 * @option this._actor.canUse(item); // メインメニューで選択したアクターが使用可能
 *
 * @param MappingScript
 * @parent DataScript
 * @text マッピングスクリプト
 * @desc 一覧の項目を別の値に変換します。変数[item]から各要素が参照できます。必要な場合にのみ指定してください。
 * @type combo
 * @option item.actor(); // Game_ActorからデータベースのActorに変換
 * @option $dataSkills[item.skillId]; // 習得スキル情報をデータベースのSkillに変換
 * @option $dataSystem.equipTypes[item]; // 装備スロットIDを装備スロット名称に変換
 *
 * @param ItemDrawScript
 * @parent DataScript
 * @text 項目描画スクリプト
 * @desc 項目を描画するスクリプトです。変数[item]から各要素が参照できます。省略すると自働で描画されます。
 * @default []
 * @type combo[]
 * @option this.drawIcon(item.iconIndex, r.x, r.y, r.width); // アイコン
 * @option this.drawFace(item.faceName(), item.faceIndex() r.x, r.y); // フェイスグラフィック
 * @option this.drawCharacter(item.characterName(), item.characterIndex(), r.x, r.y); // キャラクター
 * @option this.drawGauge(r.x, r.y, r.width, 1.0, this.textColor(1), this.textColor(2)); // ゲージ
 * @option this.drawActorCharacter(item, r.x + 24, r.y + 48); // アクターキャラクター
 * @option this.drawActorCharacter(this._actor, r.x, r.y); // メインメニューで選択したアクターキャラクター
 * @option this.drawActorFace(item, r.x, r.y); // アクターフェイス
 * @option this.drawActorName(item, r.x, r.y); // アクター名称
 * @option this.drawActorClass(item, r.x, r.y); // アクター職業
 * @option this.drawActorNickname(item, r.x, r.y); // アクターの二つ名
 * @option this.drawActorLevel(item, r.x, r.y); // アクターのレベル
 * @option this.drawActorIcons(item, r.x, r.y); // アクターのステートアイコン
 * @option this.drawCurrentAndMax(0, 100, r.x, r.y, r.width, this.textColor(1), this.textColor(2)); // 現在値、最大値
 * @option this.drawActorHp(item, r.x, r.y, r.width); // アクターのHP
 * @option this.drawActorMp(item, r.x, r.y, r.width); // アクターのMP
 * @option this.drawActorTp(item, r.x, r.y, r.width); // アクターのTP
 * @option this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス
 * @option this.drawItemName(item, r.x, r.y, r.width); // アイテムやスキルの名称
 * @option this.drawTextEx(`Text:${item.name}`, r.x, r.y, r.width); // 任意のテキスト描画(制御文字変換あり)
 * @option this.drawText(`Text:${item.name}`, r.x, r.y, r.width, 'right'); // 任意のテキスト描画(制御文字変換なし。右揃え)
 * @option this.changeTextColor(this.textColor(1)); // テキストカラー変更(drawTextでのみ有効)
 *
 * @param IsEnableScript
 * @parent DataScript
 * @text 選択可能スクリプト
 * @desc 項目を選択可能かどうかを判定するスクリプトです。変数[item]から各要素が参照できます。
 * @default
 * @type combo
 * @option item.meta['value']; // メモ欄に<value>の記述がある
 * @option item.name.match('value'); // 名前にvalueを含む
 * @option item.id > v(10); // IDが変数[10]の値より大きい
 * @option item !== ''; // 空文字以外
 * @option !!item; // null, undefined, 0, 空文字以外
 * @option item.stypeId === v(10); // スキルタイプが変数[10]の値と等しい
 * @option item.etypeId === v(10); // 装備タイプが変数[10]の値と等しい
 * @option item.wtypeId === v(10); // 武器タイプが変数[10]の値と等しい
 * @option item.atypeId === v(10); // 防具タイプが変数[10]の値と等しい
 * @option item.itypeId === 1; // アイテムタイプが[通常アイテム]
 * @option this._actor.canEquip(item); // メインメニューで選択したアクターが装備可能
 * @option this._actor.canUse(item); // メインメニューで選択したアクターが使用可能
 *
 * @param CommonHelpText
 * @text 共通ヘルプテキスト
 * @desc 選択している項目とは関係なく表示されるヘルプテキストです。
 * @default
 * @type string
 *
 * @param DecisionEvent
 * @text 決定イベント
 * @desc 項目が決定された瞬間に発生するイベントです。
 * @default {}
 * @type struct<Event>
 *
 * @param CancelEvent
 * @text キャンセルイベント
 * @desc キャンセルされた瞬間に発生するイベントです。
 * @default {}
 * @type struct<Event>
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc デフォルトのフォントサイズです。0を指定すると他のウィンドウと同じサイズになります。
 * @default 0
 * @type number
 *
 * @param WindowSkin
 * @text ウィンドウスキン
 * @desc ウィンドウスキンです。指定しなかった場合、デフォルトが使用されます。
 * @default
 * @require 1
 * @dir img/system
 * @type file
 *
 * @param VisibleSwitchId
 * @text 表示スイッチID
 * @desc 指定したスイッチがONの場合のみ画面に表示されます。
 * @default 0
 * @type switch
 *
 * @param ShowOpenAnimation
 * @text 開閉アニメ表示
 * @desc ウィンドウの開閉アニメーションを表示します。
 * @default true
 * @type boolean
 *
 * @param RefreshSwitchId
 * @text 再描画スイッチ
 * @desc 指定したスイッチがONになるとウィンドウが再描画されます。再描画の後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param IndexVariableId
 * @text インデックス格納変数
 * @desc カーソルインデックスが常に格納される変数です。
 * @default 0
 * @type variable
 *
 * @param Cancelable
 * @text キャンセル可能
 * @desc 有効にするとウィンドウをキャンセルできるようになります。
 * @default true
 * @type boolean
 *
 * @param ActorChangeable
 * @text アクター変更可能
 * @desc 有効にするとPageUp, PageDownでアクターチェンジできるようになります。
 * @default false
 * @type boolean
 *
 * @param HiddenNoFocus
 * @text 非フォーカス時は隠す
 * @desc 有効にするとウィンドウにフォーカスが当たっていないときはウィンドウが非表示になります。
 * @default false
 * @type boolean
 */

/*~struct~Command:
 *
 * @param Text
 * @text 項目内容
 * @desc 項目の描画内容です。アイコン系の制御文字が使用できます。
 * @default value01
 * @type string
 *
 * @param VisibleSwitchId
 * @text 表示スイッチID
 * @desc 指定したスイッチがONの場合のみ画面に表示されます。
 * @default 0
 * @type switch
 *
 * @param EnableSwitchId
 * @text 選択可能スイッチID
 * @desc 指定したスイッチがONの場合のみ選択できます。OFFだと選択禁止になります。
 * @default 0
 * @type switch
 *
 * @param HelpText
 * @text ヘルプテキスト
 * @desc ヘルプウィンドウを表示している場合、ヘルプテキストが表示されます。
 * @default
 * @type string
 *
 * @param CancelChoice
 * @text キャンセル選択肢
 * @desc この項目を選択したときに発生するイベントがキャンセルイベントになります。
 * @default false
 * @type boolean
 */

/*~struct~Event:
 *
 * @param CommandId
 * @text コモンイベント
 * @desc 対象のイベントが発生したときに実行されるコモンイベントです。ただし、シーンを出るときは実行されません。
 * @default 0
 * @type common_event
 *
 * @param FocusWindowId
 * @text ウィンドウ識別子
 * @desc 対象のイベントが発生したときにフォーカスされるウィンドウ識別子です。指定がなければ前のウィンドウに戻ります。
 * @default
 * @type string
 *
 * @param FocusWindowIndex
 * @text ウィンドウインデックス
 * @desc 対象のイベントが発生したときにフォーカスされるウィンドウのカーソルインデックスです。-1を指定した場合、操作しません。
 * @default -1
 * @type number
 * @min -1
 *
 * @param Script
 * @text スクリプト
 * @desc 対象のイベントが発生したときに実行されるスクリプトです。
 * @default
 * @type combo
 * @option SceneManager.callCustomMenu('Scene___'); // 別のカスタムメニューに移動
 * @option this.popScene(); // 元のシーンに戻る
 *
 * @param SwitchId
 * @text スイッチ
 * @desc 対象のイベントが発生したときにONになるスイッチです。
 * @type switch
 */

(() => {
    'use strict';
    const createPluginParameter = function(pluginName) {
        const paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        const parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    const param                 = createPluginParameter('SceneCustomMenu');
    let index                   = 1;
    param.SceneList             = [];
    while (param[`Scene${index}`]) {
        param.SceneList.push(param[`Scene${index}`]);
        index++;
    }

    SceneManager.callCustomMenu = function(sceneId) {
        if (!this.findSceneData(sceneId)) {
            throw new Error(`Scene data '${sceneId}' is not found`);
        }
        this.push(this.createCustomMenuClass(sceneId));
    };

    SceneManager.createCustomMenuClass = function(sceneId) {
        let sceneClass        = {};
        const createClassEval = `sceneClass = function ${sceneId}(){\n this.initialize.apply(this, arguments)};`;
        eval(createClassEval);
        sceneClass.prototype             = Object.create(Scene_CustomMenu.prototype);
        sceneClass.prototype.constructor = sceneClass;
        return sceneClass;
    };

    const getClassName = function(object) {
        const define = object.constructor.toString();
        if (define.match(/^class/)) {
            return define.replace(/class\s+(.*?)\s+[\s\S]*/m, '$1');
        }
        return define.replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    SceneManager.findSceneData = function(sceneId) {
        return param.SceneList.filter(data => data.Id === sceneId)[0];
    };

    const _SceneManager_pop = SceneManager.pop;
    SceneManager.pop        = function() {
        _SceneManager_pop.apply(this, arguments);
        this._sceneIndex = 0;
    };

    Game_Party.prototype.reserveMembers = function() {
        var battleMembers = this.battleMembers();
        return this.members().filter(function(actor) {
            return !battleMembers.contains(actor);
        });
    };

    class Scene_CustomMenu extends Scene_MenuBase {
        create() {
            super.create();
            this.swapGameScreen();
            this._interpreter = new Game_Interpreter();
            this._customData  = SceneManager.findSceneData(getClassName(this));
            this.createAllObjects();
        }

        start() {
            super.start();
            this.fireEvent(this._customData.InitialEvent);
        }

        terminate() {
            super.terminate();
            this.restoreGameScreen();
        }

        stop() {
            super.stop();
            if (SceneManager.isNextScene(Scene_Battle)) {
                this.launchBattle();
            }
        }

        swapGameScreen() {
            this._previousGameScreen = $gameScreen;
            $gameScreen              = new Game_Screen();
        }

        restoreGameScreen() {
            $gameScreen = this._previousGameScreen;
        }

        createAllObjects() {
            if (this._customData.UseHelp) {
                this.createHelpWindow();
            }
            this.createCustomMenuWindowList();
            this.createMessageWindow();
            this.createScrollTextWindow();
            this.createSpriteset();
        }

        createCustomMenuWindowList() {
            this._customWindowMap = new Map();
            const list            = this._customData.WindowList;
            list.forEach(windowData => this.createCustomMenuWindow(windowData));
            list.forEach(windowData => this.setPlacement(windowData));
            if (this._helpWindow) {
                list.forEach(windowData => this.adjustPlacementByHelpWindow(windowData));
            }
        }

        createCustomMenuWindow(data) {
            const win = this.createCustomWindowInstance(data);
            win.setHandler('ok', () => this.fireEvent(win.findDecisionEvent()));
            if (this._helpWindow) {
                win.setHelpWindow(this._helpWindow);
            }
            if (data.Cancelable) {
                win.setHandler('cancel', () => {
                    this.fireEvent(data.CancelEvent);
                    if (data.Id === this.findFirstWindowId()) {
                        this.popScene();
                    }
                    win.select(-1);
                });
            }
            if (data.ActorChangeable) {
                win.setHandler('pagedown', this.nextActor.bind(this));
                win.setHandler('pageup', this.previousActor.bind(this));
            }
            win.refresh();
            this.addWindow(win);
            this._customWindowMap.set(data.Id, win);
        }

        setPlacement(data) {
            const win     = this._customWindowMap.get(data.Id);
            const parentX = this._customWindowMap.get(data.RelativeWindowIdX);
            if (parentX) {
                win.x += parentX.x + parentX.width;
            }
            const parentY = this._customWindowMap.get(data.RelativeWindowIdY);
            if (parentY) {
                win.y += parentY.y + parentY.height;
            }
        }

        adjustPlacementByHelpWindow(data) {
            const win = this._customWindowMap.get(data.Id);
            win.y += this._helpWindow.y + this._helpWindow.height;
        }

        createCustomWindowInstance(data) {
            if (data.CommandList && data.CommandList.length > 0) {
                return new Window_CustomMenuCommand(data, this._actor);
            } else {
                return new Window_CustomMenuDataList(data, this._actor);
            }
        }

        findFirstWindowId() {
            const event = this._customData.InitialEvent;
            if (event && event.FocusWindowId) {
                return event.FocusWindowId;
            }
            const windowList = this._customData.WindowList;
            if (windowList && windowList.length > 0) {
                return windowList[0].Id;
            }
            return null;
        }

        update() {
            super.update();
            if (this._interpreter.isRunning()) {
                this.updateInterpreter();
            }
        }

        fireEvent(event) {
            if (event.SwitchId) {
                $gameSwitches.setValue(event.SwitchId, true);
            }
            if (event.Script) {
                eval(event.Script);
            }
            if (!this._active) {
                return;
            }
            if (event.FocusWindowId) {
                this.changeWindowFocus(event.FocusWindowId, event.FocusWindowIndex);
            } else if (this._previousActiveWindowId) {
                this.changeWindowFocus(this._previousActiveWindowId, -1);
            } else {
                this.changeWindowFocus(this._activeWindowId || this.findFirstWindowId(), -1);
            }
            if (event.CommandId) {
                this.setupMenuCommonEvent(event.CommandId);
            }
        }

        changeWindowFocus(windowId, index) {
            if (this._activeWindowId !== windowId) {
                this._previousActiveWindowId = this._activeWindowId;
            }
            this._activeWindowId = windowId;
            this._customWindowMap.forEach((win, id) => {
                if (id === windowId) {
                    win.activate();
                    if (index !== -1) {
                        win.select(index || 0);
                    }
                } else {
                    win.deactivate();
                }
            });
        }

        setupMenuCommonEvent(commonEventId) {
            const common = $dataCommonEvents[commonEventId];
            if (!common) {
                return;
            }
            this._interpreter.setup(common.list, 0);
            this.blurAllWindow();
        }

        updateInterpreter() {
            this._interpreter.update();
            if (!this._interpreter.isRunning()) {
                this.changeWindowFocus(this._activeWindowId, -1);
                this._interpreter.terminate();
            }
        }

        blurAllWindow() {
            this._customWindowMap.forEach(win => {
                win.deactivate();
            });
        }

        createMessageWindow() {
            Scene_Map.prototype.createMessageWindow.call(this);
        }

        createScrollTextWindow() {
            Scene_Map.prototype.createScrollTextWindow.call(this);
        }

        createSpriteset() {
            this._spriteset = new Spriteset_Menu();
            this.addChild(this._spriteset);
        }

        refreshActor() {
            this._customWindowMap.forEach(win => {
                win.setActor(this._actor);
            });
        }

        onActorChange() {
            this.refreshActor();
            this.changeWindowFocus(this._activeWindowId, -1);
        }

        launchBattle() {
            BattleManager.saveBgmAndBgs();
            this.stopAudioOnBattleStart();
            SoundManager.playBattleStart();
        }

        stopAudioOnBattleStart() {
            Scene_Map.prototype.stopAudioOnBattleStart.apply(this, arguments);
        }
    }

    const _Window_Selectable_initialize    = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function(x, y, width, height, data) {
        if (data) {
            this._data = data;
            this._list = [];
        }
        _Window_Selectable_initialize.apply(this, arguments);
    };

    class Window_CustomMenu extends Window_Selectable {
        constructor(data, actor) {
            super(data.x, data.y, data.width || Graphics._boxWidth, data.height, data);
            this._actor = actor;
            if (this.isShowOpen()) {
                this.openness = 0;
            }
            if (this.height === 0) {
                this._dynamicHeight = true;
            }
        }

        update() {
            this.updateOpenClose();
            super.update();
            this.updateIndexVariable();
            this.refreshIfNeed();
        }

        updateOpenClose() {
            if (this.isValid()) {
                if (this.isShowOpen()) {
                    this.open();
                } else {
                    this.openness = 255;
                }
            } else {
                if (this.isShowOpen()) {
                    this.close();
                } else {
                    this.openness = 0;
                }
            }
        }

        updateIndexVariable() {
            if (this._data.IndexVariableId) {
                $gameVariables.setValue(this._data.IndexVariableId, this._index);
            }
        }

        refreshIfNeed() {
            const switchId = this._data.RefreshSwitchId;
            if (!switchId) {
                return;
            }
            if ($gameSwitches.value(switchId)) {
                this.refresh();
                $gameSwitches.setValue(switchId, 0);
            }
        }

        isShowOpen() {
            return this._data.ShowOpenAnimation;
        }

        itemHeight() {
            return this._data.ItemHeight || super.itemHeight();
        }

        numVisibleRows() {
            return this._data.RowNumber || Math.ceil(this.maxItems() / this.maxCols());
        }

        resetFontSettings() {
            super.resetFontSettings();
            if (this._data.FontSize) {
                this.contents.fontSize = this._data.FontSize;
            }
        };

        isValid() {
            if (this._data.HiddenNoFocus && !this.active) {
                return false;
            }
            return !this._data.VisibleSwitchId || $gameSwitches.value(this._data.VisibleSwitchId);
        }

        maxCols() {
            return this._data.ColumnNumber || super.maxCols();
        }

        refresh() {
            this._list = this.makeCommandList();
            if (this._dynamicHeight) {
                this.setDynamicHeight();
            }
            super.refresh();
            if (this._data.WindowSkin) {
                this.windowskin = ImageManager.loadSystem(this._data.WindowSkin);
            }
        }

        setDynamicHeight() {
            this.height = this.fittingHeight(this.numVisibleRows());
            this.createContents();
        }

        fittingHeight(numLines) {
            return numLines * this.itemHeight() + this.standardPadding() * 2;
        }

        makeCommandList() {}

        maxItems() {
            return this._list.length;
        }

        drawItem(index) {
            const item = this.getItem(index);
            if (!item) {
                return;
            }
            const rect = this.itemRect(index);
            rect.x += this.textPadding();
            rect.width -= this.textPadding() * 2;
            this.changePaintOpacity(this.isEnabled(index));
            this.drawItemSub(item, rect, index);
            this.changePaintOpacity(1);
        }

        drawItemSub(item, rect, index) {};

        updateHelp() {
            this._helpWindow.setText(this.findHelpText());
        }

        findHelpText() {
            return this._data.CommonHelpText;
        }

        findDecisionEvent() {
            return this._data.DecisionEvent;
        }

        getItem(index) {
            if (index === undefined) {
                index = this.index();
            }
            return this._list[index];
        }

        isCurrentItemEnabled() {
            return this.isEnabled(this.index());
        }

        isEnabled(index) {
            const item = this.getItem(index);
            return item ? this.isEnabledSub(item) : false;
        }

        isEnabledSub(item) {};

        activate() {
            if (this._index < 0) {
                this.select(0);
            }
            super.activate();
        }

        setActor(actor) {}
    }

    class Window_CustomMenuCommand extends Window_CustomMenu {
        makeCommandList() {
            return this._data.CommandList.filter(data => {
                return !data.VisibleSwitchId || $gameSwitches.value(data.VisibleSwitchId);
            });
        }

        drawItemSub(item, rect, index) {
            this.drawTextEx(item.Text, rect.x, rect.y, rect.width);
        }

        findHelpText() {
            const item = this.getItem();
            return item && item.HelpText ? item.HelpText : super.findHelpText();
        }

        isEnabledSub(item) {
            return !item.EnableSwitchId || $gameSwitches.value(item.EnableSwitchId);
        }

        findDecisionEvent() {
            const item = this.getItem();
            if (item && item.CancelChoice) {
                return this._data.CancelEvent;
            } else {
                return super.findDecisionEvent();
            }
        }
    }

    class Window_CustomMenuDataList extends Window_CustomMenu {
        makeCommandList() {
            const v  = $gameVariables.value.bind($gameVariables); // used by eval
            let list = eval(this._data.ListScript);
            if (!Array.isArray(list)) {
                list = [list];
            }
            if (this._data.FilterScript) {
                list = list.filter(item => eval(this._data.FilterScript));
            }
            if (this._data.MappingScript) {
                list = list.map(item => eval(this._data.MappingScript));
            }
            return list;
        }

        drawItemSub(item, r, index) {
            const scriptList = this._data.ItemDrawScript;
            if (scriptList && scriptList.length > 0) {
                scriptList.forEach(script => eval(script));
            } else if (item === String(item)) {
                this.drawTextEx(item, r.x, r.y);
            } else if (item.hasOwnProperty('iconIndex')) {
                this.drawItemName(item, r.x, r.y, r.width);
            } else if (item instanceof Game_Actor) {
                this.drawActorName(item, r.x, r.y, r.width);
            } else if (item.hasOwnProperty('name')) {
                this.drawTextEx(item.name, r.x, r.y);
            } else {
                this.drawTextEx(item.toString(), r.x, r.y);
                console.warn(item);
            }
        }

        findHelpText() {
            const item = this.getItem();
            return item && item.description ? item.description : super.findHelpText();
        }

        isEnabledSub(item) {
            const script = this._data.IsEnableScript;
            return script ? eval(script) : true;
        }

        setActor(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
                this.refresh();
            }
        }
    }

    class Spriteset_Menu extends Spriteset_Base {
        createBaseSprite() {
            super.createBaseSprite();
            this._blackScreen.opacity = 0;
        }

        createToneChanger() {};

        updateToneChanger() {};
    }
})();
