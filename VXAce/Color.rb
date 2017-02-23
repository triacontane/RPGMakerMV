#==============================================================================
# ■ Color
#------------------------------------------------------------------------------
# 　色を扱うクラスです。
#==============================================================================

class Color
  #--------------------------------------------------------------------------
  # ● 色相の取得
  #--------------------------------------------------------------------------
  def hue
    return self.rgb_to_hsv[0]
  end
  #--------------------------------------------------------------------------
  # ● 彩度の取得
  #--------------------------------------------------------------------------
  def saturation
    return self.rgb_to_hsv[1]
  end
  #--------------------------------------------------------------------------
  # ● 明度の取得
  #--------------------------------------------------------------------------
  def value
    return self.rgb_to_hsv[2]
  end
  #--------------------------------------------------------------------------
  # ● 色相の設定
  #--------------------------------------------------------------------------
  def hue=(hue)
    hsv = self.rgb_to_hsv
    hsv[0] = hue
    rgb = self.hsv_to_rgb(hsv[0], hsv[1], hsv[2])
    self.set(rgb[0], rgb[1], rgb[2], self.alpha)
  end
  #--------------------------------------------------------------------------
  # ● 彩度の設定
  #--------------------------------------------------------------------------
  def saturation=(saturation)
    hsv = self.rgb_to_hsv
    hsv[1] = saturation
    rgb = self.hsv_to_rgb(hsv[0], hsv[1], hsv[2])
    self.set(rgb[0], rgb[1], rgb[2], self.alpha)
  end
  #--------------------------------------------------------------------------
  # ● 明度の設定
  #--------------------------------------------------------------------------
  def value=(value)
    hsv = self.rgb_to_hsv
    hsv[2] = value
    rgb = self.hsv_to_rgb(hsv[0], hsv[1], hsv[2])
    self.set(rgb[0], rgb[1], rgb[2], self.alpha)
  end
  #--------------------------------------------------------------------------
  # ● HSV の値を一度に設定
  #--------------------------------------------------------------------------
  def set_hsv(hue, saturation, value, alpha=self.alpha)
    hue = self.hue               if hue.nil?
    saturation = self.saturation if saturation.nil?
    value = self.value           if value.nil?
    rgb = self.hsv_to_rgb(hue, saturation, value)
    self.set(rgb[0], rgb[1], rgb[2], alpha)
  end
  #--------------------------------------------------------------------------
  # ● RGB の値を一度に設定
  #--------------------------------------------------------------------------
  def set_rgb(red, green, blue, alpha=self.alpha)
    red = self.red               if red.nil?
    green = self.green           if green.nil?
    blue = self.value            if blue.nil?
    self.set(red, green, blue, alpha)
  end
  #--------------------------------------------------------------------------
  # ● HSV の値を元に RGB の値を計算して返す
  #--------------------------------------------------------------------------
  def hsv_to_rgb(hue, saturation, value)
    # 範囲外の値を修正
    hue = 0           if hue < 0
    hue = 359         if hue > 359
    saturation = 0    if saturation < 0
    saturation = 255  if saturation > 255
    value = 0         if value < 0
    value = 255       if value > 255
    if saturation == 0
      # 彩度が 0 の場合はグレースケール
      red = value
      green = value
      blue = value
    else
      ht = hue * 6
      d = ht % 360
      t1 = value * (255 - saturation) / 255
      t2 = value * (255 - saturation * d / 360) / 255
      t3 = value * (255 - saturation * (360 - d) / 360) / 255
      case ht / 360
      when 0
        red = value; green = t3; blue = t1
      when 1
        red = t2; green = value; blue = t1
      when 2
        red = t1; green = value; blue = t3
      when 3
        red = t1; green = t2; blue = value
      when 4
        red = t3; green = t1; blue = value
      else
        red = value; green = t1; blue = t2
      end
    end
    return [red, green, blue]
  end
  #--------------------------------------------------------------------------
  # ● RGB の値を元に HSV の値を計算して返す
  #--------------------------------------------------------------------------
  def rgb_to_hsv(red=self.red, green=self.green, blue=self.blue)
    # 範囲外の値を修正
    red = 0      if red < 0
    red = 359    if red > 359
    green = 0    if green < 0
    green = 255  if green > 255
    blue = 0     if blue < 0
    blue = 255   if blue > 255
    cmax = [red, green, blue].max
    cmin = [red, green, blue].min
    hue = 0; saturation = 0; value = 0
    if cmax != 0
      saturation = 255 * (cmax - cmin) / cmax
      if saturation != 0
        r = (cmax - red).to_f / (cmax - cmin)
        g = (cmax - green).to_f / (cmax - cmin)
        b = (cmax - blue).to_f / (cmax - cmin)
        case cmax
        when red
          hue = (60 * (b - g)).round
        when green
          hue = (60 * (2 + r - b)).round
        when blue
          hue = (60 * (4 + g - r)).round
        end
        hue += 360 if hue < 0
      end
      value = cmax
    end
    return [hue, saturation, value]
  end
  #--------------------------------------------------------------------------
  # ● 半透明化して返す
  #--------------------------------------------------------------------------
  def through
    return Color.new(self.red, self.green, self.blue, self.alpha / 2)
  end
  #--------------------------------------------------------------------------
  # ● 明度を４分の１にして返す
  #--------------------------------------------------------------------------
  def dark
    return Color_Hsv.new(self.hue, self.saturation, self.value / 4, self.alpha)
  end
  #--------------------------------------------------------------------------
  # ● グレースケール化して返す
  #--------------------------------------------------------------------------
  def grayscale
    return Color_Hsv.new(self.hue, 0, self.value, self.alpha)
  end
  #--------------------------------------------------------------------------
  # ● HSV で値を指定したカラーオブジェクトを返す
  #--------------------------------------------------------------------------
  def self.new_hsv(hue, saturation, value, alpha=255)
    color = Color.new(0, 0, 0, 0).set_hsv(hue, saturation, value, alpha)
    return color
  end
  #--------------------------------------------------------------------------
  # ● 色を取得
  #--------------------------------------------------------------------------
  def self.get(color_name)
    color = Color.new(0, 0, 0)
    case color_name
    when "disable"
      color.set_rgb(211, 211, 211, 128)
    when "shadow"
      color.set_rgb(64, 64, 64, 128)
    when "warning"
      color.set_hsv(348, 255, 168)
    when "black"
      color.set_rgb(0, 0, 0)
    when "blue"
      color.set_rgb(0, 0, 192)
    when "red"
      color.set_rgb(192, 0, 0)
    when "green"
      color.set_rgb(0, 192, 0)
    when "magenta"
      color.set_rgb(192, 0, 192)
    when "yellow"
      color.set_rgb(192, 192, 0)
    when "cyan"
      color.set_rgb(0, 192, 192)
    when "white"
      color.set_rgb(255, 255, 255)
    end
    return color
  end
end
