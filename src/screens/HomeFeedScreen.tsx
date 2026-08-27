import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Tela 2 — Home / Feed.
// Mostrará as avaliações mais recentes (próprias e de quem o usuário segue).
export default function HomeFeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text style={styles.text}>
        Avaliações recentes da comunidade aparecerão aqui (etapa futura: integração com backend).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64, backgroundColor: "#111" },
  title: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 8 },
  text: { color: "#aaa" },
});
