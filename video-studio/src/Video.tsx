import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import vo from '../public/vo/durations.json';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {FiveArts, GameTitle, Intro, Outro, PhoneFeature, Rite, Stats, World} from './scenes';
import {C, FPS, T} from './theme';

const tr = () => <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />;

const BASE = [150, 150, 150, 165, 165, 135, 135, 150, 135, 120, 130, 180];
const LEAD = 12; // giọng đọc bắt đầu sau khi cảnh hiện rõ
const TAIL = 18; // nghỉ sau câu đọc
export const SCENES = BASE.map((b, i) => Math.max(b, LEAD + Math.ceil(vo.durations[i] * FPS) + TAIL + T));

/** Giọng lồng tiếng của cảnh i. */
const Vo: React.FC<{i: number}> = ({i}) => (
	<Sequence from={LEAD} name={`Giọng ${i + 1}`} layout="none">
		<Audio src={staticFile(`vo/vo-${String(i).padStart(2, '0')}.mp3`)} volume={1} />
	</Sequence>
);
export const TOTAL = SCENES.reduce((a, b) => a + b, 0) - T * (SCENES.length - 1);

export const Promo: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<Audio
				src={staticFile('music.wav')}
				volume={(f) => interpolate(f, [0, 30, durationInFrames - 60, durationInFrames], [0, 0.32, 0.32, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Mở đầu" durationInFrames={SCENES[0]}>
					<Vo i={0} />
					<Intro />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Ngũ Thuật" durationInFrames={SCENES[1]}>
					<Vo i={1} />
					<FiveArts />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Lập lá số" durationInFrames={SCENES[2]}>
					<Vo i={2} />
					<PhoneFeature src="mob/m-000.png" kicker="Bước 1" title="Nhập ngày giờ sinh" lines={['Tự đổi âm lịch, tiết khí, giờ mặt trời thật', 'Chọn nơi sinh — tự chỉnh múi giờ, kinh độ', 'Một chạm: «Luận giải»']} scroll={60} />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Tứ Trụ" durationInFrames={SCENES[3]}>
					<Vo i={3} />
					<PhoneFeature src="mob/m-006.png" kicker="四柱 · Tứ Trụ" title="Lá số hiện ra trong tích tắc" lines={['Thiên can – Địa chi, tàng can, nạp âm', 'Thập Thần, Thông căn thấu cán', 'Cách cục theo Tử Bình chính thống']} scroll={260} flip />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Ngũ Hành" durationInFrames={SCENES[4]}>
					<Vo i={4} />
					<PhoneFeature src="mob/m-007.png" kicker="五行 · 用喜忌仇" title="Ngũ Hành & Dụng Thần" lines={['Vượng suy từng hành theo tỉ lệ thật', 'Đủ 4 tầng Dụng · Hỷ · Kỵ · Thù', 'Đại Vận, Lưu Niên, vận từng ngày']} scroll={520} />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Con số" durationInFrames={SCENES[5]}>
					<Vo i={5} />
					<Stats />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Huyền Quán" durationInFrames={SCENES[6]}>
					<Vo i={6} />
					<GameTitle />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Nhập môn" durationInFrames={SCENES[7]}>
					<Vo i={7} />
					<Rite />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Sân quán" durationInFrames={SCENES[8]}>
					<Vo i={8} />
					<World src="shots/game-02-world.png" vx="50%" title="Bước vào sân Đạo quán" sub="Lư hương, đèn đá, hoa đào — ngày đêm theo giờ thật" from={1.02} to={1.14} dy={-20} />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Đạo trường" durationInFrames={SCENES[9]}>
					<Vo i={9} />
					<World src="shots/game-05.png" vx="38%" title="Giải án, xem nhà, gieo quẻ" sub="Mọi việc chạy bằng engine luận giải thật của app" from={1.15} to={1.03} dx={30} />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Chính Điện" durationInFrames={SCENES[10]}>
					<Vo i={10} />
					<World src="shots/game-07.png" vx="56%" title="Gặp đạo hữu khắp nơi" sub="Thấy nhau, cùng vào điện, cùng giải án" from={1.03} to={1.18} dy={-30} />
				</TransitionSeries.Sequence>
				{tr()}
				<TransitionSeries.Sequence name="Kết" durationInFrames={SCENES[11]}>
					<Vo i={11} />
					<Outro />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
