const Reply = require("../handlers/replyHandler");
var prefix = process.env.PREFIX

const elements = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", 
    "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", 
    "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", 
    "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", 	"Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", 
    "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", 
    "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"]

const subscript = ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"]

var doSubscript = true


var commandNames =  ["help",    "element with",    "subscript"]
var commands =      [help,      getElementsWith,   toggleSubscript]

function isalpha(text){
    return text.length === 1 && text.match(/[a-z]/i);
}

function isInTable(text){
    for ([i, e] of elements.entries()){
        if (text == e.toLowerCase()){
            return elements[i]
        }
    }
    return false

}

function splitInWords(text){
   var output = [""]
    while (text != ""){
        //console.log(text)
        if (isalpha(text[0])){
            //console.log("true")
            output[output.length-1] += text[0]
            text = text.replace(text[0],"",1)
        }
        else{
            output.push(text[0])
            text = text.replace(text[0],"",1)
            output.push("")
        }
    }

    output = output.filter(a => a !== "");

    return output

}

function splitInCombinations(word){
    var output = []
    for (let i = 0; i < word.length; i++){
        l = word[i]
        //console.log(i,l)
        output.push(l)
        if (i+1 < word.length){
            output.push(l+word[i+1])
        }
        
    };
    return output

}

function checkIfPossible(combs){
    try{
        if (combs[0] == false && combs[1] == false){
            return false
        }
        if (combs[-1] == false && combs[-2] == false){
            return false
        }
    }
    catch{}
    
    var a = 0
    combs.forEach(c => {
        if (c == false){
            a += 1
        }
        else{
             a = 0
            }
        if (a == 4){
            return false
        }
    });
    return true

}

function checkComb(combs,i){
    var length = combs.length
    if ( !(i < length) ){
        return false
    }
    
    if ( combs[i] == false){
        return false
    }
    
    return !checkComb(combs,i+2)

}

function makeCombinationOfElements(combs){
    if( !checkIfPossible(combs)){
        return false
    }

    var running = true
    var length = combs.length
    var index = 1
    var output = ""

    while(running){
        if(checkComb(combs,index)){
            //console.log(index,combs,combs[index],"if")
            output += combs[index]
            index += 4
        }
        else if (index < length && combs[index] != false && combs[index-1] == false){
            //console.log(index,combs,combs[index],"elif")
            output += combs[index]
            index += 4
        }
        else{
            //console.log(index-1,combs,combs[index-1],"else")
            if (combs[index-1] == false){
                return false
            }

            output += combs[index-1]
            index += 2

        }
        if ( !(index <= length) ){
            running = false
        }

    }
    return output
}

function float2int (value) {
    return value | 0;
}

function calcSubscript(number){
    var tempoutput = ""
    var output = ""
    while (number != 0){
        var n = number % 10
        tempoutput += subscript[n]
        number = float2int(number/10)
    }
    
    for (i = 0; i < tempoutput.length;i++){
        output += tempoutput[tempoutput.length - i -1]
    }
    return output
}

function subscriptify(input){
    var elements2 = []
    while (input != ""){
        if (input[0] == input[0].toUpperCase()){
            elements2.push(input[0])
            input = input.replace(input[0],"",1)
        }

        if (input == ""){
            break
        }

        if (input[0] == input[0].toLowerCase()){
            elements2[elements2.length-1] += input[0]
            input = input.replace(input[0],"",1)
        } 
    }

    elements2.push("!")
    
    var lastE = ""
    var count = 1
    var output = ""
    
    elements2.forEach(e => {
        if (e == lastE){
            count += 1
        }
        else{
            if (count > 1){
                output += calcSubscript(count)
                }
            output += e
            lastE = e
            count = 1
        }
    });

    output = output.replace("!","",1)
    return output
}

function hasAlphabetElement(text){
    var r = false
    for (let i = 0; i < text.length; i++) {
        c = text[i]
        if (isalpha(c)){
            r = true
        }
    };
    return r
}




function periodify(input){
    if (!hasAlphabetElement(input))
        return false

    var words = splitInWords(input)
    var noOutput = false

    var output = "Your message can be written with elements of the PSE:\n"
    words.forEach(w => {
        //console.log(w)
        if (isalpha(w[0])){
            var combs = splitInCombinations(w)
            var combsInTable = []
            combs.forEach(c =>{
                combsInTable.push(isInTable(c))
            })

            x = makeCombinationOfElements(combsInTable)

            if(x == false){
                noOutput = true
            }

            if (doSubscript){
                x = subscriptify(x)
            }

            output += x
        }
        else{
            output += w
        }
        
    });
    if (noOutput){
        return false
    }
    else{
        return output
    }
}

//commands ----

function help(input){
    var output = `These are the commands:\n
                    -!element with <letter>\n
                    -!subscript <true/false>
                    `
    return output
}

function getElementsWith(input){
    var letter = input[0]
    var output = "These elements contain the letter \"" + letter + "\":\n"

    var noneFound = true

    for ([i, e] of elements.entries()){
        if (e.toLowerCase().indexOf(letter) != -1){
            output = output + ", " + e
            noneFound = false
        }
    }
    if (noneFound){
        output = output + "No elements found :("
    }
    output = output.replace(", ","",1)
    return output
    

}

function toggleSubscript(input){
    var activate = ["true","1","enable","on"]
    var deactivate = ["false","0","disable","off"]

    if (activate.indexOf(input) != -1){
        doSubscript = true
        return "Subscript activated"
    }
    if (deactivate.indexOf(input) != -1){
        doSubscript = false
        return "Subscript deactivated"
    }


}
//----
function main(input){
    var iscommand = false

    if (input.startsWith(prefix)){
        for ([i, name] of commandNames.entries()){
            if (input.startsWith(prefix + name)){
                var l = name.length

                iscommand = true
                
                command = commands[i]
                input = input.replace(prefix + name + " ","",1)
                return command(input)
            }
        }
    }
    if (!iscommand){
        return periodify(input)
    }
}



function checkPSEMessages(message){
    console.log(message.content.length)
    //if(message.content.length < 2) return
    console.log(message.content + "messagecontent")

    var periodiFied = main(message.content.toLowerCase())

    console.log(periodiFied + "perdiodified")
    if(!periodiFied) return

    Reply.send(message, periodiFied)

}

module.exports = {
	checkPSEMessages,
};

        

