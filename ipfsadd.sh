imgupload() {
  curl 'https://ipfs.infura.io:5001/api/v0/add?pin=true&cid-version=1' \
    -F "path=@$1" --compressed --silent |
    jq -r '.Hash'
}

for file in "$@"; do
  echo "https://gateway.ipfs.io/ipfs/$(imgupload $file)"
done
