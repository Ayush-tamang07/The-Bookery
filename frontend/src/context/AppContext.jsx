import { createContext, useEffect, useState } from "react";
import apiClient from "../api/axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [allBooks, setAllBooks] = useState([]);

//   const fetchBooks = async () => {
//     try {
//       const { data } = await apiClient.get("yourapi");

//       const sortedBooks = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       setAllBooks(sortedBooks);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

  const value = {
    allBooks,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};