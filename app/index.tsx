import { Text, View, StyleSheet } from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon width={100} height={100} />
        <Text style={styles.title}>Wordle</Text>
        <Text style={styles.text}>Get 6 chances to guess a 5-letter word</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.text}>New Game</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.text}>Mad by Bad 39B</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
