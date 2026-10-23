export const contactEmail = 'info@roann-sourcing.com';

export function createContactEmail(values) {
  const singleLine = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();
  const subject = singleLine(values.get('subject'));
  const body = [
    `Name: ${singleLine(values.get('name'))}`,
    `Email: ${singleLine(values.get('email'))}`,
    `Company: ${singleLine(values.get('company'))}`,
    '',
    String(values.get('message') || '').trim(),
  ].join('\n');
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
