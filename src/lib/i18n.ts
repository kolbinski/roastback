export type LanguageCode = "en" | "pl" | "de" | "fr" | "es";

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export const translations: Record<
  LanguageCode,
  {
    heroCopy: string;
    buttonLabel: string;
    userBubble: string;
    loadingText: string;
    errorText: string;
    retryLabel: string;
    moderationErrorText: string;
    spendCapErrorText: string;
    emailPlaceholder: string;
    emailSubmitLabel: string;
    emailThanksText: string;
    emailErrorText: string;
    termsLabel: string;
    privacyLabel: string;
    contactLabel: string;
    downloadModalTitle: string;
    downloadMobileOption: string;
    downloadDesktopOption: string;
    downloadConfirmLabel: string;
    cancelLabel: string;
  }
> = {
  en: {
    heroCopy: "Show me what you've got.<br />I'll tell you who you are today.",
    buttonLabel: "Roast Back",
    userBubble: "Hey RoastBack.app, roast my photo, have no mercy!",
    loadingText: "Roasting... this can take a moment, I'm going to be brutal.",
    errorText: "This roast was so hot, I broke myself.",
    retryLabel: "Try again",
    moderationErrorText: "I'm not touching that photo!",
    spendCapErrorText:
      "RoastBack.app's creator ran out of coins for roasts. Leave your email and we'll let you know when it's back.",
    emailPlaceholder: "Your email",
    emailSubmitLabel: "Notify me",
    emailThanksText: "Thanks! We'll let you know.",
    emailErrorText: "Couldn't save that - try again.",
    termsLabel: "Terms of Use",
    privacyLabel: "Privacy Policy",
    contactLabel: "Contact",
    downloadModalTitle: "Choose width",
    downloadMobileOption: "Mobile - 420px",
    downloadDesktopOption: "Desktop - 700px",
    downloadConfirmLabel: "Download",
    cancelLabel: "Cancel",
  },
  pl: {
    heroCopy: "Pokaż mi, co masz.<br />Powiem Ci, kim dzisiaj jesteś.",
    buttonLabel: "Roast Back",
    userBubble: "Hej RoastBack.app, zroastuj moje zdjęcie, bez litości!",
    loadingText: "Roastuję... to może chwilę potrwać, zamierzam być bezlitosny.",
    errorText: "Ten roast był tak gorący, że się popsułem.",
    retryLabel: "Spróbuj ponownie",
    moderationErrorText: "Nie dotykam się tego obrazka!",
    spendCapErrorText:
      "Twórcy RoastBack.app zabrakło monetek na roasty. Podaj swój email, a damy znać, kiedy appka znów zacznie działać.",
    emailPlaceholder: "Twój email",
    emailSubmitLabel: "Powiadom mnie",
    emailThanksText: "Dzięki! Damy znać.",
    emailErrorText: "Nie udało się zapisać - spróbuj ponownie.",
    termsLabel: "Regulamin",
    privacyLabel: "Polityka prywatności",
    contactLabel: "Kontakt",
    downloadModalTitle: "Wybierz szerokość",
    downloadMobileOption: "Mobile - 420px",
    downloadDesktopOption: "Desktop - 700px",
    downloadConfirmLabel: "Pobierz",
    cancelLabel: "Anuluj",
  },
  de: {
    heroCopy: "Zeig mir, was du hast.<br />Ich sage dir, wer du heute bist.",
    buttonLabel: "Roast Back",
    userBubble: "Hey RoastBack.app, roaste mein Foto, kein Mitleid!",
    loadingText: "Am Rösten... das kann einen Moment dauern, ich werde gnadenlos sein.",
    errorText: "Dieser Roast war so heiß, dass ich kaputt gegangen bin.",
    retryLabel: "Erneut versuchen",
    moderationErrorText: "Das Foto fasse ich nicht an!",
    spendCapErrorText:
      "Dem Macher von RoastBack.app sind die Münzen für Roasts ausgegangen. Hinterlasse deine E-Mail, wir melden uns, wenn es wieder losgeht.",
    emailPlaceholder: "Deine E-Mail",
    emailSubmitLabel: "Benachrichtigen",
    emailThanksText: "Danke! Wir melden uns.",
    emailErrorText: "Konnte nicht gespeichert werden - versuch's nochmal.",
    termsLabel: "Nutzungsbedingungen",
    privacyLabel: "Datenschutzrichtlinie",
    contactLabel: "Kontakt",
    downloadModalTitle: "Breite wählen",
    downloadMobileOption: "Mobil - 420px",
    downloadDesktopOption: "Desktop - 700px",
    downloadConfirmLabel: "Herunterladen",
    cancelLabel: "Abbrechen",
  },
  fr: {
    heroCopy: "Montre-moi ce que tu as.<br />Je te dirai qui tu es aujourd'hui.",
    buttonLabel: "Roast Back",
    userBubble: "Hé RoastBack.app, roaste ma photo, sans pitié !",
    loadingText: "En train de roaster... ça peut prendre un moment, je vais être impitoyable.",
    errorText: "Ce roast était tellement brûlant que je suis tombé en panne.",
    retryLabel: "Réessayer",
    moderationErrorText: "Je ne touche pas à cette photo !",
    spendCapErrorText:
      "Le créateur de RoastBack.app n'a plus de pièces pour les roasts. Laisse ton email, on te préviendra quand ça repart.",
    emailPlaceholder: "Ton email",
    emailSubmitLabel: "Me prévenir",
    emailThanksText: "Merci ! On te préviendra.",
    emailErrorText: "Échec de l'enregistrement - réessaie.",
    termsLabel: "Conditions d'utilisation",
    privacyLabel: "Politique de confidentialité",
    contactLabel: "Contact",
    downloadModalTitle: "Choisir la largeur",
    downloadMobileOption: "Mobile - 420px",
    downloadDesktopOption: "Bureau - 700px",
    downloadConfirmLabel: "Télécharger",
    cancelLabel: "Annuler",
  },
  es: {
    heroCopy: "Muéstrame lo que tienes.<br />Te diré quién eres hoy.",
    buttonLabel: "Roast Back",
    userBubble: "Oye RoastBack.app, destroza mi foto, sin piedad!",
    loadingText: "Destrozando... esto puede tardar un momento, voy a ser brutal.",
    errorText: "Este roast fue tan intenso que me rompí.",
    retryLabel: "Intentar de nuevo",
    moderationErrorText: "¡No voy a tocar esa foto!",
    spendCapErrorText:
      "Al creador de RoastBack.app se le acabaron las monedas para roasts. Deja tu email y te avisamos cuando vuelva.",
    emailPlaceholder: "Tu email",
    emailSubmitLabel: "Avisarme",
    emailThanksText: "¡Gracias! Te avisaremos.",
    emailErrorText: "No se pudo guardar - inténtalo de nuevo.",
    termsLabel: "Términos de uso",
    privacyLabel: "Política de privacidad",
    contactLabel: "Contacto",
    downloadModalTitle: "Elegir ancho",
    downloadMobileOption: "Móvil - 420px",
    downloadDesktopOption: "Escritorio - 700px",
    downloadConfirmLabel: "Descargar",
    cancelLabel: "Cancelar",
  },
};

export function detectLanguage(): LanguageCode {
  if (typeof navigator === "undefined") return "en";
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  const supported = SUPPORTED_LANGUAGES.map((l) => l.code);
  return (supported.includes(browserLang as LanguageCode) ? browserLang : "en") as LanguageCode;
}