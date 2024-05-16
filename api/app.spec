# -*- mode: python ; coding: utf-8 -*-

# Specify the entry point Python script
entry_point = 'app.py'

# Collect necessary data files and binaries
# Define Analysis configuration
a = Analysis(
    [entry_point],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

# Define PYZ (Python Zip) configuration
pyz = PYZ(a.pure)

# Define EXE (Executable) configuration
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

# Define COLLECT configuration
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='app',
)
