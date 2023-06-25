export const getPrices = (startTimeStamp, endTimeStamp, all) => {
  if (all) {
    return fetchPrices(`https://api.awattar.de/v1/marketdata`);
  } else {
    return fetchPrices(
      `https://api.awattar.de/v1/marketdata?start=${startTimeStamp}&end=${endTimeStamp}`
    );
  }
};

const fetchPrices = async (url) => {
  let priceData = await fetch(url);
  let JSON = await priceData.json();
  return getMinMaxAvg(JSON.data);
};

const getMinMaxAvg = (arr) => {
  let sum = 0;
  let min = { marketprice: 10000000000000 };
  let max = { marketprice: -1000000000000 };
  for (let s of arr) {
    sum += s.marketprice;
    if (s.marketprice > max.marketprice) {
      max = s;
    }
    if (s.marketprice < min.marketprice) {
      min = s;
    }
  }
  return { min: min, max: max, costAvg: (sum / arr.length).toFixed(2) };
};
