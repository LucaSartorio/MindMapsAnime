/**
 * Remotion bundle entry (Studio + CLI renders). INTERNAL tool — never imported
 * by the public app. Fonts: the same @fontsource packages as `src/main.tsx`.
 */
// Full weight files = every subset (latin, latin-ext for ō/ū/ā, …), each limited
// by its unicode-range: the video never falls back to an OS font, so it renders
// identically on Windows, macOS and the Linux GitHub runner.
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/jetbrains-mono/500.css';
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
