function addAutoV2(commandId, content) {
  insertNewCommand(getAutoV2Item(commandId));

  $("#autoFightUntil" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "resolve",
    width: "160px",
  });
  // Card order buttons event handlers
  $(".cardOrderBtn").off("click").on("click", function () {
    var btnId = $(this).attr("id");
    var cmdId = btnId.replace(/cardOrder(Clear|[BAQN])/g, "");
    var displayElement = $("#cardOrderDisplay" + cmdId);

    // 從data attribute或顯示的文字內容中獲取當前順序
    var currentOrder = displayElement.data("cardOrder") || "";
    console.log("卡片順序按鈕點擊: btnId=" + btnId + ", cmdId=" + cmdId + ", currentOrder=" + currentOrder);

    var newOrder;
    if ($(this).text() === "清空") {
      newOrder = "";
      console.log("執行清空操作");
    } else {
      var card = $(this).data("card") || $(this).text();
      console.log("選擇的卡片: " + card);

      if (currentOrder === "") {
        newOrder = card;
        console.log("初始設定卡片: " + newOrder);
      } else if (currentOrder.length < 6) {
        newOrder = currentOrder + card;
        console.log("追加卡片: " + newOrder);
      } else {
        console.log("卡片順序已達上限6個，不執行動作");
        return; // 如果長度已達6，不執行任何動作
      }
    }

    // 儲存新的順序並更新顯示
    displayElement.data("cardOrder", newOrder);
    console.log("儲存新的卡片順序: " + newOrder);
    updateCardOrderDisplay(cmdId, newOrder);
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

  // 初始化預設卡片順序顯示
  if (content == undefined) {
    var defaultOrder = "NNNBBB";
    console.log("AutoCommand初始化: commandId=" + commandId + ", 使用預設卡片順序=" + defaultOrder);
    $("#cardOrderDisplay" + commandId).data("cardOrder", defaultOrder);
    updateCardOrderDisplay(commandId, defaultOrder);
    return;
  }

  var scriptValue = content.split(",");
  $("#autoFightUntil" + commandId)
    .val(scriptValue[0])
    .trigger("change");

  var cardOrderValue = scriptValue[1].replace(/["]/g, "");
  $("#cardOrderDisplay" + commandId).data("cardOrder", cardOrderValue);
  updateCardOrderDisplay(commandId, cardOrderValue);

  $("#autoFightDie" + commandId)
    .val(scriptValue[2])
    .trigger("change");

  for (var i = 0; i < 3; i++) {
    if (scriptValue.length > 24) {
      $("#autoClothskill" + i + commandId)
        .val(scriptValue[24 + 2 * i])
        .trigger("change");
      $("#autoClothskill" + i + "target" + commandId)
        .val(scriptValue[24 + 2 * i + 1])
        .trigger("change");
    }

    $("#servant" + i + "ult" + commandId)
      .val(scriptValue[3 + 7 * i])
      .trigger("change");
    for (var j = 0; j < 3; j++) {
      $("#servant" + i + "skill" + j + commandId)
        .val(scriptValue[3 + 7 * i + 1 + j * 2])
        .trigger("change");
      $("#servant" + i + "skill" + j + "target" + commandId)
        .val(scriptValue[3 + 7 * i + 1 + j * 2 + 1])
        .trigger("change");
    }
  }
}

function getAutoV2Item(id) {
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
    //
    "<div class='commandSelectDiv'>" +
    "<div class='commandItem'>卡片選擇順序</div>" +
    '<div id="cardOrderDisplay' + id + '" class="commandItem" style="border: 1px solid #ccc; padding: 2px; background-color: #f9f9f9; min-width: 50px; display: flex; flex-wrap: wrap;"></div>' +
    '</div>' +
    '<button id="cardOrderB' + id + '" class="cardOrderBtn" data-card="B" style="margin: 2px;">B</button>' +
    '<button id="cardOrderA' + id + '" class="cardOrderBtn" data-card="A" style="margin: 2px;">A</button>' +
    '<button id="cardOrderQ' + id + '" class="cardOrderBtn" data-card="Q" style="margin: 2px;">Q</button>' +
    '<button id="cardOrderN' + id + '" class="cardOrderBtn" data-card="N" style="margin: 2px;">寶具</button>' +
    '<button id="cardOrderClear' + id + '" class="cardOrderBtn" style="margin: 2px;">清空</button>' +
    "<div class='commandSelectDiv'>沒有可施放的寶具時會跳過寶具，指定卡片顏色找不到時會任選一張</div>" +
    "<div class='commandSelectDiv'>例：NNNBBB 為 先施放寶具，然後優先選擇B卡</div>" +
    '</div>' +
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
    getAutoV2ServantSkillItem(id, "autoCloth") +
    //
    "<div class='commandSelectDiv'>從者一設定</div>" +
    getAutoV2ServantUltItem(id, "servant0") +
    getAutoV2ServantSkillItem(id, "servant0") +
    "<div class='commandSelectDiv'>從者二設定</div>" +
    getAutoV2ServantUltItem(id, "servant1") +
    getAutoV2ServantSkillItem(id, "servant1") +
    "<div class='commandSelectDiv'>從者三設定</div>" +
    getAutoV2ServantUltItem(id, "servant2") +
    getAutoV2ServantSkillItem(id, "servant2")
  );
}

function getAutoV2ServantSkillItem(id, user) {
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

function getAutoV2ServantUltItem(id, user) {
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

function getAutoV2Script(itemId) {
  var cardOrder = $("#cardOrderDisplay" + itemId).data("cardOrder") || "";
  console.log("生成AutoCommandV2腳本: itemId=" + itemId + ", cardOrder=" + cardOrder);
  var result =
    "autoAttackV2(" +
    $("#autoFightUntil" + itemId).val() +    
    ',"' +
    cardOrder +
    '",' +
    $("#autoFightDie" + itemId).val();
  for (var i = 0; i < 3; i++) {
    result += "," + $("#servant" + i + "ult" + itemId).val();
    for (var j = 0; j < 3; j++) {
      result += "," + $("#servant" + i + "skill" + j + itemId).val();
      result += "," + $("#servant" + i + "skill" + j + "target" + itemId).val();
    }
  }
  for (var i = 0; i < 3; i++) {
    result += "," + $("#autoClothskill" + i + itemId).val();
    result += "," + $("#autoClothskill" + i + "target" + itemId).val();
  }

  result += ");";
  return result;
}

function updateCardOrderDisplay(commandId, cardOrder) {
  console.log("updateCardOrderDisplay: commandId=" + commandId + ", cardOrder=" + cardOrder);
  var displayElement = $("#cardOrderDisplay" + commandId);
  var colorMap = {
    'B': '#F4450A', // 紅色
    'A': '#1E7CFF', // 藍色  
    'Q': '#1AC710', // 綠色
    'N': '#d5d52aff'  // 黃色
  };

  var html = '';
  for (var i = 0; i < cardOrder.length; i++) {
    var char = cardOrder.charAt(i);
    var color = colorMap[char] || '#dddddd';
    html += '<span style="background-color: ' + color + '; padding: 2px 4px; margin: 1px; border-radius: 3px; color: #000; font-weight: bold;">' + char + '</span>';
  }

  if (html === '') {
    html = '<span style="color: #999; font-style: italic;">空白</span>';
    console.log("updateCardOrderDisplay: 顯示空白狀態");
  }

  displayElement.html(html);
  console.log("updateCardOrderDisplay: 已更新顯示，HTML=" + html);
}