function getCommandItem(id, name, selection) {
  if (selection == undefined) {
    selection = "";
  }
  var result =
    '<div class="list-group-item">' +
    '<div class="commandTitle"><label class="cmdLabel" name="' +
    id +
    '">' +
    name +
    '</label><div class="commandControl">';
  if (selection != "") {
    result += '<button id="hideItem' + id + '" class="cmdButton">隱藏</button>';
  }
  result +=
    '<button id="moveItemUp' +
    id +
    '" class="cmdButton">上移</button>' +
    '<button id="moveItemDown' +
    id +
    '" class="cmdButton">下移</button>' +
    '<button id="removeItem' +
    id +
    '" class="cmdButton">刪除</button>' +
    "</div></div>" +
    '<div id="commandvalue' +
    id +
    '"><div class="command">' +
    selection +
    "</div></div>" +
    "</div>";
  return result;
}

function insertNewCommand(newCmd) {
  if (insertDirection == 1) {
    $("#skill-list").append(newCmd);
  } else {
    $("#skill-list").prepend(newCmd);
  }
  initCommandButton(commandId);
}

function initCommandButton(currentId) {
  $("#removeItem" + currentId).click(function () {
    $(this).parent().parent().parent().remove();
  });
  $("#hideItem" + currentId).click(function () {
    if ($("#commandvalue" + currentId).is(":visible")) {
      $(this).text("顯示");
      $("#commandvalue" + currentId).hide();
    } else {
      $(this).text("隱藏");
      $("#commandvalue" + currentId).show();
    }
  });
  $("#moveItemUp" + currentId).click(function () {
    var item = $(this).parent().parent().parent();
    var item2 = item.prev();
    if (item2.is("div")) {
      item2.before(item);
    }
  });
  $("#moveItemDown" + currentId).click(function () {
    var item = $(this).parent().parent().parent();
    var item2 = item.next();
    if (item2.is("div")) {
      item.before(item2);
    }
  });
}

//command html=============================
function getGetFriendPoint(id) {
  return getCommandItem(
    id,
    "友抽",
    "<div class='commandSelectDiv'>請移動到友抽頁面後再執行腳本</div>"
  );
}
function getGetBox(id) {
  return getCommandItem(
    id,
    "抽箱",
    "<div class='commandSelectDiv'>日服已內建自動換箱，台服連續抽箱請開啟自動重置</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>快速模式</div>" +
      '<select id = "getBoxFast' +
      id +
      '">' +
      '<option value = "0">關閉</option>' +
      '<option value = "1" selected>開啟</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>自動重置</div>" +
      '<select id = "getBoxReset' +
      id +
      '">' +
      '<option value = "0" selected>否</option>' +
      '<option value = "1">是</option></select></div>' +
      "<div class='commandSelectDiv'>台服注意:自動重置開啟時，中獎後會點擊重置按鈕，想抽乾前十箱請小心</div>"
  );
}

//out stage command
function getSelectStage(id) {
  if (server == "TW") {
    return getCommandItem(
      id,
      "選擇關卡",
      "<div class='commandSelectDiv'>開啟畫面上方的任務</div>" +
        "<div class='commandSelectDiv'>" +
        "<div class='commandItem'>自動吃果</div>" +
        '<select id = "autoApple' +
        id +
        '">' +
        '<option value = "-1" selected>無</option>' +
        '<option value = "0">銅蘋果</option>' +
        '<option value = "1">銀蘋果</option>' +
        '<option value = "2">金蘋果</option>' +
        '<option value = "4">自然回體</option>' +
        '<option value = "3">聖晶石</option></select></div>'
    );
  }else{
    return getCommandItem(
      id,
      "選擇關卡",
      "<div class='commandSelectDiv'>開啟畫面上方的任務</div>" +
        "<div class='commandSelectDiv'>" +
        "<div class='commandItem'>自動吃果</div>" +
        '<select id = "autoApple' +
        id +
        '">' +
        '<option value = "-1" selected>無</option>' +
        '<option value = "0">赤銅蘋果</option>' +
        '<option value = "5">青銅蘋果</option>' +
        '<option value = "1">銀蘋果</option>' +
        '<option value = "2">金蘋果</option>' +
        '<option value = "4">自然回體</option>' +
        '<option value = "3">聖晶石</option></select></div>'
    );

  }
}
function getSelectFriend(id) {
  return getCommandItem(
    id,
    "選擇好友",
    "<div class='commandSelectDiv'>如需篩選同一從者不同靈基，請使用\"好友從者多選\"指令</div>" +
      "<div class='commandSelectClassDiv'>" +
      "<div class='commandItem'>搜尋職階</div>" +
      '<div class="servantClassDiv2L">' +
      "<div class='servantClassDiv'>" +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend0' +
      id +
      '">全</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend1' +
      id +
      '">劍</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend2' +
      id +
      '">弓</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend3' +
      id +
      '">槍</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend4' +
      id +
      '">騎</div>' +
      "</div><div class='servantClassDiv'>" +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend5' +
      id +
      '">術</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend6' +
      id +
      '">殺</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend7' +
      id +
      '">狂</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend8' +
      id +
      '">特</div>' +
      '<div class="classDiv"><input type="checkbox" class = "servantClassBox" id = "selectFriend9' +
      id +
      '"checked>混</div></div></div></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "selectFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "selectFriendServantImg' +
      id +
      '"></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定禮裝</div>" +
      '<select id = "selectFriendItem' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendItemImg" id = "selectFriendItemImg' +
      id +
      '"></div>' +
      "<div class='commandSelectDiv'>建議優先使用遊戲內建的禮裝篩選</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定突滿</div>" +
      '<select id = "selectFriendItemFull' +
      id +
      '">' +
      '<option value = "0">不限制</option>' +
      '<option value = "1" selected>突滿</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>限定好友</div>" +
      '<select id = "selectFriendOnlyFriend' +
      id +
      '">' +
      '<option value = "0" selected>不限制</option>' +
      '<option value = "1">僅限好友</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>下拉次數</div>" +
      '<select id = "selectFriendScrollCnt' +
      id +
      '">' +
      '<option value = "-1" selected>到最後</option>' +
      '<option value = "0">不下拉</option>' +
      '<option value = "1">一次</option>' +
      '<option value = "2">兩次</option>' +
      '<option value = "3">三次</option></select></div>'
  );
}
function getSelectTeam(id) {
  return getCommandItem(
    id,
    "選擇隊伍",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>隊伍</div>" +
      '<select id = "selectTeam' +
      id +
      '">' +
      '<option value = "0" selected>隊伍1</option>' +
      '<option value = "1">隊伍2</option>' +
      '<option value = "2">隊伍3</option>' +
      '<option value = "3">隊伍4</option>' +
      '<option value = "4">隊伍5</option>' +
      '<option value = "5">隊伍6</option>' +
      '<option value = "6">隊伍7</option>' +
      '<option value = "7">隊伍8</option>' +
      '<option value = "8">隊伍9</option>' +
      '<option value = "9">隊伍10</option></select></div>'
  );
}
function getStartQuest(id) {
  return getCommandItem(
    id,
    "進入關卡",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>使用活動道具</div>" +
      '<select id = "useItem' +
      id +
      '">' +
      '<option value = "-1" selected>不使用</option>' +
      '<option value = "0">一</option>' +
      '<option value = "1">二</option>' +
      '<option value = "2">三</option>' +
      '<option value = "3">四</option>' +
      '<option value = "4">五</option>' +
      '<option value = "5">六</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>檢查開場演出</div>" +
      '<select id = "checkStageLoadFinish' +
      id +
      '">' +
      '<option value = "0" selected>不檢查</option>' +
      '<option value = "1">檢查</option></select></div>' +
      "<div class='commandSelectDiv'>如果討伐戰有開場演出，請打開檢查開場演出</div>"
  );
}
//in stage command
function getAutoItem(id) {
  return getCommandItem(
    id,
    "自動戰鬥",
    //
    "<div class='commandSelectDiv'>" +
      "<div class='commandItemShort'>直到</div>" +
      '<select id = "autoFightUntil' +
      id +
      '">' +
      '<option value = "3" selected>關卡結束</option>' +
      '<option value = "1">第一波結束</option>' +
      '<option value = "2">第二波結束</option>' +
      '<option value = "0">只跑一回合</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItemShort'>弱點</div>" +
      '<select id = "autoFightWeak' +
      id +
      '">' +
      '<option value = "0">完全無視</option>' +
      '<option value = "1" selected>基本權重</option>' +
      '<option value = "2">弱點優先</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItemShort'>同色串</div>" +
      '<select id = "autoFightSameColor' +
      id +
      '">' +
      '<option value = "0">完全無視</option>' +
      '<option value = "1" selected>基本權重</option>' +
      '<option value = "2">同色優先</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>優先選擇卡片顏色</div>" +
      '<select id = "autoFightColor' +
      id +
      '">' +
      '<option value = "0" selected>紅 Break</option>' +
      '<option value = "1">藍 Arts</option>' +
      '<option value = "2">綠 Quick</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>後備角色上場時</div>" +
      '<select id = "autoFightDie' +
      id +
      '">' +
      '<option value = "0">停止腳本</option>' +
      '<option value = "1">使用技能</option>' +
      '<option value = "2">不使用技能</option>' +
      '<option value = "3" selected>不檢查</option></select></div>' +
      //
      "<div class='commandSelectDiv'>御主技能設定</div>" +
      getAutoServantSkillItem(id, "autoCloth") +
      //
      "<div class='commandSelectDiv'>從者一設定</div>" +
      getAutoServantUltItem(id, "servant0") +
      getAutoServantSkillItem(id, "servant0") +
      "<div class='commandSelectDiv'>從者二設定</div>" +
      getAutoServantUltItem(id, "servant1") +
      getAutoServantSkillItem(id, "servant1") +
      "<div class='commandSelectDiv'>從者三設定</div>" +
      getAutoServantUltItem(id, "servant2") +
      getAutoServantSkillItem(id, "servant2")
  );
}

function getAutoServantSkillItem(id, user) {
  return (
    "<div class='commandSelectDiv'>" +
    "<div class='skillDiv'><div class='commandServantSkillTitle'>技能一</div>" +
    '<select id = "' +
    user +
    "skill0" +
    id +
    '">' +
    '<option value = "-1" selected>不使用</option>' +
    '<option value = "0">自動使用</option>' +
    '<option value = "1">第二波開始使用</option>' +
    '<option value = "2">第三波開始使用</option></select>' +
    "<div class='commandServantSkillTitle'>對象</div>" +
    '<select id = "' +
    user +
    "skill0target" +
    id +
    '">' +
    '<option value = "-1" selected>無</option>' +
    '<option value = "0">從者1</option>' +
    '<option value = "1">從者2</option>' +
    '<option value = "2">從者3</option></select></div></div>' +
    //
    "<div class='commandSelectDiv'>" +
    "<div class='skillDiv'><div class='commandServantSkillTitle'>技能二</div>" +
    '<select id = "' +
    user +
    "skill1" +
    id +
    '">' +
    '<option value = "-1" selected>不使用</option>' +
    '<option value = "0">自動使用</option>' +
    '<option value = "1">第二波開始使用</option>' +
    '<option value = "2">第三波開始使用</option></select>' +
    "<div class='commandServantSkillTitle'>對象</div>" +
    '<select id = "' +
    user +
    "skill1target" +
    id +
    '">' +
    '<option value = "-1" selected>無</option>' +
    '<option value = "0">從者1</option>' +
    '<option value = "1">從者2</option>' +
    '<option value = "2">從者3</option></select></div></div>' +
    //
    "<div class='commandSelectDiv'>" +
    "<div class='skillDiv'><div class='commandServantSkillTitle'>技能三</div>" +
    '<select id = "' +
    user +
    "skill2" +
    id +
    '">' +
    '<option value = "-1" selected>不使用</option>' +
    '<option value = "0">自動使用</option>' +
    '<option value = "1">第二波開始使用</option>' +
    '<option value = "2">第三波開始使用</option></select>' +
    "<div class='commandServantSkillTitle'>對象</div>" +
    '<select id = "' +
    user +
    "skill2target" +
    id +
    '">' +
    '<option value = "-1" selected>無</option>' +
    '<option value = "0">從者1</option>' +
    '<option value = "1">從者2</option>' +
    '<option value = "2">從者3</option></select></div></div>'
  );
}

function getAutoServantUltItem(id, user) {
  return (
    "<div class='commandSelectDiv'>" +
    "<div class='commandServantSkillTitle'>寶具</div>" +
    '<select id = "' +
    user +
    "ult" +
    id +
    '">' +
    '<option value = "-1">不使用</option>' +
    '<option value = "0" selected>自動使用</option>' +
    '<option value = "1">第二波開始使用</option>' +
    '<option value = "2">第三波開始使用</option></select></div>'
  );
}

function getUseSkillItem(id) {
  return getCommandItem(
    id,
    "使用技能",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>從者</div>" +
      '<select id = "useSkillServant' +
      id +
      '">' +
      '<option value = "0" selected>從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>技能</div>" +
      '<select id = "useSkill' +
      id +
      '">' +
      '<option value = "0" selected>技能1</option>' +
      '<option value = "1">技能2</option>' +
      '<option value = "2">技能3</option></select></div>' +
      //
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>對象</div>" +
      '<select id = "useSkillTarget' +
      id +
      '">' +
      '<option value = "-1"selected>無</option>' +
      '<option value = "0">從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select>'
  );
}
function getClothItem(id) {
  return getCommandItem(
    id,
    "使用御主技能",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>技能</div>" +
      '<select id = "clothSkill' +
      id +
      '">' +
      '<option value = "0" selected>技能1</option>' +
      '<option value = "1">技能2</option>' +
      '<option value = "2">技能3</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>對象</div>" +
      '<select id = "clothSkillTarget' +
      id +
      '">' +
      '<option value = "-1"selected>無</option>' +
      '<option value = "0">從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>'
  );
}
function getSwitchServantItem(id) {
  return getCommandItem(
    id,
    "戰鬥服換人",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>前場從者</div>" +
      '<select id = "switchServantFront' +
      id +
      '">' +
      '<option value = "0"selected>從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>' +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>後場從者</div>" +
      '<select id = "switchServantBack' +
      id +
      '">' +
      '<option value = "3"selected>從者4</option>' +
      '<option value = "4">從者5</option>' +
      '<option value = "5">從者6</option></select></div>'
  );
}
function getSelectEnemy(id) {
  return getCommandItem(
    id,
    "選擇敵人",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>敵人(右上為1)</div>" +
      '<select id = "selectEnemy' +
      id +
      '">' +
      '<option value = "0">敵人1</option>' +
      '<option value = "1">敵人2</option>' +
      '<option value = "2">敵人3</option>' +
      '<option value = "3">敵人4</option>' +
      '<option value = "4">敵人5</option>' +
      '<option value = "5">敵人6</option></select></div>'
  );
}
function getStartAttackItem(id) {
  return getCommandItem(id, "開始選卡");
}
function getUseUltItem(id) {
  return getCommandItem(
    id,
    "使用寶具",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>寶具</div>" +
      '<select id = "useUlt' +
      id +
      '">' +
      '<option value = "0">從者1</option>' +
      '<option value = "1">從者2</option>' +
      '<option value = "2">從者3</option></select></div>'
  );
}
function getSelectCardItem(id) {
  return getCommandItem(
    id,
    "選擇卡片",
    "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>卡片</div>" +
      '<select id = "selectCard' +
      id +
      '">' +
      '<option value = "0">卡片1</option>' +
      '<option value = "1">卡片2</option>' +
      '<option value = "2">卡片3</option>' +
      '<option value = "3">卡片4</option>' +
      '<option value = "4">卡片5</option></select></div>'
  );
}
function getFinishItem(id) {
  return getCommandItem(id, "結束關卡");
}

//other command
function getSpaceUltItem(id) {
  return getCommandItem(
    id,
    "技能改變寶具顏色",
    "<div class='commandSelectDiv'>請將此指令放在最上面</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>寶具顏色</div>" +
      '<select id = "spaceUltColor' +
      id +
      '">' +
      '<option value = "2" selected>綠</option>' +
      '<option value = "1">藍</option>' +
      '<option value = "0">紅</option></select></div>'
  );
}

function getAdditionalFriendServent(id) {
  return getCommandItem(
    id,
    "好友從者多選",
    "<div class='commandSelectDiv'>請將此指令放在選擇好友指令之前，會從全部的指定從者中做選擇</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "additionalFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "additionalFriendServantImg' +
      id +
      '"></div>'
  );
}

/*
function getAdditionalFriendItem(id) {
  return getCommandItem(
    id,
    "好友禮裝多選",
    "<div class='commandSelectDiv'>敘述</div>" +
      "<div class='commandSelectDiv'>" +
      "<div class='commandItem'>指定從者</div>" +
      '<select id = "additionalFriendServant' +
      id +
      '">' +
      '<option value = "-1" selected>無</option></select>' +
      '<img class = "selectFriendServantImg" id = "additionalFriendServantImg' +
      id +
      '"></div>'
  );
}
*/
