import { getEntry } from "astro:content";

const PROFILE_ID = "ran-kirlian";

export const getProfile = async () => {
    const profile = await getEntry("profile", PROFILE_ID);
    if (!profile) {
        throw new Error(`Missing profile entry "${PROFILE_ID}" in src/content/profile.json`);
    }
    return profile;
};
