// Fungsi untuk menghandle autentikasi menggunakan Supabase
const supabase  = require("./server");

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });
  return { data, error };
}



async function signUp(email, password) {
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
    })
}


export { signIn, signUp };
