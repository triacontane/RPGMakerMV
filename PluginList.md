##利用規約 Terms of use
当プラグインはMITライセンスのもとで公開されています。LICENSE.txtもご確認ください。  
http://opensource.org/licenses/mit-license.php  

These plugins is released under the MIT License. Check LICENSE.txt  
http://opensource.org/licenses/mit-license.php  

ライセンスの表記さえ残せば、あとは改変、再配布、商用利用全て一切の制限はありません。  
より品質を高めるため、あるいはご自身の環境に合わせるための改変はむしろ推奨します。  
ただし、すべてご自身の責任のもとで行ってください。  

なお、バグ修正プラグインにはライセンス表示はありません。公式が正式に修正した場合、そちらの適用を推奨します。  

##プラグインの説明 Description of plugins
プラグインの一覧とそれぞれの説明です。下にあるものほど新しいプラグインです。  

1.  オプションのデフォルト値設定プラグイン[CustomizeConfigDefault.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CustomizeConfigDefault.js)  
Optionsで設定可能な項目のデフォルト値を、指定した値に変更します。  
音量を初期状態で0に設定したり、常時ダッシュを初期状態で有効にしたりできます。  

2.  ニューゲームオンリープラグイン[TitleNewGameOnly.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/TitleNewGameOnly.js)  
タイトル画面の選択肢をニューゲームのみにします。  
コンティニューを使用しない短編での使用を想定し、タッチ操作にも対応します。  

3.  イベント中タイマー停止プラグイン[TimerStopEventRunning.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/TimerStopEventRunning.js)  
イベント処理中にタイマーの動作を停止します。  
タイマーイベント中でもゆっくりと文章を読むことができるようになります。  

4.  イベントセンサープラグイン[NearEventSensor.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/NearEventSensor.js)  
近くに存在するイベントを感知して白くフラッシュさせます。  
謎解きアドベンチャー用のプラグインです。  

5.  マップ高速化プラグイン[MapRapid.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MapRapid.js)  
様々なウェイトを排除してマップ処理を高速化します。  
メッセージの瞬間表示とウィンドウの瞬間開閉を提供します。  

6.  マルチタイルプラグイン[MultiTilemap.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MultiTilemap.js)  
複数のタイルマップを一つのイベントで表現できるようになります。  

7.  画面単位スクロールプラグイン[GridScrollMap.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/GridScrollMap.js)  
マップ画面のスクロールを固定化し、画面外に出ることでスクロールする方式に変更します。  
ゼルダの伝説のようなスクロール方式。。  

8.  動的文字列ピクチャ生成プラグイン[DTextPicture.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DTextPicture.js)  
指定した任意の文字列ピクチャを動的に生成するコマンドを提供します。  
フォントサイズを指定できて、各種制御文字もサポートする自作メニュー作成支援プラグインです。  

9.  アナザーニューゲームプラグイン[AnotherNewGame.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/AnotherNewGame.js)  
タイトル画面のウィンドウの一番下に、もう一つのニューゲームを追加します。  
コマンド名は任意に設定でき、選択するとニューゲームとは別の場所に移動します。  
初期状態で選択不可にしたり、項目そのものを隠したりできます。

10. 動的ウィンドウプラグイン[DWindow.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DWindow.js)  
空のウィンドウを画面上に表示します。  
動的文字列ピクチャ生成プラグインと組み合わせて自作メニューの作成を支援します。  
Plugin that Make Dynamic Window  

11. 戦闘中顔グラフィック表示プラグイン[BattleActorFaceVisibility.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BattleActorFaceVisibility.js)  
戦闘中、コマンド選択ウィンドウの上に顔グラフィックが表示されるようになります。  
設定で指定したピクチャや敵キャラ画像に差し替えたり、ウィンドウ枠を非表示にしたりできます。  

12. 投降プラグイン　～武器よさらば～[FarewellToArms.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/FarewellToArms.js)  
戦闘を自主的に放棄して敗北扱いで終了する「投降」コマンドが使えるようになります。  
イベント戦闘で敗北した場合の分岐に進みます。  

13. ピクチャのボタン化プラグイン[PictureCallCommon.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureCallCommon.js)  
ピクチャをクリックすると、指定したコモンイベントが呼び出されるようになるコマンドを提供します。  
トリガーはクリック以外にも右クリックや長押し、マウスオーバーでも可能で、透過色を考慮することも可能です。  
When clicked picture, call common event.  

14. マップタッチ仕様変更プラグイン[ChangeMapTouchPolicy.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ChangeMapTouchPolicy.js)  
マップをタッチした際の移動の仕方を4種類から自由に変更できます。  
マップタッチ自体を禁止にしたり、マウスを重ねるだけでプレイヤーが追従したりできるようになります。  
Plugin that change policy of 'map touch'  

15. ピクチャのグラフィカルな位置調整プラグイン[AdjustPictureGraphical.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/AdjustPictureGraphical.js)  
イベントコマンドのテスト時に、ピクチャの表示位置をドラッグ＆ドロップで微調整できます。  
グリッド表示やグリッドにスナップすることも可能で、座標はCtrl+Cでクリップボードにコピーできます。  
全ての機能はイベントテスト時のみ有効です。  
Plugin that adjust picture to graphical  

16. ピクチャの変数設定プラグイン[PictureVariableSetting.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureVariableSetting.js)  
ピクチャ関連のイベント命令で番号が「指定された変数の値」になるよう仕様を変更します。  
さらに、ピクチャのファイル名に変数を組み込むことが出来るようになります。連番を含むファイル名などの柔軟な指定に有効です。  

17. 時刻と天候プラグイン[Chronus.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/Chronus.js)  
ゲーム内で時刻と天候の概念を表現できるプラグインです。自動、マップ移動、戦闘で時間が経過し、時間と共に天候と色調が目まぐるしく変化します。  
プラグインコマンドから、時間が経過するスピードや現在の時間などを細かく設定できます。  

18. 強制メニュー開閉プラグイン[ForceMenu.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ForceMenu.js)  
負荷テスト用プラグインです。強制的にメニュー画面の開閉を行います。勇気ある方は試してみてください(笑)  
非推奨プラグイン。  

19. 視差ゼロ遠景のぼかし除去プラグイン[ParallaxesNonBlur.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ParallaxesNonBlur.js)  
遠景マップが視差ゼロ（ファイル名の先頭に「!」）の場合、ぼかし処理を除去します。その代わり遠景がループ及びスクロールしなくなります。 

20. 総合開発支援プラグイン[DevToolsManage.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DevToolsManage.js)  
開発環境を改善するための包括的プラグインで、主にデベロッパツールの制御を行います。  
また、ゲーム画面を常に全面に表示したり、オンフォーカスでマップをリロードする機能を提供します。  
全ての機能はテストプレー時のみ有効です。  

21. ピクチャのアニメーションプラグイン[PictureAnimation.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PictureAnimation.js)  
ピクチャをアニメーションさせます。セルの数やフレーム数、アニメーションパターンを指定できます。  
ピクチャは縦あるいは横に連結させるか、連番で複数画像を指定するかを選択できます。  
画像のクロスフェードにも対応しています。  

22. データベース名称の動的設定プラグイン[ItemNameEscape.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ItemNameEscape.js)  
データベースの「名称」「説明文」に一部の制御文字が使えるようになります。  
Plugin of item name escape  

23. ゲーム開始時にスクリプト実行プラグイン[GameStartEval.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/GameStartEval.js)  
ゲーム開始時に任意のスクリプトを実行します。Scene_Boot.startのタイミングです。ある程度JavaScriptの知識のある方向けです。  

24. ウィンドウタッチ仕様変更プラグイン[ChangeWindowTouchPolicy.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ChangeWindowTouchPolicy.js)  
ウィンドウをタッチした際の仕様を変更します。  
マウスーオーバーで項目にフォーカスしてシングルクリックで決定します。  
さらにウィンドウの枠外をクリックした場合の動作を決定もしくはキャンセルから指定できます。  

25. ピクチャの回転イベントコマンドバグ修正プラグイン[BugFixPictureRotation.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixPictureRotation.js)  
イベントコマンド「ピクチャの回転」が仕様通りに動作しない（負の値を設定したときに回転しない＋正の値を設定したときの回転方向が仕様と逆）バグを修正します。  

26. メッセージウィンドウの一時消去プラグイン[MessageWindowHidden.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageWindowHidden.js)  
メッセージウィンドウを表示中に指定したボタンを押下することでメッセージウィンドウを消去します。もう一度押すと戻ります。  
右クリック、Shiftキー、Controlキーの中からトリガーを選択できます。  
Erase message window (and restore) when triggered  

27. 動的データベースプラグイン[DynamicDatabase.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/DynamicDatabase.js)  
データベースの各項目を動的な値に変更するプラグインです。変数やJavaScriptの関数を使ってより高度なデータベースを構築できます。  
武器の攻撃力やアイテムの値段など全ての項目に計算式を設定できます。  

28. 並列処理イベントの循環参照バグ修正プラグイン[BugFixParallelEventAndCharacter.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixParallelEventAndCharacter.js)  
並列処理イベントで対象を「このイベント」にして「移動ルートの指定」「アニメーションの表示」「フキダシアイコンの表示」を実行中にセーブすると、セーブできずファイルが消失する現象を修正します。  

29. その場方向転換プラグイン[PlayerShiftTurn.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/PlayerShiftTurn.js)  
指定されたキー（Shift or Ctrl or Tab）を押している間、プレイヤーを移動させずにその場で方向転換できるようにします。  

30. 敵グループごとの戦闘BGM設定プラグイン[FlexibleBattleBgm.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/FlexibleBattleBgm.js)  
敵グループごとに戦闘BGM設定できるようになります。この設定はシステムの戦闘BGMよりも優先され、設定されていない場合のみシステムの戦闘BGMが演奏されます。  

31. キャラクターグラフィック表示拡張プラグイン[CharacterGraphicExtend.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js)  
イベントのグラフィック表示方法を拡張して多彩な表現を可能にします。  
ピクチャやアイコン、フェイスをキャラクターグラフィックとして表示する、キャラクターの表示座標をピクセル単位で調整する、など。  

32. リージョンへのタイル属性付与プラグイン[RegionTerrain.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/RegionTerrain.js)  
パラメータに指定したリージョンにタイル属性（梯子、茂み、カウンター、ダメージ床）を付与します。  

33. メッセージスキッププラグイン[MessageSkip.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageSkip.js)  
メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。  
オートモードの切替に掛かるフレーム数や、イベント終了後もスキップやオートを継続するかが設定できます。  

34. オプション任意項目作成プラグイン[CustomizeConfigItem.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CustomizeConfigItem.js)  
オプション画面に任意の項目を追加します。  
スイッチ項目、数値項目、音量項目、文字項目を自由に追加し、値を変数に同期させます。  

35. 割り込みコモンイベントプラグイン[CommonInterceptor.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CommonInterceptor.js)  
指定したタイミングでコモンイベントを呼び出します。ニューゲーム時、ロード完了時、メニュー終了時が対象です。  

36. 選択肢のピクチャ表示プラグイン[MessageSelectPicture.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageSelectPicture.js)  
イベントコマンド「選択肢の表示」で選択肢にカーソルを合わせた際に選択肢に対応するピクチャを表示するようにします。  

37. セーブファイル復元プラグイン[RestoreSaveData.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/RestoreSaveData.js)  
新たに任意のプラグインを導入した際に元のセーブデータがロードできなくなったとき、このプラグインを適用すればロードできるかもしれません。  

38. フキダシウィンドウプラグイン[MessageWindowPopup.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MessageWindowPopup.js)  
メッセージウィンドウを指定したキャラクターの頭上にフキダシで表示するよう変更します。  
Change the message window from fixed to popup  

39. サウンドテストプラグイン[SceneSoundTest.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SceneSoundTest.js)  
ゲーム中のBGMを視聴できるサウンドテストを実装します。  

40. バッチ処理プラグイン[BatchProcessManager.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BatchProcessManager.js)  
プラグインコマンドから実行する各種バッチ処理を提供します。必要に応じて他のプラグインと併用してください。  

41. 画像ロード遅延時のエラー修正プラグイン[BugFixImageOnLoad.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixImageOnLoad.js)  
スプライトで画像を指定後、画像のロードが完了する前に画像の指定を解除するとエラーで強制終了する現象の修正。  
具体的には、「ピクチャの表示」→「ウェイト（1フレーム）」→「ピクチャの消去」で発生するエラーの対応です。  

42. ステート解除時の変化プラグイン[StateChangeIfRemove.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/StateChangeIfRemove.js)  
ステート解除条件を満たしたときに自動的に別のステートに差し替えます。  
強力な毒が時間経過で弱い毒に変化したり、逆に症状が悪化したり、時間経過で戦闘不能になったり……等の設定に有効です。

43. ステート自動付与プラグイン[AutomaticState.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/AutomaticState.js)  
条件を満たしている間、指定したステートを付与します。  
条件にはHP、MP、TP、装備品、スイッチが利用でき、特定のアクターや敵キャラのみを対象にすることもできます。  

44. Web実行のテストプレー防止プラグイン[BugFixWebPlayTest.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BugFixWebPlayTest.js)  
Web実行時にURLに?testと入力して実行することで誰でもテストプレーできてしまう問題を修正。  

45. 起動オプション調整プラグイン[SetupOptionCustomize.js](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SetupOptionCustomize.js)  
MVの起動オプション（URLクエリパラメータ）を制作者側で制御できます。  

