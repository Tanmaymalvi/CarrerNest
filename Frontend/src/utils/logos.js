export const companyLogos = {
  Google: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
  Microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  Amazon: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.svg",
  TCS: "https://cdn.iconscout.com/icon/free/png-256/free-tata-consultancy-services-3421382-2854298.png",
  Infosys: "https://cdn.iconscout.com/icon/free/png-256/free-infosys-3421447-2854359.png",
  Wipro: "https://cdn.iconscout.com/icon/free/png-256/free-wipro-3421528-2854440.png",
  Accenture: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
  Deloitte: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
  IBM: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  Capgemini: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Capgemini_logo.svg",
  Cognizant: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Cognizant_logo_2022.svg",
  "HCL Technologies": "https://upload.wikimedia.org/wikipedia/commons/7/75/HCL_Technologies_logo.svg",
  Adobe: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_logo_character.svg",
  Flipkart: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flipkart_logo_without_tagline.png",
  Paytm: "https://cdn.iconscout.com/icon/free/png-256/free-paytm-226448.png"
};

export const getCompanyLogo = (companyName) => {
  const name = typeof companyName === "object" ? companyName?.name : companyName;
  if (!name) return "";
  
  const matchKey = Object.keys(companyLogos).find(
    (key) => name.toLowerCase().includes(key.toLowerCase())
  );
  
  return matchKey ? companyLogos[matchKey] : "";
};
