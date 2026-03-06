import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import questions, { sections } from '../data/questions';

// Fisher-Yates shuffle creating an index map for each question
function buildShuffledOrders(qs) {
  return qs.map(q => {
    const indices = q.answers.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
}
import { calculateResults, calculateRadarScores, findClosestFigures, deriveTopIssues } from '../utils/calcResults';
import { classifyCluster } from '../data/clusters';
import figures from '../data/figures';
import { saveResult, savePermalink, updateDebate, getDebateById } from '../utils/resultsStore';
import { saveUserResult, getSession } from '../utils/authStore';
import { trackEvent, Events } from '../utils/analytics';
import AdSlot from './AdSlot';
import { submitAnonymousResult } from '../utils/dataCollect';

const IMPORTANCE_OPTIONS = ['Low', 'Medium', 'High'];
const CONVICTION_OPTIONS = ['Lean', 'Agree', 'Strongly Agree'];

function generateDebateSummary(result, debateId) {
  const debate = getDebateById(debateId);
  if (!debate?.user1) return null;
  const u1 = debate.user1;
  const u2 = result;
  const eDiff = Math.abs(u1.economic - u2.economic);
  const sDiff = Math.abs(u1.social - u2.social);
  if (eDiff < 2 && sDiff < 2) {
    return `This debate reflects broad ideological alignment between a ${u1.cluster} and a ${u2.cluster}.`;
  }
  if (eDiff > sDiff) {
    return `This debate reflects a conflict between ${u1.cluster.toLowerCase()} and ${u2.cluster.toLowerCase()} — primarily an economic disagreement.`;
  }
  return `This debate reflects a conflict between ${u1.cluster.toLowerCase()} and ${u2.cluster.toLowerCase()} — primarily a social and cultural disagreement.`;
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [importance, setImportance] = useState('Medium');
  const [conviction, setConviction] = useState('Agree');
  const [importanceEverChanged, setImportanceEverChanged] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [country, setCountry] = useState('');
  const [showCountry, setShowCountry] = useState(true);
  const navigate = useNavigate();

  // Shuffle answer order once per quiz session
  const shuffledOrders = useMemo(() => buildShuffledOrders(questions), []);

  const question = questions[currentQ];
  const section = question?.section;
  const progress = ((currentQ) / questions.length) * 100;
  const currentOrder = shuffledOrders[currentQ];

  const finishQuiz = useCallback((finalAnswers) => {
    trackEvent(Events.QUIZ_COMPLETED);

    const { economic, social } = calculateResults(finalAnswers);
    const radarScores = calculateRadarScores(finalAnswers);
    const closestFigs = findClosestFigures(economic, social, figures);
    const clustersResult = classifyCluster(economic, social);
    const topIssues = deriveTopIssues(finalAnswers, questions);
    const topCluster = clustersResult[0];

    const resultId = crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10);

    const resultData = {
      id: resultId,
      economic,
      social,
      cluster: topCluster.name,
      clusterColor: topCluster.color,
      clusterDescription: topCluster.description,
      clusters: clustersResult,
      closestFigures: closestFigs.map(f => ({ name: f.name, id: f.id, distance: f.distance, description: f.description })),
      radarScores,
      topIssues,
      country: country || 'Unknown',
      importanceUsed: importanceEverChanged,
      timestamp: new Date().toISOString(),
      answers: finalAnswers,
    };

    saveResult(resultData);
    savePermalink(resultId, resultData);

    // Send anonymized data to server (only if user consented)
    submitAnonymousResult({
      economic: resultData.economic,
      social: resultData.social,
      cluster: resultData.cluster,
      country: resultData.country,
    });

    const session = getSession();
    if (session) {
      saveUserResult(resultData);
    }

    // Check if this quiz is part of a debate challenge
    const activeDebateId = sessionStorage.getItem('active_debate');
    if (activeDebateId) {
      sessionStorage.removeItem('active_debate');
      const debateSummary = generateDebateSummary(resultData, activeDebateId);
      updateDebate(activeDebateId, {
        user2: {
          economic: resultData.economic,
          social: resultData.social,
          cluster: resultData.cluster,
          radarScores: resultData.radarScores,
          topIssues: resultData.topIssues,
        },
        summary: debateSummary,
      });
      navigate(`/compare/${activeDebateId}`);
      return;
    }

    navigate(`/results/${resultId}`);
  }, [country, importanceEverChanged, navigate]);

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) return;

    // Map display position back to original answer
    const originalIndex = currentOrder[selectedAnswer];
    const answer = question.answers[originalIndex];
    const newAnswers = [...answers, {
      questionId: question.id,
      answerIndex: originalIndex,
      economic: answer.economic,
      social: answer.social,
      importance,
      conviction,
    }];
    setAnswers(newAnswers);

    trackEvent(Events.QUESTION_ANSWERED, { questionId: question.id, section });

    if (currentQ === 11) {
      setShowPause(true);
      setSelectedAnswer(null);
      setImportance('Medium');
      setConviction('Agree');
      return;
    }

    if (currentQ === questions.length - 1) {
      finishQuiz(newAnswers);
      return;
    }

    setCurrentQ(currentQ + 1);
    setSelectedAnswer(null);
    setImportance('Medium');
    setConviction('Agree');
  }, [selectedAnswer, importance, conviction, currentQ, answers, question, currentOrder, finishQuiz]);

  if (showCountry) {
    return (
      <div className="quiz-page container">
        <div className="card quiz-country">
          <h2>Before we begin</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Optionally select your country. This helps us show political trends by region.
          </p>
          <select
            className="input-field"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ marginBottom: 'var(--spacing-lg)' }}
          >
            <option value="">Prefer not to say</option>
            <optgroup label="North America">
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Portugal">Portugal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Austria">Austria</option>
              <option value="Sweden">Sweden</option>
              <option value="Norway">Norway</option>
              <option value="Denmark">Denmark</option>
              <option value="Finland">Finland</option>
              <option value="Iceland">Iceland</option>
              <option value="Ireland">Ireland</option>
              <option value="Poland">Poland</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Hungary">Hungary</option>
              <option value="Romania">Romania</option>
              <option value="Greece">Greece</option>
              <option value="Croatia">Croatia</option>
              <option value="Serbia">Serbia</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Estonia">Estonia</option>
              <option value="Latvia">Latvia</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Ukraine">Ukraine</option>
              <option value="Russia">Russia</option>
            </optgroup>
            <optgroup label="Asia &amp; Pacific">
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Japan">Japan</option>
              <option value="South Korea">South Korea</option>
              <option value="China">China</option>
              <option value="Taiwan">Taiwan</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Philippines">Philippines</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Thailand">Thailand</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
            </optgroup>
            <optgroup label="Middle East &amp; Africa">
              <option value="Turkey">Turkey</option>
              <option value="Israel">Israel</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Iran">Iran</option>
              <option value="Egypt">Egypt</option>
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Morocco">Morocco</option>
              <option value="Ethiopia">Ethiopia</option>
            </optgroup>
            <optgroup label="Latin America &amp; Caribbean">
              <option value="Brazil">Brazil</option>
              <option value="Argentina">Argentina</option>
              <option value="Colombia">Colombia</option>
              <option value="Chile">Chile</option>
              <option value="Peru">Peru</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            </optgroup>
            <option value="Other">Other</option>
          </select>
          <div className="privacy-notice">
            Your answers are anonymous. We don't collect personal data unless you choose to create an account.
            You can delete everything at any time.
          </div>
          <button className="btn btn-primary" onClick={() => { setShowCountry(false); trackEvent(Events.QUIZ_STARTED); }}>
            Begin Quiz
          </button>
        </div>
        <style>{quizStyles}</style>
      </div>
    );
  }

  if (showPause) {
    return (
      <div className="quiz-page container">
        <div className="card quiz-pause">
          <h2>Midpoint Check</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            You're halfway through — 12 of 24 questions completed.
            Take a moment before continuing to the next section.
          </p>
          <div className="pause-progress">
            <div className="pause-sections">
              {sections.map((s, i) => (
                <span key={s} className={`pause-section ${i < 2 ? 'done' : ''}`}>
                  {i < 2 ? '\u2713' : ''} {s}
                </span>
              ))}
            </div>
          </div>
          <AdSlot placement="quiz_midpoint" />
          <button className="btn btn-primary" onClick={() => { setShowPause(false); setCurrentQ(12); }}>
            Continue to Institutions
          </button>
        </div>
        <style>{quizStyles}</style>
      </div>
    );
  }

  return (
    <div className="quiz-page container">
      <div className="quiz-header">
        <span className="mono quiz-section-label">{section}</span>
        <span className="mono quiz-counter">Question {currentQ + 1} of {questions.length}</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card quiz-card">
        <h2 className="quiz-question">{question.text}</h2>

        <div className="quiz-answers">
          {currentOrder.map((origIdx, displayIdx) => (
            <button
              key={origIdx}
              className={`quiz-answer ${selectedAnswer === displayIdx ? 'selected' : ''}`}
              onClick={() => setSelectedAnswer(displayIdx)}
            >
              {question.answers[origIdx].text}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="quiz-conviction">
            <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              How strongly do you feel about this answer?
            </label>
            <div className="conviction-options">
              {CONVICTION_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`conviction-btn ${conviction === opt ? 'active' : ''}`}
                  onClick={() => setConviction(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quiz-importance">
          <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            How important is this issue to you?
          </label>
          <div className="importance-options">
            {IMPORTANCE_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`importance-btn ${importance === opt ? 'active' : ''}`}
                onClick={() => { setImportance(opt); if (opt !== 'Medium') setImportanceEverChanged(true); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary quiz-next"
          disabled={selectedAnswer === null}
          onClick={handleNext}
        >
          {currentQ === questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      </div>
      <style>{quizStyles}</style>
    </div>
  );
}

const quizStyles = `
  .quiz-page { padding: var(--spacing-xl) 0; max-width: 720px; }
  .quiz-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: var(--spacing-md);
  }
  .quiz-section-label {
    font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--color-accent);
  }
  .quiz-counter { font-size: 13px; color: var(--color-text-secondary); }
  .quiz-progress-bar {
    height: 3px; background: var(--color-border); border-radius: 2px;
    margin-bottom: var(--spacing-xl); overflow: hidden;
  }
  .quiz-progress-fill {
    height: 100%; background: var(--color-text); border-radius: 2px;
    transition: width 0.3s ease;
  }
  .quiz-question { font-size: 22px; margin-bottom: var(--spacing-xl); }
  .quiz-answers { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); }
  .quiz-answer {
    text-align: left; padding: 14px 18px; border: 1px solid var(--color-border);
    border-radius: var(--radius-md); background: var(--color-surface);
    font-size: 14px; line-height: 1.5; transition: all 0.15s; cursor: pointer;
    font-family: var(--font-body);
  }
  .quiz-answer:hover { border-color: var(--color-text); }
  .quiz-answer.selected {
    border-color: var(--color-text); background: var(--color-text);
    color: var(--color-bg);
  }
  .quiz-conviction { margin-bottom: var(--spacing-md); }
  .conviction-options { display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-sm); }
  .conviction-btn {
    flex: 1; padding: 8px; border: 1px solid var(--color-border);
    border-radius: var(--radius-md); background: transparent;
    font-family: var(--font-mono); font-size: 13px; cursor: pointer; transition: all 0.15s;
  }
  .conviction-btn.active {
    border-color: var(--color-text); background: var(--color-text); color: var(--color-bg);
  }
  .quiz-importance { margin-bottom: var(--spacing-xl); }
  .importance-options { display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-sm); }
  .importance-btn {
    flex: 1; padding: 8px; border: 1px solid var(--color-border);
    border-radius: var(--radius-md); background: transparent;
    font-family: var(--font-mono); font-size: 13px; cursor: pointer; transition: all 0.15s;
  }
  .importance-btn.active {
    border-color: var(--color-accent); background: var(--color-accent); color: #fff;
  }
  .quiz-next { width: 100%; }
  .quiz-next:disabled { opacity: 0.4; cursor: not-allowed; }
  .quiz-country, .quiz-pause { text-align: center; max-width: 520px; margin: 0 auto; }
  .pause-sections { display: flex; gap: var(--spacing-md); justify-content: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
  .pause-section {
    font-family: var(--font-mono); font-size: 13px; color: var(--color-text-secondary);
    padding: 4px 12px; border-radius: 100px; border: 1px solid var(--color-border);
  }
  .pause-section.done { color: var(--color-success); border-color: var(--color-success); }
`;
