declare module 'numeral' {
    const numeral: (value?: any) => Numeral;
    interface Numeral {
      format(formatString: string): string;
    }
    export = numeral;
  }
  