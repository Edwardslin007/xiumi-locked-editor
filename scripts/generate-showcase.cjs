const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetBase = 'showcase-assets';

const articleTitle = '守候时光的智慧';

const paragraphs = [
  '当第一缕晨光刺破武夷山的雾霭，茶农便背着竹篓走上蜿蜒的山路。他们要等露水完全蒸发，等阳光恰好温柔，才能采摘那最嫩的芽尖。这份等待，是千年茶文化沉淀的智慧——他们深知，好茶不在争抢中诞生，而在静候中圆满。',
  '自然界的等待总是从容不迫。《礼记》有言：“春生夏长，秋收冬藏。”古人早已洞悉万物生长的节律。大雁不因北方的严寒而提前南飞，梅花不因诗人的期盼而提早绽放。老子云：“大器晚成”，真正的丰盈从不源于急迫。一株毛竹用四年时间扎根，仅三尺长，第五年却以每日三十厘米的速度直冲云霄。那看似沉默的四年，正是生命为飞跃积蓄力量的必然过程。',
  '然而，在科技赋予我们“加速”能力的今天，等待正成为一种濒临失传的美德。外卖迟到五分钟便有人焦虑不安，短视频三秒没有亮点便被划走，知识付费课程承诺“七天掌握一门外语”。算法为我们编织了即时满足的茧房，让我们逐渐失去了与时间从容相处的能力。法国作家圣埃克苏佩里在《小王子》中写道：“正是你为玫瑰花费的时间，才使你的玫瑰变得如此重要。”可我们是否还愿意为某个人、某件事付出漫长而真挚的等待？',
  '高迪建造圣家堂，深知自己无法目睹教堂完工，却说：“我的客户（上帝）并不着急。”这座历经四代工匠、跨越三个世纪的建筑奇迹，恰恰证明了等待造就永恒。中国“天眼”工程从选址到落成用了二十二年，FAST团队在贵州深山中等过了无数个寂静的日夜，终于迎来了接收宇宙信号的辉煌时刻。这些跨越时间的杰作告诉我们：有些等待不是为了抵达，而是为了成为抵达本身。',
  '在我十七岁的这年春天，我开始明白：等待不是消极的空白，而是主动的孕育。备战高考的每一个深夜，看似在等待六月的检验，实则是在等待知识的沉淀与思维的成熟。就像故乡那条闽江，从不急着奔向东海，而是在每一个转弯处滋养两岸的土地，最后以磅礴之势汇入大洋。生命的壮阔，往往来自那些看似“慢”下来的时刻。',
  '回望文明长河，从《诗经》的“如切如磋，如琢如磨”，到故宫文物修复师们数年修复一件国宝的耐心，中华民族始终懂得等待的分量。在这个崇尚“快”的时代，或许我们更需要重拾这份古老的智慧——在适当的等待中，让思想扎根，让情感发酵，让灵魂跟上脚步。因为最深远的抵达，常常始于最沉静的守候。'
];

const images = {
  river: `${assetBase}/001.jpg`,
  neon: `${assetBase}/002.jpg`,
  quote: `${assetBase}/003.jpg`
};

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function attr(value) {
  return esc(value).replaceAll('\n', ' ');
}

function p(text, style) {
  return `<p style="${attr(style)}">${esc(text)}</p>`;
}

function img(src, alt, style) {
  return `<img src="${attr(src)}" alt="${attr(alt)}" style="${attr(style)}">`;
}

function section(inner, style, id, name) {
  return `<section data-xiumi-layout="${attr(id)}" data-xiumi-layout-name="${attr(name)}" style="${attr(style)}">${inner}</section>`;
}

function divider(text, style) {
  return `<section style="${attr(style)}">${esc(text)}</section>`;
}

const baseParagraph = 'margin:0 0 18px 0;font-size:16px;line-height:2.05;letter-spacing:0;color:#314038;text-align:justify;';

function layout01() {
  const name = '青山茶韵';
  const html = [
    `<section style="text-align:center;margin:0 0 24px 0;">${img(images.quote, '保持阅读习惯', 'width:100%;display:block;border-radius:0;margin:0 auto 18px auto;')}</section>`,
    `<section style="text-align:center;padding:18px 18px 8px 18px;">`,
    `<p style="margin:0 0 8px 0;color:#5f7f68;font-size:14px;letter-spacing:2px;">慢下来，才看得见时间的答案</p>`,
    `<h1 style="margin:0;color:#1d4f37;font-size:28px;line-height:1.35;font-weight:700;letter-spacing:0;">${esc(articleTitle)}</h1>`,
    `<p style="margin:12px auto 0 auto;width:64px;border-top:3px solid #8abf78;height:0;"></p>`,
    `</section>`,
    p(paragraphs[0], baseParagraph),
    img(images.river, '湖边守候', 'width:100%;display:block;margin:24px auto;border-radius:12px;box-shadow:0 12px 28px rgba(31,83,56,.16);'),
    p(paragraphs[1], baseParagraph),
    `<section style="margin:24px 0;padding:18px 18px;border-left:4px solid #3f8f5a;background:#eff8f1;color:#2a5a3b;font-size:15px;line-height:1.9;">等待不是空白，是根向下生长的声音。</section>`,
    p(paragraphs[2], baseParagraph),
    img(images.neon, '加速时代', 'width:100%;display:block;margin:24px auto;border-radius:12px;'),
    p(paragraphs[3], baseParagraph),
    p(paragraphs[4], baseParagraph),
    p(paragraphs[5], baseParagraph),
    `<section style="text-align:center;margin:30px 0 0 0;color:#5e8468;font-size:14px;">— END —</section>`
  ].join('');
  return {
    id: '01',
    name,
    summary: '绿色自然系，适合茶文化、成长感悟和温柔议论文。',
    html: section(html, 'max-width:677px;margin:0 auto;padding:22px;background:#f3fbf5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '01', name)
  };
}

function layout02() {
  const name = '宋韵书卷';
  const html = [
    `<section style="padding:28px 22px 18px 22px;border:1px solid #d8c7a2;background:#fffdf7;">`,
    `<p style="margin:0;color:#9b6a2e;font-size:13px;text-align:center;letter-spacing:3px;">岁月有章  慢火成文</p>`,
    `<h1 style="margin:12px 0 6px 0;text-align:center;color:#4e3422;font-size:29px;line-height:1.35;font-weight:700;">${esc(articleTitle)}</h1>`,
    `<p style="margin:0 auto 20px auto;width:120px;height:1px;background:#c9a76b;"></p>`,
    img(images.quote, '阅读与耐心', 'width:88%;display:block;margin:0 auto 24px auto;border:8px solid #f2ead8;'),
    p(paragraphs[0], 'margin:0 0 20px 0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;'),
    p(paragraphs[1], 'margin:0 0 20px 0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;'),
    `</section>`,
    `<section style="margin:20px 0;padding:18px 22px;background:#6f4426;color:#fff8e8;font-size:15px;line-height:1.9;">“如切如磋，如琢如磨”，等待让思想有了纹理。</section>`,
    p(paragraphs[2], 'margin:0 0 20px 0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;'),
    img(images.neon, '快时代', 'width:100%;display:block;margin:22px auto;border-radius:0;'),
    p(paragraphs[3], 'margin:0 0 20px 0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;'),
    img(images.river, '沉静时刻', 'width:78%;display:block;margin:24px auto;border-radius:999px;border:6px solid #eee0c1;'),
    p(paragraphs[4], 'margin:0 0 20px 0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:2.08;color:#4a3a2a;text-align:justify;')
  ].join('');
  return {
    id: '02',
    name,
    summary: '古典书卷系，适合强调文化引用和传统智慧。',
    html: section(html, 'max-width:677px;margin:0 auto;padding:24px;background:#fbf4e6;font-family:Georgia,"Times New Roman","Microsoft YaHei",serif;', '02', name)
  };
}

function layout03() {
  const name = '静蓝晨光';
  const html = [
    `<section style="background:#173d63;color:#f7fbff;padding:30px 24px;text-align:left;">`,
    `<p style="margin:0 0 10px 0;color:#a8d7ff;font-size:14px;letter-spacing:2px;">TIME WAITS WITH LIGHT</p>`,
    `<h1 style="margin:0;font-size:30px;line-height:1.28;font-weight:800;">${esc(articleTitle)}</h1>`,
    `<p style="margin:16px 0 0 0;font-size:15px;line-height:1.8;color:#d9edf8;">从晨光、山路与茶芽开始，重新学习与时间相处。</p>`,
    `</section>`,
    img(images.river, '江边晨昏', 'width:100%;display:block;margin:0 auto 24px auto;'),
    p(paragraphs[0], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;'),
    p(paragraphs[1], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;'),
    `<section style="margin:24px 24px;padding:18px 18px;background:#eaf5ff;border-radius:12px;color:#17486f;font-size:15px;line-height:1.9;">大器晚成，不是慢的借口，而是深扎根后的爆发。</section>`,
    p(paragraphs[2], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;'),
    img(images.neon, '速度与科技', 'width:calc(100% - 48px);display:block;margin:22px auto;border-radius:12px;'),
    p(paragraphs[3], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:70%;display:block;margin:24px auto;border-radius:10px;'),
    p(paragraphs[4], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;'),
    p(paragraphs[5], 'margin:0 24px 0 24px;font-size:16px;line-height:2;color:#203142;text-align:justify;')
  ].join('');
  return {
    id: '03',
    name,
    summary: '蓝色清爽系，适合理性、干净、面向学生读者的公众号文。',
    html: section(html, 'max-width:677px;margin:0 auto;padding:0 0 28px 0;background:#f7fbff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '03', name)
  };
}

function layout04() {
  const name = '水墨留白';
  const html = [
    `<section style="padding:42px 26px 22px 26px;background:#ffffff;">`,
    `<p style="margin:0 0 20px 0;width:42px;height:4px;background:#202020;"></p>`,
    `<h1 style="margin:0 0 18px 0;color:#141414;font-size:31px;line-height:1.28;font-weight:700;">${esc(articleTitle)}</h1>`,
    `<p style="margin:0;color:#6d6d6d;font-size:15px;line-height:1.9;">有些答案，不在快跑里出现，而在停下来之后慢慢显影。</p>`,
    `</section>`,
    p(paragraphs[0], 'margin:0 26px 22px 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:76%;display:block;margin:30px auto;filter:grayscale(.08);'),
    p(paragraphs[1], 'margin:0 26px 22px 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;'),
    `<blockquote style="margin:28px 26px;padding:0 0 0 18px;border-left:3px solid #222;color:#555;font-size:15px;line-height:2;">等待不是被动拖延，而是对规律的尊重。</blockquote>`,
    p(paragraphs[2], 'margin:0 26px 22px 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;'),
    img(images.neon, '即时满足', 'width:100%;display:block;margin:28px auto;filter:grayscale(.18);'),
    p(paragraphs[3], 'margin:0 26px 22px 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;'),
    p(paragraphs[4], 'margin:0 26px 22px 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;'),
    img(images.river, '江边沉思', 'width:88%;display:block;margin:30px auto;'),
    p(paragraphs[5], 'margin:0 26px;font-size:16px;line-height:2.15;color:#222;text-align:justify;')
  ].join('');
  return {
    id: '04',
    name,
    summary: '黑白留白系，适合严肃散文和议论文，克制耐看。',
    html: section(html, 'max-width:677px;margin:0 auto;padding:0 0 36px 0;background:#fff;font-family:"Songti SC","SimSun","Microsoft YaHei",serif;', '04', name)
  };
}

function layout05() {
  const name = '金秋长卷';
  const html = [
    `<section style="padding:26px;background:linear-gradient(180deg,#fff8e8 0%,#ffffff 56%);">`,
    `<section style="border:1px solid #efcf87;padding:24px 20px;background:#fffdf8;">`,
    `<p style="margin:0;text-align:center;color:#ba7a23;font-size:13px;letter-spacing:2px;">秋收冬藏 · 心有所候</p>`,
    `<h1 style="margin:12px 0 20px 0;text-align:center;color:#7d481a;font-size:30px;line-height:1.35;">${esc(articleTitle)}</h1>`,
    img(images.quote, '阅读习惯', 'width:100%;display:block;margin:0 auto 22px auto;border-radius:10px;'),
    p(paragraphs[0], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    p(paragraphs[1], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    `</section>`,
    divider('等待，是生命给丰收留下的余地。', 'margin:24px 0;padding:16px;text-align:center;background:#f2b94b;color:#fff;font-size:16px;font-weight:700;border-radius:10px;'),
    p(paragraphs[2], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    img(images.neon, '快时代', 'width:100%;display:block;margin:22px auto;border-radius:10px;'),
    p(paragraphs[3], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    img(images.river, '江边日暮', 'width:84%;display:block;margin:24px auto;border-radius:16px;'),
    p(paragraphs[4], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:2.05;color:#54391c;text-align:justify;'),
    `</section>`
  ].join('');
  return {
    id: '05',
    name,
    summary: '金秋暖色系，强调“秋收冬藏”的节律感。',
    html: section(html, 'max-width:677px;margin:0 auto;background:#fff8e9;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '05', name)
  };
}

function layout06() {
  const name = '霓虹反差';
  const html = [
    `<section style="background:#10151d;padding:28px 24px;color:#eff8ff;">`,
    `<p style="margin:0 0 10px 0;color:#4ee6d1;font-size:13px;letter-spacing:2px;">SLOW MODE / ON</p>`,
    `<h1 style="margin:0;font-size:31px;line-height:1.28;color:#ffffff;font-weight:800;">${esc(articleTitle)}</h1>`,
    `<p style="margin:14px 0 0 0;color:#a8b8c8;font-size:15px;line-height:1.8;">在加速的系统里，重新夺回等待的主动权。</p>`,
    `</section>`,
    img(images.neon, '加速时代', 'width:100%;display:block;margin:0 auto 24px auto;'),
    p(paragraphs[0], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#d8e6ee;text-align:justify;'),
    p(paragraphs[1], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#d8e6ee;text-align:justify;'),
    `<section style="margin:24px;padding:18px 18px;border:1px solid #2bd6c4;background:#13252c;color:#8ef3e5;font-size:15px;line-height:1.9;">快，不等于抵达；慢，也不等于停滞。</section>`,
    p(paragraphs[2], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#d8e6ee;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:72%;display:block;margin:24px auto;border-radius:12px;'),
    p(paragraphs[3], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#d8e6ee;text-align:justify;'),
    img(images.river, '江边守候', 'width:100%;display:block;margin:24px auto;'),
    p(paragraphs[4], 'margin:0 24px 18px 24px;font-size:16px;line-height:2;color:#d8e6ee;text-align:justify;'),
    p(paragraphs[5], 'margin:0 24px;color:#d8e6ee;font-size:16px;line-height:2;text-align:justify;')
  ].join('');
  return {
    id: '06',
    name,
    summary: '暗色霓虹系，用 KTV 图片表现快时代的反差。',
    html: section(html, 'max-width:677px;margin:0 auto;padding:0 0 34px 0;background:#10151d;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '06', name)
  };
}

function layout07() {
  const name = '红印雅集';
  const html = [
    `<section style="padding:30px 24px;background:#fffaf7;">`,
    `<section style="text-align:center;margin-bottom:20px;">`,
    `<p style="display:inline-block;margin:0 0 14px 0;padding:4px 10px;border:1px solid #b9362b;color:#b9362b;font-size:13px;">慢读札记</p>`,
    `<h1 style="margin:0;color:#3b2722;font-size:30px;line-height:1.35;">${esc(articleTitle)}</h1>`,
    `</section>`,
    p(paragraphs[0], 'margin:0 0 18px 0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:82%;display:block;margin:24px auto;border:1px solid #ead5cf;'),
    p(paragraphs[1], 'margin:0 0 18px 0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    `<section style="margin:24px 0;padding:16px 18px;background:#b9362b;color:#fff;font-size:15px;line-height:1.9;">真正的丰盈，从不源于急迫；它更像一枚印章，落下之前必须先沉住气。</section>`,
    p(paragraphs[2], 'margin:0 0 18px 0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    img(images.neon, '加速诱惑', 'width:100%;display:block;margin:24px auto;border-radius:6px;'),
    p(paragraphs[3], 'margin:0 0 18px 0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    p(paragraphs[4], 'margin:0 0 18px 0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    img(images.river, '江边沉思', 'width:76%;display:block;margin:26px auto;border-radius:8px;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:2.08;color:#3d302c;text-align:justify;'),
    `</section>`
  ].join('');
  return {
    id: '07',
    name,
    summary: '红印国风系，庄重但不沉闷，适合文化类公众号。',
    html: section(html, 'max-width:677px;margin:0 auto;background:#fffaf7;font-family:"Songti SC","SimSun","Microsoft YaHei",serif;', '07', name)
  };
}

function layout08() {
  const name = '竹影清风';
  const html = [
    `<section style="padding:24px;background:#edf8ef;">`,
    `<section style="padding:26px 20px;background:#ffffff;border-radius:18px;">`,
    `<p style="margin:0 0 8px 0;color:#6f9b62;font-size:14px;text-align:center;letter-spacing:2px;">把时间交还给生长</p>`,
    `<h1 style="margin:0 0 22px 0;text-align:center;color:#24563a;font-size:29px;line-height:1.35;">${esc(articleTitle)}</h1>`,
    img(images.river, '江边守候', 'width:100%;display:block;margin:0 auto 24px auto;border-radius:18px;'),
    p(paragraphs[0], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    p(paragraphs[1], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    `</section>`,
    `<section style="margin:20px 0;padding:20px 18px;background:#d9f0dd;border-radius:18px;color:#27533b;font-size:15px;line-height:1.9;">毛竹沉默的四年，并没有浪费，它只是在为第五年的云霄做准备。</section>`,
    p(paragraphs[2], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    img(images.neon, '即时满足', 'width:100%;display:block;margin:22px auto;border-radius:18px;'),
    p(paragraphs[3], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:70%;display:block;margin:24px auto;border-radius:18px;'),
    p(paragraphs[4], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:2.05;color:#314a38;text-align:justify;'),
    `</section>`
  ].join('');
  return {
    id: '08',
    name,
    summary: '浅绿圆润系，更年轻、柔和，适合校园公众号。',
    html: section(html, 'max-width:677px;margin:0 auto;background:#edf8ef;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '08', name)
  };
}

function layout09() {
  const name = '湖畔独白';
  const html = [
    img(images.river, '湖畔独白', 'width:100%;display:block;margin:0 auto;'),
    `<section style="padding:26px 24px;background:#f5f7f4;">`,
    `<p style="margin:0 0 8px 0;color:#738073;font-size:14px;letter-spacing:2px;">写给十七岁春天的一封信</p>`,
    `<h1 style="margin:0 0 22px 0;color:#26342f;font-size:30px;line-height:1.35;">${esc(articleTitle)}</h1>`,
    p(paragraphs[0], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    p(paragraphs[1], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    `<section style="margin:24px 0;padding:18px 18px;background:#ffffff;border:1px solid #dce3dd;color:#3a4640;font-size:15px;line-height:1.9;">我们以为自己在等待六月，其实六月也在等待我们慢慢长成。</section>`,
    p(paragraphs[2], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    img(images.neon, '时代加速', 'width:100%;display:block;margin:22px auto;border-radius:4px;'),
    p(paragraphs[3], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    img(images.quote, '阅读习惯', 'width:74%;display:block;margin:24px auto;border-radius:4px;'),
    p(paragraphs[4], 'margin:0 0 18px 0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:2.05;color:#2f3935;text-align:justify;'),
    `</section>`
  ].join('');
  return {
    id: '09',
    name,
    summary: '叙事随笔系，用人物湖畔图承接“十七岁春天”。',
    html: section(html, 'max-width:677px;margin:0 auto;background:#f5f7f4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;', '09', name)
  };
}

function layout10() {
  const name = '现代杂志';
  const html = [
    `<section style="padding:24px;background:#ffffff;">`,
    `<section style="display:block;padding:0 0 20px 0;border-bottom:4px solid #111827;">`,
    `<p style="margin:0 0 8px 0;color:#0f766e;font-size:13px;font-weight:700;letter-spacing:2px;">FEATURE / TIME</p>`,
    `<h1 style="margin:0;color:#111827;font-size:34px;line-height:1.18;font-weight:900;">${esc(articleTitle)}</h1>`,
    `</section>`,
    img(images.quote, '阅读习惯', 'width:100%;display:block;margin:24px auto 18px auto;border-radius:0;'),
    p(paragraphs[0], 'margin:0 0 18px 0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    `<section style="margin:20px 0;padding:18px;background:#111827;color:#ffffff;font-size:18px;line-height:1.6;font-weight:800;">好茶不在争抢中诞生，而在静候中圆满。</section>`,
    p(paragraphs[1], 'margin:0 0 18px 0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    img(images.neon, '加速时代', 'width:100%;display:block;margin:22px auto;border-radius:0;'),
    p(paragraphs[2], 'margin:0 0 18px 0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    p(paragraphs[3], 'margin:0 0 18px 0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    img(images.river, '江边守候', 'width:84%;display:block;margin:24px 0 24px auto;border-radius:0;'),
    p(paragraphs[4], 'margin:0 0 18px 0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    p(paragraphs[5], 'margin:0;font-size:16px;line-height:1.95;color:#222b37;text-align:justify;'),
    `</section>`
  ].join('');
  return {
    id: '10',
    name,
    summary: '现代杂志系，标题更强、节奏更快，适合视觉冲击型公众号。',
    html: section(html, 'max-width:677px;margin:0 auto;background:#fff;font-family:Arial,"Microsoft YaHei",sans-serif;', '10', name)
  };
}

const layouts = [
  layout01(),
  layout02(),
  layout03(),
  layout04(),
  layout05(),
  layout06(),
  layout07(),
  layout08(),
  layout09(),
  layout10()
];

const dataJs = `window.XIUMI_LAYOUTS = ${JSON.stringify(layouts, null, 2)};\n`;

const showcaseHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>守候时光的智慧｜10 套公众号排版</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --panel: #ffffff;
      --line: #d9e0ea;
      --text: #17202a;
      --muted: #66758a;
      --accent: #0f766e;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); }
    .shell { max-width: 1160px; margin: 0 auto; padding: 26px 18px 48px; }
    .top { display: flex; gap: 18px; align-items: flex-end; justify-content: space-between; margin-bottom: 18px; }
    h1 { margin: 0; font-size: 28px; line-height: 1.25; letter-spacing: 0; }
    .sub { margin: 8px 0 0; color: var(--muted); font-size: 14px; line-height: 1.7; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .action, .tab { border: 1px solid var(--line); background: #fff; color: var(--text); height: 36px; border-radius: 7px; padding: 0 12px; cursor: pointer; font: inherit; }
    .action:hover, .tab:hover { border-color: #93a4b8; }
    .action.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .tabs { display: flex; gap: 8px; overflow-x: auto; padding: 10px 0 14px; margin-bottom: 10px; }
    .tab { flex: 0 0 auto; }
    .tab.active { background: #e6f5f3; border-color: var(--accent); color: #0f766e; font-weight: 700; }
    .meta { display: flex; justify-content: space-between; gap: 16px; align-items: center; color: var(--muted); font-size: 14px; margin: 0 0 14px; }
    .workspace { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 18px; align-items: start; }
    .preview-wrap { background: #e8edf4; border: 1px solid var(--line); padding: 24px 0; overflow: auto; }
    .source-panel { background: var(--panel); border: 1px solid var(--line); padding: 14px; position: sticky; top: 14px; }
    .source-panel h2 { margin: 0 0 10px; font-size: 16px; }
    textarea { width: 100%; min-height: 460px; resize: vertical; border: 1px solid var(--line); border-radius: 6px; padding: 10px; font: 12px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; color: #26313f; }
    @media (max-width: 960px) { .workspace { grid-template-columns: 1fr; } .source-panel { position: static; } .top { align-items: flex-start; flex-direction: column; } }
  </style>
</head>
<body>
  <main class="shell">
    <section class="top">
      <div>
        <h1>守候时光的智慧｜10 套公众号排版</h1>
        <p class="sub">每个标签对应一套可复制源码的公众号图文排版，图片与正文均已排入版面。</p>
      </div>
      <div class="actions">
        <button class="action primary" id="copySourceBtn" type="button">复制当前源码</button>
        <a class="action" id="singleViewLink" href="showcase-preview.html?style=01" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;text-decoration:none;">单版预览</a>
      </div>
    </section>
    <nav class="tabs" id="tabs" aria-label="排版风格标签"></nav>
    <section class="meta">
      <span id="layoutName">01 青山茶韵</span>
      <span id="layoutSummary">绿色自然系</span>
    </section>
    <section class="workspace">
      <div class="preview-wrap">
        <article id="articlePreview"></article>
      </div>
      <aside class="source-panel">
        <h2>当前排版源码</h2>
        <textarea id="sourceText" spellcheck="false"></textarea>
      </aside>
    </section>
  </main>
  <script src="showcase-data.js"></script>
  <script>
    const layouts = window.XIUMI_LAYOUTS || [];
    const tabs = document.getElementById('tabs');
    const preview = document.getElementById('articlePreview');
    const sourceText = document.getElementById('sourceText');
    const layoutName = document.getElementById('layoutName');
    const layoutSummary = document.getElementById('layoutSummary');
    const singleViewLink = document.getElementById('singleViewLink');

    function selectLayout(id) {
      const layout = layouts.find((item) => item.id === id) || layouts[0];
      if (!layout) return;
      preview.innerHTML = layout.html;
      sourceText.value = layout.html;
      layoutName.textContent = layout.id + ' ' + layout.name;
      layoutSummary.textContent = layout.summary;
      singleViewLink.href = 'showcase-preview.html?style=' + encodeURIComponent(layout.id);
      tabs.querySelectorAll('.tab').forEach((button) => {
        button.classList.toggle('active', button.dataset.id === layout.id);
      });
      if (location.hash !== '#style-' + layout.id) {
        history.replaceState(null, '', '#style-' + layout.id);
      }
    }

    for (const layout of layouts) {
      const button = document.createElement('button');
      button.className = 'tab';
      button.type = 'button';
      button.dataset.id = layout.id;
      button.textContent = layout.id + ' ' + layout.name;
      button.addEventListener('click', () => selectLayout(layout.id));
      tabs.appendChild(button);
    }

    document.getElementById('copySourceBtn').addEventListener('click', async () => {
      await navigator.clipboard.writeText(sourceText.value);
    });

    const hashId = (location.hash.match(/style-(\\d+)/) || [])[1];
    selectLayout(hashId || '01');
  </script>
</body>
</html>
`;

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>公众号排版截图预览</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #e8edf4; padding: 24px 0 40px; }
    #articlePreview { width: 100%; }
  </style>
</head>
<body>
  <article id="articlePreview"></article>
  <script src="showcase-data.js"></script>
  <script>
    const params = new URLSearchParams(location.search);
    const id = params.get('style') || '01';
    const layout = (window.XIUMI_LAYOUTS || []).find((item) => item.id === id) || (window.XIUMI_LAYOUTS || [])[0];
    document.title = layout ? layout.id + ' ' + layout.name + '｜公众号排版截图预览' : '公众号排版截图预览';
    document.getElementById('articlePreview').innerHTML = layout ? layout.html : '';
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'showcase-data.js'), dataJs, 'utf8');
fs.writeFileSync(path.join(root, 'showcase.html'), showcaseHtml, 'utf8');
fs.writeFileSync(path.join(root, 'showcase-preview.html'), previewHtml, 'utf8');

console.log(`Generated ${layouts.length} layouts.`);
