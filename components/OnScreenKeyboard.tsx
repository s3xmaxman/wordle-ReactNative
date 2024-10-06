import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

const OnScreenKeyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyboardProps) => {
  return (
    <View>
      <Text>OnScreenKeyboard</Text>
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 6,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
