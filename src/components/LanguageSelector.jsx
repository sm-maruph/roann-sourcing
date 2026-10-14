import { Languages } from 'lucide-react';
import { languages, useLanguage, setLanguage } from '../i18n/language';

export default function LanguageSelector() {
  const language = useLanguage();

  function changeLanguage(event) {
    setLanguage(event.target.value);
  }

  return <label className="language-selector">
    <Languages size={16} aria-hidden="true" />
    <span className="language-label">Language</span>
    <select aria-label="Language preference" value={language} onChange={changeLanguage}>
      {languages.map(([code, name]) => <option key={code} value={code} translate="no">{name}</option>)}
    </select>
  </label>;
}
