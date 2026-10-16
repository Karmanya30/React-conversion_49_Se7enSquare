import React from 'react';
import { MOD_QUIZ_QUESTIONS } from '../../../Components/platform/data/profileSettingsData';

/**
 * "Membership" tab — subscription plan display, organizer application, and moderator quiz modal.
 */
export default function MembershipTab({
  user, navigate,
  quizOpen, setQuizOpen,
  quizScore, quizAnswers, setQuizAnswers,
  onApplyOrganizer, onSubmitQuiz,
}) {
  return (
    <div className="view active">
      {/* Subscription Plan */}
      <div className="settings-card">
        <div className="card-title">💎 Subscription Plan</div>
        <div className="card-sub">Your current Gameunity plan and what it unlocks.</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px' }}>
              {user.plan === 'ultra_pro' ? '💎 Ultra Pro' : user.plan === 'plus' ? '⚡ Plus' : '🆓 Free'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
              {user.plan === 'ultra_pro'
                ? 'Full platform access, custom badges, unlimited tournaments.'
                : user.plan === 'plus'
                ? 'HD streaming, 100MB file uploads, custom role icons.'
                : 'Basic features, standard video quality, up to 10 communities.'}
            </div>
          </div>
          <button className="btn-sm accent" onClick={() => navigate('/pricing')}>Manage Plan</button>
        </div>
      </div>

      {/* Organizer Application */}
      <div className="settings-card">
        <div className="card-title">🏆 Become an Organizer</div>
        <div className="card-sub">Apply for Verified Organizer status to host and manage your own tournaments.</div>
        <div style={{ marginTop: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '10px' }}>
            Status: {user.role === 'organizer' || user.role === 'admin' ? '✅ Verified Organizer' : '⚪ Standard Gamer'}
          </div>
          {user.role !== 'organizer' && user.role !== 'admin' && (
            <button className="btn-sm accent" onClick={onApplyOrganizer}>Apply Now</button>
          )}
        </div>
      </div>

      {/* Certified Moderator */}
      <div className="settings-card">
        <div className="card-title">🛡️ Become a Certified Moderator</div>
        <div className="card-sub">Pass a short moderation-policy quiz, then get admin approval to earn the Certified Moderator badge.</div>
        <div style={{ marginTop: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '10px' }}>
            Status: {user.role === 'moderator' || user.role === 'admin' ? '🛡️ Certified Moderator' : '⚪ Not Certified'}
          </div>
          {user.role !== 'moderator' && user.role !== 'admin' && (
            <button className="btn-sm accent" onClick={() => setQuizOpen(true)}>Take the Quiz</button>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {quizOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) setQuizOpen(false); }}>
          <div className="modal-container" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>Moderator Policy Quiz</h3>
              <button className="modal-x" onClick={() => setQuizOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {MOD_QUIZ_QUESTIONS.map(q => (
                <div key={q.key} style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 600 }}>{q.question}</p>
                  {q.options.map(opt => (
                    <label key={opt.value} style={{ display: 'block', margin: '4px 0' }}>
                      <input
                        type="radio"
                        name={q.key}
                        value={opt.value}
                        onChange={e => setQuizAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                      />
                      {' '}{opt.label}
                    </label>
                  ))}
                </div>
              ))}
              {quizScore !== null && (
                <div style={{ marginTop: '12px', fontWeight: 700, color: quizScore >= 2 ? 'var(--success)' : 'var(--error)' }}>
                  Score: {quizScore} / 3
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-ghost"   onClick={() => setQuizOpen(false)}>Close</button>
              <button className="btn-primary" onClick={onSubmitQuiz}>Submit Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
