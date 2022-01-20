import * as React from "react";
import {
  View,
  Text,
  Animated,
  ViewStyle,
  StyleProp,
  TextStyle,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, { _containerStyle, _imageStyle } from "./SwitchButton.style";

const AnimatedRNBounceable = Animated.createAnimatedComponent(RNBounceable);

const MAIN_COLOR = "#f1bb7b";
const ORIGINAL_COLOR = "#fff";
const TINT_COLOR = "#f1bb7b";
const ORIGINAL_VALUE = 0;
const ANIMATED_VALUE = 1;

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;
type CustomTextStyleProp = StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
type CustomImageStyleProp =
  | StyleProp<ImageStyle>
  | Array<StyleProp<ImageStyle>>;

interface ISwitchButtonProps {
  style?: CustomStyleProp;
  textStyle?: CustomTextStyleProp;
  imageStyle?: CustomImageStyleProp;
  textContainerStyle?: CustomTextStyleProp;
  activeImageSource: ImageSourcePropType;
  inactiveImageSource: ImageSourcePropType;
  text?: string;
  mainColor?: string;
  tintColor?: string;
  sameTextColor?: boolean;
  isActive?: boolean;
  disableText?: boolean;
  originalColor?: string;
  onPress: (isActive: boolean) => void;
}

interface IState {
  isActive: boolean;
}

export default class SwitchButton extends React.Component<
  ISwitchButtonProps,
  IState
> {
  interpolatedColor: Animated.Value;

  constructor(props: ISwitchButtonProps) {
    super(props);
    this.interpolatedColor = new Animated.Value(ORIGINAL_VALUE);
    this.state = {
      isActive: false,
    };
  }

  componentDidMount() {
    this.handleActiveState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive !== this.state.isActive) {
      this.setState({ isActive: nextProps.isActive });
    }
  }

  handleActiveState = () => {
    if (this.props.isActive) {
      this.setState({ isActive: !this.state.isActive }, () => {
        this.state.isActive ? this.showFocusColor() : this.showOriginColor();
      });
    }
  };

  showOriginColor = () => {
    Animated.timing(this.interpolatedColor, {
      duration: 350,
      toValue: ORIGINAL_VALUE,
      useNativeDriver: false,
    }).start();
  };

  showFocusColor = () => {
    Animated.timing(this.interpolatedColor, {
      duration: 450,
      toValue: ANIMATED_VALUE,
      useNativeDriver: false,
    }).start();
  };

  handlePress = () => {
    this.setState({ isActive: !this.state.isActive }, () => {
      this.state.isActive ? this.showFocusColor() : this.showOriginColor();
      this.props.onPress && this.props.onPress(this.state.isActive);
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  renderBounceableButton = () => {
    const {
      style,
      imageStyle,
      activeImageSource,
      inactiveImageSource,
    } = this.props;
    const mainColor = this.props.mainColor || MAIN_COLOR;
    const originalColor = this.props.originalColor || ORIGINAL_COLOR;
    const tintColor = this.props.tintColor || TINT_COLOR;
    const _animatedBGColorOutputRange = this.state.isActive
      ? [mainColor, originalColor]
      : [originalColor, mainColor];
    const _animatedTintColorOutputRange = this.state.isActive
      ? [originalColor, tintColor]
      : [tintColor, originalColor];
    let animatedBackgroundColor = this.interpolatedColor.interpolate({
      inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
      outputRange: [originalColor, mainColor],
    });
    let animatedTintColor = this.interpolatedColor.interpolate({
      inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
      outputRange: [tintColor, originalColor],
    });
    return (
      <AnimatedRNBounceable
        style={[_containerStyle(animatedBackgroundColor), style]}
        onPress={this.handlePress}
      >
        <Animated.Image
          source={this.props.isActive ? activeImageSource : inactiveImageSource}
          style={[_imageStyle(animatedTintColor), imageStyle]}
        />
      </AnimatedRNBounceable>
    );
  };

  renderText = () => {
    const { text, textStyle, textContainerStyle } = this.props;
    if (this.props.disableText) {
      return null;
    }

    if (this.props.sameTextColor) {
      let mainColor = this.props.mainColor || MAIN_COLOR;
      let tintColor = this.props.tintColor || TINT_COLOR;
      const animatedTextColor = this.interpolatedColor.interpolate({
        inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
        outputRange: [tintColor, mainColor]
      });
      return <Animated.View style={[styles.textContainerStyle, textContainerStyle]}>
        <Animated.Text style={{ ...(textStyle as object), color: animatedTextColor }}>{text}</Animated.Text>
      </Animated.View>;
    }

    return <View style={[styles.textContainerStyle, textContainerStyle]}>
      <Text style={textStyle}>{text}</Text>
    </View>;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderBounceableButton()}
        {this.renderText()}
      </View>
    );
  }
}
