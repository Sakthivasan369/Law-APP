import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES, CATEGORIES } from '../constants/mockData';
import CourseCard from '../components/CourseCard';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = DrawerNavigationProp<any>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity 
        style={styles.menuIcon} 
        onPress={() => (navigation as any).openDrawer()}
      >
        <Feather name="menu" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      
      <View style={styles.searchBarWrapper}>
        <View style={styles.pillSearchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textDisabled}
          />
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Hello, SAKTHIVASAN!</Text>
      <Text style={styles.subText}>What would you like to learn today?</Text>

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
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
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
    backgroundColor: '#F3F4F6',
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
    color: COLORS.textPrimary,
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
    color: COLORS.primary,
  },
  subText: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
});

export default HomeScreen;
