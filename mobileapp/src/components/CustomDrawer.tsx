import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

const CustomDrawer = (props: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { icon: 'book-outline', label: 'Test Series', type: 'Ionicons' },
    { icon: 'list-alt', label: 'My Test', type: 'MaterialIcons' },
    { icon: 'share-social-outline', label: 'Refer & Earn', type: 'Ionicons' },
    { icon: 'help-circle-outline', label: 'Help & Support', type: 'Ionicons' },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* Profile Header Section */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => props.navigation.navigate('ProfileTab')}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=sakthi' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Hi, SAKTHIVASAN</Text>
            <Text style={styles.viewProfile}>View profile</Text>
          </View>
        </TouchableOpacity>

        {/* Highlighted My Purchases Card */}
        <TouchableOpacity style={styles.highlightedCard}>
          <View style={styles.highlightedContent}>
            <MaterialIcons name="shopping-bag" size={24} color={COLORS.primary} />
            <Text style={styles.highlightedText}>My Purchases</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textDisabled} />
        </TouchableOpacity>

        {/* Menu List */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                {item.type === 'Ionicons' ? (
                  <Ionicons name={item.icon as any} size={22} color={COLORS.textPrimary} />
                ) : (
                  <MaterialIcons name={item.icon as any} size={22} color={COLORS.textPrimary} />
                )}
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Dark Mode Toggle */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="moon" size={22} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={isDarkMode ? COLORS.white : '#f4f3f4'}
            />
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>App Version: 1.0.0</Text>
          <Text style={styles.madeWithText}>Made with ❤️ in India</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    paddingTop: 60,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  viewProfile: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  highlightedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  highlightedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  menuList: {
    paddingHorizontal: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerInfo: {
    alignItems: 'flex-start',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textDisabled,
  },
  madeWithText: {
    fontSize: 12,
    color: COLORS.textDisabled,
    marginTop: 4,
  },
});

export default CustomDrawer;
