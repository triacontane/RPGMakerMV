#==============================================================================
# ■ 敵グループ限界突破
#  TroopUnlimited.rb
#------------------------------------------------------------------------------
# 　エディタ上の最大値である8体を超える数の敵キャラを
# 一度に出現させることができるようになります。
#
# ●使い方
#
# 敵グループの「名前」に以下の内容を含めてください。
# \add[3] # 本来の敵キャラに追加してID[3]の「敵グループ」に
# 指定された敵キャラが初期配置で追加されます。
#
# さらに追加したい場合はその分だけ\add[n]を記述してください。
#
# 追加されるのは敵キャラのみです。バトルイベント等には
# 影響を与えません。
#
# ●利用規約
#  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても
#  制限はありません。
#  このスクリプトはもうあなたのものです。
#-----------------------------------------------------------------------------
# Copyright (c) 2017 Triacontane
# This software is released under the MIT License.
# http://opensource.org/licenses/mit-license.php
#-----------------------------------------------------------------------------
# Version
# 1.0.0 2017/02/21 初版
# ----------------------------------------------------------------------------
# [Blog]   : http://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

class Game_Troop < Game_Unit
  #--------------------------------------------------------------------------
  # ● セットアップ
  #--------------------------------------------------------------------------
  alias tu_setup setup
  def setup(troop_id)
    make_additional_enemies(troop_id)
    tu_setup(troop_id)
    if @additional_enemies.length > 0
      @enemies.concat(@additional_enemies)
    end
    remake_unique_names
  end
  #--------------------------------------------------------------------------
  # ● 追加用の敵グループ情報を作成
  #--------------------------------------------------------------------------
  def make_additional_enemies(troop_id)
    @additional_enemies = []
    @troop_id = troop_id
    troop.name.gsub!(/\\add\[(\d+)\]/i) do
      tu_setup($1.to_i)
      @additional_enemies.concat(@enemies)
    end
  end
  #--------------------------------------------------------------------------
  # ● 敵キャラの識別名を再度付与
  #--------------------------------------------------------------------------
  def remake_unique_names
    members.each do |enemy|
      @names_count.delete(enemy.original_name)
      enemy.letter = ""
      enemy.plural = false
    end
    make_unique_names
  end
end
