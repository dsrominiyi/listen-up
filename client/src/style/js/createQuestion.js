import { 
  HEX_WHITE, 
  HEX_GREY, 
  HEX_DARK_GREY,
  HEX_GREEN,
  HEX_RED
} from '../../constants/style';

const gradientBlack = {
  backgroundColor: '#2c2e31',
  backgroundImage: 'repeating-radial-gradient(ellipse farthest-corner at left top,rgb(78, 82, 92) 0%,rgb(31, 31, 31) 67.2%,rgb(23, 23, 23) 74.6%,rgb(23, 23, 23) 100%,rgb(56, 56, 56) 100%)'
};

export const tabItemContainerStyle = {
  ...gradientBlack
};

export const inkBarStyle = {
  backgroundColor: HEX_WHITE,
  color: HEX_WHITE
};

export const textFieldStyle = {
  color: HEX_WHITE
};

export const floatingLabelStyle = {
  color: HEX_GREY
};

export const underlineFocusStyle = {
  borderColor: HEX_WHITE
};

export const underlineStyle = {
  borderColor: HEX_DARK_GREY
};

export const hintStyle = {
  color: HEX_DARK_GREY
};

export const labelStyle = (disabled, showErrors) => ({
  fontSize: '18px',
  color: disabled 
    ? (showErrors ? HEX_RED : HEX_DARK_GREY) 
    : HEX_GREEN
});