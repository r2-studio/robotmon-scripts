function Utils() {}

Utils.exist = function(v) {
  if (typeof v !== 'undefined') {
    return true;
  }
  return false;
}

Utils.userPlan = -1;
Utils.lastSendTime = 0;

Utils.canSendMessage = function() {
  Utils.userPlan = -1;
  if (Utils.exist(getUserPlan) && Utils.exist(sendNormalMessage)) {
    Utils.userPlan = getUserPlan();
  }
  if (Utils.userPlan === -1) {
    console.log('Can not send message, should login');
    return false;
  }
  return true;
}

Utils.sendNormalMessage = function() {
  if (Utils.canSendMessage()) {
    console.log(sendNormalMessage(topMsg, msg));
  }
}

Utils.sendUrgentMessage = function() {
  if (Utils.canSendMessage()) {
    console.log(sendUrgentMessage(topMsg, msg));
  }
}