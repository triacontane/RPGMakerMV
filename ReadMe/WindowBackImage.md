RPGツクールMVで使用可能な自作プラグイン「ウィンドウ背景画像指定プラグイン」の紹介です。  

# プラグインの説明  
　ウィンドウの背景を任意の画像に置き換えます。元のウィンドウフレームは非表示になります。

# スクリーンショット
- ウィンドウごとに別々の画像を指定できます。
![スクリーンショット](https://1.bp.blogspot.com/-dsDsij8DeAs/WhEh0Zk8iMI/AAAAAAAAcd8/mNmAJcvZ5hEpN3R7mYEntRQgHPiwLZ56wCLcBGAs/s1600/image_20171119_150002.jpg)

- 素材提供元:<http://frames-design.com/>

# 詳しい使い方
　背景画像はウィンドウのサイズにかかわらず、中央を原点に表示されます。倍率と座標を補正することは可能ですが、サイズが可変、不定のウィンドウに対して背景画像を指定することは推奨しません。  

　プラグインで追加されたウィンドウについても差し替え可能です。ただし、こちらで提供しているプラグイン以外はウィンドウのクラス名を把握しておく必要があります。また正常に動作するとは限りません。
![スクリーンショット](https://4.bp.blogspot.com/-JS-7oZyXMrU/WhE3fdnklAI/AAAAAAAAceM/b7sZrLFJi-466v0AgFPcP075gDpBuZk6QCLcBGAs/s1600/image_20171119_152819.jpg)

## 選択可能ウィンドウ一覧
　プルダウンで選択可能なウィンドウの一覧です。これ以外のプラグインで追加されたウィンドウはクラス名を直接指定する必要があります。
```$xslt
Window_Help : [ゲーム全般]で使用されるヘルプを表示するウィンドウです。
Window_Gold : [ゲーム全般]で使用されるお金を表示するウィンドウです。
Window_MenuCommand : [メインメニュー]で使用されるメインコマンドを表示するウィンドウです。
Window_MenuActor : [メインメニュー]で使用されるアクターステータスを表示するウィンドウです。
Window_ItemCategory : [アイテム画面]で使用されるアイテムカテゴリを表示するウィンドウです。
Window_ItemList : [アイテム画面]で使用されるアイテムリストを表示するウィンドウです。
Window_SkillType : [スキル画面]で使用されるスキルタイプを表示するウィンドウです。
Window_SkillStatus : [スキル画面]で使用されるステータスを表示するウィンドウです。
Window_SkillList : [スキル画面]で使用されるスキルリストを表示するウィンドウです。
Window_EquipStatus : [装備画面]で使用されるステータスを表示するウィンドウです。
Window_EquipCommand : [装備画面]で使用される装備コマンドを表示するウィンドウです。
Window_EquipSlot : [装備画面]で使用される装備スロットを表示するウィンドウです。
Window_EquipItem : [装備画面]で使用される装備リストを表示するウィンドウです。
Window_Status : [ステータス画面]で使用されるステータスを表示するウィンドウです。
Window_Options : [オプション画面]で使用されるオプションを表示するウィンドウです。
Window_SavefileList : [セーブ、ロード画面]で使用されるファイルリストを表示するウィンドウです。
Window_ShopCommand : [ショップ画面]で使用されるショップコマンドを表示するウィンドウです。
Window_ShopBuy : [ショップ画面]で使用される購入アイテムを表示するウィンドウです。
Window_ShopSell : [ショップ画面]で使用される売却アイテムを表示するウィンドウです。
Window_ShopNumber : [ショップ画面]で使用される数値入力を表示するウィンドウです。
Window_ShopStatus : [ショップ画面]で使用されるステータスを表示するウィンドウです。
Window_NameEdit : [名前入力画面]で使用される名前を表示するウィンドウです。
Window_NameInput : [名前入力画面]で使用される名前入力を表示するウィンドウです。
Window_ChoiceList : [マップ画面]で使用される選択肢を表示するウィンドウです。
Window_NumberInput : [マップ画面]で使用される数値入力を表示するウィンドウです。
Window_EventItem : [マップ画面]で使用されるアイテム選択を表示するウィンドウです。
Window_Message : [マップ画面]で使用されるメッセージを表示するウィンドウです。
Window_ScrollText : [マップ画面]で使用されるスクロールメッセージを表示するウィンドウです。
Window_MapName : [マップ画面]で使用されるマップ名を表示するウィンドウです。
Window_BattleLog : [戦闘画面]で使用されるバトルログを表示するウィンドウです。
Window_PartyCommand : [戦闘画面]で使用されるパーティコマンドを表示するウィンドウです。
Window_ActorCommand : [戦闘画面]で使用されるアクターコマンドを表示するウィンドウです。
Window_BattleActor : [戦闘画面]で使用されるアクター一覧を表示するウィンドウです。
Window_BattleEnemy : [戦闘画面]で使用される敵キャラ一覧を表示するウィンドウです。
Window_BattleSkill : [戦闘画面]で使用されるスキル一覧を表示するウィンドウです。
Window_BattleItem : [戦闘画面]で使用されるアイテム一覧を表示するウィンドウです。
Window_TitleCommand : [タイトル画面]で使用されるタイトルを表示するウィンドウです。
Window_GameEnd : [ゲーム終了画面]で使用される終了確認を表示するウィンドウです。
Window_DebugRange : [デバッグ画面]で使用される変数選択を表示するウィンドウです。
Window_DebugEdit : [デバッグ画面]で使用される変数設定を表示するウィンドウです。
Window_Destination : [行動目標ウィンドウプラグイン]で使用される行動目標を表示するウィンドウです。
Window_Chronus : [ゲーム内時間の導入プラグイン]で使用される時間を表示するウィンドウです。
Window_Gacha : [公式ガチャプラグイン]で使用されるガチャ表示を表示するウィンドウです。
Window_GachaCommand : [公式ガチャプラグイン]で使用されるコマンドを表示するウィンドウです。
Window_GachaGetCommand : [公式ガチャプラグイン]で使用される入手確認を表示するウィンドウです。
Window_GachaGet : [公式ガチャプラグイン]で使用される入手情報を表示するウィンドウです。
Window_Cost : [公式ガチャプラグイン]で使用されるコストを表示するウィンドウです。
Window_NovelChoiceList : [ノベルゲーム総合プラグイン]で使用されるノベル選択肢を表示するウィンドウです。
Window_NovelMessage : [ノベルゲーム総合プラグイン]で使用されるノベルメッセージを表示するウィンドウです。
Window_NovelTitleCommand : [ノベルゲーム総合プラグイン]で使用されるノベルタイトルコマンドを表示するウィンドウです。
Window_NovelNumberInput : [ノベルゲーム総合プラグイン]で使用されるノベル数値入力を表示するウィンドウです。
Window_PauseMenu : [ノベルゲーム総合プラグイン]で使用されるポーズメニューを表示するウィンドウです。
Window_PasswordInput : [クロスセーブプラグイン]で使用されるパスワード入力を表示するウィンドウです。
Window_PasswordEdit : [クロスセーブプラグイン]で使用されるパスワードを表示するウィンドウです。
Window_GlossaryCategory : [用語辞典プラグイン]で使用される用語カテゴリを表示するウィンドウです。
Window_GlossaryList : [用語辞典プラグイン]で使用される用語リストを表示するウィンドウです。
Window_GlossaryConfirm : [用語辞典プラグイン]で使用される使用確認を表示するウィンドウです。
Window_GlossaryComplete : [用語辞典プラグイン]で使用される収集率を表示するウィンドウです。
Window_Glossary : [用語辞典プラグイン]で使用される用語を表示するウィンドウです。
Window_AudioCategory : [サウンドテストプラグイン]で使用されるオーディオカテゴリを表示するウィンドウです。
Window_AudioList : [サウンドテストプラグイン]で使用されるオーディオリストを表示するウィンドウです。
Window_AudioSetting : [サウンドテストプラグイン]で使用されるオーディオ設定を表示するウィンドウです。
Window_NumberInput : [数値入力画面プラグイン]で使用される数値入力を表示するウィンドウです。
Window_NumberEdit : [数値入力画面プラグイン]で使用される数値を表示するウィンドウです。
```

# ダウンロード
以下のURLからダウンロードできます。  
<https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/WindowBackImage.js>  

ダウンロード方法(Windowsの場合)  
1. リンク先に飛ぶ
1. 右クリック
1. 名前を付けて保存
1. ファイル名を変えずに、プロジェクトの「js/plugins」配下に配置

# 利用規約
当プラグインはMITライセンスのもとで公開されています。作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても制限はありません。このプラグインはもうあなたのものです。
- <http://opensource.org/licenses/mit-license.php>
- <https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/LICENSE.txt>
