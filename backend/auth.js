// Fungsi untuk menghandle autentikasi menggunakan Supabase
const supabase  = require("./server");

async function signIn(email, password) {
  const { user, session, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });
  return { user, session, error };
}

async function signUp(email, password) {
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
    })
}

