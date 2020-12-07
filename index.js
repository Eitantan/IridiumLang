const fs = require("fs"), chalk = require("chalk"),readline = require('readline'),rl = readline.createInterface({input: process.stdin,output: process.stdout})
let str,vars,shell
function parse(string) {
  str = string.split(/\r?\n/)
	vars = {}
  str.forEach(line => {
    let match
    if (match = line.match(/var\s+(\w+)\s+=\s+"(.*)"\./)) {
			vars[match[1]] = match[2]
    } else if (match = line.match(/var\s+(\w+)\s+=\s+([\d\.]+)\./)) {
			vars[match[1]] = Number(match[2])
    } else if (match = line.match(/var\s+(\w+)\s+=\s+(\w+)\./)) {
			if (match[2] === false || match[2] === "false") {
				vars[match[1]] = false
			} else {
				vars[match[1]] = Boolean(match[2])
			}
    } else if (match = line.match(/print\s+=\s+"(.+)"\./)) {
			console.log(chalk.hex("#ff9900")(match[1]))
    } else if (match = line.match(/print\s+=\s+\$(\w+)\./)) {
			if (typeof vars[match[1]] === "string") {
				console.log(chalk.hex("#ffff55")(vars[match[1]]))
			} else if (typeof vars[match[1]] === "number") {
				console.log(chalk.hex("#37dbb2")(vars[match[1]]))
			} else if (typeof vars[match[1]] === "boolean") {
				console.log(chalk.hex("#ff00ff")(vars[match[1]]))
			}
    } else if (!/\/\/([\s\S]*)/.test(line)) {
      throw new SyntaxError("Syntax " + line + " is not valid.")
    }
  });
}

function rec(name,func) {
	let start = Date.now()
	func
	let end = Date.now() - start;
	return name + " took " + end + "ms."
}

console.log(chalk.blue(rec('Main Iridium File',parse(fs.readFileSync("main.iri", "utf-8")))));