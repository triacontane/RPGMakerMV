//=============================================================================
// TkoolMV_PluginCommandBook.js
// https://github.com/AlecYawata/TkoolMV_PluginCommandBook
//=============================================================================
//
// Copyright (c) 2015 Alec
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
//=============================================================================
/*:
 * @plugindesc プラグインコマンド集
 * @author 有志の皆さん
 *
 * @param 制御文字の拡張
 * @desc このプラグインで使えるパラメータの制御文字を
 * 通常のメッセージなどで使用できるようにするか(はい/いいえ)
 * Default: はい
 * @default はい
 *
 * @param スクリプトに制御文字適用
 * @desc スクリプト実行時に制御文字を使用できるようにするか(はい/いいえ)
 * Default: いいえ
 * @default いいえ
 *
 * @help
 *  Copyright (c) 2015 Alec
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 *
 * このプラグインは有志によるプラグインコマンド集です。
 * 商用利用、年齢制限のあるゲームへの使用、改変が可能です。
 * クレジットは不要です。
 *
 * ■使い方
 * イベントのコマンド追加からプラグインコマンドを選択し、
 * 以下のプラグインコマンドから好きなモノを選んで入力して下さい。
 *
 * ■パラメータについて
 * プラグインコマンドの右に空白をつけてパラメータを追記することができます。
 * パラメータは数字、英数字、日本語、記号など以外にも以下のような制御文字が使えます。
 * （各数字部分には全角数字も使えます）
 * \V[n] 変数n番目の値に置き換えられます
 * \N[n] アクターn番の名前に置き換えられます
 * \P[n] パーティメンバーn番の値に置き換えられます
 * \G 　　通貨単位に置き換えられます
 * \In[n] アイテムn番の名前に置き換えられます
 * \Ip[n] アイテムn番の価格に置き換えられます
 * \Sn[n] スキルn番の名前に置き換えられます
 * \Js[X]\Js XをJavaScriptとして評価した値に置き換えられます
 * 
 * その他使用可能な制御文字や、\Js[X]\Jsで使えるスクリプトについては、下記シートを参照してください。
 * https://docs.google.com/spreadsheets/d/1rOIzDuhLC6IqJPEFciYOmXWL_O7X9-hMValMs7DpWCk/
 * 
 * ■プラグインコマンド
 *
 * ===========================================================================
 * 「名前の変更」
 *  主人公の名前を変更する
 *  製作者 Alec
 *
 *  使用例
 *  名前の変更 1 ライアン　　（アクター0001の名前をライアンに変更
 *  名前の変更 2 \V[1]　　　（アクター0002の名前を変数0001の内容に変更
 *
 * ===========================================================================
 * 呼び出し元アイテム取得
 *  コモンイベントを呼び出したアイテムのIDを変数に入れる
 *  製作者 Alec
 *
 *  使用例
 *  呼び出し元アイテム取得 1　　（変数0001にコモンイベントを呼び出したアイテムIDを入れる
 *
 * ===========================================================================
 * 呼び出し元スキル取得
 *  コモンイベントを呼び出したスキルのIDを変数に入れる
 *  製作者 Alec
 *
 *  使用例
 *  呼び出し元スキル取得 1　　（変数0001にコモンイベントを呼び出したスキルIDを入れる
 *
 * ===========================================================================
 * レベルの変更
 *  アクターのレベルを変更します。増減ではなく変更後のレベルを指定できます。
 *  製作者 Alec
 *
 *  パラメータ
 *  　アクターのID（もし0なら全員）
 *    変更後のレベル
 *    レベルアップをメッセージで表示するかどうか（表示・非表示）
 *
 *  使用例
 *  レベルの変更 1 50 表示　　（アクター0001のレベルを50に変更
 *  レベルの変更 0 10 非表示　（仲間全員のレベルを10に変更、レベルアップは表示しない
 *
 * ===========================================================================
 * バイブレーション(English:Vibration)
 *  実行中のAndroid端末を振動させます。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　振動するフレーム数(1/60秒単位)
 *    振動が完了するまでウェイト(ウェイトあり or ウェイトなし)
 *    　デフォルトは「ウェイトなし」
 *
 *  使用例
 *  バイブレーション 60 ウェイトあり
 *  Vibration 120
 * ===========================================================================
 * 指定位置の通行情報取得(English:Get_Location_Pass)
 *  指定した座標のマップ通行情報を取得して、変数に格納します。
 *  製作者 トリアコンタン
 *
 *  以下の法則に従って格納されます。
 *  上方向へ通行可能：千の位が 1、上方向へ通行不可能：千の位が 0
 *  右方向へ通行可能：百の位が 1、右方向へ通行不可能：百の位が 0
 *  下方向へ通行可能：十の位が 1、下方向へ通行不可能：十の位が 0
 *  左方向へ通行可能：一の位が 1、左方向へ通行不可能：一の位が 0
 *
 *  パラメータ
 *  　結果を格納する変数の番号
 *    X座標
 *    Y座標
 *
 *  使用例
 *  指定位置の通行情報取得 1 17 13
 *  Get_Location_Pass 2 \V[1] \V[2]
 * ===========================================================================
 * 変数の初期化(English:Init_Variables)
 *  全ての変数を初期化します。（例外指定可能）
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　初期化したくない変数番号（半角スペースで区切って複数指定可能）
 *
 *  使用例
 *  変数の初期化
 *  Init_Variables 1 2 \V[3]
 * ===========================================================================
 * スイッチの初期化(English:Init_Switches)
 *  全てのスイッチを初期化します。（例外指定可能）
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　初期化したくないスイッチ番号（半角スペースで区切って複数指定可能）
 *
 *  使用例
 *  スイッチの初期化
 *  Init_Switches 1 2 \V[3]
 * ===========================================================================
 * セルフスイッチの初期化(English:Init_Self_Switch)
 *  全てのセルフスイッチを初期化します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　なし
 *
 *  使用例
 *  セルフスイッチの初期化
 *  Init_Self_Switch
 * ===========================================================================
 * セルフスイッチの遠隔操作(English:Remote_Control_Self_Switch)
 *  マップID、イベントID、種別（A, B, C, D）を指定してセルフスイッチを操作します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　マップID
 *  　イベントID
 *  　種別（A, B, C, D）
 *  　設定値（ON or OFF）
 *
 *  使用例
 *  セルフスイッチの遠隔操作 1 3 A ON
 *  Remote_Control_Self_Switch 1 3 D OFF
 * ===========================================================================
 * ピクチャの読み込み(English:Load_Picture)
 *  指定したファイル名のピクチャを事前に読み込んでキャッシュに保存します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ファイル名（拡張子は指定しないでください）
 *
 *  使用例
 *  ピクチャの読み込み filename
 *  Load_Picture filename
 * ===========================================================================
 * 戦闘アニメの読み込み(English:Load_Animation)
 *  指定したファイル名の戦闘アニメを事前に読み込んでキャッシュに保存します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ファイル名（拡張子は指定しないでください）
 *  　色相（0-360）
 *
 *  使用例
 *  戦闘アニメの読み込み filename
 *  Load_Animation filename
 * ===========================================================================
 * シャットダウン(English:Shutdown)
 *  ゲームウィンドウを閉じて強制終了します。
 *  この操作はブラウザ実行、スマホ実行では無効です。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　なし
 *
 *  使用例
 *  シャットダウン
 *  Shutdown
 * ===========================================================================
 * ウェブサイト起動(English:Startup_Website)
 *  既定のブラウザもしくは起動中のブラウザで、指定されたURLのウェブサイトを起動します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　表示したいサイトのURL
 *
 *  使用例
 *  ウェブサイト起動 https://www.google.co.jp/
 *  Startup_Website https://www.google.co.jp/
 * ===========================================================================
 * 変数の操作(English:ControlVariable)
 * 指定の変数の値を操作(代入、加算、減算、乗算、除算、剰余)します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * プラグインコマンドで[変数の操作]もしくは[ControlVariable]か[ConVar]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：操作する変数
 *  引数2：操作する内容   [代入：=  加算:+=  減算：-=  乗算：*=  除算：/=  剰余：%=]
 *                                                  or
 *                        [代入：set  加算:add  減算：sub  乗算：mult  除算：div  剰余：mod]
 *  引数3：操作用の値
 *  引数4：値の型(省略可) [数字優先(省略値)：0  文字優先:1]
 *
 * 使用例：
 *   変数の操作 #0001 += \V[2]         //変数1に変数2の値を加算
 *   変数の操作 \V[2] = \V[3]          //変数2の値と同番号の変数に変数3の値を代入
 *   変数の操作 1 mod \V[2]            //変数1を変数2の値で除算した余りを代入
 *   変数の操作 1 = \In[\V[2]]         //変数1に変数2のアイテム番号の名前を代入
 *   変数の操作 #0001 = 10 1           //変数1に'10'(文字)を代入
 *   変数の操作 5 = \Js[$dataMap.note] //変数5に個別マップのメモを代入
 *   ControlVariable 1 += 2            //変数1に2を加算
 *   ConVar 1 mult \V[5]               //変数1を変数5の値で乗算
 *
 * ===========================================================================
 * タッチ座標の取得(English:Get_Touch_Info)
 *  タッチ位置のX座標とY座標を指定された変数に格納します。
 *  画面上の実座標とマップ上のタイル座標の二種類が取得できます。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　X座標が格納される変数の番号（1-5000）
 *  　Y座標が格納される変数の番号（1-5000）
 *  　取得タイプ（画面座標 or マップ座標）※指定しない場合は画面座標
 *
 *  使用例
 *  タッチ座標の取得 1 2
 *  Get_Touch_Info \V[1] \V[2] マップ座標
 * ===========================================================================
 * マップタッチ禁止の変更(English:Change_Map_Touch)
 *  マップタッチによるプレイヤーの移動禁止を変更します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　設定値（禁止 or 許可）
 *
 *  使用例
 *  マップタッチ禁止の変更 禁止
 *  Change_Map_Touch 許可
 * ===========================================================================
 * マップタッチ移動中判定(English:Get_Map_Touch_Moving)
 *  マップタッチによるプレイヤーの移動中かどうかを
 *  指定されたスイッチに格納します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　結果が格納されるスイッチの番号（1-5000）
 *
 *  使用例
 *  マップタッチ移動中判定 1
 *  Get_Map_Touch_Moving \V[1]
 * ===========================================================================
 * マップタッチ移動(English:Map_Touch_Move)
 *  マップをタッチしたのと同じ要領で指定位置にプレイヤーを移動します。
 *  障害物やキー入力により移動は中断されます。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　移動先X座標
 *  　移動先Y座標
 *
 *  使用例
 *  マップタッチ移動 17 13
 *  Map_Touch_Move \V[1] \V[2]
 * ===========================================================================
 * ピクチャの移動(English:Move_Picture)
 *  イベントコマンド「ピクチャの移動」と同じ動作をします。
 *  それぞれのパラメータを制御文字で変数指定できるのが特徴で減算合成も可能です。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ピクチャ番号（1-100）
 *  　原点（左上 or 中央）
 *  　移動先X座標
 *  　移動先Y座標
 *  　X方向拡大率（マイナス値で画像反転）
 *  　Y方向拡大率（マイナス値で画像反転）
 *  　不透明度（0-255）
 *  　合成方法（通常 or 加算 or 減算）
 *  　移動フレーム数
 *  　移動完了までウェイト（指定する場合「ウェイトあり」）
 *
 *  使用例
 *  ピクチャの移動 1 左上 300 200 200 200 128 減算 240 ウェイトあり
 *  Move_Picture \V[1] 中央 \V[2] \V[3] \V[4] \V[5] \V[6] 減算 \V[7]
 * ===========================================================================
 * 数値入力範囲の設定(English:Set_Input_Num_Range)
 *  イベントコマンド「数値入力の処理」で入力可能な値の最小値と最大値を設定します。
 *  入力可能桁数と併せて考慮されます。
 *  この設定は解除忘れ防止のため、数値入力の処理を終えた時点で初期化されます。
 *
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　入力可能最小値（0-99999999）
 *  　入力可能最大値（0-99999999）
 *
 *  使用例
 *  数値入力範囲の設定 0 500
 *  Set_Input_Num_Range \V[1] \V[2]
 * ===========================================================================
 * 数値入力ウィンドウの設定(English:Set_Num_Input_Window)
 *  イベントコマンド「数値入力の処理」で表示されるウィンドウの背景と位置を設定します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　背景（ウィンドウ or 暗くする or 透明）
 *  　位置（左 or 中 or 右）
 *
 *  使用例
 *  数値入力ウィンドウの設定 ウィンドウ 左
 *  Set_Num_Input_Window 暗くする 中
 * ===========================================================================
 * 数値入力有効桁の設定(English:Set_Num_Input_Valid_Digit)
 *  イベントコマンド「数値入力の処理」で入力可能な有効桁を設定します。
 *  有効桁より小さい桁は変更できなくなります。(1桁目を0で固定したい場合などに使用)
 *  1を指定すると通常通り、全ての桁を入力できます。
 *  この設定は解除忘れ防止のため、数値入力の処理を終えた時点で初期化されます。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　有効桁（1-8）
 *
 *  使用例
 *  数値入力有効桁の設定 2
 *  Set_Num_Input_Valid_Digit \v[1]
 * ===========================================================================
 * ピクチャの有効判定(English:Get_Picture_Valid)
 *  指定された番号のピクチャが現在、使われているかを判定して結果をスイッチに格納します。
 *  「ピクチャの表示」で使用状態になり、「ピクチャの消去」で非使用状態になります。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　結果が格納されるスイッチの番号（1-5000）
 *  　ピクチャ番号（1-100）
 *
 *  使用例
 *  ピクチャの有効判定 2 1
 *  Get_Picture_Valid \v[1] \v[2]
 * ===========================================================================
 * ピクチャの表示優先度設定(English:Set_Picture_Priority)
 *  指定した番号のピクチャの表示優先度を設定します。表示優先度の高いピクチャほど
 *  画面の前面に表示されます。この設定はピクチャ番号よりも優先されます。
 *  デフォルト値は100です。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ピクチャ番号（1-100）
 *  　表示優先度の値（デフォルト100）
 *
 *  使用例
 *  ピクチャの表示優先度設定 1 101
 *  Set_Picture_Priority \v[1] \v[2]
 * ===========================================================================
 * ピクチャの表示優先度設定(English:Set_Picture_Priority)
 *  指定した番号のピクチャの表示優先度を設定します。表示優先度の高いピクチャほど
 *  画面の前面に表示されます。この設定はピクチャ番号よりも優先されます。
 *  デフォルト値は100です。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ピクチャ番号（1-100）
 *  　表示優先度の値（デフォルト100）
 *
 *  使用例
 *  ピクチャの表示優先度設定 1 101
 *  Set_Picture_Priority \v[1] \v[2]
 * ===========================================================================
 * ピクチャのトリミング(English:Trimming_Picture)
 *  指定した矩形（X座標、Y座標、横幅、高さ）でピクチャを切り出します。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ピクチャ番号（1-100）
 *  　X座標
 *  　Y座標
 *  　横幅
 *  　高さ
 *
 *  使用例
 *  ピクチャのトリミング 1 0 0 320 240
 *  Trimming_Picture \v[1] \v[2] \v[3] \v[4] \v[5]
 * ===========================================================================
 * ピクチャの回転角設定(English:Angle_Picture)
 *  指定した角度で時計回りにピクチャを回転させます。
 *  「ピクチャの回転」とは異なり回転させた状態のまま保たれます。
 *  製作者 トリアコンタン
 *
 *  パラメータ
 *  　ピクチャ番号（1-100）
 *  　回転角（0-360）
 *
 *  使用例
 *  ピクチャの回転角設定 1 90
 *  Trimming_Picture \v[1] \v[2]
 * * ===========================================================================
 * 文字の連結(English：ConcatenStrings)
 * 文字を連結し、指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字の連結]もしくは[ConcatenStrings]か[CatStr]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：連結する文字1
 *  引数3：連結する文字2
 *  引数4：結果が数値として評価できる場合(省略可)
 *         [0:文字として評価(省略値)  1：数値として評価]
 * 使用例
 *  文字の連結 1 /N[1] は天才！ //ハロルドは天才！
 *  文字の連結 #0001 \JS[$dataMapInfos[1].name]\JS は綺麗 //王都は綺麗
 *  ConcatenStrings 1 TEST OK //TESTOK
 *  CatStr 1 2 1 1 // 21(数値)
 * ===========================================================================
 * 文字の置換(English：ReplaceStrings)
 * 文字を置換し、指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * 特殊文字\と置き換えることにより、指定文字の削除も可能です。
 * プラグインコマンドで[文字の置換]もしくは[ReplaceStrings]か[RepStr]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：置換対象の文字列
 *  引数3：置換前文字
 *  引数4：置換後文字
 *  引数5：置換方法(省略可) [前方 後方 全て(省略値)]
 *                                 or
 *                          [front back all(省略値)]
 * 使用例
 *  文字列の置換 1 ハロルドかっこいいよハロルド ハ Ｈ 全て //ＨロルドかっこいいよＨロルド
 *  文字列の置換 1 \V[1] ハロルド \ 全て //変数1の文字列からハロルドを取り除く
 *  ReplaceStrings 1 ハロルドとハロルドがお見合い ハ Ｈ Front //Ｈロルドとハロルドがお見合い
 *  RepStr 1 ハロルドとハロルドがお見合い ハロルド Ｔレーゼ Back //ハロルドとＴレーゼがお見合い
 * ===========================================================================
 * 文字の切取(English：CutString)
 * 文字を切り取って指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字の切取]もしくは[CutStrings]か[CutStr]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：対象の文字列
 *  引数3：開始位置
 *  引数4：終了位置(End か 最後 の指定で最後まで切り取り)
 *  引数5：開始方向(省略可)[前方(省略値)  後方]
 *                                 or
 *                         [front(省略値) back]
 * 使用例
 *  文字の切取 1 \JS[$dataMap.note]\JS 1 10 前方
 *  文字の切取 1 \JS[$dataMap.note]\JS 10 最後 後方
 *  CutStrings 1 \[V] 2 end back
 *  CutStr 1 \[V] 2 
 * ===========================================================================
 * 文字一致カウント(English：CountMatchString)
 * 文字列内で特定の文字に一致した数をカウントし指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字一致カウント]もしくは[CountMatchString]か[CntStr]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：対象の文字列
 *  引数3：検索する文字
 *  引数4：比較方法[0:一致したら一致下部分から先を比較(省略値) 1:1文字ずつ比較]
 * 使用例
 *  文字一致カウント 1 あああああ ああ 0 //2文字一致
 *  文字一致カウント 1 あああああ ああ 1 //4文字一致
 *  CountMatchString 1 \[V] OK
 *  CntStr 1 \N[1] Ｈロルド 0
 * ===========================================================================
 * 文字の検索(English：CountMatchString)
 * 文字列内で特定の文字を検索し、最初に一致した位置を指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字の検索]もしくは[SearchString]か[SchStr]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：対象の文字列
 *  引数3：検索する文字
 *  引数4：開始方向(省略可)[前方(省略値)  後方]
 *                                 or
 *                         [front(省略値) back]
 * 使用例
 *  文字の探索 1 あああああ ああ 前方
 *  SearchString 1 \[V] test back
 *  SchStr 1 \N[1] Ｈロルド
 * ===========================================================================
 * 文字数カウント(English：CountStringlength)
 * 文字数をカウントし指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字数カウント]もしくは[CountStringlength]か[CntLen]を記述して使用します。
 * 
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：対象の文字列
 * 
 * 使用例
 *  文字数カウント 1 \N[1]
 *  CountStringlength 1 hahaha
 *  CntLen 1 
 * ===========================================================================
 * 文字の反転(English：ReverseString)
 * 対象の文字列を逆転させ、指定の変数に代入します。
 * 変数の指定について、イベントエディタのコマンドと同じ#0001なども使用できます。
 * もちろん\[V]や\JS[X]\JSなどの制御文字も使用可能です。
 * プラグインコマンドで[文字の反転]もしくは[ReverseString]か[RevStr]を記述して使用します。
 * パラメータ：
 *  引数1：結果を代入する変数
 *  引数2：対象の文字列
 * 使用例
 *  文字の反転 1 \N[1]
 *  ReverseString 1 逆読みできるかな？
 *  RevStr 1 できると思うよ？
 * ===========================================================================
 * 強制セーブ(English：Force_Save)
 *  セーブ画面を介さずに強制的に状態をセーブします。
 *  更新されるセーブファイルは、最後にセーブ or ロードしたファイルになります。
 *  ニューゲームから直接セーブした場合は空きを探しますが、空きがなければ
 *  もっとも古いファイルを上書きします。
 * パラメータ：
 *  なし
 * 使用例
 *  強制セーブ
 *  Force_Save
 * ===========================================================================
 * 指定位置にアニメーション表示(English：Show_Animation)
 *  画面上の座標を指定してアニメーションを再生します。
 * パラメータ：
 *  引数1：X座標
 *  引数2：Y座標
 *  引数3：アニメーションID
 *  引数4：ウェイトフラグ（指定する場合「ウェイトあり」）
 * 使用例
 *  指定位置にアニメーション表示 320 240 1 ウェイトあり
 *  Show_Animation \v[1] \v[2] 1
 * ===========================================================================
 * 指定位置にループアニメーション表示(English：Show_Loop_Animation)
 *  画面上の座標を指定してアニメーションを再生します。
 *  消去するか新たなアニメーションを指定するまでループ再生されます。
 * パラメータ：
 *  引数1：X座標
 *  引数2：Y座標
 *  引数3：アニメーションID
 * 使用例
 *  指定位置にループアニメーション表示 320 240 1
 *  Show_Loop_Animation \v[1] \v[2] 1
 * ===========================================================================
 * ループアニメーション消去(English：Erase_Loop_Animation)
 *  ループ再生しているアニメーションを消去します。
 * パラメータ：
 *  なし
 * 使用例
 *  ループアニメーション消去
 *  Erase_Loop_Animation
 * ===========================================================================
 */

(function() {
    'use strict';

    //制御文字の拡張
    Game_Interpreter.prototype.pluginCommandBook_unescape = function(text) {
        //全角数字を半角数字に変換する
        var wstringToString    = function(text) {
            text = text.replace(/[０-９]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
            });
            return text;
        };
        var getActorName       = function(n) {
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        };
        var getPartyMemberName = function(n) {
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        };
        var prevText           = "";
        text                   = text.replace(/\\/g, '\x1b');
        while (prevText != text) {
            prevText = text;
            text     = text.replace(/\x1b\x1b/g, '\\');
            text     = text.replace(/\x1bV\[([０-９\d]+)\]/gi, function() {
                return $gameVariables.value(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text     = text.replace(/\x1bN\[([０-９\d]+)\]/gi, function() {
                return getActorName(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text     = text.replace(/\x1bP\[([０-９\d]+)\]/gi, function() {
                return getPartyMemberName(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text     = text.replace(/\x1bG/gi, TextManager.currencyUnit);
            text     = text.replace(/\x1bIn\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNi\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bIp\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].price;
            }.bind(this));
            text     = text.replace(/\x1bPi\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].price;
            }.bind(this));
            text     = text.replace(/\x1bSn\[([０-９\d]+)\]/gi, function() {
                return $dataSkills[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNs\[([０-９\d]+)\]/gi, function() {
                return $dataSkills[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNc\[([０-９\d]+)\]/gi, function() {
                return $dataClasses[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNt\[([０-９\d]+)\]/gi, function() {
                return $dataStates[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNw\[([０-９\d]+)\]/gi, function() {
                return $dataWeapons[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bNa\[([０-９\d]+)\]/gi, function() {
                return $dataArmors[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text     = text.replace(/\x1bJs\[(.*)\]\x1bJs/gi, function() {
                try {
                    var value = eval(arguments[1]);
                    if (value != null) {return value} else {
                        console.log('制御文字 \\JS のパラメータでエラー  詳細：評価値が無い(null or undefined)');
                        return 0;
                    }
                } catch (ex) {
                    console.log('制御文字 \\JS のパラメータでエラー  詳細： ' + ex.toString());
                    return 0;
                }
            }.bind(this));
        }
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    /**
     * 厳密な数値チェックを行います。引数が数値でなければ例外を発生されます。
     * プラグインコマンド集では、例外が発生してもその場でゲームは中断されず
     * 実行したコマンドのみが無効になり、さらにテストプレーなら自動でデベロッパツールが起動します。
     *
     * @method parseIntStrict
     * @param {Number} value
     * @param {String} errorMessage
     * @type Number
     * @return {Number} 数値に変換した結果
     */
    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    var parameters = PluginManager.parameters('TkoolMV_PluginCommandBook');

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command.length == 0) {
            return;
        }

        // コマンドの実行
        this.executePluginCommand(command, args);
    };

    Game_Interpreter.prototype.executePluginCommand = function(command, args) {
        var methodName = 'pluginCommandBook_' + command;
        if (typeof this[methodName] === 'function') {
            // 引数パラメータの制御文字での変換
            for (var i = 0; i < args.length; i++) {
                args[i] = Game_Interpreter.prototype.pluginCommandBook_unescape(args[i]);
            }
            try {
                this[methodName](args);
            } catch (e) {
                if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                    var window = require('nw.gui').Window.get();
                    if (!window.isDevToolsOpen()) {
                        var devTool = window.showDevTools();
                        devTool.moveTo(0, 0);
                        devTool.resizeTo(Graphics.width, Graphics.height);
                        window.focus();
                    }
                }
                console.log('プラグインコマンドの実行中にエラーが発生しました。');
                console.log('- コマンド名 　: ' + command);
                console.log('- コマンド引数 : ' + args);
                console.log('- エラー原因   : ' + e.toString());
            }
        }
    };

    /**
     * 名前の変更
     *  主人公の名前を変更する
     *  製作者 Alec
     *
     *  使用例
     *  名前の変更 1 ライアン　　（アクター0001の名前をライアンに変更
     *  名前の変更 2 \V[1]　　　（アクター0002の名前を変数0001の内容に変更
     */
    Game_Interpreter.prototype.pluginCommandBook_名前の変更 = function(args) {
        var actorId = args[0]; // アクターID
        var name    = args[1]; // 名前
        $gameActors.actor(actorId).setName(name);
    };

    /**
     * 呼び出し元アイテム取得
     *  コモンイベントを呼び出したアイテムのIDを変数に入れる
     *  製作者 Alec
     *
     *  使用例
     *  呼び出し元アイテム取得 1　　（変数0001にコモンイベントを呼び出したアイテムIDを入れる
     */
    Game_Interpreter.prototype.pluginCommandBook_呼び出し元アイテム取得 = function(args) {
        var varId = parseInt(args[0]); // 変数ID

        // アイテムを使ってなかったら
        if (!$gameParty.lastItem()) {
            return;
        }
        $gameVariables.setValue(varId, $gameParty.lastItem().id);
    };

    /**
     * 呼び出し元スキル取得
     *  コモンイベントを呼び出したスキルのIDを変数に入れる
     *  製作者 Alec
     *
     *  使用例
     *  呼び出し元スキル取得 1　　（変数0001にコモンイベントを呼び出したスキルIDを入れる
     */
    Game_Interpreter.prototype.pluginCommandBook_呼び出し元スキル取得 = function(args) {
        if (eval(String(parameters['呼び出し元スキルの記録を使わない'] || 'false'))) {
            window.alert("「呼び出し元スキル取得」を使うにはプラグインマネージャーから「TkoolMV_PluginCommandBook.js」の「呼び出し元スキルの記録を使わない」を「はい」してください");
            return;
        }
        var varId   = parseInt(args[0]); // 変数ID
        var skillId = 0;
        if ($gameParty.inBattle()) {
            skillId = BattleManager._subject.lastBattleSkill().id;
        } else {
            skillId = $gameParty.menuActor().lastMenuSkill().id;
        }
        $gameVariables.setValue(varId, skillId);
    };

    /**
     * レベルの変更
     *  アクターのレベルを変更します。増減ではなく変更後のレベルを指定できます。
     *  製作者 Alec
     *
     *  パラメータ
     *  　アクターのID（もし0なら全員）
     *    変更後のレベル
     *    レベルアップをメッセージで表示するかどうか（表示・非表示）
     *
     *  使用例
     *  レベルの変更 1 50 表示　　（アクター0001のレベルを50に変更
     *  レベルの変更 0 10 非表示　（仲間全員のレベルを10に変更、レベルアップは表示しない
     */
    Game_Interpreter.prototype.pluginCommandBook_レベルの変更 = function(args) {
        var actorId = parseInt(args[0], 10);
        var level   = parseInt(args[1], 10) || 1;
        var show    = {"表示": true, "非表示": false, "はい": true, "いいえ": false}[args[2] || '表示'];
        show        = show === null ? false : show;
        console.log(show);
        if (actorId == 0) {
            $gameParty.members().forEach(function(actor) {
                var exp = actor.expForLevel(level);
                actor.changeExp(exp, show);
            });
        } else {
            var actor = $gameActors.actor(actorId);
            if (!actor) {
                return;
            }
            var exp = actor.expForLevel(level);
            actor.changeExp(exp, show);
        }
    };

    Game_Interpreter.prototype.pluginCommandBook_バイブレーション  = function(args) {
        if (Utils.isMobileDevice() && typeof navigator.vibrate === 'function') {
            var frame = parseIntStrict(args[0]);
            navigator.vibrate(Math.floor(frame * 1000 / 60));
            var wait = (args[1] || '').toUpperCase();
            if (wait === 'ウェイトあり' || wait === 'WAIT') this.wait(frame);
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_Vibration = function(args) {
        this.pluginCommandBook_バイブレーション(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_指定位置の通行判定取得       = function(args) {
        var x     = parseIntStrict(args[1]);
        var y     = parseIntStrict(args[2]);
        var value = 0;
        value += $gamePlayer.isMapPassable(x, y, 8) ? 1000 : 0;
        value += $gamePlayer.isMapPassable(x, y, 6) ? 100 : 0;
        value += $gamePlayer.isMapPassable(x, y, 2) ? 10 : 0;
        value += $gamePlayer.isMapPassable(x, y, 4) ? 1 : 0;
        $gameVariables.setValue(args[0], value);
    };
    Game_Interpreter.prototype.pluginCommandBook_Get_Location_Pass = function(args) {
        this.pluginCommandBook_指定位置の通行判定取得(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_スイッチの初期化      = function(args) {
        var exceptionValues = [];
        args.forEach(function(arg) {
            arg                  = parseIntStrict(arg);
            exceptionValues[arg] = $gameSwitches.value(arg);
        });
        $gameSwitches.clear();
        args.forEach(function(arg) {
            arg = parseIntStrict(arg);
            $gameSwitches.setValue(arg, exceptionValues[arg]);
        });
    };
    Game_Interpreter.prototype.pluginCommandBook_Init_Switches = function(args) {
        this.pluginCommandBook_スイッチの初期化(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_変数の初期化         = function(args) {
        var exceptionValues = [];
        args.forEach(function(arg) {
            arg                  = parseIntStrict(arg);
            exceptionValues[arg] = $gameVariables.value(arg);
        });
        $gameVariables.clear();
        args.forEach(function(arg) {
            arg = parseIntStrict(arg);
            $gameVariables.setValue(arg, exceptionValues[arg]);
        });
    };
    Game_Interpreter.prototype.pluginCommandBook_Init_Variables = function(args) {
        this.pluginCommandBook_変数の初期化(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_セルフスイッチの初期化      = function(args) {
        $gameSelfSwitches.clear();
    };
    Game_Interpreter.prototype.pluginCommandBook_Init_Self_Switch = function(args) {
        this.pluginCommandBook_セルフスイッチの初期化(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_セルフスイッチの遠隔操作               = function(args) {
        var mapId   = Math.max(parseIntStrict(args[0]), 1);
        var eventId = Math.max(parseIntStrict(args[1]), 1);
        var type    = args[2].toUpperCase();
        var value   = args[3].toUpperCase();
        $gameSelfSwitches.setValue([mapId, eventId, type], value === 'ON');
    };
    Game_Interpreter.prototype.pluginCommandBook_Remote_Control_Self_Switch = function(args) {
        this.pluginCommandBook_セルフスイッチの遠隔操作(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャの読み込み    = function(args) {
        ImageManager.loadPicture(args[0], 0);
    };
    Game_Interpreter.prototype.pluginCommandBook_Load_Picture = function(args) {
        this.pluginCommandBook_ピクチャの読み込み();
    };

    Game_Interpreter.prototype.pluginCommandBook_戦闘アニメの読み込み     = function(args) {
        var hue = parseInt(args[1], 10).clamp(0, 360);
        ImageManager.loadAnimation(args[0], hue);
    };
    Game_Interpreter.prototype.pluginCommandBook_Load_Animation = function(args) {
        this.pluginCommandBook_戦闘アニメの読み込み(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_シャットダウン  = function(args) {
        SceneManager.terminate();
    };
    Game_Interpreter.prototype.pluginCommandBook_Shutdown = function(args) {
        this.pluginCommandBook_シャットダウン(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ウェブサイト起動        = function(args) {
        if (!Utils.isNwjs()) {
            window.open(args[0]);
            return;
        }
        var exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler "' + args[0] + '"');
                break;
            default:
                exec('open "' + args[0] + '"');
                break;
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_Startup_Website = function(args) {
        this.pluginCommandBook_ウェブサイト起動(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_変数の操作           = function(args) {
        args[0]    = args[0].replace('#', '');
        args[1]    = args[1].replace(/set/i, '=');
        args[1]    = args[1].replace(/add/i, '+=');
        args[1]    = args[1].replace(/sub/i, '-=');
        args[1]    = args[1].replace(/mult/i, '*=');
        args[1]    = args[1].replace(/div/i, '/=');
        args[1]    = args[1].replace(/mod/i, '%=');
        var VarId1 = parseIntStrict(args[0]);
        if (isFinite(args[2]) && args[3] != '1') {
            var Var1 = parseInt(args[2], 10);
        } else {
            var Var1 = args[2];
        }
        var Var2 = $gameVariables.value(VarId1);
        switch (args[1]) {
            case '=':
                $gameVariables.setValue(VarId1, Var1);
                break;
            case '+=':
                $gameVariables.setValue(VarId1, Var2 + Var1);
                break;
            case '-=':
                Var1 = parseIntStrict(Var1);
                Var2 = parseIntStrict(Var2);
                $gameVariables.setValue(VarId1, Var2 - Var1);
                break;
            case '*=':
                Var1 = parseIntStrict(Var1);
                Var2 = parseIntStrict(Var2);
                $gameVariables.setValue(VarId1, Var2 * Var1);
                break;
            case '/=':
                Var1 = parseIntStrict(Var1);
                Var2 = parseIntStrict(Var2);
                $gameVariables.setValue(VarId1, (Var2 - (Var2 % Var1)) / Var1);
                break;
            case '%=':
                Var1 = parseIntStrict(Var1);
                Var2 = parseIntStrict(Var2);
                $gameVariables.setValue(VarId1, Var2 % Var1);
                break;
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_ControlVariable = function(args) {
        this.pluginCommandBook_変数の操作(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_ConVar          = function(args) {
        this.pluginCommandBook_変数の操作(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_タッチ座標の取得       = function(args) {
        var x, y;
        if (TouchInput.isPressed()) {
            if (args[2] === 'マップ座標' || args[2] === 'Map') {
                x = $gameMap.canvasToMapX(TouchInput.x);
                y = $gameMap.canvasToMapY(TouchInput.y);
            } else {
                x = TouchInput.x;
                y = TouchInput.y;
            }
        } else {
            x = -1;
            y = -1;
        }
        $gameVariables.setValue(parseIntStrict(args[0]), x);
        $gameVariables.setValue(parseIntStrict(args[1]), y);
    };
    Game_Interpreter.prototype.pluginCommandBook_Get_Touch_Info = function(args) {
        this.pluginCommandBook_タッチ座標の取得(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_マップタッチ禁止の変更      = function(args) {
        $gameSystem._mapTouchDisable = (args[0] === '禁止' || args[0] === 'Disable');
    };
    Game_Interpreter.prototype.pluginCommandBook_Change_Map_Touch = function(args) {
        this.pluginCommandBook_マップタッチ禁止の変更(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_マップタッチ移動中判定          = function(args) {
        $gameSwitches.setValue(parseIntStrict(args[0]), $gameTemp.isDestinationValid());
    };
    Game_Interpreter.prototype.pluginCommandBook_Get_Map_Touch_Moving = function(args) {
        this.pluginCommandBook_マップタッチ移動中判定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_マップタッチ移動 = function(args) {
        $gameTemp.setDestination(parseInt(args[0], 10), parseInt(args[1], 10));
    };

    Game_Interpreter.prototype.pluginCommandBook_Map_Touch_Move = function(args) {
        this.pluginCommandBook_マップタッチ移動(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャの移動 = function(args) {
        var pictureId = parseInt(args[0], 10);
        var origin    = args[1] === '左上' || args[1] === 'Upper_Left' ? 0 : 1;
        var x         = parseIntStrict(args[2]);
        var y         = parseIntStrict(args[3]);
        var scaleX    = parseIntStrict(args[4]);
        var scaleY    = parseIntStrict(args[5]);
        var opacity   = parseIntStrict(args[6]);
        var blendMode;
        switch ((args[7] || '').toUpperCase()) {
            case '加算':
            case 'ADDITIVE':
                blendMode = 1;
                break;
            case '減算':
            case 'SUBTRACTIVE':
                blendMode = 2;
                break;
            default :
                blendMode = 0;
                break;
        }
        var duration = parseInt(args[8], 10);
        $gameScreen.movePicture(pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
        var wait = (args[9] || '').toUpperCase();
        if (wait === 'ウェイトあり' || wait === 'WAIT') this.wait(duration);
    };

    Game_Interpreter.prototype.pluginCommandBook_Move_Picture = function(args) {
        this.pluginCommandBook_ピクチャの移動(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_数値入力範囲の設定            = function(args) {
        $gameMessage.setNumInputRange(
            parseIntStrict(args[0]).clamp(0, 99999999),
            parseIntStrict(args[1]).clamp(0, 99999999));
    };
    Game_Interpreter.prototype.pluginCommandBook_Set_Input_Num_Range  = function(args) {
        this.pluginCommandBook_数値入力範囲の設定(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_数値入力ウィンドウの設定         = function(args) {
        var background;
        switch (args[0].toUpperCase()) {
            case 'ウィンドウ':
            case 'WINDOW':
                background = 0;
                break;
            case '暗くする':
            case 'DIM':
                background = 1;
                break;
            case '透明':
            case 'TRANSPARENT':
                background = 2;
                break;
            default:
                throw new Error('背景に指定した値[' + args[0] + ']が不正です。');
        }
        var position;
        switch (args[1].toUpperCase()) {
            case '左':
            case 'LEFT':
                position = 0;
                break;
            case '中':
            case 'MIDDLE':
                position = 1;
                break;
            case '右':
            case 'RIGHT':
                position = 2;
                break;
            default:
                throw new Error('位置に指定した値[' + args[1] + ']が不正です。');
        }
        $gameMessage.setNumInputBackground(background);
        $gameMessage.setNumInputPositionType(position);
    };
    Game_Interpreter.prototype.pluginCommandBook_Set_Num_Input_Window = function(args) {
        this.pluginCommandBook_数値入力ウィンドウの設定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_数値入力有効桁の設定                = function(args) {
        $gameMessage._numInputValidDigit = parseIntStrict(args[0]).clamp(1, 8);
    };
    Game_Interpreter.prototype.pluginCommandBook_Set_Num_Input_Valid_Digit = function(args) {
        this.pluginCommandBook_数値入力有効桁の設定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャの有効判定         = function(args) {
        var picture = $gameScreen.picture($gameScreen.realPictureId(parseIntStrict(args[1])));
        $gameSwitches.setValue(parseIntStrict(args[0]), picture != null);
    };
    Game_Interpreter.prototype.pluginCommandBook_Get_Picture_Valid = function(args) {
        this.pluginCommandBook_ピクチャの有効判定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャの表示優先度設定         = function(args) {
        var picture = $gameScreen.picture($gameScreen.realPictureId(parseIntStrict(args[0])));
        if (picture) {
            picture.setZ(parseIntStrict(args[1]));
        } else {
            throw new Error('指定された番号[' + args[0] + ']のピクチャは無効です。');
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_Set_Picture_Priority = function(args) {
        this.pluginCommandBook_ピクチャの表示優先度設定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャのトリミング       = function(args) {
        var picture = $gameScreen.picture($gameScreen.realPictureId(parseIntStrict(args[0])));
        if (picture) {
            picture.setFrameDirect(parseIntStrict(args[1]), parseIntStrict(args[2]),
                parseIntStrict(args[3]), parseIntStrict(args[4]));
        } else {
            throw new Error('指定された番号[' + args[0] + ']のピクチャは無効です。');
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_Trimming_Picture = function(args) {
        this.pluginCommandBook_ピクチャのトリミング(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ピクチャの回転角設定    = function(args) {
        var picture = $gameScreen.picture($gameScreen.realPictureId(parseIntStrict(args[0])));
        if (picture) {
            picture.setAngleDirect(parseIntStrict(args[1]));
        } else {
            throw new Error('指定された番号[' + args[0] + ']のピクチャは無効です。');
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_Angle_Picture = function(args) {
        this.pluginCommandBook_ピクチャの回転角設定(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字の連結           = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]) + String(args[2]);
        if (isFinite(Str) && args[3] == '1') Str = parseInt(Str, 10);
        $gameVariables.setValue(VarId1, Str);
    };
    Game_Interpreter.prototype.pluginCommandBook_ConcatenStrings = function(args) {
        this.pluginCommandBook_文字の連結(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_CatStr          = function(args) {
        this.pluginCommandBook_文字の連結(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字の置換          = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseInt(args[0], 10);
        VarId1     = parseIntStrict(VarId1);
        var Str    = String(args[1]);
        var Str2   = String(args[2]);
        var Str3   = String(args[3]);
        Str        = Str.replace(/\x1b/gi);
        Str2       = Str2.replace(/\x1b/gi);
        Str3       = Str3.replace(/\x1b/gi);
        if (args[4] == null) args[4] = '全て';
        args[4] = args[4].replace(/front/i, '前方');
        args[4] = args[4].replace(/back/i, '後方');
        args[4] = args[4].replace(/all/i, '全て');
        switch (args[4]) {
            case '前方':
                Str = Str.replace(Str2, Str3);
                break;
            case '後方':
                Str  = RvStr(Str);
                Str2 = RvStr(Str2);
                Str3 = RvStr(Str3);
                Str  = Str.replace(Str2, Str3);
                Str  = RvStr(Str);
                break;
            case '全て':
            default:
                while (Str.indexOf(Str2, 0) != -1) Str = Str.replace(Str2, Str3);
                break;
        }
        $gameVariables.setValue(VarId1, Str);
        function RvStr(st) {
            var rv = "";
            for (var i = 0, n = st.length; i < n; i++) rv += st[n - i - 1];
            return rv;
        }
    };
    Game_Interpreter.prototype.pluginCommandBook_ReplaceStrings = function(args) {
        this.pluginCommandBook_文字の置換(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_RepStr         = function(args) {
        this.pluginCommandBook_文字の置換(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字の切取            = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]);
        var Nm1    = parseIntStrict(args[2]);
        var Nm2    = args[3]
        if (Nm2.toLowerCase() == 'end' || Nm2 == '最後') Nm2 = Str.length;
        var Nm2 = parseIntStrict(Nm2);
        if (args[4] == null) args[4] = '前方';
        args[4] = args[4].replace(/front/i, '前方');
        args[4] = args[4].replace(/back/i, '後方');
        switch (args[4]) {
            case '前方':
            default:
                Str = Str.substring(Nm1 - 1, Nm1 + Nm2 - 1);
                break;
            case '後方':
                Str = Str.substring(Str.length - Nm1 + 1, Str.length - Nm1 - Nm2 + 1);
                break;
        }
        $gameVariables.setValue(VarId1, Str);
    };
    Game_Interpreter.prototype.pluginCommandBook_CutStrings       = function(args) {
        this.pluginCommandBook_文字の切取(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_CutStr           = function(args) {
        this.pluginCommandBook_文字の切取(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_文字一致カウント         = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]);
        var Str2   = String(args[2]);
        var StrCnt = 0
        var StrLen
        if (args[3] == '1') {
            StrCnt = (Str.match(new RegExp(Str2, "g")) || []).length;
        } else {
            while (Str.indexOf(Str2, 0) != -1) {
                StrCnt++
                StrLen = Str.indexOf(Str2, 0) + 1
                Str    = Str.substring(StrLen, Str.length);
            }
        }
        $gameVariables.setValue(VarId1, StrCnt);
    };
    Game_Interpreter.prototype.pluginCommandBook_CountMatchString = function(args) {
        this.pluginCommandBook_文字一致カウント(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_CntStr           = function(args) {
        this.pluginCommandBook_文字一致カウント(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字の検索        = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]);
        var Str2   = String(args[2]);
        var StrLen
        if (args[3] == null) args[4] = '前方';
        args[3] = args[3].replace(/front/i, '前方');
        args[3] = args[3].replace(/back/i, '後方');
        switch (args[3]) {
            case '前方':
            default:
                StrLen = Str.indexOf(Str2) + 1
                break;
            case '後方':
                StrLen = Str.lastIndexOf(Str2) + 1
                break;
        }
        $gameVariables.setValue(VarId1, StrLen);
    };
    Game_Interpreter.prototype.pluginCommandBook_SearchString = function(args) {
        this.pluginCommandBook_文字の検索(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_SchStr       = function(args) {
        this.pluginCommandBook_文字の検索(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字数カウント           = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]);
        var StrLen = Str.length;
        $gameVariables.setValue(VarId1, StrLen);
    };
    Game_Interpreter.prototype.pluginCommandBook_CountStringlength = function(args) {
        this.pluginCommandBook_文字数カウント(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_SchStr            = function(args) {
        this.pluginCommandBook_文字数カウント(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_文字の反転         = function(args) {
        args[0]    = args[0].replace('#', '');
        var VarId1 = parseIntStrict(args[0]);
        var Str    = String(args[1]);
        var RevStr = "";
        for (var i = 0, n = Str.length; i < n; i++) RevStr += Str[n - i - 1];
        $gameVariables.setValue(VarId1, RevStr);
    };
    Game_Interpreter.prototype.pluginCommandBook_ReverseString = function(args) {
        this.pluginCommandBook_文字の反転(args);
    };
    Game_Interpreter.prototype.pluginCommandBook_RevStr        = function(args) {
        this.pluginCommandBook_文字の反転(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_強制セーブ = function(args) {
        $gameSystem.onBeforeSave();
        if (!DataManager.saveGame(DataManager.lastAccessedSavefileId())) {
            throw new Error('！！！セーブに失敗しました。セーブファイルは消去されています。！！！');
        }
    };

    Game_Interpreter.prototype.pluginCommandBook_Force_Save = function(args) {
        this.pluginCommandBook_強制セーブ(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_指定位置にアニメーション表示 = function(args) {
        var x    = parseIntStrict(args[0]);
        var y    = parseIntStrict(args[1]);
        var id   = parseIntStrict(args[2]);
        var wait = args[3] && (args[3] === 'ウェイトあり' || args[3].toUpperCase() === 'wait');
        $gameScreen.startAnimation(x, y, id, false);
        if (wait) this.wait($dataAnimations[id].frames.length * 4);
    };

    Game_Interpreter.prototype.pluginCommandBook_Show_Animation = function(args) {
        this.pluginCommandBook_指定位置にアニメーション表示(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_指定位置にループアニメーション表示 = function(args) {
        var x  = parseIntStrict(args[0]);
        var y  = parseIntStrict(args[1]);
        var id = parseIntStrict(args[2]);
        $gameScreen.startAnimation(x, y, id, true);
    };

    Game_Interpreter.prototype.pluginCommandBook_Show_Loop_Animation = function(args) {
        this.pluginCommandBook_指定位置にループアニメーション表示(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ループアニメーション消去 = function(args) {
        $gameScreen.animationLoop = false;
    };

    Game_Interpreter.prototype.pluginCommandBook_Erase_Loop_Animation = function(args) {
        this.pluginCommandBook_ループアニメーション消去(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_バッチ実行         = function(args) {
        if (!Utils.isNwjs()) return;
        var path = require('path');
        var base = path.dirname(process.mainModule.filename);
        var exec = require('child_process').exec;
        exec(base + '/' + args[0]);
    };
    Game_Interpreter.prototype.pluginCommandBook_Execute_Batch = function(args) {
        this.pluginCommandBook_バッチ実行(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_File_Download = function(args) {
        if (!Utils.isNwjs()) return;
        var fileName     = 'TraitConditions.js';
        var url          = 'https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/' + fileName;
        var path         = require('path');
        var projectBase  = path.dirname(process.mainModule.filename);
        var downloadPath = path.join(projectBase, 'js/plugins/') + fileName;
        var childProcess = require('child_process');
        var command      = 'bitsadmin.exe /TRANSFER PLUGIN_DOWNLOAD ' + url + ' ' + downloadPath;
        console.log('ExecuteCommand : ' + command);
        childProcess.exec(command, function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (error) console.error(error);
        });
    };

    /*
     * ここからはプラグインコマンドの実装のために必要な関数などを追加する
     */
    var はい  = true;
    var いいえ = false;

    /*
     * 制御文字の拡張
     *  このプラグインで使っている制御文字の拡張を通常のウィンドウにも適用します
     *  製作者 Alec
     */
    if (eval(String(parameters['制御文字の拡張'] || 'false'))) {
        (function() {
            var Window_Base_convertEscapeCharacters       = Window_Base.prototype.convertEscapeCharacters;
            Window_Base.prototype.convertEscapeCharacters = function(text) {
                text = Game_Interpreter.prototype.pluginCommandBook_unescape(text);
                return Window_Base_convertEscapeCharacters.call(this, text);
            };
        })();
    }

    if (eval(String(parameters['スクリプトに制御文字適用'] || 'false'))) {
        (function() {
            var _Game_Interpreter_command355      = Game_Interpreter.prototype.command355;
            Game_Interpreter.prototype.command355 = function() {
                var oldParams = [], i = 0, result, index = this._index;
                oldParams.push(this._list[index].parameters[0]);
                this._list[index].parameters[0] = this.pluginCommandBook_unescape(this._list[index].parameters[0]);
                while (this._list[index + ++i].code === 655) {
                    oldParams.push(this._list[index + i].parameters[0]);
                    this._list[index + i].parameters[0] = this.pluginCommandBook_unescape(this._list[index + i].parameters[0]);
                }
                try {
                    result = _Game_Interpreter_command355.apply(this, arguments);
                } catch (e) {
                    console.log('スクリプトの実行中にエラーが発生しました。');
                    console.log('- スクリプト 　: ' + this.currentCommand().parameters[0]);
                    console.log('- エラー原因   : ' + e.toString());
                    result = true;
                }
                this._list[index].parameters[0] = oldParams.shift();
                i                               = 0;
                while (this._list[index + ++i].code === 655) {
                    this._list[index + i].parameters[0] = oldParams.shift();
                }
                return result;
            };

            var _Game_Interpreter_command111      = Game_Interpreter.prototype.command111;
            Game_Interpreter.prototype.command111 = function() {
                if (this._params[0] === 12) {
                    var oldParam    = this._params[1];
                    var result;
                    this._params[1] = this.pluginCommandBook_unescape(this._params[1]);
                    try {
                        result = _Game_Interpreter_command111.apply(this, arguments);
                    } catch (e) {
                        console.log('スクリプトの実行中にエラーが発生しました。');
                        console.log('- スクリプト 　: ' + this._params[1]);
                        console.log('- エラー原因   : ' + e.toString());
                        result = true;
                    }
                    this._params[1] = oldParam;
                } else {
                    result = _Game_Interpreter_command111.apply(this, arguments);
                }
                return result;
            };

            var _Game_Character_processMoveCommand      = Game_Character.prototype.processMoveCommand;
            Game_Character.prototype.processMoveCommand = function(command) {
                if (command.code === Game_Character.ROUTE_SCRIPT) {
                    var oldParam          = command.parameters[0];
                    command.parameters[0] = Game_Interpreter.prototype.pluginCommandBook_unescape(command.parameters[0]);
                    try {
                        _Game_Character_processMoveCommand.apply(this, arguments);
                    } catch (e) {
                        console.log('スクリプトの実行中にエラーが発生しました。');
                        console.log('- スクリプト 　: ' + command.parameters[0]);
                        console.log('- エラー原因   : ' + e.toString());
                    }
                    command.parameters[0] = oldParam;
                } else {
                    _Game_Character_processMoveCommand.apply(this, arguments);
                }
            };
        })();
    }

    //=============================================================================
    // Gameクラス定義領域
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._mapTouchDisable = false;
    };

    var _Game_Message_initialize      = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.call(this);
        this._numInputBackground   = 0;
        this._numInputPositionType = 1;
        this._numInputValidDigit   = 1;
        this.clearNumInputRange();
    };

    Game_Message.prototype.clearNumInputRange = function() {
        this._numInputMaxValue   = Infinity;
        this._numInputMinValue   = -Infinity;
        this._numInputValidDigit = 1;
    };

    Game_Message.prototype.setNumInputRange = function(min, max) {
        this._numInputMaxValue = max;
        this._numInputMinValue = min;
    };

    Game_Message.prototype.setNumInputBackground = function(background) {
        this._numInputBackground = background;
    };

    Game_Message.prototype.setNumInputPositionType = function(positionType) {
        this._numInputPositionType = positionType;
    };

    Game_Message.prototype.numInputBackground = function() {
        return this._numInputBackground;
    };

    Game_Message.prototype.numInputPositionType = function() {
        return this._numInputPositionType;
    };

    var _Game_Screen_clear      = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearAnimation();
    };

    Game_Screen.prototype.startAnimation = function(x, y, id, loop) {
        this._animationContainerX = x;
        this._animationContainerY = y;
        this._animationId         = id;
        this._animationLoop       = loop;
    };

    Game_Screen.prototype.clearAnimation = function() {
        this._animationContainerX = 0;
        this._animationContainerY = 0;
        this._animationId         = 0;
    };

    Object.defineProperty(Game_Screen.prototype, 'animationContainerX', {
        get         : function() {
            return this._animationContainerX;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationContainerY', {
        get         : function() {
            return this._animationContainerY;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationId', {
        get         : function() {
            return this._animationId;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationLoop', {
        get         : function() {
            return this._animationLoop;
        },
        set         : function(value) {
            this._animationLoop = value;
        },
        configurable: false
    });

    var _Game_Screen_clearPictures      = Game_Screen.prototype.clearPictures;
    Game_Screen.prototype.clearPictures = function() {
        _Game_Screen_clearPictures.apply(this, arguments);
        this.needsSortPictures = false;
    };

    var _Game_Picture_initBasic      = Game_Picture.prototype.initBasic;
    Game_Picture.prototype.initBasic = function() {
        _Game_Picture_initBasic.apply(this, arguments);
        this._frameX      = 0;
        this._frameY      = 0;
        this._frameWidth  = 0;
        this._frameHeight = 0;
        this.z            = 100;
    };

    Game_Picture.prototype.setZ = function(value) {
        this.z = value;
    };

    Game_Picture.prototype.setFrameDirect = function(x, y, width, height) {
        this._frameX      = x;
        this._frameY      = y;
        this._frameWidth  = width;
        this._frameHeight = height;
    };

    Game_Picture.prototype.isValidFrame = function() {
        return this._frameX + this._frameY + this._frameWidth + this._frameHeight > 0;
    };

    Game_Picture.prototype.setAngleDirect = function(value) {
        this._rotationSpeed = 0;
        this._angle         = value % 360;
    };

    //=============================================================================
    // Sceneクラス定義領域
    //=============================================================================
    var _Scene_Map_isMapTouchOk      = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return (!$gameSystem._mapTouchDisable || $gameTemp.isDestinationValid()) && _Scene_Map_isMapTouchOk.call(this);
    };

    //=============================================================================
    // Windowクラス定義領域
    //=============================================================================
    var _Window_NumberInput_refresh      = Window_NumberInput.prototype.refresh;
    Window_NumberInput.prototype.refresh = function() {
        if (this._number != null) this._number = this._number.clamp(
            $gameMessage._numInputMinValue, $gameMessage._numInputMaxValue);
        _Window_NumberInput_refresh.apply(this, arguments);
    };

    var _Window_NumberInput_start      = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.apply(this, arguments);
        this.updateBackground();
    };

    var _Window_NumberInput_processOk      = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function() {
        _Window_NumberInput_processOk.apply(this, arguments);
        $gameMessage.clearNumInputRange();
    };

    var _Window_NumberInput_updatePlacement      = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        var positionType = $gameMessage.numInputPositionType();
        this.width       = this.windowWidth();
        switch (positionType) {
            case 0:
                this.x = 0;
                break;
            case 1:
                this.x = (Graphics.boxWidth - this.width) / 2;
                break;
            case 2:
                this.x = Graphics.boxWidth - this.width;
                break;
        }
    };

    var _Window_NumberInput_changeDigit      = Window_NumberInput.prototype.changeDigit;
    Window_NumberInput.prototype.changeDigit = function(up) {
        if (this.maxItems() - this.index() < $gameMessage._numInputValidDigit) {
            return;
        }
        _Window_NumberInput_changeDigit.apply(this, arguments);
    };

    Window_NumberInput.prototype.updateBackground = function() {
        this._background = $gameMessage.numInputBackground();
        this.setBackgroundType(this._background);
    };

    //=============================================================================
    // Spriteクラス定義領域
    //=============================================================================
    var _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.apply(this, arguments);
        this.z = 100;
    };

    var _Sprite_Picture_update      = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (this.visible) {
            var newZ = this.picture().z;
            if (newZ !== undefined && newZ !== this.z) {
                this.z                        = newZ;
                $gameScreen.needsSortPictures = true;
            }
            this.updateFrame();
        }
    };

    Sprite_Picture.prototype.updateFrame = function() {
        if (this.picture().isValidFrame()) {
            var p = this.picture();
            this.setFrame(p._frameX, p._frameY, p._frameWidth, p._frameHeight);
        }
    };

    var _Spriteset_Map_createUpperLayer      = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        _Spriteset_Map_createUpperLayer.apply(this, arguments);
        this.createAnimationContainer();
    };

    var _Spriteset_Battle_createUpperLayer      = Spriteset_Battle.prototype.createUpperLayer;
    Spriteset_Battle.prototype.createUpperLayer = function() {
        _Spriteset_Battle_createUpperLayer.apply(this, arguments);
        this.createAnimationContainer();
    };

    Spriteset_Base.prototype.createAnimationContainer = function() {
        this._animationContainer = new Sprite_Base();
        this._animationId        = 0;
        this.addChild(this._animationContainer);
    };

    var _Spriteset_Base_update      = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.call(this);
        if ($gameScreen.needsSortPictures) {
            this.sortPictures();
            $gameScreen.needsSortPictures = false;
        }
        this.updateAnimationContainer();
    };

    Spriteset_Base.prototype.updateAnimationContainer = function() {
        var id = $gameScreen.animationId;
        if (id > 0 && id < $dataAnimations.length) {
            this._animationContainer.x = $gameScreen.animationContainerX;
            this._animationContainer.y = $gameScreen.animationContainerY;
            this._animationContainer.startAnimation($dataAnimations[id], false, 0);
            this._animationId = id;
            $gameScreen.clearAnimation();
        }
        if (!this._animationContainer.isAnimationPlaying() && this._animationId > 0) {
            if ($gameScreen.animationLoop) {
                this._animationContainer.startAnimation($dataAnimations[this._animationId], false, 0);
            } else {
                this._animationId = 0;
            }
        }
    };

    Spriteset_Base.prototype.sortPictures = function() {
        this._pictureContainer.children.sort(this._comparePictureChildOrder.bind(this));
    };

    Spriteset_Base.prototype._comparePictureChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else {
            return a._pictureId - b._pictureId;
        }
    };

})();
