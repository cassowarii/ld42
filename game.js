// better framerate stuff
var lastFrameTime = 0;
var timedelta = 0;
var initialframestep = 1000/60;
var framestep;

var epsilon = 10;

// music etc
var bgm;
var youwin;
var startmusic;
var endmusic;
var chffp;

// flag for if you won
var wonthegame;

var font = '9px DejaVuSerif';
var boldfont = '9px DejaVuSerifBold';

var muted = false;

var me;

var levelIndex = 0;

var leveltext;
var leveltitle;

var blurLevel = 0;

var X = 1;
var C = 2
var Y = 3;
var O = 4;
var T = 5;
var P = 6;
var V = 7;

var levels = [
    {
        title: 'Entry Point',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,X,X,X,X, X,X,X,X,X, X,X,X,X,0],
             [0,X,0,0,0, 0,0,0,0,0, 0,0,0,X,0],
             [0,X,0,P,0, T,0,P,0,0, 0,C,0,X,0],
             [0,X,0,0,0, 0,0,0,0,0, 0,0,0,X,0],
             [0,X,X,X,X, X,0,T,0,X, X,X,X,X,0],

             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],
             [0,0,0,0,0, X,0,P,0,X, 0,0,0,0,0],
             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],
             [0,0,0,0,0, X,X,X,X,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['pRtDpRtDp'],
        text: 'Welcome to PETRA!\n'
             +'See that GOAL at the bottom of the screen?\n'
             +'Your mission is to arrange the boxes to match it.\n'
             +'(Use arrow keys, and press R to reset the puzzle.)',
        congration: 'Congratulations!\n'
                   +'Press any key to go to the next level.'
    },
    {
        title: 'Foyer',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [X,X,X,X,X, X,X,X,X,X, X,X,X,X,X],
             [0,0,0,0,0, 0,0,X,0,0, 0,0,0,0,0],
             [0,C,0,0,0, 0,0,X,0,0, 0,0,0,0,0],
             [0,0,0,T,0, O,0,X,0,V, 0,Y,0,0,0],
             [0,0,0,X,X, X,0,X,0,X, X,X,0,0,0],

             [X,X,X,X,0, X,X,X,X,X, 0,X,X,X,X],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['vRyRtRo'],
        text: 'You can push multiple boxes at a time.\n'
             +'Also, if you go off one side of the screen,\n'
             +'you\'ll end up on the other!\n'
             +'Isn\'t that nifty?',
        congration: 'Your genius is truly astounding.'
    },
    {
        title: 'Medusa',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [X,X,X,X,X, X,X,X,X,X, X,X,X,X,X],
             [0,0,0,T,0, 0,0,0,0,0, 0,0,O,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,O,0,T,0],
             [0,0,0,T,0, 0,0,0,0,0, 0,0,O,0,0],
             [X,X,X,X,X, X,Y,0,Y,X, X,X,X,X,X],

             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],
             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],
             [0,0,0,0,0, X,X,Y,X,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,C,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,X,X,0, 0,0,0,0,0]],
        goals: ['yRyRy', 'oDoDo', 'tDtDt'],
        text: 'When you complete a GOAL, the blocks you used\nwill turn to stone.\n'
             +'Be careful!',
        congration: 'Yes! I\'m so proud of you.'
    },
    {
        title: 'The Void',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],

             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,C,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,Y,Y,Y,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,Y,0,0, X,0,0,0,0],

             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],
             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['yR_RyL Dy'],
        text: 'Sometimes a GOAL contains an empty space.\n'
             +'The absence of something can be just as powerful\nas its presence.',
        congration: 'Yep, simple as that!'
    },
    {
        title: 'Miscellany',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,X,0, 0,0,X,0,0, X,0,0,0,0],
             [0,0,0,X,0, 0,0,P,0,V, X,0,0,0,0],
             [0,0,0,X,0, P,0,X,0,0, X,0,0,0,0],

             [0,0,0,X,0, T,0,X,T,Y, X,0,0,0,0],
             [0,0,0,X,0, C,0,X,0,0, X,0,0,0,0],
             [0,0,0,X,0, 0,0,X,0,0, X,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['tR*R*Ry', 'pR*R*Rv'],
        text: 'Lastly, sometimes a certain space doesn\'t matter.\n'
             +'This is marked with a "?" in the GOAL.\n'
             +'You don\'t even need a box there!\n'
             +'Some things just aren\'t worth worrying about.\n\n'
             +'(But boxes matched by a "?" will still turn to stone.)',
        congration: 'Not too complicated, right?'
    },
    {
        title: 'Mama Bird',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],

             [0,0,0,0,X, X,X,Y,X,X, X,0,0,0,0],
             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,C,0,0, X,0,0,0,0],
             [0,0,X,0,V, 0,0,V,0,0, Y,0,X,0,0],
             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],

             [0,0,0,0,X, 0,0,0,0,0, X,0,0,0,0],
             [0,0,0,0,X, X,X,0,X,X, X,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['vU_D R_L L_', 'yU_D R_L L_', 'yDv'],
        text: 'Press [M] to turn the music on and off.',
        congration: 'Beautiful.'
    },
    {
        title: 'Overlap',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,X,X, X,X,0,0,0],
             [0,0,0,C,0, 0,0,X,O,O, O,X,0,0,0],
             [0,0,0,0,0, 0,0,X,X,X, X,X,0,0,0],
             [0,0,0,0,0, 0,T,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,T,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,T,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['tR*R*R*Ro', 'tR*R*R*Ro', 'tR*R*R*Ro'],
        text: 'Your progress is saved automatically.\n'
             +'Hold [SHIFT] and press [X] to delete your SAVE file.',
        congration: 'Okay, that one wasn\'t that hard.',
        goalwidth: 8,
    },
    {
        title: 'One O\'Clock Jump',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, X,0,0,0,X, X,X,X,X,0],
             [0,0,0,0,0, X,0,0,0,0, V,0,0,X,0],
             [0,0,0,0,0, X,0,C,V,0, 0,V,0,X,0],
             [0,0,0,0,0, X,0,0,0,0, V,0,0,X,0],
             [0,0,0,0,0, X,0,0,0,X, X,X,X,X,0],

             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['vR_Rv', 'vR_Rv'],
        text: 'Now that the formalities are out of the way...\n'
             +'Sit back, relax, and enjoy these puzzles I\'ve\n'
             +'prepared for you.',
        congration: 'Nice!',
    },
    {
        title: 'L-Block',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,0,0,0,X, X,X,X,0,0],
             [X,X,X,X,X, X,X,X,X,X, O,O,X,X,X],
             [0,0,0,0,0, C,0,0,O,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,O,O,0, 0,0,0,0,0],
             [X,X,X,X,X, X,X,X,X,X, X,O,O,X,X],

             [0,0,0,0,0, 0,0,0,0,0, X,X,X,X,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['oDoRo', 'oLoDoDo'],
        text: 'Here\'s a trickier one for you.',
        congration: 'Your puzzle acumen continues to impress me.',
    },
    {
        title: 'Possibility',
        lv: [[0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],

             [0,0,0,0,X, X,X,X,X,0, X,T,X,0,0],
             [0,0,0,0,X, 0,0,0,X,0, X,T,X,0,0],
             [X,X,X,X,X, 0,C,0,X,X, X,T,X,X,X],
             [0,0,0,0,0, O,0,O,0,0, 0,T,0,0,0],
             [X,X,X,X,X, 0,0,0,X,X, X,T,X,X,X],

             [0,0,0,0,X, 0,0,0,X,0, X,T,X,0,0],
             [0,0,0,0,X, X,X,X,X,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, X,T,X,0,0]],
        goals: ['oR_R_R_R_R_R_R_R_R_R_R_R_R_R_Ro', 'oRt'],
        text: 'How many impossible things\n'
             +'have you done today?',
        goalwidth: 16,
        congration: 'Add one more to the list.',
    },
    {
        title: 'The Midas Touch',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,0,X, 0,P,0,P,0, X,0,0,0,0],
             [0,0,0,X,X, P,0,C,0,P, X,0,0,0,0],
             [0,0,0,X,0, 0,P,0,P,0, X,0,0,0,0],
             [0,0,0,X,0, P,0,0,X,X, X,0,0,0,0],

             [0,0,0,X,0, 0,0,0,X,0, 0,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['pRpRp', 'pDp', 'pRp'],
        text: 'It\'s truly a tragic tale.',
        congration: 'Of course you could solve it.\n'
                   +'I never doubted you for a second.',
    },
    {
        title: 'Ouroboros',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, X,X,X,X,0],
             [0,0,0,X,0, 0,0,0,0,0, 0,0,0,0,0],

             [X,X,X,X,0, 0,0,X,X,X, X,X,X,X,X],
             [0,0,0,0,0, 0,0,X,0,P, 0,0,0,0,0],
             [0,0,C,V,V, V,0,X,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,P, 0,0,0,0,0],
             [X,X,X,X,0, 0,0,X,X,X, X,X,X,X,X],

             [0,0,0,X,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, X,X,X,O,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['pD*Dv', 'vD*Dp', 'vDo'],
        text: 'Help! I can\'t stop making mythology references.',
        congration: 'Is there nothing you can\'t do?',
    },
    {
        title: 'Corners',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],

             [0,0,0,0,X, 0,0,O,O,0, X,0,0,0,0],
             [0,0,0,0,X, 0,Y,Y,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,O,0,0, X,0,0,0,0],
             [0,0,0,0,X, 0,O,C,O,0, X,0,0,0,0],
             [0,0,0,0,X, 0,0,O,0,0, X,0,0,0,0],

             [0,0,0,0,X, 0,0,Y,Y,0, X,0,0,0,0],
             [0,0,0,0,X, 0,O,O,0,0, X,0,0,0,0],
             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['oR_Ro', 'oRoDoL_', 'oDoRoU_'],
        text: 'Twelve is definitely a crowd.',
        congration: 'Excellent crowd control!'
    },
    {
        title: 'Countable Infinity',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,X,X,X,X, X,X,0,0,0],
             [X,X,X,X,X, X,X,0,0,0, 0,X,X,X,X],
             [Y,Y,Y,Y,Y, Y,Y,Y,Y,Y, Y,Y,Y,Y,Y],
             [X,X,X,X,X, X,X,0,C,0, 0,X,X,X,X],
             [0,0,0,0,0, 0,X,X,X,X, X,X,0,0,0],

             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['yR_RyL UyD Dy'],
        text: 'Feeling a bit claustrophobic?',
        congration: 'I applaud your perseverence in this trying time.',
    },
    {
        title: 'Crossy Road',
        lv: [[0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],

             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],
             [X,X,X,X,X, 0,0,O,0,0, X,X,X,X,X],
             [0,0,0,C,0, 0,O,V,O,0, 0,0,0,0,0],
             [X,X,X,X,X, 0,0,O,0,0, X,X,X,X,X],
             [0,0,0,0,0, X,0,0,0,X, 0,0,0,0,0],

             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,X,0,X,0, 0,0,0,0,0]],
        goals: ['oDo', 'oRo', 'vU_D L_R R_L D_'],
        text: 'I\'m "running out\nof space" to fit\nthis text in!\nOhoho.',
        congration: 'You are a smart\ncookie, aren\'t you?',
    },
    {
        title: 'Positive Curvature',
        lv: [[0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0],
             [0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0],
             [0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0],
             [0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0],
             [0,X,X,X,X, X,X,X,X,X, 0,X,X,X,0],

             [0,X,0,0,0, 0,0,X,Y,0, 0,0,0,X,0],
             [0,X,0,T,0, 0,0,X,0,0, 0,0,0,X,0],
             [0,X,0,0,C, 0,0,X,0,0, 0,0,0,X,0],
             [0,X,0,0,0, 0,0,X,0,0, 0,T,0,X,0],
             [0,X,0,0,0, 0,Y,X,0,0, 0,0,0,X,0],

             [0,X,X,X,0, X,X,X,X,X, X,X,X,X,0],
             [0,0,0,X,0, 0,0,0,0,0, 0,X,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, 0,X,0,0,0],
             [0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0],
             [0,0,0,0,0, 0,0,0,0,X, 0,X,0,0,0]],
        goals: ['tR*Ry', 'yR*Rt'],
        text: 'I just want to say...\nI\'ve really enjoyed our time\ntogether.',
        congration: 'You\'ve come so far!',
    },
    {
        title: 'Bookends',
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,X,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,X, X,0,0,0,0],

             [0,0,0,0,0, 0,0,X,0,T, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,T, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,X,T, 0,C,0,X,0],
             [0,0,0,0,0, 0,0,X,0,T, 0,T,0,X,0],
             [0,0,0,0,0, 0,0,X,0,T, 0,X,X,X,0],

             [0,0,0,0,0, 0,0,X,0,X, X,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,X,X,X, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['tL DtR Dt', 'tR DtL Dt'],
        text: 'But like all things -\nespecially things\nmade in 2 days -\n'
             +'our time together\nmust come to\nan end.',
        congration: 'Not only are you\na smart cookie,\nyou\'re also a\nrising star!',
    },
    {
        title: 'Freedom',
        end: true,
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,X,X,X, X,X,X,X,X, X,X,X,0,0],
             [0,0,X,0,0, Y,0,Y,0,Y, 0,0,X,0,0],
             [0,0,X,0,Y, 0,Y,0,Y,0, Y,0,X,0,0],
             [0,0,X,0,0, Y,0,Y,0,Y, 0,0,X,0,0],
             [0,0,X,0,Y, 0,Y,C,Y,0, Y,0,X,0,0],

             [0,0,X,0,0, Y,0,Y,0,Y, 0,0,X,0,0],
             [0,0,X,0,Y, 0,Y,0,Y,0, Y,0,X,0,0],
             [0,0,X,0,0, Y,0,Y,0,Y, 0,0,X,0,0],
             [0,0,X,X,X, X,X,X,X,X, X,X,X,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]],
        goals: ['yRyUyD Ry', 'yDyRyL Dy', 'yLyDyU Ly', 'yDyLyR Dy', 'yRyUyD Ry', 'yLyDyU Ly'],
        text: 'Sadly, this is the last level.\n'
             +'I\'ll miss you when you\'re gone.',
        congration: 'Congratulations!\nI am so proud of you.',
    },
]

var endScene = {
        title: 'CONGRATULATIONS!',
        end: true,
        lv: [[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,C,0,0, 0,0,0,0,0],
             [0,0,0,0,0, 0,0,V,0,0, 0,0,0,0,0],

             [0,0,0,0,0, 0,P,X,O,0, 0,0,0,0,0],
             [0,0,0,0,0, T,X,X,X,Y, 0,0,0,0,0],
             [0,0,0,0,0, X,X,X,X,X, 0,0,0,0,0],
             [0,0,0,0,X, X,X,X,X,X, X,0,0,0,0],
             [0,0,0,X,X, X,X,X,X,X, X,X,0,0,0]],
        goals: ['p', 'oRo', 'yRyUy', 'tRtUtLt', 'vRvUvRvDv', 'tRpRoUyLvU Rt'],
        text: 'You\'ve completed my game!!\n'
             +'I hope you had a good time. I know I did!\n'
             +'If you liked the game, don\'t forget to leave feedback!\n\n'
             +'You can also check out my other games at\ncassowary.me!'
    };

function goodmod(x, n) {
     return ((x%n)+n)%n;
}

var goalShapes = [ ['p', false], ['oRo', false], ['yRyUy', false], ['tRtUtLt', false], ['vRvUvRvDv', false], ['tRtRtUtLtU Rt', true] ];

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame      ||
        window.webkitRequestAnimationFrame   ||
        window.mozRequestAnimationFrame      ||
        window.oRequestAnimationFrame        ||
        window.msRequestAnimationFrame       ||
        function(callback, element) {
            window.setTimeout(callback, 1000/60);
        };
})();

var directions = {up: 1, right: 2, down: 3, left: 4};
var directionAngles = [ [-Math.PI/2, -1, 0], [0, 0, 0], [Math.PI/2, 0, -1], [Math.PI, -1, -1] ]; // [angle, x-offset, y-offset]
var directionOffsets = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ];
function cw(dir) {
    return dir % 4 + 1;
}
function ccw(dir) {
    return (((dir - 2) % 4) + 4) % 4 + 1;
}
function oppositedir(dir) {
    return cw(cw(dir));
}

var images = {};

var totalImages = 0;
var loadedImages = 0;

function registerImages(hash, callback) {
    for (key in hash) {
        totalImages += ncolors;
        registerImage(key, hash[key], callback);
    }
}

function registerImage(id, src, callback) {
    //console.log("Registered image:", id, src);
    images[id] = new Image();
    images[id].onload = function() {
        //console.log("loaded",id,"- now generate colors");
        for (var name in colors) {
            var rgb = colors[name].replace(/[^\d,]+/, '').split(',');
            var rgbks = generateColorImage( images[id], rgb, (function(name) { return function(tinted_img) {
                images[id+'//'+name] = new Image();
                images[id+'//'+name].onload = function() {
                    loadedImages ++;
                    //console.log("loaded", id, name, ":", loadedImages, "/", totalImages);
                    if (loadedImages == totalImages) {
                        console.log("OK GO");
                        callback();
                    }
                }
                images[id+'//'+name].src = tinted_img.toDataURL();
            }})(name));
        }
    }
    images[id].src = src;
}

function imagesReady() {
    return totalImages == loadedImages;
}

function deleteObject(name) {
    delete objs[name];
}

function obj(group, imgid, x, y, color) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.dir = 0;
    this.dist = 0;
    this.movedir = 0;
    this.imgloaded = false;
    this.imgid = imgid;
    this.color = color;
    this.group = group;

    this.changeImage = function(imgid) {
        this.imgid = imgid;
    }

    this.changeColor = function(color) {
        this.color = color;
    }
}

var objs = {};

//var colors = {black: '0,0,0', red: '255,0,0', green: '0,225,0', magenta: '255,235,0', blue: '0,0,255', purple: '200,0,255', magenta: '255,0,255', grey: '100,100,100', pink: '255,0,150'}
var colors = {black: '0,0,0', white:'255,255,255', green: '0,255,0', grey: '200,200,200',
              dkgrey: '60,60,60', pink: '255,0,150', turquoise: '0,243,192', blue: '0,0,255',
              yellow: '255,255,0', orange: '255,100,0', purple: '200,0,255' };
var bgcolor = 'rgb('+colors.bg+')';

var ncolors = 0; for (var n in colors) { ncolors ++; }

var mapScale = 2;
var mapWidth = 15;
var mapHeight = 15;
var tileSize = 18;

var ctx;

var keepGoing = true;

var readyToGo = false;

var justStarted = false;

var audiocheck = document.createElement('audio');

function bumpUp(name) {
    var x = objs[name];
    delete objs[name];
    objs[name] = x;
}

ready(function() {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    var loading = new Image();
    loading.onload = function() {
        ctx.drawImage(loading, 0, 0);
    }
    loading.src = 'loading.png';
    registerImages({
        char: 'char.png',
        boxpink: 'boxpink.png',
        boxpurple: 'boxpurple.png',
        boxyellow: 'boxyellow.png',
        boxturquoise: 'boxturquoise.png',
        boxorange: 'boxorange.png',
        nub: 'nub.png',
        emptynub: 'emptynub.png',
        questionnub: 'questionnub.png',
        goal: 'goal.png',
        boxdead: 'boxdead.png',
        wall: 'wall.png',
    }, function() {
        if (audiocheck.canPlayType('audio/mpeg')) {
            bgm = new Audio('jazzpuzzle.mp3');
            endmusic = new Audio('petraend.mp3');
            startmusic = new Audio('petrastart.mp3');
        } else if (audiocheck.canPlayType('audio/ogg')) {
            bgm = new Audio('jazzpuzzle.ogg');
            endmusic = new Audio('petraend.ogg');
            startmusic = new Audio('petrastart.ogg');
        }
        bgm.loop = true;
        endmusic.loop = true;
        startmusic.loop = true;
        youwin = new Audio('youwin.wav');
        youwin.onended = function() {
            if (!wonthegame) {
                bgm.play();
            } else {
                endmusic.play();
            }
        }
        chffp = new Audio('chffp.wav');
        initialize();
        loop();
    });
});

var score = 0;

var lives = 5;

var titleReady = false;

var titleImg;

function initialize() {
    framestep = initialframestep;

    titleImg = new Image();
    titleImg.onload = function() {
        titleReady = true;
    }
    titleImg.src = 'title.png';

    objs = {};

    objs.me = [ new obj('char', 'char', Math.floor(mapWidth/2), Math.floor(mapHeight/2), 'green') ];
    objs.me.slidy = true; // slidy allows it to have fractional coordinates
    me = objs.me[0]; // shorter name for ungrouped object (objects are in lists for snakes and whatnot that take up multiple tiles)

    objs.boxes = [
        new obj('boxes', 'boxpink', me.x + 2, me.y + 2, 'pink'),
        new obj('boxes', 'boxturquoise', me.x + 1, me.y + 2, 'turquoise'),
        new obj('boxes', 'boxpurple', me.x, me.y + 2, 'purple'),
        new obj('boxes', 'boxyellow', me.x - 1, me.y + 2, 'yellow'),
        new obj('boxes', 'boxorange', me.x - 2, me.y + 2, 'orange'),
    ];
    objs.boxes.slidy = true;

    objs.walls = [];

    readyToGo = true;

    startmusic.play();

    justStarted = true;
}

function nextLevel() {
    stopCelebrating();
    if (levels[levelIndex].end == undefined) {
        levelIndex++;
        loadLevel(levelIndex);
    } else {
        // You won the game!
        wonthegame = true;
        if (!bgm.paused) {
            // This means they waited a while on the last 'celebration' screen,
            // so the BGM came back. So we have to play the end music ourselves.
            bgm.pause();
            endmusic.play();
        }
        loadLevelObject(endScene);
    }
}

function randomColor() {
    var keys = [];
    for (var prop in colors) {
        if (colors.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }

    var result;
    do {
        result = keys[keys.length * Math.random() << 0];
    } while (result == 'black' || result == 'grey' || result == 'white' || result == 'dkgrey');
    return result;
}

var inputQueue = []

var celebKeyDown = false;

var shiftDown = false;
var dataDeleted = false;

document.onkeydown = function(e) {
    if (!justStarted) {
        if (readyToGo) {
            if (e.keyCode == 16) {
                shiftDown = true;
            } else if (e.keyCode == 88 && shiftDown) {
                dataDeleted = true;
                deleteData();
            } else if (!wonthegame) {
                if (celebrating && !e.repeat) {
                    celebKeyDown = true;
                } else {
                    key = e.keyCode;
                }
            }
        }
    }
    e.preventDefault();
}

document.onkeyup = function(e) {
    if (readyToGo) {
        if (e.keyCode == 16) {
            shiftDown = false;
            dataDeleted = false;
        } else if (e.keyCode == 77) {
            toggleMute();
        } else if (justStarted) {
            justStarted = false;
            onStart();
        } else if (!wonthegame) {
            if (celebrating) {
                if (celebKeyDown) {
                    celebKeyDown = false;
                    inputQueue = [];
                    key = 0;
                    if (e.keyCode == 82) {
                        reset();
                    } else {
                        nextLevel();
                    }
                }
            } else {
                if (e.keyCode == 82 && !celebrating) {
                    reset();
                } else if (37 <= e.keyCode && 40 >= e.keyCode || e.keyCode == 32) {
                    if (!justStarted) {
                        if (key == e.keyCode) {
                            key = 0;
                        }
                    }
                }
            }
        }
        e.preventDefault();
    }
}

function keydo() {
    //lurd 37 38 39 40
    var dirToPush;
    if (key == 37) {
        dirToPush = directions.left;
    } else if (key == 38) {
        dirToPush = directions.up;
    } else if (key == 39) {
        dirToPush = directions.right;
    } else if (key == 40) {
        dirToPush = directions.down;
    }
    if (dirToPush != null) {
        inputQueue.push(dirToPush);
    }
}

function loop(timestamp) {
    if (timestamp == undefined) {
        timestamp = 0;
        lastFrameTime = timestamp;
    }
    timedelta += timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    keydo();

    while (timedelta >= framestep) {
        if (!justStarted) {
            update(framestep);
        }
        timedelta -= framestep;
    }
    draw();

    if (keepGoing) {
        // this allows us to stop the recursive calling of the function, if we want to do that for some reason?
        requestAnimFrame(loop);
    }
}

function objsAtPos(x, y) {
    var x = goodmod(x, mapWidth);
    var y = goodmod(y, mapHeight);
    var result = [];
    for (var group in objs) {
        for (var o in objs[group]) {
            if (objs[group][o].imgid == '') continue;
            if (objs[group][o].x == x && objs[group][o].y == y) {
                result.push(objs[group][o]);
            }
        }
    }
    return result;
}

function toggleMute() {
    muted = !muted;
    if (muted) {
        if (youwin.currentTime && !youwin.paused) {
            youwin.pause();
        } else if (wonthegame) {
            endmusic.pause();
        } else if (justStarted) {
            startmusic.pause();
        } else {
            bgm.pause();
        }
    } else {
        if (wonthegame) {
            endmusic.play();
        } else if (justStarted) {
            startmusic.play();
        } else {
            bgm.play();
        }
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function onStart() {
    startmusic.pause();
    if (!muted) bgm.play();
    levelIndex = parseInt(localStorage.getItem("casso.ld42.save") || "0");
    reset();
}

function moveCoords(x, y, dir) {
    switch(dir) {
        case directions.up:     return [x, y-1];
        case directions.down:   return [x, y+1];
        case directions.left:   return [x-1, y];
        case directions.right:  return [x+1, y];
    }
    return [x, y];
}

var timespeed = 1;

var movespeed = 5;

function canMove(obj) {
    // We can move boxes that haven't been 'solidified'.
    if (obj.group == 'boxes' && !obj.rooted || obj.group == 'char') return true;
    return false;
}

function freeUpSpace(x, y, dir) {
    var os = objsAtPos(x,y);
    if (os.length == 0) {
        return true; // yes, we can move here
    } else {
        for (var i in os) {
            if (canMove(os[i])) {
                // If we can move it in theory, try moving it in practice.
                // Always succeed on the character -- this means we must have
                // wrapped around the edge and come back, so the character's
                // already moving.
                if (os[i].group != 'char' && !nudge(os[i], dir)) {
                    return false;
                }
            } else {
                // It's a lost cause.
                return false;
            }
        }
    }
    return true;
}

function nudge(obj, dir) {
    var nextPos = moveCoords(obj.x, obj.y, dir);
    if (freeUpSpace(nextPos[0], nextPos[1], dir)) {
        obj.movedir = dir;
        return true;
    } else {
        return false;
    }
}

function boxAtPos(x,y) {
    var os = objsAtPos(x,y);
    if (os.length < 1) return null;
    if (os[0].group == 'boxes') return os[0];
    if (os[0].group == 'char') return os[0]; // we want empty spaces to really be empty! but nothing can actually match us bc we're green
    if (os[0].group == 'walls') return os[0]; // we also don't want walls to count as empty space... this function is increasingly misnamed
    return null;
}

function killBox(box) {
    if (box == null) return;
    if (box.group == 'char') return;
    console.log("killing box at ", box.x, box.y);
    box.changeColor('grey');
    box.rooted = true;
}

function boxColor(ch) {
    switch(ch.toUpperCase()) {
        case 'P': return 'pink';
        case 'T': return 'turquoise';
        case 'O': return 'orange';
        case 'Y': return 'yellow';
        case 'V': return 'purple'; // violet
        case '_': return 'grey';
        case '*': return 'white';
        case ' ': return '';
        default: console.log("unknown color character", ch);
    }
}

function matchesPattern(box, pat) {
    return (pat == '*' || pat == ' '
         || box == null && pat == '_'
         || box != null && box.group != 'walls' && box.color == boxColor(pat));
}

function checkShape(x, y, box, shape) {
    if (box && box.color == 'grey' && shape[0] != '*' && shape[0] != ' ') {
        return false;
    }

    // base case
    if (shape.length == 1) {
        if (matchesPattern(box, shape[0])) {
            killBox(box);
            return true;
        } else {
            return false;
        }
    }


    // otherwise is the rest of the shape good?
    shape = shape.toUpperCase();

    var color = shape[0];
    if (!matchesPattern(box, color)) {
        return false;
    }

    var firstDir = shape[1];
    var rest = shape.substring(2);
    var nextX = x;
    var nextY = y;
    switch(firstDir) {
        case 'R': nextX ++; break;
        case 'L': nextX --; break;
        case 'D': nextY ++; break;
        case 'U': nextY --; break;
        default: console.log("houston we have a problem!?!?", firstDir);
    }

    var nextbox = boxAtPos(nextX, nextY);

    var valid = checkShape(nextX, nextY, nextbox, rest);
    if (valid && shape[0] != ' ') {
        killBox(box);
    }
    return valid;
}

var celebrating = false;

var miniCelebrationTimer = 0;
var colorChangeInterval = 200; // interval in ms between changing colors in the celebration

function update(delta) {
    if (celebrating) {
        inputQueue = [];
        miniCelebrationTimer -= delta;
        if (miniCelebrationTimer <= 0) {
            for (var i in objs.walls) {
                objs.walls[i].changeColor(randomColor());
            }
            for (var i in objs.boxes) {
                if (i == 'slidy') continue; // yay js
                var oldColor = objs.boxes[i].color;
                do {
                    objs.boxes[i].changeColor(randomColor());
                } while (objs.boxes[i].color == oldColor);
            }
            var oldColor = me.color;
            do {
                me.changeColor(randomColor());
            } while (me.color == oldColor);
            miniCelebrationTimer = colorChangeInterval;
        }
    } else {
        if (inputQueue.length > 0) {
            var dir = inputQueue.shift();
            if (me.movedir == 0) {
                nudge(me, dir);
            }
        }

        var pushing = false;
        if (me.dist != 0) pushing = true;

        for (var group in objs) {
            for (var o in objs[group]) {
                var obj = objs[group][o];
                if (obj.movedir == undefined) continue;
                if (obj.dist < 1 && obj.movedir != 0) {
                    var moveAmt = movespeed * delta / 1000;
                    obj.dist += moveAmt;
                    switch(obj.movedir) {
                        case directions.up:
                            obj.y -= moveAmt;
                            break;
                        case directions.down:
                            obj.y += moveAmt;
                            break;
                        case directions.left:
                            obj.x -= moveAmt;
                            break;
                        case directions.right:
                            obj.x += moveAmt;
                            break;
                        default: console.log("help what" + obj.movedir);
                    }
                }

                if (obj.dist >= 1) {
                    obj.dist = 0;
                    obj.movedir = 0;
                    obj.x = goodmod(Math.round(obj.x), mapWidth);
                    obj.y = goodmod(Math.round(obj.y), mapHeight);
                }
            }
        }


        if (me.dist == 0 && pushing) {
            // finished a push, check goal shapes
            var complete = true;

            // Goal shapes encoded as list of pairs: first element a string
            // describing the shape, second element a boolean whether we did it already or not
            for (var i in goalShapes) {
                // Skip goal shapes we've completed already.
                if (goalShapes[i][1]) continue;
                // Otherwise check if each box is the beginning of a valid goal shape.
                for (var j in objs.boxes) {
                    if (checkShape(objs.boxes[j].x, objs.boxes[j].y, objs.boxes[j], goalShapes[i][0])) {
                        goalShapes[i][1] = true;
                        if (!muted) {
                            chffp.currentTime = 0;
                            chffp.play();
                        }
                        break;
                    }
                }
                if (!goalShapes[i][1]) {
                    complete = false;
                }
            }

            if (complete) {
                celebrate();
            }
        }
    }
}

function deleteData() {
    localStorage.setItem("casso.ld42.save", 0);
}

function celebrate() {
    bgm.pause();
    miniCelebrationTimer = 0;
    celebrating = true;
    if (levels[levelIndex].end == undefined) {
        localStorage.setItem("casso.ld42.save", levelIndex + 1);
    }
    if (levels[levelIndex].congration != undefined) {
        leveltext = levels[levelIndex].congration;
    }
    if (!muted) {
        youwin.currentTime = 0;
        youwin.play();
    }
}

function stopCelebrating() {
    celebrating = false;
    me.changeColor('green');
}

function reset() {
    console.log("Reset!");
    stopCelebrating();
    loadLevel(levelIndex);
}

function loadLevel(i) {
    loadLevelObject(levels[i]);
}

function loadLevelObject(lo) {
    objs.boxes = [];
    objs.boxes.slidy = true;
    objs.walls = [];
    for (var y in lo.lv) {
        for (var x in lo.lv[y]) {
            px = parseInt(x);
            py = parseInt(y);
            switch(lo.lv[y][x]) {
                case 0: /* nothing! */ break;
                case Y: objs.boxes.push(new obj('boxes', 'boxyellow', px, py, 'yellow')); break;
                case O: objs.boxes.push(new obj('boxes', 'boxorange', px, py, 'orange')); break;
                case P: objs.boxes.push(new obj('boxes', 'boxpink', px, py, 'pink')); break;
                case V: objs.boxes.push(new obj('boxes', 'boxpurple', px, py, 'purple')); break;
                case T: objs.boxes.push(new obj('boxes', 'boxturquoise', px, py, 'turquoise')); break;
                case C: me.x = px; me.y = py; console.log(me.x, me.y); break;
                case X: objs.walls.push(new obj('walls', 'wall', px, py, 'grey')); break;
                default: console.log("Unrecognized number in level:", lo.lv[y][x]);
            }
        }
    }
    goalShapes = [];
    for (var i in lo.goals) {
        goalShapes.push([lo.goals[i], false]);
    }
    leveltext = lo.text;
    leveltitle = lo.title;
}

function drawObj(obj, group, ctx) {
    //console.log(obj.bgcolor, objs[group].bgcolor);
    ctx.save();
    if (obj.bgcolor != undefined) {
        ctx.fillStyle = 'rgb('+colors[obj.bgcolor]+')';
    } else if (objs[group].bgcolor != undefined) {
        ctx.fillStyle = 'rgb('+colors[objs[group].bgcolor]+')';
    } else {
        ctx.fillStyle = bgcolor;
    }
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.rect(0, 0, tileSize, tileSize);
    ctx.fill();
    ctx.translate(1, 1);

    ctx.shadowColor = 'rgb(' + colors[obj.color] + ')';
    ctx.shadowBlur = blurLevel;
    var img = images[obj.imgid+'//'+obj.color];
    if (img != undefined) {
        if (obj.dir != 0) {
            // rotate object properly
            ctx.rotate(directionAngles[obj.dir-1][0]);
            ctx.translate(directionAngles[obj.dir-1][1] * img.width, directionAngles[obj.dir-1][2] * img.height);
        }
        ctx.drawImage(img, 0, 0);
    }
    ctx.restore();
}

function draw() {
    ctx.fillStyle = bgcolor;
    ctx.beginPath();
    ctx.rect(0, 0, mapWidth * tileSize * mapScale + 2, mapHeight * tileSize * mapScale);
    ctx.fill();
    ctx.save();
    ctx.scale(mapScale, mapScale);

    /* draw text underneath objects */
    ctx.save();

    if (!shiftDown) {
        ctx.fillStyle = 'rgb('+colors.purple+')';
        ctx.shadowBlur = blurLevel;
        ctx.shadowColor = ctx.fillStyle;
        ctx.font = boldfont;
        if (!justStarted) {
            if (!wonthegame) {
                ctx.fillText((levelIndex+1) + ". " + leveltitle, 20, 28);
            } else {
                // Don't print level number on ending screen.
                ctx.fillText(leveltitle, 20, 28);
            }
        } else {
            ctx.fillText("loading!", 20, 28);
        }
    } else {
        ctx.fillStyle = 'rgb('+colors.pink+')';
        ctx.font = boldfont;
        if (!dataDeleted) {
            ctx.fillText("SHIFT+X: delete save data", 20, 28);
        } else {
            ctx.fillText("Save data deleted.", 20, 28);
        }
    }

    if (window.leveltext != undefined) {
        ctx.fillStyle = 'rgb('+colors.grey+')';
        ctx.shadowBlur = blurLevel;
        ctx.shadowColor = ctx.fillStyle;
        ctx.font = font;
        var texts = leveltext.split('\n');
        for (var i in texts) {
            ctx.fillText(texts[i], 20, 40 + i * 12);
        }
    }

    ctx.restore();

    if (justStarted && titleReady) {
        ctx.save();
        ctx.drawImage(titleImg, 0, 0);

        ctx.font = boldfont;
        ctx.fillStyle = 'rgb('+colors.grey+')';
        ctx.fillText("by cassowary", 20, 208);
        ctx.fillText("[http://cassowary.me]", 20, 222);
        ctx.fillText("Made for Ludum Dare 42", 20, 236);
        ctx.fillStyle = 'rgb('+colors.green+')';
        ctx.fillText("press any key to start!", 20, 250);
        ctx.restore();
    }

    Object.keys(objs).sort(function(a, b) { return (objs[a].z || 0) >= (objs[b].z || 0) }).map(function(group) {
        for (var o in objs[group]) {
            if (o != 'bgcolor' && o != 'z' && o != 'slidy') {
                var obj = objs[group][o];

                ctx.save();
                if (objs[group].slidy != undefined) {
                    ctx.translate(goodmod(obj.x, mapWidth) * tileSize, goodmod(obj.y, mapHeight) * tileSize);
                } else {
                    ctx.translate(Math.floor(obj.x) * tileSize, Math.floor(obj.y) * tileSize);
                }
                drawObj(obj, group, ctx);
                ctx.restore();

                if (objs[group].slidy && goodmod(obj.x, mapWidth) > mapWidth - 1) {
                    ctx.save();
                    ctx.translate((goodmod(obj.x, mapWidth) - mapWidth) * tileSize, goodmod(obj.y, mapHeight) * tileSize);
                    drawObj(obj, group, ctx);
                    ctx.restore();
                }

                if (objs[group].slidy && goodmod(obj.y, mapHeight) > mapHeight - 1) {
                    ctx.save();
                    ctx.translate(goodmod(obj.x, mapWidth) * tileSize, (goodmod(obj.y, mapHeight) - mapHeight) * tileSize);
                    drawObj(obj, group, ctx);
                    ctx.restore();
                }
            }
        }
    });

    drawStatusBar();

    ctx.restore();
}

function goalShapeDimensions(shape, asdf) {
    shape = shape.toUpperCase();
    var minX = 0;
    var maxX = 0;
    var minY = 0;
    var maxY = 0;
    var x = 0;
    var y = 0;
    while (shape.length > 1) {
        var dir = shape[1];
        switch(dir) {
            case 'R':
                x ++;
                if (x > maxX) maxX = x;
                break;
            case 'L':
                x --;
                if (x < minX) minX = x;
                break;
            case 'U':
                y --;
                if (y < minY) minY = y;
                break;
            case 'D':
                y ++;
                if (y > maxY) maxY = y;
                break;
            default:
                console.log("! Unknown direction character", dir);
        }
        shape = shape.substring(2);
        if (asdf != undefined) console.log(shape, x, y, minX, maxX, minY, maxY);
    }

    // the negative average of the max and min x/y will give us the offset of the first
    // box relative to the center (since the first box by definition is at (0,0))
    return [maxX - minX + 1, maxY - minY + 1, -(maxX + minX) / 2, -(maxY + minY) / 2];
}

var smallShapeSize = 6; // actually 1 more than box size -- it's the grid size that the boxes are placed on
                        // (so we make it 1 more to get 1-pixel spacing between boxes)

function drawGoalShape(startX, startY, shape, complete) {
    boxType = shape[0];

    var nubType = 'nub';
    if (boxType == '_') nubType = 'emptynub';
    if (boxType == '*') nubType = 'questionnub';
    var color = boxColor(boxType);
    if (color != '') {
        if (complete) color = 'green';
        ctx.shadowBlur = blurLevel;
        ctx.shadowColor = 'rgb(' + colors[color] + ')';
        ctx.drawImage(images[nubType + '//' + color], startX, startY);
    }

    if (shape.length > 1) {
        dir = shape[1];
        restShape = shape.substring(2);
        nextX = startX;
        nextY = startY;
        switch(dir) {
            case 'R': nextX += smallShapeSize; break;
            case 'L': nextX -= smallShapeSize; break;
            case 'D': nextY += smallShapeSize; break;
            case 'U': nextY -= smallShapeSize; break;
        }
        drawGoalShape(nextX, nextY, restShape, complete);
    }
}

var statusBarHeight = tileSize * 1.5;

function drawStatusBar() {
    ctx.save();
    ctx.translate(0, mapHeight * tileSize);
    ctx.shadowBlur = blurLevel;
    ctx.beginPath();
    ctx.fillStyle = 'rgb('+colors.dkgrey+')';
    ctx.shadowColor = ctx.fillStyle;
    ctx.rect(-5, 0, mapWidth * tileSize + 5, statusBarHeight + 2);
    ctx.fill();
    ctx.shadowBlur = blurLevel;
    ctx.shadowColor = 'rgb('+colors.grey+')';
    ctx.drawImage(images['goal//grey'], 2, statusBarHeight / 2 - 8.5);

    var spacing = levels[levelIndex].goalwidth || 6;
    var overWidth = spacing/2;

    for (var i in goalShapes) {
        var dims = goalShapeDimensions(goalShapes[i][0]);
        drawGoalShape(26 + (overWidth + spacing/2 + dims[2] - 0.5) * smallShapeSize,
                      statusBarHeight / 2 - 1 + (dims[3] - 0.5) * smallShapeSize,
                      goalShapes[i][0], goalShapes[i][1]);
        overWidth += spacing;
    }

    ctx.restore();
}

// modified from http://www.playmycode.com/blog/2011/06/realtime-image-tinting-on-html5-canvas/
function generateColorImage(img, rgb, callback) {
    var w = img.width;
    var h = img.height;
    var rgbks = [];

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage( img, 0, 0 );

    var pixels = ctx.getImageData( 0, 0, w, h ).data;

    var loadedParts = 0;

    // 4 is used to ask for 3 images: red, green, blue and
    // black in that order.
    for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
        var canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;

        var ctx = canvas.getContext('2d');
        ctx.drawImage( img, 0, 0 );
        var to = ctx.getImageData( 0, 0, w, h );
        var toData = to.data;

        for (
                var i = 0, len = pixels.length;
                i < len;
                i += 4
            ) {
                toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                toData[i+3] =                pixels[i+3]    ;
            }

        ctx.putImageData( to, 0, 0 );

        // image is _slightly_ faster then canvas for this, so convert
        var imgComp = new Image();
        imgComp.src = canvas.toDataURL();

        rgbks.push( imgComp );

        imgComp.onload = function() {
            loadedParts++;
            if (loadedParts == 4) {
                var i = generateTintImage(img, rgbks, rgb[0], rgb[1], rgb[2]);
                callback(i);
            }
        }
    }
}

function generateTintImage(img, rgbks, red, green, blue) {
    var buff = document.createElement( "canvas" );
    buff.width  = img.width;
    buff.height = img.height;

    var ctx  = buff.getContext("2d");

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage( rgbks[3], 0, 0 );

    ctx.globalCompositeOperation = 'lighter';
    if ( red > 0 ) {
        ctx.globalAlpha = red   / 255.0;
        ctx.drawImage( rgbks[0], 0, 0 );
    }
    if ( green > 0 ) {
        ctx.globalAlpha = green / 255.0;
        ctx.drawImage( rgbks[1], 0, 0 );
    }
    if ( blue > 0 ) {
        ctx.globalAlpha = blue  / 255.0;
        ctx.drawImage( rgbks[2], 0, 0 );
    }

    return buff;
}
