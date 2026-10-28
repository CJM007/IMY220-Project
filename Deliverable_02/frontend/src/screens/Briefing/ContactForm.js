import { useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import { SendIcon, CheckIcon, MailIcon, CodeIcon, LinkIcon, ExternalIcon } from '../../components/Icons/Icons';
import { EMAIL, SOCIALS } from '../../config/profile';

const encode = (data) => Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
const ICONS = { code: CodeIcon, link: LinkIcon };

// Sent through Netlify Forms. The matching hidden form in public/index.html is what lets Netlify find it.
export default function ContactForm() {
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setState('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', 'bot-field': '', ...values }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
    } catch (err) {
      setState('error');
    }
  };

  return (
    <div className="contact">
      <SketchFrame data-reveal className="contact__card" seed={31} stroke="var(--accent)">
        {state === 'sent' ? (
          <div className="contact__done" role="status">
            <span className="contact__tick"><CheckIcon size={34} /></span>
            <h3>Transmission received.</h3>
            <p>Thanks {values.name.split(' ')[0] || 'pilot'}, your message is in. I will answer as soon as I am back in range.</p>
            <button type="button" className="btn" onClick={() => { setValues({ name: '', email: '', message: '' }); setState('idle'); }}>Send another</button>
          </div>
        ) : (
          <form className="form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} noValidate>
            <input type="hidden" name="form-name" value="contact" />
            <p className="sr-only"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
            <h3 className="form__title">Send a signal</h3>
            <label className="field">
              <span className="field__label">Your name</span>
              <input name="name" type="text" required autoComplete="name" value={values.name} onChange={set('name')} placeholder="Who is calling?" />
            </label>
            <label className="field">
              <span className="field__label">Your email</span>
              <input name="email" type="email" required autoComplete="email" value={values.email} onChange={set('email')} placeholder="Where do I reply?" />
            </label>
            <label className="field">
              <span className="field__label">Message</span>
              <textarea name="message" rows="5" required value={values.message} onChange={set('message')} placeholder="What is on your mind?" />
            </label>
            <div className="form__foot">
              <button type="submit" className="btn btn--go" disabled={state === 'sending'}>
                <SendIcon size={18} />
                <span>{state === 'sending' ? 'Transmitting…' : 'Transmit'}</span>
              </button>
              <p className="form__status" role="status" aria-live="polite">
                {state === 'error' && (
                  <>That did not go through. {EMAIL ? <>Email me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> instead.</> : 'Please try again in a moment.'}</>
                )}
              </p>
            </div>
          </form>
        )}
      </SketchFrame>

      <div className="contact__side" data-reveal>
        <p className="note contact__hint">Or find me out here:</p>
        <ul className="socials">
          {EMAIL && (
            <li>
              <a className="social" href={`mailto:${EMAIL}`}>
                <MailIcon size={24} /><span><strong>Email</strong><em>{EMAIL}</em></span>
              </a>
            </li>
          )}
          {SOCIALS.map((s) => {
            const Icon = ICONS[s.icon] || LinkIcon;
            const body = (
              <>
                <Icon size={24} />
                <span><strong>{s.label}</strong><em>{s.url ? s.note : 'Not on the radar yet'}</em></span>
                {s.url && <ExternalIcon size={16} className="social__out" />}
              </>
            );
            return (
              <li key={s.id}>
                {s.url ? (
                  <a className="social" href={s.url} target="_blank" rel="noopener noreferrer">{body}<span className="sr-only"> (opens in a new tab)</span></a>
                ) : (
                  <span className="social social--pending" aria-disabled="true">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
