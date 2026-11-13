import {loadFont as loadVN} from '@remotion/google-fonts/BeVietnamPro';
import {loadFont as loadSerifSC} from '@remotion/google-fonts/NotoSerifSC';
import {loadFont as loadBrush} from '@remotion/google-fonts/MaShanZheng';

export const vn = loadVN('normal', {weights: ['400', '600', '800'], subsets: ['latin', 'vietnamese']}).fontFamily;
export const han = loadSerifSC('normal', {weights: ['600', '900']}).fontFamily;
export const brush = loadBrush('normal', {weights: ['400']}).fontFamily;

export const C = {
	bg: '#0b0806',
	gold: '#e3b860',
	goldSoft: '#b98d3e',
	cream: '#f4e7cc',
	red: '#c23a2b',
	muted: '#a89679',
	wx: {木: '#4fae5e', 火: '#e0503c', 土: '#c9a24a', 金: '#e8e2d2', 水: '#4f8fd6'} as Record<string, string>,
};

export const FPS = 30;
export const T = 15; // frames mỗi chuyển cảnh
