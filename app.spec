# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['api\\app.py'],
    pathex=[],
    binaries=[], #  pathex=['C:\\Users\\camer\\anaconda3\\envs\\LinguifAI\\Lib\\site-packages', 'C:\\Users\\camer\\AppData\\Roaming\\Python\\Python310\\site-packages\\sklearn'],
    datas=[],
    hiddenimports=['sklearn'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='app',
)
