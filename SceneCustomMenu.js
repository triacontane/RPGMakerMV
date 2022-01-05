/*=============================================================================
 SceneCustomMenu.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.27.0 2022/01/05 ウィンドウのテキストカラーを設定できる機能を追加
 1.26.0 2021/12/16 ウィンドウごとに項目の黒い背景を非表示にできる機能を追加
 1.25.0 2021/12/14 ウィンドウ選択中に任意のボタンが押されたときに発生するイベントを登録できる機能を追加
 1.24.1 2021/11/01 描画内容がnullの場合に描画をスキップするよう修正
 1.24.0 2021/09/19 カーソル位置を記憶して画面を開き直したときに復元できる機能を追加
 1.23.0 2021/09/19 ウィンドウカーソルを項目の上に表示できる機能を追加
 1.22.3 2021/09/08 メモ欄から値を取得してピクチャを表示するとき、制御文字を変換するよう修正
 1.22.2 2021/09/07 ウィンドウに角度を付けるパラメータについて制約事項をヘルプに記載
 1.21.1 2021/09/01 メニュー画面にメッセージ表示するタイプのプラグインとの競合対策
 1.20.0 2021/08/26 ウィンドウ選択時の効果音を独自に指定できる機能を追加
                   $gameScreen.update()を呼ぶように変更。画面のフラッシュなど一部画面効果が有効になります。
 1.19.1 2021/08/12 1.19.0の修正の一部が反映されていなかった問題を修正
 1.19.0 2021/08/12 敵キャラの画像を取得するとき、フロントビュー用とサイドビュー用とで取得元が逆になっていた不具合を修正
                   敵キャラやピクチャの画像を表示する際、縦と横の揃えを指定できるパラメータを追加
 1.18.1 2021/08/11 DBのパラメータをウィンドウに表示できる機能を追加
 1.18.0 2021/08/11 敵キャラの画像をウィンドウに表示できる機能を追加
                   メモ欄から取得したテキストをウィンドウに表示できる機能を追加
 1.17.0 2021/06/19 ウィンドウに角度を付けられる機能を追加
 1.16.0 2021/05/29 シーンごとにピクチャの表示優先度を変更できる機能を追加
 1.15.0 2021/05/22 コマンドリストの揃えを指定できる機能を追加
 1.14.4 2021/05/18 一覧ウィンドウを指定しなかった場合やnullで返した場合、単項目表示ウィンドウとして機能するよう修正
 1.14.3 2021/05/15 コマンド直接入力かつフォントサイズを変更した場合に項目の表示位置が不整合になる場合がある問題を修正
 1.14.2 2021/05/15 廃止された一部のプリセットを削除
 1.14.1 2021/05/15 初期表示時にアクターのフェイスグラフィックを表示しようとしたとき、うまく表示されない場合がある問題を修正
 1.14.0 2021/05/14 決定時のイベントで元ウィンドウの選択状態を解除できる機能を追加
 1.13.3 2021/05/12 ウィンドウリストで下にあるウィンドウを『一覧ウィンドウ』に指定するとエラーになる問題を修正
 1.13.2 2021/05/10 ウィンドウ開閉が無効な場合、初期状態で非表示のウィンドウが一瞬表示されてしまう問題を修正
 1.13.1 2021/05/09 ヘルプの誤記、分かりにくい表現の修正
 1.13.0 2021/05/07 戦闘画面からカスタムメニューを呼び出して戻ったときに戦闘状況が初期化されないよう修正
 1.12.2 2021/05/07 メインフォントや項目の高さを変更した場合に項目の表示位置が不整合になる場合がある問題を修正
 1.12.1 2021/05/07 パラメータのシーン20が正常に読み込まれていなかった問題を修正
 1.12.0 2021/05/06 カスタムメニュー画面の呼び出しをプラグインコマンド化
                   ウィンドウが重なったときに背後をマスキングしない設定を追加
                   ヘルプの表示揺れ等修正
 1.11.6 2021/04/18 プリセットのスクリプトをMZ向けに修正
 1.11.5 2021/04/11 1.10.4で解消した問題をキャラクターとフェイスグラフィックにも適用
 1.11.4 2021/04/08 キャッシュされていないピクチャを表示しようとしたとき、表示順序がずれる場合がある問題を修正
 1.11.3 2021/04/08 orderAfterアノテーションを追加
                   コマンドウィンドウの文字列の縦の揃えを中央に変更
                   ヘルプウィンドウの行数変更が反映されない問題を修正
                   相対Y座標ウィンドウを指定したウィンドウの表示位置がズレる場合がある問題を修正
 1.11.2 2021/04/07 シーン情報が歯抜けになっていると以後の情報を読み込まない問題を修正
 1.11.1 2021/04/03 スクリプトに凡例を追加
 1.10.0 2021/03/31 MZで動作するよう修正
 1.9.0 2020/09/21 ウィンドウで選択中の項目オブジェクトを変数に格納できる機能を追加
 1.8.0 2020/08/02 利用可能なシーン数を20に増やした
 1.7.5 2020/07/28 NobleMushroom.jsとの競合を解消
 1.7.4 2020/07/23 1.7.3で修正した一部のリファクタリングを元に戻す
 1.7.3 2020/07/19 1.7.2の修正でパラメータの設定次第で初期ウィンドウから前の画面に戻れなくなる場合がある問題を修正
 1.7.2 2020/07/19 初期ウィンドウでキャンセルしたとき、別のウィンドウ識別子が指定されていたら前の画面に戻らないよう仕様変更
 1.7.1 2020/07/12 1.7.0の修正でパラメータの再設定をしないとコマンドウィンドウの項目が表示されなくなる問題を修正
 1.7.0 2020/07/12 再描画に同一のスイッチを指定した場合に、すべてのウィンドウが再描画されるよう修正
                  通常コマンドリストにも非表示、選択不可でスクリプトを使用できる機能を追加
                  スクリプト実行でエラーになったときにゲームを停止せずエラーログを出力するよう変更
 1.6.2 2020/07/08 マップ画面にピクチャを表示できるスクリプトを追加
 1.6.1 2020/07/06 任意のウィンドウのインデックスをコモンイベントなどから変更できるスクリプトを追加
 1.6.0 2020/06/21 項目描画で指定したメモ欄のピクチャを表示できる機能を追加
 1.5.0 2020/06/21 遷移元シーンの情報を破棄するスクリプトを追加
 1.4.0 2020/06/21 別の一覧ウィンドウの詳細情報を表示するウィンドウの作成を支援する機能を追加
 1.3.0 2020/05/01 各画面に背景画像を指定できる機能を追加
 1.2.2 2020/03/28 プリセットのスクリプトに1件追加
 1.2.1 2020/03/26 スイッチによる再描画実行後、当該スイッチにfalseではなく0が入っていたので修正
 1.2.0 2020/03/26 マスキング機能と使用禁止機能を分離し、代わりにフィルタ機能に統合
                  ヘルプの行数を指定できる機能を追加
                  スクリプトからフォーカスを変更できる機能を追加
                  未キャッシュのフェイスとキャラクターを表示できるよう修正
 1.1.1 2020/03/25 マスキング機能をヘルプ欄にも適用
                  一部のスクリプトのプリセットを修正
 1.1.0 2020/03/24 カーソルが動いたときに発生する「カーソルイベント」を追加
                  選択不可能項目を専用の文字列でマスキングできる機能を追加
                  ヘルプテキストに改行「\n」が使えるよう修正
 1.0.1 2020/03/21 スクリプトの凡例追加とヘルプの微修正
 1.0.0 2020/03/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc カスタムメニュー作成プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneCustomMenu.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param Scene1
 * @text シーン1
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {"Id":"Scene_ActorList","UseHelp":"true","HelpRows":"0","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"member_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"480\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"4\\\",\\\"ItemHeight\\\":\\\"111\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"\\\",\\\"ListScript\\\":\\\"$gameParty.members(); // パーティメンバー\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"アクターを選択してください。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"confirm\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"false\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"ItemVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"detail_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"300\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"member_window\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); // フェイスグラフィック\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"{}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"ItemVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"confirm\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"detail_window\\\",\\\"width\\\":\\\"130\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"2\\\",\\\"ItemHeight\\\":\\\"36\\\",\\\"CommandList\\\":\\\"[\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"はい\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"いいえ\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\"}\\\\\\\"]\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"本当によろしいですか？\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"SceneManager.callCustomMenu('Scene_ActorListNext'); //\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"true\\\",\\\"MaskingText\\\":\\\"\\\"}\"]","Panorama":""}
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
 * @param Scene10
 * @text シーン10
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene11
 * @text シーン11
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene12
 * @text シーン12
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene13
 * @text シーン13
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene14
 * @text シーン14
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene15
 * @text シーン15
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene16
 * @text シーン16
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene17
 * @text シーン17
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene18
 * @text シーン18
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene19
 * @text シーン19
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @param Scene20
 * @text シーン20
 * @desc 生成するカスタムメニュー用のシーン情報です。
 * @default {}
 * @type struct<Scene>
 *
 * @command CALL_SCENE
 * @text シーン呼び出し
 * @desc 指定した識別子のシーンを呼び出します。
 *
 * @arg id
 * @text シーン識別子
 * @desc 呼び出すシーン識別子です。
 * @default Scene_ActorList
 *
 * @help SceneCustomMenu.js
 *
 * パラメータからウィンドウ情報を定義して独自のメニュー画面を作れます。
 * 初期状態で動作するサンプルや豊富なスクリプトのプリセットが用意されていて
 * すぐに動作を確認できます。
 * スクリプトでエラーが発生すると開発者ツールにログが表示されます。
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
 * プラグインコマンドからも呼び出せます。
 * 『Scene_ActorList』の箇所には『シーン識別子』を設定します。
 *
 *  SceneManager.callCustomMenu('Scene_ActorList');
 *
 * メインメニュー画面にカスタムメニューの項目を追加する機能はありません。
 * 既存のプラグイン等と連携させてください。
 *
 * ・スクリプト
 * 指定したウィンドウにフォーカスを移します。
 * SceneManager.changeWindowFocus('window1');
 *
 * 指定したウィンドウのインデックスを変更します。
 * SceneManager.changeWindowIndex('window1', 1);
 *
 * 遷移元シーンの情報をひとつ破棄します。
 * SceneManager.trashScene();
 *
 * 指定したウィンドウインスタンスを取得します。（上級者向け）
 * SceneManager.findCustomMenuWindow('window1');
 *
 * マップ画面にピクチャを表示します。
 * SceneManager.showMapPicture(1, 'ファイル名', 0, 0, 0, 100, 100, 255, 1);
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
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
 * @desc 有効にした場合、画面下部にヘルプウィンドウを表示します。
 * @default true
 * @type boolean
 *
 * @param HelpRows
 * @text ヘルプ行数
 * @desc ヘルプウィンドウの行数をデフォルトの2から変更したい場合に指定してください。
 * @default 0
 * @type number
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
 * @param PicturePriority
 * @text ピクチャ表示優先度
 * @desc ピクチャのウィンドウに対する表示優先度を設定します。
 * @default 0
 * @type select
 * @option 最前面
 * @value 0
 * @option メッセージウィンドウの下
 * @value 1
 * @option すべてのウィンドウの下
 * @value 2
 *
 * @param Panorama
 * @text パノラマ画像
 * @desc 背景情報を指定します。
 * @default
 * @type struct<Panorama>
 *
 * @param UsePageButtons
 * @text ページボタンの使用
 * @desc 有効にした場合、ページボタンを表示します。
 * @default false
 * @type boolean
 *
 */

/*~struct~Panorama:
 *
 * @param Image
 * @text 画像ファイル
 * @desc 背景として表示される画像ファイルを指定します。指定しなかった場合、マップのぼかし画像が表示されます。
 * @default
 * @require 1
 * @dir img/parallaxes
 * @type file
 *
 * @param ScrollX
 * @text スクロールX
 * @desc 背景画像の横方向のスクロール速度です。
 * @default 0
 * @type number
 *
 * @param ScrollY
 * @text スクロールY
 * @desc 背景画像の縦方向のスクロール速度です。
 * @default 0
 * @type number
 */

/*~struct~Window:
 *
 * @param Id
 * @text ウィンドウ識別子
 * @desc ウィンドウの識別子(ID)です。リスト内で他の識別子と重複しない文字列を指定してください。
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
 * @param Rotation
 * @text 回転角度
 * @desc ウィンドウの角度です。度数法(0-360)で指定します。中身のフィルタが効かなくなる制約があり、スクロールするウィンドウには不向きです。
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
 * @param ListWindowId
 * @parent DataScript
 * @text 一覧ウィンドウ識別子
 * @desc 別の一覧ウィンドウの詳細情報を表示するウィンドウの場合、一覧のウィンドウ識別子を指定します。
 * @default
 *
 * @param ListScript
 * @parent DataScript
 * @text 一覧取得スクリプト
 * @desc 項目の一覧を返すスクリプトです。プリセットから選ぶこともできます。『一覧ウィンドウ識別子』を指定した場合は無効です。
 * @default
 * @type combo
 * @option null; // なし(単項目表示ウィンドウ用)
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
 * @option $dataItems.concat($dataWeapons, $dataArmors).filter(data => !!data); // アイテム、武器防具
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
 * @option s(parseInt(item.meta['value'])); // <value:n>のスイッチがON
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
 * @option this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); // フェイスグラフィック
 * @option this.drawCharacter(item.characterName(), item.characterIndex(), r.x, r.y); // キャラクター
 * @option this.drawActorCharacter(item, r.x + 24, r.y + 48); // アクターキャラクター
 * @option this.drawActorCharacter(this._actor, r.x, r.y); // メインメニューで選択したアクターキャラクター
 * @option this.drawActorFace(item, r.x, r.y); // アクターフェイス
 * @option this.drawActorName(item, r.x, r.y); // アクター名称
 * @option this.drawActorClass(item, r.x, r.y); // アクター職業
 * @option this.drawActorNickname(item, r.x, r.y); // アクターの二つ名
 * @option this.drawActorLevel(item, r.x, r.y); // アクターのレベル
 * @option this.drawActorIcons(item, r.x, r.y); // アクターのステートアイコン
 * @option this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス
 * @option this.drawEnemy(r.x, r.y, 'center', 'bottom'); // 敵キャラの画像
 * @option this.drawParam(0, r.x, r.y, 'right'); // DBパラメータ(0:HP 1:MP...)
 * @option this.drawItemName(item, r.x, r.y, r.width); // アイテムやスキルの名称
 * @option this.drawText($gameParty.numItems(item), r.x, r.y, r.width, 'right'); // アイテムの所持数
 * @option this.drawTextEx(`Text:${item.name}`, r.x, r.y, r.width); // 任意のテキスト描画(制御文字変換あり)
 * @option this.drawText(`Text:${item.name}`, r.x, r.y, r.width, 'right'); // 任意のテキスト描画(制御文字変換なし。右揃え)
 * @option this.changeTextColor(ColorManager.textColor(1)); // テキストカラー変更(drawTextでのみ有効)
 * @option this.drawText(this.findWindowItem('window1').name, r.x, r.y, r.width); // 別ウィンドウで選択している項目名
 * @option this.drawNotePicture('noteValue', r.x, r.y, 'left', 'center'); // 指定したメモ欄のピクチャを描画
 * @option this.placeActorName(item, r.x, r.y); // アクター名称(戦闘用)
 * @option this.placeStateIcon(item, r.x, r.y); // ステートアイコン(戦闘用)
 * @option this.placeGauge(item, 'hp', r.x, r.y); // HPゲージ(戦闘用)
 * @option this.placeBasicGauges(item, r.x, r.y); // ゲージセット(戦闘用)
 * @option this.drawNoteText('noteValue', r.x, r.y); // 指定したメモ欄の内容を描画
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
 * @option s(parseInt(item.meta['value'])); // <value:n>のスイッチがON
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
 * @desc 選択している項目とは関係なく表示されるヘルプテキストです。改行したい場合は「\n」と入力してください。
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
 * @param CursorEvent
 * @text カーソルイベント
 * @desc カーソルが動いた瞬間に発生するイベントです。このイベントではウィンドウのフォーカスは変更されません。
 * @default {}
 * @type struct<Event>
 *
 * @param ButtonEvent
 * @text ボタンイベント
 * @desc 指定されたボタンが押された瞬間に発生するイベントです。
 * @default []
 * @type struct<ButtonEvent>[]
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc デフォルトのフォントサイズです。0を指定すると他のウィンドウと同じサイズになります。
 * @default 0
 * @type number
 *
 * @param OverlapOther
 * @text 他ウィンドウに重ねる
 * @desc 他のウィンドウと重なって表示させたときに背後のウィンドウをマスキングさせなくなります。
 * @default false
 * @type boolean
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
 * @param RememberIndex
 * @text インデックスを記憶
 * @desc インデックス格納変数を指定している場合、画面を開いたときにカーソルの初期値を変数値で復元します。
 * @default false
 * @type boolean
 *
 * @param ItemVariableId
 * @text 選択項目格納変数
 * @desc 選択中の項目オブジェクトが常に格納される変数です。数値以外のオブジェクトが格納されるので取り扱いに注意してください。
 * @default 0
 * @type variable
 *
 * @param Cancelable
 * @text キャンセル可能
 * @desc 有効にするとウィンドウをキャンセルできるようになります。
 * @default true
 * @type boolean
 *
 * @param PopCancel
 * @text シーン戻しキャンセル
 * @desc 有効にするとこれが最初のウィンドウである場合、ウィンドウキャンセル時に前のシーンに戻ります。
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
 *
 * @param MaskingText
 * @text マスキングテキスト
 * @desc コマンドが非表示にされたとき、消える代わりに指定文字列でマスキングされます。ヘルプ欄もマスキングされます。
 * @default
 * @type string
 *
 * @param okSound
 * @text 決定SE
 * @desc 選択すると通常の決定音の代わりに指定したSEが演奏されます。
 * @default
 * @type struct<AudioSe>
 *
 * @param cursorOverContents
 * @text カーソルを手前に表示
 * @desc 有効にすると、ウィンドウカーソルが項目の上に被せるように表示されます。
 * @default false
 * @type boolean
 *
 * @param noItemBackground
 * @text 項目背景を表示しない
 * @desc 有効にすると、項目の黒い背景が表示されなくなります。
 * @default false
 * @type boolean
 *
 * @param textColor
 * @text テキストカラー
 * @desc 描画文字列のデフォルトカラーです。制御文字「\c[n]」で指定する色番号を指定します。
 * @default 0
 * @type number
 */

/*~struct~AudioSe:
 * @param name
 * @text ファイル名
 * @desc ファイル名称です。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text 音量
 * @desc ボリュームです。
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 左右バランス
 * @desc 左右バランスです。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*~struct~Command:
 *
 * @param Text
 * @text 項目内容
 * @desc 項目の描画内容です。アイコン系の制御文字が使用できます。
 * @default value01
 * @type string
 *
 * @param Align
 * @text 項目の揃え
 * @desc 項目の揃えです。
 * @default 0
 * @type select
 * @option 左揃え
 * @value 0
 * @option 中央揃え
 * @value 1
 * @option 右揃え
 * @value 2
 *
 * @param VisibleSwitchId
 * @text 表示スイッチID
 * @desc 指定したスイッチがONの場合のみ画面に表示されます。
 * @default 0
 * @type switch
 *
 * @param VisibleScript
 * @text 表示スクリプト
 * @desc 指定したスクリプトがtrueの場合のみ画面に表示されます。変数[item]で『一覧ウィンドウ識別子』の選択項目が参照できます。
 * @default
 * @type combo
 * @option item.meta['value']; // メモ欄に<value>の記述がある
 * @option item.name.match('value'); // 名前にvalueを含む
 * @option item.id > v(10); // IDが変数[10]の値より大きい
 * @option s(parseInt(item.meta['value'])); // <value:n>のスイッチがON
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
 * @param EnableSwitchId
 * @text 選択可能スイッチID
 * @desc 指定したスイッチがONの場合のみ選択できます。OFFだと選択禁止になります。
 * @default 0
 * @type switch
 *
 * @param IsEnableScript
 * @text 選択可能スクリプト
 * @desc 項目を選択可能かどうかを判定するスクリプトです。変数[item]で『一覧ウィンドウ識別子』の選択項目が参照できます。
 * @default
 * @type combo
 * @option item.meta['value']; // メモ欄に<value>の記述がある
 * @option item.name.match('value'); // 名前にvalueを含む
 * @option item.id > v(10); // IDが変数[10]の値より大きい
 * @option s(parseInt(item.meta['value'])); // <value:n>のスイッチがON
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
 * @param HelpText
 * @text ヘルプテキスト
 * @desc ヘルプウィンドウを表示している場合、ヘルプテキストが表示されます。改行したい場合は「\n」と入力してください。
 * @default
 * @type string
 *
 * @param CancelChoice
 * @text キャンセル選択肢
 * @desc この項目を選択したときに発生するイベントがキャンセルイベントになります。
 * @default false
 * @type boolean
 */

/*~struct~ButtonEvent:
 *
 * @param Name
 * @text ボタン名
 * @desc 押したときにイベントが発生するボタン名です。独自に追加したボタンの場合は直接入力してください。
 * @default
 * @type combo
 * @option ok
 * @option escape
 * @option shift
 * @option control
 * @option down
 * @option left
 * @option right
 * @option up
 * @option pageup
 * @option pagedown
 * @option debug
 * @option tab
 *
 * @param Event
 * @text イベント
 * @desc 指定したボタンが押された瞬間に発生するイベントです。
 * @default {}
 * @type struct<Event>
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
 * @text カーソルインデックス
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
 * @option SceneManager.goto(Scene_Map); // マップ画面に遷移
 * @option SceneManager.changeWindowFocus('window1'); // 指定ウィンドウにフォーカス
 * @option SceneManager.changeWindowIndex('window1', 1); // 指定ウィンドウのインデックス変更
 * @option SceneManager.trashScene(); // 元のシーン情報を破棄する
 * @option SceneManager.showMapPicture(1, '', 0, 0, 0, 100, 100, 255, 1); // マップ画面にピクチャを表示
 *
 * @param SwitchId
 * @text スイッチ
 * @desc 対象のイベントが発生したときにONになるスイッチです。
 * @type switch
 *
 * @param Deselect
 * @text 元ウィンドウ選択解除
 * @desc 対象のイベントが発生したときに元々フォーカスされていたウィンドウの選択状態を解除します。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    param.SceneList = [];
    for (let i = 1; i < 21; i++) {
        if (param[`Scene${i}`]) {
            param.SceneList.push(param[`Scene${i}`]);
        }
    }

    PluginManagerEx.registerCommand(script, 'CALL_SCENE', args => {
        SceneManager.callCustomMenu(args.id);
    });

    const outputError = function (e, script = null) {
        SoundManager.playBuzzer();
        if (script) {
            console.error(`Script Error:${script}`);
        }
        console.error(e);
        if (Utils.isNwjs()) {
            nw.Window.get().showDevTools();
        }
    };

    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            SceneManager.resetCalledCustomMenuFromBattle();
            Scene_Base.prototype.start.call(this);
        } else {
            _Scene_Battle_start.apply(this);
        }
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            Scene_Base.prototype.terminate.call(this);
        } else {
            _Scene_Battle_terminate.apply(this, arguments);
        }
    };

    const _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function() {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            Scene_Base.prototype.stop.call(this);
        } else {
            _Scene_Battle_stop.apply(this, arguments);
        }
    };

    const _Sprite_Actor_initMembers = Sprite_Actor.prototype.initMembers;
    Sprite_Actor.prototype.initMembers = function() {
        _Sprite_Actor_initMembers.apply(this, arguments);
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            this._alreadyEntry = true;
        }
    }

    const _Sprite_Actor_startEntryMotion = Sprite_Actor.prototype.startEntryMotion;
    Sprite_Actor.prototype.startEntryMotion = function() {
        if (this._alreadyEntry) {
            this.startMove(0, 0, 0);
            this._alreadyEntry = false;
        } else {
            _Sprite_Actor_startEntryMotion.apply(this, arguments);
        }
    };

    SceneManager.callCustomMenu = function (sceneId) {
        if (!this.findSceneData(sceneId)) {
            throw new Error(`Scene data '${sceneId}' is not found`);
        }
        if (this._scene instanceof Scene_Battle) {
            this._callCustomMenuFromBattle = true;
        }
        this.push(this.createCustomMenuClass(sceneId));
    };

    SceneManager.isCalledCustomMenuFromBattle = function() {
        return this._callCustomMenuFromBattle;
    };

    SceneManager.resetCalledCustomMenuFromBattle = function() {
        this._callCustomMenuFromBattle = false;
    };

    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function (sceneClass) {
        if (this._scene instanceof Scene_Map) {
            this._mapGameScreen = $gameScreen;
        }
        _SceneManager_goto.apply(this, arguments);
    };

    SceneManager.showMapPicture = function (pictureId, name, origin, x, y,
                                            scaleX, scaleY, opacity, blendMode) {
        if (this._mapGameScreen) {
            this._mapGameScreen.showPicture(pictureId, name, origin, x, y,
                scaleX, scaleY, opacity, blendMode);
        }
    };

    SceneManager.createCustomMenuClass = function (sceneId) {
        let sceneClass = {};
        const createClassEval = `sceneClass = function ${sceneId}(){\n this.initialize.apply(this, arguments)};`;
        eval(createClassEval);
        sceneClass.prototype = Object.create(Scene_CustomMenu.prototype);
        sceneClass.prototype.constructor = sceneClass;
        return sceneClass;
    };

    SceneManager.trashScene = function () {
        if (this._stack.length > 1) {
            this._stack.pop()
        }
    };

    SceneManager.findSceneData = function (sceneId) {
        return param.SceneList.filter(data => data.Id === sceneId)[0];
    };

    const _SceneManager_pop = SceneManager.pop;
    SceneManager.pop = function () {
        _SceneManager_pop.apply(this, arguments);
        this._sceneIndex = 0;
    };

    SceneManager.changeWindowFocus = function (windowId) {
        this._focusWindowId = windowId;
    };

    SceneManager.changeWindowIndex = function (windowId, index) {
        const win = this.findCustomMenuWindow(windowId);
        if (win) {
            win.select(index);
        }
    };

    SceneManager.findChangeWindowFocus = function () {
        const id = this._focusWindowId;
        if (id) {
            this._focusWindowId = null;
        }
        return id;
    };

    SceneManager.findCustomMenuWindow = function (windowId) {
        return this._scene.findWindow ? this._scene.findWindow(windowId) : null;
    };

    Game_Party.prototype.reserveMembers = function () {
        const battleMembers = this.battleMembers();
        return this.members().filter(function (actor) {
            return !battleMembers.contains(actor);
        });
    };

    class Scene_CustomMenu extends Scene_MenuBase {
        create() {
            // super.createのneedsPageButtonsで参照できるように、this._customDataの取得を一番上にする
            this._customData = SceneManager.findSceneData(PluginManagerEx.findClassName(this));
            super.create();
            this.swapGameScreen();
            this._interpreter = new Game_Interpreter();
            this.createAllObjects();
        }

        start() {
            super.start();
            this.refresh();
            this.fireEvent(this._customData.InitialEvent);
        }

        terminate() {
            super.terminate();
            this.restoreGameScreen();
        }

        stop() {
            super.stop();
            if (SceneManager.isNextScene(Scene_Battle) &&
                !SceneManager.isPreviousScene(Scene_Battle)) {
                this.launchBattle();
            }
        }

        swapGameScreen() {
            this._previousGameScreen = $gameScreen;
            window.$gameScreen = new Game_Screen();
        }

        restoreGameScreen() {
            window.$gameScreen = this._previousGameScreen;
        }

        needsPageButtons() {
            // ウィンドウのアクター切り替えを有効にしている場合に、マウスやタッチでも操作可能にするために
            // プラグインパラメータUsePageButtonsがオンの場合ページボタンを作成する
            return this._customData.UsePageButtons;
        }

        createBackground() {
            super.createBackground();
            this._panorama = new TilingSprite();
            this._panorama.move(0, 0, Graphics.width, Graphics.height);
            this.addChild(this._panorama);
        }

        createAllObjects() {
            if (this._customData.UseHelp) {
                this.createHelpWindow();
            }
            this.createCustomMenuWindowList();
            if (!this._messageWindow) {
                this.createAllMessageWindow();
            }
            this.createSpriteset();
            if (this._customData.Panorama) {
                this.setPanoramaBitmap();
            }
        }

        createCustomMenuWindowList() {
            this._customWindowMap = new Map();
            const list = this._customData.WindowList;
            list.forEach(windowData => this.createCustomMenuWindow(windowData));
            this.refresh();
            list.forEach(windowData => this.setPlacement(windowData));
        }

        refresh() {
            this._customWindowMap.forEach(win => win.refresh());
        }

        createCustomMenuWindow(data) {
            const win = this.createCustomWindowInstance(data);
            win.setHandler('ok', () => this.fireEvent(win.findDecisionEvent()));
            if (this._helpWindow) {
                win.setHelpWindow(this._helpWindow);
            }
            if (data.Cancelable) {
                win.setHandler('cancel', () => {
                    const prevActive = this._activeWindowId;
                    this.fireEvent(data.CancelEvent);
                    if (data.Id === this.findFirstWindowId() && prevActive === this._activeWindowId) {
                        // ウィンドウが一番上にあり、かつキャンセルボタンにpopSceneが設定されている場合二重に戻ってしまう
                        // プラグインパラメータPopCancelをオフにすることで無効化できるようにする
                        if (data.PopCancel === undefined || data.PopCancel) {
                            this.popScene();
                        }
                    }
                    win.select(-1);
                });
            }
            if (data.CursorEvent) {
                win.setHandler('select', () => {
                    this.fireEvent(data.CursorEvent, false);
                });
            }
            if (data.ActorChangeable) {
                win.setHandler('pagedown', this.nextActor.bind(this));
                win.setHandler('pageup', this.previousActor.bind(this));
            }
            if (data.ButtonEvent) {
                data.ButtonEvent.forEach(buttonEvent => {
                    win.setHandler('trigger:' + buttonEvent.Name, () => {
                        this.fireEvent(buttonEvent.Event, true);
                    });
                });
                win.registerButton(data.ButtonEvent.map(buttonEvent => buttonEvent.Name));
            }
            this.addWindow(win);
            this._customWindowMap.set(data.Id, win);
        }

        setPanoramaBitmap() {
            const panorama = this._customData.Panorama;
            this._panorama.bitmap = ImageManager.loadParallax(panorama.Image);
        }

        setPlacement(data) {
            const win = this.findWindow(data.Id);
            const parentX = this.findWindow(data.RelativeWindowIdX);
            if (parentX) {
                win.x += parentX.x + parentX.width;
                if (!data.width) {
                    win.width = Graphics.boxWidth - win.x;
                }
            }
            const parentY = this.findWindow(data.RelativeWindowIdY);
            if (parentY) {
                win.y += parentY.y + parentY.height;
            } else {
                win.y += this.mainAreaTop();
            }
        }

        createCustomWindowInstance(data) {
            if (data.CommandList && data.CommandList.length > 0) {
                return new Window_CustomMenuCommand(data, this._actor, this._customWindowMap);
            } else {
                return new Window_CustomMenuDataList(data, this._actor, this._customWindowMap);
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

        findWindow(id) {
            return this._customWindowMap.get(id);
        }

        update() {
            super.update();
            if (this._interpreter.isRunning()) {
                this.updateInterpreter();
            }
            const focusId = SceneManager.findChangeWindowFocus();
            if (focusId) {
                this.changeWindowFocus(focusId, -1);
            }
            if (this._customData.Panorama) {
                this.updatePanorama();
            }
            this.refreshWindowIfNeed();
            $gameScreen.update();
        }

        updatePanorama() {
            const panorama = this._customData.Panorama;
            this._panorama.origin.x += panorama.ScrollX;
            this._panorama.origin.y += panorama.ScrollY;
        }

        refreshWindowIfNeed() {
            this._customWindowMap.forEach(win => {
                win.refreshIfNeed();
            });
            this._customWindowMap.forEach(win => {
                win.resetRefreshSwitch();
            });
        };

        fireEvent(event, moveWindowFocus = true) {
            if (event.SwitchId) {
                $gameSwitches.setValue(event.SwitchId, true);
            }
            if (event.Script) {
                try {
                    eval(event.Script);
                } catch (e) {
                    outputError(e, event.Script);
                }
            }
            if (!this._active) {
                return;
            }
            if (moveWindowFocus) {
                if (event.FocusWindowId) {
                    this.changeWindowFocus(event.FocusWindowId, event.FocusWindowIndex);
                } else if (this._previousActiveWindowId && this._activeWindowId !== this.findFirstWindowId()) {
                    this.changeWindowFocus(this._previousActiveWindowId, -1);
                } else {
                    this.changeWindowFocus(this._activeWindowId || this.findFirstWindowId(), -1);
                }
                if (event.Deselect) {
                    const previousWindow = this._customWindowMap.get(this._previousActiveWindowId);
                    previousWindow.deselect();
                }
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

        // 競合したら直す
        createAllMessageWindow() {
            this._messageWindowAdd = true;
            this.createMessageWindowLayer();
            Scene_Message.prototype.createMessageWindow.call(this);
            Scene_Message.prototype.createScrollTextWindow.call(this);
            Scene_Message.prototype.createGoldWindow.call(this);
            Scene_Message.prototype.createNameBoxWindow.call(this);
            Scene_Message.prototype.createChoiceListWindow.call(this);
            Scene_Message.prototype.createNumberInputWindow.call(this);
            Scene_Message.prototype.createEventItemWindow.call(this);
            Scene_Message.prototype.associateWindows.call(this);
            this._messageWindowAdd = false;
        }

        createMessageWindowLayer() {
            this._messageWindowLayer = new WindowLayer();
            this._messageWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
            this._messageWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
            this.addChild(this._messageWindowLayer);
        }

        addWindow(window) {
            if (this._messageWindowAdd) {
                this._messageWindowLayer.addChild(window);
            } else {
                super.addWindow(window);
            }
        }

        messageWindowRect() {
            return Scene_Message.prototype.messageWindowRect.call(this);
        }

        scrollTextWindowRect() {
            return Scene_Message.prototype.scrollTextWindowRect.call(this);
        }

        goldWindowRect() {
            return Scene_Message.prototype.goldWindowRect.call(this);
        }

        eventItemWindowRect() {
            return Scene_Message.prototype.eventItemWindowRect.call(this);
        }

        createSpriteset() {
            this._spriteset = new Spriteset_Menu();
            const index = this.findSpritesetIndex();
            if (index !== null) {
                this.addChildAt(this._spriteset, index);
            } else {
                this.addChild(this._spriteset);
            }
        }

        findSpritesetIndex() {
            switch (this._customData.PicturePriority) {
                case 2:
                    return this.getChildIndex(this._windowLayer);
                case 1:
                    return this.getChildIndex(this._messageWindowLayer);
                default:
                    return null;
            }
        }

        refreshActor() {
            this._customWindowMap.forEach(win => {
                win.setActor(this._actor);
            });
        }

        onActorChange() {
            this.refreshActor();
            this.changeWindowFocus(this._activeWindowId, -1);
            // アクター切り替え時にカーソルSEを演奏する
            super.onActorChange();
        }

        launchBattle() {
            BattleManager.saveBgmAndBgs();
            this.stopAudioOnBattleStart();
            SoundManager.playBattleStart();
        }

        stopAudioOnBattleStart() {
            Scene_Map.prototype.stopAudioOnBattleStart.apply(this, arguments);
        }

        helpAreaHeight() {
            const rows = this._customData.HelpRows;
            if (rows) {
                return this.calcWindowHeight(rows, false);
            } else {
                return super.helpAreaHeight();
            }
        }
    }

    const _Window_StatusBase_initialize = Window_StatusBase.prototype.initialize;
    Window_StatusBase.prototype.initialize = function (rect, data) {
        if (data) {
            this._data = data;
            this._list = [];
        }
        _Window_StatusBase_initialize.apply(this, arguments);
    };

    class Window_CustomMenu extends Window_StatusBase {
        constructor(data, actor, windowMap) {
            super(new Rectangle(data.x, data.y, data.width || Graphics.boxWidth - data.x, data.height),
                data);
            this._actor = actor;
            this._windowMap = windowMap;
            if (data.OverlapOther) {
                this._isWindow = false;
            }
            if (this.isShowOpen() || !this.isValid()) {
                this.openness = 0;
            }
            if (this.height === 0) {
                this._dynamicHeight = true;
            }
            if (this._data.RememberIndex) {
                this.restoreIndexVariable();
            }
        }

        _createAllParts() {
            super._createAllParts();
            if (this._data.cursorOverContents) {
                const index = this._clientArea.getChildIndex(this._contentsSprite);
                this._clientArea.addChildAt(this._cursorSprite, index);
            }
        }

        paint() {
            if (this._enemySprite) {
                this._enemySprite.bitmap.clear();
            }
            super.paint();
        }

        registerButton(buttonList) {
            this._buttonList = buttonList;
        }

        playOkSound() {
            if (this._data.okSound) {
                AudioManager.playSe(this._data.okSound);
            } else {
                super.playOkSound();
            }
        }

        update() {
            this.updateOpenClose();
            super.update();
            this.updateIndexVariable();
            this.updateRotation();
            this.updateButtonInput();
        }

        updateRotation() {
            if (this._data.Rotation) {
                this.rotation = this._data.Rotation * Math.PI / 180;
            }
        }

        _updateFilterArea() {
            super._updateFilterArea();
            if (this.rotation !== 0) {
                const filterArea = this._clientArea.filterArea;
                filterArea.x = 0;
                filterArea.y = 0;
                filterArea.width = Graphics.width;
                filterArea.height = Graphics.height;
            }
        }

        updateButtonInput() {
            if (!this._buttonList) {
                return;
            }
            this._buttonList.forEach(buttonName => {
                if (Input.isTriggered(buttonName)) {
                    this.callHandler('trigger:' + buttonName);
                }
            });
        }

        select(index) {
            const prevIndex = this._index;
            super.select(index);
            if (prevIndex >= 0 && index >= 0 && index !== prevIndex) {
                this.callHandler('select');
            }
            if (this._windowMap) {
                this.refreshDetailWindow();
            }
        }

        refreshDetailWindow() {
            this._windowMap.forEach(win => {
                if (win.isDetailWindow(this._data.Id)) {
                    win.refresh();
                }
            })
        }

        calcTextHeight(textState) {
            const height = super.calcTextHeight(textState);
            return height + $gameSystem.mainFontSize() - this.contents.fontSize;
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
            if (this._index < 0) {
                return;
            }
            if (this._data.IndexVariableId) {
                $gameVariables.setValue(this._data.IndexVariableId, this._index);
            }
            if (this._data.ItemVariableId) {
                $gameVariables.setValue(this._data.ItemVariableId, this.getItem(this._index));
            }
        }

        restoreIndexVariable() {
            if (this._data.IndexVariableId) {
                const index = $gameVariables.value(this._data.IndexVariableId);
                if (index >= 0) {
                    this.select(index);
                }
            }
        }

        refreshIfNeed() {
            const switchId = this._data.RefreshSwitchId;
            if (!switchId) {
                return;
            }
            if ($gameSwitches.value(switchId)) {
                this.refresh();
            }
        }

        resetRefreshSwitch() {
            const switchId = this._data.RefreshSwitchId;
            if (switchId) {
                $gameSwitches.setValue(switchId, false);
            }
        }

        isShowOpen() {
            return this._data.ShowOpenAnimation;
        }

        lineHeight() {
            const fontSize = this._data.FontSize;
            return fontSize ? this._data.FontSize + 8 : super.lineHeight();
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

        isDetailWindow(listWindowId) {
            return this._data.ListWindowId === listWindowId;
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

        findMetaData(index) {
            const item = this.getItem(index);
            if (!item) {
                return null;
            }
            if (item.meta) {
                return item.meta;
            } else if (item.actor && item.actor().meta) {
                return item.actor().meta;
            }
            return null;
        }

        drawNotePicture(metaValue, x, y, align = 'left', valign = 'top') {
            const meta = this.findMetaData(this._drawingIndex);
            if (!meta || !meta[metaValue]) {
                return;
            }
            const fileName = PluginManagerEx.convertEscapeCharacters(meta[metaValue]);
            if (fileName) {
                this.drawPicture(fileName, x, y, align, valign);
            }
        };

        drawPicture(file, x, y, align = 'left', valign = 'top') {
            const bitmap = ImageManager.loadPicture(file);
            if (bitmap.isReady()) {
                x += this.findAlignX(align, bitmap);
                y += this.findAlignY(valign, bitmap);
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        drawEnemy(x, y, align = 'left', valign = 'top') {
            const item = this.getItem(this._drawingIndex);
            const bitmap = this.loadEnemyImage(item);
            if (bitmap.isReady()) {
                if (!this._enemySprite) {
                    this._enemySprite = this.createEnemyContents();
                }
                this._enemySprite.setHue(item.battlerHue);
                x += this.findAlignX(align, bitmap);
                y += this.findAlignY(valign, bitmap);
                this._enemySprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        findAlignX(align, bitmap) {
            const width = this.itemRect(this._drawingIndex).width;
            const shiftX = width - bitmap.width;
            switch (align.toLowerCase()) {
                case 'right':
                    return shiftX;
                case 'center':
                    return shiftX / 2;
                default:
                    return 0;
            }
        }

        findAlignY(valign, bitmap) {
            const height = this.innerHeight;
            const shiftY = height - bitmap.height;
            switch (valign.toLowerCase()) {
                case 'bottom':
                    return shiftY;
                case 'center':
                    return shiftY / 2;
                default:
                    return 0;
            }
        }

        createEnemyContents() {
            const sprite = new Sprite();
            sprite.bitmap = new Bitmap(this.contents.width, this.contents.height);
            const area = this._clientArea;
            area.addChildAt(sprite, area.getChildIndex(this._contentsSprite));
            return sprite;
        }

        loadEnemyImage(item) {
            if ($gameSystem.isSideView()) {
                return ImageManager.loadSvEnemy(item.battlerName);
            } else {
                return ImageManager.loadEnemy(item.battlerName);
            }
        }

        drawNoteText(metaValue, x, y) {
            const meta = this.findMetaData(this._drawingIndex);
            if (meta && meta[metaValue] !== undefined) {
                this.drawTextEx(meta[metaValue], x, y);
            }
        }

        drawParam(paramIndex, x, y, align = 'left') {
            const item = this.getItem(this._drawingIndex);
            const rect = this.itemRect(this._drawingIndex);
            this.drawText(item.params[paramIndex], x, y, rect.width - x, align);
        }

        setDynamicHeight() {
            this.height = this.fittingHeight(this.numVisibleRows());
            this.createContents();
        }

        fittingHeight(numLines) {
            return numLines * this.itemHeight() + this.padding * 2;
        }

        makeCommandList() {
        }

        maxItems() {
            return this._list.length;
        }

        drawItem(index) {
            this._drawingIndex = index;
            const item = this.getItem(index);
            const rect = this.findItemRect(index);
            this.changePaintOpacity(this.isEnabled(index));
            if (this.isMasking(index)) {
                this.drawMasking(rect);
            } else {
                this.drawItemSub(item, rect, index);
            }
            this.changePaintOpacity(1);
        }

        findItemRect(index) {
            const rect = this.itemRectWithPadding(index);
            rect.y += this.rowSpacing() / 2;
            return rect;
        }

        drawItemSub(item, rect, index) {
        };

        retryDrawItem(bitmap) {
            const index = this.index();
            bitmap.addLoadListener(() => {
                if (index === this.index()) {
                    this.drawItem(this._drawingIndex);
                }
            });
        }

        drawMasking(rect) {
            this.drawTextEx(this._data.MaskingText, rect.x, rect.y);
        }

        updateHelp() {
            let text = this.findHelpText() || '';
            if (this.isMasking(this.index())) {
                text = this._data.MaskingText;
            }
            this._helpWindow.setText(text.replace(/\\n/g, '\n'));
        }

        findHelpText() {
            return this._data.CommonHelpText;
        }

        findDecisionEvent() {
            return this._data.DecisionEvent;
        }

        findCurrentItem() {
            return this.getItem(this.index());
        }

        findWindowItem(windowId) {
            const win = this._windowMap.get(windowId);
            if (!win) {
                throw new Error(`Window [${windowId}] is not found.`);
            }
            return win.findCurrentItem();
        }

        findListWindowItem() {
            const listWindowId = this._data.ListWindowId;
            return listWindowId ? this.findWindowItem(listWindowId) : null;
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
            return item ? this.isEnabledSub(item) && !this.isMasking(index) : false;
        }

        isMasking(index) {
            const item = this.getItem(index);
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            return this.isUseMasking() && !this.isVisible(item, v, s);
        }

        isVisible(item, v, s) {
            return true;
        }

        isEnabledSub(item) {
        };

        activate() {
            if (this._index < 0) {
                this.select(0);
            }
            super.activate();
        }

        isUseMasking() {
            return !!this._data.MaskingText;
        }

        setActor(actor) {
        }

        drawItemBackground(index) {
            if (!this._data.ListWindowId && this._list[0] !== ' ' && !this._data.noItemBackground) {
                super.drawItemBackground(index);
            }
        }

        resetTextColor() {
            super.resetTextColor();
            if (this._data.textColor > 0) {
                this.changeTextColor(ColorManager.textColor(this._data.textColor));
            }
        }
    }

    class Window_CustomMenuCommand extends Window_CustomMenu {
        makeCommandList() {
            const list = this._data.CommandList;
            return this.isUseMasking() ? list : list.filter(data => this.isVisible(data));
        }

        isVisible(item) {
            return this.isScriptValid(item.VisibleScript) && this.isSwitchValid(item.VisibleSwitchId);
        }

        drawItemSub(item, rect, index) {
            const width = this.textSizeEx(item.Text).width;
            if (item.Align === 1) {
                rect.x += (rect.width - width) / 2;
            } else if (item.Align === 2) {
                rect.x += rect.width - width;
            }
            this.drawTextEx(item.Text, rect.x, rect.y, rect.width);
        }

        findItemRect(index) {
            return this.itemLineRect(index);
        }

        findHelpText() {
            const item = this.getItem();
            return item && item.HelpText ? item.HelpText : super.findHelpText();
        }

        isEnabledSub(item) {
            return this.isScriptValid(item.IsEnableScript) && this.isSwitchValid(item.EnableSwitchId);
        }

        isSwitchValid(id) {
            return !id || $gameSwitches.value(id);
        }

        isScriptValid(script) {
            if (script === '' || script === undefined) {
                return true;
            }
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            const item = this.findListWindowItem(); // used by eval
            if (item === undefined) {
                return false;
            }
            try {
                return eval(script);
            } catch (e) {
                outputError(e, script);
                return true;
            }
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
            if (this._data.ListWindowId) {
                const data = this.findListWindowItem();
                return data ? [data] : [];
            }
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            let list;
            try {
                list = eval(this._data.ListScript);
            } catch (e) {
                outputError(e, this._data.ListScript);
                list = [];
            }
            if (!Array.isArray(list)) {
                list = list ? [list] : [' '];
            }
            if (this._data.FilterScript && !this.isUseMasking()) {
                list = list.filter(item => this.isVisible(item, v, s));
            }
            if (this._data.MappingScript) {
                list = list.map(item => {
                    try {
                        return eval(this._data.MappingScript)
                    } catch (e) {
                        outputError(e, this._data.MappingScript);
                        return null;
                    }
                });
            }
            return list;
        }

        isVisible(item, v, s) {
            try {
                return eval(this._data.FilterScript)
            } catch (e) {
                outputError(e, this._data.FilterScript);
                return false;
            }
        }

        drawItemSub(item, r, index) {
            const scriptList = this._data.ItemDrawScript;
            if (scriptList && scriptList.length > 0) {
                scriptList.forEach(script => {
                    try {
                        eval(script)
                    } catch (e) {
                        outputError(e, script);
                    }
                });
            } else if (item === undefined || item === null) {
                // do nothing
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
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            const script = this._data.IsEnableScript;
            try {
                return script ? eval(script) : true;
            } catch (e) {
                outputError(e, script);
                return false;
            }

        }

        setActor(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
                this.refresh();
            }
        }

        drawFace(faceName, faceIndex, x, y, width, height) {
            const bitmap = ImageManager.loadFace(faceName);
            if (bitmap.isReady()) {
                super.drawFace(faceName, faceIndex, x, y, width, height);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        drawCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            if (bitmap.isReady()) {
                super.drawCharacter(characterName, characterIndex, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }
    }

    class Spriteset_Menu extends Spriteset_Base {
        createBaseSprite() {
            super.createBaseSprite();
            this._blackScreen.opacity = 0;
        }

        createToneChanger() {
        };

        updateToneChanger() {
        };
    }
})();
