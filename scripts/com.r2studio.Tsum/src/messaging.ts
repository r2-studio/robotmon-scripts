// Utils for sending message
let _userPlan = -1;
let _lastSendingTime = 0;

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
  if (_userPlan === -1) {
    return false;
  }
  const during = Date.now() - _lastSendingTime;
  return _userPlan >= 0 && during > 60 * 60 * 1000;
}
function sendMessage(topMsg, msg) {
  if (canSendMessage()) {
    _lastSendingTime = Date.now();
    console.log(sendNormalMessage(topMsg, msg));
  }
}
checkCanSendMessage();

