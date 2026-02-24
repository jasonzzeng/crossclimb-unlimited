// A small wordlist for v1
// In a real app, this would be a much larger dictionary.
const wordList = new Set([
  'PACE', 'PACK', 'PAVE', 'LACK', 'COLD', 'CORD', 'CARD', 'WARD', 'WARM', 'WORM',
  'PLAY', 'PLAN', 'PLAIN', 'SLAY', 'SLAG', 'SNAG', 'SNUG', 'SMUG',
  'BAKE', 'BARE', 'BARK', 'WAKE', 'WOKE', 'POKE', 'PORK',
  'FISH', 'WISH', 'WASH', 'MASH', 'MASK', 'TASK',
  'LION', 'LOON', 'LOOK', 'BOOK', 'BOOT', 'ROOT',
  'BEAR', 'BEAT', 'BOAT', 'ROOF',
  'FIRE', 'DIRE', 'DIRT', 'DART', 'PART', 'PAST',
  'WIND', 'WAND', 'SAND', 'SEND', 'SEED', 'WEED',
  'RAIN', 'RUIN', 'RUNS', 'BUNS', 'BUGS', 'BAGS',
  'SNOW', 'SHOW', 'SLOW', 'SLOT', 'SOOT',
  'TREE', 'FREE', 'FLEE', 'FLED', 'SLED', 'SLID',
  'MOON', 'MOOD', 'WOOD', 'WORD', 'HARD',
  'BLACK', 'BLANK', 'BLAND', 'BRAND', 'BRAID', 'BRAIN',
  'WATER', 'CATER', 'CAPER', 'PAPER', 'PIPER', 'PIPES',
  'STONE', 'STOVE', 'SHOVE', 'SHORE', 'SHARE', 'STARE',
  'GRASS', 'BRASS', 'BRASH', 'CRASH', 'CLASH', 'CLASS',
  'TRAIN', 'TRAIL', 'FRAIL', 'FLAIL', 'FLANK',
  'HEART', 'HEARD', 'HOARD', 'BOARD', 'BEARD', 'BEARS',
  'LIGHT', 'NIGHT', 'SIGHT', 'SIGHS', 'SIGNS', 'SINKS',
  'BREAD', 'TREAD', 'TREAT', 'GREAT', 'GROAT', 'GROAN',
  'SWEET', 'SWEEP', 'STEEP', 'STEER', 'SHEER', 'SHEET',
  'SMART', 'START', 'STORE', 'SHORT',
  'CHAIR', 'CHOIR', 'CHORD', 'CHARD', 'CHARM', 'CHASM',
  'PLANT', 'PLANE', 'PLATE', 'SLATE', 'SKATE', 'STATE',
  'SINGER', 'SINKER', 'TINKER', 'TANKER', 'TANKED', 'TASKED', 'MASKED'
]);

export function validateWord(word: string): boolean {
  // For v1, we accept anything to avoid frustrating players with missing words,
  // but we could enforce the wordList here if we had a complete dictionary.
  return true;
}
