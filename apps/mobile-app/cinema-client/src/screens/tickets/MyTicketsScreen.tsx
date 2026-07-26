import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useQuery } from '@tanstack/react-query';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Colors } from '@constants/colors';
import { getMyTickets } from '../booking/api';
import { TicketCard } from './components/TicketCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { myTicketsStyles as styles } from './styles';

const MyTicketsScreen = () => {
  const navigation = useNavigation<any>();
  const { data: tickets, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['myTickets'],
    queryFn: getMyTickets,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    const isUnauthorized = (error as any)?.response?.status === 401 || (error as any)?.status === 401;

    if (isUnauthorized) {
      return (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>Vui lòng đăng nhập để xem vé của bạn.</AppText>
          <AppButton 
            title="Đăng nhập" 
            onPress={() => navigation.navigate('Login')} 
            style={{ marginTop: 16, width: 200 }}
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyText}>Bạn chưa có vé nào.</AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="#4a0000" stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <Body 
        title="VÉ CỦA BẠN" 
        style={styles.content} 
        containerStyle={{ backgroundColor: 'transparent' }}
        showBack={false}
      >
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TicketCard 
              booking={item} 
              onPress={() => navigation.navigate('TicketDetail', { booking: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
        />
      </Body>
    </View>
  );
};



export default MyTicketsScreen;
