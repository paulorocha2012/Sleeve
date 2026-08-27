import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AlbumDetail">;

// Tela 4 — Detalhe do álbum.
// Mostrará capa, artista, ano e a lista de avaliações (gostei/não gostei + crítica)
// de todos os usuários para este álbum. Botão leva para "Nova avaliação".
export default function AlbumDetailScreen({ route, navigation }: Props) {
  const { albumMbid } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do álbum</Text>
      <Text style={styles.text}>MBID: {albumMbid}</Text>
      <Text style={styles.text}>Lista de avaliações (gostei/não gostei) aparecerá aqui.</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("NewReview", { albumMbid })}
      >
        <Text style={styles.buttonText}>Avaliar este álbum</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#111" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 8 },
  text: { color: "#aaa", marginBottom: 8 },
  button: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginTop: 16, alignItems: "center" },
  buttonText: { color: "#111", fontWeight: "600" },
});
