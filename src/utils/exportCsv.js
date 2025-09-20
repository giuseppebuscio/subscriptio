/**
 * Convert an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects with key and label
 * @returns {string} CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || !headers || data.length === 0) return '';
  
  // Create header row
  const headerRow = headers.map(header => header.label).join(',');
  
  // Create data rows
  const dataRows = data.map(item => {
    return headers.map(header => {
      let value = item[header.key];
      
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          value = value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join('; ');
        } else {
          value = JSON.stringify(value);
        }
      }
      
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value || '';
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export subscriptions to CSV
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} filename - Filename for download
 */
export const exportSubscriptionsCSV = (subscriptions, filename = 'subscriptions.csv') => {
  const headers = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'amount', label: 'Importo' },
    { key: 'amountType', label: 'Tipo Importo' },
    { key: 'recurrence.type', label: 'Tipo Ricorrenza' },
    { key: 'recurrence.interval', label: 'Intervallo Ricorrenza' },
    { key: 'recurrence.day', label: 'Giorno Ricorrenza' },
    { key: 'startDate', label: 'Data Inizio' },
    { key: 'endDate', label: 'Data Fine' },
    { key: 'status', label: 'Stato' },
    { key: 'shared', label: 'Condiviso' },
    { key: 'notes', label: 'Note' }
  ];
  
  const csvContent = convertToCSV(subscriptions, headers);
  downloadCSV(csvContent, filename);
};

/**
 * Export payments to CSV
 * @param {Array} payments - Array of payment objects
 * @param {Array} subscriptions - Array of subscription objects for reference
 * @param {string} filename - Filename for download
 */
export const exportPaymentsCSV = (payments, subscriptions = [], filename = 'payments.csv') => {
  const headers = [
    { key: 'subscriptionName', label: 'Subscription' },
    { key: 'dateDue', label: 'Due Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'paid', label: 'Paid' },
    { key: 'paidDate', label: 'Paid Date' },
    { key: 'splits', label: 'Splits' },
    { key: 'status', label: 'Status' }
  ];
  
  // Enhance payments with subscription names
  const enhancedPayments = payments.map(payment => {
    const subscription = subscriptions.find(sub => sub.id === payment.subscriptionId);
    return {
      ...payment,
      subscriptionName: subscription ? subscription.name : 'Unknown',
      status: payment.paid ? 'Paid' : 'Pending'
    };
  });
  
  const csvContent = convertToCSV(enhancedPayments, headers);
  downloadCSV(csvContent, filename);
};

/**
 * Export people balances to CSV
 * @param {Object} balances - Person balances object
 * @param {string} filename - Filename for download
 */
export const exportBalancesCSV = (balances, filename = 'balances.csv') => {
  const headers = [
    { key: 'personName', label: 'Person' },
    { key: 'totalOwed', label: 'Total Owed' },
    { key: 'totalPaid', label: 'Total Paid' },
    { key: 'netBalance', label: 'Net Balance' },
    { key: 'pendingPayments', label: 'Pending Payments Count' }
  ];
  
  // Convert balances object to array
  const balancesArray = Object.values(balances).map(balance => ({
    ...balance,
    pendingPayments: balance.pendingPayments.length
  }));
  
  const csvContent = convertToCSV(balancesArray, headers);
  downloadCSV(csvContent, filename);
};

/**
 * Export accounting report to CSV
 * @param {Object} reportData - Accounting report data
 * @param {string} filename - Filename for download
 */
export const exportAccountingCSV = (reportData, filename = 'accounting_report.csv') => {
  const { overview, categoryBreakdown, personBreakdown, monthlyForecast } = reportData;
  
  let csvContent = '';
  
  // Overview section
  if (overview) {
    csvContent += 'OVERVIEW\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Current Month Total,${overview.currentMonthTotal}\n`;
    csvContent += `Current Year Total,${overview.currentYearTotal}\n`;
    csvContent += `Pending Refunds,${overview.pendingRefunds}\n`;
    csvContent += `Net Balance,${overview.netBalance}\n\n`;
  }
  
  // Category breakdown
  if (categoryBreakdown && categoryBreakdown.length > 0) {
    csvContent += 'CATEGORY BREAKDOWN\n';
    csvContent += 'Category,Total,Monthly Equivalent,Count\n';
    categoryBreakdown.forEach(category => {
      csvContent += `${category.category},${category.total},${category.monthlyEquivalent},${category.count}\n`;
    });
    csvContent += '\n';
  }
  
  // Person breakdown
  if (personBreakdown && personBreakdown.length > 0) {
    csvContent += 'PERSON BREAKDOWN\n';
    csvContent += 'Person,Total Owed,Total Paid,Net Balance\n';
    personBreakdown.forEach(person => {
      csvContent += `${person.personName},${person.totalOwed},${person.totalPaid},${person.netBalance}\n`;
    });
    csvContent += '\n';
  }
  
  // Monthly forecast
  if (monthlyForecast && monthlyForecast.length > 0) {
    csvContent += 'MONTHLY FORECAST\n';
    csvContent += 'Month,Total,Active Subscriptions,Trend\n';
    monthlyForecast.forEach(month => {
      csvContent += `${month.monthName},${month.total},${month.activeSubscriptions},${month.trend}\n`;
    });
  }
  
  downloadCSV(csvContent, filename);
};
