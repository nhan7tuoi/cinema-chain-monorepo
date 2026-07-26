import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { Clock, GripHorizontal, Coffee, CreditCard } from 'lucide-react-native';
import { stepProgressStyles as styles } from './styles';

const STEPS = [
  { id: 'suat', title: 'Chọn suất', icon: Clock },
  { id: 'ghe', title: 'Chọn ghế', icon: GripHorizontal },
  { id: 'combo', title: 'Combo', icon: Coffee },
  { id: 'thanhtoan', title: 'Thanh toán', icon: CreditCard },
];

interface StepProgressProps {
  currentStep: number;
}

export const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <View style={styles.container}>
      {/* Background Line */}
      <View style={styles.line} />
      
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          const Icon = step.icon;
          
          return (
            <View key={step.id} style={styles.stepWrapper}>
              <View style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
                isPast && styles.iconContainerPast,
              ]}>
                {/* Glow effect for active step */}
                {isActive && <View style={styles.glow} />}
                
                <Icon 
                  size={20} 
                  color={isActive ? Colors.primary : Colors.textInactive} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </View>
              <AppText style={[
                styles.stepTitle,
                isActive && styles.stepTitleActive,
              ]}>
                {step.title}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};


