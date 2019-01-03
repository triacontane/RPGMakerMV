//=============================================================================
// SceneGlossary.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.11.2 2019/01/04 2.11.0の対応でピクチャの拡大率が機能しなくなっていた問題を修正
// 2.11.1 2018/12/07 収集率を取得できるスクリプトをヘルプに記載
// 2.11.0 2018/11/24 カテゴリ選択中でも収集率が表示されるよう修正
//                   一部の処理を軽量化
// 2.10.0 2018/09/13 説明文に対象アイテムデータの説明や価格を埋め込める制御文字を追加
// 2.9.2 2018/09/02 ピクチャを指定していると敵キャラデータの取得が行われない問題を修正
// 2.9.1 2018/08/31 敵キャラのパラメータ出力機能を使う際、敵キャラの画像を表示したページでないとパラメータ表示できない問題を修正
// 2.9.0 2018/08/12 スイッチにより特定の用語の文字色を変更できる機能を追加
// 2.8.1 2018/07/11 文章の最後の自動改行位置が正しく判定されないケースがある問題を修正
// 2.8.0 2018/06/14 収集率算出の対象から外せる用語を指定できる機能を追加
// 2.7.0 2018/04/30 ひとつの用語に対して複数の画像を表示できる機能を追加
// 2.6.2 2018/04/19 ヘルプの一部を英語化
// 2.6.1 2018/04/07 用語選択からカテゴリ選択に戻ったときに、最後に選択していた用語の情報が残ってしまう問題を修正
// 2.6.0 2018/03/17 テキストのY座標を数値指定できる機能を追加
// 2.5.0 2018/03/11 画像の表示位置と表示優先度のパラメータを分けました。
//                  モンスターの報酬情報を記入できる制御文字を追加
// 2.4.0 2018/03/11 モンスター辞典を作成するための各種支援機能を追加しました。
// 2.3.2 2018/03/03 画面起動時のパフォーマンスを改善
//                  コモンイベントを実行するアイテムの使用時に内容次第でエラーになっていた問題を修正
// 2.3.1 2018/02/24 用語情報を設定していない場合のエラーメッセージを言語別に表示するよう修正。ヘルプを分かりやすく修正。
// 2.3.0 2018/02/17 未入手の用語を？？？等で表記できる機能を追加
// 2.2.1 2018/01/20 setMaxItem.jsとの競合を解消。他のプラグインから用語辞典ウィンドウを改変できるように定義をグローバル領域に移動
// 2.2.0 2018/01/14 複数のカテゴリに属する用語を作成できる機能を追加
// 2.1.0 2017/12/12 入手履歴使用有無と用語リストウィンドウの横幅を、辞書ごとに別々に設定できるようになりました。
// 2.0.1 2017/12/10 2.0.0においてYEP_MainMenuManager.jsとの連携時、ヘルプに示している登録内容で実行するとエラーになっていた問題を修正
// 2.0.0 2017/12/09 用語辞典を好きなだけ追加し、各辞典ごとに仕様や表示内容をカスタマイズできる機能を追加
//                  用語カテゴリを変更できるコマンドを追加、アイテムごとに使用可否を設定できる機能を追加
//                  アイテム使用時に使用したアイテムIDを変数に格納する機能と、任意のスイッチを変更できる機能を追加
// 1.18.1 2017/10/15 1.16.0の機能追加により、カテゴリ数が10以上かつ並び順を指定しない場合の並び順がおかしくなる問題を修正
// 1.18.0 2017/09/01 カテゴリごとにアイテム使用可否を設定できる機能を追加
// 1.17.0 2017/08/21 用語に制御文字が使われた場合は自動変換する機能を追加
// 1.16.1 2017/08/04 セーブとロードを繰り返すと用語辞典の初期位置が最後に選択していたものになってしまう問題を修正
//                   コマンド「GLOSSARY_GAIN_ALL」で隠しアイテム以外も辞書に追加されるよう仕様変更
// 1.16.0 2017/08/03 カテゴリの並び順を自由に指定できる機能を追加
// 1.15.1 2017/07/22 1.15.0でパラメータのブール変数項目が全て効かなくなっていた問題を修正
// 1.15.0 2017/07/13 最後に選択していた項目を記憶した状態で辞書画面に戻る機能を追加
//                   パラメータの型指定機能に対応
// 1.14.1 2017/06/22 カテゴリ表示が有効な場合に、対象用語を一つも所持していない場合はカテゴリリストに表示しないよう修正
// 1.14.0 2017/06/08 所持数表示機能を追加
// 1.13.0 2017/04/19 自動翻訳プラグインに一部対応
// 1.12.0 2017/04/09 用語集リストの表示順を個別に設定する機能を追加
// 1.11.3 2017/03/31 用語リストをスクロールしたときに確認ウィンドウの位置がおかしくなる問題を修正
// 1.11.2 2017/03/08 カテゴリウィンドウで制御文字を使っていない場合は、ウィンドウ幅に応じて文字を縮めるように修正
// 1.11.1 2017/02/09 ピクチャが空の状態でもページ表示できるよう修正
// 1.11.0 2017/02/09 「武器」と「防具」を専用のカテゴリで表示しようとすると表示できない問題を修正
//                   変数などで動的に表示内容を変化させる場合に、表示内容が空の場合はページを表示しないよう修正
// 1.10.0 2017/01/10 辞書画面ごとに別々の背景を指定できる機能を追加
// 1.9.0 2017/01/03 メニュー画面の辞書コマンドに出現条件を指定できる機能を追加
// 1.8.0 2016/12/23 説明文の自動改行機能を追加
// 1.7.1 2016/12/09 1.7.0で収集率が正しく表示されない問題を修正
// 1.7.0 2016/12/09 隠しアイテムでない「アイテム」「武器」「防具」も辞書画面に登録できる機能を追加
// 1.6.0 2016/10/26 背景ピクチャを設定したときに、もともとマップ背景を透過表示できる機能を追加
// 1.5.0 2016/08/06 まだ確認していない用語の文字色を変えられる機能を追加
// 1.4.1 2016/07/03 戦闘画面のアイテム選択ウィンドウに用語集アイテムが表示されていた問題を修正
// 1.4.0 2016/05/31 テキストと画像を重ねて表示する設定を追加
//                  新語が自動登録された場合にスイッチや変数を操作する機能を追加
//                  アイテムを使用する際に確認ウィンドウを表示する機能を追加
//                  新語の自動登録に制御文字を使えるよう修正
//                  収集率を画面左下に表示できる機能を追加
// 1.3.1 2016/04/26 ピクチャ名を変数で指定できる機能を追加
// 1.3.0 2016/04/23 用語の種別ごとに、複数の用語画面を作成できる機能を追加
//                  用語をアイテムとして使用できる機能を追加
// 1.2.1 2016/04/21 複数ページ送りをタッチ操作に対応
//                  アイテムタイプの判定が無条件で有効になってしまう不具合を修正
// 1.2.0 2016/04/20 自動登録の対象外にするタグを追加
//                  ひとつの用語に対して複数のページを表示できる機能を追加
//                  用語が存在しない状態で決定ボタンを押すとフリーズする問題を修正
// 1.1.0 2016/04/20 カテゴリごとに分類して表示できる機能を追加
// 1.0.0 2016/04/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SceneGlossaryPlugin
 * @author triacontane
 *
 * @param GlossaryInfo
 * @desc 用語辞典情報です。任意の用語辞典を追加できます。必ず1件以上の用語を登録してください。
 * @type struct<GlossaryData>[]
 *
 * @param Layout
 * @desc レイアウト設定関連項目です。まとめ用の項目なのでここには何も入力しないでください。
 *
 * @param FontSize
 * @desc 用語集のフォントサイズです。
 * @default 22
 * @type number
 * @parent Layout
 *
 * @param AutoResizePicture
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。テキスト位置を指定した場合は無効です。
 * @default true
 * @type boolean
 * @parent Layout
 *
 * @param PicturePosition
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @option text
 * @parent Layout
 *
 * @param TextPosition
 * @desc テキストの表示Y座標です。0の場合は画像の表示位置によって自動設定されます。
 * @default 0
 * @type number
 *
 * @param PictureAlign
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 * @type select
 * @option left
 * @option center
 * @option right
 * @parent Layout
 *
 * @param PicturePriority
 * @desc 画像の表示プライオリティです。(top:テキストの上 bottom:テキストの下)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @parent Layout
 *
 * @param ThroughBackPicture
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default false
 * @type boolean
 * @parent Layout
 *
 * @param NewGlossaryColor
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 * @type number
 * @parent Layout
 *
 * @param PageWrap
 * @desc 複数のページが存在する場合、最後のページまで到達していたら最初のページに戻します。
 * @default true
 * @type boolean
 * @parent Layout
 *
 * @param AutoAddition
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AutoAdditionEnemy
 * @desc 敵キャラを撃破したときに敵キャラと同名の単語を自動登録します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param SwitchAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 * @type switch
 * @parent AutoAddition
 *
 * @param VariableAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 * @type variable
 * @parent AutoAddition
 *
 * @param CategoryOrder
 * @desc カテゴリ並び順を任意に変更したい場合はカテゴリ名を指定してください。
 * @default
 * @type string[]
 *
 * @param CategoryUnusable
 * @desc ここで指定したカテゴリは「アイテム使用」が有効でも使用できなくなります。
 * @default
 * @type string[]
 *
 * @noteParam SGピクチャ
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @noteParam SGPicture
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @help Add a screen that allows you to view the terms that appear in the game.
 * Images and text descriptions describing the terms are displayed in the window.
 *
 * How to use
 * 1. Register items to be treated as terms from the database.
 *
 * 2. Set the parameter "GlossaryInfo".
 *
 * Terms can be browsed by acquiring the target item, and there is
 * also a function to register automatically
 * when the same word appears in the command of displaying sentences.
 * (It is also possible to specify a specific term outside the scope
 * of automatic registration)
 *
 * You can switch from menu scene and plugin command to
 * glossary scene.
 *
 * How to register data
 * 1. Register new data in item database and
 * set "item type" to "hidden item A" or "hidden item B"
 *
 * 2. Set note param
 * <SGDescription:xxx> // Description of Glossary *1
 * <SGCategory:xxx>    // Category of Glossary
 * <SGManual>          // Exclude terms from automatic registration
 * <SGPicture:filename> // Filename of the term picture
 * <SGEnemy:1>          // Enemy instead of the picture
 * <SGPicturePosition:text> // Picture position
 *  top, bottom, text
 * <SGTextPosition:100>      // Text position
 * <SGPicturePriority:top>   // Picture priority
 *  top, bottom
 * <SGPictureScale:0.5>     // Picture scale
 * <SGPictureAlign:right>   // Picture align
 *  left, center, right
 * <SGNoCollect>            // Glossary No Collect
 * <SGTextColorChange:1,10> // If switch[1] ON. Change color[10]
 *
 * *1 Escape Characters
 * \COMMON[1]  // It is replaced by aaa(<CommonDescription:aaa>)
 * \mhp[3]     // Enemy Max HP(Zero padding 3)
 * \mmp[3]     // Max MP
 * \atk[3]     // Atk
 * \def[3]     // Def
 * \mag[3]     // Mag
 * \mdf[3]     // Mdf
 * \agi[3]     // Agi
 * \luk[3]     // Luk
 * \exp[3]     // Exp
 * \money[3]   // Gold
 * \drop[1]    // Drop item 1
 * \DATA[prop] // 対象データのプロパティ「prop」に置き換えられます。(下記参照)
 * \DATA[description] // 対象データの説明
 * \DATA[price]       // 対象データの価格
 *
 * you can use multiple pages with one term.
 * The pages are switched with the direction keys.
 * <SGDescription2:xxx>
 * <SGPicture2:filename>
 * <SGPicturePosition2:text>
 *
 * The same is true for the third and subsequent pages, up to 99 pages can be specified.
 * Do not attach "1" to the first page when displaying multiple pages.
 * NG:<SGDescription1:xxx>
 *
 * The following tags are required when displaying terms in different type of dictionary.
 * <SGType:2>   // Type of Glossary
 *
 * Plugin Command
 *
 * GLOSSARY_GAIN_ALL
 *  All terms registered in the database will be in acquisition state.
 *
 * GLOSSARY_CALL [Type]
 *  Call the glossary screen.
 *  If the type is omitted, it will be automatically set to "1".
 * ex：GLOSSARY_CALL 1
 *
 * GLOSSARY_BACK
 *  Call up the glossary screen with reselecting the last selected item.
 * ex：GLOSSARY_BACK
 *
 * GLOSSARY_ITEM_CHANGE_CATEGORY [Item id] [new category]
 *  Change the category of the item with the specified ID to another one.
 * ex：GLOSSARY_ITEM_CATEGORY_CHANGE 10 AAA
 * Only items can be changed. Weapons and armors can not be changed.
 *
 * GLOSSARY_ITEM_CHANGE_USABLE [Item id] [ON or OFF]
 *  Change prohibition of items with the specified ID.
 *  (ON: Possible OFF: Prohibited)
 * ex：GLOSSARY_ITEM_CHANGE_USABLE 10 ON
 * Only items can be changed. Weapons and armors can not be changed.
 *
 * This software is released under the MIT License. Check header.
 */

/*~struct~GlossaryData:
 *
 * @param GlossaryType
 * @desc 用語種別です。<SG種別:n>で指定した用語が表示されます。
 * @default 1
 * @type number
 * @min 1
 *
 * @param CommandName
 * @desc メニュー画面に表示されるコマンド名です。空にするとメニュー画面に表示されなくなります。
 * @default 用語辞典
 *
 * @param UseCategory
 * @desc 用語をカテゴリごとに分けて表示します。
 * @default false
 * @type boolean
 *
 * @param CommandSwitchId
 * @desc 辞書コマンドの出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param SelectAction
 * @desc 用語を選択したときの動作です。
 * @default 0
 * @type select
 * @option 使用不可
 * @value 0
 * @option アイテム使用
 * @value 1
 * @option スイッチ設定
 * @value 2
 *
 * @param SelectSwitchId
 * @desc 用語アイテムの選択時の動作がスイッチ設定の場合にONになるスイッチ番号です。キャンセルでOFFが設定されます。
 * @default 0
 * @type switch
 * @parent SelectAction
 *
 * @param SelectVariableId
 * @desc 用語アイテムの選択時の動作がアイテム使用の場合にアイテムIDが設定される変数番号です。キャンセルで-1が設定されます。
 * @default 0
 * @type variable
 * @parent SelectAction
 *
 * @param ConfirmMessage
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default false
 * @type boolean
 *
 * @param ConfirmUse
 * @desc 確認メッセージで使う場合のメッセージです。
 * @default 使う
 * @parent ConfirmMessage
 *
 * @param ConfirmNoUse
 * @desc 確認メッセージで使わない場合のメッセージです。
 * @default やめる
 * @parent ConfirmMessage
 *
 * @param GlossaryHelp
 * @desc 用語リスト選択時のヘルプ画面に表示するテキストです。未指定の場合、ヘルプウィンドウは非表示になります。
 * @default ゲーム中に登場する用語を解説しています。
 *
 * @param CategoryHelp
 * @desc 用語カテゴリ選択時のヘルプ画面に表示するテキストです。
 * @default カテゴリを選択してください。
 * @parent GlossaryHelp
 *
 * @param ConfirmHelp
 * @desc 用語アイテムの選択確認時に表示するテキストです。指定しなかった場合、何も表示されません。
 * @default
 * @parent GlossaryHelp
 *
 * @param UsingHelp
 * @desc 用語アイテムの使用後に表示するテキストです。指定しなかった場合、何も表示されません。
 * @default
 * @parent GlossaryHelp
 *
 * @param CompleteView
 * @desc カテゴリごとの収集率を表示します。コンプリートの目安です。
 * @default false
 * @type boolean
 *
 * @param CompleteMessage
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default 収集率 \c[2]%1\c[0] ％
 * @parent CompleteView
 *
 * @param ShowingItemNumber
 * @desc 用語集アイテムの所持数を表示します。
 * @default false
 * @type boolean
 *
 * @param UsableDefault
 * @desc 用語集アイテムの初期状態での使用可否です。プラグインコマンドから個別に使用可否を変更できます。
 * @default true
 * @type boolean
 *
 * @param UseItemHistory
 * @desc ONにすると一度入手した用語アイテムを失っても辞書には表示されたままになります。
 * @default false
 * @type boolean
 *
 * @param GlossaryListWidth
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 * @type number
 * @parent Layout
 *
 * @param VisibleItemNotYet
 * @text 未入手アイテムの表示
 * @desc 未入手アイテムを指定した名前（？？？等）で表示します。指定しない場合この機能は無効になります。
 * @default
 */

/*:ja
 * @plugindesc ゲーム内用語辞典プラグイン
 * @author トリアコンタン
 *
 * @param GlossaryInfo
 * @text 用語情報(設定必須)
 * @desc 用語辞典情報です。任意の用語辞典を追加できます。必ず1件以上の用語を登録してください。
 * @default ["{\"GlossaryType\":\"1\",\"CommandName\":\"用語辞典\",\"UseCategory\":\"false\",\"CommandSwitchId\":\"0\",\"BackPicture\":\"\",\"SelectAction\":\"0\",\"SelectSwitchId\":\"0\",\"SelectVariableId\":\"0\",\"ConfirmMessage\":\"false\",\"ConfirmUse\":\"使う\",\"ConfirmNoUse\":\"やめる\",\"GlossaryHelp\":\"ゲーム中に登場する用語を解説しています。\",\"CategoryHelp\":\"カテゴリを選択してください。\",\"ConfirmHelp\":\"\",\"UsingHelp\":\"\",\"CompleteView\":\"false\",\"CompleteMessage\":\"収集率 \\\\c[2]%1\\\\c[0] ％\",\"ShowingItemNumber\":\"false\",\"UsableDefault\":\"true\",\"UseItemHistory\":\"false\",\"GlossaryListWidth\":\"240\",\"VisibleItemNotYet\":\"\"}"]
 * @type struct<GlossaryData>[]
 *
 * @param Layout
 * @text レイアウト
 * @desc レイアウト設定関連項目です。まとめ用の項目なのでここには何も入力しないでください。
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc 用語集のフォントサイズです。
 * @default 22
 * @type number
 * @parent Layout
 *
 * @param AutoResizePicture
 * @text 画像の自動縮小
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。テキスト位置を指定した場合は無効です。
 * @default true
 * @type boolean
 * @parent Layout
 *
 * @param PicturePosition
 * @text 画像の表示位置
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @option text
 * @parent Layout
 *
 * @param TextPosition
 * @text テキストの表示位置
 * @desc テキストの表示Y座標です。0の場合は画像の表示位置によって自動設定されます。
 * @default 0
 * @type number
 *
 * @param PictureAlign
 * @text 画像の揃え
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 * @type select
 * @option left
 * @option center
 * @option right
 * @parent Layout
 *
 * @param PicturePriority
 * @text 画像の優先度
 * @desc 画像の表示プライオリティです。(top:テキストの上 bottom:テキストの下)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @parent Layout
 *
 * @param ThroughBackPicture
 * @text 背景ピクチャ透過
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default false
 * @type boolean
 * @parent Layout
 *
 * @param NewGlossaryColor
 * @text 新着用語カラー
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 * @type number
 * @parent Layout
 *
 * @param PageWrap
 * @text ページ折り返し
 * @desc 複数のページが存在する場合、最後のページまで到達していたら最初のページに戻します。
 * @default true
 * @type boolean
 * @parent Layout
 *
 * @param AutoAddition
 * @text 自動登録
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AutoAdditionEnemy
 * @text 敵キャラ自動登録
 * @desc 敵キャラを撃破したときに敵キャラと同名の単語を自動登録します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param SwitchAutoAdd
 * @text 自動登録IDスイッチ
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 * @type switch
 * @parent AutoAddition
 *
 * @param VariableAutoAdd
 * @text 自動登録ID変数
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 * @type variable
 * @parent AutoAddition
 *
 * @param CategoryOrder
 * @text カテゴリ並び順
 * @desc カテゴリ並び順を任意に変更したい場合はカテゴリ名を指定してください。
 * @default
 * @type string[]
 *
 * @param CategoryUnusable
 * @text 使用禁止カテゴリ
 * @desc ここで指定したカテゴリは「アイテム使用」が有効でも使用できなくなります。
 * @default
 * @type string[]
 *
 * @noteParam SGピクチャ
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @noteParam SGPicture
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @help ゲームに登場する用語を閲覧できる画面を追加します。
 * 用語を解説する画像およびテキスト説明がウィンドウに表示されます。
 *
 * ・使い方
 * 1. 用語として扱うアイテムをデータベースから登録してください。
 * 詳細な登録方法は、後述の「データ登録方法」をご参照ください。
 *
 * 2. パラメータの「用語情報」を設定してください。（項目をダブルクリック）
 * 当該パラメータを設定せずにプラグインコマンドから用語辞典を起動すると
 * エラーになるので注意してください。
 *
 * ※バージョン2.0.0よりパラメータの構成が変わりました。
 * 以前のバージョンを使っていた場合はパラメータを再設定する必要があります。
 *
 * 用語は対象アイテムを取得することで閲覧可能になるほか、文章の表示の命令中で
 * 同一単語が出現した場合に自動的に登録する機能もあります。
 * （特定の用語を自動登録の対象外に指定することも可能です）
 *
 * 用語はすべてを一つのウィンドウで表示する方式と
 * カテゴリごとに分類して表示する方式が選択できます。
 * パラメータから表示方法を選択してください。
 * カテゴリごとに表示する場合はメモ欄に「<SGカテゴリ:XXX>」を指定してください。
 * カテゴリをカンマ区切りで指定すると、複数のカテゴリに所属できます。
 *
 * 例：<SGカテゴリ:XXX,YYY>
 *
 * メニュー画面およびプラグインコマンドから用語集画面に遷移できます。
 *
 * ・データ登録方法
 * 1.アイテムデータベースに新規データを登録して
 * 「アイテムタイプ」を「隠しアイテムA」もしくは「隠しアイテムB」に設定
 *
 * 2.「名前」に用語の名称を設定
 *
 * 3.「メモ欄」に以下の通り記述(不要な項目は省略可能)
 * <SG説明:説明文>           // 用語の説明文(※1)
 * <SG共通説明:説明文>       // 用語の共通説明文(使い回し用)
 * <SGカテゴリ:カテゴリ名>   // 用語の属するカテゴリの名称
 * <SG手動>                  // 用語を自動登録の対象から除外する
 * <SGピクチャ:ファイル名>   // 用語のピクチャのファイル名
 * <SG敵キャラ:敵キャラID>   // ピクチャの代わりに敵キャラの画像を表示(※2)
 * <SGピクチャ位置:text>     // ピクチャの表示位置
 * <SGテキスト位置:100>      // テキストの表示位置
 *  top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾
 * <SGピクチャ優先度:top>    // ピクチャの表示プライオリティ
 *  top:テキストの上 bottom:テキストの下
 * <SGピクチャ拡大率:0.5>    // ピクチャの拡大率
 * <SGピクチャ揃え:right>    // ピクチャの揃え
 *  left:左揃え center:中央揃え right:右揃え
 * <SG収集対象外>            // 用語を収集率算出の対象外に設定
 * <SGテキスト色変化:1,10>   // スイッチ[1]がONのとき文字色を[10]に変更
 *
 * ※1 以下の特殊な制御文字が使用できます。
 * \COMMON[1]  // ID[1]のアイテムの<SG共通説明:aaa>に置き換えられます。
 * \mhp[3]     // 対象敵キャラの最大HP(3桁でゼロ埋め)
 * \mmp[3]     // 対象敵キャラの最大MP(3桁でゼロ埋め)
 * \atk[3]     // 対象敵キャラの攻撃力(3桁でゼロ埋め)
 * \def[3]     // 対象敵キャラの防御力(3桁でゼロ埋め)
 * \mag[3]     // 対象敵キャラの魔法力(3桁でゼロ埋め)
 * \mdf[3]     // 対象敵キャラの魔法防御(3桁でゼロ埋め)
 * \agi[3]     // 対象敵キャラの敏捷性(3桁でゼロ埋め)
 * \luk[3]     // 対象敵キャラの運(3桁でゼロ埋め)
 * \exp[3]     // 対象敵キャラの獲得経験値(3桁でゼロ埋め)
 * \money[3]   // 対象敵キャラの獲得ゴールド(3桁でゼロ埋め)
 * \drop[1]    // 対象敵キャラの[1]番目のドロップアイテム
 * \DATA[prop] // 対象データのプロパティ「prop」に置き換えられます。(下記参照)
 * \DATA[description] // 対象データの説明
 * \DATA[price]       // 対象データの価格
 *
 * ※2 敵キャラIDを省略すると用語アイテムと同名の敵キャラ自動で設定されます。
 *
 * さらに、一つの用語で複数のページを使用することができます。
 * ページは方向キーの左右で切り替えます。
 * <SG説明2:説明文>          // 2ページ目の用語の説明文
 * <SGピクチャ2:ファイル名>  // 2ページ目の用語のピクチャのファイル名
 * <SGピクチャ位置2:text>    // 2ページ目のピクチャの表示位置
 *
 * 3ページ目以降も同様で、最大99ページまで指定できます。
 * 複数ページ表示する場合の1ページ目には「1」をつけないでください。
 * NG:<SG説明1:説明文>
 *
 * 種別の異なる用語辞典に用語を表示する場合は以下のタグが必要です。
 * <SG種別:2>   // 用語の属する種別番号
 *
 * 「YEP_MainMenuManager.js」と連携して、コマンドの表示制御を行うには
 * 「コマンド名称」の項目を空にした上で「YEP_MainMenuManager.js」の
 * パラメータを以下の通り設定してください。
 *
 * Menu X Name      : '用語辞典1'
 * Menu X Symbol    : glossary1
 * Menu X Main Bind : this.commandGlossary.bind(this, 1)
 *
 * ・追加機能1
 * 隠しアイテムでない「アイテム」「武器」「防具」も辞書画面に
 * 表示できるようになりました。隠しアイテムと同じ内容をメモ欄に記入します。
 * アイテム図鑑、武器図鑑、防具図鑑も作成できます。
 * この機能を利用する場合はパラメータ「入手履歴を使用」を有効にします。
 *
 * ・追加機能2
 * 用語リストはデフォルトではアイテムID順に表示されますが、
 * 以下のタグで表示順を個別に設定することができます。
 * 同一の表示順が重複した場合はIDの小さい方が先に表示されます。
 * <SG表示順:5> // ID[5]と同じ並び順で表示されます。
 * <SGOrder:5>  // 同上
 *
 * ・追加機能3
 * モンスター辞典の作成を支援します。
 * 1. パラメータ「敵キャラ自動登録」で戦闘した敵キャラと同名の用語を取得
 * 2. メモ欄<SG敵キャラ>で対象敵キャラの画像を表示
 * 3. \mhp[3]等の制御文字で対象敵キャラのパラメータを表示
 *
 * ・追加機能4
 * ひとつの用語に対して複数のピクチャを表示することができます。
 * メモ欄に以下のタグを記述し、ファイル名、X座標、Y座標をカンマ区切りで
 * 指定してください。
 * <SG追加1ピクチャ:aaa,1,2> // ピクチャ「aaa」をX[1] Y[2]に表示
 *
 * さらに追加で表示させたい場合は以下のように記述してください。
 * <SG追加2ピクチャ:bbb,2,3>
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * GLOSSARY_GAIN_ALL or 用語集全取得
 *  データベースに登録している全ての用語を取得状態にします。
 *  対象は「隠しアイテム」扱いの用語のみですが、パラメータ「入手履歴を使用」が
 *  有効な場合は全てのアイテムを解禁します。（アイテム自体は取得しません）
 *
 * GLOSSARY_CALL or 用語集画面の呼び出し [種別]
 *  用語集画面を呼び出します。
 *  種別を省略すると、自動で「1」になります。
 * 例：GLOSSARY_CALL 2
 *
 * GLOSSARY_BACK or 用語集画面に戻る
 *  最後に選択していた項目を再選択した状態で用語集画面を呼び出します。
 * 例：GLOSSARY_BACK
 *
 * GLOSSARY_ITEM_CHANGE_CATEGORY [アイテムID] [新カテゴリ]
 * 用語アイテムのカテゴリ変更 [アイテムID] [新カテゴリ]
 *  指定したIDのアイテムのカテゴリを別のものに変更します。　
 * 例：GLOSSARY_ITEM_CATEGORY_CHANGE 10 AAA
 * ※ 変更可能なのはアイテムのみです。武器と防具は変更できません。
 *
 * GLOSSARY_ITEM_CHANGE_USABLE [アイテムID] [ON or OFF]
 * 用語アイテムの使用禁止 [アイテムID] [ON or OFF]
 *  指定したIDのアイテムの使用禁止を変更します。(ON:可能 OFF:禁止)
 * 例：GLOSSARY_ITEM_CHANGE_USABLE 10 ON
 * ※ 変更可能なのはアイテムのみです。武器と防具は変更できません。
 *
 * ・スクリプト詳細
 * itemIdが用語アイテムとして使用可能なときにtrueを返します。
 * $gameParty.isUsableGlossaryItem(itemId);
 *
 * 指定したカテゴリ名および用語種別名に対応する収集率を返します。
 * 用語種別を省略した場合は[1]が設定されます。
 * $gameParty.getCompleteRate(categoryName, typeName);
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~GlossaryData:ja
 *
 * @param GlossaryType
 * @text 用語種別
 * @desc 用語種別です。<SG種別:n>で指定した用語が表示されます。
 * @default 1
 * @type number
 * @min 1
 *
 * @param CommandName
 * @text コマンド名称
 * @desc メニュー画面に表示されるコマンド名です。空にするとメニュー画面に表示されなくなります。
 * @default 用語辞典
 *
 * @param UseCategory
 * @text カテゴリ分類
 * @desc 用語をカテゴリごとに分けて表示します。
 * @default false
 * @type boolean
 *
 * @param CommandSwitchId
 * @text 出現条件スイッチ
 * @desc 辞書コマンドの出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture
 * @text 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param SelectAction
 * @text 選択時の動作
 * @desc 用語を選択したときの動作です。
 * @default 0
 * @type select
 * @option 使用不可
 * @value 0
 * @option アイテム使用
 * @value 1
 * @option スイッチ設定
 * @value 2
 *
 * @param SelectSwitchId
 * @text 選択スイッチ番号
 * @desc 用語アイテムの選択時の動作がスイッチ設定の場合にONになるスイッチ番号です。キャンセルでOFFが設定されます。
 * @default 0
 * @type switch
 * @parent SelectAction
 *
 * @param SelectVariableId
 * @text 選択用語変数番号
 * @desc 用語アイテムの選択時の動作がアイテム使用の場合にアイテムIDが設定される変数番号です。キャンセルで-1が設定されます。
 * @default 0
 * @type variable
 * @parent SelectAction
 *
 * @param ConfirmMessage
 * @text 確認メッセージ使用要否
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default false
 * @type boolean
 *
 * @param ConfirmUse
 * @text 確認_使う
 * @desc 確認メッセージで使う場合のメッセージです。
 * @default 使う
 * @parent ConfirmMessage
 *
 * @param ConfirmNoUse
 * @text 確認_使わない
 * @desc 確認メッセージで使わない場合のメッセージです。
 * @default やめる
 * @parent ConfirmMessage
 *
 * @param GlossaryHelp
 * @text 用語ヘルプ
 * @desc 用語リスト選択時のヘルプ画面に表示するテキストです。未指定の場合、ヘルプウィンドウは非表示になります。
 * @default ゲーム中に登場する用語を解説しています。
 *
 * @param CategoryHelp
 * @text カテゴリヘルプ
 * @desc 用語カテゴリ選択時のヘルプ画面に表示するテキストです。
 * @default カテゴリを選択してください。
 * @parent GlossaryHelp
 *
 * @param ConfirmHelp
 * @text 確認ヘルプ
 * @desc 用語アイテムの選択確認時に表示するテキストです。指定しなかった場合、何も表示されません。
 * @default
 * @parent GlossaryHelp
 *
 * @param UsingHelp
 * @text 使用後ヘルプ
 * @desc 用語アイテムの使用後に表示するテキストです。指定しなかった場合、何も表示されません。
 * @default
 * @parent GlossaryHelp
 *
 * @param CompleteView
 * @text 収集率表示
 * @desc カテゴリごとの収集率を表示します。コンプリートの目安です。
 * @default false
 * @type boolean
 *
 * @param CompleteMessage
 * @text 収集率メッセージ
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default 収集率 \c[2]%1\c[0] ％
 * @parent CompleteView
 *
 * @param ShowingItemNumber
 * @text 所持数表示
 * @desc 用語集アイテムの所持数を表示します。
 * @default false
 * @type boolean
 *
 * @param UsableDefault
 * @text デフォルト使用可否
 * @desc 用語集アイテムの初期状態での使用可否です。プラグインコマンドから個別に使用可否を変更できます。
 * @default true
 * @type boolean
 *
 * @param UseItemHistory
 * @text 入手履歴を使用
 * @desc ONにすると一度入手した用語アイテムを失っても辞書には表示されたままになります。
 * @default false
 * @type boolean
 *
 * @param GlossaryListWidth
 * @text 用語集リスト横幅
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 * @type number
 *
 * @param VisibleItemNotYet
 * @text 未入手アイテムの表示
 * @desc 未入手アイテムを指定した名前（？？？等）で表示します。指定しない場合この機能は無効になります。
 * @default
 */

/**
 * 用語集画面です。
 * @constructor
 */
function Scene_Glossary() {
    this.initialize.apply(this, arguments);
}

/**
 * 用語集カテゴリウィンドウです。
 * @constructor
 */
function Window_GlossaryCategory() {
    this.initialize.apply(this, arguments);
}

/**
 * 用語集リストウィンドウです。
 * @constructor
 */
function Window_GlossaryList() {
    this.initialize.apply(this, arguments);
}

/**
 * 用語集確認ウィンドウです。
 * @constructor
 */
function Window_GlossaryConfirm() {
    this.initialize.apply(this, arguments);
}

/**
 * 用語集ウィンドウです。
 * @constructor
 */
function Window_Glossary() {
    this.initialize.apply(this, arguments);
}

/**
 * 用語集収集率ウィンドウです。
 * @constructor
 */
function Window_GlossaryComplete() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var metaTagPrefix = 'SG';

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names, index) {
        var footer = index > 0 ? String(index + 1) : '';
        if (!Array.isArray(names)) return getMetaValue(object, names + footer);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i] + footer);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return convertEscapeCharactersAndParse(arg, true).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return arg.toUpperCase() === 'ON' || arg.toUpperCase() === 'TRUE';
    };

    var getArgString = function(arg, upperFlg) {
        if (arg !== String(arg)) {
            return arg;
        }
        arg = convertEscapeCharactersAndParse(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharactersAndParse = function(text, toNumber) {
        if (text === null || text === undefined) {
            text = toNumber ? '0' : '';
        }
        if (SceneManager._scene._windowLayer) {
            var winObj = SceneManager._scene._windowLayer.children[0];
            text       = winObj.convertEscapeCharacters(text);
        } else {
            text = convertEscapeCharacters(text);
        }
        return toNumber ? parseFloat(text) : text;
    };

    var convertEscapeCharacters = function(text) {
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
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
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('SceneGlossary');
    if (!param.GlossaryInfo) {
        param.GlossaryInfo = [];
    }

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandSceneGlossary(command, args);
    };

    Game_Interpreter.prototype.pluginCommandSceneGlossary = function(command, args) {
        switch (command.toUpperCase()) {
            case 'GLOSSARY_CALL' :
            case '用語集画面の呼び出し' :
                $gameParty.clearGlossaryIndex();
                $gameParty.setSelectedGlossaryType(getArgNumber(args[0], 1));
                SceneManager.push(Scene_Glossary);
                break;
            case 'GLOSSARY_GAIN_ALL' :
            case '用語集全取得' :
                $gameParty.gainGlossaryAll();
                break;
            case 'GLOSSARY_BACK' :
            case '用語集画面に戻る' :
                if (args[0]) {
                    $gameParty.setSelectedGlossaryType(getArgNumber(args[0], 1));
                }
                SceneManager.push(Scene_Glossary);
                break;
            case 'GLOSSARY_ITEM_CHANGE_CATEGORY' :
            case '用語アイテムのカテゴリ変更' :
                $gameParty.changeGlossaryCategory(getArgNumber(args[0], 1), args[1]);
                break;
            case 'GLOSSARY_ITEM_CHANGE_USABLE' :
            case '用語アイテムの使用禁止' :
                $gameParty.changeGlossaryItemUsable(getArgNumber(args[0], 1), getArgBoolean(args[1]));
                break;
        }
    };

    //=============================================================================
    // DataManager
    //  種別コードを返します。
    //=============================================================================
    DataManager.getItemTypeCode = function(item) {
        if (this.isItem(item)) {
            return 0;
        } else if (this.isWeapon(item)) {
            return 1;
        } else if (this.isArmor(item)) {
            return 2;
        } else {
            return 3;
        }
    };

    //=============================================================================
    // Game_System
    //  ロード完了時に履歴情報フィールドを必要に応じて初期化します。
    //=============================================================================
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameParty.initAllItemHistory();
    };

    //=============================================================================
    // Game_Party
    //  用語集アイテムの管理を追加定義します。
    //=============================================================================
    var _Game_Party_initAllItems      = Game_Party.prototype.initAllItems;
    Game_Party.prototype.initAllItems = function() {
        _Game_Party_initAllItems.apply(this, arguments);
        this.initAllItemHistory();
    };

    Game_Party.prototype.initAllItemHistory = function() {
        this._itemHistory   = this._itemHistory || {};
        this._weaponHistory = this._weaponHistory || {};
        this._armorHistory  = this._armorHistory || {};
        this.items().concat(this.weapons()).concat(this.armors()).forEach(function(item) {
            this.gainItemHistory(item);
        }, this);
    };

    Game_Party.prototype.isGlossaryItem = function(item) {
        return item && getMetaValues(item, ['説明', 'Description']) !== undefined;
    };

    Game_Party.prototype.isGlossaryHiddenItem = function(item) {
        return this.isGlossaryItem(item) && item.itypeId > 2;
    };

    Game_Party.prototype.isSameGlossaryType = function(item) {
        var type     = this.getSelectedGlossaryType();
        var itemType = getArgNumber(getMetaValues(item, ['種別', 'Type']));
        return type > 1 ? itemType === type : !itemType || itemType === type;
    };

    Game_Party.prototype.getGlossaryCategory = function(item) {
        var customCategory = this._customGlossaryCategoryList ? this._customGlossaryCategoryList[item.id] : undefined;
        return customCategory ? customCategory : getMetaValues(item, ['カテゴリ', 'Category']) || '';
    };

    Game_Party.prototype.getGlossaryCategoryList = function(item) {
        return this.getGlossaryCategory(item).split(',');
    };

    Game_Party.prototype.hasGlossary = function(item) {
        return this._glossarySetting.UseItemHistory ? this.hasItemHistory(item) : this.hasItem(item);
    };

    Game_Party.prototype.hasItemHistory = function(item) {
        return this.swapItemHash(this.hasItem.bind(this), [item]);
    };

    Game_Party.prototype.getAllGlossaryList = function(needTypeCheck, needHavingCheck, categoryName) {
        return $dataItems.concat($dataWeapons).concat($dataArmors).filter(function(item) {
            return item && this.isGlossaryItem(item) &&
                (!needTypeCheck || this.isSameGlossaryType(item)) &&
                (!needHavingCheck || this.hasGlossary(item)) &&
                (!categoryName || this.hasGlossaryCategory(item, categoryName));
        }.bind(this));
    };

    Game_Party.prototype.getAllHiddenGlossaryList = function() {
        return $dataItems.filter(function(item) {
            return item && this.isGlossaryHiddenItem(item);
        }.bind(this));
    };

    Game_Party.prototype.getHasGlossaryPercent = function(categoryName) {
        var hasCount = 0, allCount = 0;
        this.getAllGlossaryList(true, false, categoryName).forEach(function(item) {
            if (getMetaValues(item, ['収集対象外', 'NoCollect'])) {
                return;
            }
            if (this.hasGlossary(item)) {
                hasCount++;
            }
            allCount++;
        }.bind(this));
        return allCount > 0 ? Math.floor(hasCount / allCount * 100) : 0;
    };

    Game_Party.prototype.getCompleteRate = function(categoryName, typeName) {
        if (!typeName) {
            typeName = 1;
        }
        this.setSelectedGlossaryType(typeName);
        return this.getHasGlossaryPercent(categoryName);
    };

    Game_Party.prototype.hasGlossaryCategory = function(item, categoryName) {
        return this.getGlossaryCategoryList(item).contains(categoryName);
    };

    Game_Party.prototype.getAllGlossaryCategory = function() {
        var list          = [];
        var visibleNotYet = this.isUseGlossaryVisibleItemNotYet();
        this.getAllGlossaryList(true, !visibleNotYet, '').forEach(function(item) {
            this.getGlossaryCategoryList(item).forEach(function(category) {
                if (category && !list.contains(category)) {
                    list.push(category);
                }
            }, this);
        }, this);
        return param.CategoryOrder.length > 0 ? list.sort(this._compareOrderGlossaryCategory.bind(this)) : list;
    };

    /**
     * @private
     */
    Game_Party.prototype._compareOrderGlossaryCategory = function(a, b) {
        var order       = param.CategoryOrder;
        var orderLength = order.length + 1;
        var orderA      = order.indexOf(a) + 1 || orderLength;
        var orderB      = order.indexOf(b) + 1 || orderLength;
        return orderA - orderB;
    };

    Game_Party.prototype.gainGlossaryFromText = function(text, setVariable) {
        this.getAllHiddenGlossaryList().forEach(function(item) {
            if (!this.hasItem(item) && this.isAutoGlossaryWord(item) && text.contains(item.name)) {
                if (setVariable) {
                    this.setAutoAdditionTrigger(item);
                }
                this.gainGlossary(item);
            }
        }.bind(this));
    };

    Game_Party.prototype.setAutoAdditionTrigger = function(item) {
        if (param.SwitchAutoAdd > 0) {
            $gameSwitches.setValue(param.SwitchAutoAdd, true);
        }
        if (param.VariableAutoAdd > 0) {
            $gameVariables.setValue(param.VariableAutoAdd, item.id);
        }
    };

    Game_Party.prototype.isAutoGlossaryWord = function(item) {
        return !getMetaValues(item, ['手動', 'Manual']);
    };

    Game_Party.prototype.gainGlossaryAll = function() {
        this.getAllGlossaryList(false, false, '').forEach(function(item) {
            if (this.hasItem(item)) {
                return;
            }
            if (this.isGlossaryHiddenItem(item)) {
                this.gainGlossary(item);
            } else {
                this.gainItemHistory(item);
            }
        }.bind(this));
    };

    Game_Party.prototype.gainGlossary = function(item) {
        this.gainItem(item, 1, false);
    };

    var _Game_Party_gainItem      = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.apply(this, arguments);
        if (amount > 0) this.gainItemHistory(item);
    };

    Game_Party.prototype.gainItemHistory = function(item) {
        var container = this.itemHistoryContainer(item);
        if (container) {
            container[item.id] = true;
        }
    };

    Game_Party.prototype.itemHistoryContainer = function(item) {
        return this.swapItemHash(this.itemContainer.bind(this), [item]);
    };

    Game_Party.prototype.swapItemHash = function(caller, args) {
        var prevItems   = this._items;
        var prevWeapons = this._weapons;
        var prevArmor   = this._armors;
        this._items     = this._itemHistory;
        this._weapons   = this._weaponHistory;
        this._armors    = this._armorHistory;
        var result      = caller.apply(this, args);
        this._items     = prevItems;
        this._weapons   = prevWeapons;
        this._armors    = prevArmor;
        return result;
    };

    Game_Party.prototype.setConfirmedGlossaryItem = function(item) {
        if (!this._confirmedGlossaryItems) {
            this._confirmedGlossaryItems = [];
        }
        if (!this.hasGlossary(item)) {
            return false;
        }
        if (!this._confirmedGlossaryItems.contains(item.id)) {
            this._confirmedGlossaryItems.push(item.id);
            return true;
        }
        return false;
    };

    Game_Party.prototype.isConfirmedGlossaryItem = function(item) {
        if (!this.hasGlossary(item)) {
            return true;
        }
        return this._confirmedGlossaryItems ? this._confirmedGlossaryItems.contains(item.id) : false;
    };

    Game_Party.prototype.setGlossaryCategoryIndex = function(index) {
        this.initGlossaryIndex();
        this._glossaryCategoryIndex[this.getSelectedGlossaryType()] = index;
    };

    Game_Party.prototype.getGlossaryCategoryIndex = function() {
        this.initGlossaryIndex();
        return this._glossaryCategoryIndex[this.getSelectedGlossaryType()];
    };

    Game_Party.prototype.setGlossaryListIndex = function(index) {
        this.initGlossaryIndex();
        this._glossaryListIndex[this.getSelectedGlossaryType()] = index;
    };

    Game_Party.prototype.getGlossaryListIndex = function() {
        this.initGlossaryIndex();
        return this._glossaryListIndex[this.getSelectedGlossaryType()];
    };

    Game_Party.prototype.clearGlossaryIndex = function() {
        var type = this.getSelectedGlossaryType();
        this.initGlossaryIndex();
        this._glossaryListIndex[type]     = -1;
        this._glossaryCategoryIndex[type] = -1;
    };

    Game_Party.prototype.initGlossaryIndex = function() {
        if (!this._glossaryCategoryIndex) {
            this._glossaryCategoryIndex = {};
        }
        if (!this._glossaryListIndex) {
            this._glossaryListIndex = {};
        }
    };

    Game_Party.prototype.setSelectedGlossaryType = function(type, index) {
        this._selectedGlossaryType = this.setupGlossary(type, index);
    };

    Game_Party.prototype.setupGlossary = function(type, index) {
        var glossary = param.GlossaryInfo;
        if (glossary.length === 0) {
            var errMes = $gameSystem.isJapanese() ? '用語情報が設定されていません。パラメータで設定してください。' :
                'Glossary Info is empty. Please set plugin parameter.';
            throw new Error(errMes);
        }
        this._glossarySetting = glossary.filter(function(glossaryItem) {
            return glossaryItem.GlossaryType === type;
        })[0];
        if (!this._glossarySetting) {
            this._glossarySetting = glossary[index] || glossary[0];
        }
        return this._glossarySetting.GlossaryType;
    };

    Game_Party.prototype.getSelectedGlossaryType = function() {
        return this._selectedGlossaryType || 0;
    };

    Game_Party.prototype.isUseGlossaryCategory = function() {
        return this._glossarySetting.UseCategory;
    };

    Game_Party.prototype.getGlossaryBackPicture = function() {
        return this._glossarySetting.BackPicture;
    };

    Game_Party.prototype.getGlossarySelectAction = function() {
        return this._glossarySetting.SelectAction;
    };

    Game_Party.prototype.setGlossarySelectSwitchValue = function(value) {
        $gameSwitches.setValue(this._glossarySetting.SelectSwitchId, value);
    };

    Game_Party.prototype.setGlossarySelectVariableValue = function(itemId) {
        $gameVariables.setValue(this._glossarySetting.SelectVariableId, itemId);
    };

    Game_Party.prototype.isUseGlossaryConfirm = function() {
        return this._glossarySetting.ConfirmMessage;
    };

    Game_Party.prototype.getGlossaryConfirmMessages = function() {
        return [this._glossarySetting.ConfirmUse, this._glossarySetting.ConfirmNoUse];
    };

    Game_Party.prototype.getGlossaryHelpMessages = function() {
        var setting = this._glossarySetting;
        return [setting.GlossaryHelp, setting.CategoryHelp, setting.ConfirmHelp, setting.UsingHelp];
    };

    Game_Party.prototype.isUseGlossaryComplete = function() {
        return this._glossarySetting.CompleteView;
    };

    Game_Party.prototype.getGlossaryCompleteMessage = function() {
        return this._glossarySetting.CompleteMessage;
    };

    Game_Party.prototype.isUseGlossaryItemNumber = function() {
        return this._glossarySetting.ShowingItemNumber;
    };

    Game_Party.prototype.isUseGlossaryVisibleItemNotYet = function() {
        return !!this._glossarySetting.VisibleItemNotYet;
    };

    Game_Party.prototype.getTextItemNotYet = function() {
        return this._glossarySetting.VisibleItemNotYet;
    };

    Game_Party.prototype.changeGlossaryCategory = function(itemId, newCategory) {
        if (!this._customGlossaryCategoryList) {
            this._customGlossaryCategoryList = [];
        }
        this._customGlossaryCategoryList[itemId] = newCategory;
    };

    Game_Party.prototype.changeGlossaryItemUsable = function(itemId, usable) {
        if (!this._customGlossaryUsableList) {
            this._customGlossaryUsableList = [];
        }
        this._customGlossaryUsableList[itemId] = usable;
    };

    Game_Party.prototype.isUsableGlossaryItem = function(itemId) {
        var usable = this._customGlossaryUsableList ? this._customGlossaryUsableList[itemId] : undefined;
        return usable !== undefined ? usable : this._glossarySetting.UsableDefault;
    };

    Game_Party.prototype.getGlossaryListWidth = function() {
        return this._glossarySetting.GlossaryListWidth || 160;
    };

    //=============================================================================
    // Game_Troop
    //  敵キャラの名前を自動登録します。
    //=============================================================================
    var _Game_Troop_setup      = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        if (param.AutoAdditionEnemy) {
            this.addEnemyGlossary();
        }
    };

    Game_Troop.prototype.addEnemyGlossary = function() {
        this.members().forEach(function(enemy) {
            $gameParty.gainGlossaryFromText(enemy.originalName());
        });
    };

    //=============================================================================
    // Scene_Menu
    //  用語集画面の呼び出しを追加します。
    //=============================================================================
    Scene_Menu.isVisibleGlossaryCommand = function(index) {
        var glossaryItem = param.GlossaryInfo[index];
        if (!glossaryItem || !glossaryItem.CommandName) {
            return false;
        }
        return !glossaryItem.CommandSwitchId || $gameSwitches.value(glossaryItem.CommandSwitchId);
    };

    var _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        for (var i = 0; i < param.GlossaryInfo.length; i++) {
            if (Scene_Menu.isVisibleGlossaryCommand(i)) {
                this._commandWindow.setHandler('glossary' + String(i + 1), this.commandGlossary.bind(this, null, i));
            }
        }
    };

    Scene_Menu.prototype.commandGlossary = function(type, typeIndex) {
        $gameParty.clearGlossaryIndex();
        $gameParty.setSelectedGlossaryType(type, typeIndex);
        SceneManager.push(Scene_Glossary);
    };

    //=============================================================================
    // Window_MenuCommand
    //  用語集画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_MenuCommand_addOriginalCommands      = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        param.GlossaryInfo.forEach(function(glossaryInfo, index) {
            var glossaryName = glossaryInfo.CommandName;
            if (Scene_Menu.isVisibleGlossaryCommand(index)) {
                if (typeof TranslationManager !== 'undefined') {
                    TranslationManager.translateIfNeed(glossaryName, function(translatedText) {
                        glossaryName = translatedText;
                    });
                }
                this.addCommand(glossaryName, 'glossary' + String(index + 1), this.isGlossaryEnabled(index));
            }
        }, this);
    };

    Window_MenuCommand.prototype.isGlossaryEnabled = function() {
        return true;
    };

    //=============================================================================
    // Window_EventItem
    //  用語集アイテムをアイテム選択の候補から除外します。
    //=============================================================================
    var _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        return _Window_EventItem_includes.apply(this, arguments) && !$gameParty.isGlossaryHiddenItem(item);
    };

    //=============================================================================
    // Window_BattleItem
    //  用語集アイテムをアイテム選択の候補から除外します。
    //=============================================================================
    var _Window_BattleItem_includes      = Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function(item) {
        return _Window_BattleItem_includes.apply(this, arguments) && !$gameParty.isGlossaryHiddenItem(item);
    };

    //=============================================================================
    // Window_Message
    //  メッセージに登場した単語を用語集に加えます。
    //=============================================================================
    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if (param.AutoAddition) $gameParty.gainGlossaryFromText(this.convertEscapeCharacters(this._textState.text));
    };

    //=============================================================================
    // Window_ScrollText
    //  メッセージに登場した単語を用語集に加えます。
    //=============================================================================
    var _Window_ScrollText_startMessage      = Window_ScrollText.prototype.startMessage;
    Window_ScrollText.prototype.startMessage = function() {
        _Window_ScrollText_startMessage.apply(this, arguments);
        if (param.AutoAddition) $gameParty.gainGlossaryFromText(this.convertEscapeCharacters(this._text));
    };

    //=============================================================================
    // Scene_Glossary
    //  用語集画面を扱うクラスです。
    //=============================================================================
    Scene_Glossary.prototype             = Object.create(Scene_ItemBase.prototype);
    Scene_Glossary.prototype.constructor = Scene_Glossary;

    Scene_Glossary.prototype.create = function() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGlossaryWindow();
        this.createGlossaryListWindow();
        this.createGlossaryCategoryWindow();
        this.createGlossaryCompleteWindow();
        this.createConfirmWindow();
        this.createActorWindow();
        this.setInitActivateWindow();
    };

    Scene_Glossary.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.apply(this, arguments);
        this._helpTexts = $gameParty.getGlossaryHelpMessages();
        this.updateHelp('');
    };

    Scene_Glossary.prototype.createGlossaryWindow = function() {
        this._glossaryWindow = new Window_Glossary($gameParty.getGlossaryListWidth(), this._helpWindow.height);
        this.addWindow(this._glossaryWindow);
    };

    Scene_Glossary.prototype.createGlossaryListWindow = function() {
        this._glossaryListWindow = new Window_GlossaryList(this._glossaryWindow);
        this._glossaryListWindow.setHandler('cancel', this.onCancelGlossaryList.bind(this));
        this._itemWindow = this._glossaryListWindow;
        this.addWindow(this._glossaryListWindow);
    };

    Scene_Glossary.prototype.createGlossaryCategoryWindow = function() {
        this._glossaryCategoryWindow = new Window_GlossaryCategory(this._glossaryListWindow);
        this._glossaryCategoryWindow.setHandler('cancel', this.escapeScene.bind(this));
        this._glossaryCategoryWindow.setHandler('select', this.refreshCompleteWindow.bind(this));
        this._glossaryCategoryWindow.setHandler('ok', this.onOkGlossaryCategory.bind(this));
        this.addWindow(this._glossaryCategoryWindow);
    };

    Scene_Glossary.prototype.createConfirmWindow = function() {
        this._confirmWindow = new Window_GlossaryConfirm(this._glossaryListWindow);
        this._confirmWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._confirmWindow.setHandler('use', this.onItemOk.bind(this));
        this._confirmWindow.setHandler('noUse', this.onItemCancel.bind(this));
        this.addChild(this._confirmWindow);
    };

    Scene_Glossary.prototype.createGlossaryCompleteWindow = function() {
        this._glossaryCompleteWindow = new Window_GlossaryComplete(this._glossaryListWindow);
        if (!$gameParty.isUseGlossaryComplete()) this._glossaryCompleteWindow.hide();
        this.addWindow(this._glossaryCompleteWindow);
    };

    Scene_Glossary.prototype.createBackground = function() {
        var pictureName = this.getBackPictureName();
        if (pictureName) {
            if (param.ThroughBackPicture) {
                Scene_ItemBase.prototype.createBackground.apply(this, arguments);
            }
            var sprite    = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(pictureName, 0);
            sprite.bitmap.addLoadListener(function() {
                sprite.scale.x = Graphics.boxWidth / sprite.width;
                sprite.scale.y = Graphics.boxHeight / sprite.height;
            }.bind(this));
            this._backgroundSprite = sprite;
            this.addChild(this._backgroundSprite);
        } else {
            Scene_ItemBase.prototype.createBackground.apply(this, arguments);
        }
    };

    Scene_Glossary.prototype.getBackPictureName = function() {
        return $gameParty.getGlossaryBackPicture();
    };

    Scene_Glossary.prototype.updateHelp = function(helpText) {
        if (this._helpTexts[0]) {
            if (typeof TranslationManager !== 'undefined') {
                TranslationManager.getTranslatePromise(helpText).then(function(translatedText) {
                    this._helpWindow.setText(translatedText);
                }.bind(this));
            } else {
                this._helpWindow.setText(helpText);
            }
        } else {
            this._helpWindow.visible = false;
            this._helpWindow.height  = 0;
        }
    };

    Scene_Glossary.prototype.setInitActivateWindow = function() {
        var clearIndex = !($gameParty.getGlossaryListIndex() >= 0);
        if ($gameParty.isUseGlossaryCategory() && clearIndex) {
            this.activateCategoryWindow(clearIndex);
        } else {
            this.activateListWindow(clearIndex);
            this._glossaryListWindow.selectLastIndex();
        }
    };

    Scene_Glossary.prototype.onOkGlossaryCategory = function() {
        this.activateListWindow(true);
    };

    Scene_Glossary.prototype.onOkGlossaryList = function() {
        if ($gameParty.isUseGlossaryConfirm()) {
            this.activateConfirmWindow();
        } else {
            this.onItemOk();
        }
    };

    Scene_Glossary.prototype.onItemOk = function() {
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        var action = $gameParty.getGlossarySelectAction();
        $gameParty.setGlossarySelectVariableValue(this.item().id);
        $gameParty.setGlossarySelectSwitchValue(true);
        if (action === 1) {
            $gameParty.setLastItem(this.item());
            this.determineItem();
        } else {
            this.activateListWindow();
        }
        if (this._helpTexts[3]) {
            this.updateHelp(this._helpTexts[3]);
        }
    };

    Scene_Glossary.prototype.onItemCancel = function() {
        $gameParty.setGlossarySelectVariableValue(-1);
        $gameParty.setGlossarySelectSwitchValue(false);
        this.updateHelp(this._helpTexts[0]);
        this.activateListWindow();
    };

    Scene_Glossary.prototype.playSeForItem = function() {
        SoundManager.playUseItem();
    };

    Scene_Glossary.prototype.isCursorLeft = function() {
        return true;
    };

    Scene_Glossary.prototype.user = Scene_Item.prototype.user;

    Scene_Glossary.prototype.onCancelGlossaryList = function() {
        if ($gameParty.isUseGlossaryCategory()) {
            this.activateCategoryWindow(false);
        } else {
            this.escapeScene();
        }
    };

    Scene_Glossary.prototype.activateCategoryWindow = function(indexInit) {
        this._glossaryCategoryWindow.activateAndShow();
        if (indexInit) {
            this._glossaryCategoryWindow.select(0);
        }
        this._glossaryListWindow.deactivateAndHide();
        this._glossaryListWindow.deselect();
        this.refreshCompleteWindow();
        this._confirmWindow.deactivateAndHide();
        this.updateHelp(this._helpTexts[1]);
    };

    Scene_Glossary.prototype.activateListWindow = function(indexInit) {
        this._glossaryListWindow.setItemHandler(this.onOkGlossaryList.bind(this));
        this._glossaryListWindow.refresh();
        this._glossaryListWindow.activateAndShow();
        if (indexInit) {
            this._glossaryListWindow.select(0);
        }
        this._glossaryCategoryWindow.deactivateAndHide();
        this.refreshCompleteWindow();
        this._confirmWindow.deactivateAndHide();
        this.updateHelp(this._helpTexts[0]);
    };

    Scene_Glossary.prototype.activateConfirmWindow = function() {
        this._glossaryListWindow.deactivate();
        this._confirmWindow.updatePlacement();
        this._confirmWindow.select(0);
        this._confirmWindow.activateAndShow();
        if (this._helpTexts[2]) {
            this.updateHelp(this._helpTexts[2]);
        }
    };

    Scene_Glossary.prototype.escapeScene = function() {
        this.popScene();
    };

    Scene_Glossary.prototype.refreshCompleteWindow = function() {
        if (this._glossaryCompleteWindow.visible) {
            this._glossaryCompleteWindow.refresh();
        }
    };

    //=============================================================================
    // Window_Base
    //  必要なら制御文字変換を行ってテキストを表示します。
    //=============================================================================
    Window_Base.prototype.drawTextExIfNeed = function(text, x, y, maxWidth, align) {
        if (text.match(/\\/)) {
            if (align && align !== 'left') {
                var width = this.drawTextEx(text, x, -this.lineHeight());
                x += maxWidth - width / (align === 'center' ? 2 : 1);
            }
            this.drawTextEx(text, x, y);
        } else {
            this.drawText(text, x, y, maxWidth, align);
        }
    };

    //=============================================================================
    // Window_Selectable
    //  アクティブウィンドウを切り替えます。
    //=============================================================================
    Window_Selectable.prototype.activateAndShow = function() {
        this.activate();
        this.show();
    };

    Window_Selectable.prototype.deactivateAndHide = function() {
        this.deactivate();
        this.hide();
    };

    //=============================================================================
    // Window_GlossaryCategory
    //  用語集カテゴリウィンドウです。
    //=============================================================================
    Window_GlossaryCategory.prototype             = Object.create(Window_Selectable.prototype);
    Window_GlossaryCategory.prototype.constructor = Window_GlossaryCategory;

    Window_GlossaryCategory.prototype.initialize = function(glWindow) {
        this._glossaryListWindow = glWindow;
        Window_Selectable.prototype.initialize.call(this, glWindow.x, glWindow.y, glWindow.width, glWindow.height);
        this._data = null;
        this.refresh();
        this.selectLastIndex();
    };

    Window_GlossaryCategory.prototype.selectLastIndex = function() {
        var lastIndex = $gameParty.getGlossaryCategoryIndex();
        if (lastIndex >= 0) {
            this.select(Math.min(lastIndex, this.maxItems() - 1));
        }
    };

    Window_GlossaryCategory.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    Window_GlossaryCategory.prototype.item = function() {
        var index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_GlossaryCategory.prototype.isCurrentItemEnabled = function() {
        return !!this.item();
    };

    Window_GlossaryCategory.prototype.makeItemList = function() {
        this._data = $gameParty.getAllGlossaryCategory();
    };

    Window_GlossaryCategory.prototype.select = function(index) {
        Window_Selectable.prototype.select.apply(this, arguments);
        this._glossaryListWindow.setGlossaryOnly(this.item());
        if (index >= 0) {
            $gameParty.setGlossaryCategoryIndex(index);
            this.callHandler('select');
        }
    };

    Window_GlossaryCategory.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_GlossaryCategory.prototype.drawItem = function(index) {
        var text = this._data[index];
        if (text) {
            var rect = this.itemRect(index);
            this.drawTextExIfNeed(text, rect.x + this.textPadding(), rect.y, rect.width - this.textPadding());
        }
    };

    //=============================================================================
    // Window_GlossaryList
    //  用語集リストウィンドウです。
    //=============================================================================
    Window_GlossaryList.prototype             = Object.create(Window_ItemList.prototype);
    Window_GlossaryList.prototype.constructor = Window_GlossaryList;

    Window_GlossaryList.prototype.initialize = function(gWindow) {
        this._glossaryWindow = gWindow;
        var height           = gWindow.height;
        if ($gameParty.isUseGlossaryComplete()) {
            height -= this.lineHeight() + this.standardPadding() * 2;
        }
        var width = $gameParty.getGlossaryListWidth();
        Window_ItemList.prototype.initialize.call(this, 0, gWindow.y, width, height);
        this.refresh();
        this.selectLastIndex();
    };

    Window_GlossaryList.prototype.selectLastIndex = function() {
        var lastIndex = $gameParty.getGlossaryListIndex();
        if (lastIndex >= 0) {
            this.select(Math.min(lastIndex, this.maxItems() - 1));
        }
    };

    Window_GlossaryList.prototype.maxCols = function() {
        return 1;
    };

    Window_GlossaryList.prototype.numberWidth = function() {
        return this.needsNumber() ? Window_ItemList.prototype.numberWidth.apply(this, arguments) : 0;
    };

    Window_GlossaryList.prototype.needsNumber = function() {
        return $gameParty.isUseGlossaryItemNumber();
    };

    Window_GlossaryList.prototype.drawItemName = function(item, x, y, width) {
        if (item) {
            var iconBoxWidth = item.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.setGlossaryColor(item);
            var notYetName = $gameParty.getTextItemNotYet();
            var name       = $gameParty.hasGlossary(item) ? item.name : notYetName;
            this.drawTextExIfNeed(name, x + iconBoxWidth, y, width - iconBoxWidth);
            this.changePaintOpacity(1);
            this.resetTextColor();
        }
    };

    Window_GlossaryList.prototype.setGlossaryColor = function(item) {
        this.changePaintOpacity(this.isEnabled(item));
        this.changeTextColor(this.textColor(this.getGlossaryColorIndex(item)));
    };

    Window_GlossaryList.prototype.getGlossaryColorIndex = function(item) {
        if (!$gameParty.isConfirmedGlossaryItem(item)) {
            return param.NewGlossaryColor;
        }
        var colorChange = getMetaValues(item, ['TextColorChange', 'テキスト色変化']);
        if (colorChange) {
            var switchId = getArgNumber(colorChange.split(',')[0], 0);
            if ($gameSwitches.value(switchId)) {
                return getArgNumber(colorChange.split(',')[1], 0);
            }
        }
        return 0;
    };

    Window_GlossaryList.prototype.isEnabled = function(item) {
        if (!$gameParty.hasGlossary(item)) {
            return false;
        }
        if (!this.canItemUse()) {
            return true;
        }
        if (!$gameParty.isUsableGlossaryItem(item.id)) {
            return false;
        }
        var action = $gameParty.getGlossarySelectAction();
        return action === 1 ? Window_ItemList.prototype.isEnabled.call(this, item) : true;
    };

    Window_GlossaryList.prototype.includes = function(item) {
        return $gameParty.isGlossaryItem(item) && this.isCategoryMatch(item) && $gameParty.isSameGlossaryType(item);
    };

    Window_GlossaryList.prototype.isCategoryMatch = function(item) {
        return !$gameParty.isUseGlossaryCategory() || $gameParty.hasGlossaryCategory(item, this._category);
    };

    Window_GlossaryList.prototype.select = function(index) {
        var prevItem = this.item();
        if (prevItem) {
            var result = $gameParty.setConfirmedGlossaryItem(prevItem);
            if (result) {
                this.drawItem(this._index);
            }
        }
        Window_ItemList.prototype.select.apply(this, arguments);
        if (this.item() && prevItem !== this.item()) {
            this._glossaryWindow.refresh(this.item());
        } else if (!this.item()) {
            this._glossaryWindow.clearItem();
        }
        if (index >= 0) {
            $gameParty.setGlossaryListIndex(index);
        }
    };

    Window_GlossaryList.prototype.cursorRight = function(wrap) {
        this._glossaryWindow.cursorRight(wrap);
    };

    Window_GlossaryList.prototype.cursorLeft = function(wrap) {
        this._glossaryWindow.cursorLeft(wrap);
    };

    Window_GlossaryList.prototype.getCategory = function() {
        return this._category !== 'none' ? this._category : null;
    };

    Window_GlossaryList.prototype.makeItemList = function() {
        this._data = this.getItemList().filter(function(item) {
            var isInclude = this.includes(item);
            if (isInclude) {
                item.sortOrder = getMetaValues(item, ['Order', '表示順']) || item.id;
            }
            return isInclude;
        }, this).sort(this.compareOrder);
    };

    Window_GlossaryList.prototype.compareOrder = function(itemA, itemB) {
        return DataManager.getItemTypeCode(itemA) - DataManager.getItemTypeCode(itemB) ||
            itemA.sortOrder - itemB.sortOrder || itemA.id - itemB.id;
    };

    Window_GlossaryList.prototype.getItemList = function() {
        var visibleNotYet = $gameParty.isUseGlossaryVisibleItemNotYet();
        return $gameParty.getAllGlossaryList(true, !visibleNotYet, this._category);
    };

    Window_GlossaryList.prototype.canItemUse = function() {
        var action = $gameParty.getGlossarySelectAction();
        return action > 0 && !param.CategoryUnusable.contains(this._category);
    };

    Window_GlossaryList.prototype.removeHandler = function(symbol) {
        delete this._handlers[symbol];
    };

    Window_GlossaryList.prototype.setItemHandler = function(handler) {
        if (this.canItemUse()) {
            this.setHandler('ok', handler);
        } else {
            this.removeHandler('ok');
        }
    };

    Window_GlossaryList.prototype.setGlossaryOnly = function(category) {
        this._category = category;
    };

    //=============================================================================
    // Window_GlossaryConfirm
    //  用語集確認ウィンドウです。
    //=============================================================================
    Window_GlossaryConfirm.prototype             = Object.create(Window_Command.prototype);
    Window_GlossaryConfirm.prototype.constructor = Window_GlossaryConfirm;

    Window_GlossaryConfirm.prototype.initialize = function(listWindow) {
        this._listWindow = listWindow;
        Window_Command.prototype.initialize.call(this, 0, 0);
    };

    Window_GlossaryConfirm.prototype.windowWidth = function() {
        return 120;
    };

    Window_GlossaryConfirm.prototype.updatePlacement = function() {
        this.x   = this._listWindow.x + 64;
        var line = this._listWindow.index() - this._listWindow.topRow();
        if (line >= this._listWindow.maxPageRows() - 2) {
            line -= 3;
        }
        this.y = this._listWindow.y + line * this._listWindow.itemHeight() + 32;
    };

    Window_GlossaryConfirm.prototype.makeCommandList = function() {
        var confirmMessages = $gameParty.getGlossaryConfirmMessages();
        this.addCommand(confirmMessages[0], 'use');
        this.addCommand(confirmMessages[1], 'noUse');
    };

    //=============================================================================
    // Window_GlossaryComplete
    //  用語集収集率ウィンドウです。
    //=============================================================================
    Window_GlossaryComplete.prototype             = Object.create(Window_Base.prototype);
    Window_GlossaryComplete.prototype.constructor = Window_GlossaryComplete;

    Window_GlossaryComplete.prototype.initialize = function(listWindow) {
        var x            = listWindow.x;
        var y            = listWindow.y + listWindow.height;
        var width        = listWindow.width;
        var height       = Graphics.boxHeight - y;
        this._listWindow = listWindow;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_GlossaryComplete.prototype.clear = function() {
        this.contents.clear();
    };

    Window_GlossaryComplete.prototype.refresh = function() {
        this.clear();
        var percent = $gameParty.getHasGlossaryPercent(this._listWindow.getCategory());
        this.drawTextEx($gameParty.getGlossaryCompleteMessage().format(percent.padZero(3)), 0, 0);
    };

    //=============================================================================
    // Window_Glossary
    //  用語集ウィンドウです。
    //=============================================================================
    Window_Glossary.prototype             = Object.create(Window_Base.prototype);
    Window_Glossary.prototype.constructor = Window_Glossary;

    Window_Glossary.prototype.initialize = function(x, y) {
        var height      = Graphics.boxHeight - y;
        var width       = Graphics.boxWidth - x;
        this._maxPages  = 1;
        this._itemData  = null;
        this._pageIndex = 0;
        this._enemy     = null;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_Glossary.prototype.standardFontSize = function() {
        return param.FontSize ? param.FontSize : Window_Base.prototype.standardFontFace();
    };

    Window_Glossary.prototype.calcMaxPages = function(index) {
        if (!index) {
            index = 0;
        }
        var exist = !!this.getPictureName(index) || !!this.getDescription(index);
        return (exist && index < 100) ? this.calcMaxPages(index + 1) : index;
    };

    Window_Glossary.prototype.getPictureName = function(index) {
        return this.getMetaContents(['ピクチャ', 'Picture'], index);
    };

    Window_Glossary.prototype.getEnemyData = function(index) {
        var id = this.getMetaContents(['敵キャラ', 'Enemy'], index);
        var enemy;
        if (id === true) {
            var optEnemy = $dataEnemies.filter(function(enemy) {
                return enemy && enemy.name === this._itemData.name;
            }, this);
            enemy        = optEnemy.length > 0 ? optEnemy[0] : null;
        } else {
            enemy = $dataEnemies[parseInt(id)] || null;
        }
        if (!this._enemy) {
            this._enemy = enemy;
        }
        return enemy;
    };

    Window_Glossary.prototype.getPlusPictureData = function(imageIndex, index) {
        return this.getMetaContents([`追加${imageIndex}ピクチャ`, `Plus${imageIndex}Picture`], index);
    };

    Window_Glossary.prototype.getDescription = function(index) {
        var description = this.getMetaContents(['説明', 'Description'], index);
        if (!description) {
            return '';
        }
        description    = description.replace(/\x1bDATA\[(\w+)]/gi, function() {
            return this._itemData[arguments[1]];
        }.bind(this));
        var prevData   = this._itemData;
        description    = description.replace(/\x1bCOMMON\[(\d+)]/gi, function() {
            this._itemData = $dataItems[parseInt(arguments[1])];
            return this.getCommonDescription();
        }.bind(this));
        this._itemData = prevData;
        if (this._enemy) {
            description = this.convertEnemyData(description);
        }
        return description;
    };

    Window_Glossary.prototype.getCommonDescription = function() {
        return this.getMetaContents(['共通説明', 'CommonDescription'], 0);
    };

    Window_Glossary.prototype.getMetaContents = function(names, index) {
        var item  = this._itemData;
        var value = getMetaValues(item, names, index);
        if (!value) return null;
        var contents = getArgString(value);
        return contents && contents !== '0' ? contents : null;
    };

    Window_Glossary.prototype.refresh = function(item) {
        this._itemData = item;
        this._enemy    = null;
        this._maxPages = item && $gameParty.hasGlossary(item) ? this.calcMaxPages() : 1;
        this.drawItem(0, true);
    };

    Window_Glossary.prototype.cursorRight = function(wrap) {
        if (this._maxPages === 1) return;
        if (this.canMoveRight()) {
            this.drawItem(this._pageIndex + 1);
        } else if (wrap && param.PageWrap) {
            this.drawItem(0);
        }
    };

    Window_Glossary.prototype.cursorLeft = function(wrap) {
        if (this._maxPages === 1) return;
        if (this.canMoveLeft()) {
            this.drawItem(this._pageIndex - 1);
        } else if (wrap && param.PageWrap) {
            this.drawItem(this._maxPages - 1);
        }
    };

    Window_Glossary.prototype.canMoveLeft = function() {
        return this._pageIndex > 0;
    };

    Window_Glossary.prototype.canMoveRight = function() {
        return this._pageIndex < this._maxPages - 1;
    };

    Window_Glossary.prototype.drawItem = function(index, noSound) {
        this.contents.clear();
        this._pageIndex = index;
        this.updateArrows();
        if (!this._itemData || !$gameParty.hasGlossary(this._itemData)) {
            return;
        }
        var bitmap = this.getGlossaryBitmap(index);
        if (bitmap) {
            bitmap.addLoadListener(this.drawItemSub.bind(this, bitmap));
        } else {
            this.drawItemSub(null);
        }
        if (!noSound) SoundManager.playCursor();
    };

    Window_Glossary.prototype.clearItem = function() {
        this.contents.clear();
    };

    Window_Glossary.prototype.getGlossaryBitmap = function(index) {
        var pictureName = this.getPictureName(index);
        var enemy       = this.getEnemyData(index);
        if (pictureName) {
            return ImageManager.loadPicture(pictureName, 0);
        } else {
            if (enemy) {
                var methodName = $gameSystem.isSideView() ? 'loadSvEnemy' : 'loadEnemy';
                return ImageManager[methodName](enemy.battlerName, enemy.battlerHue);
            } else {
                return null;
            }
        }
    };

    Window_Glossary.prototype.updateArrows = function() {
        this.downArrowVisible = this.canMoveLeft();
        this.upArrowVisible   = this.canMoveRight();
    };

    Window_Glossary.prototype.drawItemSub = function(bitmap) {
        var text    = this.getDescription(this._pageIndex);
        var textPos = this.getTextPosition();
        var textHandler;
        var pictureHandler;
        var y;
        switch (this.getPicturePosition()) {
            case 'top':
                if (!textPos) {
                    textPos = this.calcItemPictureHeight(bitmap, text);
                }
                textHandler    = this.drawItemText.bind(this, text, textPos);
                pictureHandler = this.drawPicture.bind(this, bitmap, text, 0);
                break;
            case 'bottom':
                textHandler    = this.drawItemText.bind(this, text, textPos);
                y              = this.contentsHeight() - this.calcItemPictureHeight(bitmap, text);
                pictureHandler = this.drawPicture.bind(this, bitmap, text, y);
                break;
            case 'text':
            default :
                textHandler    = this.drawItemText.bind(this, text, textPos);
                y              = this.calcItemTextHeight(text) + textPos;
                pictureHandler = this.drawPicture.bind(this, bitmap, text, y);
                break;
        }
        if (this.getPicturePriority() === 'bottom') {
            pictureHandler();
            textHandler();
        } else {
            textHandler();
            pictureHandler();
        }
        this.drawPlusPictures();
    };

    Window_Glossary.prototype.drawPlusPictures = function() {
        var pictureData = null;
        var imageIndex  = 1;
        do {
            pictureData = this.getPlusPictureData(imageIndex, this._pageIndex);
            if (pictureData) {
                imageIndex++;
                this.drawPlusPicture.apply(this, pictureData.split(','));
            }
        } while (pictureData);
    };

    Window_Glossary.prototype.drawPlusPicture = function(pictureName, xText, yText) {
        var bitmap = ImageManager.loadPicture(pictureName);
        if (!bitmap) {
            return;
        }
        bitmap.addLoadListener(function() {
            var x = parseInt(xText) || 0;
            var y = parseInt(yText) || 0;
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
        }.bind(this));
    };

    Window_Glossary.prototype.getPicturePosition = function() {
        var position = getMetaValues(this._itemData, ['ピクチャ位置', 'PicturePosition'], this._pageIndex);
        return position ? position.toLowerCase() : param.PicturePosition;
    };

    Window_Glossary.prototype.getTextPosition = function() {
        var position = getMetaValues(this._itemData, ['テキスト位置', 'TextPosition'], this._pageIndex);
        return position ? parseInt(position) : param.TextPosition || 0;
    };

    Window_Glossary.prototype.getPictureAlign = function() {
        var align = getMetaValues(this._itemData, ['ピクチャ揃え', 'PictureAlign'], this._pageIndex);
        return align ? align.toLowerCase() : param.PictureAlign;
    };

    Window_Glossary.prototype.getPicturePriority = function() {
        var align = getMetaValues(this._itemData, ['ピクチャ優先度', 'PicturePriority'], this._pageIndex);
        return align ? align.toLowerCase() : param.PicturePriority;
    };

    Window_Glossary.prototype.calcItemTextHeight = function(text) {
        var textState = {index: 0, x: 0, y: 0, left: 0, text: text};
        return this.calcTextHeight(textState, true) + 4;
    };

    Window_Glossary.prototype.calcItemPictureHeight = function(bitmap, text) {
        return bitmap ? bitmap.height * this.getPictureScale(this._itemData, bitmap, text) + 4 : 0;
    };

    Window_Glossary.prototype.drawItemText = function(text, y) {
        if (typeof TranslationManager !== 'undefined') {
            TranslationManager.getTranslatePromise(text).then(function(translatedText) {
                this.drawTextEx(translatedText, 0, y);
            }.bind(this));
        } else {
            this.drawTextEx(text, 0, y);
        }
    };

    Window_Glossary._paramNames = [
        'MHP', 'MMP', 'ATK', 'DEF', 'MAG', 'MDF', 'AGI', 'LUK'
    ];

    Window_Glossary.prototype.convertEnemyData = function(text) {
        var enemy     = this._enemy;
        var gameEnemy = new Game_Enemy(enemy.id, 0, 0);
        text          = text.replace(/\x1b(MHP|MMP|ATK|DEF|MAG|MDF|AGI|LUK)\[(\d+)]/gi, function() {
            var index = Window_Glossary._paramNames.indexOf(arguments[1].toUpperCase());
            var param = enemy.params[index];
            return param.padZero(parseInt(arguments[2]));
        });
        text          = text.replace(/\x1bEXP\[(\d+)]/gi, function() {
            return enemy.exp.padZero(parseInt(arguments[1]));
        });
        text          = text.replace(/\x1bMONEY\[(\d+)]/gi, function() {
            return enemy.gold.padZero(parseInt(arguments[1]));
        });
        text          = text.replace(/\x1bDROP\[(\d+)]/gi, function() {
            var drop = enemy.dropItems[parseInt(arguments[1]) - 1];
            if (drop) {
                var item = gameEnemy.itemObject(drop.kind, drop.dataId);
                return item ? `\\i[${item.iconIndex}]${item.name}` : '';
            }
            return '';
        });
        text          = text.replace(/\x1bSCRIPT{(\s+)}/gi, function() {
            return eval(arguments[1]);
        });
        return text;
    };

    Window_Glossary.prototype.processNormalCharacter = function(textState) {
        var c = textState.text[textState.index];
        var w = this.textWidth(c);
        if (textState.x + w > this.contentsWidth()) {
            this.processNewLine(textState);
            textState.index--;
        }
        Window_Base.prototype.processNormalCharacter.apply(this, arguments);
    };

    Window_Glossary.prototype.drawPicture = function(bitmap, text, y) {
        if (!bitmap) return;
        var item  = this._itemData;
        var scale = this.getPictureScale(item, bitmap, text);
        var dw    = bitmap.width * scale;
        var dy    = bitmap.height * scale;
        var x     = 0;
        switch (this.getPictureAlign(item)) {
            case 'left':
                x = 0;
                break;
            case 'center':
                x = this.contentsWidth() / 2 - dw / 2;
                break;
            case 'right':
                x = this.contentsWidth() - dw;
                break;
        }
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, dw, dy);
        this.drawPlusPicture();
    };

    Window_Glossary.prototype.getPictureScale = function(item, bitmap, text) {
        var scale     = 1;
        var metaValue = getMetaValues(item, ['ピクチャ拡大率', 'PictureScale'], this._pageIndex);
        if (metaValue) {
            scale = getArgNumber(metaValue);
        } else if (param.AutoResizePicture && this.getTextPosition() === 0) {
            var mw = this.contentsWidth();
            var mh = this.contentsHeight() - this.calcItemTextHeight(text);
            scale  = Math.min(mw / bitmap.width, mh / bitmap.height, 1);
        }
        return scale;
    };

    Window_Glossary.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.processTouch();
    };

    Window_Glossary.prototype.processTouch = function() {
        if (!TouchInput.isTriggered()) return;
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        if (y >= 0 && y <= this.height) {
            if (x >= 0 && x < this.width / 2) this.cursorLeft(false);
            if (x >= this.width / 2 && x < this.width) this.cursorRight(false);
        }
    };

    Window_Glossary.prototype._refreshArrows = function() {
        Window.prototype._refreshArrows.call(this);
        var w = this._width;
        var h = this._height;
        var p = 24;
        var q = p / 2;

        this._downArrowSprite.rotation = 90 * Math.PI / 180;
        this._downArrowSprite.move(q, h / 2);
        this._upArrowSprite.rotation = 90 * Math.PI / 180;
        this._upArrowSprite.move(w - q, h / 2);
    };
})();

