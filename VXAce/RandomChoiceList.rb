#==============================================================================
# ■ ランダム選択肢
#  RandomChoiceList.rb
#------------------------------------------------------------------------------
# 　指定したスイッチがONの間、選択肢の並び順がランダムになります。
#
# ●使い方
# 1. 任意のスイッチをONにする
# 2. 選択肢の表示を実行する
#
# ●利用規約
#  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても
#  制限はありません。
#  このスクリプトはもうあなたのものです。
#-----------------------------------------------------------------------------
# Copyright (c) 2016 Triacontane
# This software is released under the MIT License.
# http://opensource.org/licenses/mit-license.php
#-----------------------------------------------------------------------------
# Version
# 1.0.0 2016/11/22 初版
# ----------------------------------------------------------------------------
# [Blog]   : http://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

module Triac
  # ランダム選択肢を有効にするスイッチ番号
  RandomChoiceTriggerSwitch = 1
end

#==============================================================================
# ■ Window_ChoiceList
#==============================================================================

class Window_ChoiceList < Window_Command
  #--------------------------------------------------------------------------
  # ● コマンドリストの作成
  #--------------------------------------------------------------------------
  alias rcts_make_command_list make_command_list
  def make_command_list
    if $game_switches[Triac::RandomChoiceTriggerSwitch]
      @random_sort = (0...$game_message.choices.size).to_a.sort_by{rand}
      @random_sort.each do |index|
        add_command($game_message.choices[index], :choice)
      end
    else
      rcts_make_command_list
    end
  end
  #--------------------------------------------------------------------------
  # ● 決定ハンドラの呼び出し
  #--------------------------------------------------------------------------
  alias rcts_call_ok_handler call_ok_handler
  def call_ok_handler
    if $game_switches[Triac::RandomChoiceTriggerSwitch]
      $game_message.choice_proc.call(@random_sort[index])
      close
    else
      rcts_call_ok_handler
    end
  end
end

