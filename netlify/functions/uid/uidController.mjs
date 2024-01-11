import { admin } from '../../../public/app.mjs';

const checkUid = async (req, res) => {
  const { uid } = req.query;

  try {
    const user = await admin.auth().getUser(uid);

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen der UID:', error);
    res.status(500).json({ message: 'Fehler beim Überprüfen der UID', success: false });
  }
};

export default {
  checkUid
};
