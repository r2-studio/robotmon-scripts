function addAuto(commandId, content) {
  insertNewCommand(getAutoItem(commandId));

  $("#autoFightUntil" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "resolve",
    width: "160px",
  });
  $("#autoFightColor" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightSameColor" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightWeak" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  $("#autoFightDie" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "160px",
  });
  for (var i = 0; i < 3; i++) {
    $("#autoClothskill" + i + commandId).select2({
      minimumResultsForSearch: -1,
      width: "120px",
    });
    $("#autoClothskill" + i + "target" + commandId).select2({
      minimumResultsForSearch: -1,
      width: "64px",
    });

    $("#servant" + i + "ult" + commandId).select2({
      minimumResultsForSearch: -1,
      width: "160px",
    });

    for (var j = 0; j < 3; j++) {
      $("#servant" + i + "skill" + j + commandId).select2({
        minimumResultsForSearch: -1,
        width: "120px",
      });
      $("#servant" + i + "skill" + j + "target" + commandId).select2({
        minimumResultsForSearch: -1,
        width: "64px",
      });
    }
  }

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#autoFightUntil" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#autoFightColor" + commandId)
    .val(scriptValue[1])
    .trigger("change");
  $("#autoFightSameColor" + commandId)
    .val(scriptValue[2])
    .trigger("change");
  $("#autoFightWeak" + commandId)
    .val(scriptValue[3])
    .trigger("change");
  $("#autoFightDie" + commandId)
    .val(scriptValue[4])
    .trigger("change");

  for (var i = 0; i < 3; i++) {
    if (scriptValue.length > 27) {
      $("#autoClothskill" + i + commandId)
        .val(scriptValue[27 + 2 * i])
        .trigger("change");
      $("#autoClothskill" + i + "target" + commandId)
        .val(scriptValue[27 + 2 * i + 1])
        .trigger("change");
    }

    $("#servant" + i + "ult" + commandId)
      .val(scriptValue[5 + 7 * i])
      .trigger("change");
    for (var j = 0; j < 3; j++) {
      $("#servant" + i + "skill" + j + commandId)
        .val(scriptValue[5 + 7 * i + 1 + j * 2])
        .trigger("change");
      $("#servant" + i + "skill" + j + "target" + commandId)
        .val(scriptValue[5 + 7 * i + 1 + j * 2 + 1])
        .trigger("change");
    }
  }
}

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

function getAutoScript(itemId) {
  var result =
    "autoAttack(" +
    $("#autoFightUntil" + itemId).val() +
    "," +
    $("#autoFightColor" + itemId).val() +
    "," +
    $("#autoFightSameColor" + itemId).val() +
    "," +
    $("#autoFightWeak" + itemId).val() +
    "," +
    $("#autoFightDie" + itemId).val();
  for (var i = 0; i < 3; i++) {
    result += "," + $("#servant" + i + "ult" + itemId).val();
    for (var j = 0; j < 3; j++) {
      result += "," + $("#servant" + i + "skill" + j + itemId).val();
      result += "," + $("#servant" + i + "skill" + j + "target" + itemId).val();
    }
  }

  // result+=","+$("#ultColor"+itemId).val();
  result += ",false";
  for (var i = 0; i < 3; i++) {
    result += "," + $("#autoClothskill" + i + itemId).val();
    result += "," + $("#autoClothskill" + i + "target" + itemId).val();
  }

  result += ");";
  return result;
}
