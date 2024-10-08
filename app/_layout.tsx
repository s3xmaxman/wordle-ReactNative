import { Stack, useRouter } from "expo-router";
import {
  useFonts,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Logo from "@/assets/images/nyt-logo.svg";
import {
  Appearance,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { LogBox } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "@/utils/storage";

LogBox.ignoreAllLogs();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing publishable key");
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [dark] = useMMKVBoolean("dark-mode", storage);
  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(dark ? "dark" : "light");
    }
  }, [dark]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="game"
                  options={{
                    headerTitle: "Wordle",
                    headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                    headerTitleStyle: {
                      fontFamily: "FrankRuhlLibre_800ExtraBold",
                      fontSize: 26,
                    },
                    title: "",
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    headerTitle: () => <Logo width={150} height={40} />,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    presentation: "fullScreenModal",
                    title: "",
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
