importJS("TaskController-0.0.1");

var ts;
var gTaskController;

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

function nowTime() {
  var offset = (new Date().getTimezoneOffset()) * 60 * 1000;
  return Date.now() + offset;
}

function log() {
  sleep(10);
  var args = [];
  if (ts != undefined && ts.showHeartLog && ts.record && ts.record['hearts_count']) {
    var msg = "";
    msg += "R:"+ts.record['hearts_count'].receivedCount+" ";
    msg += "S:"+ts.record['hearts_count'].sentCount;
    if (gTaskController != undefined && gTaskController.tasks != undefined) {
      var sendTask = gTaskController.tasks["sendHearts"];
      if (sendTask != undefined) {
        if (sendTask.lastRunTime == 0) {
          msg += "/0";
        } else {
          var next = (nowTime() - (sendTask.lastRunTime + sendTask.interval)) / 60000;
          msg += "/" + (+next.toFixed(0));
        }
      }
    }
    if (msg != "") {
      args.push("["+msg+"]");
    }
  }
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      arguments[i] = JSON.stringify(arguments[i]);
    }
    args.push(arguments[i]);
  }
  console.log.apply(console, args);
}

// ============================TSUM=============================== //

var Config = {
  recordDir: 'tsum_record',
  tsumDir: 'scripts/com.r2studio.Tsum/tsums_16',
  tsumJpDir: 'scripts/com.r2studio.Tsum/tsums_jp_16',
  tsumWidth: 16,
  tsumBoundW: 13, // tsumWidth / 2 + 2
  tsumBoundH: 13,
  screenResize: 200,
  loadRotatedCount: 10,
  tsumFiles: ["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_annac_s", "block_annaf_s", "block_anna_s", "block_arielr_s", "block_ariel_s", "block_arlo_s", "block_aurora_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_baymaxx_s", "block_bb8_s", "block_beastl_s", "block_beast_s", "block_bellel_s", "block_belle_s", "block_bluefairy_s", "block_boogie_s", "block_brerrabbit_s", "block_buzz_s", "block_c3po_s", "block_carl_s", "block_charming_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chip_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_claricepi_s", "block_clarice_s", "block_cruella_s", "block_crush_s", "block_daisyn_s", "block_daisy_s", "block_daisyv_s", "block_daisyx_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_dale_s", "block_davyjones_s", "block_deathtrooper_s", "block_donaldhtskill_s", "block_donaldht_s", "block_donaldn_s", "block_donald_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx2_s", "block_donaldx_s", "block_dory_s", "block_drossel_s", "block_dumbo_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsac_s", "block_elsaf_s", "block_elsa_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_finnick_s", "block_flounder_s", "block_flynn_s", "block_gaston_s", "block_genie_s", "block_goofyh2016_s", "block_goofyht_s", "block_goofy_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_hunnypot_s", "block_jacksparrow2_s", "block_jacksparrow_s", "block_jack_s", "block_jackx_s", "block_jafar_s", "block_jailerdog_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen2_s", "block_littlegreenmen_s", "block_lotso_s", "block_lukej_s", "block_luke_s", "block_lumiere_s", "block_lumpy_s", "block_madhatterj_s", "block_madhatter_s", "block_maleficentd_s", "block_maleficent_s", "block_marchhare_s", "block_marie_s", "block_mariex_s", "block_mater_s", "block_maui_s", "block_maximus_s", "block_max_s", "block_mcqueen_s", "block_megara_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeypi_s", "block_mickeyp_s", "block_mickey_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_mike_s", "block_mikeu_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh2017_s", "block_minnieh_s", "block_minnie_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_mulan_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_oswald_s", "block_oswaldsp_s", "block_owl_s", "block_pascal_s", "block_patch_s", "block_perry_s", "block_peteb_s", "block_peterpan_s", "block_pete_s", "block_phillip2_s", "block_phillip_s", "block_piglet2_s", "block_piglet_s", "block_ping_s", "block_pinocchio_s", "block_plutoh2015_s", "block_pluto_s", "block_plutox_s", "block_pocahontas_s", "block_pooh2_s", "block_poohr_s", "block_pooh_s", "block_potts_s", "block_prince_s", "block_pudding_s", "block_puffy_s", "block_pumpkinking_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_ramirez_s", "block_randall_s", "block_rapunzel2_s", "block_rapunzelb_s", "block_rapunzel_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_salazar_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite2_s", "block_snowwhite_s", "block_soraht_s", "block_sora_s", "block_souffle_s", "block_stitchf_s", "block_stitchh_s", "block_stitchpi_s", "block_stitch_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tiggerr_s", "block_tigger_s", "block_timothy_s", "block_tinkerbellp_s", "block_tinkerbell_s", "block_tramp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_walle_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_woody_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s"],
  tsumFilesJP: ["block_abu_s", "block_aladdin_s", "block_aladdinsp_s", "block_alice2_s", "block_alice_s", "block_angel_s", "block_annac_s", "block_annaf_s", "block_anna_s", "block_arielr_s", "block_ariel_s", "block_arlo_s", "block_aurora_s", "block_auroraw_s", "block_bambi_s", "block_baymax2_s", "block_baymax_s", "block_baymaxx_s", "block_bb8_s", "block_beastl_s", "block_beast_s", "block_bellel_s", "block_belle_s", "block_bellew_s", "block_bigbadwolf_s", "block_bluefairy_s", "block_boogie_s", "block_brerrabbit_s", "block_buzz2_s", "block_buzz_s", "block_c3po_s", "block_carl_s", "block_charming_s", "block_chernabog_s", "block_cheshirecat_s", "block_chewbacca_s", "block_chipcl_s", "block_chiph2015_s", "block_chiph2015sp_s", "block_chipj_s", "block_chip_s", "block_chips_s", "block_cinderella_s", "block_cinderellasp_s", "block_cinderellaw_s", "block_claricepi_s", "block_clarice_s", "block_cogsworth_s", "block_cruella_s", "block_crush_s", "block_daisyn_s", "block_daisy_s", "block_daisyv_s", "block_daisyx_s", "block_dalecl_s", "block_daleh2015_s", "block_daleh2015sp_s", "block_dalej_s", "block_dale_s", "block_davyjones_s", "block_deathtrooper_s", "block_donaldhtskill_s", "block_donaldht_s", "block_donaldn_s", "block_donald_s", "block_donaldt_s", "block_donaldv_s", "block_donaldx2_s", "block_donaldx_s", "block_dory_s", "block_drossel_s", "block_dumbo_s", "block_eeyore_s", "block_elizabethswann_s", "block_elsac_s", "block_elsaf_s", "block_elsa_s", "block_eric_s", "block_evilqueen_s", "block_fairygodmother_s", "block_fiddlerpig_s", "block_fiferpig_s", "block_finnick_s", "block_flounder_s", "block_flynn_s", "block_gaston_s", "block_genie_s", "block_goofyh2016_s", "block_goofyht_s", "block_goofy_s", "block_goofyt_s", "block_goofyx_s", "block_hades_s", "block_hansolo_s", "block_hercules_s", "block_hiro_s", "block_hook_s", "block_hpooh_s", "block_hunnypot_s", "block_jacksparrow2_s", "block_jacksparrow_s", "block_jack_s", "block_jackx_s", "block_jafar_s", "block_jailerdog_s", "block_jasmine_s", "block_jessie_s", "block_jiminy_s", "block_judy_s", "block_k2so_s", "block_kyloren_s", "block_lady_s", "block_leia_s", "block_lilo_s", "block_littlegreenmen2_s", "block_littlegreenmen_s", "block_lotso_s", "block_lukej_s", "block_luke_s", "block_lumiere_s", "block_lumpy_s", "block_madhatterj_s", "block_madhatter_s", "block_maleficentd_s", "block_maleficent_s", "block_marchhare_s", "block_marie_s", "block_mariex_s", "block_mater_s", "block_maui_s", "block_maximus_s", "block_max_s", "block_mcqueen_s", "block_megara_s", "block_mickeyb_s", "block_mickeyc_s", "block_mickeye_s", "block_mickeyf_s", "block_mickeyh2015_s", "block_mickeyh_s", "block_mickeypi_s", "block_mickeyp_s", "block_mickey_s", "block_mickeys_s", "block_mickeyt_s", "block_mickeyv_s", "block_mickeyx_s", "block_miguel_s", "block_mike_s", "block_mikeu_s", "block_minnieb_s", "block_minnieh2015_s", "block_minnieh2017_s", "block_minnieh_s", "block_minnie_s", "block_minniet_s", "block_minniev_s", "block_minniex_s", "block_missbunny_s", "block_moana_s", "block_mocha_s", "block_mowgli_s", "block_mulan_s", "block_nala_s", "block_nemo_s", "block_nick_s", "block_olaf_s", "block_olafs_s", "block_olafx_s", "block_oswald_s", "block_oswaldsp_s", "block_owl_s", "block_pascal_s", "block_patch_s", "block_perry_s", "block_peteb_s", "block_peterpan_s", "block_pete_s", "block_phillip2_s", "block_phillip_s", "block_piglet2_s", "block_piglet_s", "block_ping_s", "block_pinocchio_s", "block_plutoh2015_s", "block_pluto_s", "block_plutox_s", "block_pocahontas_s", "block_pooh2_s", "block_poohr_s", "block_pooh_s", "block_potts_s", "block_practicalpig_s", "block_prince_s", "block_pudding_s", "block_puffy_s", "block_pumpkinking_s", "block_queenofhearts_s", "block_r2d2_s", "block_rabbit_s", "block_ramirez_s", "block_randall_s", "block_rapunzel2_s", "block_rapunzelb_s", "block_rapunzel_s", "block_rex_s", "block_rey_s", "block_riku_s", "block_robin_s", "block_roo_s", "block_salazar_s", "block_sallynbc_s", "block_scar_s", "block_scramp_s", "block_scrooge_s", "block_scuttle_s", "block_sebastian_s", "block_simba_s", "block_snowwhite2_s", "block_snowwhite_s", "block_soraht_s", "block_sora_s", "block_souffle_s", "block_stitchf_s", "block_stitchh_s", "block_stitchpi_s", "block_stitch_s", "block_stormtrooper_s", "block_sulley_s", "block_sven_s", "block_thumper_s", "block_tiggerr_s", "block_tigger_s", "block_timothy_s", "block_tinkerbellp_s", "block_tinkerbell_s", "block_tramp_s", "block_triton_s", "block_troll_s", "block_ursula_s", "block_vader_s", "block_walle_s", "block_whip_s", "block_whiterabbit_s", "block_willturner_s", "block_woody2_s", "block_woody_s", "block_yensid_s", "block_yoda_s", "block_youngoyster_s", "block_zazu_s", "block_zero_s", "block_zurg_s"],
  rotations: ['0', '45', '90', '135', '180', '225', '270', '315'],
  gameContinueDelay: 400,
  colors: [[255,0,0], [0,255,0], [0,0,255], [0,255,255], [255,0,255]],
  scoreTable: {
    block_kyloren_s: 0.02,
    // block_sulley_s: -0.02,
    block_arlo_s: 0.02,
    block_mcqueen_s: 0.01,
    block_dory_s: 0.01,
    block_maui_s: 0.005,
  },
};

// 1776 * 1920 (y - 78)
var adjY = 72;
var Button = {
  gameBubblesFrom: {x: 100, y: 560 + adjY},
  gameBubblesTo: {x: 1000, y: 1460 + adjY},
  gameMyTsum: {x: 100, y: 1450 + adjY},
  gameQuestionCancel: {x: 400, y: 1280 + adjY},
  gameQuestionCancel2: {x: 400, y: 1000 + adjY},
  gameStop: {x: 440, y: 1000 + adjY},
  gameSkillOn: {x: 160, y: 1490 + adjY, color: {"a":0,"b":0,"g":220,"r":238}},
  gameSkillOff1: {x: 160, y: 1630 + adjY, color: {"a":0,"b":157,"g":112,"r":85}},
  gameSkillOff2: {x: 160, y: 1630 + adjY, color: {"a":0,"b":181,"g":139,"r":72}},
  gameSkillOff3: {x: 160, y: 1630 + adjY, color: {"a":0,"b":128,"g":73,"r":16}},
  gameSkillOff4: {x: 160, y: 1630 + adjY, color: {"a":0,"b":178,"g":153,"r":3}},
  gameRand: {x: 985, y: 1580 + adjY, color: {"a":0,"b":6,"g":180,"r":232}},
  gamePause: {x: 983, y: 250 + adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue: {x: 540, y: 1270 + adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameContinue1: {x: 461, y: 980 + adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameContinue2: {x: 911, y: 980 + adjY, color: {"a":0,"b":9,"g":188,"r":239}},
  gameMagicalTime1: {x: 320, y: 1255 + adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime2: {x: 750, y: 1255 + adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime3: {x: 320, y: 1130 + adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  gameMagicalTime4: {x: 750, y: 1130 + adjY, color: {"a":0,"b":13,"g":175,"r":240}},
  outGameItems: [{x: 205, y: 817 + adjY},{x: 435, y: 821 + adjY},{x: 651, y: 817 + adjY},{x: 871, y: 821 + adjY},{x: 201, y: 1095 + adjY},{x: 424, y: 1098 + adjY}],
  outGameEnd: {x: 890, y: 1520 + adjY, color: {"a":0,"b":15,"g":140,"r":245}},
  outStart1: {x: 500, y: 1520 + adjY, color: {"a":0,"b":19,"g":145,"r":247}}, // 開始遊戲
  outStart2: {x: 500, y: 1520 + adjY, color: {"a":0,"b":129,"g":111,"r":236}}, // 開始
  outClose: {x: 500, y: 1520 + adjY, color: {"a":0,"b":7,"g":180,"r":236}}, // 關閉
  outClose2: {x: 300, y: 1520 + adjY}, // 關閉
  outReceive: {x: 910, y: 350 + adjY},
  outReceiveAll: {x: 800, y: 1350 + adjY},
  outReceiveOk: {x: 835, y: 1020 + adjY, color: {"a":0,"b":6,"g":175,"r":236}},
  outReceiveClose: {x: 530, y: 1300 + adjY},
  outReceiveOne: {x: 840, y: 497 + adjY, color: {"a":0,"b":30,"g":181,"r":235}, color2: {"a":0,"b":119,"g":74,"r":40}},
  outReceiveOneHeart: {x: 290, y: 585 + adjY, color: {"a":0,"b":146,"g":65,"r":214}},
  outReceiveOneCoin: {x: 291, y: 579 + adjY, color: {r: 232, g: 229, b: 38}},
  outReceiveOneRuby: {x: 295, y: 579 + adjY, color: {r: 224, g: 93, b: 101}}, // ruby
  outReceiveOneAd: { x: 290, y: 812 - 140, color: { r: 90, g: 57, b: 25 } }, // ad
  outReceiveOneTicket1: {x: 298, y: 569 + adjY, color: {r: 125, g: 188, b: 177}}, // green
  outReceiveOneTicket2: {x: 316, y: 576 + adjY, color: {r: 248, g: 255, b: 253}}, // white
  outIsLoading1: {x: 540, y: 720 + adjY, color: {"a":0,"b":255,"g":255,"r":255}},
  outIsLoading2: {x: 540, y: 910 + adjY, color: {"a":0,"b":255,"g":255,"r":255}},
  outReceiveTimeout: {x: 600, y: 1020 + adjY, color: {"a":0,"b":11,"g":171,"r":235}},
  outDisconnected: {x:  147, y: 1008 + adjY, color: {r: 243, g: 89, b: 117}},
  outSendHeartTop: {x: 910, y: 430 + adjY},
  outSendHeart0: {x: 910, y: 626 + adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart1: {x: 910, y: 823 + adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart2: {x: 910, y: 1030 + adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeart3: {x: 910, y: 1232 + adjY, color: {"a":0,"b":142,"g":60,"r":209}, color2: {"a":0,"b":140,"g":65,"r":3}},
  outSendHeartClose: {x: 666, y: 1354 + adjY, color: {r: 236, g: 178, b: 9}},
  outSendHeartFrom: {x: 910, y: 530 + adjY},
  outSendHeartTo: {x: 910, y: 1250 + adjY},
  outSendHeartEnd: {x: 328, y: 1194 + adjY, color: {"a":0,"b":132,"g":85,"r":47}},
  outSendHeartEnd2: {x: 227, y: 1190 + adjY, color: {"a":0,"b":123,"g":78,"r":44}},
  outSendHeartEnd3: {x: 316, y: 1152 + adjY, color: {r: 55, g: 91, b: 139}},
  outFriendScoreFrom: {x: 550, y: 863 + adjY, color: {"a":0,"b":140,"g":93,"r":55}},
  outFriendScoreTo: {x: 760, y: 863 + adjY},
  skillLuke1: {x: 1000, y: 1300 + adjY},
  skillLuke2: {x: 830, y: 1330 + adjY},
  skillLuke3: {x: 670, y: 1375 + adjY},
  skillLuke4: {x: 960, y: 1160 + adjY},
  outReceiveNameFrom: {x: 160, y: 460 + adjY},
  outReceiveNameTo: {x: 620, y: 555 + adjY},
  moneyInfoBox: {x: 430, y: 116 + adjY, w: 230, h: 56},
};

var Page = {
  TodayMission: {
    name: 'TodayMission',
    colors: [
      {x: 540, y: 1408 + adjY, r: 238, g: 181, b: 12 , match: true, threshold: 80},
      {x: 975, y: 428  + adjY, r: 161, g: 224, b: 231, match: true, threshold: 80},
      {x: 554, y: 1260 + adjY, r: 24 , g: 189, b: 219, match: true, threshold: 80},
    ],
    back: {x: 558, y: 1473},
    next: {x: 558, y: 1473},
  },
  ScorePage: {
    name: 'ScorePage',
    colors: [
      {x: 302, y: 1509 + adjY, r: 235, g: 184, b: 7  , match: true, threshold: 80},
      {x: 777, y: 1516 + adjY, r: 248, g: 142, b: 20 , match: true, threshold: 80},
      {x: 774, y: 428  + adjY, r: 243, g: 248, b: 242, match: true, threshold: 80},
    ],
    back: {x: 309, y: 1581 + adjY},
    next: {x: 784, y: 1581 + adjY},
  },
  FriendPage: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1520 + adjY, r: 246, g: 135, b: 17 , match: true, threshold: 80}, // top of the start button
      {x: 187, y: 1527 + adjY, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1581 + adjY, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 392  + adjY, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
    ],
    back: {x: 547, y: 1581 + adjY},
    next: {x: 547, y: 1581 + adjY},
  },
  FriendPage2: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1577 + adjY, r: 175, g: 188, b: 197, match: true, threshold: 80}, // center of the Tsum Hades
      {x: 187, y: 1527 + adjY, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1581 + adjY, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 392  + adjY, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
    ],
    back: {x: 547, y: 1581 + adjY},
    next: {x: 547, y: 1581 + adjY},
  },
  FriendPage3: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1577 + adjY, r: 203, g: 192, b: 237, match: true, threshold: 80}, // center of the Tsum Ursula
      {x: 187, y: 1527 + adjY, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1581 + adjY, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 392  + adjY, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
    ],
    back: {x: 547, y: 1581 + adjY},
    next: {x: 547, y: 1581 + adjY},
  },
  FriendPage4: {
    name: 'FriendPage',
    colors: [
      {x: 540, y: 1577 + adjY, r: 79 , g: 89 , b: 94 , match: true, threshold: 80}, // center of the Tsum Maleficentd
      {x: 187, y: 1527 + adjY, r: 240, g: 218, b: 72 , match: true, threshold: 80}, // top of the card button
      {x: 799, y: 1581 + adjY, r: 232, g: 170, b: 7  , match: true, threshold: 80}, // left of the myTsum button
      {x: 698, y: 392  + adjY, r: 244, g: 249, b: 243, match: true, threshold: 80}, // left top of the ranking time
    ],
    back: {x: 547, y: 1581 + adjY},
    next: {x: 547, y: 1581 + adjY},
  },
  GiftHeart: {
    name: 'GiftHeart',
    colors: [
      {x: 216, y: 1012 + adjY, r: 233, g: 172, b: 6  , match: true, threshold: 80},
      {x: 673, y: 1008 + adjY, r: 235, g: 174, b: 8  , match: true, threshold: 80},
      {x: 468, y: 731  + adjY, r: 214, g: 61 , b: 143, match: true, threshold: 100},
      {x: 572, y: 489  + adjY, r: 30 , g: 193, b: 224, match: true, threshold: 80},
      {x: 583, y: 1123 + adjY, r: 28 , g: 186, b: 221, match: true, threshold: 80},
    ],
    back: {x: 774, y: 1023 + adjY},
    next: {x: 320, y: 1019 + adjY},
  },
  MailBox: {
    name: 'MailBox',
    colors: [
      {x: 738, y: 342  + adjY, r: 240, g: 245, b: 239, match: true, threshold: 80},
      {x: 550, y: 1509 + adjY, r: 238, g: 187, b: 10 , match: true, threshold: 80},
      {x: 604, y: 1347 + adjY, r: 234, g: 171, b: 6  , match: true, threshold: 80},
    ],
    back: {x: 561, y: 1581 + adjY},
    next: {x: 561, y: 1581 + adjY},
  },
  MailBox2: {
    name: 'MailBox',
    colors: [
      {x: 738, y: 342  + adjY, r: 240, g: 245, b: 239, match: true, threshold: 80},
      {x: 550, y: 1509 + adjY, r: 238, g: 187, b: 10 , match: true, threshold: 80},
      {x: 619, y: 1354 + adjY, r: 19 , g: 137, b: 175, match: true, threshold: 80},
    ],
    back: {x: 561, y: 1581 + adjY},
    next: {x: 561, y: 1581 + adjY},
  },
  ReceiveHeart: {
    name: 'ReceiveHeart',
    colors: [
      {x: 208, y: 1008 + adjY, r: 233, g: 172, b: 6  , match: true, threshold: 80},
      {x: 662, y: 1008 + adjY, r: 232, g: 171, b: 5  , match: true, threshold: 80},
      {x: 561, y: 482  + adjY, r: 28 , g: 191, b: 222, match: true, threshold: 80},
      {x: 565, y: 1138 + adjY, r: 30 , g: 195, b: 225, match: true, threshold: 80},
      {x: 334, y: 745  + adjY, r: 213, g: 62 , b: 143, match: true, threshold: 90},
      {x: 586, y: 749  + adjY, r: 248, g: 249, b: 51 , match: true, threshold: 100},
    ],
    back: {x: 774, y: 1023 + adjY},
    next: {x: 320, y: 1019 + adjY},
  },
  Received: {
    name: 'Received',
    colors: [
      {x: 799, y: 644 + adjY, r: 30, g: 188, b: 223, match: true, threshold: 80},
      {x: 806, y: 817 + adjY, r: 45, g: 80 , b: 122, match: true, threshold: 80},
      {x: 799, y: 976 + adjY, r: 27, g: 188, b: 217, match: true, threshold: 80},
    ],
    back: {x: 774, y: 1023 + adjY},
    next: {x: 320, y: 1019 + adjY},
  },
  Received2: {
    name: 'Received',
    colors: [
      {x: 799, y: 644 + adjY, r: 30, g: 188, b: 223, match: true, threshold: 80},
      {x: 889, y: 752 + adjY, r: 40, g: 72 , b: 111, match: true, threshold: 80},
      {x: 799, y: 976 + adjY, r: 27, g: 188, b: 217, match: true, threshold: 80},
    ],
    back: {x: 774, y: 1023 + adjY},
    next: {x: 320, y: 1019 + adjY},
  },
  StartPage: {
    name: 'StartPage',
    colors: [
      {x: 752, y: 399  + adjY, r: 244, g: 249, b: 243, match: true, threshold: 80},
      {x: 856, y: 1358 + adjY, r: 30 , g: 193, b: 224, match: true, threshold: 80},
      {x: 169, y: 1509 + adjY, r: 239, g: 188, b: 11 , match: true, threshold: 80},
      {x: 547, y: 1509 + adjY, r: 235, g: 118, b: 134, match: true, threshold: 80},
      {x: 792, y: 1588 + adjY, r: 234, g: 171, b: 8  , match: true, threshold: 100},
    ],
    back: {x: 190, y: 1574 + adjY},
    next: {x: 558, y: 1563 + adjY},
  },
  StartPage2: {
    name: 'StartPage',
    colors: [
      {x: 820,  y: 443  + adjY, r: 245, g: 250, b: 244, match: true, threshold: 80},
      {x: 954,  y: 1354 + adjY, r: 31 , g: 190, b: 220, match: true, threshold: 80},
      {x: 180,  y: 1512 + adjY, r: 235, g: 182, b: 8  , match: true, threshold: 80},
      {x: 540,  y: 1512 + adjY, r: 238, g: 115, b: 133, match: true, threshold: 80},
      {x: 1011, y: 1603 + adjY, r: 229, g: 166, b: 11 , match: true, threshold: 100},
    ],
    back: {x: 190, y: 1574 + adjY},
    next: {x: 558, y: 1563 + adjY},
  },
  StartPage3: {
    name: 'StartPage',
    colors: [
      {x: 400,  y: 1600 + adjY, r: 245, g: 85, b: 115, match: true, threshold: 80},
      {x: 680,  y: 1600 + adjY, r: 245, g: 85, b: 115, match: true, threshold: 80},
      {x: 540,  y: 1650 + adjY, r: 235, g: 70, b: 90 , match: true, threshold: 80},
    ],
    back: {x: 190, y: 1574 + adjY},
    next: {x: 558, y: 1563 + adjY},
  },
  TsumsPage: {
    name: 'TsumsPage',
    colors: [
      {x: 514, y: 842  + adjY, r: 41, g: 177, b: 203 , match: true, threshold: 80},
      {x: 180, y: 1520 + adjY, r: 238, g: 180, b: 11 , match: true, threshold: 100},
      {x: 817, y: 1516 + adjY, r: 238, g: 191, b: 13 , match: true, threshold: 80},
    ],
    back: {x: 176, y: 1520 + adjY},
    next: {x: 176, y: 1520 + adjY},
  },
  GamePause: {
    name: 'GamePause',
    colors: [
      {x: 165, y: 1005 + adjY, r: 234, g: 173, b: 7  , match: true, threshold: 80},
      {x: 594, y: 1001 + adjY, r: 233, g: 171, b: 8  , match: true, threshold: 80},
      {x: 367, y: 702  + adjY, r: 24 , g: 191, b: 225, match: true, threshold: 80},
      {x: 738, y: 540  + adjY, r: 248, g: 244, b: 245, match: true, threshold: 80},
      {x: 550, y: 1264 + adjY, r: 236, g: 182, b: 11 , match: true, threshold: 80},
    ],
    back: {x: 331, y: 1008 + adjY},
    next: {x: 561, y: 1350 + adjY},
  },
  GamePlaying: {
    name: 'GamePlaying',
    colors: [
      {x: 916, y:  246 + adjY, r: 230, g: 150, b: 6, match: true, threshold: 80}, // below pause
      {x: 916, y: 1616 + adjY, r: 230, g: 150, b: 6, match: true, threshold: 80}, // below fan
    ],
    back: {x: 986, y: 201 + adjY},
    next: {x: 986, y: 201 + adjY},
  },
  GamePlaying2: {
    name: 'GamePlaying',
    colors: [
      {x: 980, y:  186 + adjY, r: 244, g: 197, b: 5, match: true, threshold: 80}, // right of pause
      {x: 916, y: 1616 + adjY, r: 230, g: 150, b: 6, match: true, threshold: 80}, // below fan
    ],
    back: {x: 986, y: 201 + adjY},
    next: {x: 986, y: 201 + adjY},
  },
  MagicalTime: {
    name: 'MagicalTime',
    colors: [
      {x: 817, y:  435 + adjY, r: 244, g: 249, b: 243, match: true, threshold:  80},
      {x: 594, y:  785 + adjY, r: 248, g: 102, b: 121, match: true, threshold: 100},
      {x: 208, y: 1145 + adjY, r: 236, g: 175, b:   9, match: true, threshold:  80},
      {x: 662, y: 1141 + adjY, r: 232, g: 171, b:   5, match: true, threshold:  80},
    ],
    back: {x: 381, y: 1149 + adjY},
    next: {x: 856, y: 1149 + adjY},
  },
  NetworkDisable: {
    name: 'NetworkDisable',
    colors: [
      {x: 478, y: 1008 + adjY, r: 236, g:  94, b: 116, match: true, threshold: 80},
      {x: 932, y: 1005 + adjY, r: 232, g: 171, b:   5, match: true, threshold: 80},
    ],
    back: {x: 885, y: 1008 + adjY},
    next: {x: 885, y: 1012 + adjY},
  },
  NetworkTimeout: {
    name: 'NetworkTimeout',
    colors: [
      {x: 478, y: 1008 + adjY, r: 232, g: 171, b: 5, match: true, threshold: 80},
      {x: 932, y: 1005 + adjY, r: 232, g: 171, b: 5, match: true, threshold: 80},
    ],
    back: {x: 885, y: 1012 + adjY},
    next: {x: 885, y: 1012 + adjY},
  },
  FriendInfo: { // FriendInfo of Friend Page, SocailAccount of Setting Page
    name: 'FriendInfo',
    colors: [
      {x: 565, y:  504 + adjY, r:  31, g: 190, b: 220, match: true, threshold: 80},
      {x: 547, y: 1123 + adjY, r:  27, g: 192, b: 222, match: true, threshold: 80},
      {x: 554, y: 1260 + adjY, r: 238, g: 186, b:  12, match: true, threshold: 80},
    ],
    back: {x: 576, y: 1336 + adjY},
    next: {x: 576, y: 1336 + adjY},
  },
  LevelUp: { // LevelUp and RankUp
    name: 'LevelUp',
    colors: [
      {x: 140, y: 1584 + adjY, r: 233, g: 175, b: 6, match: true, threshold: 80}, // left of the close button
      {x: 450, y: 1584 + adjY, r: 233, g: 175, b: 6, match: true, threshold: 80}, // right of the close button
      {x: 620, y: 1584 + adjY, r: 233, g: 175, b: 6, match: true, threshold: 80}, // left of the share button
      {x: 930, y: 1584 + adjY, r: 233, g: 175, b: 6, match: true, threshold: 80}, // right of the share button
    ],
    back: {x: 300, y: 1588 + adjY},
    next: {x: 300, y: 1588 + adjY},
  },
  ClosePage: { // including EventPage, MyInfo, SettingPage, others
    name: 'ClosePage', // the close button at center bottom
    colors: [
      {x: 540, y: 1516 + adjY, r: 233, g: 180, b: 10, match: true, threshold: 80}, // top right of the close button
    ],
    back: {x: 576, y: 1588 + adjY},
    next: {x: 576, y: 1588 + adjY},
  },
  HighScore: {
    name: 'HighScore',
    colors: [
      {x: 298, y: 1253 + adjY, r: 238, g: 187, b: 10, match: true, threshold: 80},
      {x: 810, y: 1253 + adjY, r: 238, g: 187, b: 10, match: true, threshold: 80},
    ],
    back: {x: 298, y: 1253 + adjY},
    next: {x: 810, y: 1253 + adjY},
  },
  InvitePage: {
    name: 'InvitePage', // the close button at left bottom
    colors: [
      {x: 180, y: 1520 + adjY, r: 238, g: 180, b: 11, match: true, threshold: 80},
    ],
    back: {x: 176, y: 1520 + adjY},
    next: {x: 176, y: 1520 + adjY},
  },
};

var Logs = {
  start: '[TsumTsum] Start',
  stop: '[TsumTsum] Stop',
  sendMessage: 'Send Message...',
  TaskControllerStop: 'TaskController Stop',
  updateApp: 'Please update Robotmon and restart service',
  UnknownState: 'Unknown state, Exiting',
  totalTsums: 'Total Tsums',
  removeSameTsums: 'Remove same Tsums',
  recognizedTsums: 'Recognized Tsums',
  recognizingTsums: 'Recognizing Tsums',
  recognitionStart: 'Start Tsums recognition',
  recognitionTime: 'Time consumed',
  myTsum: 'myTsum',
  clearBubbles: 'Clear bubbles',
  bubbleGenerated: 'Bubble generated',
  calculationPathStart: 'Start path calculation ',
  calculatedPath: 'Calculated path',
  recalculatingPath: 'Connections 0, Recalculating path',
  useSkill: 'Use skill',
  gameStart: 'Game Start',
  gaming: 'Gaming (Slow version)',
  fastGaming: 'Gaming (Fast version)',
  gameOver: 'Game Over',
  detectScreen: 'Detecting screen (top and bosttom)',
  calculateScreenSize: 'Calculating screen size',
  offset: 'Offset (X, Y, H, W)',
  startTsumTsumApp: 'Start TsumTsum app',
  currentPage: 'Current page',
  friendsPage: 'Friends page',
  checkBonusItems: 'Check bonus items',
  receiveAllGifts: 'Receive all gifts',
  receiveGiftsOneByOne: 'Receive gift one by one',
  receiveGiftAgain: 'Receive gift again',
  allGiftsReceived: 'All gifts received',
  receivingGiftsCompleted: 'Receiving gifts completed',
  checkUnreceivedGift: 'Check unreceived gift',
  readRecords: 'Reading records',
  saveRecords: 'Saving records',
  recognizingHeartSender: 'Recognizing heart sender',
  calculatingHeartSender: 'Calculating heart sender',
  receiveHeartFromHeartSender: 'Receive',
  recognitionScore: 'Recognition score',
  saveNewFriend: 'Save new friend',
  saveNewFriendAgain: 'Save new friend again',
  hearts: 'hearts from heart sender today',
  startSendingHearts: 'Start sending hearts',
  checkSendingHearts: 'Check sending hearts',
  sendingHearts: 'Sending',
  sendingZeroScore: 'hearts',
  timeIsUp: 'Time\'s up'
}

var LogsTW = {
  start: '[TsumTsum] 啟動',
  stop: '[TsumTsum] 停止',
  sendMessage: '送出訊息中...',
  TaskControllerStop: 'TaskController 停止',
  updateApp: '請更新 Robotmon 並重新啟動 Service',
  UnknownState: '未知狀態，離開',
  totalTsums: 'Tsums 總數',
  removeSameTsums: '移除相同 Tsums 後總數',
  recognizedTsums: '成功辨識 Tsums',
  recognizingTsums: '辨識 Tsums 中',
  recognitionStart: '開始辨識 Tsums',
  recognitionTime: '耗時',
  myTsum: '我的Tsum',
  clearBubbles: '清除泡泡',
  bubbleGenerated: '產生泡泡',
  calculationPathStart: '開始計算路徑',
  calculatedPath: '成功計算路徑',
  recalculatingPath: '路徑數量為 0, 重新辨識',
  useSkill: '使用技能',
  gameStart: '遊戲開始',
  gaming: '遊戲中 (慢速版)',
  fastGaming: '遊戲中 (快速版)',
  gameOver: '遊戲結束',
  detectScreen: '偵測畫面 (頂部與底部)',
  calculateScreenSize: '計算螢幕大小',
  offset: '位移 (X, Y, H, W)',
  startTsumTsumApp: '啟動 TsumTsum 應用程式',
  currentPage: '目前頁面',
  friendsPage: '朋友頁面',
  checkBonusItems: '檢查道具',
  receiveAllGifts: '接收所有禮物',
  receiveGiftsOneByOne: '一個一個接收禮物',
  receiveGiftAgain: '再嘗試接收禮物一次',
  allGiftsReceived: '已接收所有禮物',
  receivingGiftsCompleted: '完成接收禮物',
  checkUnreceivedGift: '檢查未接收的禮物',
  readRecords: '讀取紀錄',
  saveRecords: '儲存紀錄',
  recognizingHeartSender: '辨識送心者',
  calculatingHeartSender: '計算送心者',
  receiveHeartFromHeartSender: '今天送心者已送出',
  recognitionScore: '辨識分數',
  saveNewFriend: '儲存新朋友',
  saveNewFriendAgain: '重新儲存新朋友',
  hearts: '顆愛心',
  startSendingHearts: '開始送愛心',
  checkSendingHearts: '檢查送愛心',
  sendingHearts: '已送出',
  sendingZeroScore: '顆愛心',
  timeIsUp: '送心時間結束'
}

// Utils for sending message
var _userPlan = -1;
var _lastSendingTime = 0;

function checkFunction(f) {
  return typeof(f) == 'function'
}
function checkCanSendMessage() {
  _userPlan = -1;
  if (getUserPlan !== undefined && checkFunction(sendNormalMessage)) {
    _userPlan = getUserPlan();
  }
  console.log('User Plan', _userPlan);
}
function canSendMessage() {
  if (_userPlan == -1) {
    return false;
  }
  var during = Date.now() - _lastSendingTime;
  if (_userPlan >= 0 && during > 60 * 60 * 1000) {
    return true;
  }
  return false;
}
function sendMessage(topMsg, msg) {
  if (canSendMessage()) {
    _lastSendingTime = Date.now();
    console.log(sendNormalMessage(topMsg, msg));
  }
}
checkCanSendMessage();

// Utils for Tsum

function printMaxScores(tsumMaxScores) {
  var str = "";
  for (var i = 0; i < 10 && i < tsumMaxScores.length; i++) {
    str += i + ", " + tsumMaxScores[i].key + ", " + tsumMaxScores[i].score + "    ";
  }
  log(str);
}

function usingTimeString(startTime) {
  return Date.now() - startTime;
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

function recognizeGameTsums(boardImg, allTsumImages, myTsum, isJP, debug, logs) {
  // releaseRotationTsum();
  if (debug) {
    saveImage(boardImg, getStoragePath() + "/tmp/boardImg.png");
  }
  var gameTsums = findAllTsumMatchScore(allTsumImages, boardImg, myTsum);
  gameTsums = gameTsums.splice(0, 50);

  log(logs.totalTsums, gameTsums.length);
  if (debug) {
    printMaxScores(gameTsums);
  }
  // Remove same Tsums
  removeSameTsumImages(gameTsums, 0.92);
  log(logs.removeSameTsums, gameTsums.length);
  if (debug) {
    printMaxScores(gameTsums);
  }
  
  loadTsumRotationImages(gameTsums, isJP, debug);
  // recheck first 5(4) tsums with rotation
  for (var i = 0; i < gameTsums.length && i < Config.loadRotatedCount; i++) {
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

function recognizeBoard(boardImg, gameTsums, tsumCount, debug, logs) {
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
  sleep(50);
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
  
  log(logs.recognizedTsums, board.length);
  sleep(30);
  log(logs.recognitionTime, usingTimeString(startTime));
  if (debug) {
    for (var i = 0; i < board.length; i++) {
      var boardTsum = board[i];
      drawCircle(boardImg, boardTsum.x + Config.tsumWidth/2, boardTsum.y + Config.tsumWidth/2, 1, Config.colors[boardTsum.tsumIdx][0], Config.colors[boardTsum.tsumIdx][1], Config.colors[boardTsum.tsumIdx][2], 0);
    }
  }
  return board;
}

function getDistance(t1, t2) {
  //return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));
  return (t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y);
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
  minDis = Math.sqrt(minDis)
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

function calculatePaths(board, logs) {
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
  log(logs.calculatedPath, paths.length);
  return paths;
}

function convertTo2DArray(arr, size) {
  var result = [];
  for (var i = 0; i < arr.length; i = i + size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function findTsums(img) {
  var hsvImg = clone(img);
  smooth(hsvImg, 1, 7);
  convertColor(hsvImg, 40);
  var filter1 = outRange(hsvImg, 80, 160, 20, 0, 120, 255, 210, 255);
	var filter2 = outRange(filter1, 80, 100, 90, 0, 130, 170, 190, 255);
  var mask = bgrToGray(filter2);
  
  releaseImage(filter1);
  releaseImage(filter2);

  var points = houghCircles(mask, 3, 1, 22, 4, 7, 8, 14);
  
  smooth(hsvImg, 1, 22);
  var results = [];
  for (var k in points) {
    var p = points[k];
    var hsv1 = getImageColor(hsvImg, p.x, p.y);
    var hsv2 = hsv1; var hsv3 = hsv1; var hsv4 = hsv1; var hsv5 = hsv1;
    if (p.x - 1 >= 0) { hsv2 = getImageColor(hsvImg, p.x - 1, p.y); }
    if (p.x + 1 < 200) { hsv3 = getImageColor(hsvImg, p.x + 1, p.y); }
    if (p.y - 1 >= 0) { hsv4 = getImageColor(hsvImg, p.x, p.y - 1); }
    if (p.y + 1 < 200) { hsv5 = getImageColor(hsvImg, p.x, p.y + 1); }
    var avgb = (hsv1.b + hsv2.b + hsv3.b + hsv4.b + hsv5.b) / 5;
    var avgg = (hsv1.g + hsv2.g + hsv3.g + hsv4.g + hsv5.g) / 5;
    var avgr = (hsv1.r + hsv2.r + hsv3.r + hsv4.r + hsv5.r) / 5;
    results.push({x: p.x, y: p.y, z: p.r, b: avgb, g: avgg, r: avgr});
  }
  
  // saveImage(mask, getStoragePath() + "/tmp/mask.jpg");
  // saveImage(hsvImg, getStoragePath() + "/tmp/hsvImg.jpg");
  
  releaseImage(mask);
  releaseImage(hsvImg);
  
  return results;
}

function distance3D(p1, p2) {
  var d = Math.sqrt((p1.b-p2.b)*(p1.b-p2.b) + (p1.g-p2.g)*(p1.g-p2.g) + (p1.r-p2.r)*(p1.r-p2.r));
  if (Math.abs(p1.b - p2.b) < 20) { d -= 10; }
  if (Math.abs(p1.g - p2.g) < 20) { d -= 10; }
  if (p1.r < 120 && p2.r < 120) { d -= 20; }
  return d;
}

function classifyTsums(points, tsumCount) {
  var tcs = [];
  if (points.length === 0) {
    return tcs;
  }
  var p = points[0];
  tcs.push({ sumb: p.b, sumg: p.g, sumr: p.r, b: p.b, g: p.g, r: p.r, points: [p] });
  for (var i = 1; i < points.length; i++) {
    var p = points[i];
    var isSame = false;
    for(var j in tcs) {
      var tc = tcs[j];
      var d = distance3D(tc, p);
      if (d < 15) {
        var count = tc.points.length + 1;
        isSame = true;
        tc.sumb += p.b; tc.sumg += p.g; tc.sumr += p.r;
        tc.b = tc.sumb/count; tc.g = tc.sumg/count; tc.r = tc.sumr/count;
        tc.points.push(p);
        break;
      }
    }
    if(!isSame) {
      tcs.push({ sumb: p.b, sumg: p.g, sumr: p.r, b: p.b, g: p.g, r: p.r, points: [p]});
    }
  }
  return tcs;
}

// Tsum struct

function Tsum(isJP, detect, logs) {
  this.debug = false;
  this.autoLaunch = false;
  this.isRunning = true;
  this.runTimes = 0;
  this.myTsum = '';
  this.storagePath = getStoragePath();
  // screen size config
  var size = getScreenSize();
  this.originScreenWidth = size.width;
  this.originScreenHeight = size.height;
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
  this.logs = logs;
  this.coinItem = false;
  this.bubbleItem = false;
  this.isSlowCalculation = false;
  this.isPause = false;
  this.receiveOneItem = false;
  this.sentToZero = false;
  this.recordReceive = true;
  this.enableAllItems = false;
  this.skillInterval = 3000;
  this.skillLevel = 3;
  this.skillType = '';
  this.sendHearts = false;
  this.showLog = true;
  this.keepRuby = false;
  this.showHeartLog = true;
  this.sendHeartMaxDuring = 0;
  this.useFan = true;
  // record
  this.record = {
    hearts_count: {
      receivedCount: 0,
      sentCount: 0,
    }
  };
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
  log(this.logs.detectScreen, top, bottom);
  sleep(1000);
  return {top: top, bottom: bottom};
}

Tsum.prototype.init = function(detect) {
  log(this.logs.calculateScreenSize);
  
  var extraOffsetY = 0; 
  if (detect) {
    var topBottom = this.detect();
    var h = topBottom.bottom - topBottom.top;
    this.screenHeight = h;
    extraOffsetY = topBottom.top;
  }

  var isFat = false;
  var realWidth = this.screenHeight / 16 * 9;
  if (this.screenHeight / this.screenWidth < 1.5) {
    isFat = true;
    this.gameHeight = this.screenHeight;
    this.gameWidth = this.screenHeight / 1.5;
    this.gameOffsetY = Math.floor((this.gameWidth * 16 / 9 - this.gameHeight) / 2);
    this.gameOffsetX = Math.floor((this.gameWidth - this.screenWidth) / 2);
  } else if (realWidth > this.screenWidth) {
    this.gameWidth = realWidth;
    this.gameHeight = this.screenHeight;
    this.gameOffsetX = Math.floor((this.gameWidth - this.screenWidth) / 2);
    this.gameOffsetY = 0;
  } else if (realWidth < this.screenWidth) {
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.screenWidth / 9 * 16;
    this.gameOffsetX = 0;
    this.gameOffsetY = Math.floor((this.gameHeight - this.screenHeight) / 2);
  } else {
    this.gameWidth = this.screenWidth;
    this.gameHeight = this.screenHeight;
    this.gameOffsetX = 0;
    this.gameOffsetY = 0;
  }
  this.gameOffsetY -= extraOffsetY;

  this.captureGameRatio = this.gameWidth / 1080;
  if (isFat) {
    this.playWidth = this.gameWidth;
    this.playOffsetX = Math.max(-this.gameOffsetX, 0);
  } else {
    this.playWidth = this.screenWidth;
    this.playOffsetX = 0;
  }
  this.playHeight = this.playWidth;
  this.playOffsetY = 465 * this.captureGameRatio - this.gameOffsetY;

  this.allTsumImages = loadTsumImages(this.isJP);
  this.isLoadAllTsum = true;

  this.sleep(200);
  log(this.logs.offset, this.gameOffsetX, this.gameOffsetY, this.screenHeight, this.screenWidth);
  this.sleep(1000);
  execute("mkdir -p " + this.storagePath + '/tmp');
  this.sleep(200);
  execute("mkdir -p " + this.storagePath + '/' + Config.recordDir);
}

Tsum.prototype.deinit = function() {
  if (this.isLoadRotateTsum) {
    releaseTsumRotationImages(this.gameTsums);
  }
  releaseTsumImages(this.allTsumImages);
  this.allTsumImages = {};
  this.isLoadAllTsum = false;
}

Tsum.prototype.sendMoneyInfo = function() {
  if (!canSendMessage()) {
    return;
  }
  var x = Math.floor(Button.moneyInfoBox.x * this.captureGameRatio - this.gameOffsetX);
  var y = Math.floor(Button.moneyInfoBox.y * this.captureGameRatio - this.gameOffsetY);
  var w = Math.floor(Button.moneyInfoBox.w * this.captureGameRatio);
  var h = Math.floor(Button.moneyInfoBox.h * this.captureGameRatio);
  var img = getScreenshotModify(x, y, w, h, Button.moneyInfoBox.w / 2, Button.moneyInfoBox.h / 2, 80);
  var base64 = getBase64FromImage(img);
  releaseImage(img);
  log(this.logs.sendMessage);
  sendMessage("Tsum Tsum", base64);
}

Tsum.prototype.isAppOn = function() {
  if (!this.autoLaunch) {
    return true;
  }
  var result = execute('dumpsys window windows').split('mCurrentFocus');
  if (result.length < 2) {
    return false;
  }
  result = result[1].split(" ");
  if (result.length < 3) {
    return false;
  }
  result = result[2].split("/");
  if (result.length < 2) {
    return false;
  }
  var packageName = result[0];
  var activityName = result[1];
  if (packageName.indexOf('LGTMTM') == -1) {
    return false;
  }
  return true;
};

Tsum.prototype.startApp = function() {
  if (!this.autoLaunch) {
    return;
  }
  log(this.logs.startTsumTsumApp);
  if (this.isJP) {
    execute('am start -n com.linecorp.LGTMTM/.TsumTsum');
  } else {
    execute('am start -n com.linecorp.LGTMTMG/.TsumTsum');
  }
  this.sleep(3000);
}

Tsum.prototype.screenshot = function() {
  return getScreenshotModify(
    0, 
    0, 
    this.originScreenWidth, 
    this.originScreenHeight, 
    this.originScreenWidth / this.resizeRatio, 
    this.originScreenHeight / this.resizeRatio,
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

Tsum.prototype.toResizeXY = function(x, y) {
  var rx = Math.floor((x * this.captureGameRatio - this.gameOffsetX) / this.resizeRatio);
  var ry = Math.floor((y * this.captureGameRatio - this.gameOffsetY) / this.resizeRatio);
  return {x: rx, y: ry};
}

Tsum.prototype.toResizeXYs = function(xy) {
  return this.toResizeXY(xy.x, xy.y);
}

Tsum.prototype.getColor = function(img, xy) {
  var rxy = this.toResizeXYs(xy);
  return getImageColor(img, rxy.x, rxy.y);
}

Tsum.prototype.toRealXY = function(x, y) {
  var rx = Math.floor(x * this.captureGameRatio - this.gameOffsetX);
  var ry = Math.floor(y * this.captureGameRatio - this.gameOffsetY);
  return {x: rx, y: ry};
}

Tsum.prototype.toRealXYs = function(xy) {
  return this.toRealXY(xy.x, xy.y);
}

Tsum.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tap(rxy.x, rxy.y, during);
}

Tsum.prototype.tapDown = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tapDown(rxy.x, rxy.y, during);
}

Tsum.prototype.moveTo = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  moveTo(rxy.x, rxy.y, during);
}

Tsum.prototype.tapUp = function(xy, during) {
  if (during === undefined) {
    during = 50;
  }
  var rxy = this.toRealXYs(xy);
  tapUp(rxy.x, rxy.y, during);
}

Tsum.prototype.linkTsums = function(path) {
  for (var j in path) {
    var point = path[j];
    var x = Math.floor(this.playOffsetX + (point.x + Config.tsumWidth / 2) * this.playWidth / this.playResizeWidth);
    var y = Math.floor(this.playOffsetY + (point.y + Config.tsumWidth / 2) * this.playHeight / this.playResizeHeight);
    if (j == 0) {
      tapDown(x, y, 10);
    }
    moveTo(x, y, 10);
    if (j == path.length - 1) {
      tapUp(x, y, 10);
    }
  }
}

Tsum.prototype.link = function(paths) {
  var isBubble = false;
  for (var i in paths) {
    var path = paths[i];
    if (path.length > 7) {
      isBubble = true;
    }
    this.linkTsums(path);
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
      for (var key in Page) {
        var page = Page[key];
        var pageName = page.name;
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

Tsum.prototype.exitUnknownPage = function() {
  keycode('KEYCODE_DPAD_DOWN');
  this.sleep(500);
  keycode('KEYCODE_ENTER');
  this.tap(Button.gameQuestionCancel);
  this.tap(Button.gameQuestionCancel2);
  this.tap(Button.outClose);
  this.tap(Button.gameStop);
  this.sleep(500);
}

Tsum.prototype.goFriendPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    var page = this.findPage(2, 1000);
    log(this.logs.currentPage, page, "goFriend");
    if (page == 'FriendPage') {
      // check again
      page = this.findPage(1, 500);
      if (page == 'FriendPage') {
        this.sendMoneyInfo();
        return;
      }
    } else if (page == "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
    } else if (page == 'unknown') {
      this.exitUnknownPage();
    } else {
      this.tap(Page[page].back);
    }
    this.sleep(1000);
  }
}

Tsum.prototype.checkGameItem = function() { 
  var isItemsOn = [false, false, false, false, false, false];
  if (this.enableAllItems) {
    isItemsOn = [true, true, true, true, true, true];
  }
  if (this.tsumCount == 4) {
    isItemsOn[5] = true;
  }
  if (this.coinItem) {
    isItemsOn[1] = true;
  }
  if (this.bubbleItem) {
    isItemsOn[4] = true;
  }
  for(var t = 0; t < 3; t++) {
    var img = this.screenshot();
    var isChange = false;
    for (var i = 0; i < 6; i++) {
      var c = this.getColor(img, Button.outGameItems[i]);
      if (c.b > 128) { // off
        if (isItemsOn[i]) {
          this.tap(Button.outGameItems[i]);
          isChange = true;
          this.sleep(500);
        }
      } else { // on
        if (!isItemsOn[i]) {
          this.tap(Button.outGameItems[i]);
          isChange = true;
          this.sleep(500);
        }
      }
    }
    releaseImage(img);
    if (!isChange) {
      break;
    }
    this.sleep(500);
  }
  log(this.logs.checkBonusItems, isItemsOn);
}

Tsum.prototype.goGamePlayingPage = function() {
  while(this.isRunning) {
    if (!this.isAppOn()) {
      this.startApp();
    }
    var page = this.findPage(2, 2000);
    log(this.logs.currentPage, page, "play");
    if (page == 'FriendPage') {
      this.tap(Page[page].next);
    } else if (page == 'StartPage') {
      this.sleep(500);
      this.checkGameItem();
      this.sendMoneyInfo();
      this.tap(Button.outStart2);
      this.sleep(3000); // avoid checking items again!
    } else if (page == 'GamePlaying') {
      // check again
      page = this.findPage(1, 500);
      if (page == 'GamePlaying') {
        return;
      }
    } else if (page == 'GamePause') {
      this.tap(Page[page].next);
    } else if (page == 'unknown') {
      this.exitUnknownPage();
    } else if (page == "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
    } else {
      this.tap(Page[page].back);
    }
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
    saveImage(myTsumImage, this.storagePath + "/tmp/mytsum.jpg");
  }
  releaseImage(myTsumImage);
  this.myTsum = allScores[0].key;
}

Tsum.prototype.clearAllBubbles = function(startDelay, endDelay, fromY) {
  if (startDelay !== undefined) {
    this.sleep(startDelay);
  }

  var fy = Button.gameBubblesFrom.y;
  if (fromY !== undefined) {
    fy = fromY;
  }

  for (var bx = Button.gameBubblesFrom.x; bx <= Button.gameBubblesTo.x; bx += 140) {
    for (var by = fy; by <= Button.gameBubblesTo.y; by += 140) {
      this.tap({x: bx, y: by}, 10);
    }
  }

  if (endDelay !== undefined) {
    this.sleep(endDelay);
  }
}

Tsum.prototype.useCinderellaSkill = function(board) {
  var size = this.skillLevel + 6;
  board.sort(function(a, b) {
    return a.y - b.y;
  });
  var paths = convertTo2DArray(board, size);
  for (var i = 0; i < paths.length - 1; i++) {
    var path = paths[i];
    path.sort(function(a, b) {
      return a.x - b.x;
    });
    this.linkTsums(path);
  }
}

Tsum.prototype.useSkill = function(board) {
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
  log(this.logs.useSkill);
  if (this.skillType == 'block_lukej_s') {
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
  }
  this.tap(Button.gameSkillOn);
  this.sleep(30);
  if (this.skillType == 'block_lukej_s') {
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
    this.sleep(400);
    this.tap(Button.skillLuke1, 30);
    this.tap(Button.skillLuke2, 30);
    this.tap(Button.skillLuke3, 30);
    this.tap(Button.skillLuke4, 30);
    this.sleep(400);
  } else if (this.skillType == 'block_donald_s' || this.skillType == 'block_donaldx_s') {
    for (var i = 0; i < 3; i++) {
      for (var bx = Button.gameBubblesFrom.x - 40; bx <= Button.gameBubblesTo.x + 40; bx += 150) {
        for (var by = Button.gameBubblesFrom.y; by <= Button.gameBubblesTo.y + 100; by += 150) {
          this.tap({x: bx, y: by}, 10);
        }
      }
    }
  } else if (this.skillType == 'block_marie_s' || this.skillType == 'block_missbunny_s' || this.skillType == 'block_rabbit_s') {
    this.clearAllBubbles(2000, 50);
  } else if(this.skillType == 'block_moana_s') {
    this.clearAllBubbles(2500, 50);
  } else if(this.skillType == 'block_mickeyh2015_s') {
    this.clearAllBubbles(1500, 50);
  } else if(this.skillType == 'block_snowwhite_s') {
    this.clearAllBubbles(1300);
    this.clearAllBubbles(10, 50, (Button.gameBubblesFrom.y + Button.gameBubblesTo.y) / 2);
  } else if(this.skillType == 'block_cinderella_s') {
    this.sleep(1500);
    this.useCinderellaSkill(board);
    this.sleep(500);
    board = this.scanBoard();
    this.useCinderellaSkill(board);
    this.clearAllBubbles(2500, 50);
  } else if(this.skillType == 'block_woody2_s'){
    this.sleep(1800);
    this.tapDown({x: 540, y: 960}, 20);
    this.moveTo({x: 980, y: 960}, 20);      
    this.sleep(50);
    for (var i = 0; i < 3; i++) {
      this.moveTo({x: 100, y: 960}, 20);
      this.sleep(420);
      this.moveTo({x: 980, y: 960}, 20);
      this.sleep(480);
    }
    this.tapUp({x: 980, y: 960}, 20);
  }
  else {
    this.sleep(this.skillInterval);
  }
  return true;
}

Tsum.prototype.scanBoard = function() {
  // load game tsums
  var gameImage = this.playScreenshot();
  smooth(gameImage, 1, 2);

  if (this.isPause) {
    this.tap(Button.gamePause);
    this.sleep(20);
    this.tap(Button.gamePause);
  }

  if (!this.isLoadRotateTsum) {
    log(this.logs.recognitionStart);
    this.tap(Button.gamePause);
    this.gameTsums = recognizeGameTsums(gameImage, this.allTsumImages, this.myTsum, this.isJP, this.debug, this.logs);
    this.isLoadRotateTsum = true;
    var page = this.findPage(2, 1000);
    if (page != 'GamePlaying' && page != 'GamePause') {
      log(this.logs.gameOver);
      return;
    }
    this.sleep(Config.gameContinueDelay);
    this.tap(Button.gameContinue);
  }
  log(this.logs.recognizingTsums);
  var board = recognizeBoard(gameImage, this.gameTsums, this.tsumCount, this.debug, this.logs);
  if (this.debug) {
    saveImage(gameImage, this.storagePath + "/tmp/boardImg-" + this.runTimes + ".jpg");
  }
  releaseImage(gameImage);

  if (this.isPause) {
    this.sleep(Config.gameContinueDelay);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
  }

  return board;
}

Tsum.prototype.scanBoardQuick = function() {
  // load game tsums
  var startTime = Date.now();
  var srcImg = this.playScreenshot();

  if (this.isPause) {
    this.tap(Button.gamePause);
    this.sleep(20);
    this.tap(Button.gamePause);
  }

  var points = findTsums(srcImg);
  log(this.logs.recognitionStart);
  var tcs = classifyTsums(points);
  tcs.sort(function(a, b) { return a.points.length > b.points.length ? -1: 1; });
  var board = [];
  for(var i in tcs) {
    if (i >= this.tsumCount - 1) {
      break;
    }
    var tc = tcs[i];
    for (var j in tc.points) {
      var p = tc.points[j];
      board.push({tsumIdx: i, x: p.x - (Config.tsumWidth / 2), y: p.y - (Config.tsumWidth / 2)});
      if (this.debug) {
        drawCircle(srcImg, p.x, p.y, 4, Config.colors[i][0], Config.colors[i][1], Config.colors[i][2], 0);
      }
    }
  }
  if (this.debug) {
    saveImage(srcImg, this.storagePath + "/tmp/boardImg-" + this.runTimes + ".jpg");
  }
  releaseImage(srcImg);
  log(this.logs.recognizedTsums, board.length);
  sleep(30);
  log(this.logs.recognitionTime, usingTimeString(startTime));

  if (this.isPause) {
    this.sleep(Config.gameContinueDelay);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
    this.tap(Button.gameContinue);
    this.sleep(Config.gameContinueDelay / 2);
  }

  return board;
}

Tsum.prototype.taskPlayGameQuick = function() {
  log(this.logs.gameStart);
  this.goGamePlayingPage();
  log(this.logs.fastGaming);
  if (this.isPause) {
    this.sleep(350);
  }
  this.runTimes = 0;
  var clearBubbles = 0;
  var zeroPath = 0;
  while(this.isRunning) {  
    var board = this.scanBoardQuick();
    if (board == undefined || board == null) {
      break;
    }
    log(this.logs.calculationPathStart);
    var paths = calculatePaths(board, this.logs);
    paths = paths.splice(0, 6);
    var isBubble = this.link(paths);
    if (isBubble) {
      log(this.logs.bubbleGenerated);
      clearBubbles++;
    }
    if (paths.length < 3) {
      zeroPath++;
      if (zeroPath === 6) {
        this.tap(Button.gameRand, 60);
        this.tap(Button.gameRand, 60);
        zeroPath = 0;
      }
    }
    // click bubbles
    if (this.clearBubbles && clearBubbles >= 2) {
      log(this.logs.clearBubbles);
      clearBubbles = 0;
      this.clearAllBubbles();
    }
    if (this.useFan && this.runTimes % 4 == 3) {
      this.tap(Button.gameRand, 60);
      this.tap(Button.gameRand, 60);
    }
    if (this.isPause) {
      this.sleep(300);
    }
    if (this.useSkill(board)) {
      clearBubbles++;
      if (this.useSkill(board)) {
        this.useSkill(board);
      }
    }

    // double check
    var page = this.findPage(1, 2500);
    if (page != 'GamePlaying' && page != 'GamePause') {
      this.sleep(500);
      page = this.findPage(1, 2500);
      if (page != 'GamePlaying' && page != 'GamePause') {
        log(this.logs.gameOver);
        break;
      }
    }
    this.runTimes++;
  }
  // releaseTsumRotationImages(this.gameTsums);
  this.gameTsums = [];
  this.isLoadRotateTsum = false;
}

Tsum.prototype.taskPlayGame = function() {
  log(this.logs.gameStart);
  this.goGamePlayingPage();
  log(this.logs.gaming);
  this.sleep(500);
  this.findMyTsum();
  log(this.logs.myTsum);
  this.runTimes = 0;
  var pathZero = 0;
  var clearBubbles = 0;
  while(this.isRunning) {
    var board = this.scanBoard();
    if (board == undefined || board == null) {
      break;
    }
    log(this.logs.calculationPathStart);
    var paths = calculatePaths(board, this.logs);
    if (paths.length < 2) {
      if (pathZero > 2) {
        pathZero = 0;
        log(this.logs.recalculatingPath);
        if (this.useFan) {
          this.tap(Button.gameRand, 60);
          this.tap(Button.gameRand, 60);
          this.sleep(1000);
        }
        releaseTsumRotationImages(this.gameTsums);
        this.gameTsums = [];
        this.isLoadRotateTsum = false;
        continue;
      }
      pathZero++;
    }

    paths = paths.splice(0, 10);
    var isBubble = this.link(paths);
    if (isBubble) {
      log(this.logs.bubbleGenerated);
      clearBubbles++;
    }

    // click bubbles
    if (this.clearBubbles && clearBubbles >= 2) {
      log(this.logs.clearBubbles);
      clearBubbles = 0;
      this.clearAllBubbles();
    }
    
    if (this.useFan && this.runTimes % 4 == 3) {
      this.tap(Button.gameRand, 100);
      this.tap(Button.gameRand, 100);
      this.sleep(700);
    }
    this.sleep(300);
    if (this.useSkill(board)) {
      clearBubbles++;
      if (this.useSkill(board)) {
        this.useSkill(board);
      }
    }

    // double check
    var page = this.findPage(1, 2500);
    if (page != 'GamePlaying' && page != 'GamePause') {
      this.sleep(500);
      page = this.findPage(1, 2500);
      if (page != 'GamePlaying' && page != 'GamePause') {
        log(this.logs.gameOver);
        break;
      }
    }
    this.runTimes++;
  }
  releaseTsumRotationImages(this.gameTsums);
  this.gameTsums = [];
  this.isLoadRotateTsum = false;
  this.sleep(4000);
}

Tsum.prototype.taskReceiveAllItems = function() {
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000);
  log(this.logs.receiveAllGifts);
  this.tap(Button.outReceive);
  this.sleep(3500);
  this.tap(Button.outReceiveAll);
  this.sleep(2500);
  this.tap(Button.outReceiveOk);
  this.sleep(2000);
  this.tap(Button.outReceiveClose);
  this.sleep(1500);
  this.tap(Button.outClose);
  this.goFriendPage();
  log(this.logs.allGiftsReceived);
}

Tsum.prototype.readRecord = function() {
  log(this.logs.readRecords);
  var recordDir = this.storagePath + '/' + Config.recordDir;
  var recordFile = recordDir + '/record.txt';
  var txt = readFile(recordFile);
  if (txt != undefined && txt != "") {
    this.record = JSON.parse(txt);
  }
  for (var filename in this.record) {
    if (filename != "hearts_count") {
      this.recordImages[filename] = openImage(recordDir + '/' + filename);
    }
  }
}

Tsum.prototype.recognizeSender = function(img) {
  log(this.logs.recognizingHeartSender);
  var recordDir = this.storagePath + '/' + Config.recordDir;
  var from = this.toResizeXYs(Button.outReceiveNameFrom);
  var to = this.toResizeXYs(Button.outReceiveNameTo);
  var nameImg = cropImage(img, Math.floor(from.x), Math.floor(from.y), Math.floor(to.x - from.x), Math.floor(to.y - from.y));
  var score = 0;
  var existFilename = '';
  for(var key in this.recordImages) {
    if (this.recordImages[key] != 0) {
      score = getIdentityScore(nameImg, this.recordImages[key]);
      if (score >= 0.98) {
        existFilename = key;
        log(this.logs.recognitionScore + " > 0.98", key, score);
        break;
      }
    }
  }
  // console.log("Score: " + score);
  if (existFilename == '') {
    var now = nowTime();
    var dayTime = Math.floor(now / (24 * 60 * 60 * 1000)); 
    // not found, new friend
    var filename = 'f_' + now + '.png';
    this.record[filename] = {
      receiveCounts: {},
      lastReceiveTime: now,
    };
    this.record[filename].receiveCounts[dayTime] = 1;
    this.recordImages[filename] = nameImg;
    var path = recordDir + '/' + filename;
    log(this.logs.saveNewFriend, path);
    saveImage(nameImg, path);
    this.sleep(80);
    var check = execute("ls " + path);
    if (check.indexOf(filename) == -1) {
      log(this.logs.saveNewFriendAgain);
      saveImage(nameImg, path);
    }
  } else {
    releaseImage(nameImg);
  }
  return existFilename;
}

Tsum.prototype.countReceiveHeart = function(existFilename) {
  if (existFilename == "") {
    return;
  }
  log(this.logs.calculatingHeartSender);
  var now = nowTime();
  var dayTime = Math.floor(now / (24 * 60 * 60 * 1000)); 
  // found
  if (this.record[existFilename].receiveCounts[dayTime] == undefined) {
    this.record[existFilename].receiveCounts[dayTime] = 0;
  }
  this.record[existFilename].receiveCounts[dayTime]++;
  this.record[existFilename].lastReceiveTime = now;
  log(this.logs.receiveHeartFromHeartSender, this.record[existFilename].receiveCounts[dayTime], this.logs.hearts);
}

Tsum.prototype.saveRecord = function() {
  log(this.logs.saveRecords);
  var recordFile = this.storagePath + '/' + Config.recordDir + '/record.txt';
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
    if (isSameColor(Button.outIsLoading1.color, this.getColor(img, {x: fx, y: y}), 20)) {
      whiteCount++;
    }
  }
  releaseImage(img);
  if (whiteCount >= 3) {
    return true;
  }
  return false;
}

Tsum.prototype.skipAd = function () {
  log("Ignore Ad");
  this.tap(Button.outReceiveOne);
  this.sleep(4000);
  // delete ad
  this.tap({ x: 462, y: 1235 - 140 });
  this.sleep(4000);
  this.tap({ x: 172, y: 1360 - 140 });
  this.sleep(2000);
  this.tap({ x: 556, y: 1557 - 140 });
}

Tsum.prototype.taskReceiveOneItem = function() {
  log(this.logs.friendsPage);
  this.goFriendPage();
  this.sleep(1000)
  this.tap(Button.outReceive);;
  log(this.logs.receiveGiftsOneByOne);
  this.sleep(1000);

  var receivedCount = 0;
  var receiveCheckLimit = 1;

  var sender = undefined;
  var receiveTime = Date.now();
  while (this.isRunning) {
    var img = this.screenshot();
    var isItem = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 35);
    var isRuby = isSameColor(Button.outReceiveOneRuby.color, this.getColor(img, Button.outReceiveOneRuby), 24);
    var isNonItem = isSameColor(Button.outReceiveOne.color2, this.getColor(img, Button.outReceiveOne), 35);
    var isAd = isSameColor(Button.outReceiveOneAd.color, this.getColor(img, Button.outReceiveOneAd), 35);
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 35);
    var isTimeout = isSameColor(Button.outReceiveTimeout.color, this.getColor(img, Button.outReceiveTimeout), 35);
    releaseImage(img);
    if (isItem) {
      if (isAd) {
        this.skipAd();
        this.sleep(2000);
        continue;
      }
      if (!this.keepRuby || !isRuby) {
        if (this.recordReceive) {
          var img = this.screenshot();
          var isItem2 = isSameColor(Button.outReceiveOne.color, this.getColor(img, Button.outReceiveOne), 30);
          if (isItem2) {
            this.tap(Button.outReceiveOne);
            sender = this.recognizeSender(img);
          }
          releaseImage(img);
        }
        this.tap(Button.outReceiveOne);
      } else {
        isNonItem = true;
        receiveTime = 0;
      }
    } else if (isTimeout) {
      log(this.logs.receiveGiftAgain);
      this.tap(Button.outReceiveOk);
      this.sleep(1000);
    } else if (isOk) {
      if (this.recordReceive && sender != undefined) {
        if (sender != "") {
          this.countReceiveHeart(sender);
        }
        this.record['hearts_count'].receivedCount++;
        sender = undefined;
        this.saveRecord();
      }
      this.sleep(100);
      this.tap(Button.outReceiveOk);
      receivedCount++;
    } else {
      this.tap(Button.outReceiveClose);
    }
    this.sleep(200);

    if (!isNonItem) {
      receiveTime = Date.now();
    }
    
    if (Date.now() - receiveTime > 2000) {
      this.tap(Button.outClose);
      this.goFriendPage();
      this.sleep(500);
      if (receivedCount == 0 || receiveCheckLimit >= this.receiveCheckLimit) {
        log(this.logs.receivingGiftsCompleted);
        break;
      } else {
        receiveCheckLimit++;
        receivedCount = 0;
        sender = "";
        log(this.logs.checkUnreceivedGift);
        this.sleep(500);
        this.tap(Button.outReceive);
        this.sleep(1500);
      }
    }
  }
}

Tsum.prototype.friendPageGoTop = function() {
  this.tapDown({x: Button.outSendHeart3.x - 10 ,y: Button.outSendHeart0.y  }, 100);
  this.moveTo({x: Button.outSendHeart3.x - 10 ,y: Button.outSendHeart0.y  }, 100);
  this.moveTo({x: Button.outSendHeart0.x - 10, y: 350000}, 100);
  this.tapUp({x: Button.outSendHeart0.x - 10, y: 350000}, 100);
  this.sleep(2500);
}

Tsum.prototype.taskSendHearts = function() {
  log(this.logs.friendsPage);
  this.goFriendPage();
  log(this.logs.startSendingHearts);
  this.sleep(1000);
  if (this.sendHeartMaxDuring == 0) {
    this.friendPageGoTop();
    tap(0, 0); // Avoid overlap between zero score and pointer location
  }

  var startTime = Date.now();
  var retry = 0;
  var times = 0;
  while(this.isRunning) {
    times++;
    if (times % 15 == 14) {
      this.goFriendPage();
    }
    var hfx = Button.outSendHeartFrom.x;
    var hfy = Button.outSendHeartFrom.y - 40;
    var hty = Button.outSendHeartTo.y + 30;
    var heartsPos = [];

    var img = this.screenshot();
    var isOk = isSameColor(Button.outReceiveOk.color, this.getColor(img, Button.outReceiveOk), 40);
    for(var y = hfy; y <= hty; y += 8) {
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
    var isEnd2 = isSameColor(Button.outSendHeartEnd.color, this.getColor(img, Button.outSendHeartEnd), 40);
    var isEnd3 = isSameColor(Button.outSendHeartEnd3.color, this.getColor(img, Button.outSendHeartEnd3), 40);
    var isEnd = (!isNotEnd && isEnd2 && isEnd3);
    releaseImage(img);
    log(this.logs.sendingHearts, heartsPos.length, this.logs.sendingZeroScore);

    if (isOk && heartsPos.length == 0) {
      this.tap(Button.outReceiveOk);
    }

    if ((heartsPos.length == 0 && isEnd) || (!this.sentToZero && isZero && heartsPos.length != 0)) {
      if(retry < 3){
        this.tapDown({x: Button.outSendHeart3.x - 10 ,y: Button.outSendHeart3.y  }, 50);
        this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y  }, 50);
        this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y  }, 50);
        this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y  }, 50);
        this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y  }, 50);
        this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 500);
        this.tapUp  ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 100);
        retry++;
        log(this.logs.checkSendingHearts, retry);
        this.sleep(1000);
      } else {
        if (this.sendHeartMaxDuring != 0) {
          this.sleep(1000);
          this.friendPageGoTop();
        }
        break;
      }
    } else {
      var rTimes = 0;
      for (var h in heartsPos) {
        var success = this.sendHeart(heartsPos[h]);
        if (!success) {
          success = this.sendHeart(heartsPos[h]); 
        }
        if (success) {
          rTimes++;
          this.record['hearts_count'].sentCount++;
        } else {
          this.goFriendPage();
          this.sleep(1000);
        }
        if (!this.isRunning) {
          return;
        }
      }
      if (heartsPos.length != 0 && rTimes == 0) {
        continue;
      }
      if (this.recordReceive && heartsPos.length != 0) {
        this.saveRecord();
      }
      this.sleep(250);
      this.tapDown({x: Button.outSendHeart3.x - 10 ,y: Button.outSendHeart3.y  }, 50);
      this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart3.y  }, 50);
      this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart2.y  }, 50);
      this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart1.y  }, 50);
      this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeart0.y  }, 50);
      this.moveTo ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 400);
      this.tapUp  ({x: Button.outSendHeart3.x - 10, y: Button.outSendHeartTop.y}, 100);

      this.sleep(400);
      if (this.sendHeartMaxDuring != 0) {
        if (Date.now() - startTime > this.sendHeartMaxDuring) {
          log(this.logs.timeIsUp);
          break;
        }
      }
      if (heartsPos.length == 0 && isEnd2) {
        this.sleep(700); // end bug
      }
    }
  }
}

Tsum.prototype.sendHeart = function(btn) {
  var unknownCount = 0;
  var isSent = 0;
  var isClickedOk = false;
  var isGift = false;
  var isSent = false;
  // log("sendHeart");
  while (this.isRunning) {
    var page = this.findPage(1, 300);
    if (page == "FriendPage") {
      // log("sendHeart A", Date.now() / 1000);
      var img = this.screenshot();
      var isSendBtn = isSameColor(btn.color, this.getColor(img, btn), 40);
      var isSentBtn = isSameColor(btn.color2, this.getColor(img, btn), 40);
      releaseImage(img);
      if ((isSendBtn || !isSentBtn) && !isGift && !isSent) {
        // log("sendHeart A-A", Date.now() / 1000);
        this.tap(btn);
      } else {
        unknownCount += 1;
      }
    } else if (page == "GiftHeart") {
      this.tap(Button.outReceiveOk);
      isGift = true;
      // log("sendHeart B", Date.now() / 1000);
    } else if (page == "Received") {
      this.sleep(100);
      this.tap(Button.outSendHeartClose);
      // log("sendHeart C", Date.now() / 1000);
      if (isGift) {
        isSent = true;
        // log("sendHeart C-C", Date.now() / 1000);
        this.sleep(100);
        return true;
      }
    } else if (page == "FriendInfo") {
      this.tap(Page.FriendInfo.back);
    } else if (page == "ClosePage") {
      this.tap(Page.ClosePage.back);
      this.tap({x: 310, y: 1588 - 140});
    } else {
      unknownCount++;
    }
    if (unknownCount >= 15) {
      log(this.logs.UnknownState);
      return false;
    }
    // this.sleep(150);
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

function start(isJP, detect, autoLaunch, autoPlay, isSlowCalculation, isPause, clearBubbles, useFan, isFourTsum, coinItem, bubbleItem, enableAllItems, skillInterval, skillLevel, skillType, receiveItem, receiveItemInterval, receiveOneItem, keepRuby, receiveCheckLimit, receiveOneItemInterval, recordReceive, largeImage, sendHearts, sentToZero, sendHeartMaxDuring, sendHeartsInterval, isLocaleTW) {
  ts = new Tsum(isJP, detect, isLocaleTW ? LogsTW : Logs);
  log(ts.logs.start);
  ts.debug = false;
  if (isFourTsum) {
    ts.tsumCount = 4;
  }
  ts.autoLaunch = autoLaunch;
  ts.coinItem = coinItem;
  ts.bubbleItem = bubbleItem;
  ts.isSlowCalculation = isSlowCalculation;
  ts.isPause = isPause;
  ts.receiveOneItem = receiveOneItem;
  ts.recordReceive = recordReceive;
  ts.sentToZero = sentToZero;
  ts.receiveCheckLimit = receiveCheckLimit;
  ts.clearBubbles = clearBubbles;
  ts.enableAllItems = enableAllItems;
  ts.skillInterval = skillInterval * 1000;
  ts.skillLevel = skillLevel;
  ts.skillType = skillType;
  ts.receiveOneItem = receiveOneItem;
  ts.sendHearts = sendHearts;
  ts.showHeartLog = true;
  ts.keepRuby = keepRuby;
  ts.sendHeartMaxDuring = sendHeartMaxDuring * 60 * 1000;
  ts.useFan = useFan;
  if (largeImage) {
    ts.resizeRatio = 1;
  }
  
  if (ts.recordReceive) {
    ts.readRecord();
  }
  if (ts.record['hearts_count'] == undefined) {
    ts.record['hearts_count'] = {
      receivedCount: 0,
      sentCount: 0,
    };
  }
  
  if (!checkFunction(TaskController)) {
    console.log("File lose...");
    return;
  }

  gTaskController = new TaskController();
  if(receiveOneItem){gTaskController.newTask('receiveOneItem', ts.taskReceiveOneItem.bind(ts), receiveOneItemInterval * 60 * 1000, 0);}
  if(receiveItem){gTaskController.newTask('receiveItems', ts.taskReceiveAllItems.bind(ts), receiveItemInterval * 60 * 1000, 0);}
  if(sendHearts){gTaskController.newTask('sendHearts', ts.taskSendHearts.bind(ts), sendHeartsInterval * 60 * 1000, 0);}
  if (!isSlowCalculation && checkFunction(outRange)) {
    if(autoPlay){gTaskController.newTask('taskPlayGameQuick', ts.taskPlayGameQuick.bind(ts), 3 * 1000, 0);}
  } else {
    if (!isSlowCalculation) {
      log(ts.logs.updateApp);
      sleep(1000);
    }
    if(autoPlay){gTaskController.newTask('taskPlayGame', ts.taskPlayGame.bind(ts), 3 * 1000, 0);}
  }
  sleep(500);
  gTaskController.start();
  log(ts.logs.TaskControllerStop);
}

function stop() {
  log(ts.logs.stop);
  sleep(500);
  if (ts != undefined) {
    ts.isRunning = false;
    sleep(2000);
    // loop stop here...
    ts.deinit();
    if (ts.recordReceive) {
      ts.releaseRecord();
    }
  }
  if (gTaskController != undefined) {gTaskController.removeAllTasks();}
  if (gTaskController != undefined) {gTaskController.stop();}
  ts = undefined;
}

function genRecordTable() {
  console.log("Generate Record...");
  var recordFile = getStoragePath() + "/tsum_record/record.txt";
  var txt = readFile(recordFile);
  var record = {};
  if (txt != undefined && txt != "") {
    try {
      record = JSON.parse(txt);
    } catch(e) {
      return "Can not parse record.txt " + JSON.stringify(e);
    }
  } else {
    return "Can not read record.txt";
  }

  var html = "<html><body>";
  html += "<table>";
  html += "<tr><td>UserImage</td><td>UserImage2</td><td>All</td><td>Avg</td><td>Day</td></tr>";
  var dayMapCount = {};
  for (var filename in record) {
    if (filename == "hearts_count") {
      continue;
    }
    html += "<tr>";
    // user image
    html += "<td><img src='./" + filename + "' /></td>";
    // user image2
    var filePath = getStoragePath()+"/tsum_record/" + filename;
    var tmpImg = openImage(filePath);
    var base64 = getBase64FromImage(tmpImg);
    releaseImage(tmpImg);
    html += "<td><img src='data:image/png;base64," + base64 + "' /></td>";
    
    var totalDay = 0;
    var totalCount = 0;
    var tmpHtml = "";
    for (var day in record[filename].receiveCounts) {
      var dayTime = new Date(+day * 86400000);
      var dayStr = getDayTimeString(dayTime);
      var dayCount = record[filename].receiveCounts[day];

      if (dayMapCount[+day] === undefined) {dayMapCount[+day] = 0;}
      dayMapCount[+day] += dayCount;

      tmpHtml += "<td>" + dayStr + ":" + dayCount + "</td>";
      totalDay++;
      totalCount += dayCount;
    }
    var avg = 0;
    if (dayCount !== 0) {
      avg = (totalCount/dayCount).toFixed(1);
    }
    html += "<td>" + totalCount + "</td>";
    html += "<td>" + avg + "</td>";
    html += tmpHtml;
    html += "</tr>";
  }
  html += "</table>";
  html += "<br /> <br />";
  // day count
  html += "<table>";
  html += "<tr><td>Date</td><td>Hearts</td></tr>";
  for (var day in dayMapCount) {
    var dayTime = new Date(+day * 86400000);
    html += "<tr>";
    html += "<td>" + getDayTimeString(dayTime) + "</td>";
    html += "<td>" + dayMapCount[day] + "</td>";
    html += "</tr>";
  }
  html += "</table>";
  html += "</body></html>";
  var recordName = getRecordFilename();
  var oPath = getStoragePath() + "/tsum_record/" + recordName;
  writeFile(oPath, html);
  return "Download: " + getStoragePath()+"/tsum_record to PC" + "<br />Open: " + recordName;
}

function getDayTimeString(d) {
  return (d.getMonth()+1) + '/' + d.getDate();
}

function getRecordFilename() {
  var d = new Date();
  return 'recordTable_' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '.html';
}
