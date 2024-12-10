import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Check for iOS platform to trigger haptic feedback
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Ensure the original onPressIn function is called if it exists
        if (props.onPressIn) {
          props.onPressIn(ev);
        }
      }}
    />
  );
}

