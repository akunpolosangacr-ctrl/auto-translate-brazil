export default function handler(req, res) {
  res.status(200).json({ status: 'active', message: 'Root entrypoint online' });
}
