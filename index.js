const fs = require("fs"), chalk = require("chalk"),readline = require('readline'),rl = readline.createInterface({input: process.stdin,output: process.stdout})
let str,vars,shell,classes,l
function parse(string) {
  str = string.split(/\r?\n/)
	vars = {}
	classes = {}
  str.forEach(line => {
    let match
		// String Variable
    if (match = line.match(/^var\s+(\w+)\s+=\s+"(.*)"\.$/)) {
			vars[match[1]] = match[2]
    } 
		// Number Variable
		else if (match = line.match(/^var\s+(\w+)\s+=\s+([\d\.]+)\.$/)) {
			vars[match[1]] = Number(match[2])
    } 
		// Boolean Variable
		else if (match = line.match(/^var\s+(\w+)\s+=\s+(\w+)\.$/)) {
			// False Boolean
			if (match[2] === false || match[2] === "false") {
				vars[match[1]] = false
			} 
			// True (or anything else) Boolean
			else {
				vars[match[1]] = Boolean(match[2])
			}
		// Print Strings
    } else if (match = line.match(/^print\s+=\s+"(.+)"\.$/)) {
			console.log(chalk.hex("#ff9900")(match[1]))
    } 
		// Print Variables
		else if (match = line.match(/^print\s+=\s+\$(\w+)\.$/)) {
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
		// Internal Commands: Print All Variables
    } else if (match = line.match(/^CMND:PRINT_VARS\.$/)) {
			console.log(vars)
		} 
		// Internal Commands: Print A Variable
		else if (match = line.match(/CMND:PRINT_VARS\[(\w+)\]\./)) {
			console.log('{ ' + chalk.hex('#bbb')(match[1]) + `: ${chalk.hex('#ff9900')("'")}` + chalk.hex('#ff9900')(vars[match[1]]) + `${chalk.hex('#ff9900')("'")} }`)
		} 
		// 
		else if (match = line.match(/CMND:RETURN_VARS\./)) {
			console.log(chalk.bgRed("DeprecatedError: The function " + chalk.bgBlack.redBright(line)) + chalk.bgRed(" is deprecated."))
		} 
		// Comments and syntax errors
		else if (!/\/\/([\s\S]*)/.test(line)) {
      console.log(chalk.bgRed("SyntaxError: " + chalk.hex('#ff0000').bgBlack(line) + chalk.bgRed(" is not valid.")))
    }
  });
}

// function rec(name,func) {
// 	let start = Date.now()
// 	func
// 	let end = Date.now() - start;
// 	return name + " took " + end + "ms."
// }

parse(fs.readFileSync("main.iri", "utf-8"));

// else if (match = line.match(/^\s{2,4}print\s+=\s+"(.+)"\.\s+in\s+(\w+)$/)) {
		// 	classes[match[2]][`line${l}`] = line
		// 	l++
    // } else if (match = line.match(/^\s{2,4}print\s+=\s+(\w+)\.\s+in\s+(\w+)$/)) {
		// 	classes[match[2]][`line${l}`] = line
		// 	l++
    // } else if (match = line.match(/^\s{2,4}print\s+=\s+([\d\.]+)\.\s+in\s+(\w+)$/)) {
		// 	classes[match[2]][`line${l}`] = line
		// 	l++
    // } else if (match = line.match(/^class\s+(\w+)\s*{$/)) {
		// 	classes[match[1]] = {}
    // }