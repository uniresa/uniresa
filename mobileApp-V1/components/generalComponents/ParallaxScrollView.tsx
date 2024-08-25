import type { PropsWithChildren, ReactElement } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

const HEADER_HEIGHT = 120;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  notificationIcon?: ReactElement;
  headerBackgroundColor: string;
  closingButton?: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  notificationIcon,
  closingButton,
  headerBackgroundColor,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View className="flex flex-col">
      <Animated.ScrollView ref={scrollRef}>
        <Animated.View
          className={`h-[60px] overflow-hidden items-center justify-center ${headerBackgroundColor}`}
        >
          {closingButton}
          {headerImage}
          {notificationIcon}
        </Animated.View>
        <View className="h-full flex-1 py-4 gap-4 overflow-hidden">
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
