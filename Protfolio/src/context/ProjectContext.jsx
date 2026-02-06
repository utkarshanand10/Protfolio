import React, { createContext, useContext, useState, useEffect } from "react";
import { DATA } from "../constants";

const ProjectContext = createContext();

export const useProjects = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/projects`,
            );
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error(
                    "Failed to fetch projects, falling back to static data",
                );
                setProjects(DATA.projects);
            }
        } catch (error) {
            console.error(
                "Error connecting to backend, falling back to static data",
                error,
            );
            setProjects(DATA.projects);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects }}>
            {children}
        </ProjectContext.Provider>
    );
};
