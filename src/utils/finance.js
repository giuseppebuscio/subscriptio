import { addMonths, parseISO, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { getNextOccurrence } from './dates.js';

/**
 * Calculate the monthly equivalent cost for any subscription
 * @param {Object} subscription - Subscription object
 * @returns {number} Monthly equivalent cost
 */
export const monthlyEquivalent = (subscription) => {
  if (!subscription || !subscription.recurrence) return 0;
  
  const { type, interval } = subscription.recurrence;
  const amount = subscription.amount || 0;
  
  switch (type) {
    case 'monthly':
      return amount / interval;
    case 'annual':
      return amount / (12 * interval);
    case 'custom':
      return amount / interval;
    default:
      return amount;
  }
};

/**
 * Generate next payments for a subscription
 * @param {Object} subscription - Subscription object
 * @param {Date} fromDate - Starting date for generation
 * @param {number} monthsAhead - Number of months to generate (default: 12)
 * @returns {Array} Array of Payment objects
 */
export const generateNextPayments = (subscription, fromDate, monthsAhead = 12) => {
  if (!subscription || !subscription.recurrence) return [];
  
  const payments = [];
  let currentDate = new Date(fromDate);
  let paymentCount = 0;
  
  // Generate payments for the specified number of months
  const maxPayments = monthsAhead;
  
  while (paymentCount < maxPayments && paymentCount < monthsAhead) {
    const dueDate = getNextOccurrence(subscription.recurrence, currentDate);
    
    if (!dueDate) break;
    
    
    const payment = {
      id: `payment_${subscription.id}_${paymentCount}`,
      subscriptionId: subscription.id,
      dateDue: dueDate.toISOString().split('T')[0],
      amount: subscription.amount || 0,
      splits: generateSplits(subscription, subscription.amount || 0),
      paid: false,
      paidDate: null,
      payerId: null
    };
    
    payments.push(payment);
    currentDate = dueDate;
    paymentCount++;
  }
  
  return payments;
};

/**
 * Generate splits for a payment based on subscription participants
 * @param {Object} subscription - Subscription object
 * @param {number} amount - Total amount to split
 * @returns {Array} Array of split objects
 */
const generateSplits = (subscription, amount) => {
  if (!subscription.shared || !subscription.participants || subscription.participants.length === 0) {
    return [];
  }
  
  return subscription.participants.map(participant => {
    let splitAmount = 0;
    
    if (participant.shareType === 'percent') {
      splitAmount = (amount * participant.value) / 100;
    } else if (participant.shareType === 'fixed') {
      splitAmount = participant.value;
    }
    
    return {
      personId: participant.personId,
      amount: Math.round(splitAmount * 100) / 100, // Round to 2 decimal places
      paid: false,
      paymentId: null
    };
  });
};

/**
 * Compute balances for all people
 * @param {Array} people - Array of Person objects
 * @param {Array} subscriptions - Array of Subscription objects
 * @param {Array} payments - Array of Payment objects
 * @returns {Object} Object with person balances
 */
export const computePersonBalances = (people, subscriptions, payments) => {
  const balances = {};
  
  // Initialize balances
  people.forEach(person => {
    balances[person.id] = {
      personId: person.id,
      personName: person.name,
      totalOwed: 0,
      totalPaid: 0,
      netBalance: 0,
      pendingPayments: []
    };
  });
  
  // Calculate from payments
  payments.forEach(payment => {
    if (payment.splits && payment.splits.length > 0) {
      payment.splits.forEach(split => {
        const personId = split.personId;
        if (balances[personId]) {
          if (split.paid) {
            balances[personId].totalPaid += split.amount;
          } else {
            balances[personId].totalOwed += split.amount;
            balances[personId].pendingPayments.push({
              paymentId: payment.id,
              subscriptionId: payment.subscriptionId,
              amount: split.amount,
              dueDate: payment.dateDue
            });
          }
        }
      });
    }
  });
  
  // Calculate net balance
  Object.values(balances).forEach(balance => {
    balance.netBalance = balance.totalPaid - balance.totalOwed;
  });
  
  return balances;
};

/**
 * Split payment logic validation and calculation
 * @param {Object} payment - Payment object
 * @param {Object} subscription - Subscription object
 * @returns {Object} Validation result with splits and owner amount
 */
export const splitPaymentLogic = (payment, subscription) => {
  if (!payment.splits || payment.splits.length === 0) {
    return { valid: true, splits: [], ownerAmount: payment.amount };
  }
  
  const totalSplitAmount = payment.splits.reduce((sum, split) => sum + split.amount, 0);
  const difference = payment.amount - totalSplitAmount;
  
  return {
    valid: Math.abs(difference) < 0.01, // Allow for small rounding differences
    splits: payment.splits,
    ownerAmount: difference > 0 ? difference : 0,
    totalSplitAmount
  };
};

/**
 * Get upcoming due payments within threshold
 * @param {Array} payments - Array of Payment objects
 * @param {number} thresholdDays - Number of days threshold
 * @returns {Array} Array of upcoming payments
 */
export const upcomingDuePayments = (payments, thresholdDays) => {
  if (!payments || !thresholdDays) return [];
  
  const today = new Date();
  const thresholdDate = addMonths(today, thresholdDays / 30); // Approximate
  
  return payments.filter(payment => {
    if (payment.paid) return false;
    
    const dueDate = parseISO(payment.dateDue);
    return isAfter(dueDate, today) && isBefore(dueDate, thresholdDate);
  }).sort((a, b) => parseISO(a.dateDue) - parseISO(b.dateDue));
};

/**
 * Generate financial forecast for specified months
 * @param {Array} subscriptions - Array of Subscription objects
 * @param {number} months - Number of months to forecast
 * @returns {Array} Array of monthly forecasts
 */
export const forecast = (subscriptions, months = 12) => {
  if (!subscriptions) return [];
  
  const forecast = [];
  const today = new Date();
  
  for (let i = 0; i < months; i++) {
    const monthDate = addMonths(today, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    let monthlyTotal = 0;
    let activeSubscriptions = 0;
    
    subscriptions.forEach(subscription => {
      if (subscription.status !== 'active') return;
      
      // Check if subscription is active in this month
      // (All subscriptions are considered active for now)
      
      // Check if this month has a payment
      const monthlyCost = monthlyEquivalent(subscription);
      monthlyTotal += monthlyCost;
      activeSubscriptions++;
    });
    
    forecast.push({
      month: monthDate.toISOString().split('T')[0],
      monthName: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total: Math.round(monthlyTotal * 100) / 100,
      activeSubscriptions,
      trend: i > 0 ? monthlyTotal - forecast[i - 1]?.total : 0
    });
  }
  
  return forecast;
};

/**
 * Calculate total expenses for a specific period
 * @param {Array} payments - Array of Payment objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Total expenses
 */
export const calculatePeriodExpenses = (payments, startDate, endDate) => {
  if (!payments) return 0;
  
  return payments
    .filter(payment => {
      const paymentDate = parseISO(payment.dateDue);
      return isAfter(paymentDate, startDate) && isBefore(paymentDate, endDate);
    })
    .reduce((total, payment) => total + payment.amount, 0);
};

/**
 * Calculate category breakdown
 * @param {Array} subscriptions - Array of Subscription objects
 * @returns {Object} Category breakdown
 */
export const calculateCategoryBreakdown = (subscriptions) => {
  const breakdown = {};
  
  subscriptions.forEach(subscription => {
    if (subscription.status !== 'active') return;
    
    const category = subscription.category || 'Other';
    const monthlyCost = monthlyEquivalent(subscription);
    
    if (!breakdown[category]) {
      breakdown[category] = {
        category,
        total: 0,
        monthlyEquivalent: 0,
        count: 0
      };
    }
    
    breakdown[category].total += subscription.amount || 0;
    breakdown[category].monthlyEquivalent += monthlyCost;
    breakdown[category].count++;
  });
  
  // Convert to array and sort by monthly equivalent
  return Object.values(breakdown)
    .sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent);
};

/**
 * Get subscriptions that are expiring soon based on renewal day
 * @param {Array} subscriptions - Array of Subscription objects
 * @param {number} daysThreshold - Number of days to check ahead (default: 7)
 * @returns {Array} Array of expiring subscriptions
 */
export const getExpiringSubscriptions = (subscriptions, daysThreshold = 7) => {
  if (!subscriptions || !Array.isArray(subscriptions)) return [];
  
  const today = new Date();
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  const expiringSubscriptions = [];
  
  subscriptions.forEach(subscription => {
    // Skip inactive subscriptions
    if (subscription.status !== 'active') return;
    
    // Skip subscriptions without renewal day info
    const renewalDay = subscription.renewalDay || subscription.recurrence?.day;
    if (!renewalDay) return;
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Calculate next renewal date
    let nextRenewalDate = new Date(currentYear, currentMonth, renewalDay);
    
    // If the renewal day has already passed this month, check next month
    if (renewalDay < currentDay) {
      nextRenewalDate = new Date(currentYear, currentMonth + 1, renewalDay);
    }
    
    // Check if the next renewal is within the threshold
    if (nextRenewalDate >= today && nextRenewalDate <= thresholdDate) {
      const daysUntilRenewal = Math.ceil((nextRenewalDate - today) / (1000 * 60 * 60 * 24));
      
      expiringSubscriptions.push({
        ...subscription,
        nextRenewalDate: nextRenewalDate.toISOString(),
        daysUntilRenewal,
        isExpiring: true
      });
    }
  });
  
  // Sort by days until renewal (closest first)
  return expiringSubscriptions.sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
};
