import * as React from "react";
import {useEffect, useState} from "react";
import {Animated, Text, View,} from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, {_containerStyle, _imageStyle} from "./SwitchButton.style";

const AnimatedRNBounceable = Animated.createAnimatedComponent(RNBounceable);

const MAIN_COLOR = "#f1bb7b";
const ORIGINAL_COLOR = "#fff";
const TINT_COLOR = "#f1bb7b";
const ORIGINAL_VALUE = 0;
const ANIMATED_VALUE = 1;


interface SwitchButtonProps {
    isActive: boolean,
    style?: any,
    imageStyle?: any,
    activeImageSource?: any,
    inactiveImageSource?: any,
    disabled?: boolean,
    disabledOnClick?: boolean,
    onPress?: (isActive: boolean) => void,
    onLongPress?: () => void,
    handleChange?: (isActive: boolean) => void,
    mainColor?: string,
    originalColor?: string,
    tintColor?: string,
    text?: string,
    textStyle?: any,
    textContainerStyle?: any,
    disableText?: boolean,
    sameTextColor?: boolean,
}

export default function SwitchButton(props: SwitchButtonProps) {
    const [interpolatedColor] = useState(new Animated.Value(ORIGINAL_VALUE));
    useEffect(() => {
        handleActiveState();
    }, [props.isActive])

    const handleActiveState = () => {
        props.isActive ? showFocusColor() : showOriginColor();
    };

    const showOriginColor = () => {
        Animated.timing(interpolatedColor, {
            duration: 350,
            toValue: ORIGINAL_VALUE,
            useNativeDriver: false,
        }).start();
    };

    const showFocusColor = () => {
        Animated.timing(interpolatedColor, {
            duration: 450,
            toValue: ANIMATED_VALUE,
            useNativeDriver: false,
        }).start();
    };

    const handlePress = () => {
        if (!props.disabledOnClick) {
            let active = !props.isActive
            props.handleChange && props.handleChange(active);
            active ? showFocusColor() : showOriginColor();
            props.onPress && props.onPress(active);
        }
    };

    const handleLongPress = () => {
        props.onLongPress && props.onLongPress();
    };

    /* -------------------------------------------------------------------------- */
    /*                               Render Methods                               */
    /* -------------------------------------------------------------------------- */

    const renderBounceableButton = () => {
        const {
            style,
            imageStyle,
            activeImageSource,
            inactiveImageSource,
        } = props;
        const mainColor = props.mainColor || MAIN_COLOR;
        const originalColor = props.originalColor || ORIGINAL_COLOR;
        const tintColor = props.tintColor || TINT_COLOR;
        let animatedBackgroundColor = interpolatedColor.interpolate({
            inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
            outputRange: [originalColor, mainColor],
        });
        let animatedTintColor = interpolatedColor.interpolate({
            inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
            outputRange: [tintColor, originalColor],
        });
        return (
            <AnimatedRNBounceable
                style={[_containerStyle(animatedBackgroundColor), style]}
                onPress={handlePress}
                onLongPress={handleLongPress}
                disabled={props.disabled}
            >
                <Animated.Image
                    source={props.isActive ? activeImageSource : inactiveImageSource}
                    style={[_imageStyle(animatedTintColor), imageStyle]}
                />
            </AnimatedRNBounceable>
        );
    };

    const renderText = () => {
        const {text, textStyle, textContainerStyle} = props;
        if (props.disableText) {
            return null;
        }

        if (props.sameTextColor) {
            let mainColor = props.mainColor || MAIN_COLOR;
            let tintColor = props.tintColor || TINT_COLOR;
            const animatedTextColor = interpolatedColor.interpolate({
                inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
                outputRange: [tintColor, mainColor]
            });
            return <Animated.View style={[styles.textContainerStyle, textContainerStyle]}>
                <Animated.Text style={{...(textStyle as object), color: animatedTextColor}}>{text}</Animated.Text>
            </Animated.View>;
        }

        return <View style={[styles.textContainerStyle, textContainerStyle]}>
            <Text style={textStyle}>{text}</Text>
        </View>;
    };
    return (
        <View style={styles.container}>
            {renderBounceableButton()}
            {renderText()}
        </View>
    );
}
