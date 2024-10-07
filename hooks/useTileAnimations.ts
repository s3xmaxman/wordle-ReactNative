import { Colors } from "@/constants/Colors";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const ROWS = 6;
const COLS = 5;

export const useTileAnimations = (
  curRow: number,
  rows: string[][],
  wordLetters: string[],
  grayColor: string
) => {
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    })
  );

  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => useSharedValue(0))
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => useSharedValue("transparent"))
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => useSharedValue(Colors.light.gray))
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: COLS }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming("transparent", {
        duration: 100,
      });
    }
  };

  const setBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (curRow > rowIndex && cell !== "") {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    }
    return Colors.light.gray;
  };

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  return {
    rowStyles,
    tileStyles,
    shakeRow,
    flipRow,
    setCellColor,
    setBorderColor,
  };
};
