"""
安藤式制御
FIXME: 置く位置によって初期条件設定
"""

#制御パラメータ定数定義
timeInterval = 1000/60             # (1s/frameRate) [ms]
gain = 1             
defaultPower = 100
initialDelta = 100
deltaScaleRate = 0.1               #微分値(d/df)
maxPower = 200
minPower = 0
emergencyRate = 100000

# 条件式定義
WW = Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE)
WB = Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.WHITE) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.BLACK)
BW = Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.BLACK) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.WHITE)
BB = Tinybit.Line_Sensor(Tinybit.enPos.LEFT_STATE, Tinybit.enLineState.BLACK) and Tinybit.Line_Sensor(Tinybit.enPos.RIGHT_STATE, Tinybit.enLineState.BLACK)

#変数定義
deltaScale = 0
consecutiveCount = 0
isEmergency = False
latestState = "WW" if WW else "WB" if WB else "BW" if BW else "BB"    #TODO: enumで書き直す

def update():
    #TODO: WWととBBの扱い
    currentState = "WW" if WW else "WB" if WB else "BW" if BW else "BB"

    if isEmergency:
        return

    #エラー処理処理
    if consecutiveCount > emergencyRate:
        emergency()

    if currentState == latestState :
        consecutiveCount += 1
        deltaScale += deltaScaleRate if WB else -deltaScaleRate if BW else 0
    else:
        consecutiveCount = 0
        latestState = currentState
        deltaScale = 0

def mainLoop():
    if not isEmergency:
        leftPower = defaultPower + gain * (deltaScale*initialDelta)
        rightPower = defaultPower - gain * (deltaScale*initialDelta)
        
        if leftPower >= maxPower:
            leftPower = maxPower
        elif leftPower <= minPower:
            leftPower = minPower
        
        if rightPower >= maxPower:
            rightPower = maxPower
        elif rightPower <= minPower:
            rightPower = minPower
    else:
        leftPower, rightPower = 0, 0

    move(leftPower, rightPower)

def move(leftPower: Float, rightPower: Float):
    #method1
    """powerGap = leftPower - rightPower
    if powerGap == 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_RUN, leftPower)
        basic.show_arrow(ArrowNames.NORTH)
    elif powerGap > 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINRIGHT, powerGap)
        basic.show_arrow(ArrowNames.NORTH_EAST)
    elif powerGap < 0:
        Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_SPINLEFT, abs(powerGap))
        basic.show_arrow(ArrowNames.NORTH_WEST)"""
    #method2
    """Tinybit.car_sport(leftPower, rightPower)"""
    #method3
    Tinybit.car_ctrl_speed2(Tinybit.CarState.CAR_RUN, leftPower, rightPower)

#エラー回復
def recoverEmergency():
    isEmergency = False

#エラー処理
def emergency():
    isEmergency = True
    Tinybit.car_ctrl_speed(Tinybit.CarState.CAR_STOP, 0)
    music.set_volume(40)
    music.play(music.string_playable("C5 F C5 F C5 F C5 F ", 120),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_string("SOS")

#def sound():

#flowEntry
basic.forever(mainLoop)
loops.every_interval(timeInterval, update)

"""
Q
・move method blockについて

"""