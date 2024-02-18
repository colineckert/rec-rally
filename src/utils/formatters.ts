const pluralRules = new Intl.PluralRules();
export function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export function getFormattedDate(date: Date, type: "short" | "long") {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: type,
  }).format(date);
}
