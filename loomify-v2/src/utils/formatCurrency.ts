const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(amount);
};

export default formatCurrency;
