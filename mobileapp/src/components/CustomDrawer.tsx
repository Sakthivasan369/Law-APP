import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { removeAuthToken } from '../services/api';

const CustomDrawer = (props: any) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, clearUser } = useUser();

  const menuItems = [
    { icon: 'book-outline', label: 'Test Series', type: 'Ionicons' },
    { icon: 'list-alt', label: 'My Test', type: 'MaterialIcons' },
    { icon: 'share-social-outline', label: 'Refer & Earn', type: 'Ionicons', route: 'ReferAndEarn' },
    { icon: 'help-circle-outline', label: 'Help & Support', type: 'Ionicons' },
  ];

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.route) {
      props.navigation.navigate(item.route);
    }
  };

  const handleLogout = async () => {
    await removeAuthToken();
    clearUser();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* Profile Header Section */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => props.navigation.navigate('ProfileTab')}
        >
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public' }}
            style={[styles.avatar, { borderColor: colors.primary }]}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              Hi, {user?.name?.split(' ')[0]?.toUpperCase() || 'USER'}
            </Text>
            <Text style={[styles.viewProfile, { color: colors.primary }]}>View profile</Text>
          </View>
        </TouchableOpacity>

        {/* Highlighted My Purchases Card */}
        <TouchableOpacity style={[styles.highlightedCard, { backgroundColor: colors.highlightBg }]}>
          <View style={styles.highlightedContent}>
            <MaterialIcons name="shopping-bag" size={24} color={colors.primary} />
            <Text style={[styles.highlightedText, { color: colors.textPrimary }]}>My Purchases</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
        </TouchableOpacity>

        {/* Menu List */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.divider }]}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                {item.type === 'Ionicons' ? (
                  <Ionicons name={item.icon as any} size={22} color={colors.textPrimary} />
                ) : (
                  <MaterialIcons name={item.icon as any} size={22} color={colors.textPrimary} />
                )}
                <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Dark Mode Toggle */}
          <View style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.menuItemLeft}>
              <Feather name="moon" size={22} color={colors.textPrimary} />
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
              thumbColor={isDarkMode ? colors.white : colors.switchThumbOff}
            />
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={[styles.footer, { borderTopColor: colors.divider }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <Text style={[styles.versionText, { color: colors.textDisabled }]}>App Version: 1.0.0</Text>
          <Text style={[styles.madeWithText, { color: colors.textDisabled }]}>Made with ❤️ in India</Text>
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
  },
  profileInfo: {
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewProfile: {
    fontSize: 14,
    marginTop: 2,
  },
  highlightedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerInfo: {
    alignItems: 'flex-start',
  },
  versionText: {
    fontSize: 12,
  },
  madeWithText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomDrawer;
