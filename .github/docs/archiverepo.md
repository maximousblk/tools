## archiverepo

A Deno script to save webpages of a GitHub repository to [Internet Archive](https://archive.org/)

### Quick Start

```bash
deno run -A https://tools.maximousblk.now.sh/archiverepo.ts <username>/<reponame>
```

### Install

You can install `archiverepo` using the `deno install` command

```bash
deno install -A https://tools.maximousblk.now.sh/archiverepo.ts
```

### Usage

After installing, you can archive a GitHub repository using `archiverepo` command

```bash
archiverepo <username>/<reponame> [options]
```

**Options:**

- `-v, --verbose` - Output the URL to archived page
- `-d <seconds>` - Delay between each request in seconds (default: 2 sec)
- `-b <branch>` - Branch name which you have to archive (default: master)

<br>
