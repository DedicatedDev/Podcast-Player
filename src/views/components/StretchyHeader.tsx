import * as React from 'react';
import { View, StyleSheet, Animated, ImageSourcePropType } from 'react-native';
import { deviceV, DEVICE_WIDTH } from '../../utils/const/const';


export const animatedValueScrollY = new Animated.Value(0);

interface StretchableHeaderProps {
    headerImageHeight: number;
    headerImageSource: ImageSourcePropType;
    contentView: React.ReactElement;
}

const StretchyHeader = (props: StretchableHeaderProps) => {
    const animatedScrollValue = animatedValueScrollY;
    const headerImageHeight = props.headerImageHeight
        ? 230*deviceV/DEVICE_WIDTH
        : props.headerImageHeight;
    return (
        <View>
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: animatedScrollValue } } }],
                    { useNativeDriver: true }
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <View style={styles.headerContainer}>
                    <Animated.Image
                        style={getHeaderStyle(animatedScrollValue, headerImageHeight)}
                        source={props.headerImageSource}
                    />
                    {props.contentView}
                </View>
            </Animated.ScrollView>
        </View>
    );
};

const getHeaderStyle = (
    scrollAnimatedValue: Animated.Value,
    headerImageHeight: number
) => {
    return {
        height: headerImageHeight,
        width: '100%',
        transform: [
            {
                translateY: scrollAnimatedValue.interpolate({
                    inputRange: [
                        -headerImageHeight,
                        0,
                        headerImageHeight,
                        headerImageHeight + 1,
                    ],
                    outputRange: [
                        -headerImageHeight / 2,
                        1,
                        0,
                        0,
                    ],
                }),
            },
            {
                scale: scrollAnimatedValue.interpolate({
                    inputRange: [
                        -headerImageHeight,
                        0,
                        headerImageHeight,
                        headerImageHeight + 1,
                    ],
                    outputRange: [2, 1, 1, 1],
                }),
            },
        ],
    };
};

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: -1001,
        paddingTop: 1000,
        alignItems: 'center',
        overflow: 'hidden',
    },
});

export default StretchyHeader;