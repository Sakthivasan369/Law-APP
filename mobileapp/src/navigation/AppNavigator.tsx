import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from '../services/api';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CartScreen from '../screens/CartScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyCoursesScreen from '../screens/MyCoursesScreen';
import EmailInputScreen from '../screens/EmailInputScreen';
import OTPScreen from '../screens/OTPScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';

// Custom Components
import CustomDrawer from '../components/CustomDrawer';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  App: undefined;
  CourseDetail: { courseId: string };
  VideoPlayer: { courseId: string; lessonId: string };
};

export type AuthStackParamList = {
  EmailInput: undefined;
  OTP: { email: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="EmailInput" component={EmailInputScreen} />
    <AuthStack.Screen name="OTP" component={OTPScreen} />
  </AuthStack.Navigator>
);

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
          let iconName: keyof typeof Ionicons.prototype.getRawProps = 'help-circle-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyCoursesTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
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
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Auth');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          // Check expiration
          if (decoded.exp * 1000 < Date.now()) {
            setInitialRoute('Auth');
          } else if (decoded.is_onboarded) {
            setInitialRoute('App');
          } else {
            setInitialRoute('Onboarding');
          }
        } else {
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.error("Auth Check Error:", error);
        setInitialRoute('Auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={({ navigation }) => ({
          headerTintColor: COLORS.primary,
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <HomeHeaderRight navigation={navigation} />,
        })}
      >
        <RootStack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }} 
        />
        <RootStack.Screen 
          name="Onboarding" 
          component={ProfileSetupScreen} 
          options={{ headerShown: false }} 
        />
        <RootStack.Screen 
          name="App" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
        <RootStack.Screen 
          name="CourseDetail" 
          component={CourseDetailScreen} 
          options={{ headerShown: false }} 
        />
        <RootStack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen} 
          options={{ title: 'Learning Player' }} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
