export const getprices = (startTimeStamp, endTimeStamp) => {
  return fetchPrices(
    `https://api.awattar.de/v1/marketdata?start=${startTimeStamp}&end=${endTimeStamp}`
  );
};

const fetchPrices = async (url) => {
  let priceData = await fetch(url);
  let JSON = await priceData.json();
  return getAvg(JSON.data);
};

const getAvg = (arr) => {
  let sum = 0;
  for (let s of arr) {
    sum += s.marketprice;
  }
  return (sum / arr.length).toFixed(2);
};
