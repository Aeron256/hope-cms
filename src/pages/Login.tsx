import { supabase } from "../lib/supabaseClient";

export default function Login () {
    const handleLogin = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };
    return  ( <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p>Please log in to access the admin dashboard.</p>
    </div>);
}