import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_COURSES } from '../constants/mockData';
import PrimaryButton from '../components/PrimaryButton';

const CartScreen = () => {
  const cartItems = MOCK_COURSES.slice(0, 2);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const renderCartItem = ({ item }: { item: typeof MOCK_COURSES[0] }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemInstructor}>{item.instructor}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Shopping Cart ({cartItems.length})</Text>
        
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={renderCartItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Price Details</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.summaryTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="card-outline" size={24} color={COLORS.primary} />
            <Text style={styles.paymentText}>Razorpay (UPI, Card, NetBanking)</Text>
            <Ionicons name="radio-button-on" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  listContent: {
    marginBottom: SPACING.xl,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
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
    color: COLORS.textPrimary,
  },
  itemInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.soft,
    marginBottom: SPACING.xl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paymentMethods: {
    marginBottom: SPACING.xl,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  paymentText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  payButton: {
    width: '100%',
  },
});

export default CartScreen;
