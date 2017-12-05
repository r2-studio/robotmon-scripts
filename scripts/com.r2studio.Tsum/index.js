importJS("TaskController-0.0.1");

// Utils
function isSameColor(c1, c2, diff) {
  if (diff == undefined) {
    diff = 20;
  }
  if (Math.abs(c1.r - c2.r) > diff) {
    return false;
  }
  if (Math.abs(c1.g - c2.g) > diff) {
    return false;
  }
  if (Math.abs(c1.b - c2.b) > diff) {
    return false;
  }
  return true;
}

function absColor(c1, c2) {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
}

function log() {
  this.sleep(10);
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      arguments[i] = JSON.stringify(arguments[i]);
    }
  }
  console.log.apply(console, arguments);
}

// ============================TSUM=============================== //

var Config = {
  captureGameWidth: 1080,
  recordDir: 'tsum_record',
  tsumDir: 'scripts/com.r2studio.Tsum/tsums_16',
  tsumJpDir: 'scripts/com.r2studio.Tsum/tsums_jp_16',
  tsumWidth: 16,
  tsumBoundW: 13, // tsumWidth / 2 + 2
  tsumBoundH: 13,
  screenResize: 200,
  loadRotatedCount: 8,
  tsumFiles: ["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_anna_s", "block_annac_s", "block_annaf_s", "block_ariel_s", "block_arielr_s", "block_arlo_s", "block_aurora_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_bb8_s", "block_beast_s", "block_beastl_s", "block_belle_s", "block_bellel_s", "block_brerrabbit_s", "block_buzz_s", "block_c3po_s", "block_carl_s", "block_charming_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chip_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_clarice_s", "block_claricepi_s", "block_cruella_s", "block_crush_s", "block_daisy_s", "block_daisyn_s", "block_daisyv_s", "block_daisyx_s", "block_dale_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_davyjones_s", "block_deathtrooper_s", "block_donald_s", "block_donaldn_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx_s", "block_dory_s", "block_dumbott_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsa_s", "block_elsac_s", "block_elsaf_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_finnick_s", "block_flounder_s", "block_flynn_s", "block_gaston_s", "block_genie_s", "block_goofy_s", "block_goofyh2016_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_jack_s", "block_jacksparrow2_s", "block_jacksparrow_s", "block_jackx_s", "block_jafartt_s", "block_jailerdog_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen2_s", "block_littlegreenmen_s", "block_lotso_s", "block_luke_s", "block_lukej_s", "block_lumiere_s", "block_madhatter_s", "block_madhatterj_s", "block_maleficent_s", "block_maleficentd_s", "block_marchhare_s", "block_marie_s", "block_mater_s", "block_maui_s", "block_max_s", "block_maximus_s", "block_mcqueentt_s", "block_megara_s", "block_mickey_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeyp_s", "block_mickeypi_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_mike_s", "block_mikeu_s", "block_minnie_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_mulan_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_oswald_s", "block_oswaldsp_s", "block_pascal_s", "block_perry_s", "block_pete_s", "block_peteb_s", "block_phillip2_s", "block_phillip_s", "block_piglet_s", "block_ping_s", "block_pinocchio_s", "block_pluto_s", "block_plutoh2015_s", "block_plutox_s", "block_pocahontas_s", "block_pooh_s", "block_poohr_s", "block_potts_s", "block_pudding_s", "block_puffy_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_ramirez_s", "block_randall_s", "block_rapunzel2_s", "block_rapunzel_s", "block_rapunzelb_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_salazar_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite_s", "block_sora_s", "block_souffle_s", "block_stitch_s", "block_stitchf_s", "block_stitchh_s", "block_stitchpi_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tigger_s", "block_tiggerr_s", "block_tinkerbell_s", "block_tinkerbellp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_walle_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_woody_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s"],
  tsumFilesJP: ["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_anna_s", "block_annac_s", "block_annaf_s", "block_ariel_s", "block_arielr_s", "block_arlo_s", "block_aurora_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_baymaxx_s", "block_bb8_s", "block_beast_s", "block_beastl_s", "block_belle_s", "block_bellel_s", "block_bluefairy_s", "block_boogie_s", "block_brerrabbit_s", "block_buzz_s", "block_c3po_s", "block_carl_s", "block_charming_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chip_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_clarice_s", "block_claricepi_s", "block_cruella_s", "block_crush_s", "block_daisy_s", "block_daisyn_s", "block_daisyv_s", "block_daisyx_s", "block_dale_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_davyjones_s", "block_deathtrooper_s", "block_donald_s", "block_donaldht_s", "block_donaldhtskill_s", "block_donaldn_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx2_s", "block_donaldx_s", "block_dory_s", "block_drossel_s", "block_dumbo_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsa_s", "block_elsac_s", "block_elsaf_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_finnick_s", "block_flounder_s", "block_flynn_s", "block_gaston_s", "block_genie_s", "block_goofy_s", "block_goofyh2016_s", "block_goofyht_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_hunnypot_s", "block_jack_s", "block_jacksparrow2_s", "block_jacksparrow_s", "block_jackx_s", "block_jafar_s", "block_jailerdog_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen2_s", "block_littlegreenmen_s", "block_lotso_s", "block_luke_s", "block_lukej_s", "block_lumiere_s", "block_lumpy_s", "block_madhatter_s", "block_madhatterj_s", "block_maleficent_s", "block_maleficentd_s", "block_marchhare_s", "block_marie_s", "block_mariex_s", "block_mater_s", "block_maui_s", "block_max_s", "block_maximus_s", "block_mcqueen_s", "block_megara_s", "block_mickey_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeyp_s", "block_mickeypi_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_mike_s", "block_mikeu_s", "block_minnie_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh2017_s", "block_minnieh_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_mulan_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_oswald_s", "block_oswaldsp_s", "block_owl_s", "block_pascal_s", "block_patch_s", "block_perry_s", "block_pete_s", "block_peteb_s", "block_peterpan_s", "block_phillip2_s", "block_phillip_s", "block_piglet2_s", "block_piglet_s", "block_ping_s", "block_pinocchio_s", "block_pluto_s", "block_plutoh2015_s", "block_plutox_s", "block_pocahontas_s", "block_pooh2_s", "block_pooh_s", "block_poohr_s", "block_potts_s", "block_prince_s", "block_pudding_s", "block_puffy_s", "block_pumpkinking_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_ramirez_s", "block_randall_s", "block_rapunzel2_s", "block_rapunzel_s", "block_rapunzelb_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_salazar_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite2_s", "block_snowwhite_s", "block_sora_s", "block_soraht_s", "block_souffle_s", "block_stitch_s", "block_stitchf_s", "block_stitchh_s", "block_stitchpi_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tigger_s", "block_tiggerr_s", "block_timothy_s", "block_tinkerbell_s", "block_tinkerbellp_s", "block_tramp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_walle_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_woody_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s"],
  rotations: ['0', '45', '90', '135', '180', '225', '270', '315'],
  gameContinueDelay: 400,
  colors: [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]],
  scoreTable: {
    // block_sulley_s: -0.02,
    // block_arlo_s: 0.03,
    // block_lotso_s: 0.03,
  },
};

// 1776 * 1920 (y - 78)
var adjY = 78;
var Button = {
  gameBubblesFrom: {x: 100, y: 560 - adjY},
  gameBubblesTo: {x: 1000, y: 1460 - adjY},
  gameMyTsum: {x: 100, y: 1450 - adjY},
  gameQuestionCancel: {x: 400, y: 1280 - adjY},
  gameQuestionCancel2: {x: 400, y: 1000 - adjY},
  gameStop: {x: 440, y: 1000 - adjY},
  gameSkillOn: {x: 160, y: 1490 - adjY, color: {"a":0,"b":0,"g":220,"r":238}},
  gameSkillOff1: {x: 160, y: 1630 - adjY, color: {"a":0,"b":157,"g":112,"r":85}},
  gameSkillOff2: {x: 160, y: 1630 - adjY, color: {"a":0,"b":181,"g":139,"r":72}},
  gameSkillOff3: {x: 160, y: 1630 - adjY, color: {"a":0,"b":128,"g":73,"r":16}},
  gameSkillOff4: {x: 160, y: 1630 - adjY, color: {"a":0,"b":178,"g":153,"r":3}},
  gameRand: {x: 985, y: 1580 - adjY, color: {"a":0,"b":6,"g":180,"r":232}},
  gamePause: {x: 983, y: 250 - adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue: {x: 540, y: 1270 - adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameContinue1: {x: 461, y: 980 - adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue2: {x: 911, y: 980 - adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameMagicalTime1: {x: 320, y: 1255 - adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime2: {x: 750, y: 1255 - adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime3: {x: 320, y: 1130 - adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime4: {x: 750, y: 1130 - adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  outGameItem1: {x: 241, y: 770 - adjY, color:{ r: 42, g: 109, b: 190}},
  outGameItem2: {x: 496, y: 788 - adjY, color:{ r: 47, g: 113, b: 197}},
  outGameItem3: {x: 709, y: 781 - adjY, color:{ r: 34, g: 102, b: 185}},
  outGameItem4: {x: 950, y: 817 - adjY, color:{ r: 44, g: 110, b: 194}},
  outGameItem5: {x: 262, y: 1051 - adjY, color:{ r: 34, g: 124, b: 200}},
  outGameItem6: {x: 435, y: 1030 - adjY, color:{ r: 42, g: 108, b: 192}},
  outGameEnd: {x: 890, y: 1520 - adjY, color: {"a":0,"b":15,"g":140,"r":245}},
  outStart1: {x: 500, y: 1520 - adjY, color: {"a":0,"b":19,"g":145,"r":247}}, // 開始遊戲
  outStart2: {x: 500, y: 1520 - adjY, color: {"a":0,"b":129,"g":111,"r":236}}, // 開始
  outClose: {x: 500, y: 1520 - adjY, color: {"a":0,"b":7,"g":180,"r":236}}, // 關閉
  outClose2: {x: 300, y: 1520 - adjY}, // 關閉
  outReceive: {x: 910, y: 350 - adjY},
  outReceiveAll: {x: 800, y: 1350 - adjY},
  outReceiveOk: {x: 835, y: 1020 - adjY, color: {"a":0,"b":6,"g":175,"r":236}},
  outReceiveClose: {x: 530, y: 1300 - adjY},
  outReceiveOne: {x: 840, y: 497 - adjY, color: {"a":0,"b":11,"g":181,"r":235}, color2: {"a":0,"b":119,"g":74,"r":40}},
  outReceiveOneHeart: {x: 290, y: 585 - adjY, color: {"a":0,"b":146,"g":65,"r":214}},
  outIsLoading1: {x: 540, y: 720 - adjY, color: {"a":0,"b":255,"g":255,"r":255}},
  outIsLoading2: {x: 540, y: 910 - adjY, color: {"a":0,"b":255,"g":255,"r":255}},
  outReceiveTimeout: {x: 600, y: 1020 - adjY, color: {"a":0,"b":11,"g":171,"r":235}},
  outDisconnected: {x:  147, y: 1008 - adjY, color: {r: 243, g: 89, b: 117}},
  outSendHeartTop: {x: 910, y: 430 - adjY},
  outSendHeart0: {x: 910, y: 626 - adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart1: {x: 910, y: 823 - adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart2: {x: 910, y: 1030 - adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart3: {x: 910, y: 1232 - adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeartClose: {x: 666, y: 1354 - adjY, color: {r: 236, g: 178, b: 9}},
  outSendHeartFrom: {x: 910, y: 530 - adjY},
  outSendHeartTo: {x: 910, y: 1250 - adjY},
  outSendHeartEnd: {x: 328, y: 1194 - adjY, color: {"a":0,"b":132,"g":85,"r":47}},
  outSendHeartEnd2: {x: 227, y: 1190 - adjY, color: {"a":0,"b":123,"g":78,"r":44}},
  outFriendScoreFrom: {x: 550, y: 863 - adjY, color: {"a":0,"b":140,"g":93,"r":55}},
  outFriendScoreTo: {x: 760, y: 863 - adjY},
  skillLuke1: {x: 970, y: 1270 - adjY},
  outReceiveNameFrom: {x: 160, y: 460 - adjY},
  outReceiveNameTo: {x: 620, y: 555 - adjY},
};

var Page = {
  TodayMission: {
    name: 'TodayMission',
    colors: [
      {x: 540, y: 1408 - adjY, r: 238, g: 181, b: 12 , match: true, threshold: 70},
      {x: 975, y: 428  - adjY, r: 161, g: 224, b: 231, match: true, threshold: 70},
      {x: 554, y: 1260 - adjY, r: 24 , g: 189, b: 219, match: true, threshold: 70},
    ],
    back: {x: 558, y: 1473},
    next: {x: 558, y: 1473},
  },
  ScorePage: {
    name: 'ScorePage',
    colors: [
      {x: 302, y: 1509 - adjY, r: 235, g: 184, b: 7  , match: true, threshold: 70},
      {x: 777, y: 1516 - adjY, r: 248, g: 142, b: 20 , match: true, threshold: 70},
      {x: 774, y: 428  - adjY, r: 243, g: 248, b: 242, match: true, threshold: 70},
    ],
    back: {x: 309, y: 1581 - adjY},
    next: {x: 784, y: 1581 - adjY},
  },
  FriendPage: {
    name: 'FriendPage',
    colors: [
      {x: 547, y: 1520 - adjY, r: 246, g: 135, b: 17 , match: true, threshold: 70},
      {x: 187, y: 1527 - adjY, r: 240, g: 218, b: 72 , match: true, threshold: 70},
      {x: 860, y: 1505 - adjY, r: 238, g: 189, b: 11 , match: true, threshold: 70},
      {x: 698, y: 392  - adjY, r: 244, g: 249, b: 243, match: true, threshold: 70},
    ],
    back: {x: 547, y: 1581 - adjY},
    next: {x: 547, y: 1581 - adjY},
  },
  GiftHeart: {
    name: 'GiftHeart',
    colors: [
      {x: 216, y: 1012 - adjY, r: 233, g: 172, b: 6, match: true, threshold: 70},
      {x: 673, y: 1008 - adjY, r: 235, g: 174, b: 8, match: true, threshold: 70},
      {x: 468, y: 731  - adjY, r: 214, g: 61 , b: 143, match: true, threshold: 75},
      {x: 572, y: 489  - adjY, r: 30 , g: 193, b: 224, match: true, threshold: 70},
      {x: 583, y: 1123 - adjY, r: 28 , g: 186, b: 221, match: true, threshold: 70},
    ],
    back: {x: 774, y: 1023 - adjY},
    next: {x: 320, y: 1019 - adjY},
  },
  MailBox: {
    name: 'MailBox',
    colors: [
      {x: 738, y: 342  - adjY, r: 240, g: 245, b: 239, match: true, threshold: 70},
      {x: 550, y: 1509 - adjY, r: 238, g: 187, b: 10 , match: true, threshold: 70},
      {x: 604, y: 1347 - adjY, r: 234, g: 171, b: 6  , match: true, threshold: 70},
    ],
    back: {x: 561, y: 1581 - adjY},
    next: {x: 561, y: 1581 - adjY},
  },
  ReceiveHeart: {
    name: 'ReceiveHeart',
    colors: [
      {x: 208, y: 1008 - adjY, r: 233, g: 172, b: 6  , match: true, threshold: 70},
      {x: 662, y: 1008 - adjY, r: 232, g: 171, b: 5  , match: true, threshold: 70},
      {x: 561, y: 482  - adjY, r: 28 , g: 191, b: 222, match: true, threshold: 70},
      {x: 565, y: 1138 - adjY, r: 30 , g: 195, b: 225, match: true, threshold: 70},
      {x: 334, y: 745  - adjY, r: 213, g: 62 , b: 143, match: true, threshold: 75},
      {x: 586, y: 749  - adjY, r: 248, g: 249, b: 51 , match: true, threshold: 90},
    ],
    back: {x: 774, y: 1023 - adjY},
    next: {x: 320, y: 1019 - adjY},
  },
  Received: {
    name: 'Received',
    colors: [
      {x: 799, y: 644 - adjY, r: 30, g: 188, b: 223, match: true, threshold: 70},
      {x: 806, y: 817 - adjY, r: 45, g: 80 , b: 122, match: true, threshold: 70},
      {x: 799, y: 976 - adjY, r: 27, g: 188, b: 217, match: true, threshold: 70},
    ],
    back: {x: 774, y: 1023 - adjY},
    next: {x: 320, y: 1019 - adjY},
  },
  StartPage: {
    name: 'StartPage',
    colors: [
      {x: 752, y: 399  - adjY, r: 244, g: 249, b: 243, match: true, threshold: 70},
      {x: 856, y: 1358 - adjY, r: 30 , g: 193, b: 224, match: true, threshold: 70},
      {x: 169, y: 1509 - adjY, r: 239, g: 188, b: 11, match: true, threshold: 70},
      {x: 547, y: 1509 - adjY, r: 235, g: 118, b: 134, match: true, threshold: 70},
      {x: 846, y: 1509 - adjY, r: 236, g: 185, b: 8, match: true, threshold: 70},
    ],
    back: {x: 190, y: 1574 - adjY},
    next: {x: 558, y: 1563 - adjY},
  },
  SettingPage: {
    name: 'SettingPage',
    colors: [
      {x: 741, y: 345  - adjY, r: 240, g: 245, b: 239, match: true, threshold: 70},
      {x: 363, y: 504  - adjY, r: 21 , g: 184, b: 219, match: true, threshold: 70},
      {x: 464, y: 1084 - adjY, r: 236, g: 175, b: 9  , match: true, threshold: 70},
      {x: 903, y: 1228 - adjY, r: 237, g: 176, b: 10 , match: true, threshold: 70},
      {x: 554, y: 1516 - adjY, r: 236, g: 180, b: 9 , match: true, threshold: 70},
    ],
    back: {x: 565, y: 1577 - adjY},
    next: {x: 565, y: 1577 - adjY},
  },
  TsumsPage: {
    name: 'TsumsPage',
    colors: [
      {x: 514, y: 842  - adjY, r: 41, g: 177, b: 203 , match: true, threshold: 70},
      {x: 180, y: 1520 - adjY, r: 238, g: 180, b: 11 , match: true, threshold: 90},
      {x: 817, y: 1516 - adjY, r: 238, g: 191, b: 13 , match: true, threshold: 70},
    ],
    back: {x: 176, y: 1520 - adjY},
    next: {x: 176, y: 1520 - adjY},
  },
  GamePause: {
    name: 'GamePause',
    colors: [
      {x: 165, y: 1005 - adjY, r: 234, g: 173, b: 7  , match: true, threshold: 70},
      {x: 594, y: 1001 - adjY, r: 233, g: 171, b: 8  , match: true, threshold: 70},
      {x: 367, y: 702  - adjY, r: 24 , g: 191, b: 225, match: true, threshold: 70},
      {x: 738, y: 540  - adjY, r: 248, g: 244, b: 245 , match: true, threshold: 70},
      {x: 550, y: 1264 - adjY, r: 236, g: 182, b: 11  , match: true, threshold: 70},
    ],
    back: {x: 331, y: 1008 - adjY},
    next: {x: 561, y: 1350 - adjY},
  },
  GamePlaying: {
    name: 'GamePlaying',
    colors: [
      {x: 982, y: 194  - adjY, r: 236, g: 192, b: 5, match: true, threshold: 70},
      {x: 986, y: 1563 - adjY, r: 236, g: 191, b: 2, match: true, threshold: 70},
    ],
    back: {x: 986, y: 201 - adjY},
    next: {x: 986, y: 201 - adjY},
  },
  MagicalTime: {
    name: 'MagicalTime',
    colors: [
      {x: 817, y: 435  - adjY, r: 244, g: 249, b: 243, match: true, threshold: 70},
      {x: 594, y: 785  - adjY, r: 248, g: 102, b: 121, match: true, threshold: 90},
      {x: 208, y: 1145 - adjY, r: 236, g: 175, b: 9  , match: true, threshold: 70},
      {x: 662, y: 1141 - adjY, r: 232, g: 171, b: 5  , match: true, threshold: 70},
    ],
    back: {x: 381, y: 1149 - adjY},
    next: {x: 856, y: 1149 - adjY},
  },
  NetworkDisable: {
    name: 'NetworkDisable',
    colors: [
      {x: 478, y: 1008 - adjY, r: 236, g: 94, b: 116, match: true, threshold: 70},
      {x: 932, y: 1005 - adjY, r: 232, g: 171, b: 5, match: true, threshold: 70},
    ],
    back: {x: 356, y: 1008 - adjY},
    next: {x: 885, y: 1012 - adjY},
  },
  NetworkTimeout: {
    name: 'NetworkTimeout',
    colors: [
      {x: 478, y: 1008 - adjY, r: 232, g: 171, b: 5, match: true, threshold: 70},
      {x: 932, y: 1005 - adjY, r: 232, g: 171, b: 5, match: true, threshold: 70},
    ],
    back: {x: 885, y: 1012 - adjY},
    next: {x: 885, y: 1012 - adjY},
  },
  HighScore: {
    name: 'HighScore',
    colors: [
      {x: 298, y: 1253 - adjY, r: 238, g: 187, b: 10, match: true, threshold: 70},
      {x: 810, y: 1253 - adjY, r: 238, g: 187, b: 10, match: true, threshold: 70},
    ],
    back: {x: 298, y: 1253 - adjY},
    next: {x: 810, y: 1253 - adjY},
  },
  RankUp: {
    name: 'RankUp',
    colors: [
      {x: 327, y: 1458 - adjY, r: 236, g: 175, b: 9, match: true, threshold: 70},
      {x: 792, y: 1455 - adjY, r: 234, g: 173, b: 5, match: true, threshold: 70},
    ],
    back: {x: 327, y: 1458 - adjY},
    next: {x: 792, y: 1455 - adjY},
  },
  InvitePage: {
    name: 'InvitePage',
    colors: [
      {x: 342, y: 835  - adjY, r: 58 , g: 87 , b: 145, match: true, threshold: 70},
      {x: 669, y: 832  - adjY, r: 0  , g: 181, b: 1  , match: true, threshold: 70},
      {x: 536, y: 1271 - adjY, r: 233, g: 175, b: 6  , match: true, threshold: 70},
    ],
    back: {x: 576, y: 1314 - adjY},
    next: {x: 576, y: 1314 - adjY},
  },
  EventPage: {
    name: 'EventPage',
    colors: [
      {x: 554, y: 1509 - adjY, r: 239, g: 188, b: 11, match: true, threshold: 70},
      {x: 997, y: 1617 - adjY, r: 230, g: 169, b: 3 , match: true, threshold: 70},
    ],
    back: {x: 554, y: 1509 - adjY},
    next: {x: 554, y: 1509 - adjY},
  },
  FriendInfo: {
    name: 'FriendInfo',
    colors: [
      {x: 565, y: 504   - adjY, r: 31, g: 190, b: 220, match: true, threshold: 70},
      {x: 547, y: 1123  - adjY, r: 27, g: 192, b: 222 , match: true, threshold: 70},
      {x: 554, y: 1260  - adjY, r: 238, g: 186, b: 12, match: true, threshold: 70},
    ],
    back: {x: 576, y: 1336 - adjY},
    next: {x: 576, y: 1336 - adjY},
  },
  MyInfo: {
    name: 'MyInfo',
    colors: [
      {x: 734, y: 284  - adjY, r: 29 , g: 189, b: 223, match: true, threshold: 70},
      {x: 802, y: 381  - adjY, r: 241, g: 246, b: 240, match: true, threshold: 70},
      {x: 766, y: 1347 - adjY, r: 31 , g: 190, b: 222, match: true, threshold: 70},
      {x: 691, y: 1584 - adjY, r: 233, g: 175, b: 6  , match: true, threshold: 70},
    ],
    back: {x: 576, y: 1588 - adjY},
    next: {x: 576, y: 1588 - adjY},
  },
};

// Utils for Tsum

function printMaxScores(tsumMaxScores) {
  var str = "";
  for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
    str += i + ", " + tsumMaxScores[i].key + ", " + tsumMaxScores[i].score + "    ";
  }
  console.log(str);
}

function usingTimeString(startTime) {
  return 'usingTime: ' + (Date.now() - startTime);
}

function loadTsumImages(isJP) {
  var tsumImages = {};
  var tsumDir = isJP ? Config.tsumJpDir : Config.tsumDir;
  var tsumPath = getStoragePath() + '/' + tsumDir;
  var tsumFiles = isJP ? Config.tsumFilesJP : Config.tsumFiles;
  for (var i in tsumFiles) {
    var key = tsumFiles[i];
    var filename = tsumPath + '/' + key + '_0.png';
    var img = openImage(filename);
    smooth(img, 1, 2);
    tsumImages[key] = img;
  }
  return tsumImages;
}

function releaseTsumImages(tsumImages) {
  for (var k in tsumImages) {
    releaseImage(tsumImages[k]);
  }
}

function loadTsumRotationImages(tsumMaxScores, isJP, debug) {
  var tsumDir = isJP ? Config.tsumJpDir : Config.tsumDir;
  var tsumPath = getStoragePath() + '/' + tsumDir;
  for (var i = 0; i < Config.loadRotatedCount && i < tsumMaxScores.length; i++) {
    if (debug) {
      saveImage(tsumMaxScores[i].img, getStoragePath() + "/tmp/tsum" + i + ".jpg");
    }
  }
  for (var i = 0; i < Config.loadRotatedCount && i < tsumMaxScores.length; i++) {
    tsumMaxScores[i].rotations = [];
    var maxScore = tsumMaxScores[i];
    for (var r in Config.rotations) {
      var filename = tsumPath + '/' + maxScore.key + '_' + Config.rotations[r] + '.png';
      var img = openImage(filename);
      smooth(img, 1, 2);
      tsumMaxScores[i].rotations.push(img);
    }
  }
}

function adjustTable(k, myTsum) {
  if (k == myTsum) {
    return 1;
  }
  if (Config.scoreTable[k] != undefined) {
    return Config.scoreTable[k];
  }
  return 0;
}

function findAllTsumMatchScore(tsumImages, boardImg, myTsum) {
  var tsumMaxScores = [];
  for (var k in tsumImages) {
    var tsumImage = tsumImages[k];
    var xyScore = findImage(boardImg, tsumImage);
    xyScore.img = tsumImage; 
    xyScore.key = k;
    if (k == myTsum) {
      xyScore.score = 1;
    } else {
      xyScore.score += adjustTable(k, myTsum);
    }
    tsumMaxScores.push(xyScore);
  }
  tsumMaxScores.sort(function(a, b){
    return a.score > b.score ? -1 : 1;
  });
  return tsumMaxScores;
}

function removeSameTsumImages(tsumMaxScores, threshold) {
  for (var i = 0; i < tsumMaxScores.length; i++) {
    var erase = [];
    for (var j = 0; j < tsumMaxScores.length; j++) {
      if (i == j) {
        continue;
      }
      var imgI = tsumMaxScores[i].img;
      var imgJ = tsumMaxScores[j].img;
      var score = getIdentityScore(imgI, imgJ);
      if (score > threshold) {
        erase.push(j);
      }
    }
    for (var k = erase.length - 1; k >= 0; k--) {
      tsumMaxScores.splice(erase[k], 1);
    }
  }
  return tsumMaxScores;
}

function recognizeGameTsums(boardImg, allTsumImages, myTsum, isJP, debug) {
  // releaseRotationTsum();
  if (debug) {
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg.png");
  }
  var gameTsums = findAllTsumMatchScore(allTsumImages, boardImg, myTsum);
  gameTsums = gameTsums.splice(0, 50);
  console.log('total tsums', 'using tsums', gameTsums.length);
  if (debug) {
    printMaxScores(gameTsums);
  }
  // Remove same Tsums
  removeSameTsumImages(gameTsums, 0.88);
  console.log('after remove same tsums', gameTsums.length);
  if (debug) {
    printMaxScores(gameTsums);
  }
  
  loadTsumRotationImages(gameTsums, isJP, debug);
  // recheck first 5(4) tsums with rotation
  for (var i = 0; i < gameTsums.length && i < 8; i++) {
    for (var j = 0; j < gameTsums[i].rotations.length; j++) {
      var tsumImage = gameTsums[i].rotations[j];
      var xyScore = findImage(boardImg, tsumImage);
      if (xyScore.score > gameTsums[i].score) {
        gameTsums[i].score = xyScore.score;
      }
    }
  }
  gameTsums.sort(function(a, b){
    return a.score > b.score ? -1 : 1;
  });

  if (debug) {
    printMaxScores(gameTsums);
  }
  return gameTsums;
}

function releaseTsumRotationImages(tsumMaxScores) {
  for (var i = 0; i < Config.loadRotatedCount && i < tsumMaxScores.length; i++) {
    for (var r in tsumMaxScores[i].rotations) {
      releaseImage(tsumMaxScores[i].rotations[r]);
    }
  }
}

function recognizeBoard(boardImg, gameTsums, tsumCount, debug) {
  var startTime = Date.now();

  // 3700s => 1800s
  var multiTaskIds = [];
  var boardTsums = [];
  for (var i = 0; i < tsumCount && i < gameTsums.length; i++) {
    var ids = multiTasks(function(gameTsums, boardImg, idx) {
      // scope independent
      gameTsums = JSON.parse(gameTsums);
      var results = [];
      for (var j = 0; j < 8; j++) {
        var rotatedImage = gameTsums[idx].rotations[j];
        var scoreLimit = (gameTsums[idx].score - 0.5) * 0.75;
        var countLimit = (j == 0) ? 10 : 6;
        var result = findImages(boardImg, rotatedImage, scoreLimit, countLimit, true);
        results.push(result);
      }
      return results;
    }, JSON.stringify(gameTsums), boardImg, i);
    
    multiTaskIds.push(ids);
  }
  this.sleep(50);
  for (var i in multiTaskIds) {
    var resultss = waitTask(multiTaskIds[i]);
    for (var ks in resultss) {
      for (var k in resultss[ks]) {
        var result = resultss[ks][k];
        boardTsums.push({
          tsumIdx: i,
          // tsum: tsumMaxScores[i],
          x: result.x,
          y: result.y,
          score: result.score,
        });
      }
    }
  }

  boardTsums.sort(function(a, b){return a.score > b.score ? -1 : 1;});
  // console.log('finding all rotated tsum in board', boardTsums.length, usingTimeString(startTime));
  var board = [];
  for (var i in boardTsums) {
    var boardTsum = boardTsums[i];
    var isExist = false;
    for (var j in board) {
      var bt = board[j];
      if (boardTsum.x >= (bt.x - Config.tsumBoundW) && boardTsum.x < (bt.x + Config.tsumBoundW) && boardTsum.y >= (bt.y - Config.tsumBoundH) && boardTsum.y < (bt.y + Config.tsumBoundH)) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      board.push(boardTsum);
    }
  }
  log('辨識盤面Tsum成功數量', board.length, '費時', usingTimeString(startTime));
  // console.log('find tsums in board', board.length, usingTimeString(startTime));
  if (debug) {
    for (var i = 0; i < board.length; i++) {
      var boardTsum = board[i];
      drawCircle(boardImg, boardTsum.x + Config.tsumWidth/2, boardTsum.y + Config.tsumWidth/2, 1, Config.colors[boardTsum.tsumIdx][0], Config.colors[boardTsum.tsumIdx][1], Config.colors[boardTsum.tsumIdx][2], 0);
    }
  }
  return board;
}

function getDistance(t1, t2) {
  return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));
}

function findNearTsum(tsum, tsums) {
  var minDis = 99999;
  var minTsum = null;
  var idx = -1;
  for(var i in tsums) {
    var dis = getDistance(tsum, tsums[i]);
    if (dis < minDis) {
      minDis = dis;
      minTsum = tsums[i];
      idx = i;
    }
  }
  return {dis: minDis, tsum: minTsum, idx: idx};
}

function calculateNearTsumPaths(tsum, ts) {
  var path = [];
  var tsums = ts.slice(); // copy array
  while(true) {
    var result = findNearTsum(tsum, tsums);
    var minDis = result.dis;
    var minTsum = result.tsum;
    var minIdx = result.idx;
    if (minIdx == -1 || minDis > Config.tsumWidth * 2.8) {
      break;
    }
    tsum = minTsum;
    tsums.splice(minIdx, 1);
    path.push(tsum);
  }
  return path;
}

function calculatePathCenter(path) {
  var cx = 0;
  var cy = 0;
  for (var i in path) {
    cx += path[i].x;
    cy += path[i].y;
  }
  return {x: Math.floor(cx / path.length), y: Math.floor(cy / path.length)};
}

function calculatePaths(board) {
  var tsums = {};
  for (var i in board) {
    var tsum = board[i];
    if (tsums[tsum.tsumIdx] == undefined) {
      tsums[tsum.tsumIdx] = [];
    }
    tsums[tsum.tsumIdx].push(tsum);
  }

  var centers = {};
  var paths = [];
  
  for (var tsumIdx in tsums) {
    for (var i = 0; i < tsums[tsumIdx].length; i++) {
      var path = calculateNearTsumPaths(tsums[tsumIdx][i], tsums[tsumIdx]);
      if (path.length > 2) {
        var c = calculatePathCenter(path);
        if (centers[c.x] == c.y) {
          // path already exists
        } else {
          centers[c.x] = c.y;
          paths.push(path);
          // console.log(runTimes, tsumIdx, path.length, c.x, c.y, JSON.stringify(path));
        }
      } else {
        tsums[tsumIdx].splice(i, 1);
        i--;
      }
    }
  }

  paths.sort(function(a, b) {
    if (a.length < b.length) { return 1; }
    return -1;
  });
  log('計算出路徑', paths.length, '條');
  return paths;
}

// Tsum struct

function Tsum(isJP, detect) {
  this.debug = true;
  this.isRunning = true;
  this.myTsum = '';
  // screen size config
  var size = getScreenSize();
  this.screenHeight = size.height - getVirtualButtonHeight();
  this.screenWidth = size.width;
  this.gameOffsetX = 0;
  this.gameOffsetY = 0;
  this.gameHeight = 0;
  this.gameWidth = 0;
  this.resizeRatio = 3;
  this.captureGameRatio = 0;
  // playing game screen size config
  this.playOffsetX = 0;
  this.playOffsetY = 0;
  this.playHeight = 0;
  this.playWidth = 0;
  this.playResizeWidth = Config.screenResize;
  this.playResizeHeight = Config.screenResize;

  this.tsumCount = 5;
  this.isLoadAllTsum = false;
  this.isLoadRotateTsum = false;
  this.allTsumImages = {};
  this.gameTsums = [];
  this.isJP = isJP;
  this.isPause = true;
  this.receiveOneItem = false;
  this.sentToZero = false;
  this.recordReceive = true;
  this.enableAllItems = false;
  // record
  this.record = {};
  this.recordImages = {};
  this.receiveCheckLimit = 5;
  this.clearBubbles = true;
  this.init(detect);
}

Tsum.prototype.detect = function() {
  var size = getScreenSize();
  var img = getScreenshot();
  var top = 0;
  var bottom = size.height - getVirtualButtonHeight();
  for (var y = 0; y < size.height; y++) {
    var color = getImageColor(img, size.width - 2, y);
    if (!isSameColor({r: 0, g: 0, b: 0}, color, 5)) {
      top = y;
      break;
    }
  }
  for (var y = bottom - 1; y > 0; y--) {
    var color = getImageColor(img, size.width - 2, y);
    if (!isSameColor({r: 0, g: 0, b: 0}, color, 5)) {
      bottom = y+1;
      break;
    }
  }
  releaseImage(img);
  log('Detect top bottom', top, bottom);
  sleep(500);
  return {top: top, bottom: bottom};
}

Tsum.prototype.init = function(detect) {
  log('Init... calculate screen size');
  if (detect) {
    var topBottom = this.detect();
    var h = topBottom.bottom - topBottom.top;
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.gameWidth * 1.5;
    this.gameOffsetX = 0;
    this.gameOffsetY = topBottom.top + (h - this.gameHeight) / 2;
  } else if (this.screenHeight / this.screenWidth > 1.78) {
    // currently support for note 8
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.gameWidth * 1.5;
    var gameFullHeight = this.gameWidth * 1.84444;
    var gameMarginTop = (gameFullHeight - this.gameHeight) / 2;
    this.gameOffsetY = (this.screenHeight - gameFullHeight) + gameMarginTop;
  } else if (this.screenHeight / this.screenWidth > 1.5) {
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.gameWidth * 1.5;
    this.gameOffsetY = (this.screenHeight - this.gameHeight) / 2;
  } else {
    this.gameHeight = this.screenHeight;
    this.gameWidth = this.gameHeight / 1.5;
    this.gameOffsetX = (this.screenWidth - this.gameWidth) / 2;
  }
  this.captureGameRatio = Config.captureGameWidth / this.gameWidth;
  this.playWidth = this.gameWidth;
  this.playHeight = this.gameWidth;
  this.playOffsetX = this.gameOffsetX;
  this.playOffsetY = this.gameOffsetY + (this.gameHeight - this.playHeight) * 0.6;

  this.allTsumImages = loadTsumImages(this.isJP);
  this.isLoadAllTsum = true;

  if (this.debug) {
    log('Config', this);
    this.sleep(200);
    log('Game OffsetXY', this.gameOffsetX, this.gameOffsetY, this.screenHeight, this.screenWidth);
    this.sleep(1000);
  }
}

Tsum.prototype.deinit = function() {
  if (this.isLoadRotateTsum) {
    releaseTsumRotationImages(this.gameTsums);
  }
  releaseTsumImages(this.allTsumImages);
  this.allTsumImages = {};
  this.isLoadAllTsum = false;
}

Tsum.prototype.isAppOn = function() {
  var results = execute('dumpsys activity activities').split('mFocusedActivity');
  if (results.length < 2) {
    return true;
  }
  results = results[1].split(" ");
  if (results.length < 4) {
    return true;
  }
  var result = results[3].split("/");
  if (result.length < 2) {
    return true;
  }
  var packageName = result[0];
  var activityName = result[1];
  if (packageName.indexOf('LGTMTM') == -1) {
    return false;
  }
  return true;
};

Tsum.prototype.startApp = function() {
  log('Start TsumTsum App...');
  execute('am start -n com.linecorp.LGTMTM/.TsumTsum');
  this.sleep(1000);
  execute('am start -n com.linecorp.LGTMTMG/.TsumTsum');
  this.sleep(2000);
}

Tsum.prototype.screenshot = function() {
  return getScreenshotModify(
    this.gameOffsetX, 
    this.gameOffsetY, 
    this.gameWidth, 
    this.gameHeight, 
    this.gameWidth / this.resizeRatio, 
    this.gameHeight / this.resizeRatio,
    80
  );
}

Tsum.prototype.playScreenshot = function() {
  return getScreenshotModify(
    this.playOffsetX, 
    this.playOffsetY, 
    this.playWidth, 
    this.playHeight, 
    this.playResizeWidth, 
    this.playResizeHeight,
    100
  );
}

Tsum.prototype.toResizeXYs = function(xy) {
  return this.toResizeXY(xy.x, xy.y);
}

Tsum.prototype.toResizeXY = function(x, y) {
  var rx = Math.floor(x / this.resizeRatio / this.captureGameRatio);
  var ry = Math.floor(y / this.resizeRatio / this.captureGameRatio);
  return {x: rx, y: ry};
}

Tsum.prototype.getColor = function(img, xy) {
  var xy = this.toResizeXYs(xy);
  return getImageColor(img, xy.x, xy.y);
}

Tsum.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var x = this.gameOffsetX + (xy.x * this.gameWidth / 1080);
  var y = this.gameOffsetY + (xy.y * this.gameHeight / 1620);
  tap(Math.round(x), Math.round(y), during);
}

Tsum.prototype.tapDown = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var x = this.gameOffsetX + (xy.x * this.gameWidth / 1080);
  var y = this.gameOffsetY + (xy.y * this.gameHeight / 1620);
  tapDown(Math.round(x), Math.round(y), during);
}

Tsum.prototype.moveTo = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var x = this.gameOffsetX + (xy.x * this.gameWidth / 1080);
  var y = this.gameOffsetY + (xy.y * this.gameHeight / 1620);
  moveTo(Math.round(x), Math.round(y), during);
}

Tsum.prototype.tapUp = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var x = this.gameOffsetX + (xy.x * this.gameWidth / 1080);
  var y = this.gameOffsetY + (xy.y * this.gameHeight / 1620);
  tapUp(Math.round(x), Math.round(y), during);
}

Tsum.prototype.link = function(paths) {
  var isBubble = false;
  for (var i in paths) {
    var path = paths[i];
    if (path.length > 7) {
      isBubble = true;
    }
    for (var j in path) {
      var point = path[j];
      var x = Math.floor(this.playOffsetX + (point.x + Config.tsumWidth/2) * this.playWidth / this.playResizeWidth);
      var y = Math.floor(this.playOffsetY + (point.y + Config.tsumWidth/2) * this.playHeight / this.playResizeHeight);
      if (j == 0) {
        tapDown(x, y, 30);
      }
      moveTo(x, y, 30);
      // moveTo(x, y, 30);
      if (j == path.length - 1) {
        tapUp(x, y, 30);
      }
    }
  }
  return isBubble;
}

function adsColor(c1, v2) {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
}

Tsum.prototype.findPage = function(times, timeout) {
  if (times == undefined) {times = 2;}
  if (timeout == undefined) {timeout = 700;}
  var start = Date.now();
  while(this.isRunning) {
    for (var t = 0; t < times; t++) {
      var img = this.screenshot();
      for (var pageName in Page) {
        var page = Page[pageName];
        var currentPage = '';
        for (var i = 0; i < page.colors.length; i++) {
          var diff = absColor(page.colors[i], this.getColor(img, page.colors[i]));
          if (diff < page.colors[i].threshold && page.colors[i].match) {
            currentPage = pageName;
          } else if (diff >= threshold && !page.colors[i].match) {
            currentPage = pageName;
          } else {
            currentPage = '';
            break;
          }
        }
        if (currentPage != '') {
          break;
        }
      }
      releaseImage(img);
      this.sleep(100);
    } // for times
    if (currentPage != '') {
      return currentPage;
    }
    if (Date.now() - start > timeout) {
      return 'unknown';
    }
  }
}

Tsum.prototype.goFriendPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    var page = this.findPage(2, 1000);
    log('Current Page', page);
    if (page == 'FriendPage') {
      // check again
      page = this.findPage(1, 500);
      if (page == 'FriendPage') {
        return;
      }
    } else if (page == 'unknown') {
      this.tap(Button.gameQuestionCancel);
      this.tap(Button.gameQuestionCancel2);
      this.tap(Button.outClose);
      this.tap(Button.gameStop);
      this.sleep(500);
    } else {
      this.tap(Page[page].back);
    }
    this.sleep(1000);
  }
}

Tsum.prototype.goGamePlayingPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    var page = this.findPage(2, 3000);
    log('Current Page', page);
    if (page == 'FriendPage') {
      this.tap(Page[page].next);
    } else if (page == 'StartPage') {
      this.sleep(800);
      var img = this.screenshot();
      var outGameItem1 = isSameColor(Button.outGameItem1.color, this.getColor(img, Button.outGameItem1), 40);
      var outGameItem2 = isSameColor(Button.outGameItem2.color, this.getColor(img, Button.outGameItem2), 40);
      var outGameItem3 = isSameColor(Button.outGameItem3.color, this.getColor(img, Button.outGameItem3), 40);
      var outGameItem4 = isSameColor(Button.outGameItem4.color, this.getColor(img, Button.outGameItem4), 40);
      var outGameItem5 = isSameColor(Button.outGameItem5.color, this.getColor(img, Button.outGameItem5), 40);
      var outGameItem6 = isSameColor(Button.outGameItem6.color, this.getColor(img, Button.outGameItem6), 40);
      // log(this.getColor(img, Button.outGameItem1), this.getColor(img, Button.outGameItem2), this.getColor(img, Button.outGameItem3), this.getColor(img, Button.outGameItem4), this.getColor(img, Button.outGameItem5), this.getColor(img, Button.outGameItem6));
      releaseImage(img);
      if (this.enableAllItems) {
        if (outGameItem1) {this.tap(Button.outGameItem1);outGameItem1 = false; this.sleep(500);};
        if (outGameItem2) {this.tap(Button.outGameItem2);outGameItem2 = false; this.sleep(500);};
        if (outGameItem3) {this.tap(Button.outGameItem3);outGameItem3 = false; this.sleep(500);};
        if (outGameItem4) {this.tap(Button.outGameItem4);outGameItem4 = false; this.sleep(500);};
        if (outGameItem5) {this.tap(Button.outGameItem5);outGameItem5 = false; this.sleep(500);};
        if (outGameItem6) {this.tap(Button.outGameItem6);outGameItem6 = false; this.sleep(500);};
      } else {
        if (!outGameItem1) {this.tap(Button.outGameItem1);outGameItem1 = true; this.sleep(500);};
        if (!outGameItem2) {this.tap(Button.outGameItem2);outGameItem2 = true; this.sleep(500);};
        if (!outGameItem3) {this.tap(Button.outGameItem3);outGameItem3 = true; this.sleep(500);};
        if (!outGameItem4) {this.tap(Button.outGameItem4);outGameItem4 = true; this.sleep(500);};
        if (!outGameItem5) {this.tap(Button.outGameItem5);outGameItem5 = true; this.sleep(500);};
        if (!outGameItem6) {this.tap(Button.outGameItem6);outGameItem6 = true; this.sleep(500);};
      }
      if (this.tsumCount == 4) {
        if (outGameItem2) {this.tap(Button.outGameItem2); this.sleep(500);};
        if (outGameItem6) {this.tap(Button.outGameItem6); this.sleep(500);};
      }
      this.tap(Button.outStart2);
    } else if (page == 'GamePlaying') {
      // check again
      page = this.findPage(1, 500);
      if (page == 'GamePlaying') {
        return;
      }
    } else if (page == 'GamePause') {
      this.tap(Page[page].next);
    } else if (page == 'unknown') {
      this.tap(Button.gameQuestionCancel);
      this.tap(Button.gameQuestionCancel2);
      this.tap(Button.outClose);
      this.tap(Button.gameStop);
      this.sleep(500);
    } else {
      this.tap(Page[page].back);
    }
    this.sleep(1000);
  }
}

Tsum.prototype.findMyTsum = function() {
  var tsumSize = Config.tsumWidth * this.gameWidth / this.playResizeWidth;
  var myTsumImage = getScreenshotModify(
    this.playOffsetX + tsumSize,
    this.playOffsetY + this.playHeight,
    tsumSize * 1.7,
    tsumSize * 1.7,
    Config.tsumWidth * 2.1, 
    Config.tsumWidth * 2.1,
    100
  );
  smooth(myTsumImage, 1, 2);
  var allScores = findAllTsumMatchScore(this.allTsumImages, myTsumImage, '');
  if (this.debug) {
    saveImage(myTsumImage, getStoragePath() + "/tmp/mytsum.jpg");
  }
  releaseImage(myTsumImage);
  this.myTsum = allScores[0].key;
}

Tsum.prototype.useSkill = function() {
  var page = this.findPage(1, 500);
  if (page != 'GamePlaying' && page != 'GamePause') {
    return false;
  }
  for (var i = 0; i < 2; i++) {
    var img = this.screenshot();
    var isSkillOff1 = isSameColor(Button.gameSkillOff1.color, this.getColor(img, Button.gameSkillOff1), 60);
    var isSkillOff2 = isSameColor(Button.gameSkillOff2.color, this.getColor(img, Button.gameSkillOff2), 60);
    var isSkillOff3 = isSameColor(Button.gameSkillOff3.color, this.getColor(img, Button.gameSkillOff3), 60);
    var isSkillOff4 = isSameColor(Button.gameSkillOff4.color, this.getColor(img, Button.gameSkillOff4), 60);
    // log(isSkillOff1, isSkillOff2, isSkillOff3, this.getColor(img, Button.gameSkillOff1), this.getColor(img, Button.gameSkillOff2), this.getColor(img, Button.gameSkillOff3));
    releaseImage(img);
    if (!isSkillOff1 && !isSkillOff2 && !isSkillOff3 && !isSkillOff4) {
      if (i == 0) {
        this.sleep(200);
      }
    } else {
      return false;
    }
  }
  log('技能已經存滿，放技能');

  this.tap(Button.gameSkillOn);
  this.sleep(30);
  if (this.myTsum == 'block_lukej_s') {
    for (var i = 0; i < 5; i++) {
      this.tapDown({x: 820, y: 1200}, 20);
      this.moveTo({x: 820, y: 1150}, 20);
      if (i == 0) {
        this.sleep(1160);
      }
      this.sleep(350);
      this.moveTo({x: 825, y: 1000}, 20);
      this.sleep(100);
      this.moveTo({x: 835, y: 800}, 20);
      this.sleep(100);
      this.moveTo({x: 845, y: 600}, 20);
      this.sleep(100);
      this.moveTo({x: 850, y: 450}, 20);
      this.tapUp({x: 850, y: 420}, 20);
      this.sleep(20);
    }
    this.tap(Button.skillLuke1);
    this.sleep(800);
  } else if(this.myTsum == 'block_moana_s') {
    this.sleep(2500);
    log("Clear bubbles");
    for (var by = 1000; by <= 1300; by += 150) 
    {
      this.tap({x: 100, y: by}, 80);
      this.tap({x: 1000, y: by}, 80);
      this.tap({x: 250, y: by}, 80);
      this.tap({x: 750, y: by}, 80);
      this.tap({x: 400, y: by}, 80);
      this.tap({x: 600, y: by}, 80);
      this.tap({x: 450, y: by}, 80);
    }
    this.sleep(300);
  } else if (this.myTsum.search('block_donald') != -1) {
    for (var i = 0; i < 3; i++) {
      for (var bx = Button.gameBubblesFrom.x - 40; bx <= Button.gameBubblesTo.x + 40; bx += 150) {
        for (var by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y + 100; by += 150) {
          this.tap({x: bx, y: by}, 10);
        }
      }
    }
  } else {
    this.sleep(2500);
  }
  return true;
}

Tsum.prototype.taskPlayGame = function() {
  log('進入遊戲中...');
  this.goGamePlayingPage();
  log('遊戲中');
  this.sleep(500);
  this.findMyTsum();
  log('myTsum', this.myTsum);
  // this.sleep(500);
  // start to run
  var runTimes = 0;
  var pathZero = 0;
  var clearBubbles = 0;
  while(this.isRunning) {  
    // load game tsums
    var gameImage = this.playScreenshot();
    smooth(gameImage, 1, 2);
    if (this.isPause) {
      this.tap(Button.gamePause);
      this.sleep(20);
      this.tap(Button.gamePause);
    }
    if (!this.isLoadRotateTsum) {
      log('辨識Tsum種類');
      this.tap(Button.gamePause);
      this.gameTsums = recognizeGameTsums(gameImage, this.allTsumImages, this.myTsum, this.isJP, this.debug);
      this.isLoadRotateTsum = true;
      var page = this.findPage(2, 1000);
      if (page != 'GamePlaying' && page != 'GamePause') {
        log('遊戲結束');
        break;
      }
    }
    log('辨識盤面Tsum');
    var board = recognizeBoard(gameImage, this.gameTsums, this.tsumCount, this.debug);
    if (this.debug) {
      saveImage(gameImage, getStoragePath() + "/tmp/boardImg-" + runTimes + ".jpg");
    }
    releaseImage(gameImage);

    log('計算連線路徑');
    var paths = calculatePaths(board);
    
    this.tap(Button.gameContinue);
    if (this.isPause) {this.sleep(Config.gameContinueDelay / 2);}
    this.tap(Button.gameContinue);
    if (this.isPause) {this.sleep(Config.gameContinueDelay / 2);}

    if (paths.length < 2) {
      if (pathZero > 2) {
        pathZero = 0;
        log('路徑數量為 0, 重新辨識...');
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
        this.sleep(1000);
        releaseTsumRotationImages(this.gameTsums);
        this.gameTsums = [];
        this.isLoadRotateTsum = false;
        continue;
      }
      pathZero++;
    }

    log('開始連線 數量', paths.length);
    paths = paths.splice(0, 10);
    var isBubble = this.link(paths);
    if (isBubble) {
      log("產生泡泡");
      clearBubbles++;
    }

    // click bubbles
    if (this.clearBubbles && clearBubbles >= 2) {
      log("Clear bubbles");
      clearBubbles = 0;
      for (var bx = Button.gameBubblesFrom.x; bx <= Button.gameBubblesTo.x; bx += 140) {
        for (var by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y; by += 140) {
          this.tap({x: bx, y: by}, 10);
        }
      }
    }
    
    if (runTimes % 4 == 3) {
      this.tap(Button.gameRand, 100);
      this.tap(Button.gameRand, 100);
      this.sleep(700);
    }
    this.sleep(300);
    if (this.useSkill()) {
      clearBubbles++;
      if (this.useSkill()) {
        this.useSkill();
      }
    }

    // double check
    var page = this.findPage(1, 2500);
    if (page != 'GamePlaying' && page != 'GamePause') {
      this.sleep(500);
      page = this.findPage(1, 2500);
      if (page != 'GamePlaying' && page != 'GamePause') {
        log('遊戲結束');
        break;
      }
    }
    runTimes++;
  }
  releaseTsumRotationImages(this.gameTsums);
  this.gameTsums = [];
  this.isLoadRotateTsum = false;
  this.sleep(4000);
}

Tsum.prototype.taskReceiveAllItems = function() {
  log('前往朋友頁面');
  this.goFriendPage();
  this.sleep(1000);
  log('接收全部物品');
  this.tap(Button.outReceive);
  this.sleep(2500);
  this.tap(Button.outReceiveAll);
  this.sleep(1500);
  this.tap(Button.outReceiveOk);
  this.sleep(1500);
  this.tap(Button.outReceiveClose);
  this.sleep(1000);
  this.tap(Button.outClose);
  this.goFriendPage();
  log('接收物品完成');
}

Tsum.prototype.readRecord = function() {
  log("讀取紀錄");
  var recordDir = getStoragePath() + '/' + Config.recordDir;
  var recordFile = recordDir + '/record.txt';
  var txt = readFile(recordFile);
  if (txt != undefined && txt != "") {
    this.record = JSON.parse(txt);
  }
  for (var filename in this.record) {
    this.recordImages[filename] = openImage(recordDir + '/' + filename);
  }
}

Tsum.prototype.countReceiveHeart = function() {
  log("記錄誰送心");
  var recordDir = getStoragePath() + '/' + Config.recordDir;
  var from = this.toResizeXYs(Button.outReceiveNameFrom);
  var to = this.toResizeXYs(Button.outReceiveNameTo);
  var img = this.screenshot();

  // for speed up
  this.tap(Button.outReceiveOne);

  var nameImg = cropImage(img, Math.floor(from.x), Math.floor(from.y), Math.floor(to.x - from.x), Math.floor(to.y - from.y));
  var score = 0;
  var existFilename = '';
  for(var key in this.recordImages) {
    if (this.recordImages[key] != 0) {
      score = getIdentityScore(nameImg, this.recordImages[key]);
      if (score >= 0.98) {
        existFilename = key;
        log("score > 0.98", key, score);
        break;
      }
    }
  }
  console.log("Score: " + score);
  
  var dayTime = Math.floor(Date.now() / (24 * 60 * 60 * 1000)); 
  if (existFilename == '') {
    // not found, new friend
    var filename = 'f_' + Date.now() + '.png';
    this.record[filename] = {
      receiveCounts: {},
      lastReceiveTime: Date.now(),
    };
    this.record[filename].receiveCounts[dayTime] = 1;
    this.recordImages[filename] = nameImg;
    log('新朋友，儲存', recordDir + '/' + filename);
    saveImage(nameImg, recordDir + '/' + filename);
    saveImage(nameImg, recordDir + '/' + filename);
  } else {
    // found
    if (this.record[existFilename].lastReceiveTime == undefined || Date.now() - this.record[existFilename].lastReceiveTime > 2000) {
      if (this.record[existFilename].receiveCounts[dayTime] == undefined) {
        this.record[existFilename].receiveCounts[dayTime] = 0;
      }
      this.record[existFilename].receiveCounts[dayTime]++;
      this.record[existFilename].lastReceiveTime = Date.now();
      log('今天此人已經收到 ' + this.record[existFilename].receiveCounts[dayTime] + '顆');
    }
    releaseImage(nameImg);
  }
  releaseImage(img);
}

Tsum.prototype.saveRecord = function() {
  log("儲存紀錄");
  var recordFile = getStoragePath() + '/' + Config.recordDir + '/record.txt';
  writeFile(recordFile, JSON.stringify(this.record));
}

Tsum.prototype.releaseRecord = function() {
  for(var filename in this.recordImages) {
    releaseImage(this.recordImages[filename]);
  }
  this.record = {};
  this.recordImages = {};
}

Tsum.prototype.clear = function() {
  var recordDir = getStoragePath() + '/' + Config.recordDir;
  execute('rm -r ' + recordDir);
}

Tsum.prototype.isLoading = function() {
  var img = this.screenshot();
  var fx = Button.outIsLoading1.x;
  var fy = Button.outIsLoading1.y;
  var ty = Button.outIsLoading2.y;
  var whiteCount = 0;
  for (var y = fy; y <= ty; y+=10) {
    if (isSameColor(Button.outIsLoading1.color, this.getColor(img, {x: fx, y: y}), 30)) {
      whiteCount++;
    }
  }
  releaseImage(img);
  if (whiteCount >= 3) {
    return true;
  }
  return false;
}

Tsum.prototype.taskReceiveOneItem = function() {
  log('前往朋友頁面');
  this.goFriendPage();
  this.sleep(1000);
  log('一個一個接收物品');
  this.tap(Button.outReceive);
  this.sleep(2000);

  var unknownPage = 0;
  var receivedCount = 0;
  var nonItemCount = 0;
  var unknownCount = 0;
  var networkLoadingCount = 0;
  var receiveCheckLimit = 1;
  var isFinish = false;
  while (this.isRunning) {
    var img = this.screenshot();
    var isItem = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 35);
    var isNonItem = isSameColor(Button.outReceiveOne.color2, this.getColor(img, Button.outReceiveOne), 35);
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 35);
    var isTimeout = isSameColor(Button.outReceiveTimeout.color, this.getColor(img, Button.outReceiveTimeout), 35);
    releaseImage(img);
    if (isTimeout) {
      log('Try again... wait 2 sec');
      this.tap(Button.outReceiveOk);
      this.sleep(2000);
    } else if (isOk) {
      this.tap(Button.outReceiveOk);
      nonItemCount = 0;
      unknownCount = 0;
      networkLoadingCount = 0;
      this.sleep(500);
      isFinish = true;
    } else if (this.isLoading()) {
      log('Network delay...');
      networkLoadingCount++;
      if (networkLoadingCount > 20) {
        this.tap(Button.outReceiveOk);
        this.tap(Button.outStart1);
      }
      this.sleep(300);
    } else if (isItem) {
      if (!isFinish) {
        if (this.recordReceive) {
          this.countReceiveHeart();
          this.saveRecord();
        }
        this.tap(Button.outReceiveOne);
        receivedCount++;
        nonItemCount = 0;
        unknownCount = 0;
        networkLoadingCount = 0;
      }
      isFinish = false;
    } else if (isNonItem) {
      this.tap(Button.outReceiveOk);
      nonItemCount++;
      unknownCount = 0;
    } else {
      this.tap(Button.outReceiveOk);
      unknownCount++;
      isFinish = false;
    }
    this.sleep(500);
    if (unknownCount >= 8) {
      log('停在未知頁面太久，離開');
      this.tap(Button.outClose);
      this.goFriendPage();
      break;
    }
    if (nonItemCount >= 3) {
      this.tap(Button.outClose);
      this.goFriendPage();
      this.sleep(800);
      if (receivedCount == 0 || receiveCheckLimit >= this.receiveCheckLimit) {
        log('結束接收物品');
        break;
      } else {
        receiveCheckLimit++;
        log('檢查還有沒有物品');
        this.sleep(1000);
        receivedCount = 0;
        nonItemCount = 0;
        this.tap(Button.outReceive);
        this.sleep(2000);
      }
    }
  }
}

Tsum.prototype.taskSendHearts = function() {
  log('前往朋友頁面');
  this.goFriendPage();
  log('開始送愛心');
  this.sleep(1500);
  this.tapDown(Button.outSendHeart0, 100);
  this.moveTo(Button.outSendHeart0, 100);
  this.moveTo({x: Button.outSendHeart0.x, y: 150000}, 100);
  this.tapUp({x: Button.outSendHeart0.x, y: 150000}, 100);
  this.sleep(2000);

  var retry = 0;
  var times = 0;
  while(this.isRunning) {
    times++;
    if (times % 10 == 9) {
      this.goFriendPage();
    }
    var hfx = Button.outSendHeartFrom.x;
    var hfy = Button.outSendHeartFrom.y - 130;
    var hty = Button.outSendHeartTo.y + 60;
    var heartsPos = [];

    var img = this.screenshot();
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 40);
    for(var y = hfy; y <= hty; y += 9) {
      var isHs = isSameColor(Button.outSendHeart0.color, this.getColor(img, {x: hfx, y: y}), 40);  
      if (isHs) {
        heartsPos.push({x: hfx, y: y, color: Button.outSendHeart0.color, color2: Button.outSendHeart0.color2});
        y += 140;
      }
    }
    var isZero = true;
    var fx = Button.outFriendScoreFrom.x;
    var tx = Button.outFriendScoreTo.x;
    var sy = heartsPos.length == 0 ? Button.outFriendScoreFrom.y : (heartsPos[0].y + 35);
    for (var px = fx; px <= tx; px += 20) {
      isZero = isSameColor(Button.outFriendScoreFrom.color, this.getColor(img, {x: px, y: sy}), 40);
      if (!isZero) {
        break;
      }
    }
    var isNotEnd = isSameColor(Button.outSendHeartEnd2.color, this.getColor(img, Button.outSendHeartEnd2), 40);
    var isEnd = isSameColor(Button.outSendHeartEnd.color, this.getColor(img, Button.outSendHeartEnd), 40);
    isEnd = (!isNotEnd && isEnd);
    releaseImage(img);
    log("Send " + heartsPos.length + " hearts, 0 score?" + isZero + " End " + isEnd);

    if (isOk && heartsPos.length == 0) {
      this.tap(Button.outReceiveOk);
    }

    if ((heartsPos.length == 0 && isEnd) || (!this.sentToZero && isZero && heartsPos.length != 0)) {
      if(retry < 3){
        this.tapDown(Button.outSendHeart3, 50);
        this.moveTo (Button.outSendHeart3, 50);
        this.moveTo (Button.outSendHeart2, 50);
        this.moveTo (Button.outSendHeart1, 50);
        this.moveTo (Button.outSendHeart0, 50);
        this.moveTo (Button.outSendHeartTop, 500);
        this.tapUp  (Button.outSendHeartTop, 100);
        retry++;
        log("沒愛心可送或零分，再檢查次數: " + retry);
        this.sleep(500);
      } else {
        break;
      }
    } else {
      for (var h in heartsPos) {
        var success = this.sendHeart(heartsPos[h]);
        if (!success) {
          this.sendHeart(heartsPos[h]);
        }
        if (!this.isRunning) {
          return;
        }
      }
      this.sleep(100);
      this.tapDown(Button.outSendHeart3, 50);
      this.moveTo (Button.outSendHeart3, 50);
      this.moveTo (Button.outSendHeart2, 50);
      this.moveTo (Button.outSendHeart1, 50);
      this.moveTo (Button.outSendHeart0, 50);
      this.moveTo (Button.outSendHeartTop, 500);
      this.tapUp  (Button.outSendHeartTop, 100);

      this.sleep(300);
      if (heartsPos.length == 0) {
        this.sleep(700); // end bug
      }
    }
  }
}

Tsum.prototype.sendHeart = function(btn) {
  this.tap(btn);
  this.sleep(300);
  var unknownCount = 0;
  var isSent = 0;
  var isClickedOk = false;
  while (this.isRunning) {
    var img = this.screenshot();
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 40);
    var isSend = isSameColor(btn.color, this.getColor(img, btn), 40);
    var isSent1 = isSameColor(btn.color2, this.getColor(img, btn), 40);
    var isClose = isSameColor(Button.outSendHeartClose.color, this.getColor(img, Button.outSendHeartClose), 40);
    releaseImage(img);
    
    if (isSend) {
      this.tap(btn);
      this.sleep(300);
    } else if (isOk) {
      this.tap(Button.outReceiveOk);
      isClickedOk = true;
    } else if (isSent1 && isClickedOk) {
      isSent++;
      if (isSent >= 2) {
        return true;
      }
    } else if (isClose) {
      this.tap(Button.outSendHeartClose);
    } else {
      this.tap(Button.outSendHeartClose);
      unknownCount++;
    }
    if (unknownCount >= 10) {
      log("未知狀態，離開");
      return false;
    }
    this.sleep(100);
  }
}

Tsum.prototype.sleep = function(t) {
  if (t == undefined) {
    t = 1000;
  }
  var waitTime = t;
  while(this.isRunning) {
    if (waitTime <= 500) {
      sleep(waitTime);
      break;
    } else {
      sleep(500);
      waitTime -= 500;
    }
  }
}

var ts;
var gTaskController;

function start(isJP, debug, isPause, isFourTsum, autoPlay, clearBubbles, largeImage, enableAllItems, detect, receiveItem, receiveItemInterval, receiveOneItem, receiveOneItemInterval, receiveCheckLimit, recordReceive, sendHearts, sendHeartsInterval, sentToZero) {
  log('[Tsum Tsum] 啟動');
  ts = new Tsum(isJP, detect);
  ts.debug = debug;
  if (isFourTsum) {
    ts.tsumCount = 4;
  }
  ts.isPause = isPause;
  ts.receiveOneItem = receiveOneItem;
  ts.recordReceive = recordReceive;
  ts.sentToZero = sentToZero;
  ts.receiveCheckLimit = receiveCheckLimit;
  ts.clearBubbles = clearBubbles;
  ts.enableAllItems = enableAllItems;
  if (largeImage) {
    ts.resizeRatio = 1;
  }

  if (ts.recordReceive) {
    ts.readRecord();
  }

  gTaskController = new TaskController();
  if(receiveOneItem){gTaskController.newTask('receiveOneItem', ts.taskReceiveOneItem.bind(ts), receiveOneItemInterval * 60 * 1000, 0);}
  if(receiveItem){gTaskController.newTask('receiveItems', ts.taskReceiveAllItems.bind(ts), receiveItemInterval * 60 * 1000, 0);}
  if(sendHearts){gTaskController.newTask('sendHearts', ts.taskSendHearts.bind(ts), sendHeartsInterval * 60 * 1000, 0);}
  if(autoPlay){gTaskController.newTask('taskPlayGame', ts.taskPlayGame.bind(ts), 3 * 1000, 0);}
  sleep(500);
  gTaskController.start();
  // loop stop here...
  log('清除殘留記憶體...');
  ts.deinit();
  if (ts.recordReceive) {
    ts.releaseRecord();
  }
  ts = undefined;
  log("TaskController finish...");
}

function stop() {
  if (ts != undefined) {
    ts.isRunning = false;
    sleep(1000);
  }
  if (gTaskController != undefined) {gTaskController.removeAllTasks();}
  if (gTaskController != undefined) {gTaskController.stop();}
  log("Stop finish...");
  sleep(2000);
}

// stop();
// this.sleep(500);
// ts = new Tsum(false, true);
// log(ts.findPage(2, 1000));
// ts.detect();
// ts.goGamePlayingPage();
// ts.sentToZero = true;
// ts.taskSendHearts();
// ts.taskReceiveOneItem();
// ts.isPause = false;
// ts.clearBubbles = false;
// ts.taskPlayGame();
// ts.taskReceiveAllItems();
// sleep(10);
// console.log(page);
// ts.goFriendPage();
// ts.recordReceive = true;
// ts.sentToZero = true;
// ts.readRecord();
// ts.taskSendHearts();
// ts.goFriendPage();
// start(true, false, false, false, false, false, true, true);
// stop();