type NumericInput = string | number;

export function numberToWords(value: NumericInput): string {
  if (value === null || value === undefined || value === "") return "";

  const amount = Number(value);

  if (Number.isNaN(amount)) return "";

  const num = Math.floor(Math.abs(amount));

  if (num === 0) return "";

  return convertToIndianWords(num).trim();
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertToIndianWords(num: number): string {
  let words = "";

  if (num >= 10000000) {
    words += convertToIndianWords(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }

  if (num >= 100000) {
    words += convertToIndianWords(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  if (num >= 1000) {
    words += convertToIndianWords(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  if (num >= 100) {
    words += convertToIndianWords(Math.floor(num / 100)) + " Hundred ";
    num %= 100;
  }

  if (num > 0) {
    if (words !== "") words += "";
    words += convertBelowHundred(num);
  }

  return words;
}

function convertBelowHundred(num: number): string {
  if (num < 20) return ONES[num];
  return `${TENS[Math.floor(num / 10)]} ${ONES[num % 10]}`.trim();
}
