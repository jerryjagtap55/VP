// Formatters are created once and reused; constructing Intl objects is relatively costly.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CAD',
});

// Date-only ISO strings ("2026-10-15") are parsed as UTC midnight, so they must also be
// formatted in UTC. Formatting in local time would show Oct 14 for users west of UTC.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
