import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
// import { defaultStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
export type Ref = BottomSheetModal;

import disc from "@jsamr/counter-style/presets/disc";
import MarkedList from "@jsamr/react-native-li";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

const BENEFITS = [
  "Wordle、Spelling Bee、The Crosswordなどに完全にアクセスできます。",
  "集中やリラクゼーションのために、毎日新しいパズルをプレイできます。",
  "WordleBotで戦略を強化しましょう。",
  "Wordle、Spelling Bee、クロスワードのアーカイブにある10,000以上のパズルをアンロックできます。",
  "どのデバイスでも、あなたの統計や連勝記録を追跡できます。",
];

const SubscribeModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

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
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleComponent={null}
    >
      <View style={styles.contentContainer}>
        <View style={styles.modalBtns}>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.textBtn}>Login</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView>
          <Text style={styles.containerHeadline}>
            無制限のプレイ。{"\n"}7日間無料でお試しください。
          </Text>
          <Image
            source={require("@/assets/images/games.png")}
            style={styles.image}
          />

          <View style={{ marginVertical: 20 }}>
            <MarkedList
              counterRenderer={disc}
              lineStyle={{ marginVertical: 10, gap: 10, paddingHorizontal: 40 }}
            >
              {BENEFITS.map((benefit, index) => (
                <Text key={index} style={styles.listText}>
                  {benefit}
                </Text>
              ))}
            </MarkedList>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeadline: {
    fontSize: 34,
    padding: 20,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_900Black",
  },
  image: {
    width: "90%",
    alignSelf: "center",
    height: 40,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  textBtn: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  listText: {
    fontSize: 14,
    flexShrink: 1,
    color: "#4f4f4f",
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#484848",
    marginHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: "#fff",
    marginTop: "auto",
    paddingHorizontal: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    paddingTop: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#484848",
    paddingTop: 10,
  },
});

export default SubscribeModal;
