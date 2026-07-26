import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { AppText } from '@components/AppText';

interface SectionProps extends ViewProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children, style, ...rest }) => {
  return (
    <View style={[styles.section, style]} {...rest}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
});
