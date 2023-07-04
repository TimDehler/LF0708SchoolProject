export const getPrices = async (startTimeStamp, endTimeStamp, all) => {
  if (all) {
    return await fetchPrices(`https://api.awattar.de/v1/marketdata`);
  } else {
    return await fetchPrices(
      `https://api.awattar.de/v1/marketdata?start=${startTimeStamp}&end=${endTimeStamp}`
    );
  }
};

const fetchPrices = async (url) => {
  let fetchedData;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      fetchedData = getMinMaxAvg(data.data);
    })
    .catch((error) => {
      console.log(error);
    });
  return fetchedData;
};

const getMinMaxAvg = (arr) => {
  const min = arr.filter(
    (entry) =>
      entry.marketprice === Math.min(...arr.map((entry) => entry.marketprice))
  );

  const max = arr.filter(
    (entry) =>
      entry.marketprice === Math.max(...arr.map((entry) => entry.marketprice))
  );

  const avg =
    arr.map((entry) => entry.marketprice).reduce((a, b) => a + b) / arr.length;

  return { min: min[0], max: max[0], costAvg: avg.toFixed(2) };
};
