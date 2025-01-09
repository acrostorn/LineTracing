/** 
安藤式制御
FIXME: 置く位置によって初期条件設定 仮にWWで設定中

 */
// 制御パラメータ定義
let timeInterval = 1000 / 60
//  (1s/frameRatio) [ms]
let gain = 1
let defaultPower = 100
let initialDelta = 100
let deltaScaleRate = 0.1
// per frame
// maxPower = 200
// minPower = 50
//  条件式定義
let WW = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)
let WB = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)
let BW = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)
let BB = Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)
// 変数定義
let deltaScale = 0
let consecutiveCount = 0
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

// def sound():
// エラー処理
/** Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_STOP, 0)
    music.set_volume(40)
    music.play(music.string_playable("C5 F C5 F C5 F C5 F ", 120),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_string("SOS")
 */
// flowEntry
loops.everyInterval(timeInterval, function update() {
    let consecutiveCount: number;
    let deltaScale: number;
    let latestState: any;
    let currentState = WW ? "WW" : (WB ? "WB" : (BW ? "BW" : "BB"))
    // TODO: WWととBBの扱いは別にすべきかも
    // TODO: maxSpeed, minSpeedの適用
    // FIXME: WWが一定の期間続いたらエラーを出さなあかんね
    if (currentState == latestState) {
        consecutiveCount += 1
        deltaScale += WB ? deltaScaleRate : (BW ? -deltaScaleRate : 0)
    } else {
        consecutiveCount = 0
        latestState = currentState
        deltaScale = 0
    }
    
})
basic.forever(function main() {
    let rightPower = defaultPower + gain * (deltaScale * initialDelta)
    let leftPower = defaultPower - gain * (deltaScale * initialDelta)
    // stop関数作った方がいい
    move(leftPower, rightPower)
})
