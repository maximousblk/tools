import { parse } from "https://deno.land/std@0.62.0/flags/mod.ts";

const args = parse(Deno.args);

if (!args._[0]) {
  console.error("\nGitHub username required\n");
  Deno.exit();
}

var user = args._[0];

var userRepos: string = "https://api.github.com/users/" + user + "/repos";

var thresh: number = args.t || 1;

var totalStars: number = 0;

try {
  var reposList = await fetch(userRepos).then((data) => {
    return data.json();
  });
} catch (err) {
  console.error(
    "Could not connect to GitHub API",
  );
}

var longest: number = 0,
  list: any[] = reposList
    .filter(function (repo: any) {
      totalStars += repo.stargazers_count;
      if (repo.stargazers_count >= thresh) {
        if (String(repo.stargazers_count).length > longest) {
          longest = String(repo.stargazers_count).length;
        }
        return true;
      }
    })
    .sort(function (a: any, b: any) {
      return b.stargazers_count - a.stargazers_count;
    });

console.log(`\nUser "${user}" has total ${totalStars} stars\n`);

console.log(
  list
    .map(function (repo: any) {
      return (
        repo.stargazers_count +
        new Array(
          longest - String(repo.stargazers_count).length + 3,
        ).join(" ") +
        "\u2605  " +
        repo.name
      );
    })
    .join("\n"),
);
