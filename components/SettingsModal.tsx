import { View, StyleSheet, Text, TouchableOpacity, Switch } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
export type Ref = BottomSheetModal;
import { Colors } from "@/constants/Colors";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "@/utils/storage";

const SettingsModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();
  const [dark, setDark] = useMMKVBoolean("dark-mode", storage);
  const [hard, setHard] = useMMKVBoolean("hard-mode", storage);
  const [contrast, setContrast] = useMMKVBoolean("contrast-mode", storage);

  const toggleDark = () => setDark((prev) => !prev);
  const toggleHard = () => setHard((prev) => !prev);
  const toggleContrast = () => setContrast((prev) => !prev);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Text style={styles.containerHeadline}>設定</Text>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>ハードモード</Text>
              <Text style={styles.rowTextSmall}>単語が長く難しくなります</Text>
            </View>
            <Switch
              onValueChange={toggleHard}
              value={hard}
              trackColor={{ true: "#000" }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>ダークモード</Text>
              <Text style={styles.rowTextSmall}>
                アプリをダークモードに変更します
              </Text>
            </View>
            <Switch
              onValueChange={toggleDark}
              value={dark}
              trackColor={{ true: "#000" }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTextBig}>ハイコントラストモード</Text>
              <Text style={styles.rowTextSmall}>
                視認性を向上させるためにコントラストを上げます
              </Text>
            </View>
            <Switch
              onValueChange={toggleContrast}
              value={contrast}
              trackColor={{ true: "#000" }}
              ios_backgroundColor="#9a9a9a"
            />
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default SettingsModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeadline: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
  },
  modalBtns: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#888",
  },
  rowText: {
    flex: 1,
  },
  rowTextBig: {
    fontSize: 18,
  },
  rowTextSmall: {
    fontSize: 14,
    color: "#5e5e5e",
  },
});
