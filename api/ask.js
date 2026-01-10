export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  // Placeholder response with the structure expected by the frontend
  const answer = {
    title: 'On the Nature of Understanding',
    explanation: [
      'The question you have posed touches upon fundamental principles that have occupied scholars for centuries. To address this matter properly, we must first establish a framework of understanding.',
      'Consider that knowledge is not merely accumulated facts, but rather a tapestry of interconnected concepts that inform our comprehension of the world around us.',
      'In examining your inquiry more closely, we find that the answer lies not in a simple declaration, but in the careful consideration of multiple perspectives and their synthesis.'
    ],
    practicalGuidance: [
      'Begin by observing the patterns that emerge in your daily experience, for theory without practice remains incomplete.',
      'Document your findings systematically, allowing each observation to inform the next.',
      'Seek discourse with others who have traveled similar paths of inquiry, for wisdom is often refined through dialogue.'
    ],
    notes: [
      'Note well: This understanding may shift as new evidence presents itself. The mark of a true scholar is the willingness to revise one\'s conclusions when warranted.',
      'Further reading may be found in the classical texts, though direct experience often proves the most instructive teacher.'
    ]
  };

  res.status(200).json(answer);
}
