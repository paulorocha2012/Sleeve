import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Verdict } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "NewReview">;

// Tela 5 — Nova avaliação.
// O coração do app: SEM notas/estrelas. Apenas duas opções — "Gostei" / "Não gostei" —
// mais um campo de texto livre para a crítica.
export default function NewReviewScreen({ route, navigation }: Props) {
  const { albumMbid } = route.params;
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliar álbum</Text>
      <Text style={styles.text}>MBID: {albumMbid}</Text>

      <View style={styles.verdictRow}>
        <Pressable
          style={[styles.verdictButton, verdict === "liked" && styles.verdictButtonActive]}
          onPress={() => setVerdict("liked")}
        >
          <Text style={styles.verdictText}>👍 Gostei</Text>
        </Pressable>
        <Pressable
          style={[styles.verdictButton, verdict === "disliked" && styles.verdictButtonActive]}
          onPress={() => setVerdict("disliked")}
        >
          <Text style={styles.verdictText}>👎 Não gostei</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Escreva sua crítica..."
        placeholderTextColor="#888"
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
      />

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Salvar avaliação</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#111" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 8 },
  text: { color: "#aaa", marginBottom: 16 },
  verdictRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  verdictButton: { flex: 1, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#444", alignItems: "center" },
  verdictButtonActive: { backgroundColor: "#fff" },
  verdictText: { color: "#fff", fontWeight: "600" },
  input: { backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 8, minHeight: 120, textAlignVertical: "top" },
  button: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginTop: 16, alignItems: "center" },
  buttonText: { color: "#111", fontWeight: "600" },
});
