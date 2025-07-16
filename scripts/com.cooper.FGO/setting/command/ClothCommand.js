function addCloth(commandId, content) {
  //handle old version
  if (content != undefined) {
    var test = content.split(",");
    if (test.length >= 3 && test[0] == 2 && test[2] != -1) {
      var newContext = test[1] + "," + test[2];
      addSwitchServant(commandId, newContext);
      return;
    }
  }

  insertNewCommand(getClothItem(commandId));

  $("#clothSkill" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#clothSkillTarget" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#clothSkill" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#clothSkillTarget" + commandId)
    .val(scriptValue[1])
    .trigger("change");
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

function getClothScript(itemId) {
  return (
    "useClothesSkill(" +
    $("#clothSkill" + itemId).val() +
    "," +
    $("#clothSkillTarget" + itemId).val() +
    ");"
  );
}
