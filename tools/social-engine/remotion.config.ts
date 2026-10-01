/**
 * Remotion CLI/Studio config (`npm run social:studio`). Run from the repo root
 * (npm scripts do): paths below are relative to it.
 */
import { Config } from '@remotion/cli/config';
import { makeWebpackOverride } from './render/webpack';

Config.overrideWebpackConfig(makeWebpackOverride(process.cwd()));
Config.setPublicDir('public');
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
