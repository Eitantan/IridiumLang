const fs = require("fs"), chalk = require("chalk"),prompt = require("prompt-sync")()
let str,vars,shell,classes,l,stri,file,chars,lines,block,ifs,linematch
lines = 0
stri = ""
vars = {}, classes = {}, ifs = {}, linematch = ""

console.log("Iridium Shell v0.1 Alpha (JS)");
a = prompt('>>> ') 

// Shell loop
while(a !== "q") {
	if (a.indexOf("iri -i ") !== -1) {
		for (var i = 7; i < a.length; i++) {
			stri += a[i]
		}
		if (a.indexOf(".") === -1) {
			stri += ".iri"
		}
		console.log(chalk.bgBlue("Parsing file") + chalk.bgHex("#007766")(" ") + chalk.bgCyan(stri))
		file = stri
		parse(fs.readFileSync(file, "utf-8"));
	} else if (a.indexOf("iri -r") !== -1) {
		while(a !== "//q") {
			a = prompt("\t>>")
			parse(a)
		}
	} else {
		console.log(chalk.hex('#ff0402')("Could not find that command."))
	}
	a = prompt('>>> ')
}

function findtype(varname) {
	let types = Object.keys(vars), matchtype = ""
	for (var i = 0; i < types.length; i++) {
		if (!vars[types[i]][varname]) {
			continue;
		} else {
			matchtype = vars[types[i]][varname]
			break;
		}
	}
	return matchtype;
}

function parse(string) {
  str = string.split(/\r?\n/)
  str.forEach(line => {
		chars = line.length
		lines++
    let match
		linematch = line
		linematch.replace(match = /$(\w+)/g, findtype(match[1]))
		console.log(linematch)
		// String Variable
    if (match = linematch.match(/^var\s+(\w+)\s+=\s+"(.*)";?$/)) {
			vars[match[1]] = match[2]
    } 
		// Number Variable
		else if (match = linematch.match(/^var\s+(\w+)\s+=\s+([\d\.]+);?$/)) {
			vars[match[1]] = Number(match[2])
			console.log(vars)
    } 
		// Boolean Variable
		else if (match = linematch.match(/^var\s+(\w+)\s+=\s+(\w+);?$/)) {
			// False Boolean
			if (match[2] === false || match[2] === "false") {
				vars[match[1]] = false
			} 
			// True (or anything else) Boolean
			else {
				vars[match[1]] = Boolean(match[2])
			}
			console.log(vars)
    } 
		// Input
		else if (match = linematch.match(/^var\s+(\w+)\s+=\s+Console\.in\(['"]([\s\S]+)['"]\);?$/)) {
			vars[match[1]] = prompt(chalk.hex('#ff9900')(match[2]))
    }
		// Output
		else if (match = linematch.match(/^Console\.out\(['"]([\s\S]+)['"]\);?$/)) {
			process.stdout.write(chalk.hex("#ff9900")(String(match[1])))
    }
		// Newline
		else if (match = linematch.match(/^Console\.nl\(\);?$/)) {
			process.stdout.write('\n')
    }
		// Print Variables
		else if (match = linematch.match(/^Console\.out\(\$([\s\S]+)\);?$/)) {
			// If it exists
			if (match[1] in vars) {
				// If the variable is a string, show it in hex color #ffff55
				if (typeof vars[match[1]] === "string") {
					console.log(chalk.hex("#ffff55")(vars[match[1]]))
				} 
				// If the variable is a number, show it in hex color #37dbb2
				else if (typeof vars[match[1]] === "number") {
					console.log(chalk.hex("#37dbb2")(vars[match[1]]))
				} 
				// If the variable is a boolean, show it in hex #ff00ff
				else if (typeof vars[match[1]] === "boolean") {
					console.log(chalk.hex("#ff00ff")(vars[match[1]]))
				}
			// If the variable does not exist throw error
			} else {
				console.log(chalk.bgRed('NameError: Variable "' + chalk.bgBlack.hex('#ff0000')(match[1]) + '" not exist'))
			}
    }
		// declaration of an if statement
		else if (match = linematch.match(/^if\s+([\s\S]+)\s*([\S]+)\s*{/)) {
			ifs[match[2]] = Boolean(match[1])
			console.log(match[1])
			console.log(ifs[match[2]])
		}
		// Internal Commands
		else if (match = linematch.match(/^CMND:PRINT_VARS;?$/)) {
			console.log(vars)
		} 
		// Internal Commands: Print A Variable
		else if (match = linematch.match(/CMND:PRINT_VARS\[(\w+)\];?/)) {
			console.log('{ ' + chalk.hex('#bbb')(match[1]) + `: ${chalk.hex('#ff9900')("'")}` + chalk.hex('#ff9900')(vars[match[1]]) + `${chalk.hex('#ff9900')("'")} }`)
		} 
		// 
		else if (match = linematch.match(/CMND:RETURN_VARS;?/)) {
			console.log(chalk.bgRed("DeprecatedError: The function " + chalk.bgBlack.redBright(line)) + chalk.bgRed(" is deprecated."))
		}
		// Comments and syntax errors
		else if (!/\/\/([\s\S]*)|\s/.test(line)) {
      console.log(chalk.bgRed("SyntaxError: " + chalk.hex('#ff0000').bgBlack(line) + chalk.bgRed(" is not valid.")))
    }
  });
	file = ""
	stri = ""
}

// function rec(name,func) {
// 	let start = Date.now()
// 	func
// 	let end = Date.now() - start;
// 	return name + " took " + end + "ms."
// }

console.log(chalk.hex("#aaf")("________________________________________________________"))
console.log(chalk.bgHex('#ff0201').hex('#00f')('Variables at end of process:'))
console.log(vars)