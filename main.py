timeInterval = 500 #ms


a = 0
b = 0
c = 0
d = 0

def on_every_interval():
    global a, b, c, d
    if Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE):
        a += 1
    elif Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.BLACK):
        b += 1
    elif Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.BLACK) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE):
        c += 1
    else:
        d += 1
loops.every_interval(timeInterval, on_every_interval)

def on_forever():
    global a, b, c
    if Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE):
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_RUN, 50)
    elif Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.BLACK):
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINRIGHT, 60)
    elif Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.BLACK) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE):
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINLEFT, 60)
    else:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_STOP, 0)
        music.set_volume(81)
        music.play(music.string_playable("C5 F C5 F C5 F C5 F ", 120),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_string("SOS")
    if a >= 20:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_STOP, 0)
        music.set_volume(81)
        music.play(music.string_playable("C5 F C5 F C5 F C5 F ", 120),
            music.PlaybackMode.UNTIL_DONE)
        basic.show_string("SOS")
        a = 0
    elif b >= 5:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINRIGHT, 60)
        b = 0
    elif c >= 5:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINLEFT, 60)
        c = 0
    else:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_RUN, 50)
basic.forever(on_forever)
