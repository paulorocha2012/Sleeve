import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: Edge[];
  /** Remove o padding lateral padrão (útil quando a tela já controla o próprio espaçamento). */
  noPadding?: boolean;
}

/**
 * Base de todas as telas: fundo do tema, áreas seguras (notch/status bar) e
 * largura máxima em telas grandes, para o conteúdo não esticar demais.
 */
export function ScreenContainer({ children, edges, noPadding }: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      <View
        style={[
          styles.content,
          isWide && styles.contentWide,
          !noPadding && styles.padded,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentWide: {
    maxWidth: 640,
    alignSelf: 'center',
  },
  padded: {
    paddingHorizontal: 20,
  },
});
