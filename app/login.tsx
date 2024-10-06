import { useOAuth } from "@clerk/clerk-expo";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { defaultStyles } from "@/constants/Styles";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: Strategy.Google,
  });
  const { startOAuthFlow: appleAuth } = useOAuth({
    strategy: Strategy.Apple,
  });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: Strategy.Facebook,
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>ログインまたはアカウント作成</Text>
      <Text style={styles.subText}>
        続行することで、販売条件、サービス利用規約、およびプライバシーポリシーに同意したことになります。
      </Text>

      <Text style={styles.inputLabel}>メールアドレス</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>メールアドレスで続行</Text>
      </TouchableOpacity>

      <View style={styles.separatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.separator}>または</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
          <Text style={styles.btnOutlineText}>Googleで続行</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} />
          <Text style={styles.btnOutlineText}>Facebookで続行</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <Ionicons name="logo-apple" size={24} style={styles.btnIcon} />
          <Text style={styles.btnOutlineText}>Appleで続行</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    color: "#4f4f4f",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputLabel: {
    paddingBottom: 5,
    fontWeight: "500",
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  separator: {
    fontFamily: "mon-sb",
    color: Colors.light.gray,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    height: 50,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  btnIcon: {
    paddingRight: 10,
  },
});
