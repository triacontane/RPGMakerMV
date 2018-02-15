#==============================================================================
# ■ 地形による速度変化スクリプト
#  MoveSpeedChangeByRegion.rb
#------------------------------------------------------------------------------
# 　指定した地形もしくはリージョンに乗っている間だけキャラクターの移動速度を
# 自動的に上昇もしくは低下させます。
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
# 1.0.0 2018/02/15 初版
# ----------------------------------------------------------------------------
# [Blog]   : https://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

module Move_Speed_Change_By_Region
  # 移動速度低下地形(カンマ区切りで数値を指定)
  SLOWLY_TERRAIN_TAGS = [1]
  # 移動速度上昇地形(カンマ区切りで数値を指定)
  FASTER_TERRAIN_TAGS = [2]
  # 移動速度低下リージョン(カンマ区切りで数値を指定)
  SLOWLY_REGIONS = [1]
  # 移動速度上昇リージョン(カンマ区切りで数値を指定)
  FASTER_REGIONS = [2]
  # 速度変化量
  DELTA_SPEED = 1
end

class Game_CharacterBase
  #--------------------------------------------------------------------------
  # ● 移動速度の取得（ダッシュを考慮）
  #--------------------------------------------------------------------------
  alias mscbr_real_move_speed real_move_speed
  def real_move_speed
    mscbr_real_move_speed + change_speed_by_terrain_tags + change_speed_by_region
  end

  #--------------------------------------------------------------------------
  # ● 地形による移動速度変化量の取得
  #--------------------------------------------------------------------------
  def change_speed_by_terrain_tags
    tag = self.terrain_tag
    if (Move_Speed_Change_By_Region::SLOWLY_TERRAIN_TAGS.include?(tag))
      return -Move_Speed_Change_By_Region::DELTA_SPEED
    end
    if (Move_Speed_Change_By_Region::FASTER_TERRAIN_TAGS.include?(tag))
      return Move_Speed_Change_By_Region::DELTA_SPEED
    end
    return 0
  end

  #--------------------------------------------------------------------------
  # ● リージョンによる移動速度変化量の取得
  #--------------------------------------------------------------------------
  def change_speed_by_region
    region_id = self.region_id
    if (Move_Speed_Change_By_Region::SLOWLY_REGIONS.include?(region_id))
      return -Move_Speed_Change_By_Region::DELTA_SPEED
    end
    if (Move_Speed_Change_By_Region::FASTER_REGIONS.include?(region_id))
      return Move_Speed_Change_By_Region::DELTA_SPEED
    end
    return 0
  end
end

class Game_Follower
  #--------------------------------------------------------------------------
  # ● 移動速度の取得（ダッシュを考慮）
  #--------------------------------------------------------------------------
  def real_move_speed
    @move_speed
  end
end
