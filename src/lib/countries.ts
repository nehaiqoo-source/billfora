export type CountryCode =
  | "IN"
  | "US"
  | "GB"
  | "AE"
  | "SG"
  | "AU"
  | "CA"
  | "DE"
  | "FR"
  | "NL"
  | "SA"
  | "ZA"
  | "BR"
  | "JP"
  | "NZ";

export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD"
  | "DD.MM.YYYY"
  | "YYYY/MM/DD"
  | "DD-MM-YYYY";

export type AddressOrder =
  | "street-city-state-zip"
  | "street-city-zip"
  | "street-zip-city"
  | "zip-city-street"
  | "street-city-prefecture-zip";

export type CountryPack = {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  taxIdLabel: string;
  taxLabel: string;
  invoiceTitle: string;
  numberPrefix: string;
  defaultTaxRate: number;
  dateFormat: DateFormat;
  addressOrder: AddressOrder;
  legalNote: string;
  /** Show HSN/SAC column on line items */
  showHsn?: boolean;
  /** India GST: CGST+SGST vs IGST */
  gstSplit?: boolean;
};

export const COUNTRIES: CountryPack[] = [
  {
    code: "IN",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    taxIdLabel: "GSTIN",
    taxLabel: "GST",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 18,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "This is a computer-generated tax invoice under the GST Act. Subject to jurisdiction of the supplier's place of business.",
    showHsn: true,
    gstSplit: true,
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    taxIdLabel: "EIN",
    taxLabel: "Sales Tax",
    invoiceTitle: "Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 0,
    dateFormat: "MM/DD/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "Payment is due by the date stated. Late payments may incur interest as permitted by applicable state law.",
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    taxIdLabel: "VAT Number",
    taxLabel: "VAT",
    invoiceTitle: "Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 20,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-zip",
    legalNote:
      "VAT registered. This invoice is issued in accordance with UK VAT regulations.",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    currency: "AED",
    currencySymbol: "د.إ",
    locale: "en-AE",
    taxIdLabel: "TRN",
    taxLabel: "VAT",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 5,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "This tax invoice is issued under Federal Decree-Law No. 8 of 2017 on Value Added Tax.",
  },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
    currencySymbol: "S$",
    locale: "en-SG",
    taxIdLabel: "UEN / GST Reg. No.",
    taxLabel: "GST",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 9,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-zip",
    legalNote:
      "This is a GST tax invoice. Prices are in Singapore Dollars unless otherwise stated.",
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "A$",
    locale: "en-AU",
    taxIdLabel: "ABN",
    taxLabel: "GST",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 10,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "This document is a tax invoice for GST purposes. ABN must be shown if registered.",
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "C$",
    locale: "en-CA",
    taxIdLabel: "Business Number",
    taxLabel: "GST/HST",
    invoiceTitle: "Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 5,
    dateFormat: "YYYY-MM-DD",
    addressOrder: "street-city-state-zip",
    legalNote:
      "GST/HST registration number appears above where applicable. Payment terms as stated.",
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    taxIdLabel: "USt-IdNr.",
    taxLabel: "MwSt",
    invoiceTitle: "Rechnung",
    numberPrefix: "RE-",
    defaultTaxRate: 19,
    dateFormat: "DD.MM.YYYY",
    addressOrder: "street-zip-city",
    legalNote:
      "Rechnung gemäß §14 UStG. Bei Zahlungsverzug werden Verzugszinsen berechnet.",
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
    taxIdLabel: "N° TVA",
    taxLabel: "TVA",
    invoiceTitle: "Facture",
    numberPrefix: "FAC-",
    defaultTaxRate: 20,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-zip-city",
    legalNote:
      "Facture établie conformément à la réglementation française. Pénalités de retard applicables.",
  },
  {
    code: "NL",
    name: "Netherlands",
    currency: "EUR",
    currencySymbol: "€",
    locale: "nl-NL",
    taxIdLabel: "BTW-nummer",
    taxLabel: "BTW",
    invoiceTitle: "Factuur",
    numberPrefix: "FAC-",
    defaultTaxRate: 21,
    dateFormat: "DD-MM-YYYY",
    addressOrder: "street-zip-city",
    legalNote:
      "Factuur conform Nederlandse BTW-wetgeving. Betaling binnen de gestelde termijn.",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    currency: "SAR",
    currencySymbol: "﷼",
    locale: "ar-SA",
    taxIdLabel: "VAT Number",
    taxLabel: "VAT",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 15,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "Tax invoice issued under the KSA VAT Law. Prices include VAT where indicated.",
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    currencySymbol: "R",
    locale: "en-ZA",
    taxIdLabel: "VAT Number",
    taxLabel: "VAT",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 15,
    dateFormat: "YYYY-MM-DD",
    addressOrder: "street-city-state-zip",
    legalNote:
      "Tax invoice as defined in the Value-Added Tax Act. Vendor VAT number shown above.",
  },
  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    currencySymbol: "R$",
    locale: "pt-BR",
    taxIdLabel: "CNPJ",
    taxLabel: "Impostos",
    invoiceTitle: "Nota Fiscal",
    numberPrefix: "NF-",
    defaultTaxRate: 0,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-state-zip",
    legalNote:
      "Documento fiscal simplificado para fins de cobrança. Consulte a legislação local para NF-e.",
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
    currencySymbol: "¥",
    locale: "ja-JP",
    taxIdLabel: "Registration Number",
    taxLabel: "消費税",
    invoiceTitle: "請求書",
    numberPrefix: "INV-",
    defaultTaxRate: 10,
    dateFormat: "YYYY/MM/DD",
    addressOrder: "street-city-prefecture-zip",
    legalNote:
      "適格請求書等保存方式に基づく請求書です。登録番号を記載しています。",
  },
  {
    code: "NZ",
    name: "New Zealand",
    currency: "NZD",
    currencySymbol: "NZ$",
    locale: "en-NZ",
    taxIdLabel: "GST Number",
    taxLabel: "GST",
    invoiceTitle: "Tax Invoice",
    numberPrefix: "INV-",
    defaultTaxRate: 15,
    dateFormat: "DD/MM/YYYY",
    addressOrder: "street-city-zip",
    legalNote:
      "This is a tax invoice for GST purposes under the Goods and Services Tax Act 1985.",
  },
];

export function getCountry(code: CountryCode): CountryPack {
  const pack = COUNTRIES.find((c) => c.code === code);
  if (!pack) {
    throw new Error(`Unknown country code: ${code}`);
  }
  return pack;
}
