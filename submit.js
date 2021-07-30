let error = document.querySelector("#error-list")
document.querySelector("#submit").addEventListener("click", validate)

function validate(){
        document.querySelector("#success").classList.add("invisible")
        document.querySelector("#error").classList.add("invisible")
        while(error.firstChild){
                error.removeChild(error.firstChild)
        }
        error_messages = []
        let pokemon = document.querySelector("#pokemon");
        let level = document.querySelector("#level")

        let stat_totals = document.querySelectorAll(".stat-total")
        let evs = document.querySelectorAll(".ev")
        
        if(pokemon.value === null || !pokemon.value.length){
                error_messages.push("A pokemon name is required")
        }

        if(level.value === null){
                error_messages.push("Level needs to be filled in")
        }

        if(level.value < 1 || level.value > 100)
        {
                error_messages.push("Level needs to be between 1 and 100")
        }

        stat_totals.forEach(element => {
                let stat = element.getAttribute("aria-label")
                if(element.value === null)
                {
                        error_messages.push(`${stat} is required`)
                }
                if(element.value < 1 || element.value > 999 ){
                        error_messages.push(`${stat} value needs to be between 1 and 999`)
                }
        });

        evs.forEach(element => {
                let stat = element.getAttribute("aria-label")
 
                if(element.value < 0 || element.value > 252 ){
                        error_messages.push(`${stat} value needs to be between 1 and 252`)
                }
        })

        let sum = 0
        for(let i = 0; i<evs.length; i++){
                let node = evs[i];
                sum += parseInt(node.value)
        }

        if(sum > 510){
                error_messages.push("EV total can not excede 510 " + `Current total: ${sum}`)
        }

        if(error_messages.length){
                document.querySelector("#error").classList.remove("invisible")
                for(let i = 0; i < error_messages.length; i++){
                        let li = document.createElement("li")
                        let text = document.createTextNode(error_messages[i])
                        li.appendChild(text)
                        error.appendChild(li)
                }
        } else {
                document.querySelector("#error").classList.add("invisible")
                submit()
        }

}


function map_stat_name(stat){
        switch(stat){
                case "HP":
                        return "hp";
                case "Attack":
                        return "atk";
                case "Defense":
                        return "def";
                case "Sp. Atk":
                        return "sp_atk";
                case "Sp. Def":
                        return "sp_def";
                case "Speed":
                        return "spe";
        }
}


function unmap_stat_name(stat){
        switch(stat){
                case "hp":
                        return "HP";
                case "attack":
                        return "Attack";
                case "defense":
                        return "Defense";
                case "sp_attack":
                        return "Sp. Atk";
                case "sp_defense":
                        return "Sp. Def";
                case "speed":
                        return "Speed";
        }
}

async function postData(url, data){
        const response = await fetch(url, {
                method: 'POST', 
                mode: 'cors', 
                cache: 'no-cache', 
                credentials: 'same-origin', 
                headers: {
                  'Content-Type': 'application/json'
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer', 
                body: JSON.stringify(data) 
              });
        return response.json();
}

function submit()
{       
        let name = document.querySelector("#pokemon").value
        let nature = document.querySelector("#nature").value
        let level = document.querySelector("#level").value

        let stat_totals = document.querySelectorAll(".stat-total")
        let stat_values = {}
        for(let i = 0; i < stat_totals.length; i++){
                let element = stat_totals[i]
                let stat = element.getAttribute("aria-label")
                let mapped_name = map_stat_name(stat)
                let value = element.value
                stat_values[mapped_name] = parseInt(value)
               
        }

        let ev_inputs = document.querySelectorAll(".ev")
        let evs = {}
        for(let i = 0; i < ev_inputs.length; i++){
                let element = ev_inputs[i]
                let stat = element.getAttribute("aria-label")
                let mapped_name = map_stat_name(stat)
                let value = element.value
                evs[mapped_name] = parseInt(value)
               
        }
        

        let obj = {name: name,
                   nature: nature,
                   level: parseInt(level),
                   stat_values: stat_values,
                   evs: evs}
        
        

        const reqURL = "https://jwc-pokemon-utils.herokuapp.com/calcIV"
        //const reqURL = "http://127.0.0.1:5000/calcIV"
        postData(reqURL, obj)
        .then(data => success(data))
        


}

function success(data){

        let success = document.querySelector("#success")
        let iv_list = document.querySelector("#iv-list")
        
        while(iv_list.firstChild){
                iv_list.removeChild(iv_list.firstChild)
        }
        for(let key in data){
                let li = document.createElement("li")
                let text = `${unmap_stat_name(key)}: ${data[key]}`
                li.appendChild(document.createTextNode(text))
                iv_list.appendChild(li)
        }
        success.classList.remove("invisible")
}





