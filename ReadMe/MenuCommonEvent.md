RPGツクールMVで使用可能な自作プラグイン「メニュー内コモンイベントプラグイン」の紹介です。  

# プラグインの説明  
　メニュー画面やプラグインで追加した画面(※1)でコモンイベントを並列実行できます。メッセージやピクチャ、変数の操作などが各イベントコマンド(※2)が実行可能です。コモンイベントは各画面につきひとつ実行できます。

1. メニュー系の画面であれば利用できます。サウンドテストプラグインや用語辞典プラグインとの連携は確認済みです。
1. 移動ルートの設定などキャラクターを対象にする一部コマンドは動作しません。また、プラグインによって追加されたスクリプトやコマンドは正しく動作しない可能性があります。

# スクリーンショット
- イベントで指定したメッセージやピクチャが表示できます。
![スクリーンショット](https://3.bp.blogspot.com/-9hrJUZNrfPM/Wf4lI86hBjI/AAAAAAAAcQ0/BkoHaSJE3PMY0XGPXDqUx9Npzl7F4dGUgCLcBGAs/s1600/image_20171105_052936.jpg)

# 詳しい使い方
　通常のイベントコマンドはもちろん、スクリプトによってウィンドウオブジェクトを取得すれば、様々な高度な処理がイベントで実現できます。

## プラグインコマンド
```$xslt
ウィンドウ操作禁止      # メニュー画面のウィンドウ操作を禁止します。
DISABLE_WINDOW_CONTROL  # 同上
ウィンドウ操作許可      # 禁止したメニュー画面のウィンドウ操作を許可します。
ENABLE_WINDOW_CONTROL   # 同上
```
## スクリプト
```$xslt
// ウィンドウオブジェクトを取得
this.getSceneWindow(windowName);
指定した名前のウィンドウオブジェクトを返します。
プロパティの取得や設定が可能です。上級者向け機能です。

// ウィンドウアクティブ判定
this.isWindowActive(windowName);
指定した名前のウィンドウがアクティブなときにtrueを返します。

// ウィンドウインデックス取得
this.getSceneWindowIndex();
現在アクティブなウィンドウのインデックスを取得します。先頭は0です。

// 選択中のアクターオブジェクト取得
$gameParty.menuActor();
装備画面やステータス画面で選択中のアクターの情報を取得します。
上級者向けスクリプトです。(※1)

// 選択中のアクターID取得
$gameParty.menuActor().actorId();
装備画面やステータス画面で選択中のアクターIDを取得します。

※1 既存のコアスクリプトですが、有用に使えるため記載しています。

// 用語辞典の表示内容更新
this.refreshGlossary();
用語辞典プラグインにおいて用語の表示内容を最新にします。
同プラグインと連携した場合に使用します。
```
## ウィンドウ名称一覧
```$xslt
・メインメニュー
commandWindow   コマンドウィンドウ
statusWindow    ステータスウィンドウ
goldWindow      お金ウィンドウ

・アイテム画面
categoryWindow  アイテムカテゴリウィンドウ
itemWindow      アイテムウィンドウ
actorWindow     アクター選択ウィンドウ

・スキル画面
skillTypeWindow スキルタイプウィンドウ
statusWindow    ステータスウィンドウ
itemWindow      スキルウィンドウ
actorWindow     アクター選択ウィンドウ

・装備画面
helpWindow      ヘルプウィンドウ
commandWindow   コマンドウィンドウ
slotWindow      スロットウィンドウ
statusWindow    ステータスウィンドウ
itemWindow      装備品ウィンドウ
```

## 他プラグインとの連携
- ピクチャのボタン化プラグイン（PictureCallCommon.js）と併用する場合コマンドは「P_CALL_CE」ではなく「P_CALL_SWITCH」を使ってください。

# ダウンロード
以下のURLからダウンロードできます。  
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuCommonEvent.js>  

ダウンロード方法(Windowsの場合)  
1. リンク先に飛ぶ
1. 右クリック
1. 名前を付けて保存
1. ファイル名を変えずに、プロジェクトの「js/plugins」配下に配置

# 利用規約
当プラグインはMITライセンスのもとで公開されています。作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても制限はありません。このプラグインはもうあなたのものです。
- <http://opensource.org/licenses/mit-license.php>
- <https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/LICENSE.txt>
