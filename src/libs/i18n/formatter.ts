import { NumberFormats, DateTimeFormats } from 'vue-i18n/types';

export const numberFormats: NumberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  },
  ja: {
    currency: {
      style: 'currency',
      currency: 'JPY',
      currencyDisplay: 'symbol'
    }
  }
};

export const dateTimeFormats: DateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  ja: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  }
};
