#==============================================================================
# ■ 計算式拡張
#  FormulaExtend.rb
#------------------------------------------------------------------------------
# 　計算式から使用できる関数群です。要望により随時追加します。
#
# ●使い方
# 1. スキルの計算式から呼び出します。例(a.plus_atk)
#
# ●関数一覧
#  1. plus_atk(percent, value)
#   [percent]の確率で元の攻撃力に[value]を加算して計算します。
#  ex:a.plus_atk(50, 100) # 50%の確率で実行者の攻撃力を100加算します。
#
#  2. plus_def(percent, value)
#   [percent]の確率で元の防御力に[value]を加算して計算します。
#  ex:b.plus_def(30, -100) # 30%の確率で対象者の防御力を100減算します。
#
#  3. plus_mat(percent, value)
#   [percent]の確率で元の魔法力に[value]を加算して計算します。
#
#  4. plus_mdf(percent, value)
#   [percent]の確率で元の魔法防御力に[value]を加算して計算します。
#
#  5. plus_agi(percent, value)
#   [percent]の確率で元の敏捷性に[value]を加算して計算します。
#
#  6. plus_luk(percent, value)
#   [percent]の確率で元の運に[value]を加算して計算します。
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
# 1.0.0 2017/01/28 初版
# ----------------------------------------------------------------------------
# [Blog]   : http://triacontane.blogspot.jp/
# [Twitter]: https://twitter.com/triacontane/
# [GitHub] : https://github.com/triacontane/
#=============================================================================

class Game_Battler < Game_BattlerBase
  #--------------------------------------------------------------------------
  # ● 追加パラメータ
  #--------------------------------------------------------------------------
  def plus_param(original, percent, adjustment)
    return [original + (rand(100) < percent ? adjustment : 0), 0].max
  end
  #--------------------------------------------------------------------------
  # ● 追加攻撃力
  #--------------------------------------------------------------------------
  def plus_atk(percent, adjustment)
    return plus_param(self.atk, percent, adjustment)
  end
  #--------------------------------------------------------------------------
  # ● 追加防御力
  #--------------------------------------------------------------------------
  def plus_def(percent, adjustment)
    return plus_param(self.def, percent, adjustment)
  end
  #--------------------------------------------------------------------------
  # ● 追加魔法力
  #--------------------------------------------------------------------------
  def plus_mat(percent, adjustment)
    return plus_param(self.mat, percent, adjustment)
  end
  #--------------------------------------------------------------------------
  # ● 追加魔法防御力
  #--------------------------------------------------------------------------
  def plus_mdf(percent, adjustment)
    return plus_param(self.mdf, percent, adjustment)
  end
  #--------------------------------------------------------------------------
  # ● 追加敏捷性
  #--------------------------------------------------------------------------
  def plus_agi(percent, adjustment)
    return plus_param(self.agi, percent, adjustment)
  end
  #--------------------------------------------------------------------------
  # ● 追加運
  #--------------------------------------------------------------------------
  def plus_luk(percent, adjustment)
    return plus_param(self.luk, percent, adjustment)
  end
end
