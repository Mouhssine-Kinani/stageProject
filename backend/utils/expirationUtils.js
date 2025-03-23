const calculateExpirationDate = (product) => {
  const deploymentDate = new Date(product.productAddedDate);
  const cycles = {
    monthly: 1,
    yearly: 12,
    biennial: 24
  };

  const months = cycles[product.billing_cycle];
  const expirationDate = new Date(deploymentDate);
  expirationDate.setMonth(expirationDate.getMonth() + months);
  
  return expirationDate;
};

const getRemainingDays = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export { calculateExpirationDate, getRemainingDays }; 