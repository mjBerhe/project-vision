export const sumColumns = (data: (string[] | number[])[]): number[] => {
  if (data.length === 0) return [];

  return data[0].map((_, colIndex) =>
    data.reduce(
      (sum, row) => sum + (isNaN(Number(row[colIndex])) ? 0 : Number(row[colIndex])),
      0
    )
  );
};

export const subtractRows = (row1: string[], row2: string[]): number[] => {
  // Ensure both rows have the same length
  if (row1.length !== row2.length) {
    throw new Error("Rows must have the same length");
  }

  return row1.map((value, index) => {
    const num1 = Number(value);
    const num2 = Number(row2[index]);
    // Return the subtraction result, assuming valid numeric conversion
    return isNaN(num1) || isNaN(num2) ? 0 : num1 - num2;
  });
};
