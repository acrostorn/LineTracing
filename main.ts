/** 
安藤式制御
FIXME: 置く位置によって初期条件設定

 */
// 制御パラメータ定数定義
let timeInterval = 1000 / 60
//  (1s/frameRate) [ms]
let gain = 1
let defaultPower = 100
let initialDelta = 100
let deltaScaleRate = 0.1
// 微分値(d/df)
let maxPower = 200
let minPower = 0
let emergencyRate = 100000
//  条件式定義
let WW = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)
let WB = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)
let BW = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)
let BB = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)
// 変数定義
let deltaScale = 0
let consecutiveCount = 0
let isEmergency = false
let latestState = WW ? "WW" : (WB ? "WB" : (BW ? "BW" : "BB"))
// TODO: enumで書き直す
function move(leftPower: number, rightPower: number) {
    // method1
    /** powerGap = leftPower - rightPower
    if powerGap == 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_RUN, leftPower)
        basic.show_arrow(ArrowNames.NORTH)
    elif powerGap > 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINRIGHT, powerGap)
        basic.show_arrow(ArrowNames.NORTH_EAST)
    elif powerGap < 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINLEFT, abs(powerGap))
        basic.show_arrow(ArrowNames.NORTH_WEST)
 */
    // method2
    /** Tinybit.car_sport(leftPower, rightPower) */
    // method3
    Tinybit.CarCtrlSpeed2(Tinybit.CarState.Car_Run, leftPower, rightPower)
}

// エラー回復
function recoverEmergency() {
    let isEmergency = false
}

// エラー処理
function emergency() {
    let isEmergency = true
    Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Stop, 0)
    music.setVolume(40)
    music.play(music.stringPlayable("C5 F C5 F C5 F C5 F ", 120), music.PlaybackMode.UntilDone)
    basic.showString("SOS")
}

// def sound():
// flowEntry
basic.forever(function mainLoop() {
    let leftPower: number;
    let rightPower: number;
    if (!isEmergency) {
        leftPower = defaultPower + gain * (deltaScale * initialDelta)
        rightPower = defaultPower - gain * (deltaScale * initialDelta)
        if (leftPower >= maxPower) {
            leftPower = maxPower
        } else if (leftPower <= minPower) {
            leftPower = minPower
        }
        
        if (rightPower >= maxPower) {
            rightPower = maxPower
        } else if (rightPower <= minPower) {
            rightPower = minPower
        }
        
    } else {
        let [leftPower, rightPower] = [0, 0]
    }
    
    move(leftPower, rightPower)
})
loops.everyInterval(timeInterval, function update() {
    let consecutiveCount: number;
    let deltaScale: number;
    let latestState: any;
    // TODO: WWととBBの扱い
    let currentState = WW ? "WW" : (WB ? "WB" : (BW ? "BW" : "BB"))
    if (isEmergency) {
        return
    }
    
    // エラー処理処理
    if (consecutiveCount > emergencyRate) {
        emergency()
    }
    
    if (currentState == latestState) {
        consecutiveCount += 1
        deltaScale += WB ? deltaScaleRate : (BW ? -deltaScaleRate : 0)
    } else {
        consecutiveCount = 0
        latestState = currentState
        deltaScale = 0
    }
    
})
/** 
Q
・move method blockについて


 */
