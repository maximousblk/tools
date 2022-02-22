## Tools

Simple useful tools and scripts for my personal use. You're free to use them if you want.

This is the list of the tools and Quick Start actions

### BlockTheSpot

A PowerShell script to install [BlockTheSpot](https://github.com/mrpond/BlockTheSpot/)

```bash
iwr https://tools.maximousblk.now.sh/BlockTheSpot.ps1 | iex
```

[docs](/BlockTheSpot)

### ipfsadd

one liner to upload files to [IPFS](https://ipfs.io/)

```bash
curl -fsSL https://tools.maximousblk.now.sh/ipfsadd.sh | bash -s -- [...FILES]
```

[docs](/ipfsadd)

### randstr

A Deno script to create random strings

```bash
deno run https://tools.maximousblk.now.sh/randstr.ts
```

[docs](/randstr)

### countingstars

A Deno script to get the total number of stars a GitHub user has

```bash
deno run -A https://tools.maximousblk.now.sh/countingstars.ts <username>
```

[docs](/countingstars)

### archiverepo

A Deno script to save webpages of a GitHub repository to [Internet Archive](https://archive.org/)

```bash
deno run -A https://tools.maximousblk.now.sh/archiverepo.ts <username>/<reponame>
```

[docs](/archiverepo)

### githubstatus

A Deno script to check current status of GitHub.

```bash
deno run -A https://tools.maximousblk.now.sh/githubstatus.ts
```

[docs](/githubstatus)

## License

All the scripts in this repo are distributed under [The MIT License](LICENSE)

So you can do whatever you want and I don't get in trouble if you mess up.
