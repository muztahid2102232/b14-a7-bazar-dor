const unitTranslations: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  piece: "পিস",
  dozen: "ডজন",
};

export function translateUnit(unit: string | undefined | null): string {
  if (!unit) return "";

  const normalizedUnit = unit.trim().toLowerCase();

  return unitTranslations[normalizedUnit] ?? unit;
}
