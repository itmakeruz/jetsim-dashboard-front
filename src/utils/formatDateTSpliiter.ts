export const formatDateSplitter = (dateString) => {
  if (!dateString) {
    return "";
  }
  return dateString.split("T")[0]; // Splits at 'T' and takes the date part
};
