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
# (C)2015-2018 Triacontane
# This software is released under the MIT License.
# http://opensource.org/licenses/mit-license.php
#-----------------------------------------------------------------------------
# Version
# 1.0.1 2018/03/05 地形タグやリージョンごとに変化量や有効スイッチを
#                  個別設定できる機能を追加
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
  # 速度変化量(デフォルト)
  DELTA_SPEED = 1
  # 地形タグごとの速度変化量(キー:タグ 値:変化量のハッシュで定義)
  DELTA_SPEED_FOR_TERRAIN_TAGS = {1=>2, 2=>2}
  # リージョンごとの速度変化量(キー:リージョン 値:変化量のハッシュで定義)
  DELTA_SPEED_FOR_REGIONS = {1=>2, 2=>3}
  # 地形タグごとの有効スイッチ(キー:タグ 値:スイッチIDのハッシュで定義)
  SWITCHES_FOR_TERRAIN_TAGS = {1=>1, 2=>1}
  # リージョンごとの有効スイッチ(キー:リージョン 値:スイッチIDのハッシュで定義)
  SWITCHES_FOR_REGIONS = {1=>1, 2=>1}
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
  # ● 地形による移動速度を適用
  #--------------------------------------------------------------------------
  def change_speed_by_terrain_tags
    tag = self.terrain_tag
    if not change_by_terrain_tags?(tag)
      return 0
    end
    if Move_Speed_Change_By_Region::SLOWLY_TERRAIN_TAGS.include?(tag)
      return -get_speed_by_terrain_tags(tag)
    end
    if Move_Speed_Change_By_Region::FASTER_TERRAIN_TAGS.include?(tag)
      return get_speed_by_terrain_tags(tag)
    end
    return 0
  end
  #--------------------------------------------------------------------------
  # ● 地形による移動速度変化量の取得
  #--------------------------------------------------------------------------
  def get_speed_by_terrain_tags(tag)
    speed = Move_Speed_Change_By_Region::DELTA_SPEED_FOR_TERRAIN_TAGS[tag]
    if speed > 0
      return speed
    else
      return Move_Speed_Change_By_Region::DELTA_SPEED
    end
  end
  #--------------------------------------------------------------------------
  # ● 地形による速度変化有効判定
  #--------------------------------------------------------------------------
  def change_by_terrain_tags?(tag)
    switch_id = Move_Speed_Change_By_Region::SWITCHES_FOR_TERRAIN_TAGS[tag]
    return switch_id != nil ? $game_switches[switch_id] : true
  end
  #--------------------------------------------------------------------------
  # ● リージョンによる移動速度を適用
  #--------------------------------------------------------------------------
  def change_speed_by_region
    region_id = self.region_id
    if not change_by_region?(region_id)
      return 0
    end
    if Move_Speed_Change_By_Region::SLOWLY_REGIONS.include?(region_id)
      return -get_speed_by_regions(region_id)
    end
    if Move_Speed_Change_By_Region::FASTER_REGIONS.include?(region_id)
      return get_speed_by_regions(region_id)
    end
    return 0
  end
  #--------------------------------------------------------------------------
  # ● リージョンによる移動速度変化量の取得
  #--------------------------------------------------------------------------
  def get_speed_by_regions(region_id)
    speed = Move_Speed_Change_By_Region::DELTA_SPEED_FOR_REGIONS[region_id]
    if speed > 0
      return speed
    else
      return Move_Speed_Change_By_Region::DELTA_SPEED
    end
  end
  #--------------------------------------------------------------------------
  # ● リージョンによる速度変化有効判定
  #--------------------------------------------------------------------------
  def change_by_region?(region_id)
    switch_id = Move_Speed_Change_By_Region::SWITCHES_FOR_REGIONS[region_id]
    return switch_id != nil ? $game_switches[switch_id] : true
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
