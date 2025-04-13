import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './FlashCards.css'; // Make sure to create this CSS file

// Set worker using CDN (REQUIRED for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function FlashCards() {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ question: '', answer: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const flipCard = (id) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const addCard = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      const id = cards.length > 0 ? Math.max(...cards.map(card => card.id)) + 1 : 1;
      setCards([...cards, { ...newCard, id, flipped: false }]);
      setNewCard({ question: '', answer: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsFileUploaded(true);
    }
  };

  const extractTextFromPDF = async (pdf) => {
    const numPages = pdf.numPages;
    let textContent = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      const strings = text.items.map((item) => item.str);
      textContent += strings.join(' ') + '\n';
    }
    return textContent;
  };

  const onLoadSuccess = async (pdf) => {
    const text = await extractTextFromPDF(pdf);
    // Simple logic: break text into sentences and group them
    const sentences = text.split(/(?<=[.?!])\s+/);
    const newCards = [];
    for (let i = 0; i < sentences.length - 1; i += 2) {
      const question = sentences[i];
      const answer = sentences[i + 1];
      newCards.push({
        id: cards.length + i + 1,
        question,
        answer,
        flipped: false,
      });
    }
    setCards([...cards, ...newCards]);
  };

  const renderEmptyState = () => {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        </div>
        <h3>No flashcards yet</h3>
        <p>Create your first flashcard using the form on the left or upload a PDF document.</p>
        <div className="sample-card">
          <div className="sample-card-front">
            <div className="sample-card-content">
              <p>Your question will appear here</p>
            </div>
          </div>
          <div className="sample-card-arrow">→</div>
          <div className="sample-card-back">
            <div className="sample-card-content">
              <p>Your answer will appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flashcards-page">
      <div className="header">
        <h1>Interactive Flashcards</h1>
        <p>Create, study, and master your content with custom flashcards</p>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="upload-section">
            <h3>AutoGenerate PDF</h3>
            <p>Import flashcards from your study materials</p>
            <label className="file-upload-btn">
              <input type="file" accept="application/pdf" onChange={handleFileUpload} />
              Choose PDF File
            </label>
            {isFileUploaded && <span className="file-name">{pdfFile.name}</span>}
            
            {pdfFile && (
              <div className="pdf-preview">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={err => console.error('PDF load error:', err)}
                >
                  <Page pageNumber={1} width={200} />
                </Document>
              </div>
            )}
          </div>

          <div className="add-card-form">
            <h3>Create New Flashcard</h3>
            <div className="form-group">
              <label htmlFor="question">Question</label>
              <input
                id="question"
                type="text"
                name="question"
                value={newCard.question}
                onChange={handleInputChange}
                placeholder="Enter your question"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="answer">Answer</label>
              <textarea
                id="answer"
                name="answer"
                value={newCard.answer}
                onChange={handleInputChange}
                placeholder="Enter your answer"
                className="form-control"
                rows="4"
              />
            </div>
            <button onClick={addCard} className="add-card-btn">Add Flashcard</button>
          </div>
        </div>
        
        <div className="flashcards-content">
          <h2>Your Flashcards ({cards.length})</h2>
          
          {cards.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="flashcards-grid">
              {cards.map(card => (
                <div 
                  key={card.id} 
                  className={`flashcard ${card.flipped ? 'flipped' : ''}`}
                  onClick={() => flipCard(card.id)}
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <div className="card-content">
                        <p>{card.question}</p>
                      </div>
                      <div className="card-footer">
                        <small>Click to reveal answer</small>
                      </div>
                    </div>
                    <div className="flashcard-back">
                      <div className="card-content">
                        <p>{card.answer}</p>
                      </div>
                      <div className="card-footer">
                        <small>Click to see question</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashCards;