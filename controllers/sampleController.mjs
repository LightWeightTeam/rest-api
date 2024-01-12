
const getSampleData = (req, res) => {
  res.json({ message: 'GET-Anfrage erfolgreich' });
};

const createSampleData = (req, res) => {
  const { data } = req.body;
  res.json({ message: 'POST-Anfrage erfolgreich', data });
};

export default{
  getSampleData,
  createSampleData,
};
