let timeInterval = 500
// ms
let a = 0
let b = 0
let c = 0
let d = 0
loops.everyInterval(timeInterval, function on_every_interval() {
    
    if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)) {
        a += 1
    } else if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)) {
        b += 1
    } else if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)) {
        c += 1
    } else {
        d += 1
    }
    
})
basic.forever(function on_forever() {
    
    if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, 50)
    } else if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.White) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.Black)) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinRight, 60)
    } else if (Tinybit.Line_Sensor(Tinybit.enPos.LeftState, Tinybit.enLineState.Black) && Tinybit.Line_Sensor(Tinybit.enPos.RightState, Tinybit.enLineState.White)) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinLeft, 60)
    } else {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Stop, 0)
        music.setVolume(81)
        music.play(music.stringPlayable("C5 F C5 F C5 F C5 F ", 120), music.PlaybackMode.UntilDone)
        basic.showString("SOS")
    }
    
    if (a >= 20) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Stop, 0)
        music.setVolume(81)
        music.play(music.stringPlayable("C5 F C5 F C5 F C5 F ", 120), music.PlaybackMode.UntilDone)
        basic.showString("SOS")
        a = 0
    } else if (b >= 5) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinRight, 60)
        b = 0
    } else if (c >= 5) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinLeft, 60)
        c = 0
    } else {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, 50)
    }
    
})
