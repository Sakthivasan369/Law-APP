import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES, CATEGORIES } from '../constants/mockData';
import CourseCard from '../components/CourseCard';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = DrawerNavigationProp<any>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const { colors } = useTheme();

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCustomHeader = () => (
    <View style={[styles.customHeader, { paddingTop: Math.max(insets.top, 10), backgroundColor: colors.card }]}>
      <TouchableOpacity 
        style={styles.menuIcon} 
        onPress={() => (navigation as any).openDrawer()}
      >
        <Feather name="menu" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <View style={styles.searchBarWrapper}>
        <View style={[styles.pillSearchBar, { backgroundColor: colors.highlightBg }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search for courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textDisabled}
          />
        </View>
      </View>
    </View>
  );

  const displayName = user?.name?.split(' ')[0]?.toUpperCase() || 'USER';

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.welcomeText, { color: colors.primary }]}>Hello, {displayName}!</Text>
      <Text style={[styles.subText, { color: colors.textSecondary }]}>What would you like to learn today?</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              { backgroundColor: colors.highlightBg },
              selectedCategory === category && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              { color: colors.textSecondary },
              selectedCategory === category && { color: colors.white }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderCustomHeader()}
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            onPress={(id) => navigation.navigate('CourseDetail' as any, { courseId: id })} 
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  menuIcon: {
    padding: SPACING.xs,
  },
  searchBarWrapper: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  pillSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    height: 44,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    marginTop: 4,
  },
  categoryContainer: {
    marginTop: SPACING.md,
    marginHorizontal: -SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;
