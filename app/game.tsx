import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from "@/components/OnScreenKeyboard";
import SettingsModal from "@/components/SettingsModal";

import { Colors } from "@/constants/Colors";
import { useTileAnimations } from "@/hooks/useTileAnimations";
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

  const settingsModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSettingsModalPress = () =>
    settingsModalRef.current?.present();

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  const {
    rowStyles,
    tileStyles,
    shakeRow,
    flipRow,
    setCellColor,
    setBorderColor,
  } = useTileAnimations(curRow, rows, wordLetters, grayColor);

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

  /**
   * 現在の単語をチェックします。
   *  - 単語が十分に長くない場合、行を揺らして戻ります。
   *  - 単語が単語リストに含まれていない場合、行を揺らして戻ります。
   *  - 単語が正しい場合、勝利でゲームを終了します。
   *  - 単語が正しくないが行が満杯の場合、敗北でゲームを終了します。
   *  - 単語が正しくなく、行が満杯でない場合、行を反転させて正しい文字を正しい文字の配列に追加します。
   *  - 黄色と灰色の文字を黄色と灰色の文字の配列に追加します。
   *  - 現在の行を次の行に設定し、現在の列をリセットします。
   */
  const checkWord = () => {
    const currentWord = rows[curRow].join("");

    if (currentWord.length < word.length) {
      console.log("Not enough letters");
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("Not in word");
      shakeRow();
      // return;
    }

    flipRow();

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
        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      } else if (curRow + 1 >= rows.length) {
        console.log("Game over!");
        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      }
    }, 1500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        addKey(ENTER);
      } else if (e.key === "Backspace") {
        addKey(BACKSPACE);
      } else if (e.key.length === 1) {
        addKey(e.key);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (Platform.OS === "web") {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [curCol]);

  useEffect(() => {
    if (curRow === 0) {
      return;
    }

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
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
              <TouchableOpacity onPress={handlePresentSettingsModalPress}>
                <Ionicons name="settings-sharp" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View
            style={[styles.gameFieldRow, rowStyles[rowIndex]]}
            key={`row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}
              >
                <Animated.View
                  style={[styles.cell, tileStyles[rowIndex][cellIndex]]}
                >
                  <Animated.Text
                    style={[
                      styles.cellText,
                      {
                        color: curRow > rowIndex ? "#fff" : textColor,
                      },
                    ]}
                  >
                    {cell}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
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
