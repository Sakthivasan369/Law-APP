import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES } from '../constants/mockData';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../context/ThemeContext';

const CartScreen = () => {
  const { colors } = useTheme();
  const cartItems = MOCK_COURSES.slice(0, 2);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const renderCartItem = ({ item }: { item: typeof MOCK_COURSES[0] }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.itemInstructor, { color: colors.textSecondary }]}>{item.instructor}</Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Shopping Cart ({cartItems.length})</Text>
        
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Price Details</Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>GST (18%)</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>₹{tax.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.paymentMethods}>
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Payment Method</Text>
          <TouchableOpacity style={[styles.paymentOption, { backgroundColor: colors.card }]}>
            <Ionicons name="card-outline" size={24} color={colors.primary} />
            <Text style={[styles.paymentText, { color: colors.textPrimary }]}>Razorpay (UPI, Card, NetBanking)</Text>
            <Ionicons name="radio-button-on" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <PrimaryButton 
          title="Proceed to Pay" 
          onPress={() => alert('Proceeding to Razorpay checkout...')} 
          style={styles.payButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  listContent: {
    marginBottom: SPACING.xl,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInstructor: {
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  summaryContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.soft,
    marginBottom: SPACING.xl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginBottom: SPACING.xl,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  paymentText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  payButton: {
    width: '100%',
  },
});

export default CartScreen;
