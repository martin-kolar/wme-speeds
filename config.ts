type LocaleCode = 'cs' | 'sk' | 'en' | 'he' | 'pl';
type Translations = { [key: string]: string };

const i18n: Record<LocaleCode, Translations> = {
  cs: {
    scriptName: 'WME Speeds',
    speedsHeadline: 'Barvy segmentů dle rychlostí',
    forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
    author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (5)</a>',
    version: 'Verze:',
    invertSpeedsTitleNonDrivable: 'Zobrazit pouze segmenty bez rychlostí',
    hideWithoutSpeeds: 'Skrýt segmenty bez rychlostí',
    noSpeedsSegmentsOtherTitle: 'Skrýt rychlosti na nedůležitých segmentech',
    transparentColorsTitle: 'Průsvitné barvy',
    dashedHint: 'Bíle přerušovaná barva znamená, že rychlostní limit není kulaté číslo.'
  },
  sk: {
    scriptName: 'WME Rýchlosti',
    speedsHeadline: 'Farby podľa rýchlosti',
    forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
    author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
    version: 'Verzia:',
    invertSpeedsTitleNonDrivable: 'Zobraziť iba úseky bez rýchlostí',
    hideWithoutSpeeds: 'Skryť úseky bez rýchlostí',
    noSpeedsSegmentsOtherTitle: 'Skryť rýchlosti na iných jazdných úsekoch bez rýchlostí',
    transparentColorsTitle: 'Priehľadná farba',
    dashedHint: 'Biele prerušované čiary znamenajú, že rýchlostný limit nie je zaokrúhlené číslo.'
  },
  en: {
    scriptName: 'WME Speeds',
    speedsHeadline: 'Colors by speed',
    forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
    author: 'Author: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
    version: 'Version:',
    invertSpeedsTitleNonDrivable: 'Show only segments without speeds',
    hideWithoutSpeeds: 'Hide segments without speeds',
    noSpeedsSegmentsOtherTitle: 'Hide speeds on other-drivable segments without speeds',
    transparentColorsTitle: 'Transparent color',
    dashedHint: 'White dashed styles mean that the speed limit is not round number.'
  },
  he: {
    scriptName: 'מהירות WME',
    speedsHeadline: 'צבעים לפי מהירות',
    forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">דיון באנגלית</a>',
    author: 'מחבר: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (צ׳כיה)</a>',
    version: 'גרסה:',
    invertSpeedsTitleNonDrivable: 'הצג רק מקטעים ללא מהירויות',
    hideWithoutSpeeds: 'הסתר מקטעים ללא מהירויות',
    noSpeedsSegmentsOtherTitle: 'הסתר מהירויות במקטעים אחרים ללא נתוני מהירות',
    transparentColorsTitle: 'צבע שקוף',
    dashedHint: 'קו לבן מקווקו מציין שהמהירות אינה מספר עגול.'
  },
  pl: {
    scriptName: 'WME Prędkości',
    speedsHeadline: 'Kolory według prędkości',
    forumLink: '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">Dyskusja po angielsku</a>',
    author: 'Autor: <a href="https://www.waze.com/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
    version: 'Wersja:',
    invertSpeedsTitleNonDrivable: 'Pokaż tylko odcinki bez prędkości',
    hideWithoutSpeeds: 'Ukryj odcinki bez prędkości',
    noSpeedsSegmentsOtherTitle: 'Ukryj prędkości na innych przejezdnych odcinkach bez prędkości',
    transparentColorsTitle: 'Przezroczysty kolor',
    dashedHint: 'Białe linie przerywane oznaczają, że ograniczenie prędkości nie jest liczbą zaokrągloną.'
  }
}

export function getTranslations(localeCode: string): Translations {
  return i18n[localeCode as LocaleCode] || i18n['en'];
}