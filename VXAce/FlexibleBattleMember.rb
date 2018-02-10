#==============================================================================
# ■ 可変バトルメンバー
#  FlexibleBattleMember.rb
#------------------------------------------------------------------------------
# 　戦闘参加メンバーをゲーム中に変更できます。指定された変数に値を入れてください。
#
# ●使い方
# 1. Flexible_Battle_Member::VARIABLE_IDを任意の変数番号に変更します。(初期値1)
# 2. 戦闘参加メンバーを変えたいときだけ1.の変数に値を代入します。
# 3. 1.の変数を0に戻すと、通常のメンバー数に戻ります。
#
# ●利用規約
#  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても
#  制限はありません。
#  このスクリプトはもうあなたのものです。
#-----------------------------------------------------------------------------
# (c) 2015-2018 Triacontane
# This software is released under the MIT License.
# http://opensource.org/licenses/mit-license.php
#-----------------------------------------------------------------------------
# Version
# 1.0.0 2018/02/10 初版
# ----------------------------------------------------------------------------
# [Blog]   : https://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

module Flexible_Battle_Member
  # バトルメンバーの数が代入される変数の番号
  VARIABLE_ID = 1
end

class Game_Party < Game_Unit
  #--------------------------------------------------------------------------
  # ● バトルメンバーの最大数を取得
  #--------------------------------------------------------------------------
  alias fbm_max_battle_members max_battle_members
  def max_battle_members
    id = Flexible_Battle_Member::VARIABLE_ID
    return $game_variables[id] > 0 ? $game_variables[id] : fbm_max_battle_members
  end
end

