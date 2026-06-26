export const getAppUrl = (): string => {
  return `http://localhost:${process.env.PORT || 5000}`;
};
