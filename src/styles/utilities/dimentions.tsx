import { Dimensions, Platform, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const phoneScale = SCREEN_WIDTH / 320;
const tabletScale = SCREEN_WIDTH < SCREEN_HEIGHT ? 1.2 : 1.33;

// based on iphone 6 scale
const STANDARD_WIDTH = DeviceInfo.isTablet()? 1440:360;
const STANDARD_HEIGHT = DeviceInfo.isTablet()?1156:SCREEN_HEIGHT;

const ScaleHeight = SCREEN_HEIGHT / STANDARD_HEIGHT;
const ScaleWidth = SCREEN_WIDTH / STANDARD_WIDTH;

const CURRENT_WIDTH = SCREEN_WIDTH;
const K = CURRENT_WIDTH / STANDARD_WIDTH;

export function normalize(size:any) {
    const isTablet = SCREEN_WIDTH >= 600;
    const scale = isTablet ? tabletScale : phoneScale;
  
    const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export const scaleWidth = (width:any) => Math.round(width * ScaleWidth);
export const scaleHeight = (height:any) => Math.round(height * ScaleHeight);