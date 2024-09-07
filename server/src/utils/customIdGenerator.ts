//create a unique ID base on combination of methods

export const GenerateCustomID = (initialNumber: number | string) => {
  const now = new Date();
  const generationDate = `${now.getFullYear()}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(Math.random() * 1000);
  return `${initialNumber}${generationDate}${random}${timestamp}`;
};
