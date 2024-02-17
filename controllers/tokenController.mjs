import admin from 'firebase-admin';
const adminApp = admin.app();


const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided', success: false });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;
    console.log('Decoded Token:', decodedToken);
console.log('req.query.uid:', req.query.uid);
console.log('req.query.email:', req.query.email);

    // Überprüfen, ob UID und E-Mail aus dem Token mit der Anfrage übereinstimmen
    if (uid !== req.query.uid || email !== req.query.email) {
      return res.status(403).json({ message: 'Forbidden: Token does not match user', success: false });
    }

    // Benutzerinformationen für weitere Verwendung im Request speichern
    req.user = { uid, email };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token', success: false });
  }
};

export { authenticateToken };

