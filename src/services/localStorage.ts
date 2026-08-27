// Camada de persistência local (AsyncStorage), usada para:
//  - manter a sessão do usuário entre aberturas do app;
//  - cache de buscas de álbuns já feitas;
//  - fila de avaliações criadas offline, aguardando sincronização.
// Implementação chega na etapa de "persistência local".

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}
