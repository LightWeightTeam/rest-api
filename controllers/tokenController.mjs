import admin from 'firebase-admin';
const adminApp = admin.app();

// Middleware zur Token-Authentifizierung
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided', success: false });
  }

  try {
    // Token überprüfen und dekodieren
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Überprüfen, ob UID und E-Mail in Firebase Auth übereinstimmen
    const userRecord = await admin.auth().getUser(uid);

    if (userRecord.email === email) {
      // Benutzerinformationen aus dem Token extrahieren
      req.user = { uid, email };

      // Hier kannst du weitere Überprüfungen durchführen, wenn nötig

      // Weiter zum nächsten Middleware oder zur Route
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: UID and Email do not match', success: false });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token', success: false });
  }
};

export { authenticateToken };