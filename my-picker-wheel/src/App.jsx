import { useState, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css";
import questions from "./Questions";

const domains = [
  { option: "Python" },
  { option: "AI/ML" },
  { option: "Web Development" },
  { option: "Databases" },
  { option: "Fun Facts" },
  { option: "Cybersecurity" }
];

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * domains.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setSelectedDomain(null);
    setQuestion(null);
    setShowAnswer(false);
    setHasSpun(true);
  };

  const handleStop = () => {
    const domain = domains[prizeNumber].option;
    setSelectedDomain(domain);
    const randomQuestion = questions[domain][Math.floor(Math.random() * questions[domain].length)];
    setQuestion(randomQuestion);
    setTimeLeft(30);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Get domain color
  const getDomainColor = (domain) => {
    const colorMap = {
      "Python": "#306998",
      "AI/ML": "#FF6384",
      "Web Development": "#36A2EB",
      "Databases": "#4BC0C0",
      "Fun Facts": "#FFCE56",
      "Cybersecurity": "#9966FF"
    };
    return colorMap[domain] || "#36A2EB";
  };

  return (
    <div className="container">
      <h1 className="title">Tech Trivia Wheel</h1>
      
      <div className="content">
        {/* Spinner */}
        <div className="wheel-container">
          <button className="spin-button" onClick={handleSpinClick}>
            {mustSpin ? "Spinning..." : "Spin"}
          </button>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={domains}
            onStopSpinning={handleStop}
            backgroundColors={domains.map(domain => getDomainColor(domain.option))}
            textColors={["#ffffff"]}
            fontSize={14}
            outerBorderColor="#191a23"
            outerBorderWidth={3}
            innerRadius={40}
            innerBorderColor="#191a23"
            innerBorderWidth={2}
          />
        </div>

        {/* Question box with enhanced styling */}
        <div className="question-box">
          {selectedDomain && question ? (
            <>
              <div 
                className="domain-banner" 
                style={{ backgroundColor: getDomainColor(selectedDomain) }}
              >
                <h2>{selectedDomain}</h2>
              </div>
              
              <div className="question-content">
                <p className="question-text">{question.question}</p>
                
                {!showAnswer ? (
                  <div className="timer-container">
                    <div className="timer-bar">
                      <div 
                        className="timer-progress" 
                        style={{ width: `${(timeLeft/30) * 100}%` }}
                      ></div>
                    </div>
                    <p className="timer-text">{timeLeft}s</p>
                  </div>
                ) : (
                  <div className="answer-container">
                    <h3>Answer:</h3>
                    <p className="answer-text">{question.answer}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="welcome-content">
              <div className="welcome-header">
                <h2>Welcome to Tech Trivia!</h2>
                {hasSpun && <p className="loading-text">Loading your question...</p>}
              </div>
              
              <div className="instructions">
                <h3>How to play:</h3>
                <ol>
                  <li>Spin the wheel to select a random tech category</li>
                  <li>Answer the question within 30 seconds</li>
                  <li>The answer will be revealed when time runs out</li>
                </ol>
              </div>
              
              <div className="categories-preview">
                <h3>Categories:</h3>
                <div className="category-chips">
                  {domains.map((domain, index) => (
                    <span 
                      key={index} 
                      className="category-chip"
                      style={{ backgroundColor: getDomainColor(domain.option) }}
                    >
                      {domain.option}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;