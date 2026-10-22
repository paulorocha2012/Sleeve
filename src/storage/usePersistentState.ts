import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from './storage';

/**
 * Funciona como um `useState`, mas o valor também fica gravado no aparelho.
 *
 * 1. Ao montar, lê a chave do AsyncStorage (recuperação). Enquanto lê,
 *    `ready` é false e o app mostra a tela de carregamento.
 * 2. Depois disso, toda vez que o valor muda, grava de novo (armazenamento).
 *
 * Se a chave ainda não existe (app aberto pela primeira vez), usa `initial`.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadJSON(key, initial).then((stored) => {
      if (!active) return;
      setValue(stored);
      setReady(true);
    });
    return () => {
      active = false;
    };
    // `initial` só importa na primeira leitura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    // Antes de terminar a leitura não grava nada: senão o valor inicial
    // sobrescreveria o que estava salvo.
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
