//=============================================================================
// Chronus.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.17.1 2020/05/17 まったく同じ時間にSET_TIMEしたとき翌日の同時刻になるよう仕様変更
// 1.17.0 2020/04/12 累計日数をカレンダーに出力できる機能を追加、累計日数のカウントを1からに変更
// 1.16.2 2019/11/17 1.15.0の修正以後、場所移動したときのタイルセット情報の取得が、移動前のものになっていた問題を修正
// 1.16.1 2019/11/10 1.16.1で追加したアラーム機能で、アラームに設定した時間を超過して判定された場合、次回のインターバルが超過した時間からカウントされてしまう問題を修正
// 1.16.0 2019/11/09 1.15.0で追加したアラーム機能にインターバル機能を追加
// 1.15.0 2019/10/23 特定のゲーム内時刻になるとスイッチ操作されるアラーム機能を追加
//                   タイルセット変更した場合に、新しいタイルセットの色調や天候有無の設定が反映されない問題を修正
// 1.14.1 2019/10/17 ヘルプの記載漏れを修正
// 1.14.0 2019/09/01 時間帯名称をカレンダーに表示する機能を追加
// 1.13.1 2019/06/09 ニューゲーム時もしくはプロジェクト保存後のロード時に場所移動の時間が経過してしまう問題を修正
// 1.13.0 2019/04/20 カレンダーを初期状態で非表示にできるパラメータを追加
// 1.12.0 2018/12/27 カレンダー表示に行間を設定できる機能を追加
// 1.11.1 2018/10/14 実時間表示に切り替えてから内部時間に反映されるまでにラグがある問題の修正
// 1.11.0 2018/10/14 カレンダーの枠を非表示にできる機能を追加
// 1.10.3 2018/10/08 プラグインコマンドで天候変化を無効にした場合でも、内部で制御している天候による色調の調整が反映されてしまう問題を修正
// 1.10.2 2018/04/11 時間表示方法(実時間、ゲーム時間)を切り替えた直後に、時間変数の値が更新されない問題を修正
// 1.10.1 2018/03/07 場所移動の際、移動先マップの色調有効フラグが異なっていた場合に、色調がリフレッシュされない問題を修正
// 1.10.0 2018/02/24 日付フォーマットに基づいて計算した時間を変数に自動設定する機能を追加
// 1.9.4 2018/02/19 カレンダーの初期表示をtrueに変更しました。
// 1.9.3 2017/11/18 マップロード時に色調を時間に合わせて瞬間変更していた仕様を撤廃
// 1.9.2 2017/11/02 イベント実行中に時間を変更した場合にアナログ時計の表示が変更されない問題を修正
// 1.9.1 2017/11/02 時間経過の初期状態を「停止」から「開始」に変更
// 1.9.0 2017/10/05 アナログ時計の画像を変更できる機能を追加
//                  カレンダーウィンドウのフォントサイズと不透明度を変更できる機能を追加
// 1.8.3 2017/07/18 タイマーの機能のプラグインコマンドに関する説明が一部間違っていた問題を修正
// 1.8.2 2017/07/05 時間変動間隔を変更したときにアナログ時計が正しく表示されない問題を修正
// 1.8.1 2017/06/29 1.8.0で追加した累計時間の初期化機能で、現在時間まで初期化されてしまう問題を修正
// 1.8.0 2017/06/28 累計経過日数を格納するパラメータと、累計時間および日数を初期化できるプラグインコマンドを追加
//                  パラメータの型指定に対応
// 1.7.0 2017/06/01 実時間およびゲーム内時間と連動するタイマー機能を追加
//                  時間が変動する間隔を自由に指定できる機能を追加
// 1.6.0 2017/04/23 降雪マップをマップ単位でタイルセット単位で設定する機能を追加、降水確率を調整できる機能を追加
// 1.5.0 2017/01/23 カレンダーに月名を表記する書式「MON」を追加
// 1.4.0 2017/01/07 ゲーム開始からの累計時間（分単位）を指定したゲーム変数に格納する機能を追加
// 1.3.3 2017/01/02 色調変更を禁止しているときにイベントで色調変更した場合、すぐにリセットされてしまう問題を修正
// 1.3.2 2016/07/24 1.3.1でロード時にエラーになる問題の修正
// 1.3.1 2016/07/23 イベント処理中の時間経過有無をイベントごとに設定できるよう変更
//                  一部コードのリファクタリング
// 1.3.0 2016/07/21 イベント処理中も時間が経過する設定を追加
// 1.2.7 2016/07/10 自然時間加算が0の場合に色調や天候の変化が正しく行われない問題を修正
// 1.2.6 2016/05/30 曜日に「Y」を含む文字列を指定できないバグを修正
// 1.2.5 2016/04/29 createUpperLayerによる競合対策
// 1.2.4 2016/03/13 アナログ時計を指定しないで起動した場合にエラーになる現象の修正
// 1.2.3 2016/03/10 時間帯と時間帯ごとの色調をカスタマイズできるようにユーザ書き換え領域を作成
// 1.2.2 2016/03/04 本体バージョン1.1.0の未使用素材の削除機能への対応
// 1.2.1 2016/02/25 実時間表示設定でロードするとエラーが発生する現象の修正
// 1.2.0 2016/02/14 アナログ時計の表示機能を追加
//                  現実の時間を反映させる機能の追加
// 1.1.3 2016/01/21 競合対策（YEP_MessageCore.js）
// 1.1.2 2016/01/10 カレンダーウィンドウの表示位置をカスタマイズできる機能を追加
// 1.1.1 2015/12/29 日の値に「1」を設定した場合に日付の表示がおかしくなる不具合を修正
//                  一部コードのリファクタリング
// 1.1.0 2015/12/01 天候と時間帯をゲーム変数に格納できるよう機能追加
// 1.0.0 2015/11/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ゲーム内時間の導入プラグイン
 * @author トリアコンタン
 *
 * @param 月ごとの日数配列
 * @desc 各月の日数の配列です。カンマ区切りで指定してください。個数は自由です。
 * @default 31,28,31,30,31,30,31,31,30,31,30,31
 *
 * @param 月名配列
 * @desc 月の名称配列です。カンマ区切りで指定してください。個数は自由です。
 * @default Jan.,Feb.,Mar.,Apr.,May.,Jun.,Jul.,Aug.,Sep.,Oct.,Nov.,Dec.
 *
 * @param 曜日配列
 * @desc 曜日の名称配列です。カンマ区切りで指定してください。個数は自由です。
 * @default (日),(月),(火),(水),(木),(金),(土)
 *
 * @param 自然時間加算
 * @type number
 * @desc 1秒（自然時間加算間隔で指定した間隔）ごとに加算されるゲーム時間（分単位）の値です。イベント処理中は無効です。
 * @default 5
 *
 * @param 自然時間加算間隔
 * @type number
 * @desc ゲーム時間の自然加算が行われる間隔(フレーム数)です。1F=1/60秒
 * @default 60
 *
 * @param 場所移動時間加算
 * @type number
 * @desc 1回の場所移動で加算されるゲーム時間（分単位）の値です。
 * @default 30
 *
 * @param 戦闘時間加算(固定)
 * @type number
 * @desc 1回の戦闘で加算されるゲーム時間（分単位）の値です。
 * @default 30
 *
 * @param 戦闘時間加算(ターン)
 * @type number
 * @desc 1回の戦闘で消費したターン数ごとに加算されるゲーム時間（分単位）の値です。
 * @default 5
 *
 * @param 年のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「年」の値が自動設定されます。
 * @default 0
 *
 * @param 月のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「月」の値が自動設定されます。
 * @default 0
 *
 * @param 日のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「日」の値が自動設定されます。
 * @default 0
 *
 * @param 曜日IDのゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「曜日」のIDが自動設定されます。
 * @default 0
 *
 * @param 曜日名のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「曜日」の名称が自動設定されます。
 * ゲーム変数に文字列が入るので注意してください。
 * @default 0
 *
 * @param 時のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「時」の値が自動設定されます。
 * @default 0
 *
 * @param 分のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「分」の値が自動設定されます。
 * @default 0
 *
 * @param 累計時間のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「累計時間」（分単位）の値が自動設定されます。
 * @default 0
 *
 * @param 累計日数のゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「累計日数」の値が自動設定されます。
 * @default 0
 *
 * @param 時間帯IDのゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「時間帯」のIDが自動設定されます。
 * 0:深夜 1:早朝 2:朝 3:昼 4:夕方 5:夜
 * @default 0
 *
 * @param 天候IDのゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数に「天候」のIDが自動設定されます。
 * 0:なし 1:雨 2:嵐 3:雪
 * @default 0
 *
 * @param フォーマット時間の変数
 * @type variable
 * @desc 「フォーマット時間の計算式」に基づいて計算した結果が自動設定されます。
 * @default 0
 *
 * @param フォーマット時間の計算式
 * @desc 日時フォーマットを使った計算式の内容です。
 * YYYY:年 MON:月名 MM:月 DD:日 など(詳細はヘルプ参照)
 * @default HH24 * 60 + MI
 *
 * @param 日時フォーマット1
 * @desc マップ上の日付ウィンドウ1行目に表示される文字列です。
 * YYYY:年 MON:月名 MM:月 DD:日 など(詳細はヘルプ参照)
 * @default YYYY年 MM月 DD日 DY
 *
 * @param 日時フォーマット2
 * @desc マップ上の日付ウィンドウ2行目に表示される文字列です。
 * YYYY:年 MON:月名 MM:月 DD:日 など(詳細はヘルプ参照)
 * @default AMHH時 MI分
 *
 * @param 日時フォーマット行間
 * @type number
 * @desc カレンダー表示の行間です。
 * @default 0
 *
 * @param カレンダー表示X座標
 * @type number
 * @desc カレンダーの表示 X 座標です。
 * @default 0
 *
 * @param カレンダー表示Y座標
 * @type number
 * @desc カレンダーの表示 Y 座標です。
 * @default 0
 *
 * @param カレンダーフォントサイズ
 * @type number
 * @desc カレンダーのフォントサイズです。0を指定するとデフォルトとなります。
 * @default 0
 *
 * @param カレンダー不透明度
 * @type number
 * @desc カレンダーの背景の不透明度(0-255)です。
 * @default 192
 *
 * @param カレンダー枠の非表示
 * @type boolean
 * @desc カレンダーのウィンドウ枠を非表示にします。
 * @default false
 *
 * @param カレンダーの非表示
 * @type boolean
 * @desc カレンダーを非表示します。プラグインコマンドから表示できます。
 * @default false
 *
 * @param カレンダー余白
 * @type number
 * @desc カレンダーの余白(8-)です。
 * @default 8
 *
 * @param 文字盤画像ファイル
 * @desc アナログ時計を表示する場合の文字盤画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 長針画像ファイル
 * @desc アナログ時計を表示する場合の長針画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 短針画像ファイル
 * @desc アナログ時計を表示する場合の長針画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 時計X座標
 * @type number
 * @desc アナログ時計の表示X座標です。画像の中心座標を指定してください。
 * @default 84
 *
 * @param 時計Y座標
 * @type number
 * @desc アナログ時計の表示Y座標です。画像の中心座標を指定してください。
 * @default 156
 *
 * @param イベント中時間経過
 * @desc イベント実行中も時間経過するようになります。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help ゲーム内で時刻と天候の概念を表現できるプラグインです。
 * 自動、マップ移動、戦闘で時間が経過し、時間と共に天候と色調が変化します。
 * これらの時間は調節可能で、またイベント中は時間の進行が停止します。
 *
 * さらに、現実の時間をゲーム中に反映させる機能もあります。
 * 設定を有効にすると現実の時間がゲーム内とリンクします。
 *
 * 日付や曜日も記録し、曜日の数や名称を自由に設定できます。
 * 現在日付はフォーマットに従って、画面左上に表示されます。
 *
 * 日付フォーマットには以下を利用できます。
 * YYYY:年 MON:月名 MM:月 DD:日 HH24:時(24) HH:時(12)
 * AM:午前 or 午後 MI:分 DY:曜日 TZ 時間帯名称
 * DDALL:累計日数
 *
 * また、規格に沿った画像を用意すればアナログ時計も表示できます。
 * 表示位置は各画像の表示可否は調整できます。
 *
 * 画像の規格は以下の通りです。
 * ・文字盤 : 任意のサイズの正方形画像
 * ・長針　 : 文字盤と同じサイズの画像で、上（0）を指している針の画像
 * ・短針　 : 文字盤と同じサイズの画像で、上（0）を指している針の画像
 *
 * ツクマテにて規格に合った時計画像をリクエストしました。
 * 使用する場合は、以下のURLより利用規約を別途確認の上、ご使用ください。
 * http://tm.lucky-duet.com/viewtopic.php?f=47&t=555&p=1615#p1615
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  指定する値には制御文字\V[n]を使用できます。
 *  （引数の間は半角スペースで区切る）
 *
 * C_ADD_TIME [分] : 指定した値（分単位）だけ時間が経過します。
 * C_ADD_DAY [日] : 指定した値（日単位）だけ日数が経過します。
 * C_SET_TIME [時] [分] : 指定した時間に変更します。
 * C_SET_DAY [年] [月] [日] : 指定した日付に変更します。
 * C_STOP : 時間の進行を停止します。
 * C_START : 時間の進行を開始します。
 * C_SHOW : カレンダーを表示します。
 * C_HIDE : カレンダーを非表示にします。
 * C_DISABLE_TINT : 時間帯による色調の変更を禁止します。
 * C_ENABLE_TINT : 時間帯による色調の変更を許可します。
 * C_DISABLE_WEATHER : 時間経過による天候の変化を禁止します。
 * C_ENABLE_WEATHER : 時間経過による天候の変化を許可します。
 * C_SET_SNOW_LAND : 悪天候時に雪が降るようになります。
 * C_RESET_SNOW_LAND : 悪天候時に雨もしくは嵐が降るようになります。
 * C_SET_SPEED [分] : 実時間1秒あたりの時間の経過速度を設定します。
 * C_SHOW_CLOCK : アナログ時計を表示します。
 * C_HIDE_CLOCK : アナログ時計を非表示にします。
 * C_SET_TIME_REAL : 時間の取得方法を実時間に変更します。
 * C_SET_TIME_VIRTUAL : 時間の取得方法をゲーム内時間に変更します。
 * C_SET_RAINY_PERCENT [確率] : 降水確率(0-100)を設定します。
 * C_INIT_TOTAL_TIME : 累計時間、累計日数を初期化します。
 *
 * ・アナログ時計画像変更コマンド
 * アナログ時計の画像ファイル名(img/pictures)を変更できます。
 * ただし、実際に画像が変更されるのはマップを移動した後になります。
 * C_SET_CLOCK_BASE [ファイル名] : 文字盤画像のファイル名を変更します。
 * C_SET_HOUR_HAND [ファイル名] : 短針画像のファイル名を変更します。
 * C_SET_MINUTE_HAND [ファイル名] : 長針画像のファイル名を変更します。
 *
 * ・タイマー操作系コマンド
 * コマンド実行から指定した時間[分]が経過後にスイッチやセルフスイッチを
 * ONにできるコマンドです。
 * 実時間連動機能と併せて使用することもできます。
 * スイッチの場合はIDを、セルフスイッチの場合は種類(A,B,C,D)を指定します。
 *
 * C_SET_SWITCH_TIMER [分] [スイッチID] [ループ]
 * 指定例（ゲーム内時間で30分経過後する度にスイッチ[10]をONにする）
 * C_SET_SWITCH_TIMER 30 10 ON
 *
 * C_SET_SELF_SWITCH_TIMER [分] [セルフスイッチ種類] [ループ]
 * 指定例（ゲーム内時間で3時間過後にセルフスイッチ[B](※)をONにする）
 * C_SET_SELF_SWITCH_TIMER 180 B OFF
 * ※対象イベントはプラグインコマンドを実行したイベントです。
 *
 * 途中で解除や一時停止する可能性がある場合は[タイマー名]を指定するコマンドを
 * 実行してください。解除などの際にタイマー名を指定する必要があるためです。
 *
 * C_SET_SWITCH_NAMED_TIMER [タイマー名] [分] [スイッチID] [ループ]
 * 指定例（ゲーム内時間で30分経過後する度にスイッチ[10]をONにする）
 * C_SET_SWITCH_NAMED_TIMER timer 30 10 ON
 *
 * C_SET_SELF_SWITCH_NAMED_TIMER [タイマー名] [分] [セルフスイッチ種類] [ループ]
 * 指定例（ゲーム内時間で3時間過後にセルフスイッチ[B](※)をONにする）
 * C_SET_SELF_SWITCH_NAMED_TIMER timer 180 B OFF
 * ※対象イベントはプラグインコマンドを実行したイベントです。
 *
 * 解除、停止、再開のコマンドは以下の通りです。
 * C_CLEAR_TIMER timer # タイマー名「timer」を解除します。
 * C_STOP_TIMER timer  # タイマー名「timer」を一時停止します。
 * C_START_TIMER timer # タイマー名「timer」を再開します。
 *
 * 時間ではなく時刻指定でスイッチ操作できるアラーム機能です。
 * [年月時分]は、「YYYYMMDDHHMM」形式で指定してください。
 * 解除はタイマー用のコマンドを使います。
 * C_SET_SWITCH_ALARM [年月時分] [スイッチID] [インターバル]
 * C_SET_SELF_SWITCH_ALARM [年月時分] [セルフスイッチ種類] [インターバル]
 * C_SET_SWITCH_NAMED_ALARM [アラーム名] [年月時分] [スイッチID] [インターバル]
 * C_SET_SELF_SWITCH_NAMED_ALARM [アラーム名] [年月時分] [セルフスイッチ種類] [インターバル]
 *
 * 指定例（ゲーム内時間で2019/10/22 15:00を過ぎるとセルフスイッチ[B]をONにする）
 * C_SET_SELF_SWITCH_ALARM 201910221500 B
 *
 * インターバルを指定した場合、スイッチがONになった後も指定した期間が経過すると
 * 再度、スイッチがONになるようになります。単位は分ですが計算式が使えます。
 *
 * 指定例（ゲーム内時間で2019/10/22 15:00を過ぎるとセルフスイッチ[B]をONにする。
 * 　　　　その後、1日経過ごとに再度セルフスイッチ[B]をONにする）
 * C_SET_SELF_SWITCH_ALARM 201910221500 B 24*60
 *
 * メモ欄詳細
 *  タイトルセットおよびマップのメモ欄に以下を入力すると、
 *  一時的に天候と色調変化を自動で無効化できます。
 *  屋内マップやイベントシーンなどで一時的に無効化したい場合に利用できます。
 *  設定はマップのメモ欄が優先されます。
 *
 * <C_Tint:OFF>    # 色調の変更を一時的に無効化します。
 * <C_色調:OFF>    # 同上
 * <C_Weather:OFF> # 天候を一時的に無効化します。
 * <C_天候:OFF>    # 同上
 * <C_Snow:ON>     # 天候を雪に設定します。
 * <C_雪:ON>       # 同上
 *
 * イベント実行中にも時間経過するかどうかをイベントごとに設定できます。
 * この設定はパラメータの設定よりも優先されます。
 * イベントのメモ欄に以下を入力してください。
 * <C_時間経過:ON> # イベント実行中に時間経過します。(ON/OFF)
 * <C_NoStop:ON>   # 同上
 *
 * 高度な設定
 * ソースコード中の「ユーザ書き換え領域」を参照すると以下を変更できます。
 *  時間帯の情報(朝が何時から何時まで等)
 *  時間帯ごとの色調(ただし、悪天候の場合は補正が掛かります)
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * ゲーム内時間を扱うゲームオブジェクトです。
 * @constructor
 */
function Game_Chronus() {
    this.initialize.apply(this, arguments);
}

/**
 * ゲーム内タイマーを扱うゲームオブジェクトです。
 * @constructor
 */
function Game_ChronusTimer() {
    this.initialize.apply(this, arguments);
}

/**
 * 時計画像を扱うスプライトです。
 * @constructor
 */
function Sprite_Chronicle_Clock() {
    this.initialize.apply(this, arguments);
}

/**
 * ゲーム内時間を描画するウィンドウです。
 * @constructor
 */
function Window_Chronus() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //=============================================================================
    var settings = {
        /* timeZone:時間帯 */
        timeZone: [
            /* name:時間帯名称 start:開始時刻 end:終了時刻 timeId:時間帯ID */
            {name: '深夜', start: 0, end: 4, timeId: 0},
            {name: '早朝', start: 5, end: 6, timeId: 1},
            {name: '朝', start: 7, end: 11, timeId: 2},
            {name: '昼', start: 12, end: 16, timeId: 3},
            {name: '夕方', start: 17, end: 18, timeId: 4},
            {name: '夜', start: 19, end: 21, timeId: 5},
            {name: '深夜', start: 22, end: 24, timeId: 0}
        ],
        /* timeTone:時間帯ごとの色調 */
        timeTone: [
            /* timeId:時間帯ID value:色調[赤(-255...255),緑(-255...255),青(-255...255),グレー(0...255)] */
            {timeId: 0, value: [-102, -102, -68, 102]},
            {timeId: 1, value: [-68, -68, 0, 0]},
            {timeId: 2, value: [0, 0, 0, 0]},
            {timeId: 3, value: [34, 34, 34, 0]},
            {timeId: 4, value: [68, -34, -34, 0]},
            {timeId: 5, value: [-68, -68, 0, 68]}
        ]
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName    = 'Chronus';
    var metaTagPrefix = 'C_';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = (getParamOther(paramNames) || '').toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) !== null;
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return parseIntStrict(convertEscapeCharacters(arg)).clamp(min, max);
    };

    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON' || (arg || '').toUpperCase() === 'TRUE';
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents      = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameSystem.onLoad();
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramAutoAddInterval     = getParamNumber('自然時間加算間隔', 1) || 60;
    var paramCalendarFontSize    = getParamNumber('カレンダーフォントサイズ', 0);
    var paramCalendarOpacity     = getParamNumber('カレンダー不透明度', 0);
    var paramCalendarPadding     = getParamNumber('カレンダー余白', 8);
    var paramClockBaseFile       = getParamString('文字盤画像ファイル');
    var paramMinutesHandFile     = getParamString('長針画像ファイル');
    var paramHourHandFile        = getParamString('短針画像ファイル');
    var paramCalendarFrameHidden = getParamBoolean('カレンダー枠の非表示');
    var paramCalendarLineSpacing = getParamNumber('日時フォーマット行間', 0);
    var paramCalendarHidden      = getParamBoolean('カレンダーの非表示');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[C_ADD_TIME]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        this.pluginCommandChronus(command.replace(commandPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandChronus = function(command, args) {
        switch (getCommandName(command)) {
            case 'ADD_TIME' :
                $gameSystem.chronus().addTime(getArgNumber(args[0], 0, 99999));
                break;
            case 'ADD_DAY' :
                $gameSystem.chronus().addDay(getArgNumber(args[0], 0, 99999));
                break;
            case 'SET_TIME' :
                var hour   = getArgNumber(args[0], 0, 23);
                var minute = getArgNumber(args[1], 0, 59);
                $gameSystem.chronus().setTime(hour, minute);
                break;
            case 'SET_DAY' :
                var year  = getArgNumber(args[0], 1, 5000);
                var month = getArgNumber(args[1], 1, $gameSystem.chronus().getMonthOfYear());
                var day   = getArgNumber(args[2], 1, $gameSystem.chronus().getDaysOfMonth(month));
                $gameSystem.chronus().setDay(year, month, day);
                break;
            case 'STOP' :
                $gameSystem.chronus().stop();
                break;
            case 'START' :
                $gameSystem.chronus().start();
                break;
            case 'SHOW' :
                $gameSystem.chronus().showCalendar();
                break;
            case 'HIDE' :
                $gameSystem.chronus().hideCalendar();
                break;
            case 'DISABLE_TINT':
                $gameSystem.chronus().disableTint();
                break;
            case 'ENABLE_TINT':
                $gameSystem.chronus().enableTint();
                break;
            case 'DISABLE_WEATHER':
                $gameSystem.chronus().disableWeather();
                break;
            case 'ENABLE_WEATHER':
                $gameSystem.chronus().enableWeather();
                break;
            case 'SET_SNOW_LAND':
                $gameSystem.chronus().setSnowLand();
                break;
            case 'RESET_SNOW_LAND':
                $gameSystem.chronus().resetSnowLand();
                break;
            case 'SET_SPEED':
                $gameSystem.chronus().setTimeAutoAdd(getArgNumber(args[0], 0, 99));
                break;
            case 'SHOW_CLOCK':
                $gameSystem.chronus().showClock();
                break;
            case 'HIDE_CLOCK':
                $gameSystem.chronus().hideClock();
                break;
            case 'SET_TIME_REAL':
                $gameSystem.chronus().setTimeReal();
                break;
            case 'SET_TIME_VIRTUAL':
                $gameSystem.chronus().setTimeVirtual();
                break;
            case 'SET_RAINY_PERCENT':
                $gameSystem.chronus().setRainyPercent(getArgNumber(args[0], 0, 100));
                break;
            case 'SET_SWITCH_TIMER':
                this.setSwitchTimer(args, false);
                break;
            case 'SET_SWITCH_NAMED_TIMER':
                this.setSwitchTimer(args, true);
                break;
            case 'SET_SELF_SWITCH_TIMER':
                this.setSwitchTimer(args, false, true);
                break;
            case 'SET_SELF_SWITCH_NAMED_TIMER':
                this.setSwitchTimer(args, true, true);
                break;
            case 'SET_SWITCH_ALARM':
                this.setSwitchAlarm(args, false);
                break;
            case 'SET_SWITCH_NAMED_ALARM':
                this.setSwitchAlarm(args, true);
                break;
            case 'SET_SELF_SWITCH_ALARM':
                this.setSwitchAlarm(args, false, true);
                break;
            case 'SET_SELF_SWITCH_NAMED_ALARM':
                this.setSwitchAlarm(args, true, true);
                break;
            case 'STOP_TIMER':
                $gameSystem.chronus().stopTimer(convertEscapeCharacters(args[0]));
                break;
            case 'START_TIMER':
                $gameSystem.chronus().startTimer(convertEscapeCharacters(args[0]));
                break;
            case 'CLEAR_TIMER':
                $gameSystem.chronus().clearTimer(convertEscapeCharacters(args[0]));
                break;
            case 'INIT_TOTAL_TIME':
                $gameSystem.chronus().initTotalTime();
                break;
            case 'SET_CLOCK_BASE':
                $gameSystem.chronus().setClockBaseFile(convertEscapeCharacters(args[0]));
                break;
            case 'SET_MINUTE_HAND':
                $gameSystem.chronus().setMinuteHandFile(convertEscapeCharacters(args[0]));
                break;
            case 'SET_HOUR_HAND':
                $gameSystem.chronus().setHourHandFile(convertEscapeCharacters(args[0]));
                break;
        }
    };

    Game_Interpreter.prototype.setSwitchTimer = function(args, named, selfSwitch) {
        var timerName = named ? convertEscapeCharacters(args.shift()) : null;
        var timeout   = getArgNumber(args.shift(), 0);
        var switchKey = this.getSwitchKey(args.shift(), selfSwitch);
        var loop      = getArgBoolean(args.shift());
        $gameSystem.chronus().makeTimer(timerName, timeout, switchKey, loop);
    };

    Game_Interpreter.prototype.setSwitchAlarm = function(args, named, selfSwitch) {
        var timerName = named ? convertEscapeCharacters(args.shift()) : null;
        var timeout   = getArgNumber(args.shift(), 0);
        var switchKey = this.getSwitchKey(args.shift(), selfSwitch);
        var interval = args.shift();
        if (interval) {
            interval = eval(convertEscapeCharacters(interval));
        }
        $gameSystem.chronus().makeAlarm(timerName, timeout, switchKey, interval);
    };

    Game_Interpreter.prototype.getSwitchKey = function(arg, selfSwitch) {
        return selfSwitch ? [$gameMap.mapId(), this.eventId(), convertEscapeCharacters(arg).toUpperCase()] : getArgNumber(arg);
    };

    var _Game_Interpreter_command236      = Game_Interpreter.prototype.command236;
    Game_Interpreter.prototype.command236 = function() {
        var result = _Game_Interpreter_command236.call(this);
        if (!$gameParty.inBattle()) {
            var chronus = $gameSystem.chronus();
            chronus.setWeatherType(Game_Chronus.weatherTypes.indexOf(this._params[0]));
            chronus.setWeatherPower(this._params[1]);
            chronus.refreshTint(true);
            chronus.forceSetBatWeatherLevel(this._params[0], this._params[1]);
        }
        return result;
    };

    var _Game_Interpreter_command282 = Game_Interpreter.prototype.command282;
    Game_Interpreter.prototype.command282 = function() {
        var result =  _Game_Interpreter_command282.apply(this, arguments);
        if (!$gameParty.inBattle()) {
            var chronus = $gameSystem.chronus();
            chronus.refreshTint(true);
            chronus.refreshWeather(true);
        }
        return result;
    };

    //=============================================================================
    // Game_System
    //  ゲーム内時間を扱うクラス「Game_Chronus」を追加定義します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._chronus = new Game_Chronus();
    };

    Game_System.prototype.chronus = function() {
        return this._chronus;
    };

    Game_System.prototype.onBattleEnd = function() {
        this.chronus().onBattleEnd();
    };

    var _Game_System_onLoad      = Game_System.prototype.onLoad;
    Game_System.prototype.onLoad = function() {
        if (_Game_System_onLoad) _Game_System_onLoad.apply(this, arguments);
        if (!this.chronus()) this._chronus = new Game_Chronus();
        this._chronus.onLoad();
    };

    //=============================================================================
    // Game_Map
    //  マップ及びタイルセットから、色調変化無効フラグを取得します。
    //=============================================================================
    Game_Map.prototype.isDisableTint = function() {
        return !this.isChronicleMetaInfo(['Tint', '色調'], true);
    };

    Game_Map.prototype.isDisableWeather = function() {
        return !this.isChronicleMetaInfo(['Weather', '天候'], true);
    };

    Game_Map.prototype.isSnowLand = function() {
        return this.isChronicleMetaInfo(['Snow', '雪'], false);
    };

    Game_Map.prototype.isChronicleMetaInfo = function(tagNames, defaultValue) {
        if (DataManager.isBattleTest() || DataManager.isEventTest()) return false;
        var metaValue1 = getMetaValues($dataMap, tagNames);
        if (metaValue1 !== undefined) {
            return getArgBoolean(metaValue1);
        }
        var tileset = $gamePlayer.isTransferring() ? $dataTilesets[$dataMap.tilesetId] : this.tileset();
        var metaValue2 = getMetaValues(tileset, tagNames);
        if (metaValue2 !== undefined) {
            return getArgBoolean(metaValue2);
        }
        return defaultValue;
    };

    Game_Map.prototype.isTimeStopEventRunning = function() {
        if (this.isEventRunning()) {
            if (!this._isTimeStopEventRunning) this._isTimeStopEventRunning = this.getTimeStopEventRunning();
        } else {
            this._isTimeStopEventRunning = false;
        }
        return this._isTimeStopEventRunning;
    };

    Game_Map.prototype.getTimeStopEventRunning = function() {
        var event = this.event(this._interpreter.eventId());
        if (!event) return false;
        var stop = getMetaValues(event.event(), ['時間経過', 'NoStop']);
        if (stop) {
            return !getArgBoolean(stop);
        } else {
            return !getParamBoolean('イベント中時間経過');
        }
    };

    //=============================================================================
    // Game_Player
    //  場所移動時の時間経過を追加定義します。
    //=============================================================================
    var _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        var realTransfer = this._newMapId !== $gameMap.mapId() && $gameMap.mapId() > 0;
        $gameSystem.chronus().transfer(realTransfer);
        _Game_Player_performTransfer.call(this);
    };

    //=============================================================================
    // Scene_Map
    //  Game_Chronusの更新を追加定義します。
    //=============================================================================
    var _Scene_Map_onMapLoaded      = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        $gameSystem.chronus().onMapLoaded();
        _Scene_Map_onMapLoaded.apply(this, arguments);
    };

    var _Scene_Map_updateMain      = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.apply(this, arguments);
        $gameSystem.chronus().update();
    };

    var _Scene_Map_createAllWindows      = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createChronusWindow();
        _Scene_Map_createAllWindows.apply(this, arguments);
    };

    Scene_Map.prototype.createChronusWindow = function() {
        this._chronusWindow = new Window_Chronus();
        this.addWindow(this._chronusWindow);
    };

    //=============================================================================
    // BattleManager
    //  戦闘終了時のゲーム内時間経過処理を追加定義します。
    //=============================================================================
    var _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle      = function(result) {
        $gameSystem.onBattleEnd();
        _BattleManager_endBattle.call(this, result);
    };

    //=============================================================================
    // Window_Chronus
    //  ゲーム内時間情報を描画するウィンドウです。
    //=============================================================================
    Window_Chronus.prototype             = Object.create(Window_Base.prototype);
    Window_Chronus.prototype.constructor = Window_Chronus;

    var _Window_Chronus_initialize      = Window_Chronus.prototype.initialize;
    Window_Chronus.prototype.initialize = function() {
        _Window_Chronus_initialize.call(this, 0, 0, this.getDefaultWidth(), this.getDefaultHeight());
        this.createContents();
        this.x = getParamNumber('カレンダー表示X座標');
        this.y = getParamNumber('カレンダー表示Y座標');
        if (paramCalendarFrameHidden) {
            this.opacity = 0;
        }
        this.refresh();
    };

    Window_Chronus.prototype.getDefaultWidth = function() {
        var bitmap      = new Bitmap();
        bitmap.fontSize = this.standardFontSize();
        var width1      = bitmap.measureTextWidth(this.getDateFormat(1));
        var width2      = bitmap.measureTextWidth(this.getDateFormat(2));
        return Math.max(width1, width2) + this.standardPadding() * 2;
    };

    Window_Chronus.prototype.getDefaultHeight = function() {
        return this.standardFontSize() * (this.getDateFormat(2) ? 2 : 1) + this.standardPadding() * 2 + paramCalendarLineSpacing;
    };

    Window_Chronus.prototype.standardPadding = function() {
        return paramCalendarPadding;
    };

    Window_Chronus.prototype.standardBackOpacity = function() {
        return paramCalendarOpacity;
    };

    Window_Chronus.prototype.lineHeight = function() {
        return this.standardFontSize();
    };

    var _Window_Chronus_standardFontSize      = Window_Chronus.prototype.standardFontSize;
    Window_Chronus.prototype.standardFontSize = function() {
        return paramCalendarFontSize || _Window_Chronus_standardFontSize.apply(this, arguments);
    };

    Window_Chronus.prototype.refresh = function() {
        this.contents.clear();
        var width  = this.contents.width;
        var height = this.lineHeight();
        this.contents.drawText(this.getDateFormat(1), 0, 0, width, height, 'left');
        this.contents.drawText(this.getDateFormat(2), 0, height + paramCalendarLineSpacing, width, height, 'left');
    };

    Window_Chronus.prototype.update = function() {
        if (this.chronus().isShowingCalendar()) {
            this.show();
            if (this.chronus().isNeedRefresh()) this.refresh();
        } else {
            this.hide();
        }
    };

    Window_Chronus.prototype.chronus = function() {
        return $gameSystem.chronus();
    };

    Window_Chronus.prototype.getDateFormat = function(lineNumber) {
        return this.chronus().getDateFormat(lineNumber);
    };

    //=============================================================================
    // Sprite_Chronicle_Clock
    //  アナログ時計表示スプライトクラスです。
    //=============================================================================
    Sprite_Chronicle_Clock.prototype             = Object.create(Sprite.prototype);
    Sprite_Chronicle_Clock.prototype.constructor = Sprite_Chronicle_Clock;

    var _Sprite_Chronicle_Clock_initialize      = Sprite_Chronicle_Clock.prototype.initialize;
    Sprite_Chronicle_Clock.prototype.initialize = function() {
        _Sprite_Chronicle_Clock_initialize.apply(this, arguments);
        this.x        = getParamNumber('時計X座標');
        this.y        = getParamNumber('時計Y座標');
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.bitmap   = ImageManager.loadPicture(this.chronus().getClockBaseFile());
        this.createHourHandSprite();
        this.createMinuteHandSprite();
    };

    Sprite_Chronicle_Clock.prototype.createHourHandSprite = function() {
        var handName        = this.chronus().getHourHandFile();
        var handSprite      = new Sprite();
        handSprite.anchor.x = 0.5;
        handSprite.anchor.y = 0.5;
        handSprite.bitmap   = handName ? ImageManager.loadPicture(handName) : ImageManager.loadEmptyBitmap();
        handSprite.visible  = !!handName;
        this.hourHandSprite = handSprite;
        this.addChild(this.hourHandSprite);
    };

    Sprite_Chronicle_Clock.prototype.createMinuteHandSprite = function() {
        var handName          = this.chronus().getMinuteHandFile();
        var handSprite        = new Sprite();
        handSprite.anchor.x   = 0.5;
        handSprite.anchor.y   = 0.5;
        handSprite.bitmap     = handName ? ImageManager.loadPicture(handName) : ImageManager.loadEmptyBitmap();
        handSprite.visible    = !!handName;
        this.minuteHandSprite = handSprite;
        this.addChild(this.minuteHandSprite);
    };

    Sprite_Chronicle_Clock.prototype.update = function() {
        this.visible = this.chronus().isShowingClock();
        if (this.visible) {
            this.updateHourHand();
            this.updateMinuteHand();
        }
    };

    Sprite_Chronicle_Clock.prototype.updateHourHand = function() {
        if (!this.hourHandSprite.visible) return;
        this.hourHandSprite.rotation = this.chronus().getRotationHourHand();
    };

    Sprite_Chronicle_Clock.prototype.updateMinuteHand = function() {
        if (!this.minuteHandSprite.visible) return;
        this.minuteHandSprite.rotation = this.chronus().getRotationMinuteHand();
    };

    Sprite_Chronicle_Clock.prototype.chronus = function() {
        return $gameSystem.chronus();
    };

    //=============================================================================
    // Spriteset_Map
    //  アナログ時計の画像を追加定義します。
    //=============================================================================
    var _Spriteset_Base_createUpperLayer      = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.apply(this, arguments);
        if (this instanceof Spriteset_Map) this.createClockSprite();
    };

    Spriteset_Map.prototype.createClockSprite = function() {
        if (isParamExist('文字盤画像ファイル')) {
            this._clockSprite = new Sprite_Chronicle_Clock();
            this.addChild(this._clockSprite);
        }
    };

    //=============================================================================
    // Game_Chronus
    //  時の流れを扱うクラスです。このクラスはGame_Systemクラスで生成されます。
    //  セーブデータの保存対象のためグローバル領域に定義します。
    //=============================================================================
    Game_Chronus.weatherTypes         = ['none', 'rain', 'storm', 'snow'];
    Game_Chronus.prototype.initialize = function() {
        this._stop            = false;        // 停止フラグ（全ての加算に対して有効。ただし手動による加算は例外）
        this._disableTint     = false;        // 色調変更禁止フラグ
        this._calendarVisible = !paramCalendarHidden; // カレンダー表示フラグ
        this._disableWeather  = false;        // 天候制御禁止フラグ
        this._weatherType     = 0;            // 天候タイプ(0:なし 1:雨 2:嵐 :3雪)
        this._weatherPower    = 0;            // 天候の強さ
        this._weatherSnowLand = false;        // 降雪地帯フラグ
        this._clockVisible    = true;         // アナログ時計表示フラグ
        this._realTime        = false;        // 実時間フラグ
        this._badWeaterLevel  = 0;            // 悪天候の度合い
        this._frameCount      = 0;
        this._demandRefresh   = false;
        this._prevHour        = -1;
        this._nowDate         = null;
        this._clearTone       = false;
        this._timeAutoAdd     = getParamNumber('自然時間加算', 0, 99);
        this._timeTransferAdd = getParamNumber('場所移動時間加算', 0);
        this._timeBattleAdd   = getParamNumber('戦闘時間加算(固定)', 0);
        this._timeTurnAdd     = getParamNumber('戦闘時間加算(ターン)', 0);
        this._weekNames       = getParamArrayString('曜日配列');
        this._monthNames      = getParamArrayString('月名配列');
        this._daysOfMonth     = getParamArrayNumber('月ごとの日数配列');
        this._clockBaseFile   = null;
        this._minuteHandFile  = null;
        this._hourHandFile    = null;
        this._timeMeter       = 0;
        this._dayMeter        = 0;
        this._initDate        = Date.now();
        this.initTotalTime();
        this.onLoad();
    };

    Game_Chronus.prototype.initTotalTime = function() {
        this._criterionTime = this._timeMeter;
        this._criterionDay  = this._dayMeter;
        this._initDate      = Date.now();
    };

    Game_Chronus.prototype.onLoad = function() {
        this._nowDate = new Date();
        if (!this._frameCount) this._frameCount = 0;
        if (!this._timers) this._timers = [];
        if (!this._namedTimers) this._namedTimers = {};
    };

    Game_Chronus.prototype.onMapLoaded = function() {
        this.updateWeatherType();
        this.updateWeatherPower();
        this.refreshWeather(true);
    };

    Game_Chronus.prototype.update = function() {
        this.updateTimer();
        this.updateEffect();
        if (this.isTimeStop()) return;
        this._frameCount++;
        if (this._frameCount >= paramAutoAddInterval) {
            if (this.isRealTime()) {
                this.updateRealTime();
            }
            this.addTime();
        }
    };

    Game_Chronus.prototype.updateRealTime = function() {
        this._nowDate.setTime(Date.now());
    };

    Game_Chronus.prototype.updateTimer = function() {
        for (var timerName in this._namedTimers) {
            if (this._namedTimers.hasOwnProperty(timerName)) {
                var valid = this._namedTimers[timerName].update();
                if (!valid) this.clearTimer(timerName);
            }
        }
        this._timers = this._timers.filter(function(timer) {
            return timer.update();
        });
    };

    Game_Chronus.prototype.isRealTime = function() {
        return this._realTime;
    };

    Game_Chronus.prototype.isTimeStop = function() {
        return this.isStop() || $gameMap.isTimeStopEventRunning();
    };

    Game_Chronus.prototype.updateEffect = function() {
        var hour = this.getHour();
        if (this._prevHour !== hour) {
            this.updateWeather();
            this.refreshTint(false);
            this._prevHour = this.getHour();
        }
    };

    Game_Chronus.prototype.refreshTint = function(swift) {
        if (this.isEnableTint()) {
            this.setTint(this.getTimeZone(), swift);
            this._clearTone = false;
        } else if (!this._clearTone) {
            $gameScreen.clearTone();
            this._clearTone = true;
        }
    };

    Game_Chronus.prototype.setTint = function(timeId, swift) {
        var tone = [0, 0, 0, 0];
        settings.timeTone.forEach(function(toneInfo) {
            if (toneInfo.timeId === timeId) {
                tone = toneInfo.value.clone();
                if (tone.length < 4) throw new Error('色調の値が不正です。:' + tone);
            }
        }.bind(this));
        if (this.getWeatherTypeId() !== 0) {
            tone[0] = tone[0] > 0 ? tone[0] / 7 : tone[0] - 14;
            tone[1] = tone[1] > 0 ? tone[1] / 7 : tone[1] - 14;
            tone[2] = tone[2] > 0 ? tone[2] / 7 : tone[1] - 14;
            tone[3] = tone[3] === 0 ? 68 : tone[3] + 14;
        }
        $gameScreen.startTint(tone, swift ? 0 : this.getEffectDuration());
    };

    Game_Chronus.prototype.setWeatherType = function(value) {
        this._weatherType = value.clamp(0, Game_Chronus.weatherTypes.length - 1);
    };

    Game_Chronus.prototype.setWeatherPower = function(value) {
        this._weatherPower = value.clamp(0, 10);
    };

    Game_Chronus.prototype.setTimeAutoAdd = function(value) {
        this._timeAutoAdd = value.clamp(0, 99);
    };

    Game_Chronus.prototype.updateWeather = function() {
        if (!this._disableWeather) {
            this.updateBatWeatherLevel();
        } else {
            this._weatherType  = 0;
            this._weatherPower = 0;
        }
        this.refreshWeather(false);
    };

    Game_Chronus.prototype.updateBatWeatherLevel = function() {
        var frequency = this.getChangeWeatherFrequency();
        var max       = this.getBadWeatherLevelMax();
        var newLevel  = (this._badWeaterLevel || 0).clamp(frequency, max - frequency);
        if (Math.randomInt(10) <= 1) frequency *= 5;
        this._badWeaterLevel = (newLevel + (Math.randomInt(frequency * 2) - frequency)).clamp(0, max);
        this.updateWeatherType();
        this.updateWeatherPower();
    };

    Game_Chronus.prototype.forceSetBatWeatherLevel = function(type, power) {
        var newLevel = 0;
        switch (type) {
            case Game_Chronus.weatherTypes[1]:
                newLevel = this.getBadWeatherLevelRainy() + power;
                break;
            case Game_Chronus.weatherTypes[2]:
                newLevel = this.getBadWeatherLevelHeavyRainy() + power;
                break;
            case Game_Chronus.weatherTypes[3]:
                newLevel = this.getBadWeatherLevelRainy() + power * 2;
                break;
        }
        this._badWeaterLevel = newLevel;
    };

    Game_Chronus.prototype.updateWeatherType = function() {
        var type        = 0;
        var border      = this.getBadWeatherLevelRainy();
        var heavyBorder = this.getBadWeatherLevelHeavyRainy();
        if (this._badWeaterLevel >= border) {
            type = (this.isSnowLand() ? 3 : this._badWeaterLevel >= heavyBorder ? 2 : 1);
        }
        this.setWeatherType(type);
    };

    Game_Chronus.prototype.updateWeatherPower = function() {
        var power  = 0;
        var border = this.getBadWeatherLevelRainy();
        if (this._badWeaterLevel >= border) {
            power = Math.floor((this._badWeaterLevel - border) / 2);
        }
        this.setWeatherPower(power);
    };

    Game_Chronus.prototype.getBadWeatherLevelMax = function() {
        return this._badWeaterLevelMax || 40;
    };

    Game_Chronus.prototype.getBadWeatherLevelRainy = function() {
        return this.getBadWeatherLevelMax() - 20;
    };

    Game_Chronus.prototype.getBadWeatherLevelHeavyRainy = function() {
        return this.getBadWeatherLevelMax() - 10;
    };

    Game_Chronus.prototype.getChangeWeatherFrequency = function() {
        return 4;
    };

    Game_Chronus.prototype.refreshWeather = function(swift) {
        if (this.isEnableWeather()) {
            this.setScreenWeather(swift);
        } else {
            $gameScreen.changeWeather(0, 0, 0);
        }
    };

    Game_Chronus.prototype.setScreenWeather = function(swift) {
        $gameScreen.changeWeather(this.getWeatherType(), this._weatherPower, swift ? 0 : this.getEffectDuration());
    };

    Game_Chronus.prototype.getEffectDuration = function() {
        if (this.isRealTime()) {
            return 600;
        }
        return this._timeAutoAdd === 0 ? 1 : Math.floor(60 * 5 / (this.getRealAddSpeed() / 10));
    };

    Game_Chronus.prototype.getRealAddSpeed = function() {
        return this._timeAutoAdd * 60 / paramAutoAddInterval;
    };

    Game_Chronus.prototype.disableTint = function() {
        this._disableTint = true;
        this.refreshTint(true);
    };

    Game_Chronus.prototype.enableTint = function() {
        this._disableTint = false;
        this.refreshTint(true);
    };

    Game_Chronus.prototype.isEnableTint = function() {
        return !this._disableTint && !$gameMap.isDisableTint();
    };

    Game_Chronus.prototype.disableWeather = function() {
        this._disableWeather = true;
        this.refreshWeather(true);
    };

    Game_Chronus.prototype.enableWeather = function() {
        this._disableWeather = false;
        this.refreshWeather(true);
    };

    Game_Chronus.prototype.isEnableWeather = function() {
        return !this._disableWeather && !$gameMap.isDisableWeather();
    };

    Game_Chronus.prototype.setSnowLand = function() {
        this._weatherSnowLand = true;
        this.updateWeatherType();
        this.refreshWeather(true);
    };

    Game_Chronus.prototype.resetSnowLand = function() {
        this._weatherSnowLand = false;
        this.updateWeatherType();
        this.refreshWeather(true);
    };

    Game_Chronus.prototype.setRainyPercent = function(value) {
        this._badWeaterLevelMax = (value > 0 ? 2000 / value : Infinity);
        this.updateWeather();
    };

    Game_Chronus.prototype.setTimeReal = function() {
        this._realTime = true;
        this.updateRealTime();
        this.setGameVariable();
    };

    Game_Chronus.prototype.setTimeVirtual = function() {
        this._realTime = false;
        this.setGameVariable();
    };

    Game_Chronus.prototype.onBattleEnd = function() {
        if (this.isStop()) return;
        this.addTime(this._timeBattleAdd + this._timeTurnAdd * $gameTroop.turnCount());
    };

    Game_Chronus.prototype.transfer = function(realTransfer) {
        if (this.isStop()) return;
        if (realTransfer) {
            this.addTime(this._timeTransferAdd);
        }
        this.demandRefresh(true);
    };

    Game_Chronus.prototype.stop = function() {
        this._stop = true;
    };

    Game_Chronus.prototype.start = function() {
        this._stop = false;
    };

    Game_Chronus.prototype.isStop = function() {
        return this._stop;
    };

    Game_Chronus.prototype.showCalendar = function() {
        this._calendarVisible = true;
    };

    Game_Chronus.prototype.hideCalendar = function() {
        this._calendarVisible = false;
    };

    Game_Chronus.prototype.isShowingCalendar = function() {
        return this._calendarVisible;
    };

    Game_Chronus.prototype.isSnowLand = function() {
        return this._weatherSnowLand || $gameMap.isSnowLand();
    };

    Game_Chronus.prototype.showClock = function() {
        this._clockVisible = true;
    };

    Game_Chronus.prototype.hideClock = function() {
        this._clockVisible = false;
    };

    Game_Chronus.prototype.isShowingClock = function() {
        return this._clockVisible;
    };

    Game_Chronus.prototype.addTime = function(value) {
        if (arguments.length === 0) value = this._timeAutoAdd;
        this._timeMeter += value;
        while (this._timeMeter >= 60 * 24) {
            this.addDay();
            this._timeMeter -= 60 * 24;
        }
        this.demandRefresh(false);
    };

    Game_Chronus.prototype.setTime = function(hour, minute) {
        var time = hour * 60 + minute;
        if (this._timeMeter >= time) this.addDay();
        this._timeMeter = time;
        this.demandRefresh(true);
    };

    Game_Chronus.prototype.addDay = function(value) {
        if (arguments.length === 0) value = 1;
        this._dayMeter += value;
        this.demandRefresh(false);
    };

    Game_Chronus.prototype.setDay = function(year, month, day) {
        this._dayMeter = this.calcNewDay(year, month, day);
        this.demandRefresh(true);
    };

    Game_Chronus.prototype.calcNewDay = function(year, month, day) {
        var newDay = (year - 1) * this.getDaysOfYear();
        for (var i = 1; i < month; i++) {
            newDay += this.getDaysOfMonth(i);
        }
        newDay += day - 1;
        return newDay;
    };

    Game_Chronus.prototype.demandRefresh = function(effectRefreshFlg) {
        this._demandRefresh = true;
        this._frameCount    = 0;
        this.setGameVariable();
        if (effectRefreshFlg) {
            this.refreshTint(true);
            this.updateWeather();
        }
    };

    Game_Chronus.prototype.isNeedRefresh = function() {
        var needRefresh     = this._demandRefresh;
        this._demandRefresh = false;
        return needRefresh;
    };

    Game_Chronus.prototype.getDaysOfWeek = function() {
        return this._weekNames.length;
    };

    Game_Chronus.prototype.getDaysOfMonth = function(month) {
        return this._daysOfMonth[month - 1];
    };

    Game_Chronus.prototype.getDaysOfYear = function() {
        var result = 0;
        this._daysOfMonth.forEach(function(days) {
            result += days;
        });
        return result;
    };

    Game_Chronus.prototype.setGameVariable = function() {
        this.setGameVariableSub('年のゲーム変数', this.getYear.bind(this));
        this.setGameVariableSub('月のゲーム変数', this.getMonth.bind(this));
        this.setGameVariableSub('日のゲーム変数', this.getDay.bind(this));
        this.setGameVariableSub('曜日IDのゲーム変数', this.getWeekIndex.bind(this));
        this.setGameVariableSub('曜日名のゲーム変数', this.getWeekName.bind(this));
        this.setGameVariableSub('時のゲーム変数', this.getHour.bind(this));
        this.setGameVariableSub('分のゲーム変数', this.getMinute.bind(this));
        this.setGameVariableSub('時間帯IDのゲーム変数', this.getTimeZone.bind(this));
        this.setGameVariableSub('天候IDのゲーム変数', this.getWeatherTypeId.bind(this));
        this.setGameVariableSub('累計時間のゲーム変数', this.getTotalTime.bind(this));
        this.setGameVariableSub('累計日数のゲーム変数', this.getTotalDay.bind(this));
        this.setGameVariableSub('フォーマット時間の変数', this.getFormatTimeFormula.bind(this));
    };

    Game_Chronus.prototype.setGameVariableSub = function(paramName, callBack) {
        var index = getParamNumber(paramName, 0);
        if (index !== 0) {
            $gameVariables.setValue(index, callBack());
        }
    };

    Game_Chronus.prototype.getMonthOfYear = function() {
        return this._daysOfMonth.length;
    };

    Game_Chronus.prototype.getWeekName = function() {
        return this._weekNames[this.getWeekIndex()];
    };

    Game_Chronus.prototype.getWeekIndex = function() {
        return this.isRealTime() ? this._nowDate.getDay() : this._dayMeter % this.getDaysOfWeek();
    };

    Game_Chronus.prototype.getYear = function() {
        return this.isRealTime() ? this._nowDate.getFullYear() : Math.floor(this._dayMeter / this.getDaysOfYear()) + 1;
    };

    Game_Chronus.prototype.getMonth = function() {
        if (this.isRealTime()) return this._nowDate.getMonth() + 1;
        var days = this._dayMeter % this.getDaysOfYear();
        for (var i = 0; i < this._daysOfMonth.length; i++) {
            days -= this._daysOfMonth[i];
            if (days < 0) return i + 1;
        }
        return null;
    };

    Game_Chronus.prototype.getDay = function() {
        if (this.isRealTime()) return this._nowDate.getDate();
        var days = this._dayMeter % this.getDaysOfYear();
        for (var i = 0; i < this._daysOfMonth.length; i++) {
            if (days < this._daysOfMonth[i]) return days + 1;
            days -= this._daysOfMonth[i];
        }
        return null;
    };

    Game_Chronus.prototype.getHour = function() {
        return this.isRealTime() ? this._nowDate.getHours() : Math.floor(this._timeMeter / 60);
    };

    Game_Chronus.prototype.getMinute = function() {
        return this.isRealTime() ? this._nowDate.getMinutes() : this._timeMeter % 60;
    };

    Game_Chronus.prototype.getFormatTimeFormula = function() {
        this._disablePadding = true;
        var formula          = this.convertDateFormatText(getParamString('フォーマット時間の計算式'));
        this._disablePadding = false;
        return eval(formula);
    };

    Game_Chronus.prototype.getDateFormat = function(index) {
        return this.convertDateFormatText(getParamString('日時フォーマット' + String(index)));
    };

    Game_Chronus.prototype.convertDateFormatText = function(format) {
        format = format.replace(/(YYYY)/gi, function() {
            return this.getValuePadding(this.getYear(), arguments[1].length);
        }.bind(this));
        format = format.replace(/MON/gi, function() {
            return this._monthNames[this.getMonth() - 1];
        }.bind(this));
        format = format.replace(/MM/gi, function() {
            return this.getValuePadding(this.getMonth(), String(this.getMonthOfYear()).length);
        }.bind(this));
        format = format.replace(/DDALL/gi, function() {
            return this.getValuePadding(this.getTotalDay());
        }.bind(this));
        format = format.replace(/DD/gi, function() {
            return this.getValuePadding(this.getDay(),
                String(this.getDaysOfMonth(this.getMonth())).length);
        }.bind(this));
        format = format.replace(/HH24/gi, function() {
            return this.getValuePadding(this.getHour(), 2);
        }.bind(this));
        format = format.replace(/HH/gi, function() {
            return this.getValuePadding(this.getHour() % 12, 2);
        }.bind(this));
        format = format.replace(/AM/gi, function() {
            return Math.floor(this.getHour() / 12) === 0 ?
                $gameSystem.isJapanese() ? '午前' : 'Morning  ' :
                $gameSystem.isJapanese() ? '午後' : 'Afternoon';
        }.bind(this));
        format = format.replace(/MI/gi, function() {
            return this.getValuePadding(this.getMinute(), 2);
        }.bind(this));
        format = format.replace(/DY/gi, function() {
            return this.getWeekName();
        }.bind(this));
        format = format.replace(/TZ/gi, function() {
            return this.getTimeZoneName();
        }.bind(this));
        return format;
    };

    Game_Chronus.prototype.getTimeZone = function() {
        var timeId = 0;
        settings.timeZone.forEach(function(zoneInfo) {
            if (this.isHourInRange(zoneInfo.start, zoneInfo.end)) timeId = zoneInfo.timeId;
        }.bind(this));
        return timeId;
    };

    Game_Chronus.prototype.getTimeZoneName = function() {
        var timeId = this.getTimeZone();
        return settings.timeZone.filter(function(zoneInfo) {
            return zoneInfo.timeId === timeId;
        })[0].name;
    };

    Game_Chronus.prototype.getWeatherTypeId = function() {
        return this._weatherType;
    };

    Game_Chronus.prototype.getWeatherType = function() {
        return Game_Chronus.weatherTypes[this.getWeatherTypeId()];
    };

    Game_Chronus.prototype.getValuePadding = function(value, digit, padChar) {
        if (this._disablePadding) {
            return value;
        }
        if (arguments.length === 2) padChar = '0';
        var result = '';
        for (var i = 0; i < digit; i++) result += padChar;
        result += value;
        return result.substr(-digit);
    };

    Game_Chronus.prototype.isHourInRange = function(min, max) {
        var hour = this.getHour();
        return hour >= min && hour <= max;
    };

    Game_Chronus.prototype.getAnalogueHour = function() {
        return this.getHour() + (this.getAnalogueMinute() / 60);
    };

    Game_Chronus.prototype.getAnalogueMinute = function() {
        return this.getMinute() + (this.isRealTime() ? 0 : this._frameCount / paramAutoAddInterval * this._timeAutoAdd);
    };

    Game_Chronus.prototype.getRotationHourHand = function() {
        return (this.getAnalogueHour() % 12) * (360 / 12) * Math.PI / 180;
    };

    Game_Chronus.prototype.getRotationMinuteHand = function() {
        return this.getAnalogueMinute() * (360 / 60) * Math.PI / 180;
    };

    Game_Chronus.prototype.getTotalTime = function() {
        if (this.isRealTime()) {
            return (this._nowDate - this._initDate) / (1000 * 60);
        } else {
            var dayMeter  = this._dayMeter - (this._criterionDay || 0);
            var timeMeter = this._timeMeter - (this._criterionTime || 0);
            return dayMeter * 24 * 60 + timeMeter;
        }
    };

    Game_Chronus.prototype.getTotalDay = function() {
        return Math.floor(this.getTotalTime() / (24 * 60)) + 1;
    };

    Game_Chronus.prototype.makeAlarm = function(timerName, timeNumber, switchKey, interval) {
        var baseTime   = this.getTotalTime();
        var min        = timeNumber % 100;
        var hour       = Math.floor(timeNumber / 100) % 100;
        var timeMeter  = hour * 60 + min - (this._criterionTime || 0);
        var day        = Math.floor(timeNumber / 10000) % 100;
        var month      = Math.floor(timeNumber / 1000000) % 100;
        var year       = Math.floor(timeNumber / 100000000);
        var dayMeter   = this.calcNewDay(year, month, day) - (this._criterionDay || 0);
        var targetTime = dayMeter * 24 * 60 + timeMeter;
        this.makeTimer(timerName, (targetTime - baseTime) || 0, switchKey, true, interval);
    };

    Game_Chronus.prototype.makeTimer = function(timerName, timeout, switchKey, loop, interval) {
        var timer = new Game_ChronusTimer(timeout, switchKey, loop, interval);
        if (timerName) {
            this._namedTimers[timerName] = timer;
        } else {
            this._timers.push(timer);
        }
    };

    Game_Chronus.prototype.clearTimer = function(timerName) {
        delete this._namedTimers[timerName];
    };

    Game_Chronus.prototype.stopTimer = function(timerName) {
        var timer = this._namedTimers[timerName];
        if (timer) {
            timer.stop();
        }
    };

    Game_Chronus.prototype.startTimer = function(timerName) {
        var timer = this._namedTimers[timerName];
        if (timer) {
            timer.start();
        }
    };

    Game_Chronus.prototype.getClockBaseFile = function() {
        return this._clockBaseFile || paramClockBaseFile;
    };

    Game_Chronus.prototype.getMinuteHandFile = function() {
        return this._minuteHandFile || paramMinutesHandFile;
    };

    Game_Chronus.prototype.getHourHandFile = function() {
        return this._hourHandFile || paramHourHandFile;
    };

    Game_Chronus.prototype.setClockBaseFile = function(name) {
        this._clockBaseFile = name;
    };

    Game_Chronus.prototype.setMinuteHandFile = function(name) {
        this._minuteHandFile = name;
    };

    Game_Chronus.prototype.setHourHandFile = function(name) {
        this._hourHandFile = name;
    };

    //=============================================================================
    // Game_ChronusTimer
    //  ゲーム内時間のタイマーを扱うクラスです。このクラスはGame_Chronusクラスで生成されます。
    //  セーブデータの保存対象のためグローバル領域に定義します。
    //=============================================================================
    Game_ChronusTimer.prototype             = Object.create(Game_ChronusTimer.prototype);
    Game_ChronusTimer.prototype.constructor = Game_ChronusTimer;

    Game_ChronusTimer.prototype.initialize = function(timeout, switchKey, loop, interval) {
        this._timeout = timeout;
        this._interval = interval || timeout;
        this._loop    = loop;
        this._baseTime = this.getTotalTime();
        if (Array.isArray(switchKey)) {
            this.setCallBackSelfSwitch(switchKey);
        } else {
            this.setCallBackSwitch(switchKey);
        }
        this.start();
    };

    Game_ChronusTimer.prototype.start = function() {
        this._start = true;
    };

    Game_ChronusTimer.prototype.stop = function() {
        this._start = false;
    };

    Game_ChronusTimer.prototype.getTotalTime = function() {
        return $gameSystem.chronus().getTotalTime();
    };

    Game_ChronusTimer.prototype.setCallBackSwitch = function(switchId) {
        this._callBackSwitchId = switchId;
    };

    Game_ChronusTimer.prototype.setCallBackSelfSwitch = function(selfSwitchKey) {
        this._callBackSelfSwitchKey = selfSwitchKey;
    };

    Game_ChronusTimer.prototype.update = function() {
        if (!this._start || !this.isTimeout()) {
            return true;
        }
        this.onTimeout();
        if (this._loop) {
            this.resetBaseTime();
            return true;
        } else {
            return false;
        }
    };

    Game_ChronusTimer.prototype.resetBaseTime = function() {
        while(this.isTimeout()) {
            this._baseTime += this._timeout;
            this._timeout = this._interval;
        }
    };

    Game_ChronusTimer.prototype.isTimeout = function() {
        return this._baseTime + this._timeout <= this.getTotalTime();
    };

    Game_ChronusTimer.prototype.onTimeout = function() {
        if (this._callBackSwitchId) {
            $gameSwitches.setValue(this._callBackSwitchId, true);
        }
        if (this._callBackSelfSwitchKey) {
            $gameSelfSwitches.setValue(this._callBackSelfSwitchKey, true);
        }
    };
})();
