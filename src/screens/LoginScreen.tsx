import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// Tela 1 — Login / Cadastro.
// Etapa 1: apenas o esqueleto visual e a navegação para as Tabs principais.
// Autenticação real (Supabase Auth) entra em etapa futura.
export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleeve</Text>
      <Text style={styles.subtitle}>Seu diário de álbuns e EPs</Text>

      <Pressable style={styles.button} onPress={() => navigation.replace("MainTabs")}>
        <Text style={styles.buttonText}>Entrar (placeholder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#111" },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#aaa", marginBottom: 32 },
  button: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: "#111", fontWeight: "600" },
});
