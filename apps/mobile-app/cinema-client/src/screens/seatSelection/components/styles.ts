import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/colors';

const { width } = Dimensions.get('window');
const SEAT_SIZE = (width - 40) / 8;
const SEAT_MARGIN = 4;

export const seatLegendStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxCouple: {
    width: 40,
  },
  crossText: {
    fontSize: 10,
    color: '#444',
  },
  label: {
    fontSize: 12,
    color: Colors.textInactive,
  }
});

export const seatMapStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    minWidth: width,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  mapContainer: {
    alignItems: 'center',
  },
  screenWrapper: {
    alignItems: 'center',
    marginBottom: 40,
    width: 300,
  },
  screenCurve: {
    height: 30,
    width: '100%',
    borderTopWidth: 4,
    borderTopColor: '#555',
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
  },
  screenText: {
    marginTop: -20,
    fontSize: 12,
    color: '#888',
    letterSpacing: 2,
  },
  seatsGrid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabelContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    color: Colors.textInactive,
    fontSize: 12,
    fontWeight: 'bold',
  },
  seatRow: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    marginHorizontal: SEAT_MARGIN,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatCouple: {
    width: SEAT_SIZE * 2 + SEAT_MARGIN * 2,
  },
  seatNumber: {
    fontSize: 10,
    color: '#CCC',
  }
});

