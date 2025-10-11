import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  appLayout: { flex: 1, flexDirection: 'column' },
  mainContent: { flex: 1, paddingBottom: 72 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuButton: { padding: 4 },
  menuIcon: { width: 24, height: 24, flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 3 },
  menuLine: { height: 2, borderRadius: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, borderWidth: 1 },
  searchIcon: { width: 20, height: 20, marginRight: 8, position: 'relative' },
  searchIconCircle: { width: 14, height: 14, borderWidth: 2, borderRadius: 7, position: 'absolute' },
  searchIconHandle: { width: 6, height: 2, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: 2, right: 2, borderRadius: 1 },
  searchInput: { flex: 1, fontSize: 16 },

  content: { flex: 1, paddingBottom: 80 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, paddingHorizontal: 16 },

  // Novidades
  newsCard: { width: 220, marginRight: 16, height: 120, borderRadius: 16, padding: 16, justifyContent: 'flex-end' },
  newsTitle: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  newsRow: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },

  // Categorias
  categoriesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    flexGrow: 0, // Adicionado para não expandir além do necessário
    flexShrink: 0, // Adicionado para não encolher o texto
  },
  categoryDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 8 
  },

  // Eventos
  eventsContainer: { 
    flex: 1,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  eventItem: { 
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
    height: 180,
    justifyContent: 'space-between', // Changed to space-between
    flexDirection: 'column', // Added to ensure proper vertical layout
  },
  eventTitle: { 
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#fff',
    maxWidth: '65%',
  },
  eventDescription: {
    fontSize: 14,
    color: '#242020ff',
    opacity: 0.85,
    maxWidth: '65%',
    maxHeight: 60,
    overflow: 'hidden',
},
  eventDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.85,
    fontWeight: '500',
    alignSelf: 'flex-start',
    paddingBottom: 8,
    marginTop: 'auto' // Added to push date to bottom
  },
  eventCategory: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 0,
    width: 'auto'
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    justifyContent: 'flex-end',
    textAlign: 'center'
  },
  eventImage: {
    position: "absolute",
    right: '2%',
    top: 5,
    width: "32%",
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    opacity: 1,
  },

  // Modal/Sidebar
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    padding: 8,
  },
  modalBody: {
    maxHeight: 400,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },

  logoutButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  logoutText: { fontSize: 14 },
  accentDot: { width: 26, height: 26, borderRadius: 13, marginRight: 10, borderColor: '#fff' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  navButton: { paddingHorizontal: 8, paddingVertical: 4 },
  navText: { fontSize: 14, fontWeight: '700' },

  // Settings styles
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    marginBottom: 12,
    borderColor: '#E5E7EB', // fallback, will be overridden by theme
    borderRadius: 8,
    backgroundColor: '#fff', // fallback, will be overridden by theme
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '500',
  },

  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarHeader: { alignItems: 'center', marginBottom: 24 },
  sidebarName: { fontSize: 16, fontWeight: '700' },
  sidebarEmail: { fontSize: 12 },
  sidebarMenu: { marginBottom: 24 },
  sidebarMenuItem: { paddingVertical: 12, paddingHorizontal: 8 },
  sidebarMenuText: { fontSize: 14 },
  sidebarFooter: { borderTopWidth: 1, paddingTop: 16 },
});