const Reply = require("../handlers/replyHandler");

const elements = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", 
    "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", 
    "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", 
    "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", 	"Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", 
    "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", 
    "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"]

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

function periodify(input){

    var words = splitInWords(input)
    var noOutput = false

    var output = ""
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


function checkPSEMessages(message){
    console.log(message.content.length)
    //if(message.content.length < 2) return
    console.log(message.content + "messagecontent")
    var periodiFied = periodify(message.content.toLowerCase())
    console.log(periodiFied + "perdiodified")
    if(!periodiFied) return
    var answer = `Your message can be written with elements of the PSE: \n${periodiFied}`
    Reply.send(message, answer)

}

module.exports = {
	checkPSEMessages,
};

        

