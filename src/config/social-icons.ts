import { siFacebook, siInstagram, siSoundcloud, siX, siYoutube } from "simple-icons";

interface SocialIcon {
    label: string;
    path: string;
}

// Brand icons keyed by the social `name` in src/content/profile.json (case-insensitive).
// Twitter is now branded as X, so it uses the X logo.
const socialIcons: Record<string, SocialIcon> = {
    facebook: { label: "Facebook", path: siFacebook.path },
    twitter: { label: "X (Twitter)", path: siX.path },
    x: { label: "X", path: siX.path },
    instagram: { label: "Instagram", path: siInstagram.path },
    youtube: { label: "YouTube", path: siYoutube.path },
    soundcloud: { label: "SoundCloud", path: siSoundcloud.path },
};

export const getSocialIcon = (name: string): SocialIcon | undefined =>
    socialIcons[name.toLowerCase()];
