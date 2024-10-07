import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from "@/components/OnScreenKeyboard";
// import SettingsModal from '@/components/SettingsModal';

import { Colors } from "@/constants/Colors";
import { allWords } from "@/utils/allWords";
import { words } from "@/utils/targetWords";
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
  const [word, setWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  );
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();
  const wordLetters = word.split("");

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  /**
   * キーボードから入力されたキーを処理する
   * ENTERキーが押された場合には、checkWordを実行
   * BACKSPACEキーが押された場合には、現在の列の前のセルを空にしてカーソルを戻す
   * それ以外の場合は、現在の列にキーを入力してカーソルを進める
   * @param key 入力されたキー
   */
  const addKey = (key: string) => {
    // 現在の列の状態をログ出力
    console.log("CURRENT: ", colStateRef.current);

    // rowsのコピーを作成
    const newRows = [...rows.map((row) => [...row])];

    // ENTERキーが押された場合
    if (key === "ENTER") {
      checkWord();
      return;
    }

    // BACKSPACEキーが押された場合
    if (key === "BACKSPACE") {
      // 先頭の列であれば、0番目のセルを空にする
      if (colStateRef.current === 0) {
        newRows[curRow][0] = "";
        setRows(newRows);
        return;
      }

      // それ以外の場合、現在の列の前のセルを空にしてカーソルを戻す
      newRows[curRow][colStateRef.current - 1] = "";
      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    }

    // 最後の列に達している場合、キーを追加しない
    if (colStateRef.current >= newRows[curRow].length) {
      console.log("Reached the end of the line");
      return;
    }

    // 通常のキーが押された場合、現在の列にキーを入力してカーソルを進める
    console.log("🚀 ~ addKey ~ curCol", colStateRef.current);
    newRows[curRow][colStateRef.current] = key;
    setRows(newRows);
    setCurCol(colStateRef.current + 1);
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join("");

    if (currentWord.length < word.length) {
      console.log("Not enough letters");
      // TODO: キー入力のエラーメッセージ
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("Not in word");
      // TODO: キー入力のエラーメッセージ
      return;
    }

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (word.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log("Correct!");
      } else if (curRow + 1 >= rows.length) {
        console.log("Game over!");
      }
    }, 1500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    "worklet";
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow;
      } else {
        return grayColor;
      }
    }
    return "transparent";
  };

  const getBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (curRow > rowIndex && cell !== "") {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  };

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
                <Text style={styles.cellText}>{cell}</Text>
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
