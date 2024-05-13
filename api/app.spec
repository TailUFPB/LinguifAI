# -*- mode: python ; coding: utf-8 -*-

# Import necessary modules
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import collect_submodules
from PyInstaller.utils.hooks import collect_dynamic_libs

# Specify the entry point Python script
entry_point = 'api/app.py'

# Collect necessary data files and binaries
datas = collect_data_files('sklearn')
hiddenimports = collect_submodules('sklearn')
binaries = collect_dynamic_libs('sklearn')

# Define Analysis configuration
a = Analysis(
    [entry_point],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
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
    binaries,
    datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='app',
)
