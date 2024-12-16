"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
};

type CurrencyContextType = {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertPrice: (priceInNZD: number) => string;
  currencies: Currency[];
};

const currencies: Currency[] = [
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', rate: 1 },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', rate: 0.94 }, // Example rate
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // Load saved currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency.code);
  }, [selectedCurrency]);

  const convertPrice = (priceInNZD: number): string => {
    const convertedPrice = priceInNZD * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        currencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
