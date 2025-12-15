// ====================================================================
// FILE: scripts/irregular_verbs.js
// Data khusus untuk daftar kata kerja tak beraturan (Irregular Verbs)
// ====================================================================

// Format data: [V1 (Base), V2 (Past Simple), V3 (Past Participle)]
export const IRREGULAR_VERBS = {
    // A
    'abide': { v2: 'abode/abided', v3: 'abode/abided' },
    'arise': { v2: 'arose', v3: 'arisen' },
    'awake': { v2: 'awoke', v3: 'awoken' },
    'alight': { v2: 'alit/alighted', v3: 'alit/alighted' },
    
    // B
    'be': { v2: 'was/were', v3: 'been' },
    'bear': { v2: 'bore', v3: 'born/borne' },
    'beat': { v2: 'beat', v3: 'beaten' },
    'become': { v2: 'became', v3: 'become' },
    'begin': { v2: 'began', v3: 'begun' },
    'bend': { v2: 'bent', v3: 'bent' },
    'bet': { v2: 'bet', v3: 'bet' },
    'bid': { v2: 'bid', v3: 'bid' },
    'bind': { v2: 'bound', v3: 'bound' },
    'bite': { v2: 'bit', v3: 'bitten' },
    'bleed': { v2: 'bled', v3: 'bled' },
    'blow': { v2: 'blew', v3: 'blown' },
    'break': { v2: 'broke', v3: 'broken' },
    'breed': { v2: 'bred', v3: 'bred' },
    'bring': { v2: 'brought', v3: 'brought' },
    'build': { v2: 'built', v3: 'built' },
    'burn': { v2: 'burned/burnt', v3: 'burned/burnt' },
    'burst': { v2: 'burst', v3: 'burst' },
    'buy': { v2: 'bought', v3: 'bought' },
    'behold': { v2: 'beheld', v3: 'beheld' },
    'beseech': { v2: 'besought/beseeched', v3: 'besought/beseeched' },
    'bestride': { v2: 'bestrode', v3: 'bestridden' },
    'broadcast': { v2: 'broadcast', v3: 'broadcast' },
    
    // C
    'cast': { v2: 'cast', v3: 'cast' },
    'catch': { v2: 'caught', v3: 'caught' },
    'choose': { v2: 'chose', v3: 'chosen' },
    'cling': { v2: 'clung', v3: 'clung' },
    'come': { v2: 'came', v3: 'come' },
    'cost': { v2: 'cost', v3: 'cost' },
    'creep': { v2: 'crept', v3: 'crept' },
    'cut': { v2: 'cut', v3: 'cut' },
    'chide': { v2: 'chid/chided', v3: 'chid/chidden/chided' },
    'clap': { v2: 'clapped/clapt', v3: 'clapped/clapt' },
    'cleave': { v2: 'clove/cleft/cleaved', v3: 'cloven/cleft/cleaved' },
    'clothe': { v2: 'clothed/clad', v3: 'clothed/clad' },
    'crepitate': { v2: 'crepitated', v3: 'crepitated' }, // Jarang
    
    // D
    'deal': { v2: 'dealt', v3: 'dealt' },
    'dig': { v2: 'dug', v3: 'dug' },
    'do': { v2: 'did', v3: 'done' },
    'draw': { v2: 'drew', v3: 'drawn' },
    'dream': { v2: 'dreamed/dreamt', v3: 'dreamed/dreamt' },
    'drink': { v2: 'drank', v3: 'drunk' },
    'drive': { v2: 'drove', v3: 'driven' },
    'dare': { v2: 'durst/dared', v3: 'dared' },
    'disprove': { v2: 'disproved', v3: 'disproved/disproven' },
    'dive': { v2: 'dived/dove', v3: 'dived' },
    'drag': { v2: 'dragged/drug', v3: 'dragged/drug' },
    'dwell': { v2: 'dwelt/dwelled', v3: 'dwelt/dwelled' },
    
    // E
    'eat': { v2: 'ate', v3: 'eaten' },
    'enwind': { v2: 'enwound', v3: 'enwound' }, // Membungkus/melilitkan
    'engrave': { v2: 'engraved', v3: 'engraved/engraven' }, // Semi-irregular
    'eat-out': { v2: 'ate-out', v3: 'eaten-out' }, // Phrasal Verb (Tidak umum dihitung)
    
    // F
    'fall': { v2: 'fell', v3: 'fallen' },
    'feed': { v2: 'fed', v3: 'fed' },
    'feel': { v2: 'felt', v3: 'felt' },
    'fight': { v2: 'fought', v3: 'fought' },
    'find': { v2: 'found', v3: 'found' },
    'flee': { v2: 'fled', v3: 'fled' },
    'fling': { v2: 'flung', v3: 'flung' },
    'fly': { v2: 'flew', v3: 'flown' },
    'forbid': { v2: 'forbade/forbad', v3: 'forbidden' },
    'forget': { v2: 'forgot', v3: 'forgotten/forgot' },
    'forgive': { v2: 'forgave', v3: 'forgiven' },
    'freeze': { v2: 'froze', v3: 'frozen' },
    'forgo': { v2: 'forwent', v3: 'forgone' },
    'forsake': { v2: 'forsook', v3: 'forsaken' },
    'fret': { v2: 'fretted/fret', v3: 'fretted/fret' },
    
    // G
    'get': { v2: 'got', v3: 'gotten/got' },
    'give': { v2: 'gave', v3: 'given' },
    'go': { v2: 'went', v3: 'gone' },
    'grind': { v2: 'ground', v3: 'ground' },
    'grow': { v2: 'grew', v3: 'grown' },
    'gird': { v2: 'girded/girt', v3: 'girded/girt' },
    
    // H
    'hang': { v2: 'hung', v3: 'hung' }, // Untuk menggantung objek
    'have': { v2: 'had', v3: 'had' },
    'hear': { v2: 'heard', v3: 'heard' },
    'hide': { v2: 'hid', v3: 'hidden' },
    'hit': { v2: 'hit', v3: 'hit' },
    'hold': { v2: 'held', v3: 'held' },
    'hurt': { v2: 'hurt', v3: 'hurt' },
    'hew': { v2: 'hewed', v3: 'hewn/hewed' },
    
    // I
    'inlay': { v2: 'inlaid', v3: 'inlaid' },
    'input': { v2: 'input/inputted', v3: 'input/inputted' }, // Semi-irregular
    'interbreed': { v2: 'interbred', v3: 'interbred' },
    'interweave': { v2: 'interwove/interweaved', v3: 'interwoven/interweaved' },
    
    // J
    'jet': { v2: 'jet/jetted', v3: 'jet/jetted' }, // Semi-irregular
    'justify': { v2: 'justified', v3: 'justified' }, // Regular, tapi kadang dimasukkan
    
    // K
    'keep': { v2: 'kept', v3: 'kept' },
    'kneel': { v2: 'knelt/kneeled', v3: 'knelt/kneeled' },
    'know': { v2: 'knew', v3: 'known' },
    'knit': { v2: 'knitted/knit', v3: 'knitted/knit' },
    
    // L
    'lay': { v2: 'laid', v3: 'laid' },
    'lead': { v2: 'led', v3: 'led' },
    'lean': { v2: 'leaned/leant', v3: 'leaned/leant' },
    'leap': { v2: 'leaped/leapt', v3: 'leaped/leapt' },
    'learn': { v2: 'learned/learnt', v3: 'learned/learnt' },
    'leave': { v2: 'left', v3: 'left' },
    'lend': { v2: 'lent', v3: 'lent' },
    'let': { v2: 'let', v3: 'let' },
    'lie': { v2: 'lay', v3: 'lain' }, // Berbaring
    'light': { v2: 'lit/lighted', v3: 'lit/lighted' },
    'lose': { v2: 'lost', v3: 'lost' },
    'leapfrog': { v2: 'leapfrogged/leapfrog', v3: 'leapfrogged/leapfrog' },
    'low': { v2: 'lowed/lewed', v3: 'lowed/lewen' }, // Jarang/usang
    
    // M
    'make': { v2: 'made', v3: 'made' },
    'mean': { v2: 'meant', v3: 'meant' },
    'meet': { v2: 'met', v3: 'met' },
    'mistake': { v2: 'mistook', v3: 'mistaken' },
    'miscast': { v2: 'miscast', v3: 'miscast' },
    'misdeal': { v2: 'misdealt', v3: 'misdealt' },
    'mishear': { v2: 'misheard', v3: 'misheard' },
    'mislay': { v2: 'mislaid', v3: 'mislaid' },
    'mislead': { v2: 'misled', v3: 'misled' },
    'misread': { v2: 'misread', v3: 'misread' },
    'misspeak': { v2: 'misspoke', v3: 'misspoken' },
    'misspell': { v2: 'misspelled/misspelt', v3: 'misspelled/misspelt' },
    'misspend': { v2: 'misspent', v3: 'misspent' },
    'mow': { v2: 'mowed', v3: 'mown/mowed' },
    
    // N
    'neglect': { v2: 'neglected', v3: 'neglected' }, // Regular, tapi untuk kelengkapan
    'nigh': { v2: 'nighed/naught', v3: 'nighed/naught' }, // Jarang
    
    // O
    'outbid': { v2: 'outbid', v3: 'outbid' },
    'outdo': { v2: 'outdid', v3: 'outdone' },
    'outfight': { v2: 'outfought', v3: 'outfought' },
    'outgrow': { v2: 'outgrew', v3: 'outgrown' },
    'outrun': { v2: 'outran', v3: 'outrun' },
    'outsell': { v2: 'outsold', v3: 'outsold' },
    'outshine': { v2: 'outshone/outshined', v3: 'outshone/outshined' },
    'overbear': { v2: 'overbore', v3: 'overborne' },
    'overbid': { v2: 'overbid', v3: 'overbid' },
    'overcome': { v2: 'overcame', v3: 'overcome' },
    'overdo': { v2: 'overdid', v3: 'overdone' },
    'overdraw': { v2: 'overdrew', v3: 'overdrawn' },
    'overeat': { v2: 'overate', v3: 'overeaten' },
    'overfly': { v2: 'overflew', v3: 'overflown' },
    'overhang': { v2: 'overhung', v3: 'overhung' },
    'overhear': { v2: 'overheard', v3: 'overheard' },
    'overlay': { v2: 'overlaid', v3: 'overlaid' },
    'overpay': { v2: 'overpaid', v3: 'overpaid' },
    'override': { v2: 'overrode', v3: 'overridden' },
    'overrun': { v2: 'overran', v3: 'overrun' },
    'oversee': { v2: 'oversaw', v3: 'overseen' },
    'overshoot': { v2: 'overshot', v3: 'overshot' },
    'oversleep': { v2: 'overslept', v3: 'overslept' },
    'overtake': { v2: 'overtook', v3: 'overtaken' },
    'overthrow': { v2: 'overthrew', v3: 'overthrown' },
    'overwrite': { v2: 'overwrote', v3: 'overwritten' },
    
    // P
    'pay': { v2: 'paid', v3: 'paid' },
    'put': { v2: 'put', v3: 'put' },
    'partake': { v2: 'partook', v3: 'partaken' },
    'prepay': { v2: 'prepaid', v3: 'prepaid' },
    'proofread': { v2: 'proofread', v3: 'proofread' },
    'preset': { v2: 'preset', v3: 'preset' },
    'preshrink': { v2: 'preshrank/preshrunk', v3: 'preshrunk' },
    
    // Q
    'quit': { v2: 'quit/quitted', v3: 'quit/quitted' },
    'quell': { v2: 'quelled', v3: 'quelled' }, // Regular, untuk kelengkapan
    
    // R
    'read': { v2: 'read', v3: 'read' },
    'rid': { v2: 'rid/ridded', v3: 'rid/ridded' },
    'ride': { v2: 'rode', v3: 'ridden' },
    'ring': { v2: 'rang', v3: 'rung' },
    'rise': { v2: 'rose', v3: 'risen' },
    'run': { v2: 'ran', v3: 'run' },
    'rebuild': { v2: 'rebuilt', v3: 'rebuilt' },
    'recast': { v2: 'recast', v3: 'recast' },
    'redeal': { v2: 'redealt', v3: 'redealt' },
    'redo': { v2: 'redid', v3: 'redone' },
    'refit': { v2: 'refitted/refit', v3: 'refitted/refit' },
    'regrind': { v2: 'reground', v3: 'reground' },
    'rehear': { v2: 'reheard', v3: 'reheard' },
    'relay': { v2: 'relayed/relaid', v3: 'relayed/relaid' },
    'remake': { v2: 'remade', v3: 'remade' },
    'rend': { v2: 'rent/rended', v3: 'rent/rended' },
    'repay': { v2: 'repaid', v3: 'repaid' },
    'resell': { v2: 'resold', v3: 'resold' },
    'resend': { v2: 'resent', v3: 'resent' },
    'reset': { v2: 'reset', v3: 'reset' },
    'retake': { v2: 'retook', v3: 'retaken' },
    'retell': { v2: 'retold', v3: 'retold' },
    'rewrite': { v2: 'rewrote', v3: 'rewritten' },
    
    // S
    'say': { v2: 'said', v3: 'said' },
    'see': { v2: 'saw', v3: 'seen' },
    'seek': { v2: 'sought', v3: 'sought' },
    'sell': { v2: 'sold', v3: 'sold' },
    'send': { v2: 'sent', v3: 'sent' },
    'set': { v2: 'set', v3: 'set' },
    'shake': { v2: 'shook', v3: 'shaken' },
    'shed': { v2: 'shed', v3: 'shed' },
    'shine': { v2: 'shone/shined', v3: 'shone/shined' },
    'shoot': { v2: 'shot', v3: 'shot' },
    'show': { v2: 'showed', v3: 'shown/showed' },
    'shrink': { v2: 'shrank/shrunk', v3: 'shrunk/shrunken' },
    'shut': { v2: 'shut', v3: 'shut' },
    'sing': { v2: 'sang', v3: 'sung' },
    'sink': { v2: 'sank', v3: 'sunk' },
    'sit': { v2: 'sat', v3: 'sat' },
    'sleep': { v2: 'slept', v3: 'slept' },
    'slide': { v2: 'slid', v3: 'slid' },
    'sling': { v2: 'slung', v3: 'slung' },
    'slit': { v2: 'slit', v3: 'slit' },
    'sow': { v2: 'sowed', v3: 'sown/sowed' },
    'speak': { v2: 'spoke', v3: 'spoken' },
    'speed': { v2: 'sped/speeded', v3: 'sped/speeded' },
    'spend': { v2: 'spent', v3: 'spent' },
    'spill': { v2: 'spilled/spilt', v3: 'spilled/spilt' },
    'spin': { v2: 'spun', v3: 'spun' },
    'split': { v2: 'split', v3: 'split' },
    'spread': { v2: 'spread', v3: 'spread' },
    'spring': { v2: 'sprang/sprung', v3: 'sprung' },
    'stand': { v2: 'stood', v3: 'stood' },
    'steal': { v2: 'stole', v3: 'stolen' },
    'stick': { v2: 'stuck', v3: 'stuck' },
    'sting': { v2: 'stung', v3: 'stung' },
    'stink': { v2: 'stank/stunk', v3: 'stunk' },
    'strew': { v2: 'strewed', v3: 'strewn/strewed' },
    'stride': { v2: 'strode', v3: 'stridden' },
    'strike': { v2: 'struck', v3: 'struck/stricken' },
    'string': { v2: 'strung', v3: 'strung' },
    'strive': { v2: 'strove/strived', v3: 'striven/strived' },
    'swear': { v2: 'swore', v3: 'sworn' },
    'sweep': { v2: 'swept', v3: 'swept' },
    'swim': { v2: 'swam', v3: 'swum' },
    'swing': { v2: 'swung', v3: 'swung' },
    'saw': { v2: 'sawed', v3: 'sawn/sawed' },
    'see-saw': { v2: 'see-sawed', v3: 'see-sawed/see-sawn' },
    'shrive': { v2: 'shrove/shrived', v3: 'shriven/shrived' },
    'slink': { v2: 'slinked/slunk', v3: 'slinked/slunk' },
    'smite': { v2: 'smote', v3: 'smitten/smote' },
    'sneak': { v2: 'sneaked/snuck', v3: 'sneaked/snuck' },
    'spit': { v2: 'spat/spit', v3: 'spat/spit' },
    'stave': { v2: 'stove/staved', v3: 'stove/staved' },
    'stick-out': { v2: 'stuck-out', v3: 'stuck-out' },
    'sublet': { v2: 'sublet', v3: 'sublet' },
    'sunburn': { v2: 'sunburned/sunburnt', v3: 'sunburned/sunburnt' },
    
    // T
    'take': { v2: 'took', v3: 'taken' },
    'teach': { v2: 'taught', v3: 'taught' },
    'tear': { v2: 'tore', v3: 'torn' },
    'tell': { v2: 'told', v3: 'told' },
    'think': { v2: 'thought', v3: 'thought' },
    'throw': { v2: 'threw', v3: 'thrown' },
    'telecast': { v2: 'telecast', v3: 'telecast' },
    'thrust': { v2: 'thrust', v3: 'thrust' },
    'tread': { v2: 'trod', v3: 'trodden/trod' },
    
    // U
    'undergo': { v2: 'underwent', v3: 'undergone' },
    'understand': { v2: 'understood', v3: 'understood' },
    'uphold': { v2: 'upheld', v3: 'upheld' },
    'upset': { v2: 'upset', v3: 'upset' },
    'unbend': { v2: 'unbent', v3: 'unbent' },
    'underlie': { v2: 'underlay', v3: 'underlain' },
    'undersell': { v2: 'undersold', v3: 'undersold' },
    'underspend': { v2: 'underspent', v3: 'underspent' },
    'undertake': { v2: 'undertook', v3: 'undertaken' },
    'underwrite': { v2: 'underwrote', v3: 'underwritten' },
    'unfreeze': { v2: 'unfroze', v3: 'unfrozen' },
    'unmake': { v2: 'unmade', v3: 'unmade' },
    'unwind': { v2: 'unwound', v3: 'unwound' },
    
    // V
    'vex': { v2: 'vexed/vext', v3: 'vexed/vext' }, // Semi-irregular
    
    // W
    'wake': { v2: 'woke/waked', v3: 'woken/waked' },
    'wear': { v2: 'wore', v3: 'worn' },
    'weave': { v2: 'wove/weaved', v3: 'woven/weaved' },
    'weep': { v2: 'wept', v3: 'wept' },
    'win': { v2: 'won', v3: 'won' },
    'wind': { v2: 'wound', v3: 'wound' },
    'withdraw': { v2: 'withdrew', v3: 'withdrawn' },
    'wring': { v2: 'wrung', v3: 'wrung' },
    'write': { v2: 'wrote', v3: 'written' },
    'weatherproof': { v2: 'weatherproofed', v3: 'weatherproofed/weatherproven' },
    'wed': { v2: 'wed/wedded', v3: 'wed/wedded' },
    'wet': { v2: 'wet/wetted', v3: 'wet/wetted' },
    'whip-saw': { v2: 'whip-sawed', v3: 'whip-sawn/whip-sawed' },
    'wits': { v2: 'wist', v3: 'wist' },
    'work': { v2: 'worked/wrought', v3: 'worked/wrought' }, // Wrought jarang
    'wreak': { v2: 'wreaked/wrought', v3: 'wreaked/wrought' },
    
    // Y
    'yield': { v2: 'yielded', v3: 'yielded' }, // Regular, untuk kelengkapan
    
    // Z
    'zip': { v2: 'zipped', v3: 'zipped' }, 
    'zero': { v2: 'zeroed', v3: 'zeroed' },
};