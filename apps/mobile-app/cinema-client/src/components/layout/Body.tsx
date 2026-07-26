import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';

interface BodyProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  hideHeader?: boolean;
}

export const Body: React.FC<BodyProps> = ({
  children,
  title,
  showBack = false,
  leftComponent,
  rightComponent,
  scrollable = false,
  style,
  contentContainerStyle,
  containerStyle,
  hideHeader = false,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderHeader = () => {
    if (hideHeader) return null;

    const hasTitle = !!title;
    const hasLeft = showBack || !!leftComponent;
    const hasRight = !!rightComponent;

    if (!hasTitle && !hasLeft && !hasRight) return null;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <ChevronLeft color={Colors.textActive} size={28} />
            </TouchableOpacity>
          ) : (
            leftComponent
          )}
        </View>

        <View style={styles.titleContainer}>
          {hasTitle && (
            <AppText style={styles.title} numberOfLines={1}>
              {title}
            </AppText>
          )}
        </View>

        <View style={styles.rightContainer}>{rightComponent}</View>
      </View>
    );
  };

  const content = scrollable ? (
    <ScrollView
      style={[styles.content, style]}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...(rest as any)}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, style, contentContainerStyle]} {...rest}>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }, containerStyle]}>
      {renderHeader()}
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textActive,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
