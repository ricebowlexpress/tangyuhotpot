const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const db = admin.firestore();

function weightedPick(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const snapshot = await db.collection("prizes").where("active", "==", true).get();

    const prizes = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((prize) => prize.name === "No Prize" || prize.stock > 0);

    if (!prizes.length) {
      return res.status(500).json({ error: "No prizes available" });
    }

    const selectedPrize = weightedPick(prizes);

    await db.collection("plays").add({
      prizeId: selectedPrize.id,
      prizeName: selectedPrize.name,
      playedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "completed"
    });

    if (selectedPrize.name !== "No Prize") {
      await db.collection("prizes").doc(selectedPrize.id).update({
        stock: admin.firestore.FieldValue.increment(-1)
      });
    }

    return res.status(200).json({
      prizeName: selectedPrize.name
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

