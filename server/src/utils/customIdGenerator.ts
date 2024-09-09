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

export const genericPassword = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(Math.random() * 10000).toString(36);
  return `${random}${timestamp}`;
};
