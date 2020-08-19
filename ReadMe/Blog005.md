　RPGツクールMZの発売おめでとうございます！　本項ではRPGツクールMZ(以下MZ)のプラグイン制作について、移植やRPGツクールMV(以下MV)プラグインの両立に関する方針の説明と、各種資料の提示を行います。

# 自作のプラグインについて
## 動作確認済みのプラグイン
　MVプラグインをMZ向けに移植し動作確認したプラグイン、もしくは新規にMZ向けに作成したプラグインはこちらに配置します。これらはすぐにMZで使用可能です。ライセンスは引き続き全て『MITライセンス』となります。

<https://docs.google.com/spreadsheets/d/1BnTyJr3Z1WoW4FMKtvKaICl4SQ5ehL5RxTDSV81oVQc/edit#gid=1411848872>

　公式プラグイン『PluginCommonBase.js』をベースプラグイン指定している場合があります。その場合は当該プラグインを先に適用してください。

## 動作確認していないプラグイン
　MVプラグインに@targetアノテーションを機械的に付与したプラグインを以下に配置しました。対象は現在公開しているすべてのMVプラグインです。これらはMZで動作するとは限らないのでご注意ください。移植に関してリクエストがあれば随時受け付けますが、対応時期についてはお約束できません。

　また、もし上記のシートにないプラグインでMZでの正常な動作が確認できたプラグインがあればぜひご一報ください。シートに追加します。

<https://github.com/triacontane/RPGMakerMV/tree/mz_master>

## リポジトリの運用方針(プラグイン開発者向け)
　MZプラグインは、従来のMVプラグインから派生させた『mz_master』ブランチで運用します。双方のブランチで軽微な修正が入った場合は、cherry-pickでもう片方のブランチに反映させます。ただし差分が拡大したプラグインは反映を断念する場合があります。

　Pull Requestを頂ける場合は、マージ先のブランチを間違わないようお願いします。

- MZプラグインの『mz_master』ブランチ  
<https://github.com/triacontane/RPGMakerMV/tree/mz_master>

- MVプラグインの『master』ブランチ  
<https://github.com/triacontane/RPGMakerMV>

# 公式プラグインについて
　私が作成した公式プラグインについては、GitHub上での公開は行いません。本体に付属しているのでそちらからご利用ください。公式プラグインの紹介記事はこちらです。

<https://triacontane.blogspot.com/2020/08/rpgmz.html>

# MZの非公式スクリプトリファレンス
　公式プラグインおよびプラグイン講座作成に際して、非公式のスクリプトリファレンスを作成しました。データベースやゲームデータへのアクセス方法やイベントコード、特徴コードなどをまとめています。

<https://docs.google.com/spreadsheets/d/1aqY-xzFqT0vnZE-OkfsMYsP9Ud91vWTrBLU-uDkJ-Ls/edit#gid=270496334>