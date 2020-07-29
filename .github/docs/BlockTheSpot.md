## BlockTheSpot

A PowerShell script to install [BlockTheSpot](https://github.com/mrpond/BlockTheSpot/)

BlockTheSpot is a patch for Spotify (Win32 only) that disables all banner and midroll Ads.

### Quick Start

```bash
iwr https://tools.maximousblk.now.sh/BlockTheSpot.ps1 | iex
```

### Usage

**Install:**

To install BlockTheSpot, run the following command in PowerShell

```bash
iwr https://tools.maximousblk.now.sh/BlockTheSpot.ps1 | iex
```

This will download and replace `chrome_elf.dll` with the patched binary.

This script also creates a backup of the original binary so that if you liked ads you can undo the patch.

**Uninstall:**

To uninstall BlockTheSpot, use the following command

```bash
$rm=$true; iwr https://tools.maximousblk.now.sh/BlockTheSpot.ps1 | iex
```

<br>
