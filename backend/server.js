const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'living-book-api' });
});

app.post('/ask', (req, res) => {
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

  res.json(answer);
});

app.listen(PORT, () => {
  console.log(`The Living Book server is listening on port ${PORT}`);
});
