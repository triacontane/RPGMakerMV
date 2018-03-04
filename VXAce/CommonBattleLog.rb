#==============================================================================
# ■ コモンバトルログ
#  CommonBattleLog.rb
#------------------------------------------------------------------------------
# 　スクリプトから任意のバトルログを表示できます。
# コモンイベントやバトルイベントで以下のスクリプトを実行してください。
#
# ログ「aaa」が出力されます。
# $game_temp.battle_log_text = "aaa"
#
# 出力されているログを消去します。
# $game_temp.battle_log_clear = true
#
#
# ●利用規約
#  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても
#  制限はありません。
#  このスクリプトはもうあなたのものです。
#-----------------------------------------------------------------------------
# (C)2015-2018 Triacontane
# This software is released under the MIT License.
# http://opensource.org/licenses/mit-license.php
#-----------------------------------------------------------------------------
# Version
# 1.0.0 2018/03/04 初版
# ----------------------------------------------------------------------------
# [Blog]   : https://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

class Game_Temp
  #--------------------------------------------------------------------------
  # ● 公開インスタンス変数
  #--------------------------------------------------------------------------
  attr_writer :battle_log_text  # バトルログテキスト
  attr_writer :battle_log_clear # バトルログクリア
  #--------------------------------------------------------------------------
  # ● コモンバトルログ更新
  #--------------------------------------------------------------------------
  def update_common_battle_log(log_window)
    if (@battle_log_text != nil)
      log_window.add_text(@battle_log_text)
      @battle_log_text = nil
    end
    if (@battle_log_clear)
      log_window.clear
      @battle_log_clear = false
    end
  end
end

class Scene_Battle < Scene_Base
  #--------------------------------------------------------------------------
  # ● メッセージ表示が終わるまでウェイト
  #--------------------------------------------------------------------------
  alias cbl_wait_for_message wait_for_message
  def wait_for_message
    cbl_wait_for_message
    $game_temp.update_common_battle_log(@log_window)
  end
end
