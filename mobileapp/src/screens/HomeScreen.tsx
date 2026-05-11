import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { MOCK_COURSES, CATEGORIES } from '../constants/mockData';
import CourseCard from '../components/CourseCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Hello, Sakthivasan!</Text>
      <Text style={styles.subText}>What would you like to learn today?</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for legal courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textDisabled}
        />
      </View>

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
    <View style={styles.container}>
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            onPress={(id) => navigation.navigate('CourseDetail', { courseId: id })} 
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
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.textPrimary,
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
