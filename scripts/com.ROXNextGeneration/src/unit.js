function sameColor(color, target, range) {
    if (range == undefined) {
        range = 20;
    }
    if (
        color.r > target[0] - range &&
        color.r < target[0] + range &&
        color.g > target[1] - range &&
        color.g < target[1] + range &&
        color.b > target[2] - range &&
        color.b < target[2] + range
    ) {
        return true;
    }
    return false;
}

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
    if (Math.abs(c1.a - c2.a) > diff) {
        return false;
    }
    return true;
}

module.exports.sameColor = sameColor;
module.exports.isSameColor = isSameColor;