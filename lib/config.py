import configparser
import platformdirs
import os
import sys
import cv2
import numpy
from datetime import datetime, timedelta

from lib.i18n import _


ANAME = "sevimon"
emotions = (_("Anger "), _("Contm."), _("Disgu."), _("Fear  "), _("Happs."), _("Neutr."), _("Sadns."), _("Surpr."))


class configclass:
    def __init__(self,):
        pass

# Simple sanity check for input string
# Args: input string, default array
def get_check_ints(sec, name, defv):
    try:
        s = sec.get(name)

        if not set(s).issubset(set(" \t,0123456789")):
            return defv

        res = [int(ele) for ele in s.split(',')]

        if (len(res) != len(defv)):
            return defv
    except Exception as exc:
        return defv

    return res


def get_check_floats(sec, name, defv):
    try:
        s = sec.get(name)

        if not set(s).issubset(set(" \t.,0123456789")):
            return defv

        res = [float(ele) for ele in s.split(',')]

        if (len(res) != len(defv)):
            return defv
    except Exception as exc:
        return defv

    return res


def get_check_bools(sec, name, defv):
    try:
        s = sec.get(name)

        if not set(s).issubset(set(" \t,TrueFalse")):
            return defv

        s = s.replace(' ', '').replace('\t', '')
        tmps = [ele for ele in s.split(',')]

        res = []
        for i in tmps:
            if i == "True":
                res.append(True)
            elif i == "False":
                res.append(False)
            else:
                return defv

        if (len(res) != len(defv)):
            return defv
    except Exception as exc:
        return defv

    return res


def readcfg() -> configclass:
    cfg = configclass()

    config = configparser.ConfigParser()
    configname = platformdirs.user_config_dir(ANAME) + "/" + ANAME + ".cfg"
    print(_("Trying to read the config file ") + configname)
    try:
        config.read(configname)
    except Exception as exc:
        pass

    try:
        section = config["common"]
    except:
        config.add_section("common")
        section = config["common"]
        pass

    cfg.camera_dev = get_check_ints(section,"camera_dev", [0])[0]
    cfg.res = get_check_ints(section,"res", [640, 480])
    cfg.fps = get_check_floats(section,"fps", [1.0])[0]
    cfg.wdelay = get_check_ints(section,"wdelay", [0])[0]

    cfg.showcap = get_check_bools(section,"showcap", [True])[0]
    cfg.allfaces = get_check_bools(section,"allfaces", [False])[0]

    cfg.writestat = get_check_bools(section,"writestat", [True])[0]

    cfg.wsize = get_check_ints(section,"wsize", [95])[0]
    cfg.wpos = get_check_ints(section,"wpos", [300, 150])
    cfg.wcolor = tuple(get_check_ints(section,"wcolor", [0, 255, 0]))

    cfg.showwarn = get_check_bools(section,"showwarn", [True])[0]
    cfg.beepwarn = get_check_bools(section,"beepwarn", [False])[0]

    cfg.wmax = get_check_floats(section,"wmax",
            [4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5])
    cfg.wmin = get_check_floats(section,"wmin",
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])

    cfg.wmaxen = get_check_bools(section,"wmaxen",
            [True, False, False, False, False, False, False, True])
    cfg.wminen = get_check_bools(section,"wminen",
            [False, False, False, False, False, False, False, False])

    return cfg


def writecfg(cfg) -> None:
    config = configparser.ConfigParser()
    configname = platformdirs.user_config_dir(ANAME) + "/" + ANAME + ".cfg"
    os.makedirs(platformdirs.user_config_dir(ANAME), exist_ok=True)

    with open(configname, 'w') as configfile:
        config.add_section("common")
        section = config["common"]
        section["camera_dev"] = str(cfg.camera_dev)
        section["res"] = str(cfg.res).replace('[', '').replace(']', '')
        section["fps"] = str(cfg.fps)
        section["wdelay"] = str(cfg.wdelay)
        section["showcap"] = str(cfg.showcap)
        section["allfaces"] = str(cfg.allfaces)
        section["writestat"] = str(cfg.writestat)
        section["wsize"] = str(cfg.wsize)
        section["wpos"] = str(cfg.wpos).replace('[', '').replace(']', '')
        section["wcolor"] = str(cfg.wcolor).replace('(', '').replace(')', '')
        section["showwarn"] = str(cfg.showwarn)
        section["beepwarn"] = str(cfg.beepwarn)
        section["wmax"] = str(cfg.wmax).replace('[', '').replace(']', '')
        section["wmin"] = str(cfg.wmin).replace('[', '').replace(']', '')
        section["wmaxen"] = str(cfg.wmaxen).replace('[', '').replace(']', '')
        section["wminen"] = str(cfg.wminen).replace('[', '').replace(']', '')

        if not os.path.exists(platformdirs.user_config_dir(ANAME)):
            os.makedirs(platformdirs.user_config_dir(ANAME))
        print(_("Writing to the config file ") + configname)
        config.write(configfile)

def writestat(cfg, i, scores) -> None:
    now = datetime.now()
    print(f'{now.strftime("%H:%M:%S")} ', end='')

    # Print scores
    emax = numpy.argmax(scores)
    print(f'[{i}]: {emotions[emax]}; ', end='')
    for e in range(len(emotions)):
        print(f'{emotions[e]}: {scores[e]:4.1f}', end='')
        if e < (len(emotions) - 1):
            print(f', ', end='')
        else:
            print('')

    # Write to logs
    if cfg.writestat:
        if not os.path.exists(platformdirs.user_log_dir(ANAME)):
            os.makedirs(platformdirs.user_log_dir(ANAME))
        fp = open(platformdirs.user_log_dir(ANAME) + "/" + now.strftime("%Y.%m.%d"), 'a')
        str = now.strftime("%H:%M:%S")
        for e in range(len(emotions)):
            str = str + " %4.1lf" % (scores[e])
        str = str + "\n"
        fp.write(str)
        fp.close()


#  Parameters:  configuration, scores, warning was set before
#               waring action was active before, last waring was turned on time
def warn_actions(cfg, scores, wws, wwact, wstime):
    # Check warning state and notify user
    wname = "Face warn"
    ws = False  # Warning state flag
    for e in range(len(emotions)):
        if cfg.wminen[e] and scores[e] < cfg.wmin[e]:
            ws = True
            break
        if cfg.wmaxen[e] and scores[e] > cfg.wmax[e]:
            ws = True
            break

    if wws is False and ws is True:  # If warning state is switched on
        wstime = datetime.now()  # Remember time

    # Set/reset warning action depending on warning state and it's timeout
    if ws and wstime + timedelta(seconds=cfg.wdelay) <= datetime.now():
        wact = True
    else:
        wact = False

    try:
        # Show warning window in case of:
        #     it's warning condition, it's on in cfg, has no warning window yet
        if wact and cfg.showwarn and not wwact:
            # Use OpenCV to avoid excess dependencies

            w = cfg.wsize
            h = cfg.wsize
            if sys.platform == 'darwin' and w < 200:
                # Mac OS doesn't allow windows width less than 200, so...
                w = 200

            wimg = numpy.zeros((h, w, 3), numpy.uint8)
            wimg = cv2.rectangle(wimg, (0, 0), (w - 1, h - 1), cfg.wcolor[::-1], -1)
            font = cv2.FONT_HERSHEY_SIMPLEX
            text = "!"
            linew = int(h / 32)
            textsize = cv2.getTextSize(text, font, 1, linew)[0]
            textx = int((wimg.shape[1] - textsize[0]) / 2)
            texty = int((wimg.shape[0] + textsize[1]) / 2)
            cv2.putText(wimg, "!", (textx, texty), font, 1, (0, 0, 0), linew)
            cv2.namedWindow(wname, cv2.WINDOW_NORMAL | cv2.WINDOW_FREERATIO | cv2.WINDOW_GUI_NORMAL)
            cv2.resizeWindow(wname, w, h)
            cv2.moveWindow(wname, cfg.wpos[0], cfg.wpos[1])
            cv2.setWindowProperty(wname, cv2.WND_PROP_TOPMOST, 1)
            cv2.imshow(wname, wimg)
        # Destroy warning window in case of:
        #     it's not to be shown (cfg and condition) and has previous window
        elif not (cfg.showwarn and wact) and wwact:
            cv2.destroyWindow(wname)

        if wact and cfg.beepwarn:
            # Generate system beep
            print("\a", end="")
    except Exception as exc:
        print(f'Warning: {exc}')

    return ws, wact, wstime
