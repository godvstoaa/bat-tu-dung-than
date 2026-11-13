import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, han, vn} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Nền tối ấm + bụi vàng bay lên. */
export const Backdrop: React.FC<{tint?: string}> = ({tint = '#3a2410'}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${tint} 0%, ${C.bg} 62%)`}}>
			{new Array(60).fill(0).map((_, i) => {
				const x = random(`x${i}`) * width;
				const speed = 0.4 + random(`s${i}`) * 1.2;
				const y = (random(`y${i}`) * height - frame * speed + height * 2) % height;
				const size = 1.5 + random(`r${i}`) * 3.5;
				const tw = 0.25 + 0.55 * Math.abs(Math.sin(frame / 25 + i));
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: C.gold, opacity: tw * 0.7, boxShadow: `0 0 ${size * 3}px ${C.gold}`}} />
				);
			})}
		</AbsoluteFill>
	);
};

const TRIGRAMS = ['☰', '☴', '☵', '☶', '☷', '☳', '☲', '☱'];
const TRI_NAMES = ['乾', '巽', '坎', '艮', '坤', '震', '離', '兌'];

/** Bát quái xoay. */
export const Bagua: React.FC<{size: number; rot?: number; opacity?: number}> = ({size, rot = 0, opacity = 1}) => {
	const r = size / 2;
	const oct = (rr: number) =>
		new Array(8).fill(0).map((_, i) => {
			const a = (Math.PI / 4) * i - Math.PI / 8;
			return `${r + rr * Math.cos(a)},${r + rr * Math.sin(a)}`;
		}).join(' ');
	return (
		<svg width={size} height={size} style={{opacity, transform: `rotate(${rot}deg)`}}>
			<defs>
				<radialGradient id="glow">
					<stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
					<stop offset="100%" stopColor={C.gold} stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle cx={r} cy={r} r={r} fill="url(#glow)" />
			<polygon points={oct(r * 0.96)} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.9} />
			<polygon points={oct(r * 0.86)} fill="none" stroke={C.goldSoft} strokeWidth={1.5} opacity={0.7} />
			<polygon points={oct(r * 0.5)} fill="none" stroke={C.goldSoft} strokeWidth={1.5} opacity={0.6} />
			{new Array(8).fill(0).map((_, i) => {
				const a = (Math.PI / 4) * i - Math.PI / 2;
				const x2 = r + r * 0.86 * Math.cos(a + Math.PI / 8);
				const y2 = r + r * 0.86 * Math.sin(a + Math.PI / 8);
				return <line key={`l${i}`} x1={r} y1={r} x2={x2} y2={y2} stroke={C.goldSoft} strokeWidth={1} opacity={0.35} />;
			})}
			{TRIGRAMS.map((t, i) => {
				const a = (Math.PI / 4) * i - Math.PI / 2;
				return (
					<g key={t} transform={`translate(${r + r * 0.7 * Math.cos(a)} ${r + r * 0.7 * Math.sin(a)}) rotate(${(a * 180) / Math.PI + 90})`}>
						<text textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.085} fill={C.gold} y={-size * 0.03}>{t}</text>
						<text textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.04} fill={C.cream} y={size * 0.04} style={{fontFamily: han}} opacity={0.75}>{TRI_NAMES[i]}</text>
					</g>
				);
			})}
		</svg>
	);
};

/** Khung điện thoại chứa ảnh dọc, tự cuộn nhẹ. */
export const Phone: React.FC<{src: string; scroll?: number; height?: number}> = ({src, scroll = 120, height = 900}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const w = height * (430 / 932);
	// ảnh dọc đúng tỉ lệ màn hình → không cuộn được; zoom chậm về phía `scroll` (px từ trên xuống làm tâm)
	const z = interpolate(frame, [0, durationInFrames], [1, 1.12], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<div style={{width: w + 28, height: height + 28, borderRadius: 64, padding: 14, background: 'linear-gradient(145deg,#3b2f22,#120d09)', boxShadow: `0 40px 120px rgba(0,0,0,.7), 0 0 0 2px ${C.goldSoft}55, 0 0 80px ${C.gold}22`}}>
			<div style={{width: w, height, borderRadius: 52, overflow: 'hidden', position: 'relative', background: '#000'}}>
				<Img src={staticFile(src)} style={{width: '100%', height: '100%', transformOrigin: `50% ${scroll}px`, transform: `scale(${z})`}} />
			</div>
		</div>
	);
};

/** Ảnh full-frame với Ken Burns. */
export const KenBurns: React.FC<{src: string; from?: number; to?: number; dx?: number; dy?: number; crop?: number; pos?: string}> = ({src, from = 1.04, to = 1.16, dx = 0, dy = 0, crop = 0, pos = 'top'}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
	const s = from + (to - from) * p;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: `calc(100% + ${crop}px)`, objectFit: 'cover', objectPosition: pos, transform: `scale(${s}) translate(${dx * p}px, ${dy * p}px)`}} />
		</AbsoluteFill>
	);
};

/** Chữ hiện dần lên (fade + trượt). */
export const Rise: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - delay, fps, config: {damping: 200}});
	return <div style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`, ...style}}>{children}</div>;
};

/** Nhãn nhỏ phía trên tiêu đề. */
export const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{fontFamily: vn, fontWeight: 600, fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: C.gold}}>{children}</div>
);

/** Ánh sáng cạnh dưới để chữ nổi trên ảnh game. */
export const Scrim: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,5,3,.92) 0%, rgba(8,5,3,.55) 32%, rgba(8,5,3,0) 58%)'}} />
);

/** Mờ dần cả cảnh ở cuối. */
export const useOut = (len = 12) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return interpolate(frame, [durationInFrames - len, durationInFrames], [1, 0], clamp);
};
