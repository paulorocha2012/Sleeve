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
 * Componente reutilizado por todas as telas: aplica a cor de fundo do tema,
 * respeita as áreas seguras (notch/status bar) e centraliza o conteúdo com
 * uma largura máxima em telas maiores (tablets/web), evitando que os
 * cartões e formulários fiquem esticados demais — é a principal estratégia
 * de adaptação a diferentes tamanhos de tela usada no app.
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
