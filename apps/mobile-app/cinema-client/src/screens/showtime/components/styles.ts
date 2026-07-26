import { StyleSheet } from 'react-native';
import { Colors } from '@constants/colors';

export const cinemaCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  distanceBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 13,
    color: Colors.textInactive,
    marginBottom: 12,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    backgroundColor: '#222',
    gap: 6,
  },
  directionText: {
    fontSize: 12,
    color: Colors.textInactive,
  },
  formatsContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#1E1E1E',
  },
  formatGroup: {
    marginTop: 16,
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  formatIndicator: {
    width: 3,
    height: 14,
    backgroundColor: Colors.primary,
    marginRight: 8,
    borderRadius: 2,
  },
  formatTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  showtimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  showtimeBtn: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A2A',
  },
  showtimeBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  showtimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCC',
  },
  showtimeTextSelected: {
    color: Colors.primary,
  }
});

export const cinemaListStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textInactive,
  },
  list: {
    gap: 16,
  }
});

export const dateSelectorStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dateCard: {
    width: 60,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: Colors.textInactive,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textActive,
  },
  textSelected: {
    color: '#FFF',
  }
});

export const stepProgressStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  line: {
    position: 'absolute',
    top: 36, // center of icon
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: '#333',
    zIndex: 0,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  stepWrapper: {
    alignItems: 'center',
    width: 60,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainerActive: {
    borderColor: Colors.primary,
    backgroundColor: '#331111',
  },
  iconContainerPast: {
    borderColor: Colors.primary,
  },
  glow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    opacity: 0.15,
  },
  stepTitle: {
    fontSize: 10,
    color: Colors.textInactive,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: Colors.textActive,
    fontWeight: '600',
  }
});

