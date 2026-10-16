import { PLANS } from '../../../Components/platform/data/pricingPlans';

function ApplicationStatus({ data, error }) {
  return <div aria-live="polite">
    {error && <p className="profile-error" role="alert">{error}</p>}
    {data && <p>Status: <strong>{data.status}</strong>{data.rejectionReason && ` — ${data.rejectionReason}`}</p>}
    {data?.quizScore !== undefined && <p>Score: {data.quizScore}% · Pass mark: {data.passMark}%</p>}
  </div>;
}
export default function MembershipTab({ p }) {
  const { user, organiser, moderator, applicationErrors, organiserForm, setOrganiserForm, statement, setStatement } = p;
  const plan = PLANS.find(item => item.id === p.plan?.plan);
  const canOrganise = user.role === 'user';
  const canModerate = ['user', 'organizer', 'community_manager'].includes(user.role);
  return <div className="view active">
    {user.role !== 'owner' && <div className="settings-card">
      <h2 className="card-title">Subscription</h2>
      {applicationErrors.plan && <p role="alert">{applicationErrors.plan}</p>}
      {plan && <><h3>{plan.name}</h3><ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul><button className="btn-sm" onClick={() => p.navigate('/pricing')}>Manage plan</button></>}
    </div>}
    {user.role === 'owner' && <p>The platform owner account has no personal subscription or role applications.</p>}
    {(canOrganise || user.role === 'organizer') && <div className="settings-card">
      <h2 className="card-title">{canOrganise ? 'Become an organizer' : 'Organizer application'}</h2>
      <ApplicationStatus data={organiser} error={applicationErrors.organiser} />
      {canOrganise && organiser && ['none', 'rejected'].includes(organiser.status) && <form onSubmit={e => { e.preventDefault(); p.applyOrganizer(); }}>
        {[
          ['experienceNote', 'Experience summary (20–1000 characters)'], ['games', 'Games you have run'],
          ['organisations', 'Organisations you have worked with (or None)'], ['pastEventLinks', 'Past event links (one URL per line, optional)'],
        ].map(([key, label]) => <label className="field" key={key}>{label}<textarea value={organiserForm[key]} onChange={e => setOrganiserForm(prev => ({ ...prev, [key]: e.target.value }))} /></label>)}
        <label className="field">Expected tournament size<input type="number" min="2" max="100000" value={organiserForm.expectedTournamentSize} onChange={e => setOrganiserForm(prev => ({ ...prev, expectedTournamentSize: e.target.value }))} /></label>
        <label><input type="checkbox" checked={organiserForm.rulesAgreement} onChange={e => setOrganiserForm(prev => ({ ...prev, rulesAgreement: e.target.checked }))} /> I agree to publish tournament rules, enforce fair play, and follow platform policies.</label>
        <button className="btn-sm accent" disabled={p.applying}>Submit organizer application</button>
      </form>}
    </div>}
    {(canModerate || user.role === 'moderator') && <div className="settings-card">
      <h2 className="card-title">{canModerate ? 'Become a certified moderator' : 'Moderator certification'}</h2>
      <ApplicationStatus data={moderator} error={applicationErrors.moderator} />
      {canModerate && moderator && ['none', 'rejected'].includes(moderator.status) && !p.quizOpen && <button className="btn-sm accent" onClick={p.openQuiz}>Start application</button>}
      {p.quizOpen && <form onSubmit={e => { e.preventDefault(); p.submitQuiz(); }}>
        <label className="field">Why do you want to moderate? (20–1000 characters)<textarea value={statement.why} onChange={e => setStatement(prev => ({ ...prev, why: e.target.value }))} /></label>
        <label className="field">Time zone<input value={statement.timeZone} placeholder="Asia/Kolkata" onChange={e => setStatement(prev => ({ ...prev, timeZone: e.target.value }))} /></label>
        <label className="field">Weekly hours available<input type="number" min="1" max="168" value={statement.weeklyHours} onChange={e => setStatement(prev => ({ ...prev, weeklyHours: e.target.value }))} /></label>
        {p.questions.map((question, i) => <fieldset key={i} className="settings-card"><legend>{i + 1}. {question.question}</legend>
          {question.options.map((option, j) => <label key={j} style={{ display: 'block' }}><input type="radio" name={`question-${i}`} checked={p.quizAnswers[i] === j} onChange={() => p.setQuizAnswers(prev => { const next = [...prev]; next[i] = j; return next; })} /> {option}</label>)}
        </fieldset>)}
        <button className="btn-sm accent" disabled={p.applying}>Submit moderator application</button>
      </form>}
    </div>}
  </div>;
}
