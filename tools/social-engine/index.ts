/**
 * Remotion bundle entry (Studio + CLI renders). INTERNAL tool — never imported
 * by the public app. Fonts: the same @fontsource packages as `src/main.tsx`.
 */
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/cinzel/latin-700.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
