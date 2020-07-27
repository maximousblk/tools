try {
  var githubstatus = await fetch(
    "https://www.githubstatus.com/api/v2/summary.json",
  ).then((data) => {
    return data.json();
  });
} catch (err) {
  if (err.name == "PermissionDenied") {
    console.error(
      'Permission Denied: run again with the "--allow-net" flag',
    );
    Deno.close(1);
  } else {
    console.error(`Couldn't connect to GitHub status API.`);
    Deno.close(1);
  }
}

var longest: number = 0,
  components: any[] = githubstatus.components.filter(function (
    component: any,
  ) {
    if (
      String(component.name).length > longest &&
      component.showcase == true
    ) {
      longest = String(component.name).length;
    }
    return true;
  });

console.log(`\nGitHub: ${githubstatus.status.description}\n\nComponents:\n`);

for (var component of githubstatus.components) {
  if (component.showcase == true) {
    console.log(
      `\t${component.name}${
        new Array(
          longest - String(component.name).length + 3,
        ).join(" ")
      }[${component.status}]`,
    );
  }
}

console.log("\n");
