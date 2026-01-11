import { useState, useRef, useEffect } from 'react';
import './BookPage.css';

const BookPage = () => {
  const [question, setQuestion] = useState('');
  const [entries, setEntries] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeBookmark, setActiveBookmark] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const contentRef = useRef(null);

  const bookmarkTabs = [
    { id: 'bookmarks', label: 'Bookmarks', color: '#8b4513' },
    { id: 'library', label: 'Library', color: '#654321' },
    { id: 'bookshop', label: 'Bookshop', color: '#704214' },
    { id: 'journal', label: 'Journal', color: '#5c3317' },
    { id: 'letters', label: 'Letters', color: '#7b3f00' }
  ];

  const countWords = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getTotalWordCount = (entries) => {
    return entries.reduce((total, entry) => {
      const titleWords = countWords(entry.title || '');
      const explanationWords = entry.explanation?.reduce((sum, text) => sum + countWords(text), 0) || 0;
      const guidanceWords = entry.practicalGuidance?.reduce((sum, text) => sum + countWords(text), 0) || 0;
      const notesWords = entry.notes?.reduce((sum, text) => sum + countWords(text), 0) || 0;
      return total + titleWords + explanationWords + guidanceWords + notesWords;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsThinking(true);

    const thinkingDuration = 400 + Math.random() * 300;
    await new Promise(resolve => setTimeout(resolve, thinkingDuration));

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      const newEntry = {
        id: Date.now(),
        question,
        ...data,
        timestamp: new Date(),
        wordCount: countWords(data.title) +
                   (data.explanation?.reduce((sum, text) => sum + countWords(text), 0) || 0) +
                   (data.practicalGuidance?.reduce((sum, text) => sum + countWords(text), 0) || 0) +
                   (data.notes?.reduce((sum, text) => sum + countWords(text), 0) || 0)
      };

      setEntries(prev => {
        const updated = [...prev, newEntry];
        const totalWords = getTotalWordCount(updated);

        // Remove old entries if over 10,000 words (but keep bookmarked ones)
        if (totalWords > 10000) {
          const bookmarkedIds = bookmarks.map(b => b.entryId);
          let currentWords = totalWords;
          const filtered = [];

          for (let i = updated.length - 1; i >= 0; i--) {
            filtered.unshift(updated[i]);
            if (currentWords <= 10000) break;
            if (!bookmarkedIds.includes(updated[i].id)) {
              currentWords -= updated[i].wordCount;
              filtered.shift();
            }
          }
          return filtered;
        }

        return updated;
      });

      setIsThinking(false);
      setQuestion('');

      // Scroll to bottom
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      setIsThinking(false);
    }
  };

  const handleBookmarkClick = (tabId) => {
    setActiveBookmark(activeBookmark === tabId ? null : tabId);
  };

  const addBookmark = () => {
    if (entries.length === 0) return;

    const lastEntry = entries[entries.length - 1];
    const bookmark = {
      id: Date.now(),
      entryId: lastEntry.id,
      title: lastEntry.question,
      timestamp: new Date(),
      scrollPosition: contentRef.current?.scrollTop || 0
    };

    setBookmarks(prev => [...prev, bookmark]);
  };

  const scrollToBookmark = (bookmark) => {
    const entryElement = document.getElementById(`entry-${bookmark.entryId}`);
    if (entryElement && contentRef.current) {
      const offsetTop = entryElement.offsetTop;
      contentRef.current.scrollTo({
        top: offsetTop - 100,
        behavior: 'smooth'
      });
    }
    setActiveBookmark(null);
  };

  useEffect(() => {
    setTotalWords(getTotalWordCount(entries));
  }, [entries]);

  return (
    <div className="book-container">
      <div className="book-page">
        <div className="page-content" ref={contentRef}>
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

          {entries.map((entry, idx) => (
            <div key={entry.id} id={`entry-${entry.id}`} className="entry-content">
              <div className="ink-line ink-line-title">{entry.title}</div>
              {entry.explanation?.map((text, i) => (
                <div key={i} className="ink-line ink-line-explanation">{text}</div>
              ))}
              {entry.practicalGuidance?.map((text, i) => (
                <div key={i} className="ink-line ink-line-guidance">{text}</div>
              ))}
              {entry.notes?.map((text, i) => (
                <div key={i} className="ink-line ink-line-note">{text}</div>
              ))}
            </div>
          ))}

          <div className="word-counter">{totalWords} / 10,000 words</div>
        </div>

        {/* Bookmark tabs */}
        <div className="bookmark-tabs">
          {bookmarkTabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`bookmark-tab ${activeBookmark === tab.id ? 'active' : ''}`}
              style={{
                backgroundColor: tab.color,
                left: `${-80 + (index * 15)}px`,
                zIndex: activeBookmark === tab.id ? 1000 : index
              }}
              onClick={() => handleBookmarkClick(tab.id)}
            >
              <span className="bookmark-label">{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Bookmark panels */}
        {activeBookmark === 'bookmarks' && (
          <div className="bookmark-panel">
            <h2>Bookmarks</h2>
            <button onClick={addBookmark} className="bookmark-action">
              Bookmark Current Page
            </button>
            <div className="bookmark-list">
              {bookmarks.length === 0 ? (
                <p className="empty-message">No bookmarks yet</p>
              ) : (
                bookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="bookmark-item"
                    onClick={() => scrollToBookmark(bookmark)}
                  >
                    <div className="bookmark-title">{bookmark.title}</div>
                    <div className="bookmark-date">
                      {bookmark.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeBookmark === 'library' && (
          <div className="bookmark-panel">
            <h2>Library</h2>
            <p className="empty-message">Your personal collection of books</p>
          </div>
        )}

        {activeBookmark === 'bookshop' && (
          <div className="bookmark-panel">
            <h2>Bookshop</h2>
            <p className="empty-message">Browse and purchase books</p>
          </div>
        )}

        {activeBookmark === 'journal' && (
          <div className="bookmark-panel">
            <h2>Journal</h2>
            <p className="empty-message">Reflect on your thoughts and writings</p>
          </div>
        )}

        {activeBookmark === 'letters' && (
          <div className="bookmark-panel">
            <h2>Letters</h2>
            <p className="empty-message">Private, ephemeral correspondence</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
