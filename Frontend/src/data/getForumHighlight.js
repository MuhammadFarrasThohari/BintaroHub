import { supabase } from "../components/Auth/SupabaseClient"

async function getAllForum() {
    try {
        const { data, error } = await supabase
            .from('Artikel')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching forum data:", error);
        throw error;
    }
}

export default getAllForum;