import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Backdrop, Bagua, KenBurns, Kicker, Phone, Rise, Scrim} from './parts';
import {brush, C, han, vn} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** true khi khung dọc 9:16. */
export const useV = () => {
	const {width, height} = useVideoConfig();
	return height > width;
};

/* 1 — Mở đầu: bát quái + ấn 命 + tên app */
export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	const seal = spring({frame: frame - 18, fps, config: {damping: 12, stiffness: 90}});
	const ring = interpolate(frame, [0, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const bag = v ? 780 : 620;
	return (
		<AbsoluteFill>
			<Backdrop />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: v ? -260 : -120}}>
				<div style={{transform: `scale(${0.6 + 0.4 * ring})`}}>
					<Bagua size={bag} rot={frame * 0.35} opacity={ring} />
				</div>
				<div style={{position: 'absolute', width: bag * 0.27, height: bag * 0.27, borderRadius: 22, background: 'linear-gradient(145deg,#f3d27e,#a87a2c)', boxShadow: `0 0 70px ${C.gold}aa`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${seal}) rotate(${(1 - seal) * -30}deg)`}}>
					<span style={{fontFamily: han, fontWeight: 900, fontSize: bag * 0.19, color: '#8e1f16'}}>命</span>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: v ? 420 : 130}}>
				<Rise delay={34}>
					<div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 124 : 110, lineHeight: 1.1, color: C.cream, textAlign: 'center', textShadow: `0 0 40px ${C.gold}66`}}>
						Bát Tự <span style={{fontFamily: brush, color: C.red, fontWeight: 400}}>八字</span>
						{v ? <br /> : ' '}Dụng Thần
					</div>
				</Rise>
				<Rise delay={48}>
					<div style={{fontFamily: vn, fontSize: v ? 46 : 44, color: C.muted, marginTop: v ? 24 : 8, textAlign: 'center'}}>
						Luận mệnh Tử Bình{v ? <br /> : ' · '}Phong thủy Huyền học
					</div>
				</Rise>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 2 — Ngũ Thuật */
const ARTS = [
	['命', 'Mệnh', 'Bát Tự · Tử Vi · Thất Chính'],
	['卜', 'Bốc', 'Mai Hoa · Lục Hào · Kỳ Môn'],
	['相', 'Tướng', 'Diện tướng · Nốt ruồi'],
	['山', 'Sơn', 'Phong thủy Dương – Âm trạch'],
	['擇', 'Trạch Nhật', 'Chọn ngày lành'],
];
export const FiveArts: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	return (
		<AbsoluteFill>
			<Backdrop tint="#2c1a0c" />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: v ? 250 : 140}}>
				<Rise>
					<div style={{textAlign: 'center'}}>
						<Kicker>Trọn bộ 五術</Kicker>
						{v ? <div style={{fontFamily: vn, fontWeight: 800, fontSize: 84, color: C.cream, marginTop: 16}}>Ngũ Thuật phương Đông</div> : null}
					</div>
				</Rise>
				<div style={{display: 'flex', flexDirection: v ? 'column' : 'row', gap: v ? 28 : 36, marginTop: v ? 70 : 90}}>
					{ARTS.map(([h, n, d], i) => {
						const s = spring({frame: frame - 10 - i * 8, fps, config: {damping: 14}});
						const card: React.CSSProperties = {borderRadius: 28, background: 'linear-gradient(180deg,#2a1d12,#120c08)', border: `2px solid ${C.goldSoft}66`, display: 'flex', opacity: s, boxShadow: '0 20px 60px rgba(0,0,0,.5)'};
						if (v) {
							return (
								<div key={h} style={{...card, width: 900, height: 210, alignItems: 'center', gap: 40, padding: '0 46px', transform: `translateX(${(1 - s) * (i % 2 ? 200 : -200)}px)`}}>
									<div style={{fontFamily: han, fontWeight: 900, fontSize: 130, color: C.gold, textShadow: `0 0 30px ${C.gold}88`, width: 150, textAlign: 'center'}}>{h}</div>
									<div>
										<div style={{fontFamily: vn, fontWeight: 800, fontSize: 60, color: C.cream}}>{n}</div>
										<div style={{fontFamily: vn, fontSize: 38, color: C.muted, marginTop: 6}}>{d}</div>
									</div>
								</div>
							);
						}
						return (
							<div key={h} style={{...card, width: 300, height: 480, flexDirection: 'column', alignItems: 'center', paddingTop: 50, transform: `translateY(${(1 - s) * 120}px)`}}>
								<div style={{fontFamily: han, fontWeight: 900, fontSize: 150, color: C.gold, textShadow: `0 0 30px ${C.gold}88`}}>{h}</div>
								<div style={{fontFamily: vn, fontWeight: 800, fontSize: 52, color: C.cream, marginTop: 20}}>{n}</div>
								<div style={{fontFamily: vn, fontSize: 30, color: C.muted, marginTop: 18, textAlign: 'center', padding: '0 26px', lineHeight: 1.35}}>{d}</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* Khối chữ: kicker + tiêu đề + gạch đầu dòng */
const TextBlock: React.FC<{kicker: string; title: string; lines: [string, string?][]}> = ({kicker, title, lines}) => {
	const v = useV();
	return (
		<div style={{width: v ? 920 : 820}}>
			<Rise delay={8}><Kicker>{kicker}</Kicker></Rise>
			<Rise delay={14}><div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 80 : 90, color: C.cream, lineHeight: 1.08, marginTop: 18}}>{title}</div></Rise>
			<div style={{marginTop: v ? 26 : 44}}>
				{lines.map(([l, dot], i) => (
					<Rise key={l} delay={26 + i * 9}>
						<div style={{display: 'flex', gap: 22, alignItems: dot ? 'center' : 'baseline', fontFamily: vn, fontSize: v ? 42 : 42, color: C.cream, opacity: 0.92, marginTop: v ? 14 : 20}}>
							{dot ? <span style={{flex: 'none', width: 34, height: 34, borderRadius: '50%', background: dot, boxShadow: `0 0 20px ${dot}`}} /> : <span style={{color: C.gold}}>◆</span>}
							{l}
						</div>
					</Rise>
				))}
			</div>
		</div>
	);
};

/* 3–5 — Điện thoại + chú thích */
export const PhoneFeature: React.FC<{src: string; kicker: string; title: string; lines: string[]; scroll?: number; flip?: boolean}> = ({src, kicker, title, lines, scroll, flip}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	const s = spring({frame, fps, config: {damping: 200}});
	return (
		<AbsoluteFill>
			<Backdrop />
			<AbsoluteFill style={{flexDirection: v ? 'column' : flip ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: v ? 'flex-start' : 'center', gap: v ? 56 : 130, paddingTop: v ? 130 : 0}}>
				<div style={{transform: `translateY(${(1 - s) * 200}px) rotate(${(flip ? 1 : -1) * 2}deg)`, opacity: s}}>
					<Phone src={src} scroll={scroll} height={v ? 1060 : 920} />
				</div>
				<TextBlock kicker={kicker} title={title} lines={lines.map((l) => [l])} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 6 — Con số */
const STATS = [
	['1.523', 'bộ kinh điển cổ'],
	['182', 'module engine cổ pháp'],
	['AI', 'thầy luận giải mọi câu hỏi'],
];
export const Stats: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	return (
		<AbsoluteFill>
			<Backdrop tint="#301c0d" />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 80px'}}>
				<Rise><div style={{textAlign: 'center', lineHeight: 1.6}}><Kicker>Bám sát thư tịch kinh điển{v ? <br /> : ' · '}Tử Bình Chân Thuyên · Trích Thiên Tủy</Kicker></div></Rise>
				<div style={{display: 'flex', flexDirection: v ? 'column' : 'row', gap: v ? 70 : 120, marginTop: v ? 80 : 90}}>
					{STATS.map(([n, l], i) => {
						const s = spring({frame: frame - 12 - i * 10, fps, config: {damping: 15}});
						return (
							<div key={n} style={{textAlign: 'center', opacity: s, transform: `scale(${0.7 + 0.3 * s})`}}>
								<div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 190 : 170, lineHeight: 1.05, color: C.gold, textShadow: `0 0 50px ${C.gold}55`}}>{n}</div>
								<div style={{fontFamily: vn, fontSize: v ? 50 : 44, color: C.cream, marginTop: 4}}>{l}</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 7 — Chuyển sang game */
export const GameTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	const s = spring({frame: frame - 6, fps, config: {damping: 18}});
	return (
		<AbsoluteFill>
			<KenBurns src="shots/game-07.png" from={1.25} to={1.1} />
			<AbsoluteFill style={{background: 'rgba(8,5,3,.72)'}} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 70px'}}>
				<Rise><Kicker>Và một thế giới{v ? <br /> : ' '}để sống cùng lá số</Kicker></Rise>
				<div style={{fontFamily: han, fontWeight: 900, fontSize: v ? 260 : 230, color: C.red, letterSpacing: v ? 40 : 60, marginTop: 30, transform: `scale(${0.8 + 0.2 * s})`, opacity: s, textShadow: '0 0 60px rgba(194,58,43,.6)'}}>玄館</div>
				<Rise delay={16}><div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 110 : 104, lineHeight: 1.1, color: C.gold}}>Huyền Quán{v ? <br /> : ' '}Online</div></Rise>
				<Rise delay={26}><div style={{fontFamily: vn, fontSize: v ? 48 : 44, color: C.cream, marginTop: v ? 30 : 10, lineHeight: 1.35}}>Game 3D nhiều người chơi{v ? <br /> : ' · '}chạy ngay trên trình duyệt</div></Rise>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 8 — Lễ nhập môn: thẻ mệnh từ game */
export const Rite: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const v = useV();
	const s = spring({frame, fps, config: {damping: 200}});
	const z = interpolate(frame, [0, 150], [1.55, 1.7], clamp);
	return (
		<AbsoluteFill>
			<Backdrop tint="#2a1414" />
			<AbsoluteFill style={{flexDirection: v ? 'column' : 'row', alignItems: 'center', justifyContent: v ? 'flex-start' : 'center', gap: v ? 60 : 110, paddingTop: v ? 150 : 0}}>
				<div style={{width: 640, height: 880, borderRadius: 36, overflow: 'hidden', border: `2px solid ${C.goldSoft}66`, boxShadow: '0 40px 120px rgba(0,0,0,.7)', opacity: s, transform: `translateY(${(1 - s) * 160}px) scale(${v ? 1.15 : 1})`, transformOrigin: 'top center', marginBottom: v ? 130 : 0}}>
					<Img src={staticFile('shots/game-01-rite.png')} style={{width: 1920, height: 1080, transformOrigin: '960px 515px', transform: `translate(-640px,-100px) scale(${z})`}} />
				</div>
				<TextBlock
					kicker="Lễ nhập môn"
					title="Bát tự của bạn may nên phẩm phục"
					lines={[
						['Dụng thần → màu áo', C.wx['土']],
						['Hỷ thần → màu đai', C.wx['火']],
						['Kỵ thần → nên tránh', C.wx['木']],
					]}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 9–11 — Thế giới game full-frame + chú thích */
export const World: React.FC<{src: string; title: string; sub: string; from?: number; to?: number; dx?: number; dy?: number; vx?: string}> = ({src, title, sub, vx, ...kb}) => {
	const v = useV();
	return (
		<AbsoluteFill>
			<KenBurns src={src} {...kb} pos={v ? `${vx || '50%'} 50%` : undefined} />
			<Scrim />
			<AbsoluteFill style={{justifyContent: 'flex-end', padding: v ? '0 80px 380px' : '0 130px 120px'}}>
				<Rise delay={6}><div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 96 : 88, lineHeight: 1.1, color: C.cream, textShadow: '0 4px 30px rgba(0,0,0,.8)'}}>{title}</div></Rise>
				<Rise delay={14}><div style={{fontFamily: vn, fontSize: v ? 48 : 44, lineHeight: 1.35, color: C.gold, marginTop: v ? 22 : 10, textShadow: '0 4px 20px rgba(0,0,0,.8)'}}>{sub}</div></Rise>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 12 — Kết */
export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const v = useV();
	const {durationInFrames} = useVideoConfig();
	const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], clamp);
	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			<Backdrop />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -60}}>
				<Bagua size={1100} rot={-frame * 0.2} opacity={0.18} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<Rise><div style={{fontFamily: vn, fontWeight: 800, fontSize: v ? 116 : 104, lineHeight: 1.12, color: C.cream, textAlign: 'center'}}>Hiểu mệnh{v ? <br /> : ' '}để <span style={{color: C.gold}}>cải vận</span></div></Rise>
				<Rise delay={12}>
					<div style={{display: 'flex', flexDirection: v ? 'column' : 'row', alignItems: 'center', gap: 40, marginTop: 70}}>
						{['Bát Tự Dụng Thần · App', 'Huyền Quán Online · Game'].map((t, i) => (
							<div key={t} style={{fontFamily: vn, fontWeight: 600, fontSize: v ? 50 : 44, padding: '26px 52px', borderRadius: 999, color: i ? C.cream : '#2a1606', background: i ? 'transparent' : 'linear-gradient(145deg,#f3d27e,#b88a35)', border: `2px solid ${C.gold}`}}>{t}</div>
						))}
					</div>
				</Rise>
				<Rise delay={24}><div style={{fontFamily: vn, fontSize: v ? 42 : 36, color: C.muted, marginTop: 60}}>Web · iOS · Android</div></Rise>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
