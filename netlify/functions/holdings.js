const { MongoClient, ObjectId } = require("mongodb");

let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db("portfolio");
  return cachedDb;
}

// Extract user ID from Netlify Identity JWT
function getUserId(event) {
  const ctx = event.requestContext?.authorizer?.claims || 
              JSON.parse(Buffer.from(event.headers.authorization.split('.')[1], 'base64').toString());
  return ctx.sub;
}

exports.handler = async function (event) {
  // Verify auth
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  let userId;
  try {
    // Decode JWT payload (Netlify Identity tokens are trusted at the function level)
    const payload = JSON.parse(
      Buffer.from(authHeader.split(".")[1], "base64").toString()
    );
    userId = payload.sub;
    if (!userId) throw new Error("No sub in token");
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid token" }) };
  }

  const db = await getDb();
  const col = db.collection("holdings");

  try {
    // GET — list all holdings for this user
    if (event.httpMethod === "GET") {
      const docs = await col.find({ userId }).toArray();
      return { statusCode: 200, body: JSON.stringify(docs) };
    }

    // POST — add a holding
    if (event.httpMethod === "POST") {
      const holding = JSON.parse(event.body);
      holding.userId = userId;
      holding.createdAt = new Date();
      const result = await col.insertOne(holding);
      return {
        statusCode: 201,
        body: JSON.stringify({ _id: result.insertedId, ...holding }),
      };
    }

    // DELETE — remove a holding by _id
    if (event.httpMethod === "DELETE") {
      const id = event.queryStringParameters?.id;
      if (!id) return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };
      await col.deleteOne({ _id: new ObjectId(id), userId });
      return { statusCode: 200, body: JSON.stringify({ deleted: true }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};