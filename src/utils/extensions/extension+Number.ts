interface Number {
    getMediaPlayTimeStamp():String
    adjustedV():number
    adjustedH():number
}
Number.prototype.getMediaPlayTimeStamp = function():String{
    const totalSeconds = this / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    const padWithZero = (number: Number) => `${number < 10 ? "0" : ""}${number}`;
    return padWithZero(minutes) + ":" + padWithZero(seconds);
}

Number.prototype.adjustedH = function():number{
 
    return 
}

Number.prototype.adjustedV = function():number{
    return 
}




