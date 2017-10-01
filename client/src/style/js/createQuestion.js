import { HEX_WHITE } from '../../constants/style';

const gradientBlack = {
  backgroundColor: '#2c2e31',
  backgroundImage: 'repeating-radial-gradient(ellipse farthest-corner at left top,rgb(78, 82, 92) 0%,rgb(31, 31, 31) 67.2%,rgb(23, 23, 23) 74.6%,rgb(23, 23, 23) 100%,rgb(56, 56, 56) 100%)'
};

export const tabItemContainerStyle = {
  ...gradientBlack
};

export const inkBarStyle = {
  backgroundColor: HEX_WHITE
};