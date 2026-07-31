"""Machine control helper — drive the real Windows desktop (PyAutoGUI).
subcommands: shot | windows | focus <substr> | click <x> <y> | type <text> | key <k> | hotkey <k1> <k2>...
"""
import sys, os
os.makedirs('_tmp', exist_ok=True)
import pyautogui, pygetwindow as gw, pyperclip
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.25

def shot(path='_tmp/screen.png'):
    img = pyautogui.screenshot()
    img.save(path)
    try:
        aw = gw.getActiveWindow()
        print('ACTIVE:', aw.title if aw else None)
    except Exception as e:
        print('active?', e)
    print('SCREEN:', tuple(pyautogui.size()))
    print('SAVED', path)

def windows():
    out = []
    for w in gw.getAllWindows():
        t = w.title or ''
        if t and w.width > 50 and w.height > 50:
            out.append(f"{w.left},{w.top} {w.width}x{w.height}  | {t}")
    print('\n'.join(out))

def focus(sub):
    for w in gw.getAllWindows():
        if sub.lower() in (w.title or '').lower() and w.width > 50:
            try:
                if w.isMinimized:
                    w.restore()
                w.activate()
            except Exception:
                try:
                    w.minimize(); w.restore()
                except Exception:
                    pass
            print('FOCUSED:', w.title)
            return
    print('NOT FOUND:', sub)

def click(x, y, btn='left', clicks=1):
    pyautogui.click(int(x), int(y), button=btn, clicks=int(clicks))
    print('CLICK', x, y, btn)

def typetext(t):
    pyperclip.copy(t)
    pyautogui.hotkey('ctrl', 'v')
    print('TYPED', len(t), 'chars')

def key(k):
    pyautogui.press(k)
    print('KEY', k)

def hotkey(*ks):
    pyautogui.hotkey(*ks)
    print('HOTKEY', ks)

cmd = sys.argv[1] if len(sys.argv) > 1 else 'shot'
a = sys.argv[2:]
{'shot': lambda: shot(a[0] if a else '_tmp/screen.png'),
 'windows': windows,
 'focus': lambda: focus(a[0]),
 'click': lambda: click(a[0], a[1], a[2] if len(a) > 2 else 'left'),
 'type': lambda: typetext(' '.join(a)),
 'key': lambda: key(a[0]),
 'hotkey': lambda: hotkey(*a),
 'move': lambda: pyautogui.moveTo(int(a[0]), int(a[1])),
}[cmd]()
