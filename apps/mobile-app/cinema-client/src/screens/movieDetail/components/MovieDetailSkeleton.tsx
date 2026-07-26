import React from 'react';
import { View, ScrollView } from 'react-native';
import { Skeleton } from '@components/common/Skeleton';
import { styles } from '../styles';

export const MovieDetailSkeleton = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Backdrop Skeleton */}
      <View style={styles.backdropContainer}>
        <Skeleton style={styles.backdrop} />
      </View>

      {/* Content Skeleton */}
      <View style={styles.contentContainer}>
        <Skeleton style={{ width: '70%', height: 28, marginBottom: 15, borderRadius: 4 }} />
        
        <View style={[styles.infoRow, { marginBottom: 25 }]}>
          <Skeleton style={{ width: 40, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 80, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 100, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 60, height: 24, borderRadius: 4 }} />
        </View>

        <Skeleton style={{ width: '80%', height: 16, marginBottom: 15, borderRadius: 4 }} />
        
        <Skeleton style={{ width: '40%', height: 22, marginBottom: 12, marginTop: 10, borderRadius: 4 }} />
        <Skeleton style={{ width: '100%', height: 14, marginBottom: 8, borderRadius: 4 }} />
        <Skeleton style={{ width: '90%', height: 14, marginBottom: 8, borderRadius: 4 }} />
        <Skeleton style={{ width: '95%', height: 14, marginBottom: 8, borderRadius: 4 }} />
        <Skeleton style={{ width: '70%', height: 14, marginBottom: 25, borderRadius: 4 }} />

        <Skeleton style={{ width: '60%', height: 16, marginBottom: 12, borderRadius: 4 }} />
        <Skeleton style={{ width: '75%', height: 16, borderRadius: 4 }} />
      </View>
    </ScrollView>
  );
};
