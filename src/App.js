import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/tasks";

function App() {
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [newTask, setNewTask] = useState(""); // Nueva tarea
  const [loading, setLoading] = useState(false); // Estado de carga
  const [isDarkMode, setIsDarkMode] = useState(false); // Modo oscuro
  const [sortOrder, setSortOrder] = useState("desc"); // Estado de orden (descendente o ascendente)

  // Obtener tareas del backend con useCallback
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const sortedTasks = response.data.sort((a, b) => {
        // Ordenar por fecha de creación (created_at)
        if (sortOrder === "desc") {
          return new Date(b.created_at) - new Date(a.created_at); // Más recientes primero
        } else {
          return new Date(a.created_at) - new Date(b.created_at); // Más viejas primero
        }
      });
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  // Agregar una tarea
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        await axios.post(API_URL, { description: newTask });
        setNewTask(""); // Limpiar el campo de texto después de agregar la tarea
        fetchTasks(); // Actualizar tareas
      } catch (error) {
        console.error("Error al agregar la tarea:", error);
      }
    }
  };

  // Eliminar una tarea
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks(); // Actualizar tareas
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  // Cambiar estado de completado
  const toggleTaskCompletion = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { completed: !completed }); // Cambiar el booleano
      fetchTasks(); // Actualizar tareas
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  }, [sortOrder, fetchTasks]);

  // Presionar 'Enter' para agregar tarea
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  // Alternar entre el modo oscuro y el modo claro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSortOrder = () => {
    // Cambiar entre ascendente y descendente
    setSortOrder(prevSortOrder => (prevSortOrder === "desc" ? "asc" : "desc"));
  };

  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#333",
    buttonColor: "#7d3c98",
    buttonHoverColor: "#5e2a76",
    inputBorderColor: "#555",
    inputFocusColor: "#7d3c98",
    taskCompletedColor: "#9b59b6",
    taskPendingColor: "#ddd",
    buttonDeleteColor: "#c0392b",
    backgroundGray: "#2e2e2e",
  };

  const lightModeStyles = {
    backgroundColor: "#f4f7fc",
    color: "#333",
    borderColor: "#ddd",
    buttonColor: "#7d3c98",
    buttonHoverColor: "#5e2a76",
    inputBorderColor: "#ddd",
    inputFocusColor: "#7d3c98",
    taskCompletedColor: "#7d3c98",
    taskPendingColor: "#555",
    buttonDeleteColor: "#e74c3c",
    backgroundGray: "#e0e0e0",
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: currentStyles.backgroundColor,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: currentStyles.backgroundGray,
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h1 style={{ textAlign: "center", color: currentStyles.color }}>
          To-Do List
        </h1>

        {/* Botón para alternar el modo oscuro */}
        <button
          onClick={toggleDarkMode}
          style={{
            backgroundColor: currentStyles.buttonColor,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
            width: "100%",
            transition: "background-color 0.3s ease",
          }}
        >
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>

        {/* Botón para cambiar el orden de las tareas */}
        <button
          onClick={toggleSortOrder}
          style={{
            backgroundColor: currentStyles.buttonColor,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
            width: "100%",
            transition: "background-color 0.3s ease",
          }}
        >
          Ordenar por {sortOrder === "desc" ? "más antiguos" : "más recientes"}
        </button>

        {/* Input para agregar tareas */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress} // Agregar tarea al presionar Enter
            style={{
              padding: "12px",
              width: "80%",
              borderRadius: "6px",
              border: `1px solid ${currentStyles.inputBorderColor}`,
              fontSize: "16px",
              marginRight: "10px",
              outline: "none",
              transition: "border 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.border = `1px solid ${currentStyles.inputFocusColor}`)}
            onBlur={(e) => (e.target.style.border = `1px solid ${currentStyles.inputBorderColor}`)}
          />
          <button
            onClick={addTask}
            style={{
              padding: "12px",
              backgroundColor: currentStyles.buttonColor,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = currentStyles.buttonHoverColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = currentStyles.buttonColor)}
          >
            <FaPlus style={{ marginRight: "8px" }} /> Agregar
          </button>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              zIndex: "1000",
            }}
          >
            <FaSpinner
              style={{
                fontSize: "24px",
                color: currentStyles.buttonColor,
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}

        {/* Lista de tareas */}
        <ul style={{ padding: "0", listStyleType: "none" }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: task.completed ? currentStyles.taskCompletedColor : currentStyles.taskPendingColor,
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.description}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  style={{
                    backgroundColor: task.completed ? currentStyles.taskCompletedColor : "#e67e22",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = task.completed
                      ? currentStyles.taskCompletedColor
                      : "#d35400")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = task.completed
                      ? currentStyles.taskCompletedColor
                      : "#e67e22")
                  }
                >
                  {task.completed ? "Completada" : "Pendiente"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    backgroundColor: currentStyles.buttonDeleteColor,
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = currentStyles.buttonDeleteColor)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
