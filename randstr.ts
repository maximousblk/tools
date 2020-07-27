import { parse } from "https://deno.land/std@0.62.0/flags/mod.ts";

let result: string = "";
let charset: string = "";

const sets: any = {
  numbers: "0123456789",
  alphalo: "abcdefghijklmnopqrstuvwxyz",
  alphaup: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  special: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};

const length: number = parse(Deno.args)._[0]
  ? Number(parse(Deno.args)._[0])
  : 16;

if (parse(Deno.args).n === true || parse(Deno.args).numbers === true) {
  charset += sets.numbers;
}

if (parse(Deno.args).l === true || parse(Deno.args).alphalo === true) {
  charset += sets.alphalo;
}

if (parse(Deno.args).u === true || parse(Deno.args).alphaup === true) {
  charset += sets.alphaup;
}

if (parse(Deno.args).s === true || parse(Deno.args).special === true) {
  charset += sets.special;
}

if (charset === "") {
  charset += sets.numbers + sets.alphalo + sets.alphaup;
}

for (var i = 0; i < length; i++) {
  result += charset.charAt(Math.floor(Math.random() * charset.length));
}

console.log(result);
