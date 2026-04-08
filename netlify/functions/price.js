exports.handler = async function (event) {
  const symbol = event.queryStringParameters.symbol;

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    );
    const raw = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "fetch failed" }),
    };
  }
};