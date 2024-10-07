import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from "@/components/OnScreenKeyboard";
// import SettingsModal from '@/components/SettingsModal';

import { Colors } from "@/constants/Colors";
// import { allWords } from '@/utils/allWords';
// import { words } from '@/utils/targetWords';
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const ROWS = 6;

const game = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const addKey = (key: string) => {};

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={textColor}
              />
              <Ionicons name="podium-outline" size={24} color={textColor} />
              <Ionicons name="settings-sharp" size={24} color={textColor} />
            </View>
          ),
        }}
      />

      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View style={[styles.gameFieldRow]} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View key={`cell-${rowIndex}-${cellIndex}`} style={styles.cell}>
                <Text>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    backgroundColor: "#fff",
    width: 62,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
});

export default game;
