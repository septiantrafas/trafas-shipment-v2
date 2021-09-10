import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();

    setUser(session?.user ?? null);
    setLoading(false);
    if (user) {
      fetchUserRole(user.id);
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [user]);

  const fetchUserRole = async (id) => {
    try {
      let { data, error } = await supabase
        .from("employees")
        .select(`*`)
        .eq("id", id);
      if (data) setUserRole(data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
