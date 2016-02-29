##更新履歴（全件） Update record all

###2016/02/15 : 起動オプション無効化プラグイン[SetupOptionInvalid.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SetupOptionInvalid.js)を追加しました。  
1. ブラウザ上で指定可能なMVの起動オプション（URLクエリパラメータ）を無効化します。  

###2016/02/14 : 時刻と天候プラグイン[Chronus.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/Chronus.js)を修正しました。  
1. アナログ時計を表示する機能を追加しました。  
2. 現実の時間をゲーム内に反映させる機能を追加しました。  

###2016/02/14 : 起動オプション調整プラグイン[SetupOptionCustomize.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SetupOptionCustomize.js)を追加しました。  
1. MVの起動オプション（URLクエリパラメータ）を制作者側で制御できます。  

###2016/02/14 : Web実行のテストプレー防止プラグイン[BugFixWebPlayTest.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixWebPlayTest.js)を追加しました。  
1. Web実行時にURLに?testと入力して実行することで誰でもテストプレーできてしまう問題を修正。  

###2016/02/13 : 戦闘中顔グラフィック表示プラグイン[BattleActorFaceVisibility.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BattleActorFaceVisibility.js)を修正しました。  
1. 他のプラグインと併用できるように、ウィンドウの表示位置を調整する機能を追加。  

###2016/02/13 : フキダシウィンドウプラグイン[MessageWindowPopup.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageWindowPopup.js)を修正しました。  
1. 並列処理のイベントが存在するときにポップアップ設定がクリアされてしまう問題の修正。  
2. ウィンドウの表示位置を下に表示できる設定を追加。  

###2016/02/11 : ステート自動付与プラグイン[AutomaticState.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/AutomaticState.js)を追加しました。  
1. 条件を満たしている間、指定したステートを付与します。  

###2016/02/07 : ステート解除時の変化プラグイン[StateChangeIfRemove.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/StateChangeIfRemove.js)を追加しました。  
1. ステート解除条件を満たしたときに自動的に別のステートに差し替えます。  

###2016/02/07 : ピクチャのアニメーションプラグイン[PictureAnimation.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureAnimation.js)を更新しました。  
1. 戦闘画面でもピクチャのアニメーションが出来るように修正しました。  

###2016/02/05 : 画像ロード遅延時のエラー修正プラグイン[BugFixImageOnLoad.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixImageOnLoad.js)を追加しました。  
1. 「ピクチャの表示」→「ウェイト（1フレーム）」→「ピクチャの消去」で発生するエラーの対応です。  

###2016/02/03 : バッチ処理プラグイン[BatchProcessManager.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BatchProcessManager.js)を追加しました。  
1. プラグインコマンドから実行する各種バッチ処理を提供します。必要に応じて他のプラグインと併用してください。  

###2016/02/03 : サウンドテストプラグイン[SceneSoundTest.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SceneSoundTest.js)を追加しました。  
1. ゲーム中のBGMを視聴できるサウンドテストを実装します。  

###2016/01/29 : フキダシウィンドウプラグイン[MessageWindowPopup.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageWindowPopup.js)を追加しました。  
1. メッセージウィンドウを指定したキャラクターの頭上にフキダシで表示するよう変更します。  

###2016/01/28 : 動的文字列ピクチャ生成プラグイン[DTextPicture.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DTextPicture.js)を修正しました。  
1. 複数行表示に対応  
2. 文字列の揃えと背景色を設定する機能を追加  
3. 変数をゼロ埋めして表示する機能を追加  

###2016/01/24 : ピクチャのボタン化プラグイン[PictureCallCommon.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureCallCommon.js)を追加しました。  
1. ピクチャをなでなでする機能を追加  
2. トリガーにマウスムーブを追加  
3. ピクチャが回転しているときに正しく位置を補足できるよう修正  

###2016/01/24 : セーブファイル復元プラグイン[RestoreSaveData.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/RestoreSaveData.js)を追加しました。  
1. 新たに任意のプラグインを導入した際に元のセーブデータがロードできなくなったとき、このプラグインを適用すればロードできるかもしれません。  

###2016/01/23 : 選択肢のピクチャ表示プラグイン[MessageSelectPicture.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageSelectPicture.js)を追加しました。  
1. イベントコマンド「選択肢の表示」で選択肢にカーソルを合わせた際に選択肢に対応するピクチャを表示するようにします。  

###2016/01/20 : 割り込みコモンイベントプラグイン[CommonInterceptor.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CommonInterceptor.js)を追加しました。  
1. 指定したタイミングでコモンイベントを呼び出します。ニューゲーム時、ロード完了時、メニュー終了時が対象です。  

###2016/01/18 : オプション任意項目作成プラグイン[CustomizeConfigItem.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CustomizeConfigItem.js)を追加しました。  
1. オプション画面に任意の項目を追加します。スイッチ項目、数値項目、音量項目、文字項目を自由に追加し、値を変数に同期させます。  

###2016/01/17 : メッセージスキッププラグイン[MessageSkip.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageSkip.js)を追加しました。  
1. メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。  

###2016/01/16 : 動的ウィンドウプラグイン[DWindow.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DWindow.js)を更新しました。  
1. ウィンドウをピクチャより前面に表示できる設定を追加しました。  

###2016/01/16 : ピクチャのアニメーションプラグイン[PictureAnimation.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureAnimation.js)を更新しました。  
1. 同一のファイル名のピクチャの表示→アニメーション準備→ピクチャの表示（同一ファイル名）で指定するとエラーになる現象を修正しました。  

###2016/01/14 : ピクチャのボタン化プラグイン[PictureCallCommon.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureCallCommon.js)を更新しました。  
1. トリガーにホイールクリックやダブルクリックなどを追加しました。全部で10種類のトリガーから選択できます。

###2016/01/13 : リージョンへのタイル属性付与プラグイン[RegionTerrain.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/RegionTerrain.js)を追加しました。  
1. パラメータに指定したリージョンにタイル属性（梯子、茂み、カウンター、ダメージ床）を付与します。  

###2016/01/12 : マップ高速化プラグイン[MapRapid.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MapRapid.js)を更新しました。  
1. フェードイン、フェードアウトを即時実行する機能を追加  
2. プラグイン全体をテストプレーでのみ有効にする機能を追加  

###2016/01/11 : キャラクター表示拡張プラグイン[CharacterGraphicExtend.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js)を更新しました。  
1. キャラクターに回転角を設定できる機能を追加  
2. 移動ルートの指定のスクリプトから、回転角、拡大率、位置調整ができる機能を追加  

###2016/01/11 : 開発支援プラグイン[DevToolsManage.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DevToolsManage.js)を更新しました。  
1. タイトル画面をとばして最新のセーブファイルを強制ロードする機能を追加  
2. FPSを初期状態で表示(FPS/MS切り替え可能)する機能を追加  

