import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';
import Color from '../constants/Color.js';

export default {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Raleway, sans-serif',
  palette: {
    primary1Color: Color.CAMPAIYN_PRIMARY,
    primary2Color: Color.CAMPAIYN_SECONDARY,
    primary3Color: Colors.lightBlack,
    accent1Color: Color.CAMPAIYN_ACCENT1,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.CAMPAIYN_PRIMARY
  }
};
