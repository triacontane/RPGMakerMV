RPGツクールMVで使用可能な自作プラグイン「カスタムメニュー作成プラグイン」の紹介です。  

# プラグインの説明  
　プラグインパラメータからウィンドウ情報を定義して独自のメニュー画面を作れます。初期状態で動作するサンプルや豊富なスクリプトのプリセットが用意されていてすぐに動作を確認できます。

　また、コモンイベントが使えるので細かい要件にも対応できます。

# スクリーンショット
- プラグインパラメータからウィンドウ情報を定義して使います。プリセットの設定をいくつか用意しているので参考にしてください。
![スクリーンショット](https://2.bp.blogspot.com/-e2X-KM7w3SA/XnXKeAQiLlI/AAAAAAAAcqU/l1X4-0qIQegF-zdPBv-CwwpcZC8xhAtJwCPcBGAYYCw/s1600/image_20200321_165415.png)

# チュートリアル
　カスタムメニュー画面の作り方を簡単に解説します。

## シーンを作成する
　まずはカスタムメニュ用のシーンの識別子を決めます。識別子とはシーンを一意に区別するための文字列で、他のシーンと被らない文字列を設定してください。

　『ヘルプウィンドウ使用』を有効にすると、画面上部にヘルプウィンドウが表示されます。
![ss01](https://3.bp.blogspot.com/-cDjUaaCzM1I/XnXNVognMuI/AAAAAAAAcqo/ym91Gm6B3egRd1ZQK4dTlLzpRinP7AJ1ACLcBGAsYHQ/s1600/2020-03-21%2B%25282%2529.png)

## ウィンドウを作成する
　次にウィンドウを作成します。シーンと同じく識別を設定して、座標や幅、高さなども設定します。追加でフォントサイズやウィンドウスキンの設定も可能です。

　相対座標ウィンドウを設定すると、座標がそのウィンドウからの相対位置になるので、別のウィンドウの右や下にくっつけて配置できます。
![ss02](https://2.bp.blogspot.com/-Mjn6eCabUNI/XnXPO6JapEI/AAAAAAAAcq8/h6t49VKF8SMJ7GvdpncXz7bCLIaPmozvACLcBGAsYHQ/s1600/2020-03-21%2B%25284%2529.png)

## ウィンドウの中身を作成する
### 直接指定の場合
　ウィンドウの中身は、項目を直接入力する方法とデータベースやアクターデータ等から取得する方法とがあります。直接入力する場合は、コマンドリストにコマンド名を直接入力します。

　必要に応じて表示可否スイッチや選択可否スイッチも指定できます。
![ss03](https://2.bp.blogspot.com/-zp1znaO0UA4/XnXQrPLNLEI/AAAAAAAAcrI/8Ve2hrg5tY0qMQm3cs4DXuOQG-D7kWEBgCLcBGAsYHQ/s1600/2020-03-21%2B%25285%2529.png)

### 動的指定の場合(一覧取得)
　データベース等から動的に項目を取得する場合は、スクリプトを使ってウィンドウに表示する一覧データを取得します。
![ss04](https://2.bp.blogspot.com/-X1RIiY83Ci0/XnXSETorc4I/AAAAAAAAcrU/kWGlRcoAfr0zAn1hhKy2QJ119mp4jK5twCLcBGAsYHQ/s1600/2020-03-21%2B%25286%2529.png)

　スクリプトには豊富なプリセットが用意されていて、選択したプリセットを改変することもできるのでJavaScriptに慣れていなくても利用可能です。
![ss05](https://3.bp.blogspot.com/-jo5AjSyH2VU/XnXK8jj5nRI/AAAAAAAAcqg/G0DdtquhSNoMASDJTg9fLvrfcdfKKzjbwCPcBGAYYCw/s1600/screen.png)

### 動的指定の場合(項目の描画)
　一覧の各項目を描画する場合もスクリプトで指定します。こちらもプリセットが用意されています。また、記述を省略すると内容を自働で判断して描画してくれます。
![ss06](https://4.bp.blogspot.com/-tiKzn05SFE8/XnXT7YkGmwI/AAAAAAAAcrg/fOREErAxvecpIlYrCTJGxVXn1Pkgi9mVACLcBGAsYHQ/s1600/2020-03-21%2B%25287%2529.png)

　描画される座標をずらしたい場合は、以下のように指定値を加算、減算します。この場合、もとの座標より30pixel右に描画されます。
![ss07](https://2.bp.blogspot.com/-BSdYWrI3yoQ/XnXUw3hmg3I/AAAAAAAAcro/zR1y2KC5AsQ92hDMTDOdc-sV39o9FiRgQCLcBGAsYHQ/s1600/2020-03-21%2B%25288%2529.png)

## ウィンドウ同士の遷移関係を定義する
　ウィンドウで項目の決定やキャンセルが行われたとき、次にフォーカスするウィンドウを指定したり、スクリプトを実行したりできます。この機能によりウィンドウ同士の遷移関係を定義します。
![ss08](https://3.bp.blogspot.com/-3ivP3NtlW3o/XnXVxy2THQI/AAAAAAAAcr0/wrXIpkyyJPg8UJyFIZJel7ZGJ8GNeTWLACLcBGAsYHQ/s1600/2020-03-21%2B%25289%2529.png)

## コモンイベントを実行する
　スキルの習得や能力値の変化など、カスタムメニュー画面を使って実際にやりたいことは主にコモンイベントを使って実現します。

　コモンイベントはピクチャの表示などの演出にも使えます。ただし、画面の色調変更など一部のコマンドは機能しません。　
![ss09](https://2.bp.blogspot.com/-7B9f4l6AkHM/XnXYVkPRGVI/AAAAAAAAcsA/vBm8yyd-JT0pr_XlWJO8VvxznJRlo9XYQCLcBGAsYHQ/s1600/2020-03-21%2B%252810%2529.png)

## カスタムメニュー画面の呼び出し
　作成したカスタムメニュー画面は、以下のスクリプトから呼び出せます。引数にはシーン識別子を指定します。メインメニューに項目を追加するプラグインと併用する場合もこのスクリプトを使ってください。
```$xslt
SceneManager.callCustomMenu('Scene_ActorList');
```

## 注意点
- このプラグインはRPGツクールMV1.6.0以降でのみ動作します。バージョンが古い場合はバージョンアップをご検討ください。
- このプラグインにはメインメニューに項目を追加する機能は実装していません。当該機能を持つ他プラグインと連携してご利用ください。

例：メニュー画面のサブコマンドプラグイン
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuSubCommand.js>

# ダウンロード
以下のURLからダウンロードできます。  
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SceneCustomMenu.js>  

ダウンロード方法(Windowsの場合)  
1. リンク先に飛ぶ
1. 右クリック
1. 名前を付けて保存
1. ファイル名を変えずに、プロジェクトの「js/plugins」配下に配置

# 利用規約
当プラグインはMITライセンスのもとで公開されています。作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても制限はありません。このプラグインはもうあなたのものです。
- <http://opensource.org/licenses/mit-license.php>
- <https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/LICENSE.txt>
