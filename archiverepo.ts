import { parse } from "https://deno.land/std@0.62.0/flags/mod.ts";

const args = parse(Deno.args);

function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function help() {
    console.log(`
Usage: archivegh <user>/<repo> [options]

Options:
\t-h, --help           This help menu
\t-v, --verbose        Output the URL to archived page
\t-d <seconds>         Delay between each request in seconds (default: 2 sec)
\t-b <branch>          Branch name which you have to archive (default: master)

Examples:
\tarchivegh octocat/Hello-World -v -d 5`);
}

if (args.h || args.help) {
    help();
    Deno.exit(0);
}

if (args._[0] == undefined) {
    console.error("\nERROR: repository address is required");
    help();
    Deno.exit(1);
}

const repo: string = args._[0].toString();
const branch: string = args.b ? args.b : "master";

let tree: string[] = [];

try {
    var repoAPI = await fetch(`https://api.github.com/repos/${repo}`).then(
        (data) => {
            return data.json();
        }
    );
    if (repoAPI.message == "Not Found") {
        console.error(`\nERROR: Repository "${repo}" was not found!`);
        Deno.exit(1);
    }
    var branchAPI = await fetch(
        `https://api.github.com/repos/${repo}/branches`
    ).then((data) => {
        return data.json();
    });
    if (
        !branchAPI.filter(function (githubBranch: any) {
            return githubBranch.name == branch;
        })
    ) {
        console.error(`\nERROR: Branch "${branch}" was not found!`);
        Deno.exit(1);
    }
} catch (err) {
    if (err.name == "PermissionDenied") {
        console.error(
            '\nPermission Denied: run again with the "--allow-net" flag'
        );
        Deno.close(1);
    } else {
        console.error(`\nCouldn't connect to GitHub API.`);
        Deno.close(1);
    }
}

try {
    var treeAPI = await fetch(
        `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`
    ).then((data) => {
        return data.json();
    });
} catch (err) {
    if (err.name == "PermissionDenied") {
        console.error(
            '\nPermission Denied: run again with the "--allow-net" flag'
        );
        Deno.close(1);
    } else {
        console.error(`\nCouldn't connect to GitHub API.`);
        Deno.close(1);
    }
}

for (let content of treeAPI.tree) {
    tree.push(`${content.path}`);
}

console.log(`\nStarted archiving ${repo}@${branch}\n`);

for (let path of tree) {
    try {
        console.log(`Archiving: "${path}"`);
        await fetch(
            `https://web.archive.org/save/https://github.com/${repo}/blob/${branch}/${path}`
        )
            .then((response) => {
                if (response.ok) {
                    return response.headers.get("content-location");
                } else {
                    console.error(`\t> ERROR: ${response.statusText}`);
                }
            })
            .then((data) => {
                if (
                    data != undefined &&
                    (args.v == true || args.verbose == true)
                ) {
                    console.log(`\t> "https://web.archive.org${data}"`);
                }
            });
        if (args.d > 0) {
            await sleep(args.d * 1e3);
        } else {
            await sleep(2000);
        }
    } catch (err) {
        console.error(`\t> ${err.name} error`);
        if (err.name == "Http") {
            console.error(
                "\tHTTP error! Try increasing the delay between requests."
            );
        } else {
            console.error("Unknown error!");
        }
    }
}
