const imageStore: Map<number, Uint8Array> = new Map();
const uri = `https://larvalabs.com/public/images/cryptopunks/punk`;
const dir = './punks';
const range = 1000;

function convertInt(i: number): string {
    if (`${i}`.length < 1) return '0000';
    let value = '';
    // hacky stuff for numerical conversion
    for (let i = 0; i < 4 - `${i}`.length; i++) {
        value += '0';
    }
    console.log(`${i} -> ${value}${i}`);

    return `${value}${i}`;
}

function cb(stream: ReadableStreamReadResult<Uint8Array>, i: number): void {
    console.log(`${stream.value}`);
    imageStore.set(i, stream.value ? stream.value : new Uint8Array(353));
}

await Deno.mkdir('./punks', { mode: 0o700 }).catch(() => { console.log('Directory already exists' )});
console.log(`Starting scrape of gallery: ${uri}`);

for (let i = 0; i < range; i++) {
    const convertedNumeric: string = convertInt(i);
    const resp: Response = await fetch(uri + convertedNumeric + '.png');
    resp.body?.getReader().read().then((stream: ReadableStreamReadResult<Uint8Array>) => {
        cb(stream, i);
    });
}
for (const key of imageStore.keys()) {
    try
    {
        if (imageStore.get(key))
            Deno.writeFileSync(`./${dir}/punk-${key}.png`, imageStore.get(key) as Uint8Array);
    } catch (e) {
        console.log(e.message);
    }
}