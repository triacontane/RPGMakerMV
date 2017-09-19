RPGツクールMVで使用可能な自作プラグイン「多層レイヤー一枚絵マッププラグイン」の紹介です。  

# プラグインの説明  
　複数のレイヤーを使った多層一枚絵マップを作成可能にします。イベントでレイヤーを作成するので、レイヤー数は実質無制限です。マップサイズと同じサイズの一枚絵を用意してください。

　イベントを作成してメモ欄を以下の通り記述すると、指定した画像がマップに表示され、かつイベント位置とは無関係に画像の左上がマップの左上に合わせられます。

# 完成例
- 通常のパララックスマッピングに対して光や影の表現を重ねることができます。
![スクリーンショット](https://4.bp.blogspot.com/-VGUnVmICINo/WcE3RtVSIVI/AAAAAAAAcPk/9QCA5oWybEEt57EGGuLHhboltjajNzUYQCLcBGAs/s1600/screen_shot.png)

# 詳しい使い方

## メモ欄の記述
```
<PLM:file>        # 「img/parallaxes/file」を一枚絵として表示します。
<PLM_Blend:1>     # 合成方法の初期値を「加算」にします。
<PLM合成:1>       # 同上
<PLM_Opacity:128> # 不透明度の初期値を「128」にします。
<PLM不透明度:128> # 同上
```
## スクリプト
```
this.shiftPosition(10, 20); # 表示位置をX[10] Y[20]ずらします。
```
　イベント内の「画像」「オプション」項目は無視されますが、その他の項目は通常のイベントと同じように機能します。
## キャラクターグラフィック表示拡張プラグインとの組み合わせ
　合成方法や不透明度などを後から変更したい場合は、自律移動で指定するか「[キャラクターグラフィック表示拡張プラグイン](https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js)」と併用してください。

## 制約事項
　当プラグインはマップのループには対応していません。

# サンプル素材
　当プラグインで使用できるサンプルマップをどらぴか([@dorapikanisan](https://twitter.com/dorapikanisan))様よりご提供いただきました。この場を借りて御礼申し上げます。上の「完成例」のマップを作成することができます。

　[専用のダウンロードページ](https://github.com/triacontane/RPGMakerMV/blob/master/Sample/sample_parallax.zip)から「Download」ボタンでダウンロードできます。
クレジット表記なしでご自由にお使い頂けるご許可を頂いています。

- PIKA's GAME GALLERY  
<https://mashimarohb252d6.wixsite.com/pikasgame>

## サンプル素材の使い方
- サンプル素材には通行可否設定を簡単に行える専用タイルも付属しています。  
![使い方1](https://1.bp.blogspot.com/-F_YaSqHQacw/WcE7FJNJqKI/AAAAAAAAcPw/jsNJe5PE6yYAaAORGA0d1xVSifTHpndxQCLcBGAs/s1600/howToUse1.jpg)

- 専用タイルの使用例です。  
![使い方2](https://4.bp.blogspot.com/-FxAdskzexuw/WcE7G0mQvfI/AAAAAAAAcP0/mu05f6c800kLut_NBO3WoFDiPLwJVND5QCLcBGAs/s1600/howToUse2.jpg)

# ダウンロード
以下のURLからダウンロードできます。
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/ParallaxLayerMap.js>  

ダウンロード方法(Windowsの場合)  
1. リンク先に飛ぶ
1. 右クリック
1. 名前を付けて保存
1. ファイル名を変えずに、プロジェクトの「js/plugins」配下に配置

# 利用規約
当プラグインはMITライセンスのもとで公開されています。作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても制限はありません。このプラグインはもうあなたのものです。
- <http://opensource.org/licenses/mit-license.php>
- <https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/LICENSE.txt>
