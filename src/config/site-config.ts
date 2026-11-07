const artistName = "Ran Kirlian";

export const siteConfig = {
    artistName,
    title: artistName,
    description: `Official website of ${artistName}, ambient musician and sound sculptor based in Valencia, Spain.`,
    location: "Valencia, Spain",
    genres: ["Ambient", "Dark ambient", "Tribal ambient"],
    // Literal for <meta name="theme-color">; must equal `--color-ground` in the @theme block of
    // src/styles/styles.css (enforced by site-config.test.ts).
    themeColor: "#07090d",
    locale: "en_US",
}
