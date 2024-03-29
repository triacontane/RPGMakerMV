　RPGツクールMZの発売おめでとうございます！　今作の発売にあたり、いくつかの公式プラグインを作成、提供しました。本項では、公式プラグインの機能や使い方を紹介します。  

# 配置場所  
　公式プラグインはRPGツクールMZをインストールしたフォルダの『dlc\BasicResources\plugins\official』配下に置いてあります。必要に応じてプロジェクトフォルダにコピーしてください。

## 配置例  
Windowsかつストア版の場合
```
C:\Program Files\KADOKAWA\RPGMZ\dlc\BasicResources\plugins\official
```

WindowsかつSteam版の場合
```
C:\Program Files (x86)\Steam\steamapps\common\RPG Maker MZ\dlc\BasicResources\plugins\official
```

# PluginCommonBase.js  
　他のプラグインから参照されることを前提としたベースプラグインです。プラグインパラメータ、コマンドの型解析や制御文字の処理を一括で提供します。また、本プラグインを導入すると様々な場面で以下の制御文字が使えるようになります。
```
\v[n]  : n番目の変数の値に変換されます。
\s[n]  : n番目のスイッチの値(true, false)に変換されます。
\ss[n] : セルフスイッチの値(true, false)に変換されます。
n -> A, B, C, D
```
　制御文字を利用可能な場面は以下の通りです。他の公式プラグインで追加した制御文字も同様となります。
- 文章の表示  
- メモ欄(※)  
- プラグインコマンド(※)  
- プラグインパラメータ(※)  
- スキルなどの説明欄  
※ PluginCommonBase.jsをベースとして取り込んだプラグインのみ

## プラグインパラメータの型解析(開発者向け情報)
　プラグインパラメータを自動で型解析し変換します。また、パラメータ取得時に制御文字の変換を自動で行います。以下のメソッドを呼んで戻り値を取得します。引数には必ず「document.currentScript」を指定します。
```
const param = PluginManagerEx.createParameter(document.currentScript);
```
　ただし、パラメータ名の末尾が(大文字小文字問わず)以下の値の場合、制御文字や型の変換は行われず、そのままの値を返します。
- text
- name
- note
- desc
- script

## プラグインコマンドパラメータの型解析(開発者向け情報)
　プラグインコマンドパラメータを自動で型解析し変換します。また、パラメータ取得時に制御文字の変換を自動で行います。PluginManager.registerCommandの代わりに以下を使用します。引数には必ず「document.currentScript」を指定します。
```
PluginManagerEx.registerCommand(document.currentScript, "command", args => {
    // 任意の処理
});
```

## メモ欄の解析(開発者向け情報)
指定したオブジェクトからメモ欄情報を取得します。制御文字の変換を自動で行います。名称は複数指定することも可能です。
```
const metaValue = PluginManagerEx.findMetaValue(obj, tagName1, tagName2...);
```

## 動的コモンイベントの実行(開発者向け情報)
動的コモンイベント（並列処理可能なリスト型のコモンイベント）です。同一IDのコモンイベントも好きなだけ並列実行できます。実行が終わったものから自動で破棄されます。
```
$gameMap.setupDynamicCommon(commonEventId);
```

# TextScriptBase.js
　テキストやスクリプトなどの複数行の文字列をプラグインパラメータとして登録、管理できるデータベースです。登録したテキストは以下の制御文字で参照できます。制御文字の添字には指定した識別子もしくは番号を指定します。
```
\tx[aaa] // 識別子[aaa]で登録したテキストに置き換わります。
\js[bbb] // 識別子[bbb]で登録したテキストをその場でスクリプトとして評価した結果に置き換わります。
```

![画像](https://1.bp.blogspot.com/-6FiwRuWQoC4/XzdQwEAfJ-I/AAAAAAAAcvQ/cACizeq8JHkSH7UW5NQ8VUcfbzBzaV-VACLcBGAsYHQ/s458/2020-08-15%2B%25282%2529.png)

　スクリプトを実行する場合、引数を渡すことができます。引数は自働で型変換され、配列「args」から参照できます。
```
\js[bbb,10,ccc] // 配列[10, 'ccc']が変数argsに格納されます。
```

　スクリプトを直接記述して埋め込むこともできます。
```
\js<xxx> // スクリプトxxxの実行結果に置き換わります。
```

　ただし、スクリプト中で記号「<」「>」を使う場合は以下の通りエスケープする必要があります。
```
> : &gt;
< : &lt;
```

# MaterialBase.js
　主にプラグインで使用する画像、音声素材を登録、管理できるデータベースです。登録した素材は、自動的に未使用素材削除機能の対象外となります。以下の制御文字を使用すると登録した素材のファイル名に置き換わります。
```
\mi[aaa] // 識別子[aaa]で登録した画像素材のファイル名に置き換わります。
\ma[bbb] // 識別子[bbb]で登録した音声素材のファイル名に置き換わります。
```
![画像](https://1.bp.blogspot.com/-9BnU204h3_k/XzdUe1NcIJI/AAAAAAAAcvc/91HGHHDU3z4ODDgduE6k6goGtxbP3ckWACLcBGAsYHQ/s458/2020-08-15%2B%25283%2529.png)

　登録した素材はプラグインコマンドにより別の素材に変更できます。設定した値はプラグインコマンドから「ピクチャ」や「BGM」として表示、再生できます。詳細はプラグインコマンドの説明を確認してください。

　また、別プラグイン「EventCommandByCode.js」を使えばより広い用途に使用できます。

# UniqueDataLoader.js
　dataフォルダ配下に存在する任意のjsonファイルを読み込みます。jsonファイルはJSONとしてparse可能なテキストファイルとして作成してください。定義したファイルはゲーム起動時に読み込まれます。

　データは指定した名称のグローバル変数に格納されます。グローバル変数名に「window」を指定すると、各オブジェクトがそれぞれグローバル変数として定義されますが、名称の競合には注意してください。データベースコンバータMZで作成したデータや独自のプラグインで追加したデータの読み込みなどに使えます。読み込んだデータは、独自のプラグインやスクリプトで以下の通り参照できます。
 
- グローバル変数を[$dataUniques]プロパティ名を[property]にした場合の参照例
```
$dataUniques.property
```
 
　すべての固有データを正常に読み込むと以下のメソッドが呼ばれます。必要であれば再定義してください。
```
Scene_Boot.prototype.onUniqueDataLoad
```

# EventCommandByCode.js
　コードとパラメータを直接指定してイベントコマンドを実行できます。各コマンドのパラメータに変数(制御文字)が使えたり、通常のイベントコマンドでは指定できない範囲外の値を無理やり指定できます。なお、想定外の値を設定してコマンドを呼んだ場合の動作は保証できません。　

![画像](https://1.bp.blogspot.com/-Dsgz808exi4/XzdYaBpi00I/AAAAAAAAcvo/IgMtvn_od3gIIISUk1htKKQG2wCLICM2gCLcBGAsYHQ/s527/2020-08-15%2B%25284%2529.png)

　なお、イベントエディタ上で複数行になるコマンドおよびネストが深くなるコマンドは指定できません。

　具体的なコードとパラメータの情報は、以下が参考になります。
<https://docs.google.com/spreadsheets/d/1aqY-xzFqT0vnZE-OkfsMYsP9Ud91vWTrBLU-uDkJ-Ls/edit#gid=2095105278>

 また、コードを『365』、パラメータの一番目にコマンドを指定することで『MV版のプラグインコマンド』を呼び出せます。MZに正式対応していないプラグインを使用する際に役立ちます。   
![画像](https://1.bp.blogspot.com/-05AmUbqT4zI/Xz-sqqESKzI/AAAAAAAAcwY/5E14AL0RpncaIQ1pcT-PZAOqeiTjMdKRQCLcBGAsYHQ/s527/2020-08-21%2B%25285%2529.png)

# OverpassTile.js
　マップ上で橋などの立体交差を表現できます。ツクールMV公式プラグイン「OverpassTile.js」のMZ向け機能強化版です。リージョンだけでなく地形タグも指定可能で、さらにイベントの起動や衝突判定に関する考慮がなされています。

## 通行可能判定に関する仕様
- 橋の入り口にいる場合  
立体交差に対して必ず移動できます。
- 立体交差にいる場合  
橋の上にいる場合、立体交差と橋の入り口に対して必ず移動できます。
橋の下にいる場合、橋の入り口に対して必ず移動できません。
- 上記の条件で移動可否を判定しなかった場合  
マップの本来の通行設定に従います。
   
- イベントの起動判定、衝突判定を考慮できます。  
高さが異なる（橋の上と下にいる）イベントは起動、衝突しません。

## OverpassTileEventAttach.js
　公式プラグインではありませんが「OverpassTile.js」と組み合わせて使用する、立体交差イベントアタッチメントです。イベントのメモ欄に以下の通り指定すると対象イベントが立体交差として扱われます。
```
<Overpass>
```
ただし、グラフィックが指定されていないページもしくは有効なページがない場合は立体交差になりません。また、プライオリティは原則「通常キャラの上」を選択してください。

- 取得元（MITライセンス）  
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/mz_master/OverpassTileEventAttach.js>

## OverpassTileEventAttach.js
　同じく「OverpassTile.js」と組み合わせて使用する、乗り物考慮アタッチメントです。小型船、大型船は下層のみ、飛行船は上層のみに配置され高さが異なる状態からの乗船ができなくなります。

- 取得元（MITライセンス）  
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/mz_master/OverpassTileVehicleAttach.js>

# ExtraWindow.js
　任意のウィンドウを指定したシーンに追加表示できます。座標やフォントサイズ、開閉アニメの有無など基本的な情報を設定できます。ウィンドウの表示テキストには制御文字が使用でき、変数値が変更されると自動的に再描画されます。

![画像](https://1.bp.blogspot.com/-2U_HAkT8gvY/XzdckuySV5I/AAAAAAAAcv0/FSPJqOJeHvoT-U8dwFulBtsTqLxsk0PbgCLcBGAsYHQ/s458/2020-08-15%2B%25286%2529.png)

# ExtraImage.js
　任意の画像を指定したシーンに追加表示できます。座標や拡大率、原点など基本的な情報を指定できます。各パラメータに制御文字を指定すると指定した変数から値を取得できます。

![画像](https://1.bp.blogspot.com/-KcIQwU5248Y/XzddLtnXhjI/AAAAAAAAcv8/3vwF2b9y4RgA2eS0ztlMiqC6lgdO3F3pgCLcBGAsYHQ/s458/2020-08-15%2B%25287%2529.png)

# RegionBase.js
　リージョンおよび地形タグのデータベースを提供します。仕様はおおよそRPGツクールMV Trinityに準じています。リージョンおよび地形タグをトリガーにして以下の機能を提供します。
- イベント、プレイヤーに対する通行判定(4方向含む)  
- 梯子、茂み、カウンター、ダメージ床  
- コモンイベントの呼び出し(トリガー3種類)  
- 侵入している間だけONになるスイッチ  
- 侵入している間だけ有効になる特徴  
- メモ欄  
   
　以下のスクリプトでデータベースをスクリプトや外部プラグインから参照できます。未設定もしくは添え字が0の場合の中身はundefinedとなるので注意してください。
```
$dataSystem.regions[ID];
$dataSystem.terrainTags[ID];
```

# ライセンスについて
　私が個人的にGitHubで公開していたプラグインは全てMITライセンスでした。しかし、公式プラグインはMITラインセンスではありません。使用にあたっては提供元の利用規約を確認してください。

