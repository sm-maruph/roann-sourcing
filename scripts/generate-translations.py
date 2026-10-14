"""Generate checked-in translations. The website makes no translation API calls."""
import concurrent.futures
import json
from pathlib import Path
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1] / 'src' / 'i18n'
STRINGS = json.loads((ROOT / 'source-strings.json').read_text(encoding='utf-8'))
OVERRIDES = json.loads((ROOT / 'overrides.json').read_text(encoding='utf-8'))

def translate(text, language):
    url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode(
        {'client': 'gtx', 'sl': 'en', 'tl': language, 'dt': 't', 'q': text})
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=40) as response:
                result = json.load(response)
            return ''.join(part[0] for part in result[0] if part[0])
        except Exception:
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)

def batch(items, language):
    translated = translate('\n'.join(items), language).split('\n')
    if len(translated) != len(items) or any(not text.strip() for text in translated):
        translated = [translate(item, language) for item in items]
    return dict(zip(items, [text.strip() for text in translated]))

if __name__ == '__main__':
    for language in ['es', 'ja', 'de']:
        target = ROOT / f'{language}.json'
        catalog = json.loads(target.read_text(encoding='utf-8')) if target.exists() else {}
        catalog.update(OVERRIDES.get(language, {}))
        missing = [text for text in STRINGS if text not in catalog]
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            futures = [executor.submit(batch, missing[i:i + 12], language) for i in range(0, len(missing), 12)]
            for index, future in enumerate(concurrent.futures.as_completed(futures)):
                catalog.update(future.result())
                target.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
                if index % 15 == 0:
                    print(f'{language}: {len(catalog)}/{len(STRINGS)}', flush=True)
        print(f'{language}: complete ({len(catalog)} strings)', flush=True)
        target.write_text(json.dumps({text: catalog[text] for text in STRINGS}, ensure_ascii=False, indent=2), encoding='utf-8')
