import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Tela 6 — Perfil do usuário.
// Mostrará dados do usuário e a lista de álbuns que ele avaliou (gostei/não gostei).
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.text}>Dados do usuário e histórico de avaliações aparecerão aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64, backgroundColor: "#111" },
  title: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 8 },
  text: { color: "#aaa" },
});
