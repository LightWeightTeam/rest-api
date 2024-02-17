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

    // Benutzerinformationen für weitere Verwendung im Request speichern
    req.user = { uid, email };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token', success: false });
  }
};

export { authenticateToken };