import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

// Tela 3 — Buscar álbuns/EPs.
// Etapa futura: consumirá a API do MusicBrainz + Cover Art Archive para buscar
// álbuns e EPs reais por título/artista.
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        placeholder="Buscar álbum ou EP..."
        placeholderTextColor="#888"
        style={styles.input}
        editable={false}
      />
      <Text style={styles.text}>Resultados da busca (MusicBrainz) aparecerão aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64, backgroundColor: "#111" },
  title: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 16 },
  input: { backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 16 },
  text: { color: "#aaa" },
});
