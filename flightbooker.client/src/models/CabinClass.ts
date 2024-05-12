export enum CabinClass {
    FirstClass = 1,
    Business = 2,
    PremiumEconomy = 3,
    Economy = 4,
  }
  
  export const getCabinClassLabel = (cabinClass: CabinClass) => {
    switch (cabinClass) {
      case CabinClass.Economy:
        return "Economy";
      case CabinClass.Business:
        return "Business";
      case CabinClass.FirstClass:
        return "First Class";
      case CabinClass.PremiumEconomy:
        return "Premium Economy";
      default:
        return "Unknown";
    }
  };

  export const getCabinClassPriceLabel = (cabinClass: CabinClass) => {
    switch (cabinClass) {
      case CabinClass.Economy:
        return "economy";
      case CabinClass.Business:
        return "business";
      case CabinClass.FirstClass:
        return "firstClass";
      case CabinClass.PremiumEconomy:
        return "premiumEconomy";
    }
  }
  
  export const getCabinClassId = (cabinClass: string) => {
    switch (cabinClass.toLowerCase()) {
      case "economy":
        return CabinClass.Economy;
      case "business":
        return CabinClass.Business;
      case "first class":
      case "firstclass":
        return CabinClass.FirstClass;
      case "premium economy":
      case "premiumeconomy":
        return CabinClass.PremiumEconomy;
      default:
        return null;
    }
  };
  
  export const getCabinClassColor = (cabinClass: CabinClass | null) => {
    if (cabinClass === null) return "inherit";
  
    switch (cabinClass) {
      case CabinClass.Economy:
        return "#fde68a";
      case CabinClass.Business:
        return "#7dd3fc";
      case CabinClass.FirstClass:
        return "#99f6e4";
      case CabinClass.PremiumEconomy:
        return "#86efac";
      default:
        return "inherit";
    }
  };