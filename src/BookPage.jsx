import { useState } from 'react';
import './BookPage.css';

const BookPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [animatingLines, setAnimatingLines] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsThinking(true);
    setAnswer(null);
    setAnimatingLines([]);

    // Thinking pause (400-700ms)
    const thinkingDuration = 400 + Math.random() * 300;
    await new Promise(resolve => setTimeout(resolve, thinkingDuration));

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      setIsThinking(false);
      setAnswer(data);
      animateAnswer(data);
    } catch (error) {
      console.error('Error:', error);
      setIsThinking(false);
    }
  };

  const animateAnswer = (data) => {
    const lines = [
      { type: 'title', text: data.title },
      ...data.explanation.map(text => ({ type: 'explanation', text })),
      ...data.practicalGuidance.map(text => ({ type: 'guidance', text })),
      ...data.notes.map(text => ({ type: 'note', text })),
    ];

    let delay = 0;
    lines.forEach((line, index) => {
      setTimeout(() => {
        setAnimatingLines(prev => [...prev, { ...line, index }]);
      }, delay);

      // Stagger timing: titles and headings get more pause
      if (line.type === 'title') {
        delay += 600;
      } else {
        delay += 300;
      }
    });
  };

  return (
    <div className="book-container">
      <div className="book-page">
        <div className="page-content">
          <form onSubmit={handleSubmit} className="question-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question..."
              className="question-input"
              disabled={isThinking}
            />
          </form>

          {isThinking && (
            <div className="thinking-state">
              <span className="thinking-text">reading...</span>
            </div>
          )}

          {answer && (
            <div className="answer-content">
              {animatingLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`ink-line ink-line-${line.type}`}
                  style={{
                    animationDelay: '0s'
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
