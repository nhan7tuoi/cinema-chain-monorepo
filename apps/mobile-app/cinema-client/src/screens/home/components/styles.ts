import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const cinemaCardStyles = StyleSheet.create({
  cinemaCard: {
    width: 220,
    marginRight: 15,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e50914',
  },
  cinemaName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cinemaAddress: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 10,
  },
  cinemaDistance: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export const heroCarouselStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400,
  },
  heroSection: {
    width: width,
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'flex-start',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heroGenre: {
    color: '#eee',
    fontSize: 14,
    marginBottom: 15,
  },
  heroButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#e50914',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export const homeSkeletonsStyles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
  },
  heroContainer: {
    width: '100%',
    height: 400,
  },
  heroSkeleton: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  movieCard: {
    width: 140,
    marginRight: 15,
  },
  moviePoster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle1: {
    width: '80%',
    height: 12,
    marginBottom: 4,
  },
  movieTitle2: {
    width: '60%',
    height: 12,
  },
  promoCard: {
    width: 280,
    marginRight: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  promoImage: {
    width: '100%',
    height: 140,
    borderRadius: 0,
  },
  promoInfo: {
    padding: 12,
  },
  promoTitle: {
    width: '70%',
    height: 14,
    marginBottom: 8,
  },
  promoDesc1: {
    width: '100%',
    height: 10,
    marginBottom: 4,
  },
  promoDesc2: {
    width: '80%',
    height: 10,
  },
  cinemaCard: {
    width: 220,
    marginRight: 15,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3a3a3a',
  },
  cinemaName: {
    width: '60%',
    height: 14,
    marginBottom: 8,
  },
  cinemaAddress: {
    width: '100%',
    height: 10,
    marginBottom: 12,
  },
  cinemaDistance: {
    width: '40%',
    height: 12,
  },
});

export const movieCardStyles = StyleSheet.create({
  movieCard: {
    width: 140,
    marginRight: 15,
  },
  moviePoster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export const promotionCardStyles = StyleSheet.create({
  promoCard: {
    width: 280,
    marginRight: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  promoImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  promoInfo: {
    padding: 12,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoDesc: {
    color: '#aaa',
    fontSize: 14,
  },
});

