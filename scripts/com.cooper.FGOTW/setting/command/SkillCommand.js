function addSkill(commandId, content) {
  insertNewCommand(getUseSkillItem(commandId));

  $("#useSkillServant" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#useSkill" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });
  $("#useSkillTarget" + commandId).select2({
    minimumResultsForSearch: -1,
    width: "120px",
  });

  if (content == undefined) {
    return;
  }
  var scriptValue = content.split(",");
  $("#useSkillServant" + commandId)
    .val(scriptValue[0])
    .trigger("change");
  $("#useSkill" + commandId)
    .val(scriptValue[1])
    .trigger("change");
  $("#useSkillTarget" + commandId)
    .val(scriptValue[2])
    .trigger("change");
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

function getSkillScript(itemId) {
  return (
    "useSkill(" +
    $("#useSkillServant" + itemId).val() +
    "," +
    $("#useSkill" + itemId).val() +
    "," +
    $("#useSkillTarget" + itemId).val() +
    ");"
  );
}
