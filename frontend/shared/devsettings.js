
let dusername = "";
let dpassword = "";

if((process.env.NODE_ENV === 'development')){

    let {username,password} = require ('../defaultaccount');
    dusername = username;
    dpassword = password;
}

export let devusername = dusername;
export let devpassword = dpassword;