import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/auth";
import type { RootStackParamList } from "./src/navigation";
import { InvoiceDetailScreen } from "./src/screens/InvoiceDetailScreen";
import { InvoicesScreen } from "./src/screens/InvoicesScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { NewInvoiceScreen } from "./src/screens/NewInvoiceScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNav() {
  const { ready, token } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#0f172a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Invoices"
              component={InvoicesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewInvoice"
              component={NewInvoiceScreen}
              options={{ title: "New invoice", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="InvoiceDetail"
              component={InvoiceDetailScreen}
              options={{ title: "Invoice", headerBackTitle: "Back" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNav />
    </AuthProvider>
  );
}
