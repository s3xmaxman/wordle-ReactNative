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

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];

const OnScreenKeyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();
  const keyWidth = Platform.OS === "web" ? 58 : (width - 60) / keys[0].length;
  const keyHeight = 60;

  /**
   * 与えられたキーのスタイルを、押された状態と、緑、黄、灰色の文字に基づいて返します。
   *
   * デフォルトのスタイルは、明るい灰色の背景と黒いテキストです。
   * キーが押されている場合、背景は濃い灰色になります。
   * キーがgreenLetters配列にある場合、背景は緑色でテキストは白になります。
   * キーがyellowLetters配列にある場合、背景は黄色でテキストは白になります。
   * キーがgrayLetters配列にある場合、背景は灰色でテキストは白になります。
   */
  const getKeyStyle = (key: string, pressed: boolean) => {
    const defaultStyle = {
      backgroundColor: "#ddd",
      color: "black",
    };

    if (greenLetters.includes(key)) {
      return { backgroundColor: Colors.light.green, color: "#fff" };
    } else if (yellowLetters.includes(key)) {
      return { backgroundColor: Colors.light.yellow, color: "#fff" };
    } else if (grayLetters.includes(key)) {
      return { backgroundColor: Colors.light.gray, color: "#fff" };
    }

    return pressed
      ? { backgroundColor: "#868686", color: "black" }
      : defaultStyle;
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => {
            const isEnter = key === ENTER;
            const isBackspace = key === BACKSPACE;

            return (
              <Pressable
                onPress={() => onKeyPressed(key)}
                key={`key-${key}`}
                style={({ pressed }) => [
                  styles.key,
                  { width: keyWidth, height: keyHeight },
                  (isEnter || isBackspace) && { width: keyWidth * 1.5 },
                  getKeyStyle(key, pressed),
                ]}
              >
                <Text style={[styles.keyText, isEnter && { fontSize: 12 }]}>
                  {isEnter ? (
                    "ENTER"
                  ) : isBackspace ? (
                    <Ionicons name="backspace-outline" size={24} />
                  ) : (
                    key.toUpperCase()
                  )}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
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
