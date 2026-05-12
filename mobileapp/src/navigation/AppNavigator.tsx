import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TouchableOpacity, View } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CartScreen from '../screens/CartScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyCoursesScreen from '../screens/MyCoursesScreen';

// Custom Components
import CustomDrawer from '../components/CustomDrawer';

export type RootStackParamList = {
  DrawerRoot: undefined;
  CourseDetail: { courseId: string };
  VideoPlayer: { courseId: string; lessonId: string };
};

export type TabParamList = {
  HomeTab: undefined;
  MyCoursesTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator();

const HomeHeaderRight = ({ navigation }: any) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate('HomeTab')}
    style={{ marginRight: 15 }}
  >
    <Ionicons name="home-outline" size={24} color={COLORS.primary} />
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.prototype.getRawProps;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyCoursesTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDisabled,
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="MyCoursesTab" component={MyCoursesScreen} options={{ title: 'My Courses' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerTintColor: COLORS.primary,
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <HomeHeaderRight navigation={navigation} />,
        })}
      >
        <Stack.Screen 
          name="DrawerRoot" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CourseDetail" 
          component={CourseDetailScreen} 
          options={{ headerShown: false }} // Hidden because CourseDetail has custom header
        />
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen} 
          options={{ title: 'Learning Player' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
