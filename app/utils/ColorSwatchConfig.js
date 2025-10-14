// components/ColorSwatchConfig.js
export const COLOR_SWATCH_CONFIG = {
  // --- NEUTRALS / WHITES / BLACKS ---
  white: 'rgb(255,255,255)',
  'off white': 'rgb(250,248,240)',
  ivory: 'rgb(255,255,240)',
  cream: 'rgb(255,253,208)',
  ecru: 'rgb(239,236,227)',
  beige: 'rgb(222,209,183)',
  oatmeal: 'rgb(204,197,180)',
  taupe: 'rgb(139,133,137)',
  sand: 'rgb(210,180,140)',
  khaki: 'rgb(195,176,145)',
  camel: 'rgb(193,154,107)',
  tan: 'rgb(198,162,118)',
  mocha: 'rgb(136,95,66)',
  chestnut: 'rgb(149,69,53)',
  'coffee brown': 'rgb(143,107,71)',
  'chocolate brown': 'rgb(95,58,35)',
  espresso: 'rgb(58,38,26)',
  graphite: 'rgb(84,84,84)',
  charcoal: 'rgb(54,69,79)',
  grey: 'rgb(78,74,73)',
  'cement grey': 'rgb(112,122,124)',
  'slate grey': 'rgb(114,118,121)',
  black: 'rgb(32,33,28)',
  'soft black': 'rgb(18,18,18)',

  // --- BLUES / DENIM ---
  'light wash denim': 'rgb(173,190,209)',
  'mid wash denim': 'rgb(77,97,128)',
  'dark indigo denim': 'rgb(19,41,75)',
  'navy blue': 'rgb(48,47,52)',
  cobalt: 'rgb(0,71,171)',
  'royal blue': 'rgb(65,105,225)',
  'english blue': 'rgb(115,135,162)',
  'sky blue': 'rgb(168,183,200)',
  'baby blue': 'rgb(137,207,240)',
  'powder blue': 'rgb(176,224,230)',
  periwinkle: 'rgb(204,204,255)',
  'midnight blue': 'rgb(25,25,112)',

  // --- GREENS ---
  'mint green': 'rgb(198,224,201)',
  'seafoam green': 'rgb(159,226,191)',
  jade: 'rgb(83,107,93)',
  'sage green': 'rgb(81,98,88)',
  'olive green': 'rgb(110,106,89)',
  'army green': 'rgb(75,83,32)',
  'forest green': 'rgb(34,85,45)',
  emerald: 'rgb(80,200,120)',
  teal: 'rgb(15,98,102)',
  pistachio: 'rgb(190,227,176)',

  // --- REDS / PINKS / CORALS ---
  'true red': 'rgb(200,16,46)',
  maroon: 'rgb(161,42,44)',
  burgundy: 'rgb(128,0,32)',
  wine: 'rgb(106,44,57)',
  rose: 'rgb(205,119,128)',
  'dusty rose': 'rgb(186,123,135)',
  blush: 'rgb(222,173,172)',
  'salmon pink': 'rgb(213,173,155)',
  coral: 'rgb(255,127,80)',
  'hot pink': 'rgb(208,47,90)',
  'pastel pink': 'rgb(255,192,203)',

  // --- ORANGES / YELLOWS / EARTHY ---
  rust: 'rgb(183,65,14)',
  terracotta: 'rgb(195,104,60)',
  peach: 'rgb(241,209,194)',
  apricot: 'rgb(255,206,180)',
  'mustard yellow': 'rgb(205,171,45)',
  amber: 'rgb(255,191,0)',
  'goldenrod': 'rgb(218,165,32)',
  'butter yellow': 'rgb(255,241,118)',
  yellow: 'rgb(243,208,124)',

  // --- PURPLES / LILACS ---
  lilac: 'rgb(216,192,216)',
  lavender: 'rgb(181,169,255)',
  mauve: 'rgb(136,80,112)',
  plum: 'rgb(142,69,133)',
  eggplant: 'rgb(97,64,81)',
  brinjal: 'rgb(79,60,66)',

  // --- JEWEL TONES ---
  ruby: 'rgb(155,17,30)',
  garnet: 'rgb(115,0,26)',
  sapphire: 'rgb(18,97,188)',
  amethyst: 'rgb(153,102,204)',
  topaz: 'rgb(255,200,124)',
  jadeite: 'rgb(0,168,107)',

  // --- METALLICS ---
  gold: 'rgb(212,175,55)',
  'rose gold': 'rgb(183,110,121)',
  bronze: 'rgb(136,84,11)',
  copper: 'rgb(184,115,51)',
  silver: 'rgb(192,192,192)',
  pewter: 'rgb(150,153,146)',

  // --- TRENDY / SPECIALITY ---
  turquoise: 'rgb(41,105,133)',
  peacock: 'rgb(57,82,112)',
  'english teal': 'rgb(0,105,107)',
  'rose taupe': 'rgb(168,119,122)',
  'dusty blue': 'rgb(110,130,153)',
  'burnt orange': 'rgb(204,85,0)',
  'soft lilac': 'rgb(205,180,219)',
  'warm sand': 'rgb(229,210,179)',
  'mocha mist': 'rgb(186,144,113)',
  'stone grey': 'rgb(157,160,153)',
  'winter white': 'rgb(255,250,240)',
  'charcoal navy': 'rgb(44,50,72)',
  Grey: 'rgb(78,74,73)',
  'Navy Blue': 'rgb(48,47,52)',
  Rose: 'rgb(205,119,128)',
  White: 'rgb(220,219,214)',
  'Mint Green': 'rgb(198,224,201)',
  'Salmon Pink': 'rgb(213,173,155)',
  'Olive Green': '#6e6a59',
  'Slate Grey': 'rgb(114,118,121)',
  Turquoise: 'rgb(41,105,133)',
  Peach: 'rgb(241,209,194)',
  'Sky Blue': 'rgb(168,183,200)',
  Teal: 'rgb(15,98,102)',
  'Hot Pink': 'rgb(208,47,90)',
  Wine: 'rgb(106,44,57)',
  'Cement Grey': 'rgb(112,122,124)',
  Peacock: 'rgb(57,82,112)',
  'Sage Green': 'rgb(81,98,88)',
};



export function getSwatchStyle(colorName) {
  const colorLower = colorName.toLowerCase().trim();
  const colorValue = COLOR_SWATCH_CONFIG[colorLower];

  // If defined in config
  if (colorValue) {
    if (colorValue.includes('linear-gradient')) {
      return {background: colorValue};
    }
    if (colorValue.startsWith('rgb') || colorValue.startsWith('#')) {
      return {
        background: `linear-gradient(to right, ${colorValue}, ${colorValue})`,
      };
    }
    if (colorValue.includes('url(')) {
      return {backgroundImage: colorValue};
    }
  }

  // Fallback gray like Liquid
  return {background: 'linear-gradient(to right, #E5E5E5, #E5E5E5)'};
}

export function isLightColor(colorName) {
  const lightColors = [
    'white',
    'cream',
    'ivory',
    'off-white',
    'off white',
    'beige',
    'light gray',
    'light pink',
  ];
  return lightColors.some((light) => colorName.toLowerCase().includes(light));
}
