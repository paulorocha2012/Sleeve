import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chaves usadas no AsyncStorage. Cada chave guarda um JSON com uma lista
 * (ou objeto) inteira — ver docs/etapa-04.md para o formato de cada uma.
 */
export const KEYS = {
  session: 'sleeve:sessao',
  reviews: 'sleeve:avaliacoes',
  drafts: 'sleeve:rascunhos',
  listens: 'sleeve:escutas',
  wantList: 'sleeve:quero-ouvir',
} as const;

/** Lê uma chave e converte de JSON. Se não existir (primeira abertura) ou der erro, devolve `fallback`. */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch (error) {
    console.warn(`Falha ao ler "${key}" do armazenamento`, error);
    return fallback;
  }
}

/** Converte para JSON e grava, substituindo o que havia na chave. */
export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Falha ao gravar "${key}" no armazenamento`, error);
  }
}

